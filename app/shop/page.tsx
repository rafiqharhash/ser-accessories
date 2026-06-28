import { getShopProducts } from "@/actions/shop.actions";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const metadata = {
  title: "Shop Collection",
  description: "Browse the latest luxury fashion collections at SER.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  
  // Transform search params into correct types for the action
  const parsedParams = {
    page: params.page ? parseInt(params.page as string) : 1,
    category: params.category as string,
    collection: params.collection as string,
    q: params.q as string,
    sort: params.sort as string,
    colors: typeof params.color === "string" ? [params.color] : (params.color as string[]),
    sizes: typeof params.size === "string" ? [params.size] : (params.size as string[]),
    isNew: params.isNew === "true",
    isBestSeller: params.isBestSeller === "true",
    onSale: params.onSale === "true",
  };

  const products = await getShopProducts(parsedParams);

  return (
    <ShopLayout>
      <Suspense fallback={
        <div className="w-full h-96 flex items-center justify-center">
          <LoadingSpinner size={40} />
        </div>
      }>
        <ProductGrid products={products} />
      </Suspense>
    </ShopLayout>
  );
}
