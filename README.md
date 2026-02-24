# ResqPulse - IoT CPR Emergency Monitoring System

**Status**: MVP Ready for Beta Launch with IoT Integration  
**Last Updated**: February 5, 2026  
**Version**: 1.0.0

---

## 🎯 Project Overview

ResqPulse is a comprehensive IoT-based CPR monitoring and emergency response system designed for emergency responders, hospitals, and ambulance services. The platform integrates hardware sensors with real-time monitoring, providing live CPR quality feedback and instant emergency coordination.

### Key Features
- ✅ **IoT Hardware Integration**: ESP32 with 5 I2C sensors for comprehensive monitoring
- ✅ **Servo Motor Feedback**: 720° clockwise + 720° counterclockwise rotation synchronized with CPR rate
- ✅ **Real-time CPR Quality Monitoring**: Live compression rate, depth, and quality metrics
- ✅ **Environmental Monitoring**: Temperature, humidity, pressure, and altitude tracking
- ✅ **Gesture Control**: APDS9960 proximity and gesture detection for hands-free operation
- ✅ **Emergency SOS Response System**: Instant alert triggering with auto-location
- ✅ **Live Location Tracking**: GPS-based emergency response coordination
- ✅ **Analytics & Session History**: Historical data analysis and performance metrics
- ✅ **Role-Based Access Control**: Multi-level user permissions
- ✅ **Multi-Device Coordination**: Support for multiple ESP32 devices
- ✅ **Toast Notifications & User Feedback**: Real-time system notifications
- ✅ **Mobile Responsive Design**: Optimized for tablets and mobile devices

---

## 📁 Complete Project Structure

```
tru/
├── firmware/                          # ESP32 firmware
│   ├── ResqPulse_ESP32.ino           # Main Arduino sketch
│   ├── config.h                      # WiFi/Firebase config
│   └── README.md                     # Firmware setup guide
├── backend/                          # FastAPI backend
│   ├── server.py                     # FastAPI application
│   ├── firebase_admin_config.py      # Firebase admin setup
│   ├── requirements.txt              # Python dependencies
│   └── README.md                     # Backend setup guide
├── frontend/                         # React web application
│   ├── src/
│   │   ├── components/               # UI components
│   │   │   ├── CPRMonitor.jsx        # CPR data visualization
│   │   │   ├── EnvironmentalMonitor.jsx # Environment charts
│   │   │   ├── GestureMonitor.jsx    # Gesture control
│   │   │   └── LoadingStates.jsx     # Loading components
│   │   ├── context/                  # React contexts
│   │   ├── pages/                    # Application pages
│   │   ├── services/                 # API services
│   │   └── utils/                    # Utility functions
│   ├── package.json
│   └── vite.config.js
├── firebase/                         # Firebase configuration
│   ├── firebase.json                 # Project config
│   ├── database.rules.json           # Security rules
│   └── firebase_config.json          # Service account
├── docs/                             # Documentation
└── scripts/                          # Deployment scripts
```

---

## 🔧 Hardware Requirements

### ESP32 Development Board
- ESP32-WROOM-32 or ESP32-S3
- Micro-USB cable for programming
- 5V power supply

### I2C Sensors
- **MPU6050**: Accelerometer/Gyroscope (CPR motion detection)
- **APDS9960**: Proximity/Gesture sensor (hands-free control)
- **BMP180**: Pressure/Altitude sensor (environmental monitoring)
- **SI7021**: Temperature/Humidity sensor
- **SSD1306**: 0.96" OLED Display (128x64)

### Servo Motor
- **Standard Servo Motor**: 0-180° range (Tower Pro SG90 or similar)
- **Continuous Rotation Servo**: Optional for smoother 720° movement
- **Power Supply**: 5V for servo motor

### Circuit Connections
```
ESP32 Pinout:
- SDA: GPIO 21
- SCL: GPIO 22
- SERVO: GPIO 13
- VCC: 3.3V
- GND: GND

Sensor Addresses:
- MPU6050: 0x68
- APDS9960: 0x39
- BMP180: 0x77
- SI7021: 0x40
- SSD1306: 0x3C
```

---

## 🚀 Complete Setup Instructions

### Prerequisites
- Arduino IDE 2.0+ with ESP32 support
- Node.js 18+ and npm
- Python 3.8+ and pip
- Firebase account and project
- ESP32 development board with sensors

### 1. ESP32 Firmware Setup

