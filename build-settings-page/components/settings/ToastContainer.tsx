'use client'

import { useToast } from '@/lib/toast'
import { X, CheckCircle, AlertCircle } from 'lucide-react'

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-sans animate-in fade-in slide-in-from-bottom-3 duration-150 ${
            toast.type === 'success'
              ? 'bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100'
              : 'bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle className="w-4 h-4 flex-shrink-0 animate-in zoom-in duration-200" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0 animate-in zoom-in duration-200" />
          )}
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 hover:opacity-70 transition-opacity duration-150"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
