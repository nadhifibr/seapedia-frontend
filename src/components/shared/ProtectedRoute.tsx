'use client';

import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { isAuthenticated, loading, user } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router, mounted]);

  if (!mounted || loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = user?.roles?.some(role => allowedRoles.includes(role));
    if (!hasRole) {
      return (
        <div className="flex h-screen items-center justify-center flex-col">
          <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
          <p>You do not have permission to access this page.</p>
        </div>
      );
    }
  }

  return <>{children}</>;
}
