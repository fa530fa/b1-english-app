export function isTTSSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function getRate() {
  const stored = localStorage.getItem('tts-rate')
  return stored ? parseFloat(stored) : 0.8
}

export function setRate(rate) {
  localStorage.setItem('tts-rate', String(rate))
}

export function speak(text, rate) {
  if (!isTTSSupported()) return

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = rate ?? getRate()
  utterance.pitch = 1

  // Try to find an English voice
  const voices = window.speechSynthesis.getVoices()
  const enVoice = voices.find((v) => v.lang.startsWith('en'))
  if (enVoice) utterance.voice = enVoice

  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking() {
  if (isTTSSupported()) {
    window.speechSynthesis.cancel()
  }
}

/**
 * Speak text with a callback when finished.
 * Includes a safety timeout for browsers that don't fire onend reliably.
 * Returns a cleanup function to cancel the timeout.
 */
export function speakWithCallback(text, rate, onEnd) {
  if (!isTTSSupported() || !text) {
    onEnd?.()
    return () => {}
  }

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = rate ?? getRate()
  utterance.pitch = 1

  const voices = window.speechSynthesis.getVoices()
  const enVoice = voices.find((v) => v.lang.startsWith('en'))
  if (enVoice) utterance.voice = enVoice

  let ended = false

  // Safety timeout: estimate duration based on text length
  const estimatedMs = Math.max(text.length * 80, 2000) + 3000
  const timer = setTimeout(() => {
    if (!ended) {
      ended = true
      onEnd?.()
    }
  }, estimatedMs)

  utterance.onend = () => {
    if (!ended) {
      ended = true
      clearTimeout(timer)
      onEnd?.()
    }
  }

  utterance.onerror = () => {
    if (!ended) {
      ended = true
      clearTimeout(timer)
      onEnd?.()
    }
  }

  window.speechSynthesis.speak(utterance)

  return () => {
    clearTimeout(timer)
    ended = true
  }
}
