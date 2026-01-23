# Snapshot References

Using browser snapshots for verification and documentation.

## What Are Snapshots

Browser snapshots capture the visual state of the application at a specific point in time.

## Use Cases

### Verification

- Before changes: Capture baseline state
- After changes: Verify expected behavior
- Regression testing: Compare against known good state

### Documentation

- Visual examples in PRs
- Demonstrating user flows
- Showing UI states

## How to Use

### Taking Snapshots

```bash
# Using Playwright
npx playwright screenshot <selector> screenshot.png

# Using the agent-browser skill
# Snapshots are automatically taken during verification
```

### Comparing Snapshots

```bash
# Visual regression testing
npx playwright test --update-snapshots
```

## Best Practices

- Use descriptive names for snapshots
- Include context in snapshot names (e.g., `sms-thread-with-3-messages.png`)
- Store snapshots in appropriate directories
- Update snapshots when UI changes intentionally
- Review snapshot diffs in PRs
