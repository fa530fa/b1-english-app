/**
 * Grammar checking via LanguageTool API (free, no key needed).
 * Returns array of issues with offset, original text, message, and replacements.
 */

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

export async function checkGrammar(text) {
  if (!text || !text.trim()) return []

  await waitForDebounce()

  try {
    const res = await fetch('https://api.languagetool.org/v2/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        text: text.trim(),
        language: 'en-US',
      }),
    })

    if (!res.ok) return []

    const data = await res.json()

    return (data.matches || []).map((m) => ({
      offset: m.offset,
      length: m.length,
      original: text.substring(m.offset, m.offset + m.length),
      message: m.message,
      replacements: (m.replacements || []).slice(0, 3).map((r) => r.value),
    }))
  } catch {
    return []
  }
}

/**
 * Apply a replacement to text at the given offset/length.
 */
export function applyFix(text, offset, length, replacement) {
  return text.substring(0, offset) + replacement + text.substring(offset + length)
}
