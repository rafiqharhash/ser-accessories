import { connectToDatabase } from "@/lib/db";
import { Product } from "@/models/product.model";
import { Category } from "@/models/category.model";
import { ProductsTableClient } from "@/components/admin/products/ProductsTableClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string; page?: string };
}) {
  await connectToDatabase();

  const page = parseInt(searchParams.page || "1");
  const limit = 20;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = { deletedAt: null };

  if (searchParams.q) {
    query.$text = { $search: searchParams.q };
  }
  
  if (searchParams.status && searchParams.status !== "all") {
    query.status = searchParams.status;
  }

  const productsRaw = await Product.find(query)
    .sort(searchParams.q ? { score: { $meta: "textScore" } } : { createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate({ path: "category", model: Category, select: "name" })
    .lean();

  const total = await Product.countDocuments(query);
  const products = JSON.parse(JSON.stringify(productsRaw));

  return (
    <div className="p-8">
      <ProductsTableClient 
        products={products} 
        total={total} 
        page={page} 
        limit={limit} 
        currentQuery={searchParams.q || ""}
        currentStatus={searchParams.status || "all"}
      />
    </div>
  );
}
