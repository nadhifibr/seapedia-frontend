'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Fish, Store as StoreIcon, ShieldCheck, ArrowLeft, MapPin } from 'lucide-react';
import api from '@/lib/api';

export default function StoreProfilePage() {
  const { slug } = useParams();
  const router = useRouter();
  
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoadingStore, setIsLoadingStore] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    if (slug) {
      const decodedSlug = decodeURIComponent(slug as string);
      fetchStoreData(decodedSlug);
    }
  }, [slug]);

  const fetchStoreData = async (storeSlug: string) => {
    try {
      // 1. Fetch Store Details
      const storeRes = await api.get(`/stores/${storeSlug}/`);
      setStore(storeRes.data);
    } catch (err) {
      console.error('Failed to fetch store details', err);
    } finally {
      setIsLoadingStore(false);
    }

    try {
      // 2. Fetch Store Products
      const productsRes = await api.get(`/products/?store_slug=${storeSlug}`);
      setProducts(productsRes.data.results || []);
    } catch (err) {
      console.error('Failed to fetch store products', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  if (isLoadingStore) {
    return <div className="max-w-7xl mx-auto px-4 py-24 text-center text-lg">Loading Store Profile...</div>;
  }

  if (!store) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Store Not Found</h2>
        <Button onClick={() => router.push('/search')} variant="outline">Back to Catalog</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Button variant="ghost" onClick={() => router.push('/search')} className="mb-6 -ml-4 text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Catalog
      </Button>

      {/* Store Header Profile */}
      <Card className="bg-white border-none shadow-sm mb-12 overflow-hidden">
        <div className="h-32 bg-primary/10 w-full"></div>
        <CardContent className="pt-0 relative px-6 md:px-10">
          <div className="flex flex-col md:flex-row gap-6 md:items-end -mt-12">
            <div className="w-24 h-24 rounded-xl bg-white shadow-md border-4 border-white flex items-center justify-center overflow-hidden shrink-0">
              {store.image_url ? (
                <img src={store.image_url} alt={store.name} className="w-full h-full object-cover" />
              ) : (
                <StoreIcon className="w-10 h-10 text-slate-300" />
              )}
            </div>
            <div className="flex-1 pb-4 md:pb-2">
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                {store.name}
                <span title="Verified Seller" className="flex items-center">
                  <ShieldCheck className="w-6 h-6 text-green-500" />
                </span>
              </h1>
              {store.location && (
                <div className="flex items-center text-sm font-medium text-slate-500 mt-1">
                  <MapPin className="w-4 h-4 mr-1 text-primary" />
                  {store.location.replace('_', ' ')}
                </div>
              )}
              <p className="text-slate-600 mt-2 max-w-3xl">
                {store.description || 'Welcome to our store! Browse our high-quality products below.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Store Products */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Products from {store.name}</h2>
        <p className="text-muted-foreground">Showing {products.length} items</p>
      </div>

      {isLoadingProducts ? (
        <div className="py-12 text-center text-slate-500">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 bg-slate-50 rounded-lg text-slate-500">
          <Fish className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h2 className="text-xl font-semibold text-slate-700">No products available yet</h2>
          <p>This store hasn't added any active products to their catalog.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden flex flex-col transition-hover hover:shadow-lg">
              <div className="h-48 bg-slate-100 flex items-center justify-center text-slate-300 relative">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Fish className="w-16 h-16" />
                )}
                {product.stock === 0 && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 m-2 rounded text-xs font-bold">
                    OUT OF STOCK
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs font-medium text-primary line-clamp-1">{store.name}</div>
                  <div className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded-full text-slate-500 uppercase tracking-wide">
                    {product.category?.replace('_', ' ')}
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="mt-auto">
                <div className="text-xl font-bold">Rp {Number(product.price).toLocaleString('id-ID')}</div>
              </CardContent>
              <CardFooter>
                <Link href={`/products/${product.id}`} className="w-full">
                  <Button variant="outline" className="w-full">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
