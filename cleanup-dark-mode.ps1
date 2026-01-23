
$files = Get-ChildItem -Path "pages", "components" -Include "*.tsx" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content

    # Fix duplicates
    $content = $content.Replace('dark:text-white dark:text-white', 'dark:text-white')
    $content = $content.Replace('dark:text-slate-300 dark:text-slate-300', 'dark:text-slate-300')
    $content = $content.Replace('dark:text-slate-500 dark:text-slate-500', 'dark:text-slate-500')
    $content = $content.Replace('dark:border-dark-700 dark:border-dark-700', 'dark:border-dark-700')
    $content = $content.Replace('dark:bg-dark-900 dark:bg-dark-900', 'dark:bg-dark-900')
    $content = $content.Replace('dark:bg-dark-800 dark:bg-dark-800', 'dark:bg-dark-800')

    # Fix conflicting/messy patterns
    $content = $content.Replace('bg-white dark:bg-white dark:bg-dark-900', 'bg-white dark:bg-dark-900')
    $content = $content.Replace('bg-dark-800 dark:bg-slate-50 dark:bg-dark-800', 'bg-slate-50 dark:bg-dark-800')
    $content = $content.Replace('border-slate-100 dark:border-slate-100 dark:border-dark-700', 'border-slate-100 dark:border-dark-700')
    
    # Fix triple/quadruple messes if any
    $content = $content.Replace('hover:bg-slate-50 dark:hover:bg-dark-800 dark:hover:bg-slate-50 dark:hover:bg-dark-800', 'hover:bg-slate-50 dark:hover:bg-dark-800')
    
    # Specific fix for Partner/Family dashboard weirdness if found
    $content = $content.Replace('bg-white dark:bg-dark-900 dark:bg-dark-900', 'bg-white dark:bg-dark-900')
    
    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content)
        Write-Host "Cleaned: $($file.Name)"
    }
}
Write-Host "Cleanup Done!"