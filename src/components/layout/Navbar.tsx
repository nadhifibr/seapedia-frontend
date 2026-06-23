'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon, Store, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Navbar() {
  const { isAuthenticated, user, logout, fetchProfile } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const getDashboardPath = () => {
    if (!user || !user.active_role) return '/role-select';
    return `/dashboard/${user.active_role.toLowerCase()}`;
  };

  return (
    <nav className="border-b bg-background sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
            <Store className="h-6 w-6" />
            SEAPEDIA
          </Link>
          <div className="hidden md:flex gap-4">
            <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">Browse Products</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {mounted && (
            isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground hidden md:inline-block">
                  Hi, {user?.username} {user?.active_role && <span className="text-primary font-bold">({user.active_role})</span>}
                </span>
                {user?.roles?.includes('BUYER') && (
                  <Link href="/cart">
                    <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                      <ShoppingCart className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                <Link href={getDashboardPath()}>
                  <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                    <UserIcon className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Register</Button>
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
