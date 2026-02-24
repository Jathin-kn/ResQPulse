import { useState } from 'react'
import Layout from '@/components/Layout'
import MetricCard from '@/components/MetricCard'
import { useData } from '@/context/DataContext'
import { LoadingOverlay, SkeletonLoader } from '@/components/LoadingStates'
import { TrendingUp, Clock, Target, CheckCircle } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const Analytics = () => {
  const { sessions, analytics } = useData()
  const [selectedPeriod, setSelectedPeriod] = useState('week')

  // Check if data is loading
  const isDataLoading = false

  // Generate chart data
  const trendData = Array.from({ length: 7 }, (_, i) => ({
    date: `Day ${i + 1}`,
    quality: 80 + Math.random() * 15,
    compressions: 100 + Math.random() * 50,
    sessions: Math.floor(5 + Math.random() * 10),
  }))

  const qualityDistribution = [
    { range: '90-100%', count: 42 },
    { range: '80-90%', count: 38 },
    { range: '70-80%', count: 24 },
    { range: '60-70%', count: 12 },
    { range: '<60%', count: 4 },
  ]

  return (
    <Layout>
      <LoadingOverlay isLoading={isDataLoading} message="Loading analytics data..." />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Analytics & Performance</h1>
        <div className="flex flex-wrap gap-2">
          {['day', 'week', 'month', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {!analytics ? (
          <>
            <SkeletonLoader count={1} type="card" />
            <SkeletonLoader count={1} type="card" />
            <SkeletonLoader count={1} type="card" />
            <SkeletonLoader count={1} type="card" />
          </>
        ) : (
          <>
            <MetricCard
              title="Total Sessions"
              value={analytics?.total_sessions || 0}
              icon={CheckCircle}
              status="info"
              trend={12}
            />
            <MetricCard
              title="Avg Quality Score"
              value={analytics?.average_quality_score || 0}
              unit="%"
              icon={Target}
              status={analytics?.average_quality_score > 85 ? 'normal' : 'warning'}
              trend={5}
            />
            <MetricCard
              title="Total Compressions"
              value={(analytics?.total_compressions || 0).toLocaleString()}
              icon={TrendingUp}
              status="normal"
              trend={8}
            />
            <MetricCard
          title="Success Rate"
          value={analytics?.success_rate || 0}
          unit="%"
          icon={CheckCircle}
          status="normal"
          trend={3}
        />
          </>
        )}
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Quality Trend */}
        <div className="card">
          <h3 className="text-lg font-bold text-white mb-4">Quality Score Trend</h3>
          {!analytics ? (
            <SkeletonLoader count={1} type="chart" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line
                  type="monotone"
                  dataKey="quality"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981' }}
                  name="Quality %"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Sessions per Day */}
        <div className="card">
          <h3 className="text-lg font-bold text-white mb-4">Sessions per Day</h3>
          {!analytics ? (
            <SkeletonLoader count={1} type="chart" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="sessions" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {!analytics ? (
          <>
            <SkeletonLoader count={1} type="card" />
            <SkeletonLoader count={1} type="card" />
            <SkeletonLoader count={1} type="card" />
          </>
        ) : (
          <>
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
                <Clock className="w-5 h-5" /> <span>Average Session Duration</span>
              </h3>
              <div className="text-4xl font-bold text-blue-400 mb-2">
                {Math.round(analytics?.average_session_duration || 0)}
                <span className="text-sm text-slate-400 ml-2">seconds</span>
              </div>
              <p className="text-slate-500 text-sm">
                {(((analytics?.average_session_duration || 0) / 60).toFixed(1))} minutes average
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-white mb-6">Avg Compression Rate</h3>
              <div className="text-4xl font-bold text-green-400 mb-2">
                {Math.round(analytics?.average_compression_rate || 0)}
                <span className="text-sm text-slate-400 ml-2">bpm</span>
              </div>
              <p className="text-slate-500 text-sm">Within target range (100-120)</p>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-white mb-6">Avg Compression Depth</h3>
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                {(analytics?.average_compression_depth || 0).toFixed(1)}
                <span className="text-sm text-slate-400 ml-2">cm</span>
              </div>
              <p className="text-slate-500 text-sm">Target: 5-6 cm</p>
            </div>
          </>
        )}
      </div>

      {/* Quality Distribution */}
      <div className="card mb-8">
        <h3 className="text-lg font-bold text-white mb-6">Quality Score Distribution</h3>
        {!analytics ? (
          <SkeletonLoader count={5} type="text" />
        ) : (
          <div className="space-y-4">
            {qualityDistribution.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-400">{item.range}</span>
                  <span className="text-white font-medium">{item.count}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-600 to-green-400 h-3 rounded-full"
                    style={{ width: `${(item.count / 120) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Sessions Table */}
      <div className="card">
        <h3 className="text-lg font-bold text-white mb-6">Recent Sessions</h3>
        {sessions.length === 0 ? (
          <SkeletonLoader count={5} type="table" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-700">
                <tr>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Session ID</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Device</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Duration</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Compressions</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Quality</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {sessions.slice(0, 10).map((session) => (
                  <tr key={session.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 text-white font-mono text-xs">{session.id.slice(0, 8)}...</td>
                    <td className="py-3 px-4 text-slate-300">{session.device_id}</td>
                    <td className="py-3 px-4 text-slate-300">
                      {session.duration ? `${session.duration}s` : '--'}
                    </td>
                    <td className="py-3 px-4 text-slate-300">{session.total_compressions}</td>
                    <td className="py-3 px-4">
                      <span className="badge badge-success">{Math.round(session.quality_score)}%</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="badge badge-info">{session.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Analytics
