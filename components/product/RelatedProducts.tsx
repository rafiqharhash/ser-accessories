import { ProductCard } from "@/components/ui/ProductCard";

interface RelatedProductsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  products: any[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-24 bg-muted/20 border-t border-border mt-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-playfair mb-12 text-center">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
