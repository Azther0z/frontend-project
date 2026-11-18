"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { Rental } from "../../interface";
import RentalForm from "@/components/RentalForm";
import { ErrorMessage, LoadingMessage } from "@/components/Feedback";
import { errorMessage, rentalsApi } from "@/libs/api";

export default function RentalEditPage({ rentalId }: { rentalId: string }) {
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
    let active = true;
    rentalsApi.get(rentalId, session.backendToken ?? "").then((result) => {
      if (active) setRental(result);
    }).catch((cause: unknown) => {
      if (active) setError(errorMessage(cause));
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [rentalId, router, session, status]);

  if (status === "loading") return <LoadingMessage />;
  if (loading) return <LoadingMessage />;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!rental || !rental.equipment || !session?.backendToken) {
    return <ErrorMessage>This rental cannot be edited because its equipment is unavailable.</ErrorMessage>;
  }

  return (
    <section className="content-medium">
      <h1>Edit rental request</h1>
      {session.user.role === "admin" && <p className="owner-label">From {rental.user?.name ?? "Unknown user"}</p>}
      <RentalForm
        equipment={rental.equipment}
        initialQuantity={rental.quantity}
        initialRange={{ startDate: rental.startDate.slice(0, 10), returnDate: rental.returnDate.slice(0, 10) }}
        onSubmit={async (input) => {
          const updated = await rentalsApi.update(rental._id, input, session.backendToken!);
          router.push(`/rentals/${updated._id}`);
          router.refresh();
        }}
        submitLabel="Save"
      />
    </section>
  );
}
