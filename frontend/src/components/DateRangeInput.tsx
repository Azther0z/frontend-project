"use client";

import { useMemo, useState } from "react";
import type { DateRangeValue } from "../../interface";
import { latestReturnDate, todayUtc } from "@/libs/dates";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function monthTitle(year: number, month: number) {
  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(Date.UTC(year, month, 1)));
}

function labelDate(value: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: "short", year: "numeric", timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export default function DateRangeInput({
  value,
  onChange,
  error,
  disabled = false,
}: {
  value: DateRangeValue;
  onChange: (next: DateRangeValue) => void;
  error?: string;
  disabled?: boolean;
}) {
  const now = todayUtc();
  const seed = value.startDate ?? now;
  const [year, setYear] = useState(Number(seed.slice(0, 4)));
  const [month, setMonth] = useState(Number(seed.slice(5, 7)) - 1);
  const [open, setOpen] = useState(false);

  const cells = useMemo(() => {
    const first = new Date(Date.UTC(year, month, 1));
    const mondayOffset = (first.getUTCDay() + 6) % 7;
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    return Array.from({ length: Math.ceil((mondayOffset + daysInMonth) / 7) * 7 }, (_, index) => {
      const day = index - mondayOffset + 1;
      return day > 0 && day <= daysInMonth
        ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
        : null;
    });
  }, [month, year]);

  function moveMonth(amount: number) {
    const date = new Date(Date.UTC(year, month + amount, 1));
    setYear(date.getUTCFullYear());
    setMonth(date.getUTCMonth());
  }

  function choose(date: string) {
    if (!value.startDate || value.returnDate || date < value.startDate) {
      onChange({ startDate: date, returnDate: null });
      return;
    }
    onChange({ startDate: value.startDate, returnDate: date });
    setOpen(false);
  }

  const display = value.startDate
    ? `${labelDate(value.startDate)}${value.returnDate ? ` to ${labelDate(value.returnDate)}` : " to Return date"}`
    : "Start date to Return date";

  return (
    <div className="date-range-wrap">
      <button
        aria-expanded={open}
        aria-haspopup="dialog"
        className={`date-range-trigger${error ? " field-invalid" : ""}`}
        disabled={disabled}
        onClick={() => setOpen(!open)}
        type="button"
      >
        <span>{display}</span><span aria-hidden="true">▦</span>
      </button>
      {error && <p className="field-error" role="alert">{error}</p>}
      {open && (
        <section aria-label="Choose rental dates" className="calendar-popover" role="dialog">
          <div className="calendar-head">
            <button aria-label="Previous month" className="calendar-nav" onClick={() => moveMonth(-1)} type="button">‹</button>
            <strong>{monthTitle(year, month)}</strong>
            <button aria-label="Next month" className="calendar-nav" onClick={() => moveMonth(1)} type="button">›</button>
          </div>
          <div className="calendar-grid" role="grid">
            {weekdays.map((day) => <span className="weekday" key={day}>{day}</span>)}
            {cells.map((date, index) => {
              if (!date) return <span aria-hidden="true" className="calendar-blank" key={`blank-${index}`} />;
              const chosen = date === value.startDate || date === value.returnDate;
              const inRange = Boolean(value.startDate && value.returnDate && date > value.startDate && date < value.returnDate);
              const choosingEnd = value.startDate !== null && value.startDate >= now && value.returnDate === null;
              const invalid = date < now || (choosingEnd && date > latestReturnDate(value.startDate!));
              return (
                <button
                  aria-pressed={chosen}
                  className={`calendar-day${chosen ? " is-selected" : ""}${inRange ? " is-range" : ""}`}
                  disabled={invalid}
                  key={date}
                  onClick={() => choose(date)}
                  type="button"
                >
                  {Number(date.slice(-2))}
                </button>
              );
            })}
          </div>
          <p className="calendar-hint">Select a start date, then a return date.</p>
          <button className="text-button" onClick={() => onChange({ startDate: null, returnDate: null })} type="button">Clear dates</button>
          <button className="text-button" onClick={() => setOpen(false)} type="button">Close calendar</button>
        </section>
      )}
    </div>
  );
}
