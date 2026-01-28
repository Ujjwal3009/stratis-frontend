'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Loader2, Settings2, HelpCircle, Clock, BarChart4 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Difficulty } from '@/lib/types';
import { generateMockTest } from '@/lib/mock-data';
import { useTestStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
    count: z.string(),
    duration: z.string(),
});

export function TestConfigForm({ subjectId }: { subjectId: number }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const setCurrentTest = useTestStore((state) => state.setCurrentTest);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            difficulty: 'MEDIUM',
            count: '10',
            duration: '20',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        // Simulate generation
        setTimeout(() => {
            const test = generateMockTest(subjectId, parseInt(values.count));
            setCurrentTest(test);
            setIsLoading(false);
            router.push(`/test/${test.id}`);
        }, 2000);
    }

    return (
        <Card className="glassmorphism bg-background/50 border-primary/20 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />
            <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                    <Settings2 className="w-5 h-5 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Configuration</span>
                </div>
                <CardTitle className="text-2xl font-bold text-white">Customize Your Test</CardTitle>
                <CardDescription>Adjust the parameters below to generate your practice session.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="difficulty"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="flex items-center text-gray-300">
                                        <BarChart4 className="w-4 h-4 mr-2" />
                                        Difficulty Level
                                    </FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="grid grid-cols-3 gap-4"
                                        >
                                            {['EASY', 'MEDIUM', 'HARD'].map((level) => (
                                                <FormItem key={level}>
                                                    <FormControl>
                                                        <RadioGroupItem value={level} className="sr-only" />
                                                    </FormControl>
                                                    <FormLabel className={z.string().parse(
                                                        `flex items-center justify-center rounded-xl border-2 border-white/5 bg-white/5 p-4 py-3 font-semibold transition-all cursor-pointer hover:border-primary/50 text-gray-400 ${field.value === level ? 'border-primary bg-primary/10 text-white' : ''
                                                        }`
                                                    )}>
                                                        {level}
                                                    </FormLabel>
                                                </FormItem>
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FormField
                                control={form.control}
                                name="count"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center text-gray-300">
                                            <HelpCircle className="w-4 h-4 mr-2" />
                                            Number of Questions
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-12">
                                                    <SelectValue placeholder="Select amount" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="glassmorphism bg-gray-900 border-white/10">
                                                {['5', '10', '15', '20', '30'].map((n) => (
                                                    <SelectItem key={n} value={n} className="text-white hover:bg-primary/20">{n} Questions</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="duration"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center text-gray-300">
                                            <Clock className="w-4 h-4 mr-2" />
                                            Duration
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-12">
                                                    <SelectValue placeholder="Select time" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="glassmorphism bg-gray-900 border-white/10">
                                                {['10', '20', '30', '45', '60'].map((m) => (
                                                    <SelectItem key={m} value={m} className="text-white hover:bg-primary/20">{m} Minutes</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 text-xl font-bold hero-gradient rounded-xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                    Generating Test...
                                </>
                            ) : (
                                'Generate Practice Test'
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
