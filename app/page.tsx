import { Hero } from "@/components/home/Hero";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { NewArrivals } from "@/components/home/NewArrivals";
import { BestSellers } from "@/components/home/BestSellers";
import { ShopByCategory } from "@/components/home/ShopByCategory";
import { PromoBanner } from "@/components/home/PromoBanner";
import { Features } from "@/components/home/Features";
import { Reviews } from "@/components/home/Reviews";
import { InstagramGallery } from "@/components/home/InstagramGallery";
import { Newsletter } from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCollections />
      <NewArrivals />
      <BestSellers />
      <ShopByCategory />
      <PromoBanner />
      <Features />
      <Reviews />
      <InstagramGallery />
      <Newsletter />
    </>
  );
}
