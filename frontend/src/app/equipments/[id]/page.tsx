"use client";

import Link from "next/link";
import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import type { Equipment } from "../../../../interface";
import DeleteEquipmentButton from "@/components/DeleteEquipmentButton";
import { equipmentApi, errorMessage } from "@/libs/api";
import { money } from "@/libs/rental-cost";
import { ErrorMessage, LoadingMessage } from "@/components/Feedback";

export default function EquipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: routeId } = use(params);
  const [item, setItem] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    let active = true;
    equipmentApi.get(routeId).then((result) => {
      if (active) setItem(result);
    }).catch((cause: unknown) => {
      if (active) setError(errorMessage(cause));
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [routeId, session?.backendToken, status]);

  return (
    <section className="content-medium">
      {loading && <LoadingMessage />}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {item && <>
        <h1>{item.name}</h1>
        <div className="detail-panel">
          <p>{item.description}</p>
          <p>Category: {item.category}</p>
          <p>Quantity: {item.quantity}</p>
          <p>Rental Rate: ฿{money(item.rentalRate)} / day</p>
        </div>
        {status !== "authenticated" ? <Link className="button button-outline" href="/login">Login to request</Link>
          : session.user.role === "member" ? <Link className="button button-primary" href={`/equipments/${item._id}/rent`}>Rent</Link>
          : <div className="button-row">
            <Link className="button button-outline" href={`/equipments/${item._id}/edit`}>Edit</Link>
            {session.backendToken && <DeleteEquipmentButton equipmentId={item._id} token={session.backendToken} />}
          </div>}
      </>}
    </section>
  );
}
