#!/usr/bin/env bash
# ============================================================================
# Render.com Build Script - Académie Levinet
# Ce script est exécuté par Render lors du déploiement
# ============================================================================

set -e  # Exit on error

echo "=========================================="
echo "🚀 BUILD ACADÉMIE LEVINET - RENDER"
echo "=========================================="

# 1. Build Frontend
echo ""
echo "📦 Building Frontend..."
cd frontend
npm install --legacy-peer-deps
npm run build
cd ..

echo ""
echo "✅ Frontend build completed!"
echo "   Build directory: frontend/build"
ls -la frontend/build/

# 2. Install Backend Dependencies
echo ""
echo "🐍 Installing Backend Dependencies..."
cd backend
pip install -r requirements.txt
cd ..

echo ""
echo "=========================================="
echo "✅ BUILD COMPLETE!"
echo "=========================================="
