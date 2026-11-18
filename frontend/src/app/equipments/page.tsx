import Link from "next/link";
import { getServerSession } from "next-auth";
import EquipmentActions from "@/components/EquipmentActions";
import EquipmentImage from "@/components/EquipmentImage";
import { EmptyMessage, ErrorMessage } from "@/components/Feedback";
import { equipmentApi, errorMessage } from "@/libs/api";
import { authOptions } from "@/libs/auth";
import { money } from "@/libs/rental-cost";
import { catalogCategories, categoryKey, filterCatalog } from "@/libs/catalog";

export default async function EquipmentListPage({ searchParams }: {
  searchParams: Promise<{ q?: string | string[]; category?: string | string[] }>;
}) {
  // Public equipment does not depend on authentication: start both reads together.
  const [catalog, session, filters] = await Promise.all([
    equipmentApi.list().then((items) => ({ items, error: "" }))
      .catch((cause: unknown) => ({ items: [], error: errorMessage(cause) })),
    getServerSession(authOptions),
    searchParams,
  ]);
  const role = session?.user.role ?? null;
  const admin = role === "admin";
  const query = (Array.isArray(filters.q) ? filters.q[0] : filters.q)?.trim() ?? "";
  const category = (Array.isArray(filters.category) ? filters.category[0] : filters.category)?.trim() ?? "";
  const selectedCategory = categoryKey(category);
  const categories = catalogCategories(catalog.items);
  const items = filterCatalog(catalog.items, query, category);
  const unknownCategory = selectedCategory && !categories.some((option) => option.value === selectedCategory);

  return (
    <section>
      <div className="page-heading">
        <h1>{admin ? "Manage equipment" : "Equipment"}</h1>
        {admin && <Link className="button button-outline" href="/equipments/new">Add</Link>}
      </div>
      <form action="/equipments" className="catalog-filters" key={JSON.stringify([query, selectedCategory])} method="get">
        <label className="field"><span>Search equipment</span><input defaultValue={query} name="q" placeholder="Name or description" type="search" /></label>
        <div className="field"><label htmlFor="catalog-category">Category</label><select defaultValue={selectedCategory} id="catalog-category" name="category">
          <option value="">All categories</option>
          {unknownCategory && <option value={selectedCategory}>{category}</option>}
          {categories.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select></div>
        <div className="button-row">
          <button className="button button-primary" type="submit">Search</button>
          <Link className="button button-outline" href="/equipments">Reset filters</Link>
        </div>
      </form>
      {catalog.error && <ErrorMessage>{catalog.error}</ErrorMessage>}
      {!catalog.error && <p className="result-count">{items.length} {items.length === 1 ? "result" : "results"}</p>}
      {!catalog.error && items.length === 0 && <EmptyMessage>{query || selectedCategory ? "No equipment matches your search and category. Try different filters." : "No equipment is available."}</EmptyMessage>}
      <div className={admin ? "equipment-admin-list" : "equipment-grid"}>
        {items.map((item) => (
          <article className={`equipment-card${item.imageUrl ? " has-image" : ""}`} key={item._id}>
            {item.imageUrl && <EquipmentImage key={item.imageUrl} name={item.name} src={item.imageUrl} />}
            <h2><Link href={`/equipments/${item._id}`}>{item.name}</Link></h2>
            <p>{item.description}</p>
            <dl className="equipment-facts">
              <div><dt>Category</dt><dd>{item.category}</dd></div>
              <div><dt>Quantity</dt><dd>{item.quantity}</dd></div>
              <div><dt>Rental rate</dt><dd>฿{money(item.rentalRate)} / day</dd></div>
            </dl>
            <EquipmentActions equipmentId={item._id} role={role} variant="catalog" />
          </article>
        ))}
      </div>
    </section>
  );
}
