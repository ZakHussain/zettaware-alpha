import React, { useRef, useEffect, useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useAppStore } from '../../store/app.store';
import { useCrewChat } from '../../hooks/useCrewChat';
import { ChatMessage } from './ChatMessage';
import { CREWS } from '../../config/crews.config';
import clsx from 'clsx';

export function ChatInterface() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const { messages, isTyping, selectedCrew } = useAppStore();
  const { sendMessage, isLoading } = useCrewChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');
    sendMessage({ message });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-theme-chat-bg">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-theme-primary" />
            </div>
            <h2 className="text-xl font-semibold text-theme-text mb-2">
              Start a conversation
            </h2>
            <p className="text-theme-text-secondary max-w-md mx-auto">
              Ask the {CREWS[selectedCrew].name} anything about code generation, hardware analysis, 
              or system development. Your conversation will appear here.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-theme-text-secondary">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">AI is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-theme-border p-4 bg-theme-surface">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask the ${CREWS[selectedCrew].name} anything...`}
            className="flex-1 min-h-[44px] max-h-32 p-3 border border-theme-border rounded-lg focus:ring-2 ring-theme-primary focus:border-theme-primary resize-none bg-theme-surface text-theme-text"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={clsx('px-4 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2', {
              'bg-theme-primary text-theme-text hover:bg-theme-primary-hover': input.trim() && !isLoading,
              'bg-theme-surface-hover text-theme-text-secondary cursor-not-allowed': !input.trim() || isLoading,
            })}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}