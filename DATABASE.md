# Documentation MongoDB - Académie Levinet

**Base de données :** `academie_levinet_db`  
**Cluster :** `cluster0.wvavunv.mongodb.net`

---

## 📊 Collections principales

### `users`
Collection unifiée pour tous les rôles (admin, membre, gestionnaire club, directeur technique)

```json
{
  "_id": "ObjectId",
  "email": "String (unique, index)",
  "password": "String (bcrypt hash)",
  "role": "String (admin | member | club_manager | dt | instructor)",
  "firstName": "String",
  "lastName": "String",
  "phone": "String",
  "avatar": "String (URL)",
  "created_at": "DateTime",
  "updated_at": "DateTime",
  "lastLogin": "DateTime"
}
```

### `members`
Profils détaillés des membres (données complémentaires)

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users)",
  "birthDate": "Date",
  "address": {
    "street": "String",
    "city": "String",
    "zipCode": "String",
    "country": "String"
  },
  "subscriptionStatus": "String (active | inactive | pending)",
  "joinDate": "DateTime",
  "clubId": "ObjectId (ref: clubs, optional)",
  "licenseNumber": "String",
  "discipline": "String (SPK | SFJL | IPC | WKMO)"
}
```

### `clubs`
Clubs affiliés à l'Académie Jacques Levinet

```json
{
  "_id": "ObjectId",
  "name": "String (unique)",
  "managerId": "ObjectId (ref: users)",
  "address": {
    "street": "String",
    "city": "String",
    "zipCode": "String",
    "country": "String"
  },
  "phone": "String",
  "email": "String",
  "website": "String (optional)",
  "created_at": "DateTime",
  "memberCount": "Number",
  "status": "String (active | inactive | pending)"
}
```

### `club_join_requests`
Demandes d'adhésion à un club

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users)",
  "clubId": "ObjectId (ref: clubs)",
  "status": "String (pending | approved | rejected)",
  "message": "String",
  "created_at": "DateTime",
  "processed_at": "DateTime (optional)",
  "processed_by": "ObjectId (ref: users, optional)"
}
```

### `news`
Articles d'actualités publiés sur le site

```json
{
  "_id": "ObjectId",
  "title": "String",
  "content": "String (HTML ou Markdown)",
  "author": "ObjectId (ref: users)",
  "category": "String",
  "image": "String (URL)",
  "published": "Boolean",
  "publishDate": "DateTime",
  "created_at": "DateTime",
  "updated_at": "DateTime",
  "viewCount": "Number"
}
```

### `news_comments`
Commentaires sur les actualités

```json
{
  "_id": "ObjectId",
  "newsId": "ObjectId (ref: news)",
  "userId": "ObjectId (ref: users)",
  "content": "String",
  "created_at": "DateTime"
}
```

### `news_reactions`
Réactions (likes, etc.) aux actualités

```json
{
  "_id": "ObjectId",
  "newsId": "ObjectId (ref: news)",
  "userId": "ObjectId (ref: users)",
  "reaction": "String (like | love | support)",
  "created_at": "DateTime"
}
```

### `events`
Événements, stages, compétitions

```json
{
  "_id": "ObjectId",
  "title": "String",
  "description": "String",
  "startDate": "DateTime",
  "endDate": "DateTime",
  "location": {
    "name": "String",
    "address": "String",
    "city": "String",
    "country": "String"
  },
  "organizer": "ObjectId (ref: users)",
  "capacity": "Number",
  "price": "Number",
  "registrations": ["Array of ObjectId (ref: users)"],
  "status": "String (upcoming | ongoing | completed | cancelled)",
  "created_at": "DateTime"
}
```

### `conversations`
Messagerie interne entre utilisateurs

```json
{
  "_id": "ObjectId",
  "participants": ["Array of ObjectId (ref: users)"],
  "lastMessage": "String",
  "lastMessageAt": "DateTime",
  "unreadCount": {
    "userId1": "Number",
    "userId2": "Number"
  },
  "created_at": "DateTime"
}
```

