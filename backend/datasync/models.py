import uuid
from django.db import models
from .utils import convert_to_tz_aware_datetime


class SyncModel(models.Model):
    class Meta:
        abstract = True

    id = models.CharField(primary_key=True, max_length=36, default=uuid.uuid4)
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


class TrainingModule(SyncModel):
    name = models.CharField(max_length=255, null=False, blank=False)
    topic = models.CharField(max_length=255, null=False, blank=False)
    country = models.ForeignKey(
        "Country", null=False, blank=False, on_delete=models.CASCADE
    )
    start_date = models.DateField(null=False, blank=False)
    end_date = models.DateField(null=False, blank=False)

    SYNCABLE_FIELDS = SyncModel.SYNCABLE_FIELDS.append(
        [
            "name",
            "topic",
            "country",
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
    village = models.ForeignKey(
        "Village", null=False, blank=False, on_delete=models.CASCADE
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
            "village",
            "completed_at",
            "location",
            "comments",
            "training_module",
        ]
    )

    def __str__(self):
        return f"{self.village} - {self.scheduled_for}, {self.scheduled_time}"


class Country(SyncModel):
    name = models.CharField(max_length=80, unique=True, null=False, blank=False)

    def __str__(self):
        return f"{self.id} - {self.name}"


class District(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False)
    country = models.ForeignKey(
        Country, on_delete=models.CASCADE, null=False, blank=False
    )

    def __str__(self):
        return f"{self.id} - {self.name}"


class Zone(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False)
    district = models.ForeignKey(
        District, on_delete=models.CASCADE, null=False, blank=False
    )
    country = models.ForeignKey(
        Country, on_delete=models.CASCADE, null=False, blank=False
    )

    def __str__(self):
        return f"{self.id} - {self.name}"


class Village(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False)
    is_active = models.BooleanField(null=False, blank=False, default=False)
    latitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    latitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, null=False, blank=False)
    district = models.ForeignKey(
        District, on_delete=models.CASCADE, null=False, blank=False
    )
    country = models.ForeignKey(
        Country, on_delete=models.CASCADE, null=False, blank=False
    )

    def __str__(self):
        return f"{self.id} - {self.name}"
