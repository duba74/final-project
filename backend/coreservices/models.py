from django.db import models


class Country(models.Model):
    code = models.CharField(primary_key=True, max_length=2, null=False, blank=False)
    date_created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=80, unique=True, null=False, blank=False)

    def __str__(self):
        return f"{self.code} - {self.name}"


class District(models.Model):
    code = models.CharField(primary_key=True, max_length=7, null=False, blank=False)
    date_created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=255, null=False, blank=False)
    country = models.ForeignKey(
        Country, on_delete=models.DO_NOTHING, null=False, blank=False
    )

    def __str__(self):
        return f"{self.code} - {self.name}"


class Zone(models.Model):
    code = models.CharField(primary_key=True, max_length=7, null=False, blank=False)
    date_created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=255, null=False, blank=False)
    district = models.ForeignKey(
        District, on_delete=models.DO_NOTHING, null=False, blank=False
    )
    country = models.ForeignKey(
        Country, on_delete=models.DO_NOTHING, null=False, blank=False
    )

    def __str__(self):
        return f"{self.code} - {self.name}"


class Village(models.Model):
    code = models.CharField(primary_key=True, max_length=7, null=False, blank=False)
    date_created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=255, null=False, blank=False)
    is_active = models.BooleanField(null=False, blank=False, default=False)
    zone = models.ForeignKey(Zone, on_delete=models.DO_NOTHING, null=False, blank=False)
    district = models.ForeignKey(
        District, on_delete=models.DO_NOTHING, null=False, blank=False
    )
    country = models.ForeignKey(
        Country, on_delete=models.DO_NOTHING, null=False, blank=False
    )

    def __str__(self):
        return f"{self.code} - {self.name}"
