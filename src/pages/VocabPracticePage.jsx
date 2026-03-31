import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Volume2, ChevronRight, RotateCcw, CheckCircle2, Trophy } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getProfile } from '../lib/profile'
import { speak } from '../lib/tts'
import LoadingSpinner from '../components/LoadingSpinner'

const DAILY_COUNT = 15

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function VocabPracticePage() {
  const navigate = useNavigate()
  const [words, setWords] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showZh, setShowZh] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState({}) // id -> 'know' | 'learning'
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    loadDailyWords()
  }, [])

  async function loadDailyWords() {
    setLoading(true)

    // Prioritize unmastered words, fill with mastered if not enough
    const { data: unmastered } = await supabase
      .from('vocabulary')
      .select('*')
      .eq('profile', getProfile())
      .eq('is_mastered', false)

    const { data: mastered } = await supabase
      .from('vocabulary')
      .select('*')
      .eq('profile', getProfile())
      .eq('is_mastered', true)

    let pool = shuffleArray(unmastered || [])
    if (pool.length < DAILY_COUNT) {
      pool = [...pool, ...shuffleArray(mastered || [])]
    }

    setWords(pool.slice(0, DAILY_COUNT))
    setCurrentIndex(0)
    setResults({})
    setFinished(false)
    setLoading(false)
  }

  const current = words[currentIndex]

  function handleAnswer(type) {
    const newResults = { ...results, [current.id]: type }
    setResults(newResults)

    // Mark as mastered if 'know', unmark if 'learning'
    if (type === 'know') {
      supabase
        .from('vocabulary')
        .update({ is_mastered: true, last_practiced_at: new Date().toISOString() })
        .eq('id', current.id)
        .then()
    } else {
      supabase
        .from('vocabulary')
        .update({ is_mastered: false, last_practiced_at: new Date().toISOString() })
        .eq('id', current.id)
        .then()
    }

    // Move to next or finish
    if (currentIndex + 1 >= words.length) {
      setFinished(true)
    } else {
      setCurrentIndex(currentIndex + 1)
      setShowZh(false)
      setShowDetails(false)
    }
  }

  function goNext() {
    if (currentIndex + 1 < words.length) {
      setCurrentIndex(currentIndex + 1)
      setShowZh(false)
      setShowDetails(false)
    }
  }

  // Auto-speak on card change
  useEffect(() => {
    if (current && !finished) {
      speak(current.word)
    }
  }, [currentIndex])

  if (loading) return <LoadingSpinner />

  if (words.length === 0) {
    return (
      <div className="px-4 pt-6 pb-24 text-center animate-fade-in">
        <button
          onClick={() => navigate('/vocab')}
          className="flex items-center gap-1 text-accent font-chinese mb-6 press-scale"
        >
          <ChevronLeft size={20} />
          返回生字簿
        </button>
        <p className="text-ink-light font-chinese text-lg py-12">
          還沒有生字，請先新增生字再來練習
        </p>
      </div>
    )
  }

  // Finished screen
  if (finished) {
    const knowCount = Object.values(results).filter((r) => r === 'know').length
    const learningCount = Object.values(results).filter((r) => r === 'learning').length

    return (
      <div className="px-4 pt-6 pb-24 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-accent-light flex items-center justify-center mx-auto mb-5">
          <Trophy size={32} className="text-accent" />
        </div>
        <h2 className="text-2xl font-bold font-serif text-ink mb-2">練習完成！</h2>
        <p className="text-base font-chinese text-ink-light mb-6">
          共練習 {words.length} 個生字
        </p>

        <div className="flex gap-4 justify-center mb-8">
          <div className="bg-accent-light rounded-2xl px-6 py-4 text-center">
            <p className="text-3xl font-bold text-accent">{knowCount}</p>
            <p className="text-xs font-chinese text-accent">已掌握</p>
          </div>
          <div className="bg-secondary-light rounded-2xl px-6 py-4 text-center">
            <p className="text-3xl font-bold text-secondary">{learningCount}</p>
            <p className="text-xs font-chinese text-secondary">繼續學</p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={loadDailyWords}
            className="w-full py-3.5 text-lg font-bold font-chinese text-white bg-gradient-to-r from-accent to-accent-dark rounded-xl shadow-warm press-scale flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} />
            再練一輪
          </button>
          <button
            onClick={() => navigate('/vocab')}
            className="w-full py-3.5 text-lg font-bold font-chinese text-accent bg-accent-light rounded-xl press-scale"
          >
            返回生字簿
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 pt-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/vocab')}
          className="p-2 hover:bg-cream-dark rounded-xl transition-colors press-scale"
          aria-label="返回"
        >
          <ChevronLeft size={24} className="text-ink" />
        </button>
        <h1 className="text-lg font-bold font-serif text-ink">每日練習</h1>
        <span className="text-sm font-chinese text-ink-light">
          {currentIndex + 1}/{words.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-cream-dark rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
        />
      </div>

      {/* Word card */}
      {current && (
        <div className="bg-surface rounded-2xl shadow-warm border border-cream-dark/40 overflow-hidden">
          {/* Word display */}
          <div className="p-6 md:p-10 text-center">
            <button
              onClick={() => speak(current.word)}
              className="inline-flex items-center gap-3 press-scale"
            >
              <Volume2 size={24} className="text-accent" />
              <span className="text-3xl font-bold text-ink">{current.word}</span>
            </button>
            {current.phonetic && (
              <p className="text-sm text-ink-faint mt-1">{current.phonetic}</p>
            )}
            {current.part_of_speech && (
              <p className="text-xs text-ink-faint italic mt-1">({current.part_of_speech})</p>
            )}
          </div>

          {/* Chinese reveal button */}
          <div className="px-6 pb-4">
            {showZh ? (
              <div className="text-center animate-fade-in-up">
                <p className="text-xl font-chinese text-ink font-bold">
                  {current.definition_zh || '無翻譯'}
                </p>
              </div>
            ) : (
              <button
                onClick={() => setShowZh(true)}
                className="w-full py-3 text-base font-chinese text-accent bg-accent-light rounded-xl press-scale hover:bg-accent/10 transition-colors"
              >
                顯示中文解釋
              </button>
            )}
          </div>

          {/* Details toggle */}
          <div className="px-6 pb-4">
            {showDetails ? (
              <div className="bg-cream-dark/20 rounded-xl p-4 space-y-3 animate-fade-in-up">
                {current.definition_en && (
                  <div>
                    <span className="text-xs text-ink-light font-medium">Definition:</span>
                    <p className="text-sm text-ink leading-relaxed">{current.definition_en}</p>
                  </div>
                )}
                {current.example_en && (
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-ink-light font-medium">Example:</span>
                      <button
                        onClick={() => speak(current.example_en)}
                        className="p-1 hover:bg-accent-light rounded"
                        aria-label="朗讀例句"
                      >
                        <Volume2 size={12} className="text-accent" />
                      </button>
                    </div>
                    <p className="text-sm text-ink italic">"{current.example_en}"</p>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowDetails(true)}
                className="w-full py-2 text-sm font-chinese text-ink-light hover:text-ink transition-colors"
              >
                查看詳情 ▾
              </button>
            )}
          </div>

          {/* Answer buttons */}
          <div className="flex border-t border-cream-dark/30">
            <button
              onClick={() => handleAnswer('learning')}
              className="flex-1 py-4 text-center font-chinese font-bold text-secondary hover:bg-secondary-light transition-colors press-scale border-r border-cream-dark/30"
            >
              繼續學
            </button>
            <button
              onClick={() => handleAnswer('know')}
              className="flex-1 py-4 text-center font-chinese font-bold text-accent hover:bg-accent-light transition-colors press-scale flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 size={18} />
              已掌握
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
