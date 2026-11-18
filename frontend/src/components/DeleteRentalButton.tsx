"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { rentalsApi } from "@/libs/api";
import { ErrorMessage } from "@/components/Feedback";

export default function DeleteRentalButton({ rentalId, token, returnTo }: { rentalId: string; token: string; returnTo: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function remove() {
    setPending(true);
    setError("");
    try {
      await rentalsApi.remove(rentalId, token);
      router.push(returnTo);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The rental could not be deleted.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button className="button button-danger-outline" onClick={() => setOpen(true)} type="button">Delete</button>
      {open && <div className="dialog-backdrop">
        <section aria-labelledby={`delete-title-${rentalId}`} aria-modal="true" className="confirm-dialog" role="dialog">
          <h2 id={`delete-title-${rentalId}`}>Delete rental request?</h2>
          <p>This action permanently deletes this request.</p>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <div className="button-row">
            <button className="button button-outline" disabled={pending} onClick={() => setOpen(false)} type="button">Cancel</button>
            <button className="button button-danger" disabled={pending} onClick={remove} type="button">{pending ? "Deleting…" : "Delete"}</button>
          </div>
        </section>
      </div>}
    </>
  );
}
