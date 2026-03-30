import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Star, Pencil, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getSetting } from '../lib/settings'
import SpeakButton from '../components/SpeakButton'
import WordTapOverlay from '../components/WordTapOverlay'
import LoadingSpinner from '../components/LoadingSpinner'

export default function CardDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [card, setCard] = useState(null)
  const [showZh, setShowZh] = useState(() => getSetting('showChineseByDefault'))
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [siblings, setSiblings] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const cancelRef = useRef(null)

  useEffect(() => {
    loadCard()
  }, [id])

  // Focus trap + Escape for delete modal
  const handleModalKeyDown = useCallback((e) => {
    if (e.key === 'Escape') setShowDeleteConfirm(false)
  }, [])

  useEffect(() => {
    if (showDeleteConfirm) {
      cancelRef.current?.focus()
      document.addEventListener('keydown', handleModalKeyDown)
      return () => document.removeEventListener('keydown', handleModalKeyDown)
    }
  }, [showDeleteConfirm, handleModalKeyDown])

  async function loadCard() {
    setLoading(true)
    const { data } = await supabase
      .from('cards')
      .select('*')
      .eq('id', id)
      .single()
    setCard(data)

    if (data) {
      let query = supabase
        .from('cards')
        .select('id')
        .order('created_at', { ascending: false })

      if (data.category_id) {
        query = query.eq('category_id', data.category_id)
      }

      const { data: sibs } = await query
      setSiblings(sibs || [])
      const idx = (sibs || []).findIndex((s) => s.id === id)
      setCurrentIndex(idx >= 0 ? idx : 0)
    }
    setLoading(false)
  }

  async function handleToggleStar() {
    const newVal = !card.is_starred
    setCard({ ...card, is_starred: newVal })
    await supabase.from('cards').update({ is_starred: newVal }).eq('id', id)
  }

  async function handleDelete() {
    await supabase.from('cards').delete().eq('id', id)
    navigate(-1)
  }

  function goToSibling(direction) {
    const newIndex = currentIndex + direction
    if (newIndex >= 0 && newIndex < siblings.length) {
      navigate(`/card/${siblings[newIndex].id}`, { replace: true })
    }
  }

  if (loading) return <LoadingSpinner />
  if (!card) {
    return (
      <div className="px-4 pt-6 text-center">
        <p className="font-chinese text-ink-light">找不到此卡片</p>
      </div>
    )
  }

  return (
    <div className="px-4 pt-6 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-cream-dark rounded-xl transition-colors press-scale"
          aria-label="返回"
        >
          <ChevronLeft size={24} className="text-ink" />
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={handleToggleStar}
            className="p-2.5 hover:bg-accent-light rounded-xl transition-colors press-scale"
            aria-label={card.is_starred ? '取消收藏' : '收藏'}
          >
            <Star
              size={20}
              className={card.is_starred ? 'text-star' : 'text-ink-faint'}
              fill={card.is_starred ? 'currentColor' : 'none'}
            />
          </button>
          <button
            onClick={() => navigate(`/edit/${card.id}`)}
            className="p-2.5 hover:bg-accent-light rounded-xl transition-colors press-scale"
            aria-label="編輯"
          >
            <Pencil size={20} className="text-ink-light" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2.5 hover:bg-danger-light rounded-xl transition-colors press-scale"
            aria-label="刪除"
          >
            <Trash2 size={20} className="text-danger" />
          </button>
        </div>
      </div>

      {/* Question */}
      <div className="bg-surface rounded-2xl p-5 shadow-warm-sm border border-cream-dark/40 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-chinese font-medium text-accent bg-accent-light px-2.5 py-1 rounded-lg">
            問題 Question
          </span>
          <SpeakButton text={card.question_en} size="lg" />
        </div>
        <div className="text-xl leading-relaxed text-ink mb-2">
          <WordTapOverlay text={card.question_en} />
        </div>
        {card.question_zh && (
          <button
            onClick={() => setShowZh(!showZh)}
            className="w-full text-left"
          >
            {showZh ? (
              <p className="text-base font-chinese text-ink-light leading-relaxed">
                {card.question_zh}
              </p>
            ) : (
              <p className="text-sm font-chinese text-accent">
                點擊顯示中文翻譯
              </p>
            )}
          </button>
        )}
      </div>

      {/* Answer */}
      <div className="bg-surface rounded-2xl p-5 shadow-warm-sm border border-cream-dark/40 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-chinese font-medium text-secondary bg-secondary-light px-2.5 py-1 rounded-lg">
            答案 Answer
          </span>
          <SpeakButton text={card.answer_en} size="lg" />
        </div>
        <div className="text-xl leading-relaxed text-ink mb-2">
          <WordTapOverlay text={card.answer_en} />
        </div>
        {card.answer_zh && (
          <button
            onClick={() => setShowZh(!showZh)}
            className="w-full text-left"
          >
            {showZh ? (
              <p className="text-base font-chinese text-ink-light leading-relaxed">
                {card.answer_zh}
              </p>
            ) : (
              <p className="text-sm font-chinese text-accent">
                點擊顯示中文翻譯
              </p>
            )}
          </button>
        )}
      </div>

      {/* Notes */}
      {card.notes && (
        <div className="bg-secondary-light rounded-2xl p-4 mb-4">
          <p className="text-xs font-chinese text-secondary mb-1">備註</p>
          <p className="text-sm font-chinese text-ink">{card.notes}</p>
        </div>
      )}

      {/* Navigation */}
      {siblings.length > 1 && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => goToSibling(-1)}
            disabled={currentIndex <= 0}
            className="px-4 py-3 font-chinese text-accent hover:bg-accent-light rounded-xl transition-colors disabled:opacity-30 press-scale flex items-center gap-1"
          >
            <ChevronLeft size={18} />
            上一張
          </button>
          <span className="text-sm font-chinese text-ink-light">
            第 {currentIndex + 1}/{siblings.length} 張
          </span>
          <button
            onClick={() => goToSibling(1)}
            disabled={currentIndex >= siblings.length - 1}
            className="px-4 py-3 font-chinese text-accent hover:bg-accent-light rounded-xl transition-colors disabled:opacity-30 press-scale flex items-center gap-1"
          >
            下一張
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="確認刪除"
        >
          <div className="bg-surface rounded-2xl p-6 w-full max-w-sm shadow-warm-lg animate-scale-in">
            <h2 className="text-lg font-bold font-chinese text-ink mb-2">
              確定刪除？
            </h2>
            <p className="text-ink-light font-chinese text-sm mb-5">
              此操作無法復原，卡片將會永久刪除。
            </p>
            <div className="flex gap-3">
              <button
                ref={cancelRef}
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 font-chinese text-ink bg-cream-dark hover:bg-cream-dark/80 rounded-xl transition-colors press-scale"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 font-chinese text-white bg-danger hover:bg-danger-dark rounded-xl transition-colors font-bold press-scale"
              >
                確定刪除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
