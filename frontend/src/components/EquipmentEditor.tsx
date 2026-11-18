"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { Equipment } from "../../interface";
import EquipmentForm from "@/components/EquipmentForm";
import { ErrorMessage, LoadingMessage } from "@/components/Feedback";
import { equipmentApi, errorMessage } from "@/libs/api";

export default function EquipmentEditor({ equipmentId }: { equipmentId?: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(Boolean(equipmentId));
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) { router.replace("/login"); return; }
    if (session.user.role !== "admin" || !equipmentId) return;
    let active = true;
    equipmentApi.get(equipmentId).then((item) => { if (active) setEquipment(item); })
      .catch((cause: unknown) => { if (active) setError(errorMessage(cause)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [equipmentId, router, session, status]);

  if (status === "loading" || !session) return <LoadingMessage />;
  if (session.user.role !== "admin") return <ErrorMessage>Only admins can manage equipment.</ErrorMessage>;
  if (loading) return <LoadingMessage />;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!session.backendToken) return <ErrorMessage>Please log in again to manage equipment.</ErrorMessage>;

  return <section className="content-medium">
    <h1>{equipmentId ? "Edit equipment" : "Add equipment"}</h1>
    <EquipmentForm initialValues={equipment ?? undefined} submitLabel={equipmentId ? "Save" : "Add"} onSubmit={async (input) => {
      const saved = equipmentId
        ? await equipmentApi.update(equipmentId, input, session.backendToken!)
        : await equipmentApi.create(input, session.backendToken!);
      router.push(`/equipments/${saved._id}`);
      router.refresh();
    }} />
  </section>;
}
