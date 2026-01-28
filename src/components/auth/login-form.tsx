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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
// import { api } from '@/lib/api'; // Not needed directly if useAuth handles it

const formSchema = z.object({
    emailOrUsername: z.string().min(3, { message: 'Please enter a valid email or username.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
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
            toast.error(error.message || 'Login failed. Please check your credentials.');
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
            <Card className="w-full max-w-md glassmorphism border-primary/20 bg-background/50">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
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
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="name@example.com or username"
                                                    className="pl-10 bg-background/50 border-primary/10 focus:border-primary/30"
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
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="pl-10 bg-background/50 border-primary/10 focus:border-primary/30"
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
                                className="w-full h-11 text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-all duration-300"
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
                    <div className="text-sm text-center text-muted-foreground">
                        Don't have an account?{' '}
                        <Button
                            variant="link"
                            className="p-0 h-auto text-primary hover:text-primary/80"
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
