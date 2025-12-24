# Script de vérification de l'installation
Write-Host "🔍 Vérification de l'installation..." -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Vérifier Python
Write-Host "1. Vérification de Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "   ✅ Python installé: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Python n'est pas installé" -ForegroundColor Red
    $allGood = $false
}

# Vérifier Node.js
Write-Host "2. Vérification de Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    Write-Host "   ✅ Node.js installé: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Node.js n'est pas installé" -ForegroundColor Red
    $allGood = $false
}

# Vérifier MongoDB
Write-Host "3. Vérification de MongoDB..." -ForegroundColor Yellow
$mongoCheck = Test-NetConnection -ComputerName localhost -Port 27017 -WarningAction SilentlyContinue
if ($mongoCheck.TcpTestSucceeded) {
    Write-Host "   ✅ MongoDB est accessible sur le port 27017" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  MongoDB n'est pas accessible sur le port 27017" -ForegroundColor Yellow
    Write-Host "      Options:" -ForegroundColor Yellow
    Write-Host "      - Installer MongoDB: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
    Write-Host "      - Ou utiliser Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest" -ForegroundColor Yellow
    Write-Host "      - Ou utiliser MongoDB Atlas (cloud)" -ForegroundColor Yellow
}

# Vérifier les fichiers .env
Write-Host "4. Vérification des fichiers .env..." -ForegroundColor Yellow
if (Test-Path "backend\.env") {
    Write-Host "   ✅ backend/.env existe" -ForegroundColor Green
} else {
    Write-Host "   ❌ backend/.env manquant" -ForegroundColor Red
    $allGood = $false
}

if (Test-Path "frontend\.env") {
    Write-Host "   ✅ frontend/.env existe" -ForegroundColor Green
} else {
    Write-Host "   ❌ frontend/.env manquant" -ForegroundColor Red
    $allGood = $false
}

# Vérifier l'environnement virtuel Python
Write-Host "5. Vérification de l'environnement virtuel Python..." -ForegroundColor Yellow
if (Test-Path "backend\venv") {
    Write-Host "   ✅ Environnement virtuel Python existe" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Environnement virtuel Python non créé" -ForegroundColor Yellow
    Write-Host "      Créez-le avec: cd backend && python -m venv venv" -ForegroundColor Yellow
}

# Vérifier les dépendances backend
Write-Host "6. Vérification des dépendances backend..." -ForegroundColor Yellow
if (Test-Path "backend\venv\Lib\site-packages\fastapi") {
    Write-Host "   ✅ Dépendances backend installées" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Dépendances backend non installées" -ForegroundColor Yellow
    Write-Host "      Installez-les avec: cd backend && .\venv\Scripts\Activate.ps1 && pip install -r requirements.txt" -ForegroundColor Yellow
}

# Vérifier les dépendances frontend
Write-Host "7. Vérification des dépendances frontend..." -ForegroundColor Yellow
if (Test-Path "frontend\node_modules") {
    Write-Host "   ✅ Dépendances frontend installées" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Dépendances frontend non installées" -ForegroundColor Yellow
    Write-Host "      Installez-les avec: cd frontend && yarn install" -ForegroundColor Yellow
}

Write-Host ""
if ($allGood) {
    Write-Host "✅ Configuration de base OK!" -ForegroundColor Green
    Write-Host "   Vous pouvez démarrer l'application avec:" -ForegroundColor Cyan
    Write-Host "   - Backend: .\start-backend.ps1" -ForegroundColor Cyan
    Write-Host "   - Frontend: .\start-frontend.ps1" -ForegroundColor Cyan
} else {
    Write-Host "⚠️  Certains éléments manquent. Consultez GUIDE_DEMARRAGE_LOCAL.md" -ForegroundColor Yellow
}


