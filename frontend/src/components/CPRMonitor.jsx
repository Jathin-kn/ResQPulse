import { useState, useEffect } from 'react'
import { getDatabase, ref, onValue, off } from 'firebase/database'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Activity, Thermometer, Droplets, Mountain, Hand, Zap } from 'lucide-react'

const CPRMonitor = ({ deviceId = 'esp32-cpr-001' }) => {
  const [cprData, setCprData] = useState({
    compression_rate: 0,
    compression_depth: 0,
    acceleration_x: 0,
    acceleration_y: 0,
    acceleration_z: 0,
    quality_score: 0,
    timestamp: 0
  })

  const [environmentData, setEnvironmentData] = useState({
    temperature: 0,
    humidity: 0,
    pressure: 0,
    altitude: 0,
    timestamp: 0
  })

  const [gestureData, setGestureData] = useState({
    proximity: 0,
    gesture: -1,
    sos_triggered: false,
    timestamp: 0
  })

  const [statusData, setStatusData] = useState({
    wifi_connected: false,
    battery_level: 0,
    last_update: 0
  })

  useEffect(() => {
    const db = getDatabase()

    // Listen to CPR data
    const cprRef = ref(db, `devices/${deviceId}/cpr`)
    const cprUnsubscribe = onValue(cprRef, (snapshot) => {
      if (snapshot.exists()) {
        setCprData(snapshot.val())
      }
    })

    // Listen to environment data
    const envRef = ref(db, `devices/${deviceId}/environment`)
    const envUnsubscribe = onValue(envRef, (snapshot) => {
      if (snapshot.exists()) {
        setEnvironmentData(snapshot.val())
      }
    })

    // Listen to gesture data
    const gestureRef = ref(db, `devices/${deviceId}/gesture`)
    const gestureUnsubscribe = onValue(gestureRef, (snapshot) => {
      if (snapshot.exists()) {
        setGestureData(snapshot.val())
      }
    })

    // Listen to status data
    const statusRef = ref(db, `devices/${deviceId}/status`)
    const statusUnsubscribe = onValue(statusRef, (snapshot) => {
      if (snapshot.exists()) {
        setStatusData(snapshot.val())
      }
    })

    // Cleanup listeners
    return () => {
      off(cprRef, 'value', cprUnsubscribe)
      off(envRef, 'value', envUnsubscribe)
      off(gestureRef, 'value', gestureUnsubscribe)
      off(statusRef, 'value', statusUnsubscribe)
    }
  }, [deviceId])

  const getQualityColor = (score) => {
    if (score >= 0.8) return 'bg-green-500'
    if (score >= 0.6) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getGestureName = (gesture) => {
    const gestures = {
      0: 'UP',
      1: 'DOWN',
      2: 'LEFT',
      3: 'RIGHT',
      [-1]: 'NONE'
    }
    return gestures[gesture] || 'UNKNOWN'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {/* CPR Monitor */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CPR Monitor</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground ml-auto" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold">{cprData.compression_rate.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">Rate (per min)</p>
            </div>
            <div>
              <div className="text-2xl font-bold">{cprData.compression_depth.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Depth (cm)</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getQualityColor(cprData.quality_score)}`} />
              <span className="text-sm font-medium">
                Quality: {(cprData.quality_score * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Accel: X:{cprData.acceleration_x.toFixed(2)} Y:{cprData.acceleration_y.toFixed(2)} Z:{cprData.acceleration_z.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      {/* Environmental Monitor */}
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Environment</CardTitle>
          <Thermometer className="h-4 w-4 text-muted-foreground ml-auto" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Temperature</span>
              <span className="font-medium">{environmentData.temperature.toFixed(1)}°C</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Humidity</span>
              <span className="font-medium">{environmentData.humidity.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Pressure</span>
              <span className="font-medium">{environmentData.pressure.toFixed(1)} hPa</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Altitude</span>
              <span className="font-medium">{environmentData.altitude.toFixed(0)} m</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gesture Monitor */}
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gesture Control</CardTitle>
          <Hand className="h-4 w-4 text-muted-foreground ml-auto" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Gesture</span>
              <Badge variant={gestureData.gesture !== -1 ? "default" : "secondary"}>
                {getGestureName(gestureData.gesture)}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Proximity</span>
              <span className="font-medium">{gestureData.proximity}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">SOS Status</span>
              <Badge variant={gestureData.sos_triggered ? "destructive" : "secondary"}>
                {gestureData.sos_triggered ? "ACTIVE" : "NORMAL"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device Status */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-4">
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Device Status</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground ml-auto" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${statusData.wifi_connected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm">WiFi: {statusData.wifi_connected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Battery: {statusData.battery_level}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Device: {deviceId}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Last Update: {new Date(statusData.last_update).toLocaleTimeString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CPRMonitor