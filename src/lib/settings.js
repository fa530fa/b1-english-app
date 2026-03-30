const DEFAULTS = {
  fontSize: 'medium', // small | medium | large
  showChineseByDefault: true,
  ttsRate: 0.8,
}

const SCALE_MAP = {
  small: 0.875,
  medium: 1,
  large: 1.2,
}

export function getSetting(key) {
  const stored = localStorage.getItem(`setting-${key}`)
  if (stored !== null) {
    try {
      return JSON.parse(stored)
    } catch {
      return stored
    }
  }
  return DEFAULTS[key]
}

export function setSetting(key, value) {
  localStorage.setItem(`setting-${key}`, JSON.stringify(value))
  if (key === 'fontSize') {
    applyFontScale(value)
  }
}

export function applyFontScale(size) {
  const scale = SCALE_MAP[size] || 1
  document.documentElement.style.setProperty('--font-scale', scale)
}

export function initSettings() {
  const fontSize = getSetting('fontSize')
  applyFontScale(fontSize)
}
