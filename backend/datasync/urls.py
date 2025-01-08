from django.urls import path
from .views import LoginView, MainSync, SecondarySync


urlpatterns = [
    path("api/login/", LoginView.as_view(), name="login"),
    path("api/main-sync/", MainSync.as_view(), name="main-sync"),
    path("api/secondary-sync/", SecondarySync.as_view(), name="secondary-sync"),
]
