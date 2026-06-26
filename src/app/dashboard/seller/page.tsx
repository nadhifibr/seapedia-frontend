'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingCart, Truck, User, Mail, Calendar, MapPin, Store as StoreIcon, Settings } from 'lucide-react';
import { ToastNotification } from '@/components/shared/ToastNotification';

export default function SellerDashboardProfile() {
  const { user, addRole } = useAuthStore();
  const [store, setStore] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isBecomingBuyer, setIsBecomingBuyer] = useState(false);
  const [isBecomingDriver, setIsBecomingDriver] = useState(false);
  
  // Store form state
  const [storeForm, setStoreForm] = useState({ name: '', description: '', image_url: '', location: '' });
  const [isStoreSubmitting, setIsStoreSubmitting] = useState(false);
  const [storeError, setStoreError] = useState('');
  const [isEditingStore, setIsEditingStore] = useState(false);

  const [toast, setToast] = useState({ show: false, message: '' });

  const hasBuyerRole = user?.roles.includes('BUYER');
  const hasDriverRole = user?.roles.includes('DRIVER');

  const joinedDate = user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '-';

  useEffect(() => {
    fetchStore();
  }, []);

  const fetchStore = async () => {
    try {
      const res = await api.get('/stores/my-store/');
      setStore(res.data);
      setStoreForm({ name: res.data.name, description: res.data.description, image_url: res.data.image_url || '', location: res.data.location || '' });
    } catch (err: any) {
      if (err.response?.status !== 404) {
        console.error('Failed to fetch store', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsStoreSubmitting(true);
    setStoreError('');
    try {
      if (store) {
        await api.patch('/stores/my-store/', storeForm);
      } else {
        await api.post('/stores/my-store/', storeForm);
      }
      await fetchStore();
      setIsEditingStore(false);
      setToast({ show: true, message: store ? 'Informasi toko diperbarui!' : 'Toko berhasil dibuat!' });
    } catch (err: any) {
      setStoreError(err.response?.data?.name?.[0] || err.response?.data?.detail || 'Gagal menyimpan data toko');
    } finally {
      setIsStoreSubmitting(false);
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

  const handleBecomeDriver = async () => {
    try {
      setIsBecomingDriver(true);
      await addRole('DRIVER');
    } catch (error) {
      console.error('Failed to become driver:', error);
      setToast({ show: true, message: 'Gagal mendaftar sebagai driver. Silakan coba lagi.' });
      setIsBecomingDriver(false);
    }
  };

  if (isLoading) return <div className="p-12 text-center text-lg">Loading Dashboard...</div>;

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

        {/* Store Information Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Informasi Toko</CardTitle>
              <CardDescription>Profil toko Anda yang dilihat oleh pelanggan</CardDescription>
            </div>
            {store && !isEditingStore && (
              <Button variant="outline" size="sm" onClick={() => setIsEditingStore(true)}>
                <Settings className="w-4 h-4 mr-2" /> Edit Toko
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {(!store || isEditingStore) ? (
              <form onSubmit={handleStoreSubmit} className="space-y-4 max-w-2xl mt-4">
                {storeError && <div className="text-red-500 text-sm font-medium p-2 bg-red-50 rounded">{storeError}</div>}
                <div className="space-y-2">
                  <Label htmlFor="storeName">Nama Toko</Label>
                  <Input id="storeName" value={storeForm.name} onChange={e => setStoreForm({...storeForm, name: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeDesc">Deskripsi</Label>
                  <textarea 
                    id="storeDesc" 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={storeForm.description} 
                    onChange={e => setStoreForm({...storeForm, description: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeLocation">Lokasi Toko (Opsional)</Label>
                  <select 
                    id="storeLocation"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={storeForm.location}
                    onChange={e => setStoreForm({...storeForm, location: e.target.value})}
                  >
                    <option value="">Pilih Lokasi</option>
                    <option value="JAKARTA">Jakarta</option>
                    <option value="TANGERANG">Tangerang</option>
                    <option value="ANYER">Anyer</option>
                    <option value="BALI">Bali</option>
                    <option value="LOMBOK">Lombok</option>
                    <option value="BATAM">Batam</option>
                    <option value="MANADO">Manado</option>
                    <option value="MAKASSAR">Makassar</option>
                    <option value="SURABAYA">Surabaya</option>
                    <option value="RAJA_AMPAT">Raja Ampat</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeImg">URL Logo Toko (Opsional)</Label>
                  <Input id="storeImg" type="url" placeholder="https://..." value={storeForm.image_url} onChange={e => setStoreForm({...storeForm, image_url: e.target.value})} />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isStoreSubmitting} className="flex-1">
                    {isStoreSubmitting ? 'Menyimpan...' : (store ? 'Simpan Perubahan' : 'Buat Toko Sekarang')}
                  </Button>
                  {store && (
                    <Button type="button" variant="outline" onClick={() => setIsEditingStore(false)}>
                      Batal
                    </Button>
                  )}
                </div>
              </form>
            ) : (
              <div className="flex flex-col md:flex-row gap-6 mt-4">
                {store.image_url ? (
                  <img src={store.image_url} alt={store.name} className="w-24 h-24 object-cover rounded-md border" />
                ) : (
                  <div className="w-24 h-24 bg-slate-100 flex items-center justify-center rounded-md border">
                    <StoreIcon className="w-8 h-8 text-slate-400" />
                  </div>
                )}
                <div className="space-y-2">
                  <h3 className="font-bold text-xl text-slate-800">{store.name}</h3>
                  <p className="text-slate-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" /> 
                    {store.location 
                      ? store.location.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l:string) => l.toUpperCase()) 
                      : 'Lokasi belum diatur'}
                  </p>
                  <p className="text-sm text-slate-500 max-w-md line-clamp-3">{store.description || 'Belum ada deskripsi.'}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upgrade Roles Card */}
        {(!hasBuyerRole || !hasDriverRole) && (
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

      <ToastNotification 
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
