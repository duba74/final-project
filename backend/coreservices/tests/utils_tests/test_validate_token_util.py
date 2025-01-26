import pytest
from rest_framework import status
from rest_framework.authtoken.models import Token
from coreservices.utils import validate_token


@pytest.mark.django_db
def test_valid_token(request_factory, create_user):
    user = create_user["user"]
    token = Token.objects.get(user=user)
    headers = {"Authorization": f"Bearer {token.key}"}
    request = request_factory.get("/some-path", headers=headers)

    response = validate_token(request)

    assert response.status_code == status.HTTP_200_OK
    assert response.data["status"] == "success"
    assert response.data["valid"] == True
    assert response.data["user"] == user.username


@pytest.mark.django_db
def test_no_token_provided(request_factory):
    headers = {}
    request = request_factory.get("/some-path", headers=headers)

    response = validate_token(request)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data["status"] == "error"
    assert response.data["valid"] == False
    assert response.data["message"] == "Malformed or missing token"


@pytest.mark.django_db
def test_invalid_token(request_factory):
    headers = {"Authorization": f"Bearer invalid_token"}
    request = request_factory.get("/some-path", headers=headers)

    response = validate_token(request)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.data["status"] == "error"
    assert response.data["valid"] == False
    assert response.data["message"] == "Invalid token"
