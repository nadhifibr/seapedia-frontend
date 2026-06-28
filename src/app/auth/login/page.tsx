'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { GuestRoute } from '@/components/shared/GuestRoute';
import Link from 'next/link';
import Image from 'next/image';
import { AuthImageCarousel } from '@/components/auth/AuthImageCarousel';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login/', { username, password });
      login(response.data.access, response.data.refresh);
      // Wait a moment for state to update, then route
      setTimeout(() => {
        router.push('/role-select');
      }, 500);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestRoute>
      <div className="h-screen flex w-full bg-white overflow-hidden">
        {/* Left Panel - Hidden on mobile */}
        <div className="hidden lg:flex w-1/2 relative">
          <AuthImageCarousel />
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-8 relative">
          
          <div className="w-full max-w-md mb-6 text-center">
            <Link href="/" className="inline-block">
              <Image 
                src="/logo-text-navy.svg" 
                alt="Seapedia Logo" 
                width={160} 
                height={40} 
                className="mx-auto"
                priority
              />
            </Link>
          </div>

          <div className="w-full max-w-md">
            <Card className="border-none ring-0 shadow-none bg-transparent w-full">
              <CardHeader className="pt-0">
                <CardTitle className="text-2xl font-bold text-slate-900">Welcome Back</CardTitle>
                <CardDescription className="text-slate-500">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="username">Username or Email</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="johndoe or john@example.com"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link href="/auth/forgot-password" className="text-sm font-medium text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-100 rounded-md">
                      {error}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 mt-4 border-none bg-transparent">
                  <Button type="submit" className="w-full bg-[#0B3D91] hover:bg-[#082b66] text-white" disabled={loading}>
                    {loading ? 'Logging in...' : 'Log In'}
                  </Button>
                  <div className="text-sm text-center text-slate-500">
                    Don't have an account?{' '}
                    <Link href="/auth/register" className="font-semibold text-primary hover:underline">
                      Sign up
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </div>

          <div className="absolute bottom-6 left-0 right-0 text-center">
            <p className="text-xs text-slate-400">
              &copy; {new Date().getFullYear()} Seapedia. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </GuestRoute>
  );
}
