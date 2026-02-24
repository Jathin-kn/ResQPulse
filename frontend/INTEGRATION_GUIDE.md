# Frontend Integration Guide - ESP32 ResqPulse System

## Overview
The React frontend is now fully integrated with your ESP32 device that streams sensor data to Firebase. Real-time data flows from the ESP32 → Firebase → React Frontend automatically.

## What's Been Integrated

### 1. **DataContext Updates**
Updated [src/context/DataContext.jsx](src/context/DataContext.jsx) to listen to the `/resqpulse/live` Firebase path:
```javascript
// New listener for ESP32 real-time data
useEffect(() => {
  const liveRef = ref(database, 'resqpulse/live')
  const unsubscribe = onValue(liveRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      setSensorData({
        acceleration_x: data.accel_x || 0,
        acceleration_y: data.accel_y || 0,
        acceleration_z: data.accel_z || 0,
        temperature: data.temperature || 0,
        pressure: data.pressure || 0,
        proximity: data.proximity || 0,
        timestamp: Date.now(),
        source: 'esp32-live'
      })
    }
  })
  return () => off(liveRef)
}, [])
```

### 2. **New Component: ESP32SensorDisplay**
Created [src/components/ESP32SensorDisplay.jsx](src/components/ESP32SensorDisplay.jsx) - displays real-time sensor values:
- 🌡️ Temperature (°C)
- 📊 Pressure (hPa)
- 📡 Proximity (mm)
- ⚡ Acceleration Z-axis (m/s²)

Each metric includes visual indicators with color-coded cards and progress bars.

### 3. **Updated Pages**

#### Dashboard ([src/pages/Dashboard.jsx](src/pages/Dashboard.jsx))
- Added "Live Sensor Data" section showing ESP32 metrics
- Green indicator shows "Connected" status when data is streaming
- Displays only when `sensorData.source === 'esp32-live'`

#### Live Monitoring ([src/pages/LiveMonitoring.jsx](src/pages/LiveMonitoring.jsx))
- Added "ESP32 Sensor Data" section with comprehensive sensor display
- Shows all acceleration, temperature, pressure, and proximity values

## Data Flow

```
ESP32 Device
    ↓
Sends JSON to Firebase: /resqpulse/live
    {
      "accel_x": -0.45,
      "accel_y": 0.12,
      "accel_z": 9.81,
      "temperature": 28.5,
      "pressure": 1013.25,
      "proximity": 150
    }
    ↓
Firebase Realtime Database
    ↓
React DataContext (listens to /resqpulse/live)
    ↓
Components receive sensorData via useData() hook
    ↓
Dashboard & Live Monitoring pages display in real-time
```

## How to Use

### 1. **View Live Data on Dashboard**
Navigate to the Dashboard page - you'll see:
- Live Sensor Data section with 4 metric cards
- Real-time temperature, pressure, proximity, and acceleration readings
- Green "Connected" indicator when data is streaming

### 2. **Detailed Monitoring**
Go to Live Monitoring page for:
- Live status indicator showing connection status
- Historical data charts
- Detailed acceleration data (X, Y, Z axes)
- ESP32 Sensor Data section with all metrics

### 3. **Monitor in Console**
Open browser DevTools → Console to see:
- Real-time Firebase data updates
- Component re-renders when new sensor data arrives

## Checking Connection Status

The frontend will show:
- ✅ **Green "Connected" indicator** - ESP32 is streaming data
- ⏳ **"Waiting for ESP32 Connection"** - No data received yet

If you see the waiting message:
1. Verify ESP32 is powered on
2. Check WiFi connection status in Arduino Serial Monitor
3. Confirm WiFi SSID/password match in ESP32 code
4. Check Firebase credentials are correct

## Testing the Integration

### Step 1: Serial Monitor Check
Open Arduino IDE Serial Monitor (115200 baud):
- Should see "WiFi Connected"
- Should see "Firebase Connected"
- Should see "Data sent to Firebase" every ~1 second

### Step 2: Firebase Console Check
Go to [Firebase Console](https://console.firebase.google.com/):
1. Select your project: `resqpulse-demo`
2. Go to Realtime Database
3. Check if `/resqpulse/live` path has data
4. Look for `accel_x`, `accel_y`, `accel_z`, `temperature`, `pressure`, `proximity` fields

### Step 3: Frontend Check
1. Start the React dev server: `npm run dev`
2. Navigate to Dashboard page
3. Check if "Live Sensor Data" section appears
4. Move the ESP32 device to see acceleration values change
5. Check temperature and pressure updates

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No "Live Sensor Data" section shows up | Check Serial Monitor - confirm "Data sent to Firebase" messages |
| Sensor values showing 0 | Device may not be initialized. Check ESP32 Serial Monitor for sensor errors |
| Data not updating | Verify WiFi connection in Serial Monitor. Check Firebase rules allow write to `/resqpulse/live` |
| "Waiting for ESP32 Connection" | Check if `/resqpulse/live` exists in Firebase. May need to wait 1-2 seconds for first update |

## Firebase Rules
Make sure your Firebase Realtime Database rules allow the ESP32 to write:
```json
{
  "rules": {
    "resqpulse": {
      "live": {
        ".write": true,
        ".read": true
      }
    }
  }
}
```

## Data Format During Transmission

**ESP32 sends (every 1 second):**
```json
{
  "accel_x": -0.45,
  "accel_y": 0.12,
  "accel_z": 9.81,
  "temperature": 28.5,
  "pressure": 1013.25,
  "proximity": 150
}
```

**Frontend receives and transforms:**
```javascript
{
  acceleration_x: -0.45,
  acceleration_y: 0.12,
  acceleration_z: 9.81,
  temperature: 28.5,
  pressure: 1013.25,
  proximity: 150,
  timestamp: 1708600000000,
  source: 'esp32-live'
}
```

## Next Steps

1. **Start Frontend**: `cd frontend && npm install && npm run dev`
2. **Check Dashboard**: Navigate to localhost:5173/dashboard
3. **Monitor Real-time Data**: You should see live sensor readings
4. **Deploy**: When ready, build with `npm run build`

## Files Modified
- ✏️ [src/context/DataContext.jsx](src/context/DataContext.jsx) - Added ESP32 listener
- ✏️ [src/pages/Dashboard.jsx](src/pages/Dashboard.jsx) - Added sensor display section
- ✏️ [src/pages/LiveMonitoring.jsx](src/pages/LiveMonitoring.jsx) - Added ESP32 sensor data component
- ✨ [src/components/ESP32SensorDisplay.jsx](src/components/ESP32SensorDisplay.jsx) - NEW component

## Support
If data isn't flowing:
1. Check ESP32 Serial Monitor for errors
2. Verify Firebase Realtime Database shows `/resqpulse/live` with data
3. Ensure React app can reach Firebase (no network/CORS issues)
4. Check browser console for errors
