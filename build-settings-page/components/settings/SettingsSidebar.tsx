'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  User,
  Palette,
  Lock,
  Bell,
  Eye,
  Compass,
  Sun,
  Award,
  Link as LinkIcon,
  Download,
} from 'lucide-react'
import { SETTINGS_SECTIONS } from '@/lib/constants'

const iconMap = {
  user: User,
  palette: Palette,
  lock: Lock,
  bell: Bell,
  eye: Eye,
  compass: Compass,
  sun: Sun,
  award: Award,
  link: LinkIcon,
  download: Download,
}

export function SettingsSidebar() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:block w-56 border-r border-border bg-card sticky top-0 h-screen overflow-y-auto">
      <div className="p-6 border-b border-border">
        <h1 className="text-xs font-mono font-bold tracking-widest text-accent uppercase">
          ⚙ Settings
        </h1>
      </div>

      <ul className="space-y-0.5 px-3 py-4 pb-6">
        {SETTINGS_SECTIONS.map((section) => {
          const IconComponent =
            iconMap[section.icon as keyof typeof iconMap] || User
          const isActive = pathname.includes(`/settings/${section.id}`)

          return (
            <li key={section.id}>
              <Link
                href={`/settings/${section.id}`}
                className={`flex items-center gap-3 px-3 py-2 rounded text-sm font-sans transition-colors duration-200 ${
                  isActive
                    ? 'bg-accent text-accent-foreground font-600'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <IconComponent className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{section.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
