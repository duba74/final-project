from datetime import datetime, date, time

from rest_framework import serializers
from .models import Village, Client, TrainingModule, Staff, Assignment


class AuthSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class VillageSerializer(serializers.ModelSerializer):
    latitude = serializers.DecimalField(
        max_digits=9, decimal_places=6, coerce_to_string=False
    )
    longitude = serializers.DecimalField(
        max_digits=9, decimal_places=6, coerce_to_string=False
    )

    class Meta:
        model = Village
        fields = "__all__"


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = "__all__"


class TrainingModuleSerializer(serializers.ModelSerializer):
    start_date = serializers.SerializerMethodField()
    end_date = serializers.SerializerMethodField()

    class Meta:
        model = TrainingModule
        fields = "__all__"

    def get_start_date(self, obj):
        if isinstance(obj.start_date, date):
            dt = datetime.combine(obj.start_date, time.min)
            return int(dt.timestamp() * 1000)

        return None

    def get_end_date(self, obj):
        if isinstance(obj.end_date, date):
            dt = datetime.combine(obj.end_date, time.min)
            return int(dt.timestamp() * 1000)

        return None

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if "start_date" in representation:
            representation["start_date"] = self.get_start_date(instance)
        if "end_date" in representation:
            representation["end_date"] = self.get_end_date(instance)
        return representation


class StaffSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source="user.first_name")
    last_name = serializers.CharField(source="user.last_name")
    role_id = serializers.SerializerMethodField()
    role_name = serializers.SerializerMethodField()

    class Meta:
        model = Staff
        fields = [
            "id",
            "country",
            "role_id",
            "role_name",
            "first_name",
            "last_name",
        ]

    def get_role_id(self, obj):
        return obj.role.id if obj.role else None

    def get_role_name(self, obj):
        return obj.role.name if obj.role else None


class AssignmentSerializer(serializers.ModelSerializer):
    start_date = serializers.SerializerMethodField()
    end_date = serializers.SerializerMethodField()

    class Meta:
        model = Assignment
        fields = ["id", "staff", "village", "start_date", "end_date"]

    def get_start_date(self, obj):
        if isinstance(obj.start_date, date):
            dt = datetime.combine(obj.start_date, time.min)
            return int(dt.timestamp() * 1000)

        return None

    def get_end_date(self, obj):
        if isinstance(obj.end_date, date):
            dt = datetime.combine(obj.end_date, time.min)
            return int(dt.timestamp() * 1000)

        return None

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if "start_date" in representation:
            representation["start_date"] = self.get_start_date(instance)
        if "end_date" in representation:
            representation["end_date"] = self.get_end_date(instance)
        return representation
