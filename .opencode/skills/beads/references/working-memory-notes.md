# Working Memory Notes

Using notes to track session context and progress.

## Purpose

Working memory notes help maintain context across:

- Thread handoffs between agents
- Session interruptions
- Multi-step tasks

## When to Create Notes

- At the start of a session
- When context grows large and needs to be summarized
- Before handoff to another agent
- When pausing work mid-task

## What to Include

1. **Current task**: Issue ID, title, status
2. **Progress**: What's done, what's remaining
3. **Key decisions**: Important choices made
4. **Roadblocks**: Any blockers or issues encountered
5. **Next steps**: Clear actions for continuation

## Location

Store working memory notes in `thoughts/` directory with descriptive names:

- `session-<date>-<issue-id>.md`
- `handoff-<context>.md`
- `research-<topic>.md`

## Format

Use markdown with clear section headers. Keep notes concise but informative.
