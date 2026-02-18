/**
 * BloodSugarTrendChart.tsx
 *
 * Line chart for blood sugar trend visualization.
 * Presentational — chart data via props.
 */

import React from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

interface TrendDataPoint {
  day: string;
  value: number;
}

interface BloodSugarTrendChartProps {
  data: TrendDataPoint[];
  title?: string;
  legendLabel?: string;
  strokeColor?: string;
  yDomain?: [number, number];
}

export const BloodSugarTrendChart: React.FC<BloodSugarTrendChartProps> = ({
  data,
  title = 'Long-term Trend: Blood Sugar',
  legendLabel = 'Blood Sugar (mg/dL)',
  strokeColor = '#f43f5e',
  yDomain = [90, 140],
}) => {
  return (
    <div className="mb-8">
      <h3 className="font-bold text-slate-900 dark:text-dm-foreground mb-6">{title}</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.1} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
            <YAxis hide domain={yDomain} />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'var(--tooltip-bg, white)',
                color: 'var(--tooltip-text, #1e293b)',
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={strokeColor}
              strokeWidth={3}
              dot={{ r: 4, fill: strokeColor, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: strokeColor, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex justify-center mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: strokeColor }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: strokeColor }}>{legendLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
