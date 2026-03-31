import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, Type, Volume2, Languages, FolderOpen, User, Trash2, Palette, Pencil } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getSetting, setSetting } from '../lib/settings'
import { getRate, setRate } from '../lib/tts'
import { getProfileName, setProfile, getProfile } from '../lib/profile'

const COLORS = ['#4E7C5F', '#C4903A', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

export default function SettingsPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [fontSize, setFontSizeState] = useState(() => getSetting('fontSize'))
  const [showChinese, setShowChinese] = useState(() => getSetting('showChineseByDefault'))
  const [ttsRate, setTtsRate] = useState(() => getRate())
  const [editingCat, setEditingCat] = useState(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState('')
  const [showDeleteCat, setShowDeleteCat] = useState(null)

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

  function handleFontSize(size) {
    setFontSizeState(size)
    setSetting('fontSize', size)
  }

  function handleShowChinese(val) {
    setShowChinese(val)
    setSetting('showChineseByDefault', val)
  }

  function handleTtsRate(val) {
    const rate = parseFloat(val)
    setTtsRate(rate)
    setRate(rate)
  }

  function startEdit(cat) {
    setEditingCat(cat.id)
    setEditName(cat.name)
    setEditColor(cat.color || '#4E7C5F')
  }

  async function saveEdit(catId) {
    await supabase
      .from('categories')
      .update({ name: editName, color: editColor })
      .eq('id', catId)
    setEditingCat(null)
    loadCategories()
  }

  async function deleteCat(catId) {
    await supabase.from('categories').delete().eq('id', catId)
    setShowDeleteCat(null)
    loadCategories()
  }

  return (
    <div className="px-4 pt-6 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center">
          <Settings size={20} className="text-accent" />
        </div>
        <h1 className="text-xl font-bold font-serif text-ink">設定</h1>
      </div>

      {/* Font Size */}
      <section className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Type size={16} className="text-ink-faint" />
          <h2 className="text-sm font-chinese font-medium text-ink-light">字體大小</h2>
        </div>
        <div className="flex gap-2">
          {[
            { key: 'small', label: '小' },
            { key: 'medium', label: '中' },
            { key: 'large', label: '大' },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => handleFontSize(opt.key)}
              className={`flex-1 py-3 rounded-xl font-chinese font-bold transition-colors press-scale ${
                fontSize === opt.key
                  ? 'bg-accent text-white shadow-warm-sm'
                  : 'bg-surface border border-cream-dark/60 text-ink-light hover:bg-cream-dark/30'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* TTS Speed */}
      <section className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Volume2 size={16} className="text-ink-faint" />
          <h2 className="text-sm font-chinese font-medium text-ink-light">
            朗讀速度：{ttsRate.toFixed(1)}x
          </h2>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-cream-dark/40 shadow-warm-sm">
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={ttsRate}
            onChange={(e) => handleTtsRate(e.target.value)}
            className="w-full accent-accent"
          />
          <div className="flex justify-between text-xs font-chinese text-ink-faint mt-1">
            <span>慢 0.5x</span>
            <span>快 1.5x</span>
          </div>
        </div>
      </section>

      {/* Show Chinese */}
      <section className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Languages size={16} className="text-ink-faint" />
          <h2 className="text-sm font-chinese font-medium text-ink-light">中文翻譯</h2>
        </div>
        <div className="flex items-center justify-between bg-surface rounded-xl p-4 border border-cream-dark/40 shadow-warm-sm">
          <span className="font-chinese text-ink">預設顯示中文翻譯</span>
          <button
            onClick={() => handleShowChinese(!showChinese)}
            className={`w-14 h-8 rounded-full transition-colors relative ${
              showChinese ? 'bg-accent' : 'bg-cream-dark'
            }`}
          >
            <div
              className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-warm-sm transition-transform ${
                showChinese ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <FolderOpen size={16} className="text-ink-faint" />
          <h2 className="text-sm font-chinese font-medium text-ink-light">管理分類</h2>
        </div>
        {categories.length === 0 ? (
          <div className="bg-surface rounded-xl p-6 border border-cream-dark/40 shadow-warm-sm text-center">
            <p className="text-ink-faint font-chinese text-sm">尚未建立分類</p>
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-surface rounded-xl p-4 border border-cream-dark/40 shadow-warm-sm"
              >
                {editingCat === cat.id ? (
                  <div className="space-y-3">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-cream-dark/60 bg-surface font-chinese focus:border-accent outline-none"
                    />
                    <div className="flex gap-2 flex-wrap">
                      {COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setEditColor(c)}
                          className={`w-8 h-8 rounded-full transition-all press-scale ${
                            editColor === c
                              ? 'ring-2 ring-offset-2 ring-accent'
                              : ''
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingCat(null)}
                        className="flex-1 py-2.5 font-chinese text-sm text-ink-light bg-cream-dark/40 rounded-xl press-scale"
                      >
                        取消
                      </button>
                      <button
                        onClick={() => saveEdit(cat.id)}
                        className="flex-1 py-2.5 font-chinese text-sm text-white bg-accent rounded-xl press-scale font-bold"
                      >
                        儲存
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3.5 h-3.5 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color || '#4E7C5F' }}
                      />
                      <span className="font-chinese text-ink font-medium">{cat.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(cat)}
                        className="p-2 text-accent hover:bg-accent-light rounded-lg transition-colors press-scale"
                        aria-label="編輯"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setShowDeleteCat(cat.id)}
                        className="p-2 text-danger hover:bg-danger-light rounded-lg transition-colors press-scale"
                        aria-label="刪除"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Switch Profile */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <User size={16} className="text-ink-faint" />
          <h2 className="text-sm font-chinese font-medium text-ink-light">目前使用者</h2>
        </div>
        <div className="flex items-center justify-between bg-surface rounded-xl p-4 border border-cream-dark/40 shadow-warm-sm">
          <span className="font-chinese text-ink font-bold">{getProfileName()}</span>
          <button
            onClick={() => {
              setProfile('')
              navigate(0)
            }}
            className="px-4 py-2 text-sm font-chinese text-accent hover:bg-accent-light rounded-xl transition-colors press-scale font-medium"
          >
            切換使用者
          </button>
        </div>
      </section>

      {/* Delete category confirmation */}
      {showDeleteCat && (
        <div className="fixed inset-0 bg-ink/40 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface rounded-2xl p-6 w-full max-w-sm shadow-warm-lg animate-scale-in">
            <h2 className="text-lg font-bold font-chinese text-ink mb-2">
              刪除分類？
            </h2>
            <p className="text-ink-light font-chinese text-sm mb-5 leading-relaxed">
              分類內的卡片不會被刪除，只會變成未分類。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteCat(null)}
                className="flex-1 py-3 font-chinese text-ink-light bg-cream-dark/40 rounded-xl press-scale"
              >
                取消
              </button>
              <button
                onClick={() => deleteCat(showDeleteCat)}
                className="flex-1 py-3 font-chinese text-white bg-danger rounded-xl font-bold press-scale"
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
