"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Result pagination.
 *
 * Not in the design — the product-listing frames (`38:12685`, `54:13554`) run one
 * long grid with no pager. It is here because the catalogue is 56 products and the
 * listing fetches all of them, so a single page renders 56 cards and asks for 56
 * images. Paging to 20 cuts both by two thirds and shortens the scroll.
 *
 * The current page lives in the URL (`?page=`) rather than in component state, so
 * a page is linkable, survives a reload, and the browser's back button walks the
 * result pages instead of leaving the listing.
 *
 * Styling follows the rest of the app rather than any one screen: white surface,
 * `#E5E7EB` control border, `#16A34A` for the current page.
 */

const CONTROL = "flex size-10 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#364153] transition-colors hover:border-[#16A34A] hover:text-[#16A34A] disabled:pointer-events-none disabled:opacity-40";

/** How many numbered buttons to show either side of the current page. */
const SIBLINGS = 1;
/** Always reachable: first, last, and this many either side of the current page. */
const WINDOW = SIBLINGS * 2 + 3;

/** `1 … 4 5 6 … 12` — numbers worth showing, with gaps marked as `null`. */
function pageWindow(current: number, total: number): (number | null)[] {
  if (total <= WINDOW) return Array.from({ length: total }, (_, i) => i + 1);

  const half = SIBLINGS + 1;
  let start = Math.max(2, current - half);
  let end = Math.min(total - 1, current + half);

  // Slide the window rather than growing it, so the row keeps a stable width.
  if (end - start + 1 < WINDOW - 2) {
    if (current - half <= 2) end = WINDOW - 2;
    else start = total - (WINDOW - 3);
  }

  const pages: (number | null)[] = [1];
  if (start > 2) pages.push(null);
  for (let page = start; page <= end; page += 1) pages.push(page);
  if (end < total - 1) pages.push(null);
  pages.push(total);
  return pages;
}

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
  /** Noun for the summary line, e.g. "products". */
  itemLabel?: string;
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  className,
  itemLabel = "products",
}: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  if (pageCount <= 1) return null;

  // A filter change can leave the URL on a page that no longer exists.
  const current = Math.min(Math.max(1, page), pageCount);
  const first = (current - 1) * pageSize + 1;
  const last = Math.min(current * pageSize, total);

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex flex-col items-center justify-between gap-4 sm:flex-row", className)}
    >
      <p aria-live="polite" className="text-sm font-medium text-[#6A7282]">
        Showing {first}–{last} of {total} {itemLabel}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className={CONTROL}
          onClick={() => onPageChange(current - 1)}
          disabled={current === 1}
          aria-label="Previous page"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
        </button>

        {pageWindow(current, pageCount).map((page, index) =>
          page === null ? (
            <span key={`gap-${index}`} aria-hidden="true" className="px-1 text-sm text-[#6A7282]">
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-label={`Page ${page}`}
              aria-current={page === current ? "page" : undefined}
              className={cn(
                "flex size-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors",
                page === current
                  ? "border-[#16A34A] bg-[#16A34A] text-white"
                  : "border-[#E5E7EB] bg-white text-[#364153] hover:border-[#16A34A] hover:text-[#16A34A]",
              )}
            >
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          className={CONTROL}
          onClick={() => onPageChange(current + 1)}
          disabled={current === pageCount}
          aria-label="Next page"
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </button>
      </div>
    </nav>
  );
}
