'use client';

import { Question } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

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

            <h2 className="mb-10 text-2xl leading-relaxed font-semibold text-white">
              {question.questionText}
            </h2>

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
