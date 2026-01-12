import React, { useState } from 'react';
import { Users, MessageCircle, Send, Heart, Image, Camera, Lock, Shield, X, ArrowLeft, Search, Plus, Smile, MoreHorizontal } from 'lucide-react';
import { AppPhase } from '../types';
import { SpeakButton } from '../components/SpeakButton';

interface CommunityProps {
  phase: AppPhase;
}

const getPhaseColor = (phase: AppPhase) => {
  switch (phase) {
    case 'pre-pregnancy': return { 
      primary: 'emerald', 
      gradient: 'from-emerald-500 to-teal-500',
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-200',
      button: 'bg-emerald-600 hover:bg-emerald-700',
      lightBg: 'bg-emerald-100'
    };
    case 'pregnancy': return { 
      primary: 'rose', 
      gradient: 'from-rose-500 to-pink-500',
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-200',
      button: 'bg-rose-600 hover:bg-rose-700',
      lightBg: 'bg-rose-100'
    };
    case 'post-partum': return { 
      primary: 'purple', 
      gradient: 'from-purple-500 to-indigo-500',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-200',
      button: 'bg-purple-600 hover:bg-purple-700',
      lightBg: 'bg-purple-100'
    };
    case 'baby-care': return { 
      primary: 'sky', 
      gradient: 'from-sky-500 to-blue-500',
      bg: 'bg-sky-50',
      text: 'text-sky-600',
      border: 'border-sky-200',
      button: 'bg-sky-600 hover:bg-sky-700',
      lightBg: 'bg-sky-100'
    };
    default: return { 
      primary: 'slate', 
      gradient: 'from-slate-500 to-gray-500',
      bg: 'bg-slate-50',
      text: 'text-slate-600',
      border: 'border-slate-200',
      button: 'bg-slate-600 hover:bg-slate-700',
      lightBg: 'bg-slate-100'
    };
  }
};

