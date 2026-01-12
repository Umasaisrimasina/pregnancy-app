import React, { useState } from 'react';
import { ShieldCheck, Clock, Brain, Baby, Shield, Heart, Lightbulb, X, Check, ChevronLeft, ChevronRight, Volume2, Share2 } from 'lucide-react';
import { SpeakButton } from '../components/SpeakButton';

export const PreConceptionEducation: React.FC = () => {
  const [currentMythIndex, setCurrentMythIndex] = useState(0);

  const myths = [
    {
      myth: "Iron & folic tablets make the baby too big",
      fact: "These supplements help prevent anemia and birth defects. They do not cause big babies."
    },
    {
      myth: "Exercise reduces chances of pregnancy",
      fact: "Regular light activity actually improves fertility and overall health."
    },
    {
      myth: "Alcohol in small amounts is safe before pregnancy",
      fact: "No amount of alcohol is safe when planning pregnancy. It's best to avoid completely."
    }
  ];

  const nextMyth = () => setCurrentMythIndex((prev) => (prev + 1) % myths.length);
  const prevMyth = () => setCurrentMythIndex((prev) => (prev - 1 + myths.length) % myths.length);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">

      {/* Motivational Quote - Centered */}
      <div className="flex flex-col items-center justify-center text-center py-16 bg-slate-50/50 rounded-[2rem] my-4 relative">
        <Heart size={40} className="text-emerald-400 mb-6" />
        <p className="font-serif italic text-3xl md:text-4xl lg:text-5xl text-slate-800 leading-relaxed max-w-5xl px-8" style={{ fontFamily: "'DM Serif Display', serif" }}>
          Every journey begins with preparation. You're investing in your future family's health.
        </p>
        <div className="absolute top-4 right-4">
          <SpeakButton text="Every journey begins with preparation. You're investing in your future family's health." size={22} />
        </div>
      </div>

      {/* Hero */}
      <div className="bg-white rounded-[2rem] p-8 lg:p-12 shadow-sm border border-slate-100 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-[100px] -mr-20 -mt-20 opacity-60 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6 border border-emerald-100">
            <ShieldCheck size={14} />
            The Science
          </div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl font-display font-extrabold text-slate-900 mb-6 leading-tight">
                It starts before day one.
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-4xl">
                Did you know? An egg takes about 90 days to mature before it's released. The health of your body during this 3-6 month window directly impacts the genetic material you pass on.
              </p>
            </div>
            <SpeakButton 
              text="It starts before day one. Did you know? An egg takes about 90 days to mature before it's released. The health of your body during this 3-6 month window directly impacts the genetic material you pass on." 
              size={24}
              className="flex-shrink-0 mt-2"
            />
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Standard Care */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 opacity-75 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Clock size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Standard Care</h3>
          </div>
          <ul className="space-y-4">
            <li className="flex gap-3 text-sm text-slate-600">
              <span className="text-red-400 font-bold">×</span>
              Care often starts only after a positive test (Week 4-6).
            </li>
            <li className="flex gap-3 text-sm text-slate-600">
              <span className="text-red-400 font-bold">×</span>
              Nutrient deficiencies are treated reactively.
            </li>
          </ul>
        </div>

        {/* Preventive Care */}
        <div className="bg-gradient-to-b from-emerald-50/50 to-white rounded-[2rem] p-8 border-2 border-emerald-100 relative shadow-lg shadow-emerald-900/5">
          <div className="absolute -top-3 left-8 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Recommended
          </div>
          <div className="flex items-center gap-3 mb-6 mt-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Preventive Care</h3>
          </div>
          <ul className="space-y-4">
            <li className="flex gap-3 text-sm text-slate-800 font-medium">
              <span className="text-emerald-600 font-bold">✓</span>
              Care begins 3-6 months pre-conception.
            </li>
            <li className="flex gap-3 text-sm text-slate-800 font-medium">
              <span className="text-emerald-600 font-bold">✓</span>
              Optimized stores for baby's critical development.
            </li>
          </ul>
        </div>
      </div>

      {/* Benefits */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-bold font-display text-slate-900">Key Benefits</h2>
          <SpeakButton text="Key Benefits of pre-conception planning: Baby's Brain - Neural tube forms in first 4 weeks. Recovery - Stronger iron stores mean faster postpartum recovery. Risk Reduction - Lowers risk of gestational diabetes." size="sm" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Brain, title: "Baby's Brain", desc: "Neural tube forms in first 4 weeks.", color: "text-emerald-500", bg: "bg-emerald-50" },
            { icon: Baby, title: "Recovery", desc: "Stronger iron stores mean faster postpartum recovery.", color: "text-teal-500", bg: "bg-teal-50" },
            { icon: Shield, title: "Risk Reduction", desc: "Lowers risk of gestational diabetes.", color: "text-emerald-600", bg: "bg-emerald-50" },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow group relative">
              <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-4`}>
                <item.icon size={24} />
              </div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
                <SpeakButton text={`${item.title}. ${item.desc}`} size={16} className="flex-shrink-0" />
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
            Sources: WHO Nutrition Guidelines • WHO Physical Activity Guidelines (2020) • WHO Substance Use During Pregnancy Guidelines
          </p>
        </div>
      </div>

      {/* Topics Grid */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-bold font-display text-slate-900">Learning Topics</h2>
          <SpeakButton text="Learning Topics: Fertility Nutrition for foods that support egg and sperm health. Supplement Guide with essential prenatal vitamins explained. Cycle Tracking to understand your fertile window. Lifestyle Factors covering sleep, stress, and conception success." size="sm" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Fertility Nutrition", desc: "Foods that support egg and sperm health" },
            { title: "Supplement Guide", desc: "Essential prenatal vitamins explained" },
            { title: "Cycle Tracking", desc: "Understanding your fertile window" },
            { title: "Lifestyle Factors", desc: "Sleep, stress, and conception success" },
          ].map((topic, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">{topic.title}</h3>
                  <p className="text-sm text-slate-500">{topic.desc}</p>
                </div>
                <SpeakButton text={`${topic.title}. ${topic.desc}`} size={16} className="flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
