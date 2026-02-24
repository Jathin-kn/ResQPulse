import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import GaugeChart from '@/components/GaugeChart'
import ESP32SensorDisplay from '@/components/ESP32SensorDisplay'
import { useData } from '@/context/DataContext'
import { LoadingOverlay, SkeletonLoader } from '@/components/LoadingStates'
import { Activity, Zap, Radio, TrendingUp } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

const LiveMonitoring = () => {
  const { sensorData } = useData()
  const [dataHistory, setDataHistory] = useState([])
  const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 0 })

  // Check if data is loading
  const isDataLoading = false

  useEffect(() => {
    // Only update acceleration if we have real sensor data
    if (sensorData) {
      // Use real acceleration data from sensors if available, otherwise show 0
      const x = sensorData.acceleration_x || 0
      const y = sensorData.acceleration_y || 0
      const z = sensorData.acceleration_z || 0
      setAcceleration({ x: x.toFixed(2), y: y.toFixed(2), z: z.toFixed(2) })
    } else {
      // No sensor data available
      setAcceleration({ x: '0.00', y: '0.00', z: '0.00' })
    }
  }, [sensorData])

  useEffect(() => {
    // Only add to history if we have real sensor data
    if (sensorData) {
      setDataHistory((prev) => [
        ...prev.slice(-59),
        {
          time: new Date().toLocaleTimeString(),
          pressure: sensorData.pressure || 0,
          rate: sensorData.compression_rate || 0,
          depth: sensorData.compression_depth || 0,
        },
      ])
    }
  }, [sensorData])

  return (
    <Layout>
      <LoadingOverlay isLoading={isDataLoading} message="Connecting to live data stream..." />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Live Monitoring</h1>
        <p className="text-slate-400">Real-time sensor data and acceleration tracking</p>
      </div>

      {/* Live Status Indicator */}
      <div className="mb-8 p-4 bg-green-900/20 border border-green-900/30 rounded-lg flex items-center space-x-3">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-green-400 font-medium">
          {sensorData ? 'Live Data Stream Active' : 'Waiting for ESP32 Connection'}
        </span>
        <span className="text-slate-500 text-sm ml-auto">
          {sensorData
            ? `Last update: ${new Date(sensorData.timestamp).toLocaleTimeString()}`
            : 'No sensor data received yet'
          }
        </span>
      </div>

      {/* Current Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <GaugeChart
            value={sensorData?.compression_rate || 0}
            min={0}
            max={130}
            title="Compression Rate"
            unit="bpm"
            status={sensorData?.compression_rate > 110 ? 'normal' : 'warning'}
          />
        </div>

        <div className="card">
          <GaugeChart
            value={sensorData?.compression_depth || 0}
            min={0}
            max={8}
            title="Compression Depth"
            unit="cm"
            status={sensorData?.compression_depth > 5 ? 'normal' : 'warning'}
          />
        </div>

        <div className="card">
          <GaugeChart
            value={sensorData?.quality_score || 0}
            min={0}
            max={100}
            title="Quality Score"
            unit="%"
            status={sensorData?.quality_score > 80 ? 'normal' : 'warning'}
          />
        </div>
      </div>

      {/* ESP32 Sensor Data */}
      {sensorData?.source === 'esp32-live' && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">ESP32 Sensor Data</h2>
          <ESP32SensorDisplay />
        </div>
      )}

      {/* Sensor Data & Acceleration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Pressure & Proximity */}
        <div className="card">
          <h3 className="text-lg font-bold text-white mb-6">Sensor Data</h3>
          {!sensorData ? (
            <SkeletonLoader count={2} type="text" />
          ) : (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 flex items-center space-x-2">
                    <Radio className="w-4 h-4" /> Pressure
                  </span>
                  <span className="text-white font-medium">
                    {sensorData?.pressure ? sensorData.pressure.toFixed(1) : '--'} hPa
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((sensorData?.pressure || 0) / 10, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 flex items-center space-x-2">
                    <Zap className="w-4 h-4" /> Proximity
                  </span>
                  <span className="text-white font-medium">
                    {sensorData?.proximity ? sensorData.proximity.toFixed(1) : '--'} cm
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((sensorData?.proximity || 0) / 20, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Acceleration */}
        <div className="card lg:col-span-2">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
            <Activity className="w-5 h-5" /> <span>Acceleration (3-Axis)</span>
          </h3>
          {!sensorData ? (
            <SkeletonLoader count={1} type="chart" />
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-400 mb-1">{acceleration.x}</div>
                  <div className="text-xs text-slate-500">X-Axis (g)</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">{acceleration.y}</div>
                  <div className="text-xs text-slate-500">Y-Axis (g)</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">{acceleration.z}</div>
                  <div className="text-xs text-slate-500">Z-Axis (g)</div>
                </div>
              </div>

              {/* 3D Visualization placeholder */}
              <div className="w-full h-24 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                <span className="text-slate-500 text-sm">Real-time acceleration visualization</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Pressure Trend */}
      <div className="card mb-8">
        <h3 className="text-lg font-bold text-white mb-4">Pressure Trend</h3>
        {dataHistory.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dataHistory}>
              <defs>
                <linearGradient id="colorPressure" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                labelStyle={{ color: '#fff' }}
              />
              <Area
                type="monotone"
                dataKey="pressure"
                stroke="#0ea5e9"
                fillOpacity={1}
                fill="url(#colorPressure)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-slate-400">
            <div className="text-center">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Waiting for pressure sensor data...</p>
              <p className="text-sm mt-2">Connect your ESP32 to see real-time pressure readings</p>
            </div>
          </div>
        )}
      </div>

      {/* Depth Trend */}
      <div className="card">
        <h3 className="text-lg font-bold text-white mb-4">Compression Depth Trend</h3>
        {dataHistory.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                labelStyle={{ color: '#fff' }}
              />
              <Line
                type="monotone"
                dataKey="depth"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                name="Depth (cm)"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-slate-400">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Waiting for depth sensor data...</p>
              <p className="text-sm mt-2">Connect your ESP32 to see real-time compression depth</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default LiveMonitoring
