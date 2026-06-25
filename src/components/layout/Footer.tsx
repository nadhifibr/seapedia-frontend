import Link from 'next/link';
import Image from 'next/image';
import { MessageSquareHeart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          
          {/* Kolom 1: Tentang */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Link href="/">
              <Image 
                src="/logo-text-navy.svg" 
                alt="Seapedia" 
                width={120} 
                height={30} 
                className="h-6 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed lg:pr-8">
              Platform marketplace terintegrasi pertama untuk nelayan, penyelam, dan pecinta laut. Menghubungkan pembeli, penjual, dan pengemudi dalam satu ekosistem bahari.
            </p>
          </div>

          {/* Kolom 2: Jelajahi */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold text-slate-900 tracking-wider">Jelajahi Seapedia</h4>
            <ul className="flex flex-col gap-3 text-sm text-slate-500">
              <li><Link href="/" className="hover:text-[#0B3D91] transition-colors">Beranda</Link></li>
              <li><Link href="/search" className="hover:text-[#0B3D91] transition-colors">Semua Produk</Link></li>
              <li><Link href="#" className="hover:text-[#0B3D91] transition-colors">Toko Terpercaya</Link></li>
              <li><Link href="/" className="hover:text-[#0B3D91] transition-colors">Promo & Diskon</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Layanan Pelanggan */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold text-slate-900 tracking-wider">Layanan Pelanggan</h4>
            <ul className="flex flex-col gap-3 text-sm text-slate-500">
              <li><Link href="/" className="hover:text-[#0B3D91] transition-colors">Pusat Bantuan</Link></li>
              <li><Link href="/guide" className="hover:text-[#0B3D91] transition-colors">Panduan Pembeli</Link></li>
              <li><Link href="/" className="hover:text-[#0B3D91] transition-colors">Cara Berjualan</Link></li>
              <li><Link href="/reviews" className="hover:text-[#0B3D91] transition-colors">Beri Ulasan Aplikasi</Link></li>
            </ul>
          </div>

          {/* Kolom 4: Ikuti Kami */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold text-slate-900 tracking-wider">Ikuti Kami</h4>
            <p className="text-sm text-slate-500">Tetap terhubung untuk mendapatkan update terbaru dari kami.</p>
            <div className="flex gap-4 mt-1">
              <a href="https://instagram.com/nadhifibr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-pink-100 hover:text-pink-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://linkedin.com/in/muhammad-nadhif-ibrahim" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="https://github.com/nadhifibr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              </a>
              <a href="https://nadhifibr.site" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-emerald-100 hover:text-emerald-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
              </a>
            </div>
          </div>
          
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} SEAPEDIA. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-600 transition-colors">Privasi</Link>
            <Link href="/" className="hover:text-slate-600 transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
