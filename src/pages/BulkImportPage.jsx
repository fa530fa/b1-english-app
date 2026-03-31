import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, FileText, Plus, Check, AlertTriangle, Loader2, CheckCircle2, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getProfile } from '../lib/profile'
import { translateToZH } from '../lib/translate'
import { parseQAPairs } from '../lib/parser'
import { checkGrammar, applyFix } from '../lib/grammar'

const FORMAT_LABELS = {
  'qa-prefix': 'Q:/A: 格式',
  numbered: '編號格式',
  alternating: '段落交替格式',
}

const STEP_LABELS = ['貼上文字', '檢查修改', '完成']

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {STEP_LABELS.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                i < current
                  ? 'bg-accent text-white'
                  : i === current
                    ? 'bg-accent text-white'
                    : 'bg-cream-dark text-ink-faint'
              }`}
            >
              {i < current ? <Check size={16} /> : i + 1}
            </div>
            <span className="text-xs font-chinese text-ink-light">{label}</span>
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div className={`w-8 h-0.5 mb-5 ${i < current ? 'bg-accent' : 'bg-cream-dark'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function BulkImportPage() {
  const navigate = useNavigate()

  // Step state
  const [step, setStep] = useState(0)

  // Step 1: paste
  const [rawText, setRawText] = useState('')
  const [parseError, setParseError] = useState('')

  // Category picker
  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState('')
  const [showNewCat, setShowNewCat] = useState(false)
  const [newCatName, setNewCatName] = useState('')

  // Step 2: review
  const [pairs, setPairs] = useState([])
  const [processing, setProcessing] = useState(false)
  const [processedCount, setProcessedCount] = useState(0)
  const [saving, setSaving] = useState(false)
  const [savedCategoryId, setSavedCategoryId] = useState(null)
  const abortRef = useRef(false)

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('profile', getProfile())
      .order('sort_order', { ascending: true })
    setCategories(data || [])
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

  function handleParse() {
    setParseError('')
    const result = parseQAPairs(rawText)

    if (result.pairs.length === 0) {
      setParseError('未能偵測到問答對。請確保每對問答以 Q:/A: 開頭，或用空行分隔。')
      return
    }

    // Initialize pairs with empty translations and grammar
    setPairs(
      result.pairs.map((p) => ({
        question: p.question,
        answer: p.answer,
        questionZh: '',
        answerZh: '',
        grammar: [],
        grammarChecked: false,
        translated: false,
      }))
    )
    setStep(1)
    processAllPairs(result.pairs)
  }

  async function processAllPairs(rawPairs) {
    setProcessing(true)
    setProcessedCount(0)
    abortRef.current = false

    for (let i = 0; i < rawPairs.length; i++) {
      if (abortRef.current) break

      const pair = rawPairs[i]

      // Translate question
      const qZh = await translateToZH(pair.question)
      if (abortRef.current) break

      // Translate answer
      const aZh = await translateToZH(pair.answer)
      if (abortRef.current) break

      // Grammar check answer
      let grammar = []
      try {
        grammar = await checkGrammar(pair.answer)
      } catch {
        // Grammar check is optional
      }

      setPairs((prev) => {
        const updated = [...prev]
        updated[i] = {
          ...updated[i],
          questionZh: qZh,
          answerZh: aZh,
          grammar,
          grammarChecked: true,
          translated: true,
        }
        return updated
      })
      setProcessedCount(i + 1)
    }

    setProcessing(false)
  }

  function handleAcceptFix(pairIndex, issueIndex) {
    setPairs((prev) => {
      const updated = [...prev]
      const pair = { ...updated[pairIndex] }
      const issue = pair.grammar[issueIndex]
      if (!issue || !issue.replacements[0]) return prev

      pair.answer = applyFix(pair.answer, issue.offset, issue.length, issue.replacements[0])
      // Re-index remaining grammar issues after offset change
      const diff = issue.replacements[0].length - issue.length
      pair.grammar = pair.grammar
        .filter((_, idx) => idx !== issueIndex)
        .map((g) => ({
          ...g,
          offset: g.offset > issue.offset ? g.offset + diff : g.offset,
        }))
      updated[pairIndex] = pair
      return updated
    })
  }

  function handleEditField(pairIndex, field, value) {
    setPairs((prev) => {
      const updated = [...prev]
      updated[pairIndex] = { ...updated[pairIndex], [field]: value }
      return updated
    })
  }

  async function handleSaveAll() {
    setSaving(true)

    const cards = pairs.map((p) => ({
      profile: getProfile(),
      category_id: categoryId || null,
      question_en: p.question.trim(),
      question_zh: p.questionZh.trim() || null,
      answer_en: p.answer.trim(),
      answer_zh: p.answerZh.trim() || null,
      notes: null,
      is_starred: false,
    }))

    const { error } = await supabase.from('cards').insert(cards)

    setSaving(false)

    if (!error) {
      setSavedCategoryId(categoryId)
      setStep(2)
    }
  }

  function handleReset() {
    abortRef.current = true
    setStep(0)
    setRawText('')
    setPairs([])
    setParseError('')
    setProcessedCount(0)
  }

  return (
    <div className="px-4 pt-6 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => (step === 1 ? handleReset() : navigate(-1))}
          className="p-2 hover:bg-cream-dark rounded-xl transition-colors press-scale"
          aria-label="返回"
        >
          <ChevronLeft size={24} className="text-ink" />
        </button>
        <h1 className="text-xl font-bold text-ink font-serif flex items-center gap-2">
          <FileText size={22} className="text-accent" />
          <span className="font-chinese">批量匯入</span>
        </h1>
      </div>

      <StepIndicator current={step} />

      {/* Step 0: Paste */}
      {step === 0 && (
        <div className="space-y-5 animate-fade-in-up">
          <div>
            <label className="block text-sm font-serif font-semibold text-ink mb-1.5">
              貼上問答文字
            </label>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder={`支援格式：\n\nQ: What is your name?\nA: My name is ...\n\nQ: Where do you live?\nA: I live in ...\n\n或用空行分隔問題和答案`}
              rows={12}
              className="w-full px-4 py-3 text-base rounded-xl border border-cream-dark/60 bg-surface focus:border-accent focus:ring-2 focus:ring-accent/15 outline-none resize-none transition-all shadow-warm-sm"
            />
            {parseError && (
              <div className="mt-2 p-3 bg-danger-light text-danger rounded-xl text-sm font-chinese flex items-start gap-2 animate-fade-in">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                {parseError}
              </div>
            )}
          </div>

          {/* Category picker */}
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

          {/* Link to single card add */}
          <div className="text-center">
            <button
              onClick={() => navigate('/add')}
              className="text-sm font-chinese text-accent hover:text-accent-dark transition-colors flex items-center gap-1 mx-auto"
            >
              只需新增一張？新增單張卡片
              <ChevronRight size={14} />
            </button>
          </div>

          <button
            onClick={handleParse}
            disabled={!rawText.trim()}
            className="w-full py-3.5 text-lg font-bold font-chinese text-white bg-gradient-to-r from-accent to-accent-dark rounded-xl shadow-warm hover:shadow-warm-lg transition-all disabled:opacity-50 press-scale"
          >
            解析問答
          </button>
        </div>
      )}

      {/* Step 1: Review */}
      {step === 1 && (
        <div className="space-y-4 animate-fade-in-up">
          {/* Progress */}
          {processing && (
            <div className="bg-accent-light rounded-xl p-3 flex items-center gap-3">
              <Loader2 size={18} className="text-accent animate-spin" />
              <span className="text-sm font-chinese text-accent font-medium">
                處理中 {processedCount}/{pairs.length}...
              </span>
              <div className="flex-1 h-1.5 bg-cream-dark rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-300"
                  style={{ width: `${(processedCount / pairs.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Pair cards */}
          {pairs.map((pair, i) => (
            <div
              key={i}
              className="bg-surface rounded-2xl shadow-warm-sm border border-cream-dark/40 overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="px-4 py-2 bg-cream-dark/30 flex items-center justify-between">
                <span className="text-xs font-chinese font-bold text-ink-light">
                  第 {i + 1} 題
                </span>
                {pair.translated && (
                  <Check size={14} className="text-success" />
                )}
                {!pair.translated && processing && (
                  <Loader2 size={14} className="text-ink-faint animate-spin" />
                )}
              </div>

              <div className="p-4 space-y-3">
                {/* Question */}
                <div>
                  <span className="text-xs font-chinese text-accent font-medium bg-accent-light px-2 py-0.5 rounded">
                    問題
                  </span>
                  <p className="text-base text-ink mt-1 leading-relaxed">{pair.question}</p>
                  {pair.questionZh && (
                    <p className="text-sm font-chinese text-ink-light mt-1">{pair.questionZh}</p>
                  )}
                </div>

                {/* Answer */}
                <div>
                  <span className="text-xs font-chinese text-secondary font-medium bg-secondary-light px-2 py-0.5 rounded">
                    答案
                  </span>
                  <AnswerWithGrammar
                    text={pair.answer}
                    grammar={pair.grammar}
                    onAcceptFix={(issueIdx) => handleAcceptFix(i, issueIdx)}
                    onEditAnswer={(val) => handleEditField(i, 'answer', val)}
                  />
                  {pair.answerZh && (
                    <p className="text-sm font-chinese text-ink-light mt-1">{pair.answerZh}</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Save button */}
          <button
            onClick={handleSaveAll}
            disabled={saving || processing}
            className="w-full py-3.5 text-lg font-bold font-chinese text-white bg-gradient-to-r from-accent to-accent-dark rounded-xl shadow-warm hover:shadow-warm-lg transition-all disabled:opacity-50 press-scale"
          >
            {saving ? '儲存中...' : `全部儲存 (${pairs.length} 張)`}
          </button>
        </div>
      )}

      {/* Step 2: Done */}
      {step === 2 && (
        <div className="text-center py-12 animate-fade-in-up">
          <div className="w-16 h-16 rounded-full bg-accent-light flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={32} className="text-accent" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-ink mb-2">
            匯入完成！
          </h2>
          <p className="text-lg font-chinese text-ink-light mb-8">
            已匯入 {pairs.length} 張卡片
          </p>
          <div className="space-y-3">
            <button
              onClick={() =>
                navigate(savedCategoryId ? `/category/${savedCategoryId}` : '/category/all')
              }
              className="w-full py-3.5 text-lg font-bold font-chinese text-white bg-gradient-to-r from-accent to-accent-dark rounded-xl shadow-warm press-scale"
            >
              查看卡片
            </button>
            <button
              onClick={handleReset}
              className="w-full py-3.5 text-lg font-bold font-chinese text-accent bg-accent-light rounded-xl press-scale"
            >
              繼續匯入
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function AnswerWithGrammar({ text, grammar, onAcceptFix, onEditAnswer }) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(text)

  // Update editValue when text prop changes (e.g. after accepting a fix)
  useEffect(() => {
    setEditValue(text)
  }, [text])

  if (editing) {
    return (
      <div className="mt-1">
        <textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 text-base rounded-xl border border-cream-dark/60 bg-surface focus:border-accent outline-none resize-none shadow-warm-sm"
          autoFocus
        />
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => {
              onEditAnswer(editValue)
              setEditing(false)
            }}
            className="px-3 py-1.5 text-xs font-chinese bg-accent text-white rounded-lg press-scale"
          >
            確認
          </button>
          <button
            onClick={() => {
              setEditValue(text)
              setEditing(false)
            }}
            className="px-3 py-1.5 text-xs font-chinese text-ink-light hover:text-ink rounded-lg press-scale"
          >
            取消
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-1">
      <p
        className="text-base text-ink leading-relaxed cursor-pointer hover:bg-cream-dark/30 rounded px-1 -mx-1 transition-colors"
        onClick={() => setEditing(true)}
        title="點擊編輯"
      >
        {text}
      </p>

      {/* Grammar issues */}
      {grammar.length > 0 && (
        <div className="mt-2 space-y-1.5">
          {grammar.map((issue, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 p-2 bg-danger-light/60 rounded-lg text-sm animate-fade-in"
            >
              <AlertTriangle size={14} className="text-danger mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-danger font-medium">"{issue.original}"</span>
                <span className="text-ink-light"> — {issue.message}</span>
                {issue.replacements.length > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-success font-medium">
                      建議：{issue.replacements[0]}
                    </span>
                    <button
                      onClick={() => onAcceptFix(idx)}
                      className="px-2 py-0.5 text-xs font-chinese bg-accent text-white rounded-md press-scale"
                    >
                      接受
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
