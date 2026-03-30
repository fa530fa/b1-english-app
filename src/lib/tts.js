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
