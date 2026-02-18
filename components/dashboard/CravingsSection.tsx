/**
 * CravingsSection.tsx
 *
 * Cravings Tracker section for PregnancyDashboard.
 * Self-contained — consumes the useCravings hook.
 */

import React from 'react';
import { Plus, Utensils, Minus, Check } from 'lucide-react';
import { useCravings } from '../../hooks/useCravings';

/* ── Emoji map for craving foods ───────────────────────────────────── */
const getCravingEmoji = (food: string): string => {
  const map: [string, string][] = [
    ['pickle', '🥒'], ['ice', '🍦'], ['spicy', '🌶️'], ['chocolate', '🍫'],
    ['fruit', '🍎'], ['sweet', '🍬'], ['sour', '🍋'], ['pizza', '🍕'],
    ['burger', '🍔'], ['fries', '🍟'], ['cake', '🍰'], ['coffee', '☕'],
  ];
  const lower = food.toLowerCase();
  return map.find(([key]) => lower.includes(key))?.[1] ?? '🍽️';
};

export const CravingsSection: React.FC = () => {
  const {
    cravings, newCraving, setNewCraving,
    newCravingIntensity, setNewCravingIntensity,
    showCravingInput, setShowCravingInput,
    addCraving, toggleCravingSatisfied, deleteCraving,
  } = useCravings();

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-[2rem] p-6 lg:p-8 border border-amber-100 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-sm">
            <Utensils size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-dm-foreground">Cravings Tracker</h2>
            <p className="text-sm text-slate-400 dark:text-slate-500">Track your pregnancy cravings and patterns</p>
          </div>
        </div>
        <button
          onClick={() => setShowCravingInput(!showCravingInput)}
          className="px-5 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-amber-200 hover:bg-amber-600 transition-all flex items-center gap-2"
        >
          <Plus size={16} /> Add Craving
        </button>
      </div>

      {/* Add Input */}
      {showCravingInput && (
        <div className="bg-white dark:bg-dm-card rounded-2xl p-5 mb-6 border border-amber-100 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">What are you craving?</label>
              <input
                type="text"
                value={newCraving}
                onChange={(e) => setNewCraving(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && newCraving.trim()) { e.preventDefault(); addCraving(); } }}
                placeholder="e.g., Pickles, Ice cream, Spicy food..."
                className="w-full px-4 py-3 rounded-xl border border-slate-100 dark:border-dm-border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="md:w-48">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Intensity</label>
              <div className="flex gap-2">
                {(['mild', 'moderate', 'strong'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setNewCravingIntensity(level)}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold capitalize transition-all ${
                      newCravingIntensity === level
                        ? level === 'mild'
                          ? 'bg-green-500 text-white'
                          : level === 'moderate'
                            ? 'bg-amber-500 text-white'
                            : 'bg-red-500 text-white'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={addCraving}
                disabled={!newCraving.trim()}
                className="px-6 py-3 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cravings List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cravings.map((craving) => (
          <div
            key={craving.id}
            className={`bg-white dark:bg-dm-card rounded-2xl p-4 border transition-all hover:shadow-md ${craving.satisfied ? 'border-green-200 bg-green-50/50' : 'border-amber-100'}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getCravingEmoji(craving.food)}</span>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-dm-foreground">{craving.food}</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {new Date(craving.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <button onClick={() => deleteCraving(craving.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                <Minus size={16} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  craving.intensity === 'mild'
                    ? 'bg-green-100 text-green-700'
                    : craving.intensity === 'moderate'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-red-100 text-red-700'
                }`}
              >
                {craving.intensity}
              </span>
              <button
                onClick={() => toggleCravingSatisfied(craving.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  craving.satisfied ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                <Check size={12} />
                {craving.satisfied ? 'Satisfied' : 'Mark Satisfied'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      {cravings.length > 0 && (
        <div className="mt-6 pt-6 border-t border-amber-200">
          <div className="flex flex-wrap gap-6 text-center">
            <div className="flex-1 min-w-[120px]">
              <span className="text-3xl font-display font-bold text-slate-900 dark:text-dm-foreground">{cravings.length}</span>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Total Cravings</p>
            </div>
            <div className="flex-1 min-w-[120px]">
              <span className="text-3xl font-display font-bold text-green-600">{cravings.filter((c) => c.satisfied).length}</span>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Satisfied</p>
            </div>
            <div className="flex-1 min-w-[120px]">
              <span className="text-3xl font-display font-bold text-red-500">{cravings.filter((c) => c.intensity === 'strong').length}</span>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Strong Cravings</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
