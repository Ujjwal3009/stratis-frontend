import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="gradient-bg flex min-h-screen w-full items-center justify-center p-4">
      <div className="absolute inset-0 z-0">
        <div className="bg-primary/20 absolute top-1/4 right-1/4 h-96 w-96 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 left-1/4 h-96 w-96 rounded-full bg-purple-500/20 blur-[128px]" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <LoginForm />
      </div>
      {/* Test Credentials Hint */}
      <div className="fixed right-4 bottom-4 z-50 rounded bg-yellow-100 p-4 text-xs shadow">
        <p>Test Creds:</p>
        <p>test@upsc-ai.com / password</p>
        <p>admin@upsc-ai.com / admin</p>
      </div>
    </div>
  );
}
