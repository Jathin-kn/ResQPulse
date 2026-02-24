import { useState, useEffect } from 'react'
import { getDatabase, ref, onValue, off } from 'firebase/database'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Thermometer, Droplets, Mountain, Gauge } from 'lucide-react'

const EnvironmentalMonitor = ({ deviceId = 'esp32-cpr-001' }) => {
  const [envHistory, setEnvHistory] = useState([])
  const [currentData, setCurrentData] = useState({
    temperature: 0,
    humidity: 0,
    pressure: 0,
    altitude: 0,
    timestamp: 0
  })

  useEffect(() => {
    const db = getDatabase()
    const envRef = ref(db, `devices/${deviceId}/environment`)

    const unsubscribe = onValue(envRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        setCurrentData(data)

        // Add to history for charting (keep last 20 readings)
        setEnvHistory(prev => {
          const newHistory = [...prev, {
            time: new Date(data.timestamp).toLocaleTimeString(),
            temperature: data.temperature,
            humidity: data.humidity,
            pressure: data.pressure / 10, // Scale pressure for better visualization
            altitude: data.altitude
          }]
          return newHistory.slice(-20) // Keep only last 20 readings
        })
      }
    })

    return () => off(envRef, 'value', unsubscribe)
  }, [deviceId])

  return (
    <div className="space-y-4">
      {/* Current Environmental Readings */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-red-500 ml-auto" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.temperature.toFixed(1)}°C</div>
            <p className="text-xs text-muted-foreground">Current reading</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Humidity</CardTitle>
            <Droplets className="h-4 w-4 text-blue-500 ml-auto" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.humidity.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Relative humidity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pressure</CardTitle>
            <Gauge className="h-4 w-4 text-green-500 ml-auto" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.pressure.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">hPa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Altitude</CardTitle>
            <Mountain className="h-4 w-4 text-purple-500 ml-auto" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.altitude.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">meters</p>
          </CardContent>
        </Card>
      </div>

      {/* Environmental Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Environmental Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={envHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="temp" orientation="left" />
              <YAxis yAxisId="humidity" orientation="right" />
              <Tooltip />
              <Line
                yAxisId="temp"
                type="monotone"
                dataKey="temperature"
                stroke="#ef4444"
                strokeWidth={2}
                name="Temperature (°C)"
              />
              <Line
                yAxisId="humidity"
                type="monotone"
                dataKey="humidity"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Humidity (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pressure & Altitude Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Pressure & Altitude Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={envHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="pressure" orientation="left" />
              <YAxis yAxisId="altitude" orientation="right" />
              <Tooltip />
              <Line
                yAxisId="pressure"
                type="monotone"
                dataKey="pressure"
                stroke="#10b981"
                strokeWidth={2}
                name="Pressure (hPa/10)"
              />
              <Line
                yAxisId="altitude"
                type="monotone"
                dataKey="altitude"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="Altitude (m)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default EnvironmentalMonitor