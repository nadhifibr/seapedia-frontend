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
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [expandedOrderIds, setExpandedOrderIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleProcessOrder = async (orderId: string) => {
    setIsProcessing(orderId);
    try {
      await api.post(`/orders/incoming/${orderId}/process/`);
      fetchOrders(); // Refetch to get updated status_history
    } catch (err: any) {
      console.error('Failed to process order', err);
      alert(err.response?.data?.detail || 'Failed to process order.');
    } finally {
      setIsProcessing(null);
    }
  };

  const toggleExpand = (orderId: string) => {
    const newSet = new Set(expandedOrderIds);
    if (newSet.has(orderId)) {
      newSet.delete(orderId);
    } else {
      newSet.add(orderId);
    }
    setExpandedOrderIds(newSet);
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/incoming/');
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else if (res.data && Array.isArray(res.data.results)) {
        setOrders(res.data.results);
      } else {
        setOrders([]);
      }
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
    <div className="space-y-8">
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
                        <p className="text-xs font-semibold text-slate-600 mb-2 border-b pb-1">Payment Breakdown</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between text-slate-600">
                            <span>Subtotal</span>
                            <span>Rp {Number(order.subtotal).toLocaleString('id-ID')}</span>
                          </div>
                          {Number(order.discount_amount) > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Discount {order.discount_type ? `(${order.discount_type})` : ''}</span>
                              <span>-Rp {Number(order.discount_amount).toLocaleString('id-ID')}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-slate-600">
                            <span>Delivery Fee</span>
                            <span>Rp {Number(order.delivery_fee).toLocaleString('id-ID')}</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Tax (PPN)</span>
                            <span>Rp {Number(order.tax_amount).toLocaleString('id-ID')}</span>
                          </div>
                          <div className="flex justify-between font-bold text-primary border-t pt-1 mt-1">
                            <span>Total Paid by Buyer</span>
                            <span>Rp {Number(order.total).toLocaleString('id-ID')}</span>
                          </div>
                          <div className="flex justify-between font-bold text-green-700 bg-green-50 p-1.5 rounded mt-2">
                            <span>Your Revenue</span>
                            <span>Rp {Number(order.subtotal - order.discount_amount).toLocaleString('id-ID')}</span>
                          </div>
                        </div>
                        
                        <div className="mt-3 bg-slate-50 p-2 rounded border border-slate-100">
                          <p className="text-xs font-semibold text-slate-600 mb-1">Deliver to:</p>
                          <p className="text-xs text-slate-500 line-clamp-2" title={order.address_snapshot}>
                            {order.address_snapshot}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-col gap-2">
                        {order.status === 'SEDANG_DIKEMAS' && (
                          <Button 
                            className="w-full"
                            onClick={() => handleProcessOrder(order.id)}
                            disabled={isProcessing === order.id}
                          >
                            {isProcessing === order.id ? 'Processing...' : 'Request Driver'}
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => toggleExpand(order.id)}
                        >
                          {expandedOrderIds.has(order.id) ? 'Hide Details' : 'View Details'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                {expandedOrderIds.has(order.id) && (
                  <div className="bg-slate-50 border-t p-6">
                    <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
                      <Clock className="w-4 h-4 text-primary" /> Order Timeline
                    </h4>
                    <div className="space-y-4">
                      {order.status_history?.map((history: any, index: number) => (
                        <div key={index} className="flex gap-4 relative">
                          {index !== order.status_history.length - 1 && (
                            <div className="absolute left-1.5 top-6 bottom-[-24px] w-0.5 bg-slate-200"></div>
                          )}
                          <div className="w-3 h-3 rounded-full bg-primary mt-1.5 shrink-0 relative z-10 ring-4 ring-slate-50"></div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{history.status}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{new Date(history.changed_at).toLocaleString()}</p>
                            {history.note && <p className="text-xs text-slate-600 mt-1">{history.note}</p>}
                          </div>
                        </div>
                      ))}
                      {(!order.status_history || order.status_history.length === 0) && (
                        <p className="text-sm text-slate-500">No history available.</p>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
  );
}
