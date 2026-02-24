import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { validators } from '@/utils/validators'
import { LogIn, Eye, EyeOff, AlertCircle, Mail } from 'lucide-react'

const Login = () => {
  const navigate = useNavigate()
  const { login, resetPassword } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [formErrors, setFormErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setFormErrors({})

    // Validate form
    const errors = {}
    const emailError = validators.email(formData.email)
    const passwordError = validators.password(formData.password)

    if (emailError) errors.email = emailError
    if (passwordError) errors.password = passwordError

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setLoading(true)

    try {
      await login(formData.email, formData.password)
      navigate('/dashboard')
    } catch (error) {
      // Login error - silently handle
      setError(error.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setError('')
    setFormErrors({})

    // Validate email
    const emailError = validators.email(formData.email)
    if (emailError) {
      setFormErrors({ email: emailError })
      return
    }

    setLoading(true)

    try {
      await resetPassword(formData.email)
      setResetEmailSent(true)
      setShowForgotPassword(false)
    } catch (error) {
      // Password reset error - silently handle
      setError(error.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  if (resetEmailSent) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-white">Check Your Email</h2>
            <p className="mt-2 text-sm text-slate-400">
              We&apos;ve sent a password reset link to {formData.email}
            </p>
            <div className="mt-6">
              <button
                onClick={() => setResetEmailSent(false)}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                ← Back to login
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <LogIn className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">
            {showForgotPassword ? 'Reset Password' : 'Sign In'}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {showForgotPassword
              ? 'Enter your email to receive a reset link'
              : 'Access your ResqPulse dashboard'
            }
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={showForgotPassword ? handleForgotPassword : handleSubmit}>
          {error && (
            <div className="bg-red-900/20 border border-red-900/30 rounded-lg p-4 flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formErrors.email ? 'border-red-500' : 'border-slate-700'
              }`}
              placeholder="john@example.com"
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-400">{formErrors.email}</p>
            )}
          </div>

          {/* Password - Only show if not in forgot password mode */}
          {!showForgotPassword && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 pr-10 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.password ? 'border-red-500' : 'border-slate-700'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 hover:text-slate-300" />
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-400">{formErrors.password}</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? (showForgotPassword ? 'Sending...' : 'Signing In...')
              : (showForgotPassword ? 'Send Reset Link' : 'Sign In')
            }
          </button>

          {/* Links */}
          {!showForgotPassword ? (
            <div className="space-y-2 text-center">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Forgot your password?
              </button>
              <p className="text-sm text-slate-400">
                Don&apos;t have an account?{' '}
                <Link to="/signup" className="font-medium text-blue-400 hover:text-blue-300">
                  Sign up
                </Link>
              </p>
            </div>
          ) : (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                ← Back to login
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default Login
