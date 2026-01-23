# Session Close Template

Closing a work session with beads.

## 1. Complete Work

Ensure the issue is fully implemented.

## 2. Run Quality Gates

```bash
npm run lint
npm run build
# npm run test (if applicable)
```

## 3. Close Issue

```bash
bd close <id>
```

## 4. Commit Changes

Stage explicitly (never `git add .`):

```bash
git add <file1> <file2> ...
git commit -m "<conventional commit message>"
```

Format: `<type>(<scope>): <subject>`

## 5. Sync and Push

```bash
bd sync
git push
```

## 6. Verify

```bash
git status
```

Must show "up to date with origin".

## 7. Check for More Work

```bash
bd ready
```

If no issues, session complete. Otherwise, end for next session.
