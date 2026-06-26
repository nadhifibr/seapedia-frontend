'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { 
  Users, Store, Package, ShoppingCart, 
  Ticket, Truck, AlertTriangle, Activity,
  ChevronLeft, ChevronRight
} from 'lucide-react';

interface DashboardData {
  users: number;
  stores: number;
  products: number;
  orders: number;
  vouchers_promos: number;
  delivery_jobs: number;
  overdue_orders: number;
}

interface Column {
  header: string;
  accessor: string;
  render?: (value: any, row: any) => React.ReactNode;
}

function DataTable({ endpoint, columns }: { endpoint: string; columns: Column[] }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/admin_panel/${endpoint}/?page=${page}`);
        setData(response.data.results);
        setHasNext(!!response.data.next);
        setHasPrev(!!response.data.previous);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [endpoint, page]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-100">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-6 py-4">{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-500">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <p className="mt-2">Loading data...</p>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-500">
                  No data available.
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  {columns.map((col, j) => (
                    <td key={j} className="px-6 py-4 text-slate-700">
                      {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-sm text-slate-500">Page {page}</span>
        <div className="flex gap-2">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={!hasPrev || loading}
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-slate-600" />
          </button>
          <button 
            onClick={() => setPage(p => p + 1)}
            disabled={!hasNext || loading}
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronRight className="h-4 w-4 text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get('/admin_panel/dashboard/');
        setSummary(response.data);
      } catch (error) {
        console.error('Failed to fetch summary data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const statCards = [
    { title: 'Total Users', value: summary?.users ?? 0, icon: Users, color: 'bg-blue-500' },
    { title: 'Active Stores', value: summary?.stores ?? 0, icon: Store, color: 'bg-emerald-500' },
    { title: 'Products', value: summary?.products ?? 0, icon: Package, color: 'bg-indigo-500' },
    { title: 'Orders', value: summary?.orders ?? 0, icon: ShoppingCart, color: 'bg-orange-500' },
    { title: 'Vouchers/Promos', value: summary?.vouchers_promos ?? 0, icon: Ticket, color: 'bg-pink-500' },
    { title: 'Delivery Jobs', value: summary?.delivery_jobs ?? 0, icon: Truck, color: 'bg-cyan-500' },
    { title: 'Overdue Orders', value: summary?.overdue_orders ?? 0, icon: AlertTriangle, color: 'bg-red-500' },
  ];

  const tabs = [
    { id: 'users', label: 'Users', endpoint: 'users', columns: [
      { header: 'Username', accessor: 'username' },
      { header: 'Email', accessor: 'email' },
      { header: 'Roles', accessor: 'roles', render: (val: string[]) => (
        <div className="flex gap-1 flex-wrap">
          {val?.map(r => <span key={r} className="px-2 py-1 text-xs bg-slate-100 rounded-full">{r}</span>)}
        </div>
      )},
      { header: 'Wallet Balance', accessor: 'wallet_balance', render: (val: string) => `Rp ${val}` }
    ]},
    { id: 'stores', label: 'Stores', endpoint: 'stores', columns: [
      { header: 'Store Name', accessor: 'name', render: (val: string) => <span className="font-medium">{val}</span> },
      { header: 'Owner Username', accessor: 'owner' },
      { header: 'Created At', accessor: 'created_at', render: (val: string) => new Date(val).toLocaleDateString() }
    ]},
    { id: 'products', label: 'Products', endpoint: 'products', columns: [
      { header: 'Product Name', accessor: 'name', render: (val: string) => <span className="font-medium">{val}</span> },
      { header: 'Store', accessor: 'store_name' },
      { header: 'Category', accessor: 'category' },
      { header: 'Price', accessor: 'price', render: (val: string) => `Rp ${val}` },
      { header: 'Stock', accessor: 'stock' },
      { header: 'Status', accessor: 'is_active', render: (val: boolean) => (
        <span className={`px-2 py-1 text-xs rounded-full ${val ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
          {val ? 'Active' : 'Inactive'}
        </span>
      )}
    ]},
    { id: 'orders', label: 'Orders', endpoint: 'orders', columns: [
      { header: 'Order ID', accessor: 'id', render: (val: string) => <span className="text-xs text-slate-500">{val ? val.substring(0, 8) + '...' : '-'}</span> },
      { header: 'Buyer', accessor: 'buyer_username' },
      { header: 'Store', accessor: 'store_name' },
      { header: 'Total', accessor: 'total', render: (val: string) => <span className="font-medium">Rp {val}</span> },
      { header: 'Delivery', accessor: 'delivery_method' },
      { header: 'Deadline', accessor: 'overdue_at', render: (val: string, row: any) => {
        if (!val) return '-';
        const isOverdue = new Date(val) < new Date() && row.status !== 'PESANAN_SELESAI' && row.status !== 'DIKEMBALIKAN';
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${isOverdue ? 'bg-red-100 text-red-700 font-bold' : 'bg-slate-100 text-slate-600'}`}>
            {new Date(val).toLocaleDateString()} {new Date(val).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </span>
        );
      }},
      { header: 'Status', accessor: 'status', render: (val: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${val === 'DIKEMBALIKAN' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{val ? val.replace(/_/g, ' ') : '-'}</span>
      )}
    ]},
    { id: 'discounts', label: 'Vouchers/Promos', endpoint: 'discounts', columns: [
      { header: 'Code', accessor: 'code', render: (val: string) => <span className="font-mono font-medium">{val}</span> },
      { header: 'Type', accessor: 'type' },
      { header: 'Value', accessor: 'value', render: (val: string, row: any) => `${val} ${row.value_type === 'PERCENT' ? '%' : 'Rp'}` },
      { header: 'Status', accessor: 'is_active', render: (val: boolean, row: any) => {
        const isActive = val && new Date(row.expires_at) > new Date();
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      }}
    ]},
    { id: 'deliveries', label: 'Delivery Jobs', endpoint: 'deliveries', columns: [
      { header: 'Order ID', accessor: 'order_id', render: (val: string) => <span className="text-xs text-slate-500">{val ? val.substring(0, 8) + '...' : '-'}</span> },
      { header: 'Driver', accessor: 'driver_username', render: (val: string) => val || <span className="text-slate-400 italic">Unassigned</span> },
      { header: 'Status', accessor: 'status', render: (val: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${val === 'DONE' ? 'bg-emerald-100 text-emerald-700' : val === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
          {val || '-'}
        </span>
      )}
    ]}
  ];

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const activeTabData = tabs.find(t => t.id === activeTab);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" />
            Admin Monitoring Dashboard
          </h1>
          <p className="text-slate-500 mt-2">Marketplace Overview & Statistics</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button 
            onClick={async () => {
              try {
                await api.post('/admin_panel/orders/trigger-overdue/');
                alert('Overdue check completed. Refreshing data...');
                window.location.reload();
              } catch (e) { alert('Error triggering overdue check'); }
            }}
            className="bg-amber-500 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-amber-600 transition-colors flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Run Overdue Check
          </button>
          <button 
            onClick={async () => {
              try {
                await api.post('/admin_panel/orders/simulate-time/', { days: 1 });
                alert('Simulated +1 day. Refreshing data...');
                window.location.reload();
              } catch (e) { alert('Error simulating time'); }
            }}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-slate-700 transition-colors flex items-center gap-2"
          >
            Simulate +1 Day
          </button>
          <a 
            href="/dashboard/admin/discounts"
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Ticket className="h-4 w-4" />
            Manage Discounts
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4 mb-10">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col justify-center items-center gap-2 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
          >
            <div className={`p-3 rounded-full ${stat.color} bg-opacity-10 mb-1`}>
              <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 leading-none">{stat.value.toLocaleString()}</h3>
            <p className="text-xs font-medium text-slate-500 text-center">{stat.title}</p>
          </div>
        ))}
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Detailed Marketplace Data</h2>
        
        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-4 mb-4 hide-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Data Table */}
        {activeTabData && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <DataTable endpoint={activeTabData.endpoint} columns={activeTabData.columns} />
          </div>
        )}
      </div>

    </div>
  );
}
