import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token


@pytest.mark.django_db
def test_valid_token(api_client, create_user):
    user = create_user["user"]
    token = Token.objects.get(user=user)

    url = reverse("validate_token")
    headers = {"Authorization": f"Bearer {token.key}"}

    response = api_client.get(url, headers=headers)

    assert response.status_code == status.HTTP_200_OK
    assert response.data["status"] == "success"
    assert response.data["valid"] == True
    assert response.data["user"] == user.username


@pytest.mark.django_db
def test_no_token_provided(api_client, create_user):
    url = reverse("validate_token")
    headers = {}

    response = api_client.get(url, headers=headers)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data["status"] == "error"
    assert response.data["valid"] == False
    assert response.data["message"] == "Token is required"


@pytest.mark.django_db
def test_invalid_token(api_client, create_user):
    url = reverse("validate_token")
    headers = {"Authorization": f"Bearer invalid_token"}

    response = api_client.get(url, headers=headers)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.data["status"] == "error"
    assert response.data["valid"] == False
    assert response.data["message"] == "Invalid token"
