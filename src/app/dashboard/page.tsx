'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

  const { data: history = [], isLoading: loadingHistory } = useQuery({
    queryKey: ['test-history'],
    queryFn: () => api.tests.getHistory(),
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // Calculate stats
  const totalTests = history.length;
  const completedTests = history.filter((h) => h.status === 'COMPLETED');
  const avgScore =
    completedTests.length > 0
      ? Math.round(
          completedTests.reduce(
            (acc, curr) => acc + (curr.score / curr.totalQuestions) * 100,
            0
          ) / completedTests.length
        )
      : 0;
  const totalQuestions = completedTests.reduce(
    (acc, curr) => acc + curr.totalQuestions,
    0
  );

  const stats = [
    {
      label: 'Tests Completed',
      value: completedTests.length.toString(),
      icon: History,
      color: 'text-blue-400',
    },
    {
      label: 'Avg. Score',
      value: `${avgScore}%`,
      icon: Award,
      color: 'text-yellow-400',
    },
    {
      label: 'Total Questions',
      value: totalQuestions.toString(),
      icon: BookOpen,
      color: 'text-green-400',
    },
  ];

  return (
    <div className="gradient-bg min-h-screen pb-10">
      {/* Header */}
      <header className="bg-background/50 fixed top-0 z-50 h-16 w-full border-b border-white/10 backdrop-blur-md">
        <div className="container mx-auto flex h-full max-w-6xl items-center justify-between px-4">
          <div
            className="flex cursor-pointer items-center space-x-2"
            onClick={() => router.push('/')}
          >
            <div className="from-primary flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br to-purple-600">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-xl font-bold text-transparent">
              UPSC AI
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden text-sm text-gray-400 sm:block">
              Hi, {user?.name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
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

      <div className="container mx-auto max-w-6xl px-4 pt-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="mb-2 text-4xl font-bold text-white">
            Welcome back, {user?.name || 'Aspirant'}
          </h1>
          <p className="text-lg text-gray-400">
            Your UPSC preparation progress is looking good!
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="glassmorphism bg-background/40 border-primary/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    {stat.label}
                  </CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Card className="glassmorphism bg-primary/5 border-primary/20 flex flex-col items-center p-8 text-center">
            <div className="bg-primary/20 mb-6 flex h-16 w-16 items-center justify-center rounded-full">
              <PlayCircle className="text-primary h-10 w-10" />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-white">
              Start Practice Test
            </h2>
            <p className="mb-8 text-gray-400">
              Generate a new test based on specific subjects or your uploaded
              documents.
            </p>
            <Button
              size="lg"
              className="hero-gradient h-12 w-full rounded-xl text-lg font-semibold text-white"
              onClick={() => router.push('/subjects')}
            >
              Create New Test
            </Button>
          </Card>

          <Card className="glassmorphism bg-background/40 border-white/5 p-8">
            <h2 className="mb-6 text-xl font-bold text-white">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {history.length === 0 ? (
                <p className="py-4 text-center text-gray-500">
                  No recent activity. Start a test!
                </p>
              ) : (
                history.slice(0, 5).map((activity, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                        <History className="text-primary h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">
                          Test #{activity.testId}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {new Date(activity.startedAt).toLocaleDateString()}
                          </span>
                          <span className="text-[10px] text-gray-600">•</span>
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                              activity.status === 'COMPLETED'
                                ? 'bg-green-500/10 text-green-400'
                                : 'bg-yellow-500/10 text-yellow-400'
                            }`}
                          >
                            {activity.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-primary font-mono font-bold">
                        {activity.status === 'COMPLETED'
                          ? `${activity.score}/${activity.totalQuestions}`
                          : '--'}
                      </div>
                      {activity.status === 'COMPLETED' ? (
                        <Button
                          variant="link"
                          size="sm"
                          className="text-primary hover:text-primary/80 h-auto p-0 text-xs"
                          onClick={() =>
                            router.push(
                              `/test/${activity.testId}/result?attemptId=${activity.attemptId}`
                            )
                          }
                        >
                          View Analysis
                        </Button>
                      ) : (
                        <Button
                          variant="link"
                          size="sm"
                          className="text-primary hover:text-primary/80 h-auto p-0 text-xs"
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
