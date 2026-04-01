/**
 * Parse pasted text into Q&A pairs.
 * Supports three formats:
 *  1. Q:/A: prefix (or Question:/Answer:)
 *  2. Numbered pairs (1. Q\nA\n2. Q\nA)
 *  3. Alternating double-newline blocks
 */

function tryQAPrefix(text) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  const pairs = []
  let currentQ = null

  for (const line of lines) {
    const qMatch = line.match(/^(?:Q|Question)\s*[:：]\s*(.+)/i)
    const aMatch = line.match(/^(?:A|Answer)\s*[:：]\s*(.+)/i)

    if (qMatch) {
      currentQ = qMatch[1].trim()
    } else if (aMatch && currentQ) {
      pairs.push({ question: currentQ, answer: aMatch[1].trim() })
      currentQ = null
    }
  }

  return pairs.length >= 1 ? { pairs, format: 'qa-prefix' } : null
}

function tryNumbered(text) {
  // Match patterns like "1." or "1)" at the start of a line
  const blocks = text.split(/(?=^\d+[.)]\s)/m).filter((b) => b.trim())

  if (blocks.length < 2) return null

  const pairs = []
  for (const block of blocks) {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean)
    if (lines.length < 2) continue

    // First line is the question (strip the number prefix)
    const question = lines[0].replace(/^\d+[.)]\s*/, '').trim()
    // Remaining lines are the answer
    const answer = lines.slice(1).join(' ').trim()

    if (question && answer) {
      // Check if lines have Q:/A: sub-prefixes
      const qClean = question.replace(/^(?:Q|Question)\s*[:：]\s*/i, '')
      const aClean = answer.replace(/^(?:A|Answer)\s*[:：]\s*/i, '')
      pairs.push({ question: qClean, answer: aClean })
    }
  }

  return pairs.length >= 1 ? { pairs, format: 'numbered' } : null
}

function tryAlternating(text) {
  const blocks = text
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)

  if (blocks.length < 2) return null

  const pairs = []
  for (let i = 0; i + 1 < blocks.length; i += 2) {
    const question = blocks[i].replace(/\n/g, ' ').trim()
    const answer = blocks[i + 1].replace(/\n/g, ' ').trim()
    if (question && answer) {
      pairs.push({ question, answer })
    }
  }

  return pairs.length >= 1 ? { pairs, format: 'alternating' } : null
}

export function parseQAPairs(rawText) {
  if (!rawText || !rawText.trim()) {
    return { pairs: [], format: null }
  }

  // Try each strategy in priority order
  return (
    tryQAPrefix(rawText) ||
    tryNumbered(rawText) ||
    tryAlternating(rawText) ||
    { pairs: [], format: null }
  )
}
