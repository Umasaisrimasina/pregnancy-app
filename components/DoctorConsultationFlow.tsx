/**
 * DoctorConsultationFlow.tsx
 * 
 * Full 6-step doctor consultation journey for the doctor page.
 * Provides a comprehensive, trust-driven, and privacy-focused experience.
 */

import React, { useState, useEffect } from 'react';
import {
    X, ArrowLeft, ArrowRight, Check, Video, Phone, MessageCircle,
    Shield, Lock, Eye, EyeOff, User, Baby, Heart, Brain, Utensils,
    Calendar, Clock, Mic, AlertTriangle, Volume2, VolumeX, ChevronRight,
    Sparkles, Leaf, Loader2, RefreshCw
} from 'lucide-react';
import { doctorService, Doctor, TimeSlot } from '../services/doctorService';
import { useSOS } from '../contexts/SOSContext';

interface DoctorConsultationFlowProps {
    isOpen: boolean;
    onClose: () => void;
    initialType?: string;
}

// Consultation types
const consultationTypes = [
    { id: 'pregnancy', icon: '🤰', label: 'Pregnancy', description: 'Prenatal care & support' },
    { id: 'pre-pregnancy', icon: '🌱', label: 'Pre-Pregnancy', description: 'Fertility & conception' },
    { id: 'mental-health', icon: '🧠', label: 'Mental Health', description: 'Emotional wellness' },
    { id: 'baby', icon: '👶', label: 'Baby (0–5 years)', description: 'Infant & child care' },
    { id: 'nutrition', icon: '🥗', label: 'Nutrition / Lactation', description: 'Diet & breastfeeding' },
];

