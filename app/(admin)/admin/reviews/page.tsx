import { getAdminReviews } from "@/actions/review.actions";
import { ReviewsManager } from "@/components/admin/reviews/ReviewsManager";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await getAdminReviews();
  
  return (
    <div className="p-8">
      <ReviewsManager initialReviews={reviews} />
    </div>
  );
}
