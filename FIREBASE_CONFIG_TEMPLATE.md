# Firebase Configuration Template - AWAITING NEW CREDENTIALS

All previous Firebase credentials have been removed. Ready to configure new database.

## 📋 Required Information for New Firebase Database

Please provide the following details and paste them into the corresponding files:

### 1. Frontend Configuration
**File**: `frontend/.env`
```
VITE_FIREBASE_API_KEY=[API_KEY]
VITE_FIREBASE_AUTH_DOMAIN=[AUTH_DOMAIN]
VITE_FIREBASE_PROJECT_ID=[PROJECT_ID]
VITE_FIREBASE_STORAGE_BUCKET=[STORAGE_BUCKET]
VITE_FIREBASE_MESSAGING_SENDER_ID=[MESSAGING_SENDER_ID]
VITE_FIREBASE_APP_ID=[APP_ID]
VITE_FIREBASE_DATABASE_URL=[DATABASE_URL]
```

### 2. Backend Configuration
**File**: `backend/.env`
```
FIREBASE_PROJECT_ID=[PROJECT_ID]
FIREBASE_DATABASE_URL=[DATABASE_URL]
FIREBASE_ADMIN_SDK_PATH=[PATH_TO_SERVICE_ACCOUNT_JSON]
```

**Note**: Service account JSON file should be placed in the project root directory

### 3. ESP32 Configuration
**File**: `esp32/ResqPulse_ESP32.ino`
```cpp
#define FIREBASE_HOST "[DATABASE_URL_WITHOUT_HTTPS:// AND TRAILING /]"
#define FIREBASE_AUTH "[FIREBASE_AUTH_TOKEN]"
```

Example:
```cpp
#define FIREBASE_HOST "myproject-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "AIzaSyD..."
```

---

## 🔍 Where to Find These Values

### For Frontend (.env):
From Firebase Console → Project Settings → Your apps → Web

### For Backend (.env):
From Firebase Console → Project Settings → Service accounts → Generate new private key

### For ESP32:
From Firebase Console → Realtime Database → Rules tab → Get database URL
Authentication token from Firebase Console → Project Settings

---

## 📚 Steps Once You Provide Details:

1. Paste API KEY in `frontend/.env`
2. Paste AUTH DOMAIN in `frontend/.env`
3. Paste PROJECT ID in `frontend/.env`
4. Paste STORAGE BUCKET in `frontend/.env`
5. Paste MESSAGING SENDER ID in `frontend/.env`
6. Paste APP ID in `frontend/.env`
7. Paste DATABASE URL in `frontend/.env`
8. Update `backend/.env` with PROJECT ID and DATABASE URL
9. Place service account JSON in project root
10. Update ESP32 code with FIREBASE_HOST and FIREBASE_AUTH
11. Update database rules if needed
12. All systems will be configured and ready to use

---

## ✅ Current Status

- ✅ All old credentials removed
- ✅ Environment variables cleared
- ✅ System ready for new Firebase database
- ⏳ Awaiting your Firebase credentials...

Once you provide the new credentials, I'll update all files automatically!
