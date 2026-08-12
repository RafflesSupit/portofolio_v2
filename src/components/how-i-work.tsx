import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";

type Principle = {
  title: string;
  description: string;
};

/**
 * Placeholder — swap these three for your real working principles. Left
 * intentionally generic (not invented specifics) since this is a claim
 * about how you actually work, not structural UI copy.
 */
const PRINCIPLES: Principle[] = [
  {
    title: "Clean & Scalable Code",
    description: "Writing modular, readable, and well-structured code designed to scale effortlessly and simplify long-term maintenance.",
  },
  {
    title: "Performance & Efficiency First",
    description: "Optimizing database queries, caching strategies, and system latency to deliver lightning-fast response times.",
  },
  {
    title: "Security & System Reliability",
    description: "Implementing robust authentication, proper authorization, and fail-safe error handling across every service layer.",
  },
];

export function HowIWork() {
  return (
    <section className="border-t border-border bg-surface-2/40 px-6 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeader label="How I work" heading="Principles I build by." />

        <div className="grid gap-6 md:grid-cols-3">
          {PRINCIPLES.map((principle, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="relative overflow-hidden rounded-lg border border-border bg-surface p-6">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-2 -top-6 select-none font-display text-[6rem] font-bold leading-none text-border/60"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="relative text-h4 text-ink">{principle.title}</h3>
                <p className="relative mt-3 text-body-sm text-text-2">{principle.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
