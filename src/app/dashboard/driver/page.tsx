'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Package, DollarSign, ArrowRight } from 'lucide-react';

export default function DriverDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
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

  return (
    <ProtectedRoute allowedRoles={['DRIVER']}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Driver Dashboard</h1>
        <p className="text-muted-foreground mb-8">Welcome back, <strong>{user?.username}</strong>! Manage your delivery jobs here.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-orange-200/50 shadow-sm overflow-hidden">
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

        {jobs.find(j => j.status === 'TAKEN') && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-orange-600">
              <Package className="w-5 h-5" /> Active Delivery
            </h2>
            <Card className="border-orange-200 shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">You have an ongoing delivery</h3>
                    <p className="text-slate-600">Please complete your current delivery before taking another job.</p>
                  </div>
                  <Button 
                    size="lg"
                    className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => router.push(`/dashboard/driver/jobs/${jobs.find(j => j.status === 'TAKEN').id}`)}
                  >
                    View Active Job <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" /> Available Jobs
        </h2>
        
        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Loading jobs...</div>
        ) : jobs.filter(j => j.status === 'AVAILABLE').length === 0 ? (
          <div className="text-center py-12 bg-slate-50 border border-dashed rounded-lg">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-700">No available jobs right now</h3>
            <p className="text-slate-500">Check back later when sellers process new orders.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.filter(j => j.status === 'AVAILABLE').map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow flex flex-col opacity-100">
                <CardHeader className="pb-3 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base text-slate-800">{job.store_name}</CardTitle>
                      <CardDescription className="text-xs mt-1">Delivery: {job.delivery_method}</CardDescription>
                    </div>
                    <div className="bg-green-50 text-green-700 font-bold px-2 py-1 rounded text-sm whitespace-nowrap">
                      Rp {Number(job.driver_earning).toLocaleString('id-ID')}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 flex-1 flex flex-col">
                  <div className="flex gap-2 text-sm text-slate-600 mb-4 flex-1">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="line-clamp-3" title={job.buyer_address}>{job.buyer_address}</p>
                  </div>
                  <Button 
                    className="w-full mt-auto" 
                    variant="outline"
                    onClick={() => router.push(`/dashboard/driver/jobs/${job.id}`)}
                  >
                    View Details <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Job History */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-slate-500" /> Job History
          </h2>
          
          {jobs.filter(j => j.status === 'DONE').length === 0 ? (
            <div className="text-center py-8 bg-slate-50 border rounded-lg text-slate-500">
              You haven't completed any jobs yet.
            </div>
          ) : (
            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
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
                  {jobs.filter(j => j.status === 'DONE').map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
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
        </div>
      </div>
    </ProtectedRoute>
  );
}
