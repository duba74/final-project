import requests
import os
from dotenv import load_dotenv


load_dotenv()


def authenticate_user(username, password):
    url = f"{os.getenv("core_services_host")}/coreservices/api/auth/"

    return requests.post(
        url,
        json={
            "username": username,
            "password": password,
        },
    )


def validate_token(auth_token):
    url = f"{os.getenv("CORE_SERVICES_HOST")}/coreservices/api/validatetoken/"
    headers = {"Authorization": auth_token}
    response = requests.get(url, headers=headers)

    return response.json()
