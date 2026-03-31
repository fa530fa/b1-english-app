// Translation provider: 'openai' | 'mymemory' | 'google'
// OpenAI is the default when VITE_OPENAI_API_KEY is set.
const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY || ''
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY || ''
const PROVIDER = import.meta.env.VITE_TRANSLATE_PROVIDER || (OPENAI_KEY ? 'openai' : 'mymemory')

const cache = new Map()

let lastCallTime = 0
const DEBOUNCE_MS = 150 // OpenAI can handle faster calls

async function waitForDebounce() {
  const now = Date.now()
  const elapsed = now - lastCallTime
  if (elapsed < DEBOUNCE_MS) {
    await new Promise((r) => setTimeout(r, DEBOUNCE_MS - elapsed))
  }
  lastCallTime = Date.now()
}

// ── OpenAI provider ──

async function openaiChat(messages, maxTokens = 200) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: maxTokens,
      temperature: 0.3,
    }),
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() || null
}

async function openaiTranslate(text) {
  return openaiChat([
    {
      role: 'system',
      content:
        '你是翻譯助手。將英文翻譯成香港繁體中文，用詞自然、貼近香港人日常用語。只回覆翻譯結果，不加解釋。',
    },
    { role: 'user', content: text },
  ])
}

// ── MyMemory provider (free fallback) ──

async function myMemoryTranslate(text) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|zh-TW`
  const res = await fetch(url)
  const data = await res.json()
  if (data.responseStatus === 200 && data.responseData?.translatedText) {
    return data.responseData.translatedText
  }
  return null
}

// ── Google provider ──

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

// ── Provider map ──

const providers = {
  openai: openaiTranslate,
  mymemory: myMemoryTranslate,
  google: googleTranslate,
}

// ── Public API ──

export async function translateToZH(text) {
  if (!text || !text.trim()) return ''

  const key = text.trim().toLowerCase()
  if (cache.has(key)) return cache.get(key)

  await waitForDebounce()

  try {
    const translate = providers[PROVIDER] || providers.openai
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

/**
 * Context-aware word translation using OpenAI.
 * Given a word and the full sentence it appears in, returns the
 * meaning of that specific word in context — in Hong Kong Traditional Chinese.
 */
export async function translateWordInContext(word, fullSentence) {
  if (!word || !word.trim()) return ''
  const cleaned = word.trim().replace(/[^a-zA-Z'-]/g, '')
  if (!cleaned) return ''

  const contextKey = `ctx:${cleaned.toLowerCase()}|${fullSentence?.trim().toLowerCase() || ''}`
  if (cache.has(contextKey)) return cache.get(contextKey)

  await waitForDebounce()

  try {
    let result

    if (PROVIDER === 'openai' && OPENAI_KEY) {
      // OpenAI: true context-aware translation in one call
      result = await openaiChat(
        [
          {
            role: 'system',
            content:
              '你是翻譯助手。用戶會給你一個英文單字和它出現的句子。請翻譯該單字在句子中的意思，用香港繁體中文回覆。只回覆翻譯結果（1-5個字），不加解釋。',
          },
          {
            role: 'user',
            content: `單字：${cleaned}\n句子：${fullSentence?.trim() || cleaned}`,
          },
        ],
        50
      )
    } else {
      const translate = providers[PROVIDER] || providers.mymemory
      result = await translate(cleaned)
    }

    if (result) {
      cache.set(contextKey, result)
      return result
    }
    return '翻譯失敗'
  } catch {
    return '翻譯失敗'
  }
}
