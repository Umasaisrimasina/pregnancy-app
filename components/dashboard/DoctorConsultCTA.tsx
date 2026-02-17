/**
 * DoctorConsultCTA.tsx
 *
 * Shared Doctor's 1:1 Call CTA component with built-in consultation modals.
 * Encapsulates popup + flow state internally — no more duplicated wiring.
 *
 * Supports three visual variants:
 *   • "banner"  – full-width horizontal layout  (pre-pregnancy, pregnancy)
 *   • "card"    – in-grid card with description  (family view)
 *   • "compact" – small inline clickable card    (partner view)
 */

import React, { useState } from 'react';
import { Video, Phone } from 'lucide-react';
import { ConsultationPopup } from '../ConsultationPopup';
import { DoctorConsultationFlow } from '../DoctorConsultationFlow';

// ── Props ────────────────────────────────────────────────────────────────

interface DoctorConsultCTAProps {
  /** Visual layout variant. */
  variant?: 'banner' | 'card' | 'compact' | 'rich';
  /** Subtitle text beneath the title. */
  subtitle?: string;
  /** Longer description (used by "card" and "rich" variants). */
  description?: string;
  /** Button label override. */
  buttonLabel?: string;
  /** Passed to DoctorConsultationFlow as initialType. */
  consultationType?: string;
}

// ── Component ────────────────────────────────────────────────────────────

export const DoctorConsultCTA: React.FC<DoctorConsultCTAProps> = ({
  variant = 'banner',
  subtitle = 'Connect with specialists',
  description,
  buttonLabel = 'Book Consultation',
  consultationType,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isFlowOpen, setIsFlowOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);

  const modals = (
    <>
      <ConsultationPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onContinue={() => {
          setIsPopupOpen(false);
          setIsFlowOpen(true);
        }}
      />
      <DoctorConsultationFlow
        isOpen={isFlowOpen}
        onClose={() => setIsFlowOpen(false)}
        initialType={consultationType}
      />
    </>
  );

  // ── Variant: Compact (partner view — small inline card) ──────────────
  if (variant === 'compact') {
    return (
      <>
        <div
          onClick={openPopup}
          className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-[2rem] p-6 border border-emerald-100 dark:border-emerald-800/30 flex items-center gap-4 hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
            <Video size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-dm-foreground">Doctor&apos;s 1:1 Call</h3>
            <p className="text-emerald-600 dark:text-emerald-400 text-xs font-medium mt-0.5">{subtitle}</p>
          </div>
        </div>
        {modals}
      </>
    );
  }

  // ── Variant: Card (family view — grid card with description) ─────────
  if (variant === 'card') {
    return (
      <>
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-[2rem] p-8 border border-emerald-100 dark:border-emerald-800/30 hover:shadow-lg transition-all cursor-pointer group">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
              <Video size={24} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-dm-foreground text-lg">Doctor&apos;s 1:1 Call</h3>
          </div>
          {description && (
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{description}</p>
          )}
          <button
            onClick={openPopup}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-2"
          >
            <Phone size={18} />
            {buttonLabel}
          </button>
        </div>
        {modals}
      </>
    );
  }

  // ── Variant: Rich (pregnancy view — gradient-filled card) ────────────
  if (variant === 'rich') {
    return (
      <>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-lg shadow-emerald-500/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Video size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Doctor&apos;s 1:1 Call</h3>
                <p className="text-emerald-100">{subtitle}</p>
              </div>
            </div>
            {description && (
              <p className="text-emerald-100 mb-6">{description}</p>
            )}
            <button
              onClick={openPopup}
              className="w-full bg-white text-emerald-600 px-6 py-4 rounded-xl font-bold shadow-lg hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
            >
              <Phone size={20} />
              {buttonLabel}
            </button>
          </div>
        </div>
        {modals}
      </>
    );
  }

  // ── Variant: Banner (default — full-width horizontal layout) ─────────
  return (
    <>
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-[2rem] p-8 border border-emerald-100 dark:border-emerald-800/30 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Video size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-dm-foreground">
                Doctor&apos;s 1:1 Call
              </h3>
              <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={openPopup}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all flex items-center gap-3"
          >
            <Phone size={20} />
            {buttonLabel}
          </button>
        </div>
      </div>
      {modals}
    </>
  );
};
