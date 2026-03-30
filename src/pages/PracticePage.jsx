import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { getProfile } from '../lib/profile'
import { getSetting } from '../lib/settings'
import { speak, stopSpeaking } from '../lib/tts'
import SpeakButton from '../components/SpeakButton'
import WordTapOverlay from '../components/WordTapOverlay'
import LoadingSpinner from '../components/LoadingSpinner'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function PracticePage() {
  const [cards, setCards] = useState([])
  const [categories, setCategories] = useState([])
  const [filterId, setFilterId] = useState('')
  const [isShuffled, setIsShuffled] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [showZh, setShowZh] = useState(() => getSetting('showChineseByDefault'))
  const [autoSpeak, setAutoSpeak] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    loadCards()
  }, [filterId, isShuffled])

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
      .select('*')
      .eq('profile', getProfile())
      .order('created_at', { ascending: false })

    if (filterId) {
      query = query.eq('category_id', filterId)
    }

    const { data } = await query
    let result = data || []
    if (isShuffled) result = shuffle(result)
    setCards(result)
    setCurrentIndex(0)
    setShowAnswer(false)
    setLoading(false)
  }

  const currentCard = cards[currentIndex]

  const goTo = useCallback(
    (direction) => {
      stopSpeaking()
      const next = currentIndex + direction
      if (next >= 0 && next < cards.length) {
        setCurrentIndex(next)
        setShowAnswer(false)
        if (autoSpeak && cards[next]) {
          setTimeout(() => speak(cards[next].question_en), 200)
        }
      }
    },
    [currentIndex, cards, autoSpeak]
  )

  useEffect(() => {
    if (autoSpeak && currentCard) {
      speak(currentCard.question_en)
    }
  }, [currentIndex, autoSpeak])

  if (loading) return <LoadingSpinner />

  if (cards.length === 0) {
    return (
      <div className="px-4 pt-6 pb-24 text-center">
        <h1 className="text-xl font-bold font-chinese text-ink mb-6">
          📖 練習模式
        </h1>
        <p className="text-ink-light font-chinese text-lg py-12">
          {filterId ? '此分類暫無卡片' : '還沒有卡片可以練習'}
        </p>
      </div>
    )
  }

  return (
    <div className="px-4 pt-6 pb-24">
      {/* Header + Controls */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold font-chinese text-ink">📖 練習</h1>
        <span className="text-sm font-chinese text-ink-light">
          第 {currentIndex + 1}/{cards.length} 題
        </span>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <select
          value={filterId}
          onChange={(e) => setFilterId(e.target.value)}
          className="px-3 py-2 text-sm rounded-xl border border-cream-dark bg-white font-chinese"
        >
          <option value="">全部分類</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => setIsShuffled(!isShuffled)}
          className={`px-3 py-2 text-sm rounded-xl border font-chinese transition-colors ${
            isShuffled
              ? 'bg-accent text-white border-accent'
              : 'bg-white border-cream-dark text-ink-light'
          }`}
        >
          🔀 隨機
        </button>
        <button
          onClick={() => setAutoSpeak(!autoSpeak)}
          className={`px-3 py-2 text-sm rounded-xl border font-chinese transition-colors ${
            autoSpeak
              ? 'bg-accent text-white border-accent'
              : 'bg-white border-cream-dark text-ink-light'
          }`}
        >
          🔊 自動朗讀
        </button>
        <button
          onClick={() => setShowZh(!showZh)}
          className={`px-3 py-2 text-sm rounded-xl border font-chinese transition-colors ${
            showZh
              ? 'bg-accent text-white border-accent'
              : 'bg-white border-cream-dark text-ink-light'
          }`}
        >
          中 中文
        </button>
      </div>

      {/* Flashcard */}
      {currentCard && (
        <div className="bg-white rounded-2xl shadow-sm border border-cream-dark overflow-hidden">
          {/* Question */}
          <div className="p-5 border-b border-cream-dark">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-chinese text-ink-light bg-cream-dark px-2 py-1 rounded-lg">
                問題
              </span>
              <SpeakButton text={currentCard.question_en} size="lg" />
            </div>
            <div className="text-xl leading-relaxed text-ink">
              <WordTapOverlay text={currentCard.question_en} />
            </div>
            {showZh && currentCard.question_zh && (
              <p className="text-base font-chinese text-ink-light mt-2 leading-relaxed">
                {currentCard.question_zh}
              </p>
            )}
          </div>

          {/* Answer (tap to reveal) */}
          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full p-6 text-center font-chinese text-accent text-lg hover:bg-cream-dark/30 transition-colors"
            >
              點擊顯示答案 👇
            </button>
          ) : (
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-chinese text-ink-light bg-cream-dark px-2 py-1 rounded-lg">
                  答案
                </span>
                <SpeakButton text={currentCard.answer_en} size="lg" />
              </div>
              <div className="text-xl leading-relaxed text-ink">
                <WordTapOverlay text={currentCard.answer_en} />
              </div>
              {showZh && currentCard.answer_zh && (
                <p className="text-base font-chinese text-ink-light mt-2 leading-relaxed">
                  {currentCard.answer_zh}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => goTo(-1)}
          disabled={currentIndex <= 0}
          className="px-6 py-3 font-chinese font-bold text-accent bg-white border border-cream-dark hover:bg-cream-dark rounded-xl transition-colors disabled:opacity-30"
        >
          ← 上一題
        </button>
        <button
          onClick={() => goTo(1)}
          disabled={currentIndex >= cards.length - 1}
          className="px-6 py-3 font-chinese font-bold text-white bg-accent hover:bg-accent-dark rounded-xl transition-colors disabled:opacity-30"
        >
          下一題 →
        </button>
      </div>
    </div>
  )
}
