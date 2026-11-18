"use client";

import Link from "next/link";
import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { Rental } from "../../../../interface";
import DeleteRentalButton from "@/components/DeleteRentalButton";
import { ErrorMessage, LoadingMessage } from "@/components/Feedback";
import { errorMessage, rentalsApi } from "@/libs/api";
import { formatDate } from "@/libs/dates";
import { money, rentalCost } from "@/libs/rental-cost";

export default function RentalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: routeId } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rental, setRental] = useState<Rental | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/login");
      return;
    }
    if (session.user.role !== "member") {
      return;
    }
    let active = true;
    rentalsApi.get(routeId, session.backendToken ?? "").then((result) => {
      if (active) setRental(result);
    }).catch((cause: unknown) => {
      if (active) setError(errorMessage(cause));
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [routeId, router, session, status]);

  if (status === "loading") return <LoadingMessage />;
  if (session?.user.role === "admin") return <ErrorMessage>Admin rental management is the next implementation step.</ErrorMessage>;
  if (loading) return <LoadingMessage />;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!rental) return null;
  const cost = rental.equipment ? rentalCost(rental.equipment.rentalRate, rental.startDate, rental.returnDate) : null;

  return (
    <section className="content-medium">
      <h1>Rental request</h1>
      <div className="detail-panel">
        <h2>{rental.equipment?.name ?? "Equipment unavailable"}</h2>
        {rental.equipment && <>
          <p>{rental.equipment.description}</p>
          <p>Category: {rental.equipment.category}</p>
          <p>Rental Rate: ฿{money(rental.equipment.rentalRate)} / day</p>
        </>}
        <p>Quantity: {rental.quantity}</p>
        <p>Start date: {formatDate(rental.startDate)}</p>
        <p>Return date: {formatDate(rental.returnDate)}</p>
        <p>Total cost: {cost ? `฿${money(cost.total)} THB (${cost.days} days)` : "Unavailable"}</p>
      </div>
      <div className="button-row">
        <Link className="button button-outline" href={`/rentals/${rental._id}/edit`}>Edit</Link>
        {session?.backendToken && <DeleteRentalButton rentalId={rental._id} returnTo="/rentals" token={session.backendToken} />}
      </div>
    </section>
  );
}
