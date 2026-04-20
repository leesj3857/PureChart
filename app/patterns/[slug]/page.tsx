import Link from "next/link";
import { notFound } from "next/navigation";
import PatternDetail from "@/components/patterns/PatternDetail";
import { PATTERNS, findPattern } from "@/data/patterns";

export function generateStaticParams() {
  return PATTERNS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = findPattern(slug);
  if (!p) return { title: "패턴을 찾을 수 없음 — PureChart" };
  return {
    title: `${p.nameKo} (${p.name}) — PureChart`,
    description: p.summary,
  };
}

export default async function PatternDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pattern = findPattern(slug);
  if (!pattern) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-4 sm:mb-6">
        <Link
          href="/patterns"
          className="inline-flex items-center gap-1 text-sm text-[color:var(--color-fg-secondary)] hover:text-emerald-300"
        >
          ← 패턴 도감으로
        </Link>
      </div>
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {pattern.nameKo}
        </h1>
        <p className="mt-1 text-xs text-[color:var(--color-fg-muted)] sm:text-sm">{pattern.name}</p>
      </header>

      <PatternDetail pattern={pattern} />
    </div>
  );
}
