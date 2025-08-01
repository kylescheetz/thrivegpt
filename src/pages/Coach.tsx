import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Mic, Minimize2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'coach';
  content: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'coach',
    content: "Hi! I'm your AI wellness coach. How can I help you thrive today?",
    timestamp: new Date(Date.now() - 300000)
  },
  {
    id: '2',
    role: 'user',
    content: "I'm stressed.",
    timestamp: new Date(Date.now() - 240000)
  },
  {
    id: '3',
    role: 'coach',
    content: "Tell me more—what's on your mind?",
    timestamp: new Date(Date.now() - 180000)
  },
  {
    id: '4',
    role: 'user',
    content: "Tough day at work.",
    timestamp: new Date(Date.now() - 120000)
  },
  {
    id: '5',
    role: 'coach',
    content: "I hear you. Let's try a quick reset. Would you like me to guide you through a 3-minute breathing exercise?",
    timestamp: new Date(Date.now() - 60000)
  }
];

const quickActions = [
  'Calm Anxiety',
  'Design Focus Sprint', 
  'Morning Routine',
  'Energy Boost',
  'Sleep Better',
  'Motivation'
];

export default function Coach() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const coachResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'coach',
        content: getAIResponse(userMessage.content),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, coachResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    setInputValue(`Help me with: ${action}`);
    textareaRef.current?.focus();
  };

  const getAIResponse = (userInput: string): string => {
    const responses = [
      "That sounds challenging. Let's work through this together. What would feel most helpful right now?",
      "I understand. Sometimes taking a step back can give us clarity. What's one small thing that might help?",
      "Thank you for sharing that with me. Let's focus on what you can control in this moment.",
      "That makes sense. Would you like to try a quick technique to help you feel more centered?",
      "I hear you. Remember, it's okay to have tough moments. What usually helps you feel better?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header Bar */}
      <div className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
        <div className="flex items-center justify-between p-4 max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold flex items-center gap-2">
              AI Coach 🤖
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="p-2">
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat History */}
      <ScrollArea className="flex-1 p-4 max-w-md mx-auto w-full" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <Card className={cn(
                "max-w-[80%] shadow-sm",
                message.role === 'user' 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-card"
              )}>
                <CardContent className="p-3">
                  <p className="text-sm">{message.content}</p>
                  <p className={cn(
                    "text-xs mt-1 opacity-70",
                    message.role === 'user' ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <Card className="bg-card shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">AI is typing...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Action Chips */}
      <div className="p-4 max-w-md mx-auto w-full">
        <div className="flex flex-wrap gap-2 mb-4">
          {quickActions.map((action) => (
            <Button
              key={action}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(action)}
              className="text-xs h-8 px-3"
            >
              {action}
            </Button>
          ))}
        </div>

        {/* Input Row */}
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message…"
              className="min-h-[44px] max-h-[120px] resize-none pr-12"
              rows={1}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 bottom-1 h-8 w-8 p-0"
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            size="sm"
            className="h-11 w-11 p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}