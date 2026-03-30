import { NavLink } from 'react-router-dom'
import { Home, Plus, BookOpen, Settings } from 'lucide-react'

const tabs = [
  { to: '/', Icon: Home, label: '首頁' },
  { to: '/add', Icon: Plus, label: '新增' },
  { to: '/practice', Icon: BookOpen, label: '練習' },
  { to: '/settings', Icon: Settings, label: '設定' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-surface shadow-warm-up z-50">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            aria-label={tab.label}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-xl transition-all min-w-[64px] ${
                isActive
                  ? 'text-accent bg-accent-light'
                  : 'text-ink-light hover:text-ink'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <tab.Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-xs font-chinese font-medium">{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
