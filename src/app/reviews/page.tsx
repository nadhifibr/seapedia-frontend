'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export default function AppReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('seapedia_app_reviews');
    if (saved) {
      setReviews(JSON.parse(saved));
    } else {
      const initial = [
        { id: '1', name: 'Alice', rating: 5, comment: 'Great multi-role concept! Very seamless.', date: new Date().toISOString() },
        { id: '2', name: 'Bob', rating: 4, comment: 'Looking forward to more products being added.', date: new Date().toISOString() },
      ];
      setReviews(initial);
      localStorage.setItem('seapedia_app_reviews', JSON.stringify(initial));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReview: Review = {
      id: Date.now().toString(),
      name,
      rating,
      comment,
      date: new Date().toISOString(),
    };
    
    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem('seapedia_app_reviews', JSON.stringify(updated));
    
    setName('');
    setComment('');
    setRating(5);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Application Reviews</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Help us improve SEAPEDIA by sharing your experience. We value your feedback on the website's usability and features.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Leave a Review</CardTitle>
              <CardDescription>Tell us what you think about SEAPEDIA.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Rating</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star 
                          className={`w-8 h-8 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment">Experience Comment</Label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    rows={4}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="I really liked how..."
                  />
                </div>

                <Button type="submit" className="w-full">Submit Review</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border rounded-lg bg-slate-50">
              No reviews yet. Be the first to share your experience!
            </div>
          ) : (
            reviews.map((review) => (
              <Card key={review.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-semibold text-lg">{review.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(review.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-5 h-5 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{review.comment}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
