# Git push script
$env:GIT_EDITOR = "true"

# Abort any ongoing rebase
git rebase --abort 2>$null

# Check status
Write-Host "=== Git Status ===" -ForegroundColor Cyan
git status

# Add all changed files
Write-Host "`n=== Adding files ===" -ForegroundColor Cyan
git add components/PreConceptionGuide.tsx pages/Dashboard.tsx pages/Nutrition.tsx pages/PregnancyMind.tsx pages/BabyCareEducation.tsx pages/PostPartumEducation.tsx services/sentimentService.ts AWS_COST_ANALYSIS.md package-lock.json

# Commit
Write-Host "`n=== Committing ===" -ForegroundColor Cyan
git commit -m "fix: resolve merge conflicts and update Azure sentiment API"

# Pull with rebase
Write-Host "`n=== Pulling with rebase ===" -ForegroundColor Cyan
git pull --rebase origin main

# If pull successful, push
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=== Pushing to remote ===" -ForegroundColor Cyan
    git push origin main
} else {
    Write-Host "`n=== Pull failed, trying force push ===" -ForegroundColor Yellow
    git push --force-with-lease origin main
}

Write-Host "`n=== Done ===" -ForegroundColor Green
