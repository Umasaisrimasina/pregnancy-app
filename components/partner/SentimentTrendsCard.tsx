/**
 * SentimentTrendsCard.tsx
 *
 * Presentational chart wrapper for sentiment trend data.
 * Extracted from the pattern in MindPageShell.
 *
 * No business logic — receives data via props.
 */

import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────

export interface TrendDataPoint {
  day: string;
  score: number;
  moodScore: number;
}

interface SentimentTrendsCardProps {
  /** Chart data points (typically last 7 entries). */
  data: TrendDataPoint[];
  /** Stroke color for the primary (text sentiment) line. */
  chartColor?: string;
  /** Message shown when data is empty. */
  emptyMessage?: string;
}

// ── Component ────────────────────────────────────────────────────────────

export const SentimentTrendsCard: React.FC<SentimentTrendsCardProps> = ({
  data,
  chartColor = '#10b981',
  emptyMessage = 'Complete check-ins to see your sentiment trends',
}) => {
  return (
    <div className="bg-white dark:bg-dm-card rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-dm-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-teal-100 flex items-center justify-center">
            <TrendingUp size={20} className="text-primary-600" />
          </div>
          <h2 className="text-lg font-bold font-display text-slate-900 dark:text-dm-foreground">
            Sentiment Trends
          </h2>
        </div>
        <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-md">
          Last 7 Days
        </span>
      </div>

      <div className="h-48 w-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: number, name: string) => [
                  `${value.toFixed(0)}%`,
                  name === 'score' ? 'Text Sentiment' : 'Selected Mood',
                ]}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke={chartColor}
                strokeWidth={3}
                name="score"
                dot={{ r: 5, fill: chartColor, stroke: '#ffffff', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="moodScore"
                stroke="#3b82f6"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="moodScore"
                dot={{ r: 4, fill: '#3b82f6', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            <p>{emptyMessage}</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5" style={{ backgroundColor: chartColor }} />
          <span className="text-xs text-slate-600 dark:text-slate-300">Text Sentiment</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 border-b border-blue-500" style={{ borderStyle: 'dashed' }} />
          <span className="text-xs text-slate-600 dark:text-slate-300">Selected Mood</span>
        </div>
      </div>
    </div>
  );
};
