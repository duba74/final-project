from django.urls import path
from .views import LoginView, MainSync, SecondarySync


urlpatterns = [
    path("api/login/", LoginView.as_view(), name="login"),
    path("api/mainsync/", MainSync.as_view(), name="main_sync"),
    path("api/secondarysync/", SecondarySync.as_view(), name="secondary_sync"),
]
