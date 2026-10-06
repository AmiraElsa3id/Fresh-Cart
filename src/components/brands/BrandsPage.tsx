import { BrandsGrid } from "./BrandsGrid";
import { useBrands } from "@/lib/hooks";

export function BrandsPage() {
  const { data: brands } = useBrands();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink">All Brands</h1>
        <p className="text-slate-500 mt-1">{brands?.length || 0} brands available</p>
      </div>
      <BrandsGrid limit={100} showViewAll={false} />
    </div>
  );
}