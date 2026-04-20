import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, RefreshCw, Plus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getProfile } from '../lib/profile'
import { translateToZH } from '../lib/translate'
import LoadingSpinner from '../components/LoadingSpinner'

export default function CardFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [questionEn, setQuestionEn] = useState('')
  const [questionZh, setQuestionZh] = useState('')
  const [answerEn, setAnswerEn] = useState('')
  const [answerZh, setAnswerZh] = useState('')
  const [notes, setNotes] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState([])
  const [newCatName, setNewCatName] = useState('')
  const [showNewCat, setShowNewCat] = useState(false)
  const [saving, setSaving] = useState(false)
  const [translatingQ, setTranslatingQ] = useState(false)
  const [translatingA, setTranslatingA] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [id])

  async function loadData() {
    const { data: cats } = await supabase
      .from('categories')
      .select('*')
      .eq('profile', getProfile())
      .order('sort_order', { ascending: true })
    setCategories(cats || [])

    if (isEdit) {
      const { data: card } = await supabase
        .from('cards')
        .select('*')
        .eq('id', id)
        .single()
      if (card) {
        setQuestionEn(card.question_en || '')
        setQuestionZh(card.question_zh || '')
        setAnswerEn(card.answer_en || '')
        setAnswerZh(card.answer_zh || '')
        setNotes(card.notes || '')
        setCategoryId(card.category_id || '')
      }
    }
    setLoading(false)
  }

  async function handleTranslateQ() {
    if (!questionEn.trim()) return
    setTranslatingQ(true)
    const result = await translateToZH(questionEn)
    setQuestionZh(result)
    setTranslatingQ(false)
  }

  async function handleTranslateA() {
    if (!answerEn.trim()) return
    setTranslatingA(true)
    const result = await translateToZH(answerEn)
    setAnswerZh(result)
    setTranslatingA(false)
  }

  async function handleCreateCategory() {
    if (!newCatName.trim()) return
    const { data } = await supabase
      .from('categories')
      .insert({ name: newCatName.trim(), profile: getProfile() })
      .select()
      .single()
    if (data) {
      setCategories([...categories, data])
      setCategoryId(data.id)
      setNewCatName('')
      setShowNewCat(false)
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!questionEn.trim() || !answerEn.trim()) return

    setSaving(true)

    const cardData = {
      question_en: questionEn.trim(),
      question_zh: questionZh.trim() || null,
      answer_en: answerEn.trim(),
      answer_zh: answerZh.trim() || null,
      notes: notes.trim() || null,
      category_id: categoryId || null,
      profile: getProfile(),
      updated_at: new Date().toISOString(),
    }

    if (isEdit) {
      await supabase.from('cards').update(cardData).eq('id', id)
    } else {
      await supabase.from('cards').insert(cardData)
    }

    setSaving(false)
    navigate(-1)
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="px-4 pt-6 pb-24 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-cream-dark rounded-xl transition-colors press-scale"
          aria-label="返回"
        >
          <ChevronLeft size={24} className="text-ink" />
        </button>
        <h1 className="text-xl font-bold font-chinese text-ink">
          {isEdit ? '編輯卡片' : '新增卡片'}
        </h1>
      </div>

      {!isEdit && (
        <button
          onClick={() => navigate('/import')}
          className="w-full mb-5 py-3 px-4 bg-accent-light text-accent rounded-xl font-chinese text-sm font-medium hover:bg-accent/10 transition-colors press-scale text-center"
        >
          有很多題目？批量匯入 →
        </button>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block text-sm font-serif font-semibold text-ink mb-1.5">
            英文問題
          </label>
          <textarea
            value={questionEn}
            onChange={(e) => setQuestionEn(e.target.value)}
            placeholder="輸入英文問題..."
            required
            rows={3}
            className="w-full px-4 py-3 text-lg rounded-xl border border-cream-dark/60 bg-surface focus:border-accent focus:ring-2 focus:ring-accent/15 outline-none resize-none transition-all shadow-warm-sm"
          />
          <button
            type="button"
            onClick={handleTranslateQ}
            disabled={translatingQ || !questionEn.trim()}
            className="mt-1.5 px-3 py-2 text-sm font-chinese text-accent hover:text-accent-dark disabled:text-ink-faint transition-colors flex items-center gap-1.5"
          >
            <RefreshCw size={14} className={translatingQ ? 'animate-spin' : ''} />
            {translatingQ ? '翻譯中...' : '自動翻譯成中文'}
          </button>
        </div>

        <div>
          <label className="block text-sm font-serif font-semibold text-ink mb-1.5">
            中文翻譯（問題）
          </label>
          <textarea
            value={questionZh}
            onChange={(e) => setQuestionZh(e.target.value)}
            placeholder="中文翻譯會自動填入，也可手動修改"
            rows={2}
            className="w-full px-4 py-3 text-base rounded-xl border border-cream-dark/60 bg-surface focus:border-accent focus:ring-2 focus:ring-accent/15 outline-none resize-none font-chinese transition-all shadow-warm-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-serif font-semibold text-ink mb-1.5">
            英文答案
          </label>
          <textarea
            value={answerEn}
            onChange={(e) => setAnswerEn(e.target.value)}
            placeholder="輸入英文答案..."
            required
            rows={4}
            className="w-full px-4 py-3 text-lg rounded-xl border border-cream-dark/60 bg-surface focus:border-accent focus:ring-2 focus:ring-accent/15 outline-none resize-none transition-all shadow-warm-sm"
          />
          <button
            type="button"
            onClick={handleTranslateA}
            disabled={translatingA || !answerEn.trim()}
            className="mt-1.5 px-3 py-2 text-sm font-chinese text-accent hover:text-accent-dark disabled:text-ink-faint transition-colors flex items-center gap-1.5"
          >
            <RefreshCw size={14} className={translatingA ? 'animate-spin' : ''} />
            {translatingA ? '翻譯中...' : '自動翻譯成中文'}
          </button>
        </div>

        <div>
          <label className="block text-sm font-serif font-semibold text-ink mb-1.5">
            中文翻譯（答案）
          </label>
          <textarea
            value={answerZh}
            onChange={(e) => setAnswerZh(e.target.value)}
            placeholder="中文翻譯會自動填入，也可手動修改"
            rows={3}
            className="w-full px-4 py-3 text-base rounded-xl border border-cream-dark/60 bg-surface focus:border-accent focus:ring-2 focus:ring-accent/15 outline-none resize-none font-chinese transition-all shadow-warm-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-serif font-semibold text-ink mb-1.5">
            分類
          </label>
          <div className="flex gap-2">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="flex-1 px-4 py-3 text-base rounded-xl border border-cream-dark/60 bg-surface focus:border-accent outline-none font-chinese shadow-warm-sm"
            >
              <option value="">不分類</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowNewCat(!showNewCat)}
              className="px-4 py-3 text-accent hover:bg-accent-light rounded-xl transition-colors font-chinese text-sm flex items-center gap-1 press-scale"
            >
              <Plus size={16} />
              新分類
            </button>
          </div>
          {showNewCat && (
            <div className="flex gap-2 mt-2 animate-fade-in-up">
              <input
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="分類名稱"
                className="flex-1 px-4 py-3 text-base rounded-xl border border-cream-dark/60 bg-surface focus:border-accent outline-none font-chinese shadow-warm-sm"
              />
              <button
                type="button"
                onClick={handleCreateCategory}
                className="px-4 py-3 bg-accent text-white rounded-xl font-chinese text-sm hover:bg-accent-dark transition-colors press-scale"
              >
                建立
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-serif font-semibold text-ink mb-1.5">
            備註（選填）
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="個人筆記..."
            rows={2}
            className="w-full px-4 py-3 text-base rounded-xl border border-cream-dark/60 bg-surface focus:border-accent focus:ring-2 focus:ring-accent/15 outline-none resize-none font-chinese transition-all shadow-warm-sm"
          />
        </div>

        <button
          type="submit"
          disabled={saving || !questionEn.trim() || !answerEn.trim()}
          className="w-full py-3.5 text-lg font-bold font-chinese text-white bg-gradient-to-r from-accent to-accent-dark rounded-xl shadow-warm hover:shadow-warm-lg transition-all disabled:opacity-50 press-scale"
        >
          {saving ? '儲存中...' : isEdit ? '更新卡片' : '新增卡片'}
        </button>
      </form>
    </div>
  )
}
