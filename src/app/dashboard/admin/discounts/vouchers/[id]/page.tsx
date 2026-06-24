'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Ticket, Calendar, BarChart, Tag } from 'lucide-react';

export default function VoucherDetailPage() {
  const { id } = useParams();
  const [voucher, setVoucher] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        const response = await api.get(`/discounts/admin/vouchers/${id}/`);
        setVoucher(response.data);
      } catch (error) {
        console.error('Failed to fetch voucher', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchVoucher();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!voucher) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Voucher Not Found</h1>
        <Link href="/dashboard/admin/discounts" className="text-primary hover:underline mt-4 inline-block">
          Return to Discounts
        </Link>
      </div>
    );
  }

  const { discount } = voucher;
  const isActive = discount.is_active && new Date(discount.expires_at) > new Date();

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/dashboard/admin/discounts" className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Discounts
      </Link>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-primary/5 p-8 border-b border-slate-100 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary rounded-lg text-white">
                <Ticket className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800 font-mono tracking-wider">{discount.code}</h1>
            </div>
            <p className="text-slate-500 font-medium ml-11">Voucher Details</p>
          </div>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-1">
                  <Tag className="h-4 w-4" /> Discount Value
                </h3>
                <p className="text-2xl font-bold text-slate-800">
                  {discount.value_type === 'PERCENT' ? `${discount.value}% OFF` : `Rp ${discount.value} OFF`}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4" /> Expiry Date
                </h3>
                <p className="text-lg font-medium text-slate-800">
                  {new Date(discount.expires_at).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-2">
                  <BarChart className="h-4 w-4" /> Usage Statistics
                </h3>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-600 font-medium">Used: <span className="text-slate-800">{voucher.used_count}</span></span>
                    <span className="text-slate-600 font-medium">Max: <span className="text-slate-800">{voucher.max_usage}</span></span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${voucher.used_count >= voucher.max_usage ? 'bg-red-500' : 'bg-primary'}`} 
                      style={{ width: `${Math.min((voucher.used_count / voucher.max_usage) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 text-right">
                    {voucher.max_usage - voucher.used_count} uses remaining
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