```bash
# Install Arduino IDE and ESP32 Board Support
# 1. Download Arduino IDE from arduino.cc
# 2. Add ESP32 board support via Board Manager
# 3. Install required libraries:
#    - FirebaseESP32
#    - Adafruit MPU6050
#    - Adafruit APDS9960
#    - Adafruit BMP085 (for BMP180)
#    - Adafruit Si7021
#    - Adafruit SSD1306
#    - Adafruit GFX Library
#    - ArduinoJson

# Open firmware/ResqPulse_ESP32.ino
# Update WiFi credentials in config.h
# Update Firebase project details
# Upload to ESP32 board
```

### 2. Firebase Configuration

```bash
# Deploy database rules
firebase deploy --only database

# Update firebase_config.json with your service account key
# Copy from Firebase Console > Project Settings > Service Accounts
```

### 3. Backend Setup (Optional)

```bash
cd backend
pip install -r requirements.txt
python server.py
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will run on **http://localhost:5173**

---

## 📊 Data Flow Architecture

```
ESP32 Sensors → Firebase Realtime Database → React Frontend
       ↓              ↓                        ↓
   I2C Sensors    Structured Data         Live Dashboard
   - MPU6050      /devices/{id}/cpr        CPR Monitor
   - APDS9960     /devices/{id}/env        Environment Charts
   - BMP180       /devices/{id}/gesture    Gesture Control
   - SI7021       /devices/{id}/status     Device Status
   - SSD1306

FastAPI Backend (Optional)
       ↓
   Data Validation
   Analytics Processing
   Historical Storage
```

### Firebase Database Structure

```json
{
  "devices": {
    "esp32_001": {
      "cpr": {
        "compression_rate": 120,
        "compression_depth": 5.2,
        "quality_score": 85,
        "timestamp": 1640995200000
      },
      "environment": {
        "temperature": 25.3,
        "humidity": 65.2,
        "pressure": 1013.25,
        "altitude": 150.5,
        "timestamp": 1640995200000
      },
      "gesture": {
        "gesture_type": "swipe_up",
        "proximity": 45,
        "timestamp": 1640995200000
      },
      "status": {
        "battery_level": 85,
        "wifi_signal": -45,
        "sos_triggered": false,
        "last_update": 1640995200000
      }
    }
  }
}
```

---

## 📖 Pages & Routes

| Page | Route | Role | Status | Description |
|------|-------|------|--------|-------------|
| Landing | `/` | Public | ✅ Ready | Marketing page |
| Login | `/login` | Public | ✅ Ready | User authentication |
| Signup | `/signup` | Public | ✅ Ready | User registration |
| Dashboard | `/dashboard` | Authenticated | ✅ Ready | Main dashboard |
| Live Monitoring | `/monitoring` | Responder+ | ✅ Ready | Real-time sensor data |
| Emergency Location | `/emergency` | Responder+ | ✅ Ready | SOS response interface |
| Device Management | `/devices` | Admin | ✅ Ready | ESP32 device management |
| Analytics | `/analytics` | Admin | ✅ Ready | Historical data analysis |
| Admin Dashboard | `/admin` | Admin | ✅ Ready | System administration |
| Settings | `/settings` | Authenticated | ✅ Ready | User preferences |

---

## 👥 User Roles & Permissions

1. **Admin** - Full system access, device management, user management, analytics
2. **Hospital** - Can view emergencies, manage devices, access analytics
3. **Ambulance** - Can respond to emergencies, update device status, trigger SOS
4. **Responder** - Can view emergencies, monitor devices, clear SOS alerts

---

## 🛠️ Technology Stack

**Hardware:**
- ESP32 Microcontroller
- I2C Sensor Array (MPU6050, APDS9960, BMP180, SI7021, SSD1306)

**Firmware:**
- Arduino IDE with ESP32 support
- FirebaseESP32 Library
- Adafruit Sensor Libraries

**Frontend:**
- React 18.3.1 with Vite
- Tailwind CSS for styling
- Firebase SDK for real-time data
- Recharts for data visualization
- Lucide Icons

**Backend:**
- FastAPI with Pydantic validation
- Firebase Admin SDK
- Optional: MongoDB for historical data

**Database:**
- Firebase Realtime Database
- Firebase Authentication
- Firebase Security Rules

---

## 📊 IoT Features Implemented

### 1. Servo Motor CPR Feedback ✅
- 720° clockwise rotation synchronized with compressions
- 720° counterclockwise rotation for complete cycle
- Speed adjustment based on CPR compression rate
- Visual feedback on OLED display (CW/CCW/STOP)
- **Location**: `firmware/ResqPulse_ESP32.ino`

### 2. CPR Quality Monitoring ✅
- Real-time compression rate calculation
- Compression depth measurement
- Quality score algorithm
- Visual feedback on OLED display
- **Location**: `firmware/ResqPulse_ESP32.ino`

### 3. Environmental Monitoring ✅
- Temperature and humidity tracking
- Atmospheric pressure measurement
- Altitude calculation
- Historical data charting
- **Location**: `frontend/src/components/EnvironmentalMonitor.jsx`

### 4. Gesture Control ✅
- Proximity detection for hands-free operation
- Gesture recognition (swipe up/down/left/right)
- SOS gesture triggering
- Activity logging
- **Location**: `frontend/src/components/GestureMonitor.jsx`

### 4. Device Status Monitoring ✅
- Battery level monitoring
- WiFi signal strength
- Connection status
- Last update timestamp
- **Location**: Firebase `/devices/{id}/status`

### 5. Real-Time Data Synchronization ✅
- ESP32 → Firebase direct communication
- React real-time listeners
- Auto-update across all connected clients
- **Location**: `frontend/src/context/DataContext.jsx`

---

## 🔧 Firebase Security Rules

```json
{
  "rules": {
    "devices": {
      "$deviceId": {
        ".read": "authenticated",
        ".write": "authenticated",
        "cpr": {
          ".validate": "newData.hasChildren(['compression_rate', 'compression_depth', 'quality_score', 'timestamp'])"
        },
        "environment": {
          ".validate": "newData.hasChildren(['temperature', 'humidity', 'pressure', 'altitude', 'timestamp'])"
        },
        "gesture": {
          ".validate": "newData.hasChildren(['gesture_type', 'proximity', 'timestamp'])"
        },
        "status": {
          ".validate": "newData.hasChildren(['battery_level', 'wifi_signal', 'sos_triggered', 'last_update'])"
        }
      }
    },
    "emergencies": {
      ".read": "authenticated",
      ".write": "authenticated && (root.child('users').child(auth.uid).child('role').val() == 'admin' || root.child('users').child(auth.uid).child('role').val() == 'ambulance' || root.child('users').child(auth.uid).child('role').val() == 'responder')"
    },
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() == 'admin'",
        ".write": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() == 'admin'"
      }
    }
  }
}
```

---

## 🚀 Deployment

### ESP32 Firmware
```bash
# Connect ESP32 to computer
# Open Arduino IDE
# Load ResqPulse_ESP32.ino
# Update WiFi and Firebase credentials
# Upload firmware
```

### Frontend (Vercel/Firebase Hosting)
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

### Backend (Optional)
```bash
cd backend
pip install -r requirements.txt
python server.py
```

### Environment Variables
```bash
# Frontend (.env.local)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com

