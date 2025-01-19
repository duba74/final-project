import requests
import logging

from django.utils import timezone
from django.db import transaction
from django.db.models import Max
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import TrainingEvent
from .serializers import LoginSerializer, TrainingEventSerializer
from .utils import convert_to_tz_aware_datetime, get_min_time, get_syncable_fields


class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            print(serializer.data)
            username = serializer.data["username"]
            password = serializer.data["password"]

            # TODO: Change this authentication to call the coreservices API (also make that API), moving the token stuff over there too to be handled by coreservices, which responds if the user is authenticated or not
            user = authenticate(request, username=username, password=password)

            if user:
                token, created = Token.objects.get_or_create(user=user)

                return Response(
                    {
                        "token": token.key,
                        "name": f"{user.first_name} {user.last_name}",
                        "email": user.email,
                        "role": user.profile.role.id,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MainSync(APIView):
    def get(self, request, *args, **kwargs):
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
                "training_event": self.get_changes(
                    TrainingEvent, TrainingEventSerializer, last_pulled_at
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
            raise Exception("No timestamp inclded.")

        print("Device is pushing...\nChanges sent from device:\n", changes)

        try:
            self.apply_changes(
                TrainingEvent, changes.get("training_event", {}), last_pulled_at
            )
        except Exception as e:
            transaction.set_rollback(True)

            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"status": "success"}, status=status.HTTP_200_OK)

    def get_changes(self, model, serializer, last_pulled_at):
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
        last_pulled_at = request.query_params.get("lastPulledAt")

        if last_pulled_at == "null":
            last_pulled_at = int(timezone.now().timestamp() * 1000)

        # Call the core services API to get
        # Assignments
        # Villages (based on assignments)
        # Clients (based on assignments)

        # Return the stuff received from CS API
        response_data = {
            "changes": {
                "village": {
                    "created": [],
                    "updated": self.get_data("villages"),  # All the data in this one,
                    "deleted": [],
                }
            },
            "timestamp": last_pulled_at,  # Just return the time that came with request
        }

        return Response(response_data, status=status.HTTP_200_OK)

    def get_data(self, data="villages"):
        url = f"http://127.0.0.1:8000/coreservices/api/{data}/"

        try:
            r = requests.get(url, timeout=10)
            r.raise_for_status()

            return r.json()

        except requests.exceptions.HTTPError as e:
            logging.error(f"HTTP error: {e}")
        except requests.exceptions.ConnectionError as e:
            logging.error(f"Connection error: {e}")
        except requests.exceptions.Timeout as e:
            logging.error(f"Timeout error: {e}")
        except requests.exceptions.RequestException as e:
            logging.error(f"Error: {e}")

        return None
