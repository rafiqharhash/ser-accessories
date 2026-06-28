"use client";

import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
  verified: boolean;
}

interface ProductReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export function ProductReviews({ reviews, averageRating, totalReviews }: ProductReviewsProps) {
  // Mock breakdown calculation
  const breakdown = [
    { stars: 5, percentage: 80, count: Math.floor(totalReviews * 0.8) },
    { stars: 4, percentage: 15, count: Math.floor(totalReviews * 0.15) },
    { stars: 3, percentage: 5, count: Math.floor(totalReviews * 0.05) },
    { stars: 2, percentage: 0, count: 0 },
    { stars: 1, percentage: 0, count: 0 },
  ];

  return (
    <div className="mt-16 pt-16 border-t border-border">
      <h3 className="text-2xl font-playfair mb-8">Customer Reviews</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Rating Breakdown */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl font-playfair">{averageRating.toFixed(1)}</span>
            <div>
              <div className="flex text-primary mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.floor(averageRating) ? "currentColor" : "transparent"} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Based on {totalReviews} reviews</p>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            {breakdown.map((item) => (
              <div key={item.stars} className="flex items-center gap-3 text-sm">
                <div className="w-12 text-muted-foreground">{item.stars} stars</div>
                <Progress value={item.percentage} className="h-2" />
                <div className="w-8 text-right text-muted-foreground">{item.count}</div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full uppercase tracking-wider text-xs">Write a Review</Button>
        </div>

        {/* Review List */}
        <div className="md:col-span-8 lg:col-span-9 space-y-8">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="border-b border-border pb-8 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      {review.author}
                      {review.verified && <span className="text-[10px] uppercase tracking-wider bg-muted px-2 py-0.5 rounded-sm">Verified</span>}
                    </h4>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>
                  <div className="flex text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "transparent"} />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">{review.content}</p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground italic">No reviews yet. Be the first to review this product.</p>
          )}
        </div>
      </div>
    </div>
  );
}
