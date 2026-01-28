'use client';

import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, History, Award, PlayCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const user = useAuthStore((state) => state.user);
    const router = useRouter();

    const stats = [
        { label: 'Tests Taken', value: '12', icon: History, color: 'text-blue-400' },
        { label: 'Avg. Score', value: '78%', icon: Award, color: 'text-yellow-400' },
        { label: 'Total Questions', value: '450', icon: BookOpen, color: 'text-green-400' },
    ];

    return (
        <div className="min-h-screen gradient-bg pt-20 px-4 pb-10">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {user?.fullName || 'Aspirant'}</h1>
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
                            {[
                                { title: 'History Quiz', date: '2 hours ago', score: '18/20' },
                                { title: 'Polity Mock', date: 'Yesterday', score: '45/50' },
                                { title: 'Geography Test', date: '3 days ago', score: '22/30' },
                            ].map((activity, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div>
                                        <div className="font-semibold text-white">{activity.title}</div>
                                        <div className="text-xs text-gray-500">{activity.date}</div>
                                    </div>
                                    <div className="font-mono font-bold text-primary">{activity.score}</div>
                                </div>
                            ))}
                            <Button variant="link" className="w-full text-gray-400 hover:text-white">
                                View All Activity
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
