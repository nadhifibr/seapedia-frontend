'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingCart, Minus, Plus, Store as StoreIcon } from 'lucide-react';
import api from '@/lib/api';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart/');
      setCart(res.data);
    } catch (err) {
      console.error('Failed to fetch cart', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      return removeItem(itemId);
    }
    
    try {
      await api.patch(`/cart/items/${itemId}/`, { quantity: newQty });
      fetchCart();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to update quantity');
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await api.delete(`/cart/items/${itemId}/`);
      fetchCart();
    } catch (err) {
      console.error('Failed to remove item', err);
    }
  };

  const clearCart = async () => {
    if (!confirm('Are you sure you want to clear your entire cart?')) return;
    try {
      await api.delete('/cart/');
      fetchCart();
    } catch (err) {
      console.error('Failed to clear cart', err);
    }
  };

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-24 text-center">Loading Cart...</div>;
  }

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  return (
    <ProtectedRoute allowedRoles={['BUYER']}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-800">
            <ShoppingCart className="w-8 h-8 text-primary" /> 
            Your Shopping Cart
          </h1>
          {!isEmpty && (
            <Button variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={clearCart}>
              Clear Cart
            </Button>
          )}
        </div>

        {isEmpty ? (
          <div className="text-center py-24 bg-slate-50 rounded-xl border border-dashed">
            <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-700 mb-2">Your cart is empty</h2>
            <p className="text-slate-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Button onClick={() => router.push('/products')} size="lg">Start Shopping</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border mb-4 flex items-center gap-2">
                <StoreIcon className="w-5 h-5 text-slate-500" />
                <span className="font-semibold text-slate-700">Store:</span> 
                <span className="font-bold text-primary">{cart.store_name}</span>
              </div>

              {cart.items.map((item: any) => (
                <Card key={item.id} className="overflow-hidden border-slate-200">
                  <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center">
                    <div className="w-24 h-24 bg-slate-100 rounded-md shrink-0 border overflow-hidden">
                      {item.product_detail.image_url ? (
                        <img src={item.product_detail.image_url} alt={item.product_detail.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No Img</div>
                      )}
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{item.product_detail.name}</h3>
                      <p className="text-primary font-semibold mt-1">${Number(item.product_detail.price).toFixed(2)}</p>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-lg border">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-200" onClick={() => updateQuantity(item.id, item.quantity, -1)}>
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-semibold text-slate-800">{item.quantity}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-200" onClick={() => updateQuantity(item.id, item.quantity, 1)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="text-right sm:ml-4 w-24">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Subtotal</p>
                      <p className="font-bold text-lg text-slate-800">${Number(item.subtotal).toFixed(2)}</p>
                    </div>

                    <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 hover:bg-red-50 ml-2 shrink-0" onClick={() => removeItem(item.id)}>
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Card className="sticky top-24 shadow-md border-primary/20">
                <CardHeader className="bg-primary/5 pb-4">
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between text-slate-600">
                    <span>Total Items</span>
                    <span className="font-semibold">{cart.items.reduce((acc: number, item: any) => acc + item.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold border-t pt-4 text-slate-800">
                    <span>Total Price</span>
                    <span className="text-primary">${Number(cart.total).toFixed(2)}</span>
                  </div>
                  <Button className="w-full mt-6" size="lg" onClick={() => router.push('/checkout')}>
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
