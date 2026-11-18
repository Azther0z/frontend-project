import type { RentalCost } from "../../interface";

function utcDay(value: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return Date.UTC(year, month - 1, day) / 86_400_000;
}

export function rentalCost(rate: number | null | undefined, start: string | null, end: string | null): RentalCost | null {
  if (rate == null || !Number.isFinite(rate) || start == null || end == null) return null;
  const first = utcDay(start);
  const last = utcDay(end);
  if (first == null || last == null || last < first) return null;
  const days = last - first + 1;
  const total = Math.floor(rate * days * 100 + 0.5) / 100;
  return { days, total, currency: "THB" };
}

export function money(value: number): string {
  return new Intl.NumberFormat("en-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}