// Sample data
const samplePosts = [
  {
    id: 1,
    user: { name: 'Priya M.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
    content: 'Finally got some sleep last night! Baby slept for 4 hours straight 🎉',
    image: null,
    likes: 24,
    comments: 8,
    time: '2h ago'
  },
  {
    id: 2,
    user: { name: 'Anita R.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
    content: 'Look at this little munchkin! She smiled at me for the first time today and my heart completely melted 🥹💕 Being a mom is the best thing ever!',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400',
    likes: 87,
    comments: 32,
    time: '3h ago'
  },
  {
    id: 3,
    user: { name: 'Kavya T.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
    content: 'Week 6 postpartum check-up went great! Doctor says I\'m healing well. Remember mamas, recovery takes time 💜',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400',
    likes: 42,
    comments: 15,
    time: '4h ago'
  },
  {
    id: 4,
    user: { name: 'Meera S.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
    content: 'Anyone else dealing with cluster feeding? Need tips! 😅',
    image: null,
    likes: 18,
    comments: 23,
    time: '6h ago'
  }
];

const sampleGroups = [
  { id: 1, name: 'January 2026 Mamas', emoji: '👶', members: 342, lastMessage: 'Anyone else up for the 3am feed?', unread: 5 },
  { id: 2, name: 'Postpartum Support Circle', emoji: '💜', members: 128, lastMessage: 'Today was a hard day...', unread: 0 },
  { id: 3, name: 'Breastfeeding Journey', emoji: '🤱', members: 256, lastMessage: 'Finally got the latch right!', unread: 12 },
  { id: 4, name: 'First-Time Moms', emoji: '🌟', members: 489, lastMessage: 'Is this normal?', unread: 3 },
];

const sampleDMs = [
  { id: 1, name: 'Dr. Sarah', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100', lastMessage: 'Your next check-up is scheduled...', time: '1h', unread: 1, online: true },
  { id: 2, name: 'Kavya T.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100', lastMessage: 'Thanks for the pumping tips!', time: '3h', unread: 0, online: true },
  { id: 3, name: 'Neha P.', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100', lastMessage: 'How is the baby doing?', time: '1d', unread: 0, online: false },
];

export const Community: React.FC<CommunityProps> = ({ phase }) => {
  const [activeTab, setActiveTab] = useState<'moments' | 'groups' | 'dms'>('moments');
  const [selectedGroup, setSelectedGroup] = useState<typeof sampleGroups[0] | null>(null);
  const [selectedDM, setSelectedDM] = useState<typeof sampleDMs[0] | null>(null);
  const [newPostText, setNewPostText] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  
  const colors = getPhaseColor(phase);

  const tabs = [
    { id: 'moments' as const, label: 'Share Moments', icon: Camera },
    { id: 'groups' as const, label: 'Group Chats', icon: Users },
    { id: 'dms' as const, label: 'Direct Messages', icon: MessageCircle },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-display font-extrabold text-slate-900">Mom Community</h1>
            <SpeakButton text="Mom Community: Connect, share, and support each other. All conversations are encrypted and secure." size="sm" />
          </div>
          <p className="text-slate-500 mt-1">Connect, share, and support each other.</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${colors.bg} ${colors.text} text-xs font-bold`}>
          <Shield size={14} />
          All conversations are encrypted & secure
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSelectedGroup(null); setSelectedDM(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
              activeTab === tab.id
                ? `bg-gradient-to-r ${colors.gradient} text-white shadow-lg`
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Share Moments Tab */}
      {activeTab === 'moments' && (
        <div className="space-y-6">
          {/* New Post Input */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
            <div className="flex gap-4">
              <img 
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" 
                alt="You" 
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Share what's on your mind, mama..."
                  className="w-full bg-slate-50 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  onClick={() => setShowNewPostModal(true)}
                />
                <div className="flex justify-between items-center mt-3">
                  <button className={`flex items-center gap-2 ${colors.text} text-sm font-medium hover:opacity-80`}>
                    <Image size={18} />
                    Add Photo
                  </button>
                  <button className={`${colors.button} text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg transition-colors`}>
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Feed */}
          <div className="space-y-4">
            {samplePosts.map((post) => (
              <div key={post.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{post.user.name}</span>
                      <span className="text-xs text-slate-400 block">{post.time}</span>
                    </div>
                  </div>
                  <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
                
                <p className="text-slate-700 text-sm leading-relaxed mb-4">{post.content}</p>
                
                {post.image && (
                  <img src={post.image} alt="Post" className="w-full rounded-2xl mb-4 object-cover max-h-80" />
                )}
                
                <div className="flex items-center gap-6 pt-4 border-t border-slate-50">
                  <button className="flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-colors">
                    <Heart size={18} />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors">
                    <MessageCircle size={18} />
                    <span className="text-sm font-medium">{post.comments}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Group Chats Tab */}
      {activeTab === 'groups' && !selectedGroup && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search groups..."
              className="w-full bg-white border border-slate-100 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* Groups List */}
          <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100">
            {sampleGroups.map((group, i) => (
              <div
                key={group.id}
                onClick={() => setSelectedGroup(group)}
                className={`flex items-center gap-4 p-5 cursor-pointer hover:bg-slate-50 transition-colors ${
                  i !== sampleGroups.length - 1 ? 'border-b border-slate-50' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl">
                  {group.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{group.name}</span>
                    {group.unread > 0 && (
                      <span className={`${colors.button} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                        {group.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{group.members} members</p>
                  <p className="text-xs text-slate-500 truncate mt-1">{group.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>

          <button className={`w-full py-4 ${colors.bg} ${colors.text} rounded-2xl font-bold text-sm hover:opacity-80 transition-opacity`}>
            Browse More Groups
          </button>
        </div>
      )}

      {/* Group Chat View */}
      {activeTab === 'groups' && selectedGroup && (
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden h-[600px] flex flex-col">
          {/* Chat Header */}
          <div className={`bg-gradient-to-r ${colors.gradient} p-4 flex items-center gap-4 text-white`}>
            <button onClick={() => setSelectedGroup(null)} className="p-2 hover:bg-white/10 rounded-lg">
              <ArrowLeft size={20} />
            </button>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
              {selectedGroup.emoji}
            </div>
            <div className="flex-1">
              <h3 className="font-bold">{selectedGroup.name}</h3>
              <div className="flex items-center gap-2 text-xs opacity-80">
                <Lock size={10} />
                <span>Secure & Encrypted</span>
                <span>•</span>
                <span>{selectedGroup.members} members</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
            <div className="flex gap-3">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" className="w-8 h-8 rounded-full object-cover" alt="" />
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[80%]">
                <span className="text-xs font-bold text-slate-900 block mb-1">Priya M.</span>
                <p className="text-sm text-slate-600">Anyone else up for the 3am feed? 😅</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <div className={`bg-gradient-to-r ${colors.gradient} p-3 rounded-2xl rounded-tr-none shadow-sm max-w-[80%] text-white`}>
                <p className="text-sm">Right here! Little one decided 2:30am was party time 🎉</p>
              </div>
            </div>
            <div className="flex gap-3">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" className="w-8 h-8 rounded-full object-cover" alt="" />
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[80%]">
                <span className="text-xs font-bold text-slate-900 block mb-1">Meera S.</span>
                <p className="text-sm text-slate-600">Solidarity, mamas! 💜 We got this!</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <div className={`bg-gradient-to-r ${colors.gradient} p-3 rounded-2xl rounded-tr-none shadow-sm max-w-[80%] text-white`}>
                <p className="text-sm mb-2">Look at this little angel! She's being so good today, finally napping peacefully 🥹💕</p>
                <img 
                  src="https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400" 
                  alt="Sleeping baby" 
                  className="w-full rounded-xl object-cover max-h-48"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100" className="w-8 h-8 rounded-full object-cover" alt="" />
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[80%]">
                <span className="text-xs font-bold text-slate-900 block mb-1">Kavya T.</span>
                <p className="text-sm text-slate-600">Omg so adorable!! 😍 Those cheeks! 🥰</p>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600">
                <Smile size={20} />
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-slate-50 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <button className={`p-3 ${colors.button} text-white rounded-xl transition-colors`}>
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Direct Messages Tab */}
      {activeTab === 'dms' && !selectedDM && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-white border border-slate-100 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* DM List */}
          <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100">
            {sampleDMs.map((dm, i) => (
              <div
                key={dm.id}
                onClick={() => setSelectedDM(dm)}
                className={`flex items-center gap-4 p-5 cursor-pointer hover:bg-slate-50 transition-colors ${
                  i !== sampleDMs.length - 1 ? 'border-b border-slate-50' : ''
                }`}
              >
                <div className="relative">
                  <img src={dm.avatar} alt={dm.name} className="w-12 h-12 rounded-full object-cover" />
                  {dm.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{dm.name}</span>
                    <span className="text-xs text-slate-400">{dm.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-1">{dm.lastMessage}</p>
                </div>
                {dm.unread > 0 && (
                  <span className={`${colors.button} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                    {dm.unread}
                  </span>
                )}
              </div>
            ))}
          </div>

          <button className={`w-full py-4 ${colors.bg} ${colors.text} rounded-2xl font-bold text-sm hover:opacity-80 transition-opacity flex items-center justify-center gap-2`}>
            <Plus size={18} />
            Start New Conversation
          </button>
        </div>
      )}

      {/* DM Chat View */}
      {activeTab === 'dms' && selectedDM && (
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden h-[600px] flex flex-col">
          {/* Chat Header */}
          <div className="p-4 flex items-center gap-4 border-b border-slate-100">
            <button onClick={() => setSelectedDM(null)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
              <ArrowLeft size={20} />
            </button>
            <div className="relative">
              <img src={selectedDM.avatar} alt={selectedDM.name} className="w-10 h-10 rounded-full object-cover" />
              {selectedDM.online && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">{selectedDM.name}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Lock size={10} />
                <span>Private</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
            <div className="flex gap-3">
              <img src={selectedDM.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[80%]">
                <p className="text-sm text-slate-600">Hi! How are you feeling today?</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <div className={`bg-gradient-to-r ${colors.gradient} p-3 rounded-2xl rounded-tr-none shadow-sm max-w-[80%] text-white`}>
                <p className="text-sm">Much better, thank you! The tips you shared really helped.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <img src={selectedDM.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[80%]">
                <p className="text-sm text-slate-600">That's wonderful to hear! Remember, I'm here if you need anything. 💜</p>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600">
                <Smile size={20} />
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-slate-50 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <button className={`p-3 ${colors.button} text-white rounded-xl transition-colors`}>
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Create Post</h3>
              <button 
                onClick={() => setShowNewPostModal(false)}
                className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex gap-4 mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" 
                  alt="You" 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-bold text-slate-900 text-sm mt-2">Sarah Jenkins</span>
              </div>
              <textarea
                placeholder="What would you like to share with the community?"
                className="w-full h-32 bg-slate-50 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 resize-none"
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
              ></textarea>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
                <button className={`flex items-center gap-2 ${colors.text} text-sm font-medium hover:opacity-80`}>
                  <Image size={18} />
                  Add Photo
                </button>
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setShowNewPostModal(false)}
                className={`${colors.button} text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg transition-colors`}
              >
                Share with Community
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
