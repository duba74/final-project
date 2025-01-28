import uuid
from django.db import models
from .utils import convert_to_tz_aware_datetime


class SyncModel(models.Model):
    class Meta:
        abstract = True

    id = models.CharField(primary_key=True, max_length=36, default=uuid.uuid4)
    created_by = models.CharField(max_length=63, null=True, blank=True)
    created_at = models.DateTimeField(null=False, blank=False)
    updated_at = models.DateTimeField(null=False, blank=False)
    # server_created_at = models.DateTimeField(default=timezone.now)
    # server_updated_at = models.DateTimeField(default=timezone.now)
    server_deleted_at = models.DateTimeField(null=True, blank=True)

    SYNCABLE_FIELDS = [
        "id",
        "created_by",
        "created_at",
        "updated_at",
    ]

    def save(self, *args, **kwargs):
        if isinstance(self.created_at, (int, float)):
            self.created_at = convert_to_tz_aware_datetime(self.created_at)

        if isinstance(self.updated_at, (int, float)):
            self.updated_at = convert_to_tz_aware_datetime(self.updated_at)

        if self.server_deleted_at and isinstance(self.server_deleted_at, (int, float)):
            self.server_deleted_at = convert_to_tz_aware_datetime(
                self.server_deleted_at
            )

        super().save(*args, **kwargs)


class TrainingEvent(SyncModel):
    scheduled_for = models.DateField(null=False, blank=False)
    scheduled_time = models.CharField(
        null=False,
        blank=False,
        choices=(("AM", "AM"), ("PM", "PM")),
        default="AM",
    )
    is_canceled = models.BooleanField(default=False, null=False, blank=False)
    village = models.CharField(max_length=7, null=False, blank=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    comments = models.TextField(null=True, blank=True)
    training_module = models.CharField(max_length=15, null=False, blank=False)

    SYNCABLE_FIELDS = SyncModel.SYNCABLE_FIELDS.append(
        [
            "scheduled_for",
            "scheduled_time",
            "is_canceled",
            "village",
            "completed_at",
            "location",
            "comments",
            "training_module",
        ]
    )

    def __str__(self):
        return f"{self.village} - {self.scheduled_for}, {self.scheduled_time}"


class Participant(SyncModel):
    training_event = models.ForeignKey(
        TrainingEvent, on_delete=models.CASCADE, null=False, blank=False
    )
    village = models.CharField(max_length=7, null=False, blank=False)
    first_name = models.CharField(max_length=255, null=False, blank=False)
    last_name = models.CharField(max_length=255, null=True, blank=True)
    sex = models.CharField(
        max_length=1, null=True, blank=True, choices=(("M", "Male"), ("F", "Female"))
    )
    age_group = models.CharField(
        max_length=7,
        null=True,
        blank=True,
        choices=(("lt_30", "Less than 30"), ("gte_30", "30 or greater")),
    )
    phone_1 = models.CharField(max_length=10, null=True, blank=True)
    phone_2 = models.CharField(max_length=10, null=True, blank=True)
    client = models.CharField(max_length=15, null=True, blank=True)
    is_leader = models.BooleanField(default=False, null=False, blank=False)
    tombola_tickets = models.IntegerField(null=True, blank=True)
    pics_purchased = models.IntegerField(null=True, blank=True)
    pics_received = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.id
