import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import MapComponent from '@/components/MapComponent'
import { useData } from '@/context/DataContext'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { LoadingOverlay } from '@/components/LoadingStates'
import { AlertTriangle, CheckCircle, X, Clock, Lock } from 'lucide-react'
import { clearEmergencySOS, confirmEmergencySignal } from '@/services/emergencyService'

const EmergencyLocation = () => {
  const { emergencies } = useData()
  const { currentUser, userProfile } = useAuth()
  const { success, error: showError } = useToast()
  const [selectedEmergency, setSelectedEmergency] = useState(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [clearingId, setClearingId] = useState(null)
  const [confirmingId, setConfirmingId] = useState(null)
  const [emergenciesLoaded, setEmergenciesLoaded] = useState(false)

  // Check if user has permission to clear SOS (hospital, ambulance, or admin)
  const canClearSOS = ['hospital', 'ambulance', 'admin'].includes(userProfile?.role)

  // Auto-select first emergency when list changes
  useEffect(() => {
    if (emergencies.length > 0) {
      // If no emergency is selected, or the selected one is no longer in the list, select the first one
      const stillExists = selectedEmergency && emergencies.find(e => e.id === selectedEmergency.id)
      if (!stillExists) {
        setSelectedEmergency(emergencies[0])
      }
    } else {
      setSelectedEmergency(null)
    }
  }, [emergencies])

  // Mark as loaded after initial render
  useEffect(() => {
    const timer = setTimeout(() => setEmergenciesLoaded(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return (R * c).toFixed(2)
  }

  const handleClearEmergency = async () => {
    if (!selectedEmergency?.id) {
      showError('No emergency selected')
      return
    }
    if (!currentUser?.uid) {
      showError('User not authenticated. Please log in again.')
      return
    }
    if (!canClearSOS) {
      showError('You do not have permission to clear emergencies. Only Hospital, Ambulance, or Admin users can clear SOS.')
      return
    }
    
    setClearingId(selectedEmergency.id)
    try {
      // Clearing emergency
      await clearEmergencySOS(selectedEmergency.id, currentUser.uid)
      success('Emergency SOS cleared successfully!')
      setConfirmDialogOpen(false)
      
      // Wait a moment for Firebase to update
      setTimeout(() => {
        setClearingId(null)
      }, 500)
    } catch (err) {
      // Clear SOS error - silently handle
      const errorMsg = err.code === 'PERMISSION_DENIED' 
        ? 'You do not have permission to clear emergencies. Only Hospital, Ambulance, or Admin users can clear SOS.'
        : err.message || 'Failed to clear SOS'
      showError(errorMsg)
      setClearingId(null)
    }
  }

  const handleConfirmSignal = async () => {
    if (!selectedEmergency?.id) {
      showError('No emergency selected')
      return
    }
    if (!currentUser?.uid) {
      showError('User not authenticated. Please log in again.')
      return
    }

    // Check if already confirmed
    const hasConfirmed = selectedEmergency.confirmations && 
                        selectedEmergency.confirmations[currentUser.uid]
    if (hasConfirmed) {
      showError('You have already confirmed this emergency')
      return
    }

    setConfirmingId(selectedEmergency.id)
    try {
      await confirmEmergencySignal(
        selectedEmergency.id, 
        currentUser.uid,
        userProfile?.email || currentUser.email
      )
      success('Emergency signal confirmed! You are marked as responding.')
      
      setTimeout(() => {
        setConfirmingId(null)
      }, 500)
    } catch (err) {
      const errorMsg = err.message || 'Failed to confirm signal'
      showError(errorMsg)
      setConfirmingId(null)
    }
  }

  if (!emergenciesLoaded) {
    return (
      <Layout>
        <LoadingOverlay isLoading={true} message="Loading emergency data..." />
      </Layout>
    )
  }

  if (emergencies.length === 0) {
    return (
      <Layout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Emergency Response</h1>
          <p className="text-slate-400">Active emergency signals and responder coordination</p>
        </div>

        <div className="card flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Active Emergencies</h3>
            <p className="text-slate-400">All systems operational. No emergency signals detected.</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center space-x-3">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <span>Emergency Response</span>
        </h1>
        <p className="text-slate-400">
          {emergencies.length} active emergency signal{emergencies.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Active Emergencies List & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Emergency List */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="text-lg font-bold text-white mb-4">Active Signals</h3>
            <div className="space-y-3">
              {emergencies.map((emergency) => (
                <div
                  key={emergency.id}
                  onClick={() => setSelectedEmergency(emergency)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedEmergency?.id === emergency.id
                      ? 'bg-red-900/20 border-red-600'
                      : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">{emergency.device_id}</h4>
                      <p className="text-xs text-slate-400 mt-1">{emergency.address || 'Unknown Location'}</p>
                    </div>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-xs text-slate-500">
                    {new Date(emergency.created_at).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="lg:col-span-2">
          <div className="card h-96 relative overflow-hidden">
            <MapComponent 
              emergencies={emergencies}
              hospitals={[]}
              ambulances={[]}
              responders={[]}
              center={[28.7041, 77.1025]}
              zoom={13}
            />

            {/* Coordinates Display */}
            <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur rounded-lg p-3 z-10">
              <p className="text-xs text-slate-400 mb-1">GPS Coordinates</p>
              <p className="text-white font-mono text-sm">
                {selectedEmergency?.latitude.toFixed(6)}, {selectedEmergency?.longitude.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Details */}
      {selectedEmergency && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Details Panel */}
          <div className="lg:col-span-2">
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-6">Emergency Details</h3>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-slate-400 text-sm mb-2">Emergency ID</p>
                  <p className="text-white font-mono break-all">{selectedEmergency.id}</p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-2">Device ID</p>
                  <p className="text-white">{selectedEmergency.device_id}</p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-2">Location</p>
                  <p className="text-white">{selectedEmergency.address || 'Unknown'}</p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-2">Status</p>
                  <span className={`badge ${selectedEmergency.status === 'cleared' ? 'badge-success' : 'badge-danger'}`}>
                    {selectedEmergency.status}
                  </span>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-2">Signal Time</p>
                  <p className="text-white">{new Date(selectedEmergency.created_at).toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-2">Duration</p>
                  <p className="text-white flex items-center space-x-2">
                    <Clock className="w-4 h-4" /> <span>2 min 34 sec</span>
                  </p>
                </div>
              </div>

              {/* Coordinates */}
              <div className="mt-6 pt-6 border-t border-slate-700">
                <h4 className="text-white font-medium mb-4">GPS Coordinates</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-2">Latitude</p>
                    <p className="text-white font-mono">{selectedEmergency.latitude.toFixed(8)}</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-2">Longitude</p>
                    <p className="text-white font-mono">{selectedEmergency.longitude.toFixed(8)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Panel */}
          <div className="card h-fit sticky top-24">
            <h3 className="text-lg font-bold text-white mb-6">Response Actions</h3>

            <div className="space-y-3">
              {selectedEmergency.status === 'cleared' ? (
                <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 text-center">
                  <p className="text-green-300 font-medium">✓ Emergency Cleared</p>
                  <p className="text-sm text-green-400 mt-1">
                    Cleared at {new Date(selectedEmergency.cleared_at).toLocaleTimeString()}
                  </p>
                </div>
              ) : canClearSOS ? (
                <button
                  onClick={() => setConfirmDialogOpen(true)}
                  disabled={clearingId === selectedEmergency.id}
                  className="btn-danger w-full flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                  <span>{clearingId === selectedEmergency.id ? 'Clearing...' : 'Clear Emergency SOS'}</span>
                </button>
              ) : (
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Lock className="w-5 h-5 text-slate-400" />
                    <p className="text-slate-400 font-medium">Restricted Action</p>
                  </div>
                  <p className="text-sm text-slate-500">
                    Only Hospital, Ambulance, or Admin users can clear emergencies
                  </p>
                </div>
              )}

              <button 
                onClick={handleConfirmSignal}
                disabled={confirmingId === selectedEmergency.id || (selectedEmergency.confirmations && selectedEmergency.confirmations[currentUser?.uid])}
                className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <CheckCircle className="w-5 h-5" />
                <span>
                  {confirmingId === selectedEmergency.id 
                    ? 'Confirming...' 
                    : (selectedEmergency.confirmations && selectedEmergency.confirmations[currentUser?.uid])
                      ? '✓ Signal Confirmed'
                      : 'Confirm Signal'}
                </span>
              </button>
            </div>

            {/* Confirmations List */}
            {selectedEmergency.confirmations && Object.keys(selectedEmergency.confirmations).length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-700">
                <h4 className="text-white font-medium mb-4">Confirmed Responders ({Object.keys(selectedEmergency.confirmations).length})</h4>
                <div className="space-y-2">
                  {Object.values(selectedEmergency.confirmations).map((confirmation, idx) => (
                    <div key={idx} className="bg-slate-800 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">
                            {confirmation.responder_email || 'Unknown Responder'}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(confirmation.confirmed_at).toLocaleString()}
                          </p>
                        </div>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nearest Responder */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <h4 className="text-white font-medium mb-4">Nearest Responder</h4>
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-white font-medium">Responder Unit #42</p>
                    <p className="text-sm text-slate-400">Advanced Life Support</p>
                  </div>
                  <span className="badge badge-success">Enroute</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Distance:</span>
                    <span className="text-white">{calculateDistance(selectedEmergency.latitude, selectedEmergency.longitude, 40.758, -73.985)} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">ETA:</span>
                    <span className="text-white">{selectedEmergency.nearest_responder_eta || '3'} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className="text-white">En Route</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog - Only show if user has permission */}
      {confirmDialogOpen && canClearSOS && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-lg max-w-md w-full border border-slate-800 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Clear Emergency SOS</h3>
            <p className="text-slate-400 mb-6">
              Are you sure you want to clear this emergency? This will mark the SOS as resolved and notify all responders.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setConfirmDialogOpen(false)}
                disabled={clearingId === selectedEmergency?.id}
                className="btn-secondary flex-1 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleClearEmergency}
                disabled={clearingId === selectedEmergency?.id}
                className="btn-danger flex-1 disabled:opacity-50"
              >
                {clearingId === selectedEmergency?.id ? 'Clearing...' : 'Clear SOS'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default EmergencyLocation
