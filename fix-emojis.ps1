
$files = Get-ChildItem -Path "pages", "components" -Include "*.tsx" -Recurse

# Define replacements map
$replacements = @{
    # Double encoded or garbled patterns
    'Ã°Å¸Ëœâ€ ' = '😞';
    'ðŸ˜”' = '😞';
    
    'Ã°Å¸ËœÂ ' = '😐';
    'ðŸ˜ ' = '😐';
    
    'Ã°Å¸ËœÅ ' = '😊';
    'ðŸ˜Š' = '😊';
    
    'ðŸ’œ' = '💜';
    'ðŸŽ‰' = '🎉';
    'ðŸ‘¶' = '👶';
    'ðŸ¥¹ðŸ’•' = '🥹💕';
    'ðŸ˜…' = '😅';
    'ðŸŒŸ' = '🌟';
    'ðŸ¤±' = '🌱';
    'ðŸ˜¢' = '😢';
    'ðŸ˜ž' = '😞';
    'ðŸ˜„' = '😄';
    'ðŸ¥°' = '🥰';
    'ðŸ˜Œ' = '😌';
    'ðŸ˜°' = '😰';
    'ðŸ˜¡' = '😡';
    'ðŸ˜ ' = '😍';
    'ðŸ™‚' = '🙂';
    'âš ï¸ ' = '⚠️';
}

foreach ($file in $files) {
    try {
        # Read with UTF8 encoding to ensure we catch specific bytes if possible, 
        # or Default if it handles the messed up encoding better.
        # PowerShell 5.1 Get-Content can be tricky with encoding guessing.
        # We'll try reading raw string and replacing.
        
        $content = [System.IO.File]::ReadAllText($file.FullName)
        $original = $content
        
        foreach ($key in $replacements.Keys) {
            if ($content.Contains($key)) {
                $content = $content.Replace($key, $replacements[$key])
            }
        }
        
        if ($content -ne $original) {
            [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
            Write-Host "Fixed emojis in: $($file.Name)"
        }
    }
    catch {
        Write-Host "Error processing $($file.Name): $_"
    }
}
Write-Host "Emoji fix complete!"
