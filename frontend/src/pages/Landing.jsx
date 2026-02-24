import { Link } from 'react-router-dom'
import { Heart, Zap, Shield, TrendingUp } from 'lucide-react'

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">RP</span>
          </div>
          <span className="text-xl font-bold text-white">ResqPulse</span>
        </Link>

        <div className="flex space-x-4">
          <Link to="/login" className="px-6 py-2 rounded-lg text-white hover:bg-slate-800 transition-colors">
            Login
          </Link>
          <Link to="/login" className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Real-Time CPR Assistance <span className="text-blue-500">Saves Lives</span>
        </h1>

        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
          ResqPulse monitors CPR quality in real-time with IoT sensors. Track compression depth, rate, and
          quality—ensuring responders deliver the most effective chest compressions.
        </p>

        <div className="flex justify-center space-x-4 mb-16">
          <Link to="/login" className="btn-primary">
            Start Monitoring
          </Link>
          <button className="btn-secondary">Learn More</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-slate-800">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">99.9%</div>
            <div className="text-slate-400">System Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">500+</div>
            <div className="text-slate-400">Active Devices</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">94.5%</div>
            <div className="text-slate-400">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400 mb-2">24/7</div>
            <div className="text-slate-400">Support</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <h2 className="text-4xl font-bold text-white text-center mb-16">Powerful Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card-hover">
            <Heart className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Real-Time Monitoring</h3>
            <p className="text-slate-400">
              Monitor CPR quality metrics in real-time including compression rate, depth, and pressure.
            </p>
          </div>

          <div className="card-hover">
            <Zap className="w-12 h-12 text-yellow-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">IoT Integration</h3>
            <p className="text-slate-400">
              Seamless integration with IoT sensors for accurate data collection and analysis.
            </p>
          </div>

          <div className="card-hover">
            <Shield className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Secure & Reliable</h3>
            <p className="text-slate-400">
              Firebase authentication and encrypted data storage for maximum security.
            </p>
          </div>

          <div className="card-hover">
            <TrendingUp className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Analytics</h3>
            <p className="text-slate-400">
              Comprehensive analytics and session history for performance tracking and improvement.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-8 py-24 text-center bg-blue-900/10 rounded-2xl border border-blue-900/20 mx-4 md:mx-0">
        <h2 className="text-3xl font-bold text-white mb-6">Ready to Save Lives?</h2>
        <p className="text-xl text-slate-400 mb-8">
          Join healthcare professionals using ResqPulse to improve CPR quality outcomes.
        </p>
        <Link to="/login" className="btn-primary inline-block">
          Get Started Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-8 py-12 mt-24 border-t border-slate-800 text-center text-slate-500">
        <p>&copy; 2026 ResqPulse. All rights reserved. Market-ready CPR Assistance System.</p>
      </footer>
    </div>
  )
}

export default Landing
