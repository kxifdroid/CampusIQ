'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send, Sparkles } from 'lucide-react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  servers?: Array<{ label: string; emoji: string }>;
}

const SUGGESTED_PROMPTS = [
  "What's for dinner today?",
  "Is 'Clean Code' available in the library?",
  "Any tech workshops this week?",
  "When is the next holiday?",
  "How many seats are free in the library?",
  "What are my upcoming deadlines?",
];

interface ChatPanelProps {
  prefilterTool?: string;
  compact?: boolean;
}

export default function ChatPanel({ prefilterTool, compact }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (text?: string) => {
    const messageText = (text || input).trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const allMessages = [...messages, userMessage].map(m => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!response.ok) throw new Error('Chat API error');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      let assistantText = '';
      let usedServers: Array<{ label: string; emoji: string }> = [];
      const assistantId = (Date.now() + 1).toString();

      // Add empty assistant message
      setMessages(prev => [...prev, {
        id: assistantId,
        role: 'assistant',
        content: '',
        servers: [],
      }]);

      setIsLoading(false);

      if (!reader) throw new Error('No reader');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '));

        for (const line of lines) {
          try {
            const data = JSON.parse(line.slice(6));

            if (data.type === 'servers') {
              usedServers = data.servers;
              setMessages(prev => prev.map(m =>
                m.id === assistantId ? { ...m, servers: usedServers } : m
              ));
            } else if (data.type === 'text') {
              assistantText += data.content;
              setMessages(prev => prev.map(m =>
                m.id === assistantId ? { ...m, content: assistantText } : m
              ));
            } else if (data.type === 'error') {
              setMessages(prev => prev.map(m =>
                m.id === assistantId
                  ? { ...m, content: `⚠️ Error: ${data.message}` }
                  : m
              ));
            }
          } catch {
            // Skip malformed lines
          }
        }
      }
    } catch (err) {
      setIsLoading(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: '⚠️ Sorry, I could not connect to the AI service. Please check that your API key is configured.',
        servers: [],
      }]);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`bg-white dark:bg-[#16161E] border border-[#E4E2F0] dark:border-white/[0.08] rounded-xl flex flex-col shadow-none ${compact ? 'h-[500px]' : 'h-[520px]'}`}>
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-[#E4E2F0] dark:border-white/[0.08]">
        <div className="w-7 h-7 rounded-lg bg-[#7C6FF7] flex items-center justify-center">
          <Sparkles size={13} className="text-white" />
        </div>
        <h3 className="font-semibold text-sm text-[#1A1A2E] dark:text-white">Campus AI Assistant</h3>
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-[#E8E6FF] dark:bg-[#8B5CF6]/15 text-[#7C6FF7] dark:text-[#8B5CF6] border border-[#E4E2F0] dark:border-white/[0.08]">
          Gemini Powered
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 chat-scroll">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-6 pb-4">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#E8E6FF] dark:bg-[#8B5CF6]/15 border border-[#E4E2F0] dark:border-white/[0.08] flex items-center justify-center mx-auto mb-3">
                <Sparkles size={20} className="text-[#7C6FF7]" />
              </div>
              <p className="text-center text-sm text-[#6B6B8A]">Ask me anything about campus</p>
              <p className="text-center text-xs text-[#6B6B8A]/70 mt-1">Library · Cafeteria · Events · Academics</p>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
              {SUGGESTED_PROMPTS.slice(0, compact ? 4 : 6).map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt)}
                  className="text-left text-xs px-3 py-2.5 rounded-xl bg-white dark:bg-[#16161E] border border-[#E4E2F0] dark:border-white/[0.08] text-[#6B6B8A] dark:text-white/60 hover:text-[#7C6FF7] hover:bg-[#F0EEFF] dark:hover:bg-[#8B5CF6]/15 hover:border-[#7C6FF7]/30 transition-all duration-200 line-clamp-2"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            role={msg.role}
            content={msg.content}
            servers={msg.servers}
          />
        ))}

        {isLoading && (
          <div className="flex items-start gap-2">
            <TypingIndicator />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-[#E4E2F0] dark:border-white/[0.08]">
        <div className="flex items-end gap-2 items-center">
          <TextBoxComponent
            multiline={true}
            value={input}
            change={e => setInput(e.value || '')}
            placeholder="Ask about library, food, events, academics..."
            cssClass="e-outline flex-1 text-sm text-[#1A1A2E] dark:text-white"
            htmlAttributes={{ rows: "1" }}
          />
          <ButtonComponent
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            cssClass="e-primary w-8 h-8 rounded-lg bg-[#7C6FF7] flex items-center justify-center flex-shrink-0 hover:bg-[#6A5EE0] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Send size={14} className="text-white inline-block" />
          </ButtonComponent>
        </div>
        <p className="text-[10px] text-[#6B6B8A]/60 text-center mt-1.5">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}
