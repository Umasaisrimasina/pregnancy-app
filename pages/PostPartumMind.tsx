/**
 * PostPartumMind.tsx
 *
 * Post-Partum "Stress & Mind" page.
 * Unique features: 7-emoji selector, EPDS screening, safety alerts.
 *
 * Refactored: EPDS  EPDSScreening component, safety alert  SafetyAlertBanner,
 * screening history + questions  epds.config.ts.
 */

import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Lock, ArrowRight, Heart, AlertCircle, CheckCircle2, Loader2, TrendingUp } from 'lucide-react';
import { AppPhase } from '../types';
import { SpeakButton } from '../components/SpeakButton';
import { ChatPanel } from '../components/ChatPanel';
import { EPDSScreening } from '../components/mind/EPDSScreening';
import { SafetyAlertBanner } from '../components/SafetyAlertBanner';
import {
  analyzeSentiment,
  getSentimentBadge,
  checkEmojiMismatch,
  sentimentToScore,
  DailyCheckIn,
  getCheckIns,
  saveCheckIn,
  generateDemoCheckIns,
  detectNegativeStreak,
  SentimentLabel,
} from '../services/sentimentService';

interface PageProps {
  phase: AppPhase;
}

const AVAILABLE_EMOJIS = ['', '', '', '', '', '', ''] as const;

const emojiToMoodScore = (emoji: string): number => {
  const scores: Record<string, number> = {
    '': 90, '': 75, '': 50, '': 30, '': 15, '': 95, '': 85, '': 20, '': 25,
  };
  return scores[emoji] ?? 50;
};

