'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon, ShoppingCart, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Navbar() {
  const { isAuthenticated, user, logout, fetchProfile, switchRole, addRole } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedUpgradeRole, setSelectedUpgradeRole] = useState('');
  const [isUpgrading, setIsUpgrading] = useState(false);

  const availableRoles = [];
  if (user?.roles && !user.roles.includes('ADMIN')) {
    if (!user.roles.includes('SELLER')) availableRoles.push('SELLER');
    if (!user.roles.includes('DRIVER')) availableRoles.push('DRIVER');
  }

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
    <>
    <nav className="bg-[#0B3D91] sticky top-0 z-50 shadow-sm py-3">
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
        <div className="flex-1 w-full relative hidden md:block">
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
              <div className="relative flex items-center group/navuser h-full py-1 cursor-pointer">
                <Link href={getDashboardPath()} className="flex items-center gap-2 md:gap-3">
                  <Button variant="ghost" size="icon" className="text-[#F8FAFC] group-hover/navuser:bg-white/10 group-hover/navuser:text-white pointer-events-none">
                    <UserIcon className="h-5 w-5" />
                  </Button>
                  <div className="hidden md:flex flex-col items-start justify-center">
                    <span className="text-sm font-medium text-[#F8FAFC] group-hover/navuser:text-white transition-colors leading-tight">
                      {user?.username}
                    </span>
                    {user?.roles && user.roles.length > 1 && user.active_role && (
                      <span className="text-[11px] text-[#ABB3C6] group-hover/navuser:text-white uppercase tracking-wide leading-tight mt-0.5">
                        {user.active_role}
                      </span>
                    )}
                  </div>
                </Link>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-[100%] mt-0 w-48 bg-white rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-slate-100 opacity-0 invisible group-hover/navuser:opacity-100 group-hover/navuser:visible transition-all duration-200 z-50 overflow-hidden transform origin-top-right scale-95 group-hover/navuser:scale-100">
                  <div className="py-1">
                    {/* Role switching options */}
                    {/* {user?.roles && user.roles.length > 1 && (
                      <div className="px-4 py-2 text-[10px] font-bold text-slate-400 tracking-wider bg-slate-50/50 border-b border-slate-100">
                        Ganti Role
                      </div>
                    )} */}
                    {user?.roles && user.roles.length > 1 && user.roles.map((role) => (
                      <button
                        key={role}
                        onClick={() => switchRole(role)}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${user.active_role === role ? 'bg-blue-50 text-[#0B3D91] font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
                      >
                        {role === 'BUYER' ? 'Buyer' : role === 'SELLER' ? 'Seller' : 'Driver'}
                        {user.active_role === role && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#0B3D91]"></div>
                        )}
                      </button>
                    ))}

                    {user?.roles && user.roles.length > 1 && <div className="h-px bg-slate-100 my-1"></div>}

                    {availableRoles.length > 0 && (
                      <>
                        {availableRoles.includes('SELLER') && (
                          <button
                            onClick={() => { setSelectedUpgradeRole('SELLER'); setIsUpgradeModalOpen(true); }}
                            className="w-full text-left px-4 py-2.5 text-sm text-[#0B3D91] hover:bg-blue-50/50 font-medium transition-colors cursor-pointer"
                          >
                            Buka Toko Gratis
                          </button>
                        )}
                        {availableRoles.includes('DRIVER') && (
                          <button
                            onClick={() => { setSelectedUpgradeRole('DRIVER'); setIsUpgradeModalOpen(true); }}
                            className="w-full text-left px-4 py-2.5 text-sm text-[#0B3D91] hover:bg-blue-50/50 font-medium transition-colors cursor-pointer"
                          >
                            Daftar Jadi Driver
                          </button>
                        )}
                        <div className="h-px bg-slate-100 my-1"></div>
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Keluar
                    </button>
                  </div>
                </div>
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
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isUpgrading && setIsUpgradeModalOpen(false)}></div>
          <div className="relative bg-white shadow-2xl rounded-2xl w-full max-w-sm p-6 overflow-hidden transform transition-all">
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {selectedUpgradeRole === 'SELLER' ? 'Buka Toko Sekarang?' : 'Jadi Driver Sekarang?'}
              </h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                {selectedUpgradeRole === 'SELLER' 
                  ? 'Tingkatkan akunmu untuk mulai berjualan dan jangkau lebih banyak pelanggan di Seapedia. Gratis!' 
                  : 'Bergabunglah menjadi mitra pengemudi kami dan dapatkan penghasilan tambahan setiap harinya.'}
              </p>
              
              <div className="flex gap-3">
                <Button 
                  onClick={() => setIsUpgradeModalOpen(false)}
                  disabled={isUpgrading}
                  className="flex-1 bg-[#F8FAFC] text-[#0F172A] border-2 border-[#0F172A] hover:bg-slate-200 font-normal cursor-pointer"
                >
                  Batal
                </Button>
                <Button 
                  onClick={async () => {
                    setIsUpgrading(true);
                    try {
                      await addRole(selectedUpgradeRole);
                      setIsUpgradeModalOpen(false);
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setIsUpgrading(false);
                    }
                  }}
                  disabled={isUpgrading}
                  className="flex-1 bg-[#0F172A] text-white hover:bg-[#0F172A]/90 font-normal border-none cursor-pointer"
                >
                  {isUpgrading ? 'Memproses...' : 'Lanjutkan'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
