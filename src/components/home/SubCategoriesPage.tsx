import { useCategories, useSubCategories, useProductsByCategory } from "@/lib/hooks";
import { ProductGrid } from "../products/ProductGrid";
import { Link, useParams } from "react-router-dom";

export function SubCategoriesPage() {
  const { name } = useParams<{ name: string }>();
  const { data: categories } = useCategories();
  const category = categories?.find((c) => c.name === name);
  const { data: subCategories } = useSubCategories(category?._id || "");
  const { data: products, isLoading } = useProductsByCategory(category?._id || "");

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-ink mb-4">Category Not Found</h1>
        <p className="text-slate-500 mb-8">The category you're looking for doesn't exist.</p>
        <Link to="/category" className="text-primary hover:underline font-medium">
          ← Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-4" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link to="/category" className="hover:text-primary transition-colors">Categories</Link>
          <span>/</span>
          <Link to={`/category/${category.name}`} className="hover:text-primary transition-colors">
            {category.name}
          </Link>
          <span>/</span>
          <span className="text-ink font-medium">Subcategories</span>
        </nav>
        <h1 className="text-3xl font-bold text-ink">{category.name} - Subcategories</h1>
        <p className="text-slate-500 mt-1">{subCategories?.length || 0} subcategories</p>
      </div>

      {subCategories && subCategories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-ink mb-4">Subcategories</h2>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {subCategories.map((sub) => (
              <Link
                key={sub._id}
                to={`/category/subcategories/${sub.name}`}
                className="block p-4 rounded-xl bg-surface-2 hover:bg-surface hover:shadow-md transition-all text-center"
              >
                <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <img
                    src={sub.image}
                    alt={sub.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-ink line-clamp-1">{sub.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-ink mb-4">All Products in {category.name}</h2>
        <ProductGrid products={products || []} isLoading={isLoading} columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} />
      </div>
    </div>
  );
}