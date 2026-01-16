#!/usr/bin/env python3
"""
Script de migration des images base64 vers Cloudinary
=====================================================
Ce script:
1. Lit toutes les images base64 dans le document site_content
2. Les uploade vers Cloudinary
3. Remplace les data URLs par les URLs Cloudinary
4. Sauvegarde le document mis à jour

Usage:
    python migrate_images_to_cloudinary.py

Prérequis:
    - Variables d'environnement Cloudinary configurées
    - pip install cloudinary pymongo python-dotenv
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from pymongo import MongoClient
import cloudinary
import cloudinary.uploader
import json
from datetime import datetime

# Charger les variables d'environnement
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configuration MongoDB
MONGO_URL = os.environ.get('MONGO_URL')
DB_NAME = os.environ.get('DB_NAME', 'academie_levinet_db')

# Configuration Cloudinary
CLOUDINARY_CLOUD_NAME = os.environ.get('CLOUDINARY_CLOUD_NAME')
CLOUDINARY_API_KEY = os.environ.get('CLOUDINARY_API_KEY')
CLOUDINARY_API_SECRET = os.environ.get('CLOUDINARY_API_SECRET')


def check_config():
    """Vérifie que la configuration est correcte"""
    errors = []
    
    if not MONGO_URL:
        errors.append("MONGO_URL non configuré")
    if not CLOUDINARY_CLOUD_NAME:
        errors.append("CLOUDINARY_CLOUD_NAME non configuré")
    if not CLOUDINARY_API_KEY:
        errors.append("CLOUDINARY_API_KEY non configuré")
    if not CLOUDINARY_API_SECRET:
        errors.append("CLOUDINARY_API_SECRET non configuré")
    
    if errors:
        print("❌ Erreurs de configuration:")
        for error in errors:
            print(f"   - {error}")
        print("\n📝 Ajoutez ces variables dans backend/.env")
        return False
    
    return True


def configure_cloudinary():
    """Configure Cloudinary"""
    cloudinary.config(
        cloud_name=CLOUDINARY_CLOUD_NAME,
        api_key=CLOUDINARY_API_KEY,
        api_secret=CLOUDINARY_API_SECRET,
        secure=True
    )
    print(f"☁️ Cloudinary configuré: {CLOUDINARY_CLOUD_NAME}")


def connect_mongodb():
    """Connexion à MongoDB"""
    client = MongoClient(MONGO_URL)
    db = client[DB_NAME]
    print(f"📦 Connecté à MongoDB: {DB_NAME}")
    return db


def find_base64_images(obj, path=""):
    """Trouve toutes les images base64 dans un objet imbriqué"""
    images = []
    
    if isinstance(obj, dict):
        for key, value in obj.items():
            current_path = f"{path}.{key}" if path else key
            
            if isinstance(value, str) and value.startswith('data:image/'):
                images.append({
                    'path': current_path,
                    'data': value,
                    'size': len(value)
                })
            elif isinstance(value, (dict, list)):
                images.extend(find_base64_images(value, current_path))
    
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            current_path = f"{path}[{i}]"
            images.extend(find_base64_images(item, current_path))
    
    return images


def set_nested_value(obj, path, value):
    """Définit une valeur dans un objet imbriqué via un chemin"""
    parts = []
    current = ""
    i = 0
    
    while i < len(path):
        if path[i] == '.':
            if current:
                parts.append(current)
            current = ""
        elif path[i] == '[':
            if current:
                parts.append(current)
            current = ""
            # Trouver l'index
            j = i + 1
            while j < len(path) and path[j] != ']':
                current += path[j]
                j += 1
            parts.append(int(current))
            current = ""
            i = j
        else:
            current += path[i]
        i += 1
    
    if current:
        parts.append(current)
    
    # Naviguer jusqu'à l'avant-dernier élément
    current_obj = obj
    for part in parts[:-1]:
        current_obj = current_obj[part]
    
    # Définir la valeur
    current_obj[parts[-1]] = value


def upload_to_cloudinary(image_data, path):
    """Upload une image vers Cloudinary"""
    try:
        # Créer un public_id basé sur le chemin
        public_id = f"academie-levinet/site-content/{path.replace('.', '/').replace('[', '-').replace(']', '')}"
        
        result = cloudinary.uploader.upload(
            image_data,
            public_id=public_id,
            folder="academie-levinet/site-content",
            resource_type="image",
            overwrite=True,
            transformation=[
                {"quality": "auto:good", "fetch_format": "auto"}
            ]
        )
        
        return result.get('secure_url')
    
    except Exception as e:
        print(f"   ❌ Erreur upload: {e}")
        return None


def migrate_images():
    """Migration principale"""
    print("=" * 60)
    print("🚀 Migration des images base64 vers Cloudinary")
    print("=" * 60)
    
    # Vérifier la configuration
    if not check_config():
        sys.exit(1)
    
    # Configurer Cloudinary
    configure_cloudinary()
    
    # Connexion MongoDB
    db = connect_mongodb()
    
    # Récupérer le document site_content (dans la collection 'settings')
    print("\n📄 Lecture du document site_content...")
    site_content = db.settings.find_one({"id": "site_content"})
    
    if not site_content:
        print("❌ Document site_content non trouvé dans db.settings")
        return
    
    # Taille actuelle
    doc_size = len(json.dumps(site_content, default=str))
    print(f"📏 Taille actuelle: {doc_size / (1024 * 1024):.2f} Mo")
    
    # Sauvegarder une copie de backup
    backup_name = f"site_content_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    backup_doc = site_content.copy()
    backup_doc.pop('_id', None)  # Supprimer _id pour éviter les conflits
    db[backup_name].insert_one(backup_doc)
    print(f"💾 Backup créé: {backup_name}")
    
    # Trouver toutes les images base64
    print("\n🔍 Recherche des images base64...")
    images = find_base64_images(site_content)
    
    if not images:
        print("✅ Aucune image base64 trouvée")
        return
    
    print(f"📸 {len(images)} images trouvées:")
    total_size = sum(img['size'] for img in images)
    print(f"   Taille totale: {total_size / (1024 * 1024):.2f} Mo")
    
    # Trier par taille décroissante
    images.sort(key=lambda x: x['size'], reverse=True)
    
    # Afficher les plus grosses
    print("\n📊 Top 10 des plus grosses images:")
    for img in images[:10]:
        print(f"   {img['path']}: {img['size'] / 1024:.1f} Ko")
    
    # Demander confirmation
    print("\n" + "=" * 60)
    response = input("🔄 Voulez-vous migrer ces images vers Cloudinary? (oui/non): ")
    if response.lower() not in ['oui', 'o', 'yes', 'y']:
        print("❌ Migration annulée")
        return
    
    # Migrer les images
    print("\n🔄 Migration en cours...")
    success_count = 0
    error_count = 0
    
    for i, img in enumerate(images, 1):
        print(f"\n[{i}/{len(images)}] {img['path']} ({img['size'] / 1024:.1f} Ko)")
        
        cloudinary_url = upload_to_cloudinary(img['data'], img['path'])
        
        if cloudinary_url:
            print(f"   ✅ Uploadé: {cloudinary_url[:60]}...")
            set_nested_value(site_content, img['path'], cloudinary_url)
            success_count += 1
        else:
            error_count += 1
    
    # Sauvegarder le document mis à jour
    if success_count > 0:
        print("\n💾 Sauvegarde du document...")
        
        # Supprimer _id pour l'update
        doc_id = site_content.pop('_id', None)
        
        result = db.settings.replace_one(
            {"id": "site_content"},
            site_content,
            upsert=True
        )
        
        # Nouvelle taille
        new_size = len(json.dumps(site_content, default=str))
        saved_space = doc_size - new_size
        
        print(f"\n✅ Migration terminée!")
        print(f"   - Images migrées: {success_count}")
        print(f"   - Erreurs: {error_count}")
        print(f"   - Ancienne taille: {doc_size / (1024 * 1024):.2f} Mo")
        print(f"   - Nouvelle taille: {new_size / (1024 * 1024):.2f} Mo")
        print(f"   - Espace libéré: {saved_space / (1024 * 1024):.2f} Mo")
    else:
        print("\n⚠️ Aucune image n'a été migrée")


if __name__ == "__main__":
    migrate_images()
