'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { MOCK_SUBJECTS } from '@/lib/mock-data';
import { Subject } from '@/lib/types';
import {
  Book,
  Globe,
  Landmark,
  TrendingUp,
  Atom,
  Leaf,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, any> = {
  History: Book,
  Geography: Globe,
  Polity: Landmark,
  Economics: TrendingUp,
  'Science & Technology': Atom,
  Environment: Leaf,
};

interface SubjectSelectorProps {
  subjects: Subject[];
  onSelect: (subject: Subject) => void;
  selectedId?: number;
}

export function SubjectSelector({
  subjects,
  onSelect,
  selectedId,
}: SubjectSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {subjects.map((subject, i) => {
        const Icon = iconMap[subject.name] || Book;
        const isSelected = selectedId === subject.id;

        return (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(subject)}
            className="cursor-pointer"
          >
            <Card
              className={cn(
                'glassmorphism group h-full overflow-hidden border-white/5 transition-all duration-300',
                isSelected
                  ? 'border-primary/60 bg-primary/10'
                  : 'hover:border-primary/30'
              )}
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-2xl transition-colors',
                      isSelected
                        ? 'bg-primary text-white'
                        : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  {isSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <CheckCircle2 className="text-primary h-6 w-6" />
                    </motion.div>
                  )}
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">
                  {subject.name}
                </h3>
                <p className="text-sm text-gray-400">{subject.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
