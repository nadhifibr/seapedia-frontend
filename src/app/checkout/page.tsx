'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Truck, CheckCircle2, ShoppingBag } from 'lucide-react';
import api from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [deliveryMethod, setDeliveryMethod] = useState<string>('REGULAR');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [discountCodeInput, setDiscountCodeInput] = useState('');
  const [appliedDiscountCode, setAppliedDiscountCode] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [deliveryMethod, selectedAddressId, appliedDiscountCode]);

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/addresses/');
      setAddresses(res.data);
      if (res.data.length > 0) {
        const defaultAddr = res.data.find((a: any) => a.is_default) || res.data[0];
        setSelectedAddressId(defaultAddr.id);
      }
    } catch (err) {
      console.error('Failed to fetch addresses', err);
    }
  };

  const fetchSummary = async () => {
    try {
      setIsLoading(true);
      let url = `/orders/checkout-summary/?delivery_method=${deliveryMethod}`;
      if (selectedAddressId) {
        url += `&address_id=${selectedAddressId}`;
      }
      if (appliedDiscountCode) {
        url += `&discount_code=${appliedDiscountCode}`;
      }
      const res = await api.get(url);
      setSummary(res.data);
      setDiscountError('');
    } catch (err: any) {
      console.error('Failed to fetch summary', err);
      if (err.response?.status === 400 && err.response?.data?.detail === 'Cart is empty.') {
        router.push('/cart');
      } else if (err.response?.status === 400 && appliedDiscountCode) {
         setDiscountError(err.response?.data?.detail || 'Invalid discount code');
         setAppliedDiscountCode('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyDiscount = async () => {
    if (!discountCodeInput) return;
    setIsApplyingDiscount(true);
    setDiscountError('');
    try {
      await api.get(`/discounts/validate/?code=${discountCodeInput}`);
      setAppliedDiscountCode(discountCodeInput);
    } catch (err: any) {
      setDiscountError(err.response?.data?.detail || 'Invalid discount code.');
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      alert('Please select a delivery address');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await api.post('/orders/checkout/', {
        delivery_method: deliveryMethod,
        address_id: selectedAddressId,
        discount_code: appliedDiscountCode
      });
      alert('Order placed successfully!');
      router.push('/dashboard/buyer/orders');
    } catch (err: any) {
      console.error('Checkout failed', err);
      alert(err.response?.data?.detail || 'Checkout failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !summary) {
    return <div className="max-w-7xl mx-auto px-4 py-24 text-center">Loading Checkout...</div>;
  }

  return (
    <ProtectedRoute allowedRoles={['BUYER']}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-800 mb-8">
          <CheckCircle2 className="w-8 h-8 text-primary" /> 
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Address Selection */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b py-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {addresses.length === 0 ? (
                  <div className="text-center py-4 text-slate-500">
                    <p>No addresses found.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((addr: any) => (
                      <label key={addr.id} className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${selectedAddressId === addr.id ? 'border-primary bg-primary/5' : 'hover:bg-slate-50'}`}>
                        <input 
                          type="radio" 
                          name="address" 
                          value={addr.id}
                          checked={selectedAddressId === addr.id}
                          onChange={(e) => setSelectedAddressId(e.target.value)}
                          className="mt-1"
                        />
                        <div>
                          <p className="font-semibold text-slate-800">{addr.label} {addr.is_default && <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded ml-2">Default</span>}</p>
                          <p className="text-sm text-slate-600 mt-1">{addr.full_address}</p>
                          <p className="text-sm text-slate-500 mt-1">{addr.phone_number}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delivery Method Selection */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b py-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  Delivery Method
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {[
                  { id: 'INSTANT', label: 'Instant', basePrice: 50000, desc: 'Delivery within 2-3 hours' },
                  { id: 'NEXT_DAY', label: 'Next Day', basePrice: 20000, desc: 'Delivery by tomorrow' },
                  { id: 'REGULAR', label: 'Regular', basePrice: 10000, desc: 'Delivery in 2-4 days' },
                ].map((method) => {
                  const displayPrice = summary?.available_delivery_fees?.[method.id] 
                    ? Number(summary.available_delivery_fees[method.id]) 
                    : method.basePrice;
                    
                  return (
                  <label key={method.id} className={`flex items-start justify-between p-3 border rounded-lg cursor-pointer transition-colors ${deliveryMethod === method.id ? 'border-primary bg-primary/5' : 'hover:bg-slate-50'}`}>
                    <div className="flex items-start gap-3">
                      <input 
                        type="radio" 
                        name="deliveryMethod" 
                        value={method.id}
                        checked={deliveryMethod === method.id}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-semibold text-slate-800">{method.label}</p>
                        <p className="text-sm text-slate-500 mt-0.5">{method.desc}</p>
                      </div>
                    </div>
                    <div className="font-semibold text-primary">
                      {summary ? `Rp ${displayPrice.toLocaleString('id-ID')}` : 'Calculating...'}
                    </div>
                  </label>
                  );
                })}
              </CardContent>
            </Card>

            {/* Order Items */}
            {summary && (
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="border-b py-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                    Items from {summary.store_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {summary.items.map((item: any) => (
                    <div key={item.product_id} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                      <div className="w-16 h-16 bg-slate-100 rounded overflow-hidden shrink-0">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">No Img</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800">{item.product_name}</p>
                        <p className="text-sm text-slate-500">{item.quantity} x Rp {Number(item.price).toLocaleString('id-ID')}</p>
                      </div>
                      <div className="font-semibold text-slate-800">
                        Rp {(item.quantity * Number(item.price)).toLocaleString('id-ID')}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar Area: Discount & Payment Summary */}
          <div className="space-y-6">
            
            {/* Discount Code Section */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b py-3">
                <CardTitle className="text-lg">Voucher & Promo</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCodeInput}
                    onChange={(e) => setDiscountCodeInput(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 uppercase"
                  />
                  <Button onClick={handleApplyDiscount} disabled={isApplyingDiscount || !discountCodeInput} className="cursor-pointer">
                    {isApplyingDiscount ? '...' : 'Apply'}
                  </Button>
                </div>
                {discountError && <p className="text-xs text-red-500 font-medium mt-1">{discountError}</p>}
                {appliedDiscountCode && summary?.discount_amount > 0 && (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-2 rounded-md text-sm mt-2 flex justify-between items-center">
                    <span>Applied: <strong>{appliedDiscountCode}</strong></span>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-red-600 hover:text-red-800 hover:bg-red-50 cursor-pointer" onClick={() => { setAppliedDiscountCode(''); setDiscountCodeInput(''); }}>
                      Remove
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card className="sticky top-24 shadow-md border-slate-200">
              <CardHeader className="pb-4">
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3 text-slate-600">
                {summary ? (
                  <>
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium text-slate-800">Rp {Number(summary.subtotal).toLocaleString('id-ID')}</span>
                    </div>
                    {summary.discount_amount > 0 && (
                      <div className="flex justify-between text-green-600 font-medium">
                        <span>Discount {summary.discount_type ? `(${summary.discount_type})` : ''}</span>
                        <span>- Rp {Number(summary.discount_amount).toLocaleString('id-ID')}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span className="font-medium text-slate-800">Rp {Number(summary.delivery_fee).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (PPN 12%)</span>
                      <span className="font-medium text-slate-800">Rp {Number(summary.tax_amount).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold border-t pt-4 text-slate-800 mt-4">
                      <span>Total</span>
                      <span className="text-primary">Rp {Number(summary.total).toLocaleString('id-ID')}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">Calculating...</div>
                )}
                
                <Button 
                  className="w-full mt-6 cursor-pointer" 
                  size="lg" 
                  onClick={handleCheckout} 
                  disabled={!summary || !selectedAddressId || isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Pay Now'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
