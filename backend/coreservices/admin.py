from django.contrib import admin

from .models import Country, District, Zone, Village


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
