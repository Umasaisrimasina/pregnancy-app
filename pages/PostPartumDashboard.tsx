/**
 * PostPartumDashboard.tsx
 *
 * Post-Partum phase (mother role) dashboard view.
 * Thin composition page — delegates to extracted chart and card components.
 * Consumes: usePostPartumMood hook, sentimentService resources.
 */

import React from 'react';
import { ArrowRight, CheckCircle2, Sparkles, Heart } from 'lucide-react';
import { usePostPartumMood } from '../hooks/usePostPartumMood';
import { computeMoodStatus } from '../utils/moodAnalysis';
import { PhaseHeader } from '../components/dashboard/PhaseHeader';
import { FeelingTracker } from '../components/dashboard/FeelingTracker';
import { MoodSnapshotChart } from '../components/dashboard/MoodSnapshotChart';
import { SleepPatternChart } from '../components/dashboard/SleepPatternChart';
import { SpeakButton } from '../components/SpeakButton';
import { SafetyAlertBanner } from '../components/SafetyAlertBanner';
import { ChecklistCard } from '../components/dashboard/ChecklistCard';
import { RECOVERY_CHECKLIST } from '../config/postPartumChecklist.config';

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

      {safetyAlert.hasAlert && (
        <SafetyAlertBanner streakCount={safetyAlert.streakCount} variant="dashboard" />
      )}

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <FeelingTracker colorScheme="secondary" />
          <MoodSnapshotChart data={moodSnapshotData} moodStatus={moodStatus} />
        </div>

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
        <SleepPatternChart data={postPartumSleepData} avgSleep={avgSleep} />
        <ChecklistCard title="Recovery Checklist" items={RECOVERY_CHECKLIST} />
      </div>
    </div>
  );
};
