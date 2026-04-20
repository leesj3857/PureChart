import type { ReactNode } from "react";

type Tone = "up" | "down" | "neutral" | "info" | "warn";

const TONE_CLASS: Record<Tone, string> = {
  up: "bg-[color:var(--color-up-soft)] text-[color:var(--color-up)] ring-[color:var(--color-up)]/30",
  down: "bg-[color:var(--color-down-soft)] text-[color:var(--color-down)] ring-[color:var(--color-down)]/30",
  neutral: "bg-white/5 text-[color:var(--color-fg-secondary)] ring-white/10",
  info: "bg-cyan-500/10 text-cyan-300 ring-cyan-400/30",
  warn: "bg-amber-500/10 text-amber-300 ring-amber-400/30",
};

export default function Badge({
  tone = "neutral",
  children,
  className = "",
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${TONE_CLASS[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
