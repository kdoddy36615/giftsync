---
description: Review recent code changes using the code-reviewer agent
---

Use the code-reviewer agent to review recent code changes in the giftwise project.

Focus on:
1. Files modified in the current session (check claude-progress.txt)
2. New files that haven't been reviewed yet
3. Any files specified by the user

Run a thorough review checking:
- TypeScript types and strict mode compliance
- React/Next.js patterns
- Security issues
- Project standards (dark theme, naming conventions)
- Code quality and best practices

Provide actionable feedback with severity levels (CRITICAL/WARNING/SUGGESTION).
