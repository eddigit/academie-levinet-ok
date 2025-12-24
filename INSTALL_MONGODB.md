# 📦 Installation de MongoDB pour le développement local

MongoDB n'est actuellement pas accessible. Voici plusieurs options pour l'installer :

## Option 1 : Installation locale (Windows)

### Étape 1 : Télécharger MongoDB
1. Allez sur : https://www.mongodb.com/try/download/community
2. Sélectionnez :
   - Version : 7.0 (ou la dernière stable)
   - Platform : Windows
   - Package : MSI
3. Téléchargez et exécutez l'installateur

### Étape 2 : Installation
1. Lancez l'installateur MSI
2. Choisissez "Complete" installation
3. Cochez "Install MongoDB as a Service"
4. Laissez les paramètres par défaut (port 27017)
5. Cochez "Install MongoDB Compass" (optionnel mais recommandé)

### Étape 3 : Vérification
```powershell
# Vérifier que le service est démarré
Get-Service -Name MongoDB*

# Démarrer le service si nécessaire
Start-Service MongoDB

# Tester la connexion
Test-NetConnection -ComputerName localhost -Port 27017
```

## Option 2 : MongoDB via Docker (Recommandé)

### Prérequis
- Docker Desktop installé : https://www.docker.com/products/docker-desktop

### Installation
```powershell
# Lancer MongoDB dans un conteneur
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Vérifier que le conteneur est en cours d'exécution
docker ps

# Arrêter MongoDB
docker stop mongodb

# Redémarrer MongoDB
docker start mongodb
```

### Avantages
- Installation rapide
- Pas de configuration système
- Facile à supprimer : `docker rm mongodb`

## Option 3 : MongoDB Atlas (Cloud - Gratuit)

### Étape 1 : Créer un compte
1. Allez sur : https://www.mongodb.com/cloud/atlas/register
2. Créez un compte gratuit (M0 - Free tier)

### Étape 2 : Créer un cluster
1. Créez un cluster gratuit (M0)
2. Choisissez une région proche (Europe)
3. Attendez la création du cluster (2-3 minutes)

### Étape 3 : Obtenir l'URI de connexion
1. Cliquez sur "Connect"
2. Choisissez "Connect your application"
3. Copiez l'URI de connexion (format : `mongodb+srv://user:password@cluster.mongodb.net/`)

### Étape 4 : Configurer l'application
Modifiez `backend/.env` :
```
MONGO_URL="mongodb+srv://user:password@cluster.mongodb.net/"
DB_NAME="academie_levinet_db"
```

### Étape 5 : Autoriser l'accès IP
1. Dans MongoDB Atlas, allez dans "Network Access"
2. Ajoutez votre IP actuelle (ou 0.0.0.0/0 pour le développement)

## Option 4 : MongoDB Portable (Sans installation)

1. Téléchargez MongoDB Community Server (ZIP) : https://www.mongodb.com/try/download/community
2. Extrayez dans un dossier (ex: `C:\mongodb`)
3. Créez le dossier de données : `mkdir C:\data\db`
4. Démarrez MongoDB :
```powershell
cd C:\mongodb\bin
.\mongod.exe --dbpath C:\data\db
```

## 🔍 Vérification de l'installation

Après installation, testez la connexion :

```powershell
# Test de connexion
Test-NetConnection -ComputerName localhost -Port 27017

# Ou avec MongoDB Compass
# Connectez-vous à : mongodb://localhost:27017
```

## 📝 Recommandation

Pour le développement local, je recommande **Docker** (Option 2) car :
- ✅ Installation rapide
- ✅ Pas de pollution du système
- ✅ Facile à gérer
- ✅ Identique à un environnement de production

## 🚀 Après l'installation

Une fois MongoDB installé et démarré, vous pouvez :

1. Vérifier l'installation :
   ```powershell
   .\check-setup.ps1
   ```

2. Démarrer le backend :
   ```powershell
   .\start-backend.ps1
   ```

3. Démarrer le frontend :
   ```powershell
   .\start-frontend.ps1
   ```

## 🐛 Dépannage

### Erreur : Port 27017 déjà utilisé
```powershell
# Trouver le processus qui utilise le port
netstat -ano | findstr :27017

# Arrêter le processus (remplacez PID par le numéro trouvé)
taskkill /PID <PID> /F
```

### Erreur : Permission refusée
Exécutez PowerShell en tant qu'administrateur

### Erreur : Service MongoDB ne démarre pas
```powershell
# Vérifier les logs
Get-EventLog -LogName Application -Source MongoDB -Newest 10

# Réinstaller le service
mongod --remove
mongod --install
```

---

*Pour plus d'aide, consultez : https://docs.mongodb.com/manual/installation/*


