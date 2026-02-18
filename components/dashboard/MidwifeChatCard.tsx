/**
 * MidwifeChatCard.tsx
 *
 * Plum-themed inline Midwife AI chat embedded in PregnancyDashboard.
 * Self-contained — uses useMidwifeChat hook and PLUM_THEME from config.
 */

import React from 'react';
import { Lock, Send, Loader2 } from 'lucide-react';
import { useMidwifeChat } from '../../hooks/useMidwifeChat';
import { PLUM_THEME } from '../../config/pregnancyClinic.config';
import { SpeakButton } from '../SpeakButton';

export const MidwifeChatCard: React.FC = () => {
  const {
    input: midwifeChatInput,
    setInput: setMidwifeChatInput,
    messages: midwifeChatMessages,
    isLoading: isMidwifeChatLoading,
    chatRef: midwifeChatRef,
    send: handleMidwifeChatSend,
  } = useMidwifeChat();

  return (
    <div
      style={{ backgroundColor: PLUM_THEME.background }}
      className="rounded-[2rem] p-6 h-full flex flex-col relative overflow-hidden shadow-xl shadow-dark-950/10 min-h-[450px]"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full blur-[80px] opacity-10 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
            <Lock size={16} className={PLUM_THEME.accentClass} />
          </div>
          <div className="flex-1">
            <h3 className={`font-bold ${PLUM_THEME.textClass} text-sm`}>Midwife AI</h3>
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${PLUM_THEME.bgAccentClass} animate-pulse`} />
              <span className={`text-[10px] font-bold ${PLUM_THEME.textMutedClass} uppercase tracking-wide`}>
                Private &amp; Secure
              </span>
            </div>
          </div>
          <SpeakButton
            text="Midwife AI. Your private and secure pregnancy assistant. Ask questions about your pregnancy journey."
            className={`${PLUM_THEME.textClass} border-white/30 bg-white/10 hover:bg-white/20`}
            size={12}
          />
        </div>

        {/* Messages */}
        <div ref={midwifeChatRef} className="flex-1 space-y-4 mb-4 overflow-y-auto custom-scrollbar pr-1">
          {midwifeChatMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'gap-3'}`}>
              <div
                className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[85%] shadow-sm ${
                  msg.sender === 'user'
                    ? `${PLUM_THEME.bgButtonClass} ${PLUM_THEME.textClass} rounded-tr-none`
                    : 'bg-white/10 text-slate-100 rounded-tl-none border border-white/5'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isMidwifeChatLoading && (
            <div className="flex gap-3">
              <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none text-xs text-secondary-100 border border-white/5 flex items-center gap-2 shadow-sm">
                <Loader2 size={14} className={`animate-spin ${PLUM_THEME.accentClass}`} />
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="relative mt-auto">
          <input
            type="text"
            value={midwifeChatInput}
            onChange={(e) => setMidwifeChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && midwifeChatInput.trim() && !isMidwifeChatLoading) {
                handleMidwifeChatSend();
              }
            }}
            placeholder="Message..."
            className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm ${PLUM_THEME.textClass} focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all placeholder:text-white/40`}
          />
          <button
            onClick={handleMidwifeChatSend}
            disabled={!midwifeChatInput.trim() || isMidwifeChatLoading}
            className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 ${PLUM_THEME.bgButtonClass} ${PLUM_THEME.textClass} rounded-lg flex items-center justify-center hover:bg-pink-400 transition-colors shadow-lg shadow-pink-900/20 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
