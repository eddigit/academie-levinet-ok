# 🚀 Guide de Démarrage Local - Académie Levinet

Ce guide vous aidera à configurer et lancer l'application en local.

## 📋 Prérequis

- ✅ **Python 3.10+** (détecté: Python 3.13.5)
- ✅ **Node.js 18+** (détecté: v22.10.0)
- ⚠️ **MongoDB 6.0+** (à vérifier/installer)

## 🔧 Configuration

### 1. Fichiers .env créés

Les fichiers de configuration ont été créés :
- ✅ `backend/.env` - Configuration du backend
- ✅ `frontend/.env` - Configuration du frontend

### 2. Installation de MongoDB

Si MongoDB n'est pas installé :

#### Option A : Installation locale
1. Téléchargez MongoDB Community Server : https://www.mongodb.com/try/download/community
2. Installez MongoDB
3. Démarrez le service MongoDB :
   ```powershell
   # Vérifier si le service existe
   Get-Service -Name MongoDB*
   
   # Démarrer MongoDB (si installé comme service)
   Start-Service MongoDB
   ```

#### Option B : MongoDB via Docker (recommandé)
```powershell
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Option C : MongoDB Atlas (cloud)
Modifiez `backend/.env` avec votre URI MongoDB Atlas :
```
MONGO_URL="mongodb+srv://user:password@cluster.mongodb.net/"
```

### 3. Installation des dépendances

#### Backend (Python)
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

#### Frontend (Node.js)
```powershell
cd frontend
yarn install
# ou
npm install
```

## 🚀 Démarrage de l'application

### Étape 1 : Démarrer MongoDB

Vérifiez que MongoDB est en cours d'exécution :
```powershell
# Vérifier le port
Test-NetConnection -ComputerName localhost -Port 27017
```

Si MongoDB n'est pas démarré :
- **Service Windows** : `Start-Service MongoDB`
- **Docker** : `docker start mongodb`
- **Manuel** : `mongod --dbpath C:\data\db`

### Étape 2 : Démarrer le Backend

```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

Le backend sera accessible sur : http://localhost:8001
Documentation API : http://localhost:8001/docs

### Étape 3 : Démarrer le Frontend

Dans un **nouveau terminal** :
```powershell
cd frontend
yarn start
# ou
npm start
```

Le frontend sera accessible sur : http://localhost:3000

## ✅ Vérification

1. **Backend** : Ouvrez http://localhost:8001/docs - vous devriez voir la documentation Swagger
2. **Frontend** : Ouvrez http://localhost:3000 - vous devriez voir l'application
3. **Base de données** : Connectez-vous avec MongoDB Compass à `mongodb://localhost:27017`

## 🔐 Comptes de test

Selon le protocole, les comptes suivants sont disponibles :

### Super Administrateur
- Email : `coachdigitalparis@gmail.com`
- Mot de passe : `$$Reussite888!!`

### Administrateur Standard
- Email : `ajl.wkmo.ipc@gmail.com`
- Mot de passe : `Admin2025!`

### Membre
- Email : `membre@academie-levinet.com`
- Mot de passe : `Membre2025!`

## 🐛 Dépannage

### Erreur : MongoDB non accessible
```
Solution : Vérifiez que MongoDB est démarré sur le port 27017
```

### Erreur : Port 8001 déjà utilisé
```
Solution : Changez le port dans backend/.env ou arrêtez le processus qui utilise le port
```

### Erreur : Port 3000 déjà utilisé
```
Solution : Le frontend vous proposera automatiquement un autre port (3001, 3002, etc.)
```

### Erreur : Module Python non trouvé
```
Solution : Activez l'environnement virtuel : .\venv\Scripts\Activate.ps1
```

### Erreur : Dépendances Node.js manquantes
```
Solution : Supprimez node_modules et yarn.lock, puis réinstallez : yarn install
```

## 📝 Notes importantes

- Les fichiers `.env` contiennent des valeurs par défaut pour le développement
- Pour la production, modifiez les secrets (JWT_SECRET, etc.)
- La base de données locale sera créée automatiquement au premier démarrage
- Les collections seront créées automatiquement lors de la première utilisation

## 🔄 Scripts de démarrage rapide

Vous pouvez créer des scripts PowerShell pour faciliter le démarrage :

### `start-backend.ps1`
```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### `start-frontend.ps1`
```powershell
cd frontend
yarn start
```

---

*Guide créé le $(Get-Date -Format "yyyy-MM-dd")*


