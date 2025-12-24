# 🔒 CONFIGURATION DES PORTS - VERROUILLÉE

**Date de verrouillage : 24 décembre 2025**

---

## ⚠️ RÈGLE ABSOLUE

**NE JAMAIS MODIFIER CES PORTS OU CONFIGURATIONS !**

---

## 🖥️ DÉVELOPPEMENT LOCAL

### Ports obligatoires :
| Service  | Port | URL complète |
|----------|------|--------------|
| Frontend | 3000 | http://localhost:3000 |
| Backend  | 8001 | http://localhost:8001 |

### Commandes de démarrage :

**Terminal 1 - Backend :**
```bash
cd backend
python -m uvicorn server:app --host 127.0.0.1 --port 8001
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm start
# OU
yarn start
```

### ⚠️ ATTENTION - Si le frontend démarre sur un autre port (3001, 3002, etc.) :
1. **ARRÊTER** le frontend (Ctrl+C)
2. **FERMER** tous les navigateurs
3. **TUER** les processus sur le port 3000 : `npx kill-port 3000`
4. **RELANCER** le frontend

### ⚠️ ATTENTION - Si le login ne marche pas en local :
1. Ouvrir DevTools (F12) → Application → Service Workers
2. Cliquer sur "Unregister" 
3. Application → Storage → "Clear site data"
4. Recharger avec Ctrl+Shift+R

---

## 🌐 PRODUCTION (RENDER)

### URL de production :
- **Site** : https://academie-levinet-staging.onrender.com
- **API** : https://academie-levinet-staging.onrender.com/api

### Configuration production :
- Le frontend et le backend sont dans le **même conteneur**
- Le frontend utilise des **URLs relatives** (`/api/...`)
- La variable `REACT_APP_BACKEND_URL` est **VIDE** en production

---

## 📁 Fichiers de configuration

### frontend/.env (LOCAL)
```
REACT_APP_BACKEND_URL=http://localhost:8001
REACT_APP_ENABLE_VISUAL_EDITS=false
```

### frontend/.env.production (PRODUCTION)
```
REACT_APP_BACKEND_URL=
REACT_APP_ENABLE_VISUAL_EDITS=false
```

### backend/.env (LOCAL)
```
MONGO_URL="mongodb+srv://..."
DB_NAME="academie_levinet_db"
JWT_SECRET="..."
CORS_ORIGINS="http://localhost:3000,http://localhost:3001"
```

---

## 🔄 Base de données

**MÊME BASE EN LOCAL ET EN PRODUCTION !**

- Cluster : MongoDB Atlas
- Base : `academie_levinet_db`
- Les données sont partagées entre local et production

---

## ❌ CE QUI NE MARCHE PAS

| Problème | Cause |
|----------|-------|
| Frontend sur port 3001/3002 | CORS bloqué, Service Worker cache |
| Backend sur port 8000 | Frontend pointe vers 8001 |
| Login échoue après déploiement | Service Worker cache l'ancienne config |

---

## ✅ CHECKLIST AVANT DE DÉVELOPPER

- [ ] Backend sur port **8001**
- [ ] Frontend sur port **3000**
- [ ] Pas de Service Worker actif (ou désenregistré)
- [ ] Cache navigateur vidé si changement récent

---

## 📞 En cas de problème

1. **Tuer tous les processus** : `npx kill-port 3000 8001`
2. **Vider le cache navigateur** 
3. **Redémarrer backend puis frontend**
4. **Tester en navigation privée** si ça persiste
