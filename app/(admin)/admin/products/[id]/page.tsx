import { connectToDatabase } from "@/lib/db";
import { Product } from "@/models/product.model";
import { ProductFormClient } from "@/components/admin/products/ProductFormClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminEditProductPage({ params }: { params: { id: string } }) {
  await connectToDatabase();
  const productRaw = await Product.findById(params.id).lean();

  if (!productRaw) {
    notFound();
  }

  const product = JSON.parse(JSON.stringify(productRaw));

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <ProductFormClient product={product} />
    </div>
  );
}
