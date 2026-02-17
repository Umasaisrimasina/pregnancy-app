
Add-Type -AssemblyName System.Drawing
$currDir = Get-Location
$imagePath = "C:\Users\Uma\.gemini\antigravity\brain\957911e1-f25e-4b5e-b1ac-8c56bee6e1b5\uploaded_media_3_1769244551527.png"

if (Test-Path $imagePath) {
    try {
        $image = [System.Drawing.Bitmap]::FromFile($imagePath)
        # Sample the center
        $x = [math]::Floor($image.Width / 2)
        $y = [math]::Floor($image.Height / 2)
        $pixel = $image.GetPixel($x, $y)
        $hex = "#{0:X2}{1:X2}{2:X2}" -f $pixel.R, $pixel.G, $pixel.B
        Write-Output "DETECTED_COLOR:$hex"
        $image.Dispose()
    } catch {
        Write-Error "Failed to process image: $_"
    }
} else {
    Write-Error "Image file not found at $imagePath"
}
