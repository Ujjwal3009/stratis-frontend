import { Subject, Question, TestResponse } from './types';

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: 1,
    name: 'History',
    description: 'Ancient, Medieval and Modern Indian History',
  },
  {
    id: 2,
    name: 'Geography',
    description:
      'Physical, Social and Economic Geography of India and the World',
  },
  {
    id: 3,
    name: 'Polity',
    description: 'Indian Constitution, Political System, Panchayati Raj',
  },
  {
    id: 4,
    name: 'Economics',
    description: 'Economic and Social Development, Sustainable Development',
  },
  {
    id: 5,
    name: 'Science & Technology',
    description: 'General Science and Technological Advancements',
  },
  {
    id: 6,
    name: 'Environment',
    description: 'General issues on Environmental Ecology, Biodiversity',
  },
];

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 1,
    questionText:
      'Which of the following acts introduced the system of dyarchy at the provincial level?',
    questionType: 'MULTIPLE_CHOICE',
    difficultyLevel: 'MEDIUM',
    subject: 'Polity',
    explanation:
      'The Government of India Act 1919 introduced dyarchy in the provinces by dividing provincial subjects into "transferred" and "reserved".',
    options: [
      { id: 1, text: 'Indian Councils Act 1892', isCorrect: false, order: 1 },
      { id: 2, text: 'Indian Councils Act 1909', isCorrect: false, order: 2 },
      {
        id: 3,
        text: 'Government of India Act 1919',
        isCorrect: true,
        order: 3,
      },
      {
        id: 4,
        text: 'Government of India Act 1935',
        isCorrect: false,
        order: 4,
      },
    ],
  },
  {
    id: 2,
    questionText: 'The Battle of Plassey was fought in which year?',
    questionType: 'MULTIPLE_CHOICE',
    difficultyLevel: 'EASY',
    subject: 'History',
    explanation:
      'The Battle of Plassey took place on 23 June 1757 between the British East India Company led by Robert Clive and the Nawab of Bengal, Siraj-ud-Daulah.',
    options: [
      { id: 5, text: '1757', isCorrect: true, order: 1 },
      { id: 6, text: '1764', isCorrect: false, order: 2 },
      { id: 7, text: '1857', isCorrect: false, order: 3 },
      { id: 8, text: '1761', isCorrect: false, order: 4 },
    ],
  },
  {
    id: 3,
    questionText: 'Which planet is known as the "Twin of the Earth"?',
    questionType: 'MULTIPLE_CHOICE',
    difficultyLevel: 'EASY',
    subject: 'Geography',
    explanation:
      'Venus is considered the "Twin of the Earth" because its size and shape are very much similar to those of the earth.',
    options: [
      { id: 9, text: 'Mars', isCorrect: false, order: 1 },
      { id: 10, text: 'Venus', isCorrect: true, order: 2 },
      { id: 11, text: 'Jupiter', isCorrect: false, order: 3 },
      { id: 12, text: 'Saturn', isCorrect: false, order: 4 },
    ],
  },
];

export const generateMockTest = (
  subjectId: number,
  count: number
): TestResponse => {
  const subject =
    MOCK_SUBJECTS.find((s) => s.id === subjectId)?.name || 'General';
  return {
    id: Math.floor(Math.random() * 1000),
    title: `${subject} Practice Test`,
    description: `A mock test generated for ${subject}.`,
    subject,
    difficulty: 'MEDIUM',
    totalQuestions: count,
    totalMarks: count * 2,
    durationMinutes: count * 2,
    createdAt: new Date().toISOString(),
    questions: MOCK_QUESTIONS.slice(0, count).map((q) => ({ ...q, subject })),
  };
};
