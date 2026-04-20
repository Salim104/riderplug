# AI Interaction Guidelines

## Communication

- Be concise and direct
- Explain non-obvious decisions briefly
- Ask before large refactors or architectural changes
- Don't add features not in the current spec
- Never delete files without clarification
- If unsure about a requirement, ask — don't assume

## Workflow

This is the workflow for every single feature:

1. **Read** — Read `@context/current-feature.md` fully before starting
2. **Confirm** — Briefly confirm what you're about to build, ask if unclear
3. **Branch** — Create a new git branch for the feature
4. **Research** — Use Context7 MCP to check current docs for Convex/Clerk/Shadcn if needed
5. **Design** — Check active Pencil canvas via MCP for UI reference
6. **Implement** — Build the feature exactly as specced
7. **Test** — Verify in browser manually, run Playwright MCP for critical flows
8. **Build check** — Run `npm run build` — fix all errors before proceeding
9. **Iterate** — Fix issues, never leave broken code
10. **Commit** — Ask for permission first, use conventional commits
11. **Merge** — Merge to main, delete branch
12. **Update** — Mark complete in `current-feature.md`, add to `## History`

**Never commit without:**
- Explicit permission from Salim
- A passing `npm run build`
- Manual browser verification

## Branching

- New branch per feature: `feature/[feature-name]`
- New branch per fix: `fix/[fix-name]`
- Ask to delete branch after merge

## Commits

- Always ask before committing
- Conventional commits: `feat:`, `fix:`, `chore:`, `style:`, `refactor:`
- One feature per commit — keep them focused
- Never include "Generated with Claude" in commit messages

## When Stuck

- Stop after 2-3 failed attempts
- Explain clearly what's not working and why
- Never keep trying random fixes
- Ask for clarification before continuing

## Code Changes

- Minimal changes to accomplish the task
- Don't refactor unrelated code unless asked
- Don't add "nice to have" features not in the spec
- Preserve existing patterns in the codebase
- Never switch away from the agreed stack (no Prisma, no custom auth, etc.)

## Stack Reminders

If you ever feel tempted to use these — don't:
- ❌ Prisma → use Convex
- ❌ NextAuth / custom auth → use Clerk
- ❌ `<img>` tags → use CldImage or next/image
- ❌ useEffect for data → use Convex useQuery
- ❌ API routes for data → use Convex directly
- ❌ Tailwind CSS @theme config → we use v3 not v4

## Code Review Checklist

Periodically review AI-generated code for:
- **Security** — auth checks on all admin routes, input validation
- **Performance** — no unnecessary re-renders, no N+1 Convex queries
- **Logic errors** — edge cases, empty states, loading states
- **Patterns** — matches existing codebase conventions
- **Mobile** — responsive on small screens
