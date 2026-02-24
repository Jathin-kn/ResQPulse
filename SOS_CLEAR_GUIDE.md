# ResqPulse - SOS Clear System Guide

**Version**: 1.0.0  
**Last Updated**: February 5, 2026  
**Status**: ✅ Fully Implemented & Working

---

## 🚨 Overview

The Emergency SOS Clearing System allows authenticated responders to mark emergency signals as cleared/resolved. The system provides real-time status tracking, user attribution, and comprehensive audit trails.

---

## 🎯 How It Works

### 1. **Trigger Emergency SOS**
- User clicks "Trigger Emergency SOS" in Dashboard
- System auto-detects GPS location
- Creates emergency record in Firebase with `status: 'active'`
- Shows in Emergency Response page

### 2. **View Active Emergencies**
- Go to Emergency Response page
- See list of all active emergencies on map
- Select emergency to view details

### 3. **Clear Emergency SOS**
- Click "Clear Emergency SOS" button (only shows for active emergencies)
- Confirmation dialog appears
- Upon confirmation:
  - Status updated to `'cleared'`
  - Current user UID recorded as `cleared_by`
  - Timestamp recorded as `cleared_at`
  - Success toast notification shown
  - Emergency disappears from active list

---

## 📊 Data Structure

### Emergency Record in Firebase

```json
{
  "emergencies": {
    "emergency_abc123": {
      "device_id": "device_xyz",
      "status": "cleared",
      "type": "CPR Required",
      "location": "123 Main St",
      "latitude": 28.7041,
      "longitude": 77.1025,
      "patient_status": "Critical",
      "created_at": "2026-02-05T12:00:00.000Z",
      "updated_at": "2026-02-05T12:30:00.000Z",
      
      // SOS Clearing Fields
      "cleared_by": "user_uid_12345",
      "cleared_at": "2026-02-05T12:30:00.000Z",
      
      "triggered_by": "admin",
      "responders_notified": 3
    }
  }
}
```

### Status Values

| Status | Meaning | Next State |
|--------|---------|-----------|
| `active` | Emergency in progress | `in-progress`, `cleared`, `cancelled` |
| `in-progress` | Responders responding | `cleared`, `cancelled` |
| `cleared` | Emergency resolved | (final state) |
| `cancelled` | False alarm | (final state) |

---

## 🔧 Functions

### 1. **clearEmergencySOS(emergencyId, clearedBy)**

Marks an emergency as cleared.

**Location**: `src/services/emergencyService.js`

**Parameters**:
```javascript
emergencyId: string   // Firebase emergency ID
clearedBy: string     // User UID who cleared it
```

**Returns**:
```javascript
{
  success: true,
  message: "Emergency SOS cleared successfully"
}
```

**Example**:
```javascript
import { clearEmergencySOS } from '@/services/emergencyService'

try {
  await clearEmergencySOS('emergency_abc123', 'user_xyz')
  console.log('SOS cleared!')
} catch (err) {
  console.error('Error:', err.message)
}
```

### 2. **updateEmergencyStatus(emergencyId, newStatus, updatedBy)**

Generic status update function.

**Parameters**:
```javascript
emergencyId: string   // Firebase emergency ID
newStatus: string     // One of: active, in-progress, cleared, cancelled
updatedBy: string     // User UID
```

**Returns**:
```javascript
{
  success: true,
  message: "Emergency status updated to {newStatus}"
}
```

**Example**:
```javascript
import { updateEmergencyStatus } from '@/services/emergencyService'

// Update to in-progress
await updateEmergencyStatus('emergency_abc123', 'in-progress', 'paramedic_123')

// Update to cancelled
await updateEmergencyStatus('emergency_abc123', 'cancelled', 'admin_456')
```

### 3. **getEmergencyDetails(emergencyId)**

Fetch full emergency record.

**Parameters**:
```javascript
emergencyId: string   // Firebase emergency ID
```

**Returns**:
```javascript
{
  id: "emergency_abc123",
  status: "cleared",
  cleared_by: "user_xyz",
  cleared_at: "2026-02-05T12:30:00.000Z",
  // ... other fields
}
```

**Example**:
```javascript
import { getEmergencyDetails } from '@/services/emergencyService'

const emergency = await getEmergencyDetails('emergency_abc123')
console.log(emergency.status)      // "cleared"
console.log(emergency.cleared_by)  // "user_xyz"
console.log(emergency.cleared_at)  // "2026-02-05T12:30:00.000Z"
```

---

## 🖥️ UI Components

### Emergency Response Page

**Location**: `src/pages/EmergencyLocation.jsx`

**Features**:
- Emergency list with status indicators
- Map showing emergency locations
- Emergency details panel
- Action buttons (Clear SOS, Confirm Signal)
- Status badges (red for active, green for cleared)
- Confirmation dialog
- Toast notifications

**Clear Button States**:
```
Active Emergency:
├─ Button visible: "Clear Emergency SOS" (red)
└─ Click → Confirmation dialog → Success toast

Cleared Emergency:
└─ Button hidden
   Display: "✓ Emergency Cleared at [time]" (green)
```

---

## 🔐 Permissions & Security

### Firebase Rules

```json
{
  "emergencies": {
    ".read": "auth !== null",
    ".write": "auth !== null && (role === 'admin' || role === 'ambulance' || role === 'responder')"
  }
}
```

