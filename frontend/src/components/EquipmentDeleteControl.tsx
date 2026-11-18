"use client";

import { useSession } from "next-auth/react";
import DeleteEquipmentButton from "@/components/DeleteEquipmentButton";

export default function EquipmentDeleteControl({ equipmentId, stayOnList = false }: { equipmentId: string; stayOnList?: boolean }) {
  const { data: session } = useSession();
  if (!session?.backendToken) {
    return <button className="button button-danger-outline" disabled type="button">Delete</button>;
  }
  return <DeleteEquipmentButton equipmentId={equipmentId} stayOnList={stayOnList} token={session.backendToken} />;
}
