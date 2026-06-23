'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Fish, ArrowLeft, Store as StoreIcon, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct(id as string);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      const res = await api.get(`/products/${productId}/`);
      setProduct(res.data);
    } catch (err) {
      console.error('Failed to fetch product detail', err);
      // fallback or error could be shown
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-24 text-center text-lg">Loading Product...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Button onClick={() => router.push('/products')} variant="outline">Back to Catalog</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Button variant="ghost" onClick={() => router.push('/products')} className="mb-6 -ml-4 text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Catalog
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-slate-100 rounded-xl aspect-square flex items-center justify-center overflow-hidden border">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <Fish className="w-32 h-32 text-slate-300" />
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">{product.name}</h1>
            <div className="text-3xl font-bold text-primary mb-4">${Number(product.price).toFixed(2)}</div>
            
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-6 ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {product.stock > 0 ? `${product.stock} items in stock` : 'Out of Stock'}
            </div>
            
            <p className="text-slate-600 whitespace-pre-line leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="mt-auto space-y-6">
            {/* Store Card */}
            <Card className="bg-slate-50 border-none shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <StoreIcon className="w-5 h-5 text-primary" />
                  Sold by: {product.store?.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {product.store?.image_url && (
                    <img src={product.store.image_url} alt={product.store.name} className="w-16 h-16 rounded object-cover shadow-sm" />
                  )}
                  <div>
                    <p className="text-sm text-slate-600 line-clamp-2">{product.store?.description || 'No description available for this store.'}</p>
                    <div className="flex items-center gap-1 text-xs text-green-600 font-medium mt-2">
                      <ShieldCheck className="w-4 h-4" /> SEAPEDIA Verified Seller
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="pt-6 border-t flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex-1" disabled={product.stock === 0 || !user || !user.roles.includes('BUYER')}>
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart (Coming Soon)'}
              </Button>
              {!user && (
                <div className="text-center sm:text-left text-sm text-slate-500 self-center">
                  <Link href="/auth/login" className="text-primary hover:underline">Log in</Link> as a buyer to purchase.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
