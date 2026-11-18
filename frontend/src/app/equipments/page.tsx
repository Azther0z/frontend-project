"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import type { Equipment } from "../../../interface";
import DeleteEquipmentButton from "@/components/DeleteEquipmentButton";
import { equipmentApi, errorMessage } from "@/libs/api";
import { money } from "@/libs/rental-cost";
import { EmptyMessage, ErrorMessage, LoadingMessage } from "@/components/Feedback";

export default function EquipmentListPage() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    let active = true;
    equipmentApi.list().then((result) => {
      if (active) setItems(result);
    }).catch((cause: unknown) => {
      if (active) setError(errorMessage(cause));
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [session?.backendToken, status]);

  const guest = status !== "authenticated";
  const admin = session?.user.role === "admin";

  return (
    <section>
      <div className="page-heading">
        <h1>{admin ? "Manage equipment" : "Equipment"}</h1>
        {admin && <Link className="button button-outline" href="/equipments/new">Add</Link>}
      </div>
      {loading && <LoadingMessage />}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {!loading && !error && items.length === 0 && <EmptyMessage>No equipment is available.</EmptyMessage>}
      <div className={admin ? "equipment-admin-list" : "equipment-grid"}>
        {items.map((item) => (
          <article className="equipment-card" key={item._id}>
            <h2><Link href={`/equipments/${item._id}`}>{item.name}</Link></h2>
            <p>{item.description}</p>
            <dl className="equipment-facts">
              <div><dt>Category</dt><dd>{item.category}</dd></div>
              <div><dt>Quantity</dt><dd>{item.quantity}</dd></div>
              <div><dt>Rental rate</dt><dd>฿{money(item.rentalRate)} / day</dd></div>
            </dl>
            {admin && <div className="button-row">
              <Link className="button button-outline" href={`/equipments/${item._id}`}>View</Link>
              <Link className="button button-outline" href={`/equipments/${item._id}/edit`}>Edit</Link>
              {session?.backendToken && <DeleteEquipmentButton equipmentId={item._id} token={session.backendToken} onDeleted={() => setItems((current) => current.filter((equipment) => equipment._id !== item._id))} />}
            </div>}
            {guest ? null : admin ? null : <Link className="button button-outline" href={`/equipments/${item._id}/rent`}>Rent</Link>}
          </article>
        ))}
      </div>
    </section>
  );
}
