---
description: Verify UI visually using Playwright screenshots and AI analysis
---

# Verify UI

You are tasked with visually verifying the BirthdayOS UI without human intervention. This command captures screenshots and analyzes them to confirm the app looks correct.

## Initial Response

When invoked WITH a specific screen/flow:
```
I'll verify the [screen/flow] visually.

Starting verification:
1. Ensuring dev server is running
2. Capturing screenshots via Playwright
3. Analyzing the visual output

Stand by for results...
```

When invoked WITHOUT parameters:
```
I'll run a visual smoke test on BirthdayOS.

Which screens would you like me to verify?
- all: Full visual regression
- flipphone: Main flip phone screen
- sms: SMS thread view
- camcorder: Camcorder screen
- wallet: Charm wallet

Or describe a specific flow to test.
```

## Process Steps

### Step 1: Ensure Environment Ready

```bash
# Check if dev server is running
curl -s http://localhost:5173 > /dev/null && echo "Dev server running" || echo "Start with: npm run dev"
```

### Step 2: Capture Screenshots

Option A - Run existing E2E tests:
```bash
# Run smoke tests which capture key screens
npx playwright test e2e/smoke.spec.ts --project=chromium --reporter=list
```

Option B - Use Playwright MCP (if configured):
```
Navigate to http://localhost:5173
Take screenshot
Navigate to next screen...
```

Option C - Direct Playwright script:
```bash
# Create a quick capture script
npx playwright test e2e/visual-capture.spec.ts --project=chromium
```

### Step 3: Analyze Screenshots

After capturing, use the Read tool to analyze each screenshot:

1. Find captured screenshots:
```bash
find test-results -name "*.png" -type f | head -10
```

2. Read and analyze each screenshot file (Read tool can view images)

3. Compare against design system expectations

### Step 4: Generate Verification Report

```markdown
## UI Verification Report

**Date**: [timestamp]
**Screens Verified**: [list]
**Overall Status**: ✅ PASS | ⚠️ ISSUES | ❌ FAIL

### Screen Results

#### FlipPhone
- **Status**: ✅
- **Screenshot**: test-results/flipphone.png
- **Observations**: Nokia-style phone renders correctly, Y2K colors present

#### SMS Thread
- **Status**: ⚠️
- **Screenshot**: test-results/sms.png
- **Observations**: Messages render, but gift card styling missing gradient

...

### Action Items
1. [Issue requiring attention]
2. [Suggested fix]

### Next Steps
- [ ] Fix identified issues
- [ ] Re-run verification
- [ ] Update visual baselines if intentional changes
```

## Design System Quick Reference

| Element | Expected Value |
|---------|---------------|
| Lime | `#CCFF00` |
| Hot Pink | `#FF0099` |
| Periwinkle | `#CCCCFF` |
| Win95 Grey | `#C3C7CB` |
| Terminal Green | `#33FF33` |
| Style | Y2K Cyber-Pop, Neo-Brutalist |
| Effects | Chrome gradients, CRT scanlines, halftone |

## Quick Commands

```bash
# Full visual test
npx playwright test --project=chromium

# Specific flow
npx playwright test e2e/flipphone-sms-flow.spec.ts --project=chromium

# Update baselines (after intentional changes)
npx playwright test --update-snapshots

# View report
npx playwright show-report
```

## Using Playwright MCP

If Playwright MCP is configured, you can:

1. Navigate: `browser_navigate` to localhost:5173
2. Interact: `browser_click`, `browser_type`
3. Capture: `browser_take_screenshot`
4. Analyze: Read the screenshot file

This gives real-time browser control for exploratory verification.

## Important Notes

- **Always capture before analyzing** - Don't assume previous screenshots are current
- **Compare to design system** - Use documented colors and styles as reference
- **Report actionable findings** - Be specific about what's wrong and how to fix
- **No false positives** - Only flag issues you're confident about
- **Save evidence** - Keep screenshots for reference

Remember: You are replacing human eyeballs. Be thorough and accurate.
