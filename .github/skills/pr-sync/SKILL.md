---
name: pr-sync
description: Use when synchronizing the current feature branch with main, committing changes, pushing, or creating a draft pull request.
---

# PR Sync

Use `#file:../../scripts/sync-pr.ps1` for the deterministic PowerShell workflow.
The current checkout is the target branch; do not ask the user to provide it.

## Workflow

1. Check the current branch and `git status --short`.
2. List all modified and untracked files and ask whether they are the complete
   set the user wants in the commit.
3. Stop and ask the user to stage the approved files manually with `git add`.
   Never run `git add` or stage files automatically.
4. Check the staged file list with `git diff --cached --name-only`. If no files
   are staged, tell the user clearly and stop before commit, push, or PR creation.
5. Inspect the staged changes and propose a short commit message before
   committing.
   Use a concise single-line summary and keep it within 72 characters.
6. Show the proposed message and wait for explicit approval.
7. Explain the requested operation and get approval before using `-Approve`.
8. Run only the requested switches:

```powershell
pwsh -NoProfile -File .github/scripts/sync-pr.ps1 -Approve -CommitChanges `
   -CommitMessage "<approved-message>" -Push -CreatePullRequest
```

If the staged file set is incomplete or empty, stop. Pass the approved message
with `-CommitMessage` whenever changes are committed.

## Guardrails

Never use `main`, `master`, `production`, detached HEAD, force-push, or rebase. Stop on `CONFLICT_DETECTED` or any non-zero exit code. Ask before editing conflict files and never expose credentials.
