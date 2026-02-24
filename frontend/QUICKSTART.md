# Frontend Quick Start - ResqPulse

## Prerequisites
- Node.js 16+ installed
- Firebase project configured
- ESP32 running and connected to WiFi
- ESP32 sending data to Firebase at `/resqpulse/live`

## Quick Setup (5 minutes)

### 1. Install Dependencies
```powershell
cd frontend
npm install
```

### 2. Start Development Server
```powershell
npm run dev
```
The app will open at `http://localhost:5173`

### 3. Check Dashboard
1. Go to **Dashboard** page (from sidebar)
2. Look for **"Live Sensor Data"** section
3. You should see 4 metric cards:
   - 🌡️ Temperature (°C)
   - 📊 Pressure (hPa)
   - 📡 Proximity (mm)
   - ⚡ Accel Z (m/s²)

### 4. Verify Data Flow
If you see the metrics updating in real-time, **integration is complete!** ✅

## Testing Sensor Data

### Movement Detection
Move the ESP32 device to see acceleration change:
1. Hold device normally → `Accel Z ≈ 9.8`
2. Move up/down → Values should change rapidly
3. See values update on Dashboard in real-time

### Temperature Changes
The BMP085 sensor will show:
- Room temperature (usually 20-30°C)
- If you heat/cool device, values should update

### Proximity Sensor
The APDS9960 proximity shows distance:
- Place hand near sensor → values decrease
- Move hand away → values increase
- Normal range: 50-255mm

## Troubleshooting

### ❌ No "Live Sensor Data" section
**Cause:** ESP32 not sending data to Firebase
**Fix:**
1. Check ESP32 Serial Monitor (115200 baud): should see "Data sent to Firebase"
2. Verify Firebase path `/resqpulse/live` has data: https://console.firebase.google.com/
3. Wait 1-2 seconds for first data update

### ❌ All values show 0
**Cause:** Sensors not initialized
**Fix:**
1. Open Arduino Serial Monitor
2. Look for sensor initialization messages
3. Check Serial Monitor for setup errors
4. Verify I2C connections (SDA=GPIO21, SCL=GPIO22)

### ❌ Data stops updating
**Cause:** WiFi disconnected or Firebase connection lost
**Fix:**
1. Check Serial Monitor for WiFi/Firebase errors
2. Power cycle ESP32
3. Verify WiFi credentials match in Arduino code

## Full Page Tour

### Dashboard Page
Shows:
- Live sensor data cards
- Compression metrics (if CPR mode available)
- Emergency SOS button
- Device status

### Live Monitoring Page  
Shows:
- Real-time status indicator
- Historical charts
- Detailed acceleration readings
- All ESP32 sensor data

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Check for code errors |

## Environment Variables
Check [.env](../.env) for Firebase configuration:
```
VITE_FIREBASE_DATABASE_URL=https://resqpulse-demo-default-rtdb.asia-southeast1.firebasedatabase.app
```

## Next Steps
1. ✅ Start frontend
2. ✅ Check Dashboard for live data
3. ✅ Test sensor readings by moving device
4. Ready to customize or deploy!

## Full Documentation
See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for detailed architecture and troubleshooting.
