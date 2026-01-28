import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 gradient-bg">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
            </div>
            <div className="relative z-10 w-full max-w-md">
                <LoginForm />
            </div>
        </div>
    );
}
