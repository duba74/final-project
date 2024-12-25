from django.contrib import admin

from .models import TrainingModule, TrainingEvent, Village, Zone, District, Country


@admin.register(TrainingModule)
class TrainingModuleAdmin(admin.ModelAdmin):
    pass


@admin.register(TrainingEvent)
class TrainingEventAdmin(admin.ModelAdmin):
    pass


@admin.register(Village)
class VillageAdmin(admin.ModelAdmin):
    pass


@admin.register(Zone)
class VillageAdmin(admin.ModelAdmin):
    pass


@admin.register(District)
class VillageAdmin(admin.ModelAdmin):
    pass


@admin.register(Country)
class VillageAdmin(admin.ModelAdmin):
    pass
