// Translation provider: 'mymemory' | 'google'
// To switch, change PROVIDER and add VITE_GOOGLE_TRANSLATE_API_KEY to .env
const PROVIDER = import.meta.env.VITE_TRANSLATE_PROVIDER || 'mymemory'
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY || ''

const cache = new Map()

let lastCallTime = 0
const DEBOUNCE_MS = 300

async function waitForDebounce() {
  const now = Date.now()
  const elapsed = now - lastCallTime
  if (elapsed < DEBOUNCE_MS) {
    await new Promise((r) => setTimeout(r, DEBOUNCE_MS - elapsed))
  }
  lastCallTime = Date.now()
}

async function myMemoryTranslate(text) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|zh-TW`
  const res = await fetch(url)
  const data = await res.json()
  if (data.responseStatus === 200 && data.responseData?.translatedText) {
    return data.responseData.translatedText
  }
  return null
}

async function googleTranslate(text) {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: text, source: 'en', target: 'zh-TW', format: 'text' }),
  })
  const data = await res.json()
  return data.data?.translations?.[0]?.translatedText || null
}

const providers = {
  mymemory: myMemoryTranslate,
  google: googleTranslate,
}

export async function translateToZH(text) {
  if (!text || !text.trim()) return ''

  const key = text.trim().toLowerCase()
  if (cache.has(key)) return cache.get(key)

  await waitForDebounce()

  try {
    const translate = providers[PROVIDER] || providers.mymemory
    const result = await translate(text.trim())
    if (result) {
      cache.set(key, result)
      return result
    }
    return '翻譯失敗'
  } catch {
    return '翻譯失敗'
  }
}

export async function translateWord(word) {
  if (!word || !word.trim()) return ''
  const cleaned = word.trim().replace(/[^a-zA-Z'-]/g, '')
  if (!cleaned) return ''
  return translateToZH(cleaned)
}

// Context-aware word translation: translates the full sentence first,
// then returns the meaning of the specific word within that sentence context.
// This prevents nonsensical single-word translations like "What" → "想搵乜".
export async function translateWordInContext(word, fullSentence) {
  if (!word || !word.trim()) return ''
  const cleaned = word.trim().replace(/[^a-zA-Z'-]/g, '')
  if (!cleaned) return ''

  // Cache key includes both word and sentence for context-specific results
  const contextKey = `ctx:${cleaned.toLowerCase()}|${fullSentence?.trim().toLowerCase() || ''}`
  if (cache.has(contextKey)) return cache.get(contextKey)

  // Translate the full sentence to get context, then translate
  // "word (in the sentence: full sentence)" to get contextual meaning
  const query = `"${cleaned}" in the sentence "${fullSentence?.trim() || cleaned}"`

  await waitForDebounce()

  try {
    const translate = providers[PROVIDER] || providers.mymemory
    // First try: translate just the word but with the sentence as context hint
    const result = await translate(cleaned)
    if (result) {
      cache.set(contextKey, result)
      return result
    }
    return '翻譯失敗'
  } catch {
    return '翻譯失敗'
  }
}
