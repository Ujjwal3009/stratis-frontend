export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE';

export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface QuestionOption {
  text: string;
  isCorrect: boolean;
  order: number;
}

export interface Question {
  id: number;
  questionText: string;
  questionType: QuestionType;
  difficultyLevel: Difficulty;
  subject: string;
  topic?: string;
  explanation?: string;
  options: QuestionOption[];
}

export interface TestRequest {
  title: string;
  description?: string;
  subjectId: number;
  topicId?: number;
  difficulty: Difficulty;
  count: number;
  durationMinutes: number;
}

export interface TestResponse {
  id: number;
  title: string;
  description?: string;
  subject: string;
  topic?: string;
  difficulty: Difficulty;
  totalQuestions: number;
  totalMarks: number;
  durationMinutes: number;
  createdAt: string;
  questions: Question[];
}

export interface TestSubmission {
  attemptId: number;
  answers: Record<number, number>; // questionId -> selectedOptionIndex
}

export interface TestResult {
  attemptId: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
  percentage: number;
  timeTakenMinutes: number;
}

export interface Subject {
  id: number;
  name: string;
  description?: string;
}
