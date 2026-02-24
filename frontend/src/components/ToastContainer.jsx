import { useToast } from '@/context/ToastContext'
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'

const Toast = ({ toast, onRemove }) => {
  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-green-900/90',
          border: 'border-green-700',
          text: 'text-green-300',
          icon: CheckCircle
        }
      case 'error':
        return {
          bg: 'bg-red-900/90',
          border: 'border-red-700',
          text: 'text-red-300',
          icon: AlertCircle
        }
      case 'warning':
        return {
          bg: 'bg-yellow-900/90',
          border: 'border-yellow-700',
          text: 'text-yellow-300',
          icon: AlertTriangle
        }
      default:
        return {
          bg: 'bg-blue-900/90',
          border: 'border-blue-700',
          text: 'text-blue-300',
          icon: Info
        }
    }
  }

  const styles = getStyles()
  const IconComponent = styles.icon

  return (
    <div
      className={`${styles.bg} border ${styles.border} rounded-lg px-4 py-3 mb-3 flex items-start justify-between gap-3 backdrop-blur-sm`}
    >
      <div className="flex items-start gap-3">
        <IconComponent className={`w-5 h-5 ${styles.text} flex-shrink-0 mt-0.5`} />
        <p className={`${styles.text} text-sm`}>{toast.message}</p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className={`${styles.text} hover:opacity-75 transition-opacity flex-shrink-0`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full px-4">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}

export default ToastContainer
