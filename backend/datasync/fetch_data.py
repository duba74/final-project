from django.db.models import Q

from datasync.models import TrainingEvent
from datasync.serializers import TrainingEventSerializer
from datasync.utils import convert_to_tz_aware_datetime


def get_changed_training_events(last_pulled_at, assignments):
    for assignment in assignments:
        assignment["start_date"] = convert_to_tz_aware_datetime(
            assignment["start_date"]
        )
        if assignment["end_date"]:
            assignment["end_date"] = convert_to_tz_aware_datetime(
                assignment["end_date"]
            )

    assigned_events_query = Q()

    for assignment in assignments:
        if assignment["end_date"]:
            assigned_events_query |= Q(
                village=assignment["village"],
                scheduled_for__gte=assignment["start_date"],
                scheduled_for__lte=assignment["end_date"],
            )
        else:
            assigned_events_query |= Q(
                village=assignment["village"],
                scheduled_for__gte=assignment["start_date"],
            )

    assigned_events_queryset = TrainingEvent.objects.filter(assigned_events_query)

    created = assigned_events_queryset.filter(
        created_at__gt=last_pulled_at,
        # server_created_at__gt=last_pulled_at,
        server_deleted_at__isnull=True,
    )

    updated = assigned_events_queryset.filter(
        updated_at__gt=last_pulled_at,
        created_at__lte=last_pulled_at,
        # server_created_at__lte=last_pulled_at,
        server_deleted_at__isnull=True,
    )

    deleted = assigned_events_queryset.filter(
        server_deleted_at__gt=last_pulled_at
    ).values_list("id", flat=True)

    changes = {
        "created": TrainingEventSerializer(created, many=True).data,
        "updated": TrainingEventSerializer(updated, many=True).data,
        "deleted": list(deleted),
    }
    print("Changes sent to device:\n", changes)

    return changes
