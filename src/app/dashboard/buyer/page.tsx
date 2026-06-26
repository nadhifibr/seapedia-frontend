'use client';

import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store, Calendar, Mail, User, Truck } from 'lucide-react';
import { useState } from 'react';

export default function BuyerProfilePage() {
  const { user, addRole } = useAuthStore();
  const [isOpeningShop, setIsOpeningShop] = useState(false);
  const [isBecomingDriver, setIsBecomingDriver] = useState(false);

  const handleOpenShop = async () => {
    try {
      setIsOpeningShop(true);
      await addRole('SELLER');
      // The addRole function already handles the redirect to /dashboard/seller
    } catch (error) {
      console.error('Failed to open shop:', error);
      alert('Gagal membuka toko. Silakan coba lagi.');
      setIsOpeningShop(false);
    }
  };

  const handleBecomeDriver = async () => {
    try {
      setIsBecomingDriver(true);
      await addRole('DRIVER');
      // The addRole function already handles the redirect to /dashboard/driver
    } catch (error) {
      console.error('Failed to become driver:', error);
      alert('Gagal mendaftar sebagai driver. Silakan coba lagi.');
      setIsBecomingDriver(false);
    }
  };

  const hasSellerRole = user?.roles.includes('SELLER');
  const hasDriverRole = user?.roles.includes('DRIVER');
  const joinedDate = user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '-';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Profil Saya</h1>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informasi Akun</CardTitle>
            <CardDescription>Kelola informasi dasar akun Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 border-b pb-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Username</p>
                <p className="font-bold text-lg text-slate-800">{user?.username}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2 rounded-md text-slate-500">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Email</p>
                  <p className="font-semibold text-slate-800">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2 rounded-md text-slate-500">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Bergabung Sejak</p>
                  <p className="font-semibold text-slate-800">{joinedDate}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {(!hasSellerRole || !hasDriverRole) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {!hasSellerRole && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="flex flex-col h-full justify-between p-6 gap-6">
                  <div>
                    <div className="w-12 h-12 bg-primary/20 text-primary rounded-lg flex items-center justify-center mb-4">
                      <Store className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2">Mulai Berjualan di Seapedia</h3>
                    <p className="text-sm text-slate-600">Buka toko gratis dan jangkau lebih banyak pembeli di seluruh Indonesia!</p>
                  </div>
                  <Button 
                    onClick={handleOpenShop} 
                    disabled={isOpeningShop}
                    className="w-full shadow-md cursor-pointer"
                  >
                    <Store className="w-4 h-4 mr-2" />
                    {isOpeningShop ? 'Membuka Toko...' : 'Buka Toko Gratis'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {!hasDriverRole && (
              <Card className="border-green-500/20 bg-green-50">
                <CardContent className="flex flex-col h-full justify-between p-6 gap-6">
                  <div>
                    <div className="w-12 h-12 bg-green-200 text-green-700 rounded-lg flex items-center justify-center mb-4">
                      <Truck className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2">Jadi Mitra Driver Kami</h3>
                    <p className="text-sm text-slate-600">Dapatkan penghasilan tambahan dengan mengantar pesanan ke pelanggan!</p>
                  </div>
                  <Button 
                    onClick={handleBecomeDriver} 
                    disabled={isBecomingDriver}
                    className="w-full shadow-md bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    {isBecomingDriver ? 'Mendaftar...' : 'Daftar Jadi Driver'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
