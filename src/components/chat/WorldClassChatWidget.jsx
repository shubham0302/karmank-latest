/**
 * WorldClassChatWidget - Advanced LLM-Powered AI Assistant
 * Features:
 * - Smart tab navigation
 * - Voice input/output
 * - Real-time typing indicators
 * - Context-aware suggestions
 * - Persistent conversations
 * - Intelligent intent detection
 * - Comprehensive data reading (all user numerology data)
 * - Layman language responses
 * - Accessibility (ARIA labels, keyboard nav)
 * - Performance optimized
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Send, ThumbsUp, ThumbsDown, X, MessageCircle, Minimize2,
  Sparkles, Zap, Mic, MicOff, Volume2, VolumeX,
  Trash2, Copy, Check, ArrowRight, Lightbulb
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { TABS, TAB_INFO } from '../../constants/tabs';
import {
  analyzeIntent,
  extractEntities,
  generateSmartSuggestions,
  getTabFromIntent,
  generateContextualResponse,
  validateUserMessage,
  calculateConversationQuality
} from '../../utils/chatbotUtils';
import { buildLLMPrompt, formatPromptForAPI } from '../../utils/llmPromptBuilder';
import { formatResponse, formatByMessageType, toSpeechFormat, formatErrorMessage } from '../../utils/responseFormatter';

const CHAT_API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
const STORAGE_KEY = 'ishira_chat_history';
const MAX_CONVERSATION_LENGTH = 100; // Prevent memory issues

export default function WorldClassChatWidget({
  userContext,
  report,
  dashaReport,
  language = 'en',
  currentTab,
  onNavigate // ✅ Navigation callback from parent
}) {
  const { user } = useAuth();

  // UI State
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [justMounted, setJustMounted] = useState(true);

  // Conversation State
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId] = useState(() => crypto.randomUUID());
  const [hasGreeted, setHasGreeted] = useState(false);

  // Smart Features State
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [copiedMessageId, setCopiedMessageId] = useState(null);

  // Voice Features
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  // Refs
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setJustMounted(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Load conversation history
  useEffect(() => {
    if (user && isOpen) {
      loadConversationHistory();
    }
  }, [user, isOpen]);

  // Save conversation history
  useEffect(() => {
    if (messages.length > 0) {
      saveConversationHistory();
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Send greeting
  useEffect(() => {
    if (isOpen && !hasGreeted && messages.length === 0) {
      sendGreeting();
    }
  }, [isOpen, hasGreeted, messages.length]);

  // Generate smart suggestions
  useEffect(() => {
    if (isOpen && !isLoading) {
      const newSuggestions = generateSmartSuggestions(userContext, report, currentTab);
      setSuggestions(newSuggestions);
    }
  }, [isOpen, currentTab, messages.length, userContext, report]);

  // Initialize voice recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, [language]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  // ============================================================================
  // CONVERSATION MANAGEMENT
  // ============================================================================

  const loadConversationHistory = useCallback(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${user.id}`);
      if (stored) {
        const history = JSON.parse(stored);
        // Only load messages from last 7 days
        const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        const recentMessages = history
          .filter(msg => new Date(msg.timestamp).getTime() > weekAgo)
          .slice(-MAX_CONVERSATION_LENGTH); // Limit history

        if (recentMessages.length > 0) {
          setMessages(recentMessages);
          setHasGreeted(true);
        }
      }
    } catch (err) {
      console.error('Failed to load conversation history:', err);
    }
  }, [user]);

  const saveConversationHistory = useCallback(() => {
    try {
      if (user) {
        localStorage.setItem(`${STORAGE_KEY}_${user.id}`, JSON.stringify(messages));
      }
    } catch (err) {
      console.error('Failed to save conversation history:', err);
    }
  }, [user, messages]);

  const clearConversation = useCallback(() => {
    if (confirm('Are you sure you want to clear this conversation?')) {
      setMessages([]);
      setHasGreeted(false);
      if (user) {
        localStorage.removeItem(`${STORAGE_KEY}_${user.id}`);
      }
    }
  }, [user]);

  // ============================================================================
  // MESSAGE HANDLING
  // ============================================================================

  const sendGreeting = useCallback(() => {
    const userName = userContext?.name || 'there';
    const destinyNum = userContext?.destinyNumber;
    const basicNum = userContext?.basicNumber;

    const greetings = {
      en: `🙏 Namaste ${userName}!\n\nI'm Ishira, your personal AI numerology guide. I can help you understand your cosmic blueprint, navigate life's phases, and discover personalized remedies.\n\n${destinyNum ? `Your Destiny Number is **${destinyNum}** and Basic Number is **${basicNum}**.` : ''}\n\n✨ I can navigate to different sections of your report, answer questions, and provide personalized guidance.\n\nHow may I assist you today?`,
      hi: `🙏 नमस्ते ${userName}!\n\nमैं इशिरा हूं, आपकी व्यक्तिगत AI अंकज्योतिष मार्गदर्शक। मैं आपकी कॉस्मिक ब्लूप्रिंट को समझने, जीवन के चरणों को नेविगेट करने और व्यक्तिगत उपचार खोजने में मदद कर सकती हूं।\n\n${destinyNum ? `आपकी नियति संख्या **${destinyNum}** है और मूल संख्या **${basicNum}** है।` : ''}\n\nमैं आपकी कैसे सहायता कर सकती हूं?`,
      'en-hi': `🙏 Namaste ${userName}!\n\nMain Ishira hoon, aapki personal AI numerology guide. Main aapko cosmic blueprint samajhne, life phases navigate karne aur personalized remedies discover karne mein madad kar sakti hoon.\n\n${destinyNum ? `Aapka Destiny Number **${destinyNum}** hai aur Basic Number **${basicNum}** hai.` : ''}\n\nMain aapki kaise help kar sakti hoon?`
    };

    const greeting = greetings[language] || greetings.en;

    const greetingMsg = {
      role: 'assistant',
      content: greeting,
      timestamp: new Date().toISOString(),
      id: crypto.randomUUID()
    };

    setMessages([greetingMsg]);
    setHasGreeted(true);

    // Speak greeting if voice enabled
    if (voiceEnabled) {
      speakMessage(greeting);
    }
  }, [userContext, language, voiceEnabled]);

  const addMessage = useCallback((message) => {
    setMessages(prev => {
      const updated = [...prev, {
        ...message,
        timestamp: message.timestamp || new Date().toISOString(),
        id: message.id || crypto.randomUUID()
      }];
      // Limit conversation length
      return updated.slice(-MAX_CONVERSATION_LENGTH);
    });
  }, []);

  const handleSendMessage = useCallback(async (messageText) => {
    const text = messageText || inputValue.trim();

    // Validate message
    const validation = validateUserMessage(text);
    if (!validation.valid) {
      // Show error to user
      addMessage({
        role: 'assistant',
        content: `⚠️ ${validation.error}`,
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Add user message
    const userMessage = {
      role: 'user',
      content: validation.message,
      timestamp: new Date().toISOString()
    };
    addMessage(userMessage);
    setInputValue('');
    setShowSuggestions(false);

    // Analyze intent
    const intent = analyzeIntent(validation.message);
    const entities = extractEntities(validation.message);

    // Check for navigation intent
    if (intent.primary === 'navigation' || entities.tabs.length > 0) {
      const targetTab = getTabFromIntent(intent, entities);
      if (targetTab && onNavigate) {
        // Navigate to tab
        onNavigate(targetTab);

        // Confirm navigation
        addMessage({
          role: 'assistant',
          content: `✅ I've opened the **${targetTab}** tab for you! ${TAB_INFO[targetTab]?.icon || ''}\n\n${TAB_INFO[targetTab]?.description || ''}`,
          timestamp: new Date().toISOString()
        });
        return;
      }
    }

    // Check for contextual response
    const contextualResponse = generateContextualResponse(userContext, validation.message);
    if (contextualResponse) {
      setIsTyping(true);
      // Simulate thinking time
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsTyping(false);

      addMessage({
        role: 'assistant',
        content: contextualResponse,
        timestamp: new Date().toISOString()
      });

      if (voiceEnabled) {
        speakMessage(contextualResponse);
      }
      return;
    }

    // Send to backend API
    await sendToBackendAPI(validation.message, userMessage);
  }, [inputValue, userContext, onNavigate, voiceEnabled]);

  const sendToBackendAPI = useCallback(async (messageText, userMessage) => {
    setIsLoading(true);
    setIsTyping(true);

    try {
      console.log('🔍 [DEBUG] Starting chat API call...');
      console.log('🔍 [DEBUG] userContext:', userContext);
      console.log('🔍 [DEBUG] report exists:', !!report);
      console.log('🔍 [DEBUG] dashaReport exists:', !!dashaReport);

      // ✅ BUILD COMPREHENSIVE LLM PROMPT
      console.log('🔍 [DEBUG] Building LLM prompt...');
      const llmPrompt = buildLLMPrompt({
        userMessage: messageText,
        userContext,
        report,
        dashaReport,
        language,
        currentTab,
        conversationHistory: messages
      });
      console.log('🔍 [DEBUG] LLM prompt built successfully');

      // ✅ FORMAT FOR API
      console.log('🔍 [DEBUG] Formatting prompt for API...');
      const promptPayload = formatPromptForAPI(llmPrompt);
      console.log('🔍 [DEBUG] Prompt payload formatted:', promptPayload);

      // ✅ SEND TO BACKEND WITH FULL CONTEXT
      console.log('🔍 [DEBUG] Sending to:', `${CHAT_API_URL}/api/chat`);
      const requestBody = {
        message: messageText,
        conversationId,
        // ✅ Send comprehensive prompt with all user data
        prompt: promptPayload,
        // Backward compatibility - keep simple context as fallback
        userContext: {
          destinyNumber: userContext?.destinyNumber,
          basicNumber: userContext?.basicNumber,
          currentDasha: dashaReport?.mahaDashaTimeline?.[0]?.planet,
          gender: userContext?.gender,
          name: userContext?.name,
        },
        language
      };
      console.log('🔍 [DEBUG] Request body:', requestBody);

      const response = await fetch(`${CHAT_API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('🔍 [DEBUG] Response status:', response.status);
      console.log('🔍 [DEBUG] Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [DEBUG] Response error:', errorText);
        throw new Error(`Failed to get response from AI: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('🔍 [DEBUG] Response data:', data);

      setIsTyping(false);
      setIsLoading(false);

      // ✅ FORMAT RESPONSE IN LAYMAN LANGUAGE
      let aiResponse = data.response || data.message || 'I apologize, I could not generate a response.';

      // Determine message type for formatting
      const intent = analyzeIntent(messageText);
      const messageType = intent.primary === 'remedies' ? 'remedy' :
                          intent.primary === 'navigation' ? 'navigation' : 'question';

      // Apply formatting
      aiResponse = formatByMessageType(aiResponse, messageType, language);

      // Add assistant response
      const assistantMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      addMessage(assistantMessage);

      // ✅ Speak response if voice enabled (use speech-friendly format)
      if (voiceEnabled) {
        const speechText = toSpeechFormat(aiResponse);
        speakMessage(speechText);
      }

    } catch (error) {
      console.error('Chat API error:', error);
      setIsTyping(false);
      setIsLoading(false);

      // ✅ Use friendly error formatting
      const friendlyError = formatErrorMessage(error);
      addMessage({
        role: 'assistant',
        content: friendlyError,
        timestamp: new Date().toISOString()
      });
    }
  }, [conversationId, userContext, report, dashaReport, language, currentTab, messages, voiceEnabled]);

  const handleSuggestionClick = useCallback((suggestion) => {
    if (suggestion.action.type === 'navigate' && onNavigate) {
      onNavigate(suggestion.action.target);
      addMessage({
        role: 'assistant',
        content: `✅ Navigated to ${suggestion.action.target} ${suggestion.icon}`,
        timestamp: new Date().toISOString()
      });
    } else if (suggestion.action.type === 'question') {
      handleSendMessage(suggestion.action.query);
    } else {
      handleSendMessage(suggestion.text);
    }
  }, [onNavigate, handleSendMessage]);

  // ============================================================================
  // VOICE FEATURES
  // ============================================================================

  const toggleVoiceInput = useCallback(() => {
    if (!recognitionRef.current) {
      alert('Voice recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Voice recognition error:', error);
        setIsListening(false);
      }
    }
  }, [isListening]);

  const speakMessage = useCallback((text) => {
    if (!synthesisRef.current || !voiceEnabled) return;

    // Cancel any ongoing speech
    synthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthesisRef.current.speak(utterance);
  }, [language, voiceEnabled]);

  const toggleVoiceOutput = useCallback(() => {
    if (voiceEnabled) {
      synthesisRef.current?.cancel();
      setIsSpeaking(false);
    }
    setVoiceEnabled(!voiceEnabled);
  }, [voiceEnabled]);

  // ============================================================================
  // UTILITY FEATURES
  // ============================================================================

  const copyMessage = useCallback((message) => {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopiedMessageId(message.id);
      setTimeout(() => setCopiedMessageId(null), 2000);
    });
  }, []);

  // ============================================================================
  // UI HELPERS
  // ============================================================================

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // Calculate conversation quality for UI feedback
  const conversationQuality = useMemo(() => {
    if (messages.length < 2) return null;
    return calculateConversationQuality(messages);
  }, [messages]);

  // ============================================================================
  // RENDER
  // ============================================================================

  if (justMounted) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110 animate-bounce"
          aria-label="Open Ishira AI Chat"
        >
          <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-white animate-pulse" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white animate-ping" />
        </button>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110"
          aria-label="Open Ishira AI Chat"
        >
          <MessageCircle className="absolute inset-0 m-auto w-6 h-6 text-white" />
          {messages.length > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-white text-xs font-bold">{Math.min(messages.length, 9)}</span>
            </div>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`
        bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl
        rounded-2xl shadow-2xl border border-purple-500/30
        transition-all duration-300
        ${isMinimized ? 'h-16 w-80' : 'h-[600px] w-96'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
              {isSpeaking && (
                <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping" />
              )}
            </div>
            <div>
              <h3 className="text-white font-semibold">Ishira AI</h3>
              <p className="text-xs text-purple-300">
                {isTyping ? 'Typing...' : isListening ? 'Listening...' : 'Online'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Voice Toggle */}
            {synthesisRef.current && (
              <button
                onClick={toggleVoiceOutput}
                className="p-2 hover:bg-purple-500/20 rounded-lg transition"
                aria-label={voiceEnabled ? "Disable voice" : "Enable voice"}
                title={voiceEnabled ? "Disable voice" : "Enable voice"}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
              </button>
            )}

            {/* Clear */}
            {messages.length > 0 && (
              <button
                onClick={clearConversation}
                className="p-2 hover:bg-red-500/20 rounded-lg transition"
                aria-label="Clear conversation"
                title="Clear conversation"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            )}

            {/* Minimize */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-purple-500/20 rounded-lg transition"
              aria-label={isMinimized ? "Expand" : "Minimize"}
            >
              <Minimize2 className="w-4 h-4 text-purple-400" />
            </button>

            {/* Close */}
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-purple-500/20 rounded-lg transition"
              aria-label="Close chat"
            >
              <X className="w-4 h-4 text-purple-400" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="h-[calc(100%-140px)] overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`
                      max-w-[80%] rounded-2xl px-4 py-2
                      ${message.role === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-gray-800/50 text-gray-100 border border-purple-500/20'
                      }
                    `}
                  >
                    <div className="prose prose-invert prose-sm max-w-none">
                      {message.content.split('\n').map((line, i) => (
                        <p key={i} className="mb-1 last:mb-0 whitespace-pre-wrap">{line}</p>
                      ))}
                    </div>

                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-purple-500/10">
                        <button
                          onClick={() => copyMessage(message)}
                          className="p-1 hover:bg-purple-500/20 rounded transition"
                          title="Copy message"
                        >
                          {copiedMessageId === message.id ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-gray-400" />
                          )}
                        </button>
                        {voiceEnabled && (
                          <button
                            onClick={() => speakMessage(message.content)}
                            className="p-1 hover:bg-purple-500/20 rounded transition"
                            title="Speak message"
                          >
                            <Volume2 className="w-3 h-3 text-gray-400" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-800/50 border border-purple-500/20 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Smart Suggestions */}
            {showSuggestions && suggestions.length > 0 && !isLoading && (
              <div className="px-4 pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-gray-400">Quick suggestions:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="group flex items-center gap-1 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-300 transition"
                    >
                      <span>{suggestion.icon}</span>
                      <span>{suggestion.text}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-purple-500/20">
              <div className="flex items-center gap-2">
                {/* Voice Input */}
                {recognitionRef.current && (
                  <button
                    onClick={toggleVoiceInput}
                    className={`p-2 rounded-lg transition ${
                      isListening
                        ? 'bg-red-500/20 text-red-400'
                        : 'hover:bg-purple-500/20 text-purple-400'
                    }`}
                    aria-label={isListening ? "Stop listening" : "Start voice input"}
                  >
                    {isListening ? <MicOff className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
                  </button>
                )}

                {/* Text Input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-gray-800/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition"
                  disabled={isLoading}
                  aria-label="Message input"
                />

                {/* Send Button */}
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Sparkles className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Send className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>

              {/* Conversation Quality Indicator */}
              {conversationQuality && conversationQuality.conversationDepth > 0.3 && (
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                  <Zap className="w-3 h-3 text-yellow-400" />
                  <span>Great conversation! {conversationQuality.totalMessages} messages exchanged</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
