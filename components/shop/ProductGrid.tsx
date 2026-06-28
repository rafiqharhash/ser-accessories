import { ProductCard } from "@/components/ui/ProductCard";
import { EmptyState } from "@/components/ui/empty-state";
import { PackageX } from "lucide-react";

export interface IProductCard {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number;
  featuredImage: string;
  hoverImage?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  discountPercentage?: number;
  stock: number;
}

interface ProductGridProps {
  products: IProductCard[] | null;
}

// Fallback Mock Data just to display UI if DB is empty
const mockProducts = Array.from({ length: 12 }).map((_, i) => ({
  id: `mock-${i}`,
  name: `Premium Item ${i + 1}`,
  slug: `premium-item-${i + 1}`,
  price: 2500 + i * 500,
  featuredImage: `https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop&sig=${i}`,
  stock: i % 5 === 0 ? 0 : 10,
  isNew: i < 3,
  isBestSeller: i > 8,
}));

export function ProductGrid({ products }: ProductGridProps) {
  const displayProducts = products && products.length > 0 ? products : mockProducts;

  if (products !== null && products.length === 0) {
    return (
      <EmptyState
        title="No Products Found"
        description="Try adjusting your filters or search query to find what you're looking for."
        icon={<PackageX size={40} className="text-muted-foreground" />}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {displayProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
