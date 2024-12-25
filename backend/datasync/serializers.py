from rest_framework import serializers
from .models import TrainingModule, TrainingEvent, Village, Zone, District, Country


class UNIXTimestampField(serializers.Field):
    def to_representation(self, value):
        return round(value.timestamp() * 1000)


class TrainingModuleSerializer(serializers.ModelSerializer):
    created_at = UNIXTimestampField()
    updated_at = UNIXTimestampField()

    class Meta:
        model = TrainingModule
        exclude = ["server_deleted_at"]


class TrainingEventSerializer(serializers.ModelSerializer):
    created_at = UNIXTimestampField()
    updated_at = UNIXTimestampField()

    class Meta:
        model = TrainingEvent
        exclude = ["server_deleted_at"]


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
