import pytest
from faker import Faker
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from coreservices.tests.factories.user_factory import UserFactory
from coreservices.tests.factories.staff_factory import StaffFactory
from coreservices.tests.factories.role_factory import RoleFactory


@pytest.mark.parametrize(
    "create_credentials",
    [{"username": "trainer1", "password": "abc123"}],
    indirect=True,
)
@pytest.mark.parametrize(
    "create_role", [{"role_id": "trainer", "role_name": "Trainer"}], indirect=True
)
@pytest.mark.django_db
def test_valid_credentials(api_client, create_user):
    url = reverse("auth")
    credentials = create_user["credentials"]
    data = {
        "username": credentials["username"],
        "password": credentials["password"],
    }

    response = api_client.post(url, data, format="json")

    assert response.status_code == status.HTTP_200_OK
    assert response.data["status"] == "success"
    assert "token" in response.data
    assert response.data["user"]["username"] == credentials["username"]


@pytest.mark.parametrize(
    "create_credentials",
    [{"username": "trainer1", "password": "abc123"}],
    indirect=True,
)
@pytest.mark.django_db
def test_invalid_credentials(api_client, create_user):
    url = reverse("auth")
    credentials = create_user["credentials"]
    data = {
        "username": credentials["username"],
        "password": "incorrect_password",
    }

    response = api_client.post(url, data, format="json")

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.data["status"] == "error"
    assert "token" not in response.data


@pytest.mark.parametrize(
    "create_credentials",
    [{"username": "trainer1", "password": "abc123"}],
    indirect=True,
)
@pytest.mark.django_db
def test_incomplete_credentials(api_client, create_user):
    url = reverse("auth")
    credentials = create_user["credentials"]
    data = {
        "username": credentials["username"],
    }

    response = api_client.post(url, data, format="json")

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "token" not in response.data
