from django.urls import path
from .views import (
    AuthView,
    ValidateTokenView,
    VillageView,
    ClientView,
    TrainingModuleView,
)


urlpatterns = [
    path("coreservices/api/auth/", AuthView.as_view(), name="auth"),
    path(
        "coreservices/api/validatetoken/",
        ValidateTokenView.as_view(),
        name="validate_token",
    ),
    path("coreservices/api/villages/", VillageView.as_view(), name="villages"),
    path("coreservices/api/clients/", ClientView.as_view(), name="clients"),
    path(
        "coreservices/api/trainingmodules/",
        TrainingModuleView.as_view(),
        name="training_modules",
    ),
]
