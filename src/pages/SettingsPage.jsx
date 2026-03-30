import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getSetting, setSetting } from '../lib/settings'
import { getRate, setRate } from '../lib/tts'
import { getProfileName, setProfile } from '../lib/profile'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316']

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
    setEditColor(cat.color || '#3B82F6')
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
    <div className="px-4 pt-6 pb-24">
      <h1 className="text-2xl font-bold font-chinese text-ink mb-6">
        ⚙️ 設定
      </h1>

      {/* Font Size */}
      <section className="mb-6">
        <h2 className="text-sm font-chinese font-medium text-ink-light mb-3">
          字體大小
        </h2>
        <div className="flex gap-2">
          {[
            { key: 'small', label: '小' },
            { key: 'medium', label: '中' },
            { key: 'large', label: '大' },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => handleFontSize(opt.key)}
              className={`flex-1 py-3 rounded-xl font-chinese font-bold transition-colors ${
                fontSize === opt.key
                  ? 'bg-accent text-white'
                  : 'bg-white border border-cream-dark text-ink hover:bg-cream-dark'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* TTS Speed */}
      <section className="mb-6">
        <h2 className="text-sm font-chinese font-medium text-ink-light mb-3">
          朗讀速度：{ttsRate.toFixed(1)}x
        </h2>
        <input
          type="range"
          min="0.5"
          max="1.5"
          step="0.1"
          value={ttsRate}
          onChange={(e) => handleTtsRate(e.target.value)}
          className="w-full accent-accent"
        />
        <div className="flex justify-between text-xs font-chinese text-ink-light mt-1">
          <span>慢 0.5x</span>
          <span>快 1.5x</span>
        </div>
      </section>

      {/* Show Chinese */}
      <section className="mb-6">
        <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-cream-dark">
          <span className="font-chinese text-ink">預設顯示中文翻譯</span>
          <button
            onClick={() => handleShowChinese(!showChinese)}
            className={`w-14 h-8 rounded-full transition-colors relative ${
              showChinese ? 'bg-accent' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                showChinese ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-6">
        <h2 className="text-sm font-chinese font-medium text-ink-light mb-3">
          管理分類
        </h2>
        {categories.length === 0 ? (
          <p className="text-ink-light font-chinese text-sm py-4 text-center">
            尚未建立分類
          </p>
        ) : (
          <div className="space-y-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-xl p-4 border border-cream-dark"
              >
                {editingCat === cat.id ? (
                  <div className="space-y-3">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-cream-dark font-chinese"
                    />
                    <div className="flex gap-2 flex-wrap">
                      {COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setEditColor(c)}
                          className={`w-8 h-8 rounded-full transition-all ${
                            editColor === c
                              ? 'ring-2 ring-offset-2 ring-ink'
                              : ''
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingCat(null)}
                        className="flex-1 py-2 font-chinese text-sm text-ink bg-cream-dark rounded-lg"
                      >
                        取消
                      </button>
                      <button
                        onClick={() => saveEdit(cat.id)}
                        className="flex-1 py-2 font-chinese text-sm text-white bg-accent rounded-lg"
                      >
                        儲存
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat.color || '#3B82F6' }}
                      />
                      <span className="font-chinese text-ink">{cat.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(cat)}
                        className="px-3 py-2 text-sm font-chinese text-accent hover:bg-cream-dark rounded-lg transition-colors"
                      >
                        編輯
                      </button>
                      <button
                        onClick={() => setShowDeleteCat(cat.id)}
                        className="px-3 py-2 text-sm font-chinese text-danger hover:bg-cream-dark rounded-lg transition-colors"
                      >
                        刪除
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
        <h2 className="text-sm font-chinese font-medium text-ink-light mb-3">
          目前使用者
        </h2>
        <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-cream-dark">
          <span className="font-chinese text-ink font-bold">{getProfileName()}</span>
          <button
            onClick={() => {
              setProfile('')
              navigate(0)
            }}
            className="px-4 py-2 text-sm font-chinese text-accent hover:bg-cream-dark rounded-lg transition-colors"
          >
            切換使用者
          </button>
        </div>
      </section>

      {/* Delete category confirmation */}
      {showDeleteCat && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-bold font-chinese text-ink mb-2">
              刪除分類？
            </h2>
            <p className="text-ink-light font-chinese text-sm mb-5">
              分類內的卡片不會被刪除，只會變成未分類。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteCat(null)}
                className="flex-1 py-3 font-chinese text-ink bg-cream-dark rounded-xl"
              >
                取消
              </button>
              <button
                onClick={() => deleteCat(showDeleteCat)}
                className="flex-1 py-3 font-chinese text-white bg-danger rounded-xl font-bold"
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
