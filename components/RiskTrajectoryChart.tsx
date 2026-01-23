/**
 * RiskTrajectoryChart.tsx
 * 
 * Line chart showing risk trends over pregnancy weeks.
 * Warm, pregnancy-friendly color scheme.
 */

import React from 'react';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area } from 'recharts';
import { RiskTrajectoryPoint, RiskLevel } from '../services/riskEngine';
import { TrendingUp } from 'lucide-react';

interface RiskTrajectoryChartProps {
    trajectory: RiskTrajectoryPoint[];
    height?: number;
}

// Warm color palette
const COLORS = {
    mint: '#a8e6cf',
    peach: '#ffd3b6',
    rose: '#ffaaa5',
    mintDark: '#6bc4a6',
    peachDark: '#e8b491',
    roseDark: '#e88a85'
};

// Convert risk level to numeric for charting
function riskToNumber(level: RiskLevel): number {
    switch (level) {
        case 'low': return 1;
        case 'moderate': return 2;
        case 'high': return 3;
    }
}

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    const levelLabels: Record<number, string> = {
        1: 'Stable',
        2: 'Some Changes',
        3: 'Needs Attention'
    };
    const bgColors: Record<number, string> = {
        1: 'bg-[#a8e6cf]',
        2: 'bg-[#ffd3b6]',
        3: 'bg-[#ffaaa5]'
    };

    return (
        <div className="bg-white dark:bg-dm-card rounded-xl shadow-lg p-3 border border-slate-100 dark:border-dm-border">
            <p className="font-bold text-slate-700 text-sm mb-1">Week {label}</p>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${bgColors[data.overall]} text-slate-700`}>
                {levelLabels[data.overall]}
            </span>
        </div>
    );
};

export const RiskTrajectoryChart: React.FC<RiskTrajectoryChartProps> = ({
    trajectory,
    height = 200
}) => {
    // Transform data for chart
    const chartData = trajectory.map(point => ({
        week: point.week,
        overall: riskToNumber(point.overallLevel),
        preeclampsia: riskToNumber(point.preeclampsiaLevel),
        diabetes: riskToNumber(point.diabetesLevel),
        depression: riskToNumber(point.depressionLevel)
    }));

    if (chartData.length === 0) {
        return (
            <div className="bg-white dark:bg-dm-card rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-slate-100 dark:border-dm-border" style={{ height }}>
                <TrendingUp size={32} className="text-slate-200 mb-2" />
                <p className="text-slate-400 text-sm font-medium">Complete your first check-in to see trends</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-dm-card rounded-2xl p-5 border border-dark-700 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-primary-300" />
                    <span className="font-bold text-slate-700 text-sm">Trend Detection Over Time</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-400 dark:text-slate-500">
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.mint }}></span>
                        Stable
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.peach }}></span>
                        Changes
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.rose }}></span>
                        Attention
                    </span>
                </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={height}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="overallGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={COLORS.rose} stopOpacity={0.4} />
                            <stop offset="95%" stopColor={COLORS.rose} stopOpacity={0.05} />
                        </linearGradient>
                    </defs>

                    <XAxis
                        dataKey="week"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                        tickFormatter={(val) => `W${val}`}
                    />
                    <YAxis
                        domain={[0.5, 3.5]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#cbd5e1', fontWeight: 600 }}
                        tickFormatter={(val) => {
                            if (val === 1) return 'Ã¢€”';
                            if (val === 2) return 'Ã¢€”';
                            if (val === 3) return 'Ã¢€”';
                            return '';
                        }}
                    />
                    <Tooltip content={<CustomTooltip />} />

                    <Area
                        type="monotone"
                        dataKey="overall"
                        stroke={COLORS.roseDark}
                        strokeWidth={2.5}
                        fill="url(#overallGradient)"
                        dot={{ fill: COLORS.rose, strokeWidth: 2, stroke: '#fff', r: 5 }}
                        activeDot={{ r: 7, fill: COLORS.roseDark, stroke: '#fff', strokeWidth: 3 }}
                    />
                </AreaChart>
            </ResponsiveContainer>

            {/* Timeline dots */}
            <div className="flex justify-between items-center mt-3 px-2">
                {chartData.map((point, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <div
                            className="w-3 h-3 rounded-full shadow-sm"
                            style={{
                                backgroundColor: point.overall === 1 ? COLORS.mint :
                                    point.overall === 2 ? COLORS.peach : COLORS.rose
                            }}
                        ></div>
                        <span className="text-[9px] font-bold text-slate-400 mt-1">W{point.week}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RiskTrajectoryChart;





