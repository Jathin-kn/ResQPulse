import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getDatabase, connectDatabaseEmulator } from 'firebase/database'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBYmTkAcb9ax-dw2GyqWpLOVbnJZzfNicE',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'myosa-9871.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'myosa-9871',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'myosa-9871.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '548617449270',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:548617449270:web:c93bc99fc0113a2417cd97',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://myosa-9871-default-rtdb.firebaseio.com',
}

console.log('Testing Firebase configuration...')
console.log('Config:', {
  apiKey: firebaseConfig.apiKey ? 'Present' : 'Missing',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  databaseURL: firebaseConfig.databaseURL
})

try {
  const app = initializeApp(firebaseConfig)
  console.log('✅ Firebase app initialized successfully')

  const auth = getAuth(app)
  console.log('✅ Firebase Auth initialized successfully')

  const database = getDatabase(app)
  console.log('✅ Firebase Database initialized successfully')

  // Test connection (this will fail in production without proper setup)
  console.log('Firebase initialization test completed successfully')

} catch (error) {
  console.error('❌ Firebase initialization failed:', error)
  console.error('Error code:', error.code)
  console.error('Error message:', error.message)
}