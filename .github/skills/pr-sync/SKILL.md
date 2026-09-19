---
name: pr-sync
description: Use when synchronizing the current feature branch with main, committing changes, pushing, or creating a draft pull request.
---

# PR Sync

Use `#file:../../scripts/sync-pr.ps1` for the deterministic PowerShell workflow.
The current checkout is the target branch; do not ask the user to provide it.

## Workflow

1. Check the current branch and `git status --short`.
2. Explain the requested operation and get approval before using `-Approve`.
3. Run only the requested switches:

```powershell
pwsh -NoProfile -File .github/scripts/sync-pr.ps1 -Approve -CommitChanges -Push -CreatePullRequest
```

Use `-IncludeUntracked` only when explicitly requested. Ask for a commit message only when the default is not acceptable.

## Guardrails

Never use `main`, `master`, `production`, detached HEAD, force-push, or rebase. Stop on `CONFLICT_DETECTED` or any non-zero exit code. Ask before editing conflict files and never expose credentials.
