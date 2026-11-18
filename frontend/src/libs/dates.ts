export function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDays(value: string, days: number): string {
  const date = new Date(`${value}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function latestReturnDate(startDate: string): string {
  // The start date is day one, so a seven-day rental ends six dates later.
  return addDays(startDate, 6);
}

export function formatDate(value: string): string {
  const date = new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
