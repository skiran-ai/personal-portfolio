"""Stateless HMAC-signed admin token helpers using Django's TimestampSigner."""

from functools import wraps
from django.core.signing import BadSignature, SignatureExpired, TimestampSigner
from django.http import JsonResponse

_SIGNER = TimestampSigner(salt='portfolio-admin-auth-v1')
TOKEN_TTL_SECONDS = 60 * 60 * 12  # 12 hours


def issue_admin_token(username: str) -> str:
    """Issue a signed, time-bounded token for an authenticated admin username."""
    return _SIGNER.sign(username)


def verify_admin_token(token: str, max_age: int = TOKEN_TTL_SECONDS) -> str | None:
    """Verify token signature and expiry. Returns username or None."""
    if not token:
        return None
    try:
        return _SIGNER.unsign(token, max_age=max_age)
    except (BadSignature, SignatureExpired):
        return None


def extract_bearer_token(request) -> str | None:
    """Extract Bearer token from Authorization header."""
    auth_header = request.META.get('HTTP_AUTHORIZATION', '')
    if auth_header.lower().startswith('bearer '):
        return auth_header[7:].strip()
    return None


def require_admin(view_func):
    """Decorator enforcing valid Bearer admin token on protected API endpoints."""

    @wraps(view_func)
    def _wrapped(request, *args, **kwargs):
        token = extract_bearer_token(request)
        username = verify_admin_token(token)
        if not username:
            return JsonResponse(
                {
                    'status': 'error',
                    'message': 'Authentication required. Please log in to the Admin Console.',
                },
                status=401,
            )
        request.admin_username = username
        return view_func(request, *args, **kwargs)

    return _wrapped
