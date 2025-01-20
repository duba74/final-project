import uuid
from django.db import models
from django.contrib.auth.models import User


class Role(models.Model):
    id = models.CharField(primary_key=True, max_length=15)
    name = models.CharField(max_length=63)

    def __str__(self):
        return self.name


class Staff(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True)
    country = models.CharField(max_length=7, null=True, blank=True)

    def __str__(self):
        return self.user.username


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
        return f"{self.id} - {self.name}"


class Assignment(models.Model):
    id = models.CharField(primary_key=True, max_length=36, default=uuid.uuid4)
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE, null=False, blank=False)
    village = models.ForeignKey(
        Village, on_delete=models.CASCADE, null=False, blank=False
    )
    start_date = models.DateField(null=False, blank=False)
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.staff} - {self.village} - {self.start_date}" + (
            f" - {self.end_date}" if self.end_date else ""
        )


class TrainingModule(models.Model):
    id = models.CharField(primary_key=True, max_length=15)
    name = models.CharField(max_length=255, null=False, blank=False)
    topic = models.CharField(max_length=255, null=False, blank=False)
    country = models.CharField(max_length=7, null=False, blank=False)
    start_date = models.DateField(null=False, blank=False)
    end_date = models.DateField(null=False, blank=False)

    def __str__(self):
        return self.name
