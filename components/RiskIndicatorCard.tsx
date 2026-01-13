/**
 * RiskIndicatorCard.tsx
 * 
 * Card showing individual risk condition status with explanation.
 * Warm, pregnancy-friendly design with soft colors.
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Heart, Droplets, Brain } from 'lucide-react';
import { RiskIndicator } from '../services/riskEngine';

interface RiskIndicatorCardProps {
    indicator: RiskIndicator;
}

// Warm color palette
const COLORS = {
    mint: '#a8e6cf',
    mintLight: '#d4f5e6',
    peach: '#ffd3b6',
    peachLight: '#ffe8d9',
    rose: '#ffaaa5',
    roseLight: '#ffd4d1'
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

// Get colors based on level
const getLevelColors = (level: string) => {
    switch (level) {
        case 'low':
            return {
                bg: COLORS.mintLight,
                border: COLORS.mint,
                iconBg: COLORS.mint,
                text: '#2d6a4f',
                label: 'Stable'
            };
        case 'moderate':
            return {
                bg: COLORS.peachLight,
                border: COLORS.peach,
                iconBg: COLORS.peach,
                text: '#9c6644',
                label: 'Some Changes'
            };
        case 'high':
            return {
                bg: COLORS.roseLight,
                border: COLORS.rose,
                iconBg: COLORS.rose,
                text: '#a4494a',
                label: 'Needs Attention'
            };
        default:
            return {
                bg: '#f1f5f9',
                border: '#e2e8f0',
                iconBg: '#e2e8f0',
                text: '#64748b',
                label: 'Unknown'
            };
    }
};

export const RiskIndicatorCard: React.FC<RiskIndicatorCardProps> = ({ indicator }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const colors = getLevelColors(indicator.level);
    const conditionInfo = CONDITION_NAMES[indicator.condition] || {
        name: indicator.condition,
        icon: <Heart size={18} />,
        description: ''
    };

    return (
        <div
            className="rounded-2xl overflow-hidden transition-all shadow-sm"
            style={{ backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border }}
        >
            {/* Header - Always visible */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-white/30 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: colors.iconBg, color: colors.text }}
                    >
                        {conditionInfo.icon}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-700 text-sm">{conditionInfo.name}</h4>
                        <p className="text-xs text-slate-500">{conditionInfo.description}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{ backgroundColor: colors.iconBg, color: colors.text }}
                    >
                        {colors.label}
                    </div>
                    {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </div>
            </button>

            {/* Expanded content */}
            {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-white/50 pt-3">
                    {/* Explanation */}
                    <div className="bg-white/60 rounded-xl p-3">
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {indicator.explanation}
                        </p>
                    </div>

                    {/* Triggers (if any) */}
                    {indicator.triggers.length > 0 && (
                        <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2 block">
                                What We Noticed
                            </span>
                            <ul className="space-y-1">
                                {indicator.triggers.map((trigger, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
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
                        <p className="text-sm font-medium text-slate-700">
                            {indicator.recommendation}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RiskIndicatorCard;
