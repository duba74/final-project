from django.utils import timezone
from django.db import transaction
from django.db.models import Max

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import TrainingModule, TrainingEvent
from .serializers import (
    TrainingModuleSerializer,
    TrainingEventSerializer,
)
from .utils import convert_to_tz_aware_datetime, get_min_time, get_syncable_fields


class Sync(APIView):
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
                "training_module": self.get_changes(
                    TrainingModule, TrainingModuleSerializer, last_pulled_at
                ),
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
                TrainingModule, changes.get("training_module", {}), last_pulled_at
            )
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
            TrainingModule.objects.all().aggregate(max_updated_at=Max("updated_at"))[
                "max_updated_at"
            ]
            or get_min_time(),  # In case there's no records
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
