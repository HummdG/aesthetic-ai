"""
Firebase Authentication middleware and utilities for FastAPI
"""
import os
import json
import logging
from typing import Optional, Dict, Any
from fastapi import HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import auth, credentials
from sqlalchemy.orm import Session

from ..models import get_db, User
from ..config import settings

logger = logging.getLogger(__name__)

# Security scheme for Bearer tokens
security = HTTPBearer()

# Initialize Firebase Admin SDK
def initialize_firebase():
    """Initialize Firebase Admin SDK with environment variable support for Render"""
    try:
        # Check if Firebase is already initialized
        firebase_admin.get_app()
        logger.info("Firebase Admin SDK already initialized")
        return
    except ValueError:
        # Firebase not initialized, initialize it
        pass
    
    try:
        # Try to get Firebase config from environment variable first (for Render)
        firebase_config_json = settings.FIREBASE_ADMIN_SDK_JSON
        
        if firebase_config_json:
            logger.info("Initializing Firebase from environment variable")
            try:
                # Parse JSON from environment variable
                config_dict = json.loads(firebase_config_json)
                cred = credentials.Certificate(config_dict)
                firebase_admin.initialize_app(cred)
                logger.info("✅ Firebase Admin SDK initialized from environment variable")
                return
            except json.JSONDecodeError as e:
                logger.error(f"❌ Invalid JSON in FIREBASE_ADMIN_SDK_JSON: {e}")
                raise
        
        # Fallback to file-based approach for development
        service_account_path = settings.FIREBASE_ADMIN_SDK_PATH
        
        if os.path.exists(service_account_path):
            logger.info(f"Initializing Firebase from file: {service_account_path}")
            cred = credentials.Certificate(service_account_path)
            firebase_admin.initialize_app(cred)
            logger.info("✅ Firebase Admin SDK initialized from file")
            return
        
        # If neither method works
        error_msg = (
            "Firebase Admin SDK configuration not found. "
            "Please set FIREBASE_ADMIN_SDK_JSON environment variable with your Firebase config JSON, "
            f"or ensure the file exists at: {service_account_path}"
        )
        logger.error(f"❌ {error_msg}")
        raise FileNotFoundError(error_msg)
        
    except Exception as e:
        logger.error(f"❌ Failed to initialize Firebase Admin SDK: {e}")
        raise


def verify_firebase_token(token: str) -> Dict[str, Any]:
    """
    Verify Firebase ID token and return user info
    
    Args:
        token: Firebase ID token
        
    Returns:
        Dict containing user information
        
    Raises:
        HTTPException: If token is invalid
    """
    try:
        # Check if Firebase is initialized
        try:
            firebase_admin.get_app()
        except ValueError:
            logger.error("Firebase Admin SDK not initialized")
            raise HTTPException(
                status_code=500,
                detail="Authentication service not available"
            )
        
        # Verify the token
        decoded_token = auth.verify_id_token(token)
        logger.info(f"Token verified successfully for user: {decoded_token.get('uid')}")
        return decoded_token
    except auth.ExpiredIdTokenError:
        logger.warning(f"Expired token received")
        raise HTTPException(
            status_code=401,
            detail="Authentication token has expired"
        )
    except auth.InvalidIdTokenError as e:
        logger.warning(f"Invalid token received: {e}")
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )
    except Exception as e:
        logger.error(f"Token verification failed: {e}")
        raise HTTPException(
            status_code=401,
            detail=f"Authentication failed: {str(e)}"
        )


def get_current_user_from_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Get current user from Firebase token
    
    Args:
        credentials: HTTP authorization credentials
        db: Database session
        
    Returns:
        User object
        
    Raises:
        HTTPException: If authentication fails
    """
    # Verify the token
    token_data = verify_firebase_token(credentials.credentials)
    
    # Get Firebase UID
    firebase_uid = token_data.get("uid")
    if not firebase_uid:
        raise HTTPException(
            status_code=401,
            detail="Invalid token: missing user ID"
        )
    
    # Find user in database
    user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
    
    if not user:
        # Create new user if not exists
        user = User(
            firebase_uid=firebase_uid,
            email=token_data.get("email", ""),
            display_name=token_data.get("name", token_data.get("email", "").split("@")[0])
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        logger.info(f"Created new user: {user.email}")
    
    return user


def get_current_user_optional(
    request: Request,
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Get current user from Firebase token, but allow None (for optional auth)
    
    Args:
        request: FastAPI request object
        db: Database session
        
    Returns:
        User object or None
    """
    # Get authorization header
    authorization = request.headers.get("Authorization")
    if not authorization:
        return None
    
    # Extract token
    if not authorization.startswith("Bearer "):
        return None
    
    token = authorization.split(" ", 1)[1]
    
    try:
        # Verify the token
        token_data = verify_firebase_token(token)
        
        # Get Firebase UID
        firebase_uid = token_data.get("uid")
        if not firebase_uid:
            return None
        
        # Find user in database
        user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
        
        if not user:
            # Create new user if not exists
            user = User(
                firebase_uid=firebase_uid,
                email=token_data.get("email", ""),
                display_name=token_data.get("name", token_data.get("email", "").split("@")[0])
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            logger.info(f"Created new user: {user.email}")
        
        return user
        
    except HTTPException:
        # Token verification failed, but we allow None
        return None
    except Exception as e:
        logger.error(f"Optional authentication failed: {e}")
        return None


# Initialize Firebase when module is imported
try:
    initialize_firebase()
except Exception as e:
    logger.warning(f"Firebase initialization failed: {e}")
    logger.warning("Firebase authentication will not be available") 