import { Play, Pause, X } from 'lucide-react'

const PHASE_LABELS = {
  question: '問題',
  'gap-q': '問題',
  answer: '答案',
  'gap-a': '答案',
}

export default function BroadcastBar({
  playing,
  onToggle,
  onStop,
  currentIndex,
  totalCards,
  phase,
}) {
  const progress = totalCards > 0 ? ((currentIndex + 1) / totalCards) * 100 : 0

  return (
    <div className="mt-4 bg-surface rounded-2xl shadow-warm border border-cream-dark/40 overflow-hidden animate-fade-in-up">
      {/* Progress bar */}
      <div className="h-1 bg-cream-dark">
        <div
          className="h-full bg-accent transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center gap-4 px-4 py-3">
        {/* Play/Pause */}
        <button
          onClick={onToggle}
          className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shadow-warm press-scale hover:bg-accent-dark transition-colors"
          aria-label={playing ? '暫停' : '播放'}
        >
          {playing ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-chinese font-bold text-ink">
            第 {currentIndex + 1}/{totalCards} 題
          </p>
          <p className="text-xs font-chinese text-ink-light">
            {PHASE_LABELS[phase] || '準備中'}
            {!playing && ' · 已暫停'}
          </p>
        </div>

        {/* Stop */}
        <button
          onClick={onStop}
          className="p-2 hover:bg-cream-dark rounded-xl transition-colors press-scale"
          aria-label="停止廣播"
        >
          <X size={20} className="text-ink-light" />
        </button>
      </div>
    </div>
  )
}
