# 🛡️ Protocole de Gestion Locale - CRM Académie Jacques Levinet

## 📋 Table des matières
1. [Prérequis](#prérequis)
2. [Connexion Base de Données](#connexion-base-de-données)
3. [Installation Locale](#installation-locale)
4. [Comptes Administrateurs](#comptes-administrateurs)
5. [Structure du Projet](#structure-du-projet)
6. [Commandes Utiles](#commandes-utiles)
7. [Déploiement](#déploiement)

---

## 🔧 Prérequis

### Logiciels requis
- **Node.js** v18+ (pour le frontend React)
- **Python** 3.10+ (pour le backend FastAPI)
- **MongoDB** 6.0+ (base de données)
- **Cursor** ou VS Code (éditeur de code)
- **Git** (contrôle de version)

### Extensions Cursor/VS Code recommandées
- Python
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- MongoDB for VS Code
- Prettier - Code formatter

---

## 🗄️ Connexion Base de Données

### Informations de connexion MongoDB

```
URL de connexion : mongodb://localhost:27017
Nom de la base  : academie_levinet_db
```

### Connexion via MongoDB Compass

1. Téléchargez [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Ouvrez Compass
3. Entrez l'URI : `mongodb://localhost:27017`
4. Cliquez sur "Connect"
5. Sélectionnez la base `academie_levinet_db`

### Collections principales

| Collection | Description |
|------------|-------------|
| `users` | Utilisateurs (admin, membres, instructeurs, DT) |
| `members` | Profils détaillés des membres |
| `clubs` | Clubs affiliés |
| `events` | Événements (stages, cours, etc.) |
| `news` | Actualités |
| `posts` | Publications du mur social |
| `messages` | Messagerie interne |
| `subscriptions` | Cotisations et abonnements |
| `orders` | Commandes boutique |

### Connexion programmatique (Python)

```python
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "academie_levinet_db"

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# Exemple : récupérer tous les utilisateurs
users = await db.users.find({}, {"_id": 0}).to_list(1000)
```

---

## 💻 Installation Locale

### 1. Cloner le projet

```bash
git clone <URL_DU_REPO>
cd academie-levinet-crm
```

### 2. Configuration Backend

```bash
cd backend

# Créer l'environnement virtuel
python -m venv venv

# Activer l'environnement
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Créer le fichier .env
cat > .env << EOF
MONGO_URL="mongodb://localhost:27017"
DB_NAME="academie_levinet_db"
JWT_SECRET="votre_secret_jwt_tres_long_et_securise_12345"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="votre_email@gmail.com"
SMTP_PASSWORD="votre_mot_de_passe_app"
EOF

# Lancer le serveur backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### 3. Configuration Frontend

```bash
cd frontend

# Installer les dépendances
yarn install
# ou
npm install

# Créer le fichier .env
cat > .env << EOF
REACT_APP_BACKEND_URL=http://localhost:8001
REACT_APP_ENABLE_VISUAL_EDITS=false
EOF

# Lancer le serveur frontend
yarn start
# ou
npm start
```

### 4. Accéder à l'application

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:8001
- **Documentation API** : http://localhost:8001/docs

---

## 👤 Comptes Administrateurs

### Super Administrateur (accès complet)

```
Email    : coachdigitalparis@gmail.com
Mot de passe : $$Reussite888!!
Rôle     : super_admin
```

### Administrateur Standard

```
Email    : ajl.wkmo.ipc@gmail.com
Mot de passe : Admin2025!
Rôle     : admin
```

### Compte Membre (test)

```
Email    : membre@academie-levinet.com
Mot de passe : Membre2025!
Rôle     : member
```

### Créer un nouvel admin via script

```python
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import bcrypt
from uuid import uuid4
from datetime import datetime, timezone

async def create_admin(email, password, name):
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["academie_levinet_db"]
    
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    
    admin = {
        "id": str(uuid4()),
        "email": email,
        "password_hash": hashed,
        "name": name,
        "full_name": name,
        "role": "admin",
        "roles": ["admin"],
        "status": "active",
        "country": "France",
        "country_code": "FR",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    
    await db.users.insert_one(admin)
    print(f"Admin créé : {email}")
    client.close()

asyncio.run(create_admin("nouvel@admin.com", "MotDePasse123!", "Nouvel Admin"))
```

---

## 📁 Structure du Projet

```
academie-levinet-crm/
├── backend/
│   ├── server.py           # Point d'entrée FastAPI (monolithique)
│   ├── requirements.txt    # Dépendances Python
│   ├── .env               # Variables d'environnement
│   └── uploads/           # Fichiers uploadés
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json   # PWA manifest
│   │   └── sw.js          # Service Worker
│   │
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   │   ├── ui/       # Composants Shadcn/UI
│   │   │   ├── Sidebar.js
│   │   │   ├── DashboardLayout.js
│   │   │   ├── SocialWall.js
│   │   │   └── ...
│   │   │
│   │   ├── pages/         # Pages de l'application
│   │   │   ├── LandingPage.js
│   │   │   ├── Dashboard.js
│   │   │   ├── MembersPage.js
│   │   │   ├── ClubsPage.js
│   │   │   ├── TechnicalDirectorsPage.js
│   │   │   ├── InstructorsPage.js
│   │   │   ├── EventsPage.js
│   │   │   └── admin/
│   │   │       └── AdminStatsPage.js
│   │   │
│   │   ├── context/       # Contextes React
│   │   │   └── AuthContext.js
│   │   │
│   │   ├── utils/         # Utilitaires
│   │   │   ├── api.js     # Client API
│   │   │   └── countries.js # Pays et drapeaux
│   │   │
│   │   ├── App.js         # Routes principales
│   │   ├── index.js       # Point d'entrée
│   │   └── index.css      # Styles globaux
│   │
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## 🔨 Commandes Utiles

### Backend

```bash
# Lancer en développement (avec hot reload)
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Lancer en production
uvicorn server:app --host 0.0.0.0 --port 8001 --workers 4

# Installer une nouvelle dépendance
pip install <package>
pip freeze > requirements.txt

# Vérifier les erreurs de syntaxe
python -m py_compile server.py
```

### Frontend

```bash
# Développement
yarn start

# Build production
yarn build

# Installer une dépendance
yarn add <package>

# Linter
yarn lint

# Tests
yarn test
```

### MongoDB

```bash
# Démarrer MongoDB (si installé localement)
mongod --dbpath /data/db

# Se connecter via shell
mongosh

# Exporter une collection
mongoexport --db academie_levinet_db --collection users --out users.json

# Importer une collection
mongoimport --db academie_levinet_db --collection users --file users.json

# Backup complet
mongodump --db academie_levinet_db --out ./backup

# Restaurer un backup
mongorestore --db academie_levinet_db ./backup/academie_levinet_db
```

### Git

```bash
# Créer une branche
git checkout -b feature/nouvelle-fonctionnalite

# Commit
git add .
git commit -m "Description du changement"

# Push
git push origin feature/nouvelle-fonctionnalite

# Merge dans main
git checkout main
git merge feature/nouvelle-fonctionnalite
```

---

## 🚀 Déploiement

### Variables d'environnement production

**Backend (.env)**
```
MONGO_URL="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>"
DB_NAME="academie_levinet_db"
JWT_SECRET="<secret_tres_long_et_securise>"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="<email_envoi>"
SMTP_PASSWORD="<mot_de_passe_app>"
```

**Frontend (.env)**
```
REACT_APP_BACKEND_URL=https://api.votre-domaine.com
REACT_APP_ENABLE_VISUAL_EDITS=false
```

### Checklist avant déploiement

- [ ] Toutes les variables d'environnement sont configurées
- [ ] Les credentials de test sont remplacés par des vrais
- [ ] Le build frontend est généré (`yarn build`)
- [ ] Les logs sont configurés
- [ ] Le SSL/HTTPS est activé
- [ ] Les backups MongoDB sont automatisés

---

## 📞 Support

Pour toute question technique, contactez :
- **Email** : ajl.wkmo.ipc@gmail.com
- **Site** : https://academie-jacques-levinet.com

---

*Document généré le 22 décembre 2025*
*Version 1.0*
