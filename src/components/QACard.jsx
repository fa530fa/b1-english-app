import { useNavigate } from 'react-router-dom'
import { Star } from 'lucide-react'
import SpeakButton from './SpeakButton'

export default function QACard({ card, style, reorderMode }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={reorderMode ? undefined : () => navigate(`/card/${card.id}`)}
      className={`bg-surface rounded-2xl p-4 shadow-warm-sm border border-cream-dark/40 transition-all animate-fade-in-up ${
        reorderMode ? '' : 'hover:shadow-warm cursor-pointer press-scale'
      }`}
      style={style}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-ink text-base leading-snug line-clamp-2">
            {card.question_en}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {card.is_starred && (
            <Star size={16} className="text-star" fill="currentColor" />
          )}
          {!reorderMode && <SpeakButton text={card.question_en} size="md" />}
        </div>
      </div>
    </div>
  )
}
