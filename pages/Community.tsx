import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, Send, Heart, Image, Camera, Lock, Shield, X, ArrowLeft, Search, Plus, Smile, MoreHorizontal, AlertTriangle, Loader2 } from 'lucide-react';
import { AppPhase } from '../types';
import { SpeakButton } from '../components/SpeakButton';
import { analyzeSentiment, getSentimentBadge, SentimentLabel } from '../services/sentimentService';
import { useRiskData } from '../contexts/RiskDataContext';

interface CommunityProps {
  phase: AppPhase;
}

interface Post {
  id: number;
  user: { name: string; avatar: string };
  content: string;
  image: string | null;
  likes: number;
  comments: number;
  time: string;
  sentiment?: SentimentLabel;
  needsSupport?: boolean;
}

const getPhaseColor = (phase: AppPhase) => {
  switch (phase) {
    case 'pre-pregnancy': return {
      primary: 'emerald',
      gradient: 'from-primary-500 to-teal-500',
      bg: 'bg-primary-50',
      text: 'text-primary-600',
      border: 'border-primary-200',
      button: 'bg-primary-600 hover:bg-primary-700',
      lightBg: 'bg-primary-100'
    };
    case 'pregnancy': return {
      primary: 'rose',
      gradient: 'from-primary-400 to-pink-500',
      bg: 'bg-primary-50',
      text: 'text-primary-500',
      border: 'border-primary-200',
      button: 'bg-primary-500 hover:bg-primary-600',
      lightBg: 'bg-primary-100'
    };
    case 'post-partum': return {
      primary: 'purple',
      gradient: 'from-purple-500 to-secondary-500',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-200',
      button: 'bg-purple-600 hover:bg-purple-700',
      lightBg: 'bg-purple-100'
    };
    case 'baby-care': return {
      primary: 'sky',
      gradient: 'from-secondary-400 to-blue-500',
      bg: 'bg-secondary-50',
      text: 'text-secondary-500',
      border: 'border-secondary-200',
      button: 'bg-secondary-500 hover:bg-secondary-600',
      lightBg: 'bg-secondary-100'
    };
    default: return {
      primary: 'slate',
      gradient: 'from-slate-500 to-gray-500',
      bg: 'bg-slate-50',
      text: 'text-slate-600',
      border: 'border-dark-700',
      button: 'bg-slate-600 hover:bg-slate-700',
      lightBg: 'bg-slate-100'
    };
  }
};

