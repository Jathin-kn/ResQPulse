# ResqPulse - CPR Assistance Dashboard

A modern, market-ready React 18+ frontend for the ResqPulse IoT-Based CPR Assistance System.

## 🚀 Features

### 📊 Real-Time CPR Monitoring Dashboard
- Compression rate monitoring (0-130 bpm, target 100-120)
- Compression depth tracking (0-8 cm, target 5-6)
- Pressure readings and quality scores
- Live device connection status
- System health overview

### 📡 Live Monitoring Page
- Real-time acceleration tracking (X, Y, Z axes)
- Pressure gauge visualization
- Proximity indicators
- Data stream status

### 📈 Analytics & Session History
- Session history with filtering
- Quality trend analysis
- Performance metrics
- Success rate tracking
- Total compressions performed

### 🔧 Device Management
- Connected CPR device list
- Battery and signal strength monitoring
- Device status indicators
- Last sync timestamps

### 🚨 Emergency Response
- Active emergency signal tracking
- GPS coordinate display
- Nearest responder information
- Emergency action controls

### 👤 User Management
- Firebase Authentication
- Demo mode fallback (demo@resqpulse.com / demo123)
- Profile settings
- Role-based access

### ⚙️ Settings Page
- User preferences
- Theme control (dark mode)
- Notification settings
- Security options

## 🛠 Tech Stack

- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **Routing**: React Router v6
- **State Management**: React Context API
- **Authentication**: Firebase Authentication
- **Database**: Firebase Realtime Database
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📦 Installation

```bash
cd frontend
npm install
```

## 🚀 Development

```bash
npm run dev
```

Starts the development server at `http://localhost:3000`

## 🏗 Production Build

```bash
npm run build
```

Builds the project for production in the `dist` folder

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navigation.jsx
│   ├── Layout.jsx
│   ├── ProtectedRoute.jsx
│   ├── MetricCard.jsx
│   └── GaugeChart.jsx
├── context/            # Context providers
│   ├── AuthContext.jsx
│   ├── ThemeContext.jsx
│   └── DataContext.jsx
├── hooks/              # Custom hooks
│   ├── useLocalStorage.js
│   └── useAsync.js
├── pages/              # Page components
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── LiveMonitoring.jsx
│   ├── Analytics.jsx
│   ├── DeviceManagement.jsx
│   ├── EmergencyLocation.jsx
│   └── Settings.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## 🔐 Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_REACT_APP_BACKEND_URL=http://localhost:8000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_FIREBASE_DATABASE_URL=your_firebase_database_url
```

## 🔑 Demo Credentials

For testing without Firebase:
- **Email**: demo@resqpulse.com
- **Password**: demo123

## 📖 Pages

### Public Pages
- **Landing** (`/`) - Feature highlights and call-to-action
- **Login** (`/login`) - Authentication

### Protected Pages (Require Login)
- **Dashboard** (`/dashboard`) - Main monitoring dashboard
- **Live Monitoring** (`/live-monitoring`) - Real-time sensor data
- **Analytics** (`/analytics`) - Performance analytics
- **Device Management** (`/devices`) - Device status and management
- **Emergency Response** (`/emergency`) - Active emergency tracking
- **Settings** (`/settings`) - User preferences and security

## 🎨 Customization

### Theme
The application includes a dark mode theme toggle. Styling is done with Tailwind CSS and custom CSS variables.

### API Integration
Update `VITE_REACT_APP_BACKEND_URL` in `.env` to point to your backend API.

### Firebase Configuration
Update Firebase environment variables to connect to your Firebase project.

## 📊 Real-Time Data

The application connects to:
- **Firebase Realtime Database** for sensor data streaming
- **REST API** for session history and analytics

## 🤝 Contributing

This is a market-ready template. Customize components as needed for your use case.

## 📄 License

Proprietary - ResqPulse CPR Assistance System

## 📞 Support

For issues or questions, refer to the documentation or contact support.

---

**Version**: 1.0.0
**Build**: 2026.02.04
**Status**: Production Ready