# Backend (.env)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
```

---

## 📋 Pre-Launch Checklist

- ✅ ESP32 firmware with all sensors integrated
- ✅ Firebase database structure configured
- ✅ React components for all sensor data
- ✅ FastAPI backend with data validation
- ✅ Real-time data synchronization
- ✅ Authentication and role-based access
- ✅ Emergency SOS system
- ✅ Mobile responsive design
- ✅ Hardware circuit connections documented
- ✅ Deployment scripts ready
- 🟡 End-to-end testing with physical hardware
- 🟡 Performance optimization
- 🟡 Security audit

---

## 🐛 Troubleshooting

### ESP32 Connection Issues
- Check WiFi credentials in `config.h`
- Verify Firebase project configuration
- Ensure all sensor I2C addresses are correct
- Check serial monitor for error messages

### Firebase Data Not Appearing
- Verify database rules are deployed
- Check Firebase project permissions
- Ensure device ID matches in ESP32 code
- Test with Firebase console

### React Components Not Updating
- Check Firebase listeners in DataContext
- Verify device ID consistency
- Test network connectivity
- Check browser console for errors

---

## 📚 Documentation

- `FOLDER_STRUCTURE.md` - Complete project organization
- `ESP32_SETUP.md` - Hardware assembly guide
- `API_DOCUMENTATION.md` - Backend API reference
- `DEPLOYMENT_CHECKLIST.md` - Launch preparation
- `QUICK_REFERENCE.md` - Developer quick reference
- `SOS_CLEAR_GUIDE.md` - Emergency response procedures

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/sensor-integration`
3. Make changes and test with hardware
4. Update documentation
5. Submit pull request

---

## 📞 Support

For technical issues or questions:
- Check documentation in `docs/` folder
- Test with provided example configurations
- Verify hardware connections match circuit diagram

---

## 📄 License

© 2026 ResqPulse. All rights reserved.

---

**Last Updated**: February 5, 2026  
**Version**: 1.0.0-IoT  
**Status**: 🟢 Ready for Beta Launch with IoT Integration
