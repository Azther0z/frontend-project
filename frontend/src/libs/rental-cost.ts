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
  if (rate == null || !Number.isFinite(rate) || rate < 0 || start == null || end == null) return null;
  const first = utcDay(start);
  const last = utcDay(end);
  if (first == null || last == null || last < first) return null;
  const days = last - first + 1;
  // Work from the decimal rate so binary floating-point cannot move a halfway
  // amount (for example 1.005) below the rounding boundary.
  const [coefficient, exponent = "0"] = rate.toString().split("e");
  const decimals = coefficient.split(".")[1]?.length ?? 0;
  const amount = BigInt(coefficient.replace(".", "")) * BigInt(days);
  const shift = Number(exponent) - decimals + 2;
  const divisor = 10n ** BigInt(Math.max(0, -shift));
  const cents = shift >= 0
    ? amount * 10n ** BigInt(shift)
    : (amount + divisor / 2n) / divisor;
  const total = Number(cents) / 100;
  if (!Number.isFinite(total)) return null;
  return { days, total, currency: "THB" };
}

export function money(value: number): string {
  return new Intl.NumberFormat("en-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}
