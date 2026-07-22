Add-Type -AssemblyName System.Drawing
$source = 'WhatsApp Image 2026-07-21 at 8.12.18gggg.jpeg'
$target = 'logo.png'
$img = [System.Drawing.Image]::FromFile($source)
$img.Save($target, [System.Drawing.Imaging.ImageFormat]::Png)
$img.Dispose()
Write-Output "saved $target"
