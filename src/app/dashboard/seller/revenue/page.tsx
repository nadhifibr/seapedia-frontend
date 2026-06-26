'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp, Clock } from 'lucide-react';

export default function SellerRevenuePage() {
  const [report, setReport] = useState<{total_revenue: number, total_orders: number, history: any[]}>({ total_revenue: 0, total_orders: 0, history: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const res = await api.get('/orders/incoming/report/');
      setReport({
        total_revenue: res.data.total_revenue || 0,
        total_orders: res.data.total_orders || 0,
        history: res.data.history || []
      });
    } catch (err) {
      console.error('Failed to fetch report', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-12 text-center text-lg">Loading Revenue Data...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Revenue & Earnings</h1>
        <p className="text-muted-foreground">Track your store's financial performance.</p>
      </div>

      {/* REVENUE SUMMARY */}
      <Card className="border-green-200/50 shadow-sm overflow-hidden">
        <CardHeader className="bg-green-50/50 pb-4">
          <CardTitle className="flex items-center gap-2 text-green-600">
            <TrendingUp className="w-5 h-5" /> Revenue Summary
          </CardTitle>
          <CardDescription>Income from active and completed orders</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-500">Total Product Revenue</span>
            <span className="text-4xl font-extrabold text-slate-800">
              Rp {Number(report.total_revenue).toLocaleString('id-ID')}
            </span>
          </div>
          <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm">
            <span className="text-slate-600">Active/Completed Orders</span>
            <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full">{report.total_orders}</span>
          </div>
        </CardContent>
      </Card>

      {/* REVENUE HISTORY */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-500" />
            Revenue History
          </CardTitle>
          <CardDescription>Detailed history of earnings from each order.</CardDescription>
        </CardHeader>
        <CardContent>
          {report.history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-slate-50 rounded-lg">
              No revenue history available yet.
            </div>
          ) : (
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                  <tr>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Revenue Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {report.history.map(item => (
                    <tr key={item.id} className="bg-white hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">{item.id}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-xs font-semibold">
                          {item.status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-green-700">
                        + Rp {Number(item.revenue).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
