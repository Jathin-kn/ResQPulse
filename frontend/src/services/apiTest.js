// API Service for testing backend endpoints
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// API test results interface
const ApiTest = {
  PENDING: 'pending',
  PASSED: 'passed',
  FAILED: 'failed',
  ERROR: 'error',
}

// Test individual endpoints
export const testEndpoints = async () => {
  const results = {
    devices: { status: ApiTest.PENDING, message: '', data: null },
    sessions: { status: ApiTest.PENDING, message: '', data: null },
    emergency: { status: ApiTest.PENDING, message: '', data: null },
    analytics: { status: ApiTest.PENDING, message: '', data: null },
  }

  try {
    // Test /devices endpoint
    try {
      const devicesRes = await api.get('/devices')
      results.devices = {
        status: ApiTest.PASSED,
        message: `✓ Retrieved ${devicesRes.data?.length || 0} devices`,
        data: devicesRes.data,
      }
    } catch (err) {
      results.devices = {
        status: ApiTest.FAILED,
        message: `✗ Devices endpoint error: ${err.message}`,
        data: null,
      }
    }

    // Test /sessions endpoint
    try {
      const sessionsRes = await api.get('/sessions')
      results.sessions = {
        status: ApiTest.PASSED,
        message: `✓ Retrieved ${sessionsRes.data?.length || 0} sessions`,
        data: sessionsRes.data,
      }
    } catch (err) {
      results.sessions = {
        status: ApiTest.FAILED,
        message: `✗ Sessions endpoint error: ${err.message}`,
        data: null,
      }
    }

    // Test /emergency/signal endpoint
    try {
      const emergencyRes = await api.get('/emergency/signals')
      results.emergency = {
        status: ApiTest.PASSED,
        message: `✓ Retrieved ${emergencyRes.data?.length || 0} emergency signals`,
        data: emergencyRes.data,
      }
    } catch (err) {
      results.emergency = {
        status: ApiTest.FAILED,
        message: `✗ Emergency endpoint error: ${err.message}`,
        data: null,
      }
    }

    // Test /analytics endpoint
    try {
      const analyticsRes = await api.get('/sessions/analytics/overview')
      results.analytics = {
        status: ApiTest.PASSED,
        message: `✓ Analytics data retrieved successfully`,
        data: analyticsRes.data,
      }
    } catch (err) {
      results.analytics = {
        status: ApiTest.FAILED,
        message: `✗ Analytics endpoint error: ${err.message}`,
        data: null,
      }
    }
  } catch (error) {
    // API test suite error - silently handle
  }

  return results
}

// Verify data integrity
export const verifyDataIntegrity = (data) => {
  const issues = []

  if (!data || typeof data !== 'object') {
    issues.push('Data is not an object')
    return issues
  }

  // Check for required fields in different data types
  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      if (!item.id && !item._id) {
        issues.push(`Item ${index} missing ID field`)
      }
      if (!item.createdAt && !item.created_at) {
        issues.push(`Item ${index} missing timestamp`)
      }
    })
  }

  return issues
}

// Test Firebase connection
export const testFirebaseConnection = async (database) => {
  try {
    // This is a simple ping to Firebase
    const ref = database.ref('status')
    const snapshot = await ref.once('value')
    return {
      status: 'connected',
      data: snapshot.val(),
    }
  } catch (error) {
    return {
      status: 'disconnected',
      error: error.message,
    }
  }
}

export default {
  testEndpoints,
  verifyDataIntegrity,
  testFirebaseConnection,
}
