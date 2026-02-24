import firebase_admin
from firebase_admin import credentials
from firebase_admin import db as firebase_db
from firebase_admin import auth as firebase_auth
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv(Path(__file__).parent / '.env')

def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    try:
        # Get the service account key path
        cred_path = os.getenv('FIREBASE_ADMIN_SDK_PATH', 
                             '../myosa-9871-firebase-adminsdk-fbsvc-be6dc3c8b6.json')
        
        # Check if already initialized
        if not firebase_admin._apps:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred, {
                'databaseURL': os.getenv('FIREBASE_DATABASE_URL', 
                                        'https://myosa-9871-default-rtdb.firebaseio.com')
            })
        
        print("✅ Firebase initialized successfully")
    except Exception as e:
        print(f"❌ Firebase initialization error: {e}")
        raise

def verify_firebase_token(authorization_header):
    """Verify Firebase ID token from Authorization header (Bearer <token>)"""
    try:
        # Extract token from "Bearer <token>" format
        if not authorization_header:
            raise Exception("No authorization header provided")
        
        if authorization_header.startswith("Bearer "):
            token = authorization_header[7:]  # Remove "Bearer " prefix
        else:
            token = authorization_header  # Assume it's just the token
        
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token['uid']
    except Exception as e:
        raise Exception(f"Token verification failed: {e}")

def get_user_by_uid(uid):
    """Get user data from database"""
    try:
        ref = firebase_db.reference(f'users/{uid}')
        return ref.get().val()
    except Exception as e:
        raise Exception(f"Error fetching user: {e}")

def create_user(uid, email, user_data):
    """Create user in database"""
    try:
        ref = firebase_db.reference(f'users/{uid}')
        ref.set({
            'uid': uid,
            'email': email,
            **user_data
        })
        return True
    except Exception as e:
        raise Exception(f"Error creating user: {e}")

def update_user(uid, user_data):
    """Update user data"""
    try:
        ref = firebase_db.reference(f'users/{uid}')
        ref.update(user_data)
        return True
    except Exception as e:
        raise Exception(f"Error updating user: {e}")

if __name__ == "__main__":
    initialize_firebase()
    print("Firebase Admin SDK is ready")
