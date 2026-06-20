'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export interface Toast {
  id: string
  type: 'success' | 'error'
  message: string
}

export interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, type?: 'success' | 'error') => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (message: string, type: 'success' | 'error' = 'success') => {
      const id = Date.now().toString()
      setToasts((prev) => [...prev, { id, type, message }])

      setTimeout(() => {
        removeToast(id)
      }, 3000)
    },
    [removeToast]
  )

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
