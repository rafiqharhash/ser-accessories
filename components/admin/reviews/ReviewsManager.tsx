"use client";

import { useState } from "react";
import { updateReviewStatus, deleteReview } from "@/actions/review.actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, X, Trash2, Star, MessageSquare } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ReviewsManagerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialReviews: any[];
}

export function ReviewsManager({ initialReviews }: ReviewsManagerProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const filteredReviews = reviews.filter(r => {
    if (filter === "pending") return !r.approved;
    if (filter === "approved") return r.approved;
    return true;
  });

  const handleStatusUpdate = async (id: string, approved: boolean) => {
    const res = await updateReviewStatus(id, approved);
    if (res.success) {
      toast.success(approved ? "Review approved" : "Review rejected (hidden)");
      setReviews(reviews.map(r => r._id === id ? { ...r, approved } : r));
    } else {
      toast.error(res.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this review?")) return;
    const res = await deleteReview(id);
    if (res.success) {
      toast.success("Review deleted");
      setReviews(reviews.filter(r => r._id !== id));
    } else {
      toast.error(res.error);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1,2,3,4,5].map(star => (
          <Star key={star} className={`w-3 h-3 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-playfair mb-1">Reviews</h1>
          <p className="text-sm text-muted-foreground">Moderate customer product reviews.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>All</Button>
          <Button variant={filter === "pending" ? "default" : "outline"} size="sm" onClick={() => setFilter("pending")}>Pending</Button>
          <Button variant={filter === "approved" ? "default" : "outline"} size="sm" onClick={() => setFilter("approved")}>Approved</Button>
        </div>
      </div>

      <div className="bg-background border border-border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Customer & Review</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-muted-foreground">No reviews found.</td>
              </tr>
            ) : (
              filteredReviews.map(review => (
                <tr key={review._id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 w-1/4">
                    <Link href={`/admin/products/${review.product?._id}`} className="flex items-center gap-2 group">
                      <div className="w-10 h-10 relative bg-muted rounded overflow-hidden flex-shrink-0">
                        {review.product?.images?.[0] ? (
                          <Image src={review.product.images[0].url} alt="Product" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-muted" />
                        )}
                      </div>
                      <span className="font-medium group-hover:underline line-clamp-2">{review.product?.name || "Unknown Product"}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 w-1/2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{review.customerName}</span>
                      {renderStars(review.rating)}
                      <span className="text-xs text-muted-foreground ml-2">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MessageSquare className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <p className="line-clamp-2">{review.review}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {review.approved ? (
                      <span className="px-2 py-1 rounded-full text-xs border bg-green-100 text-green-800 border-green-200">Approved</span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs border bg-yellow-100 text-yellow-800 border-yellow-200">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      {!review.approved && (
                        <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleStatusUpdate(review._id, true)}>
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      {review.approved && (
                        <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50" onClick={() => handleStatusUpdate(review._id, false)}>
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(review._id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
