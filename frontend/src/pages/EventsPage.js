import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import axios from 'axios';
import { Plus, Edit, Trash2, Users, Calendar, MapPin, Clock, Euro } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${API_URL}/api`;

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'Stage',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    location: '',
    city: '',
    country: '',
    instructor: '',
    max_participants: '',
    price: '',
    image_url: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API}/events`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Erreur lors du chargement des événements');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const data = {
        ...formData,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
        price: parseFloat(formData.price) || 0
      };
      await axios.post(`${API}/events`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Événement créé avec succès');
      setIsAddModalOpen(false);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Erreur lors de la création');
    }
  };

  const handleEditEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const data = {
        ...formData,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
        price: parseFloat(formData.price) || 0
      };
      await axios.put(`${API}/events/${currentEvent.id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Événement mis à jour');
      setIsEditModalOpen(false);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API}/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Événement supprimé');
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const openEditModal = (event) => {
    setCurrentEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      event_type: event.event_type,
      start_date: event.start_date,
      end_date: event.end_date,
      start_time: event.start_time,
      end_time: event.end_time,
      location: event.location,
      city: event.city,
      country: event.country,
      instructor: event.instructor || '',
      max_participants: event.max_participants || '',
      price: event.price || '',
      image_url: event.image_url || ''
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      event_type: 'Stage',
      start_date: '',
      end_date: '',
      start_time: '',
      end_time: '',
      location: '',
      city: '',
      country: '',
      instructor: '',
      max_participants: '',
      price: '',
      image_url: ''
    });
    setCurrentEvent(null);
  };

  const getEventTypeColor = (type) => {
    const colors = {
      'Stage': 'bg-primary/20 text-primary',
      'Cours': 'bg-accent/20 text-accent',
      'Compétition': 'bg-secondary/20 text-secondary',
      'Examen de Grade': 'bg-purple-500/20 text-purple-500',
      'Séminaire': 'bg-green-500/20 text-green-500',
      'Workshop': 'bg-yellow-500/20 text-yellow-500'
    };
    return colors[type] || 'bg-text-muted/20 text-text-muted';
  };

  const stats = {
    total: events.length,
    upcoming: events.filter(e => e.status === 'À venir').length,
    ongoing: events.filter(e => e.status === 'En cours').length,
    totalParticipants: events.reduce((sum, e) => sum + e.current_participants, 0)
  };

  const EventForm = ({ onSubmit, isEdit }) => (
    <form onSubmit={onSubmit} className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto pr-2">
      <div>
        <Label className="text-text-secondary">Titre *</Label>
        <Input
          data-testid="input-event-title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="bg-background border-border text-text-primary"
        />
      </div>

      <div>
        <Label className="text-text-secondary">Description *</Label>
        <textarea
          data-testid="input-event-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={3}
          className="w-full px-4 py-3 bg-background border border-border rounded-md text-text-primary font-manrope"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-text-secondary">Type d'événement</Label>
          <Select
            value={formData.event_type}
            onValueChange={(value) => setFormData({ ...formData, event_type: value })}
          >
            <SelectTrigger className="bg-background border-border text-text-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-paper border-border">
              <SelectItem value="Stage" className="text-text-primary">Stage</SelectItem>
              <SelectItem value="Cours" className="text-text-primary">Cours</SelectItem>
              <SelectItem value="Compétition" className="text-text-primary">Compétition</SelectItem>
              <SelectItem value="Examen de Grade" className="text-text-primary">Examen de Grade</SelectItem>
              <SelectItem value="Séminaire" className="text-text-primary">Séminaire</SelectItem>
              <SelectItem value="Workshop" className="text-text-primary">Workshop</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-text-secondary">Instructeur</Label>
          <Input
            value={formData.instructor}
            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
            className="bg-background border-border text-text-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-text-secondary">Date début *</Label>
          <Input
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            required
            className="bg-background border-border text-text-primary"
          />
        </div>
        <div>
          <Label className="text-text-secondary">Date fin *</Label>
          <Input
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            required
            className="bg-background border-border text-text-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-text-secondary">Heure début</Label>
          <Input
            type="time"
            value={formData.start_time}
            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
            required
            className="bg-background border-border text-text-primary"
          />
        </div>
        <div>
          <Label className="text-text-secondary">Heure fin</Label>
          <Input
            type="time"
            value={formData.end_time}
            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
            required
            className="bg-background border-border text-text-primary"
          />
        </div>
      </div>

      <div>
        <Label className="text-text-secondary">Lieu *</Label>
        <Input
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
          className="bg-background border-border text-text-primary"
          placeholder="Nom de la salle ou adresse"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-text-secondary">Ville *</Label>
          <Input
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
            className="bg-background border-border text-text-primary"
          />
        </div>
        <div>
          <Label className="text-text-secondary">Pays *</Label>
          <Input
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            required
            className="bg-background border-border text-text-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-text-secondary">Participants max</Label>
          <Input
            type="number"
            value={formData.max_participants}
            onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
            className="bg-background border-border text-text-primary"
            placeholder="Illimité si vide"
          />
        </div>
        <div>
          <Label className="text-text-secondary">Prix (€)</Label>
          <Input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="bg-background border-border text-text-primary"
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <Label className="text-text-secondary">URL de l'image</Label>
        <Input
          type="url"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          className="bg-background border-border text-text-primary"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary-dark text-white font-oswald uppercase"
      >
        {isEdit ? 'Mettre à jour' : 'Créer l\'événement'}
      </Button>
    </form>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8" data-testid="events-page">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-oswald text-4xl font-bold text-text-primary uppercase tracking-wide">
              Calendrier des Événements
            </h1>
            <p className="text-text-secondary font-manrope mt-2">{events.length} événements</p>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button data-testid="add-event-button" className="bg-primary hover:bg-primary-dark text-white font-oswald uppercase">
                <Plus className="w-4 h-4 mr-2" /> Nouvel Événement
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-paper border-border max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-oswald text-2xl text-text-primary uppercase">Nouvel Événement</DialogTitle>
              </DialogHeader>
              <EventForm onSubmit={handleAddEvent} isEdit={false} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stat-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm text-text-secondary font-manrope">Total</p>
                <p className="text-2xl font-oswald font-bold text-text-primary">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm text-text-secondary font-manrope">À venir</p>
                <p className="text-2xl font-oswald font-bold text-text-primary">{stats.upcoming}</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-accent" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm text-text-secondary font-manrope">En cours</p>
                <p className="text-2xl font-oswald font-bold text-text-primary">{stats.ongoing}</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-secondary" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm text-text-secondary font-manrope">Participants</p>
                <p className="text-2xl font-oswald font-bold text-text-primary">{stats.totalParticipants}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-text-secondary font-manrope">Chargement...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-secondary font-manrope">Aucun événement</p>
            </div>
          ) : (
            events.map((event, index) => (
              <div key={event.id} className="stat-card hover:scale-[1.02] transition-transform duration-300" data-testid={`event-card-${index}`}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Image */}
                  {event.image_url && (
                    <div className="lg:col-span-3">
                      <img 
                        src={event.image_url} 
                        alt={event.title}
                        className="w-full h-32 lg:h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className={event.image_url ? 'lg:col-span-7' : 'lg:col-span-10'}>
                    <div className="flex gap-2 mb-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-manrope font-medium ${getEventTypeColor(event.event_type)}`}>
                        {event.event_type}
                      </span>
                      {event.price > 0 && (
                        <span className="inline-block px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-manrope font-medium">
                          {event.price}€
                        </span>
                      )}
                    </div>
                    <h3 className="font-oswald text-2xl font-bold text-text-primary uppercase mb-2">
                      {event.title}
                    </h3>
                    <p className="text-text-secondary font-manrope text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-text-muted font-manrope">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" strokeWidth={1.5} />
                        <span>{event.start_date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" strokeWidth={1.5} />
                        <span>{event.start_time} - {event.end_time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" strokeWidth={1.5} />
                        <span>{event.city}, {event.country}</span>
                      </div>
                    </div>
                    {event.instructor && (
                      <div className="mt-3 text-xs text-text-muted font-manrope">
                        Instructeur: <span className="text-text-primary font-medium">{event.instructor}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-2 flex lg:flex-col gap-2 justify-end">
                    <div className="text-center mb-2">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Users className="w-5 h-5 text-primary" strokeWidth={1.5} />
                        <span className="text-xl font-oswald font-bold text-text-primary">
                          {event.current_participants}
                          {event.max_participants && `/${event.max_participants}`}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted font-manrope">Inscrits</p>
                    </div>
                    <Button
                      onClick={() => openEditModal(event)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-border text-text-secondary hover:text-text-primary"
                    >
                      <Edit className="w-4 h-4 mr-2" strokeWidth={1.5} /> Modifier
                    </Button>
                    <Button
                      onClick={() => handleDelete(event.id)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-secondary/50 text-secondary hover:bg-secondary/10"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="bg-paper border-border max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-oswald text-2xl text-text-primary uppercase">Modifier l'Événement</DialogTitle>
            </DialogHeader>
            <EventForm onSubmit={handleEditEvent} isEdit={true} />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default EventsPage;
