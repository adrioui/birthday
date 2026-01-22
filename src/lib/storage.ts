export function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

interface CharmLike {
  id?: unknown
  name?: unknown
  icon?: unknown
  power?: unknown
  points?: unknown
  iconBgColor?: unknown
  iconColor?: unknown
}

export function validateCharm(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false
  const charm = data as CharmLike
  return (
    typeof charm.id === 'string' &&
    typeof charm.name === 'string' &&
    typeof charm.icon === 'string' &&
    typeof charm.power === 'string' &&
    typeof charm.points === 'number' &&
    (charm.iconBgColor === undefined || typeof charm.iconBgColor === 'string') &&
    (charm.iconColor === undefined || typeof charm.iconColor === 'string')
  )
}

export function getValidatedCharms<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const item = localStorage.getItem(key)
    if (!item) return fallback

    const parsed = JSON.parse(item)
    if (!Array.isArray(parsed)) {
      console.warn(`Invalid charm data from ${key}: expected array`)
      return fallback
    }

    const validCharms = parsed.filter((charm, index) => {
      if (validateCharm(charm)) return true
      console.warn(`Invalid charm at index ${index} in ${key}:`, charm)
      return false
    })

    return validCharms.length > 0 ? (validCharms as T) : fallback
  } catch (e) {
    console.warn(`Failed to parse charm data from ${key}:`, e)
    return fallback
  }
}

export function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('Storage write failed:', e)
  }
}

export function removeItem(key: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(key)
  } catch (e) {
    console.error('Storage remove failed:', e)
  }
}
