import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Library } from 'lucide-react'
import BottomNav from './components/BottomNav'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import CardFormPage from './pages/CardFormPage'
import CardDetailPage from './pages/CardDetailPage'
import PracticePage from './pages/PracticePage'
import SettingsPage from './pages/SettingsPage'
import { PROFILES, hasProfile, setProfile } from './lib/profile'

function ProfilePicker({ onSelect }) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 bg-cream animate-fade-in">
      <div className="w-full max-w-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-accent-light flex items-center justify-center mx-auto mb-5">
          <Library size={32} className="text-accent" />
        </div>
        <h1 className="text-3xl font-bold text-ink mb-2 font-serif">
          B1 口試練習
        </h1>
        <p className="text-ink-light font-chinese text-base mb-10">
          請選擇使用者
        </p>
        <div className="space-y-4">
          {PROFILES.map((p, i) => (
            <button
              key={p.id}
              onClick={() => {
                setProfile(p.id)
                onSelect()
              }}
              className="w-full py-5 px-6 bg-surface rounded-2xl shadow-warm-sm border border-cream-dark/40 hover:shadow-warm transition-all text-left press-scale animate-fade-in-up border-l-4 border-l-accent"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <p className="font-bold text-xl text-ink">{p.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [ready, setReady] = useState(hasProfile())

  if (!ready) {
    return <ProfilePicker onSelect={() => setReady(true)} />
  }

  return (
    <div className="pb-20">
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="category/:id" element={<CategoryPage />} />
        <Route path="add" element={<CardFormPage />} />
        <Route path="edit/:id" element={<CardFormPage />} />
        <Route path="card/:id" element={<CardDetailPage />} />
        <Route path="practice" element={<PracticePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </div>
  )
}
