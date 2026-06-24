'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Fish, ArrowLeft, Store as StoreIcon, ShieldCheck, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Minus } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState({ average_rating: 0, total_reviews: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  // Review Form State
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    if (id) {
      fetchProduct(id as string);
      fetchReviews(id as string);
    }
  }, [id]);

  const fetchReviews = async (productId: string) => {
    try {
      const res = await api.get(`/reviews/product/${productId}/`);
      setReviews(res.data.reviews);
      setStats(res.data.stats);
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    }
  };

  const fetchProduct = async (productId: string) => {
    try {
      const res = await api.get(`/products/${productId}/`);
      setProduct(res.data);
    } catch (err) {
      console.error('Failed to fetch product detail', err);
      // fallback or error could be shown
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await api.post('/cart/items/', { product_id: product.id, quantity: quantity });
      alert(`Added ${quantity} item(s) to cart!`);
    } catch (err: any) {
      if (err.response?.data?.error_code === 'STORE_CONFLICT') {
        const confirmClear = confirm(`Your cart already contains items from a different store. Do you want to clear your cart and add this product from ${product.store.name} instead?`);
        if (confirmClear) {
          try {
            await api.delete('/cart/');
            await api.post('/cart/items/', { product_id: product.id, quantity: quantity });
            alert('Cart cleared and product added successfully!');
          } catch (retryErr) {
            alert('Failed to add product after clearing cart.');
          }
        }
      } else {
        alert(err.response?.data?.detail || 'Failed to add to cart.');
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    setIsSubmittingReview(true);
    try {
      await api.post(`/reviews/product/${product.id}/`, { rating, comment });
      alert('Review submitted successfully!');
      setComment('');
      setRating(5);
      fetchReviews(product.id);
    } catch (err: any) {
      setReviewError(err.response?.data?.detail || 'Failed to submit review. You must have purchased this product.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-24 text-center text-lg">Loading Product...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Button onClick={() => router.push('/products')} variant="outline">Back to Catalog</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Button variant="ghost" onClick={() => router.push('/products')} className="mb-6 -ml-4 text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Catalog
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-slate-100 rounded-xl aspect-square flex items-center justify-center overflow-hidden border">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <Fish className="w-32 h-32 text-slate-300" />
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                {product.category?.replace('_', ' ')}
              </div>
              <div className="flex items-center text-sm font-medium text-slate-600">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 mr-1" />
                {stats.average_rating > 0 ? stats.average_rating : 'New'} 
                <span className="text-slate-400 ml-1">({stats.total_reviews} reviews)</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-primary mb-4">${Number(product.price).toFixed(2)}</div>
            
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-6 ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {product.stock > 0 ? `${product.stock} items in stock` : 'Out of Stock'}
            </div>
            
            <p className="text-slate-600 whitespace-pre-line leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="mt-auto space-y-6">
            {/* Store Card */}
            {product.store ? (
              <Link href={`/store/${product.store.slug}`} className="block">
                <Card className="bg-slate-50 border-none shadow-sm hover:bg-slate-100 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                      <StoreIcon className="w-5 h-5 text-primary" />
                      Sold by: {product.store.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      {product.store.image_url && (
                        <img src={product.store.image_url} alt={product.store.name} className="w-16 h-16 rounded object-cover shadow-sm" />
                      )}
                      <div>
                        <p className="text-sm text-slate-600 line-clamp-2">{product.store.description || 'No description available for this store.'}</p>
                        <div className="flex items-center gap-1 text-xs text-green-600 font-medium mt-2">
                          <ShieldCheck className="w-4 h-4" /> SEAPEDIA Verified Seller
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ) : (
              <Card className="bg-slate-50 border-none shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <StoreIcon className="w-5 h-5 text-primary" />
                    Sold by: Unknown Store
                  </CardTitle>
                </CardHeader>
              </Card>
            )}

            {/* Actions */}
            <div className="pt-6 border-t flex flex-col gap-4">
              {product.stock > 0 && user && user.roles.includes('BUYER') && (
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-sm font-medium text-slate-700">Quantity:</span>
                  <div className="flex items-center border rounded-md">
                    <button 
                      className="px-3 py-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-50 transition-colors"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || isAddingToCart}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="w-12 text-center font-medium text-slate-900 border-x py-1.5">
                      {quantity}
                    </div>
                    <button 
                      className="px-3 py-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-50 transition-colors"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock || isAddingToCart}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="flex-1" 
                  disabled={product.stock === 0 || !user || !user.roles.includes('BUYER') || isAddingToCart}
                  onClick={handleAddToCart}
                >
                  {isAddingToCart ? 'Adding...' : (product.stock === 0 ? 'Out of Stock' : `Add to Cart - $${(Number(product.price) * quantity).toFixed(2)}`)}
                </Button>
                {!user && (
                  <div className="text-center sm:text-left text-sm text-slate-500 self-center">
                    <Link href="/auth/login" className="text-primary hover:underline">Log in</Link> as a buyer to purchase.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">Customer Reviews</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Review List */}
          <div className="lg:col-span-2 space-y-6">
            {reviews.length === 0 ? (
              <div className="text-slate-500 py-8 bg-slate-50 text-center rounded-lg">
                No reviews yet. Be the first to review this product!
              </div>
            ) : (
              reviews.map((review: any) => (
                <div key={review.id} className="border-b pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-slate-900">{review.buyer_name || 'Anonymous Buyer'}</div>
                    <div className="text-xs text-slate-400">{new Date(review.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="flex mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  {review.comment && <p className="text-slate-600">{review.comment}</p>}
                </div>
              ))
            )}
          </div>

          {/* Write a Review Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Write a Review</CardTitle>
                <CardDescription>Share your experience with this product.</CardDescription>
              </CardHeader>
              <CardContent>
                {!user || !user.roles.includes('BUYER') ? (
                  <div className="text-sm text-slate-500">
                    <Link href="/auth/login" className="text-primary hover:underline">Log in</Link> as a buyer to leave a review.
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none"
                          >
                            <Star className={`w-6 h-6 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 hover:text-amber-200'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Comment (optional)</label>
                      <Textarea 
                        placeholder="What did you like or dislike?" 
                        value={comment}
                        onChange={(e: any) => setComment(e.target.value)}
                        maxLength={500}
                        rows={4}
                      />
                      <div className="text-xs text-slate-400 mt-1 text-right">{comment.length}/500</div>
                    </div>
                    {reviewError && <div className="text-sm text-red-500 bg-red-50 p-2 rounded">{reviewError}</div>}
                    <Button type="submit" className="w-full" disabled={isSubmittingReview}>
                      {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
