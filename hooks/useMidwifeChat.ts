/**
 * useMidwifeChat.ts
 *
 * Custom hook for the Midwife AI chat in the Pregnancy dashboard.
 * Encapsulates message state, loading state, scroll behaviour,
 * and the send handler (delegates to aiService).
 */

import { useState, useRef, useEffect } from 'react';
import { sendChatMessage, ChatMessage } from '../services/aiService';

export interface MidwifeChatMessage {
  id: number;
  sender: 'user' | 'ai';
  text: string;
}

export const useMidwifeChat = (currentWeek: number = 24) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<MidwifeChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Initialize messages with dynamic week value - run only once on mount
  useEffect(() => {
    setMessages((prev) => {
        // Only add greeting if empty
        if (prev.length === 0) {
            return [{
              id: 1,
              sender: 'ai',
              text: `I noticed you're in Week ${currentWeek}. This is often when baby's movements become more distinct. Have you felt any strong kicks today?`,
            }];
        }
        return prev;
    });
  }, []); // Run only on mount, don't reset on week change

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || isLoading) return;

    const newUserMsg: MidwifeChatMessage = { id: Date.now(), sender: 'user', text: input };
    setMessages((prev) => [...prev, newUserMsg]);
    setInput('');
    setIsLoading(true);

    const conversationHistory: ChatMessage[] = messages.map((msg) => ({
      role: msg.sender === 'ai' ? 'assistant' : 'user',
      content: msg.text,
    }));

    try {
      const response = await sendChatMessage(input, 'pregnancy', conversationHistory);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: response.success
            ? (response.message ?? `That's a great question! Your baby is developing well at ${currentWeek} weeks. Is there anything specific about your pregnancy journey I can help with?`)
            : `That's a great question! Your baby is developing well at ${currentWeek} weeks. Is there anything specific about your pregnancy journey I can help with?`,
        },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: `That's a great question! Your baby is developing well at ${currentWeek} weeks. Is there anything specific about your pregnancy journey I can help with?`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return { input, setInput, messages, isLoading, chatRef, send };
};
