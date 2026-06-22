'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { ShoppingBag, Store, Truck, ShieldAlert } from 'lucide-react';

export default function RoleSelectPage() {
  const { user, fetchProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // If user only has one role and it's already active, redirect them
  useEffect(() => {
    if (user?.active_role && user.roles.length === 1) {
      router.push(`/dashboard/${user.active_role.toLowerCase()}`);
    }
  }, [user, router]);

  const handleSelectRole = async (role: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/select-role/', { role });
      // update tokens in local storage
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      // refetch profile to get new active_role
      await fetchProfile();
      // route to dashboard
      router.push(`/dashboard/${role.toLowerCase()}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to select role.');
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'BUYER': return <ShoppingBag className="h-8 w-8 mb-2" />;
      case 'SELLER': return <Store className="h-8 w-8 mb-2" />;
      case 'DRIVER': return <Truck className="h-8 w-8 mb-2" />;
      case 'ADMIN': return <ShieldAlert className="h-8 w-8 mb-2" />;
      default: return null;
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'BUYER': return 'Shop for products';
      case 'SELLER': return 'Manage your store';
      case 'DRIVER': return 'Deliver orders';
      case 'ADMIN': return 'Manage marketplace';
      default: return '';
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center py-24 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Select Your Session Role</h1>
          <p className="text-muted-foreground">You have multiple roles. How would you like to use SEAPEDIA today?</p>
        </div>

        {error && <div className="mb-6 p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200 max-w-md w-full text-center">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl w-full">
          {user?.roles.map((role) => (
            <Card 
              key={role} 
              className={`cursor-pointer transition-all hover:shadow-md hover:border-primary ${loading ? 'opacity-50 pointer-events-none' : ''}`}
              onClick={() => handleSelectRole(role)}
            >
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-primary/10 p-4 rounded-full text-primary mb-2">
                  {getRoleIcon(role)}
                </div>
                <CardTitle>{role}</CardTitle>
                <CardDescription>{getRoleDescription(role)}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 text-center">
                <Button variant={user.active_role === role ? "default" : "outline"} className="w-full">
                  {user.active_role === role ? 'Current Active' : 'Select'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
