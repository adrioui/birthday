# Daily Work Session

## Objective

Complete one beads issue per session with full quality gates.

## Project Context

BirthdayOS - Y2K/retro birthday celebration web app. Features flip phone interface, SMS threads, camcorder, and charm collection.

## Workflow

1. Resume: Run `bd list --status=in_progress`. If any issue is in progress, resume it and skip to step 3
2. Find work: Run `bd ready` to pick 1 workable issue, then `bd update <id> --status in_progress` to claim it
3. Implement: Complete the work
4. Verify: Run quality gates (`npm run lint && npm run build`)
5. Land the plane: Close issue, commit, push to remote

## Landing the Plane

1. Close beads issue: `bd close <id>`
2. Commit: Stage explicitly (`git add <file1> <file2>`, never `git add .`), then commit using Conventional Commits:

   **Format:** `<type>(<scope>): <subject>`
   - `scope` optional (e.g., `sms`, `camcorder`, `charm`, `wallet`, `ui`, `build`)
   - Subject: imperative, present tense, no trailing period

   **Types:** `feat` | `fix` | `refactor` | `perf` | `test` | `docs` | `style` | `build` | `chore`

   **Examples:**
   - `feat(sms): add unread badge to thread list`
   - `fix(camcorder): prevent crash when permission denied`
   - `refactor(ui): extract flip-phone keypad component`
   - `chore: update beads workflow instructions`

3. Sync + push: `bd sync && git push`

**No AI attribution** - no "Generated with AI", no `Co-Authored-By` lines.

## Completion Signal

After pushing, run `bd ready` to check for remaining issues. Only output `<promise>COMPLETE</promise>` if `bd ready` returns no issues. Otherwise, end the session silently (the script will start a new session).
