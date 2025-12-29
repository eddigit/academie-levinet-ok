import React from 'react';
import { Link } from 'react-router-dom';
import MegaMenu from './MegaMenu';
import { useAuth } from '../context/AuthContext';
import { useSiteContent } from '../context/SiteContentContext';

const PublicHeader = () => {
  const { user } = useAuth();
  const { content, loading } = useSiteContent();

  // Default values in case content is not loaded
  const branding = content?.branding || {
    logo_url: "https://customer-assets.emergentagent.com/job_spk-academy/artifacts/rz31ua12_WhatsApp%20Image%202025-12-18%20at%2013.59.58.jpeg",
    name: "Académie Jacques Levinet",
    tagline: "École Internationale de Self-Défense"
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img 
            src={branding.logo_url} 
            alt={`Logo ${branding.name}`}
            className="w-12 h-12 rounded-full object-cover"
            data-testid="header-logo"
          />
          <div>
            <h1 className="font-oswald text-xl font-bold text-text-primary uppercase tracking-wide">
              {branding.name}
            </h1>
            <p className="text-xs text-text-secondary font-manrope">{branding.tagline}</p>
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <MegaMenu />
          <Link 
            to="/boutique" 
            className="px-4 py-2 text-text-secondary hover:text-primary font-oswald uppercase leading-none tracking-wider transition-colors"
          >
            Boutique
          </Link>
          <Link 
            to={user ? "/dashboard" : "/login"}
            data-testid="header-login-button"
            className="px-6 py-2 bg-primary hover:bg-primary-dark text-white font-oswald uppercase leading-none tracking-wider rounded-sm transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]"
          >
            {user ? "Plateforme" : "Connexion"}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;