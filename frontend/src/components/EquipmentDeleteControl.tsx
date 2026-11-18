"use client";

import { useSession } from "next-auth/react";
import DeleteEquipmentButton from "@/components/DeleteEquipmentButton";

export default function EquipmentDeleteControl({ equipmentId }: { equipmentId: string }) {
  const { data: session } = useSession();
  if (!session?.backendToken) {
    return <button className="button button-danger-outline" disabled type="button">Delete</button>;
  }
  return <DeleteEquipmentButton equipmentId={equipmentId} token={session.backendToken} />;
}
