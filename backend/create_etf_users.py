#!/usr/bin/env python3
"""
Script pour créer les comptes des membres testeurs ETF
avec des mots de passe temporaires simples.

Usage:
    cd backend
    python create_etf_users.py

Les utilisateurs pourront se connecter directement avec ces identifiants.
"""

import asyncio
import os
import sys
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import bcrypt
from datetime import datetime, timezone
import uuid

# Charger les variables d'environnement
load_dotenv()

mongo_url = os.environ.get('MONGO_URL')
db_name = os.environ.get('DB_NAME', 'academie_levinet_db')

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# =============================================================================
# LISTE DES TESTEURS ETF
# Mot de passe unique pour tous : TestAjl2026!
# =============================================================================
ETF_TESTERS = [
    {
        "email": "ajl.hautegaronne@gmail.com",
        "full_name": "AJL Haute-Garonne",
        "role": "directeur_technique",
        "password": "TestAjl2026!",
    },
    {
        "email": "pierregat@wanadoo.fr",
        "full_name": "Pierre GATEAU",
        "role": "directeur_technique",
        "password": "TestAjl2026!",
    },
    {
        "email": "vincou@wanadoo.fr",
        "full_name": "Vincent",
        "role": "directeur_technique",
        "password": "TestAjl2026!",
    },
    {
        "email": "contacte.ajl13@gmail.com",
        "full_name": "AJL 13",
        "role": "directeur_technique",
        "password": "TestAjl2026!",
    },
    {
        "email": "wkmo.ajl.gascogne@gmail.com",
        "full_name": "WKMO AJL Gascogne",
        "role": "directeur_technique",
        "password": "TestAjl2026!",
    },
    {
        "email": "kms4v@free.fr",
        "full_name": "KMS4V",
        "role": "directeur_technique",
        "password": "TestAjl2026!",
    },
    {
        "email": "thierry@lecerf.pro",
        "full_name": "Thierry LECERF",
        "role": "directeur_technique",
        "password": "TestAjl2026!",
    },
]

async def create_users():
    """Créer les comptes utilisateurs testeurs"""
    print("🔌 Connexion à MongoDB...")
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print(f"📦 Base de données: {db_name}")
    print("=" * 60)
    print("CRÉATION DES COMPTES TESTEURS ETF")
    print("=" * 60)
    
    created_users = []
    skipped_users = []
    
    for member in ETF_TESTERS:
        email = member["email"].lower().strip()
        
        # Vérifier si l'utilisateur existe déjà
        existing = await db.users.find_one({"email": email})
        if existing:
            print(f"⏭️  EXISTE DÉJÀ: {email}")
            skipped_users.append(member)
            continue
        
        # Créer l'utilisateur
        user_id = str(uuid.uuid4())
        password = member.get("password", "TestAjl2026!")
        
        user_doc = {
            "id": user_id,
            "email": email,
            "password_hash": hash_password(password),
            "full_name": member["full_name"],
            "role": member["role"],
            "phone": "",
            "city": "",
            "country": "France",
            "country_code": "FR",
            "belt_grade": "Directeur Technique",
            "dan_grade": "",
            "club_name": "",
            "club_ids": [],
            "photo_url": "",
            "user_type": member["role"],
            "has_paid_license": True,
            "is_active": True,
            "email_verified": True,  # Pas besoin de vérifier l'email
            "is_tester": True,  # Flag pour identifier les testeurs
            "onboarding_completed": True,  # Pas de boarding requis
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
        
        await db.users.insert_one(user_doc)
        print(f"✅ CRÉÉ: {member['full_name']} ({email})")
        created_users.append({**member, "password": password})
    
    print("=" * 60)
    print(f"\n📊 RÉSUMÉ:")
    print(f"   ✅ Créés: {len(created_users)}")
    print(f"   ⏭️  Ignorés (existants): {len(skipped_users)}")
    
    if created_users:
        print("\n" + "=" * 60)
        print("📧 IDENTIFIANTS À COMMUNIQUER :")
        print("=" * 60)
        print(f"\n🌐 Site : https://academielevinet.com/login")
        print(f"🔑 Mot de passe commun : TestAjl2026!\n")
        print("Liste des emails créés :")
        for user in created_users:
            print(f"   • {user['email']} ({user['full_name']})")
    
    client.close()
    print("\n✅ Terminé!")

if __name__ == "__main__":
    asyncio.run(create_users())
