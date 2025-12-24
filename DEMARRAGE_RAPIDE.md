# 🚀 Démarrage Rapide - Application Académie Levinet

## 📊 État Actuel

✅ **Configuré :**
- Fichiers `.env` créés (backend et frontend)
- Environnement virtuel Python créé
- Scripts de démarrage créés

⚠️ **À compléter :**
- Installation des dépendances backend (problème de permissions)
- Installation des dépendances frontend (en cours)
- Démarrage de MongoDB

## 🎯 Étapes pour Démarrer l'Application

### Option 1 : Installation Manuelle (Recommandé)

#### 1. Installer MongoDB

**Option A : MongoDB Atlas (Cloud - Gratuit et Rapide)**
1. Créez un compte sur https://www.mongodb.com/cloud/atlas/register
2. Créez un cluster gratuit (M0)
3. Obtenez l'URI de connexion
4. Modifiez `backend/.env` :
   ```
   MONGO_URL="mongodb+srv://user:password@cluster.mongodb.net/"
   ```

**Option B : Installation Locale**
- Téléchargez : https://www.mongodb.com/try/download/community
- Installez et démarrez le service

#### 2. Installer les Dépendances Backend

Ouvrez PowerShell **en tant qu'administrateur** et exécutez :

```powershell
cd "C:\Users\clari\Documents\CLIENTS\ACADEMIE LEVINET\App\22-decembre-25\academie-levinet\backend"
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**Si erreur de permissions**, essayez :
```powershell
pip install --user -r requirements.txt
```

#### 3. Installer les Dépendances Frontend

```powershell
cd "C:\Users\clari\Documents\CLIENTS\ACADEMIE LEVINET\App\22-decembre-25\academie-levinet\frontend"
yarn install
```

**Si problème de réseau**, utilisez npm :
```powershell
npm install
```

#### 4. Démarrer MongoDB

**Si MongoDB Atlas :** Aucune action nécessaire

**Si MongoDB local :**
```powershell
# Vérifier si le service existe
Get-Service -Name MongoDB*

# Démarrer le service
Start-Service MongoDB
```

#### 5. Démarrer le Backend

```powershell
cd "C:\Users\clari\Documents\CLIENTS\ACADEMIE LEVINET\App\22-decembre-25\academie-levinet"
.\start-backend.ps1
```

Ou manuellement :
```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

Le backend sera accessible sur : **http://localhost:8001**
Documentation API : **http://localhost:8001/docs**

#### 6. Démarrer le Frontend

Dans un **nouveau terminal** :

```powershell
cd "C:\Users\clari\Documents\CLIENTS\ACADEMIE LEVINET\App\22-decembre-25\academie-levinet"
.\start-frontend.ps1
```

Ou manuellement :
```powershell
cd frontend
yarn start
```

Le frontend sera accessible sur : **http://localhost:3000**

### Option 2 : Utiliser les Scripts Automatiques

Une fois MongoDB configuré et les dépendances installées :

```powershell
# Terminal 1 - Backend
.\start-backend.ps1

# Terminal 2 - Frontend
.\start-frontend.ps1
```

## ✅ Vérification

1. **Backend** : Ouvrez http://localhost:8001/docs
   - Vous devriez voir la documentation Swagger de l'API

2. **Frontend** : Ouvrez http://localhost:3000
   - Vous devriez voir l'interface de l'application

3. **Connexion** : Utilisez un des comptes de test :
   - Email : `coachdigitalparis@gmail.com`
   - Mot de passe : `$$Reussite888!!`

## 🐛 Dépannage

### Erreur : MongoDB non accessible
```
Solution : Vérifiez que MongoDB est démarré ou utilisez MongoDB Atlas
```

### Erreur : Port 8001 déjà utilisé
```powershell
# Trouver le processus
netstat -ano | findstr :8001

# Arrêter le processus (remplacez PID)
taskkill /PID <PID> /F
```

### Erreur : Module Python non trouvé
```powershell
# Réactiver l'environnement virtuel
cd backend
.\venv\Scripts\Activate.ps1
```

### Erreur : Dépendances frontend manquantes
```powershell
cd frontend
rm -r node_modules
yarn install
```

## 📝 Commandes Utiles

### Vérifier l'état de l'installation
```powershell
.\check-setup.ps1
```

### Vérifier MongoDB
```powershell
Test-NetConnection -ComputerName localhost -Port 27017
```

### Vérifier le backend
```powershell
Test-NetConnection -ComputerName localhost -Port 8001
```

## 🎯 Prochaines Étapes

1. ✅ Installer MongoDB (Atlas recommandé pour commencer rapidement)
2. ✅ Installer les dépendances backend (PowerShell en admin)
3. ✅ Installer les dépendances frontend
4. ✅ Démarrer MongoDB
5. ✅ Démarrer le backend
6. ✅ Démarrer le frontend
7. ✅ Tester l'application

---

**Besoin d'aide ?** Consultez :
- `GUIDE_DEMARRAGE_LOCAL.md` - Guide complet
- `INSTALL_MONGODB.md` - Guide d'installation MongoDB
- `PROTOCOLE_GESTION_LOCALE.md` - Protocole original

