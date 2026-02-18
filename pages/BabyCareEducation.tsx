/**
 * BabyCareEducation.tsx
 *
 * Baby Care Guide / Education page.
 * Refactored: myths -> config, caregiver modal -> CaregiverBookingModal,
 * vaccination -> config, ChatPanel added.
 */

import React, { useState } from 'react';
import {
  Heart, Brain, Baby, Shield, Syringe, Scale, Users, CheckCircle2, X,
  ArrowRight, Clock, Lightbulb, Check, ChevronLeft, ChevronRight, Share2, Calendar, Lock,
} from 'lucide-react';
import { SpeakButton } from '../components/SpeakButton';
import { ChatPanel } from '../components/ChatPanel';
import { CaregiverBookingModal } from '../components/CaregiverBookingModal';
import { BABY_MYTHS } from '../config/babyMyths.config';
import { useTranslation } from '../hooks/useTranslation';
import {
  VACCINATION_SCHEDULE,
  vaccinationBadge,
  getVaccinationSpeakText,
} from '../config/vaccinationSchedule.config';

export const BabyCareEducation: React.FC = () => {
  const { t } = useTranslation();
  const [currentMythIndex, setCurrentMythIndex] = useState(0);
  const [isCaregiverModalOpen, setIsCaregiverModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const nextMyth = () => setCurrentMythIndex((prev) => (prev + 1) % BABY_MYTHS.length);
  const prevMyth = () => setCurrentMythIndex((prev) => (prev - 1 + BABY_MYTHS.length) % BABY_MYTHS.length);

  const handleChatOpen = () => setIsChatOpen(true);

  const handleChatKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleChatOpen();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">

      {/* Hero */}
      <div className="bg-white dark:bg-dm-card rounded-[2rem] p-8 lg:p-12 shadow-sm border border-slate-100 dark:border-dm-border overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-50 rounded-full blur-[100px] -mr-20 -mt-20 opacity-60 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-50 text-secondary-600 text-xs font-bold uppercase tracking-wider mb-6 border border-secondary-100">
            <Baby size={14} />
            Baby Care Guide
          </div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl font-display font-extrabold text-slate-900 dark:text-dm-foreground mb-6 leading-tight">
                Everything about <br />caring for baby.
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                Evidence-based guidance for newborn care, development milestones, feeding, sleep, and keeping your little one healthy and happy.
              </p>
            </div>
            <SpeakButton text="Everything about caring for baby. Evidence-based guidance for newborn care, development milestones, feeding, sleep, and keeping your little one healthy and happy." />
          </div>
        </div>
      </div>

      {/* Age Navigation */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "0-3 months", active: true },
          { label: "3-6 months", active: false },
          { label: "6-9 months", active: false },
          { label: "9-12 months", active: false },
        ].map((age, i) => (
          <button
            key={i}
            className={`p-3 rounded-xl border text-center transition-all text-sm font-medium ${age.active
              ? 'bg-secondary-50 border-secondary-200 text-secondary-600 shadow-sm'
              : 'bg-white border-slate-100 text-slate-600 hover:border-secondary-200'
            }`}
          >
            {age.label}
          </button>
        ))}
      </div>

      {/* Care Topics */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-dm-foreground">Care Essentials</h2>
          <SpeakButton text="Care Essentials: Feeding Guide for breast, bottle, and combination feeding. Development Milestones for what to expect month by month. Sleep Training for safe sleep practices and routines. Health and Safety for keeping baby healthy and safe." size="sm" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: Heart, title: "Feeding Guide", desc: "Breast, bottle, and combination feeding", color: "text-secondary-400", bg: "bg-secondary-50" },
            { icon: Brain, title: "Development Milestones", desc: "What to expect month by month", color: "text-blue-500", bg: "bg-blue-50" },
            { icon: Calendar, title: "Sleep Training", desc: "Safe sleep practices and routines", color: "text-secondary-500", bg: "bg-secondary-50" },
            { icon: Shield, title: "Health & Safety", desc: "Keeping baby healthy and safe", color: "text-blue-600", bg: "bg-blue-50" },
          ].map((topic, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 dark:border-dm-border hover:border-secondary-200 hover:shadow-md transition-all cursor-pointer group flex gap-4">
              <div className={`w-12 h-12 rounded-xl ${topic.bg} ${topic.color} flex items-center justify-center shrink-0`}>
                <topic.icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-dm-foreground mb-1 group-hover:text-secondary-500 transition-colors">{topic.title}</h3>
                <p className="text-sm text-slate-400 dark:text-slate-500">{topic.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Caregiver Booking Card */}
      <div className="bg-gradient-to-br from-purple-50/50 to-secondary-50/30 rounded-[2rem] p-8 border border-purple-100/50 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/80 border border-purple-100 flex items-center justify-center shadow-sm">
                <Users size={28} className="text-purple-600" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <div className="flex items-start gap-2">
                  <div>
                    <h3 className="text-xl font-bold font-display text-slate-900 dark:text-dm-foreground mb-1">Need extra help today?</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">Trusted caregivers available when you need rest or support.</p>
                  </div>
                  <SpeakButton text="Need extra help today? Trusted caregivers available when you need rest or support. Certified and background-verified, flexible hours, with postpartum and newborn care experience." size={14} />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 space-y-3">
            {[
              { icon: CheckCircle2, text: "Certified & background-verified" },
              { icon: Clock, text: "Flexible hours (day / night)" },
              { icon: Heart, text: "Postpartum & newborn care experience" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                  <item.icon size={12} className="text-purple-600" />
                </div>
                <span className="text-sm text-slate-700 font-medium">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <button
              onClick={() => setIsCaregiverModalOpen(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
            >
              Find a Caregiver
              <ArrowRight size={16} />
            </button>
            <button className="px-6 py-3 bg-white/80 border border-purple-100 text-purple-700 rounded-xl font-semibold text-sm hover:bg-white transition-all">
              Learn how caregiver support works
            </button>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-purple-100/50">
            <p className="text-xs text-slate-600 leading-relaxed">
              <Shield size={12} className="inline mr-1.5 text-purple-500" />
              Caregivers are independently verified. This service provides support, not medical care.
            </p>
          </div>
        </div>
      </div>

      {/* Caregiver Booking Modal (extracted) */}
      <CaregiverBookingModal
        isOpen={isCaregiverModalOpen}
        onClose={() => setIsCaregiverModalOpen(false)}
      />

      {/* Myth vs Fact Section (data from config) */}
      <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 rounded-[2rem] p-6 lg:p-8 border border-amber-100/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Lightbulb size={20} className="text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-slate-900 dark:text-dm-foreground">Did you know?</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">Swipe to learn more health facts</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SpeakButton text={`Myth: ${t(BABY_MYTHS[currentMythIndex].mythKey)}. Fact: ${t(BABY_MYTHS[currentMythIndex].factKey)}`} size={14} />
            <button className="w-8 h-8 rounded-full bg-white/80 border border-amber-200 flex items-center justify-center text-amber-600 hover:bg-amber-50 transition-colors">
              <Share2 size={14} />
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="bg-white dark:bg-dm-card rounded-2xl p-6 shadow-sm border border-amber-100/50 min-h-[200px]">
            <div className="flex items-start gap-3 mb-5 pb-5 border-b border-slate-100">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <X size={16} className="text-red-500" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block mb-1">Myth</span>
                <p className="text-slate-800 font-semibold leading-relaxed">"{t(BABY_MYTHS[currentMythIndex].mythKey)}"</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                <Check size={16} className="text-primary-600" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider block mb-1">Fact</span>
                <p className="text-slate-700 leading-relaxed">{t(BABY_MYTHS[currentMythIndex].factKey)}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <button onClick={prevMyth} className="w-10 h-10 rounded-full bg-white border border-amber-200 flex items-center justify-center text-amber-600 hover:bg-amber-50 transition-colors shadow-sm">
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-1.5">
              {BABY_MYTHS.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === currentMythIndex ? 'bg-amber-500' : 'bg-amber-200'}`} />
              ))}
            </div>
            <button onClick={nextMyth} className="w-10 h-10 rounded-full bg-white border border-amber-200 flex items-center justify-center text-amber-600 hover:bg-amber-50 transition-colors shadow-sm">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-amber-100">
          <p className="text-[11px] text-slate-500 text-center leading-relaxed">
            <Shield size={10} className="inline mr-1" />
            Health information based on global medical guidelines. This does not replace a doctor's advice.
          </p>
          <p className="text-[9px] text-slate-400 text-center mt-2 leading-relaxed">
            Sources: WHO Essential Newborn Care  WHO-UNICEF IYCF Guidelines  WHO Immunization  WHO Complementary Feeding Guidelines
          </p>
        </div>
      </div>

      {/* Vaccination Schedule (data from config) */}
      <div className="bg-gradient-to-br from-secondary-50 to-blue-50 rounded-[2rem] p-8 border border-secondary-100">
        <div className="flex items-center gap-3 mb-6">
          <Syringe size={24} className="text-secondary-400" />
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-dm-foreground">Vaccination Schedule</h2>
          <SpeakButton text={getVaccinationSpeakText()} size={14} />
        </div>
        <div className="space-y-3">
          {VACCINATION_SCHEDULE.map((vax, i) => {
            const badge = vaccinationBadge(vax.status);
            return (
              <div key={i} className="bg-white p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-medium text-slate-700 block">{vax.vaccine}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">{vax.timing}</span>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${badge.className}`}>
                  {badge.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Growth Tracking */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-dm-foreground">Growth & Development</h2>
          <SpeakButton text="Growth and Development: Weight Charts to track healthy weight gain patterns. Motor Skills for physical development milestones. Social Skills for emotional and social development." size="sm" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Scale, title: "Weight Charts", desc: "Track healthy weight gain patterns", color: "text-secondary-400", bg: "bg-secondary-50" },
            { icon: Brain, title: "Motor Skills", desc: "Physical development milestones", color: "text-blue-500", bg: "bg-blue-50" },
            { icon: Heart, title: "Social Skills", desc: "Emotional and social development", color: "text-secondary-500", bg: "bg-secondary-50" },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 dark:border-dm-border hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-4`}>
                <item.icon size={24} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-dm-foreground mb-1">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Chat Promo */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleChatOpen}
        onKeyDown={handleChatKeyDown}
        className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group cursor-pointer shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 transition-all"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-500 rounded-full blur-[60px] opacity-20" />
        <div className="relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4 backdrop-blur-sm">
            <Lock size={20} className="text-secondary-300" />
          </div>
          <h3 className="text-lg font-bold font-display mb-2">Baby Care Assistant</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Have questions about feeding, sleep, or development? Chat privately with our AI companion for instant guidance.
          </p>
          <div className="flex items-center gap-2 text-sm font-bold text-secondary-300 group-hover:text-secondary-200 transition-colors">
            Start Secure Chat <ArrowRight size={16} />
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      <ChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        title="Baby Care Assistant"
        subtitle="Private & Secure"
        icon={<Lock size={18} className="text-secondary-400" />}
        chatContext="babycare"
        initialMessage="Hi there! I'm your baby care companion. Ask me anything about feeding, sleep, milestones, or newborn health."
        fallbackResponse="Great question! For newborns, watch for hunger cues like rooting and hand sucking. Feeding on demand is usually best. Would you like tips on a specific topic?"
        headerClassName="bg-dark-950"
      />
    </div>
  );
};
