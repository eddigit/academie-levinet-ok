#!/usr/bin/env python3
"""
Script pour mettre à jour les mots de passe des testeurs existants
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import bcrypt

load_dotenv()

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

async def update_passwords():
    client = AsyncIOMotorClient(os.environ['MONGO_URL'])
    db = client['academie_levinet_db']
    
    emails = [
        'ajl.hautegaronne@gmail.com',
        'vincou@wanadoo.fr', 
        'contacte.ajl13@gmail.com',
        'wkmo.ajl.gascogne@gmail.com',
        'kms4v@free.fr'
    ]
    
    new_hash = hash_password('TestAjl2026!')
    
    print("Mise à jour des mots de passe...")
    for email in emails:
        result = await db.users.update_one(
            {'email': email.lower()},
            {'$set': {
                'password_hash': new_hash,
                'is_tester': True,
                'email_verified': True,
                'onboarding_completed': True
            }}
        )
        if result.modified_count > 0:
            print(f'✅ Mot de passe mis à jour: {email}')
        else:
            print(f'⚠️ Non modifié (déjà OK ou inexistant): {email}')
    
    client.close()
    print('\n✅ Terminé!')

if __name__ == "__main__":
    asyncio.run(update_passwords())
