import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Fish } from 'lucide-react';

const DUMMY_PRODUCTS = [
  { id: '1', name: 'Fresh Atlantic Salmon', price: 15.99, store: 'Ocean Catch', category: 'Fish' },
  { id: '2', name: 'Tiger Prawns (1kg)', price: 24.50, store: 'Sea Delights', category: 'Shellfish' },
  { id: '3', name: 'Premium Tuna Steak', price: 18.00, store: 'Deep Blue Seafood', category: 'Fish' },
  { id: '4', name: 'Organic Roasted Seaweed', price: 5.99, store: 'Ocean Greens', category: 'Pantry' },
  { id: '5', name: 'Live Lobster', price: 45.00, store: 'Luxury Crustaceans', category: 'Shellfish' },
  { id: '6', name: 'Fresh Oysters (Dozen)', price: 22.00, store: 'Pearl Shells', category: 'Shellfish' },
];

export default function ProductsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Marketplace Catalog</h1>
        <p className="text-muted-foreground">Browse our fresh selections (Public Access - View Only)</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {DUMMY_PRODUCTS.map((product) => (
          <Card key={product.id} className="overflow-hidden flex flex-col transition-hover hover:shadow-lg">
            <div className="h-48 bg-slate-100 flex items-center justify-center text-slate-300">
              <Fish className="w-16 h-16" />
            </div>
            <CardHeader className="pb-2">
              <div className="text-xs font-medium text-primary mb-1">{product.category}</div>
              <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
              <div className="text-sm text-muted-foreground">{product.store}</div>
            </CardHeader>
            <CardContent className="mt-auto">
              <div className="text-xl font-bold">${product.price.toFixed(2)}</div>
            </CardContent>
            <CardFooter>
              <Link href={`/products/${product.id}`} className="w-full">
                <Button variant="outline" className="w-full">View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
