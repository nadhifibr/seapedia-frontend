'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Store, TrendingUp, Truck, ChevronLeft, ChevronRight, Fish, MapPin, Star } from 'lucide-react';
import api from '@/lib/api';

const categories = [
  {
    id: "FISHING_GEAR",
    title: "Fishing Gear",
    description: "Fishing essentials including rods, reels, lures, and accessories.",
    image: "/categories/fishing_gear.png"
  },
  {
    id: "DIVING_GEAR",
    title: "Diving Gear",
    description: "Equipment for diving and underwater exploration.",
    image: "/categories/diving_gear.png"
  },
  {
    id: "MARINE_EQUIPMENT",
    title: "Marine Equipment",
    description: "Essential tools and equipment for marine activities.",
    image: "/categories/marine_equipment.png"
  },
  {
    id: "OCEAN_APPAREL",
    title: "Ocean Apparel",
    description: "Ocean-ready clothing built for comfort and protection.",
    image: "/categories/ocean_apparel.png"
  },
  {
    id: "OCEAN_ACCESSORIES",
    title: "Ocean Accessories",
    description: "Accessories for ocean lovers and marine lifestyle.",
    image: "/categories/ocean_accessories.png"
  },
  {
    id: "OTHER",
    title: "Other",
    description: "Discover more ocean-related products.",
    image: "/categories/other_marine.png"
  }
];

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  
  const slides = [
    "bg-gradient-to-b from-[#416ACC] to-[#0B3D91]",
    "bg-gradient-to-tr from-[#0B3D91] to-[#416ACC]",
    "bg-gradient-to-r from-[#416ACC] to-[#0B3D91]"
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  // Auto slide and fetch products
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products/');
        setFeaturedProducts(res.data.slice(0, 18)); // Top 18 products
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner Section (Dummy) */}
      <section className="pt-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Rectangle Banner */}
          <div className={`group relative w-full h-[250px] sm:h-[350px] md:h-[450px] rounded-[20px] ${slides[currentSlide]} flex items-center justify-between px-4 md:px-8 shadow-lg overflow-hidden transition-colors duration-700 ease-in-out`}>
            
            {/* Left Navigation Button */}
            <button 
              onClick={prevSlide}
              className="opacity-0 group-hover:opacity-100 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all duration-300 border border-white/20 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>
            
            {/* Right Navigation Button */}
            <button 
              onClick={nextSlide}
              className="opacity-0 group-hover:opacity-100 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all duration-300 border border-white/20 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            {/* Pagination dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'}`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="pt-16 pb-8 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Shop by Category</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Find everything you need for your next marine adventure.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((cat) => (
              <Link href={`/products?category=${cat.id}`} key={cat.id} className="block group">
                <Card className="aspect-square md:aspect-[4/5] border-none shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden relative">
                  {/* Background Image */}
                  <img 
                    src={cat.image} 
                    alt={cat.title} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent transition-opacity duration-500" />
                  
                  {/* Content Container */}
                  <CardContent className="absolute inset-0 p-4 flex flex-col justify-end">
                    <div className="relative transform group-hover:-translate-y-8 md:group-hover:-translate-y-15 transition-transform duration-500 ease-out">
                      <h3 className="font-bold text-base md:text-lg text-white mb-1 drop-shadow-md">{cat.title}</h3>
                      <div className="absolute top-full left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                        <p className="text-xs md:text-sm text-slate-200 line-clamp-3 drop-shadow-sm pb-1">
                          {cat.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="pt-8 pb-16 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Featured Products</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Discover our top picks and fresh arrivals from trusted sellers.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {featuredProducts.map((item) => (
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
                        <span>{item.sold_count} terjual</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/products">
              <Button size="lg" className="bg-[#0F172A] text-white hover:bg-[#0F172A]/90 px-10">
                Load More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      

      {/* Review Placeholder */}
      <section className="bg-slate-900 py-24 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold">Help Us Improve!</h2>
          <p className="text-slate-300">
            SEAPEDIA is currently in early access. We would love to hear your feedback about the application experience.
          </p>
          <Link href="/reviews">
            <Button size="lg" variant="secondary" className="h-12 px-8 text-lg">Leave an App Review</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
