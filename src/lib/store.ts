import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, TestResponse, Subject } from './types';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
            logout: () => set({ user: null, token: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-storage',
        }
    )
);

interface TestState {
    selectedSubject: Subject | null;
    currentTest: TestResponse | null;
    answers: Record<number, number>; // questionId -> selectedOptionIndex
    setSelectedSubject: (subject: Subject | null) => void;
    setCurrentTest: (test: TestResponse | null) => void;
    setAnswer: (questionId: number, optionIndex: number) => void;
    resetTest: () => void;
}

export const useTestStore = create<TestState>((set) => ({
    selectedSubject: null,
    currentTest: null,
    answers: {},
    setSelectedSubject: (subject) => set({ selectedSubject: subject }),
    setCurrentTest: (test) => set({ currentTest: test, answers: {} }),
    setAnswer: (questionId, optionIndex) =>
        set((state) => ({
            answers: { ...state.answers, [questionId]: optionIndex },
        })),
    resetTest: () => set({ currentTest: null, answers: {} }),
}));
