"use client";

import { useRouter } from "next/navigation";
import { rentalsApi } from "@/libs/api";
import DeleteRecordButton from "@/components/DeleteRecordButton";

export default function DeleteRentalButton({ rentalId, token, returnTo, onDeleted }: { rentalId: string; token: string; returnTo: string; onDeleted?: () => void }) {
  const router = useRouter();
  return <DeleteRecordButton
    title="Delete rental request?"
    message="This action permanently deletes this request."
    onDelete={() => rentalsApi.remove(rentalId, token)}
    onDeleted={() => {
      if (onDeleted) onDeleted();
      else router.push(returnTo);
      router.refresh();
    }}
  />;
}
