import React from 'react';
import { X, Phone, AlertTriangle } from 'lucide-react';
import { useSOS } from '../contexts/SOSContext';

export const SOSModal: React.FC = () => {
    const { isSosActive, closeSOS } = useSOS();

    if (!isSosActive) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Red Gradient Blur Background */}
            <div
                className="absolute inset-0 backdrop-blur-xl animate-in fade-in duration-300"
                style={{
                    background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.9) 0%, rgba(153, 27, 27, 0.95) 50%, rgba(127, 29, 29, 0.9) 100%)'
                }}
                onClick={closeSOS}
            />

            {/* Close Button */}
            <button
                onClick={closeSOS}
                className="absolute top-8 right-8 p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all text-white z-10"
            >
                <X size={28} />
            </button>

            {/* Calling Animation Container */}
            <div className="relative flex flex-col items-center justify-center z-10 animate-in zoom-in-95 duration-300">
                {/* Pulsing Rings */}
                <div className="absolute">
                    <div className="w-48 h-48 rounded-full border-4 border-white/30 animate-ping" style={{ animationDuration: '1.5s' }} />
                </div>
                <div className="absolute">
                    <div className="w-64 h-64 rounded-full border-4 border-white/20 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.3s' }} />
                </div>
                <div className="absolute">
                    <div className="w-80 h-80 rounded-full border-4 border-white/10 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.6s' }} />
                </div>

                {/* Phone Icon */}
                <div className="relative w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-2xl shadow-red-900/50 animate-bounce" style={{ animationDuration: '0.5s' }}>
                    <Phone size={56} className="text-red-600" fill="currentColor" />
                </div>

                {/* Calling Text */}
                <div className="mt-12 text-center">
                    <p className="text-white text-2xl font-bold animate-pulse">Calling Emergency...</p>
                    <p className="text-white/80 text-lg mt-2">Help is on the way</p>
                </div>

                {/* Emergency Number Display */}
                <div className="mt-8 px-8 py-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <p className="text-white text-3xl font-bold tracking-wider">112</p>
                    <p className="text-white/70 text-sm text-center mt-1">Emergency Helpline</p>
                </div>

                {/* Cancel Button */}
                <button
                    onClick={closeSOS}
                    className="mt-10 px-12 py-4 bg-white text-red-600 font-bold text-lg rounded-full hover:bg-red-50 transition-all shadow-xl cursor-pointer z-20 relative"
                >
                    Cancel Call
                </button>
            </div>
        </div>
    );
};
