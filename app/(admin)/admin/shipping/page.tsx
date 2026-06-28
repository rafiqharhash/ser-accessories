import { getShippingZones } from "@/actions/shipping.actions";
import { ShippingManager } from "@/components/admin/shipping/ShippingManager";

export const dynamic = "force-dynamic";

export default async function AdminShippingPage() {
  const zones = await getShippingZones();
  
  return (
    <div className="p-8">
      <ShippingManager initialZones={zones} />
    </div>
  );
}
