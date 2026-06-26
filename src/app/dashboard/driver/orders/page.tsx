'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ArrowRight, MapPin } from 'lucide-react';

export default function DriverOrdersPage() {
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

  const activeJobs = jobs.filter(j => j.status === 'TAKEN');
  const availableJobs = jobs.filter(j => j.status === 'AVAILABLE');
  const completedJobs = jobs.filter(j => j.status === 'DONE');

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-800 mb-2">
          <Package className="w-8 h-8 text-primary" /> 
          Orders
        </h1>
        <p className="text-muted-foreground">Manage your delivery jobs here.</p>
      </div>

      {activeJobs.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-orange-600">
            <Package className="w-5 h-5" /> Active Deliveries ({activeJobs.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeJobs.map((job) => (
              <Card key={job.id} className="border-orange-300 shadow-md bg-gradient-to-br from-orange-50 to-white flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3 border-b border-orange-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base text-orange-900">{job.store_name}</CardTitle>
                      <CardDescription className="text-xs mt-1 text-orange-700/80 font-medium">To: {job.buyer_name}</CardDescription>
                    </div>
                    <div className="bg-orange-100 text-orange-800 font-bold px-2 py-1 rounded text-sm whitespace-nowrap border border-orange-200">
                      Rp {Number(job.driver_earning).toLocaleString('id-ID')}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 flex-1 flex flex-col">
                  <div className="flex gap-2 text-sm text-slate-600 mb-4 flex-1">
                    <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <p className="line-clamp-2" title={job.buyer_address}>{job.buyer_address}</p>
                  </div>
                  <Button 
                    className="w-full mt-auto bg-orange-500 hover:bg-orange-600 text-white shadow-sm cursor-pointer"
                    onClick={() => router.push(`/dashboard/driver/jobs/${job.id}`)}
                  >
                    View Delivery <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Available Jobs */}
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" /> Available Jobs
        </h2>
        
        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Loading jobs...</div>
        ) : availableJobs.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 border border-dashed rounded-lg">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-700">No available jobs right now</h3>
            <p className="text-slate-500">Check back later when sellers process new orders.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow flex flex-col bg-white">
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
                    className="w-full mt-auto cursor-pointer" 
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
      </section>

      {/* Job History */}
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-slate-500" /> Job History
        </h2>
        
        {completedJobs.length === 0 ? (
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
                {completedJobs.map((job) => (
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
      </section>
    </div>
  );
}
