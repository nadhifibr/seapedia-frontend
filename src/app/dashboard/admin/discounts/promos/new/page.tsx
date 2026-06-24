'use client';

import { useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewPromoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    code: '',
    value: '',
    value_type: 'PERCENT',
    expires_at: '',
    description: '',
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/discounts/admin/promos/', {
        discount: {
          code: formData.code,
          value: parseFloat(formData.value),
          value_type: formData.value_type,
          expires_at: new Date(formData.expires_at).toISOString(),
          is_active: formData.is_active,
        },
        description: formData.description,
      });
      router.push('/dashboard/admin/discounts');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to create promo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link href="/dashboard/admin/discounts" className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Discounts
      </Link>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Generate New Promo</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Promo Code</label>
              <input 
                type="text" 
                required
                value={formData.code}
                onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="e.g. MEGA10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Expiry Date & Time</label>
              <input 
                type="datetime-local" 
                required
                value={formData.expires_at}
                onChange={e => setFormData({...formData, expires_at: e.target.value})}
                className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Discount Value</label>
              <input 
                type="number" 
                required
                min="0"
                step="0.01"
                value={formData.value}
                onChange={e => setFormData({...formData, value: e.target.value})}
                className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="e.g. 50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Value Type</label>
              <select 
                value={formData.value_type}
                onChange={e => setFormData({...formData, value_type: e.target.value})}
                className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
              >
                <option value="PERCENT">Percent (%)</option>
                <option value="FIXED">Fixed Amount (Rp)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea 
              rows={3}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Brief description of this promo..."
            ></textarea>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="is_active"
              checked={formData.is_active}
              onChange={e => setFormData({...formData, is_active: e.target.checked})}
              className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-slate-700">Set as Active Immediately</label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-slate-800 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm hover:bg-slate-700 transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              {loading ? 'Generating...' : 'Generate Promo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
