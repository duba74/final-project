import requests
import os
from dotenv import load_dotenv


load_dotenv()


def authenticate_user(username, password):
    url = f"{os.getenv("CORE_SERVICES_HOST")}/coreservices/api/auth/"

    return requests.post(
        url,
        json={
            "username": username,
            "password": password,
        },
    )


def validate_token(headers):
    url = f"{os.getenv("CORE_SERVICES_HOST")}/coreservices/api/validatetoken/"

    return requests.get(url, headers=headers)
