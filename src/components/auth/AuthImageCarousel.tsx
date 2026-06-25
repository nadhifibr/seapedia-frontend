'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const images = [
  '/categories/diving_gear 1.png',
  '/categories/fishing_gear 1.png',
  '/categories/marine_equipment 1.png',
  '/categories/ocean_accessories 1.png',
  '/categories/ocean_apparel 1.png',
  '/categories/other_marine 1.png',
];

export function AuthImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full bg-slate-100 overflow-hidden">
      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={src}
            alt="Seapedia category"
            fill
            sizes="50vw"
            priority={index === 0}
            className="object-cover"
          />
        </div>
      ))}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-900/60 to-transparent pointer-events-none" />
      <div className="absolute bottom-12 left-12 z-30 text-white max-w-md">
        <h2 className="text-4xl font-bold mb-4">Discover the Ocean's Finest</h2>
        <p className="text-lg text-slate-200">
          Join the largest marketplace for marine and ocean enthusiasts. From diving gear to fishing equipment, we have everything you need.
        </p>
      </div>
    </div>
  );
}
