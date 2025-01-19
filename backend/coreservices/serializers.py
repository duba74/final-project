from rest_framework import serializers
from .models import Village, TrainingModule


class VillageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Village
        fields = "__all__"


class TrainingModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingModule
        fields = "__all__"
