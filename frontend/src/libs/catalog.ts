import type { Equipment } from "../../interface";

export function categoryKey(category: string): string {
  return category.trim().toLowerCase();
}

export function catalogCategories(items: Equipment[]) {
  const categories = new Map<string, string>();
  for (const item of items) {
    const label = item.category.trim();
    const value = categoryKey(label);
    if (value && !categories.has(value)) categories.set(value, label);
  }
  return Array.from(categories, ([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function filterCatalog(items: Equipment[], query: string, category: string) {
  const search = query.trim().toLowerCase();
  const selectedCategory = categoryKey(category);
  return items.filter((item) =>
    (!selectedCategory || categoryKey(item.category) === selectedCategory)
    && (!search || item.name.toLowerCase().includes(search) || item.description.toLowerCase().includes(search)));
}
