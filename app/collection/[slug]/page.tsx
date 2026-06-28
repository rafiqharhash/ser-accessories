import { getShopProducts } from "@/actions/shop.actions";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const metadata = {
  title: "Collection | SER",
  description: "Browse premium luxury fashion collections at SER.",
};

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  const sParams = await searchParams;
  
  const parsedParams = {
    page: sParams.page ? parseInt(sParams.page as string) : 1,
    category: sParams.category as string,
    collection: resolvedParams.slug, // Force collection from route
    q: sParams.q as string,
    sort: sParams.sort as string,
    colors: typeof sParams.color === "string" ? [sParams.color] : (sParams.color as string[]),
    sizes: typeof sParams.size === "string" ? [sParams.size] : (sParams.size as string[]),
    isNew: sParams.isNew === "true",
    isBestSeller: sParams.isBestSeller === "true",
    onSale: sParams.onSale === "true",
  };

  const products = await getShopProducts(parsedParams);

  return (
    <ShopLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-playfair capitalize text-muted-foreground">{resolvedParams.slug.replace("-", " ")} Collection</h2>
      </div>
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
