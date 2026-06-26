'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import Link from 'next/link';
import Image from 'next/image';

export default function RoleSelectPage() {
  const { user, fetchProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const router = useRouter();

  // If user only has one role and it's already active, redirect them to landing page
  useEffect(() => {
    if (user?.active_role && user.roles.length === 1) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async () => {
    if (!selectedRole) {
      setError('Please select a role first.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/select-role/', { role: selectedRole });
      // update tokens in local storage
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      // refetch profile to get new active_role
      await fetchProfile();
      // route to landing page
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to select role.');
      setLoading(false);
    }
  };

  const getRoleImage = (role: string) => {
    switch (role) {
      case 'BUYER': return '/buyer.png';
      case 'SELLER': return 'seller.png';
      case 'DRIVER': return '/driver.png';
      case 'ADMIN': return '/categories/other_marine 1.png';
      default: return '/categories/ocean_apparel 1.png';
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'BUYER': return 'Explore the marketplace and shop for premium marine gear.';
      case 'SELLER': return 'Manage your store, products, and incoming orders.';
      case 'DRIVER': return 'Manage deliveries and track your active routes.';
      case 'ADMIN': return 'Oversee the entire marketplace operations.';
      default: return '';
    }
  };

  return (
    <ProtectedRoute>
      <div className="h-screen w-full flex flex-col relative bg-slate-50 overflow-hidden">
        
        {/* Header Logo */}
        <div className="absolute top-0 left-0 right-0 p-8 flex justify-center z-10">
          <Link href="/">
            <Image 
              src="/logo-text-navy.svg" 
              alt="Seapedia Logo" 
              width={160} 
              height={40} 
              priority
            />
          </Link>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 z-10">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Select Your Role</h1>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              You have multiple roles. How would you like to use SEAPEDIA today?
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200 max-w-md w-full text-center">
              {error}
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-6 max-w-5xl w-full mb-10 px-4">
            {user?.roles.map((role) => {
              const isSelected = selectedRole === role;
              
              return (
                <div 
                  key={role}
                  className={`relative w-36 md:w-44 cursor-pointer group rounded-xl transition-all duration-300
                    ${isSelected ? 'ring-4 ring-[#0B3D91] shadow-2xl scale-105' : 'hover:scale-105 shadow-md hover:shadow-xl'}`}
                  onClick={() => setSelectedRole(role)}
                >
                  <Card className="aspect-square md:aspect-[4/5] border-none ring-0 overflow-hidden relative w-full h-full bg-transparent">
                    {/* Background Image */}
                    <img 
                      src={getRoleImage(role)} 
                      alt={role} 
                      className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out 
                        ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`} 
                    />
                    
                    {/* Overlay Gradient */}
                    <div className={`absolute inset-0 transition-opacity duration-500
                      ${isSelected ? 'bg-gradient-to-t from-[#0B3D91]/90 via-slate-900/40 to-transparent' : 'bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent'}`} 
                    />
                    
                    {/* Content Container */}
                    <CardContent className="absolute inset-0 p-4 flex flex-col justify-end border-none">
                      <div className={`relative transform transition-transform duration-500 ease-out
                        ${isSelected ? '-translate-y-16 md:-translate-y-18' : 'group-hover:-translate-y-16 md:group-hover:-translate-y-18'}`}>
                        <h3 className="font-bold text-lg md:text-xl text-white mb-1 drop-shadow-md">
                          {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
                        </h3>
                        <div className={`absolute top-full left-0 w-full transition-opacity duration-500 delay-75
                          ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                          <p className="text-xs md:text-sm text-slate-200 line-clamp-4 drop-shadow-sm pb-1">
                            {getRoleDescription(role)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Selection Checkmark */}
                  {isSelected && (
                    <div className="absolute -top-3 -right-3 bg-[#0B3D91] text-white rounded-full p-1.5 shadow-lg z-20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="w-full max-w-sm">
            <Button 
              size="lg" 
              className="w-full bg-[#0B3D91] hover:bg-[#082b66] text-white cursor-pointer"
              onClick={handleSubmit}
              disabled={loading || !selectedRole}
            >
              {loading ? 'Processing...' : 'Continue'}
            </Button>
          </div>
        </div>

        {/* Footer Copyright */}
        <div className="absolute bottom-6 left-0 right-0 text-center z-10">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Seapedia. All rights reserved.
          </p>
        </div>

      </div>
    </ProtectedRoute>
  );
}
