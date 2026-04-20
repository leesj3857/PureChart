import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 font-semibold tracking-tight ${className}`}
    >
      <span
        aria-hidden
        className="relative inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-[0_0_20px_rgba(16,185,129,0.35)]"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 text-black/85"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 17l5-6 4 4 5-8 4 6" />
        </svg>
      </span>
      <span className="text-[15px] text-white">
        Pure<span className="text-emerald-400">Chart</span>
      </span>
    </Link>
  );
}
