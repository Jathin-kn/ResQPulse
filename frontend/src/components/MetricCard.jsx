import { TrendingUp, TrendingDown } from 'lucide-react'

const MetricCard = ({ title, value, unit, trend, icon: Icon, status = 'normal' }) => {
  const statusColors = {
    normal: 'text-green-400',
    warning: 'text-yellow-400',
    danger: 'text-red-400',
    info: 'text-blue-400',
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-2">{title}</p>
          <div className="flex items-baseline space-x-2">
            <span className={`text-3xl font-bold ${statusColors[status]}`}>{value}</span>
            {unit && <span className="text-slate-400 text-sm">{unit}</span>}
          </div>
        </div>
        {Icon && <Icon className={`w-8 h-8 ${statusColors[status]}`} />}
      </div>

      {trend && (
        <div className="mt-4 flex items-center space-x-2">
          {trend > 0 ? (
            <TrendingUp className="w-4 h-4 text-green-400" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-400" />
          )}
          <span className={trend > 0 ? 'text-green-400' : 'text-red-400'}>
            {Math.abs(trend)}% vs last hour
          </span>
        </div>
      )}
    </div>
  )
}

export default MetricCard
