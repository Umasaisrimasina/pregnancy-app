import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Heart, Droplets, Brain } from 'lucide-react';
import { RiskIndicator } from '../services/riskEngine';
import { useTheme } from '../contexts/ThemeContext';

interface RiskIndicatorCardProps {
    indicator: RiskIndicator;
}

// Warm color palette - Light Mode
const COLORS_LIGHT = {
    mint: '#a8e6cf',
    mintLight: '#d4f5e6',
    peach: '#ffd3b6',
    peachLight: '#ffe8d9',
    rose: '#ffaaa5',
    roseLight: '#ffd4d1'
};

// Warm color palette - Dark Mode (Deep, rich tones)
const COLORS_DARK = {
    mint: '#059669', // Emerald 600
    mintLight: 'rgba(5, 150, 105, 0.1)', // Emerald 900/10
    peach: '#d97706', // Amber 600
    peachLight: 'rgba(217, 119, 6, 0.1)', // Amber 900/10
    rose: '#be123c', // Rose 700
    roseLight: 'rgba(190, 18, 60, 0.1)' // Rose 900/10
};

// Friendly names for conditions
const CONDITION_NAMES: Record<string, { name: string; icon: React.ReactNode; description: string }> = {
    preeclampsia: {
        name: 'Blood Pressure Health',
        icon: <Heart size={18} />,
        description: 'Monitoring blood pressure patterns'
    },
    gestational_diabetes: {
        name: 'Energy & Blood Sugar',
        icon: <Droplets size={18} />,
        description: 'Tracking energy and blood sugar'
    },
    depression: {
        name: 'Emotional Wellbeing',
        icon: <Brain size={18} />,
        description: 'Supporting your mental health'
    }
};

// Get colors based on level and theme
const getLevelColors = (level: string, theme: 'light' | 'dark') => {
    const palette = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;

    switch (level) {
        case 'low':
            return {
                bg: palette.mintLight,
                border: palette.mint,
                iconBg: theme === 'dark' ? 'rgba(5, 150, 105, 0.2)' : palette.mint,
                text: theme === 'dark' ? '#34d399' : '#2d6a4f',
                label: 'Stable'
            };
        case 'moderate':
            return {
                bg: palette.peachLight,
                border: palette.peach,
                iconBg: theme === 'dark' ? 'rgba(217, 119, 6, 0.2)' : palette.peach,
                text: theme === 'dark' ? '#fbbf24' : '#9c6644',
                label: 'Some Changes'
            };
        case 'high':
            return {
                bg: palette.roseLight,
                border: palette.rose,
                iconBg: theme === 'dark' ? 'rgba(190, 18, 60, 0.2)' : palette.rose,
                text: theme === 'dark' ? '#fb7185' : '#a4494a',
                label: 'Needs Attention'
            };
        default:
            return {
                bg: theme === 'dark' ? '#1e293b' : '#f1f5f9',
                border: theme === 'dark' ? '#334155' : '#e2e8f0',
                iconBg: theme === 'dark' ? '#334155' : '#e2e8f0',
                text: theme === 'dark' ? '#94a3b8' : '#64748b',
                label: 'Unknown'
            };
    }
};

export const RiskIndicatorCard: React.FC<RiskIndicatorCardProps> = ({ indicator }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { theme } = useTheme();

    const colors = getLevelColors(indicator.level, theme);
    const conditionInfo = CONDITION_NAMES[indicator.condition] || {
        name: indicator.condition,
        icon: <Heart size={18} />,
        description: ''
    };

    return (
        <div
            className="rounded-2xl overflow-hidden transition-all shadow-sm"
            style={{
                backgroundColor: colors.bg,
                borderWidth: 1,
                borderColor: colors.border
            }}
        >
            {/* Header - Always visible */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-white/30 dark:hover:bg-black/20 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: colors.iconBg, color: colors.text }}
                    >
                        {conditionInfo.icon}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">{conditionInfo.name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400 dark:text-slate-500">{conditionInfo.description}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{ backgroundColor: colors.iconBg, color: colors.text }}
                    >
                        {colors.label}
                    </div>
                    {isExpanded ? <ChevronUp size={16} className="text-slate-400 dark:text-slate-400 dark:text-slate-500" /> : <ChevronDown size={16} className="text-slate-400 dark:text-slate-400 dark:text-slate-500" />}
                </div>
            </button>

            {/* Expanded content */}
            {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-white/50 dark:border-white/10 pt-3">
                    {/* Explanation */}
                    <div className="bg-white/60 dark:bg-black/20 rounded-xl p-3">
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            {indicator.explanation}
                        </p>
                    </div>

                    {/* Triggers (if any) */}
                    {indicator.triggers.length > 0 && (
                        <div>
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 block">
                                What We Noticed
                            </span>
                            <ul className="space-y-1">
                                {indicator.triggers.map((trigger, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                                        <span
                                            className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                                            style={{ backgroundColor: colors.iconBg }}
                                        ></span>
                                        {trigger}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Recommendation */}
                    <div
                        className="rounded-xl p-3"
                        style={{ backgroundColor: colors.iconBg }}
                    >
                        <span className="text-[10px] font-bold uppercase tracking-wide mb-1 block" style={{ color: colors.text }}>
                            Our Suggestion
                        </span>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {indicator.recommendation}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RiskIndicatorCard;




