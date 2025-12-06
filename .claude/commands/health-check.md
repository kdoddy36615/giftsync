---
description: Run a quick health check on the project - build, types, lint, and tests
---

Run a comprehensive health check on the giftwise project:

1. **Build Check**
   ```bash
   npm run build
   ```

2. **Type Check**
   ```bash
   npx tsc --noEmit
   ```

3. **Lint Check**
   ```bash
   npm run lint
   ```

4. **Dev Server Status**
   Check if dev server is running and responding.

Report results in this format:

| Check | Status | Issues |
|-------|--------|--------|
| Build | PASS/FAIL | Details |
| Types | PASS/FAIL | Details |
| Lint | PASS/FAIL | Details |
| Server | PASS/FAIL | Details |

If any checks fail, provide the specific errors and suggested fixes.
