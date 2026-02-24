import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getDatabase, ref, onValue, off } from 'firebase/database'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { useAuth } from './AuthContext'

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within DataProvider')
  }
  return context
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || '',
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const auth = getAuth(app)

console.log('🔧 Firebase Config:')
console.log('   Project:', firebaseConfig.projectId)
console.log('   Database URL:', firebaseConfig.databaseURL)

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL || 'http://localhost:8000/api'

export const DataProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const [sensorData, setSensorData] = useState(null)
  const [devices, setDevices] = useState([])
  const [sessions, setSessions] = useState([])
  const [emergencies, setEmergencies] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(false)

  // Device sensor data structure
  const [deviceData, setDeviceData] = useState({
    'esp32-cpr-001': {
      cpr: null,
      environment: null,
      gesture: null,
      status: null
    }
  })

  // Subscribe to device sensor data
  useEffect(() => {
    if (!currentUser) return

    const deviceId = 'esp32-cpr-001' // Default device

    try {
      // CPR data
      const cprRef = ref(database, `devices/${deviceId}/cpr`)
      const cprUnsubscribe = onValue(cprRef, (snapshot) => {
        const data = snapshot.val()
        setDeviceData(prev => ({
          ...prev,
          [deviceId]: {
            ...prev[deviceId],
            cpr: data
          }
        }))
      })

      // Environment data
      const envRef = ref(database, `devices/${deviceId}/environment`)
      const envUnsubscribe = onValue(envRef, (snapshot) => {
        const data = snapshot.val()
        setDeviceData(prev => ({
          ...prev,
          [deviceId]: {
            ...prev[deviceId],
            environment: data
          }
        }))
      })

      // Gesture data
      const gestureRef = ref(database, `devices/${deviceId}/gesture`)
      const gestureUnsubscribe = onValue(gestureRef, (snapshot) => {
        const data = snapshot.val()
        setDeviceData(prev => ({
          ...prev,
          [deviceId]: {
            ...prev[deviceId],
            gesture: data
          }
        }))
      })

      // Status data
      const statusRef = ref(database, `devices/${deviceId}/status`)
      const statusUnsubscribe = onValue(statusRef, (snapshot) => {
        const data = snapshot.val()
        setDeviceData(prev => ({
          ...prev,
          [deviceId]: {
            ...prev[deviceId],
            status: data
          }
        }))
      })

      return () => {
        off(cprRef, 'value', cprUnsubscribe)
        off(envRef, 'value', envUnsubscribe)
        off(gestureRef, 'value', gestureUnsubscribe)
        off(statusRef, 'value', statusUnsubscribe)
      }
    } catch (error) {
      console.error('Error setting up device listeners:', error)
    }
  }, [currentUser])

  // Legacy sensor data listener (for backward compatibility)
  useEffect(() => {
    try {
      const sensorRef = ref(database, 'sensor_data')
      const unsubscribe = onValue(
        sensorRef,
        (snapshot) => {
          const data = snapshot.val()
          if (data) {
            // Get latest sensor data
            const latestKey = Object.keys(data).sort().pop()
            if (latestKey) {
              setSensorData(data[latestKey])
            }
          } else {
            // No data available
            setSensorData(null)
          }
        },
        (error) => {
          // Error reading sensor data - silently handle
        }
      )

      return () => off(sensorRef)
    } catch (error) {
      // Error subscribing to sensor data - silently handle
    }
  }, [])

  // ResqPulse Live data listener (ESP32 real-time data)
  useEffect(() => {
    try {
      const liveRef = ref(database, 'resqpulse/live')
      console.log('🔗 Setting up listener for resqpulse/live...')
      
      const unsubscribe = onValue(
        liveRef,
        (snapshot) => {
          const data = snapshot.val()
          console.log('📡 ResqPulse data received:', data)
          if (data) {
            // Map ESP32 sensor data to standardized format
            const mappedData = {
              acceleration_x: data.accel_x || 0,
              acceleration_y: data.accel_y || 0,
              acceleration_z: data.accel_z || 0,
              temperature: data.temperature || 0,
              pressure: data.pressure || 0,
              proximity: data.proximity || 0,
              timestamp: data.timestamp || Date.now(),
              source: 'esp32-live'
            }
            console.log('✅ Setting sensor data:', mappedData)
            setSensorData(mappedData)
          } else {
            console.log('⚠️ No data in resqpulse/live')
          }
        },
        (error) => {
          console.error('❌ Error reading live data:', error)
        }
      )

      return () => {
        console.log('🔌 Unsubscribing from resqpulse/live listener')
        unsubscribe()
      }
    } catch (error) {
      console.error('❌ Error subscribing to live data:', error)
    }
  }, [])

  // Subscribe to emergencies
  useEffect(() => {
    try {
      const emergencyRef = ref(database, 'emergencies')
      const unsubscribe = onValue(
        emergencyRef,
        (snapshot) => {
          const data = snapshot.val()
          if (data) {
            const emergencyList = Object.entries(data)
              .map(([id, emergency]) => ({ ...emergency, id }))
              .filter((e) => e.status === 'active')
            setEmergencies(emergencyList)
          } else {
            setEmergencies([])
          }
        },
        (error) => {
          // Error reading emergencies - silently handle
        }
      )

      return () => off(emergencyRef)
    } catch (error) {
      // Error subscribing to emergencies - silently handle
    }
  }, [])

  // Fetch devices
  const fetchDevices = useCallback(async () => {
    if (!currentUser) return

    try {
      setLoading(true)
      const token = await currentUser.getIdToken()
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout
      
      const response = await fetch(`${API_URL}/devices`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      
      if (!response.ok) throw new Error('API request failed')
      const data = await response.json()
      setDevices(Array.isArray(data) ? data : [])
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Devices API request timed out - using empty array')
      } else {
        console.log('Error fetching devices:', error.message)
      }
      // Set empty array as fallback
      setDevices([])
    } finally {
      setLoading(false)
    }
  }, [currentUser])

  // Fetch sessions
  const fetchSessions = useCallback(async () => {
    if (!currentUser) return

    try {
      const token = await currentUser.getIdToken()
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout
      
      const response = await fetch(`${API_URL}/sessions?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      
      if (!response.ok) throw new Error('API request failed')
      const data = await response.json()
      setSessions(Array.isArray(data) ? data : [])
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Sessions API request timed out - using empty array')
      } else {
        console.log('Error fetching sessions:', error.message)
      }
      // Set empty array as fallback
      setSessions([])
    }
  }, [currentUser])

  // Fetch analytics
  const fetchAnalytics = useCallback(async () => {
    if (!currentUser) return

    try {
      const token = await currentUser.getIdToken()
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout
      
      const response = await fetch(`${API_URL}/sessions/analytics/overview`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      
      if (!response.ok) throw new Error('API request failed')
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Analytics API request timed out - using null')
      } else {
        console.log('Error fetching analytics:', error.message)
      }
      // Set null as fallback
      setAnalytics(null)
    }
  }, [currentUser])

  // Initial fetch
  useEffect(() => {
    if (currentUser) {
      fetchDevices()
      fetchSessions()
      fetchAnalytics()

      // Refresh every 30 seconds
      const interval = setInterval(() => {
        fetchDevices()
        fetchSessions()
        fetchAnalytics()
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [currentUser, fetchDevices, fetchSessions, fetchAnalytics])

  return (
    <DataContext.Provider
      value={{
        sensorData,
        devices,
        sessions,
        emergencies,
        analytics,
        loading,
        fetchDevices,
        fetchSessions,
        fetchAnalytics,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
