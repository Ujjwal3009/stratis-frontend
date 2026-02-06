'use client';

import { Question } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Flag, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface QuestionCardProps {
  question: Question;
  selectedOptionIndex?: number;
  onSelect: (index: number) => void;
  questionNumber: number;
  onHover?: () => void;
}

export function QuestionCard({
  question,
  selectedOptionIndex,
  onSelect,
  questionNumber,
  onHover,
}: QuestionCardProps) {
  const [isReporting, setIsReporting] = useState(false);
  const [reportText, setReportText] = useState('');
  const [isReportOpen, setIsReportOpen] = useState(false);

  const handleReport = async () => {
    if (!reportText.trim()) return;
    try {
      setIsReporting(true);
      await api.feedback.reportQuestion(question.id, reportText);
      toast.success('Issue reported successfully. Thank you!');
      setIsReportOpen(false);
      setReportText('');
    } catch (err) {
      toast.error('Failed to report issue.');
    } finally {
      setIsReporting(false);
    }
  };
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <Card className="glassmorphism bg-background/40 border-primary/10 overflow-hidden">
          <CardContent className="p-8">
            <div className="mb-6 flex items-center justify-between">
              <Badge
                variant="outline"
                className="border-primary/30 text-primary px-3 py-1 capitalize"
              >
                {question.subject} • {question.difficultyLevel.toLowerCase()}
              </Badge>
              <span className="font-mono text-sm text-gray-500">
                Question {questionNumber}
              </span>
            </div>

            <div className="mb-8 flex items-start justify-between">
              <h2 className="text-2xl leading-relaxed font-semibold text-white">
                {question.questionText}
              </h2>
              <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 hover:text-red-400"
                  >
                    <Flag className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="glassmorphism border-white/10 bg-gray-900 text-white">
                  <DialogHeader>
                    <DialogTitle>Report an Issue</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Found a typo or a wrong answer? Let us know.
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    placeholder="Describe the issue..."
                    value={reportText}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setReportText(e.target.value)
                    }
                    className="min-h-[100px] border-white/10 bg-white/5 text-white"
                  />
                  <DialogFooter>
                    <Button
                      onClick={handleReport}
                      disabled={isReporting || !reportText.trim()}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      {isReporting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Submit Report'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <RadioGroup
              value={selectedOptionIndex?.toString()}
              onValueChange={(val) => onSelect(parseInt(val))}
              className="space-y-4"
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center">
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                    className="sr-only"
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    onMouseEnter={() => onHover?.()}
                    className={cn(
                      'group flex w-full cursor-pointer items-center rounded-2xl border-2 p-5 transition-all',
                      selectedOptionIndex === index
                        ? 'border-primary bg-primary/10 shadow-primary/10 text-white shadow-lg'
                        : 'border-white/5 bg-white/5 text-gray-400 hover:border-white/20 hover:bg-white/10'
                    )}
                  >
                    <div
                      className={cn(
                        'mr-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-bold transition-colors',
                        selectedOptionIndex === index
                          ? 'border-primary bg-primary text-white'
                          : 'border-white/20 text-gray-500 group-hover:border-white/40'
                      )}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-lg leading-snug">{option.text}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
