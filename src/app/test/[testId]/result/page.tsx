'use client';

import { useTestStore } from '@/lib/store';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, RotateCcw, CheckCircle2, XCircle, Info, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function ResultPage() {
    const { currentTest, answers, resetTest } = useTestStore();
    const router = useRouter();
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        if (!currentTest) {
            router.push('/dashboard');
            return;
        }

        // Calculate mock results
        let correct = 0;
        currentTest.questions.forEach((q) => {
            const correctIdx = q.options.findIndex((o) => o.isCorrect);
            if (answers[q.id] === correctIdx) {
                correct++;
            }
        });

        setResult({
            total: currentTest.questions.length,
            correct,
            wrong: Object.keys(answers).length - correct,
            unanswered: currentTest.questions.length - Object.keys(answers).length,
            score: (correct / currentTest.questions.length) * 100,
        });
    }, [currentTest, answers, router]);

    if (!currentTest || !result) return null;

    return (
        <div className="min-h-screen gradient-bg pt-20 pb-20 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Result Summary */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-10"
                >
                    <Card className="glassmorphism bg-background/50 border-primary/20 text-center py-12 px-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-600" />
                        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                            <Trophy className="w-10 h-10 text-primary" />
                        </div>
                        <CardTitle className="text-4xl font-bold text-white mb-2">Test Completed!</CardTitle>
                        <CardDescription className="text-lg text-gray-400 mb-8">
                            Great effort on your {currentTest.subject} practice session.
                        </CardDescription>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="text-3xl font-bold text-white mb-1">{result.score.toFixed(0)}%</div>
                                <div className="text-xs text-gray-500 uppercase font-bold tracking-widest">Score</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="text-3xl font-bold text-green-400 mb-1">{result.correct}</div>
                                <div className="text-xs text-gray-500 uppercase font-bold tracking-widest">Correct</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="text-3xl font-bold text-red-400 mb-1">{result.wrong}</div>
                                <div className="text-xs text-gray-500 uppercase font-bold tracking-widest">Wrong</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="text-3xl font-bold text-gray-400 mb-1">{result.unanswered}</div>
                                <div className="text-xs text-gray-500 uppercase font-bold tracking-widest">Skipped</div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                onClick={() => router.push('/dashboard')}
                                variant="outline"
                                className="w-full sm:w-auto rounded-xl h-12 px-8 border-white/10 hover:bg-white/5"
                            >
                                <LayoutDashboard className="w-4 h-4 mr-2" />
                                Back to Dashboard
                            </Button>
                            <Button
                                onClick={() => { resetTest(); router.push('/subjects'); }}
                                className="w-full sm:w-auto hero-gradient rounded-xl h-12 px-8 font-bold"
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Try Another Subject
                            </Button>
                        </div>
                    </Card>
                </motion.div>

                {/* Detailed Review */}
                <h2 className="text-2xl font-bold text-white mb-6">Question Review</h2>
                <div className="space-y-6">
                    {currentTest.questions.map((q, i) => {
                        const userAnswer = answers[q.id];
                        const correctIdx = q.options.findIndex((o) => o.isCorrect);
                        const isCorrect = userAnswer === correctIdx;

                        return (
                            <Card key={q.id} className="glassmorphism bg-background/40 border-white/5 overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge className={cn(
                                            "capitalize",
                                            userAnswer === undefined ? "bg-gray-500" : isCorrect ? "bg-green-500" : "bg-red-500"
                                        )}>
                                            {userAnswer === undefined ? "Skipped" : isCorrect ? "Correct" : "Incorrect"}
                                        </Badge>
                                        <span className="text-sm text-gray-500">Question {i + 1}</span>
                                    </div>
                                    <CardTitle className="text-xl font-semibold text-white leading-relaxed">
                                        {q.questionText}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {q.options.map((opt, optIdx) => (
                                            <div
                                                key={optIdx}
                                                className={cn(
                                                    "p-4 rounded-xl border flex items-center text-sm",
                                                    opt.isCorrect
                                                        ? "border-green-500/50 bg-green-500/10 text-green-200"
                                                        : userAnswer === optIdx
                                                            ? "border-red-500/50 bg-red-500/10 text-red-200"
                                                            : "border-white/5 bg-white/5 text-gray-400"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-6 h-6 rounded-full flex items-center justify-center mr-3 shrink-0 text-xs font-bold",
                                                    opt.isCorrect ? "bg-green-500 text-white" : userAnswer === optIdx ? "bg-red-500 text-white" : "bg-white/10"
                                                )}>
                                                    {String.fromCharCode(64 + opt.order)}
                                                </div>
                                                {opt.text}
                                                {opt.isCorrect && <CheckCircle2 className="w-4 h-4 ml-auto text-green-500" />}
                                                {!opt.isCorrect && userAnswer === optIdx && <XCircle className="w-4 h-4 ml-auto text-red-500" />}
                                            </div>
                                        ))}
                                    </div>
                                    {q.explanation && (
                                        <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start space-x-3">
                                            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                            <div>
                                                <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Explanation</div>
                                                <p className="text-sm text-gray-300 leading-relaxed">{q.explanation}</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
