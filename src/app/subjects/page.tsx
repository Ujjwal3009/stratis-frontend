'use client';

import { useTestStore } from '@/lib/store';
import { SubjectSelector } from '@/components/subject/subject-selector';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SubjectsPage() {
    const { selectedSubject, setSelectedSubject } = useTestStore();
    const router = useRouter();

    return (
        <div className="min-h-screen gradient-bg pt-24 pb-20 px-4">
            <div className="container mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-4 mb-8"
                >
                    <Button
                        variant="ghost"
                        className="text-gray-400 hover:text-white p-0"
                        onClick={() => router.push('/dashboard')}
                    >
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        Back to Dashboard
                    </Button>
                </motion.div>

                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Select a Subject</h1>
                    <p className="text-gray-400 text-lg">Choose a subject to generate a customized practice test.</p>
                </div>

                <SubjectSelector
                    selectedId={selectedSubject?.id}
                    onSelect={(subject) => setSelectedSubject(subject)}
                />

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: selectedSubject ? 1 : 0 }}
                    className="mt-12 flex justify-end"
                >
                    {selectedSubject && (
                        <Button
                            size="lg"
                            className="hero-gradient px-10 rounded-xl h-14 text-lg font-bold shadow-lg shadow-primary/20"
                            onClick={() => router.push('/test/configure')}
                        >
                            Continue with {selectedSubject.name}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
