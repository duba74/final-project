from django.contrib import admin

from .models import Role, Profile, TrainingModule, TrainingEvent


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    pass


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    pass


@admin.register(TrainingModule)
class TrainingModuleAdmin(admin.ModelAdmin):
    pass


@admin.register(TrainingEvent)
class TrainingEventAdmin(admin.ModelAdmin):
    pass
