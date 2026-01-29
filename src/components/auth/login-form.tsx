'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Loader2, LogIn, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
// import { api } from '@/lib/api'; // Not needed directly if useAuth handles it

const formSchema = z.object({
  emailOrUsername: z
    .string()
    .min(3, { message: 'Please enter a valid email or username.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
});

export function LoginForm() {
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailOrUsername: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoadingLocal(true);
    try {
      await login({
        emailOrUsername: values.emailOrUsername,
        password: values.password,
      });
      toast.success('Logged in successfully!');
      // Navigation is handled in AuthContext or here.
      // AuthContext does push /dashboard.
    } catch (error: any) {
      // Error is already logged in context but we need to show toast
      toast.error(
        error.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setIsLoadingLocal(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glassmorphism border-primary/20 bg-background/50 w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="from-primary bg-gradient-to-r to-purple-400 bg-clip-text text-center text-3xl font-bold text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your UPSC dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="emailOrUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                        <Input
                          placeholder="name@example.com or username"
                          className="bg-background/50 border-primary/10 focus:border-primary/30 pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="bg-background/50 border-primary/10 focus:border-primary/30 pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="from-primary h-11 w-full bg-gradient-to-r to-purple-600 text-lg font-semibold transition-all duration-300 hover:opacity-90"
                disabled={isLoadingLocal}
              >
                {isLoadingLocal ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-muted-foreground text-center text-sm">
            Don't have an account?{' '}
            <Button
              variant="link"
              className="text-primary hover:text-primary/80 h-auto p-0"
              onClick={() => router.push('/signup')}
            >
              Sign up
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
