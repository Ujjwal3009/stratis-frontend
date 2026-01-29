'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface TestTimerProps {
  durationMinutes: number;
  onTimeUp: () => void;
}

export function TestTimer({ durationMinutes, onTimeUp }: TestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const percentage = (timeLeft / (durationMinutes * 60)) * 100;

  const isLow = timeLeft < 300; // Less than 5 minutes

  return (
    <div className="glassmorphism bg-background/60 w-48 shrink-0 rounded-2xl border-white/5 p-4">
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          <Clock
            className={cn(
              'h-4 w-4',
              isLow ? 'animate-pulse text-red-400' : 'text-primary'
            )}
          />
          <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">
            Time Left
          </span>
        </div>
        <span
          className={cn(
            'font-mono text-lg font-bold',
            isLow ? 'text-red-400' : 'text-white'
          )}
        >
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>
      <Progress value={percentage} className="h-1.5 bg-white/5" />
    </div>
  );
}
