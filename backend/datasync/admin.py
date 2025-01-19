from django.contrib import admin

from .models import TrainingEvent


@admin.register(TrainingEvent)
class TrainingEventAdmin(admin.ModelAdmin):
    pass
