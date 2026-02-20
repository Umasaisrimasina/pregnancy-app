/**
 * MoodSnapshotChart.tsx
 *
 * Line chart showing 7-day mood snapshot.
 * Extracted from PostPartumDashboard inline chart block.
 * Presentational — receives data + computed status via props.
 */

import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { Activity } from 'lucide-react';
import { CardShell } from '../ui/CardShell';

interface MoodSnapshotChartProps {
  data: Array<{ day: string; value: number }> | null;
  moodStatus: string;
}

export const MoodSnapshotChart: React.FC<MoodSnapshotChartProps> = ({ data, moodStatus }) => (
  <CardShell>
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
        <LineChart data={data ?? []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, 5]} ticks={[2, 5]} />
          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} />
          <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4, fill: '#8b5cf6', stroke: '#8b5cf6', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#8b5cf6' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </CardShell>
);
