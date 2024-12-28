from rest_framework import serializers
from .models import Village, Zone, District, Country


class VillageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Village
        fields = "__all__"


class ZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zone
        fields = "__all__"


class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = "__all__"


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = "__all__"
