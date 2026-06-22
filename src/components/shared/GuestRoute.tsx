'use client';

import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, user } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && isAuthenticated) {
      // If already logged in, redirect them away from guest pages (like login/register)
      if (!user?.active_role) {
        router.push('/role-select');
      } else {
        router.push(`/dashboard/${user.active_role.toLowerCase()}`);
      }
    }
  }, [isAuthenticated, loading, router, mounted, user]);

  if (!mounted || loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
