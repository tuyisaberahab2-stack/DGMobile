Add-Type -AssemblyName System.Drawing

$sourcePath = "C:\Users\user\.gemini\antigravity-ide\brain\824e3b42-4be0-46e1-974a-85db0e7de093\dg_app_logo_1792951926322.jpg"
$baseRes = "C:\Users\user\OneDrive\Desktop\ReactNativePractical\DGMobile\android\app\src\main\res"

$sizes = @{
    "mipmap-mdpi"    = 48
    "mipmap-hdpi"    = 72
    "mipmap-xhdpi"   = 96
    "mipmap-xxhdpi"  = 144
    "mipmap-xxxhdpi" = 192
}

$img = [System.Drawing.Image]::FromFile($sourcePath)

foreach ($folder in $sizes.Keys) {
    $dim = $sizes[$folder]
    $destFolder = Join-Path $baseRes $folder
    
    if (-not (Test-Path $destFolder)) {
        New-Item -ItemType Directory -Force -Path $destFolder | Out-Null
    }

    $bmp = New-Object System.Drawing.Bitmap $dim, $dim
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($img, 0, 0, $dim, $dim)
    $g.Dispose()

    $squarePath = Join-Path $destFolder "ic_launcher.png"
    $roundPath = Join-Path $destFolder "ic_launcher_round.png"

    $bmp.Save($squarePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Save($roundPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Generated $folder icon ($($dim)x$($dim))"
}

$img.Dispose()

# Also copy for app internal assets
$assetsFolder = "C:\Users\user\OneDrive\Desktop\ReactNativePractical\DGMobile\src\assets"
if (-not (Test-Path $assetsFolder)) {
    New-Item -ItemType Directory -Force -Path $assetsFolder | Out-Null
}
Copy-Item $sourcePath (Join-Path $assetsFolder "logo.png") -Force
Write-Host "Saved logo to src/assets/logo.png"
