'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, TrendingUp, Truck, ChevronLeft, ChevronRight } from 'lucide-react';

const categories = [
  {
    id: "FISHING_GEAR",
    title: "Fishing Gear",
    description: "Fishing essentials including rods, reels, lures, and accessories.",
    image: "/categories/fishing_gear 1.png"
  },
  {
    id: "DIVING_GEAR",
    title: "Diving Gear",
    description: "Equipment for diving and underwater exploration.",
    image: "/categories/diving_gear 1.png"
  },
  {
    id: "MARINE_EQUIPMENT",
    title: "Marine Equipment",
    description: "Essential tools and equipment for marine activities.",
    image: "/categories/marine_equipment 1.png"
  },
  {
    id: "OCEAN_APPAREL",
    title: "Ocean Apparel",
    description: "Ocean-ready clothing built for comfort and protection.",
    image: "/categories/ocean_apparel 1.png"
  },
  {
    id: "OCEAN_ACCESSORIES",
    title: "Ocean Accessories",
    description: "Accessories for ocean lovers and marine lifestyle.",
    image: "/categories/ocean_accessories 1.png"
  },
  {
    id: "OTHER",
    title: "Other",
    description: "Discover more ocean-related products.",
    image: "/categories/other_marine 1.png"
  }
];

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    "bg-gradient-to-b from-[#416ACC] to-[#0B3D91]",
    "bg-gradient-to-tr from-[#0B3D91] to-[#416ACC]",
    "bg-gradient-to-r from-[#416ACC] to-[#0B3D91]"
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  // Auto slide
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
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
      <section className="py-16 px-4 bg-slate-50">
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
                <Card className="h-full border-none shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-white">
                  <div className="aspect-square bg-transparent relative overflow-hidden">
                    <img 
                      src={cat.image} 
                      alt={cat.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <CardContent className="p-3 md:p-4 text-center md:text-left">
                    <h3 className="font-semibold text-sm md:text-base text-slate-900 mb-1">{cat.title}</h3>
                    <p className="text-[10px] md:text-xs text-slate-500 line-clamp-2">{cat.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
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
