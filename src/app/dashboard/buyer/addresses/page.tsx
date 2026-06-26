'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Trash2, CheckCircle2 } from 'lucide-react';

export default function BuyerAddressPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [addressForm, setAddressForm] = useState({ label: '', full_address: '', phone_number: '', location: '', is_default: false });
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressError, setAddressError] = useState('');

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/addresses/');
      setAddresses(res.data);
    } catch (err) {
      console.error('Failed to fetch addresses', err);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError('');
    setIsAddingAddress(true);
    try {
      const payload = {
        ...addressForm,
        phone_number: addressForm.phone_number ? `0${addressForm.phone_number}` : ''
      };
      await api.post('/addresses/', payload);
      await fetchAddresses();
      setAddressForm({ label: '', full_address: '', phone_number: '', location: '', is_default: false });
      setIsAddingAddress(false);
    } catch (err: any) {
      console.error('Failed to add address', err);
      const errorMsg = err.response?.data 
        ? Object.values(err.response.data).flat().join(' ') 
        : 'Failed to add address';
      setAddressError(errorMsg);
    } finally {
      setIsAddingAddress(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await api.delete(`/addresses/${id}/`);
      await fetchAddresses();
    } catch (err) {
      console.error('Failed to delete address', err);
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      await api.patch(`/addresses/${id}/`, { is_default: true });
      await fetchAddresses();
    } catch (err) {
      console.error('Failed to set default address', err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Alamat Saya</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-slate-600" /> Daftar Alamat Pengiriman
          </CardTitle>
          <CardDescription>Kelola alamat pengiriman pesanan Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Address List */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 pb-2">
            {addresses.length === 0 ? (
              <div className="text-center text-muted-foreground py-6 bg-slate-50 rounded-lg text-sm border-dashed border-2">
                Belum ada alamat. Tambahkan di bawah!
              </div>
            ) : (
              addresses.map(addr => (
                <div key={addr.id} className={`p-4 border rounded-lg relative transition-all ${addr.is_default ? 'border-primary bg-primary/5 shadow-sm' : 'bg-white hover:border-slate-300'}`}>
                  {addr.is_default && (
                    <div className="absolute top-3 right-3 flex items-center text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Utama
                    </div>
                  )}
                  <div className="flex items-center justify-between pr-20">
                    <h4 className="font-bold text-slate-800">{addr.label}</h4>
                    {addr.location && (
                      <div className="flex items-center text-xs font-medium text-slate-500">
                        <MapPin className="w-3 h-3 mr-1 text-primary" />
                        {addr.location.replace('_', ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{addr.full_address}</p>
                  <p className="text-sm text-slate-500 mt-1">{addr.phone_number}</p>
                  
                  <div className="mt-4 flex items-center gap-2">
                    {!addr.is_default && (
                      <Button variant="outline" size="sm" onClick={() => handleSetDefaultAddress(addr.id)} className="h-8 text-xs font-semibold">
                        Jadikan Utama
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteAddress(addr.id)} className="h-8 w-8 ml-auto text-red-500 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Address Form */}
          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-4 text-xs uppercase text-slate-500 tracking-wider">Tambah Alamat Baru</h4>
            <form onSubmit={handleAddAddress} className="space-y-4">
              {addressError && <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">{addressError}</div>}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Label Alamat</Label>
                <Input 
                  value={addressForm.label} 
                  onChange={e => setAddressForm({...addressForm, label: e.target.value})} 
                  required 
                  placeholder="Contoh: Rumah, Kantor, Kosan"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Alamat Lengkap</Label>
                <textarea 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={addressForm.full_address} 
                  onChange={e => setAddressForm({...addressForm, full_address: e.target.value})} 
                  required 
                  placeholder="Jl. Raya Kemerdekaan No. 1, RT 01/RW 02, Kec. Merdeka"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Kota/Wilayah</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={addressForm.location}
                  onChange={e => setAddressForm({...addressForm, location: e.target.value})}
                  required
                >
                  <option value="">Pilih Kota</option>
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
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Nomor Telepon</Label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-500 font-medium">+62</span>
                  <Input 
                    value={addressForm.phone_number} 
                    onChange={e => {
                      const digits = e.target.value.replace(/\D/g, '');
                      const noLeadingZero = digits.startsWith('0') ? digits.slice(1) : digits;
                      setAddressForm({...addressForm, phone_number: noLeadingZero});
                    }} 
                    required 
                    className="pl-11"
                    placeholder="8123456789"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="isDefault" 
                  checked={addressForm.is_default}
                  onChange={e => setAddressForm({...addressForm, is_default: e.target.checked})}
                  className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="isDefault" className="text-sm cursor-pointer select-none">Jadikan sebagai alamat utama</Label>
              </div>
              <Button type="submit" className="w-full mt-2" disabled={isAddingAddress}>
                {isAddingAddress ? 'Menyimpan...' : 'Simpan Alamat'}
              </Button>
            </form>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
