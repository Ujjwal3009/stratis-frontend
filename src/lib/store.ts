import { create } from 'zustand';
import { TestResponse, Subject } from './types';

// Auth state is now managed by AuthContext


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
