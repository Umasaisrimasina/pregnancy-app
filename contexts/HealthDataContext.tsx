/**
 * HealthDataContext.tsx
 * 
 * Context for managing health/fitness data across the app.
 * Supports manual entry, demo mode simulation, and localStorage persistence.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// Health metrics interface
export interface HealthMetrics {
    bloodSugar: number;      // mg/dL
    heartRate: number;       // bpm
    spo2: number;            // percentage
    stressLevel: number;     // 0-100
    sleepHours: number;      // hours
    snoringMinutes: number;  // minutes
    weight: number;          // kg
    systolicBP?: number;     // mmHg
    diastolicBP?: number;    // mmHg
    lastUpdated: string;     // ISO timestamp
}

// Default initial values
const DEFAULT_METRICS: HealthMetrics = {
    bloodSugar: 105,
    heartRate: 73,
    spo2: 98,
    stressLevel: 35,
    sleepHours: 7.5,
    snoringMinutes: 15,
    weight: 64.2,
    systolicBP: 120,
    diastolicBP: 80,
    lastUpdated: new Date().toISOString()
};

// Storage key
const STORAGE_KEY = 'health_metrics_data';

// Context interface
interface HealthDataContextType {
    metrics: HealthMetrics;
    isConnected: boolean;
    isDemoMode: boolean;
    isManualMode: boolean;
    isManualModalOpen: boolean;

    // Actions
    updateMetric: (key: keyof HealthMetrics, value: number) => void;
    updateMetrics: (updates: Partial<HealthMetrics>) => void;
    toggleDemoMode: () => void;
    toggleManualMode: () => void;
    openManualModal: () => void;
    closeManualModal: () => void;
    resetToDefaults: () => void;
}

const HealthDataContext = createContext<HealthDataContextType | undefined>(undefined);

// Load from localStorage
const loadStoredMetrics = (): HealthMetrics => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return { ...DEFAULT_METRICS, ...JSON.parse(stored) };
        }
    } catch (error) {
        console.error('Failed to load health metrics:', error);
    }
    return DEFAULT_METRICS;
};

// Save to localStorage
const saveMetrics = (metrics: HealthMetrics) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics));
    } catch (error) {
        console.error('Failed to save health metrics:', error);
    }
};

export const HealthDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [metrics, setMetrics] = useState<HealthMetrics>(loadStoredMetrics);
    const [isDemoMode, setIsDemoMode] = useState(true);
    const [isManualMode, setIsManualMode] = useState(false);
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);
    const demoIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Demo mode simulation
    useEffect(() => {
        if (isDemoMode && !isManualMode) {
            demoIntervalRef.current = setInterval(() => {
                setMetrics(prev => ({
                    ...prev,
                    heartRate: 70 + Math.floor(Math.random() * 10),
                    spo2: 96 + Math.floor(Math.random() * 4),
                    stressLevel: Math.max(15, Math.min(85, prev.stressLevel + (Math.random() > 0.5 ? 3 : -3))),
                    lastUpdated: new Date().toISOString()
                }));
            }, 2500);
        }

        return () => {
            if (demoIntervalRef.current) {
                clearInterval(demoIntervalRef.current);
                demoIntervalRef.current = null;
            }
        };
    }, [isDemoMode, isManualMode]);

    // Save on changes
    useEffect(() => {
        saveMetrics(metrics);
    }, [metrics]);

    const updateMetric = useCallback((key: keyof HealthMetrics, value: number) => {
        setMetrics(prev => ({
            ...prev,
            [key]: value,
            lastUpdated: new Date().toISOString()
        }));
    }, []);

    const updateMetrics = useCallback((updates: Partial<HealthMetrics>) => {
        setMetrics(prev => ({
            ...prev,
            ...updates,
            lastUpdated: new Date().toISOString()
        }));
    }, []);

    const toggleDemoMode = useCallback(() => {
        setIsDemoMode(prev => !prev);
        setIsManualMode(false);
    }, []);

    const toggleManualMode = useCallback(() => {
        setIsManualMode(prev => !prev);
        setIsDemoMode(false);
    }, []);

    const openManualModal = useCallback(() => {
        setIsManualModalOpen(true);
    }, []);

    const closeManualModal = useCallback(() => {
        setIsManualModalOpen(false);
    }, []);

    const resetToDefaults = useCallback(() => {
        setMetrics({ ...DEFAULT_METRICS, lastUpdated: new Date().toISOString() });
    }, []);

    const isConnected = isDemoMode || isManualMode;

    return (
        <HealthDataContext.Provider value={{
            metrics,
            isConnected,
            isDemoMode,
            isManualMode,
            isManualModalOpen,
            updateMetric,
            updateMetrics,
            toggleDemoMode,
            toggleManualMode,
            openManualModal,
            closeManualModal,
            resetToDefaults
        }}>
            {children}
        </HealthDataContext.Provider>
    );
};

export const useHealthData = (): HealthDataContextType => {
    const context = useContext(HealthDataContext);
    if (!context) {
        throw new Error('useHealthData must be used within a HealthDataProvider');
    }
    return context;
};

export default HealthDataContext;
