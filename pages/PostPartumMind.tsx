import React, { useState, useRef, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from 'recharts';
import { Smile, Frown, Meh, Lock, Mic, ArrowRight, X, Send, Shield, Activity, Heart, AlertCircle, CheckCircle2, Sparkles, Loader2, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';
import { AppPhase } from '../types';
import { SpeakButton } from '../components/SpeakButton';
import { sendChatMessage, ChatMessage } from '../services/aiService';
import { 
  analyzeSentiment, 
  getSentimentBadge, 
  checkEmojiMismatch, 
  sentimentToScore,
  DailyCheckIn,
  getCheckIns,
  saveCheckIn,
  generateDemoCheckIns,
  detectNegativeStreak,
  MENTAL_HEALTH_RESOURCES,
  SentimentLabel
} from '../services/sentimentService';

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

  // Daily Check-in State (Sentiment Analysis)
  const [checkInText, setCheckInText] = useState('');
  const [checkInEmoji, setCheckInEmoji] = useState('😊');
  const [isAnalyzingCheckIn, setIsAnalyzingCheckIn] = useState(false);
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>(() => {
    const stored = getCheckIns();
    return stored.length > 0 ? stored : generateDemoCheckIns();
  });
  const [showCheckInSuccess, setShowCheckInSuccess] = useState(false);
  const [lastCheckInResult, setLastCheckInResult] = useState<{ sentiment: SentimentLabel; mismatch: boolean } | null>(null);

  // Check for safety alerts
  const safetyAlert = detectNegativeStreak(checkIns, 3);

  const availableEmojis = ['😢', '😞', '😐', '🙂', '😊', '😄', '🥰'];

  // Live sentiment preview state
  const [livePreviewSentiment, setLivePreviewSentiment] = useState<SentimentLabel | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Live sentiment preview with debounce
  useEffect(() => {
    if (!checkInText.trim() || checkInText.length < 10) {
      setLivePreviewSentiment(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsPreviewLoading(true);
      try {
        const result = await analyzeSentiment(checkInText);
        setLivePreviewSentiment(result.sentiment);
      } catch (error) {
        console.error('Preview error:', error);
      } finally {
        setIsPreviewLoading(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [checkInText]);

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

  // Handle daily check-in submission with sentiment analysis
  const handleCheckInSubmit = async () => {
    if (!checkInText.trim()) return;
    
    setIsAnalyzingCheckIn(true);
    
    try {
      const result = await analyzeSentiment(checkInText);
      const mismatch = checkEmojiMismatch(checkInEmoji, result.sentiment);
      const score = sentimentToScore(result.sentiment, result.confidenceScores);
      
      const newCheckIn: DailyCheckIn = {
        id: `checkin-${Date.now()}`,
        date: new Date().toISOString(),
        text: checkInText,
        emoji: checkInEmoji,
        sentiment: result.sentiment,
        confidenceScores: result.confidenceScores,
        sentimentScore: score,
        emojiMismatch: mismatch
      };
      
      saveCheckIn(newCheckIn);
      setCheckIns(prev => [...prev, newCheckIn]);
      setLastCheckInResult({ sentiment: result.sentiment, mismatch });
      setShowCheckInSuccess(true);
      setCheckInText('');
      
      // Hide success message after 5 seconds
      setTimeout(() => setShowCheckInSuccess(false), 5000);
    } catch (error) {
      console.error('Check-in error:', error);
    } finally {
      setIsAnalyzingCheckIn(false);
    }
  };

  // Emoji to mood score mapping (0-100 scale)
  const emojiToMoodScore = (emoji: string): number => {
    const emojiScores: { [key: string]: number } = {
      '😊': 90,  // Happy
      '😌': 75,  // Calm
      '😐': 50,  // Neutral
      '😔': 30,  // Sad
      '😢': 15,  // Crying
      '😰': 20,  // Anxious
      '😡': 25   // Angry
    };
    return emojiScores[emoji] || 50;
  };

  // Prepare sentiment trend data for chart
  const sentimentTrendData = checkIns.slice(-7).map((checkIn, index) => {
    const date = new Date(checkIn.date);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      score: (checkIn.sentimentScore + 1) * 50, // Convert -1 to 1 range to 0-100
      moodScore: emojiToMoodScore(checkIn.emoji),
      emoji: checkIn.emoji
    };
  });

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

              {/* Emoji Selector */}
              <div className="mb-6">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">How are you feeling?</label>
                <div className="flex justify-between max-w-lg gap-2">
                  {availableEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setCheckInEmoji(emoji)}
                      className={`text-4xl p-3 rounded-2xl transition-all duration-300 ${
                        checkInEmoji === emoji
                          ? 'bg-purple-100 scale-110 ring-4 ring-purple-200'
                          : 'bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input */}
              <div className="mb-6">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Tell us more about your day...</label>
                <textarea
                  value={checkInText}
                  onChange={(e) => setCheckInText(e.target.value)}
                  className="w-full h-32 bg-slate-50 border-0 rounded-2xl p-5 text-slate-700 resize-none focus:ring-2 focus:ring-purple-200 placeholder:text-slate-400 text-sm leading-relaxed"
                  placeholder="How are you feeling today? What's on your mind?"
                ></textarea>
                
                {/* Live Sentiment Preview */}
                {(isPreviewLoading || livePreviewSentiment) && (
                  <div className="mt-3 flex items-center gap-2">
                    {isPreviewLoading ? (
                      <>
                        <Loader2 size={14} className="animate-spin text-purple-500" />
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
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleCheckInSubmit}
                  disabled={isAnalyzingCheckIn || !checkInText.trim()}
                  className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isAnalyzingCheckIn ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      Submit Check-In
                    </>
                  )}
                </button>
              </div>

              {/* Success/Mismatch Alert */}
              {showCheckInSuccess && lastCheckInResult && (
                <div className={`mt-6 p-4 rounded-xl border ${
                  lastCheckInResult.mismatch 
                    ? 'bg-amber-50 border-amber-200' 
                    : 'bg-green-50 border-green-200'
                }`}>
                  <div className="flex items-start gap-3">
                    {lastCheckInResult.mismatch ? (
                      <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={`font-bold text-sm mb-1 ${
                        lastCheckInResult.mismatch ? 'text-amber-900' : 'text-green-900'
                      }`}>
                        {lastCheckInResult.mismatch 
                          ? 'We noticed something...' 
                          : 'Check-in recorded!'}
                      </p>
                      <p className={`text-xs ${
                        lastCheckInResult.mismatch ? 'text-amber-700' : 'text-green-700'
                      }`}>
                        {lastCheckInResult.mismatch
                          ? `Your emoji and the sentiment in your text don't quite match. Sometimes we mask our feelings. It's okay to not be okay. Would you like to talk to someone?`
                          : `Your daily sentiment has been recorded. Keep tracking how you feel each day.`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sentiment Trends Chart */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                  <TrendingUp size={20} className="text-purple-600" />
                </div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold font-display text-slate-900">Sentiment Trends</h2>
                  <SpeakButton text="Sentiment Trends: Your weekly sentiment chart based on daily check-ins." size="sm" />
                </div>
              </div>
              <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
                Last 7 Days
              </span>
            </div>
            
            <div className="h-56 w-full">
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
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    name="score"
                    dot={{ r: 5, fill: "#8b5cf6", stroke: "#ffffff", strokeWidth: 2 }}
                    activeDot={{ r: 7, fill: "#8b5cf6", stroke: "#ffffff", strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="moodScore" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="moodScore"
                    dot={{ r: 4, fill: "#3b82f6", stroke: "#ffffff", strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: "#3b82f6", stroke: "#ffffff", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-purple-500"></div>
                <span className="text-xs font-medium text-slate-600">Text Sentiment (AI analyzed)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-blue-500 border-dashed" style={{borderStyle: 'dashed'}}></div>
                <span className="text-xs font-medium text-slate-600">Selected Mood (emoji)</span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs text-slate-500">Negative (0-33%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-xs text-slate-500">Neutral (34-66%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-slate-500">Positive (67-100%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Safety Alert & EPDS Screening */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Safety Alert - Consecutive Negative Sentiment */}
          {safetyAlert.hasAlert && (
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-[2rem] p-8 shadow-sm border-2 border-red-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-200 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none opacity-50"></div>
              
              <div className="relative z-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-display text-red-900 mb-1">We're Here for You</h3>
                    <p className="text-sm text-red-700">
                      We've noticed {safetyAlert.streakCount} consecutive days of negative sentiment. 
                      You don't have to go through this alone.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 mb-4">
                  <p className="text-xs font-medium text-slate-600 mb-4">
                    <strong>This is not a medical diagnosis.</strong> If you're experiencing persistent sadness, 
                    anxiety, or thoughts of self-harm, please reach out to a mental health professional.
                  </p>
                  
                  <div className="space-y-3">
                    {MENTAL_HEALTH_RESOURCES.slice(0, 2).map((resource) => (
                      <div key={resource.name} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                        <Heart size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-red-900">{resource.name}</p>
                          <p className="text-xs text-red-600 mb-1">{resource.description}</p>
                          {resource.phone && (
                            <a href={`tel:${resource.phone}`} className="text-xs font-medium text-red-700 underline">
                              {resource.phone}
                            </a>
                          )}
                          <p className="text-xs text-red-500 mt-1">{resource.available}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="w-full bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-red-600/20 hover:bg-red-700 transition-colors">
                  View All Resources
                </button>
              </div>
            </div>
          )}
          
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
