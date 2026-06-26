'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Fish, ArrowLeft, Store as StoreIcon, ShieldCheck, Star, ChevronRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Minus } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { ConfirmationModal } from '@/components/shared/ConfirmationModal';
import { ToastNotification } from '@/components/shared/ToastNotification';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [stats, setStats] = useState({ average_rating: 0, total_reviews: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  // Review Form State
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // UI State
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void; confirmText?: string }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  const [toastConfig, setToastConfig] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

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
      if (res.data.category) {
        fetchRelatedProducts(res.data.category, productId);
      }
    } catch (err) {
      console.error('Failed to fetch product detail', err);
      // fallback or error could be shown
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRelatedProducts = async (category: string, currentProductId: string) => {
    try {
      const res = await api.get(`/products/?category=${category}`);
      const filtered = res.data.results.filter((p: any) => p.id.toString() !== currentProductId).slice(0, 5);
      setRelatedProducts(filtered);
    } catch (err) {
      console.error('Failed to fetch related products', err);
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await api.post('/cart/items/', { product_id: product.id, quantity: quantity });
      setToastConfig({ show: true, message: `Added ${quantity} item(s) to cart!` });
    } catch (err: any) {
      if (err.response?.data?.error_code === 'STORE_CONFLICT') {
        setModalConfig({
          isOpen: true,
          title: 'Store Conflict',
          message: `Your cart already contains items from a different store. Do you want to clear your cart and add this product from ${product.store.name} instead?`,
          confirmText: 'Clear Cart & Add',
          onConfirm: async () => {
            try {
              await api.delete('/cart/');
              await api.post('/cart/items/', { product_id: product.id, quantity: quantity });
              setToastConfig({ show: true, message: 'Cart cleared and product added successfully!' });
            } catch (retryErr) {
              alert('Failed to add product after clearing cart.');
            }
          }
        });
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
        <Button onClick={() => router.push('/search')} variant="outline">Back to Catalog</Button>
      </div>
    );
  }

  const soldCount = product.sold_count || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center text-sm text-slate-500 mb-8 font-medium">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <Link href="/search" className="hover:text-primary transition-colors">Browse</Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <Link href={`/search?category=${product.category}`} className="hover:text-primary transition-colors capitalize">
          {product.category?.replace('_', ' ').toLowerCase()}
        </Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="text-slate-900 truncate max-w-[200px] md:max-w-md">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
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
            
            <div className="flex items-center gap-3 mb-4 text-sm font-medium text-slate-600 divide-x divide-slate-300">
              <div className="pr-3">
                <span className="text-slate-900 font-bold">{soldCount}</span> terjual
              </div>
              <div className="flex items-center pl-3">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 mr-1" />
                <span className="text-slate-900 font-bold">{stats.average_rating > 0 ? stats.average_rating : 'New'}</span>
                <span className="text-slate-400 ml-1">({stats.total_reviews} reviews)</span>
              </div>
            </div>

            <div className="text-3xl font-bold text-primary mb-4">Rp {Number(product.price).toLocaleString('id-ID')}</div>
            
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-6 ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {product.stock > 0 ? `${product.stock} items in stock` : 'Out of Stock'}
            </div>
            
            <div className="text-slate-700 whitespace-pre-line leading-relaxed border-t pt-6">
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p>{product.description}</p>
            </div>
          </div>

          <div className="mt-auto pt-6">
            {/* Actions */}
            <div className="flex flex-col gap-4">
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
                  className="flex-1 cursor-pointer" 
                  disabled={product.stock === 0 || !user || !user.roles.includes('BUYER') || isAddingToCart}
                  onClick={handleAddToCart}
                >
                  {isAddingToCart ? 'Adding...' : (product.stock === 0 ? 'Out of Stock' : `Add to Cart - Rp ${(Number(product.price) * quantity).toLocaleString('id-ID')}`)}
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

      {/* Store Information Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">Store Information</h2>
        {product.store ? (
          <Card className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    {product.store.image_url ? (
                      <img src={product.store.image_url} alt={product.store.name} className="w-16 h-16 rounded-full object-cover shadow-sm border" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                        <StoreIcon className="w-8 h-8 text-slate-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{product.store.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-green-600 font-medium mt-1">
                        <ShieldCheck className="w-4 h-4" /> Verified Seller
                      </div>
                    </div>
                  </div>
                  {product.store.location && (
                    <div className="flex items-start gap-2 text-sm text-slate-600 mb-4">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <span className="capitalize">{product.store.location?.toLowerCase()}</span>
                    </div>
                  )}
                  <Button render={<Link href={`/store/${product.store.slug}`} />} variant="outline" className="w-full">
                    Visit Store
                  </Button>
                </div>
                
                <div className="p-6 md:w-2/3 bg-slate-50/50">
                  <h4 className="text-sm font-semibold text-slate-900 mb-4">More from this store</h4>
                  {product.store.recent_products && product.store.recent_products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {product.store.recent_products.filter((p: any) => p.id !== product.id).slice(0, 3).map((p: any) => (
                        <Link href={`/products/${p.id}`} key={p.id} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="block group/item h-full">
                          <Card className="h-full overflow-hidden flex flex-col bg-transparent border-none ring-0 p-0 gap-0 shadow-none transition-all duration-300 rounded-[10px]">
                            <div className="aspect-square bg-slate-50 flex items-center justify-center text-slate-300 relative overflow-hidden rounded-[10px]">
                              {p.image_url ? (
                                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300" />
                              ) : (
                                <Fish className="w-8 h-8 opacity-50" />
                              )}
                              {p.stock === 0 && (
                                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-0.5 rounded text-[10px] font-bold z-10">
                                  HABIS
                                </div>
                              )}
                            </div>
                            <div className="p-2.5 md:p-3 flex flex-col flex-grow">
                              <h3 className="text-[13px] md:text-sm text-slate-800 line-clamp-2 leading-tight">
                                {p.name}
                              </h3>
                              <div className="text-sm md:text-base font-bold text-slate-900 mt-1 mb-1">
                                Rp {Number(p.price).toLocaleString('id-ID')}
                              </div>
                            </div>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">No other products found.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="p-6 bg-slate-50 rounded-xl text-center text-slate-500">
            Store information not available.
          </div>
        )}
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6 border-b pb-2">
            <h2 className="text-2xl font-bold">Similar Products</h2>
            <Link href={`/search?category=${product.category}`} className="text-sm text-primary hover:underline font-medium flex items-center">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {relatedProducts.map((p: any) => (
              <Link href={`/products/${p.id}`} key={p.id} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="block group/item h-full">
                <Card className="h-full overflow-hidden flex flex-col bg-transparent border-none ring-0 p-0 gap-0 shadow-none transition-all duration-300 rounded-[10px]">
                  <div className="aspect-square bg-slate-50 flex items-center justify-center text-slate-300 relative overflow-hidden rounded-[10px]">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300" />
                    ) : (
                      <Fish className="w-12 h-12 opacity-50" />
                    )}
                    {p.stock === 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-0.5 rounded text-[10px] font-bold z-10">
                        HABIS
                      </div>
                    )}
                  </div>
                  <div className="p-2.5 md:p-3 flex flex-col flex-grow">
                    <h3 className="text-[13px] md:text-sm text-slate-800 line-clamp-2 leading-tight">
                      {p.name}
                    </h3>
                    <div className="text-sm md:text-base font-bold text-slate-900 mt-1 mb-1">
                      Rp {Number(p.price).toLocaleString('id-ID')}
                    </div>
                    <div className="mt-auto pt-1 flex flex-col gap-1.5 text-[11px] text-slate-500">
                      {p.store && (
                        <div className="relative h-[16px] overflow-hidden w-full flex items-center text-slate-500 cursor-default">
                          <div className="absolute inset-0 flex items-center transition-transform duration-300 group-hover/item:-translate-y-full">
                            <StoreIcon className="w-3 h-3 mr-1" />
                            <span className="line-clamp-1">{p.store.name}</span>
                          </div>
                          <div className="absolute inset-0 flex items-center transition-transform duration-300 translate-y-full group-hover/item:translate-y-0 text-slate-600">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span className="line-clamp-1">{p.store.location ? p.store.location.replace('_', ' ').toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase()) : 'Unknown'}</span>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" />
                        <span>{p.average_rating > 0 ? p.average_rating : '-'}</span>
                        <span className="mx-1.5 text-slate-300 text-[10px]">|</span>
                        <span>{p.sold_count || 0} terjual</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div>
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

      <ToastNotification 
        show={toastConfig.show} 
        message={toastConfig.message} 
        onClose={() => setToastConfig({ ...toastConfig, show: false })} 
      />

      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText || 'Confirm'}
      />
    </div>
  );
}
