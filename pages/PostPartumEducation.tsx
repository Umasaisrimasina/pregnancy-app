import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Heart, Brain, Baby, Shield, Sparkles, BookOpen, AlertCircle, Phone, Lock, Send, Mic, Lightbulb, X, Check, ChevronLeft, ChevronRight, Volume2, Share2 } from 'lucide-react';

export const PostPartumEducation: React.FC = () => {
  const [currentMythIndex, setCurrentMythIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "Hello! I'm here to support you through your postpartum journey. How can I help you today?" }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newUserMsg = { id: Date.now(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: "Thank you for sharing. Remember, recovery takes time and it's okay to ask for help. Would you like some resources on this topic?" 
      }]);
    }, 1000);
  };

  const myths = [
    {
      myth: "Mother should not eat much after delivery",
      fact: "Extra nutrition and fluids help healing and milk production. Eating well supports your recovery."
    },
    {
      myth: "Sadness after birth is weakness",
      fact: "Postpartum changes in mood are common and treatable. Asking for help is a sign of strength."
    },
    {
      myth: "Breastfeeding should start after milk comes",
      fact: "Breastfeeding should start within 1 hour of birth. Colostrum is vital for your baby's health."
    }
  ];

  const nextMyth = () => setCurrentMythIndex((prev) => (prev + 1) % myths.length);
  const prevMyth = () => setCurrentMythIndex((prev) => (prev - 1 + myths.length) % myths.length);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Motivational Quote - Centered */}
      <div className="flex flex-col items-center justify-center text-center py-16 bg-slate-50/50 rounded-[2rem] my-4">
        <Heart size={40} className="text-purple-400 mb-6" />
        <p className="font-serif italic text-3xl md:text-4xl lg:text-5xl text-slate-800 leading-relaxed max-w-4xl px-8" style={{ fontFamily: "'DM Serif Display', serif" }}>
          You are doing amazing, mama. Every small step forward is a victory.
        </p>
      </div>

      {/* Hero + Chat Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Hero */}
        <div className="xl:col-span-3 bg-white rounded-[2rem] p-8 lg:p-12 shadow-sm border border-slate-100 overflow-hidden relative">
           <div className="absolute top-0 right-0 w-96 h-96 bg-purple-50 rounded-full blur-[100px] -mr-20 -mt-20 opacity-60 pointer-events-none"></div>
           <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider mb-6 border border-purple-100">
                 <Sparkles size={14} />
                 Recovery Resources
              </div>
              <h1 className="text-4xl lg:text-5xl font-display font-extrabold text-slate-900 mb-6 leading-tight">
                 Your postpartum <br/>recovery guide.
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                The fourth trimester is just as important. Expert guidance on physical recovery, mental health, and bonding with your newborn.
              </p>
           </div>
        </div>

        {/* Chat Interface */}
        <div className="xl:col-span-2">
          <div className="bg-slate-900 rounded-[2rem] p-6 h-full flex flex-col relative overflow-hidden shadow-xl shadow-slate-900/10 min-h-[400px]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                  <Lock size={16} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Recovery Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Private & Secure</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 space-y-4 mb-4 overflow-y-auto custom-scrollbar pr-1">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                      msg.sender === 'user' 
                        ? 'bg-purple-600 text-white rounded-tr-none' 
                        : 'bg-white/10 text-slate-200 rounded-tl-none border border-white/5'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="relative mt-auto">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about recovery..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-20 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-slate-500" 
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <button className="w-8 h-8 text-slate-400 hover:text-purple-400 rounded-lg flex items-center justify-center transition-colors">
                    <Mic size={14} />
                  </button>
                  <button 
                    onClick={handleSend}
                    className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center hover:bg-purple-500 transition-colors shadow-lg shadow-purple-900/50"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mental Health Alert */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-[2rem] p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <Heart size={32} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold font-display mb-2">Your Mental Health Matters</h3>
            <p className="text-purple-100 text-sm leading-relaxed">
              Postpartum depression affects 1 in 7 mothers. If you're feeling overwhelmed, sad, or anxious, you're not alone and help is available.
            </p>
          </div>
          <button className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-purple-50 transition-colors flex items-center gap-2">
            <Phone size={16} /> Get Support
          </button>
        </div>
      </div>

      {/* Recovery Topics */}
      <div>
        <h2 className="text-xl font-bold font-display text-slate-900 mb-6">Recovery Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: Heart, title: "Physical Recovery", desc: "Healing timelines and self-care", color: "text-purple-500", bg: "bg-purple-50" },
            { icon: Brain, title: "Mental Wellness", desc: "Understanding baby blues vs PPD", color: "text-indigo-500", bg: "bg-indigo-50" },
            { icon: Baby, title: "Newborn Bonding", desc: "Building attachment with your baby", color: "text-purple-600", bg: "bg-purple-50" },
            { icon: Shield, title: "Pelvic Floor Health", desc: "Exercises and recovery tips", color: "text-indigo-600", bg: "bg-indigo-50" },
          ].map((topic, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-purple-200 hover:shadow-md transition-all cursor-pointer group flex gap-4">
              <div className={`w-12 h-12 rounded-xl ${topic.bg} ${topic.color} flex items-center justify-center shrink-0`}>
                <topic.icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1 group-hover:text-purple-600 transition-colors">{topic.title}</h3>
                <p className="text-sm text-slate-500">{topic.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warning Signs */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-[2rem] p-8 border border-purple-100">
        <div className="flex items-center gap-3 mb-6">
          <AlertCircle size={24} className="text-purple-500" />
          <h2 className="text-xl font-bold font-display text-slate-900">When to Seek Help</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Feeling hopeless or worthless",
            "Difficulty bonding with baby",
            "Severe mood swings",
            "Thoughts of harming yourself or baby",
            "Unable to sleep even when baby sleeps",
            "Loss of interest in activities",
          ].map((sign, i) => (
            <div key={i} className="bg-white p-4 rounded-xl flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span className="text-sm text-slate-700">{sign}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 bg-white rounded-xl p-4 border border-purple-200">
          <p className="text-sm text-purple-800 font-medium">
            <strong>Crisis Helplines:</strong> iCall: 9152987821 • Vandrevala Foundation: 1860-2662-345
          </p>
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
            <button className="w-8 h-8 rounded-full bg-white/80 border border-amber-200 flex items-center justify-center text-amber-600 hover:bg-amber-50 transition-colors">
              <Volume2 size={14} />
            </button>
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
            Sources: WHO Postnatal Care Guidelines • WHO Maternal Mental Health Programme • WHO–UNICEF IYCF Guidelines
          </p>
        </div>
      </div>

      {/* Breastfeeding Section */}
      <div>
        <h2 className="text-xl font-bold font-display text-slate-900 mb-6">Breastfeeding Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "Latching Guide", desc: "Proper techniques for comfortable feeding" },
            { title: "Common Challenges", desc: "Solutions for engorgement, mastitis & more" },
            { title: "Pumping Tips", desc: "Building and storing your milk supply" },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
               <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
               <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
