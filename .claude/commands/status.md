---
description: Get high-level monorepo status - architecture, configs, build health, and cross-app coordination
---

Provide a concise monorepo status report focused on architecture and infrastructure.

## Check These Areas

### 1. Monorepo Health
- Root configs exist: `package.json`, `turbo.json`, `pnpm-workspace.yaml`
- Workspace structure: `apps/web`, `apps/mobile`, `packages/`
- All apps have `CLAUDE.md` and `PROGRESS.md`

### 2. Build Status
- Run `npm run type-check` in `apps/web/`
- Note any build warnings or errors

### 3. Cross-App Dependencies
- Scan `apps/web/PROGRESS.md` for pending API routes mobile needs
- Scan `apps/mobile/PROGRESS.md` for current phase/blockers
- Check if `packages/shared` has been extracted yet

### 4. Config Consistency
- Package names use `@giftsync/*` convention
- No old "giftwise" or "giftassist" references
- Environment variables documented

## Output Format

```
## Monorepo Status

**Structure:** [OK/Issues]
**Web Build:** [Pass/Fail]
**Mobile:** [Phase X - description]

### Cross-App
- API routes needed: [count]
- Shared packages: [extracted/pending]

### Issues
- [any blockers or inconsistencies]

### Next Priority
- [single most important next step]
```

Keep it brief - this is a quick health check, not a detailed feature review.
