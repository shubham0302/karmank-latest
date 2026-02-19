import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, Bot, User, Sparkles } from 'lucide-react';
import { BirthData } from '@/astrology/lib/api/astrology-api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Array<{ title: string; content: string }>;
  confidence?: number;
}

interface RishiChatInterfaceProps {
  birthData: BirthData | null;
  onClose?: () => void;
}

const API_BASE_URL = import.meta.env.VITE_ASTROLOGY_API_URL || 'http://localhost:8000';

export default function RishiChatInterface({ birthData, onClose }: RishiChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Namaste! I am Rishi, your AI astrologer. I have analyzed your birth chart and I\'m here to answer any questions about your life path, personality, career, relationships, or any other aspect of your journey. What would you like to explore today?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [streamingMessage, setStreamingMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  // Generate session ID on mount
  useEffect(() => {
    setSessionId(`session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || !birthData) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const questionText = input; // Store before clearing
    setInput('');
    setIsLoading(true);
    setStreamingMessage('');

    try {
      // Prepare request payload
      const requestPayload = {
        question: questionText,
        chart_context: {
          birth_datetime: birthData.birth_datetime,
          latitude: birthData.latitude,
          longitude: birthData.longitude,
          timezone: birthData.timezone,
          ayanamsa: 'LAHIRI',
          location_name: birthData.location_name || 'Unknown'
        },
        focus_area: null
      };

      // Call the quick-question endpoint (non-streaming for simplicity)
      const response = await fetch(`${API_BASE_URL}/api/ai-astrologer/quick-question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();

      // Simulate streaming effect by showing words one by one
      const fullResponse = data.answer || 'I apologize, I could not generate a response at this time.';
      const words = fullResponse.split(' ');

      for (let i = 0; i < words.length; i++) {
        setStreamingMessage(words.slice(0, i + 1).join(' '));
        await new Promise(resolve => setTimeout(resolve, 30)); // 30ms delay per word
      }

      // Create final assistant message
      const assistantMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: fullResponse,
        timestamp: new Date(),
        sources: data.sources || [],
        confidence: data.confidence || 0.8
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
      setStreamingMessage('');

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: 'I apologize, but I encountered an error while processing your question. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
      setStreamingMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!birthData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Rishi AI Astrologer
          </CardTitle>
          <CardDescription>
            Please enter your birth data first to start chatting with Rishi
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <div>
              <CardTitle>Rishi AI Astrologer</CardTitle>
              <CardDescription>
                Personalized insights from your birth chart
              </CardDescription>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-purple-500" />
                  </div>
                )}

                <div className={`flex flex-col gap-2 max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-purple-500 text-white'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {message.sources && message.sources.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {message.sources.slice(0, 3).map((source, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {source.title}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {message.confidence && (
                    <span className="text-xs text-muted-foreground">
                      Confidence: {(message.confidence * 100).toFixed(0)}%
                    </span>
                  )}
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-blue-500" />
                  </div>
                )}
              </div>
            ))}

            {/* Streaming message */}
            {isLoading && streamingMessage && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-purple-500" />
                </div>
                <div className="rounded-lg px-4 py-2 bg-muted max-w-[80%]">
                  <p className="text-sm whitespace-pre-wrap">{streamingMessage}</p>
                </div>
              </div>
            )}

            {/* Loading indicator */}
            {isLoading && !streamingMessage && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-purple-500 animate-pulse" />
                </div>
                <div className="rounded-lg px-4 py-2 bg-muted">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Rishi is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your chart, career, relationships, life path..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Ask Rishi about any aspect of your birth chart. Press Enter to send.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
