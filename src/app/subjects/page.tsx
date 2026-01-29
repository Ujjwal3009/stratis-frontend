'use client';
import { useEffect, useState } from 'react';

import { useTestStore } from '@/lib/store';
import { SubjectSelector } from '@/components/subject/subject-selector';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SubjectsPage() {
  const { selectedSubject, setSelectedSubject } = useTestStore();
  const router = useRouter();
  const [subjects, setSubjects] = useState<import('@/lib/types').Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch subjects from API
    import('@/lib/api').then(({ api }) => {
      api.subjects
        .list()
        .then((data) => setSubjects(data))
        .catch((err) => console.error('Failed to fetch subjects', err))
        .finally(() => setIsLoading(false));
    });
  }, []);

  // Fallback to mock if API fails or empty (optional, but requested to use DB)
  // For now we just use what we get.

  return (
    <div className="gradient-bg min-h-screen px-4 pt-24 pb-20">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8 flex items-center space-x-4"
        >
          <Button
            variant="ghost"
            className="p-0 text-gray-400 hover:text-white"
            onClick={() => router.push('/dashboard')}
          >
            <ChevronLeft className="mr-1 h-5 w-5" />
            Back to Dashboard
          </Button>
        </motion.div>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold text-white">
            Select a Subject
          </h1>
          <p className="text-lg text-gray-400">
            Choose a subject to generate a customized practice test.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-white">Loading subjects...</div>
        ) : (
          <SubjectSelector
            subjects={subjects}
            selectedId={selectedSubject?.id}
            onSelect={(subject) => setSelectedSubject(subject)}
          />
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: selectedSubject ? 1 : 0 }}
          className="mt-12 flex justify-end"
        >
          {selectedSubject && (
            <Button
              size="lg"
              className="hero-gradient shadow-primary/20 h-14 rounded-xl px-10 text-lg font-bold shadow-lg"
              onClick={() => router.push('/test/configure')}
            >
              Continue with {selectedSubject.name}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
