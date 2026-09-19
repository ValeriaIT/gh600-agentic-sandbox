[CmdletBinding()]
param (
    [string]$CommitMessage = "",
    [string]$BaseBranch = "main",
    [string]$Remote = "origin",
    [switch]$Approve,
    [switch]$CommitChanges,
    [switch]$IncludeUntracked,
    [switch]$Push,
    [switch]$CreatePullRequest
)

$ErrorActionPreference = "Stop"

function Invoke-Git {
    param([Parameter(Mandatory = $true)][string[]]$Arguments)

    & git @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "git $($Arguments -join ' ') failed with exit code $LASTEXITCODE."
    }
}

function Get-GitText {
    param([Parameter(Mandatory = $true)][string[]]$Arguments)

    $output = & git @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "git $($Arguments -join ' ') failed with exit code $LASTEXITCODE."
    }

    return ($output -join [Environment]::NewLine).Trim()
}

function Stop-WithConflict {
    param([string]$Message)

    Write-Error "CONFLICT_DETECTED: $Message"
    exit 2
}

if ($BaseBranch -notmatch '^[A-Za-z0-9._/-]+$' -or $Remote -notmatch '^[A-Za-z0-9._/-]+$') {
    throw "BaseBranch and Remote contain invalid characters."
}

$currentBranch = Get-GitText @("rev-parse", "--abbrev-ref", "HEAD")
if ([string]::IsNullOrWhiteSpace($currentBranch) -or $currentBranch -eq "HEAD") {
    throw "The repository is in detached HEAD state. Switch to a feature branch first."
}

if ($currentBranch -in @("main", "master", "production")) {
    throw "Cannot execute sync from the protected branch ($currentBranch)."
}

if (($Push -or $CreatePullRequest -or $CommitChanges) -and -not $Approve) {
    throw "Mutating operations require -Approve after explicit user confirmation."
}

$status = Get-GitText @("status", "--porcelain", "--untracked-files=all")
$hasChanges = -not [string]::IsNullOrWhiteSpace($status)

if ($hasChanges -and -not $CommitChanges) {
    throw "Working tree is not clean. Review changes and rerun with -CommitChanges after confirmation."
}

Invoke-Git @("fetch", $Remote, $BaseBranch)
$behindCount = [int](Get-GitText @("rev-list", "--count", "HEAD..$Remote/$BaseBranch"))

if ([int]$behindCount -gt 0) {
    if (-not $Approve) {
        throw "Branch is $behindCount commit(s) behind $Remote/$BaseBranch. Rerun with -Approve to merge."
    }

    & git pull --no-rebase --no-edit $Remote $BaseBranch
    if ($LASTEXITCODE -ne 0) {
        Stop-WithConflict "Merge from $Remote/$BaseBranch failed. Resolve conflicts manually before retrying."
    }
}

if ($CommitChanges -and $hasChanges) {
    if ($IncludeUntracked) {
        Invoke-Git @("add", "--all")
    }
    else {
        Invoke-Git @("add", "--update")
    }

    & git diff --staged --quiet
    if ($LASTEXITCODE -eq 0) {
        Write-Output "No tracked changes are staged; skipping commit."
    }
    else {
        if ([string]::IsNullOrWhiteSpace($CommitMessage)) {
            $CommitMessage = "chore($currentBranch): sync with $BaseBranch"
        }

        Invoke-Git @("commit", "-m", $CommitMessage)
    }
}

if ($Push) {
    Invoke-Git @("push", "--set-upstream", $Remote, $currentBranch)
}

if ($CreatePullRequest) {
    $prNumber = (& gh pr list --head $currentBranch --base $BaseBranch --state open --json number --jq ".[].number")
    if ($LASTEXITCODE -ne 0) {
        throw "gh pr list failed with exit code $LASTEXITCODE."
    }

    if ([string]::IsNullOrWhiteSpace(($prNumber -join ""))) {
        $prUrl = & gh pr create --draft --title "chore: sync $currentBranch with $BaseBranch" --body "Draft PR created by the repository sync script." --base $BaseBranch --head $currentBranch
        if ($LASTEXITCODE -ne 0) {
            throw "gh pr create failed with exit code $LASTEXITCODE."
        }
    }
    else {
        $prUrl = & gh pr view $currentBranch --json url --jq ".url"
        if ($LASTEXITCODE -ne 0) {
            throw "gh pr view failed with exit code $LASTEXITCODE."
        }
    }

    Write-Output "SUCCESS: PR available at $(($prUrl -join [Environment]::NewLine).Trim())"
}
else {
    Write-Output "SUCCESS: branch $currentBranch is synchronized with $Remote/$BaseBranch."
}