'use client'

import { SettingsSidebar } from '@/components/settings/SettingsSidebar'
import { ToastProvider } from '@/lib/toast'
import { ToastContainer } from '@/components/settings/ToastContainer'

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ToastProvider>
      <div className="flex h-screen bg-background">
        <SettingsSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 py-8 md:px-8 pb-32">
            {children}
          </div>
        </main>
      </div>
      <ToastContainer />
    </ToastProvider>
  )
}
