'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Calendar, Store, ShoppingCart } from 'lucide-react';
import { ToastNotification } from '@/components/shared/ToastNotification';

export default function DriverDashboardProfile() {
  const { user, addRole } = useAuthStore();
  const [isOpeningShop, setIsOpeningShop] = useState(false);
  const [isBecomingBuyer, setIsBecomingBuyer] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const hasSellerRole = user?.roles.includes('SELLER');
  const hasBuyerRole = user?.roles.includes('BUYER');

  const joinedDate = user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '-';

  const handleOpenShop = async () => {
    try {
      setIsOpeningShop(true);
      await addRole('SELLER');
    } catch (error) {
      console.error('Failed to open shop:', error);
      setToast({ show: true, message: 'Gagal membuka toko. Silakan coba lagi.' });
      setIsOpeningShop(false);
    }
  };

  const handleBecomeBuyer = async () => {
    try {
      setIsBecomingBuyer(true);
      await addRole('BUYER');
    } catch (error) {
      console.error('Failed to become buyer:', error);
      setToast({ show: true, message: 'Gagal mendaftar sebagai buyer. Silakan coba lagi.' });
      setIsBecomingBuyer(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Profil Saya</h1>

      <div className="grid grid-cols-1 gap-6">
        {/* Account Information Card */}
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

        {/* Upgrade Roles Card */}
        {(!hasSellerRole || !hasBuyerRole) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {!hasBuyerRole && (
              <Card className="border-blue-500/20 bg-blue-50">
                <CardContent className="flex flex-col h-full justify-between p-6 gap-6">
                  <div>
                    <div className="w-12 h-12 bg-blue-200 text-blue-700 rounded-lg flex items-center justify-center mb-4">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2">Mulai Belanja di Seapedia</h3>
                    <p className="text-sm text-slate-600">Nikmati kemudahan belanja dengan berbagai pilihan produk berkualitas!</p>
                  </div>
                  <Button 
                    onClick={handleBecomeBuyer} 
                    disabled={isBecomingBuyer}
                    className="w-full shadow-md bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {isBecomingBuyer ? 'Mendaftar...' : 'Mulai Belanja'}
                  </Button>
                </CardContent>
              </Card>
            )}

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
          </div>
        )}
      </div>

      <ToastNotification 
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
