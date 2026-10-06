import { Link } from "react-router-dom";
import { useCategories } from "@/lib/hooks";
import { CategoryCard } from "./CategoryCard";

export function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-4" aria-label="Breadcrumb">
          {/* Was a bare <span>, so "Home" looked like a link but did nothing. */}
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-ink font-medium" aria-current="page">
            Categories
          </span>
        </nav>
        <h1 className="text-3xl font-bold text-ink">All Categories</h1>
        <p className="text-slate-500 mt-1">{categories?.length || 0} categories available</p>
      </div>

      {isLoading ? (
        <div
          className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          role="status"
          aria-label="Loading categories"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <CategoryCard key={i} category={{ _id: "", name: "", image: "" }} isLoading />
          ))}
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <h2 className="text-xl font-semibold text-ink mb-2">No categories yet</h2>
          <p className="text-slate-500">Check back soon.</p>
        </div>
      )}
    </div>
  );
}