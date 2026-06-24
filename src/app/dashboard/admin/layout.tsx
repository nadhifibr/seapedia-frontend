import { ProtectedRoute } from '@/components/shared/ProtectedRoute';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="flex-1 w-full bg-slate-50 min-h-screen">
        {children}
      </div>
    </ProtectedRoute>
  );
}
