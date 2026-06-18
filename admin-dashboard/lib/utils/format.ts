export function currency(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function shortDate(value: string | null | undefined) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
