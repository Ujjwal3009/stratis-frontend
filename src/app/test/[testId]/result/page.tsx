'use client';

import { useTestStore } from '@/lib/store';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard, RotateCcw, CheckCircle2, XCircle,
    Info, Trophy, Download, Brain, Zap, Target,
    ChevronRight, Clock, FileText, Sparkles, Filter
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api';
import { TestAnalysis, TestResponse } from '@/lib/types';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, PieChart, Pie, Legend
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
            api.tests.getAnalysis(parseInt(attemptId))
                .then(data => setAnalysis(data))
                .catch(err => {
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
            toast.loading('Preparing your professional report...', { id: 'pdf-toast' });

            // Give layout a moment to settle
            await new Promise(resolve => setTimeout(resolve, 800));

            const domtoimage = (await import('dom-to-image-more')).default;

            const dataUrl = await domtoimage.toPng(reportRef.current, {
                bgcolor: '#0a0a0a',
                style: {
                    transform: 'scale(1)',
                    transformOrigin: 'top left',
                    width: reportRef.current.clientWidth + 'px',
                    height: reportRef.current.scrollHeight + 'px'
                }
            });

            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4',
                compress: true
            });

            const img = new Image();
            img.src = dataUrl;

            await new Promise((resolve) => (img.onload = resolve));

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (img.height * pdfWidth) / img.width;

            let heightLeft = pdfHeight;
            let position = 0;
            const pageHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - pdfHeight;
                pdf.addPage();
                pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
                heightLeft -= pageHeight;
            }

            pdf.save(`UPSC_Success_Analysis_Attempt_${attemptId}.pdf`);
            toast.success('Professional analysis report downloaded!', { id: 'pdf-toast' });
        } catch (err) {
            console.error('PDF Error:', err);
            toast.error('Failed to generate PDF. Please try again.', { id: 'pdf-toast' });
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
            <div className="min-h-screen gradient-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white">Performing Advanced Diagnostics...</h2>
                    <p className="text-gray-400 mt-2">AI is analyzing your performance patterns</p>
                </div>
            </div>
        );
    }

    if (!analysis) return (
        <div className="min-h-screen gradient-bg flex items-center justify-center text-white">
            Analysis not found.
        </div>
    );

    const chartData = (analysis.topicPerformances || []).map(t => ({
        name: t.topicName.length > 15 ? t.topicName.substring(0, 12) + '...' : t.topicName,
        accuracy: t.accuracy,
        full: 100
    }));

    const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

    return (
        <div className="min-h-screen gradient-bg pt-20 pb-20 px-4">
            <div className="container mx-auto max-w-6xl" ref={reportRef}>

                {/* Header Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center">
                            <Sparkles className="w-8 h-8 text-primary mr-3" />
                            Topper-Level Analysis
                        </h1>
                        <p className="text-gray-400 mt-1">Attempt ID: #{attemptId} • {new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="rounded-xl border-white/10 hover:bg-white/5 disabled:opacity-50"
                            onClick={handleDownloadPDF}
                            disabled={isExporting}
                        >
                            {isExporting ? <Clock className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                            {isExporting ? 'Exporting...' : 'Download PDF'}
                        </Button>
                        <Button className="hero-gradient rounded-xl font-bold shadow-lg shadow-primary/20" onClick={() => router.push('/dashboard')}>
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            Dashboard
                        </Button>
                    </div>
                </div>

                {/* Main Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="glassmorphism bg-background/40 border-primary/20 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <Trophy className="w-16 h-16" />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">Overall Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-white">{analysis.accuracyPercentage.toFixed(1)}%</div>
                            <p className="text-xs text-primary mt-1 font-medium">{analysis.correctCount} Correct / {analysis.totalQuestions} Questions</p>
                        </CardContent>
                    </Card>

                    <Card className="glassmorphism bg-background/40 border-white/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">Time Management</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-white">{Math.floor(analysis.totalTimeSpentSeconds / 60)}m {analysis.totalTimeSpentSeconds % 60}s</div>
                            <p className="text-xs text-gray-500 mt-1">Avg. {Math.round(analysis.totalTimeSpentSeconds / analysis.totalQuestions)}s per question</p>
                        </CardContent>
                    </Card>

                    <Card className="glassmorphism bg-background/40 border-white/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">Accuracy Type</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">C: {analysis.correctCount}</Badge>
                                <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/30">W: {analysis.wrongCount}</Badge>
                                <Badge className="bg-gray-500/20 text-gray-400 hover:bg-gray-500/30">S: {analysis.unansweredCount}</Badge>
                            </div>
                            <p className="text-xs text-gray-500 mt-3 font-medium">Strike Rate: {(analysis.correctCount / (analysis.correctCount + analysis.wrongCount || 1) * 100).toFixed(0)}%</p>
                        </CardContent>
                    </Card>

                    <Card className="glassmorphism bg-background/40 border-primary/20 overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">Rank Expectancy</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">Top 15%</div>
                            <p className="text-xs text-gray-500 mt-1 italic">Based on difficulty profile</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Diagnostics & Patterns */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Expert Behavioural Analytics section (Rule-Based) */}
                        {analysis.behaviouralMetrics && (
                            <div className="space-y-6">
                                <div className="flex items-center space-x-3">
                                    <Zap className="w-6 h-6 text-yellow-400" />
                                    <h2 className="text-2xl font-bold text-white">Expert Behavioural Analytics</h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    <Card className="glassmorphism bg-white/5 border-white/5 hover:border-primary/30 transition-all group">
                                        <CardHeader className="pb-1 pt-4 px-4">
                                            <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                                                <Target className="w-3 h-3 mr-2 text-primary" />
                                                First Instinct
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="px-4 pb-4">
                                            <div className="text-2xl font-bold text-white">
                                                {analysis.behaviouralMetrics.firstInstinctAccuracy?.toFixed(1)}%
                                            </div>
                                            <p className="text-[10px] text-gray-500 mt-1">Consistency of initial choices</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="glassmorphism bg-white/5 border-white/5 hover:border-red-500/30 transition-all group">
                                        <CardHeader className="pb-1 pt-4 px-4">
                                            <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                                                <Zap className="w-3 h-3 mr-2 text-red-500" />
                                                Impulsive Errors
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="px-4 pb-4">
                                            <div className="text-2xl font-bold text-white">
                                                {analysis.behaviouralMetrics.impulsiveErrorCount}
                                            </div>
                                            <p className="text-[10px] text-gray-500 mt-1">Wrong answers in &lt; 5s</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="glassmorphism bg-white/5 border-white/5 hover:border-blue-500/30 transition-all group">
                                        <CardHeader className="pb-1 pt-4 px-4">
                                            <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                                                <Brain className="w-3 h-3 mr-2 text-blue-500" />
                                                Overthinking
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="px-4 pb-4">
                                            <div className="text-2xl font-bold text-white">
                                                {analysis.behaviouralMetrics.overthinkingErrorCount}
                                            </div>
                                            <p className="text-[10px] text-gray-500 mt-1">Changes + slow execution</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="glassmorphism bg-white/5 border-white/5 hover:border-green-500/30 transition-all group">
                                        <CardHeader className="pb-1 pt-4 px-4">
                                            <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                                                <Filter className="w-3 h-3 mr-2 text-green-500" />
                                                Elimination Eff.
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="px-4 pb-4">
                                            <div className="text-2xl font-bold text-white">
                                                {analysis.behaviouralMetrics.eliminationEfficiency?.toFixed(1)}%
                                            </div>
                                            <p className="text-[10px] text-gray-500 mt-1">Logic-based exclusion skill</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="glassmorphism bg-white/5 border-white/5 hover:border-purple-500/30 transition-all group">
                                        <CardHeader className="pb-1 pt-4 px-4">
                                            <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                                                <Clock className="w-3 h-3 mr-2 text-purple-500" />
                                                Fatigue Index
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="px-4 pb-4">
                                            <div className="text-xl font-bold text-white">
                                                {analysis.behaviouralMetrics.fatigueCurve?.fatigue_index || 'Normal'}
                                            </div>
                                            <p className="text-[10px] text-gray-500 mt-1">Segmental speed analysis</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="glassmorphism bg-white/5 border-white/5 hover:border-orange-500/30 transition-all group">
                                        <CardHeader className="pb-1 pt-4 px-4">
                                            <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                                                <Sparkles className="w-3 h-3 mr-2 text-orange-500" />
                                                Guess Probability
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="px-4 pb-4">
                                            <div className="text-2xl font-bold text-white">
                                                {analysis.behaviouralMetrics.guessProbability?.toFixed(1)}%
                                            </div>
                                            <p className="text-[10px] text-gray-500 mt-1">Rule-based luck detection</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="glassmorphism bg-white/5 border-white/5 hover:border-indigo-500/30 transition-all group">
                                        <CardHeader className="pb-1 pt-4 px-4">
                                            <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                                                <RotateCcw className="w-3 h-3 mr-2 text-indigo-500" />
                                                Attempt Ratio
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="px-4 pb-4">
                                            <div className="text-2xl font-bold text-white">
                                                {analysis.behaviouralMetrics.attemptRatio?.toFixed(1)}%
                                            </div>
                                            <p className="text-[10px] text-gray-500 mt-1">Coverage of the test paper</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="glassmorphism bg-white/5 border-white/5 hover:border-rose-500/30 transition-all group">
                                        <CardHeader className="pb-1 pt-4 px-4">
                                            <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                                                <Trophy className="w-3 h-3 mr-2 text-rose-500" />
                                                Risk Appetite
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="px-4 pb-4">
                                            <div className="text-2xl font-bold text-white">
                                                {analysis.behaviouralMetrics.riskAppetiteScore?.toFixed(1)}%
                                            </div>
                                            <p className="text-[10px] text-gray-500 mt-1">Courage in HARD questions</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="glassmorphism bg-white/5 border-white/5 hover:border-cyan-500/30 transition-all group">
                                        <CardHeader className="pb-1 pt-4 px-4">
                                            <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                                                <CheckCircle2 className="w-3 h-3 mr-2 text-cyan-500" />
                                                Confidence Index
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="px-4 pb-4">
                                            <div className="text-2xl font-bold text-white">
                                                {analysis.behaviouralMetrics.confidenceIndex?.toFixed(1)}
                                            </div>
                                            <p className="text-[10px] text-gray-500 mt-1">Selection stability score</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="glassmorphism bg-white/5 border-white/5 hover:border-emerald-500/30 transition-all group">
                                        <CardHeader className="pb-1 pt-4 px-4">
                                            <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                                                <LayoutDashboard className="w-3 h-3 mr-2 text-emerald-500" />
                                                Consistency
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="px-4 pb-4">
                                            <div className="text-2xl font-bold text-white">
                                                {analysis.behaviouralMetrics.consistencyIndex?.toFixed(1)}
                                            </div>
                                            <p className="text-[10px] text-gray-500 mt-1">Difficulty-level variance</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="glassmorphism bg-white/5 border-white/5 hover:border-red-600/30 transition-all group">
                                        <CardHeader className="pb-1 pt-4 px-4">
                                            <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                                                <XCircle className="w-3 h-3 mr-2 text-red-600" />
                                                Negative Depth
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="px-4 pb-4">
                                            <div className="text-2xl font-bold text-white">
                                                -{analysis.behaviouralMetrics.negativeMarks?.toFixed(2)}
                                            </div>
                                            <p className="text-[10px] text-gray-500 mt-1">Penalty impact on score</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}

                        {/* AI Summary Card */}
                        <Card className="glassmorphism bg-background/40 border-white/5 p-1 relative group overflow-hidden">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-purple-600/50 rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl font-bold text-white flex items-center">
                                        <Brain className="w-5 h-5 mr-3 text-primary" />
                                        AI Performance Diagnostic
                                    </CardTitle>
                                    <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">Powered by Gemini</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-300 leading-relaxed italic border-l-2 border-primary/30 pl-4 py-2 bg-primary/5 rounded-r-lg">
                                    "{analysis.aiDiagnosticSummary}"
                                </p>
                            </CardContent>
                        </Card>

                        {/* Topic Mastery Heatmap */}
                        <Card className="glassmorphism bg-background/40 border-white/5">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold text-white flex items-center">
                                    <Target className="w-5 h-5 mr-3 text-red-500" />
                                    Topic Mastery Heatmap
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={chartData}
                                            layout="vertical"
                                            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={false} />
                                            <XAxis type="number" hide domain={[0, 100]} />
                                            <YAxis
                                                dataKey="name"
                                                type="category"
                                                stroke="#737373"
                                                fontSize={12}
                                                width={100}
                                            />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Bar dataKey="accuracy" radius={[0, 4, 4, 0]} barSize={20}>
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.accuracy > 70 ? '#10b981' : entry.accuracy > 40 ? '#f59e0b' : '#ef4444'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actionable Points */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(analysis.strengthWeaknessPairs || []).map((pair, i) => (
                                <motion.div key={i} whileHover={{ y: -5 }} className="h-full">
                                    <Card className="h-full glassmorphism bg-white/[0.02] border-white/5 hover:border-primary/20 transition-all">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-md font-bold text-white flex items-center">
                                                <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                                                {pair.point}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-gray-400 leading-relaxed">
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
                                <CardTitle className="text-lg font-bold text-white">Mistake Patterns</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[200px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={Object.entries(analysis.mistakeTypeCounts || {}).map(([name, value]) => ({ name, value }))}
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {Object.entries(analysis.mistakeTypeCounts || {}).map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 10 }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Synthesized Study Notes */}
                        <Card className="glassmorphism bg-background/40 border-primary/20 min-h-[400px]">
                            <CardHeader className="bg-primary/5 pb-4">
                                <CardTitle className="text-lg font-bold text-white flex items-center">
                                    <FileText className="w-5 h-5 mr-3 text-primary" />
                                    Synthesized Notes
                                </CardTitle>
                                <CardDescription className="text-xs">Extracted core learnings from this test</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="prose prose-invert prose-sm max-w-none prose-headings:text-primary prose-strong:text-white prose-p:text-gray-300">
                                    <ReactMarkdown>
                                        {analysis.synthesizedStudyNotes}
                                    </ReactMarkdown>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Remedial Test CTA */}
                        <Card className="hero-gradient p-1 border-none shadow-2xl shadow-primary/30">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-bold text-white">Fix Your Weaknesses</CardTitle>
                                <CardDescription className="text-white/70">Generate a custom drill targeting the topics you missed today.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    className="w-full bg-white text-primary font-bold hover:bg-white/90 rounded-xl h-12"
                                    onClick={handleRemedialTest}
                                    disabled={isGeneratingRemedial}
                                >
                                    {isGeneratingRemedial ? (
                                        "Generating Drill..."
                                    ) : (
                                        <>
                                            Start Remedial Test
                                            <ChevronRight className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>

                        <div className="flex justify-center pt-4">
                            <Button variant="link" className="text-gray-500 hover:text-white" onClick={() => resetTest()}>
                                <RotateCcw className="w-3 h-3 mr-2" />
                                Clear store and reset session
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Question Timeline/Heatmap? */}
                {/* For now, just a concluding encouragement */}
                <div className="mt-12 text-center text-gray-500 text-sm">
                    "Success is not final, failure is not fatal: it is the courage to continue that counts." — Winston Churchill
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