### `messages`
Messages individuels dans les conversations

```json
{
  "_id": "ObjectId",
  "conversationId": "ObjectId (ref: conversations)",
  "senderId": "ObjectId (ref: users)",
  "content": "String",
  "read": "Boolean",
  "created_at": "DateTime"
}
```

### `wall_posts`
Publications sur le mur social de l'académie

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users)",
  "content": "String",
  "media": ["Array of String (URLs)"],
  "likes": ["Array of ObjectId (ref: users)"],
  "commentCount": "Number",
  "created_at": "DateTime",
  "updated_at": "DateTime"
}
```

### `products`
Produits de la boutique en ligne

```json
{
  "_id": "ObjectId",
  "name": "String",
  "description": "String",
  "price": "Number",
  "category": "String",
  "image": "String (URL)",
  "stock": "Number",
  "available": "Boolean",
  "created_at": "DateTime"
}
```

### `orders`
Commandes passées sur la boutique

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users)",
  "items": [{
    "productId": "ObjectId (ref: products)",
    "quantity": "Number",
    "price": "Number"
  }],
  "total": "Number",
  "status": "String (pending | paid | shipped | completed | cancelled)",
  "shippingAddress": "Object",
  "paymentMethod": "String",
  "stripeSessionId": "String (optional)",
  "created_at": "DateTime",
  "updated_at": "DateTime"
}
```

### `sponsors`
Sponsors et partenaires affichés sur le site

```json
{
  "_id": "ObjectId",
  "name": "String",
  "logo": "String (URL)",
  "website": "String",
  "description": "String",
  "tier": "String (platinum | gold | silver | bronze)",
  "active": "Boolean",
  "created_at": "DateTime"
}
```

### `tasks`
Tâches administratives et suivi

```json
{
  "_id": "ObjectId",
  "title": "String",
  "description": "String",
  "assignedTo": "ObjectId (ref: users)",
  "status": "String (todo | in_progress | done)",
  "priority": "String (low | medium | high | urgent)",
  "dueDate": "DateTime",
  "created_at": "DateTime",
  "completed_at": "DateTime (optional)"
}
```

### `tokens`
Système de tokens AJL (crédits utilisateurs)

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users)",
  "balance": "Number",
  "transactions": [{
    "amount": "Number",
    "type": "String (credit | debit)",
    "reason": "String",
    "date": "DateTime"
  }],
  "updated_at": "DateTime"
}
```

---

## 🔍 Indexes

### `users`
- `email` (unique)
- `role`
- `created_at`

### `members`
- `userId` (unique)
- `subscriptionStatus`
- `clubId`

### `clubs`
- `name` (unique)
- `managerId`
- `status`

### `news`
- `publishDate`
- `author`
- `published`

### `events`
- `startDate`
- `status`

### `conversations`
- `participants`
- `lastMessageAt`

### `orders`
- `userId`
- `status`
- `created_at`

---

## 🔄 Relations

```
users (1) ─────── (N) members
users (1) ─────── (N) clubs (via managerId)
users (N) ─────── (N) conversations (via participants)
users (1) ─────── (N) wall_posts
users (1) ─────── (N) orders
clubs (1) ─────── (N) members (via clubId)
news (1) ─────── (N) news_comments
news (1) ─────── (N) news_reactions
conversations (1) ─ (N) messages
```

---

## 📦 Migrations

Aucune migration prévue actuellement - schéma stable.

---

## 💾 Backup

- **Configuration Atlas** : Rétention 7 jours (backups automatiques)
- **Fréquence** : Snapshots quotidiens
- **Restauration** : Via Atlas UI ou mongorestore

---

## 🔐 Sécurité

- Tous les mots de passe utilisateurs sont hashés avec **bcrypt**
- Connexions MongoDB via **TLS/SSL**
- Accès à la base limitée par IP whitelist sur Atlas
- JWT tokens pour l'authentification API (expiration 24h)

---

**Dernière mise à jour :** 29 décembre 2025
