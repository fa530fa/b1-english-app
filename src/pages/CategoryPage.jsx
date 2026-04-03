import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Printer, Plus, ArrowUpDown, GripVertical, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getProfile } from '../lib/profile'
import QACard from '../components/QACard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useDragSort } from '../lib/useDragSort'

export default function CategoryPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cards, setCards] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reorderMode, setReorderMode] = useState(false)

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
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (!isAll) {
      query = query.eq('category_id', id)
    }

    let { data, error } = await query

    // Fallback if sort_order column hasn't been added yet
    if (error) {
      let fallback = supabase
        .from('cards')
        .select('*')
        .eq('profile', getProfile())
        .order('created_at', { ascending: false })
      if (!isAll) fallback = fallback.eq('category_id', id)
      const { data: fallbackData } = await fallback
      data = fallbackData
    }

    setCards(data || [])
    setLoading(false)
  }

  const handleReorder = useCallback(async (newCards) => {
    setCards(newCards)
    await supabase.from('cards').upsert(
      newCards.map((card, i) => ({ id: card.id, sort_order: i }))
    )
  }, [])

  const { displayItems, dragIdx, overIdx, itemRefs, startDrag } = useDragSort(
    cards,
    handleReorder
  )

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
        <span className="text-ink-light text-sm font-chinese ml-auto">
          {cards.length} 張
        </span>

        {/* Reorder toggle — only for specific categories, not "all" */}
        {!isAll && cards.length > 1 && (
          <button
            onClick={() => setReorderMode(!reorderMode)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-sm font-chinese press-scale transition-colors ${
              reorderMode
                ? 'bg-accent text-white'
                : 'bg-surface border border-cream-dark/60 text-ink-light'
            }`}
          >
            {reorderMode ? <Check size={14} /> : <ArrowUpDown size={14} />}
            {reorderMode ? '完成' : '排列'}
          </button>
        )}

        <button
          onClick={() => navigate(isAll ? '/print' : `/print?category=${id}`)}
          className="p-2 hover:bg-accent-light rounded-xl transition-colors press-scale"
          aria-label="列印此分類"
        >
          <Printer size={18} className="text-ink-light" />
        </button>
      </div>

      {/* FAB - Add card */}
      {!reorderMode && (
        <button
          onClick={() => navigate('/add')}
          className="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-br from-accent to-accent-dark text-white rounded-full shadow-warm-lg press-scale flex items-center justify-center z-40"
          aria-label="新增卡片"
        >
          <Plus size={26} />
        </button>
      )}

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
      ) : reorderMode ? (
        <div className="space-y-2">
          {displayItems.map((card, i) => (
            <div
              key={card.id}
              ref={(el) => { itemRefs.current[i] = el }}
              className={`flex items-center gap-2 rounded-2xl border transition-all ${
                dragIdx === i
                  ? 'opacity-40 border-accent/40'
                  : overIdx === i && dragIdx !== i
                  ? 'border-accent ring-2 ring-accent/30'
                  : 'border-transparent'
              }`}
            >
              <button
                onPointerDown={(e) => startDrag(e, i)}
                style={{ touchAction: 'none' }}
                className="p-3 text-ink-faint cursor-grab shrink-0"
                aria-label="拖曳排列"
              >
                <GripVertical size={20} />
              </button>
              <div className="flex-1 min-w-0">
                <QACard card={card} reorderMode />
              </div>
            </div>
          ))}
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
