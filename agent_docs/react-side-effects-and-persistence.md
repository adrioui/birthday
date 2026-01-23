# React Side-Effects and Persistence Best Practices

## SSR-Safe Storage Patterns

Always guard `localStorage`/`sessionStorage` access for SSR and test environments:

```typescript
// ❌ Bad - crashes in SSR/tests
const [value] = useState(() => localStorage.getItem('key'))

// ✅ Good - safe everywhere
const [value] = useState(() => {
  if (typeof window === 'undefined') return defaultValue
  try {
    return localStorage.getItem('key') ?? defaultValue
  } catch {
    return defaultValue
  }
})
```

### Centralized Storage Helper

Create a `src/lib/storage.ts` helper:

```typescript
export function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
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
```

## State Updater Must Be Pure

React state updaters can run multiple times (Strict Mode). Never put side-effects inside:

```typescript
// ❌ Bad - side-effect inside updater
setCharms(prev => {
  analytics.track('charm-added')  // runs twice in Strict Mode!
  return [...prev, charm]
})

// ✅ Good - side-effect outside
setCharms(prev => [...prev, charm])
useEffect(() => {
  analytics.track('charm-added')
}, [charms.length])
```

## Timeout/Interval Cleanup

Always clear timers on unmount or dependency change:

```typescript
// ❌ Bad - no cleanup
useEffect(() => {
  setTimeout(() => setFlipped(true), 500)
}, [])

// ✅ Good - cleanup on unmount
useEffect(() => {
  const id = setTimeout(() => setFlipped(true), 500)
  return () => clearTimeout(id)
}, [])
```

## Persisted Data Validation

Never trust `localStorage` data. Validate at runtime:

```typescript
function validateCharm(data: unknown): Charm | null {
  if (!data || typeof data !== 'object') return null
  const obj = data as Record<string, unknown>
  if (typeof obj.id !== 'string') return null
  if (typeof obj.name !== 'string') return null
  if (typeof obj.points !== 'number') return null
  return obj as Charm
}

function loadCharms(): Charm[] {
  const raw = getItem('charms', [])
  if (!Array.isArray(raw)) return []
  return raw.map(validateCharm).filter(Boolean) as Charm[]
}
```

### Versioned Storage

For future migrations:

```typescript
interface StoredData {
  version: number
  charms: Charm[]
}

function migrateData(data: unknown): Charm[] {
  const stored = data as StoredData
  if (stored.version === 1) return stored.charms
  // Add migration logic for future versions
  return []
}
```
