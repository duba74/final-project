import uuid
from django.db import models


class Village(models.Model):
    id = models.CharField(primary_key=True, max_length=7, null=False, blank=False)
    is_active = models.BooleanField(null=False, blank=False, default=False)
    name = models.CharField(max_length=255, null=False, blank=False)
    zone_code = models.CharField(max_length=7, null=False, blank=False)
    zone_name = models.CharField(max_length=255, null=False, blank=False)
    district_code = models.CharField(max_length=7, null=False, blank=False)
    district_name = models.CharField(max_length=255, null=False, blank=False)
    country_code = models.CharField(max_length=7, null=False, blank=False)
    country_name = models.CharField(max_length=255, null=False, blank=False)
    latitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    longitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )

    def __str__(self):
        return f"{self.code} - {self.name}"


class Assignment(models.Model):
    id = models.CharField(primary_key=True, max_length=36, default=uuid.uuid4)
    trainer = models.CharField(max_length=15, null=False, blank=False)
    village = models.CharField(max_length=7, null=False, blank=False)
    start_date = models.DateField(null=False, blank=False)
    end_date = models.DateField(null=True, blank=True)
