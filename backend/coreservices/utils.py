def extract_token(auth_header):
    if auth_header is None:
        return None

    if not auth_header.startswith("Bearer "):
        return None

    return auth_header.split(" ")[1]
