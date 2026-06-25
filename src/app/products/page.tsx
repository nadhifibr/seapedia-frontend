'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, SlidersHorizontal, Fish, StoreIcon, ShieldCheck, MapPin, Store, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/api';

const LOCATION_OPTIONS = [
  { value: 'JAKARTA', label: 'Jakarta' },
  { value: 'TANGERANG', label: 'Tangerang' },
  { value: 'ANYER', label: 'Anyer' },
  { value: 'BALI', label: 'Bali' },
  { value: 'LOMBOK', label: 'Lombok' },
  { value: 'BATAM', label: 'Batam' },
  { value: 'MANADO', label: 'Manado' },
  { value: 'MAKASSAR', label: 'Makassar' },
  { value: 'SURABAYA', label: 'Surabaya' },
  { value: 'RAJA_AMPAT', label: 'Raja Ampat' },
];

const CATEGORY_OPTIONS = [
  { value: 'FISHING_GEAR', label: 'Fishing Gear' },
  { value: 'DIVING_GEAR', label: 'Diving Gear' },
  { value: 'MARINE_EQUIPMENT', label: 'Marine Equipment' },
  { value: 'OCEAN_APPAREL', label: 'Ocean Apparel' },
  { value: 'OCEAN_ACCESSORIES', label: 'Ocean Accessories' },
  { value: 'OTHER', label: 'Other' },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('search') || '';

  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search Type (Auto Apply)
  const [searchType, setSearchType] = useState<'PRODUCTS' | 'STORES'>('PRODUCTS');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Pending States (UI state before applying)
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sort, setSort] = useState('newest');

  // Active States (Applied filters for API)
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [activeLocations, setActiveLocations] = useState<string[]>([]);
  const [activeMinRating, setActiveMinRating] = useState<string>('');
  const [activeMinPrice, setActiveMinPrice] = useState<string>('');
  const [activeMaxPrice, setActiveMaxPrice] = useState<string>('');
  const [activeSort, setActiveSort] = useState('newest');

  // Accordion States
  const [isLocOpen, setIsLocOpen] = useState(true);
  const [isCatOpen, setIsCatOpen] = useState(true);
  const [isRatingOpen, setIsRatingOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);

  // Sync Search Type changes
  useEffect(() => {
    fetchData();
  }, [searchType, queryParam, activeCategories, activeLocations, activeMinRating, activeMinPrice, activeMaxPrice, activeSort, currentPage]);

  const applyFilters = () => {
    setActiveCategories(categories);
    setActiveLocations(locations);
    setActiveMinRating(minRating);
    setActiveMinPrice(minPrice);
    setActiveMaxPrice(maxPrice);
    setActiveSort(sort);
    setCurrentPage(1); // Reset page on filter
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (searchType === 'PRODUCTS') {
        const res = await api.get('/products/', {
          params: {
            q: queryParam,
            category: activeCategories.length > 0 ? activeCategories.join(',') : undefined,
            location: activeLocations.length > 0 ? activeLocations.join(',') : undefined,
            min_price: activeMinPrice || undefined,
            max_price: activeMaxPrice || undefined,
            min_rating: activeMinRating || undefined,
            sort: activeSort,
            page: currentPage,
          }
        });
        setItems(res.data.results || []);
        setTotalPages(Math.ceil((res.data.count || 0) / 24));
      } else {
        const res = await api.get('/stores/', {
          params: {
            q: queryParam,
            location: activeLocations.length > 0 ? activeLocations.join(',') : undefined,
            page: currentPage,
          }
        });
        setItems(res.data.results || []);
        setTotalPages(Math.ceil((res.data.count || 0) / 24));
      }
    } catch (err) {
      console.error('Failed to fetch data', err);
      setItems([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationToggle = (val: string) => {
    setLocations(prev => prev.includes(val) ? prev.filter(l => l !== val) : [...prev, val]);
  };

  const handleCategoryToggle = (val: string) => {
    setCategories(prev => prev.includes(val) ? prev.filter(c => c !== val) : [...prev, val]);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Top Bar for Search Type & Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-500">I am looking for:</span>
          <div className="flex bg-slate-100 p-1 rounded-md w-fit">
            <button
              className={`px-4 py-1.5 text-sm font-medium rounded-sm transition-colors ${searchType === 'PRODUCTS' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => { setSearchType('PRODUCTS'); setCurrentPage(1); }}
            >
              Products
            </button>
            <button
              className={`px-4 py-1.5 text-sm font-medium rounded-sm transition-colors ${searchType === 'STORES' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => { setSearchType('STORES'); setCurrentPage(1); }}
            >
              Stores
            </button>
          </div>
        </div>

        {searchType === 'PRODUCTS' && (
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
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filter */}
        <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-6">
          
          {/* Filter Lokasi */}
          <div className="border-b pb-4">
            <button className="flex items-center justify-between w-full font-semibold text-slate-800 mb-4" onClick={() => setIsLocOpen(!isLocOpen)}>
              Lokasi
              {isLocOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>
            {isLocOpen && (
              <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {LOCATION_OPTIONS.map((loc) => (
                  <label key={loc.value} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                      checked={locations.includes(loc.value)}
                      onChange={() => handleLocationToggle(loc.value)}
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900">{loc.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {searchType === 'PRODUCTS' && (
            <>
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
                          value={star}
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
            </>
          )}

          <Button 
            className="w-full bg-[#0B3D91] hover:bg-[#082b66] text-white font-medium"
            onClick={applyFilters}
          >
            Terapkan Filter
          </Button>

        </div>

        {/* Content Grid */}
        <div className="flex-1 flex flex-col">
          {isLoading ? (
            <div className="flex justify-center items-center h-64 flex-1">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-lg border border-dashed border-slate-200 flex-1">
              <p className="text-xl font-semibold text-slate-600">No results found</p>
              <p className="text-slate-500 mt-2">Coba sesuaikan filter atau pencarianmu.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 flex-1 content-start">
                {items.map((item) => (
                  searchType === 'PRODUCTS' ? (
                    <Link href={`/products/${item.id}`} key={item.id} className="block group/card h-full">
                      <Card className="h-full overflow-hidden flex flex-col bg-transparent border-none ring-0 p-0 gap-0 shadow-none transition-all duration-300 rounded-[10px]">
                        {/* Image Container */}
                        <div className="aspect-square bg-slate-50 flex items-center justify-center text-slate-300 relative overflow-hidden rounded-[10px]">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
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
                          {/* Product Name */}
                          <h3 className="text-[13px] md:text-sm text-slate-800 line-clamp-2 leading-tight">
                            {item.name}
                          </h3>
                          
                          {/* Price */}
                          <div className="text-sm md:text-base font-bold text-slate-900 mt-1 mb-1">
                            Rp {Number(item.price).toLocaleString('id-ID')}
                          </div>
                          
                          {/* Rating & Sold */}
                          <div className="mt-auto pt-1 flex flex-col gap-1.5 text-[11px] text-slate-500">
                            {/* Store / Location Swap */}
                            {item.store && (
                              <div className="relative h-[16px] overflow-hidden w-full flex items-center text-slate-500 cursor-default">
                                {/* Default: Store Name */}
                                <div className="absolute inset-0 flex items-center transition-transform duration-300 group-hover/card:-translate-y-full">
                                  <Store className="w-3 h-3 mr-1" />
                                  <span className="line-clamp-1">{item.store.name}</span>
                                </div>
                                {/* Hover: Location */}
                                <div className="absolute inset-0 flex items-center transition-transform duration-300 translate-y-full group-hover/card:translate-y-0 text-slate-600">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  <span className="line-clamp-1">{item.store.location ? item.store.location.replace('_', ' ').toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase()) : 'Unknown'}</span>
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
                  ) : (
                    <Card key={item.id} className="overflow-hidden flex flex-col transition-hover hover:shadow-lg">
                      <div className="h-40 bg-slate-100 flex items-center justify-center text-slate-300">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <StoreIcon className="w-16 h-16" />
                        )}
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2 line-clamp-1">
                          {item.name}
                          <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="mt-auto">
                        {item.location && (
                          <div className="flex items-center text-xs text-slate-500 mb-2 font-medium">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-primary" />
                            {item.location.replace('_', ' ')}
                          </div>
                        )}
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {item.description || 'No description available.'}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Link href={`/store/${item.slug}`} className="w-full">
                          <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary/5">Kunjungi Toko</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  )
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12 mb-4">
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
                      // Logic to show limited pages if there are too many (e.g. show first, last, and current surroundings)
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
