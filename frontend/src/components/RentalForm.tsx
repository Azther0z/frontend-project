"use client";

import { FormEvent, useMemo, useState } from "react";
import type { DateRangeValue, RentalEquipment, RentalInput } from "../../interface";
import DateRangeInput from "@/components/DateRangeInput";
import { ErrorMessage } from "@/components/Feedback";
import { latestReturnDate, todayUtc } from "@/libs/dates";
import { money, rentalCost } from "@/libs/rental-cost";

export default function RentalForm({
  equipment,
  initialQuantity = 1,
  initialRange = { startDate: null, returnDate: null },
  submitLabel,
  onSubmit,
}: {
  equipment: RentalEquipment;
  initialQuantity?: number;
  initialRange?: DateRangeValue;
  submitLabel: string;
  onSubmit: (input: RentalInput) => Promise<void>;
}) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [range, setRange] = useState(initialRange);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [dateError, setDateError] = useState("");
  const cost = useMemo(() => rentalCost(equipment.rentalRate, range.startDate, range.returnDate), [equipment.rentalRate, range]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setDateError("");
    if (!range.startDate || !range.returnDate) {
      setDateError("Choose a start date and a return date.");
      return;
    }
    if (range.startDate < todayUtc() || range.returnDate < range.startDate || range.returnDate > latestReturnDate(range.startDate)) {
      setDateError("Choose a valid date range of at most seven days, counting both start and return dates.");
      return;
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 3) {
      setError("Choose a whole-number quantity from 1 to 3.");
      return;
    }
    setPending(true);
    try {
      await onSubmit({ equipment: equipment._id, quantity, startDate: range.startDate, returnDate: range.returnDate });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The request failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="form-stack rental-form" onSubmit={submit}>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <section className="equipment-summary">
        <h2>{equipment.name}</h2>
        <p>{equipment.description}</p>
        <p>Category: {equipment.category}</p>
        <p>Rental Rate: ฿{money(equipment.rentalRate)} / day</p>
      </section>
      <label className="field"><span>Quantity</span><input disabled={pending} max={3} min={1} onChange={(event) => setQuantity(Number(event.target.value))} required step={1} type="number" value={quantity} /></label>
      <div className="field"><span>Date range (calendar)</span><DateRangeInput disabled={pending} error={dateError} onChange={(next) => { setRange(next); setDateError(""); }} value={range} /></div>
      <p className="total-cost">
        Total Cost: ฿{money(equipment.rentalRate)} × {cost?.days ?? "days"} = {cost ? `฿${money(cost.total)}` : "—"} THB <span>(both dates count)</span>
      </p>
      <button className="button button-primary" disabled={pending} type="submit">{pending ? "Saving…" : submitLabel}</button>
    </form>
  );
}
