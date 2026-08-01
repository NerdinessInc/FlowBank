"use client";

import { useTenant } from "@/components/providers/TenantProvider";
import { Phone, Mail, ShieldCheck, Facebook, Instagram, MessageCircle } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tenant = useTenant();

  return (
    <main className="flex flex-col lg:flex-row min-h-screen w-full bg-background">
      {/* Left Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 md:p-16 lg:p-24 relative">
        <div className="w-full max-w-md mx-auto">
          {children}
        </div>
      </div>

      {/* Right Side - Real Estate */}
      <div className="lg:flex lg:w-1/2 bg-slate-950 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Image */}
        {tenant.backgroundImage && (
          <div 
            className="absolute inset-0 z-0 opacity-50 bg-cover bg-center" 
            style={{ backgroundImage: `url(${tenant.backgroundImage})` }} 
          />
        )}
        
        {/* Optional decorative background gradient */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-950/80 via-slate-900/60 to-accent/40 pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-16">
            {tenant.logo ? (
              <img src={tenant.logo} alt={tenant.name} className="h-10 object-contain" />
            ) : (
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <ShieldCheck className="text-white w-6 h-6" />
              </div>
            )}
            <h1 className="text-2xl font-bold text-white">{tenant.name}</h1>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <h2 className="text-4xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              Welcome to the future of digital banking.
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed drop-shadow-sm">
              {tenant.description}
            </p>
          </div>

          {/* Footer Contact Info */}
          <div className="mt-16 pt-8 border-t border-slate-700/50 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {tenant.contactPhone && (
              <div className="flex items-center text-slate-300 hover:text-white transition-colors">
                <Phone className="w-5 h-5 mr-3 text-white/70" />
                <span className="text-sm font-medium">{tenant.contactPhone}</span>
              </div>
            )}
            {tenant.contactEmail && (
              <div className="flex items-center text-slate-300 hover:text-white transition-colors">
                <Mail className="w-5 h-5 mr-3 text-white/70" />
                <span className="text-sm font-medium">{tenant.contactEmail}</span>
              </div>
            )}
            {tenant.facebook && (
              <a href={tenant.facebook} target="_blank" rel="noreferrer" className="flex items-center text-slate-300 hover:text-white transition-colors">
                <Facebook className="w-5 h-5 mr-3 text-white/70" />
                <span className="text-sm font-medium">Facebook</span>
              </a>
            )}
            {tenant.instagram && (
              <a href={tenant.instagram} target="_blank" rel="noreferrer" className="flex items-center text-slate-300 hover:text-white transition-colors">
                <Instagram className="w-5 h-5 mr-3 text-white/70" />
                <span className="text-sm font-medium">Instagram</span>
              </a>
            )}
            {tenant.whatsapp && (
              <a href={`https://wa.me/${tenant.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center text-slate-300 hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5 mr-3 text-white/70" />
                <span className="text-sm font-medium">WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
