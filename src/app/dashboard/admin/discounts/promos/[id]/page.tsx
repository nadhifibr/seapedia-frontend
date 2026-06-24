'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, Tag, AlignLeft } from 'lucide-react';

export default function PromoDetailPage() {
  const { id } = useParams();
  const [promo, setPromo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const response = await api.get(`/discounts/admin/promos/${id}/`);
        setPromo(response.data);
      } catch (error) {
        console.error('Failed to fetch promo', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPromo();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  if (!promo) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Promo Not Found</h1>
        <Link href="/dashboard/admin/discounts" className="text-slate-800 hover:underline mt-4 inline-block">
          Return to Discounts
        </Link>
      </div>
    );
  }

  const { discount } = promo;
  const isActive = discount.is_active && new Date(discount.expires_at) > new Date();

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/dashboard/admin/discounts" className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Discounts
      </Link>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-slate-800 text-white p-8 border-b border-slate-700 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg text-white">
                <Tag className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold font-mono tracking-wider">{discount.code}</h1>
            </div>
            <p className="text-slate-300 font-medium ml-11">Promo Details</p>
          </div>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${isActive ? 'bg-emerald-400 text-slate-900' : 'bg-slate-600 text-slate-300'}`}>
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
                  <AlignLeft className="h-4 w-4" /> Description
                </h3>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {promo.description || <span className="text-slate-400 italic">No description provided.</span>}
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
