import { Volume2 } from 'lucide-react'
import { speak, isTTSSupported } from '../lib/tts'

export default function SpeakButton({ text, size = 'md' }) {
  if (!isTTSSupported()) return null

  const iconSize = size === 'lg' ? 22 : 18
  const padding = size === 'lg' ? 'p-3' : 'p-2'

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        speak(text)
      }}
      className={`${padding} rounded-xl text-accent hover:bg-accent-light active:bg-accent-light transition-colors press-scale flex items-center justify-center`}
      aria-label="朗讀英文"
      title="朗讀英文"
    >
      <Volume2 size={iconSize} strokeWidth={2} />
    </button>
  )
}
