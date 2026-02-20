/**
 * DigitalCaseHistory.tsx
 *
 * Emergency-Optimized Clinical Summary — thin composition page.
 * All heavy UI is delegated to sub-components in components/medical/.
 * Business logic (notes, risk derivation) stays here; components are presentational.
 *
 * ~461 → ~95 lines after refactor.
 */

import React, { useState, useEffect } from 'react';
import { useHealthData } from '../contexts/HealthDataContext';
import { useRiskData } from '../contexts/RiskDataContext';

import { EmergencyRiskCard } from './medical/EmergencyRiskCard';
import { PatientIdentityCard } from './medical/PatientIdentityCard';
import { RiskFactorsCard } from './medical/RiskFactorsCard';
import { LiveVitalsCard } from './medical/LiveVitalsCard';
import { ObstetricOverviewCard } from './medical/ObstetricOverviewCard';
import { ClinicalMilestonesCard } from './medical/ClinicalMilestonesCard';
import { DoctorNotesCard } from './medical/DoctorNotesCard';

import {
    PATIENT, PATIENT_ID, OBSTETRIC, RISK_FLAGS, MILESTONES,
    RISK_LEVEL_CONFIG, formatDate, getTimeSince,
    type RiskLevel,
} from '../config/medicalView.config';

// ─────────────────────────────────────────────────────────────────────
const NOTES_STORAGE_KEY = 'digital_case_history_notes';

export const DigitalCaseHistory: React.FC = () => {
    const { metrics, isConnected } = useHealthData();
    const { latestAssessment } = useRiskData();

    // Doctor notes — persisted to localStorage
    const [notes, setNotes] = useState(() => {
        try {
            return localStorage.getItem(NOTES_STORAGE_KEY) || 'Tx: Monitor BP, Methyldopa';
        } catch { return 'Tx: Monitor BP, Methyldopa'; }
    });
    const [notesSaved, setNotesSaved] = useState(false);
    const [savedAt, setSavedAt] = useState<Date | null>(null);

    // Auto-save notes (800 ms debounce)
    useEffect(() => {
        const timer = setTimeout(() => {
            try {
                localStorage.setItem(NOTES_STORAGE_KEY, notes);
                const saveTime = new Date();
                setSavedAt(saveTime);
                setNotesSaved(true);
                setTimeout(() => setNotesSaved(false), 2000);
            } catch (e) { console.error('Failed to save notes', e); }
        }, 800);
        return () => clearTimeout(timer);
    }, [notes]);

    // Derive emergency risk level from latestAssessment with runtime validation
    const isValidRiskLevel = (value: unknown): value is RiskLevel => {
        return value === 'low' || value === 'moderate' || value === 'high';
    };

    const riskLevel: RiskLevel = isValidRiskLevel(latestAssessment?.overallLevel) 
        ? latestAssessment.overallLevel 
        : 'moderate';
    const riskConfig = RISK_LEVEL_CONFIG[riskLevel];
    const qrUrl = `https://nurturenet.app/emergency/${PATIENT_ID}`;

    const patientFields = [
        { label: 'Age', value: `${PATIENT.age} yrs` },
        { label: 'Weight', value: `${PATIENT.weight} kg` },
        { label: 'Blood Group', value: PATIENT.bloodGroup },
        { label: 'Rh Status', value: PATIENT.rhStatus },
    ];

    // GPLAD state — editable by the doctor
    const [gpladValues, setGpladValues] = useState({
        G: OBSTETRIC.gravida,
        P: OBSTETRIC.para,
        L: OBSTETRIC.live,
        A: OBSTETRIC.abortions,
        D: OBSTETRIC.deaths,
    });

    const handleGPLADChange = (letter: string, value: number) => {
        setGpladValues(prev => ({ ...prev, [letter]: value }));
    };

    const gplad = [
        { letter: 'G', value: gpladValues.G, label: 'Gravida', description: 'Total number of pregnancies, including current pregnancy, miscarriages, and ectopic pregnancies.' },
        { letter: 'P', value: gpladValues.P, label: 'Parity', description: 'Number of births carried past the age of viability (≥20 weeks), regardless of outcome.' },
        { letter: 'L', value: gpladValues.L, label: 'Living', description: 'Number of living children at present.' },
        { letter: 'A', value: gpladValues.A, label: 'Abortions', description: 'Number of pregnancies lost before viability — includes miscarriages, ectopic, and elective terminations.' },
        { letter: 'D', value: gpladValues.D, label: 'Deaths', description: 'Number of children who were born alive but died subsequently (neonatal or infant deaths).' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <EmergencyRiskCard riskConfig={riskConfig} riskLevel={riskLevel} patientName={PATIENT.name} patientId={PATIENT_ID} qrUrl={qrUrl} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <PatientIdentityCard name={PATIENT.name} patientId={PATIENT_ID} photoUrl={PATIENT.photoUrl} fields={patientFields} />
                <RiskFactorsCard riskFlags={RISK_FLAGS} riskConfig={riskConfig} />
                <LiveVitalsCard
                    systolicBP={metrics.systolicBP}
                    diastolicBP={metrics.diastolicBP}
                    heartRate={metrics.heartRate}
                    lastUpdated={getTimeSince(metrics.lastUpdated)}
                    isConnected={isConnected}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ObstetricOverviewCard gplad={gplad} lmpFormatted={formatDate(OBSTETRIC.lmp)} eddFormatted={formatDate(OBSTETRIC.edd)} onGPLADChange={handleGPLADChange} />
                <ClinicalMilestonesCard milestones={MILESTONES} />
                <DoctorNotesCard
                    notes={notes}
                    onChange={setNotes}
                    isSaved={notesSaved}
                    lastSavedTime={savedAt ? savedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                />
            </div>
        </div>
    );
};

export default DigitalCaseHistory;
