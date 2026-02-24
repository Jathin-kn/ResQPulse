const GaugeChart = ({ value, min = 0, max = 100, title, unit, status = 'normal' }) => {
  const percentage = ((value - min) / (max - min)) * 100
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100)

  const statusColors = {
    normal: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
  }

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-slate-400 text-sm font-medium mb-4">{title}</h3>

      <svg width="150" height="100" viewBox="0 0 150 100">
        {/* Background arc */}
        <path
          d="M 20 80 A 60 60 0 0 1 130 80"
          fill="none"
          stroke="#334155"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Progress arc */}
        <path
          d="M 20 80 A 60 60 0 0 1 130 80"
          fill="none"
          stroke={statusColors[status]}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${(clampedPercentage / 100) * 188} 188`}
          style={{ transition: 'stroke-dasharray 0.3s ease' }}
        />
      </svg>

      <div className="text-center mt-4">
        <div className="text-2xl font-bold text-white">
          {value}
          <span className="text-sm text-slate-400 ml-1">{unit}</span>
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {min} - {max}
        </div>
      </div>
    </div>
  )
}

export default GaugeChart
