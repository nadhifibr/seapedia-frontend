'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Filter, SlidersHorizontal, Fish } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/api';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search, Filter, Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('ALL');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    // Debounce search input slightly so it doesn't fetch on every keystroke
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, category, sort]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/products/', {
        params: {
          q: searchQuery,
          category: category,
          sort: sort,
        }
      });
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch catalog', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Removed strict loading return to prevent UI flickering on search
  // if (isLoading && products.length === 0) { ... }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Marketplace Catalog</h1>
        <p className="text-muted-foreground">Browse our fresh selections from real sellers</p>
      </div>

      {/* Control Bar: Search, Filter, Sort */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-slate-50 p-4 rounded-lg border">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            type="text" 
            placeholder="Search products or stores..." 
            className="pl-9 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          {/* Category Filter */}
          <div className="w-40">
            <Select value={category} onValueChange={(val) => setCategory(val || 'ALL')}>
              <SelectTrigger className="bg-white">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <SelectValue placeholder="Category" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                <SelectItem value="FISHING_GEAR">Fishing Gear</SelectItem>
                <SelectItem value="DIVING_GEAR">Diving Gear</SelectItem>
                <SelectItem value="MARINE_EQUIPMENT">Marine Equipment</SelectItem>
                <SelectItem value="OCEAN_APPAREL">Ocean Apparel</SelectItem>
                <SelectItem value="OCEAN_ACCESSORIES">Accessories</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div className="w-44">
            <Select value={sort} onValueChange={(val) => setSort(val || 'newest')}>
              <SelectTrigger className="bg-white">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 text-center text-slate-500 text-lg">Loading products...</div>
      ) : products.length === 0 ? (
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
