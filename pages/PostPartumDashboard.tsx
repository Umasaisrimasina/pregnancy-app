/**
 * PostPartumDashboard.tsx
 *
 * Extracted Post-Partum phase (mother role) dashboard view.
 * Consumes: usePostPartumMood hook, sentimentService resources.
 */

import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import {
  Activity, ArrowRight, CheckCircle2, Moon, Sparkles, Heart,
} from 'lucide-react';
import { usePostPartumMood } from '../hooks/usePostPartumMood';
import { PhaseHeader } from '../components/dashboard/PhaseHeader';
import { FeelingTracker } from '../components/dashboard/FeelingTracker';
import { SpeakButton } from '../components/SpeakButton';
import { SafetyAlertBanner } from '../components/SafetyAlertBanner';
import { ChecklistCard } from '../components/dashboard/ChecklistCard';
import { RECOVERY_CHECKLIST } from '../config/postPartumChecklist.config';

// Helper function to compute mood status from snapshot data
const computeMoodStatus = (data: Array<{ day: string; value: number }> | null | undefined): string => {
  if (!data || data.length === 0) return 'Unknown';
  
  const values = data.map(d => d.value);
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  // Check if volatile (high variance)
  if (stdDev > 1.5) return 'Volatile';
  
  // Check trend: compare recent half vs earlier half
  const midPoint = Math.floor(values.length / 2);
  
  let recentAvg, earlierAvg;
  
  if (values.length <= 1 || midPoint === 0) {
      // Handle edge case for single or no data points to avoid division by zero
      // If we have 1 point, it's effectively stable/same average
      const val = values.length === 1 ? values[0] : 0;
      recentAvg = val;
      earlierAvg = val;
  } else {
      recentAvg = values.slice(midPoint).reduce((sum, v) => sum + v, 0) / (values.length - midPoint);
      earlierAvg = values.slice(0, midPoint).reduce((sum, v) => sum + v, 0) / midPoint;
  }
  
  // Determine improving, declining, or stable
  const diff = recentAvg - earlierAvg;
  if (diff > 0.8) return 'Improving';
  if (diff < -0.8) return 'Declining';
  
  return 'Stable';
};

export const PostPartumDashboard: React.FC = () => {
  const { 
    moodSnapshotData, 
    sleepData: postPartumSleepData, 
    avgSleep, 
    safetyAlert,
    screeningStatus,
    lastScreenedDate,
  } = usePostPartumMood();

  const moodStatus = computeMoodStatus(moodSnapshotData);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PhaseHeader
        badgeText="Recovery"
        badgeColorClass="bg-purple-50 border-purple-100 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300"
        dotColorClass="bg-purple-500"
        title="Post-Partum"
        subtitle="Focusing on healing and bonding."
        speakText="Post-Partum Dashboard. Recovery phase. Focusing on healing and bonding with your baby."
      />

      {/* Motivational Quote */}
      <div className="flex flex-col items-center justify-center text-center py-16 bg-slate-50/50 rounded-[2rem] my-4 relative">
        <Heart size={40} className="text-secondary-400 mb-6" />
        <p className="font-serif italic text-3xl md:text-4xl lg:text-5xl text-slate-800 leading-relaxed max-w-4xl px-8" style={{ fontFamily: "'DM Serif Display', serif" }}>
          You are doing amazing, mama. Every small step forward is a victory.
        </p>
        <div className="absolute top-4 right-4">
          <SpeakButton text="You are doing amazing, mama. Every small step forward is a victory." />
        </div>
      </div>

      {/* Safety Alert Banner */}
      {safetyAlert.hasAlert && (
        <SafetyAlertBanner streakCount={safetyAlert.streakCount} variant="dashboard" />
      )}

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* How are you feeling? */}
          <FeelingTracker colorScheme="secondary" />

          {/* Mood Snapshot */}
          <div className="bg-white dark:bg-dm-card rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-dm-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                  <Activity size={20} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-dm-foreground text-lg">Mood Snapshot</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Last 7 days</p>
                </div>
              </div>
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                {moodStatus}
              </span>
            </div>

            <div className="h-40 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodSnapshotData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, 5]} ticks={[2, 5]} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} />
                  <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4, fill: "#8b5cf6", stroke: "#8b5cf6", strokeWidth: 2 }} activeDot={{ r: 6, fill: "#8b5cf6" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Wellness Screening */}
          <div className="bg-gradient-to-br from-purple-500 to-secondary-600 rounded-[2rem] p-8 relative overflow-hidden">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles size={28} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg">Wellness Screening</h3>
                <p className="text-sm text-purple-100">EPDS Assessment</p>
              </div>
              <SpeakButton text={`Wellness Screening. Edinburgh Postnatal Depression Scale Assessment. Current status: ${screeningStatus || 'Not screened'}. Last screened ${lastScreenedDate || 'Never'}.`} className="text-white border-white/30 bg-white/10 hover:bg-white/20" size={12} />
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white">{screeningStatus || 'Not screened'}</h4>
                  <p className="text-sm text-purple-100">Last screened: {lastScreenedDate || 'Never'}</p>
                </div>
              </div>
            </div>

            <button 
              type="button"
              onClick={() => {
                // TODO: Connect to navigation system (setView('mind'))
                // For now, provide user feedback
                alert('EPDS Screening: This feature will navigate to the full Mental Wellness screening page.');
              }}
              className="w-full bg-white text-purple-600 py-4 rounded-xl font-bold text-sm hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
            >
              Take Full Screening
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sleep Pattern */}
        <div className="bg-white dark:bg-dm-card rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-dm-border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                <Moon size={20} className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-dm-foreground text-lg">Sleep Pattern</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">This week</p>
              </div>
            </div>
            <span className="text-purple-600 font-bold text-sm">
              Avg {avgSleep}h
            </span>
          </div>

          <div className="h-48 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={postPartumSleepData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, 10]} ticks={[0, 6, 10]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
                  formatter={(value: string | number | Array<string | number>) => {
                    // Handle arrays by taking the first element
                    const numValue = Array.isArray(value) ? value[0] : value;
                    // Convert to number and check for NaN
                    const hours = typeof numValue === 'number' ? numValue : Number(numValue);
                    return isNaN(hours) ? ['--', 'Sleep'] : [`${hours}h`, 'Sleep'];
                  }} 
                />
                <Bar dataKey="hours" fill="#8b5cf6" radius={[6, 6, 6, 6]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recovery Checklist */}
        <ChecklistCard title="Recovery Checklist" items={RECOVERY_CHECKLIST} />
      </div>
    </div>
  );
};
