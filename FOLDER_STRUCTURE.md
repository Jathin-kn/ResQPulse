# ResqPulse IoT System - Complete Folder Structure

```
resqpulse-project/
├── firmware/                          # ESP32 firmware
│   ├── ResqPulse_ESP32.ino           # Main Arduino sketch
│   ├── config.h                      # Configuration file
│   ├── platformio.ini                # PlatformIO config (optional)
│   └── README.md                     # Firmware setup guide
│
├── backend/                          # FastAPI backend
│   ├── server.py                     # Main FastAPI application
│   ├── firebase_admin_config.py      # Firebase admin setup
│   ├── requirements.txt              # Python dependencies
│   └── README.md                     # Backend setup guide
│
├── frontend/                         # React web application
│   ├── src/
│   │   ├── components/               # Reusable UI components
│   │   │   ├── CPRMonitor.jsx        # CPR data visualization
│   │   │   ├── EnvironmentalMonitor.jsx # Environment charts
│   │   │   ├── GestureMonitor.jsx    # Gesture control interface
│   │   │   ├── LoadingStates.jsx     # Loading components
│   │   │   ├── ToastContainer.jsx    # Notification system
│   │   │   └── ui/                   # UI component library
│   │   │       ├── card.jsx
│   │   │       ├── badge.jsx
│   │   │       └── alert.jsx
│   │   ├── context/                  # React contexts
│   │   │   ├── AuthContext.jsx       # Authentication
│   │   │   ├── DataContext.jsx       # Firebase data
│   │   │   └── ToastContext.jsx      # Notifications
│   │   ├── pages/                    # Application pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── LiveMonitoring.jsx
│   │   │   ├── EmergencyLocation.jsx
│   │   │   ├── DeviceManagement.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── services/                 # API services
│   │   │   ├── emergencyService.js
│   │   │   ├── emailService.js
│   │   │   └── apiTest.js
│   │   ├── utils/                    # Utility functions
│   │   │   ├── validators.js
│   │   │   ├── accessibility.js
│   │   │   └── responsiveness.js
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useAsync.js
│   │   │   └── useLocalStorage.js
│   │   ├── App.jsx                   # Main app component
│   │   └── main.jsx                  # App entry point
│   ├── public/                       # Static assets
│   ├── package.json                  # Node dependencies
│   ├── vite.config.js                # Vite configuration
│   ├── tailwind.config.js            # Tailwind CSS config
│   ├── postcss.config.js             # PostCSS config
│   ├── .env.local                    # Environment variables
│   └── README.md                     # Frontend setup guide
│
├── firebase/                         # Firebase configuration
│   ├── firebase.json                 # Firebase project config
│   ├── database.rules.json           # Realtime Database rules
│   ├── firebase_config.json          # Service account key
│   └── .firebaserc                   # Project aliases
│
├── docs/                             # Documentation
│   ├── README.md                     # Main project README
│   ├── API_DOCUMENTATION.md          # Backend API docs
│   ├── ESP32_SETUP.md                # Hardware setup guide
│   ├── DEPLOYMENT_CHECKLIST.md       # Deployment checklist
│   ├── PRELAUNCH_CHECKLIST.md        # Pre-launch tasks
│   ├── QUICK_REFERENCE.md            # Developer reference
│   ├── SOS_CLEAR_GUIDE.md            # Emergency procedures
│   └── CIRCUIT_DIAGRAM.md            # Hardware schematics
│
├── scripts/                          # Utility scripts
│   ├── deploy.sh                     # Linux deployment
│   ├── deploy.ps1                    # Windows deployment
│   ├── setup.sh                      # Initial setup script
│   └── test.py                       # Testing utilities
│
├── .env                              # Backend environment variables
├── requirements.txt                  # Python dependencies (root)
├── package.json                      # Node dependencies (root)
└── docker-compose.yml                # Docker setup (optional)
```

## Data Flow Architecture

```
ESP32 Sensors → Firebase Realtime Database → React Frontend
       ↓              ↓                        ↓
   I2C Sensors    Structured Data         Live Dashboard
   - MPU6050      /devices/{id}/cpr        CPR Monitor
   - APDS9960     /devices/{id}/env        Environment Charts
   - BMP180       /devices/{id}/gesture    Gesture Control
   - SI7021       /devices/{id}/status     Device Status
   - SSD1306

FastAPI Backend (Optional - for additional processing)
       ↓
   Data Validation
   Analytics Processing
   Historical Storage
```

## Key Integration Points

### 1. ESP32 → Firebase
- Direct connection using FirebaseESP32 library
- Structured data sent to specific Firebase paths
- Real-time updates every 100ms

### 2. Firebase → React
- Firebase Realtime Database listeners
- Automatic UI updates on data changes
- Role-based data access control

### 3. React → FastAPI (Optional)
- RESTful API calls for complex operations
- Data validation and processing
- Historical data storage

## Development Workflow

1. **Hardware Setup**: Connect sensors to ESP32
2. **Firmware Development**: Program ESP32 with Arduino IDE
3. **Firebase Config**: Set up database rules and authentication
4. **Frontend Development**: Build React components
5. **Backend Integration**: Add FastAPI endpoints if needed
6. **Testing**: End-to-end testing with real hardware
7. **Deployment**: Deploy to production environment

## Environment Setup

### Prerequisites
- Arduino IDE with ESP32 support
- Node.js 18+ and npm
- Python 3.8+ and pip
- Firebase account and project

### Quick Start
```bash
# Clone repository
git clone <repository-url>
cd resqpulse-project

# Setup ESP32 firmware
cd firmware
# Open ResqPulse_ESP32.ino in Arduino IDE
# Update WiFi credentials in config.h
# Upload to ESP32

# Setup frontend
cd ../frontend
npm install
npm run dev

# Setup backend (optional)
cd ../backend
pip install -r requirements.txt
python server.py
```

This structure provides a complete, scalable IoT system with clear separation of concerns and maintainable codebase.