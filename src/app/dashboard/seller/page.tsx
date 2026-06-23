'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp } from 'lucide-react';

export default function SellerDashboard() {
  const { user } = useAuthStore();
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Store form state
  const [storeForm, setStoreForm] = useState({ name: '', description: '', image_url: '' });
  const [isStoreSubmitting, setIsStoreSubmitting] = useState(false);
  const [storeError, setStoreError] = useState('');

  // Product form state
  const [productForm, setProductForm] = useState({ id: '', name: '', description: '', price: '', stock: '', image_url: '', category: 'OTHER' });
  const [isProductSubmitting, setIsProductSubmitting] = useState(false);
  const [productError, setProductError] = useState('');
  const [isEditingProduct, setIsEditingProduct] = useState(false);

  // Report State
  const [report, setReport] = useState<{total_revenue: number, total_orders: number}>({ total_revenue: 0, total_orders: 0 });

  useEffect(() => {
    fetchStore();
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const res = await api.get('/orders/incoming/report/');
      setReport(res.data);
    } catch (err) {
      console.error('Failed to fetch report', err);
    }
  };

  const fetchStore = async () => {
    try {
      const res = await api.get('/stores/my-store/');
      setStore(res.data);
      setStoreForm({ name: res.data.name, description: res.data.description, image_url: res.data.image_url || '' });
      fetchProducts();
    } catch (err: any) {
      if (err.response?.status !== 404) {
        console.error('Failed to fetch store', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products/my-products/');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  const handleStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsStoreSubmitting(true);
    setStoreError('');
    try {
      if (store) {
        await api.patch('/stores/my-store/', storeForm);
      } else {
        await api.post('/stores/my-store/', storeForm);
      }
      await fetchStore();
      alert(store ? 'Store updated!' : 'Store created successfully!');
    } catch (err: any) {
      setStoreError(err.response?.data?.name?.[0] || err.response?.data?.detail || 'Failed to save store');
    } finally {
      setIsStoreSubmitting(false);
    }
  };

  const resetProductForm = () => {
    setProductForm({ id: '', name: '', description: '', price: '', stock: '', image_url: '', category: 'OTHER' });
    setIsEditingProduct(false);
    setProductError('');
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProductSubmitting(true);
    setProductError('');
    try {
      if (isEditingProduct) {
        await api.patch(`/products/my-products/${productForm.id}/`, productForm);
      } else {
        await api.post('/products/my-products/', productForm);
      }
      await fetchProducts();
      resetProductForm();
      alert(isEditingProduct ? 'Product updated!' : 'Product created!');
    } catch (err: any) {
      setProductError(err.response?.data?.detail || err.response?.data?.stock?.[0] || 'Failed to save product');
    } finally {
      setIsProductSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/my-products/${id}/`);
      await fetchProducts();
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

  const handleEditProduct = (prod: any) => {
    setProductForm({
      id: prod.id,
      name: prod.name,
      description: prod.description,
      price: prod.price,
      stock: prod.stock,
      image_url: prod.image_url || '',
      category: prod.category || 'OTHER'
    });
    setIsEditingProduct(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  if (isLoading) return <div className="p-12 text-center text-lg">Loading Dashboard...</div>;

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Seller Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, <strong>{user?.username}</strong>!</p>
          </div>
          <Button variant="outline" onClick={() => window.location.href = '/dashboard/seller/orders'}>
            View Store Orders
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Store Management & Summary */}
          <div className="lg:col-span-1 space-y-6">
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

            <Card>
              <CardHeader>
                <CardTitle>{store ? 'Manage Store' : 'Create Store'}</CardTitle>
                <CardDescription>Your store is your public identity.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleStoreSubmit} className="space-y-4">
                  {storeError && <div className="text-red-500 text-sm font-medium p-2 bg-red-50 rounded">{storeError}</div>}
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input id="storeName" value={storeForm.name} onChange={e => setStoreForm({...storeForm, name: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeDesc">Description</Label>
                    <textarea 
                      id="storeDesc" 
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={storeForm.description} 
                      onChange={e => setStoreForm({...storeForm, description: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeImg">Store Logo URL</Label>
                    <Input id="storeImg" type="url" placeholder="https://..." value={storeForm.image_url} onChange={e => setStoreForm({...storeForm, image_url: e.target.value})} />
                  </div>
                  <Button type="submit" disabled={isStoreSubmitting} className="w-full">
                    {isStoreSubmitting ? 'Saving...' : (store ? 'Update Store Info' : 'Create My Store')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Product Management */}
          <div className="lg:col-span-2 space-y-6">
            {!store ? (
              <Card className="bg-slate-50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="text-muted-foreground mb-4 font-medium">You must create a store first to manage products.</div>
                  <p className="text-sm text-slate-400">Fill out the form on the left to get started.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Your Products</CardTitle>
                    <CardDescription>Manage the products you sell to the public.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {products.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground bg-slate-50 rounded-lg">No products found. Start adding some below!</div>
                    ) : (
                      <div className="overflow-x-auto border rounded-lg">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                            <tr>
                              <th className="px-4 py-3">Product</th>
                              <th className="px-4 py-3">Price</th>
                              <th className="px-4 py-3">Stock</th>
                              <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {products.map(p => (
                              <tr key={p.id} className="bg-white hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3 font-medium flex items-center gap-3">
                                  {p.image_url ? (
                                    <img src={p.image_url} alt={p.name} className="w-10 h-10 object-cover rounded shadow-sm" />
                                  ) : (
                                    <div className="w-10 h-10 bg-slate-200 flex items-center justify-center rounded text-[10px] text-slate-500 font-medium">No Img</div>
                                  )}
                                  {p.name}
                                </td>
                                <td className="px-4 py-3">${Number(p.price).toFixed(2)}</td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {p.stock} in stock
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right space-x-2">
                                  <Button variant="outline" size="sm" onClick={() => handleEditProduct(p)}>Edit</Button>
                                  <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(p.id)}>Delete</Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{isEditingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProductSubmit} className="space-y-4">
                      {productError && <div className="text-red-500 text-sm font-medium p-2 bg-red-50 rounded">{productError}</div>}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Product Name</Label>
                          <Input required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <Label>Price ($)</Label>
                          <Input required type="number" step="0.01" min="0" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <Label>Stock</Label>
                          <Input required type="number" min={isEditingProduct ? 0 : 1} value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={productForm.category}
                            onChange={e => setProductForm({...productForm, category: e.target.value})}
                          >
                            <option value="FISHING_GEAR">Fishing Gear</option>
                            <option value="DIVING_GEAR">Diving Gear</option>
                            <option value="MARINE_EQUIPMENT">Marine Equipment</option>
                            <option value="OCEAN_APPAREL">Ocean Apparel</option>
                            <option value="OCEAN_ACCESSORIES">Ocean Accessories</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Image URL (Optional)</Label>
                          <Input type="url" placeholder="https://..." value={productForm.image_url} onChange={e => setProductForm({...productForm, image_url: e.target.value})} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Description</Label>
                          <textarea 
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            required 
                            value={productForm.description} 
                            onChange={e => setProductForm({...productForm, description: e.target.value})} 
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" disabled={isProductSubmitting}>
                          {isProductSubmitting ? 'Saving...' : (isEditingProduct ? 'Save Changes' : 'Create Product')}
                        </Button>
                        {isEditingProduct && (
                          <Button type="button" variant="outline" onClick={resetProductForm}>Cancel Edit</Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
