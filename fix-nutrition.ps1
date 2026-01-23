
$file = "pages\Nutrition.tsx"
$content = Get-Content $file -Raw

# Fix Tab Buttons
$content = $content.Replace("bg-white text-slate-600 border border-slate-100 dark:border-dark-700", "bg-white dark:bg-dark-900 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-dark-700")

# Fix Search Bar
$content = $content.Replace("bg-white p-2 rounded-2xl", "bg-white dark:bg-dark-900 p-2 rounded-2xl")

# Fix Tags
$content = $content.Replace("bg-white border border-slate-100 dark:border-dark-700 rounded-md", "bg-white dark:bg-dark-900 border border-slate-100 dark:border-dark-700 rounded-md")

# Fix Water Bar Layout
$content = $content.Replace("bg-slate-100 rounded-full", "bg-slate-100 dark:bg-dark-800 rounded-full")

[System.IO.File]::WriteAllText($file, $content)
Write-Host "Fixed Nutrition.tsx"
