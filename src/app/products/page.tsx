'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Fish } from 'lucide-react';
import api from '@/lib/api';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products/');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch catalog', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-center text-lg">Loading Catalog...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Marketplace Catalog</h1>
        <p className="text-muted-foreground">Browse our fresh selections from real sellers</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24 bg-slate-50 rounded-lg text-slate-500">
          <Fish className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h2 className="text-xl font-semibold text-slate-700">No products available yet</h2>
          <p>Check back later when sellers have added their fresh catch!</p>
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
                  {product.store ? (
                    <Link href={`/store/${product.store.slug}`} className="text-xs font-medium text-primary line-clamp-1 hover:underline">
                      {product.store.name}
                    </Link>
                  ) : (
                    <div className="text-xs font-medium text-primary line-clamp-1">Unknown Store</div>
                  )}
                  <div className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded-full text-slate-500 uppercase tracking-wide">
                    {product.category?.replace('_', ' ')}
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="mt-auto">
                <div className="text-xl font-bold">${Number(product.price).toFixed(2)}</div>
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
