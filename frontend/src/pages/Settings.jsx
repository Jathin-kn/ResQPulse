import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useToast } from '@/context/ToastContext'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Save, Lock, Bell, LogOut, AlertCircle } from 'lucide-react'
import { getDatabase, ref, update } from 'firebase/database'
import { validators } from '@/utils/validators'
import { LoadingButton } from '@/components/LoadingStates'

const Settings = () => {
  const { currentUser, logout, userProfile } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { success, error: showError } = useToast()
  const [settings, setSettings] = useLocalStorage('resqpulse-settings', {
    theme: isDark ? 'dark' : 'light',
    notifications: true,
    emailAlerts: true,
    dataSharing: false,
  })

  const [formData, setFormData] = useState({
    email: currentUser?.email || '',
    organization: '',
    role: 'responder',
  })
  
  const [formErrors, setFormErrors] = useState({})
  const [saveMessage, setSaveMessage] = useState('')
  const [saveError, setSaveError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (userProfile) {
      setFormData({
        email: currentUser?.email || '',
        organization: userProfile.organization || '',
        role: userProfile.role || 'responder',
      })
    }
  }, [userProfile, currentUser])

  const validateForm = () => {
    const errors = {}
    
    if (formData.organization.trim()) {
      const orgError = validators.organization(formData.organization)
      if (orgError) errors.organization = orgError
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      showError('Please fix the errors in the form')
      return
    }

    try {
      setIsSaving(true)
      setSaveError('')
      setSaveMessage('')

      const database = getDatabase()
      const userRef = ref(database, `users/${currentUser.uid}`)
      
      await update(userRef, {
        role: formData.role,
        organization: formData.organization || '',
      })

      success('Profile saved successfully!')
      setTimeout(() => setSaveMessage(''), 5000)
    } catch (error) {
      showError(`Error saving profile: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  const toggleSetting = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] }
    setSettings(newSettings)
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your profile, preferences, and security settings</p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Settings */}
          <div className="card">
            <h3 className="text-lg font-bold text-white mb-6">Profile Information</h3>

            <div className="space-y-4">
              <div>
                <label className="label">Email Address</label>
                <input
                  type="email"
                  className="input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Organization</label>
                <input
                  type="text"
                  className="input"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Role</label>
                <select
                  className="input"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="admin">Administrator</option>
                  <option value="responder">Responder</option>
                  <option value="hospital">Hospital Staff</option>
                  <option value="ambulance">Ambulance Driver</option>
                </select>
              </div>

              {formErrors.organization && (
                <div className="p-4 bg-red-900/20 border border-red-900/30 rounded-lg flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{formErrors.organization}</p>
                </div>
              )}

              {saveError && (
                <div className="p-4 bg-red-900/20 border border-red-900/30 rounded-lg flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{saveError}</p>
                </div>
              )}

              {saveMessage && (
                <div className="p-4 bg-green-900/20 border border-green-900/30 rounded-lg">
                  <p className="text-green-400 text-sm">{saveMessage}</p>
                </div>
              )}

              <LoadingButton isLoading={isSaving} onClick={handleSaveProfile} className="btn-primary w-full justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </LoadingButton>
            </div>
          </div>

          {/* Preferences */}
          <div className="card">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Notification Preferences</span>
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">Push Notifications</p>
                  <p className="text-sm text-slate-400">Receive real-time alerts and updates</p>
                </div>
                <button
                  onClick={() => toggleSetting('notifications')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.notifications ? 'bg-blue-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.notifications ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  ></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">Email Alerts</p>
                  <p className="text-sm text-slate-400">Receive email notifications for critical events</p>
                </div>
                <button
                  onClick={() => toggleSetting('emailAlerts')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.emailAlerts ? 'bg-blue-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.emailAlerts ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  ></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">Data Sharing</p>
                  <p className="text-sm text-slate-400">Allow anonymous data collection for improvements</p>
                </div>
                <button
                  onClick={() => toggleSetting('dataSharing')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.dataSharing ? 'bg-blue-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.dataSharing ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  ></div>
                </button>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="card">
            <h3 className="text-lg font-bold text-white mb-6">Appearance</h3>

            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
              <div>
                <p className="text-white font-medium">Dark Mode</p>
                <p className="text-sm text-slate-400">Use dark theme for the dashboard</p>
              </div>
              <button
                onClick={toggleTheme}
                className={`w-12 h-6 rounded-full transition-colors ${
                  isDark ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    isDark ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                ></div>
              </button>
            </div>
          </div>

          {/* Security */}
          <div className="card">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <span>Security Settings</span>
            </h3>

            <div className="space-y-3">
              <button className="btn-secondary w-full text-left py-3 px-4 flex items-center space-x-2 hover:bg-slate-800">
                <Lock className="w-4 h-4" />
                <span>Change Password</span>
              </button>

              <button className="btn-secondary w-full text-left py-3 px-4 flex items-center space-x-2 hover:bg-slate-800">
                <Lock className="w-4 h-4" />
                <span>Enable Two-Factor Authentication</span>
              </button>

              <button className="btn-secondary w-full text-left py-3 px-4 flex items-center space-x-2 hover:bg-slate-800">
                <LogOut className="w-4 h-4" />
                <span>Logout from All Sessions</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Profile Card */}
          <div className="card">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-white">RP</span>
              </div>
              <h3 className="text-white font-bold mb-1">Demo User</h3>
              <p className="text-slate-400 text-sm">{formData.email}</p>
              <p className="text-slate-500 text-xs mt-2 capitalize">{formData.role}</p>
            </div>

            <button
              onClick={handleLogout}
              className="btn-danger w-full flex items-center justify-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Application Info */}
          <div className="card">
            <h3 className="text-white font-bold mb-4">Application</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Version</span>
                <span className="text-white">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Build</span>
                <span className="text-white">2026.02.04</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className="badge badge-success">Production</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="card">
            <h3 className="text-white font-bold mb-4">Resources</h3>
            <div className="space-y-2">
              <a href="#" className="block text-blue-400 hover:text-blue-300 text-sm">
                Documentation
              </a>
              <a href="#" className="block text-blue-400 hover:text-blue-300 text-sm">
                API Reference
              </a>
              <a href="#" className="block text-blue-400 hover:text-blue-300 text-sm">
                Support Center
              </a>
              <a href="#" className="block text-blue-400 hover:text-blue-300 text-sm">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Settings
