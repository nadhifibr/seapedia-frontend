'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Package, Clock, CheckCircle2, Inbox } from 'lucide-react';
import api from '@/lib/api';

export default function SellerOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/incoming/');
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SEDANG_DIKEMAS':
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><Package className="w-3 h-3"/> Sedang Dikemas</span>;
      case 'MENUNGGU_PENGIRIM':
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><Clock className="w-3 h-3"/> Menunggu Pengirim</span>;
      case 'SEDANG_DIKIRIM':
        return <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Sedang Dikirim</span>;
      case 'PESANAN_SELESAI':
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Pesanan Selesai</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-24 text-center">Loading Orders...</div>;
  }

  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-800 mb-8">
          <Inbox className="w-8 h-8 text-primary" /> 
          Incoming Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-24 bg-slate-50 rounded-xl border border-dashed">
            <Inbox className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-700 mb-2">No incoming orders yet</h2>
            <p className="text-slate-500 mb-6">When customers buy from your store, their orders will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="bg-slate-50 border-b py-3 flex flex-row items-center justify-between">
                  <div>
                    <span className="text-sm text-slate-500 mr-2">Order ID:</span>
                    <span className="font-mono text-xs font-semibold text-slate-700">{order.id}</span>
                  </div>
                  <div>{getStatusBadge(order.status)}</div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-4 flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">Buyer:</span>
                        <span className="font-semibold text-slate-800">{order.buyer}</span>
                        <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{order.delivery_method}</span>
                      </div>
                      
                      <div className="space-y-3">
                        {order.items.map((item: any) => (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded border overflow-hidden shrink-0">
                                {item.product_image ? (
                                  <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">No Img</div>
                                )}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-slate-800">{item.product_name}</p>
                              <p className="text-xs text-slate-500">{item.quantity} x Rp {Number(item.price_snapshot).toLocaleString('id-ID')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="w-full md:w-64 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 flex flex-col justify-between">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Total Payment</p>
                        <p className="font-bold text-xl text-primary">Rp {Number(order.total).toLocaleString('id-ID')}</p>
                        <p className="text-xs text-slate-400 mt-2 line-clamp-2" title={order.address_snapshot}>
                          Deliver to: {order.address_snapshot}
                        </p>
                      </div>
                      <div className="mt-4 flex flex-col gap-2">
                        {order.status === 'SEDANG_DIKEMAS' && (
                          <Button className="w-full">
                            Request Driver
                          </Button>
                        )}
                        <Button variant="outline" className="w-full" disabled>
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
