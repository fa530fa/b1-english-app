/**
 * Keeps broadcast audio alive when the screen turns off.
 *
 * Strategy:
 *  1. Silent audio loop — plays a near-silent WAV in a loop so the browser
 *     treats this tab as an active audio session (prevents suspension on iOS/Android).
 *  2. MediaSession API — registers as a media player so the OS lock-screen
 *     controls work and won't terminate the session.
 */

let silentAudio = null
let silentAudioUrl = null

/** Build a 1-second silent WAV blob entirely in JS (no external file needed). */
function makeSilentWav() {
  const sampleRate = 8000
  const numSamples = sampleRate // 1 second
  const buf = new ArrayBuffer(44 + numSamples)
  const v = new DataView(buf)
  const str = (off, s) => [...s].forEach((c, i) => v.setUint8(off + i, c.charCodeAt(0)))

  str(0, 'RIFF'); v.setUint32(4, 36 + numSamples, true)
  str(8, 'WAVE'); str(12, 'fmt ')
  v.setUint32(16, 16, true)   // chunk size
  v.setUint16(20, 1, true)    // PCM
  v.setUint16(22, 1, true)    // mono
  v.setUint32(24, sampleRate, true)
  v.setUint32(28, sampleRate, true)
  v.setUint16(32, 1, true)
  v.setUint16(34, 8, true)    // 8-bit
  str(36, 'data'); v.setUint32(40, numSamples, true)
  // 8-bit silence = 128 (unsigned midpoint)
  for (let i = 44; i < buf.byteLength; i++) v.setUint8(i, 128)

  return new Blob([buf], { type: 'audio/wav' })
}

/**
 * Start the silent audio loop. Must be called inside a user-gesture handler
 * (e.g. button click) so autoplay policy allows it.
 */
export function startSilentAudio() {
  if (silentAudio) return
  try {
    silentAudioUrl = URL.createObjectURL(makeSilentWav())
    silentAudio = new Audio(silentAudioUrl)
    silentAudio.loop = true
    silentAudio.volume = 0.01
    silentAudio.play().catch(() => {})
  } catch (_) {}
}

export function stopSilentAudio() {
  if (silentAudio) {
    silentAudio.pause()
    silentAudio.src = ''
    silentAudio = null
  }
  if (silentAudioUrl) {
    URL.revokeObjectURL(silentAudioUrl)
    silentAudioUrl = null
  }
}

/**
 * Register with the MediaSession API so the OS shows lock-screen controls
 * and keeps the tab active.
 */
export function setupMediaSession({ title = 'B1 口試練習', onPlay, onPause, onStop }) {
  if (!('mediaSession' in navigator)) return
  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist: '廣播模式',
      album: 'B1 English Prep',
    })
    if (onPlay)  navigator.mediaSession.setActionHandler('play', onPlay)
    if (onPause) navigator.mediaSession.setActionHandler('pause', onPause)
    if (onStop)  navigator.mediaSession.setActionHandler('stop', onStop)
  } catch (_) {}
}

export function setMediaPlaying(playing) {
  if (!('mediaSession' in navigator)) return
  try {
    navigator.mediaSession.playbackState = playing ? 'playing' : 'paused'
  } catch (_) {}
}

export function clearMediaSession() {
  stopSilentAudio()
  if (!('mediaSession' in navigator)) return
  try {
    navigator.mediaSession.metadata = null
    navigator.mediaSession.playbackState = 'none'
    for (const a of ['play', 'pause', 'stop', 'nexttrack', 'previoustrack']) {
      try { navigator.mediaSession.setActionHandler(a, null) } catch (_) {}
    }
  } catch (_) {}
}
