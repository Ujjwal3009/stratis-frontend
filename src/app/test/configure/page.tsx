'use client';

import { useTestStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { TestConfigForm } from '@/components/test/test-config-form';
import { useEffect } from 'react';

export default function TestConfigurePage() {
    const { selectedSubject } = useTestStore();
    const router = useRouter();

    useEffect(() => {
        if (!selectedSubject) {
            router.push('/subjects');
        }
    }, [selectedSubject, router]);

    if (!selectedSubject) return null;

    return (
        <div className="min-h-screen gradient-bg pt-24 pb-20 px-4">
            <div className="container mx-auto max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-4 mb-8"
                >
                    <Button
                        variant="ghost"
                        className="text-gray-400 hover:text-white p-0"
                        onClick={() => router.push('/subjects')}
                    >
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        Back to Subjects
                    </Button>
                </motion.div>

                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-white mb-3">Configure Test</h1>
                    <p className="text-gray-400 text-lg">
                        Generating questions for <span className="text-primary font-bold">{selectedSubject.name}</span>
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <TestConfigForm subjectId={selectedSubject.id} />
                </motion.div>
            </div>
        </div>
    );
}
