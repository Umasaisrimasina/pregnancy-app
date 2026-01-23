/**
 * RiskDataContext.tsx
 * 
 * Context for managing maternal risk data across the app.
 * Handles check-in history, risk assessments, and localStorage persistence.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
    WeeklyCheckIn,
    RiskAssessment,
    RiskTrajectoryPoint,
    assessRisk,
    buildRiskTrajectory,
    generateDoctorSummary,
    RiskLevel
} from '../services/riskEngine';
import { generateActionContent } from '../services/aiService';

// ”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€
// TYPES
// ”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€

interface RiskDataContextType {
    // State
    currentWeek: number;
    checkInHistory: WeeklyCheckIn[];
    latestAssessment: RiskAssessment | null;
    riskTrajectory: RiskTrajectoryPoint[];
    chatTone: 'encouraging' | 'supportive' | 'compassionate';

    // Actions
    submitCheckIn: (checkIn: Omit<WeeklyCheckIn, 'id' | 'date'>) => RiskAssessment;
    getCheckInForWeek: (week: number) => WeeklyCheckIn | undefined;
    getDoctorSummary: () => string;
    setCurrentWeek: (week: number) => void;
    clearHistory: () => void;

    // Demo helpers
    loadDemoData: () => void;
}

// ”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€
// CONSTANTS
// ”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€

const STORAGE_KEY = 'maternal_risk_data';
const DEFAULT_WEEK = 22;

// Demo data for 90-second demo
const DEMO_CHECK_INS: Omit<WeeklyCheckIn, 'id' | 'date'>[] = [
    {
        week: 14,
        headache: 1, swelling: 1, sleepQuality: 4, fatigue: 2, mood: 4, dizziness: 1,
        bloodPressure: { systolic: 110, diastolic: 70 }
    },
    {
        week: 16,
        headache: 1, swelling: 2, sleepQuality: 4, fatigue: 2, mood: 4, dizziness: 1,
        bloodPressure: { systolic: 112, diastolic: 72 }
    },
    {
        week: 18,
        headache: 2, swelling: 3, sleepQuality: 3, fatigue: 3, mood: 3, dizziness: 2,
        bloodPressure: { systolic: 118, diastolic: 76 }
    },
    {
        week: 20,
        headache: 3, swelling: 3, sleepQuality: 3, fatigue: 3, mood: 3, dizziness: 2,
        bloodPressure: { systolic: 125, diastolic: 80 }
    },
    {
        week: 22,
        headache: 3, swelling: 4, sleepQuality: 2, fatigue: 4, mood: 2, dizziness: 3,
        bloodPressure: { systolic: 135, diastolic: 85 }
    }
];

// ”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€
// CONTEXT
// ”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€

const RiskDataContext = createContext<RiskDataContextType | undefined>(undefined);

// Load from localStorage
function loadStoredData(): { checkIns: WeeklyCheckIn[], currentWeek: number } {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const data = JSON.parse(stored);
            return {
                checkIns: data.checkIns || [],
                currentWeek: data.currentWeek || DEFAULT_WEEK
            };
        }
    } catch (error) {
        console.error('Failed to load risk data:', error);
    }
    return { checkIns: [], currentWeek: DEFAULT_WEEK };
}

// Save to localStorage
function saveData(checkIns: WeeklyCheckIn[], currentWeek: number) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ checkIns, currentWeek }));
    } catch (error) {
        console.error('Failed to save risk data:', error);
    }
}

// Determine chat tone based on risk level
function determineChatTone(level: RiskLevel): 'encouraging' | 'supportive' | 'compassionate' {
    switch (level) {
        case 'low': return 'encouraging';
        case 'moderate': return 'supportive';
        case 'high': return 'compassionate';
    }
}

// ”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€
// PROVIDER
// ”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€

export const RiskDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentWeek, setCurrentWeek] = useState(DEFAULT_WEEK);
    const [checkInHistory, setCheckInHistory] = useState<WeeklyCheckIn[]>([]);
    const [latestAssessment, setLatestAssessment] = useState<RiskAssessment | null>(null);
    const [riskTrajectory, setRiskTrajectory] = useState<RiskTrajectoryPoint[]>([]);
    const [chatTone, setChatTone] = useState<'encouraging' | 'supportive' | 'compassionate'>('encouraging');

    // Load on mount
    useEffect(() => {
        const { checkIns, currentWeek: storedWeek } = loadStoredData();
        setCheckInHistory(checkIns);
        setCurrentWeek(storedWeek);

        if (checkIns.length > 0) {
            // Rebuild trajectory and latest assessment
            const trajectory = buildRiskTrajectory(checkIns);
            setRiskTrajectory(trajectory);

            // Get latest check-in and assess
            const sorted = [...checkIns].sort((a, b) => b.week - a.week);
            const latest = sorted[0];
            const assessment = assessRisk(latest, sorted.slice(1));
            setLatestAssessment(assessment);
            setChatTone(determineChatTone(assessment.overallLevel));

            // Enrich with AI content (async)
            enrichAssessmentWithAI(assessment, storedWeek);
        }
    }, []);

    // Helper to enrich system actions with AI content
    const enrichAssessmentWithAI = async (assessment: RiskAssessment, week: number) => {
        const newActions = [...assessment.systemActions];
        let changed = false;

        for (let i = 0; i < newActions.length; i++) {
            const action = newActions[i];
            if (action.type === 'nutrition_adjust' || action.type === 'community_suggest') {
                try {
                    const response = await generateActionContent(action.type, action.description, week);
                    if (response.success && response.message) {
                        newActions[i] = { ...action, aiContent: response.message };
                        changed = true;
                    }
                } catch (e) {
                    console.error('Failed to generate AI content for action', e);
                }
            }
        }

        if (changed) {
            setLatestAssessment(prev => prev ? { ...prev, systemActions: newActions } : null);
        }
    };

    // Save on changes
    useEffect(() => {
        if (checkInHistory.length > 0) {
            saveData(checkInHistory, currentWeek);
        }
    }, [checkInHistory, currentWeek]);

    // Submit a new check-in
    const submitCheckIn = useCallback((checkIn: Omit<WeeklyCheckIn, 'id' | 'date'>): RiskAssessment => {
        const fullCheckIn: WeeklyCheckIn = {
            ...checkIn,
            id: `checkin-${Date.now()}`,
            date: new Date().toISOString()
        };

        // Update history
        setCheckInHistory(prev => {
            // Remove existing check-in for same week if any
            const filtered = prev.filter(c => c.week !== checkIn.week);
            return [...filtered, fullCheckIn];
        });

        // Get updated history for assessment
        const history = checkInHistory.filter(c => c.week !== checkIn.week);
        const assessment = assessRisk(fullCheckIn, history);

        setLatestAssessment(assessment);
        setChatTone(determineChatTone(assessment.overallLevel));

        // Enrich with AI content
        enrichAssessmentWithAI(assessment, fullCheckIn.week);

        // Update trajectory
        const allCheckIns = [...checkInHistory.filter(c => c.week !== checkIn.week), fullCheckIn];
        setRiskTrajectory(buildRiskTrajectory(allCheckIns));

        return assessment;
    }, [checkInHistory]);

    // Get check-in for a specific week
    const getCheckInForWeek = useCallback((week: number): WeeklyCheckIn | undefined => {
        return checkInHistory.find(c => c.week === week);
    }, [checkInHistory]);

    // Get doctor summary
    const getDoctorSummary = useCallback((): string => {
        if (!latestAssessment) return 'No check-in data available.';
        return generateDoctorSummary(latestAssessment, checkInHistory);
    }, [latestAssessment, checkInHistory]);

    // Clear all history
    const clearHistory = useCallback(() => {
        setCheckInHistory([]);
        setLatestAssessment(null);
        setRiskTrajectory([]);
        setChatTone('encouraging');
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    // Load demo data for 90-second demo
    const loadDemoData = useCallback(() => {
        const demoCheckIns: WeeklyCheckIn[] = DEMO_CHECK_INS.map((c, i) => ({
            ...c,
            id: `demo-${i}`,
            date: new Date(Date.now() - (DEMO_CHECK_INS.length - i) * 14 * 24 * 60 * 60 * 1000).toISOString()
        }));

        setCheckInHistory(demoCheckIns);
        setCurrentWeek(22);

        const trajectory = buildRiskTrajectory(demoCheckIns);
        setRiskTrajectory(trajectory);

        const sorted = [...demoCheckIns].sort((a, b) => b.week - a.week);
        const assessment = assessRisk(sorted[0], sorted.slice(1));
        setLatestAssessment(assessment);
        setChatTone(determineChatTone(assessment.overallLevel));

        // Enrich with AI content
        enrichAssessmentWithAI(assessment, 22);

        saveData(demoCheckIns, 22);
    }, []);

    return (
        <RiskDataContext.Provider value={{
            currentWeek,
            checkInHistory,
            latestAssessment,
            riskTrajectory,
            chatTone,
            submitCheckIn,
            getCheckInForWeek,
            getDoctorSummary,
            setCurrentWeek,
            clearHistory,
            loadDemoData
        }}>
            {children}
        </RiskDataContext.Provider>
    );
};

// ”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€
// HOOK
// ”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€

export const useRiskData = (): RiskDataContextType => {
    const context = useContext(RiskDataContext);
    if (!context) {
        throw new Error('useRiskData must be used within a RiskDataProvider');
    }
    return context;
};

export default RiskDataContext;





