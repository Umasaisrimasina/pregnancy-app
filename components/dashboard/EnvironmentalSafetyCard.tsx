/**
 * EnvironmentalSafetyCard.tsx
 *
 * AQI / environmental safety section extracted from BabyCareDashboard.
 * Receives AQI state + fetch callback via props — fully presentational.
 */

import React from 'react';
import {
  Wind, Clock, CheckCircle2, AlertTriangle, Loader2, MapPin,
  RefreshCw, Shield, Tv, ShieldCheck,
} from 'lucide-react';
import { getAQICategory, getBabySafetyGuidance, formatPollutant } from '../../config/aqiHelpers';
import { SpeakButton } from '../SpeakButton';

// ── Types ────────────────────────────────────────────────────────────────

interface AQIData {
  aqi: number;
  station: string;
  dominantPollutant: string;
  lastUpdated: string;
}

interface AQIState {
  loading: boolean;
  error: string | null;
  data: AQIData | null;
}

interface EnvironmentalSafetyCardProps {
  aqiState: AQIState;
  onRefresh: () => void;
}

// ── Component ────────────────────────────────────────────────────────────

export const EnvironmentalSafetyCard: React.FC<EnvironmentalSafetyCardProps> = ({
  aqiState,
  onRefresh,
}) => {
  const speakText = aqiState.data
    ? `Environmental Safety. Current Air Quality Index is ${aqiState.data.aqi}, which is ${getAQICategory(aqiState.data.aqi).label}. ${getBabySafetyGuidance(aqiState.data.aqi).message}. Location: ${aqiState.data.station}. Dominant pollutant: ${formatPollutant(aqiState.data.dominantPollutant)}.`
    : 'Environmental Safety. Air quality awareness for infants: In many Indian cities, carrying infants in high AQI without coverups is dangerously normalized. Babies breathe 3 times faster than adults.';

  return (
    <div className="bg-[#fffbeb] rounded-[2rem] p-8 border border-amber-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary-100 text-primary-600 rounded-full">
            <Wind size={24} />
          </div>
          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-dm-foreground">Environmental Safety</h2>
          <SpeakButton text={speakText} />
        </div>
        <button
          onClick={onRefresh}
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
              <button onClick={onRefresh} className="text-xs text-primary-200 underline hover:text-white">Retry</button>
            </div>
          ) : aqiState.data ? (
            <AQIDisplay data={aqiState.data} />
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
  );
};

// ── Sub-component: AQI data display ──────────────────────────────────────

const AQIDisplay: React.FC<{ data: AQIData }> = ({ data }) => {
  const category = getAQICategory(data.aqi);
  const guidance = getBabySafetyGuidance(data.aqi);

  const aqiColorClass =
    data.aqi <= 50 ? 'text-primary-400' :
    data.aqi <= 100 ? 'text-yellow-400' :
    data.aqi <= 150 ? 'text-orange-400' :
    data.aqi <= 200 ? 'text-red-400' :
    'text-purple-400';

  const guidanceBgClass =
    guidance.icon === 'safe' ? 'bg-primary-500/20 border border-primary-400/30' :
    guidance.icon === 'caution' ? 'bg-yellow-500/20 border border-yellow-400/30' :
    guidance.icon === 'warning' ? 'bg-orange-500/20 border border-orange-400/30' :
    'bg-red-500/20 border border-red-400/30';

  const GuidanceIcon =
    guidance.icon === 'safe' ? CheckCircle2 :
    guidance.icon === 'danger' ? Shield :
    AlertTriangle;

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
      {/* Large AQI Number */}
      <div className="flex items-center gap-6">
        <div className="text-center">
          <div className="text-[10px] text-primary-300 uppercase tracking-widest font-bold mb-1">Live AQI</div>
          <div className={`text-6xl font-bold font-display leading-none ${aqiColorClass}`}>
            {data.aqi}
          </div>
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 ${category.color} text-white`}>
            {category.label}
          </div>
        </div>
        <div className="hidden lg:block w-px h-20 bg-white/20" />
      </div>

      {/* Info and Safety */}
      <div className="flex-1">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-4 ${guidanceBgClass}`}>
          <GuidanceIcon size={16} />
          <span className="text-sm font-medium">{guidance.message}</span>
        </div>

        <p className="text-primary-100/80 text-sm mb-4">
          Babies breathe 3x faster than adults. In high AQI (&gt;150), use baby coverups outdoors.
        </p>

        <div className="flex flex-wrap items-center gap-4 text-primary-200 text-xs">
          <div className="flex items-center gap-1.5">
            <MapPin size={12} className="shrink-0" />
            <span>{data.station}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wind size={12} />
            <span>{formatPollutant(data.dominantPollutant)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-primary-300/60">
            <Clock size={12} />
            <span>{new Date(data.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
