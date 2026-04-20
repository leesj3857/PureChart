export function formatPrice(value: number, currency: "KRW" | "USD" = "KRW"): string {
  if (currency === "KRW") {
    return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(value);
  }
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatSignedPct(pct: number): string {
  const sign = pct > 0 ? "+" : pct < 0 ? "" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

export function formatSignedNumber(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 2 }).format(n)}`;
}

export function formatCompact(n: number): string {
  return new Intl.NumberFormat("ko-KR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function toneClass(change: number): string {
  if (change > 0) return "text-[color:var(--color-up)]";
  if (change < 0) return "text-[color:var(--color-down)]";
  return "text-[color:var(--color-fg-muted)]";
}

export function toneBg(change: number): string {
  if (change > 0) return "bg-[color:var(--color-up-soft)] text-[color:var(--color-up)]";
  if (change < 0) return "bg-[color:var(--color-down-soft)] text-[color:var(--color-down)]";
  return "bg-white/5 text-[color:var(--color-fg-secondary)]";
}
