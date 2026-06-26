'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { User, ClipboardList, Package } from 'lucide-react';

export default function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const accountLinks = [
    { name: 'Profile', href: '/dashboard/seller' },
    { name: 'Revenue', href: '/dashboard/seller/revenue' },
  ];

  const orderLinks = [
    { name: 'Incoming Orders', href: '/dashboard/seller/orders' },
  ];

  const productLinks = [
    { name: 'Manage Product', href: '/dashboard/seller/products' },
  ];

  return (
    <ProtectedRoute allowedRoles={['SELLER']}>
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white md:rounded-xl md:shadow-sm md:border p-4 md:p-6 sticky top-24 flex flex-row md:flex-col gap-4 overflow-x-auto md:space-y-8 scrollbar-hide">
            
            {/* Account Section */}
            <div className="flex-shrink-0">
              <div className="hidden md:flex items-center gap-3 font-bold text-slate-800 mb-3">
                <User className="w-5 h-5 text-primary" />
                <span className="text-base">My Account</span>
              </div>
              <ul className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 md:pl-8">
                {accountLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`block whitespace-nowrap px-4 md:px-0 md:py-1 py-2 rounded-full md:rounded-none text-sm transition-colors ${
                          isActive
                            ? 'text-primary font-bold bg-primary/10 md:bg-transparent border border-primary/20 md:border-transparent'
                            : 'text-slate-600 bg-slate-100 md:bg-transparent hover:bg-slate-200 md:hover:bg-transparent hover:text-slate-900'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Orders Section */}
            <div className="flex-shrink-0">
              <div className="hidden md:flex items-center gap-3 font-bold text-slate-800 mb-3">
                <ClipboardList className="w-5 h-5 text-primary" />
                <span className="text-base">Orders</span>
              </div>
              <ul className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 md:pl-8">
                {orderLinks.map((link) => {
                  const isActive = pathname.startsWith(link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`block whitespace-nowrap px-4 md:px-0 md:py-1 py-2 rounded-full md:rounded-none text-sm transition-colors ${
                          isActive
                            ? 'text-primary font-bold bg-primary/10 md:bg-transparent border border-primary/20 md:border-transparent'
                            : 'text-slate-600 bg-slate-100 md:bg-transparent hover:bg-slate-200 md:hover:bg-transparent hover:text-slate-900'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Products Section */}
            <div className="flex-shrink-0">
              <div className="hidden md:flex items-center gap-3 font-bold text-slate-800 mb-3">
                <Package className="w-5 h-5 text-primary" />
                <span className="text-base">My Products</span>
              </div>
              <ul className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 md:pl-8">
                {productLinks.map((link) => {
                  const isActive = pathname.startsWith(link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`block whitespace-nowrap px-4 md:px-0 md:py-1 py-2 rounded-full md:rounded-none text-sm transition-colors ${
                          isActive
                            ? 'text-primary font-bold bg-primary/10 md:bg-transparent border border-primary/20 md:border-transparent'
                            : 'text-slate-600 bg-slate-100 md:bg-transparent hover:bg-slate-200 md:hover:bg-transparent hover:text-slate-900'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
