# Guide de Deploiement - Academie Levinet

Ce guide explique comment deployer l'application en preproduction.

## Architecture de deploiement

```
+------------------+     +------------------+     +------------------+
|   Frontend       |     |    Backend       |     |   Database       |
|   (Vercel)       |---->|   (Render)       |---->| (MongoDB Atlas)  |
|   React App      |     |   FastAPI        |     |                  |
+------------------+     +------------------+     +------------------+
```

## Prerequis

- Compte [Vercel](https://vercel.com) (gratuit)
- Compte [Render](https://render.com) (gratuit - 750h/mois)
- Compte [MongoDB Atlas](https://www.mongodb.com/atlas) (deja configure)
- Git installe

---

## Etape 1 : Deployer le Backend sur Render

### 1.1 Creer un compte Render
1. Allez sur https://render.com
2. Connectez-vous avec GitHub

### 1.2 Creer un nouveau Web Service
1. Cliquez sur "New +" puis "Web Service"
2. Connectez votre repo GitHub
3. Configurez :
   - **Name** : `academie-levinet-api`
   - **Root Directory** : `backend`
   - **Environment** : `Python 3`
   - **Build Command** : `pip install -r requirements.txt`
   - **Start Command** : `uvicorn server:app --host 0.0.0.0 --port $PORT`

### 1.3 Configurer les variables d'environnement
Dans Environment > Environment Variables, ajoutez :

| Variable | Valeur |
|----------|--------|
| `MONGO_URL` | `mongodb+srv://username:password@cluster.mongodb.net/academie_levinet_db` |
| `DB_NAME` | `academie_levinet_db` |
| `JWT_SECRET` | `votre-secret-jwt-long-et-securise-minimum-32-caracteres` |
| `FRONTEND_URL` | `https://academie-levinet.vercel.app` |
| `CORS_ORIGINS` | `https://academie-levinet.vercel.app` |

### 1.4 Deployer
Cliquez sur "Create Web Service". Le deploiement prend 2-5 minutes.

### 1.5 Recuperer l'URL du backend
Une fois deploye, Render vous donne une URL comme :
```
https://academie-levinet-api.onrender.com
```

---

## Etape 2 : Deployer le Frontend sur Vercel

### 2.1 Modifier .env.production
Avant de deployer, mettez a jour `frontend/.env.production` :
```
REACT_APP_BACKEND_URL=https://academie-levinet-api.onrender.com
REACT_APP_ENABLE_VISUAL_EDITS=false
```

### 2.2 Installer Vercel CLI
```bash
npm install -g vercel
```

### 2.3 Se connecter a Vercel
```bash
vercel login
```

### 2.4 Deployer le frontend
```bash
cd frontend
vercel
```

Repondez aux questions :
- **Set up and deploy?** → Yes
- **Which scope?** → Votre compte
- **Link to existing project?** → No
- **Project name?** → `academie-levinet`
- **Directory?** → `./`
- **Override settings?** → No

### 2.5 Configurer les variables (optionnel via dashboard)
Dans Vercel Dashboard > Settings > Environment Variables :

| Variable | Value |
|----------|-------|
| `REACT_APP_BACKEND_URL` | `https://academie-levinet-api.onrender.com` |

### 2.6 Deployer en production
```bash
vercel --prod
```

---

## Etape 3 : Verification

### Tester le backend
Ouvrez dans le navigateur :
```
https://academie-levinet-api.onrender.com/docs
```

### Tester le frontend
Ouvrez :
```
https://academie-levinet.vercel.app
```

### Comptes de test
Utilisez les comptes crees precedemment :
- **Membre** : membre.test@academie-levinet.com / Test1234!
- **Instructeur** : instructeur.test@academie-levinet.com / Test1234!
- **Directeur Technique** : dt.test@academie-levinet.com / Test1234!

---

## Etape 4 : Permettre la saisie de donnees a distance

### 4.1 Creer un compte admin pour la saisie
Executez le script `backend/create_test_users.py` apres avoir configure la variable MONGO_URL.

### 4.2 Partager l'acces
Envoyez a la personne qui va saisir les donnees :
- URL : https://academie-levinet.vercel.app/login
- Identifiants d'un compte admin

### 4.3 Ce qu'elle peut faire
- Ajouter des clubs via l'onglet "Clubs"
- Ajouter des membres via l'onglet "Membres"
- Ajouter des instructeurs via l'onglet "Instructeurs"
- Ajouter des directeurs techniques via l'onglet "Directeurs Tech."

---

## Troubleshooting

### Erreur CORS
1. Verifiez que `CORS_ORIGINS` sur Render inclut l'URL exacte du frontend Vercel
2. Pas de "/" a la fin de l'URL

### Erreur connexion MongoDB
1. Dans MongoDB Atlas > Network Access
2. Ajoutez `0.0.0.0/0` pour autoriser toutes les IP (necessaire pour Render)

### Backend "cold start" lent
Sur le plan gratuit de Render, le backend s'endort apres 15 minutes d'inactivite.
Le premier chargement peut prendre 30-60 secondes.

### Build echoue sur Vercel
1. Verifiez les logs dans Vercel Dashboard > Deployments
2. Assurez-vous que `package.json` est present dans `frontend/`

---

## URLs de preproduction

| Service | URL |
|---------|-----|
| Frontend | https://academie-levinet.vercel.app |
| Backend | https://academie-levinet-api.onrender.com |
| API Docs | https://academie-levinet-api.onrender.com/docs |

---

## Commandes utiles

### Vercel
```bash
vercel              # Deploy preview
vercel --prod       # Deploy production
vercel logs         # Voir les logs
vercel ls           # Lister les deployments
```

### Render
Les logs sont disponibles dans le dashboard Render > Logs

---

## Cout mensuel (gratuit)

| Service | Plan | Cout |
|---------|------|------|
| Vercel | Hobby | 0 EUR |
| Render | Free | 0 EUR |
| MongoDB Atlas | M0 Free | 0 EUR |
| **Total** | | **0 EUR** |

Note: Le plan gratuit Render a une limite de 750h/mois et le backend s'endort apres 15 min d'inactivite.

---

*Guide mis a jour le 24 decembre 2025*
