import { useCategories, useProductsByCategory } from "@/lib/hooks";
import { ProductGrid } from "../products/ProductGrid";
import { useParams } from "react-router-dom";

export function CategoryPage() {
  const { name } = useParams<{ name: string }>();
  const { data: categories } = useCategories();
  const category = categories?.find((c) => c.name === name);
  const { data: products, isLoading } = useProductsByCategory(category?._id || "");

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-ink mb-4">Category Not Found</h1>
        <p className="text-slate-500 mb-8">The category you're looking for doesn't exist.</p>
        <a href="/category" className="text-primary hover:underline font-medium">
          ← Back to Categories
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-4" aria-label="Breadcrumb">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <span>/</span>
          <a href="/category" className="hover:text-primary transition-colors">Categories</a>
          <span>/</span>
          <span className="text-ink font-medium">{category.name}</span>
        </nav>
        <h1 className="text-3xl font-bold text-ink">{category.name}</h1>
        <p className="text-slate-500 mt-1">{products?.length || 0} products in this category</p>
      </div>
      <ProductGrid products={products || []} isLoading={isLoading} columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} />
    </div>
  );
}