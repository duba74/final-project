import pytest
import requests
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from unittest.mock import patch
from requests.models import Response as MockResponse


def mock_valid_auth_response(*args, **kwargs):
    response = MockResponse()
    response.status_code = 200
    response._content = b'{"status": "success", "token": "a_valid_token", "user": {"username": "trainer1", "role": "trainer"}}'

    return response


def mock_unauthorized_auth_response(*args, **kwargs):
    response = MockResponse()
    response.status_code = 401
    response._content = b'{"status": "error", "message": "Invalid credentials"}'

    return response


def mock_server_error_response(*args, **kwargs):
    response = MockResponse()
    response.status_code = 500
    response._content = b'{"status": "error", "message": "Server error"}'

    return response


def mock_network_error_response(*args, **kwargs):
    raise requests.exceptions.ConnectionError("Network error")


def mock_timeout_response(*args, **kwargs):
    raise requests.exceptions.Timeout("Timeout error")


@pytest.mark.django_db
def test_valid_login(api_client, create_user, mocker):
    mock_authenticate_user = mocker.patch("datasync.views.authenticate_user")
    mock_authenticate_user.return_value = mock_valid_auth_response()

    url = reverse("login")
    credentials = create_user["credentials"]
    data = {
        "username": credentials["username"],
        "password": credentials["password"],
    }

    response = api_client.post(url, data, format="json")
    response_data = response.json()

    assert response.status_code == status.HTTP_200_OK
    assert response_data["status"] == "success"
    assert response_data["token"] == "a_valid_token"
    assert response_data["user"]["username"] == "trainer1"


@pytest.mark.django_db
def test_unauthorized_login(api_client, create_user, mocker):
    mock_authenticate_user = mocker.patch("datasync.views.authenticate_user")
    mock_authenticate_user.return_value = mock_unauthorized_auth_response()

    url = reverse("login")
    credentials = create_user["credentials"]
    data = {
        "username": credentials["username"],
        "password": "incorrect_password",
    }

    response = api_client.post(url, data, format="json")
    response_data = response.json()

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response_data["status"] == "error"
    assert response_data["message"] == "Invalid credentials"


@pytest.mark.django_db
def test_incomplete_credentials(api_client, create_user):
    url = reverse("login")
    credentials = create_user["credentials"]
    data = {
        "username": credentials["username"],
    }

    response = api_client.post(url, data, format="json")

    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_invalid_request_type(api_client, create_user):
    url = reverse("login")
    credentials = create_user["credentials"]
    data = {
        "username": credentials["username"],
        "password": credentials["password"],
    }

    response = api_client.get(url, data, format="json")

    assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED


@pytest.mark.django_db
def test_server_error_response(api_client, create_user, mocker):
    mock_authenticate_user = mocker.patch("datasync.views.authenticate_user")
    mock_authenticate_user.return_value = mock_server_error_response()

    url = reverse("login")
    credentials = create_user["credentials"]
    data = {
        "username": credentials["username"],
        "password": credentials["password"],
    }

    response = api_client.post(url, data, format="json")
    response_data = response.json()

    assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
    assert response_data["status"] == "error"
    assert response_data["message"] == "Server error"


@pytest.mark.django_db
def test_network_error(api_client, create_user, mocker):
    mock_authenticate_user = mocker.patch("datasync.views.authenticate_user")
    mock_authenticate_user.side_effect = requests.exceptions.ConnectionError(
        "Network error"
    )

    url = reverse("login")
    credentials = create_user["credentials"]
    data = {"username": credentials["username"], "password": credentials["password"]}

    response = api_client.post(url, data, format="json")
    response_data = response.json()

    assert response.status_code == status.HTTP_503_SERVICE_UNAVAILABLE
    assert response_data["status"] == "error"
    assert response_data["message"] == "Network error"


@pytest.mark.django_db
def test_timeout_error(api_client, create_user, mocker):
    mock_authenticate_user = mocker.patch("datasync.views.authenticate_user")
    mock_authenticate_user.side_effect = requests.exceptions.Timeout("Timeout error")

    url = reverse("login")
    credentials = create_user["credentials"]
    data = {"username": credentials["username"], "password": credentials["password"]}

    response = api_client.post(url, data, format="json")
    response_data = response.json()

    assert response.status_code == status.HTTP_504_GATEWAY_TIMEOUT
    assert response_data["status"] == "error"
    assert response_data["message"] == "Timeout error"
