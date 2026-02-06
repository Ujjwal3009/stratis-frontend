'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Send,
  Bot,
  User as UserIcon,
  ChevronLeft,
  Loader2,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function PdfChatPage() {
  const params = useParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hello! I've analyzed this document. Ask me anything about its content for your UPSC preparation.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);

    try {
      setIsLoading(true);
      const res = await api.pdfs.chat(Number(params.id), userMsg);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.answer },
      ]);
    } catch (err) {
      toast.error('Failed to get answer from AI');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="gradient-bg flex min-h-screen flex-col pt-20">
      {/* Header */}
      <div className="bg-background/60 border-b border-white/5 p-4 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="text-gray-400"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="bg-primary/20 text-primary rounded-lg p-2">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-semibold text-white">AI Study Assistant</h1>
                <p className="text-xs text-gray-500">
                  Chatting with Document #{params.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="container mx-auto flex max-w-4xl flex-1 flex-col overflow-hidden p-4">
        <div
          ref={scrollRef}
          className="scrollbar-hide flex-1 space-y-6 overflow-y-auto pb-10"
        >
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex max-w-[80%] items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`rounded-xl p-2 ${msg.role === 'assistant' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-gray-400'}`}
                  >
                    {msg.role === 'assistant' ? (
                      <Bot className="h-5 w-5" />
                    ) : (
                      <UserIcon className="h-5 w-5" />
                    )}
                  </div>
                  <Card
                    className={`border-0 ${msg.role === 'assistant' ? 'glassmorphism bg-white/5' : 'bg-primary shadow-primary/20 text-white shadow-lg'}`}
                  >
                    <CardContent className="prose prose-invert max-w-none p-4">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 text-primary rounded-xl p-2">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="glassmorphism flex items-center gap-2 rounded-2xl bg-white/5 p-4">
                  <div className="bg-primary h-2 w-2 animate-bounce rounded-full" />
                  <div className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:0.2s]" />
                  <div className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:0.4s]" />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div className="pt-4 pb-10">
          <div className="relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a conceptual question about this material..."
              className="glassmorphism focus:ring-primary/50 h-14 rounded-2xl border-white/10 bg-white/5 pr-16 pl-6 text-lg text-white"
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-primary hover:bg-primary/80 absolute top-2 right-2 h-10 w-10 rounded-xl p-0 transition-all"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
