"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Logo from "./Logo";

const links = [
  { href: "/", label: "대시보드" },
  { href: "/patterns", label: "패턴 도감" },
  { href: "/chart/005930", label: "차트" },
  { href: "/quiz", label: "예측 퀴즈", disabled: true },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("?")[0].split("#")[0].replace(/\/$/, ""));
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-base)]/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 md:gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = !l.disabled && isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.disabled ? "#" : l.href}
                  aria-disabled={l.disabled}
                  aria-current={active ? "page" : undefined}
                  className={`group relative rounded-md px-3 py-1.5 text-sm transition-colors ${
                    l.disabled
                      ? "cursor-not-allowed text-[color:var(--color-fg-muted)]"
                      : active
                        ? "bg-white/5 text-white"
                        : "text-[color:var(--color-fg-secondary)] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {l.label}
                  {l.disabled && (
                    <span className="ml-1.5 rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-[color:var(--color-fg-muted)]">
                      준비중
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-md border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-surface)] px-3 py-1.5 text-sm text-[color:var(--color-fg-muted)] lg:flex">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3-3" />
            </svg>
            <span className="text-[13px]">종목 검색 (준비중)</span>
            <kbd className="ml-6 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[11px] text-[color:var(--color-fg-muted)]">
              ⌘K
            </kbd>
          </div>
          <button
            type="button"
            className="hidden rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20 sm:inline-flex"
          >
            로그인
          </button>

          <button
            type="button"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-surface)] text-white transition-colors hover:border-[color:var(--color-border-strong)] md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {open ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <>
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <div className="md:hidden">
            <motion.button
              aria-label="메뉴 닫기"
              type="button"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.2 }}
              className="fixed inset-x-0 bottom-0 top-14 z-30 bg-black/60 backdrop-blur-sm"
            />
            <motion.nav
              key="mobile-drawer"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{
                duration: reduce ? 0 : 0.24,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative z-40 border-t border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-surface)] px-4 py-3"
            >
              <ul className="flex flex-col gap-1">
                {links.map((l, i) => {
                  const active = !l.disabled && isActive(l.href);
                  return (
                    <motion.li
                      key={l.href}
                      initial={reduce ? { opacity: 0 } : { opacity: 0, x: -8 }}
                      animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
                      transition={{
                        duration: reduce ? 0 : 0.22,
                        delay: reduce ? 0 : 0.04 + i * 0.04,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        href={l.disabled ? "#" : l.href}
                        aria-disabled={l.disabled}
                        aria-current={active ? "page" : undefined}
                        onClick={() => !l.disabled && setOpen(false)}
                        className={`flex items-center justify-between rounded-md px-3 py-2.5 text-sm transition-colors ${
                          l.disabled
                            ? "cursor-not-allowed text-[color:var(--color-fg-muted)]"
                            : active
                              ? "bg-emerald-500/10 text-emerald-200"
                              : "text-[color:var(--color-fg-secondary)] hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <span>{l.label}</span>
                        {l.disabled && (
                          <span className="rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-[color:var(--color-fg-muted)]">
                            준비중
                          </span>
                        )}
                      </Link>
                    </motion.li>
                  );
                })}
                <li className="mt-2 border-t border-[color:var(--color-border-subtle)] pt-3">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-300"
                  >
                    로그인
                  </button>
                </li>
              </ul>
            </motion.nav>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
