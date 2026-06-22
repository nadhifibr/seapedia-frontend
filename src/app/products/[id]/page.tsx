import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Fish, AlertCircle, ArrowLeft } from 'lucide-react';

const DUMMY_PRODUCTS = [
  { id: '1', name: 'Fresh Atlantic Salmon', price: 15.99, store: 'Ocean Catch', category: 'Fish', description: 'Premium quality Atlantic Salmon, delivered fresh to your door. Perfect for grilling or baking.', stock: 24 },
  { id: '2', name: 'Tiger Prawns (1kg)', price: 24.50, store: 'Sea Delights', category: 'Shellfish', description: 'Large, juicy tiger prawns. Responsibly sourced.', stock: 12 },
  { id: '3', name: 'Premium Tuna Steak', price: 18.00, store: 'Deep Blue Seafood', category: 'Fish', description: 'Sushi-grade Ahi Tuna steaks.', stock: 8 },
  { id: '4', name: 'Organic Roasted Seaweed', price: 5.99, store: 'Ocean Greens', category: 'Pantry', description: 'Healthy and delicious snack.', stock: 100 },
  { id: '5', name: 'Live Lobster', price: 45.00, store: 'Luxury Crustaceans', category: 'Shellfish', description: 'Fresh live lobster, overnight shipping.', stock: 5 },
  { id: '6', name: 'Fresh Oysters (Dozen)', price: 22.00, store: 'Pearl Shells', category: 'Shellfish', description: 'Dozen freshly harvested oysters.', stock: 30 },
];

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = DUMMY_PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Product Not Found</h1>
        <Link href="/products" className="text-primary hover:underline mt-4 inline-block">Back to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Link>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center border text-slate-300">
          <Fish className="w-32 h-32" />
        </div>
        
        <div className="space-y-8">
          <div>
            <div className="text-sm font-medium text-primary mb-2">{product.category}</div>
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-lg text-muted-foreground">Sold by <span className="font-medium text-slate-900">{product.store}</span></p>
          </div>
          
          <div className="text-3xl font-extrabold">${product.price.toFixed(2)}</div>
          
          <div className="prose text-slate-600">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Description</h3>
            <p>{product.description}</p>
          </div>
          
          <Card className="bg-slate-50 border-dashed">
            <CardContent className="p-6 flex items-start gap-4 text-slate-600">
              <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
              <div>
                <p className="font-medium text-slate-900">Guest View Mode</p>
                <p className="text-sm mt-1">To add items to your cart and checkout, you must log in and select the Buyer role.</p>
                <div className="mt-4 flex gap-4">
                  <Link href="/auth/login">
                    <Button variant="default">Login to Buy</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
