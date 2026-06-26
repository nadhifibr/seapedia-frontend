'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingCart, Truck } from 'lucide-react';

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

  const hasBuyerRole = user?.roles.includes('BUYER');
  const hasDriverRole = user?.roles.includes('DRIVER');

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
      alert(store ? 'Store updated!' : 'Store created successfully!');
    } catch (err: any) {
      setStoreError(err.response?.data?.name?.[0] || err.response?.data?.detail || 'Failed to save store');
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
      alert('Gagal mendaftar sebagai buyer. Silakan coba lagi.');
      setIsBecomingBuyer(false);
    }
  };

  const handleBecomeDriver = async () => {
    try {
      setIsBecomingDriver(true);
      await addRole('DRIVER');
    } catch (error) {
      console.error('Failed to become driver:', error);
      alert('Gagal mendaftar sebagai driver. Silakan coba lagi.');
      setIsBecomingDriver(false);
    }
  };

  if (isLoading) return <div className="p-12 text-center text-lg">Loading Dashboard...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Welcome back, <strong>{user?.username}</strong>!</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{store ? 'Manage Store' : 'Create Store'}</CardTitle>
          <CardDescription>Your store is your public identity.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleStoreSubmit} className="space-y-4 max-w-2xl">
            {storeError && <div className="text-red-500 text-sm font-medium p-2 bg-red-50 rounded">{storeError}</div>}
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input id="storeName" value={storeForm.name} onChange={e => setStoreForm({...storeForm, name: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeDesc">Description</Label>
              <textarea 
                id="storeDesc" 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={storeForm.description} 
                onChange={e => setStoreForm({...storeForm, description: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeLocation">Store Location (Optional)</Label>
              <select 
                id="storeLocation"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={storeForm.location}
                onChange={e => setStoreForm({...storeForm, location: e.target.value})}
              >
                <option value="">Select a Location</option>
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
              <Label htmlFor="storeImg">Store Logo URL</Label>
              <Input id="storeImg" type="url" placeholder="https://..." value={storeForm.image_url} onChange={e => setStoreForm({...storeForm, image_url: e.target.value})} />
            </div>
            <Button type="submit" disabled={isStoreSubmitting} className="w-full">
              {isStoreSubmitting ? 'Saving...' : (store ? 'Update Store Info' : 'Create My Store')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {(!hasBuyerRole || !hasDriverRole) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t">
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
  );
}
