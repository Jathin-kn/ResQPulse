import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, Settings, Moon, Sun, Shield } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'

const Navigation = () => {
  const navigate = useNavigate()
  const { currentUser, logout, isAdmin } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/live-monitoring', label: 'Live Monitoring' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/devices', label: 'Devices' },
    { path: '/emergency', label: 'Emergency' },
  ]

  // Add admin link if user is admin
  const adminLinks = isAdmin() ? [{ path: '/admin', label: 'Admin', icon: Shield }] : []

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">RP</span>
            </div>
            <span className="text-xl font-bold text-white hidden sm:inline">ResqPulse</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {adminLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center space-x-1"
              >
                <link.icon size={16} />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link
              to="/settings"
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Settings size={20} />
            </Link>

            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-red-900/20 hover:text-red-400 transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-800"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {adminLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center space-x-2"
                onClick={() => setIsOpen(false)}
              >
                <link.icon size={16} />
                <span>{link.label}</span>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-red-900/20 hover:text-red-400 transition-colors flex items-center space-x-2"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