export const DoctorConsultationFlow: React.FC<DoctorConsultationFlowProps> = ({
    isOpen,
    onClose,
    initialType
}) => {
    const [step, setStep] = useState(1);
    const [selectedType, setSelectedType] = useState(initialType || '');
    const [selectedMode, setSelectedMode] = useState<'chat' | 'audio' | 'video'>('video');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [callDuration, setCallDuration] = useState(0);
    const { triggerSOS } = useSOS();

    // Data state
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [privacySettings, setPrivacySettings] = useState({
        anonymous: false,
        hideFromFamily: false,
        shareBabyInfo: true,
        shareLocation: false,
    });
    const [isCallActive, setIsCallActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    // Notes state
    const [showAdditionalNotes, setShowAdditionalNotes] = useState(false);
    const [additionalNotes, setAdditionalNotes] = useState('');

    // Fetching Animation State
    const [isFetchingData, setIsFetchingData] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0); // 0 to 4

    const loadingMessages = [
        "Fetching nutrition data...",
        "Retrieving doctor's report...",
        "Syncing watch details...",
        "Analyzing Sentiment Trends mood...",
        "Ready"
    ];



    // Reset state when closed
    useEffect(() => {
        if (!isOpen) {
            setStep(1);
            setIsCallActive(false);
            setSelectedSlot('');
            setSelectedDoctor(null);
            setDoctors([]);
            setCallDuration(0);
        } else {
            if (initialType) setSelectedType(initialType);
        }
    }, [isOpen, initialType]);

    // Timer logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isCallActive) {
            interval = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isCallActive]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Data fetching logic based on steps
    useEffect(() => {
        const fetchData = async () => {
            if (step === 2 && selectedType && doctors.length === 0) {
                // Fetch doctors when entering Step 2
                setIsLoading(true);
                try {
                    const fetchedDoctors = await doctorService.getDoctorsByType(selectedType);
                    setDoctors(fetchedDoctors);
                    if (fetchedDoctors.length > 0) {
                        setSelectedDoctor(fetchedDoctors[0]); // Select the first/best match
                    }
                } catch (error) {
                    console.error("Failed to fetch doctors", error);
                } finally {
                    setIsLoading(false);
                }
            } else if (step === 3 && selectedDoctor && slots.length === 0) {
                // Fetch slots when entering Step 3
                setIsLoading(true);
                try {
                    const fetchedSlots = await doctorService.getAvailableSlots(selectedDoctor.id, 'today');
                    setSlots(fetchedSlots);
                } catch (error) {
                    console.error("Failed to fetch slots", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchData();
    }, [step, selectedType, doctors.length, selectedDoctor, slots.length]);

    // Data Fetching Animation Effect
    useEffect(() => {
        if (isFetchingData) {
            setLoadingStep(0);
            const intervals = [1000, 2000, 3000, 4000]; // Timings for each step in ms

            // Step 0 -> 1
            const t1 = setTimeout(() => setLoadingStep(1), 1000);
            const t2 = setTimeout(() => setLoadingStep(2), 2500);
            const t3 = setTimeout(() => setLoadingStep(3), 4000);
            const t4 = setTimeout(() => setLoadingStep(4), 5500);
            const t5 = setTimeout(() => {
                setIsFetchingData(false);
                setStep(5);
            }, 7000); // Transitions after all steps

            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
                clearTimeout(t3);
                clearTimeout(t4);
                clearTimeout(t5);
            };
        }
    }, [isFetchingData]);

    if (!isOpen) return null;

    const handleNext = () => {
        if (step === 4) {
            // Trigger fetching animation before going to Step 5
            setIsFetchingData(true);
            return;
        }
        if (step < 6) setStep(step + 1);
        if (step === 5) setIsCallActive(true);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleEndCall = () => {
        setIsCallActive(false);
        onClose();
    };

    const handleFindAnotherDoctor = () => {
        if (!doctors.length || !selectedDoctor) return;
        const currentIndex = doctors.findIndex(d => d.id === selectedDoctor.id);
        const nextIndex = (currentIndex + 1) % doctors.length;
        setSelectedDoctor(doctors[nextIndex]);
    };

    // Step 1: Consultation Type Selection
    const renderStep1 = () => (
        <div className="p-8">
            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-dm-foreground text-center mb-2">
                What do you need help with?
            </h2>
            <p className="text-slate-500 dark:text-dm-muted-fg text-center mb-8">
                Select the area that best describes your concern
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {consultationTypes.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`p-6 rounded-2xl border-2 transition-all text-left group ${selectedType === type.id
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                            : 'border-slate-100 dark:border-dm-border hover:border-emerald-200 dark:hover:border-emerald-800 hover:bg-slate-50 dark:hover:bg-dm-muted'
                            }`}
                    >
                        <span className="text-4xl mb-3 block">{type.icon}</span>
                        <h3 className="font-bold text-slate-900 dark:text-dm-foreground mb-1">{type.label}</h3>
                        <p className="text-sm text-slate-500 dark:text-dm-muted-fg">{type.description}</p>
                    </button>
                ))}
            </div>

            {/* Trust signals */}
            <div className="flex items-center justify-center gap-6 text-sm text-slate-400 dark:text-slate-500">
                <span className="flex items-center gap-2">
                    <Lock size={14} /> Private & safe
                </span>
                <span className="flex items-center gap-2">
                    <Eye size={14} /> Doctor sees only summary
                </span>
            </div>
        </div>
    );

    // Step 2: Doctor Match Preview
    const renderStep2 = () => {
        if (isLoading) {
            return (
                <div className="p-16 flex flex-col items-center justify-center text-center">
                    <Loader2 size={40} className="text-emerald-500 animate-spin mb-4" />
                    <h3 className="text-lg font-bold text-slate-700 dark:text-dm-foreground">Finding the best doctor for you...</h3>
                    <p className="text-slate-500 text-sm">Reviewing specialties and availability</p>
                </div>
            );
        }

        if (!selectedDoctor) {
            return (
                <div className="p-8 text-center">
                    <p>No doctors found for this category at the moment.</p>
                </div>
            );
        }

        return (
            <div className="p-8">
                <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-dm-foreground text-center mb-2">
                    Recommended Doctor
                </h2>
                <p className="text-slate-500 dark:text-dm-muted-fg text-center mb-8">
                    Based on your needs, we've matched you with
                </p>

                <div className="bg-slate-50 dark:bg-dm-muted rounded-3xl p-8 mb-8">
                    {/* Doctor card */}
                    <div className="flex flex-col items-center text-center mb-6">
                        <img
                            src={selectedDoctor.photo}
                            alt={selectedDoctor.name}
                            className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-dm-card shadow-lg mb-4"
                        />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-dm-foreground">{selectedDoctor.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-dm-muted-fg">{selectedDoctor.degree}</p>
                    </div>

                    {/* Specialty chip */}
                    <div className="flex justify-center mb-4">
                        <span className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium">
                            {selectedDoctor.specialty}
                        </span>
                    </div>

                    {/* Languages */}
                    <div className="flex justify-center gap-2 mb-4">
                        {selectedDoctor.languages.map((lang) => (
                            <span key={lang} className="px-3 py-1 bg-white dark:bg-dm-card rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-dm-border">
                                {lang}
                            </span>
                        ))}
                    </div>

                    {/* Experience */}
                    <p className="text-center text-sm text-slate-500 dark:text-dm-muted-fg">
                        <strong className="text-slate-700 dark:text-slate-200">{selectedDoctor.experience}</strong> experience
                    </p>
                </div>

                {/* Trust signals */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                        <Shield size={18} className="text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm text-emerald-700 dark:text-emerald-300">Verified credentials</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                        <Lock size={18} className="text-blue-600 dark:text-blue-400" />
                        <span className="text-sm text-blue-700 dark:text-blue-300">Privacy-safe consultation</span>
                    </div>
                </div>

                {/* Find another doctor option */}
                {doctors.length > 1 && (
                    <button
                        onClick={handleFindAnotherDoctor}
                        className="w-full mt-4 py-3 flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-dm-muted rounded-xl transition-colors text-sm font-medium"
                    >
                        <RefreshCw size={16} />
                        Find another doctor
                    </button>
                )}
            </div>
        );
    };

    // Step 3: Slot & Mode Selection
    const renderStep3 = () => (
        <div className="p-8">
            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-dm-foreground text-center mb-2">
                Choose how to connect
            </h2>
            <p className="text-slate-500 dark:text-dm-muted-fg text-center mb-8">
                Select your preferred mode and time
            </p>

            {/* Mode selection */}
            <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                    { id: 'chat', icon: MessageCircle, label: 'Chat', recommended: selectedType === 'mental-health' },
                    { id: 'audio', icon: Phone, label: 'Audio', recommended: selectedType === 'mental-health' },
                    { id: 'video', icon: Video, label: 'Video', recommended: selectedType !== 'mental-health' },
                ].map((mode) => {
                    // Check if this mode is available for the doctor
                    const isAvailable = selectedDoctor?.availableModes.includes(mode.id as any);
                    return (
                        <button
                            key={mode.id}
                            disabled={!isAvailable}
                            onClick={() => setSelectedMode(mode.id as 'chat' | 'audio' | 'video')}
                            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 relative ${!isAvailable ? 'opacity-50 cursor-not-allowed border-slate-100 bg-slate-50' : selectedMode === mode.id
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                                : 'border-slate-100 dark:border-dm-border hover:border-emerald-200 dark:hover:border-emerald-800'
                                }`}
                        >
                            {mode.recommended && isAvailable && (
                                <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full">
                                    Suggested
                                </span>
                            )}
                            <mode.icon size={24} className={selectedMode === mode.id ? 'text-emerald-600' : 'text-slate-400'} />
                            <span className={`text-sm font-medium ${selectedMode === mode.id ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-300'}`}>
                                {mode.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Time slots */}
            <h3 className="font-bold text-slate-900 dark:text-dm-foreground mb-4">Available times</h3>
            {isLoading ? (
                <div className="py-8 flex justify-center">
                    <Loader2 size={24} className="text-emerald-500 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {slots.map((slot) => (
                        <button
                            key={slot.id}
                            onClick={() => slot.available && setSelectedSlot(slot.id)}
                            disabled={!slot.available}
                            className={`p-4 rounded-xl border transition-all text-left ${!slot.available
                                ? 'border-slate-100 dark:border-dm-border bg-slate-50 dark:bg-dm-muted opacity-50 cursor-not-allowed'
                                : selectedSlot === slot.id
                                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                                    : 'border-slate-100 dark:border-dm-border hover:border-emerald-200 dark:hover:border-emerald-800'
                                }`}
                        >
                            <p className="font-bold text-slate-900 dark:text-dm-foreground">{slot.time}</p>
                            <p className="text-xs text-slate-500 dark:text-dm-muted-fg">{slot.label}</p>
                        </button>
                    ))}
                </div>
            )}

            {/* Low data mode */}
            <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-900/30">
                <span className="text-sm text-amber-700 dark:text-amber-300">Low data mode available</span>
                <span className="text-xs text-amber-600 dark:text-amber-400">Uses less bandwidth</span>
            </div>
        </div>
    );

    // Step 4: Privacy & Visibility Settings
    const renderStep4 = () => (
        <div className="p-8">
            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-dm-foreground text-center mb-2">
                Your privacy controls
            </h2>
            <p className="text-slate-500 dark:text-dm-muted-fg text-center mb-8">
                Choose what to share with your doctor
            </p>

            <div className="space-y-4">
                {/* Anonymous toggle */}
                {selectedType === 'mental-health' && (
                    <div className="p-4 bg-slate-50 dark:bg-dm-muted rounded-2xl">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <EyeOff size={20} className="text-slate-500 dark:text-dm-muted-fg" />
                                <span className="font-medium text-slate-900 dark:text-dm-foreground">Anonymous to doctor</span>
                            </div>
                            <button
                                onClick={() => setPrivacySettings(prev => ({ ...prev, anonymous: !prev.anonymous }))}
                                className={`w-12 h-6 rounded-full transition-colors ${privacySettings.anonymous ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${privacySettings.anonymous ? 'translate-x-6' : 'translate-x-0.5'}`} />
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-dm-muted-fg ml-8">
                            Doctor won't see your real name or photo
                        </p>
                    </div>
                )}

                {/* Hide from family */}
                <div className="p-4 bg-slate-50 dark:bg-dm-muted rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <Lock size={20} className="text-slate-500 dark:text-dm-muted-fg" />
                            <span className="font-medium text-slate-900 dark:text-dm-foreground">Hide from family view</span>
                        </div>
                        <button
                            onClick={() => setPrivacySettings(prev => ({ ...prev, hideFromFamily: !prev.hideFromFamily }))}
                            className={`w-12 h-6 rounded-full transition-colors ${privacySettings.hideFromFamily ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${privacySettings.hideFromFamily ? 'translate-x-6' : 'translate-x-0.5'}`} />
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-dm-muted-fg ml-8">
                        This consultation won't appear in shared family timeline
                    </p>
                </div>

                {/* Share baby info */}
                <div className="p-4 bg-slate-50 dark:bg-dm-muted rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <Baby size={20} className="text-slate-500 dark:text-dm-muted-fg" />
                            <span className="font-medium text-slate-900 dark:text-dm-foreground">Share baby info with doctor</span>
                        </div>
                        <button
                            onClick={() => setPrivacySettings(prev => ({ ...prev, shareBabyInfo: !prev.shareBabyInfo }))}
                            className={`w-12 h-6 rounded-full transition-colors ${privacySettings.shareBabyInfo ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${privacySettings.shareBabyInfo ? 'translate-x-6' : 'translate-x-0.5'}`} />
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-dm-muted-fg ml-8">
                        Helps doctor provide better recommendations
                    </p>
                </div>
            </div>
        </div>
    );

    // Step 5: Pre-Consultation Summary
    const renderStep5 = () => {
        const selectedSlotData = slots.find(s => s.id === selectedSlot);

        return (
            <div className="p-8">
                <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-dm-foreground text-center mb-2">
                    What the doctor will see
                </h2>
                <p className="text-slate-500 dark:text-dm-muted-fg text-center mb-8">
                    Review your shared information
                </p>

                <div className="bg-slate-50 dark:bg-dm-muted rounded-2xl p-6 mb-6">
                    {/* Summary items */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-dm-border">
                            <span className="text-sm text-slate-500 dark:text-dm-muted-fg">Consultation with</span>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-900 dark:text-dm-foreground">{selectedDoctor?.name}</span>
                                {doctors.length > 1 && (
                                    <button
                                        onClick={handleFindAnotherDoctor}
                                        className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors p-1 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                                        title="Find another doctor"
                                    >
                                        <RefreshCw size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-dm-border">
                            <span className="text-sm text-slate-500 dark:text-dm-muted-fg">Time & Mode</span>
                            <span className="font-medium text-slate-900 dark:text-dm-foreground flex items-center gap-1">
                                {selectedSlotData?.time}, {selectedMode}
                            </span>
                        </div>

                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-dm-border">
                            <span className="text-sm text-slate-500 dark:text-dm-muted-fg">Pregnancy week</span>
                            <span className="font-medium text-slate-900 dark:text-dm-foreground">Week 24</span>
                        </div>

                        <div className="pb-3 border-b border-slate-200 dark:border-dm-border">
                            <span className="text-sm text-slate-500 dark:text-dm-muted-fg block mb-2">Key symptoms</span>
                            <div className="flex flex-wrap gap-2">
                                {['Back pain', 'Fatigue', 'Mild nausea'].map((symptom) => (
                                    <span key={symptom} className="px-3 py-1 bg-white dark:bg-dm-card rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-dm-border">
                                        {symptom}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-dm-border">
                            <span className="text-sm text-slate-500 dark:text-dm-muted-fg">Mood indicator</span>
                            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium">Medium</span>
                        </div>
                    </div>
                </div>

                {/* Optional actions */}
                <div className="space-y-3">
                    {showAdditionalNotes ? (
                        <textarea
                            value={additionalNotes}
                            onChange={(e) => setAdditionalNotes(e.target.value)}
                            placeholder="Type any specific questions or concerns here..."
                            className="w-full p-4 rounded-xl border border-slate-300 dark:border-dm-border bg-white dark:bg-dm-card focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all min-h-[100px] text-sm"
                            autoFocus
                        />
                    ) : (
                        <button
                            onClick={() => setShowAdditionalNotes(true)}
                            className="w-full p-4 rounded-xl border border-dashed border-slate-300 dark:border-dm-border text-slate-500 dark:text-dm-muted-fg hover:border-emerald-300 dark:hover:border-emerald-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-center gap-2"
                        >
                            <MessageCircle size={18} />
                            Add anything else?
                        </button>
                    )}
                    <button className="w-full p-4 rounded-xl border border-dashed border-slate-300 dark:border-dm-border text-slate-500 dark:text-dm-muted-fg hover:border-emerald-300 dark:hover:border-emerald-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-center gap-2">
                        <Mic size={18} />
                        Record voice note (30s)
                    </button>
                </div>
            </div>
        );
    }

    // Interstitial Loading Screen
    const renderLoadingScreen = () => (
        <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
            <div className="relative mb-8">
                <div className="w-16 h-16 rounded-full border-4 border-slate-100 dark:border-dm-border border-t-emerald-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles size={20} className="text-emerald-500 animate-pulse" />
                </div>
            </div>

            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-dm-foreground mb-6">
                Preparing your profile
            </h3>

            <div className="w-full max-w-sm space-y-4">
                {loadingMessages.slice(0, 4).map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex items-center gap-3 transition-opacity duration-500 ${idx <= loadingStep ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${idx < loadingStep ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-dm-border'}`}>
                            {idx < loadingStep && <Check size={12} className="text-white" />}
                            {idx === loadingStep && <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />}
                        </div>
                        <span className={`text-sm ${idx === loadingStep ? 'text-slate-900 dark:text-dm-foreground font-medium' : 'text-slate-500 dark:text-dm-muted-fg'}`}>
                            {msg}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );

    // Step 6: Active Consultation Screen
    const renderStep6 = () => (
        <div className="min-h-[600px] flex flex-col bg-slate-900">
            {/* Top bar */}
            <div className="p-4 bg-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src={selectedDoctor?.photo}
                        alt={selectedDoctor?.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                    />
                    <div>
                        <p className="font-medium text-white text-sm">{selectedDoctor?.name}</p>
                        <p className="text-xs text-slate-400">{selectedDoctor?.specialty}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium flex items-center gap-1">
                        <Video size={12} />
                        {selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1)}
                    </span>
                </div>
            </div>

            {/* Video area */}
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 relative">
                {/* Timer */}
                {/* Timer */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-800/80 rounded-full text-white/60 text-sm font-mono">
                    {formatTime(callDuration)}
                </div>

                {/* Doctor video placeholder */}
                <div className="w-48 h-48 rounded-full bg-slate-700 flex items-center justify-center border-4 border-emerald-500/30">
                    <User size={64} className="text-slate-500" />
                </div>

                {/* Self view */}
                <div className="absolute bottom-4 right-4 w-24 h-32 rounded-xl bg-slate-700 border-2 border-white/10 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                        <User size={24} className="text-slate-500" />
                    </div>
                </div>
            </div>

            {/* Quick actions */}
            <div className="p-4 bg-slate-800 space-y-3">
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${isMuted ? 'bg-red-500 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'
                            }`}
                    >
                        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </button>
                    <button
                        onClick={handleEndCall}
                        className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                    >
                        <Phone size={24} className="rotate-[135deg]" />
                    </button>
                </div>

                {/* Emotion buttons */}
                <div className="flex justify-center gap-2">
                    <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-full transition-colors">
                        I feel anxious
                    </button>
                    <button
                        onClick={triggerSOS}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm rounded-full transition-colors border border-red-500/30"
                    >
                        Need urgent help
                    </button>
                </div>
            </div>
        </div>
    );



    const renderCurrentStep = () => {
        switch (step) {
            case 1: return renderStep1();
            case 2: return renderStep2();
            case 3: return renderStep3();
            case 4: return renderStep4();
            case 5: return renderStep5();
            case 6: return renderStep6();
            default: return renderStep1();
        }
    };

    const canProceed = () => {
        switch (step) {
            case 1: return !!selectedType;
            case 2: return !!selectedDoctor; // Must have a doctor matched
            case 3: return !!selectedSlot && !!selectedMode;
            case 4: return true;
            case 5: return true;
            case 6: return false;
            default: return false;
        }
    };

    const getStepCTA = () => {
        switch (step) {
            case 1: return 'Continue';
            case 2: return 'Select Doctor';
            case 3: return 'Confirm Slot';
            case 4: return 'Continue Securely';
            case 5: return 'Start Consultation';
            default: return 'Continue';
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[90] bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={step === 6 ? undefined : onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
                <div
                    className={`relative bg-white dark:bg-dm-card shadow-2xl w-full animate-in zoom-in-95 fade-in duration-300 overflow-hidden ${step === 6 ? 'max-w-xl rounded-2xl' : 'max-w-lg rounded-[2rem]'
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {step === 6 && renderCurrentStep()}

                    {/* Step 4.5: Loading Screen (No Header/Footer) */}
                    {isFetchingData && (
                        <div className="p-8">
                            {renderLoadingScreen()}
                        </div>
                    )}

                    {/* Steps 1-5 ( Standard Flow) */}
                    {step !== 6 && !isFetchingData && (
                        <>
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-dm-border">
                                {step > 1 ? (
                                    <button
                                        onClick={handleBack}
                                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-dm-muted transition-colors"
                                    >
                                        <ArrowLeft size={20} className="text-slate-500 dark:text-dm-muted-fg" />
                                    </button>
                                ) : (
                                    <div className="w-9" />
                                )}

                                {/* Progress indicator */}
                                <div className="flex gap-1.5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <div
                                            key={s}
                                            className={`w-8 h-1.5 rounded-full transition-colors ${s <= step ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-dm-accent'
                                                }`}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-dm-muted transition-colors"
                                >
                                    <X size={20} className="text-slate-500 dark:text-dm-muted-fg" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="max-h-[70vh] overflow-y-auto">
                                {renderCurrentStep()}
                            </div>

                            {/* Footer with CTA */}
                            <div className="p-4 border-t border-slate-100 dark:border-dm-border">
                                <button
                                    onClick={handleNext}
                                    disabled={!canProceed()}
                                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 px-6 rounded-xl font-bold text-base shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {getStepCTA()}
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default DoctorConsultationFlow;
