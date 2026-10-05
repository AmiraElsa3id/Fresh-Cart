import { HeroSlider } from "./HeroSlider";
import { CategoriesRow } from "./CategoriesRow";
import { CategorySlider } from "./CategorySlider";
import { PromoBanner } from "./PromoBanner";
import { ProductGrid } from "../products/ProductGrid";
import { BrandsGrid } from "../brands/BrandsGrid";
import { Newsletter } from "./Newsletter";
import { useProducts } from "@/lib/hooks";

export function HomePage() {
  const { data: products, isLoading } = useProducts();

  return (
    <div className="space-y-4 md:space-y-8">
      <HeroSlider />
      <CategorySlider />
      <CategoriesRow />
      <PromoBanner />
      <section className="container mx-auto px-4 py-4 md:py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-ink">All Products</h2>
          <a
            href="/products"
            className="text-primary hover:text-primary-dark font-medium transition-colors hidden sm:block"
          >
            View All →
          </a>
        </div>
        <ProductGrid products={products || []} isLoading={isLoading} columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} />
      </section>
      <BrandsGrid />
      <Newsletter />
    </div>
  );
}