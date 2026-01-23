# Testing Best Practices

This project uses **Vitest** + **@testing-library/react** + **@testing-library/user-event** for testing.

## Commands

```bash
npm run test          # Watch mode
npm run test:run      # Single run
npm run test:ui       # Vitest UI
npm run test:coverage # Coverage report
```

## File Conventions

- Test files: `*.test.ts` or `*.test.tsx`
- Colocate tests with source files (e.g., `CharmContext.test.tsx` next to `CharmContext.tsx`)
- Test utilities: `src/test/` directory
  - `render.tsx` - `renderWithProviders` helper
  - `fixtures.ts` - Shared test data
  - `mocks/` - Mock implementations

## Required Mocks

### matchMedia (for useReducedMotion)

```typescript
// In vitest.setup.ts or test file
vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
  dispatchEvent: vi.fn(),
}))
```

### mediaDevices (for camera hooks)

Use `src/test/mocks/mediaDevices.ts`:

```typescript
import { mockGetUserMediaSuccess, mockGetUserMediaDenied } from '../test/mocks/mediaDevices'

it('handles camera access', async () => {
  const { stream, stop } = mockGetUserMediaSuccess()
  // ... test code
  expect(stop).toHaveBeenCalled()
})
```

### GSAP

```typescript
vi.mock('gsap', () => ({
  gsap: {
    to: vi.fn(),
    set: vi.fn(),
    killTweensOf: vi.fn(),
    context: vi.fn(() => ({ revert: vi.fn() })),
  },
}))
```

### localStorage

```typescript
beforeEach(() => {
  localStorage.clear()
})
```

## Testing Contract

### Behavior Over Implementation

```typescript
// ❌ Bad - tests implementation details
expect(component.state.isOpen).toBe(true)

// ✅ Good - tests observable behavior
expect(screen.getByRole('dialog')).toBeVisible()
```

### Use Accessible Queries

```typescript
// ❌ Bad - brittle selectors
screen.getByTestId('submit-button')
screen.getByClassName('btn-primary')

// ✅ Good - accessible queries
screen.getByRole('button', { name: 'Submit' })
screen.getByLabelText('Email address')
screen.getByText('Welcome back')
```

### Query Priority

1. `getByRole` - best for a11y
2. `getByLabelText` - form inputs
3. `getByText` - static content
4. `getByTestId` - last resort

## Animation & Side-Effect Testing

### Timer Cleanup Assertions

```typescript
it('cleans up timers on unmount', () => {
  vi.useFakeTimers()
  const { unmount } = render(<Component />)
  
  unmount()
  
  // Verify no timers leak
  vi.runAllTimers()
  vi.useRealTimers()
})
```

### GSAP Cleanup Verification

```typescript
it('kills tweens on cleanup', () => {
  const { unmount } = render(<AnimatedComponent />)
  unmount()
  expect(gsap.killTweensOf).toHaveBeenCalled()
})
```

### Listener Cleanup

```typescript
it('removes event listeners on unmount', () => {
  const mockListeners = new Set()
  vi.mocked(window.matchMedia).mockImplementation(() => ({
    addEventListener: (_, cb) => mockListeners.add(cb),
    removeEventListener: (_, cb) => mockListeners.delete(cb),
    // ...
  }))
  
  const { unmount } = renderHook(() => useReducedMotion())
  expect(mockListeners.size).toBe(1)
  
  unmount()
  expect(mockListeners.size).toBe(0)
})
```

## Storage Testing

### Always Clear Before Each Test

```typescript
beforeEach(() => {
  localStorage.clear()
})
```

### Test Corrupted Data Edge Cases

```typescript
it('handles corrupted localStorage gracefully', () => {
  localStorage.setItem('birthday-os-charms', 'invalid-json')
  const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider })
  expect(result.current.charms).toEqual([])
})

it('handles missing fields in stored data', () => {
  localStorage.setItem('birthday-os-charms', JSON.stringify([{ id: 'x' }])) // missing name, points
  const { result } = renderHook(() => useCharms(), { wrapper: CharmProvider })
  expect(result.current.charms).toEqual([])
})
```

## Integration Test Harness

Use `renderWithProviders` for component tests requiring context:

```typescript
import { renderWithProviders } from '../test/render'
import { testCharm } from '../test/fixtures'

it('displays collected charms', () => {
  renderWithProviders(<WalletScreen />, { initialCharms: [testCharm] })
  expect(screen.getByText('Test Charm')).toBeInTheDocument()
})
```

## Coverage Guardrails

For every new feature, add at minimum:

1. **1 happy-path test** - Feature works as expected
2. **1 error/edge case test** - Feature handles failures gracefully

### Examples

```typescript
// Happy path
it('captures photo when shutter button clicked', async () => { ... })

// Error case
it('shows error when camera permission denied', async () => { ... })
```

## User Interaction Testing

Use `@testing-library/user-event` for realistic interactions:

```typescript
import userEvent from '@testing-library/user-event'

it('opens modal on button click', async () => {
  const user = userEvent.setup()
  render(<Component />)
  
  await user.click(screen.getByRole('button', { name: 'Open' }))
  
  expect(screen.getByRole('dialog')).toBeVisible()
})
```

### Keyboard Navigation

```typescript
it('supports keyboard navigation', async () => {
  const user = userEvent.setup()
  render(<Menu />)
  
  await user.tab() // Focus first item
  await user.keyboard('{Enter}') // Activate
  await user.keyboard('{Escape}') // Close
  
  expect(screen.queryByRole('menu')).not.toBeInTheDocument()
})
```

## Accessibility Testing

### Focus Management

```typescript
it('returns focus to trigger after modal closes', async () => {
  const user = userEvent.setup()
  render(<Modal trigger={<button>Open</button>} />)
  
  const trigger = screen.getByRole('button', { name: 'Open' })
  await user.click(trigger)
  await user.keyboard('{Escape}')
  
  expect(trigger).toHaveFocus()
})
```

### ARIA Assertions

```typescript
it('has accessible name', () => {
  render(<IconButton icon="close" onClick={onClose} />)
  expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
})

it('announces status changes', () => {
  render(<CharmCounter />)
  expect(screen.getByRole('status')).toHaveTextContent('0 charms collected')
})
```
