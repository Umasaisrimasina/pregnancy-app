import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, Dot, BarChart, Bar } from 'recharts';
import { Activity, ArrowRight, CheckCircle2, AlertCircle, Calendar, Scale, Moon, Milk, Plus, Clock, Sparkles, Send, Heart, Shield, Lock, Stethoscope, ClipboardList, Watch, Smartphone, Cloud, Link2, MoreHorizontal, Info, Check, Wind, Brain, Volume2, Droplets, Minus, MapPin, Smile, Meh, Frown, Baby, Utensils, FlaskConical, Tv, ShieldCheck, Zap, Flame, Users, HeartHandshake, CheckSquare, ChefHat, ShoppingCart, MessageCircle, Play, Lightbulb, Camera, Mic, Gift, Search, Bell, FileText, AlertTriangle, TrendingUp, User, ChevronRight, RefreshCw, SmartphoneNfc } from 'lucide-react';
import { AppPhase, UserRole } from '../types';
import { CycleCalendar } from '../components/CycleCalendar';
import { PreConceptionGuide } from '../components/PreConceptionGuide';
import { PregnancyCalendar } from '../components/PregnancyCalendar';
import { SpeakButton } from '../components/SpeakButton';

interface DashboardProps {
  phase: AppPhase;
  role: UserRole;
}

// --- SHARED DATA ---

const fetalTimeline = [
  {
    month: 'Month 1',
    title: 'Early Development',
    desc: 'The neural tube forms. The embryo is poppy-seed sized.',
    feelings: 'Nausea, fatigue, and tender breasts.',
    nurture: 'Take prenatal vitamins with folic acid daily.',
    img: '/images/fetal-growth/1.jpg',
    size: 'Poppy Seed'
  },
  {
    month: 'Month 2',
    title: 'The Heart Beat',
    desc: 'Heart begins to beat. Fingers and toes form.',
    feelings: 'Frequent urination and food aversions.',
    nurture: 'Eat small meals to manage morning sickness.',
    img: '/images/fetal-growth/2.jpg',
    size: 'Raspberry'
  },
  {
    month: 'Month 3',
    title: 'Becoming a Fetus',
    desc: 'Arms and legs lengthen. Baby starts moving.',
    feelings: 'Energy levels may start to return.',
    nurture: 'Stay hydrated and eat iron-rich foods.',
    img: '/images/fetal-growth/3.jpg',
    size: 'Lemon'
  },
  {
    month: 'Month 4',
    title: 'Distinct Features',
    desc: 'Eyebrows, eyelashes, and eyelids form.',
    feelings: 'Bump becomes visible. Appetite increases.',
    nurture: 'Moisturize skin to help with stretching.',
    img: '/images/fetal-growth/4.jpg',
    size: 'Avocado'
  },
  {
    month: 'Month 5',
    title: 'Movement Felt',
    desc: 'You may feel flutters (quickening). Vernix coats skin.',
    feelings: 'Backaches or hip pain may occur.',
    nurture: 'Consider a pregnancy pillow for sleep support.',
    img: '/images/fetal-growth/5.jpg',
    size: 'Banana'
  },
  {
    month: 'Month 6',
    title: 'Senses Awakening',
    desc: 'Responds to sounds. Fingerprints formed.',
    feelings: 'Possible heartburn or indigestion.',
    nurture: 'Practice pelvic floor exercises (Kegels).',
    img: '/images/fetal-growth/6.jpg',
    size: 'Ear of Corn'
  },
  {
    month: 'Month 7',
    title: 'Opening Eyes',
    desc: 'Eyelids open. Fat stores begin to accumulate.',
    feelings: 'Shortness of breath as uterus grows.',
    nurture: 'Monitor kick counts daily.',
    img: '/images/fetal-growth/7.jpg',
    size: 'Eggplant'
  },
  {
    month: 'Month 8',
    title: 'Rapid Growth',
    desc: 'Brain development accelerates. Lungs maturing.',
    feelings: 'Frequent Braxton Hicks contractions.',
    nurture: 'Pack your hospital bag and finalize birth plan.',
    img: '/images/fetal-growth/8.jpg',
    size: 'Pineapple'
  },
  {
    month: 'Month 9',
    title: 'Ready for Birth',
    desc: 'Baby positions head-down. Organs fully developed.',
    feelings: 'Pelvic pressure and nesting instinct.',
    nurture: 'Rest often and prepare for labor.',
    img: '/images/fetal-growth/9.jpg',
    size: 'Watermelon'
  }
];

const initialVitals = {
  sugar: 105,
  hr: 73,
  spo2: 98,
  stress: 35,
  sleep: 7.5,
  snoring: 15,
  weight: 64.2
};

const stressGraphData = [
  { day: 'Mon', value: 35 },
  { day: 'Tue', value: 56 },
  { day: 'Wed', value: 40 },
  { day: 'Thu', value: 32 },
  { day: 'Fri', value: 38 },
  { day: 'Sat', value: 45 },
  { day: 'Sun', value: 30 },
];

const sleepData = [
  { day: 'M', hours: 5.5 },
  { day: 'Tu', hours: 6.8 },
  { day: 'W', hours: 7.2 },
  { day: 'Th', hours: 6.0 },
  { day: 'F', hours: 8.5 },
  { day: 'Sa', hours: 9.0 },
  { day: 'Su', hours: 7.5 },
];

// Medical Chart Data
const bloodSugarTrend = [
    { day: 'Mon', value: 99 },
    { day: 'Tue', value: 126 }, // High
    { day: 'Wed', value: 108 },
    { day: 'Thu', value: 105 },
    { day: 'Fri', value: 118 },
    { day: 'Sat', value: 110 },
    { day: 'Sun', value: 104 },
];

