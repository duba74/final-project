from django.urls import path
from .views import AuthView, VillageView


urlpatterns = [
    path("coreservices/api/auth/", AuthView.as_view(), name="auth"),
    path("coreservices/api/villages/", VillageView.as_view(), name="villages"),
]
