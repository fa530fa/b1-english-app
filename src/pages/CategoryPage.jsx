import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Printer } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getProfile } from '../lib/profile'
import QACard from '../components/QACard'
import LoadingSpinner from '../components/LoadingSpinner'

export default function CategoryPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cards, setCards] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  const isAll = id === 'all'

  useEffect(() => {
    loadCards()
  }, [id])

  async function loadCards() {
    setLoading(true)

    if (!isAll) {
      const { data: cat } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single()
      setCategory(cat)
    }

    let query = supabase
      .from('cards')
      .select('*')
      .eq('profile', getProfile())
      .order('created_at', { ascending: false })

    if (!isAll) {
      query = query.eq('category_id', id)
    }

    const { data } = await query
    setCards(data || [])
    setLoading(false)
  }

  if (loading) return <LoadingSpinner />

  const title = isAll ? '全部卡片' : category?.name || '卡片'

  return (
    <div className="px-4 pt-6 pb-24">
      <div className="flex items-center gap-3 mb-6 animate-fade-in-up">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-cream-dark rounded-xl transition-colors press-scale"
          aria-label="返回"
        >
          <ChevronLeft size={24} className="text-ink" />
        </button>
        <div className="flex items-center gap-2.5">
          {!isAll && category?.color && (
            <div
              className="w-4 h-4 rounded-full shrink-0"
              style={{
                backgroundColor: category.color,
                boxShadow: `0 0 8px ${category.color}30`,
              }}
            />
          )}
          <h1 className="text-xl font-bold font-chinese text-ink">{title}</h1>
        </div>
        <span className="text-ink-light text-sm font-chinese ml-auto mr-1">
          {cards.length} 張
        </span>
        <button
          onClick={() => navigate(isAll ? '/print' : `/print?category=${id}`)}
          className="p-2 hover:bg-accent-light rounded-xl transition-colors press-scale"
          aria-label="列印此分類"
        >
          <Printer size={18} className="text-ink-light" />
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-12 animate-fade-in">
          <p className="text-ink-light font-chinese text-lg mb-4">
            此分類暫無卡片
          </p>
          <button
            onClick={() => navigate('/add')}
            className="px-6 py-3 bg-gradient-to-r from-accent to-accent-dark text-white font-chinese font-bold rounded-xl shadow-warm transition-all press-scale"
          >
            新增卡片
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {cards.map((card, i) => (
            <QACard
              key={card.id}
              card={card}
              style={{ animationDelay: `${i * 50}ms` }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
