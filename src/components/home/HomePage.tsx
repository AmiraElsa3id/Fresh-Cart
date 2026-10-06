import { HeroSlider } from "./HeroSlider";
import { CategorySection } from "./CategorySection";
import { PromoBanner } from "./PromoBanner";
import { ProductGrid } from "../products/ProductGrid";
import { BrandsGrid } from "../brands/BrandsGrid";
import { Newsletter } from "./Newsletter";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useProducts } from "@/lib/hooks";

export function HomePage() {
  const { data: products, isLoading } = useProducts();

  return (
    <div className="space-y-4 md:space-y-8">
      <HeroSlider />
      <CategorySection />
      <PromoBanner />
      {/* "Featured Products" — home container `16:5092`. */}
      <section className="container mx-auto px-4 py-4 md:py-8" aria-labelledby="featured-products">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className="h-8 w-1.5 rounded-full bg-gradient-to-b from-[#00BC7D] to-[#007A55]"
            />
            <h2 id="featured-products" className="text-2xl font-bold tracking-tight text-ink md:text-3xl">
              Featured <span className="text-primary">Products</span>
            </h2>
          </div>

          <Link
            to="/products"
            className="hidden items-center gap-2 text-base font-medium text-primary transition-colors hover:text-primary-dark sm:flex"
          >
            View All
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <ProductGrid products={products || []} isLoading={isLoading} columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} />
      </section>
      <BrandsGrid />
      <Newsletter />
    </div>
  );
}
