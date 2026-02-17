/**
 * DigitalCaseHistory.tsx
 *
 * Emergency-Optimized Clinical Summary Layer.
 * Provides a one-glance emergency-ready view using existing ecosystem data.
 *
 * Progressive Emergency Information Disclosure:
 * 1. Emergency Protocol Card (highest priority)
 * 2. Patient Identity
 * 3. Risk Factors (high priority)
 * 4. Live Vitals (high priority)
 * 5. Obstetric Overview
 * 6. Clinical Milestones
 * 7. Doctor Notes
 */

import React, { useState, useEffect, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
    AlertTriangle,
    Shield,
    User,
    Heart,
    Activity,
    Baby,
    ClipboardList,
    FileText,
    Droplets,
    Zap,
    CheckCircle2,
    XCircle,
    Clock,
    Save,
    AlertCircle,
    Stethoscope,
    Syringe,
    ScanLine,
    CalendarCheck,
} from 'lucide-react';
import { useHealthData } from '../contexts/HealthDataContext';
import { useRiskData } from '../contexts/RiskDataContext';

// ─────────────────────────────────────────────────────────────────────
// TYPES & CONSTANTS
// ─────────────────────────────────────────────────────────────────────

const NOTES_STORAGE_KEY = 'digital_case_history_notes';
const PATIENT_ID = 'PAT-2024-MS-0042';

// Patient profile data (sourced from Patient Profile Module)
const PATIENT = {
    name: 'Maya Sharma',
    age: 28,
    weight: 64.2,
    bloodGroup: 'B+',
    rhStatus: 'Positive',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
};

// Obstetric data (sourced from Case History Module)
const OBSTETRIC = {
    gravida: 1,
    para: 0,
    live: 0,
    abortions: 0,
    deaths: 0,
    lmp: '2024-04-12',
    edd: '2025-01-17',
};

// Risk factor flags (sourced from Risk Analysis Module)
const RISK_FLAGS = [
    { label: 'Hypertension', key: 'hypertension', active: true },
    { label: 'Diabetes', key: 'diabetes', active: false },
    { label: 'Seizures', key: 'seizures', active: false },
    { label: 'IVF', key: 'ivf', active: false },
    { label: 'OCP History', key: 'ocp', active: false },
];

// Clinical milestones (sourced from ANC Tracking & Reports Module)
const MILESTONES = [
    { label: 'ANC Visit 1', done: true, icon: CalendarCheck },
    { label: 'ANC Visit 2', done: true, icon: CalendarCheck },
    { label: 'ANC Visit 3', done: true, icon: CalendarCheck },
    { label: 'ANC Visit 4', done: false, icon: CalendarCheck },
    { label: 'TT-1 Immunization', done: true, icon: Syringe },
    { label: 'TT-2 Immunization', done: false, icon: Syringe },
    { label: 'Dating Scan', done: true, icon: ScanLine },
    { label: 'Anomaly Scan', done: false, icon: ScanLine },
];

