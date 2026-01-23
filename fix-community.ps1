
$file = "pages\Community.tsx"
$content = Get-Content $file -Raw

# Fix Tab Navigation Container
$content = $content.Replace("bg-white p-2 rounded-2xl border border-slate-100 dark:border-dark-700", "bg-white dark:bg-dark-900 p-2 rounded-2xl border border-slate-100 dark:border-dark-700")

# Fix Tab Buttons Inactive State - mainly just ensure text is readable if transparent
$content = $content.Replace("text-slate-500 hover:bg-slate-50 dark:hover:bg-dark-800", "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-800")

# Fix Chat Input Areas matching the pattern found in file
$content = $content.Replace("bg-white border-t border-slate-100", "bg-white dark:bg-dark-900 border-t border-slate-100 dark:border-dark-700")

# Fix Search Inputs
$content = $content.Replace("bg-white border border-slate-100 dark:border-dark-700", "bg-white dark:bg-dark-800 border border-slate-100 dark:border-dark-700")

# Fix Chat Bubbles - Target specific classes found in viewing the file
$content = $content.Replace("bg-white p-3 rounded-2xl", "bg-white dark:bg-dark-800 p-3 rounded-2xl border border-slate-100 dark:border-dark-700")

# Fix New Post Modal
$content = $content.Replace("bg-white w-full max-w-lg", "bg-white dark:bg-dark-900 w-full max-w-lg")
$content = $content.Replace("p-6 bg-dark-800 flex justify-end", "p-6 bg-slate-50 dark:bg-dark-800 flex justify-end")

# Fix Comment/Like buttons
$content = $content.Replace("text-slate-500 hover:text-slate-700", "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200")

[System.IO.File]::WriteAllText($file, $content)
Write-Host "Fixed Community.tsx"
