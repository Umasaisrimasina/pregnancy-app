/**
 * MindPageShell.tsx
 *
 * Config-driven shared shell for the 4 simple Mind page variants:
 *   PreConceptionMind, PregnancyMind, BabyCareMind, Mind.
 *
 * Each variant passes its MindPageConfig; the shell renders the full UI.
 * Replaces 4 × ~500-line near-clones with a single ~280-line component.
 */

import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import {
  Frown, Meh, Smile, Lock, ArrowRight,
  CheckCircle2, AlertCircle, Mic, Loader2, TrendingUp,
} from 'lucide-react';
import { getSentimentBadge } from '../../services/sentimentService';
import { useMindCheckIn } from '../../hooks/useMindCheckIn';
import { ChatPanel } from '../ChatPanel';
import { SpeakButton } from '../SpeakButton';
import type { MindPageConfig, MoodType } from '../../config/mindPage.config';

/* ── Mood icon map ─────────────────────────────────────────────────── */
const MOOD_OPTIONS: { key: MoodType; icon: React.FC<any>; label: string; color: string }[] = [
  { key: 'rough', icon: Frown, label: 'Rough', color: 'bg-red-100 text-red-500' },
  { key: 'okay', icon: Meh, label: 'Okay', color: 'bg-slate-100 text-slate-500' },
  { key: 'good', icon: Smile, label: 'Good', color: 'bg-primary-100 text-primary-600' },
];

/* ── Component ─────────────────────────────────────────────────────── */

interface Props {
  config: MindPageConfig;
}

