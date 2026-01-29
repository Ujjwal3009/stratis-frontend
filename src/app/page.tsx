'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Brain,
  Clock,
  ShieldCheck,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
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
    <div className="gradient-bg selection:bg-primary/30 min-h-screen">
      {/* Navigation */}
      <nav className="bg-background/50 fixed top-0 z-50 w-full border-b border-white/10 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="from-primary flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br to-purple-600">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-xl font-bold text-transparent">
              UPSC AI
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="hidden text-sm text-gray-400 md:block">
                  Hi, {user.name}
                </span>
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-white"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-white"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-primary hover:bg-primary/90 rounded-full px-6 text-white transition-all hover:scale-105 active:scale-95">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 pt-32 pb-20">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/10 border-primary/20 text-primary mb-6 inline-flex items-center space-x-2 rounded-full border px-3 py-1 text-sm font-medium"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>AI-Powered Test Generation</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl"
          >
            Master Competitive Exams <br /> with Artificial Intelligence
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-400 md:text-xl"
          >
            Generate customized practice tests from any source. Focus on your
            weak areas and track your progress with our advanced analytics.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/signup">
              <Button
                size="lg"
                className="hero-gradient h-14 rounded-full px-8 text-lg font-semibold transition-transform hover:scale-105"
              >
                Start Practicing Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="h-14 rounded-full border-white/10 px-8 text-lg font-semibold hover:bg-white/5"
            >
              How it works
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20">
        <div className="container mx-auto grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              title: 'AI Test Generation',
              desc: 'Upload PDFs or choose subjects to generate unique practice questions instantly.',
              icon: Brain,
            },
            {
              title: 'Customized Subjects',
              desc: 'Detailed tests for History, Geography, Polity, and more with topic-wise precision.',
              icon: BookOpen,
            },
            {
              title: 'Adaptive Testing',
              desc: 'Difficulty levels that adjust to your performance for optimal learning.',
              icon: Clock,
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="glassmorphism group hover:border-primary/40 cursor-default rounded-3xl p-8 transition-all"
            >
              <div className="bg-primary/10 mb-6 flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110">
                <feature.icon className="text-primary h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">
                {feature.title}
              </h3>
              <p className="leading-relaxed text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
