from django.urls import path
from .views import LoginView, Sync, SecondaryDataPull


urlpatterns = [
    path("api/login/", LoginView.as_view(), name="login"),
    path("api/sync/", Sync.as_view(), name="sync"),
    path(
        "api/secondarydatapull/",
        SecondaryDataPull.as_view(),
        name="secondary_data_pull",
    ),
]
