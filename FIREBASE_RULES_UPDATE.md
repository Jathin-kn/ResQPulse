# Firebase Database Rules - Manual Update Instructions

## 🔧 How to Update Rules Manually

Since the Firebase CLI needs to be authenticated for your new project, here's how to update the rules manually:

### Step 1: Open Firebase Console
Go to: https://console.firebase.google.com/project/myosa-finals-485aa/database/rules

### Step 2: Copy the Rules Below
```json
{
  "rules": {
    ".read": false,
    ".write": false,
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'",
        ".write": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'",
        "role": {
          ".validate": "newData.isString() && (newData.val() === 'admin' || newData.val() === 'hospital' || newData.val() === 'ambulance' || newData.val() === 'responder')"
        }
      }
    },
    "emergencies": {
      ".read": "auth !== null",
      ".indexOn": ["status"],
      "$emergency_id": {
        ".write": "auth !== null",
        "cleared": {
          ".write": "!data.exists() || (root.child('users').child(auth.uid).child('role').val() === 'admin' || root.child('users').child(auth.uid).child('role').val() === 'ambulance' || root.child('users').child(auth.uid).child('role').val() === 'hospital')"
        },
        "cleared_by": {
          ".write": "!data.exists() || (root.child('users').child(auth.uid).child('role').val() === 'admin' || root.child('users').child(auth.uid).child('role').val() === 'ambulance' || root.child('users').child(auth.uid).child('role').val() === 'hospital')"
        },
        "cleared_at": {
          ".write": "!data.exists() || (root.child('users').child(auth.uid).child('role').val() === 'admin' || root.child('users').child(auth.uid).child('role').val() === 'ambulance' || root.child('users').child(auth.uid).child('role').val() === 'hospital')"
        },
        "confirmations": {
          "$responder_uid": {
            ".write": "auth !== null && $responder_uid === auth.uid"
          }
        }
      }
    },
    "devices": {
      ".read": "auth !== null",
      "$device_id": {
        ".write": true,
        "cpr": {
          ".write": true,
          ".read": "auth !== null"
        },
        "environment": {
          ".write": true,
          ".read": "auth !== null"
        },
        "gesture": {
          ".write": true,
          ".read": "auth !== null"
        },
        "status": {
          ".write": true,
          ".read": "auth !== null"
        }
      }
    },
    "locations": {
      ".read": "auth !== null",
      ".write": "auth !== null"
    },
    "sensor_data": {
      ".read": true,
      ".write": true
    },
    "resqpulse": {
      ".read": true,
      ".write": true,
      "live": {
        ".read": true,
        ".write": true,
        ".indexOn": ["timestamp"]
      }
    }
  }
}
```

### Step 3: Paste in Firebase Console
1. Click on the **Rules** tab in your Firebase Realtime Database
2. Select all existing text (Ctrl+A)
3. Paste the rules above
4. Click **Publish**

### Step 4: Verify
You should see:
- ✅ "Rules published successfully"
- ✅ Green checkmark next to validation

---

## 📝 What These Rules Allow

| Path | Read | Write | Purpose |
|------|------|-------|---------|
| `/resqpulse/live` | ✅ Public | ✅ Public | Real-time sensor data |
| `/resqpulse/live/timestamp` | ✅ Public | ✅ Public | Indexed for queries |
| `/users/$uid` | ✅ Own + Admin | ✅ Own + Admin | User profiles |
| `/emergencies` | ✅ Authenticated | ✅ Authenticated | Emergency data |
| `/devices` | ✅ Authenticated | ✅ Public | Device info |
| `/locations` | ✅ Authenticated | ✅ Authenticated | Location data |
| `/sensor_data` | ✅ Public | ✅ Public | Historical sensor data |

---

## 🚀 After Publishing Rules

Your system will:
- ✅ ESP32 can write to `/resqpulse/live`
- ✅ Frontend can read from `/resqpulse/live`
- ✅ Real-time data updates work
- ✅ All dashboards display live sensor data

---

## Direct Link
Update rules here: https://console.firebase.google.com/project/myosa-finals-485aa/database/rules
