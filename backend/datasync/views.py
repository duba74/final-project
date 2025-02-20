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

from .models import TrainingEvent
from .serializers import LoginSerializer, TrainingEventSerializer
from .utils import convert_to_tz_aware_datetime, get_min_time, get_syncable_fields

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

            if response.status_code == 200:
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


class MainSync(APIView):
    def get(self, request, *args, **kwargs):
        headers = {"Authorization": request.headers.get("Authorization")}

        # This serves as the user authentication
        result = get_data(headers, "assignments")
        if isinstance(result, Response):
            return result  # If get_data returns a Response, it is an error, like invalid token

        assignments = result

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
                "training_event": self.get_changes(  # TO DO - Make a unique function for just getting the events matching assignments
                    TrainingEvent,
                    TrainingEventSerializer,
                    last_pulled_at,
                    assignments,
                ),
            },
            "timestamp": self.get_unique_monotonic_timestamp(),
        }

        return Response(response_data, status=status.HTTP_200_OK)

    # WatermelonDB docs say that the push operation should be atomic, in a transaction
    @transaction.atomic
    def post(self, request, *args, **kwargs):
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
            self.apply_changes(
                TrainingEvent, changes.get("training_event", {}), last_pulled_at
            )
        except Exception as e:
            transaction.set_rollback(True)

            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"status": "success"}, status=status.HTTP_200_OK)

    def get_changes(self, model, serializer, last_pulled_at, assignments):
        queryset = model.objects.all()

        created = queryset.filter(
            created_at__gt=last_pulled_at,
            # server_created_at__gt=last_pulled_at,
            server_deleted_at__isnull=True,
        )

        updated = queryset.filter(
            updated_at__gt=last_pulled_at,
            created_at__lte=last_pulled_at,
            # server_created_at__lte=last_pulled_at,
            server_deleted_at__isnull=True,
        )

        deleted = queryset.filter(server_deleted_at__gt=last_pulled_at).values_list(
            "id", flat=True
        )

        changes = {
            "created": serializer(created, many=True).data,
            "updated": serializer(updated, many=True).data,
            "deleted": list(deleted),
        }
        print("Changes sent to device:\n", changes)

        return changes

    # WatermelonDB recommends using a procedure to verify that the timestamp sent back to the client is "unique" and "monotonic", meaning it should be greater than any updated_at field in any of the tables, so this function makes sure of that
    def get_unique_monotonic_timestamp(self):
        max_updated_at = max(
            TrainingEvent.objects.all().aggregate(max_updated_at=Max("updated_at"))[
                "max_updated_at"
            ]
            or get_min_time(),
        )

        current_timestamp = timezone.now()

        if max_updated_at >= current_timestamp:
            current_timestamp = max_updated_at + timezone.timedelta(milliseconds=1)

        return int(current_timestamp.timestamp() * 1000)

    def apply_changes(self, model, changes, last_pulled_at):
        for record in changes.get("created", []):
            record = get_syncable_fields(record, model)
            record_id = record["id"]
            defaults = record.copy()

            # server_created_at = timezone.now()
            # defaults["server_created_at"] = server_created_at
            # defaults["server_updated_at"] = server_created_at

            model.objects.update_or_create(id=record_id, defaults=defaults)

        for record in changes.get("updated", []):
            record = get_syncable_fields(record, model)
            record_id = record["id"]
            obj = model.objects.filter(id=record_id).first()

            if obj:
                if obj.server_deleted_at:
                    # This means the object was deleted between last pull and this push, the client should restart the sync to update their local DB first
                    raise Exception(
                        f"Conflict: Record with ID {record_id} was deleted. Restart the sync."
                    )

                if obj.updated_at > last_pulled_at:
                    # This means the object was modified between last pull and this push, client should restart sync to update local DB first
                    raise Exception(
                        f"Conflict: Record with ID {record_id} has been modified since last sync. Restart the sync."
                    )

                for k, v in record.items():
                    setattr(obj, k, v)

                obj.server_updated_at = timezone.now()
                obj.save()
            else:
                defaults = record.copy()

                # server_created_at = timezone.now()
                # defaults["server_created_at"] = server_created_at
                # defaults["server_updated_at"] = server_created_at

                model.objects.create(**defaults)

        for record_id in changes.get("deleted", []):
            obj = model.objects.filter(id=record_id).first()

            if obj:
                obj.server_deleted_at = timezone.now()
                obj.save()


class SecondarySync(APIView):
    def get(self, request, *args, **kwargs):
        headers = {"Authorization": request.headers.get("Authorization")}
        last_pulled_at = request.query_params.get("lastPulledAt")

        if last_pulled_at == "null":
            last_pulled_at = int(timezone.now().timestamp() * 1000)

        try:
            villages = get_data(headers, "villages")
            if isinstance(villages, Response):
                return villages

            clients = get_data(headers, "clients")
            if isinstance(clients, Response):
                return clients

            training_modules = get_data(headers, "trainingmodules")
            if isinstance(training_modules, Response):
                return training_modules

            staff = get_data(headers, "staff")
            if isinstance(staff, Response):
                return staff

            assignments = get_data(headers, "assignments")
            if isinstance(assignments, Response):
                return assignments

            response_data = {
                "changes": {
                    "village": {
                        "created": [],
                        "updated": villages,
                        # "updated": self.get_data(headers, "villages"),
                        "deleted": [],
                    },
                    "client": {
                        "created": [],
                        "updated": clients,
                        # "updated": self.get_data(headers, "clients"),
                        "deleted": [],
                    },
                    "training_module": {
                        "created": [],
                        "updated": training_modules,
                        # "updated": self.get_data(headers, "trainingmodules"),
                        "deleted": [],
                    },
                    "staff": {
                        "created": [],
                        "updated": staff,
                        # "updated": self.get_data(headers, "staff"),
                        "deleted": [],
                    },
                    "assignment": {
                        "created": [],
                        "updated": assignments,
                        # "updated": self.get_data(headers, "assignments"),
                        "deleted": [],
                    },
                },
                "timestamp": int(
                    last_pulled_at
                ),  # Just return the time that came with request
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            logging.error(f"Error in SecondarySync view: {e}")
            return Response(
                {"status": "error", "message": "Some unexpected error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
