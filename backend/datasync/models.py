from django.db import models
from django.utils import timezone
from .utils import convert_to_tz_aware_datetime


class SyncModel(models.Model):
    class Meta:
        abstract = True

    id = models.UUIDField(primary_key=True)
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

        if self.deleted_at and isinstance(self.deleted_at, (int, float)):
            self.deleted_at = convert_to_tz_aware_datetime(self.deleted_at)

        super().save(*args, **kwargs)


class TrainingModule(SyncModel):
    name = models.CharField(max_length=255, null=False, blank=False)
    topic = models.CharField(max_length=255, null=False, blank=False)
    start_date = models.DateField(null=False, blank=False)
    end_date = models.DateField(null=False, blank=False)

    SYNCABLE_FIELDS = SyncModel.SYNCABLE_FIELDS.append(
        [
            "name",
            "topic",
            "start_date",
            "end_date",
        ]
    )

    def __str__(self):
        return self.name


class TrainingEvent(SyncModel):
    scheduled_for = models.DateField(null=False, blank=False)
    scheduled_time = models.CharField(
        null=False,
        blank=False,
        choices=(("AM", "AM"), ("PM", "PM")),
        default="AM",
    )
    completed_at = models.DateTimeField(null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    comments = models.TextField(null=True, blank=True)
    training_module = models.ForeignKey(
        TrainingModule,
        on_delete=models.CASCADE,
        null=False,
        blank=False,
    )

    SYNCABLE_FIELDS = SyncModel.SYNCABLE_FIELDS.append(
        [
            "scheduled_for",
            "scheduled_time",
            "completed_at",
            "location",
            "comments",
            "training_module",
        ]
    )

    def __str__(self):
        return f"{self.scheduled_for}, {self.scheduled_time}"
