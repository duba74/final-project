from django.contrib import admin

from .models import TrainingModule, TrainingEvent


@admin.register(TrainingModule)
class TrainingModuleAdmin(admin.ModelAdmin):
    pass


@admin.register(TrainingEvent)
class TrainingEventAdmin(admin.ModelAdmin):
    pass
