from django.urls import path
from .views import AuthView, ValidateTokenView, VillageView


urlpatterns = [
    path("coreservices/api/auth/", AuthView.as_view(), name="auth"),
    path(
        "coreservices/api/validatetoken/",
        ValidateTokenView.as_view(),
        name="validate_token",
    ),
    path("coreservices/api/villages/", VillageView.as_view(), name="villages"),
]