export const MindPageShell: React.FC<Props> = ({ config }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const {
    selectedMood, setSelectedMood,
    selectedFactors,
    journalText, setJournalText,
    isAnalyzing, showSuccess, lastResult,
    livePreviewSentiment, isPreviewLoading,
    sentimentTrendData,
    toggleFactor, handleCheckInSubmit,
    factors,
  } = useMindCheckIn({
    storageKey: config.storageKey,
    factors: config.factors,
    defaultFactors: config.defaultFactors,
    roughEmoji: config.roughEmoji,
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Optional Quote */}
      {config.quote && (
        <div className="bg-gradient-to-r from-primary-50 to-primary-100/50 rounded-[2rem] p-8 border border-primary-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-200 rounded-full blur-[60px] opacity-30 pointer-events-none" />
          <div className="relative flex items-start gap-4">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <config.quote.icon size={20} className="text-primary-500" />
            </div>
            <p className="text-primary-800 text-sm leading-relaxed font-medium italic">
              &ldquo;{config.quote.text}&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-display font-extrabold text-slate-900 dark:text-dm-foreground">
              {config.title}
            </h1>
            <SpeakButton text={config.speakText} />
          </div>
          <p className="text-slate-500 mt-1">{config.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── Left: Daily Check-In ───────────────────────────────────── */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white dark:bg-dm-card rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-dm-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none opacity-60" />

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold font-display text-slate-900 dark:text-dm-foreground">Daily Check-In</h2>
                <span className="text-xs font-medium text-slate-400 bg-dark-800 px-3 py-1 rounded-full">Today</span>
              </div>

              {/* Mood Selector */}
              <div className="flex justify-between max-w-md mx-auto mb-10">
                {MOOD_OPTIONS.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSelectedMood(item.key)}
                    aria-pressed={selectedMood === item.key}
                    className="flex flex-col items-center gap-2 cursor-pointer group"
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                        selectedMood === item.key
                          ? `${item.color} scale-110 shadow-lg ring-4 ring-white`
                          : 'bg-dark-800 text-slate-300 hover:bg-slate-100 dark:hover:bg-dm-accent'
                      }`}
                    >
                      <item.icon size={32} />
                    </div>
                    <span className={`text-xs font-bold ${selectedMood === item.key ? 'text-slate-900 dark:text-dm-foreground' : 'text-slate-400'}`}>
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Factors */}
              <div className="mb-8">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">What&apos;s affecting you?</label>
                <div className="flex flex-wrap gap-2">
                  {factors.map((tag, i) => (
                    <button
                      key={i}
                      onClick={() => toggleFactor(tag)}
                      className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                        selectedFactors.includes(tag)
                          ? 'bg-primary-50 border-primary-200 text-primary-700 font-medium'
                          : 'border-slate-200 dark:border-dm-border text-slate-600 dark:text-slate-300 hover:border-primary-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Journal */}
              <div className="relative mb-2">
                <textarea
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  className="w-full h-32 bg-slate-50 dark:bg-dm-muted border-0 rounded-2xl p-5 text-slate-700 resize-none focus:ring-2 focus:ring-primary-200 placeholder:text-slate-400 dark:text-slate-200 text-sm leading-relaxed"
                  placeholder="Write as much or as little as you need..."
                />
                <button 
                  className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-sm text-slate-400 cursor-not-allowed opacity-50" 
                  disabled 
                  aria-disabled="true"
                  title="Voice input coming soon"
                >
                  <Mic size={20} />
                </button>
              </div>

              {/* Live Sentiment Preview */}
              {(isPreviewLoading || livePreviewSentiment) && journalText.length >= 10 && (
                <div className="mb-4 flex items-center gap-2">
                  {isPreviewLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin text-primary-500" />
                      <span className="text-xs text-slate-400">Analyzing sentiment...</span>
                    </>
                  ) : livePreviewSentiment && (
                    <>
                      <span className="text-xs text-slate-400">Detected sentiment:</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSentimentBadge(livePreviewSentiment).className}`}>
                        {getSentimentBadge(livePreviewSentiment).icon} {getSentimentBadge(livePreviewSentiment).label}
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  onClick={handleCheckInSubmit}
                  disabled={isAnalyzing || !journalText.trim()}
                  className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <><Loader2 size={18} className="animate-spin" /> Analyzing...</>
                  ) : (
                    <><CheckCircle2 size={18} /> Save Entry</>
                  )}
                </button>
              </div>

              {/* Success / Mismatch Alert */}
              {showSuccess && lastResult && (
                <div className={`mt-6 p-4 rounded-xl border ${
                  lastResult.mismatch
                    ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/30'
                    : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/30'
                }`}>
                  <div className="flex items-start gap-3">
                    {lastResult.mismatch
                      ? <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      : <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />}
                    <div className="flex-1">
                      <p className={`font-bold text-sm mb-1 ${lastResult.mismatch ? 'text-amber-900 dark:text-amber-200' : 'text-green-900 dark:text-green-200'}`}>
                        {lastResult.mismatch ? 'We noticed something...' : 'Check-in recorded!'}
                      </p>
                      <p className={`text-xs ${lastResult.mismatch ? 'text-amber-700' : 'text-green-700'}`}>
                        {lastResult.mismatch
                          ? "Your selected mood and the sentiment in your text don't quite match. It's okay to not be okay."
                          : 'Your daily sentiment has been recorded. Keep tracking how you feel each day.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Right: Stats & AI ─────────────────────────────────────── */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          {/* Sentiment Trends Chart */}
          <div className="bg-white dark:bg-dm-card rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-dm-border">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-teal-100 flex items-center justify-center">
                  <TrendingUp size={20} className="text-primary-600" />
                </div>
                <h2 className="text-lg font-bold font-display text-slate-900 dark:text-dm-foreground">Sentiment Trends</h2>
              </div>
              <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-md">Last 7 Days</span>
            </div>

            <div className="h-48 w-full">
              {sentimentTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sentimentTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                      formatter={(value: number, name: string) => [
                        `${value.toFixed(0)}%`,
                        name === 'score' ? 'Text Sentiment' : 'Selected Mood',
                      ]}
                    />
                    <Line
                      type="monotone" dataKey="score" stroke={config.sentimentChartColor}
                      strokeWidth={3} name="score"
                      dot={{ r: 5, fill: config.sentimentChartColor, stroke: '#ffffff', strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone" dataKey="moodScore" stroke="#3b82f6"
                      strokeWidth={2} strokeDasharray="5 5" name="moodScore"
                      dot={{ r: 4, fill: '#3b82f6', stroke: '#ffffff', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                  <p>Complete check-ins to see your sentiment trends</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5" style={{ backgroundColor: config.sentimentChartColor }} />
                <span className="text-xs text-slate-600 dark:text-slate-300">Text Sentiment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 border-b-2 border-dashed border-blue-500" />
                <span className="text-xs text-slate-600 dark:text-slate-300">Selected Mood</span>
              </div>
            </div>
          </div>

          {/* Chat Promo Card */}
          <div
            onClick={() => setIsChatOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsChatOpen(true);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Open ${config.chatTitle}`}
            className="bg-dark-950 rounded-[2rem] p-8 text-white relative overflow-hidden group cursor-pointer shadow-xl shadow-dark-950/10 hover:shadow-dark-950/20 transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500 rounded-full blur-[60px] opacity-20" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4 backdrop-blur-sm">
                <Lock size={20} className="text-primary-300" />
              </div>
              <h3 className="text-lg font-bold font-display mb-2">{config.chatTitle}</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">{config.chatPromoDescription}</p>
              <div className="flex items-center gap-2 text-sm font-bold text-primary-300 group-hover:text-primary-200 transition-colors">
                Start Secure Session <ArrowRight size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      <ChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        title={config.chatTitle}
        icon={<Lock size={18} className="text-primary-400" />}
        chatContext={config.chatContext}
        initialMessage={config.initialChatMessage}
        fallbackResponse={config.fallbackChatResponse}
      />
    </div>
  );
};
