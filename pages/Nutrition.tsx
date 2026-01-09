import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Check, MoreHorizontal, Utensils, Zap, Droplet, Sparkles, ArrowRight, X, Send, Shield, Minus } from 'lucide-react';
import { AppPhase } from '../types';

interface PageProps {
  phase: AppPhase;
}

export const Nutrition: React.FC<PageProps> = ({ phase }) => {
  const [activeTab, setActiveTab] = useState('today');

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "Hi Sarah! I can help you analyze your meals or suggest nutrient-rich recipes. What's on your mind?" }
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

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: "That sounds like a great choice! Adding some citrus (Vitamin C) can help your body absorb the iron better. Would you like a recipe?" 
      }]);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-slate-900">Nutrition Log</h1>
          <p className="text-slate-500 mt-1">
             {phase === 'pre-pregnancy' && "Fueling your body for conception."}
             {phase === 'pregnancy' && "Nourishing you and your growing baby."}
             {phase === 'post-partum' && "Recovery foods and lactation support."}
             {phase === 'baby-care' && "Tracking feeds and solids."}
          </p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setActiveTab('today')}
             className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'today' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
           >
             Today
           </button>
           <button 
             onClick={() => setActiveTab('weekly')}
             className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'weekly' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
           >
             Weekly Insights
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Log */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Search Bar */}
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-2">
             <div className="p-3 text-slate-400">
               <Search size={20} />
             </div>
             <input 
               type="text" 
               placeholder="Log breakfast, lunch, or snack..." 
               className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 text-base"
             />
             <button className="bg-primary-600 text-white p-3 rounded-xl hover:bg-primary-700 transition-colors">
               <Plus size={20} />
             </button>
          </div>

          {/* Meals List */}
          <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden">
             {/* Breakfast */}
             <div className="p-6 border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
               <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                     <Utensils size={18} />
                   </div>
                   <div>
                     <h3 className="font-bold text-slate-900">Breakfast</h3>
                     <p className="text-xs text-slate-400 font-medium">8:30 AM</p>
                   </div>
                 </div>
                 <button className="text-slate-400 hover:text-primary-600">
                   <MoreHorizontal size={20} />
                 </button>
               </div>
               
               <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <Check size={18} className="text-primary-500" />
                   <span className="text-sm font-medium text-slate-700">Oatmeal with berries & walnuts</span>
                 </div>
                 <span className="px-2 py-1 bg-white border border-slate-100 rounded-md text-[10px] font-bold text-primary-600 uppercase tracking-wide">Iron Source</span>
               </div>
             </div>

             {/* Lunch (Empty State) */}
             <div className="p-6 border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
               <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                     <Utensils size={18} />
                   </div>
                   <div>
                     <h3 className="font-bold text-slate-900">Lunch</h3>
                     <p className="text-xs text-slate-400 font-medium">Not logged yet</p>
                   </div>
                 </div>
                 <button className="text-primary-600 text-sm font-bold bg-primary-50 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                   + Add
                 </button>
               </div>
               
               <div className="border-2 border-dashed border-slate-100 rounded-xl p-6 text-center">
                 <p className="text-sm text-slate-400">Tap to log your midday meal</p>
                 <div className="flex gap-2 justify-center mt-3">
                    <span className="text-xs bg-white border border-slate-200 px-3 py-1 rounded-full text-slate-500 cursor-pointer hover:border-primary-300">Leafy Greens</span>
                    <span className="text-xs bg-white border border-slate-200 px-3 py-1 rounded-full text-slate-500 cursor-pointer hover:border-primary-300">Legumes</span>
                 </div>
               </div>
             </div>
          </div>

          {/* Supplements - Moved Here */}
          <div className="bg-white rounded-[2rem] p-6 border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4">Daily Supplements</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['Prenatal Vitamin', 'Folic Acid', 'Vitamin D'].map((item, i) => (
                  <label key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 cursor-pointer hover:border-primary-200 transition-colors">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${i === 0 ? 'bg-primary-500 border-primary-500' : 'border-slate-300'}`}>
                      {i === 0 && <Check size={12} className="text-white" />}
                    </div>
                    <span className={`text-sm font-medium ${i === 0 ? 'text-slate-900 line-through opacity-50' : 'text-slate-700'}`}>{item}</span>
                  </label>
                ))}
              </div>
           </div>
        </div>

        {/* Right Column: Stats & Chat */}
        <div className="space-y-6">
           {/* Weekly Insight */}
           <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-[2rem] p-6 text-white shadow-lg shadow-primary-900/10">
              <div className="flex items-center gap-2 mb-4 opacity-90">
                <Zap size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">Analysis</span>
              </div>
              <p className="text-lg font-display font-bold mb-2">Iron is slightly low.</p>
              <p className="text-sm text-primary-100 leading-relaxed mb-4">
                You're doing great with Folate! Try adding lentils or spinach to dinner to boost iron.
              </p>
              <div className="h-1.5 bg-primary-900/30 rounded-full overflow-hidden mb-1">
                 <div className="h-full bg-orange-400 w-1/3 rounded-full"></div>
              </div>
              <div className="flex justify-between text-[10px] text-primary-200 font-medium uppercase mt-1">
                <span>Current</span>
                <span>Goal</span>
              </div>
           </div>

           {/* Fluid Hit */}
           <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex flex-col relative overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-900">Fluid Hit</h3>
                    <div className="flex gap-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-sky-400"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                    </div>
                </div>

                <div className="flex-1 flex justify-center gap-12 mb-6">
                    {/* Water Column */}
                    <div className="flex flex-col items-center">
                        {/* Scale/Bar Area */}
                        <div className="relative h-48 w-12">
                            {/* Labels */}
                            <div className="absolute -left-8 top-0 bottom-0 flex flex-col justify-between text-[10px] font-bold text-slate-300 py-2">
                                <span>4L</span>
                                <span>3L</span>
                                <span>2L</span>
                                <span>1L</span>
                            </div>
                            
                            {/* Bar Container */}
                            <div className="w-full h-full bg-slate-100 rounded-full relative overflow-hidden border border-slate-200">
                                {/* Fill */}
                                <div 
                                    className="absolute bottom-0 w-full bg-sky-400 transition-all duration-500"
                                    style={{ height: '45%' }}
                                ></div>
                                
                                {/* Segment lines (optional visual flair) */}
                                <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none opacity-20">
                                     <div className="border-b border-slate-900 w-full"></div>
                                     <div className="border-b border-slate-900 w-full"></div>
                                     <div className="border-b border-slate-900 w-full"></div>
                                </div>
                            </div>
                            
                            {/* Icon Circle */}
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-sky-500 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white z-10">
                                <Droplet size={24} className="text-white" />
                            </div>
                        </div>
                        
                        <div className="mt-10 text-center space-y-3">
                            <div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Water</span>
                                <span className="text-xl font-display font-bold text-slate-900">1.8L</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button 
                                    className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200"
                                >
                                    <Minus size={14} />
                                </button>
                                <button 
                                    className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 hover:bg-sky-600"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Electrolyte Column */}
                    <div className="flex flex-col items-center">
                         {/* Scale/Bar Area */}
                         <div className="relative h-48 w-12">
                            {/* Labels */}
                            <div className="absolute -left-8 top-0 bottom-0 flex flex-col justify-between text-[10px] font-bold text-slate-300 py-2">
                                <span>4Sv</span>
                                <span>3Sv</span>
                                <span>2Sv</span>
                                <span>1Sv</span>
                            </div>
                            
                            {/* Bar Container */}
                            <div className="w-full h-full bg-slate-100 rounded-full relative overflow-hidden border border-slate-200">
                                {/* Fill */}
                                <div 
                                    className="absolute bottom-0 w-full bg-amber-400 transition-all duration-500"
                                    style={{ height: '25%' }}
                                ></div>
                            </div>
                            
                            {/* Icon Circle */}
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white z-10">
                                <Zap size={24} className="text-white" />
                            </div>
                        </div>
                        
                        <div className="mt-10 text-center space-y-3">
                            <div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Hydrate+</span>
                                <span className="text-xl font-display font-bold text-slate-900">1 Sv</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button 
                                    className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200"
                                >
                                    <Minus size={14} />
                                </button>
                                <button 
                                    className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 hover:bg-amber-600"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-rose-50 rounded-2xl p-4 text-xs leading-relaxed text-rose-900">
                    <span className="font-bold text-rose-600">TIP:</span> Proper electrolyte balance prevents muscle cramps and swelling in Trimester 2. Target 3.5L total fluid.
                </div>
            </div>

           {/* Nutrition Chat Card */}
           <div 
            onClick={() => setIsChatOpen(true)}
            className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden group cursor-pointer shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 transition-all min-h-[200px] flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500 rounded-full blur-[60px] opacity-20"></div>
            
            <div className="relative z-10">
               <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4 backdrop-blur-sm">
                 <Sparkles size={20} className="text-primary-300" />
               </div>
               <h3 className="text-lg font-bold font-display mb-2">Nutrition Coach</h3>
               <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                 Need recipe ideas or macro advice? Chat with your personal food guide.
               </p>
               
               <div className="flex items-center gap-2 text-sm font-bold text-primary-300 group-hover:text-primary-200 transition-colors">
                 Start Chat <ArrowRight size={16} />
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
                     <Sparkles size={18} className="text-primary-400" />
                   </div>
                   <div>
                     <h3 className="font-bold font-display">Nutrition Coach</h3>
                     <div className="flex items-center gap-1.5 opacity-80">
                       <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse"></span>
                       <span className="text-[10px] font-bold uppercase tracking-wider">AI Assistant</span>
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
                   placeholder="Ask for recipes, macros..."
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
                 Personalized nutrition insights based on your phase.
               </p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};