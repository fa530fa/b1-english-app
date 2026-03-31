import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Library } from 'lucide-react'
import BottomNav from './components/BottomNav'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import CardFormPage from './pages/CardFormPage'
import CardDetailPage from './pages/CardDetailPage'
import PracticePage from './pages/PracticePage'
import BulkImportPage from './pages/BulkImportPage'
import SettingsPage from './pages/SettingsPage'
import PrintPage from './pages/PrintPage'
import VocabPage from './pages/VocabPage'
import VocabPracticePage from './pages/VocabPracticePage'
import { PROFILES, hasProfile, setProfile } from './lib/profile'

function ProfilePicker({ onSelect }) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 bg-cream animate-fade-in">
      <div className="w-full max-w-sm text-center">
        <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center mx-auto mb-6 shadow-warm">
          <Library size={36} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-ink mb-1.5 font-serif">
          B1 口試練習
        </h1>
        <p className="text-ink-faint font-chinese text-base mb-10">
          請選擇使用者
        </p>
        <div className="space-y-3">
          {PROFILES.map((p, i) => (
            <button
              key={p.id}
              onClick={() => {
                setProfile(p.id)
                onSelect()
              }}
              className="w-full py-5 px-6 bg-surface rounded-2xl shadow-warm border border-cream-dark/40 hover:shadow-warm-lg transition-all text-left press-scale animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center shrink-0">
                  <span className="text-accent font-bold text-lg">{p.name[0]}</span>
                </div>
                <p className="font-bold text-lg text-ink">{p.name}</p>
              </div>
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
        <Route path="import" element={<BulkImportPage />} />
        <Route path="practice" element={<PracticePage />} />
        <Route path="print" element={<PrintPage />} />
        <Route path="vocab" element={<VocabPage />} />
        <Route path="vocab/practice" element={<VocabPracticePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </div>
  )
}
