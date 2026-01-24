import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Check, MoreHorizontal, Utensils, Zap, Droplet, Sparkles, ArrowRight, X, Send, Shield, Minus, Clock, Calendar, Loader2 } from 'lucide-react';
import { AppPhase } from '../types';
import { processFood, isAIEnabled, NutrientInfo } from '../utils/nutritionAI';
import { sendChatMessage, ChatMessage } from '../services/aiService';
import { useRiskData } from '../contexts/RiskDataContext';
import { AlertCircle } from 'lucide-react';

interface PageProps {
  phase: AppPhase;
}

// Food Entry Type
interface FoodEntry {
  id: number;
  name: string;
  timestamp: Date;
  mealType: 'breakfast' | 'lunch' | 'snacks' | 'dinner';
  nutrients: string[];
}

// Available nutrients for manual entry
const AVAILABLE_NUTRIENTS = [
  { key: 'iron', label: 'Iron', unit: 'mg' },
  { key: 'folate', label: 'Folate', unit: 'mcg' },
  { key: 'protein', label: 'Protein', unit: 'g' },
  { key: 'calcium', label: 'Calcium', unit: 'mg' },
  { key: 'vitaminB12', label: 'Vitamin B12', unit: 'mcg' },
  { key: 'fiber', label: 'Fiber', unit: 'g' },
  { key: 'calories', label: 'Calories', unit: 'kcal', optional: true }
];

// Type for nutrient values
type NutrientValues = { [key: string]: string };

// Helper function to determine meal type from hour
const getMealTypeFromHour = (hour: number): 'breakfast' | 'lunch' | 'snacks' | 'dinner' => {
  if (hour >= 5 && hour < 11) return 'breakfast';
  if (hour >= 11 && hour < 15) return 'lunch';
  if (hour >= 15 && hour < 18) return 'snacks';
  return 'dinner';
};

// Helper function to format time
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