**Who Can Clear SOS?**
- ✅ Admin users
- ✅ Ambulance users
- ✅ Responder users
- ❌ Hospital users (read-only)

### User Role Assignment

**Signup Roles**:
- Default: `ambulance` (has write permissions)
- Can also select: `responder`, `admin`, `hospital`

**Change in Firebase Console**:
1. Go to Realtime Database
2. Navigate to `users/{uid}/role`
3. Update value

---

## 🧪 Testing SOS Clearing

### Manual Testing Steps

1. **Create Test Account**
   - Go to `/signup`
   - Enter email/password (role: ambulance by default)
   - Verify email and login

2. **Trigger SOS**
   - Go to `/dashboard`
   - Click "Trigger Emergency SOS"
   - Fill location (auto-detected)
   - Confirm

3. **Clear SOS**
   - Go to `/emergency`
   - Find triggered emergency in list
   - Click "Clear Emergency SOS"
   - Confirm in dialog
   - Verify:
     - Toast shows "Emergency SOS cleared successfully!"
     - Emergency disappears from active list
     - Status badge turns green (if visible in history)

### Testing Different Roles

```javascript
// Test with different roles
const testRoles = ['admin', 'ambulance', 'responder', 'hospital']

for (const role of testRoles) {
  // Create account with role
  // Try to clear SOS
  // Record if successful
}
```

### Check Firebase

```
Firebase Console → Realtime Database → emergencies
Check fields:
- status: "cleared" ✓
- cleared_by: "user_uid" ✓
- cleared_at: "[timestamp]" ✓
- updated_at: "[timestamp]" ✓
```

---

## ⚠️ Troubleshooting

### Issue 1: Button Doesn't Respond
**Cause**: User not authenticated  
**Solution**: Logout and login again

### Issue 2: Permission Denied Error
**Cause**: User role doesn't have write permission  
**Solution**: Check user role in Firebase Console, update if needed

### Issue 3: Emergency Doesn't Update
**Cause**: Firebase listener not receiving update  
**Solution**: 
1. Check browser console for errors
2. Refresh page
3. Check Firebase rules

### Issue 4: Toast Not Showing
**Cause**: ToastContainer not in DOM  
**Solution**: Verify ToastContainer in App.jsx layout

---

## 📱 Integration Examples

### In Custom Component

```jsx
import { useToast } from '@/context/ToastContext'
import { useAuth } from '@/context/AuthContext'
import { clearEmergencySOS } from '@/services/emergencyService'

function CustomEmergencyControl({ emergencyId }) {
  const { success, error: showError } = useToast()
  const { currentUser } = useAuth()
  const [clearing, setClearing] = useState(false)
  
  const handleClear = async () => {
    if (!currentUser?.uid) {
      showError('Not authenticated')
      return
    }
    
    setClearing(true)
    try {
      await clearEmergencySOS(emergencyId, currentUser.uid)
      success('Emergency cleared!')
    } catch (err) {
      showError(`Failed: ${err.message}`)
    } finally {
      setClearing(false)
    }
  }
  
  return (
    <button onClick={handleClear} disabled={clearing}>
      {clearing ? 'Clearing...' : 'Clear Emergency'}
    </button>
  )
}
```

### In Admin Dashboard

```jsx
function AdminDashboard() {
  const { emergencies } = useData()
  const activeEmergencies = emergencies.filter(e => e.status === 'active')
  const clearedEmergencies = emergencies.filter(e => e.status === 'cleared')
  
  return (
    <div>
      <h2>Active: {activeEmergencies.length}</h2>
      <h2>Cleared: {clearedEmergencies.length}</h2>
      
      {/* List and manage emergencies */}
    </div>
  )
}
```

---

## 📊 Audit Trail

All clears are recorded with:
- **User ID** - Who cleared it
- **Timestamp** - When it was cleared
- **Previous Status** - Was always 'active'
- **New Status** - Always 'cleared'

**Query cleared emergencies**:
```javascript
const clearedEmergencies = emergencies.filter(e => e.status === 'cleared')

clearedEmergencies.forEach(e => {
  console.log(`${e.id} cleared by ${e.cleared_by} at ${e.cleared_at}`)
})
```

---

## 🚀 Performance Notes

- Firebase update takes < 100ms
- UI updates automatically via listeners
- No manual refresh needed
- Works offline (sync on reconnect)

---

## 📚 Related Files

- Emergency Service: `src/services/emergencyService.js`
- Emergency Page: `src/pages/EmergencyLocation.jsx`
- Auth Context: `src/context/AuthContext.jsx`
- Data Context: `src/context/DataContext.jsx`
- Firebase Rules: `database.rules.json`

---

## ✅ Feature Checklist

- ✅ Trigger SOS from Dashboard
- ✅ View active emergencies
- ✅ Clear SOS with confirmation
- ✅ Record cleared_by and cleared_at
- ✅ Update status to 'cleared'
- ✅ Show success toast
- ✅ Remove from active list
- ✅ Show cleared status badge
- ✅ Permission-based access
- ✅ Real-time updates via Firebase

---

**Status**: ✅ Fully Implemented  
**Last Tested**: February 5, 2026  
**Known Issues**: None

