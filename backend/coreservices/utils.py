from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status


def extract_token(auth_header):
    if auth_header is None:
        return None

    if not auth_header.startswith("Bearer "):
        return None

    return auth_header.split(" ")[1]


def validate_token(request):
    auth_header = request.headers.get("Authorization")
    token_key = extract_token(auth_header)

    if not token_key:
        return Response(
            {
                "status": "error",
                "valid": False,
                "message": "Malformed or missing token",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        token = Token.objects.get(key=token_key)
        return Response(
            {"status": "success", "valid": True, "user": token.user.username},
            status=status.HTTP_200_OK,
        )
    except Token.DoesNotExist:
        return Response(
            {"status": "error", "valid": False, "message": "Invalid token"},
            status=status.HTTP_401_UNAUTHORIZED,
        )
