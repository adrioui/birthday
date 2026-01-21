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

## Issue Tracking

Uses **beads** (`bd`). Run `bd onboard` to get started.

```bash
bd ready                              # Find available work
bd update <id> --status in_progress   # Claim work
bd close <id>                         # Complete work
bd sync && git push                   # Always push at session end
```

See `agent_docs/beads-workflow.md` for detailed workflow.
