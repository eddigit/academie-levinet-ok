import React, { useState, useEffect } from 'react';
import { 
  Building2, Plus, Search, MapPin, User, Phone, Mail, 
  Edit, Trash2, Loader2, X, UserCog
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import api from '../utils/api';
import { toast } from 'sonner';
import { countries, getFlag, disciplines as disciplinesList } from '../utils/countries';

const ClubsPage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [directors, setDirectors] = useState([]);
  const [instructorsList, setInstructorsList] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', address: '', city: '', country: 'France', country_code: 'FR',
    phone: '', email: '', logo_url: '', technical_director_ids: [],
    instructor_ids: [], disciplines: [], schedule: ''
  });

  useEffect(() => {
    fetchClubs();
    fetchDirectors();
    fetchInstructors();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await api.get('/clubs');
      const data = response.data?.clubs || response.data || response;
      setClubs(Array.isArray(data) ? data : []);
    } catch (error) {
      setClubs([]);
    }
    setLoading(false);
  };

  const fetchDirectors = async () => {
    try {
      const response = await api.get('/technical-directors-list');
      const data = response.data?.directors || response.data || [];
      setDirectors(Array.isArray(data) ? data : []);
    } catch (error) {
      setDirectors([]);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await api.get('/instructors-list');
      const data = response.data?.instructors || response.data || [];
      setInstructorsList(Array.isArray(data) ? data : []);
    } catch (error) {
      setInstructorsList([]);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', address: '', city: '', country: 'France', country_code: 'FR',
      phone: '', email: '', logo_url: '', technical_director_ids: [],
      instructor_ids: [], disciplines: [], schedule: ''
    });
    setEditingClub(null);
  };

  const openAddModal = () => { resetForm(); setIsModalOpen(true); };
  
  const openEditModal = (club) => {
    setEditingClub(club);
    setFormData({
      name: club.name || '',
      address: club.address || '',
      city: club.city || '',
      country: club.country || 'France',
      country_code: club.country_code || 'FR',
      phone: club.phone || '',
      email: club.email || '',
      logo_url: club.logo_url || '',
      technical_director_ids: club.technical_director_ids || (club.technical_director_id ? [club.technical_director_id] : []),
      instructor_ids: club.instructor_ids || [],
      disciplines: club.disciplines || [],
      schedule: club.schedule || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); resetForm(); };

  const handleCountryChange = (code) => {
    const country = countries.find(c => c.code === code);
    setFormData(prev => ({ ...prev, country_code: code, country: country?.name || 'France' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.city) {
      toast.error('Nom et ville sont obligatoires');
      return;
    }
    setSaving(true);
    try {
      if (editingClub) {
        await api.put(`/admin/clubs/${editingClub.id}`, formData);
        toast.success('Club mis à jour');
      } else {
        await api.post('/admin/clubs', formData);
        toast.success('Club créé');
      }
      closeModal();
      fetchClubs();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur');
    }
    setSaving(false);
  };

  const handleDelete = async (club) => {
    if (!window.confirm(`Supprimer le club "${club.name}" ?`)) return;
    try {
      await api.delete(`/admin/clubs/${club.id}`);
      toast.success('Club supprimé');
      fetchClubs();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const getDirectorName = (id) => {
    const d = directors.find(dir => dir.id === id);
    return d?.name || d?.full_name || 'Inconnu';
  };

  const getInstructorName = (id) => {
    const i = instructorsList.find(inst => inst.id === id);
    return i?.name || i?.full_name || 'Inconnu';
  };

  const filteredClubs = clubs.filter(club => {
    const matchesSearch = club.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          club.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = countryFilter === 'all' || club.country_code === countryFilter;
    return matchesSearch && matchesCountry;
  });

  const uniqueCountries = [...new Set(clubs.map(c => c.country_code).filter(Boolean))];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-oswald text-2xl sm:text-3xl font-bold text-text-primary uppercase tracking-wide">Clubs</h1>
            <p className="text-text-secondary font-manrope mt-1 text-sm">{clubs.length} club(s)</p>
          </div>
          <Button onClick={openAddModal} className="bg-primary hover:bg-primary-dark">
            <Plus className="w-4 h-4 mr-2" />Nouveau Club
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <Input placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-paper border-white/10" />
          </div>
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-paper border-white/10"><SelectValue placeholder="Tous les pays" /></SelectTrigger>
            <SelectContent className="bg-paper border-white/10">
              <SelectItem value="all">Tous les pays</SelectItem>
              {uniqueCountries.map(code => (
                <SelectItem key={code} value={code}>{getFlag(code)} {countries.find(c => c.code === code)?.name || code}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClubs.map((club) => (
            <div key={club.id} className="bg-paper rounded-lg border border-white/10 overflow-hidden hover:border-primary/50 transition-colors">
              <div className="p-4 border-b border-white/5">
                <div className="flex items-start gap-3">
                  {club.logo_url ? (
                    <img src={club.logo_url} alt={club.name} className="w-14 h-14 rounded-lg object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Building2 className="w-7 h-7 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-oswald text-lg text-white uppercase truncate">{club.name}</h3>
                      <span className="text-xl">{getFlag(club.country_code)}</span>
                    </div>
                    <p className="text-text-muted text-sm flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />{club.city}, {club.country}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {club.phone && <p className="text-xs text-text-secondary flex items-center gap-2"><Phone className="w-3 h-3" />{club.phone}</p>}
                {club.email && <p className="text-xs text-text-secondary flex items-center gap-2 truncate"><Mail className="w-3 h-3" />{club.email}</p>}
                {(club.technical_director_ids?.length > 0 || club.technical_director_id) && (
                  <div className="pt-2 border-t border-white/5">
                    <p className="text-xs text-text-muted mb-1 flex items-center gap-1"><UserCog className="w-3 h-3" />DT:</p>
                    <div className="flex flex-wrap gap-1">
                      {(club.technical_director_ids || [club.technical_director_id]).filter(Boolean).map(id => (
                        <span key={id} className="px-2 py-0.5 bg-accent/20 text-accent rounded text-xs">{getDirectorName(id)}</span>
                      ))}
                    </div>
                  </div>
                )}
                {club.instructor_ids?.length > 0 && (
                  <div>
                    <p className="text-xs text-text-muted mb-1 flex items-center gap-1"><User className="w-3 h-3" />Instructeurs:</p>
                    <div className="flex flex-wrap gap-1">
                      {club.instructor_ids.slice(0, 3).map(id => (
                        <span key={id} className="px-2 py-0.5 bg-primary/20 text-primary rounded text-xs">{getInstructorName(id)}</span>
                      ))}
                      {club.instructor_ids.length > 3 && <span className="px-2 py-0.5 bg-white/10 text-text-muted rounded text-xs">+{club.instructor_ids.length - 3}</span>}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2 p-4 pt-0">
                <Button variant="outline" size="sm" onClick={() => openEditModal(club)} className="flex-1 border-white/10">
                  <Edit className="w-4 h-4 mr-1" />Modifier
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(club)} className="border-secondary/50 text-secondary hover:bg-secondary/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredClubs.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-muted">Aucun club trouvé</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-paper rounded-xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="font-oswald text-xl text-text-primary uppercase">{editingClub ? 'Modifier le Club' : 'Nouveau Club'}</h2>
              <button onClick={closeModal} className="text-text-muted hover:text-text-primary"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div>
                <Label className="text-text-secondary">Nom du club *</Label>
                <Input value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} required className="mt-1 bg-background border-white/10" />
              </div>
              <div>
                <Label className="text-text-secondary">Adresse</Label>
                <Input value={formData.address} onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))} className="mt-1 bg-background border-white/10" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-text-secondary">Ville *</Label>
                  <Input value={formData.city} onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))} required className="mt-1 bg-background border-white/10" />
                </div>
                <div>
                  <Label className="text-text-secondary">Pays</Label>
                  <Select value={formData.country_code} onValueChange={handleCountryChange}>
                    <SelectTrigger className="mt-1 bg-background border-white/10"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-paper border-white/10 max-h-60">
                      {countries.map(c => (<SelectItem key={c.code} value={c.code}>{c.flag} {c.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-text-secondary">Téléphone</Label>
                  <Input value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="mt-1 bg-background border-white/10" />
                </div>
                <div>
                  <Label className="text-text-secondary">Email</Label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} className="mt-1 bg-background border-white/10" />
                </div>
              </div>
              <div>
                <Label className="text-text-secondary">Directeurs Techniques</Label>
                <div className="mt-2 grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 bg-background rounded-lg border border-white/10">
                  {directors.length === 0 ? <p className="text-text-muted text-sm col-span-2">Aucun DT disponible</p> : directors.map(d => (
                    <label key={d.id} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={formData.technical_director_ids.includes(d.id)} onChange={(e) => {
                        if (e.target.checked) setFormData(prev => ({ ...prev, technical_director_ids: [...prev.technical_director_ids, d.id] }));
                        else setFormData(prev => ({ ...prev, technical_director_ids: prev.technical_director_ids.filter(id => id !== d.id) }));
                      }} className="rounded border-white/20" />
                      <span className="text-text-secondary">{d.name || d.full_name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-text-secondary">Instructeurs</Label>
                <div className="mt-2 grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 bg-background rounded-lg border border-white/10">
                  {instructorsList.length === 0 ? <p className="text-text-muted text-sm col-span-2">Aucun instructeur disponible</p> : instructorsList.map(i => (
                    <label key={i.id} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={formData.instructor_ids.includes(i.id)} onChange={(e) => {
                        if (e.target.checked) setFormData(prev => ({ ...prev, instructor_ids: [...prev.instructor_ids, i.id] }));
                        else setFormData(prev => ({ ...prev, instructor_ids: prev.instructor_ids.filter(id => id !== i.id) }));
                      }} className="rounded border-white/20" />
                      <span className="text-text-secondary">{i.name || i.full_name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-text-secondary">Disciplines</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {disciplinesList.map(d => (
                    <label key={d} className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-lg border border-white/10 cursor-pointer hover:border-primary/50">
                      <input type="checkbox" checked={formData.disciplines.includes(d)} onChange={(e) => {
                        if (e.target.checked) setFormData(prev => ({ ...prev, disciplines: [...prev.disciplines, d] }));
                        else setFormData(prev => ({ ...prev, disciplines: prev.disciplines.filter(disc => disc !== d) }));
                      }} className="rounded border-white/20" />
                      <span className="text-text-secondary text-sm">{d}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-text-secondary">Horaires</Label>
                <Textarea value={formData.schedule} onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))} className="mt-1 bg-background border-white/10" rows={3} />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={closeModal} className="flex-1 border-white/10">Annuler</Button>
                <Button type="submit" disabled={saving} className="flex-1 bg-primary hover:bg-primary-dark">
                  {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}{editingClub ? 'Mettre à jour' : 'Créer'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ClubsPage;
