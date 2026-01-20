import React, { useState, useEffect, useRef } from 'react';
import { Send, ThumbsUp, ThumbsDown, X, MessageCircle, Settings, Minimize2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:8080';

export default function ChatWidget({ userContext, report }) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId] = useState(() => crypto.randomUUID());
  const [userConsent, setUserConsent] = useState(false);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [justMounted, setJustMounted] = useState(true);
  const messagesEndRef = useRef(null);

  // Entrance animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setJustMounted(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Load user consent preference
  useEffect(() => {
    if (user) {
      loadUserConsent();
    }
  }, [user]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadUserConsent = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`${CHAT_API_URL}/chat/consent`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserConsent(data.consent || false);
      }
    } catch (err) {
      console.error('Failed to load consent:', err);
    }
  };

  const updateUserConsent = async (consent) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`${CHAT_API_URL}/chat/consent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ consent }),
      });

      if (response.ok) {
        setUserConsent(consent);
        setShowConsentDialog(false);
      }
    } catch (err) {
      console.error('Failed to update consent:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    // Add user message to chat
    const newUserMessage = {
      id: Date.now(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    // Handle greetings locally (no backend needed)
    const lowerMessage = userMessage.toLowerCase();
    const greetings = ['hi', 'hello', 'hey', 'namaste', 'namaskar', 'greetings', 'good morning', 'good afternoon', 'good evening'];
    const isGreeting = greetings.some(greeting => lowerMessage === greeting || lowerMessage.startsWith(greeting + ' ') || lowerMessage.startsWith(greeting + ','));

    if (isGreeting) {
      const greetingResponses = [
        `Namaste! 🙏 I'm Ishira, your personal numerology guide. I can help you understand your destiny number, current dasha, remedies, and much more about your cosmic influences. What would you like to know?`,
        `Hello! ✨ I'm Ishira. I'm here to help you explore your numerology insights. Feel free to ask me about your numbers, dashas, or any guidance you seek!`,
        `Greetings! 🌟 I'm Ishira, here to illuminate your numerological path. Ask me anything about your destiny, strengths, or cosmic timing!`
      ];
      const randomGreeting = greetingResponses[Math.floor(Math.random() * greetingResponses.length)];

      const botMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: randomGreeting,
        timestamp: new Date(),
        source: 'deterministic',
      };
      setMessages((prev) => [...prev, botMessage]);
      return; // Don't call backend for greetings
    }

    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${CHAT_API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          message: userMessage,
          userContext: {
            ...userContext,
            report: report,
          },
          conversationId,
          userConsent,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('You are asking too many questions. Please wait a moment.');
        } else if (response.status === 401) {
          throw new Error('Please log in to use the chatbot.');
        } else {
          throw new Error('Failed to get response from chatbot.');
        }
      }

      const data = await response.json();

      // Add bot response to chat
      const botMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.text,
        timestamp: new Date(),
        source: data.source,
        blocked: data.blocked,
        conversationId: data.conversationId || conversationId,
      };
      setMessages((prev) => [...prev, botMessage]);

    } catch (err) {
      console.error('Chat error:', err);

      // Provide helpful fallback based on user's question
      let fallbackMessage = '';
      const lowerMsg = userMessage.toLowerCase();

      if (lowerMsg.includes('destiny') || lowerMsg.includes('number')) {
        fallbackMessage = `I'd love to help you with that! Your Destiny Number is **${userContext?.destinyNumber || report?.destinyNumber || 'calculated in your report'}** and your Basic Number is **${userContext?.basicNumber || report?.basicNumber || 'shown above'}**. These numbers reveal your life purpose and core personality. Check your report tabs above for detailed insights!`;
      } else if (lowerMsg.includes('dasha')) {
        fallbackMessage = `Your current Maha Dasha period is influenced by number **${userContext?.currentDasha || 'shown in the Advanced Dasha tab'}**. Visit the "Advanced Dasha" tab above to see your complete planetary timeline!`;
      } else if (lowerMsg.includes('remedy') || lowerMsg.includes('remedies')) {
        fallbackMessage = `For personalized remedies including rudraksha, mantras, and gemstones, please check the "Remedies & Guidance" tab above. It contains detailed suggestions tailored to your numerology chart!`;
      } else if (lowerMsg.includes('strength') || lowerMsg.includes('weakness') || lowerMsg.includes('trait')) {
        fallbackMessage = `To explore your strengths, weaknesses, and personality traits, visit the "Numerology Traits" tab above. It provides a comprehensive analysis of your characteristics!`;
      } else {
        fallbackMessage = `I'm Ishira, and I'm here to help! While I'm having trouble connecting to my knowledge base right now, you can find answers in the tabs above:\n\n• **Welcome** - Overview of your numbers\n• **Foundational Analysis** - Deep dive into patterns\n• **Advanced Dasha** - Planetary periods\n• **Forecast** - Life predictions\n• **Remedies & Guidance** - Personalized suggestions\n• **Numerology Traits** - Your characteristics\n\nWhat specific aspect would you like to explore?`;
      }

      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: fallbackMessage,
        timestamp: new Date(),
        source: 'fallback',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (messageId, feedback) => {
    const message = messages.find((m) => m.id === messageId);
    if (!message || !message.conversationId) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await fetch(`${CHAT_API_URL}/chat/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          conversationId: message.conversationId,
          feedback,
        }),
      });

      // Update message with feedback
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, userFeedback: feedback } : m
        )
      );
    } catch (err) {
      console.error('Failed to send feedback:', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed top-1/2 right-8 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 rounded-full shadow-[0_0_40px_rgba(147,51,234,0.6)] flex items-center justify-center hover:scale-110 transition-all duration-300 z-[100] group ${
            justMounted ? 'animate-bounce' : ''
          }`}
          aria-label="Open chat"
        >
          <MessageCircle className="w-10 h-10 text-white" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse shadow-lg"></div>
          <div className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-20"></div>

          {/* Pulsing rings for extra visibility */}
          <div className="absolute inset-0 rounded-full border-4 border-purple-400 animate-pulse"></div>
        </button>

        {/* Tooltip/label for first time */}
        {justMounted && (
          <div className="fixed top-1/2 right-32 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-2 rounded-lg shadow-xl z-[99] animate-pulse">
            <div className="text-sm font-semibold">💬 Ask me about your numerology!</div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-l-8 border-l-purple-600 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`fixed top-1/2 right-8 -translate-y-1/2 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-500/30 z-[100] transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/50 to-violet-900/50 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Ishira - Your KarmAnk™ Guide</h3>
            <p className="text-xs text-purple-300">Ask me about your numerology</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConsentDialog(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4 text-purple-300" />
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label={isMinimized ? "Expand" : "Minimize"}
          >
            <Minimize2 className="w-4 h-4 text-purple-300" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close chat"
          >
            <X className="w-4 h-4 text-purple-300" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-[calc(100%-140px)] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-slate-800">
            {messages.length === 0 && (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-2">Namaste! I'm Ishira ✨</h4>
                <p className="text-sm text-purple-300 mb-4">
                  Your personal numerology guide. I can help you understand your numbers, dashas, and cosmic influences.
                </p>
                <div className="text-xs text-left bg-purple-900/30 rounded-lg p-3 space-y-1">
                  <p className="text-purple-200">Try asking:</p>
                  <p className="text-purple-300">• "What does my destiny number mean?"</p>
                  <p className="text-purple-300">• "Tell me about my current dasha"</p>
                  <p className="text-purple-300">• "What are my strengths?"</p>
                  <p className="text-purple-300">• "What remedies should I follow?"</p>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-purple-600 to-violet-600 text-white'
                      : message.isError
                      ? 'bg-red-900/30 border border-red-500/30 text-red-300'
                      : 'bg-slate-800 text-white border border-purple-500/20'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                  {message.role === 'assistant' && !message.isError && (
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-purple-500/20">
                      <span className="text-xs text-purple-300">Was this helpful?</span>
                      <button
                        onClick={() => handleFeedback(message.id, 'thumbs_up')}
                        className={`p-1 rounded transition-colors ${
                          message.userFeedback === 'thumbs_up'
                            ? 'bg-green-600 text-white'
                            : 'hover:bg-white/10 text-purple-300'
                        }`}
                        aria-label="Thumbs up"
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleFeedback(message.id, 'thumbs_down')}
                        className={`p-1 rounded transition-colors ${
                          message.userFeedback === 'thumbs_down'
                            ? 'bg-red-600 text-white'
                            : 'hover:bg-white/10 text-purple-300'
                        }`}
                        aria-label="Thumbs down"
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                      {message.source && (
                        <span className="text-xs text-purple-400 ml-auto">
                          {message.source === 'deterministic' ? '⚡' : '🤖'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-purple-500/20 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-purple-500/30 bg-slate-900/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your numerology..."
                className="flex-1 bg-slate-800 border border-purple-500/30 rounded-xl px-4 py-3 text-sm text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-br from-purple-600 to-violet-600 p-3 rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                aria-label="Send message"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Consent Dialog */}
      {showConsentDialog && (
        <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm rounded-2xl p-6 z-10">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-white">Chat Settings</h4>
              <button
                onClick={() => setShowConsentDialog(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-purple-300" />
              </button>
            </div>

            <div className="flex-1 space-y-4">
              <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                <h5 className="font-medium text-white mb-2">Help Improve Your Experience</h5>
                <p className="text-sm text-purple-200 mb-4">
                  Allow KarmAnk™ to use your anonymized, redacted conversations to improve the chatbot's understanding of numerology questions.
                </p>

                <div className="space-y-2 text-xs text-purple-300 mb-4">
                  <p>✓ Your personal information will be removed</p>
                  <p>✓ Only with your explicit consent</p>
                  <p>✓ Manually reviewed before use</p>
                  <p>✓ Used only to improve responses</p>
                  <p>✓ Never shared with third parties</p>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userConsent}
                    onChange={(e) => updateUserConsent(e.target.checked)}
                    className="w-5 h-5 rounded border-purple-500 bg-slate-800 text-purple-600 focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="text-sm text-white">
                    Use my conversations for improvement
                  </span>
                </label>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
                <h5 className="font-medium text-white mb-2 text-sm">Privacy Notice</h5>
                <p className="text-xs text-purple-300">
                  KarmAnk™ chatbot never shares system internals, technical details, or classified information. It only discusses your personal numerology insights.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowConsentDialog(false)}
              className="w-full bg-gradient-to-br from-purple-600 to-violet-600 py-3 rounded-xl text-white font-medium hover:scale-105 transition-transform mt-4"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
