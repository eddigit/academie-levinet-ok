# 📋 Guide de Déploiement - Académie Jacques Levinet

## 🎯 Vue d'ensemble

Ce projet est une application web full-stack composée de :
- **Frontend** : React 19 avec CRACO, Tailwind CSS, Shadcn/UI
- **Backend** : FastAPI (Python 3.11) avec Motor (MongoDB async)
- **Base de données** : MongoDB Atlas

Le déploiement est **unifié** : frontend et backend sont servis depuis le même conteneur Docker.

---

## 🚀 Déploiement sur Render.com

### Prérequis

1. Un compte sur [Render.com](https://render.com)
2. Le repository GitHub connecté à Render
3. Accès à MongoDB Atlas

### Étapes de déploiement

#### 1. Créer un nouveau Web Service

1. Aller sur https://dashboard.render.com
2. Cliquer sur **"New +"** → **"Web Service"**
3. Connecter le repository GitHub `eddigit/academie-levinet`
4. Configurer :
   - **Name** : `academie-levinet-staging` (ou production)
   - **Region** : Frankfurt (EU Central) - proche de la France
   - **Branch** : `main`
   - **Runtime** : Docker
   - **Plan** : Free (staging) ou Starter (production)

#### 2. Variables d'environnement

Dans le dashboard Render, aller dans **Environment** et ajouter :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `MONGO_URL` | `mongodb+srv://...` | URL de connexion MongoDB Atlas |
| `DB_NAME` | `academie_levinet_db` | Nom de la base de données |
| `JWT_SECRET` | (auto-généré) | Secret pour les tokens JWT |
| `CORS_ORIGINS` | `*` | Origines CORS autorisées |
| `SMTP_HOST` | `smtp.gmail.com` | Serveur SMTP (optionnel) |
| `SMTP_PORT` | `587` | Port SMTP |
| `SMTP_USER` | `email@gmail.com` | Email SMTP |
| `SMTP_PASSWORD` | `app_password` | Mot de passe application |

#### 3. Lancer le déploiement

Cliquer sur **"Create Web Service"** ou **"Manual Deploy"** → **"Deploy latest commit"**

---

## ⚠️ Points importants à retenir

### Fichiers `.env`

**IMPORTANT** : Les fichiers `.env` locaux sont **exclus** du build Docker grâce au `.dockerignore`.

- `frontend/.env` : Configuration locale uniquement (contient `REACT_APP_BACKEND_URL=http://localhost:8001`)
- `frontend/.env.production` : Configuration production (contient `REACT_APP_BACKEND_URL=` vide pour URLs relatives)

### Architecture unifiée

En production, le backend FastAPI sert aussi les fichiers statiques du frontend React :
- Le frontend build est copié dans `/app/frontend/build`
- FastAPI détecte ce dossier et sert les fichiers statiques
- Les URLs API sont **relatives** (`/api/...`) et non absolues

### Service Worker

Le Service Worker (`frontend/public/sw.js`) :
- N'intercepte **PAS** les requêtes vers `/api/*`
- Cache uniquement les fichiers statiques (HTML, CSS, JS)

---

## 🔧 Résolution des problèmes courants

### Erreur "localhost:XXXX" en production

**Symptôme** : Les requêtes API pointent vers `localhost:8001` au lieu de l'URL relative.

**Cause** : Le fichier `frontend/.env` local a été inclus dans le build Docker.

**Solution** :
1. Vérifier que `.dockerignore` contient `frontend/.env`
2. S'assurer que `frontend/.env.production` a `REACT_APP_BACKEND_URL=` (vide)
3. Redéployer avec "Clear build cache" si disponible

### Erreur de dépendances npm (ERESOLVE)

**Symptôme** : Le build échoue avec une erreur de conflit `date-fns`.

**Solution** : Le Dockerfile utilise `npm install --legacy-peer-deps`

### Erreur 500 sur une API

**Symptôme** : Internal Server Error sur un endpoint.

**Cause probable** : Données existantes dans MongoDB incompatibles avec le modèle Pydantic.

**Solution** : Rendre les champs du modèle optionnels avec des valeurs par défaut.

### Cache du navigateur

**Symptôme** : Les modifications ne s'appliquent pas après déploiement.

**Solution** :
1. Ouvrir le site en navigation privée (Ctrl+Shift+N)
2. Ou : DevTools → Application → Service Workers → Unregister
3. Ou : DevTools → Application → Storage → Clear site data

---

## 📁 Structure importante

```
academie-levinet/
├── .dockerignore          # Exclut .env locaux du build
├── Dockerfile             # Build multi-stage (Node + Python)
├── render.yaml            # Configuration Render.com
├── backend/
│   ├── server.py          # API FastAPI principale
│   ├── requirements.txt   # Dépendances Python
│   └── .env               # Config locale (ignorée en prod)
└── frontend/
    ├── .env               # Config locale (ignorée en prod)
    ├── .env.production    # Config production (incluse)
    └── src/
        └── utils/api.js   # URLs API relatives
```

---

## 🔄 Workflow de déploiement

1. **Développer** localement avec backend sur `localhost:8001`
2. **Committer** les changements
3. **Pusher** sur la branche `main`
4. **Vérifier** le déploiement automatique sur Render
5. Si échec : **Manual Deploy** avec le dernier commit

---

## 📞 Accès MongoDB Atlas

- **Cluster** : cluster0.wvavunv.mongodb.net
- **Base** : academie_levinet_db
- **Collections** : users, members, clubs, events, news, etc.

Pour accéder à la console MongoDB :
1. Aller sur https://cloud.mongodb.com
2. Se connecter avec le compte associé
3. Sélectionner le cluster `Cluster0`

---

## ✅ Checklist avant déploiement

- [ ] Toutes les modifications sont commitées et pushées
- [ ] Les tests passent localement
- [ ] `frontend/.env.production` contient `REACT_APP_BACKEND_URL=` (vide)
- [ ] `.dockerignore` exclut les fichiers `.env` locaux
- [ ] Les variables d'environnement sont configurées sur Render

---

*Dernière mise à jour : 24 décembre 2025*
