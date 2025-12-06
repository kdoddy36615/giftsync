---
description: Create a git commit with a well-formatted message
---

Create a git commit for the current changes:

1. Run `git status` to see changes
2. Run `git diff` to understand what changed
3. Review recent commit messages for style consistency
4. Stage appropriate files (exclude .env, node_modules, etc.)
5. Create commit with format:

```
<type>: <short description>

<longer description if needed>

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>
```

Types:
- feat: New feature
- fix: Bug fix
- refactor: Code refactoring
- style: Formatting, styling
- docs: Documentation
- test: Adding tests
- chore: Maintenance

Ask for confirmation before committing.
