import { getCoupons } from "@/actions/coupon.actions";
import { CouponsManager } from "@/components/admin/coupons/CouponsManager";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const coupons = await getCoupons();
  
  return (
    <div className="p-8">
      <CouponsManager initialCoupons={coupons} />
    </div>
  );
}
