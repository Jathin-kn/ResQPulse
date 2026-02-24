import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { useData } from '@/context/DataContext'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { LoadingOverlay, SkeletonLoader } from '@/components/LoadingStates'
import { Users, Truck, Building2, Shield, Activity, AlertTriangle, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { getDatabase, ref, onValue, off } from 'firebase/database'
import { triggerEmergencySOS, getAllResponderEmails } from '@/services/emergencyService'

const AdminDashboard = () => {
  const { devices, emergencies, analytics } = useData()
  const { userProfile, isAdmin } = useAuth()
  const { success, error: showError } = useToast()
  const [users, setUsers] = useState([])
  const [systemHealth, setSystemHealth] = useState([])
  const [loading, setLoading] = useState(true)

  // Check if data is loading - less strict to avoid hanging
  const isDataLoading = loading && users.length === 0

  const [sosDialogOpen, setSOSDialogOpen] = useState(false)
  const [sosLoading, setSOSLoading] = useState(false)
  const [sosMessage, setSOSMessage] = useState('')
  const [sosError, setSOSError] = useState('')
  const [sosLocation, setSOSLocation] = useState('')
  const [locationLoading, setLocationLoading] = useState(false)

  // Auto-detect location when SOS dialog opens
  useEffect(() => {
    if (sosDialogOpen && !sosLocation && !locationLoading) {
      getLocationAutomatically()
    }
  }, [sosDialogOpen])

  const getLocationAutomatically = async () => {
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords
            
            // Try to get address from coordinates using reverse geocoding
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              )
              const data = await response.json()
              const address = data.address?.road || data.address?.building || data.address?.city || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
              setSOSLocation(address)
            } catch (error) {
              // Fallback to coordinates if reverse geocoding fails
              setSOSLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
            }
            setLocationLoading(false)
          },
          (_error) => {
            // Geolocation error - silently handle
            setSOSError('Could not get location. Please enable location access.')
            setLocationLoading(false)
          }
        )
      } else {
        setSOSError('Geolocation is not supported by your browser.')
        setLocationLoading(false)
      }
    } catch (error) {
      // Location error - silently handle
      setSOSError('Failed to get location')
      setLocationLoading(false)
    }
  }

  useEffect(() => {
    if (!isAdmin()) return

    const database = getDatabase()

    // Fetch all users
    const usersRef = ref(database, 'users')
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const usersArray = Object.values(data)
        setUsers(usersArray)
      }
    })

    // Fetch system health
    const healthRef = ref(database, 'system_health')
    onValue(healthRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const healthArray = Object.values(data)
        setSystemHealth(healthArray)
      }
    })

    setLoading(false)

    return () => {
      off(usersRef)
      off(healthRef)
    }
  }, [isAdmin])

  const handleTriggerSOS = async () => {
    if (!sosLocation.trim()) {
      setSOSError('Location is being detected... Please wait.')
      return
    }

    setSOSLoading(true)
    setSOSError('')
    setSOSMessage('')

    try {
      const responderEmails = await getAllResponderEmails()
      
      await triggerEmergencySOS(
        {
          deviceId: `admin-trigger-${Date.now()}`,
          location: sosLocation,
          patientStatus: 'Critical',
          type: 'Manual SOS Trigger',
          triggeredBy: userProfile?.email
        },
        responderEmails
      )

      success('Emergency SOS triggered successfully!')
      setTimeout(() => {
        setSOSDialogOpen(false)
        setSOSLocation('')
      }, 2000)
    } catch (error) {
      showError(`Failed to trigger SOS: ${error.message}`)
    } finally {
      setSOSLoading(false)
    }
  }

  if (!isAdmin()) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-slate-400">You don&apos;t have permission to access this page.</p>
          </div>
        </div>
      </Layout>
    )
  }

  const getRoleStats = () => {
    const stats = {
      admin: users.filter(u => u.role === 'admin').length,
      hospital: users.filter(u => u.role === 'hospital').length,
      ambulance: users.filter(u => u.role === 'ambulance').length,
      responder: users.filter(u => u.role === 'responder').length
    }
    return stats
  }

  const getDeviceStats = () => {
    const stats = {
      total: devices.length,
      active: devices.filter(d => d.status === 'active').length,
      offline: devices.filter(d => d.status === 'offline').length,
      maintenance: devices.filter(d => d.status === 'maintenance').length
    }
    return stats
  }

  const getEmergencyStats = () => {
    const stats = {
      active: emergencies.filter(e => e.status === 'active').length,
      resolved: emergencies.filter(e => e.status === 'resolved').length,
      total: emergencies.length
    }
    return stats
  }

  const roleStats = getRoleStats()
  const deviceStats = getDeviceStats()
  const emergencyStats = getEmergencyStats()

  return (
    <Layout>
      <LoadingOverlay isLoading={isDataLoading} message="Loading admin dashboard..." />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-slate-400">System overview and user management</p>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {!isDataLoading ? (
          <>
            <div className="card">
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-sm text-slate-400">Total Users</p>
                  <p className="text-2xl font-bold text-white">{users.length}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center space-x-3">
                <Building2 className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-sm text-slate-400">Hospitals</p>
                  <p className="text-2xl font-bold text-white">{roleStats.hospital}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center space-x-3">
                <Truck className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-sm text-slate-400">Ambulances</p>
                  <p className="text-2xl font-bold text-white">{roleStats.ambulance}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-sm text-slate-400">Responders</p>
                  <p className="text-2xl font-bold text-white">{roleStats.responder}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <SkeletonLoader count={1} type="card" />
            <SkeletonLoader count={1} type="card" />
            <SkeletonLoader count={1} type="card" />
            <SkeletonLoader count={1} type="card" />
          </>
        )}
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Device Status */}
        <div className="card">
          <h3 className="text-lg font-bold text-white mb-6">Device Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Devices</span>
              <span className="text-white font-medium">{deviceStats.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Active</span>
              <span className="text-green-400 font-medium">{deviceStats.active}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Offline</span>
              <span className="text-red-400 font-medium">{deviceStats.offline}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Maintenance</span>
              <span className="text-yellow-400 font-medium">{deviceStats.maintenance}</span>
            </div>
          </div>
        </div>

        {/* Emergency Status */}
        <div className="card">
          <h3 className="text-lg font-bold text-white mb-6">Emergency Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Active Emergencies</span>
              <span className="text-red-400 font-medium">{emergencyStats.active}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Resolved</span>
              <span className="text-green-400 font-medium">{emergencyStats.resolved}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total</span>
              <span className="text-white font-medium">{emergencyStats.total}</span>
            </div>
            <button
              onClick={() => setSOSDialogOpen(true)}
              className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <AlertCircle className="w-5 h-5" />
              <span>Trigger Emergency SOS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users by Role */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Hospitals */}
        <div className="card">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-green-400" />
            Hospitals ({roleStats.hospital})
          </h3>
          <div className="space-y-3">
            {users.filter(u => u.role === 'hospital').map((user) => (
              <div key={user.uid} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-slate-400 text-sm">{user.email}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
            ))}
            {roleStats.hospital === 0 && (
              <p className="text-slate-400 text-center py-4">No hospitals registered</p>
            )}
          </div>
        </div>

        {/* Ambulances */}
        <div className="card">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center">
            <Truck className="w-5 h-5 mr-2 text-yellow-400" />
            Ambulances ({roleStats.ambulance})
          </h3>
          <div className="space-y-3">
            {users.filter(u => u.role === 'ambulance').map((user) => (
              <div key={user.uid} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-slate-400 text-sm">{user.email}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
            ))}
            {roleStats.ambulance === 0 && (
              <p className="text-slate-400 text-center py-4">No ambulances registered</p>
            )}
          </div>
        </div>
      </div>

      {/* Responders */}
      <div className="card mb-8">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-purple-400" />
          Responders ({roleStats.responder})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.filter(u => u.role === 'responder').map((user) => (
            <div key={user.uid} className="p-4 bg-slate-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-slate-400 text-sm">{user.email}</p>
                </div>
              </div>
            </div>
          ))}
          {roleStats.responder === 0 && (
            <div className="col-span-full">
              <p className="text-slate-400 text-center py-8">No responders registered</p>
            </div>
          )}
        </div>
      </div>

      {/* System Health */}
      <div className="card">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-400" />
          System Health ({systemHealth.length} devices)
        </h3>
        <div className="space-y-3">
          {systemHealth.map((device) => (
            <div key={device.device_id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
              <div>
                <p className="text-white font-medium">{device.device_id}</p>
                <p className="text-slate-400 text-sm">
                  Last heartbeat: {new Date(device.last_heartbeat).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {device.status === 'online' ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : device.status === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                <span className={`text-sm font-medium ${
                  device.status === 'online' ? 'text-green-400' :
                  device.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {device.status}
                </span>
              </div>
            </div>
          ))}
          {systemHealth.length === 0 && (
            <p className="text-slate-400 text-center py-4">No device health data available</p>
          )}
        </div>
      </div>

      {/* SOS Trigger Modal */}
      {sosDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-lg shadow-xl max-w-md w-full border border-slate-700">
            {/* Modal Header */}
            <div className="border-b border-slate-700 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <span>Trigger Emergency SOS</span>
              </h2>
              <button
                onClick={() => {
                  setSOSDialogOpen(false)
                  setSOSLocation('')
                  setSOSError('')
                  setSOSMessage('')
                }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Error Message */}
              {sosError && (
                <div className="mb-4 p-3 bg-red-900 bg-opacity-30 border border-red-700 rounded text-red-400 text-sm">
                  {sosError}
                </div>
              )}

              {/* Success Message */}
              {sosMessage && (
                <div className="mb-4 p-3 bg-green-900 bg-opacity-30 border border-green-700 rounded text-green-400 text-sm">
                  {sosMessage}
                </div>
              )}

              {/* Location Display (Auto-detected) */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Emergency Location (Auto-detected)
                </label>
                <div className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-500 resize-none min-h-14 flex items-center justify-center">
                  {locationLoading ? (
                    <div className="flex items-center space-x-2 text-slate-400">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                      <span>Detecting location...</span>
                    </div>
                  ) : sosLocation ? (
                    <p className="text-white text-sm">{sosLocation}</p>
                  ) : (
                    <p className="text-slate-500 text-sm">Location will be auto-detected</p>
                  )}
                </div>
              </div>

              {/* Loading Indicator */}
              {sosLoading && (
                <div className="mb-4 p-3 bg-blue-900 bg-opacity-30 border border-blue-700 rounded text-blue-400 text-sm flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                  <span>Triggering SOS and notifying responders...</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-700 p-6 flex space-x-3">
              <button
                onClick={() => {
                  setSOSDialogOpen(false)
                  setSOSLocation('')
                  setSOSError('')
                  setSOSMessage('')
                }}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
                disabled={sosLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleTriggerSOS}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                disabled={sosLoading || locationLoading}
              >
                {sosLoading || locationLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>{locationLoading ? 'Getting Location...' : 'Sending...'}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    <span>Trigger SOS</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default AdminDashboard