import React, { useState, useRef, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, LineChart, Line, CartesianGrid, YAxis } from 'recharts';
import { Smile, Frown, Meh, Lock, Mic, ArrowRight, X, Send, Shield, Heart, Loader2, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { SpeakButton } from '../components/SpeakButton';
import { sendChatMessage, ChatMessage } from '../services/aiService';
import {
  analyzeSentiment,
  getSentimentBadge,
  checkEmojiMismatch,
  sentimentToScore,
  DailyCheckIn,
  SentimentLabel
} from '../services/sentimentService';

// Storage key for this phase
const STORAGE_KEY = 'preconception_mind_checkins';

// Mood options
type MoodType = 'rough' | 'okay' | 'good';
const moodToEmoji: Record<MoodType, string> = {
  'rough': '😔',
  'okay': '😐',
  'good': '😊'
};

const moodToScore: Record<MoodType, number> = {
  'rough': 20,
  'okay': 50,
  'good': 90
};

// Get check-ins from localStorage
const getCheckIns = (): DailyCheckIn[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Save check-in to localStorage
const saveCheckIn = (checkIn: DailyCheckIn) => {
  const checkIns = getCheckIns();
  checkIns.push(checkIn);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(checkIns));
};

export const PreConceptionMind: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "I'm here to listen. This space is private and judgment-free. What's on your mind?" }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Daily Check-in State
  const [selectedMood, setSelectedMood] = useState<MoodType>('good');
  const [selectedFactors, setSelectedFactors] = useState<string[]>(['My Body']);
  const [journalText, setJournalText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastResult, setLastResult] = useState<{ sentiment: SentimentLabel; mismatch: boolean } | null>(null);
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>(getCheckIns());
  
  // Live sentiment preview
  const [livePreviewSentiment, setLivePreviewSentiment] = useState<SentimentLabel | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Live sentiment preview with debounce
  useEffect(() => {
    if (!journalText.trim() || journalText.length < 10) {
      setLivePreviewSentiment(null);
      return;
    }
    const timeoutId = setTimeout(async () => {
      setIsPreviewLoading(true);
      const result = await analyzeSentiment(journalText);
      setLivePreviewSentiment(result.sentiment);
      setIsPreviewLoading(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [journalText]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatOpen]);

  // Handle check-in submit
  const handleCheckInSubmit = async () => {
    if (!journalText.trim()) return;
    
    setIsAnalyzing(true);
    const result = await analyzeSentiment(journalText);
    const emoji = moodToEmoji[selectedMood];
    const mismatch = checkEmojiMismatch(emoji, result.sentiment);
    
    const newCheckIn: DailyCheckIn = {
      date: new Date().toISOString(),
      emoji,
      text: journalText,
      sentiment: result.sentiment,
      sentimentScore: sentimentToScore(result.sentiment),
      factors: selectedFactors
    };
    
    saveCheckIn(newCheckIn);
    setCheckIns(getCheckIns());
    setLastResult({ sentiment: result.sentiment, mismatch });
    setShowSuccess(true);
    setIsAnalyzing(false);
    setJournalText('');
    setLivePreviewSentiment(null);
    
    setTimeout(() => setShowSuccess(false), 5000);
  };

  // Toggle factor selection
  const toggleFactor = (factor: string) => {
    setSelectedFactors(prev => 
      prev.includes(factor) 
        ? prev.filter(f => f !== factor)
        : [...prev, factor]
    );
  };

  // Prepare trend data for chart
  const sentimentTrendData = checkIns.slice(-7).map((checkIn) => {
    const date = new Date(checkIn.date);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      score: (checkIn.sentimentScore + 1) * 50,
      moodScore: moodToScore[Object.keys(moodToEmoji).find(k => moodToEmoji[k as MoodType] === checkIn.emoji) as MoodType] || 50
    };
  });

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

    const response = await sendChatMessage(inputValue, 'preconception', conversationHistory);
    
    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      sender: 'ai',
      text: response.success ? response.message! : "I hear you. It's completely normal to feel that way during this phase. Would you like to explore that feeling a bit more?"
    }]);
    setIsLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">

      {/* Motivational Quote - Centered */}
      <div className="flex flex-col items-center justify-center text-center py-16 bg-slate-50/50 rounded-[2rem] my-4 relative">
        <Heart size={40} className="text-emerald-400 mb-6" />
        <p className="font-serif italic text-3xl md:text-4xl lg:text-5xl text-slate-800 leading-relaxed max-w-4xl px-8" style={{ fontFamily: "'DM Serif Display', serif" }}>
          Your mental wellness today shapes the foundation for tomorrow. Be gentle with yourself.
        </p>
        <div className="absolute top-4 right-4">
          <SpeakButton text="Your mental wellness today shapes the foundation for tomorrow. Be gentle with yourself." size={22} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h1 className="text-3xl font-display font-extrabold text-slate-900">Fertility & Wellness</h1>
            <p className="text-slate-500 mt-1">Preparing your mind and body for conception.</p>
          </div>
          <SpeakButton text="Fertility and Wellness. Preparing your mind and body for conception." size={20} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Main Check-in Area */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none opacity-60"></div>

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
                  { key: 'rough' as MoodType, icon: Frown, label: 'Rough', color: 'bg-red-100 text-red-500' },
                  { key: 'okay' as MoodType, icon: Meh, label: 'Okay', color: 'bg-slate-100 text-slate-500' },
                  { key: 'good' as MoodType, icon: Smile, label: 'Good', color: 'bg-emerald-100 text-emerald-600' },
                ].map((item) => (
                  <div 
                    key={item.key}
                    onClick={() => setSelectedMood(item.key)}
                    className="flex flex-col items-center gap-2 cursor-pointer group"
                  >
                    <div className={`
                       w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
                       ${selectedMood === item.key ? `${item.color} scale-110 shadow-lg ring-4 ring-white` : 'bg-slate-50 text-slate-300 hover:bg-slate-100'}
                     `}>
                      <item.icon size={32} />
                    </div>
                    <span className={`text-xs font-bold ${selectedMood === item.key ? 'text-slate-900' : 'text-slate-400'}`}>
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
                    <button 
                      key={i} 
                      onClick={() => toggleFactor(tag)}
                      className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                        selectedFactors.includes(tag) 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-medium' 
                          : 'border-slate-200 text-slate-600 hover:border-emerald-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Journal Input */}
              <div className="relative mb-2">
                <textarea
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  className="w-full h-32 bg-slate-50 border-0 rounded-2xl p-5 text-slate-700 resize-none focus:ring-2 focus:ring-emerald-200 placeholder:text-slate-400 text-sm leading-relaxed"
                  placeholder="Write as much or as little as you need..."
                ></textarea>
                <button className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-sm text-slate-400 hover:text-emerald-600">
                  <Mic size={20} />
                </button>
              </div>

              {/* Live Sentiment Preview */}
              {(isPreviewLoading || livePreviewSentiment) && journalText.length >= 10 && (
                <div className="mb-4 flex items-center gap-2">
                  {isPreviewLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin text-emerald-500" />
                      <span className="text-xs text-slate-500">Analyzing sentiment...</span>
                    </>
                  ) : livePreviewSentiment && (
                    <>
                      <span className="text-xs text-slate-500">Detected sentiment:</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSentimentBadge(livePreviewSentiment).className}`}>
                        {getSentimentBadge(livePreviewSentiment).icon} {getSentimentBadge(livePreviewSentiment).label}
                      </span>
                    </>
                  )}
                </div>
              )}

              <div className="flex justify-end">
                <button 
                  onClick={handleCheckInSubmit}
                  disabled={isAnalyzing || !journalText.trim()}
                  className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      Save Entry
                    </>
                  )}
                </button>
              </div>

              {/* Success/Mismatch Alert */}
              {showSuccess && lastResult && (
                <div className={`mt-6 p-4 rounded-xl border ${
                  lastResult.mismatch 
                    ? 'bg-amber-50 border-amber-200' 
                    : 'bg-green-50 border-green-200'
                }`}>
                  <div className="flex items-start gap-3">
                    {lastResult.mismatch ? (
                      <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={`font-bold text-sm mb-1 ${lastResult.mismatch ? 'text-amber-900' : 'text-green-900'}`}>
                        {lastResult.mismatch ? 'We noticed something...' : 'Check-in recorded!'}
                      </p>
                      <p className={`text-xs ${lastResult.mismatch ? 'text-amber-700' : 'text-green-700'}`}>
                        {lastResult.mismatch
                          ? `Your selected mood and the sentiment in your text don't quite match. It's okay to not be okay.`
                          : `Your daily sentiment has been recorded. Keep tracking how you feel each day.`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Stats & AI */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          {/* Sentiment Trends Chart */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                  <TrendingUp size={20} className="text-emerald-600" />
                </div>
                <h2 className="text-lg font-bold font-display text-slate-900">Sentiment Trends</h2>
                <SpeakButton text="Sentiment Trends: Your weekly sentiment and mood chart." size="sm" />
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                Last 7 Days
              </span>
            </div>

            <div className="h-48 w-full">
              {sentimentTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sentimentTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <YAxis 
                      domain={[0, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                      formatter={(value: number, name: string) => [
                        `${value.toFixed(0)}%`, 
                        name === 'score' ? 'Text Sentiment' : 'Selected Mood'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      name="score"
                      dot={{ r: 5, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="moodScore" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="moodScore"
                      dot={{ r: 4, fill: "#3b82f6", stroke: "#ffffff", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                  <p>Complete check-ins to see your sentiment trends</p>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-emerald-500"></div>
                <span className="text-xs text-slate-600">Text Sentiment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-blue-500" style={{borderStyle: 'dashed'}}></div>
                <span className="text-xs text-slate-600">Selected Mood</span>
              </div>
            </div>
          </div>

          {/* Silent Chat AI Promo */}
          <div
            onClick={() => setIsChatOpen(true)}
            className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group cursor-pointer shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-[60px] opacity-20"></div>

            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4 backdrop-blur-sm">
                <Lock size={20} className="text-emerald-300" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-display mb-2">Silent Chat</h3>
                <SpeakButton text="Silent Chat: Feeling overwhelmed? Vent anonymously to our AI companion. No judgement, just a safe space." size="sm" />
              </div>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Feeling overwhelmed? Vent anonymously to our AI companion. No judgement, just a safe space.
              </p>

              <div className="flex items-center gap-2 text-sm font-bold text-emerald-300 group-hover:text-emerald-200 transition-colors">
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
                  <Lock size={18} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold font-display">Silent Chat</h3>
                  <div className="flex items-center gap-1.5 opacity-80">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
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
