from rest_framework import serializers
from .models import TrainingEvent


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class UNIXTimestampField(serializers.Field):
    def to_representation(self, value):
        return round(value.timestamp() * 1000)


class TrainingEventSerializer(serializers.ModelSerializer):
    created_at = UNIXTimestampField()
    updated_at = UNIXTimestampField()

    class Meta:
        model = TrainingEvent
        exclude = ["server_deleted_at"]
