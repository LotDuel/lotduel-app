# LotDuel — Memory Index
## Last updated: April 14, 2026

This is the single source of truth for session continuity. Every new conversation starts by reading this file.

---

## Memory Files

| File | Purpose | Read on boot |
|------|---------|:---:|
| `memory/memory-index.md` | This file — master reference | ✅ |
| `memory/active-context.md` | Current state, what's live, what's next | ✅ |
| `memory/operations-manual.md` | Commands, webhooks, credentials, deploy process | ✅ |
| `memory/strategic-directive.md` | Product vision, roadmap, principles | ✅ |

## Session Boot Sequence

Every new conversation:
1. Clone repo → use GitHub PAT from Claude Project file `LOTDUEL-CREDENTIALS.md`
2. Read `memory/memory-index.md` (this file)
3. Read `memory/active-context.md`
4. Read `memory/operations-manual.md`
5. Read `memory/strategic-directive.md`

## Short Commands

| Command | Action |
|---------|--------|
| "Save thread" | Update memory files with session decisions → commit → push |
| "Deploy" | Push code + call deploy webhook |
| "Status" | Call status webhook to check VPS health |
| "Logs" | Call logs webhook to see recent errors |

## Project Files (read-only, in Claude Project)

- `LOTDUEL-PROJECT-SUMMARY.md` — Full product context
- `LOTDUEL-CREDENTIALS.md` — GitHub token, hosting details
- `LOTDUEL-TECHNICAL-ARCHITECTURE.md` — Repo structure, components, API routes
