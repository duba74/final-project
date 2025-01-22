import pytest
from datetime import timedelta
from django.utils import timezone
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from coreservices.tests.factories.training_module_factory import TrainingModuleFactory
from coreservices.views import TrainingModuleView


@pytest.mark.django_db
def test_valid_user_success_response(request_factory, create_user):
    user = create_user["user"]
    token = Token.objects.get(user=user)
    url = reverse("training_modules")
    headers = {"Authorization": f"Bearer {token}"}
    request = request_factory.get(url, headers=headers)
    view = TrainingModuleView.as_view()

    response = view(request)

    assert response.status_code == status.HTTP_200_OK
    assert response.data["status"] == "success"


@pytest.mark.django_db
def test_invalid_user_unauthorized_response(request_factory):
    url = reverse("training_modules")
    headers = {"Authorization": f"Bearer invalid_token"}
    request = request_factory.get(url, headers=headers)
    view = TrainingModuleView.as_view()

    response = view(request)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.data["status"] == "error"
    assert response.data["valid"] == False
    assert response.data["message"] == "Invalid token"


@pytest.mark.django_db
def test_missing_authentication_response(request_factory):
    url = reverse("training_modules")
    request = request_factory.get(url)
    view = TrainingModuleView.as_view()

    response = view(request)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data["status"] == "error"
    assert response.data["valid"] == False
    assert response.data["message"] == "Malformed or missing token"


@pytest.mark.django_db
def test_contains_data(request_factory, create_user):
    user = create_user["user"]
    token = Token.objects.get(user=user)
    url = reverse("training_modules")
    headers = {"Authorization": f"Bearer {token}"}
    request = request_factory.get(url, headers=headers)
    view = TrainingModuleView.as_view()

    response = view(request)

    assert isinstance(response.data["data"], list)


@pytest.mark.django_db
def test_returns_only_requestor_country_modules(request_factory, create_user):
    user = create_user["user"]
    token = Token.objects.get(user=user)
    url = reverse("training_modules")
    headers = {"Authorization": f"Bearer {token}"}
    request = request_factory.get(url, headers=headers)
    view = TrainingModuleView.as_view()

    training_module_1 = TrainingModuleFactory(
        name="requestor_country_module", country=user.staff.country
    )
    training_module_2 = TrainingModuleFactory(
        name="non_requestor_country_module", country="00"
    )

    response = view(request)

    assert "requestor_country_module" in [t["name"] for t in response.data["data"]]
    assert "non_requestor_country_module" not in [
        t["name"] for t in response.data["data"]
    ]


@pytest.mark.django_db
def test_returns_only_active_modules(request_factory, create_user):
    user = create_user["user"]
    token = Token.objects.get(user=user)
    url = reverse("training_modules")
    headers = {"Authorization": f"Bearer {token}"}
    request = request_factory.get(url, headers=headers)
    view = TrainingModuleView.as_view()

    training_module_1 = TrainingModuleFactory(
        name="active_module",
        is_active=True,
        country=user.staff.country,
    )
    training_module_2 = TrainingModuleFactory(
        name="inactive_module",
        is_active=False,
        country=user.staff.country,
    )

    response = view(request)

    assert "active_module" in [t["name"] for t in response.data["data"]]
    assert "inactive_module" not in [t["name"] for t in response.data["data"]]
