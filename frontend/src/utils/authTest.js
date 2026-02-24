import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBYmTkAcb9ax-dw2GyqWpLOVbnJZzfNicE',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'myosa-9871.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'myosa-9871',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'myosa-9871.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '548617449270',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:548617449270:web:c93bc99fc0113a2417cd97',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://myosa-9871-default-rtdb.firebaseio.com',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export const testAuthConnection = async () => {
  try {
    console.log('Testing Firebase Auth connection...')

    // Try to create a test user (this will fail if auth is disabled)
    const testEmail = `test-${Date.now()}@example.com`
    const testPassword = 'testpassword123'

    console.log('Attempting to create test user...')
    const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword)
    console.log('✅ Test user created successfully:', userCredential.user.email)

    // Clean up - delete the test user
    await userCredential.user.delete()
    console.log('✅ Test user deleted successfully')

    return { success: true, message: 'Firebase Auth is working correctly' }

  } catch (error) {
    console.error('❌ Firebase Auth test failed:', error)

    if (error.code === 'auth/invalid-api-key') {
      return { success: false, message: 'Invalid API key - check Firebase configuration' }
    } else if (error.code === 'auth/api-key-not-valid') {
      return { success: false, message: 'API key not valid - check Firebase project status' }
    } else if (error.code === 'auth/operation-not-allowed') {
      return { success: false, message: 'Authentication not enabled in Firebase console' }
    } else if (error.code === 'auth/invalid-credential') {
      return { success: false, message: 'Invalid credentials or Firebase project issue' }
    } else {
      return { success: false, message: `Auth error: ${error.code} - ${error.message}` }
    }
  }
}