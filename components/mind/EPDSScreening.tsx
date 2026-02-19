/**
 * EPDSScreening.tsx
 *
 * Self-contained Edinburgh Postnatal Depression Scale screening widget.
 * Extracted from PostPartumMind.tsx (~200 inline lines → this component).
 *
 * Includes: question stepper, progress bar, scoring, result card,
 * screening history chart, and "retake" flow.
 */

import React, { useState, useRef, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip } from 'recharts';
import { AlertCircle, Heart, Sparkles } from 'lucide-react';
import { SpeakButton } from '../SpeakButton';
import { CardShell } from '../ui/CardShell';
import {
  EPDS_QUESTIONS,
  computeEPDSResult,
  screeningHistoryData,
} from '../../config/epds.config';

// ── Component ────────────────────────────────────────────────────────────

export const EPDSScreening: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleAnswerSelect = (optionIndex: number) => {
    // Guard against rapid clicks
    if (isSelecting) return;
    
    setIsSelecting(true);
    
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentQuestion < EPDS_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      
      // Delay to allow ripple animation, safe for unmount
      const newTimer = setTimeout(() => {
         setIsSelecting(false);
         // Clear ref after execution
         timerRef.current = null;
      }, 100);
      timerRef.current = newTimer;
    } else {
      setShowResults(true);
      setIsSelecting(false);
    }
  };
  
  // Timer ref for cleanup
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
      return () => {
          if (timerRef.current) {
              clearTimeout(timerRef.current);
          }
      };
  }, []);

  const { totalScore, maxScore, isHighRisk } = computeEPDSResult(answers);

  const resetScreening = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  const pct = Math.round((currentQuestion / EPDS_QUESTIONS.length) * 100);

  return (
    <>
      {/* EPDS Clinical Wellness Screening */}
      <div className="bg-gradient-to-br from-purple-50 to-secondary-50 rounded-[2rem] p-8 shadow-sm border border-purple-100 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-secondary-500 flex items-center justify-center">
            <Sparkles size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold font-display text-slate-900 dark:text-dm-foreground">
                EPDS Wellness Screening
              </h2>
              <SpeakButton
                text="EPDS Wellness Screening: Edinburgh Postnatal Depression Scale questionnaire."
                size="sm"
              />
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Edinburgh Postnatal Depression Scale
            </p>
          </div>
        </div>

        {!showResults ? (
          <>
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
                <span>
                  Question {currentQuestion + 1} of {EPDS_QUESTIONS.length}
                </span>
                <span>{pct}% Complete</span>
              </div>
              <div className="h-2 bg-white rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-secondary-500 transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* Current Question */}
            <div className="bg-white dark:bg-dm-card rounded-2xl p-6 mb-4">
              <p className="text-sm font-medium text-slate-700 mb-4 leading-relaxed">
                {EPDS_QUESTIONS[currentQuestion].question}
              </p>
              <div className="space-y-2">
                {EPDS_QUESTIONS[currentQuestion].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(idx)}
                    disabled={isSelecting}
                    className={`w-full text-left p-3 rounded-xl border border-slate-100 dark:border-dm-border text-sm text-slate-600 hover:border-purple-300 hover:bg-purple-50 transition-all ${
                      isSelecting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Results */
          <div className="bg-white dark:bg-dm-card rounded-2xl p-6">
            <div className="text-center mb-6">
              <div
                className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  isHighRisk ? 'bg-red-100' : 'bg-purple-100'
                }`}
              >
                {isHighRisk ? (
                  <AlertCircle size={32} className="text-red-500" />
                ) : (
                  <Heart size={32} className="text-purple-500" />
                )}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-dm-foreground text-lg mb-2">
                Your Score: {totalScore}/{maxScore}
              </h3>
              <span
                className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${
                  isHighRisk ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'
                }`}
              >
                {isHighRisk ? 'Elevated Risk' : 'Low Risk'}
              </span>
            </div>

            {isHighRisk ? (
              <div className="bg-red-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-red-800 font-medium mb-3">
                  Your responses suggest you may benefit from additional support. Please consider
                  reaching out to a healthcare provider.
                </p>
                <div className="space-y-2 text-xs">
                  <p className="font-bold text-red-700">Crisis Resources:</p>
                  <p className="text-red-600">• iCall: 9152987821</p>
                  <p className="text-red-600">• Vandrevala Foundation: 1860-2662-345</p>
                </div>
              </div>
            ) : (
              <div className="bg-purple-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-purple-800">
                  Your score suggests you're coping well. Continue monitoring your mood and reach out
                  if things change.
                </p>
              </div>
            )}

            <button
              onClick={resetScreening}
              className="w-full text-center text-purple-600 font-bold text-sm hover:text-purple-700"
            >
              Retake Screening
            </button>
          </div>
        )}
      </div>

      {/* Screening History */}
      <CardShell>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold font-display text-slate-900 dark:text-dm-foreground">
            Screening History
          </h2>
        </div>

        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={screeningHistoryData}>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis hide domain={[0, 20]} />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Bar dataKey="score" radius={[4, 4, 4, 4]} barSize={28}>
                {screeningHistoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.score < 10 ? '#8b5cf6' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#8b5cf6' }} />
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Low (0-9)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ef4444' }} />
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">High (10+)</span>
          </div>
        </div>
      </CardShell>
    </>
  );
};
