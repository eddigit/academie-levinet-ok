# Script de démarrage du frontend
Write-Host "🚀 Démarrage du frontend..." -ForegroundColor Green

cd frontend

# Vérifier si node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📥 Installation des dépendances..." -ForegroundColor Yellow
    if (Test-Path "yarn.lock") {
        yarn install
    } else {
        npm install
    }
}

# Vérifier le backend
Write-Host "🔍 Vérification du backend..." -ForegroundColor Yellow
$backendCheck = Test-NetConnection -ComputerName localhost -Port 8001 -WarningAction SilentlyContinue
if (-not $backendCheck.TcpTestSucceeded) {
    Write-Host "⚠️  ATTENTION: Le backend n'est pas accessible sur le port 8001" -ForegroundColor Red
    Write-Host "   Veuillez démarrer le backend avant de continuer" -ForegroundColor Red
    Write-Host "   Commande: .\start-backend.ps1" -ForegroundColor Yellow
    $continue = Read-Host "Continuer quand même? (o/N)"
    if ($continue -ne "o" -and $continue -ne "O") {
        exit
    }
}

# Démarrer le serveur de développement
Write-Host "✅ Démarrage du serveur frontend sur http://localhost:3000" -ForegroundColor Green
if (Test-Path "yarn.lock") {
    yarn start
} else {
    npm start
}


