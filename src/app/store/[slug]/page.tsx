'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Fish, Store as StoreIcon, ShieldCheck, MapPin, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/api';

const CATEGORY_OPTIONS = [
  { value: 'FISHING_GEAR', label: 'Fishing Gear' },
  { value: 'DIVING_GEAR', label: 'Diving Gear' },
  { value: 'MARINE_EQUIPMENT', label: 'Marine Equipment' },
  { value: 'OCEAN_APPAREL', label: 'Ocean Apparel' },
  { value: 'OCEAN_ACCESSORIES', label: 'Ocean Accessories' },
  { value: 'OTHER', label: 'Other' },
];

export default function StoreProfilePage() {
  const { slug } = useParams();
  const router = useRouter();
  
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoadingStore, setIsLoadingStore] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Pending States (UI state before applying)
  const [categories, setCategories] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sort, setSort] = useState('newest');

  // Active States (Applied filters for API)
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [activeMinRating, setActiveMinRating] = useState<string>('');
  const [activeMinPrice, setActiveMinPrice] = useState<string>('');
  const [activeMaxPrice, setActiveMaxPrice] = useState<string>('');
  const [activeSort, setActiveSort] = useState('newest');

  // Accordion States
  const [isCatOpen, setIsCatOpen] = useState(true);
  const [isRatingOpen, setIsRatingOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);

  useEffect(() => {
    if (slug) {
      const decodedSlug = decodeURIComponent(slug as string);
      fetchStoreData(decodedSlug);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      const decodedSlug = decodeURIComponent(slug as string);
      fetchProducts(decodedSlug);
    }
  }, [slug, activeCategories, activeMinRating, activeMinPrice, activeMaxPrice, activeSort, currentPage]);

  const fetchStoreData = async (storeSlug: string) => {
    try {
      const storeRes = await api.get(`/stores/${storeSlug}/`);
      setStore(storeRes.data);
    } catch (err) {
      console.error('Failed to fetch store details', err);
    } finally {
      setIsLoadingStore(false);
    }
  };

  const fetchProducts = async (storeSlug: string) => {
    setIsLoadingProducts(true);
    try {
      const productsRes = await api.get(`/products/`, {
        params: {
          store_slug: storeSlug,
          category: activeCategories.length > 0 ? activeCategories.join(',') : undefined,
          min_price: activeMinPrice || undefined,
          max_price: activeMaxPrice || undefined,
          min_rating: activeMinRating || undefined,
          sort: activeSort,
          page: currentPage,
        }
      });
      setProducts(productsRes.data.results || []);
      setTotalPages(Math.ceil((productsRes.data.count || 0) / 24));
    } catch (err) {
      console.error('Failed to fetch store products', err);
      setProducts([]);
      setTotalPages(1);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const applyFilters = () => {
    setActiveCategories(categories);
    setActiveMinRating(minRating);
    setActiveMinPrice(minPrice);
    setActiveMaxPrice(maxPrice);
    setActiveSort(sort);
    setCurrentPage(1);
  };

  const handleCategoryToggle = (val: string) => {
    setCategories(prev => prev.includes(val) ? prev.filter(c => c !== val) : [...prev, val]);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      {/* Store Profile without Banner */}
      <Card className="bg-white border-none shadow-sm mb-12 overflow-hidden p-0">
        <CardContent className="p-6 md:p-10">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-24 h-24 rounded-xl bg-slate-100 shadow-sm border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
              {store.image_url ? (
                <img src={store.image_url} alt={store.name} className="w-full h-full object-cover" />
              ) : (
                <StoreIcon className="w-10 h-10 text-slate-300" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                {store.name}
                <span title="Verified Seller" className="flex items-center">
                  <ShieldCheck className="w-6 h-6 text-green-500" />
                </span>
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                {store.location && (
                  <div className="flex items-center text-sm font-medium text-slate-500 capitalize">
                    <MapPin className="w-4 h-4 mr-1 text-primary" />
                    {store.location.replace('_', ' ').toLowerCase()}
                  </div>
                )}
                <div className="flex items-center text-sm font-medium text-slate-500">
                  <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
                  {store.average_rating > 0 ? Number(store.average_rating).toFixed(1) : '-'} Rating
                </div>
                <div className="flex items-center text-sm font-medium text-slate-500">
                  <StoreIcon className="w-4 h-4 mr-1 text-primary" />
                  {store.total_sold || 0} Terjual
                </div>
              </div>
              <p className="text-slate-600 mt-3 max-w-3xl leading-relaxed">
                {store.description || 'Welcome to our store! Browse our high-quality products below.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b">
        <div>
          <h2 className="text-2xl font-bold">Products from {store.name}</h2>
          <p className="text-muted-foreground mt-1">Showing {products.length} items</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Urutkan:</span>
          <Select value={sort} onValueChange={(val) => { if (val) { setSort(val); setActiveSort(val); setCurrentPage(1); } }}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Urutkan">
                {sort === 'newest' ? 'Terbaru' : sort === 'price_asc' ? 'Harga: Rendah ke Tinggi' : sort === 'price_desc' ? 'Harga: Tinggi ke Rendah' : 'Terbaru'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Terbaru</SelectItem>
              <SelectItem value="price_asc">Harga: Rendah ke Tinggi</SelectItem>
              <SelectItem value="price_desc">Harga: Tinggi ke Rendah</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filter */}
        <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-6">
          {/* Filter Kategori */}
          <div className="border-b pb-4">
            <button className="flex items-center justify-between w-full font-semibold text-slate-800 mb-4" onClick={() => setIsCatOpen(!isCatOpen)}>
              Kategori
              {isCatOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>
            {isCatOpen && (
              <div className="flex flex-col gap-2.5">
                {CATEGORY_OPTIONS.map((cat) => (
                  <label key={cat.value} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                      checked={categories.includes(cat.value)}
                      onChange={() => handleCategoryToggle(cat.value)}
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900">{cat.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Filter Rating */}
          <div className="border-b pb-4">
            <button className="flex items-center justify-between w-full font-semibold text-slate-800 mb-4" onClick={() => setIsRatingOpen(!isRatingOpen)}>
              Rating
              {isRatingOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>
            {isRatingOpen && (
              <div className="flex flex-col gap-2.5">
                {[5, 4, 3, 2, 1].map((star) => (
                  <label key={star} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="rating"
                      value={star.toString()}
                      className="w-4 h-4 border-slate-300 text-primary focus:ring-primary"
                      checked={minRating === star.toString()}
                      onChange={() => setMinRating(star.toString())}
                    />
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < star ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 fill-slate-200'}`} />
                      ))}
                      {star < 5 && <span className="text-sm text-slate-500 ml-1">ke atas</span>}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Filter Harga */}
          <div className="border-b pb-4">
            <button className="flex items-center justify-between w-full font-semibold text-slate-800 mb-4" onClick={() => setIsPriceOpen(!isPriceOpen)}>
              Harga
              {isPriceOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>
            {isPriceOpen && (
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">Rp</span>
                  <Input 
                    type="number" 
                    placeholder="Harga Minimum" 
                    className="pl-9 bg-slate-50"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">Rp</span>
                  <Input 
                    type="number" 
                    placeholder="Harga Maksimum" 
                    className="pl-9 bg-slate-50"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <Button 
            className="w-full bg-[#0B3D91] hover:bg-[#082b66] text-white font-medium"
            onClick={applyFilters}
          >
            Terapkan Filter
          </Button>
        </div>

        {/* Product List */}
        <div className="flex-1">
          {isLoadingProducts ? (
            <div className="py-12 text-center text-slate-500">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 bg-slate-50 rounded-lg text-slate-500">
              <Fish className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h2 className="text-xl font-semibold text-slate-700">No products found</h2>
              <p>We couldn't find any products matching your filters.</p>
              <Button variant="outline" className="mt-4" onClick={() => {
                setCategories([]); setMinRating(''); setMinPrice(''); setMaxPrice('');
                setActiveCategories([]); setActiveMinRating(''); setActiveMinPrice(''); setActiveMaxPrice('');
              }}>Reset Filters</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
                {products.map((item) => (
                  <Link href={`/products/${item.id}`} key={item.id} className="block group/item h-full">
                    <Card className="h-full overflow-hidden flex flex-col bg-transparent border-none ring-0 p-0 gap-0 shadow-none transition-all duration-300 rounded-[10px]">
                      {/* Image Container */}
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
                      
                      {/* Content */}
                      <div className="p-2.5 md:p-3 flex flex-col flex-grow">
                        <h3 className="text-[13px] md:text-sm text-slate-800 line-clamp-2 leading-tight">
                          {item.name}
                        </h3>
                        
                        <div className="text-sm md:text-base font-bold text-slate-900 mt-1 mb-1">
                          Rp {Number(item.price).toLocaleString('id-ID')}
                        </div>
                        
                        <div className="mt-auto pt-1 flex flex-col gap-1.5 text-[11px] text-slate-500">
                          {store && (
                            <div className="relative h-[16px] overflow-hidden w-full flex items-center text-slate-500 cursor-default">
                              <div className="absolute inset-0 flex items-center transition-transform duration-300 group-hover/item:-translate-y-full">
                                <StoreIcon className="w-3 h-3 mr-1" />
                                <span className="line-clamp-1">{store.name}</span>
                              </div>
                              <div className="absolute inset-0 flex items-center transition-transform duration-300 translate-y-full group-hover/item:translate-y-0 text-slate-600">
                                <MapPin className="w-3 h-3 mr-1" />
                                <span className="line-clamp-1 capitalize">{store.location ? store.location.replace('_', ' ').toLowerCase() : 'Unknown'}</span>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" />
                            <span>{item.average_rating > 0 ? item.average_rating : '-'}</span>
                            <span className="mx-1.5 text-slate-300 text-[10px]">|</span>
                            <span>{item.sold_count || 0} terjual</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-12 pb-8">
                  <Button 
                    variant="outline" 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1 mx-2 overflow-x-auto max-w-[200px] sm:max-w-none custom-scrollbar pb-2 sm:pb-0">
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      if (totalPages > 7) {
                        if (
                          pageNum === 1 || 
                          pageNum === totalPages || 
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={i}
                              className={`w-8 h-8 flex-shrink-0 rounded-md flex items-center justify-center text-sm font-medium transition-colors ${currentPage === pageNum ? 'bg-primary text-white' : 'hover:bg-slate-100 text-slate-600'}`}
                              onClick={() => handlePageChange(pageNum)}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          pageNum === currentPage - 2 || 
                          pageNum === currentPage + 2
                        ) {
                          return <span key={i} className="text-slate-400 px-1">...</span>;
                        }
                        return null;
                      }

                      return (
                        <button
                          key={i}
                          className={`w-8 h-8 flex-shrink-0 rounded-md flex items-center justify-center text-sm font-medium transition-colors ${currentPage === pageNum ? 'bg-primary text-white' : 'hover:bg-slate-100 text-slate-600'}`}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <Button 
                    variant="outline" 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