// Sample data with sentiment
const samplePosts: Post[] = [
  {
    id: 1,
    user: { name: 'Priya M.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
    content: 'Finally got some sleep last night! Baby slept for 4 hours straight Ž‰',
    image: null,
    likes: 24,
    comments: 8,
    time: '2h ago',
    sentiment: 'positive',
    needsSupport: false
  },
  {
    id: 2,
    user: { name: 'Anita R.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
    content: 'Look at this little munchkin! She smiled at me for the first time today and my heart completely melted ¥¹’• Being a mom is the best thing ever!',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400',
    likes: 87,
    comments: 32,
    time: '3h ago',
    sentiment: 'positive',
    needsSupport: false
  },
  {
    id: 3,
    user: { name: 'Kavya T.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
    content: 'Week 6 postpartum check-up went great! Doctor says I\'m healing well. Remember mamas, recovery takes time ’œ',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400',
    likes: 42,
    comments: 15,
    time: '4h ago',
    sentiment: 'positive',
    needsSupport: false
  },
  {
    id: 4,
    user: { name: 'Meera S.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
    content: 'Anyone else dealing with cluster feeding? Need tips! ˜…',
    image: null,
    likes: 18,
    comments: 23,
    time: '6h ago',
    sentiment: 'neutral',
    needsSupport: false
  },
  {
    id: 5,
    user: { name: 'Deepa K.', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100' },
    content: 'Feeling so overwhelmed and exhausted. Baby won\'t stop crying and I haven\'t slept in days. I don\'t know if I can do this anymore...',
    image: null,
    likes: 56,
    comments: 47,
    time: '1h ago',
    sentiment: 'negative',
    needsSupport: true
  }
];

const sampleGroups = [
  { id: 1, name: 'January 2026 Mamas', emoji: '‘¶', members: 342, lastMessage: 'Anyone else up for the 3am feed?', unread: 5 },
  { id: 2, name: 'Postpartum Support Circle', emoji: '’œ', members: 128, lastMessage: 'Today was a hard day...', unread: 0 },
  { id: 3, name: 'Breastfeeding Journey', emoji: 'Œ±', members: 256, lastMessage: 'Finally got the latch right!', unread: 12 },
  { id: 4, name: 'First-Time Moms', emoji: 'ŒŸ', members: 489, lastMessage: 'Is this normal?', unread: 3 },
];

const sampleDMs = [
  { id: 1, name: 'Dr. Ananya', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100', lastMessage: 'Your next check-up is scheduled...', time: '1h', unread: 1, online: true },
  { id: 2, name: 'Kavya T.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100', lastMessage: 'Thanks for the pumping tips!', time: '3h', unread: 0, online: true },
  { id: 3, name: 'Neha P.', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100', lastMessage: 'How is the baby doing?', time: '1d', unread: 0, online: false },
];

export const Community: React.FC<CommunityProps> = ({ phase }) => {
  const { latestAssessment } = useRiskData();
  const [activeTab, setActiveTab] = useState<'moments' | 'groups' | 'dms'>('moments');
  const [selectedGroup, setSelectedGroup] = useState<typeof sampleGroups[0] | null>(null);
  const [selectedDM, setSelectedDM] = useState<typeof sampleDMs[0] | null>(null);
  const [newPostText, setNewPostText] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [posts, setPosts] = useState<Post[]>(samplePosts);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [livePreviewSentiment, setLivePreviewSentiment] = useState<SentimentLabel | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const colors = getPhaseColor(phase);

  // Live sentiment preview with debounce
  useEffect(() => {
    if (!newPostText.trim() || newPostText.length < 10) {
      setLivePreviewSentiment(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsPreviewLoading(true);
      try {
        const result = await analyzeSentiment(newPostText);
        setLivePreviewSentiment(result.sentiment);
      } catch (error) {
        console.error('Preview error:', error);
      } finally {
        setIsPreviewLoading(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [newPostText]);

  // Handle new post creation with sentiment analysis
  const handleCreatePost = async () => {
    if (!newPostText.trim()) return;

    setIsAnalyzing(true);

    try {
      // Analyze sentiment using Azure AI Language
      const sentimentResult = await analyzeSentiment(newPostText);
      const badge = getSentimentBadge(sentimentResult.sentiment);

      const newPost: Post = {
        id: Date.now(),
        user: { name: 'Anika S.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
        content: newPostText,
        image: null,
        likes: 0,
        comments: 0,
        time: 'Just now',
        sentiment: sentimentResult.sentiment,
        needsSupport: sentimentResult.sentiment === 'negative'
      };

      setPosts([newPost, ...posts]);
      setNewPostText('');
      setShowNewPostModal(false);
      setLivePreviewSentiment(null);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    setMessageInput('');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 dark:text-dm-foreground">Community</h1>
          <p className="text-slate-500 mt-1">Connect with other moms in your stage.</p>
        </div>
        <button className="bg-white dark:bg-dm-card border border-slate-200 dark:border-dm-border p-2.5 rounded-full text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors">
          <Search size={20} />
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-dm-card p-1 rounded-2xl border border-slate-100 dark:border-dm-border flex gap-1">
        {[
          { id: 'moments', label: 'Moments', icon: Image },
          { id: 'groups', label: 'Groups', icon: Users },
          { id: 'dms', label: 'Messages', icon: MessageCircle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
              ? `${colors.bg} ${colors.text} shadow-sm`
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dm-muted'
              }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Main Feed / Content */}
        <div className="lg:col-span-8 space-y-6">

          {/* Create Post Input */}
          <div className="bg-white dark:bg-dm-card rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-dm-border" onClick={() => setShowNewPostModal(true)}>
            <div className="flex gap-4">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" alt="User" className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 dark:border-dm-border" />
              <div className="flex-1">
                <div className="bg-slate-50 dark:bg-dm-muted rounded-2xl p-4 text-slate-400 dark:text-slate-500 text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-dm-accent transition-colors">
                  Share your journey, ask a question, or post a photo...
                </div>
                <div className="flex items-center gap-4 mt-4 px-2">
                  <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
                    <Image size={16} className={colors.text} />
                    Photo
                  </button>
                  <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
                    <Camera size={16} className={colors.text} />
                    Video
                  </button>
                  <div className="flex-1"></div>
                  <button className={`${colors.button} text-white px-6 py-2 rounded-xl text-xs font-bold shadow-md shadow-slate-200 dark:shadow-none`}>
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Feed */}
          {activeTab === 'moments' && (
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white dark:bg-dm-card rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-dm-border animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-dm-foreground text-sm">{post.user.name}</h3>
                        <p className="text-xs text-slate-400">{post.time}</p>
                      </div>
                    </div>

                    {/* Sentiment Badge */}
                    {post.sentiment && (
                      <div className={`px-2 py-1 rounded-full flex items-center gap-1 ${getSentimentBadge(post.sentiment).className}`}>
                        {getSentimentBadge(post.sentiment).icon}
                        <span className="text-[10px] font-bold uppercase tracking-wider">{getSentimentBadge(post.sentiment).label}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4">
                    {post.content}
                  </p>

                  {post.image && (
                    <div className="rounded-2xl overflow-hidden mb-4 border border-slate-100 dark:border-dm-border">
                      <img src={post.image} alt="Post content" className="w-full h-64 object-cover" />
                    </div>
                  )}

                  {/* Negativity/Support Alert */}
                  {post.needsSupport && (
                    <div className="mb-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-xl p-3 flex items-start gap-3">
                      <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-amber-800 dark:text-amber-200 mb-0.5">Support Needed</p>
                        <p className="text-xs text-amber-700 dark:text-amber-300">
                          This mom might be going through a tough time. Send some love and encouragement! ’œ
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-dark-800">
                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-2 text-slate-400 hover:text-primary-400 transition-colors group">
                        <Heart size={20} className="group-hover:fill-primary-400 transition-all" />
                        <span className="text-xs font-bold">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-colors">
                        <MessageCircle size={20} />
                        <span className="text-xs font-bold">{post.comments}</span>
                      </button>
                      <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        <Send size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Groups List */}
          {activeTab === 'groups' && (
            <div className="space-y-4">
              {sampleGroups.map((group) => (
                <div key={group.id} className="bg-white dark:bg-dm-card rounded-2xl p-5 border border-slate-100 dark:border-dm-border flex items-center justify-between hover:border-slate-300 dark:hover:border-dark-600 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl ${colors.lightBg} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                      {group.emoji}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-dm-foreground mb-1 group-hover:text-primary-600 transition-colors">{group.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{group.members} members</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-[200px]">{group.lastMessage}</p>
                    </div>
                  </div>
                  {group.unread > 0 && (
                    <div className={`${colors.bg} ${colors.text} text-xs font-bold px-3 py-1 rounded-full`}>
                      {group.unread} new
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* DMs List */}
          {activeTab === 'dms' && (
            <div className="space-y-4">
              {sampleDMs.map((dm) => (
                <div key={dm.id} className="bg-white dark:bg-dm-card rounded-2xl p-5 border border-slate-100 dark:border-dm-border flex items-center justify-between hover:border-slate-300 dark:hover:border-dark-600 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src={dm.avatar} alt={dm.name} className="w-14 h-14 rounded-full object-cover" />
                      {dm.online && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-dark-900 rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-dm-foreground mb-1">{dm.name}</h3>
                      <p className={`text-xs ${dm.unread > 0 ? 'text-slate-800 dark:text-slate-200 font-bold' : 'text-slate-400 dark:text-slate-500'} truncate max-w-[200px]`}>
                        {dm.lastMessage}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-slate-400">{dm.time}</span>
                    {dm.unread > 0 && (
                      <div className="w-2.5 h-2.5 bg-primary-400 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">

          {/* Risk Alert Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>

            <div className="flex items-start gap-4 mb-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <Shield size={24} className="text-primary-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight mb-1">Safe Space</h3>
                <p className="text-slate-400 text-xs">Moderated & Secure</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-6 relative z-10">
              This community is monitored for safety. Bullying, medical misinformation, and hate speech are not tolerated.
            </p>

            <button className="w-full bg-white/10 hover:bg-white/20 transition-colors rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2">
              <Lock size={16} />
              Start Chat
            </button>
          </div>

          {/* Expert Card */}
          <div className="bg-white dark:bg-dm-card rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-dm-border">
            <h3 className="font-bold text-slate-900 dark:text-dm-foreground mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Experts Online
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100" alt="Doctor" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-dm-foreground">Dr. Ananya Reddy</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">OB/GYN • 12 yr exp</p>
                </div>
                <button className={`ml-auto ${colors.lightBg} ${colors.text} px-3 py-1.5 rounded-lg text-xs font-bold`}>
                  Chat
                </button>
              </div>

              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100" alt="Expert" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-dm-foreground">Lakshmi Iyer</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Lactation Consultant</p>
                </div>
                <button className="ml-auto bg-slate-50 dark:bg-dm-muted text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-lg text-xs font-bold">
                  Offline
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-dm-card w-full max-w-lg rounded-[2rem] shadow-2xl p-6 animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-dm-border">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-dm-foreground">Create Post</h3>
              <button
                onClick={() => setShowNewPostModal(false)}
                className="w-10 h-10 rounded-full bg-slate-50 dark:bg-dm-muted flex items-center justify-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex gap-3 mb-4">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" alt="User" className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 dark:border-dm-border" />
              <div>
                <p className="font-bold text-slate-900 dark:text-dm-foreground">Anika S.</p>
                <div className={`text-xs ${colors.text} bg-slate-50 dark:bg-dm-muted px-2 py-0.5 rounded-md inline-block mt-0.5`}>
                  {phase.replace('-', ' ')}
                </div>
              </div>
            </div>

            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="What's on your mind? Share your journey..."
              className="w-full h-40 resize-none bg-slate-50 dark:bg-dm-muted border-0 rounded-2xl p-4 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-slate-200 dark:focus:ring-dark-600 mb-4"
              autoFocus
            ></textarea>

            {/* Live Sentiment Preview */}
            {(isPreviewLoading || livePreviewSentiment) && newPostText.length >= 10 && (
              <div className="mb-4 flex items-center gap-2 bg-slate-50 dark:bg-dm-muted p-3 rounded-xl border border-slate-100 dark:border-dm-border">
                {isPreviewLoading ? (
                  <>
                    <Loader2 size={16} className={`animate-spin ${colors.text}`} />
                    <span className="text-xs text-slate-500 dark:text-slate-400">Analyzing tone...</span>
                  </>
                ) : livePreviewSentiment && (
                  <>
                    <span className="text-xs text-slate-500 dark:text-slate-400 text-right w-24">Detected tone:</span>
                    <div className={`px-2 py-1 rounded-full flex items-center gap-1.5 ${getSentimentBadge(livePreviewSentiment).className}`}>
                      {getSentimentBadge(livePreviewSentiment).icon}
                      <span className="text-[10px] font-bold uppercase tracking-wider">{getSentimentBadge(livePreviewSentiment).label}</span>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-dm-border">
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-dm-muted rounded-xl transition-all">
                  <Image size={20} />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-dm-muted rounded-xl transition-all">
                  <Smile size={20} />
                </button>
              </div>

              <button
                onClick={handleCreatePost}
                disabled={!newPostText.trim() || isAnalyzing}
                className={`${colors.button} text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Post
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};






