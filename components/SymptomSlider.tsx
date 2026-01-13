/**
 * SymptomSlider.tsx
 * 
 * Icon-based 1-5 slider for symptom check-ins.
 * Warm, pregnancy-friendly design with soft colors.
 */

import React from 'react';

interface SymptomSliderProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    description?: string;
    /** 'symptom' = 1 is good (no symptom), 5 is bad. 'feeling' = 1 is bad, 5 is good */
    type?: 'symptom' | 'feeling';
    icon?: React.ReactNode;
}

// Soft, friendly labels
const SYMPTOM_LABELS = ['None', 'Mild', 'Moderate', 'Noticeable', 'Severe'];
const FEELING_LABELS = ['Low', 'Fair', 'Okay', 'Good', 'Great'];

export const SymptomSlider: React.FC<SymptomSliderProps> = ({
    label,
    value,
    onChange,
    description,
    type = 'symptom',
    icon
}) => {
    const labels = type === 'symptom' ? SYMPTOM_LABELS : FEELING_LABELS;

    // Warm, pregnancy-friendly color scheme
    const getButtonColor = (tick: number, isSelected: boolean): string => {
        if (!isSelected) return 'bg-white text-slate-400 border border-slate-200 hover:border-rose-200 hover:text-rose-400';

        if (type === 'symptom') {
            // Symptoms: 1-2 = soft mint, 3 = soft peach, 4-5 = soft rose
            if (tick <= 2) return 'bg-[#a8e6cf] text-emerald-800 shadow-sm';
            if (tick === 3) return 'bg-[#ffd3b6] text-amber-800 shadow-sm';
            return 'bg-[#ffaaa5] text-rose-800 shadow-sm';
        } else {
            // Feelings: 1-2 = soft rose, 3 = soft peach, 4-5 = soft mint
            if (tick <= 2) return 'bg-[#ffaaa5] text-rose-800 shadow-sm';
            if (tick === 3) return 'bg-[#ffd3b6] text-amber-800 shadow-sm';
            return 'bg-[#a8e6cf] text-emerald-800 shadow-sm';
        }
    };

    // Card background - always warm and soft
    const getCardBg = (): string => {
        return 'bg-white border-slate-100';
    };

    // Get status label styling
    const getStatusStyle = (): string => {
        if (type === 'symptom') {
            if (value <= 2) return 'text-emerald-600 bg-emerald-50';
            if (value === 3) return 'text-amber-600 bg-amber-50';
            return 'text-rose-600 bg-rose-50';
        } else {
            if (value <= 2) return 'text-rose-600 bg-rose-50';
            if (value === 3) return 'text-amber-600 bg-amber-50';
            return 'text-emerald-600 bg-emerald-50';
        }
    };

    return (
        <div className={`rounded-2xl p-4 border transition-all shadow-sm ${getCardBg()}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    {icon && <span className="text-rose-400">{icon}</span>}
                    <span className="font-bold text-slate-700 text-sm">{label}</span>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusStyle()}`}>
                    {labels[value - 1]}
                </div>
            </div>

            {description && (
                <p className="text-xs text-slate-500 mb-3">{description}</p>
            )}

            {/* Simple dot slider */}
            <div className="relative">
                {/* Track */}
                <div className="h-1.5 bg-gradient-to-r from-[#a8e6cf] via-[#ffd3b6] to-[#ffaaa5] rounded-full mb-3 opacity-50"></div>

                {/* Number buttons */}
                <div className="flex justify-between">
                    {[1, 2, 3, 4, 5].map((tick) => (
                        <button
                            key={tick}
                            onClick={() => onChange(tick)}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${getButtonColor(tick, value === tick)}`}
                        >
                            {tick}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SymptomSlider;
