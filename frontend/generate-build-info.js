// Script de génération du fichier buildInfo.js avec timestamp
// Exécuté automatiquement avant chaque build

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const now = new Date();
const dateStr = now.toLocaleDateString('fr-FR');
const timeStr = now.toLocaleTimeString('fr-FR');
const buildId = now.getTime().toString();

// Récupérer le hash du dernier commit Git
let commitHash = 'unknown';
try {
  commitHash = execSync('git rev-parse --short HEAD').toString().trim();
} catch (error) {
  console.warn('Impossible de récupérer le hash du commit Git');
}

// Lire le numéro de version depuis package.json
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
const version = packageJson.version || '1.0.0';

const buildInfo = `// ============================================
// FICHIER GÉNÉRÉ AUTOMATIQUEMENT À CHAQUE BUILD
// NE PAS MODIFIER MANUELLEMENT
// ============================================

const BUILD_INFO = {
  timestamp: "${now.toISOString()}",
  date: "${dateStr}",
  time: "${timeStr}",
  buildId: "${buildId}",
  version: "${version}",
  commitHash: "${commitHash}"
};

export default BUILD_INFO;
`;

const filePath = path.join(__dirname, 'src', 'buildInfo.js');
fs.writeFileSync(filePath, buildInfo, 'utf8');

console.log('');
console.log('================================================================');
console.log('   BUILD INFO GENERE - ACADEMIE JACQUES LEVINET');
console.log('================================================================');
console.log('   Version: ' + version);
console.log('   Date: ' + dateStr);
console.log('   Heure: ' + timeStr);
console.log('   Build ID: ' + buildId);
console.log('   Commit: ' + commitHash);
console.log('================================================================');
console.log('');
