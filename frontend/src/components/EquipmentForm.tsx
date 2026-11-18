"use client";

import { useState, type FormEvent } from "react";
import type { EquipmentInput } from "../../interface";
import { errorMessage } from "@/libs/api";
import { ErrorMessage } from "@/components/Feedback";

export default function EquipmentForm({ initialValues, onSubmit, submitLabel }: {
  initialValues?: EquipmentInput;
  onSubmit: (input: EquipmentInput) => Promise<void>;
  submitLabel: string;
}) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [category, setCategory] = useState(initialValues?.category ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [quantity, setQuantity] = useState(String(initialValues?.quantity ?? ""));
  const [rentalRate, setRentalRate] = useState(String(initialValues?.rentalRate ?? ""));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = { name: name.trim(), category: category.trim(), description: description.trim(), quantity: Number(quantity), rentalRate: Number(rentalRate) };
    if (!values.name || !values.category || !values.description || quantity === "" || rentalRate === "" || !Number.isInteger(values.quantity) || values.quantity < 0 || !Number.isFinite(values.rentalRate) || values.rentalRate < 0) {
      setError("Complete all fields. Quantity must be a nonnegative whole number and rental rate must be nonnegative.");
      return;
    }
    setPending(true);
    setError("");
    try { await onSubmit(values); }
    catch (cause) { setError(errorMessage(cause)); }
    finally { setPending(false); }
  }

  return <form className="form-stack" onSubmit={submit}>
    {error && <ErrorMessage>{error}</ErrorMessage>}
    <label className="field"><span>Name</span><input disabled={pending} onChange={(event) => setName(event.target.value)} required value={name} /></label>
    <label className="field"><span>Category</span><input disabled={pending} onChange={(event) => setCategory(event.target.value)} required value={category} /></label>
    <div className="field"><label htmlFor="equipment-description">Description</label><textarea disabled={pending} id="equipment-description" onChange={(event) => setDescription(event.target.value)} required rows={4} value={description} /></div>
    <label className="field"><span>Quantity</span><input disabled={pending} min={0} onChange={(event) => setQuantity(event.target.value)} required step={1} type="number" value={quantity} /></label>
    <label className="field"><span>Rental Rate</span><input disabled={pending} min={0} onChange={(event) => setRentalRate(event.target.value)} required step="any" type="number" value={rentalRate} /></label>
    <button className="button button-primary" disabled={pending} type="submit">{pending ? "Saving…" : submitLabel}</button>
  </form>;
}
