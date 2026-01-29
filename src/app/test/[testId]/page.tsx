'use client';

import { useTestStore } from '@/lib/store';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Send, Flag, LayoutDashboard, Loader2 } from 'lucide-react';
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
    const { currentTest, answers, setAnswer, attemptId, setAttemptId } = useTestStore();
    const router = useRouter();
    const params = useParams();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
    const [isStarting, setIsStarting] = useState(true);
    const [startError, setStartError] = useState<string | null>(null);
    const initializationRef = useRef(false);

    useEffect(() => {
        if (!currentTest) {
            router.push('/subjects');
            return;
        }

        const initTest = async () => {
            if (initializationRef.current || attemptId) {
                setIsStarting(false);
                return;
            }

            initializationRef.current = true;
            try {
                console.log('Starting new test attempt...');
                const id = await api.tests.start(currentTest.id);
                console.log('Test attempt started:', id);
                setAttemptId(id);
                setIsStarting(false);
            } catch (err: any) {
                initializationRef.current = false; // Allow retry
                console.error('Failed to start test attempt', err);
                const errorMessage = err.message || 'Failed to initialize test session. Please check your connection.';
                setStartError(errorMessage);
                setIsStarting(false);
                toast.error(errorMessage);
            }
        };

        if (!attemptId) {
            initTest();
        } else {
            setIsStarting(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTest, router, setAttemptId]);

    const [timeSpent, setTimeSpent] = useState<Record<number, number>>({});
    const [telemetry, setTelemetry] = useState<Record<number, { changes: number; hovers: number }>>({});

    const handleHover = (qId: number) => {
        setTelemetry(prev => ({
            ...prev,
            [qId]: {
                ...prev[qId],
                hovers: (prev[qId]?.hovers || 0) + 1,
                changes: prev[qId]?.changes || 0
            }
        }));
    };

    const handleAnswerSelect = (qId: number, idx: number) => {
        setAnswer(qId, idx);
        setTelemetry(prev => ({
            ...prev,
            [qId]: {
                ...prev[qId],
                changes: (prev[qId]?.changes || 0) + 1,
                hovers: prev[qId]?.hovers || 0
            }
        }));
    };

    useEffect(() => {
        if (isStarting || isSubmitting || !currentTest) return;

        const interval = setInterval(() => {
            const qId = currentTest.questions[currentIdx]?.id;
            if (qId) {
                setTimeSpent(prev => ({
                    ...prev,
                    [qId]: (prev[qId] || 0) + 1
                }));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [currentIdx, isStarting, isSubmitting, currentTest]);

    if (!currentTest) return null;

    if (isStarting) {
        return (
            <div className="min-h-screen gradient-bg flex items-center justify-center">
                <div className="text-center text-white">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" />
                    <h2 className="text-xl font-bold">Starting Test...</h2>
                    <p className="text-gray-400 mt-2">Initializing session</p>
                </div>
            </div>
        );
    }

    if (startError) {
        return (
            <div className="min-h-screen gradient-bg flex items-center justify-center">
                <div className="text-center text-white max-w-md px-4">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8">
                        <Flag className="w-10 h-10 text-red-400 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-red-400 mb-2">Error Starting Test</h2>
                        <p className="text-gray-300 mb-6">{startError}</p>
                        <div className="flex justify-center gap-4">
                            <Button onClick={() => router.push('/dashboard')} variant="ghost" className="hover:bg-white/5">
                                Cancel
                            </Button>
                            <Button onClick={() => window.location.reload()} className="bg-red-500 hover:bg-red-600 text-white">
                                Try Again
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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

    const handleSubmit = async () => {
        console.log('Submit triggered. Attempt ID:', attemptId);

        if (!attemptId) {
            toast.error('No active test attempt found');
            return;
        }

        if (isSubmitting) return;

        try {
            setIsSubmitting(true);
            toast.loading('Submitting test...');

            const submissionAnswers = currentTest.questions.map(q => {
                const selectedIdx = answers[q.id];
                const selectedOptionId = selectedIdx !== undefined ? q.options[selectedIdx].id : null;
                return {
                    questionId: q.id,
                    selectedOptionId,
                    timeSpentSeconds: timeSpent[q.id] || 0,
                    selectionChangeCount: telemetry[q.id]?.changes || 0,
                    hoverCount: telemetry[q.id]?.hovers || 0
                };
            });

            await api.tests.submit({
                attemptId: attemptId,
                answers: submissionAnswers
            });

            toast.dismiss();
            toast.success('Test submitted successfully!');

            // Clear attempt ID as usage is done
            setAttemptId(null);
            setIsSubmitDialogOpen(false);

            if (params?.testId) {
                router.push(`/test/${params.testId}/result?attemptId=${attemptId}`);
            } else {
                router.push('/dashboard');
            }
        } catch (error: any) {
            toast.dismiss();
            console.error('Failed to submit test', error);

            // Handle session expiry/restart case
            if (error.message?.includes('Attempt not found') || error.message?.includes('Test not found')) {
                toast.error('Test session no longer valid (server restarted). Redirecting...');
                setAttemptId(null); // Clear invalid ID
                setTimeout(() => router.push('/dashboard'), 2000);
                return;
            }

            toast.error('Failed to submit test. Please try again.');
            setIsSubmitting(false);
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
                    onSelect={(idx) => handleAnswerSelect(currentQuestion.id, idx)}
                    onHover={() => handleHover(currentQuestion.id)}
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

                    <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
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
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsSubmitDialogOpen(false)}
                                    className="text-gray-400 hover:text-white hover:bg-white/5"
                                >
                                    Continue Testing
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="hero-gradient rounded-xl px-8 font-bold"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Yes, Submit'
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
