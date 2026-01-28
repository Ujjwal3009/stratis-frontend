'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Brain, Clock, ShieldCheck, LogOut, LayoutDashboard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getUser, removeAuthToken, removeUser, User } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        setUser(getUser());
    }, []);

    const handleLogout = () => {
        removeAuthToken();
        removeUser();
        setUser(null);
        router.refresh();
    };

    return (
        <div className="min-h-screen gradient-bg selection:bg-primary/30">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-background/50 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            UPSC AI
                        </span>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="text-sm text-gray-400 hidden md:block">Hi, {user.name}</span>
                                <Link href="/dashboard">
                                    <Button variant="ghost" className="text-gray-300 hover:text-white">
                                        <LayoutDashboard className="w-4 h-4 mr-2" />
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button
                                    onClick={handleLogout}
                                    variant="ghost"
                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" className="text-gray-300 hover:text-white">Sign In</Button>
                                </Link>
                                <Link href="/signup">
                                    <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 transition-all hover:scale-105 active:scale-95">
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4">
                <div className="container mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        <span>AI-Powered Test Generation</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 tracking-tight"
                    >
                        Master Competitive Exams <br /> with Artificial Intelligence
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        Generate customized practice tests from any source. Focus on your weak areas and track your progress with our advanced analytics.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link href="/signup">
                            <Button size="lg" className="hero-gradient h-14 px-8 text-lg font-semibold rounded-full hover:scale-105 transition-transform">
                                Start Practicing Now
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold rounded-full border-white/10 hover:bg-white/5">
                            How it works
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-4">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "AI Test Generation",
                            desc: "Upload PDFs or choose subjects to generate unique practice questions instantly.",
                            icon: Brain
                        },
                        {
                            title: "Customized Subjects",
                            desc: "Detailed tests for History, Geography, Polity, and more with topic-wise precision.",
                            icon: BookOpen
                        },
                        {
                            title: "Adaptive Testing",
                            desc: "Difficulty levels that adjust to your performance for optimal learning.",
                            icon: Clock
                        }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + (i * 0.1) }}
                            className="glassmorphism p-8 rounded-3xl group hover:border-primary/40 transition-all cursor-default"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <feature.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
