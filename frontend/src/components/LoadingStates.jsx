import React from 'react'

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  return (
    <div className={`inline-block animate-spin ${sizeClasses[size]} ${className}`}>
      <svg
        className="w-full h-full text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  )
}

export const LoadingOverlay = ({ isLoading, message = 'Loading...' }) => {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-bg-secondary rounded-lg p-8 flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-gray-700 dark:text-gray-200">{message}</p>
      </div>
    </div>
  )
}

export const SkeletonLoader = ({ count = 3, type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="space-y-4">
        {Array(count).fill(0).map((_, i) => (
          <div key={i} className="bg-gray-200 dark:bg-dark-bg-secondary rounded-lg h-24 animate-pulse" />
        ))}
      </div>
    )
  }

  if (type === 'line') {
    return (
      <div className="space-y-2">
        {Array(count).fill(0).map((_, i) => (
          <div key={i} className="bg-gray-200 dark:bg-dark-bg-secondary rounded h-4 animate-pulse" />
        ))}
      </div>
    )
  }

  if (type === 'table') {
    return (
      <div className="space-y-2">
        {Array(count).fill(0).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="bg-gray-200 dark:bg-dark-bg-secondary rounded h-8 w-full animate-pulse" />
            <div className="bg-gray-200 dark:bg-dark-bg-secondary rounded h-8 w-32 animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  return null
}

export const LoadingButton = ({ isLoading, children, ...props }) => {
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`flex items-center gap-2 ${props.className || ''}`}
    >
      {isLoading && <Spinner size="sm" />}
      {children}
    </button>
  )
}
