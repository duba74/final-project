import pytest
from coreservices.utils import extract_token


def test_extract_token_valid():
    auth_header = "Bearer valid_token"
    token = extract_token(auth_header)

    assert token == "valid_token"


def test_extract_token_missing():
    auth_header = None
    token = extract_token(auth_header)

    assert token is None


def test_extract_token_malformed():
    auth_header = "SomethingOtherThanBearar valid_token"
    token = extract_token(auth_header)

    assert token is None


def test_extract_token_empty():
    auth_header = ""
    token = extract_token(auth_header)

    assert token is None
