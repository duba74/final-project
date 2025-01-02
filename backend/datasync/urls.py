from django.urls import path
from .views import MainSync, SecondarySync


urlpatterns = [
    path("api/main-sync/", MainSync.as_view(), name="main-sync"),
    path("api/secondary-sync/", SecondarySync.as_view(), name="secondary-sync"),
]
