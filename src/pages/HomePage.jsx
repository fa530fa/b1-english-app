import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Library, Sparkles, Printer, BookOpen, BookA, Plus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getProfile, getProfileName } from '../lib/profile'
import CategoryCard from '../components/CategoryCard'
import LoadingSpinner from '../components/LoadingSpinner'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return '早安'
  if (h < 18) return '午安'
  return '晚安'
}

export default function HomePage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [cardCounts, setCardCounts] = useState({})
  const [totalCards, setTotalCards] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const profile = getProfile()
    const [{ data: cats }, { data: cards }] = await Promise.all([
      supabase
        .from('categories')
        .select('*')
        .eq('profile', profile)
        .order('sort_order', { ascending: true }),
      supabase
        .from('cards')
        .select('id, category_id')
        .eq('profile', profile),
    ])

    setCategories(cats || [])
    setTotalCards(cards?.length || 0)

    const counts = {}
    for (const card of cards || []) {
      const catId = card.category_id || 'uncategorized'
      counts[catId] = (counts[catId] || 0) + 1
    }
    setCardCounts(counts)
    setLoading(false)
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="px-4 pt-6 pb-24">
      {/* Greeting header */}
      <div className="mb-6 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-chinese text-ink-light">{getGreeting()}，</p>
            <h1 className="text-2xl font-bold text-ink font-serif">{getProfileName()}</h1>
          </div>
          <button
            onClick={() => navigate('/print')}
            className="p-2.5 hover:bg-cream-dark/50 rounded-xl transition-colors press-scale"
            aria-label="列印卡片"
          >
            <Printer size={20} className="text-ink-faint" />
          </button>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-5 animate-fade-in-up" style={{ animationDelay: '60ms' }}>
        <button
          onClick={() => navigate('/practice')}
          className="bg-surface rounded-2xl p-4 shadow-warm-sm border border-cream-dark/30 text-left press-scale hover:shadow-warm transition-all flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center shrink-0">
            <BookOpen size={20} className="text-accent" />
          </div>
          <div>
            <p className="font-chinese font-bold text-sm text-ink">練習模式</p>
            <p className="text-xs font-chinese text-ink-faint">{totalCards} 題</p>
          </div>
        </button>
        <button
          onClick={() => navigate('/vocab')}
          className="bg-surface rounded-2xl p-4 shadow-warm-sm border border-cream-dark/30 text-left press-scale hover:shadow-warm transition-all flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-secondary-light flex items-center justify-center shrink-0">
            <BookA size={20} className="text-secondary" />
          </div>
          <div>
            <p className="font-chinese font-bold text-sm text-ink">生字簿</p>
            <p className="text-xs font-chinese text-ink-faint">每日練習</p>
          </div>
        </button>
      </div>

      {/* All cards banner */}
      <button
        onClick={() => navigate('/category/all')}
        className="w-full bg-gradient-to-br from-accent to-accent-dark text-white rounded-2xl p-5 shadow-warm hover:shadow-warm-lg transition-all text-left press-scale animate-fade-in-up mb-4"
        style={{ animationDelay: '120ms' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="font-chinese font-bold text-lg">全部卡片</span>
            <p className="text-white/75 text-sm font-chinese mt-0.5">
              {totalCards} 張卡片 · {categories.length} 個分類
            </p>
          </div>
          <Library size={28} className="text-white/30" />
        </div>
      </button>

      {/* Category grid */}
      {categories.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {categories.map((cat, i) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              cardCount={cardCounts[cat.id] || 0}
              style={{ animationDelay: `${(i + 2) * 60}ms` }}
            />
          ))}
        </div>
      )}

      {/* FAB - Add card */}
      <button
        onClick={() => navigate('/add')}
        className="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-br from-accent to-accent-dark text-white rounded-full shadow-warm-lg press-scale flex items-center justify-center z-40"
        aria-label="新增卡片"
      >
        <Plus size={26} />
      </button>

      {categories.length === 0 && totalCards === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-secondary-light flex items-center justify-center mx-auto mb-4">
            <Sparkles size={28} className="text-secondary" />
          </div>
          <p className="text-ink-light font-chinese text-lg mb-1">還沒有卡片</p>
          <p className="text-ink-faint font-chinese text-sm mb-5">匯入你的第一套口試練習</p>
          <button
            onClick={() => navigate('/import')}
            className="px-6 py-3 bg-gradient-to-r from-accent to-accent-dark text-white font-chinese font-bold rounded-xl shadow-warm hover:shadow-warm-lg transition-all press-scale"
          >
            開始匯入
          </button>
        </div>
      )}
    </div>
  )
}
