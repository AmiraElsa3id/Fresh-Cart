"use client";

import { useId, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { countActiveFacets, EMPTY_FACETS, type FacetOption, type ProductFacets } from "@/lib/product-facets";

/**
 * Facet sidebar — Figma `38:12515` (`aside.hidden`, 256px).
 *
 * Three sections inside one 24px-padded white card with a `#F3F4F6` 1px border and
 * a 16px radius: Categories (checkbox list), Price Range (min/max plus the four
 * `Under …` pills the design places beneath the inputs) and Brands (checkbox
 * list). Hairline rules separate the sections. There are no apply or clear
 * buttons in the design — the facets apply as they are ticked.
 *
 * State is held by the caller so the sidebar stays presentational; see
 * `ProductsPage` for the filtering itself.
 */

const CARD_SHADOW = "shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]";
const HAIRLINE = "border-[#F3F4F6]";

/** The design's four quick ranges, as inclusive upper bounds in EGP. */
const QUICK_RANGES = [
  { label: "Under 500", max: 500 },
  { label: "Under 1K", max: 1000 },
  { label: "Under 5K", max: 5000 },
  { label: "Under 10K", max: 10000 },
] as const;

export function ProductFilterBar({  categories,
  brands,
  facets,
  onChange,
  className,
}: {
  categories: FacetOption[];
  brands: FacetOption[];
  facets: ProductFacets;
  onChange: (next: ProductFacets) => void;
  className?: string;
}) {
  const minId = useId();
  const maxId = useId();

  const toggle = (key: "categories" | "brands", id: string) => {
    const current = facets[key];
    onChange({
      ...facets,
      [key]: current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    });
  };

  const setPrice = (key: "minPrice" | "maxPrice", raw: string) => {
    const parsed = Number.parseInt(raw, 10);
    onChange({ ...facets, [key]: Number.isNaN(parsed) ? null : Math.max(0, parsed) });
  };

  const activeCount = countActiveFacets(facets);

  return (
    <aside
      aria-label="Filter products"
      className={cn(`rounded-2xl border ${HAIRLINE} bg-white p-6 ${CARD_SHADOW}`, className)}
    >
      <div className="flex flex-col gap-6">
        {activeCount > 0 && (
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-[#4A5565]">
              {activeCount} {activeCount === 1 ? "filter" : "filters"} applied
            </p>
            <button
              type="button"
              onClick={() => onChange(EMPTY_FACETS)}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-[#16A34A] transition-colors hover:bg-[#F0FDF4]"
            >
              <X aria-hidden="true" className="size-3.5" />
              Clear all
            </button>
          </div>
        )}

        {/* ------------------------------------------------------ categories */}
        <fieldset className="flex flex-col gap-4">
          <legend className="text-base font-bold leading-6 text-[#101828]">Categories</legend>
          <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
            {categories.map((option) => (
              <FacetCheckbox
                key={option.id}
                id={option.id}
                label={option.label}
                count={option.count}
                checked={facets.categories.includes(option.id)}
                onChange={() => toggle("categories", option.id)}
              />
            ))}
          </div>
        </fieldset>

        <hr className={`border-0 border-t ${HAIRLINE}`} />

        {/* ----------------------------------------------------- price range */}
        <fieldset className="flex flex-col gap-3">
          <legend className="text-base font-bold leading-6 text-[#101828]">Price Range</legend>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={minId} className="text-xs text-[#6A7282]">
                Min (EGP)
              </Label>
              <Input
                id={minId}
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="0"
                aria-label="Minimum price in EGP"
                value={facets.minPrice ?? ""}
                onChange={(event) => setPrice("minPrice", event.target.value)}
                className="h-10"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={maxId} className="text-xs text-[#6A7282]">
                Max (EGP)
              </Label>
              <Input
                id={maxId}
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="No limit"
                aria-label="Maximum price in EGP"
                value={facets.maxPrice ?? ""}
                onChange={(event) => setPrice("maxPrice", event.target.value)}
                className="h-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1">
            {QUICK_RANGES.map((range) => {
              const active = facets.maxPrice === range.max && facets.minPrice === null;
              return (
                <button
                  key={range.label}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    onChange({
                      ...facets,
                      minPrice: null,
                      maxPrice: active ? null : range.max,
                    })
                  }
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    active
                      ? "bg-[#DCFCE7] text-[#15803D] ring-1 ring-[#22C55E]"
                      : "bg-[#F3F4F6] text-[#4A5565] hover:bg-[#E5E7EB]",
                  )}
                >
                  {range.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <hr className={`border-0 border-t ${HAIRLINE}`} />

        {/* ----------------------------------------------------------- brands */}
        <fieldset className="flex flex-col gap-4">
          <legend className="text-base font-bold leading-6 text-[#101828]">Brands</legend>
          <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
            {brands.map((option) => (
              <FacetCheckbox
                key={option.id}
                id={option.id}
                label={option.label}
                count={option.count}
                checked={facets.brands.includes(option.id)}
                onChange={() => toggle("brands", option.id)}
              />
            ))}
          </div>
        </fieldset>
      </div>
    </aside>
  );
}

/**
 * 38:12527 — a 16px checkbox with a 12px gap and the label in `#4A5565`.
 *
 * The whole row is the hit area, which is what makes a 16px control usable on a
 * touch screen; the checkbox itself stays the accessible control.
 */
function FacetCheckbox({
  id,
  label,
  count,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) {
  const checkboxId = `facet-${id}`;
  const name = useMemo(() => label.toLowerCase().replace(/[^a-z0-9]+/g, "-"), [label]);

  return (
    <div className="flex items-center gap-3">
      <Checkbox
        id={checkboxId}
        checked={checked}
        onCheckedChange={onChange}
        aria-label={name}
        className="size-4 rounded-[2.5px]"
      />
      <Label
        htmlFor={checkboxId}
        className="flex min-w-0 flex-1 cursor-pointer items-center justify-between gap-2 text-sm font-medium leading-5 text-[#4A5565]"
      >
        <span className="truncate">{label}</span>
        {count !== undefined && (
          <span className="shrink-0 text-xs text-[#6A7282]">{count}</span>
        )}
      </Label>
    </div>
  );
}
