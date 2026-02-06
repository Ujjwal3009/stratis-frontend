'use client';

import { useTestStore } from '@/lib/store';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Info,
  Trophy,
  Download,
  Brain,
  Zap,
  Target,
  ChevronRight,
  Clock,
  FileText,
  Sparkles,
  Filter,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api';
import { TestAnalysis, TestResponse } from '@/lib/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ReactMarkdown from 'react-markdown';

export default function ResultAnalysisPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currentTest, resetTest } = useTestStore();

  const attemptId = searchParams?.get('attemptId');
  const [analysis, setAnalysis] = useState<TestAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingRemedial, setIsGeneratingRemedial] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (attemptId) {
      setLoading(true);
      api.tests
        .getAnalysis(parseInt(attemptId))
        .then((data) => setAnalysis(data))
        .catch((err) => {
          console.error('Failed to fetch analysis', err);
          toast.error('Failed to load detailed analysis.');
        })
        .finally(() => setLoading(false));
    }
  }, [attemptId]);

  const handleDownloadPDF = async () => {
    if (!reportRef.current || isExporting) return;

    try {
      setIsExporting(true);
      toast.loading('Preparing your professional report...', {
        id: 'pdf-toast',
      });

      // Give layout a moment to settle
      await new Promise((resolve) => setTimeout(resolve, 800));

      const domtoimage = (await import('dom-to-image-more')).default;

      const dataUrl = await domtoimage.toPng(reportRef.current, {
        bgcolor: '#0a0a0a',
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: reportRef.current.clientWidth + 'px',
          height: reportRef.current.scrollHeight + 'px',
        },
      });

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const img = new Image();
      img.src = dataUrl;

      await new Promise((resolve) => (img.onload = resolve));

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (img.height * pdfWidth) / img.width;

      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(
        dataUrl,
        'PNG',
        0,
        position,
        pdfWidth,
        pdfHeight,
        undefined,
        'FAST'
      );
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(
          dataUrl,
          'PNG',
          0,
          position,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        heightLeft -= pageHeight;
      }

      pdf.save(`UPSC_Success_Analysis_Attempt_${attemptId}.pdf`);
      toast.success('Professional analysis report downloaded!', {
        id: 'pdf-toast',
      });
    } catch (err) {
      console.error('PDF Error:', err);
      toast.error('Failed to generate PDF. Please try again.', {
        id: 'pdf-toast',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleRemedialTest = async () => {
    if (!attemptId) return;

    try {
      setIsGeneratingRemedial(true);
      toast.loading('Identifying weaknesses and generating test...');
      const newTest = await api.tests.createRemedial(parseInt(attemptId));

      toast.dismiss();
      toast.success('Remedial Test Generated!');

      // We use the new test data
      useTestStore.getState().setCurrentTest(newTest);
      useTestStore.getState().setAttemptId(null); // Will start new attempt on test page
      router.push(`/test/${newTest.id}`);
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message || 'Failed to generate remedial test');
      setIsGeneratingRemedial(false);
    }
  };

  if (loading) {
    return (
      <div className="gradient-bg flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-t-transparent" />
          <h2 className="text-xl font-bold text-white">
            Performing Advanced Diagnostics...
          </h2>
          <p className="mt-2 text-gray-400">
            AI is analyzing your performance patterns
          </p>
        </div>
      </div>
    );
  }

  if (!analysis)
    return (
      <div className="gradient-bg flex min-h-screen items-center justify-center text-white">
        Analysis not found.
      </div>
    );

  const chartData = (analysis.topicPerformances || []).map((t) => ({
    name:
      t.topicName.length > 15
        ? t.topicName.substring(0, 12) + '...'
        : t.topicName,
    accuracy: t.accuracy,
    full: 100,
  }));

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <div className="gradient-bg min-h-screen px-4 pt-20 pb-20">
      <div className="container mx-auto max-w-6xl" ref={reportRef}>
        {/* Header Actions */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="flex items-center text-3xl font-bold text-white">
              <Sparkles className="text-primary mr-3 h-8 w-8" />
              Topper-Level Analysis
            </h1>
            <p className="mt-1 text-gray-400">
              Attempt ID: #{attemptId} • {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="rounded-xl border-white/10 hover:bg-white/5 disabled:opacity-50"
              onClick={handleDownloadPDF}
              disabled={isExporting}
            >
              {isExporting ? (
                <Clock className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {isExporting ? 'Exporting...' : 'Download PDF'}
            </Button>
            <Button
              className="hero-gradient shadow-primary/20 rounded-xl font-bold shadow-lg"
              onClick={() => router.push('/dashboard')}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </div>
        </div>

        {/* Main Stats Row */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card className="glassmorphism bg-background/40 border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Trophy className="h-16 w-16" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium tracking-wider text-gray-400 uppercase">
                Overall Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">
                {analysis.accuracyPercentage.toFixed(1)}%
              </div>
              <p className="text-primary mt-1 text-xs font-medium">
                {analysis.correctCount} Correct / {analysis.totalQuestions}{' '}
                Questions
              </p>
            </CardContent>
          </Card>

          <Card className="glassmorphism bg-background/40 border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium tracking-wider text-gray-400 uppercase">
                Time Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">
                {Math.floor(analysis.totalTimeSpentSeconds / 60)}m{' '}
                {analysis.totalTimeSpentSeconds % 60}s
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Avg.{' '}
                {Math.round(
                  analysis.totalTimeSpentSeconds / analysis.totalQuestions
                )}
                s per question
              </p>
            </CardContent>
          </Card>

          <Card className="glassmorphism bg-background/40 border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium tracking-wider text-gray-400 uppercase">
                Accuracy Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                  C: {analysis.correctCount}
                </Badge>
                <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/30">
                  W: {analysis.wrongCount}
                </Badge>
                <Badge className="bg-gray-500/20 text-gray-400 hover:bg-gray-500/30">
                  S: {analysis.unansweredCount}
                </Badge>
              </div>
              <p className="mt-3 text-xs font-medium text-gray-500">
                Strike Rate:{' '}
                {(
                  (analysis.correctCount /
                    (analysis.correctCount + analysis.wrongCount || 1)) *
                  100
                ).toFixed(0)}
                %
              </p>
            </CardContent>
          </Card>

          <Card className="glassmorphism bg-background/40 border-primary/20 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium tracking-wider text-gray-400 uppercase">
                Rank Expectancy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-primary text-2xl font-bold">Top 15%</div>
              <p className="mt-1 text-xs text-gray-500 italic">
                Based on difficulty profile
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Diagnostics & Patterns */}
          <div className="space-y-8 lg:col-span-2">
            {/* Expert Behavioural Analytics section (Rule-Based) */}
            {analysis.behaviouralMetrics && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <Zap className="h-6 w-6 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">
                    Expert Behavioural Analytics
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  <Card className="glassmorphism hover:border-primary/30 group border-white/5 bg-white/5 transition-all">
                    <CardHeader className="px-4 pt-4 pb-1">
                      <CardTitle className="flex items-center text-xs font-bold tracking-widest text-gray-400 uppercase">
                        <Target className="text-primary mr-2 h-3 w-3" />
                        First Instinct
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="text-2xl font-bold text-white">
                        {analysis.behaviouralMetrics.firstInstinctAccuracy?.toFixed(
                          1
                        )}
                        %
                      </div>
                      <p className="mt-1 text-[10px] text-gray-500">
                        Consistency of initial choices
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="glassmorphism group border-white/5 bg-white/5 transition-all hover:border-red-500/30">
                    <CardHeader className="px-4 pt-4 pb-1">
                      <CardTitle className="flex items-center text-xs font-bold tracking-widest text-gray-400 uppercase">
                        <Zap className="mr-2 h-3 w-3 text-red-500" />
                        Impulsive Errors
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="text-2xl font-bold text-white">
                        {analysis.behaviouralMetrics.impulsiveErrorCount}
                      </div>
                      <p className="mt-1 text-[10px] text-gray-500">
                        Wrong answers in &lt; 5s
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="glassmorphism group border-white/5 bg-white/5 transition-all hover:border-blue-500/30">
                    <CardHeader className="px-4 pt-4 pb-1">
                      <CardTitle className="flex items-center text-xs font-bold tracking-widest text-gray-400 uppercase">
                        <Brain className="mr-2 h-3 w-3 text-blue-500" />
                        Overthinking
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="text-2xl font-bold text-white">
                        {analysis.behaviouralMetrics.overthinkingErrorCount}
                      </div>
                      <p className="mt-1 text-[10px] text-gray-500">
                        Changes + slow execution
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="glassmorphism group border-white/5 bg-white/5 transition-all hover:border-green-500/30">
                    <CardHeader className="px-4 pt-4 pb-1">
                      <CardTitle className="flex items-center text-xs font-bold tracking-widest text-gray-400 uppercase">
                        <Filter className="mr-2 h-3 w-3 text-green-500" />
                        Elimination Eff.
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="text-2xl font-bold text-white">
                        {analysis.behaviouralMetrics.eliminationEfficiency?.toFixed(
                          1
                        )}
                        %
                      </div>
                      <p className="mt-1 text-[10px] text-gray-500">
                        Logic-based exclusion skill
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="glassmorphism group border-white/5 bg-white/5 transition-all hover:border-purple-500/30">
                    <CardHeader className="px-4 pt-4 pb-1">
                      <CardTitle className="flex items-center text-xs font-bold tracking-widest text-gray-400 uppercase">
                        <Clock className="mr-2 h-3 w-3 text-purple-500" />
                        Fatigue Index
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="text-xl font-bold text-white">
                        {analysis.behaviouralMetrics.fatigueCurve
                          ?.fatigue_index || 'Normal'}
                      </div>
                      <p className="mt-1 text-[10px] text-gray-500">
                        Segmental speed analysis
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="glassmorphism group border-white/5 bg-white/5 transition-all hover:border-orange-500/30">
                    <CardHeader className="px-4 pt-4 pb-1">
                      <CardTitle className="flex items-center text-xs font-bold tracking-widest text-gray-400 uppercase">
                        <Sparkles className="mr-2 h-3 w-3 text-orange-500" />
                        Guess Probability
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="text-2xl font-bold text-white">
                        {analysis.behaviouralMetrics.guessProbability?.toFixed(
                          1
                        )}
                        %
                      </div>
                      <p className="mt-1 text-[10px] text-gray-500">
                        Rule-based luck detection
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="glassmorphism group border-white/5 bg-white/5 transition-all hover:border-indigo-500/30">
                    <CardHeader className="px-4 pt-4 pb-1">
                      <CardTitle className="flex items-center text-xs font-bold tracking-widest text-gray-400 uppercase">
                        <RotateCcw className="mr-2 h-3 w-3 text-indigo-500" />
                        Attempt Ratio
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="text-2xl font-bold text-white">
                        {analysis.behaviouralMetrics.attemptRatio?.toFixed(1)}%
                      </div>
                      <p className="mt-1 text-[10px] text-gray-500">
                        Coverage of the test paper
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="glassmorphism group border-white/5 bg-white/5 transition-all hover:border-rose-500/30">
                    <CardHeader className="px-4 pt-4 pb-1">
                      <CardTitle className="flex items-center text-xs font-bold tracking-widest text-gray-400 uppercase">
                        <Trophy className="mr-2 h-3 w-3 text-rose-500" />
                        Risk Appetite
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="text-2xl font-bold text-white">
                        {analysis.behaviouralMetrics.riskAppetiteScore?.toFixed(
                          1
                        )}
                        %
                      </div>
                      <p className="mt-1 text-[10px] text-gray-500">
                        Courage in HARD questions
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="glassmorphism group border-white/5 bg-white/5 transition-all hover:border-cyan-500/30">
                    <CardHeader className="px-4 pt-4 pb-1">
                      <CardTitle className="flex items-center text-xs font-bold tracking-widest text-gray-400 uppercase">
                        <CheckCircle2 className="mr-2 h-3 w-3 text-cyan-500" />
                        Confidence Index
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="text-2xl font-bold text-white">
                        {analysis.behaviouralMetrics.confidenceIndex?.toFixed(
                          1
                        )}
                      </div>
                      <p className="mt-1 text-[10px] text-gray-500">
                        Selection stability score
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="glassmorphism group border-white/5 bg-white/5 transition-all hover:border-emerald-500/30">
                    <CardHeader className="px-4 pt-4 pb-1">
                      <CardTitle className="flex items-center text-xs font-bold tracking-widest text-gray-400 uppercase">
                        <LayoutDashboard className="mr-2 h-3 w-3 text-emerald-500" />
                        Consistency
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="text-2xl font-bold text-white">
                        {analysis.behaviouralMetrics.consistencyIndex?.toFixed(
                          1
                        )}
                      </div>
                      <p className="mt-1 text-[10px] text-gray-500">
                        Difficulty-level variance
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="glassmorphism group border-white/5 bg-white/5 transition-all hover:border-red-600/30">
                    <CardHeader className="px-4 pt-4 pb-1">
                      <CardTitle className="flex items-center text-xs font-bold tracking-widest text-gray-400 uppercase">
                        <XCircle className="mr-2 h-3 w-3 text-red-600" />
                        Negative Depth
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="text-2xl font-bold text-white">
                        -{analysis.behaviouralMetrics.negativeMarks?.toFixed(2)}
                      </div>
                      <p className="mt-1 text-[10px] text-gray-500">
                        Penalty impact on score
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* AI Summary Card */}
            <Card className="glassmorphism bg-background/40 group relative overflow-hidden border-white/5 p-1">
              <div className="from-primary/50 absolute -inset-0.5 rounded-xl bg-gradient-to-r to-purple-600/50 opacity-10 blur transition duration-1000 group-hover:opacity-20"></div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-xl font-bold text-white">
                    <Brain className="text-primary mr-3 h-5 w-5" />
                    AI Performance Diagnostic
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="border-primary/20 text-primary bg-primary/5"
                  >
                    Powered by Gemini
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="border-primary/30 bg-primary/5 rounded-r-lg border-l-2 py-2 pl-4 leading-relaxed text-gray-300 italic">
                  "{analysis.aiDiagnosticSummary}"
                </p>
              </CardContent>
            </Card>

            {/* Topic Mastery Heatmap */}
            <Card className="glassmorphism bg-background/40 border-white/5">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold text-white">
                  <Target className="mr-3 h-5 w-5 text-red-500" />
                  Topic Mastery Heatmap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mt-4 h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#262626"
                        horizontal={false}
                      />
                      <XAxis type="number" hide domain={[0, 100]} />
                      <YAxis
                        dataKey="name"
                        type="category"
                        stroke="#737373"
                        fontSize={12}
                        width={100}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#171717',
                          border: '1px solid #404040',
                        }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Bar
                        dataKey="accuracy"
                        radius={[0, 4, 4, 0]}
                        barSize={20}
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.accuracy > 70
                                ? '#10b981'
                                : entry.accuracy > 40
                                  ? '#f59e0b'
                                  : '#ef4444'
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Actionable Points */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {(analysis.strengthWeaknessPairs || []).map((pair, i) => (
                <motion.div key={i} whileHover={{ y: -5 }} className="h-full">
                  <Card className="glassmorphism hover:border-primary/20 h-full border-white/5 bg-white/[0.02] transition-all">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md flex items-center font-bold text-white">
                        <Zap className="mr-2 h-4 w-4 text-yellow-400" />
                        {pair.point}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-gray-400">
                        {pair.strategy}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Notes & Remedial */}
          <div className="space-y-8">
            {/* Mistake Pattern Pie */}
            <Card className="glassmorphism bg-background/40 border-white/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-white">
                  Mistake Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(
                          analysis.mistakeTypeCounts || {}
                        ).map(([name, value]) => ({ name, value }))}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {Object.entries(analysis.mistakeTypeCounts || {}).map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{ fontSize: 10 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Synthesized Study Notes */}
            <Card className="glassmorphism bg-background/40 border-primary/20 min-h-[400px]">
              <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="flex items-center text-lg font-bold text-white">
                  <FileText className="text-primary mr-3 h-5 w-5" />
                  Synthesized Notes
                </CardTitle>
                <CardDescription className="text-xs">
                  Extracted core learnings from this test
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="prose prose-invert prose-sm prose-headings:text-primary prose-strong:text-white prose-p:text-gray-300 max-w-none">
                  <ReactMarkdown>
                    {analysis.synthesizedStudyNotes}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>

            {/* Remedial Test CTA */}
            <Card className="hero-gradient shadow-primary/30 border-none p-1 shadow-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-white">
                  Fix Your Weaknesses
                </CardTitle>
                <CardDescription className="text-white/70">
                  Generate a custom drill targeting the topics you missed today.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="!text-primary h-12 w-full rounded-xl bg-white font-bold hover:bg-white/90"
                  onClick={handleRemedialTest}
                  disabled={isGeneratingRemedial}
                >
                  {isGeneratingRemedial ? (
                    'Generating Drill...'
                  ) : (
                    <>
                      Start Remedial Test
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <div className="flex justify-center pt-4">
              <Button
                variant="link"
                className="text-gray-500 hover:text-white"
                onClick={() => resetTest()}
              >
                <RotateCcw className="mr-2 h-3 w-3" />
                Clear store and reset session
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section: Question Timeline/Heatmap? */}
        {/* For now, just a concluding encouragement */}
        <div className="mt-12 text-center text-sm text-gray-500">
          "Success is not final, failure is not fatal: it is the courage to
          continue that counts." — Winston Churchill
        </div>
      </div>

      <style jsx global>{`
        .recharts-cartesian-axis-tick-value {
          fill: #737373 !important;
        }
      `}</style>
    </div>
  );
}
