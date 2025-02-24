from django.utils import timezone

from datasync.models import TrainingEvent, Participant
from datasync.utils import get_syncable_fields


def apply_training_event_changes(last_pulled_at, changes):
    for record in changes.get("created", []):
        record = get_syncable_fields(record, TrainingEvent)
        record_id = record["id"]
        data = record.copy()

        if data.get("is_canceled") is None:
            data["is_canceled"] = False

        print(data)
        # server_created_at = timezone.now()
        # defaults["server_created_at"] = server_created_at
        # defaults["server_updated_at"] = server_created_at

        obj, created = TrainingEvent.objects.update_or_create(
            id=record_id, defaults=data
        )
        if created:
            print("Created", obj)
        else:
            print("Updated", obj)

    for record in changes.get("updated", []):
        record = get_syncable_fields(record, TrainingEvent)
        record_id = record["id"]
        obj = TrainingEvent.objects.filter(id=record_id).first()

        if obj:
            if obj.server_deleted_at:
                # This means the object was deleted between last pull and this push, the client should restart the sync to update their local DB first
                raise Exception(
                    f"Conflict: TrainingEvent with ID {record_id} was deleted. Restart the sync."
                )

            if obj.updated_at > last_pulled_at:
                # This means the object was modified between last pull and this push, client should restart sync to update local DB first
                raise Exception(
                    f"Conflict: TrainingEvent with ID {record_id} has been modified since last sync. Restart the sync."
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

            TrainingEvent.objects.create(**defaults)

    for record_id in changes.get("deleted", []):
        obj = TrainingEvent.objects.filter(id=record_id).first()

        if obj:
            obj.server_deleted_at = timezone.now()
            obj.save()


def apply_participant_changes(last_pulled_at, changes):
    for record in changes.get("created", []):
        try:
            training_event = TrainingEvent.objects.get(id=record["training_event"])
        except TrainingEvent.DoesNotExist:
            raise Exception(
                f"Error: TrainingEvent with ID {record["training_event"]} for Participant with ID {record["id"]} does not yet exist"
            )
        record = get_syncable_fields(record, Participant)
        record_id = record["id"]
        defaults = record.copy()

        # server_created_at = timezone.now()
        # defaults["server_created_at"] = server_created_at
        # defaults["server_updated_at"] = server_created_at

        Participant.objects.update_or_create(
            id=record_id, training_event=training_event, defaults=defaults
        )

    for record in changes.get("updated", []):
        try:
            training_event = TrainingEvent.objects.get(id=record["training_event"])
        except TrainingEvent.DoesNotExist:
            raise Exception(
                f"Error: TrainingEvent with ID {record["training_event"]} for Participant with ID {record["id"]} does not yet exist"
            )
        record = get_syncable_fields(record, TrainingEvent)
        record_id = record["id"]
        obj = Participant.objects.filter(id=record_id).first()

        if obj:
            if obj.server_deleted_at:
                # This means the object was deleted between last pull and this push, the client should restart the sync to update their local DB first
                raise Exception(
                    f"Conflict: Participant with ID {record_id} was deleted. Restart the sync."
                )

            if obj.updated_at > last_pulled_at:
                # This means the object was modified between last pull and this push, client should restart sync to update local DB first
                raise Exception(
                    f"Conflict: Participant with ID {record_id} has been modified since last sync. Restart the sync."
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

            Participant.objects.update_or_create(
                id=record_id, training_event=training_event, defaults=defaults
            )

    for record_id in changes.get("deleted", []):
        obj = Participant.objects.filter(id=record_id).first()

        if obj:
            obj.server_deleted_at = timezone.now()
            obj.save()
