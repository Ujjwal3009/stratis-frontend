"use client";

import { AuthProvider } from "@/contexts/AuthContext";
// Add other providers here (e.g. ThemeProvider, QueryClientProvider)

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}
