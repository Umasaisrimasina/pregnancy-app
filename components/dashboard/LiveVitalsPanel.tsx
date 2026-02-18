/**
 * LiveVitalsPanel.tsx
 *
 * Pink container holding: header, 7 metric cards, stress chart, and watch pipeline card.
 * Self-contained — consumes useHealthData context and stressGraphData from config.
 */

import React, { useState, useRef, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import {
  Activity, ArrowRight, AlertCircle, Moon, Heart,
  Watch, Cloud, Wind, Brain, Volume2,
  Droplets, Scale, Flame,
  HeartHandshake, RefreshCw, SmartphoneNfc, Loader2,
} from 'lucide-react';
import { useHealthData } from '../../contexts/HealthDataContext';
import { stressGraphData } from '../../config/dashboardData.config';

/* ── Custom dot for stress chart ───────────────────────────────────── */
const CustomDot = ({ cx, cy, payload, isConnected }: any) => {
  if (payload.day === 'Thu' && isConnected) {
    return (
      <circle cx={cx} cy={cy} r={6} fill="#8b5cf6" stroke="white" strokeWidth={2}>
        <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" />
      </circle>
    );
  }
  if (payload.day === 'Thu') {
    return <circle cx={cx} cy={cy} r={5} fill="#8b5cf6" stroke="white" strokeWidth={2} />;
  }
  return <circle cx={cx} cy={cy} r={3} fill="#a78bfa" />;
};

/* ── Metric card config ────────────────────────────────────────────── */
const buildMetrics = (m: ReturnType<typeof useHealthData>['metrics']) => [
  { label: 'Sugar', value: m.bloodSugar, unit: 'mg/dL', icon: Flame, color: 'text-primary-400', bg: 'bg-primary-50' },
  { label: 'Heart Rate', value: m.heartRate, unit: 'bpm', icon: Heart, color: 'text-primary-400', bg: 'bg-primary-50' },
  { label: 'SPO2', value: m.spo2, unit: '%', icon: Wind, color: 'text-primary-500', bg: 'bg-primary-50' },
  { label: 'Stress', value: m.stressLevel, unit: '/100', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-50', active: true },
  { label: 'Sleep', value: m.sleepHours, unit: 'hrs', icon: Moon, color: 'text-secondary-500', bg: 'bg-secondary-50' },
  { label: 'Snoring', value: m.snoringMinutes, unit: 'min', icon: Volume2, color: 'text-amber-500', bg: 'bg-amber-50' },
  { label: 'Weight', value: m.weight, unit: 'kg', icon: Scale, color: 'text-slate-500', bg: 'bg-slate-50' },
];

export const LiveVitalsPanel: React.FC = () => {
  const { metrics, isConnected, isDemoMode, isManualMode, toggleDemoMode, openManualModal } = useHealthData();
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const authTimerRef = useRef<number | null>(null);

  const handleWatchAuth = () => {
    setIsAuthorizing(true);
    
    // Clear any existing timer before setting a new one
    if (authTimerRef.current !== null) {
      clearTimeout(authTimerRef.current);
    }
    
    authTimerRef.current = window.setTimeout(() => {
      toggleDemoMode();
      setIsAuthorizing(false);
    }, 1500);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (authTimerRef.current !== null) {
        clearTimeout(authTimerRef.current);
      }
    };
  }, []);

  const metricCards = buildMetrics(metrics);

  return (
    <div className="bg-[#fff0f0] rounded-[2rem] p-6 lg:p-8 mb-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-100 text-primary-400 flex items-center justify-center shadow-sm">
            <Activity size={28} />
          </div>
          <h2 className="text-4xl font-display font-bold text-slate-900 dark:text-dm-foreground">Live Vitals</h2>
        </div>
        <div
          className={`px-4 py-2 rounded-full border flex items-center gap-2 font-bold text-[10px] tracking-wider uppercase transition-all shadow-sm ${
            isConnected ? 'bg-white border-primary-200 text-primary-700' : 'bg-white border-primary-200 text-primary-500'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-primary-500' : 'bg-primary-400'}`} />
          {isConnected ? 'Connected' : 'Not Connected'}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        {metricCards.map((item, i) => (
          <div
            key={i}
            className={`relative bg-white dark:bg-dm-card rounded-2xl p-3 flex flex-col items-center justify-center gap-2 min-h-[120px] transition-all cursor-pointer ${
              item.active
                ? 'ring-2 ring-purple-400 shadow-xl shadow-purple-200 scale-105 z-10'
                : 'hover:scale-105 hover:shadow-lg border border-transparent hover:border-dark-700'
            }`}
          >
            <div className={`w-9 h-9 rounded-full ${item.bg} ${item.color} flex items-center justify-center mb-0.5`}>
              <item.icon size={18} />
            </div>
            <div className="text-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">{item.label}</span>
              <div className="flex items-baseline justify-center gap-0.5">
                <span className="text-lg font-display font-bold text-slate-900 dark:text-dm-foreground">{item.value}</span>
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500">{item.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Watch Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white/50 backdrop-blur-sm rounded-[2.5rem] p-6 border border-white h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stressGraphData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorStressPurple" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dy={10} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#8b5cf6"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorStressPurple)"
                dot={{ r: 6, fill: '#ffffff', stroke: '#8b5cf6', strokeWidth: 3 }}
                activeDot={{ r: 8, fill: '#8b5cf6', stroke: '#ffffff', strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex justify-center mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-xs font-bold text-purple-500 uppercase tracking-widest">Stress Level (0-100)</span>
            </div>
          </div>
        </div>

        {/* Watch / Data Pipeline Card */}
        <div className="lg:col-span-1 bg-white rounded-[2.5rem] p-6 border border-white shadow-sm flex flex-col justify-between h-[320px]">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
                <Watch size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-dm-foreground">My Watch</h3>
                <div className="flex gap-1 items-center">
                  <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-primary-500 animate-pulse' : 'bg-slate-400'}`} />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {isConnected ? 'Synced' : 'Not Synced'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex bg-slate-100 rounded-full p-1">
              <button
                onClick={toggleDemoMode}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${isDemoMode ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                AUTO BRIDGE
              </button>
              <button
                onClick={openManualModal}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${isManualMode ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                MANUAL
              </button>
            </div>
          </div>

          {/* Pipeline Visuals */}
          <div className="flex justify-between items-center px-1 mb-4">
            {[
              { icon: Watch, label: 'Wrist', highlight: false },
              { icon: SmartphoneNfc, label: 'Nothing X', highlight: false },
              { icon: Cloud, label: 'Google Fit', highlight: false },
              { icon: Activity, label: 'NurtureNet', highlight: true },
            ].map((node, idx, arr) => (
              <React.Fragment key={node.label}>
                <div className={`flex flex-col items-center gap-1 ${node.highlight ? 'text-slate-900 dark:text-dm-foreground' : 'text-slate-400 dark:text-slate-500'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${node.highlight ? 'bg-primary-50 text-primary-600 border border-primary-100' : 'bg-dark-800'}`}>
                    <node.icon size={18} />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider">{node.label}</span>
                </div>
                {idx < arr.length - 1 && (
                  <div className="h-[2px] flex-1 bg-slate-100 mx-1 relative">
                    <ArrowRight size={10} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex gap-3 mb-4">
            <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-800 font-medium leading-relaxed">
              Connect your Google Fit account to pull the Nothing X synced data from your watch.
            </p>
          </div>

          {/* Auth Button */}
          <button
            onClick={handleWatchAuth}
            className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-50 dark:hover:bg-dm-muted transition-all flex items-center justify-center gap-2"
          >
            {isAuthorizing ? (
              <>
                <RefreshCw size={14} className="animate-spin" /> Authorizing...
              </>
            ) : (
              <>
                <HeartHandshake size={14} className="text-primary-400" /> Authorize Cloud Bridge
              </>
            )}
          </button>

          {/* Footer */}
          <div className="mt-4 pt-0 text-center">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <RefreshCw size={10} className="animate-spin" /> Data Pipeline Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
