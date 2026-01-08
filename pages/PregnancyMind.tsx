import React, { useState, useRef, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { Smile, Frown, Meh, Lock, Mic, ArrowRight, X, Send, Shield, Heart } from 'lucide-react';

const moodData = [
  { day: 'M', value: 3 },
  { day: 'T', value: 4 },
  { day: 'W', value: 6 },
  { day: 'T', value: 8 },
  { day: 'F', value: 7 },
  { day: 'S', value: 9 },
  { day: 'S', value: 8 },
];

export const PregnancyMind: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "Welcome to your prenatal wellness space. How are you feeling today?" }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newUserMsg = { id: Date.now(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: "Thank you for sharing. Pregnancy brings so many changes. Would you like to talk more about how you're coping?" 
      }]);
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Motivational Quote - Centered */}
      <div className="flex flex-col items-center justify-center text-center py-16 bg-slate-50/50 rounded-[2rem] my-4">
        <Heart size={40} className="text-rose-400 mb-6" />
        <p className="font-serif italic text-3xl md:text-4xl lg:text-5xl text-slate-800 leading-relaxed max-w-4xl px-8" style={{ fontFamily: "'DM Serif Display', serif" }}>
          You are stronger than you know. Each day brings you closer to meeting your little one.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-slate-900">Prenatal Wellness</h1>
          <p className="text-slate-500 mt-1">Nurturing your emotional health during pregnancy.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Check-in Area */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none opacity-60"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold font-display text-slate-900">Daily Check-In</h2>
                <span className="text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full">Today</span>
              </div>

              {/* Mood Selector */}
              <div className="flex justify-between max-w-md mx-auto mb-10">
                {[
                  { icon: Frown, label: 'Rough', color: 'bg-red-100 text-red-500' },
                  { icon: Meh, label: 'Okay', color: 'bg-slate-100 text-slate-500' },
                  { icon: Smile, label: 'Good', color: 'bg-rose-100 text-rose-600', active: true },
                ].map((item, idx) => (
                   <div key={idx} className="flex flex-col items-center gap-2 cursor-pointer group">
                     <div className={`
                       w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
                       ${item.active ? `${item.color} scale-110 shadow-lg ring-4 ring-white` : 'bg-slate-50 text-slate-300 hover:bg-slate-100'}
                     `}>
                       <item.icon size={32} />
                     </div>
                     <span className={`text-xs font-bold ${item.active ? 'text-slate-900' : 'text-slate-400'}`}>
                       {item.label}
                     </span>
                   </div>
                ))}
              </div>

              {/* Factors */}
              <div className="mb-8">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">What's affecting you?</label>
                <div className="flex flex-wrap gap-2">
                  {['Sleep', 'Work', 'Family', 'My Body', 'Diet'].map((tag, i) => (
                    <button key={i} className={`px-4 py-2 rounded-full text-sm border transition-colors ${tag === 'My Body' ? 'bg-rose-50 border-rose-200 text-rose-700 font-medium' : 'border-slate-200 text-slate-600 hover:border-rose-200'}`}>
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Journal Input */}
              <div className="relative">
                <textarea 
                  className="w-full h-32 bg-slate-50 border-0 rounded-2xl p-5 text-slate-700 resize-none focus:ring-2 focus:ring-rose-200 placeholder:text-slate-400 text-sm leading-relaxed"
                  placeholder="Write as much or as little as you need..."
                ></textarea>
                <button className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-sm text-slate-400 hover:text-rose-600">
                  <Mic size={20} />
                </button>
              </div>

              <div className="mt-6 flex justify-end">
                <button className="bg-rose-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-rose-600/20 hover:bg-rose-700 transition-colors">
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stats & AI */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Mood Trends Chart */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 h-[300px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold font-display text-slate-900">Mood Trends</h2>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md">
                +15% vs Last Week
              </span>
            </div>
            
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moodData}>
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#f43f5e" 
                    radius={[4, 4, 4, 4]} 
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Silent Chat AI Promo */}
          <div 
            onClick={() => setIsChatOpen(true)}
            className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group cursor-pointer shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500 rounded-full blur-[60px] opacity-20"></div>
            
            <div className="relative z-10">
               <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4 backdrop-blur-sm">
                 <Lock size={20} className="text-rose-300" />
               </div>
               <h3 className="text-lg font-bold font-display mb-2">Midwife AI</h3>
               <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                 Need to talk through pregnancy concerns? Our AI companion is here to support you.
               </p>
               
               <div className="flex items-center gap-2 text-sm font-bold text-rose-300 group-hover:text-rose-200 transition-colors">
                 Start Secure Session <ArrowRight size={16} />
               </div>
            </div>
          </div>

        </div>
      </div>

      {/* Chat Popup Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
             className="bg-white w-full max-w-md h-[600px] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
             onClick={(e) => e.stopPropagation()}
          >
             {/* Chat Header */}
             <div className="bg-slate-900 p-6 flex items-center justify-between text-white shrink-0">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                     <Lock size={18} className="text-rose-400" />
                   </div>
                   <div>
                     <h3 className="font-bold font-display">Midwife AI</h3>
                     <div className="flex items-center gap-1.5 opacity-80">
                       <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                       <span className="text-[10px] font-bold uppercase tracking-wider">Secure & Encrypted</span>
                     </div>
                   </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsChatOpen(false); }}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X size={18} />
                </button>
             </div>

             {/* Messages */}
             <div className="flex-1 bg-slate-50 p-6 overflow-y-auto space-y-4">
               {messages.map((msg) => (
                 <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`
                     max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed
                     ${msg.sender === 'user' 
                       ? 'bg-slate-900 text-white rounded-tr-none shadow-md shadow-slate-900/10' 
                       : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'}
                   `}>
                     {msg.text}
                   </div>
                 </div>
               ))}
               <div ref={messagesEndRef} />
             </div>

             {/* Input Area */}
             <div className="p-4 bg-white border-t border-slate-100 shrink-0">
               <div className="relative flex items-center gap-2">
                 <input 
                   type="text" 
                   value={inputValue}
                   onChange={(e) => setInputValue(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                   placeholder="Type your thoughts..."
                   className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl py-3.5 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                   autoFocus
                 />
                 <button 
                   onClick={handleSend}
                   disabled={!inputValue.trim()}
                   className="absolute right-2 p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                 >
                   <Send size={16} />
                 </button>
               </div>
               <p className="text-center text-[10px] text-slate-400 mt-3 flex items-center justify-center gap-1.5">
                 <Shield size={10} />
                 Conversations are anonymous and not stored permanently.
               </p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
