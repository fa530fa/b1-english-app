/**
 * Word lookup: Free Dictionary API + OpenAI enrichment fallback.
 * 1. Try dictionaryapi.dev (free, no key)
 * 2. If not found or missing example, use OpenAI to fill gaps
 */

const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY || ''
const cache = new Map()

async function openaiChat(messages, maxTokens = 300) {
  if (!OPENAI_KEY) return null
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

async function freeDictLookup(word) {
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
    )
    if (!res.ok) return null

    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) return null

    const entry = data[0]
    const phonetic =
      entry.phonetic || entry.phonetics?.find((p) => p.text)?.text || ''

    const meanings = []
    for (const meaning of entry.meanings || []) {
      const pos = meaning.partOfSpeech || ''
      for (const def of (meaning.definitions || []).slice(0, 2)) {
        meanings.push({
          partOfSpeech: pos,
          definition: def.definition || '',
          example: def.example || '',
        })
      }
    }

    const primary = meanings.find((m) => m.example) || meanings[0] || null

    return {
      word: entry.word || word,
      phonetic,
      partOfSpeech: primary?.partOfSpeech || '',
      definitionEn: primary?.definition || '',
      example: primary?.example || '',
      allMeanings: meanings,
    }
  } catch {
    return null
  }
}

async function openaiLookup(word) {
  const raw = await openaiChat([
    {
      role: 'system',
      content: `你是英語字典。用戶輸入一個英文單字，回覆 JSON 格式（不要 markdown）：
{"word":"...", "phonetic":"...", "partOfSpeech":"noun/verb/adj/adv/...", "definitionEn":"英文定義（簡短）", "example":"一句簡短英文例句"}
只回覆 JSON，不加其他文字。`,
    },
    { role: 'user', content: word },
  ])

  if (!raw) return null

  try {
    const cleaned = raw.replace(/```json\n?|```/g, '').trim()
    const obj = JSON.parse(cleaned)
    return {
      word: obj.word || word,
      phonetic: obj.phonetic || '',
      partOfSpeech: obj.partOfSpeech || '',
      definitionEn: obj.definitionEn || '',
      example: obj.example || '',
      allMeanings: [],
    }
  } catch {
    return null
  }
}

export async function lookupWord(word) {
  if (!word || !word.trim()) return null

  const key = word.trim().toLowerCase()
  if (cache.has(key)) return cache.get(key)

  // Try free dictionary first
  let result = await freeDictLookup(key)

  // If free dict missed or has no example, enrich with OpenAI
  if (!result) {
    result = await openaiLookup(key)
  } else if (!result.example && OPENAI_KEY) {
    const ai = await openaiLookup(key)
    if (ai?.example) result.example = ai.example
    if (ai?.partOfSpeech && !result.partOfSpeech) result.partOfSpeech = ai.partOfSpeech
  }

  if (result) cache.set(key, result)
  return result
}
