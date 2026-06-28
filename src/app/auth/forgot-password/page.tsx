'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { GuestRoute } from '@/components/shared/GuestRoute';
import Link from 'next/link';
import Image from 'next/image';
import { AuthImageCarousel } from '@/components/auth/AuthImageCarousel';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{type: 'idle' | 'success' | 'error', message: string}>({ type: 'idle', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'idle', message: '' });
    setLoading(true);

    try {
      const response = await api.post('/auth/password-reset/', { email });
      setStatus({ type: 'success', message: response.data.detail || 'If your email is registered, you will receive a password reset link shortly.' });
    } catch (err: any) {
      setStatus({ type: 'error', message: err.response?.data?.detail || 'Failed to request password reset. Please try again later.' });
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

        {/* Right Panel - Forgot Password Form */}
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
                <CardTitle className="text-2xl font-bold text-slate-900">Forgot Password?</CardTitle>
                <CardDescription className="text-slate-500">
                  Enter your email address and we'll send you a link to reset your password.
                </CardDescription>
              </CardHeader>
              
              {status.type === 'success' ? (
                <CardContent className="space-y-4">
                  <div className="p-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md text-center">
                    {status.message}
                  </div>
                  <div className="mt-4 text-center">
                    <Link href="/auth/login" className="text-primary font-semibold hover:underline">
                      Return to Login
                    </Link>
                  </div>
                </CardContent>
              ) : (
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-slate-50 border-slate-200"
                      />
                    </div>
                    {status.type === 'error' && (
                      <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-100 rounded-md">
                        {status.message}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4 mt-4 border-none bg-transparent">
                    <Button type="submit" className="w-full bg-[#0B3D91] hover:bg-[#082b66] text-white" disabled={loading}>
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                    <div className="text-sm text-center text-slate-500">
                      Remember your password?{' '}
                      <Link href="/auth/login" className="font-semibold text-primary hover:underline">
                        Log in
                      </Link>
                    </div>
                  </CardFooter>
                </form>
              )}
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
