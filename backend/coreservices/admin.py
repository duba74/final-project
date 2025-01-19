from django.contrib import admin

from .models import Role, Staff, Village, TrainingModule, Assignment


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    pass


@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    pass


@admin.register(Village)
class VillageAdmin(admin.ModelAdmin):
    pass


@admin.register(Assignment)
class AssignmentModuleAdmin(admin.ModelAdmin):
    pass


@admin.register(TrainingModule)
class TrainingModuleAdmin(admin.ModelAdmin):
    pass
