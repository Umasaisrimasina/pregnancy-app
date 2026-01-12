import React, { useState, useRef, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Smile, Frown, Meh, Lock, Mic, ArrowRight, X, Send, Shield, Activity, Heart, AlertCircle, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { AppPhase } from '../types';
import { SpeakButton } from '../components/SpeakButton';
import { sendChatMessage, ChatMessage } from '../services/aiService';

interface PageProps {
  phase: AppPhase;
}

const moodTrendData = [
  { day: 'Mon', value: 4 },
  { day: 'Tue', value: 6 },
  { day: 'Wed', value: 5 },
  { day: 'Thu', value: 7 },
  { day: 'Fri', value: 6 },
  { day: 'Sat', value: 8 },
  { day: 'Sun', value: 7 },
];

const screeningHistoryData = [
  { month: 'Sep', score: 8 },
  { month: 'Oct', score: 12 },
  { month: 'Nov', score: 6 },
  { month: 'Dec', score: 9 },
  { month: 'Jan', score: 5 },
];

const epdsQuestions = [
  {
    id: 1,
    question: "I have been able to laugh and see the funny side of things",
    options: ["As much as I always could", "Not quite so much now", "Definitely not so much now", "Not at all"]
  },
  {
    id: 2,
    question: "I have looked forward with enjoyment to things",
    options: ["As much as I ever did", "Rather less than I used to", "Definitely less than I used to", "Hardly at all"]
  },
  {
    id: 3,
    question: "I have blamed myself unnecessarily when things went wrong",
    options: ["No, never", "Not very often", "Yes, some of the time", "Yes, most of the time"]
  },
  {
    id: 4,
    question: "I have been anxious or worried for no good reason",
    options: ["No, not at all", "Hardly ever", "Yes, sometimes", "Yes, very often"]
  },
  {
    id: 5,
    question: "I have felt scared or panicky for no very good reason",
    options: ["No, not at all", "No, not much", "Yes, sometimes", "Yes, quite a lot"]
  },
  {
    id: 6,
    question: "Things have been getting on top of me",
    options: ["No, I've been coping as well as ever", "No, most of the time I cope well", "Yes, sometimes I haven't been coping", "Yes, most of the time I can't cope"]
  },
  {
    id: 7,
    question: "I have been so unhappy that I have had difficulty sleeping",
    options: ["No, not at all", "Not very often", "Yes, sometimes", "Yes, most of the time"]
  },
  {
    id: 8,
    question: "I have felt sad or miserable",
    options: ["No, not at all", "Not very often", "Yes, quite often", "Yes, most of the time"]
  },
  {
    id: 9,
    question: "I have been so unhappy that I have been crying",
    options: ["No, never", "Only occasionally", "Yes, quite often", "Yes, most of the time"]
  },
  {
    id: 10,
    question: "The thought of harming myself has occurred to me",
    options: ["Never", "Hardly ever", "Sometimes", "Yes, quite often"]
  }
];

export const PostPartumMind: React.FC<PageProps> = ({ phase }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('good');
  const [selectedFactors, setSelectedFactors] = useState<string[]>(['My Body']);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "Welcome to your safe space. How are you feeling today, mama?" }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // EPDS State
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [screeningComplete, setScreeningComplete] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const newUserMsg = { id: Date.now(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsLoading(true);

    // Build conversation history for context
    const conversationHistory: ChatMessage[] = messages.map(msg => ({
      role: msg.sender === 'ai' ? 'assistant' : 'user',
      content: msg.text
    }));

    const response = await sendChatMessage(inputValue, 'postpartum', conversationHistory);
    
    setMessages(prev => [...prev, { 
      id: Date.now() + 1, 
      sender: 'ai', 
      text: response.success ? response.message! : "Thank you for sharing. It takes courage to express these feelings. Remember, your emotions are valid, and recovery takes time. Would you like to explore some coping strategies together?"
    }]);
    setIsLoading(false);
  };

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);
    
    if (currentQuestion < epdsQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      setScreeningComplete(true);
    }
  };

  const totalScore = answers.reduce((sum, answer) => sum + answer, 0);
  const isHighRisk = totalScore >= 10;

  const resetScreening = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  const toggleFactor = (factor: string) => {
    setSelectedFactors(prev => 
      prev.includes(factor) 
        ? prev.filter(f => f !== factor)
        : [...prev, factor]
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Motivational Quote - Centered */}
      <div className="flex flex-col items-center justify-center text-center py-16 bg-slate-50/50 rounded-[2rem] my-4">
        <div className="flex items-center gap-3 mb-6">
          <Heart size={40} className="text-purple-400" />
          <SpeakButton text="Healing takes time, and that's okay. You're doing an incredible job." size="sm" />
        </div>
        <p className="font-serif italic text-3xl md:text-4xl lg:text-5xl text-slate-800 leading-relaxed max-w-4xl px-8" style={{ fontFamily: "'DM Serif Display', serif" }}>
          Healing takes time, and that's okay. You're doing an incredible job.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-display font-extrabold text-slate-900">Stress & Mind</h1>
            <SpeakButton text="Stress and Mind: Your postpartum mental wellness companion." size="sm" />
          </div>
          <p className="text-slate-500 mt-1">Your postpartum mental wellness companion.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - Daily Check-In & Mood Trends */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Daily Check-In Card */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none opacity-60"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold font-display text-slate-900">Daily Check-In</h2>
                  <SpeakButton text="Daily Check-In: How are you feeling today?" size="sm" />
                </div>
                <span className="text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full">Today</span>
              </div>

              {/* Mood Selector */}
              <div className="flex justify-between max-w-md mx-auto mb-10">
                {[
                  { id: 'rough', icon: Frown, label: 'Rough', color: 'bg-red-100 text-red-500', activeRing: 'ring-red-200' },
                  { id: 'okay', icon: Meh, label: 'Okay', color: 'bg-slate-100 text-slate-500', activeRing: 'ring-slate-200' },
                  { id: 'good', icon: Smile, label: 'Good', color: 'bg-purple-100 text-purple-600', activeRing: 'ring-purple-200' },
                ].map((item) => (
                   <div 
                     key={item.id} 
                     className="flex flex-col items-center gap-2 cursor-pointer group"
                     onClick={() => setSelectedMood(item.id)}
                   >
                     <div className={`
                       w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
                       ${selectedMood === item.id 
                         ? `${item.color} scale-110 shadow-lg ring-4 ${item.activeRing}` 
                         : 'bg-slate-50 text-slate-300 hover:bg-slate-100'}
                     `}>
                       <item.icon size={32} />
                     </div>
                     <span className={`text-xs font-bold ${selectedMood === item.id ? 'text-slate-900' : 'text-slate-400'}`}>
                       {item.label}
                     </span>
                   </div>
                ))}
              </div>

              {/* Affecting Factors */}
              <div className="mb-8">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">What's affecting you?</label>
                <div className="flex flex-wrap gap-2">
                  {['Sleep', 'Work', 'Family', 'My Body', 'Diet'].map((tag) => (
                    <button 
                      key={tag} 
                      onClick={() => toggleFactor(tag)}
                      className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                        selectedFactors.includes(tag) 
                          ? 'bg-purple-50 border-purple-200 text-purple-700 font-medium' 
                          : 'border-slate-200 text-slate-600 hover:border-purple-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Journal Input */}
              <div className="relative">
                <textarea 
                  className="w-full h-32 bg-slate-50 border-0 rounded-2xl p-5 text-slate-700 resize-none focus:ring-2 focus:ring-purple-200 placeholder:text-slate-400 text-sm leading-relaxed"
                  placeholder="Write as much or as little as you need..."
                ></textarea>
                <button className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-sm text-slate-400 hover:text-purple-600">
                  <Mic size={20} />
                </button>
              </div>

              <div className="mt-6 flex justify-end">
                <button className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-colors">
                  Save Entry
                </button>
              </div>
            </div>
          </div>

          {/* Mood Trends Chart */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                  <Activity size={20} className="text-purple-600" />
                </div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold font-display text-slate-900">Mood Trends</h2>
                  <SpeakButton text="Mood Trends: Your weekly mood chart for this week." size="sm" />
                </div>
              </div>
              <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
                This Week
              </span>
            </div>
            
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={moodTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMoodPurple" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  />
                  <YAxis hide domain={[0, 10]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    fill="url(#colorMoodPurple)" 
                    dot={{ r: 4, fill: "#ffffff", stroke: "#8b5cf6", strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: "#8b5cf6", stroke: "#ffffff", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500 opacity-50"></div>
                <span className="text-xs font-medium text-slate-500">Needs Attention (0-4)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500 opacity-30"></div>
                <span className="text-xs font-medium text-slate-500">Okay (4-6)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500 opacity-10"></div>
                <span className="text-xs font-medium text-slate-500">Good (6-10)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - EPDS Screening & History */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* EPDS Clinical Wellness Screening */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-[2rem] p-8 shadow-sm border border-purple-100 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                <Sparkles size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold font-display text-slate-900">EPDS Wellness Screening</h2>
                  <SpeakButton text="EPDS Wellness Screening: Edinburgh Postnatal Depression Scale questionnaire." size="sm" />
                </div>
                <p className="text-xs text-slate-500">Edinburgh Postnatal Depression Scale</p>
              </div>
            </div>

            {!showResults ? (
              <>
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
                    <span>Question {currentQuestion + 1} of {epdsQuestions.length}</span>
                    <span>{Math.round(((currentQuestion) / epdsQuestions.length) * 100)}% Complete</span>
                  </div>
                  <div className="h-2 bg-white rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
                      style={{ width: `${(currentQuestion / epdsQuestions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Current Question */}
                <div className="bg-white rounded-2xl p-6 mb-4">
                  <p className="text-sm font-medium text-slate-700 mb-4 leading-relaxed">
                    {epdsQuestions[currentQuestion].question}
                  </p>
                  <div className="space-y-2">
                    {epdsQuestions[currentQuestion].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswerSelect(idx)}
                        className="w-full text-left p-3 rounded-xl border border-slate-100 text-sm text-slate-600 hover:border-purple-300 hover:bg-purple-50 transition-all"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Results */
              <div className="bg-white rounded-2xl p-6">
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                    isHighRisk ? 'bg-red-100' : 'bg-purple-100'
                  }`}>
                    {isHighRisk ? (
                      <AlertCircle size={32} className="text-red-500" />
                    ) : (
                      <Heart size={32} className="text-purple-500" />
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">
                    Your Score: {totalScore}/30
                  </h3>
                  <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${
                    isHighRisk 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {isHighRisk ? 'Elevated Risk' : 'Low Risk'}
                  </span>
                </div>

                {isHighRisk ? (
                  <div className="bg-red-50 rounded-xl p-4 mb-4">
                    <p className="text-sm text-red-800 font-medium mb-3">
                      Your responses suggest you may benefit from additional support. Please consider reaching out to a healthcare provider.
                    </p>
                    <div className="space-y-2 text-xs">
                      <p className="font-bold text-red-700">Crisis Resources:</p>
                      <p className="text-red-600">• iCall: 9152987821</p>
                      <p className="text-red-600">• Vandrevala Foundation: 1860-2662-345</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-purple-50 rounded-xl p-4 mb-4">
                    <p className="text-sm text-purple-800">
                      Your score suggests you're coping well. Continue monitoring your mood and reach out if things change.
                    </p>
                  </div>
                )}

                <button 
                  onClick={resetScreening}
                  className="w-full text-center text-purple-600 font-bold text-sm hover:text-purple-700"
                >
                  Retake Screening
                </button>
              </div>
            )}
          </div>

          {/* Screening History */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold font-display text-slate-900">Screening History</h2>
            </div>
            
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={screeningHistoryData}>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 11 }} 
                  />
                  <YAxis hide domain={[0, 20]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar 
                    dataKey="score" 
                    fill="#8b5cf6" 
                    radius={[4, 4, 4, 4]} 
                    barSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-purple-200"></div>
                <span className="text-xs font-medium text-slate-500">Low (0-9)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-200"></div>
                <span className="text-xs font-medium text-slate-500">High (10+)</span>
              </div>
            </div>
          </div>

          {/* Silent Chat AI Promo */}
          <div 
            onClick={() => setIsChatOpen(true)}
            className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group cursor-pointer shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-[60px] opacity-20"></div>
            
            <div className="relative z-10">
               <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4 backdrop-blur-sm">
                 <Lock size={20} className="text-purple-300" />
               </div>
               <h3 className="text-lg font-bold font-display mb-2">Silent Chat</h3>
               <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                 Need to vent in a safe, anonymous space? Our AI companion is here to listen without judgment.
               </p>
               
               <div className="flex items-center gap-2 text-sm font-bold text-purple-300 group-hover:text-purple-200 transition-colors">
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
                     <Lock size={18} className="text-purple-400" />
                   </div>
                   <div>
                     <h3 className="font-bold font-display">Silent Chat</h3>
                     <div className="flex items-center gap-1.5 opacity-80">
                       <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
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
                   className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl py-3.5 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                   autoFocus
                 />
                 <button 
                   onClick={handleSend}
                   disabled={!inputValue.trim()}
                   className="absolute right-2 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
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
