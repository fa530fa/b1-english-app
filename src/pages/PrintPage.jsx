import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronLeft, Printer, Star, Filter } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getProfile } from '../lib/profile'
import LoadingSpinner from '../components/LoadingSpinner'

export default function PrintPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [categories, setCategories] = useState([])
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [starredOnly, setStarredOnly] = useState(false)
  const [showChinese, setShowChinese] = useState(true)
  const [showNotes, setShowNotes] = useState(false)
  const [showNumbers, setShowNumbers] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    loadCards()
  }, [selectedCategory, starredOnly])

  async function loadCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('profile', getProfile())
      .order('sort_order', { ascending: true })
    setCategories(data || [])
  }

  async function loadCards() {
    setLoading(true)
    let query = supabase
      .from('cards')
      .select('*, categories(name)')
      .eq('profile', getProfile())
      .order('created_at', { ascending: true })

    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory)
    }
    if (starredOnly) {
      query = query.eq('is_starred', true)
    }

    const { data } = await query
    setCards(data || [])
    setLoading(false)
  }

  function handlePrint() {
    window.print()
  }

  const categoryName = selectedCategory
    ? categories.find((c) => c.id === selectedCategory)?.name || '未知分類'
    : '全部卡片'

  return (
    <div className="px-4 pt-6 pb-24 animate-fade-in">
      {/* Header — hidden on print */}
      <div className="no-print">
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-cream-dark rounded-xl transition-colors press-scale"
            aria-label="返回"
          >
            <ChevronLeft size={24} className="text-ink" />
          </button>
          <h1 className="text-xl font-bold text-ink font-serif flex items-center gap-2">
            <Printer size={22} className="text-accent" />
            <span className="font-chinese">列印卡片</span>
          </h1>
        </div>

        {/* Filter controls */}
        <div className="bg-surface rounded-2xl shadow-warm-sm border border-cream-dark/40 p-4 mb-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-chinese font-bold text-ink">
            <Filter size={16} className="text-accent" />
            選擇列印內容
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-chinese text-ink-light mb-1">分類</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 text-base rounded-xl border border-cream-dark/60 bg-surface focus:border-accent outline-none font-chinese shadow-warm-sm"
            >
              <option value="">全部分類</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-2">
            <TogglePill
              active={starredOnly}
              onClick={() => setStarredOnly(!starredOnly)}
              icon={<Star size={14} />}
              label="只印星標"
            />
            <TogglePill
              active={showChinese}
              onClick={() => setShowChinese(!showChinese)}
              label="中文翻譯"
            />
            <TogglePill
              active={showNotes}
              onClick={() => setShowNotes(!showNotes)}
              label="備註"
            />
            <TogglePill
              active={showNumbers}
              onClick={() => setShowNumbers(!showNumbers)}
              label="題號"
            />
          </div>

          {/* Card count + print button */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-chinese text-ink-light">
              共 {cards.length} 張卡片
            </span>
            <button
              onClick={handlePrint}
              disabled={cards.length === 0}
              className="px-6 py-3 font-bold font-chinese text-white bg-gradient-to-r from-accent to-accent-dark rounded-xl shadow-warm hover:shadow-warm-lg transition-all disabled:opacity-50 press-scale flex items-center gap-2"
            >
              <Printer size={18} />
              列印
            </button>
          </div>
        </div>
      </div>

      {/* Print content */}
      {loading ? (
        <LoadingSpinner />
      ) : cards.length === 0 ? (
        <p className="text-center text-ink-light font-chinese py-12 no-print">
          沒有符合條件的卡片
        </p>
      ) : (
        <div>
          {/* Print header — only visible on print */}
          <div className="hidden print:block print-header">
            <p className="text-base font-bold">{categoryName}（{cards.length} 題）</p>
          </div>

          {/* Card list */}
          <div className="print-list space-y-3 print:space-y-0">
            {cards.map((card, i) => (
              <div
                key={card.id}
                className="print-card bg-surface rounded-2xl shadow-warm-sm border border-cream-dark/40 p-4 animate-fade-in-up"
                style={{ animationDelay: `${Math.min(i, 10) * 30}ms` }}
              >
                {/* Question */}
                <div className="mb-1.5 print:mb-0.5">
                  <p className="text-base text-ink leading-snug">
                    {showNumbers && (
                      <span className="font-bold text-accent print:text-black mr-1">{i + 1}.</span>
                    )}
                    <span className="font-semibold print:font-bold">{card.question_en}</span>
                  </p>
                  {showChinese && card.question_zh && (
                    <p className="text-sm font-chinese text-ink-light mt-0.5 print:mt-0 print:text-gray-500">
                      {showNumbers && <span className="invisible mr-1">{i + 1}.</span>}
                      {card.question_zh}
                    </p>
                  )}
                </div>

                {/* Answer */}
                <div className="print:mb-0">
                  <p className="text-base text-ink leading-snug">
                    {showNumbers && <span className="invisible mr-1">{i + 1}.</span>}
                    {card.answer_en}
                  </p>
                  {showChinese && card.answer_zh && (
                    <p className="text-sm font-chinese text-ink-light mt-0.5 print:mt-0 print:text-gray-500">
                      {showNumbers && <span className="invisible mr-1">{i + 1}.</span>}
                      {card.answer_zh}
                    </p>
                  )}
                </div>

                {/* Notes */}
                {showNotes && card.notes && (
                  <p className="text-sm font-chinese text-ink-light bg-secondary-light/50 rounded-lg px-3 py-1.5 mt-1 print:bg-gray-100 print:mt-0.5 print:px-0 print:py-0">
                    {card.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function TogglePill({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 text-sm rounded-xl border font-chinese transition-colors flex items-center gap-1.5 press-scale ${
        active
          ? 'bg-accent text-white border-accent'
          : 'bg-surface border-cream-dark/60 text-ink-light'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
