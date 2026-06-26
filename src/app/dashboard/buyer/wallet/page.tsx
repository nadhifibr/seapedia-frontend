'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { ToastNotification } from '@/components/shared/ToastNotification';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wallet, TrendingDown } from 'lucide-react';

export default function BuyerWalletPage() {
  const { fetchProfile } = useAuthStore();
  
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [topupAmount, setTopupAmount] = useState<string>('');
  const [isToppingUp, setIsToppingUp] = useState(false);
  const [report, setReport] = useState<{total_spent: number, total_orders: number}>({ total_spent: 0, total_orders: 0 });
  const [toastConfig, setToastConfig] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  useEffect(() => {
    fetchWalletData();
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

  const handleTopupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setTopupAmount(rawValue);
  };

  const handleTopup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topupAmount || Number(topupAmount) <= 0) return;
    
    setIsToppingUp(true);
    try {
      await api.post('/wallet/topup/', { amount: Number(topupAmount) });
      await fetchWalletData();
      await fetchProfile(); // Update global user state if needed
      setTopupAmount('');
      setToastConfig({ show: true, message: 'Top-up berhasil! Saldo dompet Anda telah ditambahkan.' });
    } catch (err) {
      console.error('Topup failed', err);
      setToastConfig({ show: true, message: 'Top-up gagal. Silakan coba lagi.' });
    } finally {
      setIsToppingUp(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Dompet Saya</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-primary/20 shadow-sm overflow-hidden">
          <CardHeader className="pb-4 border-b mb-4">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Wallet className="w-5 h-5" /> Saldo Dompet
            </CardTitle>
            <CardDescription>Dana tersedia untuk checkout</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-4xl font-extrabold text-slate-800 mb-6">
              Rp {Number(balance).toLocaleString('id-ID')}
            </div>
            
            <form onSubmit={handleTopup} className="flex gap-2">
              <div className="flex-1 relative flex items-center">
                <span className="absolute left-3 text-slate-500 font-medium">Rp</span>
                <Input 
                  type="text" 
                  placeholder="Jumlah top-up" 
                  value={topupAmount ? Number(topupAmount).toLocaleString('id-ID') : ''} 
                  onChange={handleTopupChange}
                  className="pl-9"
                  required 
                />
              </div>
              <Button type="submit" className="cursor-pointer" disabled={isToppingUp}>
                {isToppingUp ? 'Memproses...' : 'Top Up'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* EXPENSE SUMMARY */}
        <Card className="border-red-200/50 shadow-sm overflow-hidden">
          <CardHeader className="pb-4 border-b mb-4">
            <CardTitle className="flex items-center gap-2 text-red-600">
              <TrendingDown className="w-5 h-5" /> Ringkasan Pengeluaran
            </CardTitle>
            <CardDescription>Total belanja pesanan aktif/selesai</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-500">Total Dikeluarkan</span>
              <span className="text-4xl font-extrabold text-slate-800">
                Rp {Number(report.total_spent).toLocaleString('id-ID')}
              </span>
            </div>
            <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm">
              <span className="text-slate-600">Pesanan Aktif/Selesai</span>
              <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full">{report.total_orders}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Riwayat Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center text-muted-foreground py-8 bg-slate-50 rounded-lg text-sm border-dashed border-2">
              Belum ada transaksi.
            </div>
          ) : (
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
              {transactions.map(t => (
                <div key={t.id} className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm">
                  <div>
                    <div className="font-semibold text-sm text-slate-800">{t.description}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">
                      {new Date(t.created_at).toLocaleString('id-ID')}
                    </div>
                  </div>
                  <div className={`font-bold ${t.type === 'TOPUP' ? 'text-green-600' : 'text-slate-800'}`}>
                    {t.type === 'TOPUP' ? '+' : '-'}Rp {Number(t.amount).toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ToastNotification 
        show={toastConfig.show} 
        message={toastConfig.message} 
        onClose={() => setToastConfig({ ...toastConfig, show: false })} 
      />
    </div>
  );
}
