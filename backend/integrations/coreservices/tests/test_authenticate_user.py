import pytest
import requests
from rest_framework import status
from integrations.coreservices.user_authentication import authenticate_user


@pytest.fixture
def valid_credentials():
    return {"username": "valid_user", "password": "valid_password"}


@pytest.fixture
def invalid_credentials():
    return {"username": "invalid_user", "password": "invalid_password"}


def mock_valid_auth_response():
    class MockResponse:
        status_code = status.HTTP_200_OK

        def json(self):
            return {
                "status": "success",
                "token": "a_valid_token",
                "user": {"username": "trainer1", "role": "trainer"},
            }

    return MockResponse()


def mock_unauthorized_auth_response():
    class MockResponse:
        status_code = status.HTTP_401_UNAUTHORIZED

        def json(self):
            return {"status": "error", "message": "Invalid credentials"}

    return MockResponse()


def test_successful_authentication(valid_credentials, monkeypatch, mocker):
    monkeypatch.setenv("CORE_SERVICES_HOST", "http://coreservices")
    mocker.patch("requests.post", return_value=mock_valid_auth_response())

    response = authenticate_user(**valid_credentials)

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["status"] == "success"


def test_unsuccessful_authentication(invalid_credentials, monkeypatch, mocker):
    monkeypatch.setenv("CORE_SERVICES_HOST", "http://coreservices")
    mocker.patch("requests.post", return_value=mock_unauthorized_auth_response())

    response = authenticate_user(**invalid_credentials)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()["status"] == "error"


def test_network_error(valid_credentials, monkeypatch, mocker):
    monkeypatch.setenv("CORE_SERVICES_HOST", "http://coreservices")
    mocker.patch("requests.post", side_effect=requests.exceptions.ConnectionError)

    with pytest.raises(requests.exceptions.ConnectionError):
        authenticate_user(**valid_credentials)


def test_timeout_error(valid_credentials, monkeypatch, mocker):
    monkeypatch.setenv("CORE_SERVICES_HOST", "http://coreservices")
    mocker.patch("requests.post", side_effect=requests.exceptions.Timeout)

    with pytest.raises(requests.exceptions.Timeout):
        authenticate_user(**valid_credentials)


def test_missing_env_variable(valid_credentials, monkeypatch):
    monkeypatch.delenv("CORE_SERVICES_HOST", raising=False)

    with pytest.raises(requests.exceptions.MissingSchema):
        authenticate_user(**valid_credentials)
