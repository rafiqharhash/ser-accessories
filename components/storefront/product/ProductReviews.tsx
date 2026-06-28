"use client";

import { useState } from "react";
import { createReview } from "@/actions/review.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface ProductReviewsProps {
  productId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialReviews: any[];
}

export function ProductReviews({ productId, initialReviews }: ProductReviewsProps) {
  const [reviews] = useState(initialReviews);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [customerName, setCustomerName] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  const renderStars = (ratingValue: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1,2,3,4,5].map(star => (
          <Star 
            key={star} 
            className={`w-5 h-5 ${interactive ? 'cursor-pointer' : ''} ${star <= ratingValue ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} 
            onClick={() => interactive && setRating(star)}
          />
        ))}
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      toast.error("Please select a valid rating");
      return;
    }
    
    setIsSubmitting(true);
    const res = await createReview(productId, { customerName, rating, review: reviewText });
    setIsSubmitting(false);

    if (res.success) {
      toast.success("Review submitted! It will appear once approved by an admin.");
      setShowForm(false);
      setCustomerName("");
      setReviewText("");
      setRating(5);
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="space-y-12 py-12 border-t mt-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Summary Section */}
        <div className="md:col-span-1 space-y-4">
          <h3 className="text-2xl font-playfair">Customer Reviews</h3>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold">{averageRating}</div>
            <div>
              {renderStars(Number(averageRating))}
              <p className="text-sm text-muted-foreground mt-1">Based on {reviews.length} review{reviews.length === 1 ? '' : 's'}</p>
            </div>
          </div>
          <div className="pt-4">
            <Button onClick={() => setShowForm(!showForm)} className="w-full">
              {showForm ? "Cancel Review" : "Write a Review"}
            </Button>
          </div>
        </div>

        {/* Reviews List & Form Section */}
        <div className="md:col-span-2">
          {showForm && (
            <form onSubmit={handleSubmit} className="bg-muted/30 p-6 rounded-lg mb-8 space-y-4 border">
              <h4 className="font-semibold text-lg">Write a Review</h4>
              <div className="space-y-2">
                <Label>Rating</Label>
                {renderStars(rating, true)}
              </div>
              <div className="space-y-2">
                <Label>Your Name</Label>
                <Input required value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Jane Doe" />
              </div>
              <div className="space-y-2">
                <Label>Your Review</Label>
                <Textarea required value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="What did you think of this product?" rows={4} />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          )}

          <div className="space-y-6">
            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
                <MessageSquare className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              reviews.map(review => (
                <div key={review._id} className="border-b pb-6 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{review.customerName}</p>
                      <div className="mt-1">{renderStars(review.rating)}</div>
                    </div>
                    <span className="text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-3 leading-relaxed">{review.review}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
