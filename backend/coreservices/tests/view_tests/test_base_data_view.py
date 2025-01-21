import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from coreservices.tests.factories.village_factory import VillageFactory
from coreservices.tests.factories.assignment_factory import AssignmentFactory
from coreservices.views import AuthenticatedAPIView


class MockAuthenticatedView(AuthenticatedAPIView):
    def get(self, request, *args, **kwargs):
        return Response({"username": self.user.username}, status=status.HTTP_200_OK)


@pytest.mark.django_db
def test_valid_token_sets_user(request_factory, create_user):
    user = create_user["user"]
    token = Token.objects.get(user=user)
    headers = {"Authorization": f"Bearer {token}"}
    view = MockAuthenticatedView.as_view()
    url = "/api/testview/"
    request = request_factory.get(url, headers=headers)

    response = view(request)

    assert response.status_code == status.HTTP_200_OK
    assert response.data["username"] == user.username


@pytest.mark.django_db
def test_invalid_token(request_factory):
    headers = {"Authorization": f"Bearer invalid_token"}
    view = MockAuthenticatedView.as_view()
    url = "/api/testview/"
    request = request_factory.get(url, headers=headers)

    response = view(request)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.data["status"] == "error"
    assert response.data["valid"] == False
    assert response.data["message"] == "Invalid token"


@pytest.mark.django_db
def test_missing_token(request_factory):
    view = MockAuthenticatedView.as_view()
    url = "/api/testview/"
    request = request_factory.get(url)

    response = view(request)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data["status"] == "error"
    assert response.data["valid"] == False
    assert response.data["message"] == "Malformed or missing token"
