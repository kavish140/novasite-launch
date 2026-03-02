# Setup git and push to GitHub
Set-Location "F:\Websites\personal\Business\novasite-launch-main"

# Init if not already a git repo
if (-not (Test-Path ".git")) {
    git init
    Write-Host "Git initialized"
} else {
    Write-Host "Git already initialized"
}

# Show current status
Write-Host "=== Git Status ==="
git status

# Add remote if not exists
$remotes = git remote 2>&1
if ($remotes -notcontains "origin") {
    git remote add origin https://github.com/kavish140/novasite-launch.git
    Write-Host "Remote origin added"
} else {
    Write-Host "Remote origin already exists:"
    git remote -v
}

# Configure git identity if needed
git config user.email "kavish140@users.noreply.github.com" 2>$null
git config user.name "kavish140" 2>$null

# Stage all files
git add -A
Write-Host "=== Files staged ==="
git status --short

# Commit
git commit -m "feat: optimise site, add GitHub Actions CI/CD workflow, code splitting, lazy loading, smooth scroll, SEO meta tags, Dependabot"

# Set branch to main
git branch -M main

# Fetch and set upstream
Write-Host "=== Pushing to GitHub ==="
git push -u origin main --force

Write-Host "=== DONE ==="