export const PostPartumMind: React.FC<PageProps> = ({ phase }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  //  Daily Check-in State 
  const [checkInText, setCheckInText] = useState('');
  const [checkInEmoji, setCheckInEmoji] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>(() => {
    const stored = getCheckIns();
    return stored.length > 0 ? stored : generateDemoCheckIns();
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastResult, setLastResult] = useState<{ sentiment: SentimentLabel; mismatch: boolean } | null>(null);

  const safetyAlert = detectNegativeStreak(checkIns, 3);

  //  Live Sentiment Preview 
  const [livePreview, setLivePreview] = useState<SentimentLabel | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  useEffect(() => {
    if (!checkInText.trim() || checkInText.length < 10) { setLivePreview(null); return; }
    const id = setTimeout(async () => {
      setIsPreviewLoading(true);
      try { setLivePreview((await analyzeSentiment(checkInText)).sentiment); }
      catch { /* ignore */ }
      finally { setIsPreviewLoading(false); }
    }, 500);
    return () => clearTimeout(id);
  }, [checkInText]);

  //  Submit 
  const handleCheckInSubmit = async () => {
    if (!checkInText.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeSentiment(checkInText);
      const mismatch = checkEmojiMismatch(checkInEmoji, result.sentiment);
      const newCheckIn: DailyCheckIn = {
        id: `checkin-${Date.now()}`,
        date: new Date().toISOString(),
        text: checkInText,
        emoji: checkInEmoji,
        sentiment: result.sentiment,
        confidenceScores: result.confidenceScores,
        sentimentScore: sentimentToScore(result.sentiment, result.confidenceScores),
        emojiMismatch: mismatch,
      };
      saveCheckIn(newCheckIn);
      setCheckIns(prev => [...prev, newCheckIn]);
      setLastResult({ sentiment: result.sentiment, mismatch });
      setShowSuccess(true);
      setCheckInText('');
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) { console.error('Check-in error:', error); }
    finally { setIsAnalyzing(false); }
  };

  //  Chart Data 
  const sentimentTrendData = checkIns.slice(-7).map((ci) => ({
    day: new Date(ci.date).toLocaleDateString('en-US', { weekday: 'short' }),
    score: (ci.sentimentScore + 1) * 50,
    moodScore: emojiToMoodScore(ci.emoji),
  }));

  //  Render 
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">

      {/* Motivational Quote */}
      <div className="flex flex-col items-center justify-center text-center py-16 bg-slate-50/50 rounded-[2rem] my-4">
        <div className="flex items-center gap-3 mb-6">
          <Heart size={40} className="text-purple-400" />
          <SpeakButton text="Healing takes time, and that's okay. You're doing an incredible job." size="sm" />
        </div>
        <p className="font-serif italic text-3xl md:text-4xl lg:text-5xl text-slate-800 leading-relaxed max-w-4xl px-8" style={{ fontFamily: "'DM Serif Display', serif" }}>
          Healing takes time, and that&apos;s okay. You&apos;re doing an incredible job.
        </p>
      </div>

      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-display font-extrabold text-slate-900 dark:text-dm-foreground">Stress & Mind</h1>
            <SpeakButton text="Stress and Mind: Your postpartum mental wellness companion." size="sm" />
          </div>
          <p className="text-slate-500 mt-1">Your postpartum mental wellness companion.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/*  Left Column  */}
        <div className="lg:col-span-7 flex flex-col gap-6">

          {/* Daily Check-In */}
          <div className="bg-white dark:bg-dm-card rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-dm-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none opacity-60" />
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold font-display text-slate-900 dark:text-dm-foreground">Daily Check-In</h2>
                  <SpeakButton text="Daily Check-In: How are you feeling today?" size="sm" />
                </div>
                <span className="text-xs font-medium text-slate-400 bg-dark-800 px-3 py-1 rounded-full">Today</span>
              </div>

              {/* Emoji Selector */}
              <div className="mb-6">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">How are you feeling?</label>
                <div className="flex justify-between max-w-lg gap-2">
                  {AVAILABLE_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setCheckInEmoji(emoji)}
                      className={`text-4xl p-3 rounded-2xl transition-all duration-300 ${
                        checkInEmoji === emoji
                          ? 'bg-purple-100 scale-110 ring-4 ring-purple-200'
                          : 'bg-dark-800 hover:bg-slate-100 dark:hover:bg-dm-accent'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input */}
              <div className="mb-6">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Tell us more about your day...</label>
                <textarea
                  value={checkInText}
                  onChange={(e) => setCheckInText(e.target.value)}
                  className="w-full h-32 bg-slate-50 dark:bg-dm-muted border-0 rounded-2xl p-5 text-slate-700 resize-none focus:ring-2 focus:ring-purple-200 placeholder:text-slate-400 dark:text-slate-500 text-sm leading-relaxed"
                  placeholder="How are you feeling today? What's on your mind?"
                />

                {/* Live Sentiment Preview */}
                {(isPreviewLoading || livePreview) && (
                  <div className="mt-3 flex items-center gap-2">
                    {isPreviewLoading ? (
                      <>
                        <Loader2 size={14} className="animate-spin text-purple-500" />
                        <span className="text-xs text-slate-400">Analyzing sentiment...</span>
                      </>
                    ) : livePreview && (
                      <>
                        <span className="text-xs text-slate-400">Detected sentiment:</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSentimentBadge(livePreview).className}`}>
                          {getSentimentBadge(livePreview).icon} {getSentimentBadge(livePreview).label}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  onClick={handleCheckInSubmit}
                  disabled={isAnalyzing || !checkInText.trim()}
                  className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isAnalyzing ? (<><Loader2 size={18} className="animate-spin" /> Analyzing...</>) : (<><CheckCircle2 size={18} /> Submit Check-In</>)}
                </button>
              </div>

              {/* Success / Mismatch Alert */}
              {showSuccess && lastResult && (
                <div className={`mt-6 p-4 rounded-xl border ${lastResult.mismatch ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
                  <div className="flex items-start gap-3">
                    {lastResult.mismatch
                      ? <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      : <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />}
                    <div className="flex-1">
                      <p className={`font-bold text-sm mb-1 ${lastResult.mismatch ? 'text-amber-900' : 'text-green-900'}`}>
                        {lastResult.mismatch ? 'We noticed something...' : 'Check-in recorded!'}
                      </p>
                      <p className={`text-xs ${lastResult.mismatch ? 'text-amber-700' : 'text-green-700'}`}>
                        {lastResult.mismatch
                          ? "Your emoji and the sentiment in your text don't quite match. Sometimes we mask our feelings. It's okay to not be okay. Would you like to talk to someone?"
                          : 'Your daily sentiment has been recorded. Keep tracking how you feel each day.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sentiment Trends Chart */}
          <div className="bg-white dark:bg-dm-card rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-dm-border">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-secondary-100 flex items-center justify-center">
                  <TrendingUp size={20} className="text-purple-600" />
                </div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold font-display text-slate-900 dark:text-dm-foreground">Sentiment Trends</h2>
                  <SpeakButton text="Sentiment Trends: Your weekly sentiment chart based on daily check-ins." size="sm" />
                </div>
              </div>
              <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">Last 7 Days</span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sentimentTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                    formatter={(value: number, name: string) => [`${value.toFixed(0)}%`, name === 'score' ? 'Text Sentiment' : 'Selected Mood']}
                  />
                  <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} name="score" dot={{ r: 5, fill: '#8b5cf6', stroke: '#ffffff', strokeWidth: 2 }} activeDot={{ r: 7, fill: '#8b5cf6', stroke: '#ffffff', strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="moodScore" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" name="moodScore" dot={{ r: 4, fill: '#3b82f6', stroke: '#ffffff', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#3b82f6', stroke: '#ffffff', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-purple-500" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Text Sentiment (AI analyzed)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 border-t-2 border-blue-500" style={{ borderStyle: 'dashed' }} />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Selected Mood (emoji)</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-3">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /><span className="text-xs text-slate-400 dark:text-slate-500">Negative (0-33%)</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500" /><span className="text-xs text-slate-400 dark:text-slate-500">Neutral (34-66%)</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500" /><span className="text-xs text-slate-400 dark:text-slate-500">Positive (67-100%)</span></div>
            </div>
          </div>
        </div>

        {/*  Right Column  */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          {/* Safety Alert */}
          {safetyAlert.hasAlert && (
            <SafetyAlertBanner
              streakCount={safetyAlert.streakCount}
              maxResources={2}
              ctaLabel="View All Resources"
              variant="compact"
            />
          )}

          {/* EPDS Screening + Screening History */}
          <EPDSScreening />

          {/* Silent Chat Promo */}
          <div
            onClick={() => setIsChatOpen(true)}
            className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group cursor-pointer shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-[60px] opacity-20" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4 backdrop-blur-sm">
                <Lock size={20} className="text-purple-300" />
              </div>
              <h3 className="text-lg font-bold font-display mb-2">Silent Chat</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Need to vent in a safe, anonymous space? Our AI companion is here to listen without judgment.
              </p>
              <div className="flex items-center gap-2 text-sm font-bold text-purple-300 group-hover:text-purple-200 transition-colors">
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
        title="Silent Chat"
        icon={<Lock size={18} className="text-purple-400" />}
        chatContext="postpartum"
        initialMessage="Welcome to your safe space. How are you feeling today, mama?"
        fallbackResponse="Thank you for sharing. It takes courage to express these feelings. Remember, your emotions are valid, and recovery takes time. Would you like to explore some coping strategies together?"
        headerClassName="bg-slate-900"
      />
    </div>
  );
};
