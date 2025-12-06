---
description: Launch parallel agents to work on multiple tasks simultaneously
---

Launch multiple agents in parallel to work on separate tasks.

Before launching:
1. Review AGENTS.md for file ownership rules
2. Ensure tasks have no file overlap
3. Update AGENTS.md with claims

Agent coordination protocol:
1. Each agent reads coordination files first
2. Claims files in AGENTS.md before editing
3. Updates claude-progress.txt when done
4. Removes claims from AGENTS.md

Available agent types for parallel work:
- **Coding agents** - For implementing features (separate file scopes)
- **Researcher** - For async research while coding continues
- **Reviewer** - For reviewing code after implementation

Prompt for task assignments to proceed.
