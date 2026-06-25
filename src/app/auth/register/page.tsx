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

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [roles, setRoles] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRoleToggle = (role: string) => {
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (roles.length === 0) {
      setError('Please select at least one role to register.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/register/', { ...formData, roles });
      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err: any) {
      const errorMsg = err.response?.data
        ? Object.values(err.response.data).flat().join(' ')
        : 'Registration failed. Please try again.';
      setError(errorMsg);
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

        {/* Right Panel - Register Form */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-8 relative overflow-y-auto">
          
          <div className="w-full max-w-md mb-4 lg:mt-0 text-center">
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

          <div className="w-full max-w-md mb-8">
            <Card className="border-none ring-0 shadow-none bg-transparent w-full">
              <CardHeader className="pt-0">
                <CardTitle className="text-2xl font-bold text-slate-900">Create an Account</CardTitle>
                <CardDescription className="text-slate-500">
                  Join the largest marketplace for ocean enthusiasts
                </CardDescription>
              </CardHeader>
              
              {success ? (
                <CardContent>
                  <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-md text-center">
                    <h3 className="font-bold mb-1">Registration Successful!</h3>
                    <p className="text-sm">Redirecting to login page...</p>
                  </div>
                </CardContent>
              ) : (
                <form onSubmit={handleRegister}>
                  <CardContent className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="johndoe"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                        className="bg-slate-50 border-slate-200"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="bg-slate-50 border-slate-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        className="bg-slate-50 border-slate-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>I want to join as a:</Label>
                      <div className="flex gap-4">
                        {['BUYER', 'SELLER', 'DRIVER'].map((role) => (
                          <div key={role} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`role-${role}`}
                              checked={roles.includes(role)}
                              onChange={() => handleRoleToggle(role)}
                              className="w-4 h-4 text-primary bg-slate-50 border-slate-300 rounded focus:ring-primary"
                            />
                            <Label htmlFor={`role-${role}`} className="font-normal cursor-pointer capitalize">
                              {role.toLowerCase()}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {error && (
                      <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-100 rounded-md">
                        {error}
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="flex flex-col space-y-4 mt-4 border-none bg-transparent">
                    <Button type="submit" className="w-full bg-[#0B3D91] hover:bg-[#082b66] text-white" disabled={loading}>
                      {loading ? 'Creating account...' : 'Create Account'}
                    </Button>
                    <div className="text-sm text-center text-slate-500">
                      Already have an account?{' '}
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
