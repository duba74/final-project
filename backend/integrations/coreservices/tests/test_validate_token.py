import pytest
import requests
from rest_framework import status
from integrations.coreservices.user_authentication import validate_token


@pytest.fixture
def valid_token():
    return "valid_token"


@pytest.fixture
def invalid_token():
    return "invalid_token"


def mock_valid_token_response():
    class MockResponse:
        status_code = status.HTTP_200_OK

        def json(self):
            return {
                "status": "success",
                "valid": True,
                "user": {"username": "valid_user"},
            }

    return MockResponse()


def mock_invalid_token_response():
    class MockResponse:
        status_code = status.HTTP_401_UNAUTHORIZED

        def json(self):
            return {"status": "error", "valid": False, "message": "Invalid token"}

    return MockResponse()


def test_successful_token_validation(valid_token, monkeypatch, mocker):
    monkeypatch.setenv("CORE_SERVICES_HOST", "http://coreservices")
    mocker.patch("requests.get", return_value=mock_valid_token_response())

    response = validate_token(valid_token)

    assert response["status"] == "success"
    assert response["valid"] is True
    assert response["user"]["username"] == "valid_user"


def test_invalid_token_validation(invalid_token, monkeypatch, mocker):
    monkeypatch.setenv("CORE_SERVICES_HOST", "http://coreservices")
    mocker.patch("requests.get", return_value=mock_invalid_token_response())

    response = validate_token(invalid_token)

    assert response["status"] == "error"
    assert response["valid"] is False
    assert response["message"] == "Invalid token"


def test_missing_env_variable(valid_token, monkeypatch):
    monkeypatch.delenv("CORE_SERVICES_HOST", raising=False)

    with pytest.raises(requests.exceptions.MissingSchema):
        validate_token(valid_token)


def test_network_error(valid_token, monkeypatch, mocker):
    monkeypatch.setenv("CORE_SERVICES_HOST", "http://coreservices")
    mocker.patch("requests.get", side_effect=requests.exceptions.ConnectionError)

    with pytest.raises(requests.exceptions.ConnectionError):
        validate_token(valid_token)


def test_timeout_error(valid_token, monkeypatch, mocker):
    monkeypatch.setenv("CORE_SERVICES_HOST", "http://coreservices")
    mocker.patch("requests.get", side_effect=requests.exceptions.Timeout)

    with pytest.raises(requests.exceptions.Timeout):
        validate_token(valid_token)
