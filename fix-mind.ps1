
$file = "pages\Mind.tsx"
$content = Get-Content $file -Raw

# Fix Factor Buttons Border
$content = $content.Replace("border-dark-700 text-slate-600", "border-slate-200 dark:border-dark-700 text-slate-600 dark:text-slate-300")

# Fix Chat Input Area Container
$content = $content.Replace("bg-white border-t border-slate-100", "bg-white dark:bg-dark-900 border-t border-slate-100 dark:border-dark-700")

# Fix Success/Mismatch Alerts
$content = $content.Replace("bg-amber-50 border-amber-200", "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/30")
$content = $content.Replace("bg-green-50 border-green-200", "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/30")
$content = $content.Replace("text-amber-900", "text-amber-900 dark:text-amber-200")
$content = $content.Replace("text-green-900", "text-green-900 dark:text-green-200")

[System.IO.File]::WriteAllText($file, $content)
Write-Host "Fixed Mind.tsx"
