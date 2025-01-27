import pytest
import requests
from django.utils import timezone
from django.urls import reverse
from rest_framework import status


@pytest.mark.django_db
def test_secondary_sync_valid_token(api_client, mocker):
    url = reverse("secondary_sync")
    headers = {"Authorization": f"Bearer a_valid_token"}
    last_pulled_at = int(timezone.now().timestamp() * 1000)

    mock_get = mocker.patch("requests.get")
    mock_get.side_effect = [
        mocker.Mock(
            status_code=200,
            json=lambda: {"data": [{"id": "AB123", "name": "Village 1"}]},
        ),
        mocker.Mock(
            status_code=200,
            json=lambda: {"data": [{"id": "012345", "name": "Client 1"}]},
        ),
        mocker.Mock(
            status_code=200,
            json=lambda: {"data": [{"id": "m1_ml", "name": "Training Module 1"}]},
        ),
    ]

    response = api_client.get(
        url,
        headers=headers,
        data={"lastPulledAt": last_pulled_at},
    )
    response_data = response.json()

    assert response.status_code == status.HTTP_200_OK
    assert int(response_data["timestamp"]) == last_pulled_at
    assert "village" in response_data["changes"]
    assert "client" in response_data["changes"]
    assert "training_module" in response_data["changes"]


@pytest.mark.django_db
def test_secondary_sync_invalid_token(api_client, mocker):
    url = reverse("secondary_sync")
    headers = {"Authorization": f"Bearer an_invalid_token"}
    last_pulled_at = int(timezone.now().timestamp() * 1000)

    mock_get = mocker.patch("requests.get")
    mock_get.side_effect = requests.exceptions.HTTPError("Invalid token")

    response = api_client.get(
        url,
        headers=headers,
        data={"lastPulledAt": last_pulled_at},
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_secondary_sync_missing_token(api_client, mocker):
    url = reverse("secondary_sync")
    last_pulled_at = int(timezone.now().timestamp() * 1000)

    mock_get = mocker.patch("requests.get")
    mock_get.side_effect = requests.exceptions.HTTPError("Invalid token")

    response = api_client.get(url, data={"lastPulledAt": last_pulled_at})

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
