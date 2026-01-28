import { getAuthToken, removeAuthToken, removeUser } from './auth';
import { LoginRequest, RegisterRequest, AuthResponse, TestRequest, TestResponse, TestSubmission, TestResult, Subject } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getAuthToken();

    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const config = {
        ...options,
        headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        if (response.status === 401) {
            removeAuthToken();
            removeUser();
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
            throw new Error('Session expired');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Something went wrong');
    }

    return response.json();
}

export const api = {
    auth: {
        login: (data: LoginRequest) => request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
        register: (data: RegisterRequest) => request<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        me: () => request<any>('/auth/me'),
    },
    tests: {
        generate: (data: TestRequest) => request<TestResponse>('/tests/generate', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
        getById: (id: number) => request<TestResponse>(`/tests/${id}`),
        submit: (data: TestSubmission) => request<TestResult>('/tests/submit', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
        getHistory: () => request<import('./types').TestHistoryItem[]>('/tests/history'),
    },
    subjects: {
        list: () => request<Subject[]>('/subjects'),
    },
};
