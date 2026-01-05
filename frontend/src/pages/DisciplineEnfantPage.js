import React from 'react';
import PublicLayout from '../components/PublicLayout';
import { Link } from 'react-router-dom';
import { Shield, Heart, Users, Star, CheckCircle, ChevronRight, Loader2 } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

const DisciplineEnfantPage = () => {
  const { content, loading } = useSiteContent();

  // Valeurs dynamiques avec fallbacks
  const discTitle = content?.disciplines?.enfant?.title || 'Self-Défense Enfant';
  const discSubtitle = content?.disciplines?.enfant?.subtitle || 'Grandir en Confiance';
  const discDescription = content?.disciplines?.enfant?.description || "Programme spécialement conçu pour les enfants : développer la confiance en soi, apprendre à se protéger et s'épanouir dans un cadre bienveillant.";
  const discImage = content?.disciplines?.enfant?.image || '';

  const benefits = [
    { icon: Shield, title: 'Sécurité', description: 'Apprendre à reconnaître les dangers et à réagir de manière appropriée.' },
    { icon: Heart, title: 'Confiance en Soi', description: 'Développer l\'estime de soi et l\'assurance face aux situations difficiles.' },
    { icon: Users, title: 'Respect', description: 'Valeurs de respect de soi, des autres et des règles.' },
    { icon: Star, title: 'Épanouissement', description: 'Activité ludique qui favorise le développement physique et mental.' },
  ];

  const ageGroups = [
    { title: 'Mini-Défense (4-6 ans)', description: 'Éveil à la motricité et aux bases de la protection personnelle dans un cadre ludique.' },
    { title: 'Kids-Défense (7-10 ans)', description: 'Apprentissage des techniques de base, gestion des émotions et prévention du harcèlement.' },
    { title: 'Junior-Défense (11-14 ans)', description: 'Techniques plus avancées, gestion des conflits et préparation à l\'adolescence.' },
  ];

  const modules = [
    'Reconnaître les situations dangereuses',
    'Savoir dire "Non" fermement',
    'Se dégager d\'une prise',
    'Alerter les adultes',
    'Gestion des émotions',
    'Anti-harcèlement scolaire',
    'Confiance et affirmation de soi',
    'Jeux et exercices ludiques',
  ];

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: discImage ? `url(${discImage})` : 'none' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-block px-4 py-2 bg-secondary/10 border border-secondary/30 rounded-sm mb-6">
            <span className="text-secondary font-oswald text-sm uppercase tracking-wider">Pour les Enfants</span>
          </div>
          
          <h1 className="font-oswald text-5xl md:text-7xl font-bold text-text-primary uppercase mb-6 tracking-tight">
            <span className="text-secondary">{discTitle}</span>
          </h1>
          <p className="font-oswald text-2xl text-text-secondary uppercase tracking-wide mb-6">
            {discSubtitle}
          </p>
          
          <p className="text-xl text-text-secondary font-manrope mb-8 leading-relaxed max-w-3xl mx-auto">
            {discDescription}
          </p>
          
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-2 px-8 py-4 bg-secondary hover:bg-secondary/80 text-white font-oswald uppercase leading-none tracking-wider rounded-sm transition-all shadow-[0_0_20px_rgba(236,72,153,0.4)]"
          >
            Inscrire Mon Enfant
            <ChevronRight className="w-5 h-5" strokeWidth={2} />
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-paper">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-oswald text-4xl font-bold text-center text-text-primary uppercase mb-12 tracking-tight">
            Les <span className="text-secondary">Bénéfices</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((item, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-secondary/50 transition-colors text-center">
                <div className="w-16 h-16 rounded-lg bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-secondary" strokeWidth={1.5} />
                </div>
                <h3 className="font-oswald text-lg font-bold text-white uppercase mb-2">{item.title}</h3>
                <p className="text-text-muted font-manrope text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Age Groups Section */}
      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-oswald text-4xl font-bold text-text-primary uppercase mb-6 tracking-tight">
                Programmes par <span className="text-secondary">Âge</span>
              </h2>
              <p className="text-text-secondary font-manrope text-lg leading-relaxed mb-8">
                Nos programmes sont adaptés à chaque tranche d'âge pour un apprentissage optimal 
                dans un environnement sécurisé et bienveillant.
              </p>
              
              <div className="space-y-4">
                {ageGroups.map((group, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-5">
                    <h4 className="font-oswald text-lg text-secondary uppercase mb-2">{group.title}</h4>
                    <p className="text-text-muted font-manrope text-sm">{group.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-lg overflow-hidden border border-white/10">
                <div 
                  className="w-full h-full bg-cover bg-center bg-gray-800"
                  data-placeholder="enfant-self-defense"
                >
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/20 to-accent/20">
                    <span className="text-text-muted font-manrope text-sm text-center px-4">Photo Self-Défense Enfant à ajouter</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Content Section */}
      <section className="py-20 px-6 bg-paper">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-oswald text-4xl font-bold text-center text-text-primary uppercase mb-12 tracking-tight">
            Ce Qu'ils <span className="text-secondary">Apprennent</span>
          </h2>
          
          <div className="bg-white/5 border border-white/10 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modules.map((module, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                  <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-text-secondary font-manrope">{module}</span>
                </div>
              ))}
            </div>
          </div>
          
          <p className="text-center text-text-muted font-manrope mt-6">
            Encadrement par des instructeurs certifiés et formés à la pédagogie enfantine.
          </p>
        </div>
      </section>

      {/* Parent Info Section */}
      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-oswald text-4xl font-bold text-text-primary uppercase mb-6 tracking-tight">
            Pour les <span className="text-secondary">Parents</span>
          </h2>
          <p className="text-text-secondary font-manrope text-lg mb-8 max-w-2xl mx-auto">
            Nos cours sont dispensés par des instructeurs certifiés, formés à la pédagogie enfantine. 
            La sécurité et le bien-être des enfants sont notre priorité absolue.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
              <p className="font-oswald text-4xl text-secondary font-bold">100%</p>
              <p className="text-text-muted font-manrope text-sm">Sécurisé</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
              <p className="font-oswald text-4xl text-secondary font-bold">Certifié</p>
              <p className="text-text-muted font-manrope text-sm">Instructeurs AJL</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
              <p className="font-oswald text-4xl text-secondary font-bold">Ludique</p>
              <p className="text-text-muted font-manrope text-sm">Apprentissage par le jeu</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-background to-secondary/10">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-oswald text-4xl font-bold text-text-primary uppercase mb-6 tracking-tight">
            Offrez-lui Confiance et Sécurité
          </h2>
          <p className="text-text-secondary font-manrope text-lg mb-8">
            Inscrivez votre enfant à un cours d'essai gratuit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/onboarding"
              className="px-8 py-4 bg-secondary hover:bg-secondary/80 text-white font-oswald uppercase leading-none tracking-wider rounded-sm transition-all shadow-[0_0_20px_rgba(236,72,153,0.4)] flex items-center justify-center gap-2"
            >
              Cours d'Essai Gratuit
              <ChevronRight className="w-5 h-5" strokeWidth={2} />
            </Link>
            <Link
              to="/international"
              className="px-8 py-4 border border-white/20 hover:border-white/50 text-white font-oswald uppercase leading-none tracking-wider rounded-sm transition-all flex items-center justify-center gap-2"
            >
              Trouver un Club
              <ChevronRight className="w-5 h-5" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default DisciplineEnfantPage;
