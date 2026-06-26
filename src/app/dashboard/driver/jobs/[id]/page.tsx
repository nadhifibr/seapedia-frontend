'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Package, Store, CheckCircle } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

export default function DriverJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { fetchProfile } = useAuthStore();
  const { id } = use(params);
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const res = await api.get(`/deliveries/jobs/${id}/`);
      setJob(res.data);
    } catch (err) {
      console.error('Failed to fetch job details', err);
      alert('Failed to load job details.');
      router.push('/dashboard/driver');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTakeJob = async () => {
    try {
      setIsProcessing(true);
      await api.post(`/deliveries/jobs/${id}/take/`);
      await fetchJobDetails();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to take job.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteJob = async () => {
    try {
      setIsProcessing(true);
      await api.post(`/deliveries/jobs/${id}/complete/`);
      await fetchJobDetails();
      await fetchProfile();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to complete job.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-24 text-center">Loading Job Details...</div>;
  }

  if (!job) return null;

  return (
    <ProtectedRoute allowedRoles={['DRIVER']}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.push('/dashboard/driver/orders')} className="mb-6 -ml-4 cursor-pointer">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
        </Button>

        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Job Details</h1>
            <p className="text-slate-500 mt-1">Delivery Method: <span className="font-semibold text-slate-700">{job.delivery_method}</span></p>
          </div>
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg flex items-center gap-2 border border-green-200">
            <span className="text-2xl font-black">Rp {Number(job.driver_earning).toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Route Info */}
          <Card className="md:col-span-2 border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 pb-4 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" /> Delivery Route
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-8 relative">
                <div className="absolute left-[11px] top-8 bottom-8 w-0.5 bg-slate-200 z-0"></div>
                
                {/* Pickup */}
                <div className="flex gap-4 relative z-10">
                  <div className="bg-primary w-6 h-6 rounded-full border-4 border-white shadow flex items-center justify-center shrink-0 mt-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Pickup at Store</span>
                    <h3 className="font-bold text-lg text-slate-800 mt-1 flex items-center gap-2">
                      <Store className="w-4 h-4 text-slate-400" /> {job.store_name}
                    </h3>
                  </div>
                </div>

                {/* Dropoff */}
                <div className="flex gap-4 relative z-10">
                  <div className="bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-green-600">Deliver to Buyer</span>
                    <h3 className="font-bold text-lg text-slate-800 mt-1">{job.buyer_name}</h3>
                    <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{job.buyer_address}</p>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Package Contents */}
          <Card className="md:col-span-2 border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 pb-4 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-slate-600" /> Package Contents
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {job.items?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg bg-white">
                  <div className="w-12 h-12 bg-slate-100 rounded border overflow-hidden shrink-0">
                    {item.product_image ? (
                      <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">No Img</div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-800">{item.product_name}</p>
                    <p className="text-xs text-slate-500">{item.quantity} items</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <div className="md:col-span-2 mt-4">
            {job.status === 'AVAILABLE' && (
              <>
                <Button className="w-full h-14 text-lg font-bold" size="lg" onClick={handleTakeJob} disabled={isProcessing}>
                  {isProcessing ? 'Processing...' : 'Take Job'}
                </Button>
                <p className="text-center text-xs text-slate-500 mt-3">You can review the details before accepting.</p>
              </>
            )}
            {job.status === 'TAKEN' && (
              <>
                <Button className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-700" size="lg" onClick={handleCompleteJob} disabled={isProcessing}>
                  {isProcessing ? 'Processing...' : 'Mark as Delivered'}
                </Button>
                <p className="text-center text-xs text-slate-500 mt-3">Only click this after you have handed the package to the buyer.</p>
              </>
            )}
            {job.status === 'DONE' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-green-800">Job Completed</h3>
                <p className="text-green-600 mt-1">Earnings have been added to your profile.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}
