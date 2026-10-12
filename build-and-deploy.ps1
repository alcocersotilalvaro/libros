# build-and-deploy.ps1
# --------------------------------------------------------------------------
# Google Drive (G:) does NOT reliably allow `npm install` / `npm run build`
# (its virtual filesystem blocks npm writes -> EBADF/EPERM errors). The
# Python indexer DOES work fine on G:.
#
# This script works around that limitation automatically:
#   1. Copies the project to a LOCAL temp folder (without node_modules).
#   2. Runs npm install + npm run build there.
#   3. Copies the resulting 'dist' folder back to G:.
#   4. (Optional) Deploys to Firebase Hosting from the local copy.
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File .\build-and-deploy.ps1          # build only
#   powershell -ExecutionPolicy Bypass -File .\build-and-deploy.ps1 -Deploy  # build + deploy
# --------------------------------------------------------------------------

param(
    [switch]$Deploy
)

$ErrorActionPreference = "Stop"
$source = $PSScriptRoot
$local  = Join-Path $env:TEMP "libros-build"

Write-Host "==> Source (Drive):   $source"
Write-Host "==> Work (local):     $local"

# 1. Copy to local disk (exclude node_modules, dist, .firebase and the books)
if (Test-Path $local) { Remove-Item $local -Recurse -Force }
New-Item -ItemType Directory -Path $local | Out-Null
robocopy $source $local /E /XD node_modules dist .firebase /XF "*.pdf" "*.epub" "*.mobi" /NFL /NDL /NJH /NJS /NP | Out-Null

Push-Location $local
try {
    # 2. Install and build locally
    Write-Host "==> npm install..."
    npm install --no-audit --no-fund

    Write-Host "==> npm run build..."
    npm run build

    # 3. Copy dist back to Drive
    $distSrc = Join-Path $local "dist"
    $distDst = Join-Path $source "dist"
    Write-Host "==> Copying dist/ back to Drive..."
    if (Test-Path $distDst) { Remove-Item $distDst -Recurse -Force }
    robocopy $distSrc $distDst /E /NFL /NDL /NJH /NJS /NP | Out-Null

    # 4. Optional deploy (from local to avoid the Drive FS)
    if ($Deploy) {
        Write-Host "==> firebase deploy..."
        Copy-Item (Join-Path $source "firebase.json") $local -Force
        Copy-Item (Join-Path $source ".firebaserc")   $local -Force
        firebase deploy --only hosting
    }

    Write-Host ""
    Write-Host "[OK] Done. dist/ generated at: $distDst"
    if ($Deploy) { Write-Host "[OK] Site deployed to Firebase Hosting." }
    else { Write-Host "[i] Run with -Deploy to publish to Firebase." }
}
finally {
    Pop-Location
}
