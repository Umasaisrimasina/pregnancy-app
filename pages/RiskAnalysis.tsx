/**
 * RiskAnalysis.tsx
 * 
 * Risk Analysis page with weekly check-in form, risk output panel,
 * and temporal risk trajectory visualization.
 */

import React, { useState, useEffect } from 'react';
import {
    ClipboardCheck,
    Brain,
    Moon,
    Zap,
    Droplets,
    HeadphonesIcon,
    Activity,
    Heart,
    Scale,
    Send,
    RefreshCw,
    FileText,
    AlertCircle,
    CheckCircle2,
    Sparkles
} from 'lucide-react';
import { useRiskData } from '../contexts/RiskDataContext';
import { SymptomSlider } from '../components/SymptomSlider';
import { RiskTrajectoryChart } from '../components/RiskTrajectoryChart';
import { RiskIndicatorCard } from '../components/RiskIndicatorCard';
import { getRiskLevelDisplay, DISCLAIMER, WeeklyCheckIn } from '../services/riskEngine';
import { SpeakButton } from '../components/SpeakButton';
import { generateRiskInsight, generateSelfCareSuggestion } from '../services/aiService';

export const RiskAnalysis: React.FC = () => {
    const {
        currentWeek,
        latestAssessment,
        riskTrajectory,
        submitCheckIn,
        getCheckInForWeek,
        getDoctorSummary,
        loadDemoData,
        clearHistory
    } = useRiskData();

    // Form state
    const [formData, setFormData] = useState({
        headache: 1,
        swelling: 1,
        sleepQuality: 4,
        fatigue: 1,
        mood: 4,
        dizziness: 1,
        systolic: '',
        diastolic: '',
        bloodSugar: '',
        activityLevel: 3
    });

    const [showDoctorSummary, setShowDoctorSummary] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [justSubmitted, setJustSubmitted] = useState(false);

    // AI Insight state
    const [aiInsight, setAiInsight] = useState<string | null>(null);
    const [selfCareTip, setSelfCareTip] = useState<string | null>(null);
    const [isLoadingInsight, setIsLoadingInsight] = useState(false);

    // Load existing check-in for current week
    useEffect(() => {
        const existing = getCheckInForWeek(currentWeek);
        if (existing) {
            setFormData({
                headache: existing.headache,
                swelling: existing.swelling,
                sleepQuality: existing.sleepQuality,
                fatigue: existing.fatigue,
                mood: existing.mood,
                dizziness: existing.dizziness,
                systolic: existing.bloodPressure?.systolic?.toString() || '',
                diastolic: existing.bloodPressure?.diastolic?.toString() || '',
                bloodSugar: existing.bloodSugar?.toString() || '',
                activityLevel: existing.activityLevel || 3
            });
        }
    }, [currentWeek, getCheckInForWeek]);

    // Handle form submission
    const handleSubmit = async () => {
        setIsSubmitting(true);

        const checkIn: Omit<WeeklyCheckIn, 'id' | 'date'> = {
            week: currentWeek,
            headache: formData.headache,
            swelling: formData.swelling,
            sleepQuality: formData.sleepQuality,
            fatigue: formData.fatigue,
            mood: formData.mood,
            dizziness: formData.dizziness,
            activityLevel: formData.activityLevel,
            ...(formData.systolic && formData.diastolic ? {
                bloodPressure: {
                    systolic: parseInt(formData.systolic),
                    diastolic: parseInt(formData.diastolic)
                }
            } : {}),
            ...(formData.bloodSugar ? {
                bloodSugar: parseInt(formData.bloodSugar)
            } : {})
        };

        // Simulate slight delay for UX
        await new Promise(resolve => setTimeout(resolve, 500));

        submitCheckIn(checkIn);
        setIsSubmitting(false);
        setJustSubmitted(true);

        setTimeout(() => setJustSubmitted(false), 3000);

        // Generate AI insight after submission
        generateAIInsight();
    };

    // Generate AI-powered insight
    const generateAIInsight = async () => {
        if (!latestAssessment) return;

        setIsLoadingInsight(true);
        setAiInsight(null);
        setSelfCareTip(null);

        try {
            // Get personalized insight
            const insightResult = await generateRiskInsight({
                overallLevel: latestAssessment.overallLevel,
                week: currentWeek,
                indicators: latestAssessment.indicators.map(i => ({
                    condition: i.condition,
                    level: i.level,
                    triggers: i.triggers
                }))
            });

            if (insightResult.success && insightResult.message) {
                setAiInsight(insightResult.message);
            }

            // Get self-care suggestion
            const careResult = await generateSelfCareSuggestion(
                {
                    headache: formData.headache,
                    fatigue: formData.fatigue,
                    mood: formData.mood,
                    sleepQuality: formData.sleepQuality
                },
                currentWeek
            );

            if (careResult.success && careResult.message) {
                setSelfCareTip(careResult.message);
            }
        } catch (error) {
            console.error('Failed to generate AI insight:', error);
        } finally {
            setIsLoadingInsight(false);
        }
    };

    const riskDisplay = latestAssessment
        ? getRiskLevelDisplay(latestAssessment.overallLevel)
        : null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-500 text-white flex items-center justify-center shadow-lg shadow-primary-200">
                        <ClipboardCheck size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-dm-foreground">Risk Analysis</h1>
                        <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">Weekly check-in • Week {currentWeek}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={loadDemoData}
                        className="px-3 py-2 text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:text-dm-foreground hover:bg-slate-50 dark:bg-dm-muted rounded-lg transition-colors"
                    >
                        Load Demo
                    </button>
                    <button
                        onClick={clearHistory}
                        className="px-3 py-2 text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-primary-300 hover:bg-primary-800/20 rounded-lg transition-colors"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-slate-50 dark:bg-dm-muted border border-slate-100 dark:border-dm-border rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle size={18} className="text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <span className="font-bold">Not a diagnosis.</span> This tool helps notice early changes in your health patterns.
                    Always consult your healthcare provider for medical advice. {DISCLAIMER}
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Column - Check-in Form */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Symptom Check-in Card */}
                    <div className="bg-white dark:bg-dm-card rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-dm-border">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-lg text-slate-900 dark:text-dm-foreground flex items-center gap-2">
                                <Sparkles size={18} className="text-primary-400" />
                                Weekly Check-In
                            </h2>
                            <SpeakButton
                                text={`Weekly check-in for week ${currentWeek}. Rate your symptoms on a scale of 1 to 5. 1 means no symptoms, 5 means severe.`}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <SymptomSlider
                                label="Headache"
                                value={formData.headache}
                                onChange={(v) => setFormData(p => ({ ...p, headache: v }))}
                                type="symptom"
                                icon={<HeadphonesIcon size={16} />}
                            />
                            <SymptomSlider
                                label="Swelling"
                                value={formData.swelling}
                                onChange={(v) => setFormData(p => ({ ...p, swelling: v }))}
                                type="symptom"
                                icon={<Droplets size={16} />}
                            />
                            <SymptomSlider
                                label="Sleep Quality"
                                value={formData.sleepQuality}
                                onChange={(v) => setFormData(p => ({ ...p, sleepQuality: v }))}
                                type="feeling"
                                icon={<Moon size={16} />}
                            />
                            <SymptomSlider
                                label="Fatigue"
                                value={formData.fatigue}
                                onChange={(v) => setFormData(p => ({ ...p, fatigue: v }))}
                                type="symptom"
                                icon={<Zap size={16} />}
                            />
                            <SymptomSlider
                                label="Mood"
                                value={formData.mood}
                                onChange={(v) => setFormData(p => ({ ...p, mood: v }))}
                                type="feeling"
                                icon={<Brain size={16} />}
                            />
                            <SymptomSlider
                                label="Dizziness"
                                value={formData.dizziness}
                                onChange={(v) => setFormData(p => ({ ...p, dizziness: v }))}
                                type="symptom"
                                icon={<RefreshCw size={16} />}
                            />
                        </div>

                        {/* Optional Clinical Inputs */}
                        <div className="border-t border-slate-100 dark:border-dm-border pt-6">
                            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
                                Optional: Clinical Readings
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Blood Pressure */}
                                <div className="bg-slate-50 dark:bg-dm-muted rounded-xl p-4 border border-slate-100 dark:border-dm-border">
                                    <label className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                        <Heart size={14} className="text-primary-300" />
                                        Blood Pressure
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            placeholder="120"
                                            value={formData.systolic}
                                            onChange={(e) => setFormData(p => ({ ...p, systolic: e.target.value }))}
                                            className="w-full bg-white dark:bg-white dark:bg-dm-background border border-slate-100 dark:border-dm-border rounded-xl px-3 py-2.5 text-sm font-bold text-center text-slate-900 dark:text-dm-foreground placeholder:text-slate-400 dark:text-slate-500 focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 transition-all"
                                        />
                                        <span className="text-slate-400 dark:text-slate-500 font-bold">/</span>
                                        <input
                                            type="number"
                                            placeholder="80"
                                            value={formData.diastolic}
                                            onChange={(e) => setFormData(p => ({ ...p, diastolic: e.target.value }))}
                                            className="w-full bg-white dark:bg-white dark:bg-dm-background border border-slate-100 dark:border-dm-border rounded-xl px-3 py-2.5 text-sm font-bold text-center text-slate-900 dark:text-dm-foreground placeholder:text-slate-400 dark:text-slate-500 focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 transition-all"
                                        />
                                    </div>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block text-center">mmHg</span>
                                </div>

                                {/* Blood Sugar */}
                                <div className="bg-slate-50 dark:bg-dm-muted rounded-xl p-4 border border-slate-100 dark:border-dm-border">
                                    <label className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                        <Droplets size={14} className="text-amber-400" />
                                        Blood Sugar
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="100"
                                        value={formData.bloodSugar}
                                        onChange={(e) => setFormData(p => ({ ...p, bloodSugar: e.target.value }))}
                                        className="w-full bg-white dark:bg-white dark:bg-dm-background border border-slate-100 dark:border-dm-border rounded-xl px-3 py-2.5 text-sm font-bold text-center text-slate-900 dark:text-dm-foreground placeholder:text-slate-400 dark:text-slate-500 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                                    />
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block text-center">mg/dL</span>
                                </div>

                                {/* Activity Level */}
                                <div className="bg-slate-50 dark:bg-dm-muted rounded-xl p-4 border border-slate-100 dark:border-dm-border">
                                    <label className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                        <Activity size={14} className="text-teal-500" />
                                        Activity Level
                                    </label>
                                    <div className="flex justify-between mt-1">
                                        {[1, 2, 3, 4, 5].map((level) => (
                                            <button
                                                key={level}
                                                onClick={() => setFormData(p => ({ ...p, activityLevel: level }))}
                                                className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${formData.activityLevel === level
                                                    ? 'bg-teal-400 text-white shadow-sm'
                                                    : 'bg-dark-950 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-dm-border hover:border-teal-500/50'
                                                    }`}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block text-center">1=sedentary, 5=very active</span>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6">
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${justSubmitted
                                    ? 'bg-primary-500 shadow-primary-200'
                                    : 'bg-gradient-to-r from-primary-400 to-primary-500 shadow-primary-200 hover:shadow-xl'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <RefreshCw size={18} className="animate-spin" />
                                        Analyzing...
                                    </>
                                ) : justSubmitted ? (
                                    <>
                                        <CheckCircle2 size={18} />
                                        Check-In Saved!
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Submit Check-In
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Risk Trajectory Chart */}
                    <RiskTrajectoryChart trajectory={riskTrajectory} height={180} />
                </div>

                {/* Right Column - Risk Output */}
                <div className="space-y-6">
                    {/* Overall Status Card */}
                    {riskDisplay && latestAssessment && (
                        <div className={`rounded-[2rem] p-6 border-2 ${riskDisplay.bgColor} ${riskDisplay.borderColor}`}>
                            <div className="text-center mb-4">
                                <span className="text-5xl">{riskDisplay.icon}</span>
                                <h3 className={`text-xl font-bold mt-2 ${riskDisplay.color}`}>
                                    {riskDisplay.label}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                                    {riskDisplay.message}
                                </p>
                            </div>

                            {/* System Actions */}
                            {latestAssessment.systemActions.length > 0 && (
                                <div className="bg-slate-50 dark:bg-slate-50 dark:bg-dm-background/50 rounded-xl p-4 mt-4">
                                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-2 block">
                                        What the system is doing
                                    </span>
                                    <ul className="space-y-2">
                                        {latestAssessment.systemActions.map((action, i) => (
                                            <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                                                <CheckCircle2 size={14} className="text-mint-500 shrink-0 mt-0.5" />
                                                {action.description}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Doctor Summary Button */}
                            {latestAssessment.overallLevel === 'high' && (
                                <button
                                    onClick={() => setShowDoctorSummary(!showDoctorSummary)}
                                    className="w-full mt-4 py-3 bg-white dark:bg-white dark:bg-dm-background border border-primary-400/30 text-primary-300 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-800/20 transition-colors"
                                >
                                    <FileText size={16} />
                                    {showDoctorSummary ? 'Hide' : 'View'} Doctor Summary
                                </button>
                            )}
                        </div>
                    )}

                    {/* AI Insight Card - Gemini Powered */}
                    {latestAssessment && (
                        <div className="bg-gradient-to-br from-purple-900/30 to-primary-800/20 rounded-2xl p-5 border border-purple-500/20 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Sparkles size={16} className="text-purple-400" />
                                    <span className="font-bold text-slate-900 dark:text-dm-foreground text-sm">AI Insight</span>
                                    <span className="text-[9px] font-bold text-purple-400 bg-purple-900/50 px-2 py-0.5 rounded-full">GEMINI</span>
                                </div>
                                <button
                                    onClick={generateAIInsight}
                                    disabled={isLoadingInsight}
                                    className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1"
                                >
                                    <RefreshCw size={12} className={isLoadingInsight ? 'animate-spin' : ''} />
                                    {isLoadingInsight ? 'Generating...' : 'Refresh'}
                                </button>
                            </div>

                            {isLoadingInsight ? (
                                <div className="flex items-center justify-center py-6">
                                    <div className="flex items-center gap-2 text-purple-400">
                                        <RefreshCw size={16} className="animate-spin" />
                                        <span className="text-sm">Generating personalized insight...</span>
                                    </div>
                                </div>
                            ) : aiInsight ? (
                                <div className="space-y-3">
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {aiInsight}
                                    </p>

                                    {selfCareTip && (
                                        <div className="bg-slate-50 dark:bg-slate-50 dark:bg-dm-background/50 rounded-xl p-3 border border-purple-500/20">
                                            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wide mb-1 block">
                                                ’œ Self-Care Tip
                                            </span>
                                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                                {selfCareTip}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-sm text-slate-400 dark:text-slate-400 dark:text-slate-500">
                                        Submit a check-in to get personalized AI insights
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Doctor Summary Modal */}
                    {showDoctorSummary && (
                        <div className="bg-white dark:bg-dm-card rounded-2xl p-4 border border-slate-100 dark:border-dm-border shadow-lg">
                            <h4 className="font-bold text-slate-900 dark:text-dm-foreground text-sm mb-3 flex items-center gap-2">
                                <FileText size={16} className="text-primary-400" />
                                Doctor-Ready Summary
                            </h4>
                            <pre className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap bg-dark-950 p-4 rounded-xl overflow-auto max-h-64">
                                {getDoctorSummary()}
                            </pre>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 text-center">
                                Show this to your healthcare provider
                            </p>
                        </div>
                    )}

                    {/* Risk Indicator Cards */}
                    {latestAssessment && (
                        <div className="space-y-3">
                            <h3 className="font-bold text-slate-900 dark:text-dm-foreground text-sm">Detailed Analysis</h3>
                            {latestAssessment.indicators.map((indicator, i) => (
                                <RiskIndicatorCard key={i} indicator={indicator} />
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!latestAssessment && (
                        <div className="bg-slate-50 dark:bg-dm-muted rounded-2xl p-8 text-center">
                            <ClipboardCheck size={40} className="text-slate-400 dark:text-slate-500 mx-auto mb-3" />
                            <h3 className="font-bold text-slate-600 dark:text-slate-300 mb-2">No Check-In Yet</h3>
                            <p className="text-sm text-slate-400 dark:text-slate-400 dark:text-slate-500">
                                Complete your first weekly check-in to see your risk analysis.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RiskAnalysis;






