import requests
import os
import logging
from dotenv import load_dotenv
from rest_framework.response import Response
from rest_framework import status


load_dotenv()


def get_data(headers, data):
    url = f"{os.getenv("CORE_SERVICES_HOST")}/coreservices/api/{data}/"

    try:
        r = requests.get(url, headers=headers, timeout=10)
        r.raise_for_status()
        records = r.json()

        return records["data"]

    except requests.exceptions.HTTPError as e:
        logging.error(f"HTTP error: {e}")
        return Response(
            {"status": "error", "message": "Invalid token or authorization failed"},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    except requests.exceptions.ConnectionError as e:
        logging.error(f"Connection error: {e}")
        return Response(
            {"status": "error", "message": "Failed to connect to core services"},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )
    except requests.exceptions.Timeout as e:
        logging.error(f"Timeout error: {e}")
        return Response(
            {"status": "error", "message": "Request to core services timed out"},
            status=status.HTTP_504_GATEWAY_TIMEOUT,
        )
    except requests.exceptions.RequestException as e:
        logging.error(f"Error: {e}")
        return Response(
            {"status": "error", "message": "An unexpected error occurred"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
