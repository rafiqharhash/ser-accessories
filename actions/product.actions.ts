"use server";

export async function getProductBySlug(slug: string) {
  try {
    // const product = await ProductService.getProductBySlug(slug);
    // return product;

    // Fallback Mock Data for UI Phase
    return {
      id: "prod-1",
      name: "Signature Silk Evening Gown",
      slug: slug,
      price: 12500,
      oldPrice: 15000,
      discountPercentage: 16,
      sku: "SER-GOWN-001",
      shortDescription: "A breathtaking evening gown crafted from 100% pure Mulberry silk. Features a plunging neckline, delicate draped back, and a sweeping train. Designed for unforgettable nights.",
      description: "Experience the epitome of luxury with our Signature Silk Evening Gown. Meticulously handcrafted in our atelier, this piece drapes effortlessly over the silhouette. The lustrous finish of the pure silk captures the light beautifully, ensuring you are the center of attention at any gala or formal event. The gown is fully lined in silk crepe and features an invisible side zipper.",
      category: { name: "Dresses", slug: "dresses" },
      collection: { name: "Midnight Gala", slug: "midnight-gala" },
      featuredImage: "https://images.unsplash.com/photo-1566160983058-25f0ce1fc414?q=80&w=800&auto=format&fit=crop",
      galleryImages: [
        "https://images.unsplash.com/photo-1566160983058-25f0ce1fc414?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1515347619152-16bda968038b?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop",
      ],
      isNew: true,
      isBestSeller: true,
      stockMode: "variants",
      stock: 15,
      variants: [
        { id: "v1", color: "Black", size: "S", stock: 5, active: true },
        { id: "v2", color: "Black", size: "M", stock: 3, active: true },
        { id: "v3", color: "Black", size: "L", stock: 0, active: true }, // Out of stock
        { id: "v4", color: "Emerald", size: "S", stock: 2, active: true },
        { id: "v5", color: "Emerald", size: "M", stock: 5, active: true },
      ],
      colors: ["Black", "Emerald"],
      sizes: ["S", "M", "L"],
      materials: ["100% Mulberry Silk"],
    };
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}

export async function getRelatedProducts(productId: string, categorySlug: string) {
  // Use parameters to satisfy linter for mock implementation
  void productId;
  void categorySlug;
  // Returns mock related products
  return Array.from({ length: 4 }).map((_, i) => ({
    id: `related-${i}`,
    name: `Complementary Item ${i + 1}`,
    slug: `complementary-item-${i + 1}`,
    price: 3000 + i * 500,
    featuredImage: `https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop&sig=${i+10}`,
    stock: 10,
  }));
}
