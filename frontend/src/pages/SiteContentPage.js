import React, { useState, useEffect } from 'react';
import { 
  Globe, Save, Loader2, Image, Type, Link, Mail, Phone, MapPin,
  Facebook, Instagram, Youtube, Plus, Trash2, Edit, ChevronDown, ChevronUp
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import api from '../utils/api';
import { toast } from 'sonner';

const SiteContentPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [content, setContent] = useState({
    hero: { title: '', subtitle: '', description: '', cta_text: '', cta_link: '' },
    about: { title: '', description: '', image_url: '' },
    features: [],
    contact: { email: '', phone: '', address: '' },
    social_links: { facebook: '', instagram: '', youtube: '' },
    footer: { copyright: '' }
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await api.get('/admin/site-content');
      setContent(response.data);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Erreur lors du chargement');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/admin/site-content', content);
      toast.success('Contenu du site mis à jour');
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
    setSaving(false);
  };

  const updateSection = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addFeature = () => {
    setContent(prev => ({
      ...prev,
      features: [...(prev.features || []), { title: '', description: '', icon: 'star' }]
    }));
  };

  const updateFeature = (index, field, value) => {
    setContent(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? { ...f, [field]: value } : f)
    }));
  };

  const removeFeature = (index) => {
    setContent(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const sections = [
    { id: 'hero', label: 'Section Héro', icon: Type },
    { id: 'about', label: 'À Propos', icon: Edit },
    { id: 'features', label: 'Fonctionnalités', icon: Plus },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'social', label: 'Réseaux Sociaux', icon: Facebook },
    { id: 'footer', label: 'Pied de Page', icon: Type }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-oswald text-3xl font-bold text-text-primary uppercase tracking-wide flex items-center gap-3">
                <Globe className="w-8 h-8 text-primary" />
                Gestion du Site Internet
              </h1>
              <p className="text-text-muted font-manrope mt-1">
                Modifiez le contenu de la page d'accueil
              </p>
            </div>
            <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary-dark">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Enregistrer tout
            </Button>
          </div>

          {/* Section Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'bg-primary text-white'
                    : 'bg-paper border border-white/10 text-text-secondary hover:border-primary/50'
                }`}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </div>

          {/* Hero Section */}
          {activeSection === 'hero' && (
            <div className="bg-paper rounded-xl border border-white/10 p-6">
              <h2 className="font-oswald text-xl text-text-primary uppercase mb-6">Section Héro (Bannière principale)</h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-text-secondary">Titre principal</Label>
                  <Input
                    value={content.hero?.title || ''}
                    onChange={(e) => updateSection('hero', 'title', e.target.value)}
                    className="mt-1 bg-background border-white/10 text-text-primary"
                    placeholder="ACADÉMIE JACQUES LEVINET"
                  />
                </div>
                <div>
                  <Label className="text-text-secondary">Sous-titre</Label>
                  <Input
                    value={content.hero?.subtitle || ''}
                    onChange={(e) => updateSection('hero', 'subtitle', e.target.value)}
                    className="mt-1 bg-background border-white/10 text-text-primary"
                    placeholder="Self-Pro Krav (SPK)"
                  />
                </div>
                <div>
                  <Label className="text-text-secondary">Description</Label>
                  <Textarea
                    value={content.hero?.description || ''}
                    onChange={(e) => updateSection('hero', 'description', e.target.value)}
                    className="mt-1 bg-background border-white/10 text-text-primary min-h-[100px]"
                    placeholder="Méthode de self-défense réaliste et efficace..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-text-secondary">Texte du bouton CTA</Label>
                    <Input
                      value={content.hero?.cta_text || ''}
                      onChange={(e) => updateSection('hero', 'cta_text', e.target.value)}
                      className="mt-1 bg-background border-white/10 text-text-primary"
                      placeholder="Rejoindre l'Académie"
                    />
                  </div>
                  <div>
                    <Label className="text-text-secondary">Lien du bouton</Label>
                    <Input
                      value={content.hero?.cta_link || ''}
                      onChange={(e) => updateSection('hero', 'cta_link', e.target.value)}
                      className="mt-1 bg-background border-white/10 text-text-primary"
                      placeholder="/onboarding"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* About Section */}
          {activeSection === 'about' && (
            <div className="bg-paper rounded-xl border border-white/10 p-6">
              <h2 className="font-oswald text-xl text-text-primary uppercase mb-6">Section À Propos</h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-text-secondary">Titre</Label>
                  <Input
                    value={content.about?.title || ''}
                    onChange={(e) => updateSection('about', 'title', e.target.value)}
                    className="mt-1 bg-background border-white/10 text-text-primary"
                  />
                </div>
                <div>
                  <Label className="text-text-secondary">Description</Label>
                  <Textarea
                    value={content.about?.description || ''}
                    onChange={(e) => updateSection('about', 'description', e.target.value)}
                    className="mt-1 bg-background border-white/10 text-text-primary min-h-[150px]"
                  />
                </div>
                <div>
                  <Label className="text-text-secondary">URL de l'image</Label>
                  <Input
                    value={content.about?.image_url || ''}
                    onChange={(e) => updateSection('about', 'image_url', e.target.value)}
                    className="mt-1 bg-background border-white/10 text-text-primary"
                    placeholder="https://..."
                  />
                  {content.about?.image_url && (
                    <img src={content.about.image_url} alt="Preview" className="mt-2 max-h-40 rounded-lg" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Features Section */}
          {activeSection === 'features' && (
            <div className="bg-paper rounded-xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-oswald text-xl text-text-primary uppercase">Fonctionnalités / Points forts</h2>
                <Button onClick={addFeature} variant="outline" className="border-white/10">
                  <Plus className="w-4 h-4 mr-2" /> Ajouter
                </Button>
              </div>
              <div className="space-y-4">
                {(content.features || []).map((feature, idx) => (
                  <div key={idx} className="bg-background/50 border border-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-text-muted text-sm">Fonctionnalité {idx + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(idx)}
                        className="text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-text-secondary text-sm">Titre</Label>
                        <Input
                          value={feature.title}
                          onChange={(e) => updateFeature(idx, 'title', e.target.value)}
                          className="mt-1 bg-background border-white/10 text-text-primary"
                        />
                      </div>
                      <div>
                        <Label className="text-text-secondary text-sm">Icône</Label>
                        <Input
                          value={feature.icon}
                          onChange={(e) => updateFeature(idx, 'icon', e.target.value)}
                          className="mt-1 bg-background border-white/10 text-text-primary"
                          placeholder="shield, globe, award..."
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <Label className="text-text-secondary text-sm">Description</Label>
                      <Textarea
                        value={feature.description}
                        onChange={(e) => updateFeature(idx, 'description', e.target.value)}
                        className="mt-1 bg-background border-white/10 text-text-primary"
                      />
                    </div>
                  </div>
                ))}
                {(!content.features || content.features.length === 0) && (
                  <p className="text-text-muted text-center py-8">Aucune fonctionnalité. Cliquez sur "Ajouter" pour en créer une.</p>
                )}
              </div>
            </div>
          )}

          {/* Contact Section */}
          {activeSection === 'contact' && (
            <div className="bg-paper rounded-xl border border-white/10 p-6">
              <h2 className="font-oswald text-xl text-text-primary uppercase mb-6">Informations de Contact</h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-text-secondary flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email
                  </Label>
                  <Input
                    value={content.contact?.email || ''}
                    onChange={(e) => updateSection('contact', 'email', e.target.value)}
                    className="mt-1 bg-background border-white/10 text-text-primary"
                    placeholder="contact@academie-levinet.com"
                  />
                </div>
                <div>
                  <Label className="text-text-secondary flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Téléphone
                  </Label>
                  <Input
                    value={content.contact?.phone || ''}
                    onChange={(e) => updateSection('contact', 'phone', e.target.value)}
                    className="mt-1 bg-background border-white/10 text-text-primary"
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
                <div>
                  <Label className="text-text-secondary flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Adresse
                  </Label>
                  <Textarea
                    value={content.contact?.address || ''}
                    onChange={(e) => updateSection('contact', 'address', e.target.value)}
                    className="mt-1 bg-background border-white/10 text-text-primary"
                    placeholder="123 Rue de la Self-Défense, 75000 Paris"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Social Links */}
          {activeSection === 'social' && (
            <div className="bg-paper rounded-xl border border-white/10 p-6">
              <h2 className="font-oswald text-xl text-text-primary uppercase mb-6">Réseaux Sociaux</h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-text-secondary flex items-center gap-2">
                    <Facebook className="w-4 h-4" /> Facebook
                  </Label>
                  <Input
                    value={content.social_links?.facebook || ''}
                    onChange={(e) => updateSection('social_links', 'facebook', e.target.value)}
                    className="mt-1 bg-background border-white/10 text-text-primary"
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div>
                  <Label className="text-text-secondary flex items-center gap-2">
                    <Instagram className="w-4 h-4" /> Instagram
                  </Label>
                  <Input
                    value={content.social_links?.instagram || ''}
                    onChange={(e) => updateSection('social_links', 'instagram', e.target.value)}
                    className="mt-1 bg-background border-white/10 text-text-primary"
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div>
                  <Label className="text-text-secondary flex items-center gap-2">
                    <Youtube className="w-4 h-4" /> YouTube
                  </Label>
                  <Input
                    value={content.social_links?.youtube || ''}
                    onChange={(e) => updateSection('social_links', 'youtube', e.target.value)}
                    className="mt-1 bg-background border-white/10 text-text-primary"
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          {activeSection === 'footer' && (
            <div className="bg-paper rounded-xl border border-white/10 p-6">
              <h2 className="font-oswald text-xl text-text-primary uppercase mb-6">Pied de Page</h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-text-secondary">Texte de copyright</Label>
                  <Input
                    value={content.footer?.copyright || ''}
                    onChange={(e) => updateSection('footer', 'copyright', e.target.value)}
                    className="mt-1 bg-background border-white/10 text-text-primary"
                    placeholder="© 2025 Académie Jacques Levinet. Tous droits réservés."
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SiteContentPage;
