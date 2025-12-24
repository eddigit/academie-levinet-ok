# 🚀 Guide de Déploiement Unifié - Académie Levinet

## 📋 Vue d'ensemble

Ce guide explique comment déployer l'application en mode **unifié** : un seul service qui sert à la fois le backend (FastAPI) et le frontend (React).

### Avantages du déploiement unifié
- ✅ **Un seul déploiement** à gérer
- ✅ **Pas de problèmes CORS** (même domaine)
- ✅ **Configuration simplifiée**
- ✅ **Moins coûteux** (un seul service)

---

## 🏗️ Architecture

```
academie-levinet/
├── Dockerfile              ← Build multi-stage (Node + Python)
├── railway.json            ← Config Railway
├── render.yaml             ← Config Render
├── backend/
│   └── server.py           ← FastAPI + sert les fichiers statiques
└── frontend/
    └── build/              ← React compilé (créé par npm run build)
```

**Fonctionnement :**
- `/api/*` → Routes FastAPI (API REST)
- `/*` → Application React (SPA)

---

## 🔧 Plateformes recommandées

### ⭐ Railway.app (Recommandé)

**Pourquoi Railway ?**
- Support Docker natif
- Déploiement automatique depuis GitHub
- MongoDB addon disponible
- Interface simple

**Étapes :**

1. **Créer un compte sur [railway.app](https://railway.app)**

2. **Nouveau projet → Deploy from GitHub**
   - Sélectionnez votre repo

3. **Railway détecte automatiquement le Dockerfile**

4. **Configurer les variables d'environnement :**
   ```
   MONGO_URL=mongodb+srv://...
   DB_NAME=academie_levinet_db
   JWT_SECRET=votre-secret-64-caracteres
   STRIPE_API_KEY=sk_live_...
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=...
   SMTP_PASSWORD=...
   ```

5. **Générer un domaine** ou connecter votre domaine personnalisé

---

### Render.com (Alternative)

1. **Nouveau Web Service → Connect GitHub repo**

2. **Sélectionner "Docker" comme environnement**

3. **Configurer les variables d'environnement** (même liste que Railway)

4. **Deploy !**

---

## ⚠️ Pourquoi pas Vercel ?

Vercel est optimisé pour :
- Sites statiques
- Next.js avec API Routes
- Serverless Functions (Node.js principalement)

**Vercel n'est PAS adapté pour :**
- FastAPI (Python persistant)
- Applications avec état en mémoire
- WebSockets

Pour un backend FastAPI, **Railway ou Render sont les meilleurs choix**.

---

## 🗄️ MongoDB Atlas

Pour la base de données en production :

1. **Créer un compte** sur [mongodb.com/atlas](https://www.mongodb.com/atlas)

2. **Créer un cluster gratuit (M0)**

3. **Créer un utilisateur de base de données**
   - Database Access → Add New Database User
   - Mot de passe fort

4. **Autoriser les connexions**
   - Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

5. **Récupérer l'URI de connexion**
   - Connect → Drivers → Copier l'URI
   - Format : `mongodb+srv://user:password@cluster.mongodb.net/academie_levinet_db`

---

## 🧪 Test local du build unifié

```powershell
# 1. Builder le frontend
cd frontend
npm run build
cd ..

# 2. Lancer le backend (qui sert aussi le frontend)
cd backend
uvicorn server:app --reload --port 8000

# 3. Ouvrir http://localhost:8000
```

Ou utiliser le script :

```powershell
./build-unified.ps1
cd backend
uvicorn server:app --port 8000
```

---

## 📝 Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `MONGO_URL` | URI MongoDB Atlas | `mongodb+srv://...` |
| `DB_NAME` | Nom de la base | `academie_levinet_db` |
| `JWT_SECRET` | Secret JWT (64 car.) | `openssl rand -hex 32` |
| `CORS_ORIGINS` | Origines CORS | `*` |
| `SMTP_HOST` | Serveur SMTP | `smtp.gmail.com` |
| `SMTP_PORT` | Port SMTP | `587` |
| `SMTP_USER` | Email SMTP | `contact@...` |
| `SMTP_PASSWORD` | Mot de passe app | `xxxx xxxx xxxx` |
| `STRIPE_API_KEY` | Clé Stripe | `sk_live_...` |
| `OPENAI_API_KEY` | Clé OpenAI | `sk-...` |

---

## 🔒 Sécurité

- [ ] Générer un JWT_SECRET fort : `openssl rand -hex 32`
- [ ] Utiliser les clés Stripe **live** (pas test)
- [ ] Configurer HTTPS (automatique sur Railway/Render)
- [ ] Ne jamais commiter les fichiers `.env`

---

## 🆘 Dépannage

### "Frontend build not found"
→ Le frontend n'est pas compilé. Exécutez `cd frontend && npm run build`

### Erreur CORS
→ En mode unifié, CORS ne devrait pas être un problème. Vérifiez que vous accédez bien via l'URL du serveur, pas `localhost:3000`

### Erreur MongoDB
→ Vérifiez l'URI et que l'IP est whitelistée sur Atlas

---

## 📞 Support

Pour toute question sur le déploiement, consultez :
- [Documentation Railway](https://docs.railway.app)
- [Documentation Render](https://render.com/docs)
- [Documentation MongoDB Atlas](https://docs.atlas.mongodb.com)

