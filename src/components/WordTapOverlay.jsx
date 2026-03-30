import { useState, useRef, useEffect } from 'react'
import { translateWordInContext } from '../lib/translate'

export default function WordTapOverlay({ text }) {
  const [popup, setPopup] = useState(null)
  const [loading, setLoading] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setPopup(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  async function handleWordTap(word, e) {
    const rect = e.target.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()

    setLoading(true)
    setPopup({
      word,
      translation: '...',
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.bottom - containerRect.top + 6,
    })

    const translation = await translateWordInContext(word, text)
    setPopup((prev) =>
      prev && prev.word === word ? { ...prev, translation } : prev
    )
    setLoading(false)
  }

  if (!text) return null

  const words = text.split(/(\s+)/)

  return (
    <div ref={containerRef} className="relative inline">
      {words.map((segment, i) => {
        if (/^\s+$/.test(segment)) {
          return <span key={i}>{segment}</span>
        }
        return (
          <span
            key={i}
            onClick={(e) => handleWordTap(segment, e)}
            className="cursor-pointer border-b border-dashed border-transparent hover:border-secondary hover:bg-secondary-light/50 active:bg-secondary-light rounded px-0.5 transition-colors"
          >
            {segment}
          </span>
        )
      })}
      {popup && (
        <div
          className="absolute z-50 bg-surface text-ink rounded-xl px-4 py-3 shadow-warm-lg border border-cream-dark/40 whitespace-nowrap animate-scale-in"
          style={{
            left: `${popup.x}px`,
            top: `${popup.y}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="text-xs text-ink-light mb-1">{popup.word}</div>
          <div className={`text-base font-chinese font-medium ${loading ? 'animate-pulse' : ''}`}>
            {popup.translation}
          </div>
        </div>
      )}
    </div>
  )
}
