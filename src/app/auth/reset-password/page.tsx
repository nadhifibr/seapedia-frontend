'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { GuestRoute } from '@/components/shared/GuestRoute';
import Link from 'next/link';
import Image from 'next/image';
import { AuthImageCarousel } from '@/components/auth/AuthImageCarousel';

function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<{type: 'idle' | 'success' | 'error', message: string}>({ type: 'idle', message: '' });
  const [loading, setLoading] = useState(false);
  
  const searchParams = useSearchParams();
  const uidb64 = searchParams.get('uid');
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    if (!uidb64 || !token) {
      setStatus({ type: 'error', message: 'Invalid or missing reset token.' });
      return;
    }

    setStatus({ type: 'idle', message: '' });
    setLoading(true);

    try {
      const response = await api.post('/auth/password-reset-confirm/', { 
        uidb64, 
        token, 
        new_password: newPassword,
        confirm_password: confirmPassword
      });
      setStatus({ type: 'success', message: response.data.detail || 'Password has been reset successfully.' });
    } catch (err: any) {
      // If validation error from serializers (like password too short), it might be an object
      let errorMsg = 'Failed to reset password. The link might be expired or invalid.';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
           errorMsg = err.response.data;
        } else if (err.response.data.detail) {
           errorMsg = err.response.data.detail;
        } else if (typeof err.response.data === 'object') {
           // get first error message
           const firstKey = Object.keys(err.response.data)[0];
           const firstErr = err.response.data[firstKey];
           errorMsg = Array.isArray(firstErr) ? firstErr[0] : firstErr;
        }
      }
      setStatus({ type: 'error', message: errorMsg });
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

        {/* Right Panel - Reset Password Form */}
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
                <CardTitle className="text-2xl font-bold text-slate-900">Set New Password</CardTitle>
                <CardDescription className="text-slate-500">
                  Please enter your new password below.
                </CardDescription>
              </CardHeader>
              
              {status.type === 'success' ? (
                <CardContent className="space-y-4">
                  <div className="p-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md text-center">
                    {status.message}
                  </div>
                  <div className="mt-4 text-center">
                    <Link href="/auth/login" className="text-primary font-semibold hover:underline">
                      Go to Login
                    </Link>
                  </div>
                </CardContent>
              ) : (
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="bg-slate-50 border-slate-200"
                        minLength={8}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="bg-slate-50 border-slate-200"
                        minLength={8}
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
                      {loading ? 'Resetting...' : 'Reset Password'}
                    </Button>
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="h-screen flex w-full bg-white items-center justify-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
