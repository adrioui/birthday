# Browser Verification Workflow

This document describes how AI agents can visually verify the BirthdayOS UI without human intervention.

## Overview

The agent uses Playwright to capture screenshots and analyzes them visually to confirm the UI is correct. This eliminates the need for humans to manually check every UI change.

## Setup

### 1. Playwright MCP Server (Recommended)

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

This gives the agent direct browser control:
- `browser_navigate` - Go to URLs
- `browser_take_screenshot` - Capture current state
- `browser_click` - Click elements
- `browser_snapshot` - Get accessibility tree

### 2. Playwright E2E Tests

Already configured in this project. Run with:

```bash
npm run test:e2e           # Run all E2E tests
npm run test:e2e:ui        # Interactive UI mode
npm run test:e2e:report    # View HTML report
```

Screenshots are captured to `test-results/` on failure (configurable in `playwright.config.ts`).

## Verification Workflow

### Quick Verification

```
Agent: verify_ui flipphone
```

This triggers:
1. Dev server check (localhost:5173)
2. Screenshot capture via Playwright
3. Visual analysis of screenshot
4. Report generation

### Full Visual Regression

```
Agent: verify_ui all
```

Runs all visual checks across:
- FlipPhone screen
- SMS thread
- Camcorder
- Wallet/Charms

### Manual Flow Testing

Using Playwright MCP:

```
1. browser_navigate to http://localhost:5173
2. browser_take_screenshot (save flipphone state)
3. browser_click on message button
4. browser_take_screenshot (save SMS state)
5. Analyze both screenshots
6. Report findings
```

## What the Agent Checks

### Design System Compliance

| Check | Expected |
|-------|----------|
| Primary colors | Lime `#CCFF00`, Hot Pink `#FF0099`, Periwinkle `#CCCCFF` |
| System colors | Win95 Grey `#C3C7CB`, Terminal Green `#33FF33` |
| Aesthetic | Y2K Cyber-Pop, Neo-Brutalist |
| Effects | Chrome gradients, CRT scanlines, halftone patterns |

### Screen-Specific Checks

#### FlipPhone
- Nokia-style phone renders completely
- Screen content visible (not cut off)
- Buttons accessible and styled

#### SMS Thread
- Message bubbles with correct styling
- Sender/receiver differentiation
- Gift card attachments visible
- Scrollable content

#### Camcorder
- Viewfinder displays correctly
- REC indicator present
- Retro camcorder aesthetic
- Snap/capture button functional

#### Wallet
- Charms collection renders
- Points display correctly
- Charm flip animations work
- LocalStorage persistence verified

## Agent Tools

### .opencode/agent/browser-verifier.md

Subagent for visual verification. Spawns when you need detailed UI analysis.

```
Use browser-verifier to check the camcorder screen styling
```

### .opencode/command/verify_ui.md

Command for quick verification runs.

```
/verify_ui sms
/verify_ui all
```

## Verification Report Format

```markdown
## UI Verification Report

**Date**: 2026-01-23T10:30:00
**Screens Verified**: FlipPhone, SMS, Wallet
**Overall Status**: ✅ PASS

### Screen Results

#### FlipPhone
- **Status**: ✅ PASS
- **Screenshot**: test-results/flipphone.png
- **Observations**: 
  - Nokia-style phone renders correctly
  - Y2K colors (lime, pink) present
  - CRT scanline effect visible

#### SMS Thread  
- **Status**: ⚠️ WARNING
- **Screenshot**: test-results/sms.png
- **Observations**:
  - Messages render correctly
  - Gift card missing chrome gradient
  
### Action Items
1. Fix gift card gradient in SMS component
```

## Integration with Development

### Pre-Commit Verification

Before committing UI changes:

```bash
# Run visual tests
npm run test:e2e

# Or ask agent
"verify_ui all and tell me if anything looks broken"
```

### CI/CD Integration

Playwright tests run in CI. Screenshots are captured on failure and available in artifacts.

### Updating Baselines

When intentional UI changes are made:

```bash
npx playwright test --update-snapshots
```

Then commit the new baseline screenshots.

## Troubleshooting

### "Dev server not running"
```bash
npm run dev
```

### "Screenshots not capturing"
```bash
npx playwright install chromium
```

### "MCP not responding"
Restart the MCP server or check configuration.

### "False positives in visual diff"
Adjust threshold in `playwright.config.ts`:
```ts
expect: {
  toHaveScreenshot: { maxDiffPixels: 100 }
}
```

## Best Practices

1. **Run verification after UI changes** - Catch regressions early
2. **Use specific screen targets** - Faster than full regression
3. **Review agent reports** - Trust but verify findings
4. **Update baselines intentionally** - Don't auto-update without review
5. **Keep design system doc updated** - Agent references it for checks

## Related Files

- `playwright.config.ts` - Playwright configuration
- `e2e/` - E2E test files
- `e2e/fixtures/birthday-fixtures.ts` - Test fixtures with agent bridge
- `style.json` - Design system tokens
