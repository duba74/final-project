from django.urls import path
from .views import Sync


urlpatterns = [
    path("api/sync/", Sync.as_view(), name="sync"),
]
