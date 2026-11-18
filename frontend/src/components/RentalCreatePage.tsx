"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { Equipment } from "../../interface";
import RentalForm from "@/components/RentalForm";
import { ErrorMessage, LoadingMessage } from "@/components/Feedback";
import { equipmentApi, errorMessage, rentalsApi } from "@/libs/api";

export default function RentalCreatePage({ equipmentId }: { equipmentId: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
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
    equipmentApi.get(equipmentId, session.backendToken).then((result) => {
      if (active) setEquipment(result);
    }).catch((cause: unknown) => {
      if (active) setError(errorMessage(cause));
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [equipmentId, router, session, status]);

  if (status === "loading") return <LoadingMessage />;
  if (session?.user.role === "admin") return <ErrorMessage>Admins cannot create rental requests.</ErrorMessage>;
  if (loading) return <LoadingMessage />;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!session || !equipment || !session.backendToken) return null;

  return (
    <section className="content-medium">
      <h1>Create rental request</h1>
      <RentalForm
        equipment={equipment}
        onSubmit={async (input) => {
          const created = await rentalsApi.create(input, session.backendToken!);
          router.push(`/rentals/${created._id}`);
          router.refresh();
        }}
        submitLabel="Rent"
      />
    </section>
  );
}
