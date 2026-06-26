'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package } from 'lucide-react';

export default function DriverEarningsPage() {
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/deliveries/jobs/');
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setIsLoading(false);
    }
  };

  const completedJobs = jobs.filter(j => j.status === 'DONE');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-800 mb-2">
          <DollarSign className="w-8 h-8 text-primary" /> 
          Earnings
        </h1>
        <p className="text-muted-foreground">Track your total delivery earnings and history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-orange-200/50 shadow-sm overflow-hidden md:col-span-1">
          <CardHeader className="bg-orange-50/50 pb-4">
            <CardTitle className="text-orange-600 flex items-center gap-2">
              <DollarSign className="w-5 h-5" /> Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-4xl font-extrabold text-slate-800">
              Rp {Number(user?.financial_summaries?.driver_earnings || 0).toLocaleString('id-ID')}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-slate-500" /> Job History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-slate-500">Loading history...</div>
          ) : completedJobs.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-lg text-slate-500">
              You haven't completed any jobs yet.
            </div>
          ) : (
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b text-slate-600">
                  <tr>
                    <th className="px-6 py-4 font-medium">Completed Date</th>
                    <th className="px-6 py-4 font-medium">Store</th>
                    <th className="px-6 py-4 font-medium">Buyer</th>
                    <th className="px-6 py-4 font-medium text-right">Earning (Delivery Fee)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {completedJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/50 transition-colors bg-white">
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(job.completed_at).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">{job.store_name}</td>
                      <td className="px-6 py-4 text-slate-600">{job.buyer_name}</td>
                      <td className="px-6 py-4 text-right font-bold text-green-600">
                        + Rp {Number(job.driver_earning).toLocaleString('id-ID')}
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
