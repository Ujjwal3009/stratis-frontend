'use client';

import { useTestStore } from '@/lib/store';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Send, Flag, LayoutDashboard } from 'lucide-react';
import { QuestionCard } from '@/components/test/question-card';
import { TestTimer } from '@/components/test/test-timer';
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

export default function TestPage() {
    const { currentTest, answers, setAnswer } = useTestStore();
    const router = useRouter();
    const params = useParams();
    const [currentIdx, setCurrentIdx] = useState(0);

    useEffect(() => {
        if (!currentTest) {
            router.push('/subjects');
        }
    }, [currentTest, router]);

    if (!currentTest) return null;

    const currentQuestion = currentTest.questions[currentIdx];
    const totalQuestions = currentTest.questions.length;
    const answeredCount = Object.keys(answers).length;

    const handleNext = () => {
        if (currentIdx < totalQuestions - 1) {
            setCurrentIdx(currentIdx + 1);
        }
    };

    const handlePrev = () => {
        if (currentIdx > 0) {
            setCurrentIdx(currentIdx - 1);
        }
    };

    const handleSubmit = () => {
        toast.success('Test submitted successfully!');
        if (params?.testId) {
            router.push(`/test/${params.testId}/result`);
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <div className="min-h-screen gradient-bg pt-24 pb-20 px-4">
            {/* Test Header */}
            <div className="fixed top-0 left-0 right-0 z-40 bg-background/60 backdrop-blur-xl border-b border-white/5 h-20">
                <div className="container mx-auto h-full px-4 flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <h1 className="text-xl font-bold text-white hidden md:block">{currentTest.title}</h1>
                        <div className="h-8 w-[1px] bg-white/10 hidden md:block" />
                        <div className="flex space-x-2">
                            {currentTest.questions.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIdx(i)}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${currentIdx === i
                                        ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20'
                                        : answers[currentTest.questions[i].id] !== undefined
                                            ? 'bg-primary/20 text-primary border border-primary/30'
                                            : 'bg-white/5 text-gray-500 hover:bg-white/10'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                    <TestTimer durationMinutes={currentTest.durationMinutes} onTimeUp={handleSubmit} />
                </div>
            </div>

            <div className="container mx-auto max-w-4xl mt-10">
                <QuestionCard
                    question={currentQuestion}
                    selectedOptionIndex={answers[currentQuestion.id]}
                    onSelect={(idx) => setAnswer(currentQuestion.id, idx)}
                    questionNumber={currentIdx + 1}
                />

                <div className="flex items-center justify-between mt-10">
                    <div className="flex space-x-4">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handlePrev}
                            disabled={currentIdx === 0}
                            className="bg-background/40 border-white/10 text-white rounded-xl h-12"
                        >
                            <ChevronLeft className="w-5 h-5 mr-2" />
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handleNext}
                            disabled={currentIdx === totalQuestions - 1}
                            className="bg-background/40 border-white/10 text-white rounded-xl h-12"
                        >
                            Next
                            <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="lg" className="hero-gradient rounded-xl h-12 px-8 font-bold">
                                <Send className="w-4 h-4 mr-2" />
                                Submit Test
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="glassmorphism bg-gray-900 border-white/10 text-white">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">Finish Attempt?</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                    You have answered {answeredCount} out of {totalQuestions} questions.
                                    Are you sure you want to submit?
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="mt-6">
                                <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5">
                                    Continue Testing
                                </Button>
                                <Button onClick={handleSubmit} className="hero-gradient rounded-xl px-8 font-bold">
                                    Yes, Submit
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
