/**
 * ManualVitalsModal.tsx
 * 
 * Modal component for manually entering health/fitness data.
 */

import React, { useState } from 'react';
import { X, Activity, Heart, Droplets, Brain, Moon, Volume2, Scale, Thermometer, Save, RotateCcw } from 'lucide-react';
import { useHealthData, HealthMetrics } from '../contexts/HealthDataContext';

interface ManualVitalsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Metric configuration
const METRIC_CONFIG = [
    { key: 'bloodSugar', label: 'Blood Sugar', unit: 'mg/dL', icon: Droplets, color: 'rose', min: 50, max: 300, step: 1 },
    { key: 'heartRate', label: 'Heart Rate', unit: 'bpm', icon: Heart, color: 'rose', min: 40, max: 200, step: 1 },
    { key: 'spo2', label: 'SpO2', unit: '%', icon: Activity, color: 'emerald', min: 80, max: 100, step: 1 },
    { key: 'stressLevel', label: 'Stress Level', unit: '/100', icon: Brain, color: 'purple', min: 0, max: 100, step: 1 },
    { key: 'sleepHours', label: 'Sleep', unit: 'hours', icon: Moon, color: 'indigo', min: 0, max: 24, step: 0.5 },
    { key: 'snoringMinutes', label: 'Snoring', unit: 'min', icon: Volume2, color: 'amber', min: 0, max: 480, step: 5 },
    { key: 'weight', label: 'Weight', unit: 'kg', icon: Scale, color: 'slate', min: 30, max: 200, step: 0.1 },
] as const;

export const ManualVitalsModal: React.FC<ManualVitalsModalProps> = ({ isOpen, onClose }) => {
    const { metrics, updateMetrics, resetToDefaults } = useHealthData();

    // Local form state
    const [formValues, setFormValues] = useState<Partial<HealthMetrics>>({
        bloodSugar: metrics.bloodSugar,
        heartRate: metrics.heartRate,
        spo2: metrics.spo2,
        stressLevel: metrics.stressLevel,
        sleepHours: metrics.sleepHours,
        snoringMinutes: metrics.snoringMinutes,
        weight: metrics.weight,
    });

    const handleChange = (key: keyof HealthMetrics, value: string) => {
        const numValue = parseFloat(value) || 0;
        setFormValues(prev => ({ ...prev, [key]: numValue }));
    };

    const handleSave = () => {
        updateMetrics(formValues);
        onClose();
    };

    const handleReset = () => {
        resetToDefaults();
        setFormValues({
            bloodSugar: 105,
            heartRate: 73,
            spo2: 98,
            stressLevel: 35,
            sleepHours: 7.5,
            snoringMinutes: 15,
            weight: 64.2,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white dark:bg-dm-card w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ring-1 ring-slate-900/5 dark:ring-white/10"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-400 to-primary-500 p-6 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <Activity size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold font-display text-lg">Manual Entry</h3>
                            <p className="text-primary-100 text-xs">Enter your health vitals</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 gap-4">
                        {METRIC_CONFIG.map(({ key, label, unit, icon: Icon, color, min, max, step }) => (
                            <div key={key} className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                    <Icon size={14} className={`text-${color}-500`} />
                                    {label}
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={formValues[key as keyof typeof formValues] || ''}
                                        onChange={(e) => handleChange(key as keyof HealthMetrics, e.target.value)}
                                        min={min}
                                        max={max}
                                        step={step}
                                        className="w-full bg-slate-50 dark:bg-slate-50 dark:bg-dm-muted border border-dark-700 dark:border-dm-border rounded-xl py-3 px-4 pr-16 text-slate-900 dark:text-dm-foreground font-bold focus:outline-none focus:ring-2 focus:ring-primary-400/20 focus:border-primary-300 dark:focus:border-primary-600 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 dark:text-slate-300"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 dark:text-slate-400 dark:text-slate-400 dark:text-slate-500">
                                        {unit}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Blood Pressure Section */}
                    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-dm-border dark:border-slate-100 dark:border-dm-border">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">
                            <Thermometer size={14} className="text-blue-500" />
                            Blood Pressure
                        </label>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <input
                                    type="number"
                                    placeholder="Systolic"
                                    value={formValues.systolicBP || ''}
                                    onChange={(e) => handleChange('systolicBP', e.target.value)}
                                    min={70}
                                    max={200}
                                    className="w-full bg-slate-50 dark:bg-slate-50 dark:bg-dm-muted border border-dark-700 dark:border-dm-border rounded-xl py-3 px-4 text-slate-900 dark:text-dm-foreground font-bold focus:outline-none focus:ring-2 focus:ring-primary-400/20 focus:border-primary-300 dark:focus:border-primary-600 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 dark:text-slate-300"
                                />
                                <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 block text-center">Systolic</span>
                            </div>
                            <div className="flex items-center text-slate-300 dark:text-slate-600 font-bold text-xl pb-6">/</div>
                            <div className="flex-1">
                                <input
                                    type="number"
                                    placeholder="Diastolic"
                                    value={formValues.diastolicBP || ''}
                                    onChange={(e) => handleChange('diastolicBP', e.target.value)}
                                    min={40}
                                    max={130}
                                    className="w-full bg-slate-50 dark:bg-slate-50 dark:bg-dm-muted border border-dark-700 dark:border-dm-border rounded-xl py-3 px-4 text-slate-900 dark:text-dm-foreground font-bold focus:outline-none focus:ring-2 focus:ring-primary-400/20 focus:border-primary-300 dark:focus:border-primary-600 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 dark:text-slate-300"
                                />
                                <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 block text-center">Diastolic</span>
                            </div>
                            <div className="flex items-center text-xs text-slate-400 dark:text-slate-500 font-bold pb-6">mmHg</div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 dark:bg-slate-50 dark:bg-dm-muted border-t border-slate-100 dark:border-dm-border flex gap-3">
                    <button
                        onClick={handleReset}
                        className="flex-1 py-3 px-4 border border-dark-700 dark:border-dm-accent text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-white dark:hover:bg-dm-accent transition-colors flex items-center justify-center gap-2"
                    >
                        <RotateCcw size={16} />
                        Reset
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-[2] py-3 px-4 bg-primary-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
                    >
                        <Save size={16} />
                        Save Vitals
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManualVitalsModal;





