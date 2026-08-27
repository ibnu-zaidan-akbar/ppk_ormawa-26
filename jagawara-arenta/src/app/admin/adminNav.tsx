'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminNav() {
  const pathname = usePathname()

  const menuItems = [
    { href: '/admin', label: 'Dashboard Admin' },
    { href: '/admin/kelola-berita', label: 'Kelola Histori Bencana' },
    { href: '/admin/export-data', label: 'Monitoring Sensor & Export Data' },
    { href: '/admin/monitoring-aren', label: 'Monitoring Survival Rate Aren' },
  ]

  return (
    <nav className="flex-1 px-4 pb-4 space-y-2">
      {menuItems.map((item) => {
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block py-3 px-4 rounded transition duration-200 font-semibold active:scale-90 ${
              isActive 
                ? 'bg-blue-600 shadow-md text-white'
                : 'bg-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}