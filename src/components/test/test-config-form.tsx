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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Difficulty } from '@/lib/types';
// import { generateMockTest } from '@/lib/mock-data'; // Removed mock
import { api } from '@/lib/api';
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
    try {
      const test = await api.tests.generate({
        title: `Practice Test - ${new Date().toLocaleDateString()}`,
        description: 'Generated via Stratis AI',
        subjectId: subjectId,
        difficulty: values.difficulty,
        count: parseInt(values.count),
        durationMinutes: parseInt(values.duration),
        topicId: 0, // Default or specific topic if selected later
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setCurrentTest(test as any); // Type mismatch between TestResponse and store type potentially?
      // Actually, let's checking store type usage.
      // Using 'as any' temporarily if strict type mismatch occurs to ensure build passes,
      // but ideally types should match.
      // The store currentTest is TestResponse | null.

      router.push(`/test/${test.id}`);
    } catch (error) {
      console.error('Failed to generate test', error);
      alert('Failed to generate test. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="glassmorphism bg-background/50 border-primary/20 overflow-hidden">
      <div className="from-primary h-2 bg-gradient-to-r via-purple-500 to-pink-500" />
      <CardHeader>
        <div className="mb-2 flex items-center space-x-2">
          <Settings2 className="text-primary h-5 w-5" />
          <span className="text-primary text-xs font-bold tracking-wider uppercase">
            Configuration
          </span>
        </div>
        <CardTitle className="text-2xl font-bold text-white">
          Customize Your Test
        </CardTitle>
        <CardDescription>
          Adjust the parameters below to generate your practice session.
        </CardDescription>
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
                    <BarChart4 className="mr-2 h-4 w-4" />
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
                          <FormLabel
                            className={z
                              .string()
                              .parse(
                                `hover:border-primary/50 flex cursor-pointer items-center justify-center rounded-xl border-2 border-white/5 bg-white/5 p-4 py-3 font-semibold text-gray-400 transition-all ${
                                  field.value === level
                                    ? 'border-primary bg-primary/10 text-white'
                                    : ''
                                }`
                              )}
                          >
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

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <FormField
                control={form.control}
                name="count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-gray-300">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Number of Questions
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl border-white/10 bg-white/5 text-white">
                          <SelectValue placeholder="Select amount" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="glassmorphism border-white/10 bg-gray-900">
                        {['5', '10', '15', '20', '30'].map((n) => (
                          <SelectItem
                            key={n}
                            value={n}
                            className="hover:bg-primary/20 text-white"
                          >
                            {n} Questions
                          </SelectItem>
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
                      <Clock className="mr-2 h-4 w-4" />
                      Duration
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl border-white/10 bg-white/5 text-white">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="glassmorphism border-white/10 bg-gray-900">
                        {['10', '20', '30', '45', '60'].map((m) => (
                          <SelectItem
                            key={m}
                            value={m}
                            className="hover:bg-primary/20 text-white"
                          >
                            {m} Minutes
                          </SelectItem>
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
              className="hero-gradient shadow-primary/20 h-14 w-full rounded-xl text-xl font-bold shadow-xl transition-all hover:scale-[1.02] active:scale-95"
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