export const Dashboard: React.FC<DashboardProps> = ({ phase, role }) => {
  const [watchConnected, setWatchConnected] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [vitals, setVitals] = useState(initialVitals);
  const [fluidLevels, setFluidLevels] = useState({ water: 1.8, electrolyte: 1.0 });
  const [recoveryChecklist, setRecoveryChecklist] = useState([
    { label: 'Pelvic Floor Exercises', done: true },
    { label: 'Hydration (8 glasses)', done: false },
    { label: 'Postnatal Vitamin', done: false },
    { label: '15 min Walk', done: true },
  ]);

  // Simulate Real-time Data
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (watchConnected) {
      interval = setInterval(() => {
        setVitals(prev => ({
          ...prev,
          hr: 70 + Math.floor(Math.random() * 8),
          spo2: 97 + Math.floor(Math.random() * 3),
          stress: Math.max(10, Math.min(100, prev.stress + (Math.random() > 0.5 ? 2 : -2)))
        }));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [watchConnected]);

  const handleWatchAuth = () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      setWatchConnected(true);
      setIsAuthorizing(false);
    }, 1500);
  };
  
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (payload.day === 'Thu' && watchConnected) {
      return (
        <circle cx={cx} cy={cy} r={6} fill="#8b5cf6" stroke="white" strokeWidth={2}>
           <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" />
        </circle>
      );
    }
    if (payload.day === 'Thu') {
        return <circle cx={cx} cy={cy} r={5} fill="#8b5cf6" stroke="white" strokeWidth={2} />;
    }
    return <circle cx={cx} cy={cy} r={3} fill="#a78bfa" />;
  };

  // ----------------------------------------------------------------------
  // VIEW: PARTNER DASHBOARD
  // ----------------------------------------------------------------------
  if (role === 'partner') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
         <div className="mb-2 flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">MODE: PARTNER PERSPECTIVE</span>
              <h1 className="text-4xl font-display font-extrabold text-slate-900 mt-1">Your Pregnancy Journey</h1>
            </div>
            <SpeakButton text="Partner Perspective. Your Pregnancy Journey. Support your partner through this beautiful journey." />
         </div>

         <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* Left Column (Checklist & Goal) */}
            <div className="xl:col-span-8 space-y-6">
               {/* Checklist Card */}
               <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                           <CheckSquare size={24} />
                        </div>
                        <h2 className="text-xl font-bold font-display text-slate-900">Your Support Checklist</h2>
                     </div>
                     <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">4 Tasks Pending</span>
                  </div>

                  <div className="space-y-4">
                     {[
                        { title: 'Buy iron supplements', due: 'Due: Today', done: false },
                        { title: 'Install car seat', due: 'Due: Next Week', done: false },
                     ].map((task, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors group cursor-pointer">
                           <div className="flex items-center gap-4">
                              <div className="w-6 h-6 rounded border-2 border-slate-300 group-hover:border-blue-500"></div>
                              <div>
                                 <h3 className="font-bold text-slate-900 text-base">{task.title}</h3>
                                 <p className="text-xs text-slate-400 font-medium">{task.due}</p>
                              </div>
                           </div>
                           <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                     ))}
                  </div>
                  
                  <button className="mt-6 w-full py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                     + Add Task for Yourself
                  </button>
               </div>

               {/* Goal Card */}
               <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-lg shadow-blue-900/20">
                  <div className="relative z-10 max-w-xl">
                     <div className="flex items-start justify-between gap-4">
                       <div className="flex-1">
                         <h2 className="text-2xl font-display font-bold mb-3">Tonight's Goal: Iron-Rich Dinner</h2>
                         <p className="text-blue-100 text-sm leading-relaxed mb-8">
                            Maya's latest blood test showed iron levels are slightly on the lower side. Doctors suggest adding more spinach or lentils to her diet.
                         </p>
                       </div>
                       <SpeakButton text="Tonight's Goal: Iron-Rich Dinner. Maya's latest blood test showed iron levels are slightly on the lower side. Doctors suggest adding more spinach or lentils to her diet." className="text-white border-white/30 bg-white/10 hover:bg-white/20" />
                     </div>
                     <div className="flex gap-4">
                        <button className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-50 transition-colors">
                           <ChefHat size={18} /> View Recipes
                        </button>
                        <button className="bg-blue-500/30 backdrop-blur-sm text-white border border-white/20 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-500/40 transition-colors">
                           Order Groceries
                        </button>
                     </div>
                  </div>
                  <ChefHat size={200} className="absolute -bottom-10 -right-10 text-white opacity-10 rotate-12" />
               </div>

               {/* Bottom Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-[2rem] p-6 border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                     <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                        <ShoppingCart size={24} />
                     </div>
                     <div>
                        <h3 className="font-bold text-slate-900">Shopping List</h3>
                        <p className="text-xs text-slate-500 mt-1">Dates, Spinach, Walnut, Milk</p>
                     </div>
                  </div>
                  <div className="bg-white rounded-[2rem] p-6 border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                     <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                        <MessageCircle size={24} />
                     </div>
                     <div>
                        <h3 className="font-bold text-slate-900">Support Chat</h3>
                        <p className="text-xs text-slate-500 mt-1">Ask nutritionists or mentors</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Column */}
            <div className="xl:col-span-4 space-y-6">
               {/* Tip of the Day */}
               <div className="bg-[#fffbeb] rounded-[2rem] p-8 border border-amber-50">
                  <div className="flex items-center gap-2 mb-4 text-amber-700">
                     <Heart size={18} className="fill-current" />
                     <span className="text-xs font-bold uppercase tracking-widest">Partner Tip of the Day</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <p className="text-amber-900 italic text-sm leading-relaxed font-medium flex-1">
                       "At 24 weeks, many mothers experience back pain. Offer a 10-minute foot or lower back massage tonight before bed. It goes a long way in mental wellness."
                    </p>
                    <SpeakButton text="Partner Tip of the Day. At 24 weeks, many mothers experience back pain. Offer a 10-minute foot or lower back massage tonight before bed. It goes a long way in mental wellness." size={14} />
                  </div>
               </div>

               {/* Appointments */}
               <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-2">Maya's Appointments</h3>
                  <p className="text-xs text-slate-500 mb-6">Ensure you've blocked your calendar for these:</p>
                  
                  <div className="bg-slate-50 p-4 rounded-2xl border-l-4 border-blue-500">
                     <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide block mb-1">In 4 Days</span>
                     <h4 className="font-bold text-slate-900">Anomaly Scan</h4>
                     <p className="text-xs text-slate-500 mt-0.5">City Hospital • 11:30 AM</p>
                  </div>
               </div>

               {/* Learning Module */}
               <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-2">Learning Module</h3>
                  <p className="text-xs text-slate-500 mb-6">How to prepare for the third trimester transition.</p>
                  
                  <div className="aspect-video bg-slate-100 rounded-2xl flex items-center justify-center relative overflow-hidden group cursor-pointer">
                     <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-blue-600 z-10 group-hover:scale-110 transition-transform">
                        <Play size={20} className="ml-1" fill="currentColor" />
                     </div>
                     <div className="absolute inset-0 bg-slate-200/50"></div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // VIEW: FAMILY DASHBOARD
  // ----------------------------------------------------------------------
  if (role === 'family') {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
         <div className="mb-2 text-center">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">MODE: FAMILY PERSPECTIVE</span>
            <h1 className="text-4xl font-display font-extrabold text-slate-900 mt-2">Your Pregnancy Journey</h1>
            <div className="flex items-center justify-center gap-2 mt-4">
              <h2 className="text-2xl font-display font-bold text-slate-700">Welcome, Family!</h2>
              <SpeakButton text="Family Perspective. Your Pregnancy Journey. Welcome, Family! Stay updated on Maya's journey and find ways to support." />
            </div>
            <p className="text-slate-500 mt-2">Stay updated on Maya's journey and find ways to support.</p>
         </div>

         {/* Milestone Hero */}
         <div className="bg-gradient-to-br from-rose-50 to-white rounded-[2.5rem] p-10 border border-rose-100 text-center relative overflow-hidden">
            <Heart size={300} className="absolute -top-10 -left-10 text-rose-100 opacity-50 rotate-[-15deg]" />
            <Heart size={200} className="absolute -bottom-10 -right-10 text-rose-100 opacity-50 rotate-[15deg]" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
               <div className="flex items-center justify-center gap-2">
                 <h3 className="text-2xl font-display font-bold text-rose-800 mb-3">Milestone Alert: 24 Weeks!</h3>
                 <SpeakButton text="Milestone Alert: 24 Weeks! The baby is now about the size of an ear of corn and can hear sounds from the outside world!" />
               </div>
               <p className="text-rose-900/70 text-base leading-relaxed mb-8">
                  The baby is now about the size of an ear of corn and can hear sounds from the outside world!
               </p>
               <div className="flex justify-center gap-4">
                  <button className="bg-rose-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-colors flex items-center gap-2">
                     <Heart size={18} fill="currentColor" /> Send Love
                  </button>
                  <button className="bg-white text-slate-700 border border-slate-200 px-8 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center gap-2">
                     <Mic size={18} /> Record Voice Note
                  </button>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Support Suggestions */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100">
               <div className="flex items-center gap-3 mb-6">
                  <Info size={20} className="text-blue-500" />
                  <h3 className="font-bold text-slate-900 text-lg">Support Maya Today</h3>
               </div>
               <div className="space-y-4">
                  <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                     <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded flex items-center justify-center font-bold text-xs shrink-0">1</div>
                     <p className="text-sm text-slate-600 leading-relaxed">Ask about her sleep—third trimester is starting soon.</p>
                  </div>
                  <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                     <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded flex items-center justify-center font-bold text-xs shrink-0">2</div>
                     <p className="text-sm text-slate-600 leading-relaxed">Maya mentioned craving traditional homemade Makhana.</p>
                  </div>
               </div>
            </div>

            {/* Events */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100">
               <div className="flex items-center gap-3 mb-6">
                  <Calendar size={20} className="text-emerald-500" />
                  <h3 className="font-bold text-slate-900 text-lg">Family Events</h3>
               </div>
               <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                     <span className="font-bold text-slate-700 text-sm">Baby Shower Planning</span>
                     <span className="text-xs font-bold text-slate-400">Nov 12</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                     <span className="font-bold text-slate-700 text-sm">Hospital Visit (Maya)</span>
                     <span className="text-xs font-bold text-slate-400">Dec 01</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Photos */}
         <div className="bg-white rounded-[2rem] p-8 border border-slate-100">
            <h3 className="font-bold text-slate-900 text-lg mb-6">Latest Shared Photos</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                  'https://images.unsplash.com/photo-1544126566-475a890b0e53?auto=format&fit=crop&w=400&q=80',
                  'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=400&q=80',
                  'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&w=400&q=80',
                  'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=400&q=80'
               ].map((src, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden relative group cursor-pointer">
                     <img src={src} alt="Family memory" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                     <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
               ))}
            </div>
         </div>

         {/* Care Package Banner */}
         <div className="bg-indigo-900 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-white relative overflow-hidden">
             <div className="relative z-10 flex items-start gap-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold font-display mb-2">Send a Care Package?</h3>
                  <p className="text-indigo-200 text-sm">We've curated healthy snacks & wellness kits Maya will love.</p>
                </div>
                <SpeakButton text="Send a Care Package? We've curated healthy snacks and wellness kits Maya will love." className="text-white border-white/30 bg-white/10 hover:bg-white/20" size={14} />
             </div>
             <Gift size={64} className="text-indigo-400 opacity-50 absolute right-8 bottom-0 md:static md:opacity-100" />
         </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // VIEW: MEDICAL DASHBOARD
  // ----------------------------------------------------------------------
  if (role === 'medical') {
    return (
       <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-4 flex items-start justify-between">
             <div>
               <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">MODE: DOCTOR PERSPECTIVE</span>
               <h1 className="text-4xl font-display font-extrabold text-slate-900 mt-1">Your Pregnancy Journey</h1>
             </div>
             <SpeakButton text="Doctor Perspective. Clinical Dashboard for monitoring patient health and pregnancy progress." />
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Activity size={24} /></div>
                <h2 className="text-2xl font-bold font-display text-slate-900">Clinical Dashboard</h2>
             </div>
             
             <div className="flex w-full lg:w-auto gap-4">
                <div className="relative flex-1 lg:w-64">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                   <input type="text" placeholder="Search patient..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors flex items-center gap-2">
                   <Bell size={16} /> Alerts (2)
                </button>
             </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
             {/* Left Sidebar: Active Patients */}
             <div className="lg:w-64 shrink-0 space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Active Patients</h3>
                
                <div className="bg-blue-50 border border-blue-100 p-3 rounded-2xl flex items-center gap-3 cursor-pointer">
                   <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80" alt="Maya" className="w-10 h-10 rounded-full object-cover" />
                   <div>
                      <h4 className="font-bold text-slate-900 text-sm">Maya Sharma</h4>
                      <p className="text-[10px] text-slate-500 font-medium">24 Weeks • High Risk</p>
                   </div>
                   <div className="w-1 h-8 bg-blue-500 rounded-full ml-auto"></div>
                </div>

                {[2, 3, 4].map(i => (
                   <div key={i} className="p-3 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors opacity-60 hover:opacity-100">
                      <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                      <div>
                         <h4 className="font-bold text-slate-900 text-sm">Patient {i}</h4>
                         <p className="text-[10px] text-slate-500 font-medium">Routine Checkup</p>
                      </div>
                   </div>
                ))}
             </div>

             {/* Main Content Area */}
             <div className="flex-1 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm min-h-[600px]">
                {/* Patient Header */}
                <div className="flex justify-between items-start mb-8">
                   <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                         <User size={32} />
                      </div>
                      <div>
                         <h2 className="text-2xl font-bold font-display text-slate-900">Maya Sharma</h2>
                         <p className="text-slate-500 text-sm">Age: 28 | LMP: April 12, 2024 | G1P0</p>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                         <MessageCircle size={20} />
                      </button>
                      <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                         <ClipboardList size={20} />
                      </button>
                   </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                   <div className="bg-rose-50 rounded-2xl p-5 border border-rose-100 relative overflow-hidden">
                      <div className="flex justify-between items-start mb-2">
                         <AlertCircle size={20} className="text-rose-500" />
                         <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">URGENT</span>
                      </div>
                      <span className="text-xs font-bold text-rose-800 uppercase tracking-wide">Blood Sugar</span>
                      <div className="text-3xl font-display font-bold text-slate-900 mt-1">125 <span className="text-sm font-medium text-rose-600">mg/dL</span></div>
                      <p className="text-[10px] text-rose-700 mt-2 font-medium">Spike detected after lunch (Today)</p>
                   </div>

                   <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                      <TrendingUp size={20} className="text-emerald-500 mb-2" />
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Weight Gain</span>
                      <div className="text-3xl font-display font-bold text-slate-900 mt-1">+4.2 <span className="text-sm font-medium text-slate-500">kg</span></div>
                      <p className="text-[10px] text-emerald-700 mt-2 font-medium">On track for trimester 2</p>
                   </div>

                   <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                      <Activity size={20} className="text-blue-500 mb-2" />
                      <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">Avg Sleep</span>
                      <div className="text-3xl font-display font-bold text-slate-900 mt-1">7.5 <span className="text-sm font-medium text-slate-500">hrs</span></div>
                      <p className="text-[10px] text-blue-700 mt-2 font-medium">Consistent for last 7 days</p>
                   </div>
                </div>

                {/* Chart Section */}
                <div className="mb-8">
                   <h3 className="font-bold text-slate-900 mb-6">Long-term Trend: Blood Sugar</h3>
                   <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={bloodSugarTrend}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis 
                               dataKey="day" 
                               axisLine={false} 
                               tickLine={false} 
                               tick={{ fill: '#94a3b8', fontSize: 12 }} 
                               dy={10}
                            />
                            <YAxis hide domain={[90, 140]} />
                            <Tooltip 
                               contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Line 
                               type="monotone" 
                               dataKey="value" 
                               stroke="#f43f5e" 
                               strokeWidth={3}
                               dot={{ r: 4, fill: "#f43f5e", strokeWidth: 0 }}
                               activeDot={{ r: 6, fill: "#f43f5e", strokeWidth: 0 }}
                            />
                         </LineChart>
                      </ResponsiveContainer>
                      <div className="flex justify-center mt-4">
                        <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                           <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">Blood Sugar (mg/dL)</span>
                        </div>
                      </div>
                   </div>
                </div>

                {/* Files */}
                <div className="border-t border-slate-100 pt-8">
                   <h3 className="font-bold text-slate-900 mb-4">Medical Files & Reports</h3>
                   <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                      <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-lg flex items-center justify-center font-bold text-xs uppercase group-hover:bg-rose-100 transition-colors">PDF</div>
                      <div>
                         <h4 className="font-bold text-slate-900 text-sm">Level 2 Ultrasound Scan</h4>
                         <p className="text-xs text-slate-500">Uploaded 2 days ago</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    );
  }

  // ----------------------------------------------------------------------
  // VIEW: MOTHER DASHBOARD (Default / Pre-Conception / Pregnancy / Post-Partum)
  // ----------------------------------------------------------------------

  // ----------------------------------------------------------------------
  // VIEW: Pre-Pregnancy
  // ----------------------------------------------------------------------
  if (phase === 'pre-pregnancy') {
     return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Planning Phase
                      </div>
                      <h1 className="text-3xl font-display font-extrabold text-slate-900">Pre-Conception</h1>
                      <p className="text-slate-500 mt-1">Optimization Phase</p>
                    </div>
                    <SpeakButton text="Pre-Conception Optimization Phase. Track your cycle, optimize your health, and prepare for pregnancy." />
                </div>
             </div>
             <PreConceptionGuide />
             <CycleCalendar />
        </div>
     )
  }

  // ----------------------------------------------------------------------
  // VIEW: Pregnancy
  // ----------------------------------------------------------------------
  if (phase === 'pregnancy') {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-x-hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                Trimester 2
              </div>
              <h1 className="text-3xl font-display font-extrabold text-slate-900">Pregnancy</h1>
              <p className="text-slate-500 mt-1">Week 24 • Day 3</p>
            </div>
            <SpeakButton text="Pregnancy Dashboard. Trimester 2, Week 24, Day 3. Track your pregnancy journey, fetal development, and health vitals." />
          </div>
        </div>

        {/* Timeline & Chat */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-2">
          <div className="xl:col-span-3 flex flex-col overflow-hidden">
            <div className="flex justify-between items-end mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-display text-slate-900">Fetal Growth Timeline</h2>
                <SpeakButton text="Fetal Growth Timeline. Track your baby's development from Month 1 as a poppy seed through Month 9 as a watermelon. Swipe to explore each month's milestones." />
              </div>
              <span className="text-xs font-bold text-rose-400 tracking-widest uppercase animate-pulse">Swipe to explore</span>
            </div>
            
            <div className="flex overflow-x-auto gap-4 pb-8 snap-x snap-mandatory custom-scrollbar flex-1">
              {fetalTimeline.map((item, i) => (
                <div key={i} className="min-w-[260px] md:min-w-[280px] bg-rose-50/40 border border-rose-100 rounded-[1.5rem] p-5 snap-center flex flex-col hover:bg-rose-50/60 transition-colors group">
                   <div className="flex justify-between items-start mb-4">
                     <span className="bg-white text-rose-500 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                       {item.month}
                     </span>
                   </div>
                   
                   <div className="w-32 h-32 mx-auto mb-2 rounded-full bg-white border-4 border-white shadow-lg shadow-rose-100 overflow-hidden relative group-hover:scale-105 transition-transform duration-500">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                   </div>
                   <div className="text-center mb-3">
                     <span className="inline-block bg-rose-100 text-rose-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Size: {item.size}</span>
                   </div>

                   <h3 className="text-lg font-bold font-display text-slate-900 mb-1.5">{item.title}</h3>
                   <p className="text-xs text-slate-600 mb-4 leading-relaxed line-clamp-3">
                     {item.desc}
                   </p>
                </div>
              ))}
            </div>
          </div>

          <div className="xl:col-span-2 flex flex-col">
             <div className="bg-slate-900 rounded-[2rem] p-6 h-full flex flex-col relative overflow-hidden shadow-xl shadow-slate-900/10 min-h-[450px]">
                <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col h-full">
                   <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                     <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                        <Lock size={16} className="text-rose-400" />
                     </div>
                     <div className="flex-1">
                       <h3 className="font-bold text-white text-sm">Midwife AI</h3>
                       <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Private & Secure</span>
                       </div>
                     </div>
                     <SpeakButton text="Midwife AI. Your private and secure pregnancy assistant. Ask questions about your pregnancy journey." className="text-white border-white/30 bg-white/10 hover:bg-white/20" size={12} />
                   </div>
                   <div className="flex-1 space-y-4 mb-4 overflow-y-auto custom-scrollbar pr-1">
                      <div className="flex gap-3">
                         <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none text-xs text-slate-200 leading-relaxed border border-white/5">
                            I noticed you're in Week 24. This is often when baby's movements become more distinct. Have you felt any strong kicks today?
                         </div>
                      </div>
                   </div>
                   <div className="relative mt-auto">
                     <input type="text" placeholder="Message..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all placeholder:text-slate-500" />
                     <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-rose-600 text-white rounded-lg flex items-center justify-center hover:bg-rose-500 transition-colors shadow-lg shadow-rose-900/50">
                       <Send size={14} />
                     </button>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Live Vitals (Replaces Watch & Chart) */}
        <div className="bg-[#fff0f0] rounded-[2rem] p-6 lg:p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center shadow-sm">
                        <Activity size={28} />
                    </div>
                    <h2 className="text-4xl font-display font-bold text-slate-900">Live Vitals</h2>
                </div>
                <div className={`px-4 py-2 rounded-full border flex items-center gap-2 font-bold text-[10px] tracking-wider uppercase transition-all shadow-sm ${watchConnected ? 'bg-white border-emerald-200 text-emerald-700' : 'bg-white border-rose-200 text-rose-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${watchConnected ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                    {watchConnected ? 'Connected' : 'Not Connected'}
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
                {[
                    { label: 'Sugar', value: vitals.sugar, unit: 'mg/dL', icon: Flame, color: 'text-rose-500', bg: 'bg-rose-50' },
                    { label: 'Heart Rate', value: vitals.hr, unit: 'bpm', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
                    { label: 'SPO2', value: vitals.spo2, unit: '%', icon: Wind, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { label: 'Stress', value: vitals.stress, unit: '/100', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-50', active: true },
                    { label: 'Sleep', value: vitals.sleep, unit: 'hrs', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                    { label: 'Snoring', value: vitals.snoring, unit: 'min', icon: Volume2, color: 'text-amber-500', bg: 'bg-amber-50' },
                    { label: 'Weight', value: vitals.weight, unit: 'kg', icon: Scale, color: 'text-slate-500', bg: 'bg-slate-50' },
                ].map((item, i) => (
                    <div key={i} className={`
                        relative bg-white rounded-2xl p-3 flex flex-col items-center justify-center gap-2 min-h-[120px] transition-all cursor-pointer
                        ${item.active 
                            ? 'ring-2 ring-purple-400 shadow-xl shadow-purple-200 scale-105 z-10' 
                            : 'hover:scale-105 hover:shadow-lg border border-transparent hover:border-slate-100'}
                    `}>
                        <div className={`w-9 h-9 rounded-full ${item.bg} ${item.color} flex items-center justify-center mb-0.5`}>
                            <item.icon size={18} />
                        </div>
                        <div className="text-center">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">{item.label}</span>
                            <div className="flex items-baseline justify-center gap-0.5">
                                <span className="text-lg font-display font-bold text-slate-900">{item.value}</span>
                                <span className="text-[9px] font-bold text-slate-400">{item.unit}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Area */}
                <div className="lg:col-span-2 bg-white/50 backdrop-blur-sm rounded-[2.5rem] p-6 border border-white h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stressGraphData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorStressPurple" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis 
                                dataKey="day" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                                dy={10}
                            />
                            <YAxis hide domain={[0, 100]} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#8b5cf6" 
                                strokeWidth={4}
                                fillOpacity={1} 
                                fill="url(#colorStressPurple)" 
                                dot={{ r: 6, fill: "#ffffff", stroke: "#8b5cf6", strokeWidth: 3 }}
                                activeDot={{ r: 8, fill: "#8b5cf6", stroke: "#ffffff", strokeWidth: 3 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center mt-2">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                            <span className="text-xs font-bold text-purple-500 uppercase tracking-widest">Stress Level (0-100)</span>
                        </div>
                    </div>
                </div>

                {/* My Watch / Data Pipeline Card */}
                <div className="lg:col-span-1 bg-white rounded-[2.5rem] p-6 border border-white shadow-sm flex flex-col justify-between h-[320px]">
                    
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
                                <Watch size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold font-display text-slate-900">My Watch</h3>
                                <div className="flex gap-1 items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Synced</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex bg-slate-100 rounded-full p-1">
                            <button className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-bold shadow-sm">AUTO BRIDGE</button>
                            <button className="px-3 py-1 text-slate-400 text-[10px] font-bold hover:text-slate-600 transition-colors">MANUAL</button>
                        </div>
                    </div>

                    {/* Pipeline Visuals */}
                    <div className="flex justify-between items-center px-1 mb-4">
                         <div className="flex flex-col items-center gap-1 text-slate-400">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                                <Watch size={18} />
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-wider">Wrist</span>
                         </div>
                         <div className="h-[2px] flex-1 bg-slate-100 mx-1 relative">
                            <ArrowRight size={10} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300" />
                         </div>
                         <div className="flex flex-col items-center gap-1 text-slate-400">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                                <SmartphoneNfc size={18} />
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-wider">Nothing X</span>
                         </div>
                         <div className="h-[2px] flex-1 bg-slate-100 mx-1 relative">
                            <ArrowRight size={10} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300" />
                         </div>
                         <div className="flex flex-col items-center gap-1 text-slate-400">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                                <Cloud size={18} />
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-wider">Google Fit</span>
                         </div>
                         <div className="h-[2px] flex-1 bg-slate-100 mx-1 relative">
                             <ArrowRight size={10} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300" />
                         </div>
                         <div className="flex flex-col items-center gap-1 text-slate-900">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                                <Activity size={18} />
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-wider">NurtureNet</span>
                         </div>
                    </div>

                    {/* Warning Box */}
                    <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex gap-3 mb-4">
                         <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                         <p className="text-[10px] text-amber-800 font-medium leading-relaxed">
                            Connect your Google Fit account to pull the Nothing X synced data from your watch.
                         </p>
                    </div>

                    {/* Action Button */}
                    <button 
                        onClick={handleWatchAuth}
                        className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                        {isAuthorizing ? (
                             <>
                                <RefreshCw size={14} className="animate-spin" /> Authorizing...
                             </>
                        ) : (
                             <>
                                <HeartHandshake size={14} className="text-emerald-400" /> Authorize Cloud Bridge
                             </>
                        )}
                    </button>

                    {/* Footer Status */}
                    <div className="mt-4 pt-0 text-center">
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center justify-center gap-1.5">
                             <RefreshCw size={10} className="animate-spin" /> Data Pipeline Active
                        </span>
                    </div>

                </div>
            </div>
        </div>

        {/* Doctor & Watch Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col justify-between h-full">
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
                      <Stethoscope size={28} />
                   </div>
                   <div>
                      <h2 className="text-2xl font-display font-bold text-slate-900">Doctor's Clinical Summary</h2>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Last Update: Oct 12 by Dr. Aditi Sharma</p>
                   </div>
                   <SpeakButton text="Doctor's Clinical Summary. G1P0 gestation at 24 weeks. Overall clinical status is stable. Fetal growth matches gestational age perfectly. Prescribed instructions: Sleep strictly on the left lateral position. Schedule Glucose Challenge Test. Maintain 3.5 liters daily hydration goal." />
                </div>
                <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-2 border border-indigo-100">
                   <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                   Clinical Record
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                       <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-3 block">Diagnosis & Status</span>
                       <p className="text-slate-800 font-bold text-lg leading-relaxed">
                          G1P0 gestation at 24 weeks. Overall clinical status is <span className="text-emerald-500">STABLE</span>. Fetal growth matches gestational age perfectly.
                       </p>
                    </div>
                 </div>
                 <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                           <ClipboardList size={18} className="text-rose-500" />
                           <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">Prescribed Instructions</span>
                        </div>
                        <div className="space-y-3">
                           {["Sleep strictly on the left lateral position.", "Schedule Glucose Challenge Test (GCT).", "Maintain 3.5L daily hydration goal."].map((item, i) => (
                              <div key={i} className="flex items-start gap-4 p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-indigo-100 transition-colors">
                                 <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <CheckCircle2 size={12} />
                                 </div>
                                 <span className="text-sm font-bold text-slate-700 leading-snug">{item}</span>
                              </div>
                           ))}
                        </div>
                    </div>
                 </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-50">
                 <div className="flex items-center gap-2 mb-2">
                   <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Clinical Observations</span>
                   <SpeakButton text="Clinical Observations. Fetal Heart Rate baseline at 145 beats per minute with moderate variability. Patient reports mild lumbar strain. Blood pressure is within normal ranges at 110 over 70 millimeters of mercury." size={12} />
                 </div>
                 <p className="text-slate-600 text-sm leading-relaxed">
                    Fetal Heart Rate baseline at 145 bpm with moderate variability. Patient reports mild lumbar strain. Blood pressure is within normal ranges (110/70 mmHg).
                 </p>
             </div>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-6">
              {/* How are you feeling? Card */}
              <div className="bg-rose-900 rounded-[2rem] p-10 h-full flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-white text-3xl font-bold mb-3">How are you feeling?</h3>
                  <SpeakButton text="How are you feeling? It's normal to feel a mix of emotions right now. Tracking helps. You can select Sad, Neutral, Good, or Great, and describe what's on your mind." className="text-white border-white/30 bg-white/10 hover:bg-white/20" />
                </div>
                <p className="text-rose-200 text-base mb-8">It's normal to feel a mix of emotions right now. Tracking helps.</p>
                
                <div className="flex flex-col gap-3 mb-8">
                  <div className="flex gap-4">
                    <button className="flex-1 flex flex-col items-center gap-3 p-5 rounded-xl bg-rose-800/50 hover:bg-rose-700 transition-colors">
                      <span className="text-4xl">😔</span>
                      <span className="text-rose-200 text-sm font-medium">Sad</span>
                    </button>
                    <button className="flex-1 flex flex-col items-center gap-3 p-5 rounded-xl bg-rose-800/50 hover:bg-rose-700 transition-colors">
                      <span className="text-4xl">🙄</span>
                      <span className="text-rose-200 text-sm font-medium">Neutral</span>
                    </button>
                    <button className="flex-1 flex flex-col items-center gap-3 p-5 rounded-xl bg-rose-800/50 hover:bg-rose-700 transition-colors">
                      <span className="text-4xl">🙂</span>
                      <span className="text-rose-200 text-sm font-medium">Good</span>
                    </button>
                    <button className="flex-1 flex flex-col items-center gap-3 p-5 rounded-xl bg-rose-800/50 hover:bg-rose-700 transition-colors">
                      <span className="text-4xl">🤩</span>
                      <span className="text-rose-200 text-sm font-medium">Great</span>
                    </button>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <label className="text-rose-200 text-base font-medium mb-3 block">What's on your mind?</label>
                  <textarea 
                    placeholder="Describe how you're feeling..." 
                    rows={4}
                    className="w-full px-5 py-4 rounded-xl bg-rose-800/50 border border-rose-700/50 text-white placeholder-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all resize-none"
                  />
                </div>
              </div>
           </div>
        </div>
        
        {/* Pregnancy Calendar & Fluid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
               <PregnancyCalendar />
            </div>
            
            <div className="xl:col-span-1 space-y-6">
              <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
               <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                   <Droplets size={20} />
                 </div>
                 <h3 className="text-xl font-display font-bold text-slate-900">Hydration</h3>
               </div>
               <div className="flex justify-between items-end mb-2">
                  <span className="text-3xl font-display font-bold text-slate-900">4<span className="text-lg text-slate-400 font-normal">/8</span></span>
                  <span className="text-xs font-bold text-blue-500">Glasses</span>
               </div>
               <div className="flex gap-1 h-12">
                 {[1,2,3,4,5,6,7,8].map(i => (
                   <div key={i} className={`flex-1 rounded-full ${i <= 4 ? 'bg-blue-400' : 'bg-slate-100'}`}></div>
                 ))}
               </div>
               <button className="w-full mt-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                 + Add Water
               </button>
              </div>

              <div className="bg-[#fff1f2] rounded-[2rem] p-6 shadow-sm border border-rose-100">
                <h3 className="text-xl font-bold font-display text-slate-900 mb-6">Appointments</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm">
                     <div className="w-14 h-14 bg-[#f43f5e] rounded-xl flex flex-col items-center justify-center text-white shrink-0 leading-none shadow-md shadow-rose-200">
                        <span className="text-[10px] font-bold uppercase opacity-80 mb-0.5">OCT</span>
                        <span className="text-xl font-bold font-display">14</span>
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-900 text-base">Obstetrician</h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">10:00 AM • Routine</p>
                     </div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm">
                     <div className="w-14 h-14 bg-[#3b82f6] rounded-xl flex flex-col items-center justify-center text-white shrink-0 leading-none shadow-md shadow-blue-200">
                        <span className="text-[10px] font-bold uppercase opacity-80 mb-0.5">DEC</span>
                        <span className="text-xl font-bold font-display">17</span>
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-900 text-base">Dietitian</h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">03:30 PM • Macros</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>
        </div>

      </div>
    );
  }

  // ----------------------------------------------------------------------
  // VIEW: Post-Partum
  // ----------------------------------------------------------------------
  if (phase === 'post-partum') {
      const moodSnapshotData = [
        { day: 'Mon', value: 5 },
        { day: 'Tue', value: 6 },
        { day: 'Wed', value: 4 },
        { day: 'Thu', value: 7 },
        { day: 'Fri', value: 6 },
        { day: 'Sat', value: 8 },
        { day: 'Sun', value: 7 },
      ];

      const postPartumSleepData = [
        { day: 'M', hours: 4.5 },
        { day: 'Tu', hours: 5.2 },
        { day: 'W', hours: 3.8 },
        { day: 'Th', hours: 5.0 },
        { day: 'F', hours: 6.2 },
        { day: 'Sa', hours: 5.5 },
        { day: 'Su', hours: 4.8 },
      ];

      const toggleChecklistItem = (index: number) => {
        setRecoveryChecklist(prev => 
          prev.map((item, i) => i === index ? { ...item, done: !item.done } : item)
        );
      };

      const avgSleep = (postPartumSleepData.reduce((sum, d) => sum + d.hours, 0) / postPartumSleepData.length).toFixed(1);

      return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                Recovery
              </div>
              <h1 className="text-3xl font-display font-extrabold text-slate-900">Post-Partum</h1>
              <p className="text-slate-500 mt-1">Focusing on healing and bonding.</p>
            </div>
            <SpeakButton text="Post-Partum Dashboard. Recovery phase. Focusing on healing and bonding with your baby." />
          </div>
        </div>

        {/* Motivational Quote - Centered */}
        <div className="flex flex-col items-center justify-center text-center py-16 bg-slate-50/50 rounded-[2rem] my-4 relative">
          <Heart size={40} className="text-indigo-400 mb-6" />
          <p className="font-serif italic text-3xl md:text-4xl lg:text-5xl text-slate-800 leading-relaxed max-w-4xl px-8" style={{ fontFamily: "'DM Serif Display', serif" }}>
            You are doing amazing, mama. Every small step forward is a victory.
          </p>
          <div className="absolute top-4 right-4">
            <SpeakButton text="You are doing amazing, mama. Every small step forward is a victory." />
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column */}
          <div className="space-y-6">
            
            {/* How are you feeling? Card */}
            <div className="bg-indigo-900 rounded-[2rem] p-8">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-white text-2xl font-bold mb-2">How are you feeling?</h3>
                <SpeakButton text="How are you feeling? It's normal to feel a mix of emotions right now. Tracking helps. You can select Sad, Neutral, Good, or Great, and describe what's on your mind." className="text-white border-white/30 bg-white/10 hover:bg-white/20" />
              </div>
              <p className="text-indigo-200 text-sm mb-6">It's normal to feel a mix of emotions right now. Tracking helps.</p>
              
              <div className="flex flex-col gap-2 mb-6">
                <div className="flex gap-4">
                  <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl bg-indigo-800/50 hover:bg-indigo-700 transition-colors">
                    <span className="text-3xl">😔</span>
                    <span className="text-indigo-200 text-xs font-medium">Sad</span>
                  </button>
                  <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl bg-indigo-800/50 hover:bg-indigo-700 transition-colors">
                    <span className="text-3xl">🙄</span>
                    <span className="text-indigo-200 text-xs font-medium">Neutral</span>
                  </button>
                  <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl bg-indigo-800/50 hover:bg-indigo-700 transition-colors">
                    <span className="text-3xl">🙂</span>
                    <span className="text-indigo-200 text-xs font-medium">Good</span>
                  </button>
                  <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl bg-indigo-800/50 hover:bg-indigo-700 transition-colors">
                    <span className="text-3xl">🤩</span>
                    <span className="text-indigo-200 text-xs font-medium">Great</span>
                  </button>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="text-indigo-200 text-sm font-medium mb-2 block">What's on your mind?</label>
                <input 
                  type="text" 
                  placeholder="Describe how you're feeling..." 
                  className="w-full px-4 py-3 rounded-xl bg-indigo-800/50 border border-indigo-700/50 text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Mood Snapshot Card */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                    <Activity size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Mood Snapshot</h3>
                    <p className="text-xs text-slate-400">Last 7 days</p>
                  </div>
                </div>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                  Stable
                </span>
              </div>
              
              <div className="h-40 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodSnapshotData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 11 }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 11 }} 
                      domain={[0, 5]}
                      ticks={[2, 5]}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#8b5cf6", stroke: "#8b5cf6", strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: "#8b5cf6" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Wellness Screening Card */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-[2rem] p-8 relative overflow-hidden">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles size={28} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg">Wellness Screening</h3>
                  <p className="text-sm text-purple-100">EPDS Assessment</p>
                </div>
                <SpeakButton text="Wellness Screening. Edinburgh Postnatal Depression Scale Assessment. Current status: Low Risk. Last screened January 6, 2026." className="text-white border-white/30 bg-white/10 hover:bg-white/20" size={12} />
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <CheckCircle2 size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Low Risk</h4>
                    <p className="text-sm text-purple-100">Last screened: Jan 6, 2026</p>
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-white text-purple-600 py-4 rounded-xl font-bold text-sm hover:bg-purple-50 transition-all flex items-center justify-center gap-2">
                Take Full Screening
                <ArrowRight size={18} />
              </button>
            </div>

          </div>

        </div>

        {/* Bottom 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Sleep Pattern Card */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                  <Moon size={20} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Sleep Pattern</h3>
                  <p className="text-xs text-slate-400">This week</p>
                </div>
              </div>
              <span className="text-purple-600 font-bold text-sm">
                Avg {avgSleep}h
              </span>
            </div>
            
            <div className="h-48 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={postPartumSleepData}>
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 11 }} 
                    domain={[0, 10]}
                    ticks={[0, 6, 10]}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    formatter={(value: number) => [`${value}h`, 'Sleep']}
                  />
                  <Bar 
                    dataKey="hours" 
                    fill="#8b5cf6" 
                    radius={[6, 6, 6, 6]} 
                    barSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recovery Checklist */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 text-xl">Recovery Checklist</h3>
              <span className="text-purple-600 font-bold text-sm">
                {recoveryChecklist.filter(item => item.done).length}/{recoveryChecklist.length} done
              </span>
            </div>
            
            <div className="space-y-2">
              {recoveryChecklist.map((item, i) => (
                <div 
                  key={i} 
                  onClick={() => toggleChecklistItem(i)}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer ${
                    item.done 
                      ? 'bg-purple-50' 
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                    item.done 
                      ? 'bg-purple-500' 
                      : 'border-2 border-slate-300'
                  }`}>
                    {item.done && <Check size={16} className="text-white" />}
                  </div>
                  <span className={`font-medium text-base ${
                    item.done 
                      ? 'text-slate-900' 
                      : 'text-slate-600'
                  }`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // VIEW: Baby Care (Default Fallback)
  // ----------------------------------------------------------------------
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-sky-700 text-xs font-bold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                Month 2
              </div>
              <h1 className="text-3xl font-display font-extrabold text-slate-900">Baby Care</h1>
              <p className="text-slate-500 mt-1">Leo is 8 weeks old today!</p>
            </div>
            <SpeakButton text="Baby Care Dashboard. Month 2. Leo is 8 weeks old today! Track feeding, sleep, weight, and upcoming milestones." />
          </div>
          <button className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2">
            <Calendar size={18} />
            Log Appointment
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center gap-2">
              <div className="p-3 bg-orange-50 text-orange-500 rounded-full mb-1">
                <Milk size={24} />
              </div>
              <span className="text-slate-400 text-xs font-bold uppercase">Last Feed</span>
              <span className="text-2xl font-display font-bold text-slate-900">2h 15m</span>
              <span className="text-xs text-slate-400">ago</span>
           </div>
           
           <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center gap-2">
              <div className="p-3 bg-blue-50 text-blue-500 rounded-full mb-1">
                <Moon size={24} />
              </div>
              <span className="text-slate-400 text-xs font-bold uppercase">Last Sleep</span>
              <span className="text-2xl font-display font-bold text-slate-900">45m</span>
              <span className="text-xs text-slate-400">duration</span>
           </div>

           <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center gap-2">
              <div className="p-3 bg-green-50 text-green-500 rounded-full mb-1">
                <Scale size={24} />
              </div>
              <span className="text-slate-400 text-xs font-bold uppercase">Weight</span>
              <span className="text-2xl font-display font-bold text-slate-900">11.2 lbs</span>
              <span className="text-xs text-green-600 font-bold">+5%</span>
           </div>

           <div className="bg-sky-500 p-6 rounded-[2rem] shadow-lg shadow-sky-500/20 flex flex-col items-center justify-center text-center gap-2 text-white">
              <div className="p-3 bg-white/20 rounded-full mb-1">
                <Clock size={24} />
              </div>
              <span className="text-sky-100 text-xs font-bold uppercase">Next Feed</span>
              <span className="text-2xl font-display font-bold">1:30 PM</span>
              <span className="text-xs text-sky-100">in 45 mins</span>
           </div>
        </div>

        {/* Environmental Safety */}
        <div className="bg-[#fffbeb] rounded-[2rem] p-8 border border-amber-50">
           <div className="flex items-center gap-3 mb-6">
             <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
                <Wind size={24} />
             </div>
             <h2 className="text-2xl font-bold font-display text-slate-900">Environmental Safety</h2>
             <SpeakButton text="Environmental Safety. Air quality awareness for infants: In many Indian cities, carrying infants in high AQI without coverups is dangerously normalized. Babies breathe 3 times faster than adults. Avoid TV and screens for children under 2 years. Use baby coverups." />
           </div>

           {/* AQI Card */}
           <div className="bg-[#064e3b] rounded-[2rem] p-8 relative overflow-hidden mb-6 text-white">
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-1/4 translate-y-1/4">
                 <Wind size={200} />
              </div>
              <div className="relative z-10 max-w-2xl">
                 <h3 className="text-2xl font-bold font-display mb-3">AQI Awareness for Infants</h3>
                 <p className="text-emerald-100 text-sm leading-relaxed mb-8 max-w-xl">
                    In many Indian cities, carrying infants in high AQI (&gt;150) without coverups is dangerously normalized. Babies breathe 3x faster than adults.
                 </p>
                 <div className="flex flex-wrap gap-4">
                    <span className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-xs font-bold uppercase tracking-wide text-emerald-50">
                      Avoid TV/Screens &lt; 2yr
                    </span>
                    <span className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-xs font-bold uppercase tracking-wide text-emerald-50">
                      Use Baby Coverups
                    </span>
                 </div>
              </div>
           </div>

           {/* Bottom Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Media Consumption */}
              <div className="bg-white rounded-[2rem] p-6 border border-amber-100 flex gap-4 shadow-sm">
                 <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <Tv size={24} />
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-900 mb-2">Media Consumption</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                       Watching TV too much is normalized but stunts early neural speech pathways. Focus on tactile play.
                    </p>
                 </div>
              </div>

              {/* Full House Hygiene */}
              <div className="bg-white rounded-[2rem] p-6 border border-amber-100 flex gap-4 shadow-sm">
                 <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <ShieldCheck size={24} />
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-900 mb-2">Full House Hygiene</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                       Baby-safe furniture with rounded edges and non-toxic paint is essential for the first 5 years.
                    </p>
                 </div>
              </div>
           </div>
        </div>

        {/* Baby Care Essentials & Medical Roadmap */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column: Baby Care Essentials (2/3 width) */}
          <div className="xl:col-span-2 bg-white rounded-[2rem] p-8 border border-slate-100">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Baby size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold font-display text-slate-900">Baby Care Essentials</h2>
                <p className="text-slate-500">Science-backed postnatal guidance</p>
              </div>
              <SpeakButton text="Baby Care Essentials. Science-backed postnatal guidance including nutrition, hygiene, breastfeeding tips, formula safety, and product comparisons for diapers and skincare." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Nutrition & Hygiene */}
              <div>
                <div className="flex items-center gap-2 mb-4 text-rose-500">
                   <Utensils size={20} />
                   <h3 className="font-bold text-slate-900">Nutrition & Hygiene</h3>
                </div>
                <ul className="space-y-4">
                   <li className="text-sm text-slate-600 leading-relaxed">
                     <span className="font-bold text-slate-900">Breastfeeding Hygiene:</span> Cleanliness of latch and pump parts is critical. Indian milk reports suggest checking local sources for contaminants.
                   </li>
                   <li className="text-sm text-slate-600 leading-relaxed">
                     <span className="font-bold text-slate-900">Formula Safety:</span> USA/EU standards (FDA/EFSA) are currently stricter than FSSAI. Choose certified organic imports if local purity is in doubt.
                   </li>
                </ul>
              </div>

              {/* Product Comparisons */}
              <div>
                <div className="flex items-center gap-2 mb-4 text-blue-600">
                   <FlaskConical size={20} />
                   <h3 className="font-bold text-slate-900">Product Comparisons</h3>
                </div>
                <div className="space-y-3">
                   <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1 block">Diaper Quality</span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Indian market diapers are catching up, but Western regulations (TBT/SPS) often ensure lower chemical toxicity in materials.
                      </p>
                   </div>
                   <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3">
                      <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1 block">Skincare Alert</span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Avoid talc-based powders; use pH-neutral, paraben-free lotions. India has loose ends in FSSAI cosmetic monitoring.
                      </p>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Medical Roadmap (1/3 width) */}
          <div className="xl:col-span-1 bg-white rounded-[2rem] p-8 border border-slate-100 h-full flex flex-col">
             <div className="flex items-center gap-3 mb-6">
               <div className="text-rose-500">
                 <ClipboardList size={20} />
               </div>
               <h3 className="text-xl font-bold font-display text-slate-900">Medical Roadmap</h3>
               <SpeakButton text="Medical Roadmap. Vaccination tracker: BCG and Hepatitis B done. OPV 1 and DTP 1 due next week. Genetic monitoring: Birth data is analyzed for genetic markers. Follow up on infant metabolic screening results." size={12} />
             </div>

             {/* Vaccination Tracker */}
             <div className="bg-rose-50 rounded-2xl p-4 mb-4">
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider mb-3 block">Vaccination Tracker</span>
                <div className="space-y-3">
                   <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-700">BCG / Hepatitis B</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded">DONE</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-700">OPV 1 / DTP 1</span>
                      <span className="px-2 py-0.5 bg-rose-200 text-rose-800 text-[10px] font-bold rounded">NEXT WEEK</span>
                   </div>
                </div>
             </div>

             {/* Genetic Monitoring */}
             <div className="bg-blue-50 rounded-2xl p-4 flex-1">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2 block">Genetic Monitoring</span>
                <p className="text-sm text-slate-600 leading-relaxed">
                   Entered birth data is analyzed for genetic markers. Follow up on infant metabolic screening results.
                </p>
             </div>
          </div>
        </div>

        {/* Milestone Tracker */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold font-display text-slate-900">Upcoming Milestones</h3>
              <button className="text-sky-600 text-sm font-bold hover:underline">View All</button>
           </div>
           <div className="space-y-4">
             {[
               { title: 'Social Smile', date: 'Expected: Week 6-8', achieved: true },
               { title: 'Lifting Head', date: 'Expected: Month 3', achieved: false },
               { title: 'Tracking Objects', date: 'Expected: Month 3', achieved: false },
             ].map((m, i) => (
               <div key={i} className={`flex items-center justify-between p-5 rounded-2xl border ${m.achieved ? 'bg-sky-50 border-sky-100' : 'bg-white border-slate-100'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${m.achieved ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {m.achieved ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 rounded-full bg-slate-300"></div>}
                    </div>
                    <div>
                      <h4 className={`font-bold ${m.achieved ? 'text-slate-900' : 'text-slate-600'}`}>{m.title}</h4>
                      <p className="text-xs text-slate-400">{m.date}</p>
                    </div>
                  </div>
                  {m.achieved && <span className="text-xs font-bold text-sky-600 bg-white px-3 py-1 rounded-full shadow-sm">Achieved!</span>}
               </div>
             ))}
           </div>
        </div>
    </div>
  );
};