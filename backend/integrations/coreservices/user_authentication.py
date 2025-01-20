import requests
import os
from dotenv import load_dotenv


def authenticate_user(username, password):
    load_dotenv()

    url = f"{os.getenv("CORE_SERVICES_HOST")}/coreservices/api/auth/"

    print(url)

    return requests.post(
        url,
        json={
            "username": username,
            "password": password,
        },
    )
