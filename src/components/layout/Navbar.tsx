'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon, ShoppingCart, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Navbar() {
  const { isAuthenticated, user, logout, fetchProfile } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/products');
    }
  };

  const getDashboardPath = () => {
    if (!user || !user.active_role) return '/role-select';
    return `/dashboard/${user.active_role.toLowerCase()}`;
  };

  return (
    <nav className="bg-[#0B3D91] sticky top-0 z-10 shadow-sm py-3">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-6">
        
        {/* Left: Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image 
            src="/logo-text-white.svg" 
            alt="SEAPEDIA" 
            width={120} 
            height={30} 
            className="h-6 w-auto object-contain"
            priority
          />
        </Link>
        
        {/* Middle: Search bar */}
        <div className="flex-1 max-w-3xl relative hidden md:block">
           <form onSubmit={handleSearch}>
             <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
               <Search className="h-5 w-5 text-[#ABB3C6]" />
             </div>
             <input 
               type="text" 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="Cari brand, produk, atau seller" 
               className="w-full bg-[#F8FAFC] text-slate-800 placeholder:text-[#ABB3C6] rounded-md py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-slate-300"
             />
           </form>
        </div>

        {/* Right: Cart and Actions */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <Link href="/cart" className="text-[#F8FAFC] hover:text-white transition-colors relative flex items-center justify-center h-10 w-10">
            <ShoppingCart className="h-6 w-6" />
          </Link>
          
          <div className="h-8 w-px bg-[#F8FAFC]/40 mx-1"></div>

          {mounted && (
            isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[#F8FAFC] hidden md:inline-block">
                  Hai, {user?.username}
                </span>
                {user?.active_role && (
                  <Link href={`/dashboard/${user.active_role.toLowerCase()}/orders`}>
                    <Button variant="ghost" size="sm" className="hidden md:flex text-[#F8FAFC] hover:bg-white/10 hover:text-white">
                      Pesanan
                    </Button>
                  </Link>
                )}
                <Link href={getDashboardPath()}>
                  <Button variant="ghost" size="icon" className="text-[#F8FAFC] hover:bg-white/10 hover:text-white">
                    <UserIcon className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-[#F8FAFC] hover:bg-white/10 hover:text-white">
                  <LogOut className="h-4 w-4 mr-2" />
                  Keluar
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login">
                  <Button className="bg-[#0F172A] text-white hover:bg-[#0F172A]/90 font-normal border-none px-6 cursor-pointer">
                    Masuk
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-[#F8FAFC] text-[#0F172A] border-2 border-[#0F172A] hover:bg-slate-200 font-normal px-6 cursor-pointer">
                    Daftar
                  </Button>
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
