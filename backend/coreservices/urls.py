from django.urls import path
from .views import VillageView


urlpatterns = [
    path("coreservices/api/villages/", VillageView.as_view(), name="villages"),
]
