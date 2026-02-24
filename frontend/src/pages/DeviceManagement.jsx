import { useState } from 'react'
import Layout from '@/components/Layout'
import MetricCard from '@/components/MetricCard'
import { useData } from '@/context/DataContext'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { LoadingOverlay, SkeletonLoader } from '@/components/LoadingStates'
import { Plus, Wifi, Battery, Clock, AlertCircle, X } from 'lucide-react'

const DeviceManagement = () => {
  const { devices } = useData()
  const { currentUser } = useAuth()
  const { success, error: showError } = useToast()
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    device_name: '',
    location: ''
  })
  const [formErrors, setFormErrors] = useState({})

  // Check if data is loading
  const isDataLoading = false

  const activeDevices = devices.filter((d) => d.status === 'active').length
  const lowBatteryDevices = devices.filter((d) => d.battery_level < 30).length

  const validateForm = () => {
    const errors = {}
    if (!formData.device_name.trim()) {
      errors.device_name = 'Device name is required'
    }
    if (formData.device_name.trim().length > 100) {
      errors.device_name = 'Device name must be less than 100 characters'
    }
    if (formData.location && formData.location.length > 200) {
      errors.location = 'Location must be less than 200 characters'
    }
    return errors
  }

  const handleSubmitDevice = async (e) => {
    e.preventDefault()
    
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    if (!currentUser) {
      showError('You must be logged in to add a device')
      return
    }

    setIsSubmitting(true)
    try {
      const token = await currentUser.getIdToken()
      const response = await fetch('http://localhost:8000/api/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          device_name: formData.device_name.trim(),
          location: formData.location.trim() || null
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Failed to add device')
      }

      success('Device added successfully!')
      setFormData({ device_name: '', location: '' })
      setShowAddModal(false)
      // The device list will update automatically via Firebase real-time listener
    } catch (error) {
      showError(error.message || 'Failed to add device')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const getBatteryColor = (level) => {
    if (level >= 60) return 'bg-green-600'
    if (level >= 30) return 'bg-yellow-600'
    return 'bg-red-600'
  }

  return (
    <Layout>
      <LoadingOverlay isLoading={isDataLoading} message="Loading device data..." />

      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Device Management</h1>
          <p className="text-slate-400">Monitor and manage connected CPR devices</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Device</span>
        </button>
      </div>

      {/* Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Total Devices"
          value={devices.length}
          icon={Wifi}
          status="info"
        />
        <MetricCard
          title="Active Devices"
          value={activeDevices}
          icon={Wifi}
          status="normal"
        />
        <MetricCard
          title="Low Battery"
          value={lowBatteryDevices}
          icon={Battery}
          status={lowBatteryDevices > 0 ? 'warning' : 'normal'}
        />
        <MetricCard
          title="System Uptime"
          value="99.9"
          unit="%"
          icon={Clock}
          status="normal"
        />
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Device List */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-bold text-white mb-6">All Devices</h3>
            {devices.length === 0 ? (
              <SkeletonLoader count={3} type="card" />
            ) : (
              <div className="space-y-4">
                {devices.map((device) => (
                  <div
                    key={device.id}
                    onClick={() => setSelectedDevice(device)}
                    className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Wifi className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{device.device_name}</h4>
                          <p className="text-xs text-slate-500">ID: {device.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                      <span
                        className={
                          device.status === 'active'
                            ? 'badge badge-success'
                            : device.status === 'inactive'
                              ? 'badge badge-warning'
                              : 'badge badge-danger'
                        }
                      >
                        {device.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {/* Battery */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-slate-400">Battery</span>
                          <span className="text-xs text-white font-medium">{device.battery_level}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                          className={`${getBatteryColor(device.battery_level)} h-2 rounded-full`}
                          style={{ width: `${device.battery_level}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Signal */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-400">Signal</span>
                        <span className="text-xs text-white font-medium">{device.signal_strength}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${device.signal_strength}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <div className="text-xs text-slate-400 mb-2">Location</div>
                      <div className="text-xs text-white truncate">{device.location || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <p className="text-xs text-slate-500">
                      Last sync:{' '}
                      {device.last_sync
                        ? new Date(device.last_sync).toLocaleString()
                        : 'Never'}
                    </p>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
        </div>

        {/* Device Details */}
        <div>
          {selectedDevice ? (
            <div className="card sticky top-24">
              <h3 className="text-lg font-bold text-white mb-6">Device Details</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Device Name</p>
                  <p className="text-white font-medium">{selectedDevice.device_name}</p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-1">Device ID</p>
                  <p className="text-white font-mono text-xs break-all">{selectedDevice.id}</p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-1">Status</p>
                  <span
                    className={
                      selectedDevice.status === 'active'
                        ? 'badge badge-success'
                        : 'badge badge-warning'
                    }
                  >
                    {selectedDevice.status}
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <p className="text-slate-400 text-sm mb-3">Battery: {selectedDevice.battery_level}%</p>
                  <div className="w-full bg-slate-800 rounded-full h-3">
                    <div
                      className={`${getBatteryColor(selectedDevice.battery_level)} h-3 rounded-full`}
                      style={{ width: `${selectedDevice.battery_level}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <p className="text-slate-400 text-sm mb-3">Signal Strength: {selectedDevice.signal_strength}%</p>
                  <div className="w-full bg-slate-800 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full"
                      style={{ width: `${selectedDevice.signal_strength}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <p className="text-slate-400 text-sm mb-1">Location</p>
                  <p className="text-white">{selectedDevice.location || 'Not set'}</p>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <p className="text-slate-400 text-sm mb-1">Last Sync</p>
                  <p className="text-white text-sm">
                    {selectedDevice.last_sync
                      ? new Date(selectedDevice.last_sync).toLocaleString()
                      : 'Never'}
                  </p>
                </div>

                <div className="flex space-x-2 pt-6">
                  <button className="btn-secondary flex-1 text-sm">Edit</button>
                  <button className="btn-danger flex-1 text-sm">Remove</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card sticky top-24 flex items-center justify-center min-h-96 text-center">
              <div>
                <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Select a device to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Device Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-lg p-6 max-w-md w-full mx-4 border border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Add New Device</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitDevice} className="space-y-4">
              {/* Device Name */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Device Name *
                </label>
                <input
                  type="text"
                  name="device_name"
                  value={formData.device_name}
                  onChange={handleFormChange}
                  placeholder="e.g., CPR Device #1"
                  maxLength="100"
                  className={`w-full px-4 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 ${
                    formErrors.device_name ? 'border-red-500' : 'border-slate-700'
                  }`}
                />
                {formErrors.device_name && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.device_name}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                  placeholder="e.g., Ambulance 42"
                  maxLength="200"
                  className={`w-full px-4 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 ${
                    formErrors.location ? 'border-red-500' : 'border-slate-700'
                  }`}
                />
                {formErrors.location && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.location}</p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding...' : 'Add Device'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default DeviceManagement
