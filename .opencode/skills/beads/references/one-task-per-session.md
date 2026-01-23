# One Task Per Session

Focusing on completing one beads issue per session.

## Principle

Each session should focus on completing one specific task. This provides:

- Clear boundaries and completion criteria
- Better focus and reduced context switching
- Easier tracking of progress
- Cleaner git history

## Implementation

1. **At session start**: Run `bd ready` to pick one issue
2. **During session**: Focus only on that issue
3. **At session end**: Close the issue and push

## When to Break This Rule

Only in exceptional circumstances:

- When issues are tightly coupled (e.g., fixing bugs in related files)
- When tasks are trivial and can be completed quickly
- When instructed by user

## Benefits

- Predictable session length
- Clear progress indicators
- Reduced risk of incomplete work
- Better issue tracking accuracy
