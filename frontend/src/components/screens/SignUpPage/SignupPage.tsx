import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { authService } from '../../services';
import { useState } from 'react';
import { signupSchema } from './validation/signupSchema';
import type { InferType } from 'yup';
import { BackgroundBeams } from '../../ui/background-beams';
import { toast } from 'sonner';

type SignupForm = InferType<typeof signupSchema>;

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<SignupForm>({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'engineer' as 'engineer' | 'manager',
    },
  });

  const onSubmit = async (data: SignupForm) => {
    setLoading(true);
    try {
      await authService.signup(data);
      toast.success('Account created successfully! Welcome to EngineerHub.');
      navigate('/login');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Signup failed. Please try again.';
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
          <h1 className="text-2xl font-bold text-gray-800">Create your account</h1>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Full Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        className="border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                        className="border-gray-300 "
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
                          placeholder="Create a strong password"
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

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Role *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full border-gray-300">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='w-full'>
                        <SelectItem value="engineer">Engineer</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                 className="w-full bg-indigo-700 text-white py-2 hover:bg-indigo-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </Form>

          <div className="text-center space-y-2">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
                Login
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

export default SignUpPage;
