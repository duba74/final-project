import requests
import logging
import json
import os
from dotenv import load_dotenv

from django.utils import timezone
from django.db import transaction
from django.db.models import Max
from rest_framework.authtoken.models import Token

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from integrations.coreservices.user_authentication import (
    authenticate_user,
    validate_token,
)
from integrations.coreservices.fetch_data import get_data

from datasync.models import TrainingEvent
from datasync.serializers import LoginSerializer
from datasync.utils import convert_to_tz_aware_datetime, get_min_time
from datasync.get_data import (
    get_unique_monotonic_timestamp,
    get_changed_training_events,
    get_changed_participants,
    convert_assignments_to_datetime,
)
from datasync.update_data import apply_training_event_changes, apply_participant_changes


load_dotenv()


class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response({}, status=status.HTTP_400_BAD_REQUEST)

        username = serializer.data["username"]
        password = serializer.data["password"]

        try:
            response = authenticate_user(username, password)

            if response.status_code == status.HTTP_200_OK:
                data = response.json()
                return Response(
                    {
                        "status": data["status"],
                        "token": data["token"],
                        "user": data["user"],
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(response.json(), status=response.status_code)
        except requests.exceptions.ConnectionError:
            return Response(
                {"status": "error", "message": "Network error"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except requests.exceptions.Timeout:
            return Response(
                {"status": "error", "message": "Timeout error"},
                status=status.HTTP_504_GATEWAY_TIMEOUT,
            )
        except requests.exceptions.RequestException:
            return Response(
                {"status": "error", "message": "Server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class Sync(APIView):
    def get(self, request, *args, **kwargs):
        headers = {"Authorization": request.headers.get("Authorization")}

        # This serves as the user authentication; core services will validate the token
        response = get_data(headers, "assignments")
        if not response.status_code == status.HTTP_200_OK:
            return response
        else:
            assignments = response.data["data"]

        assignments = convert_assignments_to_datetime(assignments)
        # print(assignments)

        last_pulled_at = request.query_params.get("lastPulledAt")

        print(last_pulled_at)

        # WatermelonDB lastPulledAt is null if it's the first ever pull, in which case set to earliest possible time
        if last_pulled_at == "null":
            last_pulled_at = get_min_time()
        else:
            last_pulled_at = convert_to_tz_aware_datetime(last_pulled_at)

        print("Device is pulling...\nLast pulled at:", last_pulled_at)

        response_data = {
            "changes": {
                "training_event": get_changed_training_events(
                    last_pulled_at, assignments
                ),
                "participant": get_changed_participants(last_pulled_at, assignments),
            },
            "timestamp": get_unique_monotonic_timestamp(),
        }

        return Response(response_data, status=status.HTTP_200_OK)

    # WatermelonDB docs say that the push operation should be atomic, in a transaction
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        headers = {"Authorization": request.headers.get("Authorization")}

        # This serves as the user authentication; core services will validate the token
        response = validate_token(headers)
        if not response.status_code == status.HTTP_200_OK:
            return response

        last_pulled_at = request.query_params.get("lastPulledAt")
        changes = request.data.get("changes", {})

        if last_pulled_at:
            last_pulled_at = convert_to_tz_aware_datetime(last_pulled_at)
        else:
            return Response(
                {"error": "No timestamp included."}, status=status.HTTP_400_BAD_REQUEST
            )

        print("Device is pushing...\nChanges sent from device:\n", changes)

        try:
            apply_training_event_changes(
                last_pulled_at, changes.get("training_event", {})
            )
            apply_participant_changes(last_pulled_at, changes.get("participant", {}))
        except Exception as e:
            transaction.set_rollback(True)

            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"status": "success"}, status=status.HTTP_200_OK)


class SecondaryDataPull(APIView):
    def get(self, request, *args, **kwargs):
        headers = {"Authorization": request.headers.get("Authorization")}
        last_pulled_at = request.query_params.get("lastPulledAt")

        if last_pulled_at == "null":
            last_pulled_at = int(timezone.now().timestamp() * 1000)

        try:
            response = get_data(headers, "villages")
            if not response.status_code == status.HTTP_200_OK:
                return response
            else:
                villages = response.data["data"]

            response = get_data(headers, "clients")
            if not response.status_code == status.HTTP_200_OK:
                return response
            else:
                clients = response.data["data"]

            response = get_data(headers, "trainingmodules")
            if not response.status_code == status.HTTP_200_OK:
                return response
            else:
                training_modules = response.data["data"]

            response = get_data(headers, "staff")
            if not response.status_code == status.HTTP_200_OK:
                return response
            else:
                staff = response.data["data"]

            response = get_data(headers, "assignments")
            if not response.status_code == status.HTTP_200_OK:
                return response
            else:
                assignments = response.data["data"]

            response_data = {
                "villages": villages,
                "clients": clients,
                "training_modules": training_modules,
                "staff": staff,
                "assignments": assignments,
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            logging.error(f"Error in SecondaryDataPull view: {e}")
            return Response(
                {"status": "error", "message": "Some unexpected error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
