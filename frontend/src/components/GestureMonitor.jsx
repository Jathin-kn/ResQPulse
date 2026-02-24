import { useState, useEffect } from 'react'
import { getDatabase, ref, onValue, off } from 'firebase/database'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { Hand, AlertTriangle, Activity } from 'lucide-react'

const GestureMonitor = ({ deviceId = 'esp32-cpr-001' }) => {
  const [gestureData, setGestureData] = useState({
    proximity: 0,
    gesture: -1,
    sos_triggered: false,
    timestamp: 0
  })

  const [gestureHistory, setGestureHistory] = useState([])

  useEffect(() => {
    const db = getDatabase()
    const gestureRef = ref(db, `devices/${deviceId}/gesture`)

    const unsubscribe = onValue(gestureRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        setGestureData(data)

        // Add to history for logging
        if (data.gesture !== -1 || data.sos_triggered) {
          setGestureHistory(prev => [{
            time: new Date(data.timestamp).toLocaleTimeString(),
            gesture: getGestureName(data.gesture),
            proximity: data.proximity,
            sos_triggered: data.sos_triggered,
            type: data.sos_triggered ? 'SOS' : 'Gesture'
          }, ...prev.slice(0, 9)]) // Keep last 10 events
        }
      }
    })

    return () => off(gestureRef, 'value', unsubscribe)
  }, [deviceId])

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

  const getGestureColor = (gesture) => {
    switch (gesture) {
      case 0: return 'bg-blue-500'    // UP
      case 1: return 'bg-red-500'     // DOWN
      case 2: return 'bg-green-500'   // LEFT
      case 3: return 'bg-yellow-500'  // RIGHT
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-4">
      {/* SOS Alert */}
      {gestureData.sos_triggered && (
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="font-semibold text-red-800">
            🚨 EMERGENCY SOS TRIGGERED! Medical assistance required immediately.
          </AlertDescription>
        </Alert>
      )}

      {/* Current Gesture Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Gesture</CardTitle>
            <Hand className="h-4 w-4 text-muted-foreground ml-auto" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${getGestureColor(gestureData.gesture)}`} />
              <div>
                <div className="text-lg font-semibold">{getGestureName(gestureData.gesture)}</div>
                <p className="text-sm text-muted-foreground">Gesture detected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proximity Sensor</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground ml-auto" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gestureData.proximity}</div>
            <p className="text-xs text-muted-foreground">Proximity value (0-255)</p>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(gestureData.proximity / 255) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gesture Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle>Gesture Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {gestureHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No gesture activity recorded yet
              </p>
            ) : (
              gestureHistory.map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <Badge variant={entry.type === 'SOS' ? 'destructive' : 'default'}>
                      {entry.type}
                    </Badge>
                    <span className="text-sm font-medium">{entry.gesture}</span>
                    <span className="text-xs text-muted-foreground">
                      Proximity: {entry.proximity}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{entry.time}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Gesture Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use Gesture Control</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Available Gestures:</h4>
              <ul className="space-y-1">
                <li className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span>UP - Navigate up in menus</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span>DOWN - Emergency SOS trigger</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span>LEFT - Previous option</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span>RIGHT - Next option</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Proximity Sensor:</h4>
              <p className="text-muted-foreground">
                Measures how close objects are to the sensor. Higher values indicate closer proximity.
                Used for touchless interaction and hand detection during CPR.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default GestureMonitor