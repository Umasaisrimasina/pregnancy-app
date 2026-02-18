/**
 * BabyCareDashboard.tsx
 *
 * Extracted Baby-Care phase (mother role) dashboard view.
 * Consumes: useAQI hook, aqiHelpers config.
 */

import React from 'react';
import {
  Calendar, Scale, Moon, Milk, Clock, Wind, Baby, Utensils, FlaskConical, Tv,
  ShieldCheck, CheckCircle2, AlertTriangle, Loader2, ClipboardList, MapPin,
  RefreshCw, Shield,
} from 'lucide-react';
import { useAQI } from '../hooks/useAQI';
import { getAQICategory, getBabySafetyGuidance, formatPollutant } from '../config/aqiHelpers';
import { PhaseHeader } from '../components/dashboard/PhaseHeader';
import { SpeakButton } from '../components/SpeakButton';
import { QuickStatCard } from '../components/dashboard/QuickStatCard';
import { MilestoneTracker } from '../components/dashboard/MilestoneTracker';
import { getVaccinationSummary } from '../config/vaccinationSchedule.config';
import { getUpcomingMilestones } from '../config/milestones.config';

export const BabyCareDashboard: React.FC = () => {
  const { aqiState, fetchAQI } = useAQI();
  const { completed: doneVax, nextUp } = getVaccinationSummary();
  const upcomingMilestones = getUpcomingMilestones(4);
  
  const handleLogAppointment = () => {
    console.log("Log appointment clicked");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <PhaseHeader
        badgeText="Month 2"
        badgeColorClass="bg-secondary-50 border-secondary-100 text-secondary-600 dark:bg-secondary-900/20 dark:border-secondary-800 dark:text-secondary-300"
        dotColorClass="bg-secondary-400"
        title="Baby Care"
        subtitle="Leo is 8 weeks old today!"
        speakText="Baby Care Dashboard. Month 2. Leo is 8 weeks old today! Track feeding, sleep, weight, and upcoming milestones."
        rightContent={
          <button 
            onClick={handleLogAppointment}
            className="bg-secondary-400 hover:bg-secondary-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-secondary-400/20 transition-all flex items-center gap-2"
          >
            <Calendar size={18} />
            Log Appointment
          </button>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickStatCard icon={Milk} label="Last Feed" value="2h 15m" subtext="ago" iconBg="bg-orange-50" iconColor="text-orange-500" />
        <QuickStatCard icon={Moon} label="Last Sleep" value="45m" subtext="duration" iconBg="bg-blue-50" iconColor="text-blue-500" />
        <QuickStatCard icon={Scale} label="Weight" value="11.2 lbs" subtext="+5%" iconBg="bg-green-50" iconColor="text-green-500" />
        <QuickStatCard icon={Clock} label="Next Feed" value="1:30 PM" subtext="in 45 mins" accentBg="bg-secondary-400 shadow-secondary-400/20" />
      </div>

      {/* Environmental Safety */}
      <div className="bg-[#fffbeb] rounded-[2rem] p-8 border border-amber-50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 text-primary-600 rounded-full">
              <Wind size={24} />
            </div>
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-dm-foreground">Environmental Safety</h2>
            <SpeakButton text={aqiState.data
              ? `Environmental Safety. Current Air Quality Index is ${aqiState.data.aqi}, which is ${getAQICategory(aqiState.data.aqi).label}. ${getBabySafetyGuidance(aqiState.data.aqi).message}. Location: ${aqiState.data.station}. Dominant pollutant: ${formatPollutant(aqiState.data.dominantPollutant)}.`
              : "Environmental Safety. Air quality awareness for infants: In many Indian cities, carrying infants in high AQI without coverups is dangerously normalized. Babies breathe 3 times faster than adults."
            } />
          </div>
          <button
            onClick={fetchAQI}
            disabled={aqiState.loading}
            className="p-2 rounded-xl bg-white border border-amber-200 text-primary-600 hover:bg-primary-50 transition-colors disabled:opacity-50"
            title="Refresh AQI"
          >
            <RefreshCw size={18} className={aqiState.loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* AQI Card */}
        <div className="bg-[#064e3b] rounded-[2rem] p-8 relative overflow-hidden mb-6 text-white">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-1/4 translate-y-1/4">
            <Wind size={200} />
          </div>
          <div className="relative z-10">
            {aqiState.loading && !aqiState.data ? (
              <div className="flex items-center justify-center gap-3 py-4">
                <Loader2 size={24} className="animate-spin text-primary-300" />
                <span className="text-primary-200 text-sm">Fetching live air quality...</span>
              </div>
            ) : aqiState.error ? (
              <div className="flex items-center justify-center gap-3 py-4">
                <AlertTriangle size={20} className="text-red-300" />
                <span className="text-red-300 text-sm">Unable to load AQI</span>
                <button onClick={fetchAQI} className="text-xs text-primary-200 underline hover:text-white">Retry</button>
              </div>
            ) : aqiState.data ? (
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Large AQI Number */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-[10px] text-primary-300 uppercase tracking-widest font-bold mb-1">Live AQI</div>
                    <div className={`text-6xl font-bold font-display leading-none ${aqiState.data.aqi <= 50 ? 'text-primary-400' :
                      aqiState.data.aqi <= 100 ? 'text-yellow-400' :
                        aqiState.data.aqi <= 150 ? 'text-orange-400' :
                          aqiState.data.aqi <= 200 ? 'text-red-400' :
                            'text-purple-400'
                      }`}>
                      {aqiState.data.aqi}
                    </div>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 ${getAQICategory(aqiState.data.aqi).color} text-white`}>
                      {getAQICategory(aqiState.data.aqi).label}
                    </div>
                  </div>
                  <div className="hidden lg:block w-px h-20 bg-white/20"></div>
                </div>

                {/* Info and Safety */}
                <div className="flex-1">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-4 ${getBabySafetyGuidance(aqiState.data.aqi).icon === 'safe'
                    ? 'bg-primary-500/20 border border-primary-400/30'
                    : getBabySafetyGuidance(aqiState.data.aqi).icon === 'caution'
                      ? 'bg-yellow-500/20 border border-yellow-400/30'
                      : getBabySafetyGuidance(aqiState.data.aqi).icon === 'warning'
                        ? 'bg-orange-500/20 border border-orange-400/30'
                        : 'bg-red-500/20 border border-red-400/30'
                    }`}>
                    {getBabySafetyGuidance(aqiState.data.aqi).icon === 'safe' && <CheckCircle2 size={16} />}
                    {getBabySafetyGuidance(aqiState.data.aqi).icon === 'caution' && <AlertTriangle size={16} />}
                    {getBabySafetyGuidance(aqiState.data.aqi).icon === 'warning' && <AlertTriangle size={16} />}
                    {getBabySafetyGuidance(aqiState.data.aqi).icon === 'danger' && <Shield size={16} />}
                    <span className="text-sm font-medium">{getBabySafetyGuidance(aqiState.data.aqi).message}</span>
                  </div>

                  <p className="text-primary-100/80 text-sm mb-4">
                    Babies breathe 3x faster than adults. In high AQI (&gt;150), use baby coverups outdoors.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-primary-200 text-xs">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} className="shrink-0" />
                      <span>{aqiState.data.station}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Wind size={12} />
                      <span>{formatPollutant(aqiState.data.dominantPollutant)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-primary-300/60">
                      <Clock size={12} />
                      <span>{new Date(aqiState.data.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-dm-card rounded-[2rem] p-6 border border-amber-100 flex gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
              <Tv size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-dm-foreground mb-2">Media Consumption</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Watching TV too much is normalized but stunts early neural speech pathways. Focus on tactile play.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-dm-card rounded-[2rem] p-6 border border-amber-100 flex gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-dm-foreground mb-2">Full House Hygiene</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Baby-safe furniture with rounded edges and non-toxic paint is essential for the first 5 years.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Baby Care Essentials & Medical Roadmap */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-dm-card rounded-[2rem] p-8 border border-slate-100 dark:border-dm-border">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-secondary-100 text-secondary-600 flex items-center justify-center">
              <Baby size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-dm-foreground">Baby Care Essentials</h2>
              <p className="text-slate-400 dark:text-slate-500">Science-backed postnatal guidance</p>
            </div>
            <SpeakButton text="Baby Care Essentials. Science-backed postnatal guidance including nutrition, hygiene, breastfeeding tips, formula safety, and product comparisons for diapers and skincare." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4 text-primary-400">
                <Utensils size={20} />
                <h3 className="font-bold text-slate-900 dark:text-dm-foreground">Nutrition & Hygiene</h3>
              </div>
              <ul className="space-y-4">
                <li className="text-sm text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-900 dark:text-dm-foreground">Breastfeeding Hygiene:</span> Cleanliness of latch and pump parts is critical. Indian milk reports suggest checking local sources for contaminants.
                </li>
                <li className="text-sm text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-900 dark:text-dm-foreground">Formula Safety:</span> USA/EU standards (FDA/EFSA) are currently stricter than FSSAI. Choose certified organic imports if local purity is in doubt.
                </li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4 text-blue-600">
                <FlaskConical size={20} />
                <h3 className="font-bold text-slate-900 dark:text-dm-foreground">Product Comparisons</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1 block">Diaper Quality</span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Indian market diapers are catching up, but Western regulations (TBT/SPS) often ensure lower chemical toxicity in materials.
                  </p>
                </div>
                <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1 block">Skincare Alert</span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Avoid talc-based powders; use pH-neutral, paraben-free lotions. India has loose ends in FSSAI cosmetic monitoring.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-1 bg-white dark:bg-dm-card rounded-[2rem] p-8 border border-slate-100 dark:border-dm-border h-full flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-primary-400">
              <ClipboardList size={20} />
            </div>
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-dm-foreground">Medical Roadmap</h3>
            <SpeakButton text="Medical Roadmap. Vaccination tracker: BCG and Hepatitis B done. OPV 1 and DTP 1 due next week. Genetic monitoring: Birth data is analyzed for genetic markers. Follow up on infant metabolic screening results." size={12} />
          </div>

          <div className="bg-primary-50 rounded-2xl p-4 mb-4">
            <span className="text-[10px] font-bold text-primary-500 uppercase tracking-wider mb-3 block">Vaccination Tracker</span>
            <div className="space-y-3">
              {doneVax.map((v, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{v.vaccine}</span>
                  <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-[10px] font-bold rounded">DONE</span>
                </div>
              ))}
              {nextUp && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{nextUp.vaccine}</span>
                  <span className="px-2 py-0.5 bg-primary-200 text-primary-700 text-[10px] font-bold rounded">NEXT</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-4 flex-1">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2 block">Genetic Monitoring</span>
            <p className="text-sm text-slate-600 leading-relaxed">
              Entered birth data is analyzed for genetic markers. Follow up on infant metabolic screening results.
            </p>
          </div>
        </div>
      </div>

      {/* Milestone Tracker (data from config) */}
      <MilestoneTracker milestones={upcomingMilestones} />
    </div>
  );
};
