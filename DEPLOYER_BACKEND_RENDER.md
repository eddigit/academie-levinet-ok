# 🚀 Déployer le Backend sur Render (Gratuit)

## Étape 1 : Créer un compte Render

1. Allez sur https://render.com
2. Cliquez sur "Get Started for Free"
3. Connectez-vous avec GitHub

## Étape 2 : Créer un nouveau Web Service

1. Dashboard → **New +** → **Web Service**
2. Connectez votre repo GitHub (ou utilisez "Public Git repository")
3. URL du repo : `https://github.com/VOTRE_USERNAME/academie-levinet` (ou upload le code)

## Étape 3 : Configurer le service

| Paramètre | Valeur |
|-----------|--------|
| **Name** | `academie-levinet-api` |
| **Region** | `Frankfurt (EU Central)` |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn server:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | `Free` |

## Étape 4 : Variables d'environnement

Cliquez sur **Advanced** → **Add Environment Variable** :

```
MONGO_URL = mongodb+srv://coachdigitalparis_db_user:gPO1cLnIYxlNgHvF@cluster0.wvavunv.mongodb.net/academie_levinet_db?retryWrites=true&w=majority

DB_NAME = academie_levinet_db

JWT_SECRET = votre_secret_jwt_production_super_long_12345

FRONTEND_URL = https://academie-levinet-preprod.vercel.app

CORS_ORIGINS = https://academie-levinet-preprod.vercel.app,http://localhost:3000
```

## Étape 5 : Déployer

1. Cliquez sur **Create Web Service**
2. Attendez le déploiement (~5 minutes)
3. Copiez l'URL générée (ex: `https://academie-levinet-api.onrender.com`)

## Étape 6 : Mettre à jour Vercel

1. Allez sur https://vercel.com
2. Projet `academie-levinet-preprod` → **Settings** → **Environment Variables**
3. Ajoutez :
   - **Key** : `REACT_APP_BACKEND_URL`
   - **Value** : `https://academie-levinet-api.onrender.com` (votre URL Render)
4. **Redéployez** : allez dans "Deployments" → cliquez sur "..." → "Redeploy"

## Étape 7 : Tester

1. Ouvrez https://academie-levinet-preprod.vercel.app
2. Connectez-vous avec :
   - Email : `coachdigitalparis@gmail.com`
   - Mot de passe : `$$Reussite888!!`

## ⚠️ Note importante

Le plan gratuit de Render met le serveur en veille après 15 minutes d'inactivité.
Le premier accès peut prendre ~30 secondes pour "réveiller" le serveur.

---

## Alternative rapide : Utiliser le backend existant

Si vous voulez une solution immédiate, vous pouvez continuer à utiliser le backend Emergent Agent.
Les données seront celles de la base Emergent (pas MongoDB Atlas).

