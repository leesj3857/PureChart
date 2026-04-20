import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import TrendingStocks from "@/components/home/TrendingStocks";
import PatternPreview from "@/components/home/PatternPreview";
import Roadmap from "@/components/home/Roadmap";
import CTA from "@/components/home/CTA";
import { PATTERNS } from "@/data/patterns";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <TrendingStocks />
      <PatternPreview patterns={PATTERNS} />
      <Roadmap />
      <CTA />
    </>
  );
}
