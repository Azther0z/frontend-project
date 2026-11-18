"use client";

import { useEffect, useId, useRef, useState } from "react";
import { errorMessage } from "@/libs/api";
import { ErrorMessage } from "@/components/Feedback";

export default function DeleteRecordButton({ title, message, onDelete, onDeleted }: {
  title: string;
  message: string;
  onDelete: () => Promise<unknown>;
  onDeleted: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);

  async function remove() {
    setPending(true);
    setError("");
    try {
      await onDelete();
      setOpen(false);
      onDeleted();
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setPending(false);
    }
  }

  return <>
    <button className="button button-danger-outline" onClick={() => { setError(""); setOpen(true); }} type="button">Delete</button>
    <dialog aria-labelledby={titleId} className="confirm-dialog" onCancel={(event) => { event.preventDefault(); if (!pending) setOpen(false); }} ref={dialog}>
      <h2 id={titleId}>{title}</h2>
      <p>{message}</p>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <div className="button-row">
        <button className="button button-outline" disabled={pending} onClick={() => setOpen(false)} type="button">Cancel</button>
        <button className="button button-danger" disabled={pending} onClick={remove} type="button">{pending ? "Deleting…" : "Delete"}</button>
      </div>
    </dialog>
  </>;
}
