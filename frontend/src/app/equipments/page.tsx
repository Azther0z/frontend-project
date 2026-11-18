import Link from "next/link";
import { getServerSession } from "next-auth";
import EquipmentActions from "@/components/EquipmentActions";
import { EmptyMessage, ErrorMessage } from "@/components/Feedback";
import { equipmentApi, errorMessage } from "@/libs/api";
import { authOptions } from "@/libs/auth";
import { money } from "@/libs/rental-cost";

export default async function EquipmentListPage() {
  // Public equipment does not depend on authentication: start both reads together.
  const [catalog, session] = await Promise.all([
    equipmentApi.list().then((items) => ({ items, error: "" }))
      .catch((cause: unknown) => ({ items: [], error: errorMessage(cause) })),
    getServerSession(authOptions),
  ]);
  const role = session?.user.role ?? null;
  const admin = role === "admin";

  return (
    <section>
      <div className="page-heading">
        <h1>{admin ? "Manage equipment" : "Equipment"}</h1>
        {admin && <Link className="button button-outline" href="/equipments/new">Add</Link>}
      </div>
      {catalog.error && <ErrorMessage>{catalog.error}</ErrorMessage>}
      {!catalog.error && catalog.items.length === 0 && <EmptyMessage>No equipment is available.</EmptyMessage>}
      <div className={admin ? "equipment-admin-list" : "equipment-grid"}>
        {catalog.items.map((item) => (
          <article className="equipment-card" key={item._id}>
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
