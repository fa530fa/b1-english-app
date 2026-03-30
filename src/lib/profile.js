export const PROFILES = [
  { id: 'waikwan', name: 'Wai Kwan Wong' },
  { id: 'poping', name: 'Po Ping Tang' },
]

export function getProfile() {
  return localStorage.getItem('b1-profile') || ''
}

export function setProfile(profileId) {
  localStorage.setItem('b1-profile', profileId)
}

export function getProfileName() {
  const id = getProfile()
  const p = PROFILES.find((p) => p.id === id)
  return p ? p.name : ''
}

export function hasProfile() {
  return Boolean(getProfile())
}
