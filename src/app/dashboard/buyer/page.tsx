'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, MapPin, Trash2, CheckCircle2, TrendingDown } from 'lucide-react';

export default function BuyerDashboard() {
  const { user, fetchProfile } = useAuthStore();
  
  // Wallet State
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [topupAmount, setTopupAmount] = useState<string>('');
  const [isToppingUp, setIsToppingUp] = useState(false);

  // Addresses State
  const [addresses, setAddresses] = useState<any[]>([]);
  const [addressForm, setAddressForm] = useState({ label: '', full_address: '', phone_number: '', is_default: false });
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressError, setAddressError] = useState('');

  // Report State
  const [report, setReport] = useState<{total_spent: number, total_orders: number}>({ total_spent: 0, total_orders: 0 });

  useEffect(() => {
    fetchWalletData();
    fetchAddresses();
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const res = await api.get('/orders/report/');
      setReport(res.data);
    } catch (err) {
      console.error('Failed to fetch report', err);
    }
  };

  const fetchWalletData = async () => {
    try {
      const balRes = await api.get('/wallet/balance/');
      setBalance(balRes.data.balance);
      
      const transRes = await api.get('/wallet/transactions/');
      setTransactions(transRes.data);
    } catch (err) {
      console.error('Failed to fetch wallet data', err);
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/addresses/');
      setAddresses(res.data);
    } catch (err) {
      console.error('Failed to fetch addresses', err);
    }
  };

  const handleTopup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topupAmount || isNaN(Number(topupAmount)) || Number(topupAmount) <= 0) return;
    
    setIsToppingUp(true);
    try {
      await api.post('/wallet/topup/', { amount: Number(topupAmount) });
      await fetchWalletData();
      await fetchProfile(); // Update global user state if needed
      setTopupAmount('');
      alert('Top-up successful! Your balance has been updated.');
    } catch (err) {
      console.error('Topup failed', err);
      alert('Top-up failed. Please try again.');
    } finally {
      setIsToppingUp(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError('');
    setIsAddingAddress(true);
    try {
      await api.post('/addresses/', addressForm);
      await fetchAddresses();
      setAddressForm({ label: '', full_address: '', phone_number: '', is_default: false });
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
    <ProtectedRoute allowedRoles={['BUYER']}>
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Buyer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, <strong>{user?.username}</strong>! Manage your shopping experience here.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* WALLET SECTION */}
          <div className="space-y-6">
            <Card className="border-primary/20 shadow-sm overflow-hidden">
              <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Wallet className="w-5 h-5" /> Wallet Balance
                </CardTitle>
                <CardDescription>Your available funds for checkout</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-4xl font-extrabold text-slate-800 mb-6">
                  ${Number(balance).toFixed(2)}
                </div>
                
                <form onSubmit={handleTopup} className="flex gap-2">
                  <div className="flex-1">
                    <Input 
                      type="number" 
                      placeholder="Amount to top-up (e.g. 50)" 
                      value={topupAmount} 
                      onChange={e => setTopupAmount(e.target.value)}
                      min="1"
                      step="0.01"
                      required 
                    />
                  </div>
                  <Button type="submit" disabled={isToppingUp}>
                    {isToppingUp ? 'Processing...' : 'Top Up'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* EXPENSE SUMMARY */}
            <Card className="border-red-200/50 shadow-sm overflow-hidden">
              <CardHeader className="bg-red-50/50 pb-4">
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <TrendingDown className="w-5 h-5" /> Expense Summary
                </CardTitle>
                <CardDescription>Your total spending on active orders</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-slate-500">Total Spent</span>
                  <span className="text-4xl font-extrabold text-slate-800">
                    Rp {Number(report.total_spent).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm">
                  <span className="text-slate-600">Active/Completed Orders</span>
                  <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full">{report.total_orders}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8 bg-slate-50 rounded-lg text-sm border-dashed border-2">
                    No transactions yet.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                    {transactions.map(t => (
                      <div key={t.id} className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm">
                        <div>
                          <div className="font-semibold text-sm text-slate-800">{t.description}</div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">
                            {new Date(t.created_at).toLocaleString()}
                          </div>
                        </div>
                        <div className={`font-bold ${t.type === 'TOPUP' ? 'text-green-600' : 'text-slate-800'}`}>
                          {t.type === 'TOPUP' ? '+' : '-'}${Number(t.amount).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ADDRESS SECTION */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-slate-600" /> Delivery Addresses
                </CardTitle>
                <CardDescription>Manage where your items will be shipped</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Address List */}
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 pb-2">
                  {addresses.length === 0 ? (
                    <div className="text-center text-muted-foreground py-6 bg-slate-50 rounded-lg text-sm border-dashed border-2">
                      No addresses saved. Add one below!
                    </div>
                  ) : (
                    addresses.map(addr => (
                      <div key={addr.id} className={`p-4 border rounded-lg relative transition-all ${addr.is_default ? 'border-primary bg-primary/5 shadow-sm' : 'bg-white hover:border-slate-300'}`}>
                        {addr.is_default && (
                          <div className="absolute top-3 right-3 flex items-center text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Default
                          </div>
                        )}
                        <h4 className="font-bold text-slate-800 pr-20">{addr.label}</h4>
                        <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{addr.full_address}</p>
                        <p className="text-sm text-slate-500 mt-1">{addr.phone_number}</p>
                        
                        <div className="mt-4 flex items-center gap-2">
                          {!addr.is_default && (
                            <Button variant="outline" size="sm" onClick={() => handleSetDefaultAddress(addr.id)} className="h-8 text-xs font-semibold">
                              Set as Default
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteAddress(addr.id)} className="h-8 w-8 ml-auto text-red-500 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                  <Button variant="secondary" className="w-full" onClick={() => { setIsAddingAddress(true); setAddressError(''); }}>Add New Address</Button>
                </div>

                {/* Add Address Form */}
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-4 text-xs uppercase text-slate-500 tracking-wider">Add New Address</h4>
                  <form onSubmit={handleAddAddress} className="space-y-4">
                    {addressError && <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">{addressError}</div>}
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Address Label</Label>
                      <Input 
                        value={addressForm.label} 
                        onChange={e => setAddressForm({...addressForm, label: e.target.value})} 
                        required 
                        placeholder="e.g. Home, Office, Secret Base"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Full Address</Label>
                      <textarea 
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={addressForm.full_address} 
                        onChange={e => setAddressForm({...addressForm, full_address: e.target.value})} 
                        required 
                        placeholder="123 Ocean Drive, Atlantis City, Deep Sea 99999"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Phone Number</Label>
                      <Input 
                        value={addressForm.phone_number} 
                        onChange={e => setAddressForm({...addressForm, phone_number: e.target.value})} 
                        required 
                        placeholder="+628123456789"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <input 
                        type="checkbox" 
                        id="isDefault" 
                        checked={addressForm.is_default}
                        onChange={e => setAddressForm({...addressForm, is_default: e.target.checked})}
                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="isDefault" className="text-sm cursor-pointer select-none">Set as default delivery address</Label>
                    </div>
                    <Button type="submit" className="w-full mt-2" disabled={isAddingAddress}>
                      {isAddingAddress ? 'Saving Address...' : 'Save Address'}
                    </Button>
                  </form>
                </div>

              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}
