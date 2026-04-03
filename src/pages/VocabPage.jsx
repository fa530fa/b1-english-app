import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookA, Plus, Volume2, ChevronDown, ChevronUp, Trash2, CheckCircle2, Search, Loader2, ArrowUpDown, GripVertical, Check, Radio } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getProfile } from '../lib/profile'
import { speak, stopSpeaking, speakWithCallback, getRate } from '../lib/tts'
import { translateToZH } from '../lib/translate'
import { lookupWord } from '../lib/dictionary'
import { useDragSort } from '../lib/useDragSort'
import BroadcastBar from '../components/BroadcastBar'

export default function VocabPage() {
  const navigate = useNavigate()
  const [words, setWords] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newWord, setNewWord] = useState('')
  const [adding, setAdding] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [revealedZh, setRevealedZh] = useState({})
  const [filter, setFilter] = useState('all') // all | learning | mastered
  const [reorderMode, setReorderMode] = useState(false)

  // Broadcast state
  const [broadcasting, setBroadcasting] = useState(false)
  const [broadcastPaused, setBroadcastPaused] = useState(false)
  const [broadcastIndex, setBroadcastIndex] = useState(0)
  const [broadcastPhase, setBroadcastPhase] = useState('word')
  const [broadcastLoop, setBroadcastLoop] = useState(0)
  const broadcastActiveRef = useRef(false)
  const cleanupRef = useRef(null)
  const gapTimerRef = useRef(null)

  // Cleanup on unmount
  useEffect(() => () => stopBroadcast(), [])

  useEffect(() => {
    loadWords()
  }, [filter])

  async function loadWords() {
    setLoading(true)
    let query = supabase
      .from('vocabulary')
      .select('*')
      .eq('profile', getProfile())
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (filter === 'learning') query = query.eq('is_mastered', false)
    if (filter === 'mastered') query = query.eq('is_mastered', true)

    let { data, error } = await query

    // Fallback if sort_order column hasn't been added yet
    if (error) {
      let fallback = supabase
        .from('vocabulary')
        .select('*')
        .eq('profile', getProfile())
        .order('created_at', { ascending: false })
      if (filter === 'learning') fallback = fallback.eq('is_mastered', false)
      if (filter === 'mastered') fallback = fallback.eq('is_mastered', true)
      const { data: fallbackData } = await fallback
      data = fallbackData
    }

    setWords(data || [])
    setLoading(false)
  }

  async function handleAddWord() {
    const word = newWord.trim().toLowerCase()
    if (!word) return

    setAdding(true)

    const info = await lookupWord(word)
    const zh = await translateToZH(word)

    const row = {
      profile: getProfile(),
      word: info?.word || word,
      phonetic: info?.phonetic || null,
      part_of_speech: info?.partOfSpeech || null,
      definition_en: info?.definitionEn || null,
      definition_zh: zh || null,
      example_en: info?.example || null,
      is_mastered: false,
    }

    const { data } = await supabase.from('vocabulary').insert(row).select().single()

    if (data) {
      setWords([data, ...words])
      setNewWord('')
      setShowAdd(false)
    }

    setAdding(false)
  }

  async function toggleMastered(id, current) {
    await supabase.from('vocabulary').update({ is_mastered: !current }).eq('id', id)
    setWords(words.map((w) => (w.id === id ? { ...w, is_mastered: !current } : w)))
  }

  async function deleteWord(id) {
    await supabase.from('vocabulary').delete().eq('id', id)
    setWords(words.filter((w) => w.id !== id))
  }

  function toggleRevealZh(id) {
    setRevealedZh((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function startBroadcast() {
    stopSpeaking()
    setBroadcasting(true)
    setBroadcastPaused(false)
    setBroadcastLoop(0)
    setBroadcastIndex(0)
    setBroadcastPhase('word')
    broadcastActiveRef.current = true
    broadcastStep(0, 'word', 0)
  }

  function stopBroadcast() {
    broadcastActiveRef.current = false
    stopSpeaking()
    clearTimeout(gapTimerRef.current)
    if (cleanupRef.current) cleanupRef.current()
    setBroadcasting(false)
    setBroadcastPaused(false)
  }

  function toggleBroadcastPause() {
    if (broadcastPaused) {
      setBroadcastPaused(false)
      broadcastActiveRef.current = true
      broadcastStep(broadcastIndex, broadcastPhase, broadcastLoop)
    } else {
      broadcastActiveRef.current = false
      stopSpeaking()
      clearTimeout(gapTimerRef.current)
      if (cleanupRef.current) cleanupRef.current()
      setBroadcastPaused(true)
    }
  }

  function broadcastStep(idx, phase, loopCount) {
    if (!broadcastActiveRef.current) return

    // End of list — loop back
    if (idx >= words.length) {
      const nextLoop = loopCount + 1
      setBroadcastLoop(nextLoop)
      gapTimerRef.current = setTimeout(() => {
        if (!broadcastActiveRef.current) return
        broadcastStep(0, 'word', nextLoop)
      }, 1500)
      return
    }

    const w = words[idx]
    setBroadcastIndex(idx)
    setBroadcastPhase(phase)

    if (phase === 'word') {
      cleanupRef.current = speakWithCallback(w.word, getRate(), () => {
        if (!broadcastActiveRef.current) return
        setBroadcastPhase('gap-w')
        gapTimerRef.current = setTimeout(() => {
          broadcastStep(idx + 1, 'word', loopCount)
        }, 1500)
      })
    }
  }

  const handleReorder = useCallback(async (newWords) => {
    setWords(newWords)
    await Promise.all(
      newWords.map((w, i) =>
        supabase.from('vocabulary').update({ sort_order: i }).eq('id', w.id)
      )
    )
  }, [])

  const { displayItems, draggedId, itemRefs, startDrag } = useDragSort(
    words,
    handleReorder
  )

  const masteredCount = words.filter((w) => w.is_mastered).length

  return (
    <div className="px-4 pt-6 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookA size={22} className="text-accent" />
          <h1 className="text-xl font-bold font-serif text-ink">生字簿</h1>
        </div>
        <div className="flex items-center gap-2">
          {words.length > 1 && filter === 'all' && !broadcasting && (
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
          {!reorderMode && words.length > 0 && (
            <button
              onClick={() => (broadcasting ? stopBroadcast() : startBroadcast())}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-chinese rounded-xl press-scale transition-colors ${
                broadcasting
                  ? 'bg-accent text-white'
                  : 'bg-surface border border-cream-dark/60 text-ink-light'
              }`}
            >
              <Radio size={14} />
              廣播
            </button>
          )}
          {!reorderMode && !broadcasting && (
            <button
              onClick={() => navigate('/vocab/practice')}
              className="px-4 py-2 text-sm font-chinese font-bold text-white bg-gradient-to-r from-accent to-accent-dark rounded-xl press-scale shadow-warm"
            >
              每日練習
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="flex-1 bg-surface rounded-xl p-3 shadow-warm-sm border border-cream-dark/40 text-center">
          <p className="text-2xl font-bold text-ink">{words.length}</p>
          <p className="text-xs font-chinese text-ink-light">總生字</p>
        </div>
        <div className="flex-1 bg-surface rounded-xl p-3 shadow-warm-sm border border-cream-dark/40 text-center">
          <p className="text-2xl font-bold text-accent">{masteredCount}</p>
          <p className="text-xs font-chinese text-ink-light">已掌握</p>
        </div>
        <div className="flex-1 bg-surface rounded-xl p-3 shadow-warm-sm border border-cream-dark/40 text-center">
          <p className="text-2xl font-bold text-secondary">{words.length - masteredCount}</p>
          <p className="text-xs font-chinese text-ink-light">學習中</p>
        </div>
      </div>

      {/* Broadcast Bar */}
      {broadcasting && (
        <BroadcastBar
          playing={!broadcastPaused}
          onToggle={toggleBroadcastPause}
          onStop={stopBroadcast}
          currentIndex={broadcastIndex}
          totalCards={words.length}
          phase={broadcastPhase}
          loopCount={broadcastLoop}
        />
      )}

      {/* Filter + Add (hidden in reorder/broadcast mode) */}
      {!reorderMode && !broadcasting && (
        <div className="flex gap-2 mb-4">
          {['all', 'learning', 'mastered'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 text-sm rounded-xl border font-chinese transition-colors press-scale ${
                filter === f
                  ? 'bg-accent text-white border-accent'
                  : 'bg-surface border-cream-dark/60 text-ink-light'
              }`}
            >
              {f === 'all' ? '全部' : f === 'learning' ? '學習中' : '已掌握'}
            </button>
          ))}
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="ml-auto px-3 py-2 text-sm rounded-xl bg-accent text-white font-chinese transition-colors press-scale flex items-center gap-1"
          >
            <Plus size={16} />
            新增
          </button>
        </div>
      )}

      {/* Add word form */}
      {showAdd && !reorderMode && !broadcasting && (
        <div className="bg-surface rounded-2xl shadow-warm-sm border border-cream-dark/40 p-4 mb-4 animate-fade-in-up">
          <div className="flex gap-2">
            <input
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddWord()}
              placeholder="輸入英文生字..."
              className="flex-1 px-4 py-3 text-base rounded-xl border border-cream-dark/60 bg-surface focus:border-accent outline-none shadow-warm-sm"
              autoFocus
            />
            <button
              onClick={handleAddWord}
              disabled={adding || !newWord.trim()}
              className="px-5 py-3 bg-accent text-white rounded-xl font-chinese text-sm font-bold hover:bg-accent-dark transition-colors press-scale disabled:opacity-50 flex items-center gap-1.5"
            >
              {adding ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )}
              {adding ? '查詢中' : '加入'}
            </button>
          </div>
          <p className="text-xs font-chinese text-ink-faint mt-2">
            輸入後會自動查字典、翻譯中文、取得例句
          </p>
        </div>
      )}

      {/* Word list */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 size={24} className="text-accent animate-spin mx-auto" />
        </div>
      ) : words.length === 0 ? (
        <div className="text-center py-12 animate-fade-in">
          <BookA size={40} className="text-ink-faint mx-auto mb-3" />
          <p className="text-ink-light font-chinese text-lg">
            {filter !== 'all' ? '沒有符合的生字' : '還沒有生字'}
          </p>
        </div>
      ) : reorderMode ? (
        /* Reorder list */
        <div className="space-y-2">
          {displayItems.map((w, i) => (
            <div
              key={w.id}
              ref={(el) => { itemRefs.current[i] = el }}
              className={`flex items-center gap-2 bg-surface rounded-2xl border shadow-warm-sm transition-all ${
                w.id === draggedId
                  ? 'opacity-40 scale-95 border-accent/40'
                  : 'border-cream-dark/40'
              }`}
            >
              <button
                onPointerDown={(e) => startDrag(e, i)}
                style={{ touchAction: 'none' }}
                className="pl-4 py-4 pr-2 text-ink-faint cursor-grab shrink-0"
                aria-label="拖曳排列"
              >
                <GripVertical size={20} />
              </button>
              <div className="flex-1 py-3 pr-4 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-ink">{w.word}</span>
                  {w.part_of_speech && (
                    <span className="text-xs text-ink-faint italic">({w.part_of_speech})</span>
                  )}
                </div>
                {w.phonetic && (
                  <p className="text-xs text-ink-faint mt-0.5">{w.phonetic}</p>
                )}
              </div>
              <div className={`w-2 h-2 rounded-full mr-4 shrink-0 ${w.is_mastered ? 'bg-accent' : 'bg-cream-dark'}`} />
            </div>
          ))}
        </div>
      ) : (
        /* Normal list */
        <div className="space-y-2">
          {words.map((w, i) => (
            <WordCard
              key={w.id}
              word={w}
              isExpanded={expandedId === w.id}
              isZhRevealed={revealedZh[w.id]}
              onToggleExpand={() =>
                setExpandedId(expandedId === w.id ? null : w.id)
              }
              onRevealZh={() => toggleRevealZh(w.id)}
              onToggleMastered={() => toggleMastered(w.id, w.is_mastered)}
              onDelete={() => deleteWord(w.id)}
              style={{ animationDelay: `${Math.min(i, 15) * 30}ms` }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function WordCard({
  word: w,
  isExpanded,
  isZhRevealed,
  onToggleExpand,
  onRevealZh,
  onToggleMastered,
  onDelete,
  style,
}) {
  return (
    <div
      className="bg-surface rounded-2xl shadow-warm-sm border border-cream-dark/40 overflow-hidden animate-fade-in-up"
      style={style}
    >
      {/* Main row */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Speak button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            speak(w.word)
          }}
          className="p-2 hover:bg-accent-light rounded-xl transition-colors press-scale shrink-0"
          aria-label="朗讀"
        >
          <Volume2 size={18} className="text-accent" />
        </button>

        {/* Word + phonetic */}
        <button
          onClick={onToggleExpand}
          className="flex-1 text-left min-w-0"
        >
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-ink">{w.word}</span>
            {w.part_of_speech && (
              <span className="text-xs text-ink-faint italic">({w.part_of_speech})</span>
            )}
          </div>
          {w.phonetic && (
            <p className="text-xs text-ink-faint">{w.phonetic}</p>
          )}
        </button>

        {/* Mastered indicator */}
        <button
          onClick={onToggleMastered}
          className={`p-1.5 rounded-lg transition-colors press-scale ${
            w.is_mastered ? 'text-success' : 'text-ink-faint hover:text-ink-light'
          }`}
          aria-label={w.is_mastered ? '已掌握' : '標記為已掌握'}
        >
          <CheckCircle2 size={20} fill={w.is_mastered ? 'currentColor' : 'none'} />
        </button>

        {/* Expand toggle */}
        <button
          onClick={onToggleExpand}
          className="p-1.5 text-ink-faint hover:text-ink-light press-scale"
          aria-label="展開詳情"
        >
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-cream-dark/30 animate-fade-in-up">
          {/* Chinese translation - hidden by default */}
          <div className="mt-3">
            {isZhRevealed ? (
              <div className="animate-fade-in">
                <span className="text-xs font-chinese text-accent font-medium">中文解釋：</span>
                <p className="text-base font-chinese text-ink mt-0.5">
                  {w.definition_zh || '無翻譯'}
                </p>
              </div>
            ) : (
              <button
                onClick={onRevealZh}
                className="px-4 py-2 text-sm font-chinese text-accent bg-accent-light rounded-xl press-scale hover:bg-accent/10 transition-colors"
              >
                顯示中文解釋
              </button>
            )}
          </div>

          {/* English definition */}
          {w.definition_en && (
            <div className="mt-3">
              <span className="text-xs text-ink-light font-medium">Definition:</span>
              <p className="text-sm text-ink leading-relaxed mt-0.5">
                {w.definition_en}
              </p>
            </div>
          )}

          {/* Example sentence */}
          {w.example_en && (
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-ink-light font-medium">Example:</span>
                <button
                  onClick={() => speak(w.example_en)}
                  className="p-1 hover:bg-accent-light rounded transition-colors"
                  aria-label="朗讀例句"
                >
                  <Volume2 size={14} className="text-accent" />
                </button>
              </div>
              <p className="text-sm text-ink italic leading-relaxed mt-0.5">
                "{w.example_en}"
              </p>
            </div>
          )}

          {/* Delete */}
          <div className="mt-3 flex justify-end">
            <button
              onClick={onDelete}
              className="px-3 py-1.5 text-xs font-chinese text-danger hover:bg-danger-light rounded-lg press-scale transition-colors flex items-center gap-1"
            >
              <Trash2 size={12} />
              刪除
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
