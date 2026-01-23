# Fix dark text tokens across all pages and components
$pages = Get-ChildItem -Path "pages" -Filter "*.tsx"
$components = Get-ChildItem -Path "components" -Filter "*.tsx"

$allFiles = $pages + $components

foreach ($file in $allFiles) {
    $content = Get-Content $file.FullName -Raw
    $original = $content
    
    # Replace text tokens
    $content = $content -replace 'text-dark-text-primary', 'text-slate-900 dark:text-white'
    $content = $content -replace 'text-dark-text-secondary', 'text-slate-600 dark:text-slate-300'
    $content = $content -replace 'text-dark-text-muted', 'text-slate-400 dark:text-slate-500'
    
    # Replace background tokens without light mode
    $content = $content -replace 'bg-dark-950 border', 'bg-white dark:bg-dark-950 border'
    $content = $content -replace 'bg-dark-950/50', 'bg-slate-50 dark:bg-dark-950/50'
    $content = $content -replace 'border-t border-dark-700', 'border-t border-slate-100 dark:border-dark-700'
    
    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content)
        Write-Host "Fixed: $($file.Name)"
    }
}

Write-Host "Done!"
