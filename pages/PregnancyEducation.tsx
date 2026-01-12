import React, { useState } from 'react';
import { ShieldCheck, Clock, Brain, Baby, Shield, Heart, Calendar, BookOpen, Lightbulb, X, Check, ChevronLeft, ChevronRight, Volume2, Share2 } from 'lucide-react';
import { SpeakButton } from '../components/SpeakButton';

export const PregnancyEducation: React.FC = () => {
  const [currentMythIndex, setCurrentMythIndex] = useState(0);
  
  const myths = [
    {
      myth: "Pregnant women should eat for two",
      fact: "One extra healthy meal is enough. Overeating can cause complications for you and baby."
    },
    {
      myth: "No movement or exercise during pregnancy",
      fact: "Walking and light activity are safe and beneficial for most pregnancies."
    },
    {
      myth: "Ultrasound scans harm the baby",
      fact: "Ultrasound scans are safe and help detect problems early to keep you and baby healthy."
    },
    {
      myth: "Pregnancy pain and bleeding are normal",
      fact: "Bleeding, swelling, fever, or severe headache are warning signs. Please see a doctor promptly."
    }
  ];

  const nextMyth = () => setCurrentMythIndex((prev) => (prev + 1) % myths.length);
  const prevMyth = () => setCurrentMythIndex((prev) => (prev - 1 + myths.length) % myths.length);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Motivational Quote - Centered */}
      <div className="flex flex-col items-center justify-center text-center py-16 bg-slate-50/50 rounded-[2rem] my-4 relative">
        <Heart size={40} className="text-rose-400 mb-6" />
        <p className="font-serif italic text-3xl md:text-4xl lg:text-5xl text-slate-800 leading-relaxed max-w-4xl px-8" style={{ fontFamily: "'DM Serif Display', serif" }}>
          Your body is creating a miracle. Trust the journey and embrace each moment.
        </p>
        <div className="absolute top-4 right-4">
          <SpeakButton text="Your body is creating a miracle. Trust the journey and embrace each moment." size={22} />
        </div>
      </div>

      {/* Hero */}
      <div className="bg-white rounded-[2rem] p-8 lg:p-12 shadow-sm border border-slate-100 overflow-hidden relative group">
         <div className="absolute top-0 right-0 w-96 h-96 bg-rose-50 rounded-full blur-[100px] -mr-20 -mt-20 opacity-60 pointer-events-none"></div>
         <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider mb-6 border border-rose-100">
               <Heart size={14} />
               Pregnancy Library
            </div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-4xl lg:text-5xl font-display font-extrabold text-slate-900 mb-6 leading-tight">
                   Your pregnancy <br/>knowledge hub.
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                  Expert-curated content to guide you through each trimester. From fetal development to labor preparation, find trusted information here.
                </p>
              </div>
              <SpeakButton 
                text="Your pregnancy knowledge hub. Expert-curated content to guide you through each trimester. From fetal development to labor preparation, find trusted information here." 
                size={24}
                className="flex-shrink-0 mt-2"
              />
            </div>
         </div>
      </div>

      {/* Trimester Navigation */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "First Trimester", weeks: "Weeks 1-12", active: false },
          { label: "Second Trimester", weeks: "Weeks 13-26", active: true },
          { label: "Third Trimester", weeks: "Weeks 27-40", active: false },
        ].map((trim, i) => (
          <button 
            key={i} 
            className={`p-4 rounded-2xl border text-center transition-all ${
              trim.active 
                ? 'bg-rose-50 border-rose-200 shadow-sm' 
                : 'bg-white border-slate-100 hover:border-rose-200'
            }`}
          >
            <span className={`font-bold block ${trim.active ? 'text-rose-700' : 'text-slate-700'}`}>
              {trim.label}
            </span>
            <span className="text-xs text-slate-400">{trim.weeks}</span>
          </button>
        ))}
      </div>

      {/* Topics Grid */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-bold font-display text-slate-900">Featured Topics</h2>
          <SpeakButton text="Featured Topics: Fetal Development with week-by-week growth milestones. Your Changing Body covering physical and emotional changes. Prenatal Tests for understanding screenings and results. Birth Preparation for labor, delivery, and birth plans." size="sm" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: Brain, title: "Fetal Development", desc: "Week-by-week growth milestones", color: "text-rose-500", bg: "bg-rose-50" },
            { icon: Heart, title: "Your Changing Body", desc: "Physical and emotional changes", color: "text-pink-500", bg: "bg-pink-50" },
            { icon: Shield, title: "Prenatal Tests", desc: "Understanding screenings and results", color: "text-rose-600", bg: "bg-rose-50" },
            { icon: Calendar, title: "Birth Preparation", desc: "Labor, delivery, and birth plans", color: "text-rose-500", bg: "bg-rose-50" },
          ].map((topic, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-rose-200 hover:shadow-md transition-all cursor-pointer group flex gap-4">
              <div className={`w-12 h-12 rounded-xl ${topic.bg} ${topic.color} flex items-center justify-center shrink-0`}>
                <topic.icon size={24} />
              </div>
              <div className="flex-1 flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 mb-1 group-hover:text-rose-600 transition-colors">{topic.title}</h3>
                  <p className="text-sm text-slate-500">{topic.desc}</p>
                </div>
                <SpeakButton text={`${topic.title}. ${topic.desc}`} size={16} className="flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>

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
            <SpeakButton 
              text={`Myth: ${myths[currentMythIndex].myth}. Fact: ${myths[currentMythIndex].fact}`} 
              size={16} 
            />
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
            Sources: WHO Antenatal Care Guidelines (2016) • WHO Managing Complications in Pregnancy • WHO Physical Activity Guidelines
          </p>
        </div>
      </div>

      {/* Common Questions */}
      <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-[2rem] p-8 border border-rose-100">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen size={24} className="text-rose-500" />
          <h2 className="text-xl font-bold font-display text-slate-900">Common Questions</h2>
          <SpeakButton text="Common Questions: Is it safe to exercise during pregnancy? What foods should I avoid? When should I feel the baby move? How do I know if contractions are real?" size="sm" />
        </div>
        <div className="space-y-4">
          {[
            "Is it safe to exercise during pregnancy?",
            "What foods should I avoid?",
            "When should I feel the baby move?",
            "How do I know if contractions are real?",
          ].map((q, i) => (
            <div key={i} className="bg-white p-4 rounded-xl hover:shadow-md transition-all cursor-pointer">
              <span className="font-medium text-slate-700">{q}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
