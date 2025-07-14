"""
Authentication module for Aesthetic AI Backend
"""

from .firebase_auth import (
    initialize_firebase,
    verify_firebase_token,
    get_current_user_from_token,
    get_current_user_optional
)

__all__ = [
    "initialize_firebase",
    "verify_firebase_token", 
    "get_current_user_from_token",
    "get_current_user_optional"
] 