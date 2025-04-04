from django.utils import timezone
from django.db.models import Q, Max

from datasync.models import TrainingEvent, Participant
from datasync.serializers import TrainingEventSerializer, ParticipantSerializer
from datasync.utils import convert_to_tz_aware_datetime, get_min_time


def convert_assignments_to_datetime(assignments):
    for assignment in assignments:
        assignment["start_date"] = convert_to_tz_aware_datetime(
            assignment["start_date"]
        )
        if assignment["end_date"]:
            assignment["end_date"] = convert_to_tz_aware_datetime(
                assignment["end_date"]
            )

    return assignments


def get_changed_training_events(last_pulled_at, assignments):
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


def get_changed_participants(last_pulled_at, assignments):
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

    assigned_event_ids = TrainingEvent.objects.filter(
        assigned_events_query
    ).values_list("id", flat=True)
    assigned_participants_queryset = Participant.objects.filter(
        training_event__in=assigned_event_ids
    )

    created = assigned_participants_queryset.filter(
        created_at__gt=last_pulled_at,
        # server_created_at__gt=last_pulled_at,
        server_deleted_at__isnull=True,
    )

    updated = assigned_participants_queryset.filter(
        updated_at__gt=last_pulled_at,
        created_at__lte=last_pulled_at,
        # server_created_at__lte=last_pulled_at,
        server_deleted_at__isnull=True,
    )

    deleted = assigned_participants_queryset.filter(
        server_deleted_at__gt=last_pulled_at
    ).values_list("id", flat=True)

    changes = {
        "created": ParticipantSerializer(created, many=True).data,
        "updated": ParticipantSerializer(updated, many=True).data,
        "deleted": list(deleted),
    }
    print("Changes sent to device:\n", changes)

    return changes


# WatermelonDB recommends using a procedure to verify that the timestamp
# sent back to the client is "unique" and "monotonic",
# meaning it should be greater than any updated_at field in any of the tables,
# so this function makes sure of that
def get_unique_monotonic_timestamp():
    max_updated_at = max(
        TrainingEvent.objects.all().aggregate(max_updated_at=Max("updated_at"))[
            "max_updated_at"
        ]
        or get_min_time(),
        Participant.objects.all().aggregate(max_updated_at=Max("updated_at"))[
            "max_updated_at"
        ]
        or get_min_time(),
    )

    current_timestamp = timezone.now()

    if max_updated_at >= current_timestamp:
        current_timestamp = max_updated_at + timezone.timedelta(milliseconds=1)

    return int(current_timestamp.timestamp() * 1000)
