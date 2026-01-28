export const TOKEN_KEY = 'upsc_auth_token';
export const USER_KEY = 'upsc_user';

export interface User {
    id: number;
    email: string;
    name: string;
    role: string;
}

export const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(TOKEN_KEY);
    }
    return null;
};

export const setAuthToken = (token: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
    }
};

export const removeAuthToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
    }
};

export const getUser = (): User | null => {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem(USER_KEY);
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (e) {
                console.error('Failed to parse user', e);
                return null;
            }
        }
    }
    return null;
};

export const setUser = (user: User) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
};

export const removeUser = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(USER_KEY);
    }
};
