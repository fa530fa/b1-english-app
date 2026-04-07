import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Printer, Plus, ArrowUpDown, GripVertical, Check, Radio, Shuffle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getProfile } from '../lib/profile'
import { stopSpeaking, speakWithCallback, getRate } from '../lib/tts'
import { startSilentAudio, setupMediaSession, setMediaPlaying, clearMediaSession } from '../lib/mediaSession'
import QACard from '../components/QACard'
import LoadingSpinner from '../components/LoadingSpinner'
import BroadcastBar from '../components/BroadcastBar'
import { useDragSort } from '../lib/useDragSort'

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function CategoryPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cards, setCards] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reorderMode, setReorderMode] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)

  // Broadcast state
  const [broadcasting, setBroadcasting] = useState(false)
  const [broadcastPaused, setBroadcastPaused] = useState(false)
  const [broadcastIndex, setBroadcastIndex] = useState(0)
  const [broadcastPhase, setBroadcastPhase] = useState('question')
  const [broadcastLoop, setBroadcastLoop] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const broadcastActiveRef = useRef(false)
  const cleanupRef = useRef(null)
  const gapTimerRef = useRef(null)
  const broadcastCardsRef = useRef([])

  const isAll = id === 'all'

  useEffect(() => {
    loadCards()
  }, [id])

  // Cleanup on unmount
  useEffect(() => () => stopBroadcast(), [])

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

  // ── Broadcast logic ──

  function startBroadcast() {
    stopSpeaking()
    startSilentAudio()
    setupMediaSession({
      title: title || 'B1 廣播',
      onPlay: () => toggleBroadcastPause(),
      onPause: () => toggleBroadcastPause(),
      onStop: () => stopBroadcast(),
    })
    broadcastCardsRef.current = isShuffled ? shuffleArray(cards) : [...cards]
    setBroadcasting(true)
    setBroadcastPaused(false)
    setBroadcastLoop(0)
    setBroadcastIndex(0)
    setBroadcastPhase('question')
    setShowAnswer(false)
    broadcastActiveRef.current = true
    setMediaPlaying(true)
    broadcastStep(0, 'question', 0)
  }

  function stopBroadcast() {
    broadcastActiveRef.current = false
    stopSpeaking()
    clearTimeout(gapTimerRef.current)
    if (cleanupRef.current) cleanupRef.current()
    clearMediaSession()
    setBroadcasting(false)
    setBroadcastPaused(false)
    setShowAnswer(false)
  }

  function toggleBroadcastPause() {
    if (broadcastPaused) {
      setBroadcastPaused(false)
      broadcastActiveRef.current = true
      setMediaPlaying(true)
      broadcastStep(broadcastIndex, broadcastPhase, broadcastLoop)
    } else {
      broadcastActiveRef.current = false
      stopSpeaking()
      clearTimeout(gapTimerRef.current)
      if (cleanupRef.current) cleanupRef.current()
      setMediaPlaying(false)
      setBroadcastPaused(true)
    }
  }

  function broadcastStep(idx, phase, loopCount) {
    if (!broadcastActiveRef.current) return

    const list = broadcastCardsRef.current

    // End of cards — re-snapshot if shuffled, then loop
    if (idx >= list.length) {
      if (isShuffled) broadcastCardsRef.current = shuffleArray(cards)
      const nextLoop = loopCount + 1
      setBroadcastLoop(nextLoop)
      gapTimerRef.current = setTimeout(() => {
        if (!broadcastActiveRef.current) return
        broadcastStep(0, 'question', nextLoop)
      }, 1500)
      return
    }

    const card = list[idx]
    setBroadcastIndex(idx)
    setBroadcastPhase(phase)

    if (phase === 'question') {
      setShowAnswer(false)
      cleanupRef.current = speakWithCallback(card.question_en, getRate(), () => {
        if (!broadcastActiveRef.current) return
        setBroadcastPhase('gap-q')
        gapTimerRef.current = setTimeout(() => {
          broadcastStep(idx, 'answer', loopCount)
        }, 1500)
      })
    } else if (phase === 'answer') {
      setShowAnswer(true)
      cleanupRef.current = speakWithCallback(card.answer_en, getRate(), () => {
        if (!broadcastActiveRef.current) return
        setBroadcastPhase('gap-a')
        gapTimerRef.current = setTimeout(() => {
          broadcastStep(idx + 1, 'question', loopCount)
        }, 2000)
      })
    }
  }

  const handleReorder = useCallback(async (newCards) => {
    setCards(newCards)
    await Promise.all(
      newCards.map((card, i) =>
        supabase.from('cards').update({ sort_order: i }).eq('id', card.id)
      )
    )
  }, [])

  const { displayItems, draggedId, itemRefs, startDrag } = useDragSort(
    cards,
    handleReorder
  )

  if (loading) return <LoadingSpinner />

  const title = isAll ? '全部卡片' : category?.name || '卡片'
  const broadcastCard = broadcasting ? broadcastCardsRef.current[broadcastIndex] : null

  return (
    <div className="px-4 pt-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 animate-fade-in-up">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-cream-dark rounded-xl transition-colors press-scale shrink-0"
          aria-label="返回"
        >
          <ChevronLeft size={24} className="text-ink" />
        </button>
        <div className="flex items-center gap-2 min-w-0">
          {!isAll && category?.color && (
            <div
              className="w-3.5 h-3.5 rounded-full shrink-0"
              style={{ backgroundColor: category.color, boxShadow: `0 0 8px ${category.color}30` }}
            />
          )}
          <h1 className="text-xl font-bold font-chinese text-ink truncate">{title}</h1>
        </div>
        <span className="text-ink-light text-sm font-chinese ml-auto shrink-0">
          {cards.length} 張
        </span>

        {/* Controls — hide in reorder/broadcast mode */}
        {!reorderMode && !broadcasting && cards.length > 1 && (
          <>
            <button
              onClick={() => setIsShuffled(!isShuffled)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-sm font-chinese press-scale transition-colors shrink-0 ${
                isShuffled
                  ? 'bg-accent text-white'
                  : 'bg-surface border border-cream-dark/60 text-ink-light'
              }`}
            >
              <Shuffle size={13} />
              隨機
            </button>
            <button
              onClick={() => startBroadcast()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-sm font-chinese press-scale transition-colors bg-surface border border-cream-dark/60 text-ink-light shrink-0"
            >
              <Radio size={13} />
              廣播
            </button>
          </>
        )}

        {/* Broadcast active — show stop button */}
        {broadcasting && (
          <button
            onClick={stopBroadcast}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-sm font-chinese press-scale bg-accent text-white shrink-0"
          >
            <Radio size={13} />
            廣播中
          </button>
        )}

        {/* Reorder toggle — only for specific categories, not "all", not during broadcast */}
        {!isAll && !broadcasting && cards.length > 1 && (
          <button
            onClick={() => setReorderMode(!reorderMode)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-sm font-chinese press-scale transition-colors shrink-0 ${
              reorderMode
                ? 'bg-accent text-white'
                : 'bg-surface border border-cream-dark/60 text-ink-light'
            }`}
          >
            {reorderMode ? <Check size={13} /> : <ArrowUpDown size={13} />}
            {reorderMode ? '完成' : '排列'}
          </button>
        )}

        <button
          onClick={() => navigate(isAll ? '/print' : `/print?category=${id}`)}
          className="p-2 hover:bg-accent-light rounded-xl transition-colors press-scale shrink-0"
          aria-label="列印此分類"
        >
          <Printer size={18} className="text-ink-light" />
        </button>
      </div>

      {/* FAB - Add card (hide during broadcast/reorder) */}
      {!reorderMode && !broadcasting && (
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
          <p className="text-ink-light font-chinese text-lg mb-4">此分類暫無卡片</p>
          <button
            onClick={() => navigate('/add')}
            className="px-6 py-3 bg-gradient-to-r from-accent to-accent-dark text-white font-chinese font-bold rounded-xl shadow-warm transition-all press-scale"
          >
            新增卡片
          </button>
        </div>
      ) : broadcasting ? (
        /* Broadcast view — show current card + bar */
        <>
          {broadcastCard && (
            <div className="bg-surface rounded-2xl shadow-warm border border-cream-dark/40 overflow-hidden mb-4 animate-fade-in-up">
              <div className="p-5">
                <span className="text-xs font-chinese font-medium text-accent bg-accent-light px-2.5 py-1 rounded-lg">問題</span>
                <p className="text-xl leading-relaxed text-ink mt-3">{broadcastCard.question_en}</p>
                {broadcastCard.question_zh && (
                  <p className="text-sm font-chinese text-ink-light mt-2">{broadcastCard.question_zh}</p>
                )}
              </div>
              {showAnswer && (
                <>
                  <div className="mx-5 h-px bg-cream-dark/40" />
                  <div className="p-5 bg-accent-light/20 animate-fade-in-up">
                    <span className="text-xs font-chinese font-medium text-secondary bg-secondary-light px-2.5 py-1 rounded-lg">答案</span>
                    <p className="text-xl leading-relaxed text-ink mt-3">{broadcastCard.answer_en}</p>
                    {broadcastCard.answer_zh && (
                      <p className="text-sm font-chinese text-ink-light mt-2">{broadcastCard.answer_zh}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
          <BroadcastBar
            playing={!broadcastPaused}
            onToggle={toggleBroadcastPause}
            onStop={stopBroadcast}
            currentIndex={broadcastIndex}
            totalCards={cards.length}
            phase={broadcastPhase}
            loopCount={broadcastLoop}
          />
        </>
      ) : reorderMode ? (
        <div className="space-y-2">
          {displayItems.map((card, i) => (
            <div
              key={card.id}
              ref={(el) => { itemRefs.current[i] = el }}
              className={`flex items-center gap-2 rounded-2xl border transition-all ${
                card.id === draggedId
                  ? 'opacity-40 scale-95 border-accent/40'
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
