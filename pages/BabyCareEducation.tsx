import React, { useState } from 'react';
import { ShieldCheck, Heart, Brain, Baby, Shield, Sparkles, BookOpen, Calendar, Syringe, Scale, Users, CheckCircle2, X, ArrowRight, Clock, MapPin, FileText, Lightbulb, Check, ChevronLeft, ChevronRight, Volume2, Share2 } from 'lucide-react';
import { SpeakButton } from '../components/SpeakButton';

export const BabyCareEducation: React.FC = () => {
  const [currentMythIndex, setCurrentMythIndex] = useState(0);
  const [isCaregiverModalOpen, setIsCaregiverModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedCareType, setSelectedCareType] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');

  const handleOpenModal = () => {
    setIsCaregiverModalOpen(true);
    setBookingStep(1);
    setSelectedCareType('');
    setSelectedDate('');
    setSelectedTime('');
    setNotes('');
  };

  const handleCloseModal = () => {
    setIsCaregiverModalOpen(false);
  };

  const handleNextStep = () => {
    setBookingStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setBookingStep(prev => prev - 1);
  };

  const myths = [
    {
      myth: "Honey or water cleans baby's stomach",
      fact: "Only breast milk for the first 6 months. Honey can be dangerous for babies under 1 year."
    },
    {
      myth: "Oil or powder on umbilical cord helps healing",
      fact: "Keep the cord clean and dry. Applying substances can cause infection."
    },
    {
      myth: "Baby should be bathed immediately after birth",
      fact: "Bathing before 24 hours can cause low body temperature. Delay the first bath."
    },
    {
      myth: "Vaccines make baby sick",
      fact: "Vaccines save lives. A mild fever after vaccination is normal and temporary."
    },
    {
      myth: "Bottle feeding is modern and better",
      fact: "Bottle feeding increases infection risk. Cup and spoon feeding are safer alternatives."
    },
    {
      myth: "Junk food helps baby gain weight",
      fact: "Junk food harms growth and brain development. Nutritious foods support healthy growth."
    }
  ];

  const nextMyth = () => setCurrentMythIndex((prev) => (prev + 1) % myths.length);
  const prevMyth = () => setCurrentMythIndex((prev) => (prev - 1 + myths.length) % myths.length);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Hero */}
      <div className="bg-white rounded-[2rem] p-8 lg:p-12 shadow-sm border border-slate-100 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-96 h-96 bg-sky-50 rounded-full blur-[100px] -mr-20 -mt-20 opacity-60 pointer-events-none"></div>
         <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider mb-6 border border-sky-100">
               <Baby size={14} />
               Baby Care Guide
            </div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-4xl lg:text-5xl font-display font-extrabold text-slate-900 mb-6 leading-tight">
                   Everything about <br/>caring for baby.
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                  Evidence-based guidance for newborn care, development milestones, feeding, sleep, and keeping your little one healthy and happy.
                </p>
              </div>
              <SpeakButton text="Everything about caring for baby. Evidence-based guidance for newborn care, development milestones, feeding, sleep, and keeping your little one healthy and happy." />
            </div>
         </div>
      </div>

      {/* Age Navigation */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "0-3 months", active: true },
          { label: "3-6 months", active: false },
          { label: "6-9 months", active: false },
          { label: "9-12 months", active: false },
        ].map((age, i) => (
          <button 
            key={i} 
            className={`p-3 rounded-xl border text-center transition-all text-sm font-medium ${
              age.active 
                ? 'bg-sky-50 border-sky-200 text-sky-700 shadow-sm' 
                : 'bg-white border-slate-100 text-slate-600 hover:border-sky-200'
            }`}
          >
            {age.label}
          </button>
        ))}
      </div>

      {/* Care Topics */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-bold font-display text-slate-900">Care Essentials</h2>
          <SpeakButton text="Care Essentials: Feeding Guide for breast, bottle, and combination feeding. Development Milestones for what to expect month by month. Sleep Training for safe sleep practices and routines. Health and Safety for keeping baby healthy and safe." size="sm" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: Heart, title: "Feeding Guide", desc: "Breast, bottle, and combination feeding", color: "text-sky-500", bg: "bg-sky-50" },
            { icon: Brain, title: "Development Milestones", desc: "What to expect month by month", color: "text-blue-500", bg: "bg-blue-50" },
            { icon: Calendar, title: "Sleep Training", desc: "Safe sleep practices and routines", color: "text-sky-600", bg: "bg-sky-50" },
            { icon: Shield, title: "Health & Safety", desc: "Keeping baby healthy and safe", color: "text-blue-600", bg: "bg-blue-50" },
          ].map((topic, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-sky-200 hover:shadow-md transition-all cursor-pointer group flex gap-4">
              <div className={`w-12 h-12 rounded-xl ${topic.bg} ${topic.color} flex items-center justify-center shrink-0`}>
                <topic.icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1 group-hover:text-sky-600 transition-colors">{topic.title}</h3>
                <p className="text-sm text-slate-500">{topic.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Caregiver Booking Card */}
      <div className="bg-gradient-to-br from-purple-50/50 to-indigo-50/30 rounded-[2rem] p-8 border border-purple-100/50 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/80 border border-purple-100 flex items-center justify-center shadow-sm">
                <Users size={28} className="text-purple-600" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <div className="flex items-start gap-2">
                  <div>
                    <h3 className="text-xl font-bold font-display text-slate-900 mb-1">Need extra help today?</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">Trusted caregivers available when you need rest or support.</p>
                  </div>
                  <SpeakButton text="Need extra help today? Trusted caregivers available when you need rest or support. Certified and background-verified, flexible hours, with postpartum and newborn care experience." size={14} />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 space-y-3">
            {[
              { icon: CheckCircle2, text: "Certified & background-verified" },
              { icon: Clock, text: "Flexible hours (day / night)" },
              { icon: Heart, text: "Postpartum & newborn care experience" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                  <item.icon size={12} className="text-purple-600" />
                </div>
                <span className="text-sm text-slate-700 font-medium">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <button 
              onClick={handleOpenModal}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
            >
              Find a Caregiver
              <ArrowRight size={16} />
            </button>
            <button className="px-6 py-3 bg-white/80 border border-purple-100 text-purple-700 rounded-xl font-semibold text-sm hover:bg-white transition-all">
              Learn how caregiver support works
            </button>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-purple-100/50">
            <p className="text-xs text-slate-600 leading-relaxed">
              <Shield size={12} className="inline mr-1.5 text-purple-500" />
              Caregivers are independently verified. This service provides support, not medical care.
            </p>
          </div>
        </div>
      </div>

      {/* Caregiver Booking Modal */}
      {isCaregiverModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 px-8 py-6 flex items-center justify-between z-10 rounded-t-[2rem]">
              <div>
                <h2 className="text-2xl font-bold font-display text-slate-900">Find a Caregiver</h2>
                <p className="text-sm text-slate-500 mt-1">Step {bookingStep} of 4</p>
              </div>
              <button 
                onClick={handleCloseModal}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-8 py-6">
              
              {/* Step 1: Care Type */}
              {bookingStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">What type of care do you need?</h3>
                    <p className="text-sm text-slate-600">Select the support that works best for you.</p>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { id: 'newborn', title: 'Newborn care', desc: 'Feeding, soothing, and daily care support', icon: Baby },
                      { id: 'night', title: 'Night care', desc: 'Overnight support so you can rest', icon: Clock },
                      { id: 'short', title: 'Short-term help', desc: 'A few hours when you need a break', icon: Heart },
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedCareType(type.id)}
                        className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
                          selectedCareType === type.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-slate-100 bg-white hover:border-purple-200'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                            selectedCareType === type.id ? 'bg-purple-100 text-purple-600' : 'bg-slate-50 text-slate-400'
                          }`}>
                            <type.icon size={24} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-900 mb-1">{type.title}</h4>
                            <p className="text-sm text-slate-600">{type.desc}</p>
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">When do you need support?</h3>
                    <p className="text-sm text-slate-600">Choose a date and time that works for you.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Time</label>
                      <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    <h3 className="text-lg font-bold text-slate-900 mb-2">A few more details</h3>
                    <p className="text-sm text-slate-600">Help us find the right caregiver for you.</p>
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
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        defaultValue="Auto-detected location"
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
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
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
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Review your request</h3>
                    <p className="text-sm text-slate-600">You can review details before confirming. No obligation.</p>
                  </div>
                  
                  <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-semibold text-slate-600">Care type</span>
                      <span className="text-sm text-slate-900 font-medium capitalize">{selectedCareType?.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-semibold text-slate-600">Date</span>
                      <span className="text-sm text-slate-900 font-medium">{selectedDate || 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-semibold text-slate-600">Time</span>
                      <span className="text-sm text-slate-900 font-medium capitalize">{selectedTime || 'Not selected'}</span>
                    </div>
                    {notes && (
                      <div className="pt-3 border-t border-slate-200">
                        <span className="text-sm font-semibold text-slate-600 block mb-1">Notes</span>
                        <p className="text-sm text-slate-700">{notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                    <p className="text-sm text-emerald-800 leading-relaxed">
                      We'll match you with qualified caregivers. You'll be able to review profiles, read reviews, and confirm before any booking is finalized.
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-slate-100 px-8 py-6 flex gap-3 rounded-b-[2rem]">
              {bookingStep > 1 && (
                <button
                  onClick={handlePrevStep}
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-all"
                >
                  Back
                </button>
              )}
              
              <button
                onClick={bookingStep < 4 ? handleNextStep : handleCloseModal}
                disabled={bookingStep === 1 && !selectedCareType}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {bookingStep < 4 ? 'Continue' : 'Submit Request'}
                {bookingStep < 4 && <ArrowRight size={16} />}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Myth vs Fact Section */}
      <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 rounded-[2rem] p-6 lg:p-8 border border-amber-100/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Lightbulb size={20} className="text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-slate-900">Did you know?</h2>
              <p className="text-xs text-slate-500">Swipe to learn more health facts</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SpeakButton text={`Myth: ${myths[currentMythIndex].myth}. Fact: ${myths[currentMythIndex].fact}`} size={14} />
            <button className="w-8 h-8 rounded-full bg-white/80 border border-amber-200 flex items-center justify-center text-amber-600 hover:bg-amber-50 transition-colors">
              <Share2 size={14} />
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100/50 min-h-[200px]">
            {/* Myth */}
            <div className="flex items-start gap-3 mb-5 pb-5 border-b border-slate-100">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <X size={16} className="text-red-500" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block mb-1">Myth</span>
                <p className="text-slate-800 font-semibold leading-relaxed">"{myths[currentMythIndex].myth}"</p>
              </div>
            </div>
            
            {/* Fact */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <Check size={16} className="text-emerald-600" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">Fact</span>
                <p className="text-slate-700 leading-relaxed">{myths[currentMythIndex].fact}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-4">
            <button 
              onClick={prevMyth}
              className="w-10 h-10 rounded-full bg-white border border-amber-200 flex items-center justify-center text-amber-600 hover:bg-amber-50 transition-colors shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="flex gap-1.5">
              {myths.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full transition-colors ${i === currentMythIndex ? 'bg-amber-500' : 'bg-amber-200'}`}
                />
              ))}
            </div>
            
            <button 
              onClick={nextMyth}
              className="w-10 h-10 rounded-full bg-white border border-amber-200 flex items-center justify-center text-amber-600 hover:bg-amber-50 transition-colors shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-amber-100">
          <p className="text-[11px] text-slate-500 text-center leading-relaxed">
            <Shield size={10} className="inline mr-1" />
            Health information based on global medical guidelines. This does not replace a doctor's advice.
          </p>
          <p className="text-[9px] text-slate-400 text-center mt-2 leading-relaxed">
            Sources: WHO Essential Newborn Care • WHO–UNICEF IYCF Guidelines • WHO Immunization • WHO Complementary Feeding Guidelines
          </p>
        </div>
      </div>

      {/* Vaccination Schedule */}
      <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-[2rem] p-8 border border-sky-100">
        <div className="flex items-center gap-3 mb-6">
          <Syringe size={24} className="text-sky-500" />
          <h2 className="text-xl font-bold font-display text-slate-900">Vaccination Schedule</h2>
          <SpeakButton text="Vaccination Schedule. BCG, OPV-0, Hep B-1 at birth. OPV-1, Pentavalent-1, Rotavirus-1, PCV-1 at 6 weeks. OPV-2, Pentavalent-2, Rotavirus-2 at 10 weeks. OPV-3, Pentavalent-3, Rotavirus-3, PCV-2 at 14 weeks." size={14} />
        </div>
        <div className="space-y-3">
          {[
            { vaccine: "BCG, OPV-0, Hep B-1", timing: "At birth", status: "completed" },
            { vaccine: "OPV-1, Pentavalent-1, Rotavirus-1, PCV-1", timing: "6 weeks", status: "upcoming" },
            { vaccine: "OPV-2, Pentavalent-2, Rotavirus-2", timing: "10 weeks", status: "pending" },
            { vaccine: "OPV-3, Pentavalent-3, Rotavirus-3, PCV-2", timing: "14 weeks", status: "pending" },
          ].map((vax, i) => (
            <div key={i} className="bg-white p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-medium text-slate-700 block">{vax.vaccine}</span>
                <span className="text-xs text-slate-400">{vax.timing}</span>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                vax.status === 'completed' 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : vax.status === 'upcoming'
                    ? 'bg-sky-100 text-sky-700'
                    : 'bg-slate-100 text-slate-500'
              }`}>
                {vax.status === 'completed' ? 'Done' : vax.status === 'upcoming' ? 'Next' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Growth Tracking */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-bold font-display text-slate-900">Growth & Development</h2>
          <SpeakButton text="Growth and Development: Weight Charts to track healthy weight gain patterns. Motor Skills for physical development milestones. Social Skills for emotional and social development." size="sm" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Scale, title: "Weight Charts", desc: "Track healthy weight gain patterns", color: "text-sky-500", bg: "bg-sky-50" },
            { icon: Brain, title: "Motor Skills", desc: "Physical development milestones", color: "text-blue-500", bg: "bg-blue-50" },
            { icon: Heart, title: "Social Skills", desc: "Emotional and social development", color: "text-sky-600", bg: "bg-sky-50" },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
               <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-4`}>
                 <item.icon size={24} />
               </div>
               <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
               <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
