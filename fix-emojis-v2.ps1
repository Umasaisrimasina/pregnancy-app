
$files = Get-ChildItem -Path "pages", "components" -Include "*.tsx" -Recurse

foreach ($file in $files) {
    # Read as raw string
    $content = [System.IO.File]::ReadAllText($file.FullName)
    $original = $content

    # Fix specific garbled patterns found in Mind.tsx
    # Disappointed / Rough
    $content = $content.Replace('Ã°Å¸Ëœâ€ ', '😞')
    $content = $content.Replace('ðŸ˜”', '😞')

    # Okay / Neutral
    $content = $content.Replace('Ã°Å¸ËœÂ ', '😐')
    $content = $content.Replace('ðŸ˜ ', '😐')

    # Good / Happy
    $content = $content.Replace('Ã°Å¸ËœÅ ', '😊')
    $content = $content.Replace('ðŸ˜Š', '😊')

    # Other common emojis
    $content = $content.Replace('ðŸ’œ', '💜')
    $content = $content.Replace('ðŸŽ‰', '🎉')
    $content = $content.Replace('ðŸ‘¶', '👶')
    $content = $content.Replace('ðŸ¥¹ðŸ’•', '🥹💕')
    $content = $content.Replace('ðŸ˜…', '😅')
    $content = $content.Replace('ðŸŒŸ', '🌟')
    $content = $content.Replace('ðŸ¤±', '🌱')
    $content = $content.Replace('ðŸ˜¢', '😢')
    $content = $content.Replace('ðŸ˜ž', '😞')
    $content = $content.Replace('ðŸ˜„', '😄')
    $content = $content.Replace('ðŸ¥°', '🥰')
    $content = $content.Replace('ðŸ˜Œ', '😌')
    $content = $content.Replace('ðŸ˜°', '😰')
    $content = $content.Replace('ðŸ˜¡', '😡')
    $content = $content.Replace('ðŸ˜ ', '😍')
    $content = $content.Replace('ðŸ™‚', '🙂')
    $content = $content.Replace('âš ï¸ ', '⚠️')
    
    # Fix odd ones that might have partial matches
    if ($content.Contains('Ã°Å¸')) {
        # Fallback for other potential double-encoded UTF8
        # This is risky without exact mapping, so we'll skip broad replace
    }

    if ($content -ne $original) {
        # Write back with UTF8 to fix the file encoding permanently
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Fixed: $($file.Name)"
    }
}
Write-Host "Emoji fix complete!"