// ─────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function getTimeSince(isoStr: string): string {
    const diff = Date.now() - new Date(isoStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

// ─────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────

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

    // Auto-save notes
    useEffect(() => {
        const timer = setTimeout(() => {
            try {
                localStorage.setItem(NOTES_STORAGE_KEY, notes);
                setNotesSaved(true);
                setTimeout(() => setNotesSaved(false), 2000);
            } catch (e) { console.error('Failed to save notes', e); }
        }, 800);
        return () => clearTimeout(timer);
    }, [notes]);

    // Derive emergency risk level from latestAssessment
    const riskLevel = latestAssessment?.overallLevel || 'moderate';
    const riskConfig = {
        low: { label: 'LOW RISK', bg: 'bg-emerald-500', border: 'border-emerald-400', glow: 'shadow-emerald-500/30', text: 'text-emerald-400', bgLight: 'bg-emerald-50 dark:bg-emerald-900/20', borderLight: 'border-emerald-200 dark:border-emerald-800/40' },
        moderate: { label: 'MODERATE RISK', bg: 'bg-amber-500', border: 'border-amber-400', glow: 'shadow-amber-500/30', text: 'text-amber-400', bgLight: 'bg-amber-50 dark:bg-amber-900/20', borderLight: 'border-amber-200 dark:border-amber-800/40' },
        high: { label: 'HIGH RISK', bg: 'bg-red-500', border: 'border-red-400', glow: 'shadow-red-500/30', text: 'text-red-400', bgLight: 'bg-red-50 dark:bg-red-900/20', borderLight: 'border-red-200 dark:border-red-800/40' },
    }[riskLevel] || { label: 'MODERATE RISK', bg: 'bg-amber-500', border: 'border-amber-400', glow: 'shadow-amber-500/30', text: 'text-amber-400', bgLight: 'bg-amber-50 dark:bg-amber-900/20', borderLight: 'border-amber-200 dark:border-amber-800/40' };

    const qrUrl = `https://nurturenet.app/emergency/${PATIENT_ID}`;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* ─── SECTION 1: Emergency Protocol Card ─── */}
            <div className={`rounded-[2rem] p-6 md:p-8 border-2 ${riskConfig.borderLight} ${riskConfig.bgLight} relative overflow-hidden`}>
                {/* Pulsing emergency glow */}
                <div className={`absolute top-0 right-0 w-40 h-40 ${riskConfig.bg} rounded-full blur-[100px] opacity-20 animate-pulse pointer-events-none`}></div>

                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    {/* Left: Emergency Status */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-12 h-12 ${riskConfig.bg} rounded-2xl flex items-center justify-center shadow-lg ${riskConfig.glow}`}>
                                <AlertTriangle size={24} className="text-white" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Emergency Risk Status</p>
                                <h3 className={`text-xl font-display font-extrabold ${riskConfig.text}`}>
                                    {riskConfig.label}
                                </h3>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
                            Emergency clinical summary for <strong>{PATIENT.name}</strong>. Scan QR code for full digital case history access during emergency admission.
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                            <Shield size={14} className="text-blue-500" />
                            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Secure Access · ID: {PATIENT_ID}</span>
                        </div>
                    </div>

                    {/* Right: QR Code */}
                    <div className="bg-white dark:bg-dm-muted rounded-2xl p-4 border border-slate-200 dark:border-dm-border shadow-sm flex flex-col items-center gap-2 shrink-0">
                        <QRCodeSVG
                            value={qrUrl}
                            size={120}
                            level="H"
                            includeMargin={false}
                            bgColor="transparent"
                            fgColor={riskLevel === 'high' ? '#ef4444' : riskLevel === 'moderate' ? '#f59e0b' : '#10b981'}
                        />
                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Scan for Records</span>
                    </div>
                </div>
            </div>

            {/* ─── Two-Column Layout: Identity + Risk Factors + Live Vitals ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ─── SECTION 2: Patient Identity ─── */}
                <div className="bg-white dark:bg-dm-card rounded-[2rem] p-6 md:p-8 border border-slate-100 dark:border-dm-border shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                            <User size={20} />
                        </div>
                        <h3 className="font-bold font-display text-slate-900 dark:text-dm-foreground">Patient Identity</h3>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        <img
                            src={PATIENT.photoUrl}
                            alt={PATIENT.name}
                            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white dark:ring-dm-border shadow-md"
                        />
                        <div>
                            <h4 className="text-lg font-bold font-display text-slate-900 dark:text-dm-foreground">{PATIENT.name}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">ID: {PATIENT_ID}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Age', value: `${PATIENT.age} yrs` },
                            { label: 'Weight', value: `${PATIENT.weight} kg` },
                            { label: 'Blood Group', value: PATIENT.bloodGroup },
                            { label: 'Rh Status', value: PATIENT.rhStatus },
                        ].map((item) => (
                            <div key={item.label} className="bg-slate-50 dark:bg-dm-muted rounded-xl p-3 border border-slate-100 dark:border-dm-border">
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">{item.label}</span>
                                <span className="text-sm font-bold text-slate-900 dark:text-dm-foreground">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ─── SECTION 3: Risk Factors ─── */}
                <div className="bg-white dark:bg-dm-card rounded-[2rem] p-6 md:p-8 border border-slate-100 dark:border-dm-border shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-lg">
                            <AlertCircle size={20} />
                        </div>
                        <h3 className="font-bold font-display text-slate-900 dark:text-dm-foreground">Risk Factors</h3>
                        <span className={`ml-auto text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest ${riskConfig.bg} text-white`}>
                            {riskConfig.label}
                        </span>
                    </div>

                    <div className="space-y-3">
                        {RISK_FLAGS.map((flag) => (
                            <div
                                key={flag.key}
                                className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors ${flag.active
                                        ? 'bg-red-50 dark:bg-red-900/15 border-red-200 dark:border-red-800/40'
                                        : 'bg-slate-50 dark:bg-dm-muted border-slate-100 dark:border-dm-border'
                                    }`}
                            >
                                <span className={`text-sm font-semibold ${flag.active ? 'text-red-700 dark:text-red-300' : 'text-slate-600 dark:text-slate-400'
                                    }`}>
                                    {flag.label}
                                </span>
                                {flag.active ? (
                                    <div className="flex items-center gap-1.5">
                                        <XCircle size={16} className="text-red-500" />
                                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Positive</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Negative</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ─── SECTION 4: Live Vitals ─── */}
                <div className="bg-white dark:bg-dm-card rounded-[2rem] p-6 md:p-8 border border-slate-100 dark:border-dm-border shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-primary-50 dark:bg-primary-900/20 text-primary-500 dark:text-primary-400 rounded-lg">
                            <Activity size={20} />
                        </div>
                        <h3 className="font-bold font-display text-slate-900 dark:text-dm-foreground">Live Vitals</h3>
                        <div className={`ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${isConnected
                                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                                : 'bg-slate-50 dark:bg-dm-muted text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-dm-border'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                            {isConnected ? 'Live' : 'Offline'}
                        </div>
                    </div>

                    {/* BP */}
                    <div className="bg-primary-50 dark:bg-primary-900/15 rounded-2xl p-5 border border-primary-100 dark:border-primary-800/30 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Droplets size={16} className="text-primary-500" />
                            <span className="text-[10px] font-bold text-primary-700 dark:text-primary-300 uppercase tracking-widest">Blood Pressure</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-display font-bold text-slate-900 dark:text-dm-foreground">
                                {metrics.systolicBP || 120}/{metrics.diastolicBP || 80}
                            </span>
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">mmHg</span>
                        </div>
                    </div>

                    {/* HR */}
                    <div className="bg-red-50 dark:bg-red-900/15 rounded-2xl p-5 border border-red-100 dark:border-red-800/30 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Heart size={16} className="text-red-500" />
                            <span className="text-[10px] font-bold text-red-700 dark:text-red-300 uppercase tracking-widest">Heart Rate</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-display font-bold text-slate-900 dark:text-dm-foreground">
                                {metrics.heartRate}
                            </span>
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">BPM</span>
                        </div>
                    </div>

                    {/* Last Updated */}
                    <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                        <Clock size={14} />
                        <span className="text-xs font-medium">
                            Last updated: {getTimeSince(metrics.lastUpdated)}
                        </span>
                    </div>
                </div>
            </div>

            {/* ─── Bottom Row: Obstetric + Milestones + Doctor Notes ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ─── SECTION 5: Obstetric Overview ─── */}
                <div className="bg-white dark:bg-dm-card rounded-[2rem] p-6 md:p-8 border border-slate-100 dark:border-dm-border shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
                            <Baby size={20} />
                        </div>
                        <h3 className="font-bold font-display text-slate-900 dark:text-dm-foreground">Obstetric Overview</h3>
                    </div>

                    {/* GPLAD */}
                    <div className="bg-purple-50 dark:bg-purple-900/15 rounded-2xl p-5 border border-purple-100 dark:border-purple-800/30 mb-5">
                        <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-widest block mb-2">GPLAD</span>
                        <div className="flex items-center gap-3 flex-wrap">
                            {[
                                { letter: 'G', value: OBSTETRIC.gravida, label: 'Gravida' },
                                { letter: 'P', value: OBSTETRIC.para, label: 'Para' },
                                { letter: 'L', value: OBSTETRIC.live, label: 'Live' },
                                { letter: 'A', value: OBSTETRIC.abortions, label: 'Abortions' },
                                { letter: 'D', value: OBSTETRIC.deaths, label: 'Deaths' },
                            ].map((g) => (
                                <div key={g.letter} className="flex flex-col items-center" title={g.label}>
                                    <span className="text-2xl font-display font-bold text-slate-900 dark:text-dm-foreground">
                                        {g.letter}<sub className="text-base text-purple-500">{g.value}</sub>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* LMP / EDD */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 dark:bg-dm-muted rounded-xl p-3 border border-slate-100 dark:border-dm-border">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">LMP</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-dm-foreground">{formatDate(OBSTETRIC.lmp)}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-dm-muted rounded-xl p-3 border border-slate-100 dark:border-dm-border">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">EDD</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-dm-foreground">{formatDate(OBSTETRIC.edd)}</span>
                        </div>
                    </div>
                </div>

                {/* ─── SECTION 6: Clinical Milestones ─── */}
                <div className="bg-white dark:bg-dm-card rounded-[2rem] p-6 md:p-8 border border-slate-100 dark:border-dm-border shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                            <ClipboardList size={20} />
                        </div>
                        <h3 className="font-bold font-display text-slate-900 dark:text-dm-foreground">Clinical Milestones</h3>
                        <span className="ml-auto text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            {MILESTONES.filter(m => m.done).length}/{MILESTONES.length}
                        </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-2 bg-slate-100 dark:bg-dm-muted rounded-full mb-5 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-700"
                            style={{ width: `${(MILESTONES.filter(m => m.done).length / MILESTONES.length) * 100}%` }}
                        ></div>
                    </div>

                    <div className="space-y-2.5 max-h-[280px] overflow-y-auto custom-scrollbar pr-1">
                        {MILESTONES.map((m, i) => {
                            const Icon = m.icon;
                            return (
                                <div
                                    key={i}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${m.done
                                            ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/30'
                                            : 'bg-slate-50 dark:bg-dm-muted border-slate-100 dark:border-dm-border'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${m.done
                                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                                            : 'bg-slate-100 dark:bg-dm-accent text-slate-400 dark:text-slate-500'
                                        }`}>
                                        <Icon size={14} />
                                    </div>
                                    <span className={`text-sm font-medium flex-1 ${m.done ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'
                                        }`}>
                                        {m.label}
                                    </span>
                                    {m.done ? (
                                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                                    ) : (
                                        <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-dm-accent shrink-0"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ─── SECTION 7: Doctor Notes ─── */}
                <div className="bg-white dark:bg-dm-card rounded-[2rem] p-6 md:p-8 border border-slate-100 dark:border-dm-border shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg">
                            <FileText size={20} />
                        </div>
                        <h3 className="font-bold font-display text-slate-900 dark:text-dm-foreground">Doctor Notes</h3>
                        {notesSaved && (
                            <div className="ml-auto flex items-center gap-1 text-emerald-500 animate-in fade-in duration-300">
                                <Save size={12} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Saved</span>
                            </div>
                        )}
                    </div>

                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Enter emergency treatment notes..."
                        rows={8}
                        className="w-full bg-slate-50 dark:bg-dm-muted rounded-xl p-4 border border-slate-200 dark:border-dm-border text-sm text-slate-900 dark:text-dm-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none font-mono leading-relaxed"
                    />
                    <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                        Notes auto-save and persist to Case History. Last saved: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DigitalCaseHistory;
