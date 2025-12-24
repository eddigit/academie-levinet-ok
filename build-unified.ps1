# ============================================================================
# Script de Build Unifié - Académie Levinet
# Ce script build le frontend et prépare le déploiement unifié
# ============================================================================

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     BUILD UNIFIÉ - ACADÉMIE LEVINET                            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Navigate to script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Step 1: Build Frontend
Write-Host "📦 Étape 1: Build du Frontend React..." -ForegroundColor Yellow
Set-Location frontend

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "   → Installation des dépendances npm..." -ForegroundColor Gray
    npm install
}

# Build React app
Write-Host "   → Compilation du frontend..." -ForegroundColor Gray
$env:CI = "false"  # Ignore warnings as errors
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du build du frontend!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend buildé avec succès!" -ForegroundColor Green
Set-Location ..

# Step 2: Verify build exists
Write-Host ""
Write-Host "📋 Étape 2: Vérification du build..." -ForegroundColor Yellow

$buildPath = "frontend/build"
if (Test-Path $buildPath) {
    $fileCount = (Get-ChildItem -Path $buildPath -Recurse -File).Count
    Write-Host "   → Build trouvé: $fileCount fichiers" -ForegroundColor Gray
    Write-Host "✅ Build vérifié!" -ForegroundColor Green
} else {
    Write-Host "❌ Dossier build non trouvé!" -ForegroundColor Red
    exit 1
}

# Step 3: Summary
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║     BUILD TERMINÉ AVEC SUCCÈS!                                 ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Structure du déploiement unifié:" -ForegroundColor Cyan
Write-Host "  academie-levinet/"
Write-Host "  ├── backend/"
Write-Host "  │   └── server.py        ← Serveur FastAPI + Static files"
Write-Host "  └── frontend/"
Write-Host "      └── build/           ← Frontend React compilé"
Write-Host ""
Write-Host "Pour lancer en local:" -ForegroundColor Yellow
Write-Host "  cd backend"
Write-Host "  uvicorn server:app --reload --port 8000"
Write-Host ""
Write-Host "Pour déployer sur Railway/Render:" -ForegroundColor Yellow
Write-Host "  1. Push vers GitHub"
Write-Host "  2. Railway/Render détectera automatiquement le build"
Write-Host ""

