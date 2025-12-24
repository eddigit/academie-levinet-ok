#!/bin/bash
# ============================================================================
# Script de Build Unifié - Académie Levinet
# Ce script build le frontend et prépare le déploiement unifié
# ============================================================================

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     BUILD UNIFIÉ - ACADÉMIE LEVINET                            ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Navigate to script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Step 1: Build Frontend
echo "📦 Étape 1: Build du Frontend React..."
cd frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "   → Installation des dépendances npm..."
    npm install
fi

# Build React app
echo "   → Compilation du frontend..."
CI=false npm run build

echo "✅ Frontend buildé avec succès!"
cd ..

# Step 2: Verify build exists
echo ""
echo "📋 Étape 2: Vérification du build..."

BUILD_PATH="frontend/build"
if [ -d "$BUILD_PATH" ]; then
    FILE_COUNT=$(find "$BUILD_PATH" -type f | wc -l)
    echo "   → Build trouvé: $FILE_COUNT fichiers"
    echo "✅ Build vérifié!"
else
    echo "❌ Dossier build non trouvé!"
    exit 1
fi

# Step 3: Summary
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     BUILD TERMINÉ AVEC SUCCÈS!                                 ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "Pour lancer en local:"
echo "  cd backend"
echo "  uvicorn server:app --reload --port 8000"
echo ""

