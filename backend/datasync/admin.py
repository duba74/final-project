from django.contrib import admin

from .models import TrainingEvent, Participant


@admin.register(TrainingEvent)
class TrainingEventAdmin(admin.ModelAdmin):
    pass


@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    pass
