from django.urls import path
from .views import CountryView, DistrictView, ZoneView, VillageView


urlpatterns = [
    path("coreservices/api/countries/", CountryView.as_view(), name="countries"),
    path("coreservices/api/districts/", DistrictView.as_view(), name="districts"),
    path("coreservices/api/zones/", ZoneView.as_view(), name="zones"),
    path("coreservices/api/villages/", VillageView.as_view(), name="villages"),
]
