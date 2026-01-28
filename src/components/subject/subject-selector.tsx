'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { MOCK_SUBJECTS } from '@/lib/mock-data';
import { Subject } from '@/lib/types';
import { Book, Globe, Landmark, TrendingUp, Atom, Leaf, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, any> = {
    'History': Book,
    'Geography': Globe,
    'Polity': Landmark,
    'Economics': TrendingUp,
    'Science & Technology': Atom,
    'Environment': Leaf,
};

interface SubjectSelectorProps {
    onSelect: (subject: Subject) => void;
    selectedId?: number;
}

export function SubjectSelector({ onSelect, selectedId }: SubjectSelectorProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_SUBJECTS.map((subject, i) => {
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
                        <Card className={cn(
                            "glassmorphism h-full transition-all duration-300 overflow-hidden group border-white/5",
                            isSelected ? "border-primary/60 bg-primary/10" : "hover:border-primary/30"
                        )}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                                        isSelected ? "bg-primary text-white" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                                    )}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    {isSelected && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                        >
                                            <CheckCircle2 className="w-6 h-6 text-primary" />
                                        </motion.div>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{subject.name}</h3>
                                <p className="text-gray-400 text-sm">{subject.description}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
}
