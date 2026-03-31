import { useEffect, useState, useCallback, useRef } from 'react'
import { BookOpen, Shuffle, Volume2, ChevronDown, ChevronLeft, ChevronRight, Radio } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getProfile } from '../lib/profile'
import { getSetting } from '../lib/settings'
import { speak, stopSpeaking, speakWithCallback, getRate } from '../lib/tts'
import SpeakButton from '../components/SpeakButton'
import WordTapOverlay from '../components/WordTapOverlay'
import BroadcastBar from '../components/BroadcastBar'
import LoadingSpinner from '../components/LoadingSpinner'

function shuffleArray(arr) {
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

  // Broadcast state
  const [broadcasting, setBroadcasting] = useState(false)
  const [broadcastPaused, setBroadcastPaused] = useState(false)
  const [broadcastIndex, setBroadcastIndex] = useState(0)
  const [broadcastPhase, setBroadcastPhase] = useState('question')
  const [broadcastDone, setBroadcastDone] = useState(false)
  const cleanupRef = useRef(null)
  const gapTimerRef = useRef(null)
  const broadcastActiveRef = useRef(false)

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    loadCards()
  }, [filterId, isShuffled])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopBroadcast()
    }
  }, [])

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
    if (isShuffled) result = shuffleArray(result)
    setCards(result)
    setCurrentIndex(0)
    setShowAnswer(false)
    setLoading(false)
    // Stop broadcast if cards change
    if (broadcasting) stopBroadcast()
  }

  const currentCard = cards[currentIndex]

  const goTo = useCallback(
    (direction) => {
      if (broadcasting) return
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
    [currentIndex, cards, autoSpeak, broadcasting]
  )

  useEffect(() => {
    if (autoSpeak && currentCard && !broadcasting) {
      speak(currentCard.question_en)
    }
  }, [currentIndex, autoSpeak])

  // ── Broadcast logic ──

  function startBroadcast() {
    stopSpeaking()
    setBroadcasting(true)
    setBroadcastPaused(false)
    setBroadcastDone(false)
    setBroadcastIndex(0)
    setBroadcastPhase('question')
    setCurrentIndex(0)
    setShowAnswer(false)
    broadcastActiveRef.current = true
    broadcastStep(0, 'question')
  }

  function stopBroadcast() {
    broadcastActiveRef.current = false
    stopSpeaking()
    clearTimeout(gapTimerRef.current)
    if (cleanupRef.current) cleanupRef.current()
    setBroadcasting(false)
    setBroadcastPaused(false)
    setBroadcastDone(false)
  }

  function toggleBroadcastPause() {
    if (broadcastPaused) {
      // Resume
      setBroadcastPaused(false)
      broadcastActiveRef.current = true
      broadcastStep(broadcastIndex, broadcastPhase)
    } else {
      // Pause
      broadcastActiveRef.current = false
      stopSpeaking()
      clearTimeout(gapTimerRef.current)
      if (cleanupRef.current) cleanupRef.current()
      setBroadcastPaused(true)
    }
  }

  function broadcastStep(idx, phase) {
    if (!broadcastActiveRef.current) return
    if (idx >= cards.length) {
      setBroadcastDone(true)
      stopBroadcast()
      return
    }

    const card = cards[idx]
    setBroadcastIndex(idx)
    setBroadcastPhase(phase)
    setCurrentIndex(idx)

    if (phase === 'question') {
      setShowAnswer(false)
      cleanupRef.current = speakWithCallback(card.question_en, getRate(), () => {
        if (!broadcastActiveRef.current) return
        setBroadcastPhase('gap-q')
        gapTimerRef.current = setTimeout(() => {
          broadcastStep(idx, 'answer')
        }, 1500)
      })
    } else if (phase === 'answer') {
      setShowAnswer(true)
      cleanupRef.current = speakWithCallback(card.answer_en, getRate(), () => {
        if (!broadcastActiveRef.current) return
        setBroadcastPhase('gap-a')
        gapTimerRef.current = setTimeout(() => {
          broadcastStep(idx + 1, 'question')
        }, 2000)
      })
    }
  }

  if (loading) return <LoadingSpinner />

  if (cards.length === 0) {
    return (
      <div className="px-4 pt-6 pb-24 text-center animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-6">
          <BookOpen size={24} className="text-accent" />
          <h1 className="text-xl font-bold font-serif text-ink">練習模式</h1>
        </div>
        <p className="text-ink-light font-chinese text-lg py-12">
          {filterId ? '此分類暫無卡片' : '還沒有卡片可以練習'}
        </p>
      </div>
    )
  }

  return (
    <div className="px-4 pt-6 pb-24">
      {/* Header + Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold font-serif text-ink">練習</h1>
          <span className="text-sm font-chinese text-ink-light">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>
        <div className="h-1 bg-cream-dark/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <select
          value={filterId}
          onChange={(e) => setFilterId(e.target.value)}
          className="px-3 py-2 text-sm rounded-xl border border-cream-dark/60 bg-surface font-chinese shadow-warm-sm"
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
          className={`px-3 py-2 text-sm rounded-xl border font-chinese transition-colors flex items-center gap-1.5 ${
            isShuffled
              ? 'bg-accent text-white border-accent'
              : 'bg-surface border-cream-dark/60 text-ink-light'
          }`}
        >
          <Shuffle size={14} />
          隨機
        </button>
        <button
          onClick={() => setAutoSpeak(!autoSpeak)}
          className={`px-3 py-2 text-sm rounded-xl border font-chinese transition-colors flex items-center gap-1.5 ${
            autoSpeak
              ? 'bg-accent text-white border-accent'
              : 'bg-surface border-cream-dark/60 text-ink-light'
          }`}
        >
          <Volume2 size={14} />
          自動朗讀
        </button>
        <button
          onClick={() => setShowZh(!showZh)}
          className={`px-3 py-2 text-sm rounded-xl border font-chinese transition-colors ${
            showZh
              ? 'bg-accent text-white border-accent'
              : 'bg-surface border-cream-dark/60 text-ink-light'
          }`}
        >
          中 中文
        </button>
        <button
          onClick={() => (broadcasting ? stopBroadcast() : startBroadcast())}
          className={`px-3 py-2 text-sm rounded-xl border font-chinese transition-colors flex items-center gap-1.5 ${
            broadcasting
              ? 'bg-accent text-white border-accent'
              : 'bg-surface border-cream-dark/60 text-ink-light'
          }`}
        >
          <Radio size={14} />
          廣播
        </button>
      </div>

      {/* Flashcard */}
      {currentCard && (
        <div className="bg-surface rounded-2xl shadow-warm border border-cream-dark/40 overflow-hidden">
          {/* Question */}
          <div className="p-5 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-chinese font-medium text-accent bg-accent-light px-2.5 py-1 rounded-lg">
                問題
              </span>
              <SpeakButton text={currentCard.question_en} size="lg" />
            </div>
            <div className="text-xl md:text-2xl leading-relaxed text-ink">
              <WordTapOverlay text={currentCard.question_en} />
            </div>
            {showZh && currentCard.question_zh && (
              <p className="text-base font-chinese text-ink-light mt-3 leading-relaxed">
                {currentCard.question_zh}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="mx-5 h-px bg-cream-dark/40" />

          {/* Answer (tap to reveal) */}
          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full p-6 text-center font-chinese text-accent text-lg hover:bg-accent-light/40 transition-colors flex items-center justify-center gap-2"
            >
              點擊顯示答案
              <ChevronDown size={20} className="animate-bounce-subtle" />
            </button>
          ) : (
            <div className="p-5 md:p-6 bg-accent-light/20 animate-fade-in-up">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-chinese font-medium text-secondary bg-secondary-light px-2.5 py-1 rounded-lg">
                  答案
                </span>
                <SpeakButton text={currentCard.answer_en} size="lg" />
              </div>
              <div className="text-xl md:text-2xl leading-relaxed text-ink">
                <WordTapOverlay text={currentCard.answer_en} />
              </div>
              {showZh && currentCard.answer_zh && (
                <p className="text-base font-chinese text-ink-light mt-3 leading-relaxed">
                  {currentCard.answer_zh}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Broadcast Bar */}
      {broadcasting && (
        <BroadcastBar
          playing={!broadcastPaused}
          onToggle={toggleBroadcastPause}
          onStop={stopBroadcast}
          currentIndex={broadcastIndex}
          totalCards={cards.length}
          phase={broadcastPhase}
        />
      )}

      {/* Broadcast done message */}
      {broadcastDone && !broadcasting && (
        <div className="mt-4 p-4 bg-accent-light rounded-2xl text-center font-chinese text-accent font-medium animate-fade-in-up">
          播放完畢！
        </div>
      )}

      {/* Navigation */}
      {!broadcasting && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => goTo(-1)}
            disabled={currentIndex <= 0}
            className="px-5 py-3 font-chinese font-bold text-accent bg-surface border border-cream-dark/40 hover:bg-cream-dark/30 rounded-xl transition-colors disabled:opacity-30 press-scale flex items-center gap-1"
          >
            <ChevronLeft size={18} />
            上一題
          </button>
          <button
            onClick={() => goTo(1)}
            disabled={currentIndex >= cards.length - 1}
            className="px-5 py-3 font-chinese font-bold text-white bg-gradient-to-r from-accent to-accent-dark rounded-xl transition-colors disabled:opacity-30 press-scale flex items-center gap-1"
          >
            下一題
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
