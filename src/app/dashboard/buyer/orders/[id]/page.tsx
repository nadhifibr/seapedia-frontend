'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, Clock, CheckCircle2, MapPin, CreditCard, Store } from 'lucide-react';
import api from '@/lib/api';

export default function BuyerOrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // In Next.js App router, params might need to be resolved or accessed directly. 
  // For basic strings, params.id works fine if the component is Server Component, 
  // but for 'use client', standard destructing works in simple Next versions.
  useEffect(() => {
    fetchOrderDetails();
  }, [params.id]);

  const fetchOrderDetails = async () => {
    try {
      const res = await api.get(`/orders/${params.id}/`);
      setOrder(res.data);
    } catch (err) {
      console.error('Failed to fetch order details', err);
      alert('Failed to load order details.');
      router.push('/dashboard/buyer/orders');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SEDANG_DIKEMAS':
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1"><Package className="w-4 h-4"/> Sedang Dikemas</span>;
      case 'MENUNGGU_PENGIRIM':
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1"><Clock className="w-4 h-4"/> Menunggu Pengirim</span>;
      case 'SEDANG_DIKIRIM':
        return <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Sedang Dikirim</span>;
      case 'PESANAN_SELESAI':
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Pesanan Selesai</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-sm font-semibold">{status}</span>;
    }
  };

  if (isLoading) {
    return <div className="max-w-4xl mx-auto px-4 py-24 text-center">Loading Order Details...</div>;
  }

  if (!order) return null;

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Button variant="ghost" onClick={() => router.push('/dashboard/buyer/orders')} className="mb-6 -ml-4 text-slate-500 hover:text-slate-800">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Orders
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
              Order Details
            </h1>
            <p className="text-slate-500 font-mono text-sm mt-1">ID: {order.id}</p>
          </div>
          <div>
            {getStatusBadge(order.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Products List */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50 border-b py-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Store className="w-5 h-5 text-primary" />
                  {order.store_name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-4 space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                      <div className="w-20 h-20 bg-slate-100 rounded border overflow-hidden shrink-0">
                        {item.product_image ? (
                          <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">No Img</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-800 text-lg">{item.product_name}</p>
                        <p className="text-slate-500">{item.quantity} x Rp {Number(item.price_snapshot).toLocaleString('id-ID')}</p>
                      </div>
                      <div className="font-bold text-slate-800 text-lg">
                        Rp {(item.quantity * Number(item.price_snapshot)).toLocaleString('id-ID')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Info */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50 border-b py-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex gap-2">
                  <span className="text-slate-500 font-medium w-32">Method:</span>
                  <span className="font-semibold text-slate-800 bg-slate-100 px-2 rounded">{order.delivery_method}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-500 font-medium w-32 shrink-0">Address:</span>
                  <span className="text-slate-800 whitespace-pre-wrap">{order.address_snapshot}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Payment Summary */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50 border-b py-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-800">Rp {Number(order.subtotal).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-slate-800">Rp {Number(order.delivery_fee).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (PPN 12%)</span>
                  <span className="font-medium text-slate-800">Rp {Number(order.tax_amount).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-4 text-slate-800 mt-2">
                  <span>Total Paid</span>
                  <span className="text-primary">Rp {Number(order.total).toLocaleString('id-ID')}</span>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline / History */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50 border-b py-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {order.status_history.map((history: any, index: number) => (
                    <div key={index} className="flex gap-4 relative">
                      {index !== order.status_history.length - 1 && (
                        <div className="absolute left-1.5 top-6 bottom-[-24px] w-0.5 bg-slate-200"></div>
                      )}
                      <div className="w-3 h-3 rounded-full bg-primary mt-1.5 shrink-0 relative z-10 ring-4 ring-white"></div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{history.status}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{new Date(history.changed_at).toLocaleString()}</p>
                        {history.note && <p className="text-xs text-slate-600 mt-1">{history.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
