import type { Category } from "./types";

/**
 * Route segment for a category.
 *
 * The API slugs are kebab-case, so they are used as-is. Anything without a slug
 * falls back to the name, lowercased with whitespace collapsed to hyphens.
 */
export function slugOf(category: Pick<Category, "slug" | "name">) {
  if (category.slug) return category.slug;
  return category.name.toLowerCase().trim().replace(/\s+/g, "-");
}
