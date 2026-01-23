# Animations and Accessibility Best Practices

## GSAP Lifecycle Rules

### Always Kill Tweens on Cleanup

```typescript
// ❌ Bad - no cleanup, causes memory leaks
useEffect(() => {
  gsap.to(ref.current, { rotation: 180, duration: 0.5 })
}, [isFlipped])

// ✅ Good - cleanup previous tweens
useEffect(() => {
  const el = ref.current
  if (!el) return
  
  gsap.killTweensOf(el)  // Kill any existing tweens first
  gsap.to(el, { rotation: isFlipped ? 180 : 0, duration: 0.5 })
  
  return () => gsap.killTweensOf(el)
}, [isFlipped])
```

### Use GSAP Context for Complex Animations

```typescript
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    gsap.to('.card', { y: 0, stagger: 0.1 })
    gsap.to('.title', { opacity: 1 })
  }, containerRef)
  
  return () => ctx.revert()  // Cleans up all animations in context
}, [])
```

### Prefer useLayoutEffect for DOM Animations

Use `useLayoutEffect` to avoid visual flicker:

```typescript
// ✅ Runs synchronously before paint
useLayoutEffect(() => {
  gsap.set(ref.current, { opacity: 0 })
  gsap.to(ref.current, { opacity: 1, duration: 0.3 })
}, [])
```

## Reduced Motion Support

### CSS Approach

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Tailwind Approach

```html
<div class="animate-bounce motion-reduce:animate-none">
```

### JavaScript Hook

```typescript
function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false)
  
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)
    
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  
  return prefersReduced
}

// Usage with GSAP
const prefersReduced = usePrefersReducedMotion()
gsap.to(el, { 
  rotation: 180, 
  duration: prefersReduced ? 0 : 0.5 
})
```

### What to Disable vs Simplify

| Animation Type | Reduced Motion Behavior |
|----------------|------------------------|
| Decorative loops | Disable completely |
| Page transitions | Instant (duration: 0) |
| Hover feedback | Keep but shorten |
| Loading spinners | Replace with static indicator |

## Accessibility Interaction Rules

### Use Semantic Elements

```typescript
// ❌ Bad - reinventing button behavior
<div 
  role="button" 
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>

// ✅ Good - native button
<button type="button" onClick={handleClick}>
```

### Keyboard Support Checklist

- [ ] All interactive elements are focusable (Tab)
- [ ] Buttons activate with Enter and Space
- [ ] Links activate with Enter only
- [ ] Escape closes modals/dropdowns
- [ ] Focus is trapped in modals
- [ ] Focus returns to trigger after modal closes

### Focus States

Always provide visible focus indicators:

```css
/* Remove default only if providing custom */
button:focus {
  outline: none;
}

button:focus-visible {
  outline: 2px solid var(--color-lime);
  outline-offset: 2px;
}
```

### ARIA Labels

```typescript
// Icon-only buttons need labels
<button aria-label="Close modal" onClick={onClose}>
  <XIcon />
</button>

// Announce dynamic content
<div role="status" aria-live="polite">
  {charms.length} charms collected
</div>
```
