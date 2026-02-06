export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE';

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  fullName?: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface QuestionOption {
  id: number;
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

export interface Answer {
  questionId: number;
  selectedOptionId: number;
  timeSpentSeconds: number;
  selectionChangeCount?: number;
  hoverCount?: number;
}

export interface AnswerSubmission {
  questionId: number;
  selectedOptionId: number | null;
  timeSpentSeconds: number;
}

export interface TestSubmission {
  attemptId: number;
  answers: AnswerSubmission[];
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

export interface TestHistoryItem {
  attemptId: number;
  testId: number;
  score: number;
  totalQuestions: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  startedAt: string;
  completedAt: string;
}

export interface Subject {
  id: number;
  name: string;
  description?: string;
}

export interface PdfDocument {
  id: number;
  filename: string;
  originalFilename: string;
  fileSize: number;
  documentType: 'PYQ' | 'BOOK' | 'CURRENT_AFFAIRS';
  status: 'UPLOADED' | 'PROCESSING' | 'PROCESSED' | 'FAILED';
  uploadDate: string;
  description?: string;
}

export interface TopicAnalysis {
  topicName: string;
  correct: number;
  total: number;
  accuracy: number;
  avgTimeSpentSeconds: number;
  status: 'MASTERED' | 'NEED_PRACTICE' | 'WEAK';
}

export interface StrengthWeakness {
  point: string;
  strategy: string;
}

export interface BehaviouralMetrics {
  accuracyPercentage: number | null;
  attemptRatio: number | null;
  negativeMarks: number | null;
  firstInstinctAccuracy: number | null;
  eliminationEfficiency: number | null;
  impulsiveErrorCount: number | null;
  overthinkingErrorCount: number | null;
  guessProbability: number | null;
  cognitiveBreakdown: Record<string, any> | null;
  fatigueCurve: Record<string, any> | null;
  riskAppetiteScore: number | null;
  confidenceIndex: number | null;
  consistencyIndex: number | null;
}

export interface TestAnalysis {
  attemptId: number;
  testId: number;
  overallScore: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  accuracyPercentage: number;
  totalTimeSpentSeconds: number;
  topicPerformances: TopicAnalysis[];
  mistakeTypeCounts: Record<string, number>;
  aiDiagnosticSummary: string;
  synthesizedStudyNotes: string;
  strengthWeaknessPairs: StrengthWeakness[];
  behaviouralMetrics?: BehaviouralMetrics;
}

export interface GlobalPerformance {
  subjectAccuracy: Record<string, number>;
  topicAccuracy: Record<string, number>;
  strengths: StrengthWeaknessMetric[];
  weaknesses: StrengthWeaknessMetric[];
  behaviouralTrends: BehaviouralTrends;
}

export interface StrengthWeaknessMetric {
  name: string;
  accuracy: number;
  type: 'SUBJECT' | 'TOPIC';
}

export interface BehaviouralTrends {
  avgFirstInstinctAccuracy: number;
  avgEliminationEfficiency: number;
  totalNegativeMarks: number;
  totalImpulsiveErrors: number;
  totalOverthinkingErrors: number;
  avgConfidenceIndex: number;
}