export const Nutrition: React.FC<PageProps> = ({ phase }) => {
  const { latestAssessment } = useRiskData();
  const [activeTab, setActiveTab] = useState('today');

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "Hi Sarah! I can help you analyze your meals or suggest nutrient-rich recipes. What's on your mind?" }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add Food Modal State
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [foodName, setFoodName] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState<string>('');
  const [showManualNutrients, setShowManualNutrients] = useState(false);
  const [nutrientValues, setNutrientValues] = useState<NutrientValues>({});

  // Food Entries State
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);

  // AI Processing State
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isChatLoading) return;

    const newUserMsg = { id: Date.now(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsChatLoading(true);

    // Build conversation history for context
    const conversationHistory: ChatMessage[] = messages.map(msg => ({
      role: msg.sender === 'ai' ? 'assistant' : 'user',
      content: msg.text
    }));

    const response = await sendChatMessage(inputValue, 'nutrition', conversationHistory);

    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      sender: 'ai',
      text: response.success ? response.message! : "That sounds like a great choice! Would you like some nutrition tips or recipe ideas?"
    }]);
    setIsChatLoading(false);
  };

  // Add Food Modal Functions
  const openAddFoodModal = () => {
    setIsAddFoodOpen(true);
    setFoodName('');
    setSelectedDateTime('');
    setShowManualNutrients(false);
    setNutrientValues({});
    setAiError(null);
  };

  const setCurrentTime = () => {
    const now = new Date();
    const formatted = now.toISOString().slice(0, 16);
    setSelectedDateTime(formatted);
  };

  const updateNutrientValue = (key: string, value: string) => {
    setNutrientValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveFood = async () => {
    if (!foodName.trim()) return;

    const timestamp = selectedDateTime ? new Date(selectedDateTime) : new Date();
    const hour = timestamp.getHours();
    const mealType = getMealTypeFromHour(hour);

    let nutrients: string[] = [];

    // If manual nutrients entered, use those
    if (showManualNutrients) {
      AVAILABLE_NUTRIENTS.forEach(n => {
        const val = nutrientValues[n.key];
        if (val && val.trim()) {
          nutrients.push(`${n.label}: ${val}${n.unit}`);
        }
      });
    }
    // Otherwise, use AI analysis if available
    else if (isAIEnabled()) {
      setIsProcessingAI(true);
      setAiError(null);

      try {
        const result = await processFood(foodName);

        // Convert AI nutrients to display format
        const aiNutrients = result.nutrients;
        if (aiNutrients.iron) nutrients.push(`Iron: ${aiNutrients.iron}`);
        if (aiNutrients.folate) nutrients.push(`Folate: ${aiNutrients.folate}`);
        if (aiNutrients.protein) nutrients.push(`Protein: ${aiNutrients.protein}`);
        if (aiNutrients.calcium) nutrients.push(`Calcium: ${aiNutrients.calcium}`);
        if (aiNutrients.vitaminB12) nutrients.push(`Vitamin B12: ${aiNutrients.vitaminB12}`);
        if (aiNutrients.fiber) nutrients.push(`Fiber: ${aiNutrients.fiber}`);
        if (aiNutrients.calories) nutrients.push(`Calories: ${aiNutrients.calories}`);

      } catch (error) {
        console.error('AI processing failed:', error);
        setAiError('AI analysis failed. Entry saved without nutrition data.');
      } finally {
        setIsProcessingAI(false);
      }
    }

    const newEntry: FoodEntry = {
      id: Date.now(),
      name: foodName.trim(),
      timestamp,
      mealType,
      nutrients
    };

    setFoodEntries(prev => [...prev, newEntry]);
    setIsAddFoodOpen(false);
  };

  // Get entries for a specific meal type
  const getEntriesForMeal = (mealType: 'breakfast' | 'lunch' | 'snacks' | 'dinner') => {
    return foodEntries.filter(entry => entry.mealType === mealType);
  };

  // Get latest timestamp for a meal type
  const getLatestTimeForMeal = (mealType: 'breakfast' | 'lunch' | 'snacks' | 'dinner', defaultTime: string) => {
    const entries = getEntriesForMeal(mealType);
    if (entries.length === 0) return defaultTime;
    const latest = entries.reduce((a, b) => a.timestamp > b.timestamp ? a : b);
    return formatTime(latest.timestamp);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 dark:text-dm-foreground">Nutrition Log</h1>
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
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'today' ? 'bg-slate-900 text-white' : 'bg-white dark:bg-dm-card text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-dm-border'}`}
          >
            Today
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'weekly' ? 'bg-slate-900 text-white' : 'bg-white dark:bg-dm-card text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-dm-border'}`}
          >
            Weekly Insights
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Log */}
        <div className="lg:col-span-2 space-y-6">

          {/* Risk-Aware Nutrition Banner */}
          {latestAssessment && latestAssessment.systemActions.some(a => a.type === 'nutrition_adjust') && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-5 flex items-start gap-4 animate-in slide-in-from-top-4 duration-500">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-sm">
                <AlertCircle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2">
                  Personalized Nutrition Focus
                  <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide">Dynamic</span>
                </h3>
                <div className="space-y-1.5">
                  {latestAssessment.systemActions
                    .filter(a => a.type === 'nutrition_adjust')
                    .map((action, i) => (
                      <p key={i} className="text-sm text-slate-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></span>
                        {action.aiContent || action.description}
                      </p>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div
            onClick={openAddFoodModal}
            className="bg-white dark:bg-dm-card p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-dm-border flex items-center gap-2 cursor-pointer hover:border-primary-300 transition-colors"
          >
            <div className="p-3 text-slate-400 dark:text-slate-400 dark:text-slate-500">
              <Search size={20} />
            </div>
            <div className="flex-1 py-3 text-slate-400 text-base">
              Log breakfast, lunch, or snack...
            </div>
            <button className="bg-primary-600 text-white p-3 rounded-xl hover:bg-primary-700 transition-colors">
              <Plus size={20} />
            </button>
          </div>

          {/* Meals List */}
          <div className="bg-white dark:bg-dm-card rounded-[2rem] border border-slate-100 dark:border-dm-border overflow-hidden">
            {/* Breakfast */}
            <div className="p-6 border-b border-slate-50 hover:bg-slate-50 dark:hover:bg-dm-muted/50 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                    <Utensils size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-dm-foreground">Breakfast</h3>
                    <p className="text-xs text-slate-400 font-medium">{getLatestTimeForMeal('breakfast', '8:30 AM')}</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-primary-600">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <div className="space-y-2">
                {/* Static sample items */}
                <div className="bg-slate-50 dark:bg-dm-muted rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Check size={18} className="text-primary-500" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Oatmeal with berries & walnuts</span>
                  </div>
                  <span className="px-2 py-1 bg-white dark:bg-dm-card border border-slate-100 dark:border-dm-border rounded-md text-[10px] font-bold text-primary-600 uppercase tracking-wide">Iron Source</span>
                </div>
                <div className="bg-slate-50 dark:bg-dm-muted rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Check size={18} className="text-primary-500" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Greek yogurt with honey</span>
                  </div>
                  <span className="px-2 py-1 bg-white dark:bg-dm-card border border-slate-100 dark:border-dm-border rounded-md text-[10px] font-bold text-purple-600 uppercase tracking-wide">Calcium</span>
                </div>
                <div className="bg-slate-50 dark:bg-dm-muted rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Check size={18} className="text-primary-500" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Fresh orange juice</span>
                  </div>
                  <span className="px-2 py-1 bg-white dark:bg-dm-card border border-slate-100 dark:border-dm-border rounded-md text-[10px] font-bold text-amber-600 uppercase tracking-wide">Vitamin C</span>
                </div>
                {/* Dynamic entries */}
                {getEntriesForMeal('breakfast').map((entry) => (
                  <div key={entry.id} className="bg-primary-50 rounded-xl p-4 flex items-center justify-between border border-primary-100">
                    <div className="flex items-center gap-3">
                      <Check size={18} className="text-primary-600" />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{entry.name}</span>
                    </div>
                    <div className="flex gap-1 flex-wrap justify-end">
                      {entry.nutrients.length > 0 ? (
                        entry.nutrients.map((nutrient, idx) => (
                          <span key={idx} className="px-2 py-1 bg-white border border-primary-200 rounded-md text-[10px] font-bold text-primary-600 uppercase tracking-wide">{nutrient}</span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-400 dark:text-slate-500">{formatTime(entry.timestamp)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lunch */}
            <div className="p-6 border-b border-slate-50 hover:bg-slate-50 dark:hover:bg-dm-muted/50 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Utensils size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-dm-foreground">Lunch</h3>
                    <p className="text-xs text-slate-400 font-medium">{getLatestTimeForMeal('lunch', '12:30 PM')}</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-primary-600">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <div className="space-y-2">
                <div className="bg-slate-50 dark:bg-dm-muted rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Check size={18} className="text-primary-500" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Grilled salmon with quinoa</span>
                  </div>
                  <span className="px-2 py-1 bg-white dark:bg-dm-card border border-slate-100 dark:border-dm-border rounded-md text-[10px] font-bold text-secondary-500 uppercase tracking-wide">Omega-3</span>
                </div>
                <div className="bg-slate-50 dark:bg-dm-muted rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Check size={18} className="text-primary-500" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Spinach & avocado salad</span>
                  </div>
                  <span className="px-2 py-1 bg-white dark:bg-dm-card border border-slate-100 dark:border-dm-border rounded-md text-[10px] font-bold text-primary-600 uppercase tracking-wide">Folate</span>
                </div>
                <div className="bg-slate-50 dark:bg-dm-muted rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Check size={18} className="text-primary-500" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Lentil soup</span>
                  </div>
                  <span className="px-2 py-1 bg-white dark:bg-dm-card border border-slate-100 dark:border-dm-border rounded-md text-[10px] font-bold text-primary-600 uppercase tracking-wide">Iron Source</span>
                </div>
                {/* Dynamic entries */}
                {getEntriesForMeal('lunch').map((entry) => (
                  <div key={entry.id} className="bg-primary-50 rounded-xl p-4 flex items-center justify-between border border-primary-100">
                    <div className="flex items-center gap-3">
                      <Check size={18} className="text-primary-600" />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{entry.name}</span>
                    </div>
                    <div className="flex gap-1 flex-wrap justify-end">
                      {entry.nutrients.length > 0 ? (
                        entry.nutrients.map((nutrient, idx) => (
                          <span key={idx} className="px-2 py-1 bg-white border border-primary-200 rounded-md text-[10px] font-bold text-primary-600 uppercase tracking-wide">{nutrient}</span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-400 dark:text-slate-500">{formatTime(entry.timestamp)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Snacks */}
            <div className="p-6 border-b border-slate-50 hover:bg-slate-50 dark:hover:bg-dm-muted/50 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                    <Utensils size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-dm-foreground">Snacks</h3>
                    <p className="text-xs text-slate-400 font-medium">{getLatestTimeForMeal('snacks', '3:00 PM')}</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-primary-600">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <div className="space-y-2">
                <div className="bg-slate-50 dark:bg-dm-muted rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Check size={18} className="text-primary-500" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Mixed nuts & dried fruits</span>
                  </div>
                  <span className="px-2 py-1 bg-white dark:bg-dm-card border border-slate-100 dark:border-dm-border rounded-md text-[10px] font-bold text-primary-500 uppercase tracking-wide">Zinc</span>
                </div>
                <div className="bg-slate-50 dark:bg-dm-muted rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Check size={18} className="text-primary-500" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Apple slices with almond butter</span>
                  </div>
                  <span className="px-2 py-1 bg-white dark:bg-dm-card border border-slate-100 dark:border-dm-border rounded-md text-[10px] font-bold text-amber-600 uppercase tracking-wide">Fiber</span>
                </div>
                <div className="bg-slate-50 dark:bg-dm-muted rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Check size={18} className="text-primary-500" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Cheese cubes with crackers</span>
                  </div>
                  <span className="px-2 py-1 bg-white dark:bg-dm-card border border-slate-100 dark:border-dm-border rounded-md text-[10px] font-bold text-purple-600 uppercase tracking-wide">Calcium</span>
                </div>
                {/* Dynamic entries */}
                {getEntriesForMeal('snacks').map((entry) => (
                  <div key={entry.id} className="bg-primary-50 rounded-xl p-4 flex items-center justify-between border border-primary-100">
                    <div className="flex items-center gap-3">
                      <Check size={18} className="text-primary-600" />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{entry.name}</span>
                    </div>
                    <div className="flex gap-1 flex-wrap justify-end">
                      {entry.nutrients.length > 0 ? (
                        entry.nutrients.map((nutrient, idx) => (
                          <span key={idx} className="px-2 py-1 bg-white border border-primary-200 rounded-md text-[10px] font-bold text-primary-600 uppercase tracking-wide">{nutrient}</span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-400 dark:text-slate-500">{formatTime(entry.timestamp)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dinner */}
            <div className="p-6 hover:bg-slate-50 dark:hover:bg-dm-muted/50 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary-50 text-secondary-600 flex items-center justify-center">
                    <Utensils size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-dm-foreground">Dinner</h3>
                    <p className="text-xs text-slate-400 font-medium">{getLatestTimeForMeal('dinner', '7:30 PM')}</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-primary-600">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <div className="space-y-2">
                <div className="bg-slate-50 dark:bg-dm-muted rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Check size={18} className="text-primary-500" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Grilled chicken breast</span>
                  </div>
                  <span className="px-2 py-1 bg-white dark:bg-dm-card border border-slate-100 dark:border-dm-border rounded-md text-[10px] font-bold text-primary-600 uppercase tracking-wide">Protein</span>
                </div>
                <div className="bg-slate-50 dark:bg-dm-muted rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Check size={18} className="text-primary-500" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Sweet potato mash</span>
                  </div>
                  <span className="px-2 py-1 bg-white dark:bg-dm-card border border-slate-100 dark:border-dm-border rounded-md text-[10px] font-bold text-amber-600 uppercase tracking-wide">Vitamin A</span>
                </div>
                <div className="bg-slate-50 dark:bg-dm-muted rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Check size={18} className="text-primary-500" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Steamed broccoli & asparagus</span>
                  </div>
                  <span className="px-2 py-1 bg-white dark:bg-dm-card border border-slate-100 dark:border-dm-border rounded-md text-[10px] font-bold text-primary-600 uppercase tracking-wide">Folate</span>
                </div>
                {/* Dynamic entries */}
                {getEntriesForMeal('dinner').map((entry) => (
                  <div key={entry.id} className="bg-primary-50 rounded-xl p-4 flex items-center justify-between border border-primary-100">
                    <div className="flex items-center gap-3">
                      <Check size={18} className="text-primary-600" />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{entry.name}</span>
                    </div>
                    <div className="flex gap-1 flex-wrap justify-end">
                      {entry.nutrients.length > 0 ? (
                        entry.nutrients.map((nutrient, idx) => (
                          <span key={idx} className="px-2 py-1 bg-white border border-primary-200 rounded-md text-[10px] font-bold text-primary-600 uppercase tracking-wide">{nutrient}</span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-400 dark:text-slate-500">{formatTime(entry.timestamp)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Supplements - Moved Here */}
          <div className="bg-white dark:bg-dm-card rounded-[2rem] p-6 border border-slate-100 dark:border-dm-border">
            <h3 className="font-bold text-slate-900 dark:text-dm-foreground mb-4">Daily Supplements</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['Prenatal Vitamin', 'Folic Acid', 'Vitamin D'].map((item, i) => (
                <label key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-dm-border cursor-pointer hover:border-primary-200 transition-colors">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${i === 0 ? 'bg-primary-500 border-primary-500' : 'border-slate-300'}`}>
                    {i === 0 && <Check size={12} className="text-white" />}
                  </div>
                  <span className={`text-sm font-medium ${i === 0 ? 'text-slate-900 dark:text-dm-foreground line-through opacity-50' : 'text-slate-700'}`}>{item}</span>
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
          <div className="bg-white dark:bg-dm-card rounded-[2rem] p-6 border border-slate-100 dark:border-dm-border shadow-sm flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-900 dark:text-dm-foreground">Fluid Hit</h3>
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-secondary-300"></div>
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
                  <div className="w-full h-full bg-slate-100 dark:bg-dm-muted rounded-full relative overflow-hidden border border-slate-100 dark:border-dm-border">
                    {/* Fill */}
                    <div
                      className="absolute bottom-0 w-full bg-secondary-300 transition-all duration-500"
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
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-secondary-400 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white z-10">
                    <Droplet size={24} className="text-white" />
                  </div>
                </div>

                <div className="mt-10 text-center space-y-3">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Water</span>
                    <span className="text-xl font-display font-bold text-slate-900 dark:text-dm-foreground">1.8L</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200"
                    >
                      <Minus size={14} />
                    </button>
                    <button
                      className="w-10 h-10 rounded-full bg-secondary-400 text-white flex items-center justify-center shadow-lg shadow-secondary-400/30 hover:bg-secondary-500"
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
                  <div className="w-full h-full bg-slate-100 dark:bg-dm-muted rounded-full relative overflow-hidden border border-slate-100 dark:border-dm-border">
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
                    <span className="text-xl font-display font-bold text-slate-900 dark:text-dm-foreground">1 Sv</span>
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

            <div className="bg-primary-50 rounded-2xl p-4 text-xs leading-relaxed text-primary-800">
              <span className="font-bold text-primary-500">TIP:</span> Proper electrolyte balance prevents muscle cramps and swelling in Trimester 2. Target 3.5L total fluid.
            </div>
          </div>

          {/* Nutrition Chat Card */}
          <div
            onClick={() => setIsChatOpen(true)}
            className="bg-dark-950 rounded-[2rem] p-6 text-white relative overflow-hidden group cursor-pointer shadow-xl shadow-dark-950/10 hover:shadow-dark-950/20 transition-all min-h-[200px] flex flex-col justify-between"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 dark:bg-slate-950/30 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="bg-white/80 dark:bg-dm-card/80 backdrop-blur-xl w-full max-w-md h-[600px] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20 dark:border-dm-border/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Chat Header */}
            <div className="bg-dark-950 p-6 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-dark-900 flex items-center justify-center border border-slate-700">
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
            <div className="flex-1 bg-slate-50/50 dark:bg-dm-muted/50 backdrop-blur-sm p-6 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`
                     max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed
                     ${msg.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-tr-none shadow-md shadow-dark-950/10'
                      : 'bg-white/90 dark:bg-dm-card/90 backdrop-blur-sm text-slate-700 dark:text-dm-foreground border border-slate-200/50 dark:border-dm-border/50 rounded-tl-none shadow-sm'}
                   `}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/80 dark:bg-dm-card/80 backdrop-blur-md border-t border-slate-200/50 dark:border-dm-border/50 shrink-0">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask for recipes, macros..."
                  className="flex-1 bg-slate-50 dark:bg-dm-muted border border-slate-100 dark:border-dm-border text-slate-900 dark:text-dm-foreground placeholder:text-slate-400 dark:text-slate-500 rounded-xl py-3.5 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                  autoFocus
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="absolute right-2 p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-50 dark:hover:bg-dm-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
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

      {/* Add Food Popup Modal */}
      {isAddFoodOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50 dark:bg-dm-background/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Utensils size={20} />
                </div>
                <div>
                  <h3 className="font-bold font-display text-lg">Add Food</h3>
                  <p className="text-primary-100 text-xs">Log your meal or snack</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddFoodOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Risk-Aware Nutrition Banner - Only shows if there are nutrition actions */}
            {latestAssessment && latestAssessment.systemActions.some(a => a.type === 'nutrition_adjust') && (
              <div className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1">Personalized Nutrition Focus</h3>
                  <div className="space-y-1">
                    {latestAssessment.systemActions
                      .filter(a => a.type === 'nutrition_adjust')
                      .map((action, i) => (
                        <p key={i} className="text-sm text-slate-600 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                          {action.aiContent || action.description}
                        </p>
                      ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-medium">Adapted based on your latest check-in</p>
                </div>
              </div>
            )}

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Food Name Input */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Food Name
                </label>
                <input
                  type="text"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g., palak dal, one bowl"
                  className="w-full bg-slate-50 dark:bg-dm-muted border border-slate-100 dark:border-dm-border text-slate-900 dark:text-dm-foreground placeholder:text-slate-400 dark:text-slate-500 rounded-xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all"
                  autoFocus
                />
              </div>

              {/* Timestamp Section */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Date & Time
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={setCurrentTime}
                    className="flex items-center gap-2 px-4 py-3 bg-primary-50 text-primary-700 rounded-xl font-medium text-sm hover:bg-primary-100 transition-colors border border-primary-100"
                  >
                    <Clock size={16} />
                    Current Time
                  </button>
                  <input
                    type="datetime-local"
                    value={selectedDateTime}
                    onChange={(e) => setSelectedDateTime(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-dm-muted border border-slate-100 dark:border-dm-border text-slate-900 dark:text-dm-foreground rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all text-sm"
                  />
                </div>
                {selectedDateTime && (
                  <p className="text-xs text-slate-500 mt-2">
                    Meal type: <span className="font-bold text-primary-600 capitalize">
                      {getMealTypeFromHour(new Date(selectedDateTime).getHours())}
                    </span>
                  </p>
                )}
              </div>

              {/* Manual Nutrients Toggle */}
              <div>
                <button
                  onClick={() => setShowManualNutrients(!showManualNutrients)}
                  className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-primary-600 transition-colors"
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${showManualNutrients ? 'bg-primary-500 border-primary-500' : 'border-slate-300'}`}>
                    {showManualNutrients && <Check size={12} className="text-white" />}
                  </div>
                  Enter nutrients manually
                </button>

                {/* Nutrient Input Fields */}
                {showManualNutrients && (
                  <div className="mt-4 p-4 bg-slate-50 dark:bg-dm-muted rounded-xl border border-slate-100 dark:border-dm-border max-h-60 overflow-y-auto">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                      Enter Nutrient Values
                    </p>
                    <div className="space-y-3">
                      {AVAILABLE_NUTRIENTS.map((nutrient) => (
                        <div key={nutrient.key} className="flex items-center gap-3">
                          <label className="text-sm font-medium text-slate-700 w-28 flex-shrink-0">
                            {nutrient.label}
                            {nutrient.optional && <span className="text-xs text-slate-400 ml-1">(opt)</span>}
                          </label>
                          <div className="flex-1 flex items-center gap-2">
                            <input
                              type="text"
                              value={nutrientValues[nutrient.key] || ''}
                              onChange={(e) => updateNutrientValue(nutrient.key, e.target.value)}
                              placeholder="0"
                              className="flex-1 bg-white border border-slate-100 dark:border-dm-border text-slate-900 dark:text-dm-foreground placeholder:text-slate-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-all"
                            />
                            <span className="text-xs text-slate-400 w-10">{nutrient.unit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={() => setIsAddFoodOpen(false)}
                className="flex-1 py-3.5 px-4 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFood}
                disabled={!foodName.trim() || isProcessingAI}
                className="flex-1 py-3.5 px-4 rounded-xl font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessingAI ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Save Food'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};




