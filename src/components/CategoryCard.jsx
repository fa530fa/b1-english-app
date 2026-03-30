import { useNavigate } from 'react-router-dom'

export default function CategoryCard({ category, cardCount, style }) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(`/category/${category.id}`)}
      className="bg-surface rounded-2xl p-5 shadow-warm-sm border border-cream-dark/40 hover:shadow-warm active:shadow-warm-sm transition-all text-left w-full press-scale animate-fade-in-up"
      style={style}
    >
      <div className="flex items-center gap-2.5 mb-2">
        <div
          className="w-4 h-4 rounded-full shrink-0"
          style={{
            backgroundColor: category.color || '#2A7C7C',
            boxShadow: `0 0 8px ${category.color || '#2A7C7C'}30`,
          }}
        />
        <span className="font-chinese font-bold text-lg text-ink truncate">
          {category.name}
        </span>
      </div>
      <p className="text-ink-light text-sm font-chinese">
        {cardCount} 張卡片
      </p>
    </button>
  )
}
