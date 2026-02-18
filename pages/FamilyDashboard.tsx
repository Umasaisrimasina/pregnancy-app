/**
 * FamilyDashboard.tsx
 *
 * Extracted Family-role dashboard view.
 * Stateless — all content is static / presentational.
 */

import React from 'react';
import { Heart, Info, Calendar, Mic, Gift } from 'lucide-react';
import { SpeakButton } from '../components/SpeakButton';
import { DoctorConsultCTA } from '../components/dashboard/DoctorConsultCTA';

export const FamilyDashboard: React.FC = () => {
  const showComingSoon = (feature: string) => {
    alert(`${feature} feature coming soon! This will allow you to interact with and support Maya.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-2 text-center">
        <span className="text-xs font-bold text-primary-400 uppercase tracking-widest">MODE: FAMILY PERSPECTIVE</span>
        <h1 className="text-4xl font-display font-extrabold text-slate-900 dark:text-dm-foreground mt-2">Your Pregnancy Journey</h1>
        <div className="flex items-center justify-center gap-2 mt-4">
          <h2 className="text-2xl font-display font-bold text-slate-700 dark:text-slate-200">Welcome, Family!</h2>
          <SpeakButton text="Family Perspective. Your Pregnancy Journey. Welcome, Family! Stay updated on Maya's journey and find ways to support." />
        </div>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Stay updated on Maya&apos;s journey and find ways to support.</p>
      </div>

      {/* Milestone Hero */}
      <div className="bg-gradient-to-br from-primary-50 to-white dark:from-primary-800/20 dark:to-dark-900 rounded-[2.5rem] p-10 border border-primary-100 dark:border-primary-800/30 text-center relative overflow-hidden">
        <Heart size={300} className="absolute -top-10 -left-10 text-primary-100 dark:text-primary-800/20 opacity-50 rotate-[-15deg]" />
        <Heart size={200} className="absolute -bottom-10 -right-10 text-primary-100 dark:text-primary-800/20 opacity-50 rotate-[15deg]" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-2xl font-display font-bold text-primary-700 dark:text-primary-300 mb-3">Milestone Alert: 24 Weeks!</h3>
            <SpeakButton text="Milestone Alert: 24 Weeks! The baby is now about the size of an ear of corn and can hear sounds from the outside world!" />
          </div>
          <p className="text-primary-800/70 dark:text-primary-200/70 text-base leading-relaxed mb-8">
            The baby is now about the size of an ear of corn and can hear sounds from the outside world!
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => showComingSoon('Send Love')}
              className="bg-primary-400 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary-400/20 hover:bg-primary-500 transition-colors flex items-center gap-2"
            >
              <Heart size={18} fill="currentColor" /> Send Love
            </button>
            <button 
              onClick={() => showComingSoon('Record Voice Note')}
              className="bg-white dark:bg-dm-muted text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-dm-border px-8 py-3 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-dm-accent transition-colors flex items-center gap-2"
            >
              <Mic size={18} /> Record Voice Note
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Support Suggestions */}
        <div className="bg-white dark:bg-dm-card rounded-[2rem] p-8 border border-slate-100 dark:border-dm-border">
          <div className="flex items-center gap-3 mb-6">
            <Info size={20} className="text-blue-500" />
            <h3 className="font-bold text-slate-900 dark:text-dm-foreground text-lg">Support Maya Today</h3>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-dm-muted border border-slate-100 dark:border-dm-border">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded flex items-center justify-center font-bold text-xs shrink-0">1</div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Ask about her sleep—third trimester is starting soon.</p>
            </div>
            <div className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-dm-muted border border-slate-100 dark:border-dm-border">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded flex items-center justify-center font-bold text-xs shrink-0">2</div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Maya mentioned craving traditional homemade Makhana.</p>
            </div>
          </div>
        </div>

        {/* Events */}
        <div className="bg-white dark:bg-dm-card rounded-[2rem] p-8 border border-slate-100 dark:border-dm-border">
          <div className="flex items-center gap-3 mb-6">
            <Calendar size={20} className="text-primary-500" />
            <h3 className="font-bold text-slate-900 dark:text-dm-foreground text-lg">Family Events</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-dm-muted rounded-xl">
              <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">Baby Shower Planning</span>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Nov 12</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-dm-muted rounded-xl">
              <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">Hospital Visit (Maya)</span>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Dec 01</span>
            </div>
          </div>
        </div>

        {/* Doctor's 1:1 Call */}
        <DoctorConsultCTA
          variant="card"
          description="Connect with Maya's doctor for updates or questions about her pregnancy."
          buttonLabel="Schedule Call"
        />
      </div>

      {/* Photos */}
      <div className="bg-white dark:bg-dm-card rounded-[2rem] p-8 border border-slate-100 dark:border-dm-border">
        <h3 className="font-bold text-slate-900 dark:text-dm-foreground text-lg mb-6">Latest Shared Photos</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'https://images.unsplash.com/photo-1544126566-475a890b0e53?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=400&q=80',
          ].map((src, i) => (
            <div key={i} className="aspect-square rounded-2xl overflow-hidden relative group cursor-pointer">
              <img src={src} alt="Family memory" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Care Package Banner */}
      <div className="bg-secondary-900 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-white relative overflow-hidden">
        <div className="relative z-10 flex items-start gap-3 flex-1">
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-xl font-bold font-display mb-2">Send a Care Package?</h3>
              <p className="text-secondary-200 text-sm">We&apos;ve curated healthy snacks &amp; wellness kits Maya will love.</p>
            </div>
            <button
              onClick={() => showComingSoon('Care Package')}
              className="bg-white text-secondary-900 px-6 py-3 rounded-xl font-bold hover:bg-secondary-50 transition-colors flex items-center gap-2"
            >
              <Gift size={18} /> Browse Packages
            </button>
          </div>
          <SpeakButton text="Send a Care Package? We've curated healthy snacks and wellness kits Maya will love." className="text-white border-white/30 bg-white/10 hover:bg-white/20" size={14} />
        </div>
        <Gift size={64} className="text-secondary-400 opacity-50 absolute right-8 bottom-0 md:static md:opacity-100" />
      </div>
    </div>
  );
};
