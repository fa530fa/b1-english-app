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

/**
 * Pick the best female British English voice available.
 * Priority: en-GB female → en-GB any → en female → en any
 */
function getBritishFemaleVoice() {
  const voices = window.speechSynthesis.getVoices()
  // en-GB female
  const gbFemale = voices.find(
    (v) => v.lang === 'en-GB' && v.name.match(/female|woman|girl|kate|serena|amy|emma|susan|stephanie|claire|alice|victoria/i)
  )
  if (gbFemale) return gbFemale
  // en-GB any
  const gb = voices.find((v) => v.lang === 'en-GB')
  if (gb) return gb
  // en female
  const enFemale = voices.find(
    (v) => v.lang.startsWith('en') && v.name.match(/female|woman|girl|kate|serena|amy|emma|susan|stephanie|claire|alice|victoria/i)
  )
  if (enFemale) return enFemale
  // en any
  return voices.find((v) => v.lang.startsWith('en')) || null
}

function makeUtterance(text, rate) {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-GB'
  utterance.rate = rate ?? getRate()
  utterance.pitch = 1

  // Voices may not be loaded yet — try immediately, retry after load
  const voice = getBritishFemaleVoice()
  if (voice) utterance.voice = voice

  return utterance
}

export function speak(text, rate) {
  if (!isTTSSupported()) return
  window.speechSynthesis.cancel()

  const utterance = makeUtterance(text, rate)

  // If voices weren't ready, wait for them then retry
  if (!utterance.voice) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null
      const u2 = makeUtterance(text, rate)
      window.speechSynthesis.speak(u2)
    }
  }

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

  const utterance = makeUtterance(text, rate)

  let ended = false
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
