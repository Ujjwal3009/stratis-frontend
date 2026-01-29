'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, History, Award, PlayCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    const [history, setHistory] = useState<import('@/lib/types').TestHistoryItem[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            api.tests.getHistory()
                .then(data => setHistory(data))
                .catch(err => console.error('Failed to fetch history', err))
                .finally(() => setLoadingHistory(false));
        }
    }, [isAuthenticated]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!isAuthenticated) return null;

    // Calculate stats
    const totalTests = history.length;
    const completedTests = history.filter(h => h.status === 'COMPLETED');
    const avgScore = completedTests.length > 0
        ? Math.round(completedTests.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions) * 100, 0) / completedTests.length)
        : 0;
    const totalQuestions = completedTests.reduce((acc, curr) => acc + curr.totalQuestions, 0);

    const stats = [
        { label: 'Tests Completed', value: completedTests.length.toString(), icon: History, color: 'text-blue-400' },
        { label: 'Avg. Score', value: `${avgScore}%`, icon: Award, color: 'text-yellow-400' },
        { label: 'Total Questions', value: totalQuestions.toString(), icon: BookOpen, color: 'text-green-400' },
    ];

    return (
        <div className="min-h-screen gradient-bg pb-10">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-background/50 backdrop-blur-md h-16">
                <div className="container mx-auto px-4 h-full flex items-center justify-between max-w-6xl">
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            UPSC AI
                        </span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-400 hidden sm:block">Hi, {user?.name}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={() => {
                                // useAuth logout if available, or manual
                                localStorage.removeItem('upsc_auth_token');
                                localStorage.removeItem('upsc_user');
                                window.location.href = '/';
                            }}
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto max-w-6xl pt-24 px-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {user?.name || 'Aspirant'}</h1>
                    <p className="text-gray-400 text-lg">Your UPSC preparation progress is looking good!</p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="glassmorphism bg-background/40 border-primary/10">
                                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                    <CardTitle className="text-sm font-medium text-gray-400">{stat.label}</CardTitle>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="glassmorphism bg-primary/5 border-primary/20 p-8 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                            <PlayCircle className="w-10 h-10 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">Start Practice Test</h2>
                        <p className="text-gray-400 mb-8">Generate a new test based on specific subjects or your uploaded documents.</p>
                        <Button
                            size="lg"
                            className="w-full hero-gradient text-white rounded-xl h-12 text-lg font-semibold"
                            onClick={() => router.push('/subjects')}
                        >
                            Create New Test
                        </Button>
                    </Card>

                    <Card className="glassmorphism bg-background/40 border-white/5 p-8">
                        <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
                        <div className="space-y-4">
                            {history.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No recent activity. Start a test!</p>
                            ) : (
                                history.slice(0, 5).map((activity, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <History className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-white">Test #{activity.testId}</div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-xs text-gray-500">{new Date(activity.startedAt).toLocaleDateString()}</span>
                                                    <span className="text-[10px] text-gray-600">•</span>
                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activity.status === 'COMPLETED'
                                                        ? 'bg-green-500/10 text-green-400'
                                                        : 'bg-yellow-500/10 text-yellow-400'
                                                        }`}>
                                                        {activity.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-mono font-bold text-primary">
                                                {activity.status === 'COMPLETED' ? `${activity.score}/${activity.totalQuestions}` : '--'}
                                            </div>
                                            {activity.status === 'COMPLETED' ? (
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    className="h-auto p-0 text-primary hover:text-primary/80 text-xs"
                                                    onClick={() => router.push(`/test/${activity.testId}/result?attemptId=${activity.attemptId}`)}
                                                >
                                                    View Analysis
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    className="h-auto p-0 text-primary hover:text-primary/80 text-xs"
                                                    onClick={() => router.push(`/subjects`)}
                                                >
                                                    Resume
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
