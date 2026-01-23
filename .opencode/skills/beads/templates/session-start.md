# Session Start Template

Starting a new work session with beads.

## 1. Check Status

```bash
bd list --status=in_progress
```

If any issue is in progress, resume it and skip to step 3.

## 2. Find Work

```bash
bd ready
```

Pick 1 workable issue, then claim it:

```bash
bd update <id> --status in_progress
```

## 3. Create Working Memory Note

Create a note in `thoughts/` directory to track session context.

## 4. Begin Implementation

Work on the issue, updating working memory as needed.
