/**
 * CaregiverBookingModal.tsx
 *
 * Self-contained 4-step caregiver booking wizard.
 * Extracted from BabyCareEducation to enable reuse (Dashboard CTA, etc.).
 */

import React, { useState, useRef, useEffect } from 'react';
import { Baby, Heart, Clock, CheckCircle2, X, ArrowRight, MapPin, FileText, Shield } from 'lucide-react';

const CARE_TYPES: Record<string, string> = {
  newborn: 'Newborn care',
  night: 'Night care',
  short: 'Short-term help',
};

export interface CaregiverBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: {
    careType: string;
    date: string;
    time: string;
    location: string;
    notes: string;
  }) => void;
}

export const CaregiverBookingModal: React.FC<CaregiverBookingModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedCareType, setSelectedCareType] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [location, setLocation] = useState('Auto-detected location');
  const [notes, setNotes] = useState('');
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount or when modal visibility changes
  useEffect(() => {
    if (isOpen) {
        // Clear any pending reset if reopened quickly
        if (resetTimeoutRef.current) {
            clearTimeout(resetTimeoutRef.current);
            resetTimeoutRef.current = null;
        }
    }
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    // Clear any existing timeout
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }
    // Reset after close animation
    resetTimeoutRef.current = setTimeout(() => {
      setBookingStep(1);
      setSelectedCareType('');
      setSelectedDate('');
      setSelectedTime('');
      setLocation('Auto-detected location');
      setNotes('');
      resetTimeoutRef.current = null;
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-dm-card rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4 duration-300">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-8 py-6 flex items-center justify-between z-10 rounded-t-[2rem]">
          <div>
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-dm-foreground">Find a Caregiver</h2>
            <p className="text-sm text-slate-500 mt-1">Step {bookingStep} of 4</p>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X size={20} className="text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6">

          {/* Step 1: Care Type */}
          {bookingStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-dm-foreground mb-2">What type of care do you need?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">Select the support that works best for you.</p>
              </div>

              <div className="space-y-3">
                {([
                  { id: 'newborn', title: 'Newborn care', desc: 'Feeding, soothing, and daily care support', icon: Baby },
                  { id: 'night', title: 'Night care', desc: 'Overnight support so you can rest', icon: Clock },
                  { id: 'short', title: 'Short-term help', desc: 'A few hours when you need a break', icon: Heart },
                ] as const).map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedCareType(type.id)}
                    className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${selectedCareType === type.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-slate-100 bg-white hover:border-purple-200'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${selectedCareType === type.id ? 'bg-purple-100 text-purple-600' : 'bg-dark-800 text-slate-400'}`}>
                        <type.icon size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 dark:text-dm-foreground mb-1">{type.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{type.desc}</p>
                      </div>
                      {selectedCareType === type.id && (
                        <CheckCircle2 size={20} className="text-purple-600 shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {bookingStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-dm-foreground mb-2">When do you need support?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">Choose a date and time that works for you.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-100 dark:border-dm-border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Time</label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-100 dark:border-dm-border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select a time</option>
                    <option value="morning">Morning (6 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 6 PM)</option>
                    <option value="evening">Evening (6 PM - 10 PM)</option>
                    <option value="night">Night (10 PM - 6 AM)</option>
                  </select>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                  <p className="text-sm text-purple-800">
                    <strong>Estimated availability:</strong> 3-5 caregivers in your area
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location & Notes */}
          {bookingStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-dm-foreground mb-2">A few more details</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">Help us find the right caregiver for you.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <MapPin size={14} className="inline mr-1" />
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Your city or area"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-100 dark:border-dm-border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <FileText size={14} className="inline mr-1" />
                    Optional notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Baby age, special needs, or preferences (e.g., 'My baby is 2 months old and prefers to be held while sleeping')"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-100 dark:border-dm-border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-slate-400 mt-1">This helps caregivers prepare for your needs.</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {bookingStep === 4 && (
            <div className="space-y-6">
              <div className="text-center py-6">
                <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={40} className="text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-dm-foreground mb-2">Review your request</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">You can review details before confirming. No obligation.</p>
              </div>

              <div className="bg-slate-50 dark:bg-dm-muted rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Care type</span>
                  <span className="text-sm text-slate-900 dark:text-dm-foreground font-medium">{CARE_TYPES[selectedCareType] || selectedCareType}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Date</span>
                  <span className="text-sm text-slate-900 dark:text-dm-foreground font-medium">{selectedDate || 'Not selected'}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Time</span>
                  <span className="text-sm text-slate-900 dark:text-dm-foreground font-medium capitalize">{selectedTime || 'Not selected'}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Location</span>
                  <span className="text-sm text-slate-900 dark:text-dm-foreground font-medium">{location || 'Not specified'}</span>
                </div>
                {notes && (
                  <div className="pt-3 border-t border-slate-100 dark:border-dm-border">
                    <span className="text-sm font-semibold text-slate-600 block mb-1">Notes</span>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{notes}</p>
                  </div>
                )}
              </div>

              <div className="bg-primary-50 border border-primary-100 rounded-xl p-4">
                <p className="text-sm text-primary-800 leading-relaxed">
                  We'll match you with qualified caregivers. You'll be able to review profiles, read reviews, and confirm before any booking is finalized.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-100 px-8 py-6 flex gap-3 rounded-b-[2rem]">
          {bookingStep > 1 && (
            <button
              onClick={() => setBookingStep(s => s - 1)}
              className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-all"
            >
              Back
            </button>
          )}
          <button
            onClick={() => {
              if (bookingStep < 4) {
                setBookingStep(s => s + 1);
              } else {
                // Step 4: Submit the booking
                if (onSubmit) {
                  onSubmit({
                    careType: selectedCareType,
                    date: selectedDate,
                    time: selectedTime,
                    location,
                    notes,
                  });
                }
                handleClose();
              }
            }}
            disabled={bookingStep === 1 && !selectedCareType}
            className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {bookingStep < 4 ? 'Continue' : 'Submit Request'}
            {bookingStep < 4 && <ArrowRight size={16} />}
          </button>
        </div>

      </div>
    </div>
  );
};
