'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, TrendingUp, Truck, ChevronLeft, ChevronRight } from 'lucide-react';

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
          <div className={`relative w-full h-[250px] sm:h-[350px] md:h-[450px] rounded-[20px] ${slides[currentSlide]} flex items-center justify-between px-4 md:px-8 shadow-lg overflow-hidden transition-colors duration-700 ease-in-out`}>
            
            {/* Left Navigation Button */}
            <button 
              onClick={prevSlide}
              className="z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors border border-white/20 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>
            
            {/* Right Navigation Button */}
            <button 
              onClick={nextSlide}
              className="z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors border border-white/20 cursor-pointer"
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

      {/* Welcome Message */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900">
            Welcome to <span className="text-[#0B3D91]">SEAPEDIA</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            The next-generation marketplace that empowers Buyers, Sellers, and Drivers in one seamless ecosystem.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link href="/products">
              <Button size="lg" className="h-12 px-8 text-lg bg-[#0F172A] hover:bg-[#0F172A]/90">Start Shopping</Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-2 border-[#0F172A] text-[#0F172A] hover:bg-slate-100">Join the Platform</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">One Platform, Multiple Roles</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-md bg-slate-50">
              <CardHeader className="text-center pb-2">
                <Store className="w-12 h-12 mx-auto text-blue-500 mb-4" />
                <CardTitle>For Sellers</CardTitle>
                <CardDescription>Open your store and reach millions.</CardDescription>
              </CardHeader>
              <CardContent className="text-center text-slate-600">
                Manage your products, process orders efficiently, and grow your income with our powerful seller tools.
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-slate-50">
              <CardHeader className="text-center pb-2">
                <TrendingUp className="w-12 h-12 mx-auto text-green-500 mb-4" />
                <CardTitle>For Buyers</CardTitle>
                <CardDescription>Discover the best products.</CardDescription>
              </CardHeader>
              <CardContent className="text-center text-slate-600">
                Enjoy a seamless shopping experience, track your orders in real-time, and manage your wallet easily.
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-slate-50">
              <CardHeader className="text-center pb-2">
                <Truck className="w-12 h-12 mx-auto text-orange-500 mb-4" />
                <CardTitle>For Drivers</CardTitle>
                <CardDescription>Earn on your own schedule.</CardDescription>
              </CardHeader>
              <CardContent className="text-center text-slate-600">
                Find available delivery jobs, optimize your routes, and get paid instantly upon completion.
              </CardContent>
            </Card>
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
