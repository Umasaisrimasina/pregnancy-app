/**
 * SleepPatternChart.tsx
 *
 * Bar chart showing weekly sleep pattern.
 * Extracted from PostPartumDashboard inline chart block.
 * Presentational — receives data + average via props.
 */

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Moon } from 'lucide-react';
import { CardShell } from '../ui/CardShell';

interface SleepPatternChartProps {
  data: Array<{ day: string; hours: number }> | null;
  avgSleep: number;
}

export const SleepPatternChart: React.FC<SleepPatternChartProps> = ({ data, avgSleep }) => (
  <CardShell>
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
        <BarChart data={data ?? []}>
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, 10]} ticks={[0, 6, 10]} />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            formatter={(value: string | number | Array<string | number>) => {
              const numValue = Array.isArray(value) ? value[0] : value;
              const hours = typeof numValue === 'number' ? numValue : Number(numValue);
              return isNaN(hours) ? ['--', 'Sleep'] : [`${hours}h`, 'Sleep'];
            }}
          />
          <Bar dataKey="hours" fill="#8b5cf6" radius={[6, 6, 6, 6]} barSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </CardShell>
);
