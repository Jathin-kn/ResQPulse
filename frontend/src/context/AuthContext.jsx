import { createContext, useContext, useState, useEffect } from 'react'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth'
import { getDatabase, ref, set, get } from 'firebase/database'
import { initializeApp } from 'firebase/app'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

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
const database = getDatabase(app)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Login function
  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    // Load user profile from database
    const userRef = ref(database, `users/${result.user.uid}`)
    const snapshot = await get(userRef)
    if (snapshot.exists()) {
      setUserProfile(snapshot.val())
    }
    return result
  }

  // Signup function
  const signup = async (email, password, profileData) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)

    // Update Firebase Auth profile
    await updateProfile(result.user, {
      displayName: `${profileData.firstName} ${profileData.lastName}`
    })

    // Save additional profile data to Firebase Realtime Database
    const userRef = ref(database, `users/${result.user.uid}`)
    await set(userRef, {
      uid: result.user.uid,
      email: email,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      role: profileData.role,
      createdAt: profileData.createdAt,
      lastLogin: new Date().toISOString()
    })

    setUserProfile({
      uid: result.user.uid,
      email: email,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      role: profileData.role,
      createdAt: profileData.createdAt,
      lastLogin: new Date().toISOString()
    })

    return result
  }

  // Password reset function
  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email)
  }

  // Logout function
  const logout = async () => {
    await signOut(auth)
    localStorage.removeItem('demoUser')
    localStorage.removeItem('demoProfile')
    setCurrentUser(null)
    setUserProfile(null)
  }

  // Update user profile function
  const updateUserProfile = async (updates) => {
    if (currentUser) {
      // Update in database
      const userRef = ref(database, `users/${currentUser.uid}`)
      await set(userRef, {
        ...userProfile,
        ...updates,
        lastUpdated: new Date().toISOString()
      })

      // Update local state
      setUserProfile({
        ...userProfile,
        ...updates,
        lastUpdated: new Date().toISOString()
      })
    }
  }

  // Check if user has required role
  const hasRole = (requiredRoles) => {
    if (!userProfile || !userProfile.role) return false
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(userProfile.role)
    }
    return userProfile.role === requiredRoles
  }

  // Check if user is admin
  const isAdmin = () => {
    return userProfile?.role === 'admin'
  }

  // Check if user can access emergency data
  const canAccessEmergency = () => {
    return hasRole(['admin', 'hospital', 'ambulance', 'responder'])
  }

  // Check if user can manage devices
  const canManageDevices = () => {
    return hasRole(['admin'])
  }

  // Check if user can view analytics
  const canViewAnalytics = () => {
    return hasRole(['admin', 'hospital'])
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user)
        // Load user profile from database
        try {
          const userRef = ref(database, `users/${user.uid}`)
          const snapshot = await get(userRef)
          if (snapshot.exists()) {
            setUserProfile(snapshot.val())
          }
        } catch (error) {
          // Error loading user profile - silently handle
        }
      } else {
        // Check for demo user in localStorage
        const demoUser = localStorage.getItem('demoUser')
        const demoProfile = localStorage.getItem('demoProfile')
        if (demoUser && demoProfile) {
          setCurrentUser(JSON.parse(demoUser))
          setUserProfile(JSON.parse(demoProfile))
        } else {
          setCurrentUser(null)
          setUserProfile(null)
        }
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    user: currentUser, // Backward compatibility
    userProfile,
    login,
    signup,
    logout,
    resetPassword,
    updateUserProfile,
    hasRole,
    isAdmin,
    canAccessEmergency,
    canManageDevices,
    canViewAnalytics,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
