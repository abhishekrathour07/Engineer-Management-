import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { authService } from '../../services';
import { useState } from 'react';
import type { LoginForm } from './validation/LoginSchema';
import loginSchema from './validation/LoginSchema';
import { BackgroundBeams } from '../../ui/background-beams';
import { toast } from 'sonner';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const form = useForm<LoginForm>({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginForm) => {
        setLoading(true);
        try {
            await authService.login(data);
            toast.success('Login successful! Welcome back.');
            const user = authService.getCurrentUser();
            if (user?.role === 'engineer') {
                navigate('/my-assignments');
            } else {
                navigate('/dashboard');
            }
        } catch (error: any) {
            console.error('Login failed:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please check your credentials.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-indigo-900 relative overflow-hidden">
            <BackgroundBeams />
            
            <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-none relative z-10">
                <CardHeader className="text-center pb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Welcome back! Login here</h1>
                </CardHeader>

                <CardContent className="space-y-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">Email *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="you@example.com"
                                                {...field}
                                                className="border-gray-300"
                                            />
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
                                        <FormLabel className="text-gray-700">Password *</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Enter your password"
                                                    {...field}
                                                    className="border-gray-300  pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                >
                                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* <div className="text-left">
                                <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800 text-sm">
                                    Forgot password?
                                </Link>
                            </div> */}

                            <Button
                                type="submit"
                                className="w-full bg-indigo-700 text-white py-2 hover:bg-indigo-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                        </form>
                    </Form>


                    <div className="text-center space-y-2">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
                                Signup
                            </Link>
                        </p>

                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-blue-600">EngineerHub</h2>
                        </div>

                        <p className="text-xs text-gray-500">
                            © 2025 Engineer panel. All rights reserved.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;

