import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Library, Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getProfile, getProfileName } from '../lib/profile'
import CategoryCard from '../components/CategoryCard'
import LoadingSpinner from '../components/LoadingSpinner'

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
      <div className="flex items-center gap-3 mb-6 animate-fade-in-up">
        <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center">
          <Library size={20} className="text-accent" />
        </div>
        <h1 className="text-2xl font-bold text-ink">
          <span className="font-serif">{getProfileName()}</span>
          <span className="font-chinese text-lg text-ink-light ml-1.5">的卡片</span>
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => navigate('/category/all')}
          className="bg-gradient-to-br from-accent to-accent-dark text-white rounded-2xl p-5 shadow-warm hover:shadow-warm-lg transition-all text-left col-span-2 press-scale animate-fade-in-up"
        >
          <span className="font-chinese font-bold text-lg">全部卡片</span>
          <p className="text-white/80 text-sm font-chinese mt-1">
            {totalCards} 張卡片
          </p>
        </button>

        {categories.map((cat, i) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            cardCount={cardCounts[cat.id] || 0}
            style={{ animationDelay: `${(i + 1) * 60}ms` }}
          />
        ))}
      </div>

      {categories.length === 0 && totalCards === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-secondary-light flex items-center justify-center mx-auto mb-4">
            <Sparkles size={28} className="text-secondary" />
          </div>
          <p className="text-ink-light font-chinese text-lg mb-4">
            還沒有卡片
          </p>
          <button
            onClick={() => navigate('/add')}
            className="px-6 py-3 bg-gradient-to-r from-accent to-accent-dark text-white font-chinese font-bold rounded-xl shadow-warm hover:shadow-warm-lg transition-all press-scale"
          >
            新增第一張卡片
          </button>
        </div>
      )}
    </div>
  )
}
