import { getProductBySlug, getRelatedProducts } from "@/actions/product.actions";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ProductClientWrapper } from "@/components/product/ProductClientWrapper";
import { ProductTabs } from "@/components/product/ProductTabs";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { ProductReviews } from "@/components/product/ProductReviews";

// Generate Metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.featuredImage }],
      type: "website", // Or "product" if perfectly aligned with OG specs
    },
  };
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id, product.category.slug);

  // Mock Reviews Data
  const reviews = [
    { id: "1", author: "Amina Y.", rating: 5, date: "October 12, 2025", content: "Absolutely stunning dress.", verified: true },
    { id: "2", author: "Sarah H.", rating: 4, date: "September 28, 2025", content: "Great quality, slightly long for me.", verified: true },
  ];

  // Generate JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.galleryImages,
    description: product.shortDescription,
    sku: product.sku,
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/product/${product.slug}`,
      priceCurrency: "EGP",
      price: product.price,
      itemCondition: "https://schema.org/NewCondition",
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="bg-background pt-8">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4">
        {/* Main Product Area */}
        <ProductClientWrapper product={product} />

        {/* Product Details Tabs (Description, Shipping, Materials) */}
        <ProductTabs description={product.description} materials={product.materials} />
        
        {/* Reviews */}
        <ProductReviews reviews={reviews} averageRating={4.5} totalReviews={12} />
      </div>

      {/* Related Products */}
      <RelatedProducts products={relatedProducts} />
    </div>
  );
}
