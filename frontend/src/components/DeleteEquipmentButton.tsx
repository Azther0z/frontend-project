"use client";

import { useRouter } from "next/navigation";
import { equipmentApi } from "@/libs/api";
import DeleteRecordButton from "@/components/DeleteRecordButton";

export default function DeleteEquipmentButton({ equipmentId, token, onDeleted }: { equipmentId: string; token: string; onDeleted?: () => void }) {
  const router = useRouter();
  return <DeleteRecordButton
    title="Delete equipment?"
    message="Remove this equipment from the catalog? Existing rental requests will be retained."
    onDelete={() => equipmentApi.remove(equipmentId, token)}
    onDeleted={() => {
      if (onDeleted) onDeleted();
      else router.push("/equipments");
      router.refresh();
    }}
  />;
}
