/**
 * ConsultationPopup.tsx
 * 
 * Lightweight popup modal for non-doctor pages.
 * Shows when users click "Book Consultation" buttons.
 * Provides a simple gateway to the full doctor consultation flow.
 */

import React from 'react';
import { X, Shield, Video, ArrowRight, Lock, Heart } from 'lucide-react';

interface ConsultationPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onContinue: () => void;
}

export const ConsultationPopup: React.FC<ConsultationPopupProps> = ({
    isOpen,
    onClose,
    onContinue
}) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[90] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
                <div
                    className="relative bg-white dark:bg-dm-card rounded-[2rem] shadow-2xl max-w-md w-full animate-in zoom-in-95 fade-in duration-300 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Decorative top gradient */}
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5" />

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-dm-muted hover:bg-slate-200 dark:hover:bg-dm-accent transition-colors z-10"
                    >
                        <X size={18} className="text-slate-500 dark:text-dm-muted-fg" />
                    </button>

                    {/* Content */}
                    <div className="relative p-8 pt-12">
                        {/* Icon */}
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                            <Video size={36} className="text-white" />
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-dm-foreground text-center mb-3">
                            Private 1:1 Doctor Consultation
                        </h2>

                        {/* Description */}
                        <p className="text-slate-500 dark:text-dm-muted-fg text-center mb-8 leading-relaxed">
                            Connect with verified doctors for personalized, confidential healthcare guidance.
                        </p>

                        {/* Trust signals */}
                        <div className="flex flex-col gap-3 mb-8">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-dm-muted rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                    <Lock size={18} className="text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">End-to-end privacy</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500">Your conversation stays private</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-dm-muted rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <Shield size={18} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Verified credentials</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500">All doctors are certified professionals</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-dm-muted rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                    <Heart size={18} className="text-primary-600 dark:text-primary-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Judgment-free support</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500">Compassionate care always</p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={onContinue}
                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 px-6 rounded-xl font-bold text-base shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-3 group"
                        >
                            Continue to Doctor
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        {/* Footer note */}
                        <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-4">
                            You control what information is shared
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ConsultationPopup;
