from rest_framework import serializers
from .models import Village, Client, TrainingModule


class AuthSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class VillageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Village
        fields = "__all__"


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = "__all__"


class TrainingModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingModule
        fields = "__all__"
