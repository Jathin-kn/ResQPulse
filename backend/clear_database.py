import sys
import os
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent.resolve()
sys.path.append(str(backend_dir))

from firebase_admin_config import initialize_firebase
from firebase_admin import db

def clear_database():
    """
    Connects to the Firebase Realtime Database and clears specified nodes.
    """
    try:
        print("Initializing Firebase...")
        initialize_firebase()
        print("✅ Firebase initialized.")

        nodes_to_clear = ['users', 'emergencies', 'sessions', 'sensor_data', 'system_health']
        
        for node in nodes_to_clear:
            try:
                print(f"Attempting to clear '{node}' node...")
                ref = db.reference(f'/{node}')
                ref.delete()
                print(f"✅ Successfully cleared '{node}' node.")
            except Exception as e:
                print(f"⚠️  Could not clear '{node}' node: {e}")

        print("\nDatabase clearing process completed.")

    except Exception as e:
        print(f"❌ An error occurred during the database clearing process: {e}")

if __name__ == "__main__":
    # To prevent accidental runs, add a confirmation step.
    confirm = input("Are you sure you want to permanently delete all users, emergencies, sessions, and sensor data? (y/n): ")
    if confirm.lower() == 'y':
        clear_database()
    else:
        print("Operation cancelled.")
