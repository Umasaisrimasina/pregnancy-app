/**
 * ChatPanel.tsx
 *
 * Shared full-screen chat modal used across Mind, Nutrition, and other pages.
 * Replaces ~80 identical lines that were copy-pasted in 6+ files.
 *
 * Encapsulates: message state, send handler, auto-scroll, loading state.
 * The parent only needs to manage `isOpen` / `onClose`.
 */

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Shield } from 'lucide-react';
import { sendChatMessage, ChatMessage } from '../services/aiService';

export interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  /** Title in the header (e.g. "Midwife AI", "Nutrition Coach"). */
  title: string;
  /** Subtitle below the title. */
  subtitle?: string;
  /** Icon element shown in the header circle. */
  icon: React.ReactNode;
  /** AI service context key (e.g. 'pregnancy', 'nutrition'). */
  chatContext: string;
  /** First AI message shown when the panel opens. */
  initialMessage: string;
  /** Fallback response when the AI call fails. */
  fallbackResponse: string;
  /** Placeholder text for the input field. */
  placeholder?: string;
  /** Privacy text shown below the input. */
  footerText?: string;
  /** Override header background class. */
  headerClassName?: string;
}

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  isOpen,
  onClose,
  title,
  subtitle = 'Secure & Encrypted',
  icon,
  chatContext,
  initialMessage,
  fallbackResponse,
  placeholder = 'Type your thoughts...',
  footerText = 'Conversations are anonymous and not stored permanently.',
  headerClassName = 'bg-dark-950',
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'ai', text: initialMessage },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // ESC key handler for closing modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now(), sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history: ChatMessage[] = messages.map((m) => ({
        role: m.sender === 'ai' ? 'assistant' : 'user',
        content: m.text,
      }));

      const response = await sendChatMessage(input, chatContext, history);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: response.success ? (response.message ?? fallbackResponse) : fallbackResponse,
        },
      ]);
    } catch (error) {
      console.error('Chat message failed:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: fallbackResponse,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 dark:bg-slate-950/30 backdrop-blur-md animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white dark:bg-dm-card w-full max-w-md h-[600px] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`${headerClassName} p-6 flex items-center justify-between text-white shrink-0`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
              {icon}
            </div>
            <div>
              <h3 className="font-bold font-display">{title}</h3>
              <div className="flex items-center gap-1.5 opacity-80">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{subtitle}</span>
              </div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close chat"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 bg-slate-50 dark:bg-dm-muted p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-none shadow-md shadow-dark-950/10'
                    : 'bg-white dark:bg-dm-card text-slate-700 dark:text-dm-foreground border border-slate-100 dark:border-dm-border rounded-tl-none shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white dark:bg-dm-card border-t border-slate-100 dark:border-dm-border shrink-0">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={placeholder}
              className="flex-1 bg-slate-50 dark:bg-dm-muted border border-slate-100 dark:border-dm-border text-slate-900 dark:text-dm-foreground placeholder:text-slate-400 rounded-xl py-3.5 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
              autoFocus
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              className="absolute right-2 p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-3 flex items-center justify-center gap-1.5">
            <Shield size={10} />
            {footerText}
          </p>
        </div>
      </div>
    </div>
  );
};
