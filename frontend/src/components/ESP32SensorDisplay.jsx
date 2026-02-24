import { useData } from '@/context/DataContext'
import { Thermometer, Gauge, Radio, Zap } from 'lucide-react'

const ESP32SensorDisplay = () => {
  const { sensorData } = useData()

  const metrics = [
    {
      label: 'Temperature',
      value: sensorData?.temperature || 0,
      unit: '°C',
      icon: Thermometer,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10'
    },
    {
      label: 'Pressure',
      value: (sensorData?.pressure || 0).toFixed(2),
      unit: 'hPa',
      icon: Gauge,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Proximity',
      value: sensorData?.proximity || 0,
      unit: 'mm',
      icon: Radio,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    {
      label: 'Accel Z',
      value: (sensorData?.acceleration_z || 0).toFixed(2),
      unit: 'm/s²',
      icon: Zap,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon
        return (
          <div key={idx} className={`card p-4 ${metric.bgColor} border border-slate-700/50`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm font-medium">{metric.label}</span>
              <Icon className={`w-4 h-4 ${metric.color}`} />
            </div>
            <div className="flex items-baseline">
              <span className={`text-2xl font-bold ${metric.color}`}>
                {metric.value}
              </span>
              <span className="text-slate-500 text-xs ml-1">{metric.unit}</span>
            </div>
            <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full ${metric.color} bg-opacity-50 transition-all`}
                style={{ 
                  width: `${Math.min(100, (parseFloat(metric.value) / 100) * 100)}%` 
                }}
              ></div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ESP32SensorDisplay
