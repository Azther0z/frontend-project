"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { Rental } from "../../../interface";
import DeleteRentalButton from "@/components/DeleteRentalButton";
import { EmptyMessage, ErrorMessage, LoadingMessage } from "@/components/Feedback";
import { errorMessage, rentalsApi } from "@/libs/api";
import { formatDate } from "@/libs/dates";
import { money, rentalCost } from "@/libs/rental-cost";

export default function RentalsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rentals, setRentals] = useState<Rental[]>([]);
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
    rentalsApi.list(session.backendToken ?? "").then((result) => {
      if (active) setRentals(result);
    }).catch((cause: unknown) => {
      if (active) setError(errorMessage(cause));
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [router, session, status]);

  if (status === "loading") return <LoadingMessage />;
  if (session?.user.role === "admin") return <ErrorMessage>Admin rental management is the next implementation step.</ErrorMessage>;
  if (loading) return <LoadingMessage />;

  return (
    <section>
      <h1>My rental requests</h1>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {!error && rentals.length === 0 && <EmptyMessage>You have no rental requests.</EmptyMessage>}
      <div className="rental-list">
        {rentals.map((rental) => {
          const cost = rental.equipment ? rentalCost(rental.equipment.rentalRate, rental.startDate, rental.returnDate) : null;
          return <article className="rental-card" key={rental._id}>
            <div>
              <h2>{rental.equipment?.name ?? "Equipment unavailable"}</h2>
              <p>Quantity: {rental.quantity}</p>
              <p>{formatDate(rental.startDate)} to {formatDate(rental.returnDate)}</p>
              <p>Total cost: {cost ? `฿${money(cost.total)} THB` : "Unavailable"}</p>
            </div>
            <div className="button-row">
              <Link className="button button-outline" href={`/rentals/${rental._id}`}>View</Link>
              <Link className="button button-outline" href={`/rentals/${rental._id}/edit`}>Edit</Link>
              {session?.backendToken && <DeleteRentalButton rentalId={rental._id} returnTo="/rentals" token={session.backendToken} />}
            </div>
          </article>;
        })}
      </div>
    </section>
  );
}
