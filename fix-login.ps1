
$file = "pages\Login.tsx"
$content = Get-Content $file -Raw

# Fix Right Panel Background
$content = $content.Replace("bg-white animate-in slide-in-from-right-4", "bg-white dark:bg-dark-950 animate-in slide-in-from-right-4")
$content = $content.Replace("min-h-screen bg-white flex flex-col", "min-h-screen bg-white dark:bg-dark-950 flex flex-col")

# Fix Left Panel Description Text (already dark:text-slate-300 but check)
# It looked fine in view.

[System.IO.File]::WriteAllText($file, $content)
Write-Host "Fixed Login.tsx"
