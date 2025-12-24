# 🥋 Académie Levinet - Guide Rapide

## 🏃 Démarrage Local (2 minutes)

### Prérequis
- Node.js 18+
- Python 3.11+
- MongoDB local OU compte MongoDB Atlas (gratuit)

### Lancer l'application

```powershell
# Ouvrir PowerShell et exécuter :
./start.ps1
```

C'est tout ! L'application sera accessible sur **http://localhost:8000**

### Options du script

```powershell
./start.ps1              # Mode normal (backend sert le frontend)
./start.ps1 -Build       # Rebuild le frontend avant de lancer
./start.ps1 -DevMode     # Mode dev avec hot-reload (port 3000 + 8000)
```

---

## ☁️ Déploiement sur Railway (5 minutes, GRATUIT)

### Étape 1 : MongoDB Atlas (base de données gratuite)

1. Aller sur [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Créer un compte gratuit
3. Créer un cluster **M0 (FREE)**
4. Database Access → Add User (noter le mot de passe)
5. Network Access → Add IP → **Allow Access from Anywhere**
6. Connect → Drivers → Copier l'URI

### Étape 2 : Railway (hébergement gratuit)

1. Aller sur [railway.app](https://railway.app)
2. Se connecter avec GitHub
3. **New Project** → **Deploy from GitHub repo**
4. Sélectionner votre repo `academie-levinet`
5. Railway détecte automatiquement le Dockerfile ✓

### Étape 3 : Variables d'environnement

Dans Railway, aller dans **Variables** et ajouter :

```
MONGO_URL=mongodb+srv://VOTRE_USER:VOTRE_PASSWORD@cluster.mongodb.net/academie_levinet_db
DB_NAME=academie_levinet_db
JWT_SECRET=GENERER_UN_SECRET_FORT_64_CARACTERES
```

### Étape 4 : Déployer !

Railway déploie automatiquement. C'est fait ! 🎉

---

## 📁 Structure du projet

```
academie-levinet/
├── start.ps1          ← Script de démarrage (Windows)
├── Dockerfile         ← Pour le déploiement Railway
├── backend/
│   ├── server.py      ← API FastAPI + sert le frontend
│   └── .env           ← Variables locales (ne pas commiter!)
└── frontend/
    ├── src/           ← Code source React
    └── build/         ← Frontend compilé
```

---

## 🔑 Comptes par défaut

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| admin@academielevinet.com | admin123 | Admin |

---

## 🆘 Problèmes courants

### "MongoDB connection failed"
→ Vérifiez que MongoDB tourne localement ou que l'URI Atlas est correcte

### "Module not found"
→ Exécutez `cd backend && pip install -r requirements.txt`

### "npm command not found"
→ Installez Node.js depuis [nodejs.org](https://nodejs.org)

---

## 💰 Coûts

| Service | Coût |
|---------|------|
| MongoDB Atlas M0 | **Gratuit** (512 MB) |
| Railway Starter | **Gratuit** (500h/mois) |
| **Total** | **0€** |

Pour un usage plus intensif, Railway Pro = 5$/mois.

