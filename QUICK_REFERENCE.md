# ResqPulse MVP - Quick Reference Guide

## 🚀 Quick Start

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start dev server (runs on http://localhost:3001)
npm run dev
```

---

## 📍 Key File Locations

### Pages
- Dashboard: `src/pages/Dashboard.jsx`
- Emergency Response: `src/pages/EmergencyLocation.jsx`
- Device Management: `src/pages/DeviceManagement.jsx`
- Admin Dashboard: `src/pages/AdminDashboard.jsx`
- Settings: `src/pages/Settings.jsx`
- Analytics: `src/pages/Analytics.jsx`

### Context (Global State)
- Authentication: `src/context/AuthContext.jsx`
- Data: `src/context/DataContext.jsx`
- Toast Notifications: `src/context/ToastContext.jsx`

### Services
- Emergency: `src/services/emergencyService.js`
- Email: `src/services/emailService.js`

### Utilities
- Validators: `src/utils/validators.js`
- Accessibility: `src/utils/accessibility.js`
- Responsiveness: `src/utils/responsiveness.js`

### Components
- Loading States: `src/components/LoadingStates.jsx`
- Toast Container: `src/components/ToastContainer.jsx`
- Layout: `src/components/Layout.jsx`
- Map: `src/components/MapComponent.jsx`

---

## 💻 Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## 🔌 Firebase Setup

### Credentials
- Project: `myosa-9871`
- Database URL: `https://myosa-9871-default-rtdb.firebaseio.com`
- Service Account: `myosa-9871-firebase-adminsdk-fbsvc-be6dc3c8b6.json`

### Environment Variables
Create `.env.local` in frontend directory:

```env
VITE_FIREBASE_API_KEY=AIzaSyBYmTkAcb9ax-dw2GyqWpLOVbnJZzfNicE
VITE_FIREBASE_AUTH_DOMAIN=myosa-9871.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=myosa-9871
VITE_FIREBASE_DATABASE_URL=https://myosa-9871-default-rtdb.firebaseio.com
VITE_FIREBASE_STORAGE_BUCKET=myosa-9871.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=548617449270
VITE_FIREBASE_APP_ID=1:548617449270:web:c93bc99fc0113a2417cd97
```

---

## 👥 Default Test Accounts

### Admin Account
- Email: `admin@example.com`
- Password: `password123`
- Role: Admin

### Responder Account
- Email: `responder@example.com`
- Password: `password123`
- Role: Responder

### Ambulance Account
- Email: `ambulance@example.com`
- Password: `password123`
- Role: Ambulance

---

## 🧪 Testing SOS Feature

1. Go to Dashboard
2. Click "Trigger Emergency SOS"
3. Fill in emergency details
4. Confirm SOS
5. Go to Emergency Response page
6. Click "Clear Emergency SOS"
7. Confirm clearing
8. Should see success toast and emergency disappears

---

## 🔐 User Roles & Permissions

| Role | Emergency Read | Emergency Write | Device Mgmt | Analytics |
|------|---|---|---|---|
| Admin | ✅ | ✅ | ✅ | ✅ |
| Ambulance | ✅ | ✅ | ❌ | ❌ |
| Responder | ✅ | ✅ | ❌ | ❌ |
| Hospital | ✅ | ❌ | ❌ | ✅ |

---

## 🐛 Common Issues & Solutions

### Issue: Port 3001 already in use
```powershell
# Kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Issue: Firebase permission denied
- Check user role in Firebase Console
- Ensure user has correct role: admin, ambulance, or responder
- Clear browser cache and re-login

### Issue: Blank page on load
- Check browser console (F12) for errors
- Verify Firebase credentials in .env.local
- Clear node_modules and reinstall: `rm -r node_modules && npm install`

### Issue: Toast notifications not showing
- Verify ToastProvider wraps entire app in App.jsx
- Check ToastContainer is imported correctly
- Verify useToast hook is called in components

---

## 📊 API Endpoints (if using backend)

Not implemented for MVP. All data comes from Firebase Realtime Database.

---

## 🎨 Styling

Using **Tailwind CSS** for all styling. Key utility classes:
- `card` - Card container
- `btn-primary` - Primary button
- `btn-danger` - Danger button
- `badge` - Status badge
- `grid grid-cols-{n}` - Responsive grid

---

## 📱 Mobile Testing

### Breakpoints
- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

### Testing
1. Open DevTools (F12)
2. Click device toggle (Ctrl+Shift+M)
3. Select device: iPhone 12, Samsung Galaxy, iPad
4. Test all pages for responsive layout

---

## 🚀 Deployment

### Firebase Hosting
```bash
# Build production
npm run build

# Deploy
firebase deploy --only hosting
```

### Environment
- Set Firebase environment variables in deploy platform
- Update `vite.config.js` if needed
- Test production build: `npm run preview`

---

## 📞 Troubleshooting

**Dev server won't start:**
```bash
npm run dev -- --host
```

**Build fails:**
```bash
npm run build -- --debug
```

**Clear cache:**
```bash
rm -r dist node_modules
npm install
npm run dev
```

---

## 📈 Performance Tips

1. Use `React.memo()` for expensive components
2. Lazy load pages with `React.lazy()`
3. Optimize images (use WebP)
4. Monitor bundle size: `npm run preview`

---

## 🔗 Important Links

- Firebase Console: https://console.firebase.google.com/
- Tailwind CSS Docs: https://tailwindcss.com/docs
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev

---

**Last Updated**: February 5, 2026
