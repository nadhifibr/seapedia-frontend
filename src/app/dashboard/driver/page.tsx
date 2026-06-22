'use client';

import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { useAuthStore } from '@/stores/authStore';

export default function DriverDashboard() {
  const { user } = useAuthStore();
  
  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Driver Dashboard</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-lg">Welcome back, <strong>{user?.username}</strong>!</p>
          <p className="text-muted-foreground mt-1">Manage your delivery jobs.</p>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Total Earnings</h3>
              <p className="text-3xl font-bold text-orange-500">
                ${user?.financial_summaries?.driver_earnings?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="p-6 bg-slate-50 border rounded-lg text-muted-foreground flex items-center justify-center h-32">
              Find Jobs (Coming Soon)
            </div>
            <div className="p-6 bg-slate-50 border rounded-lg text-muted-foreground flex items-center justify-center h-32">
              Active Delivery (Coming Soon)
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
