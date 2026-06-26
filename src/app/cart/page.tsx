'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingCart, Minus, Plus, Store as StoreIcon, Fish, Star, MapPin } from 'lucide-react';
import api from '@/lib/api';
import { ConfirmationModal } from '@/components/shared/ConfirmationModal';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Recommendations state
  const [storeProducts, setStoreProducts] = useState<any[]>([]);
  const [newestProducts, setNewestProducts] = useState<any[]>([]);

  // Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart/');
      setCart(res.data);
      if (res.data && res.data.store_slug) {
        fetchRecommendations(res.data.store_slug);
      } else {
        fetchNewestOnly();
      }
    } catch (err) {
      console.error('Failed to fetch cart', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecommendations = async (storeSlug: string) => {
    try {
      const [storeRes, newestRes] = await Promise.all([
        api.get(`/products/?store_slug=${storeSlug}`),
        api.get('/products/')
      ]);
      setStoreProducts(storeRes.data.results?.slice(0, 4) || []);
      setNewestProducts(newestRes.data.results?.slice(0, 4) || []);
    } catch (err) {
      console.error('Failed to fetch recommendations', err);
    }
  };

  const fetchNewestOnly = async () => {
    try {
      const res = await api.get('/products/');
      setNewestProducts(res.data.results?.slice(0, 4) || []);
    } catch (err) {
      console.error('Failed to fetch recommendations', err);
    }
  };

  const updateQuantity = async (itemId: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      return confirmRemoveItem(itemId);
    }
    
    try {
      await api.patch(`/cart/items/${itemId}/`, { quantity: newQty });
      fetchCart();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to update quantity');
    }
  };

  const confirmRemoveItem = (itemId: string) => {
    setModalConfig({
      isOpen: true,
      title: 'Remove Item',
      message: 'Are you sure you want to remove this item from your cart?',
      onConfirm: async () => {
        try {
          await api.delete(`/cart/items/${itemId}/`);
          fetchCart();
        } catch (err) {
          console.error('Failed to remove item', err);
        }
      }
    });
  };

  const confirmClearCart = () => {
    setModalConfig({
      isOpen: true,
      title: 'Clear Cart',
      message: 'Are you sure you want to clear your entire cart? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await api.delete('/cart/');
          fetchCart();
        } catch (err) {
          console.error('Failed to clear cart', err);
        }
      }
    });
  };

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-24 text-center">Loading Cart...</div>;
  }

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  // Render product card helper
  const renderProductCard = (item: any) => (
    <Link href={`/products/${item.id}`} key={item.id} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="block group/item h-full">
      <Card className="h-full overflow-hidden flex flex-col bg-transparent border-none ring-0 p-0 gap-0 shadow-none transition-all duration-300 rounded-[10px]">
        <div className="aspect-square bg-slate-50 flex items-center justify-center text-slate-300 relative overflow-hidden rounded-[10px]">
          {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300" />
          ) : (
            <Fish className="w-12 h-12 opacity-50" />
          )}
          {item.stock === 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-0.5 rounded text-[10px] font-bold z-10">
              HABIS
            </div>
          )}
        </div>
        
        <div className="p-2.5 md:p-3 flex flex-col flex-grow">
          <h3 className="text-[13px] md:text-sm text-slate-800 line-clamp-2 leading-tight">
            {item.name}
          </h3>
          
          <div className="text-sm md:text-base font-bold text-slate-900 mt-1 mb-1">
            Rp {Number(item.price).toLocaleString('id-ID')}
          </div>
          
          <div className="mt-auto pt-1 flex flex-col gap-1.5 text-[11px] text-slate-500">
            {item.store && (
              <div className="relative h-[16px] overflow-hidden w-full flex items-center text-slate-500 cursor-default">
                <div className="absolute inset-0 flex items-center transition-transform duration-300 group-hover/item:-translate-y-full">
                  <StoreIcon className="w-3 h-3 mr-1" />
                  <span className="line-clamp-1">{item.store.name}</span>
                </div>
                <div className="absolute inset-0 flex items-center transition-transform duration-300 translate-y-full group-hover/item:translate-y-0 text-slate-600">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span className="line-clamp-1 capitalize">{item.store.location ? item.store.location.replace('_', ' ').toLowerCase() : 'Unknown'}</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" />
              <span>{item.average_rating > 0 ? Number(item.average_rating).toFixed(1) : '-'}</span>
              <span className="mx-1.5 text-slate-300 text-[10px]">|</span>
              <span>{item.sold_count || 0} terjual</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );

  return (
    <ProtectedRoute allowedRoles={['BUYER']}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-800">
            <ShoppingCart className="w-8 h-8 text-primary" /> 
            Your Shopping Cart
          </h1>
          {!isEmpty && (
            <Button variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer" onClick={confirmClearCart}>
              Clear Cart
            </Button>
          )}
        </div>

        {isEmpty ? (
          <div className="text-center py-24 bg-slate-50 rounded-xl border border-dashed">
            <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-700 mb-2">Your cart is empty</h2>
            <p className="text-slate-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Button onClick={() => router.push('/search')} size="lg" className="cursor-pointer">Start Shopping</Button>
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
                      <p className="text-primary font-semibold mt-1">Rp {Number(item.product_detail.price).toLocaleString('id-ID')}</p>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-lg border">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-200 cursor-pointer" onClick={() => updateQuantity(item.id, item.quantity, -1)}>
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-semibold text-slate-800">{item.quantity}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-200 cursor-pointer" onClick={() => updateQuantity(item.id, item.quantity, 1)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="text-right sm:ml-4 w-24">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Subtotal</p>
                      <p className="font-bold text-lg text-slate-800">Rp {Number(item.subtotal).toLocaleString('id-ID')}</p>
                    </div>

                    <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 hover:bg-red-50 ml-2 shrink-0 cursor-pointer" onClick={() => confirmRemoveItem(item.id)}>
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Card className="sticky top-24 shadow-md border-slate-200">
                <CardHeader className="pb-4">
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between text-slate-600">
                    <span>Total Items</span>
                    <span className="font-semibold">{cart.items.reduce((acc: number, item: any) => acc + item.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold border-t pt-4 text-slate-800">
                    <span>Total Price</span>
                    <span className="text-primary">Rp {Number(cart.total).toLocaleString('id-ID')}</span>
                  </div>
                  <Button className="w-full mt-6 cursor-pointer" size="lg" onClick={() => router.push('/checkout')}>
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        <div className="mt-20 pt-10 border-t border-slate-100">
          {!isEmpty && storeProducts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-bold text-slate-900 mb-6">More from {cart.store_name}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {storeProducts.map(renderProductCard)}
              </div>
            </div>
          )}

          {newestProducts.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-6">Discover New Products</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {newestProducts.map(renderProductCard)}
              </div>
            </div>
          )}
        </div>

        <ConfirmationModal
          isOpen={modalConfig.isOpen}
          onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
          onConfirm={modalConfig.onConfirm}
          title={modalConfig.title}
          message={modalConfig.message}
          confirmText="Yes, Proceed"
          cancelText="Cancel"
          isDestructive={true}
        />
      </div>
    </ProtectedRoute>
  );
}
