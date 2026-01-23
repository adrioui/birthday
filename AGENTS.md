# AGENTS.md

This file provides guidance to AI agents working with code in this repository.

## Project Overview

**BirthdayOS** - A Y2K/retro-styled birthday celebration web app featuring a flip phone interface, SMS threads, camcorder, and charm collection system.

**Stack**: React 19 + TypeScript + Vite + Tailwind CSS + GSAP

## Domain Concepts

- **Charms**: Collectible items with id, name, icon, power, points (persisted to localStorage)
- **Messages**: Static SMS thread with gift card attachments
- **Transitions**: Animated screen-to-screen navigation (phone-to-sms, gift-to-camcorder)

## Project Structure

```
src/
├── screens/        # Route components (FlipPhone, SMS, Camcorder, Wallet)
├── components/     # Feature-organized (camcorder/, sms/, wallet/, effects/)
├── context/        # CharmContext, TransitionContext
├── hooks/          # useCamera, useCapture, useCharmFlip, useAudio
├── data/           # Static data (messages.ts)
└── types/          # Type definitions (charm.ts)
```

## Design System

| Aspect | Value |
|--------|-------|
| Style | Y2K Cyber-Pop & Neo-Brutalist Hybrid |
| Primary | Lime `#CCFF00`, Hot Pink `#FF0099`, Periwinkle `#CCCCFF` |
| System | Win95 Grey `#C3C7CB`, Terminal Green `#33FF33` |
| Effects | Chrome gradients, CRT scanlines, halftone patterns |

See `style.json` for complete design tokens.

## Development

```bash
npm run dev       # Development server
npm run build     # Production build (tsc + vite)
npm run lint      # ESLint
```

**Testing**: No testing framework configured yet. Will be added.

## Agent Workflow

### Thread Management

Use focused threads. When context grows large or task shifts, use handoff:

```
/handoff <next goal>
```

Examples:
- `/handoff now implement the wallet screen animations`
- `/handoff execute phase one of the plan`
- `/handoff check the rest of the codebase for similar patterns`

### Progressive Disclosure

Read relevant docs from `agent_docs/` before starting work:

| Document | Purpose |
|----------|---------|
| `agent_docs/beads-workflow.md` | Issue tracking with beads |

## Issue Tracking

Uses **beads** (`bd`). Run `bd onboard` to get started.

```bash
bd ready                              # Find available work
bd update <id> --status in_progress   # Claim work
bd close <id>                         # Complete work
bd sync && git push                   # Always push at session end
```

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
