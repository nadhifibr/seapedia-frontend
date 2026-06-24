'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Ticket, Plus, Tag, ArrowLeft } from 'lucide-react';

export default function DiscountsManagementPage() {
  const [activeTab, setActiveTab] = useState<'vouchers' | 'promos'>('vouchers');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/discounts/admin/${activeTab}/`);
        setData(response.data.results || response.data);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard/admin" className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Ticket className="h-8 w-8 text-primary" />
              Discount Management
            </h1>
            <p className="text-slate-500 mt-2">Manage Vouchers and Promos across the marketplace</p>
          </div>
          <div className="flex gap-3">
            <Link 
              href="/dashboard/admin/discounts/vouchers/new"
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> New Voucher
            </Link>
            <Link 
              href="/dashboard/admin/discounts/promos/new"
              className="bg-slate-800 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-slate-700 transition-colors flex items-center gap-2"
            >
              <Tag className="h-4 w-4" /> New Promo
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('vouchers')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'vouchers' ? 'text-primary border-b-2 border-primary -mb-[10px]' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Vouchers
        </button>
        <button
          onClick={() => setActiveTab('promos')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'promos' ? 'text-primary border-b-2 border-primary -mb-[10px]' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Promos
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4">Expiry Date</th>
                {activeTab === 'vouchers' && <th className="px-6 py-4">Usage</th>}
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading...</td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No {activeTab} found.</td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono font-medium">{item.discount.code}</td>
                    <td className="px-6 py-4">
                      {item.discount.value_type === 'PERCENT' ? `${item.discount.value}%` : `Rp ${item.discount.value}`}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(item.discount.expires_at).toLocaleDateString()}
                    </td>
                    {activeTab === 'vouchers' && (
                      <td className="px-6 py-4">
                        {item.used_count} / {item.max_usage}
                      </td>
                    )}
                    <td className="px-6 py-4">
                      {(() => {
                        const isActive = item.discount.is_active && new Date(item.discount.expires_at) > new Date();
                        return (
                          <span className={`px-2 py-1 text-xs rounded-full ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4">
                      <Link 
                        href={`/dashboard/admin/discounts/${activeTab}/${item.id}`}
                        className="text-primary font-medium hover:underline"
                      >
                        View Detail
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
