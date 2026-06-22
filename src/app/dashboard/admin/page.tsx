'use client';

import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { useAuthStore } from '@/stores/authStore';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  
  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-lg">Welcome back, Administrator <strong>{user?.username}</strong>!</p>
          <p className="text-muted-foreground mt-1">Monitor the marketplace operations.</p>
          
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-slate-50 border rounded-lg text-muted-foreground flex items-center justify-center h-32">
              Users (Coming Soon)
            </div>
            <div className="p-6 bg-slate-50 border rounded-lg text-muted-foreground flex items-center justify-center h-32">
              Orders (Coming Soon)
            </div>
            <div className="p-6 bg-slate-50 border rounded-lg text-muted-foreground flex items-center justify-center h-32">
              Discounts (Coming Soon)
            </div>
            <div className="p-6 bg-slate-50 border rounded-lg text-muted-foreground flex items-center justify-center h-32">
              Overdue (Coming Soon)
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
