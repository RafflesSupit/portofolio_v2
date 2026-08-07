import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import type { FaqItemData } from "@/lib/queries";

export function Faq({ items }: { items: FaqItemData[] }) {
  if (items.length === 0) return null;

  return (
    <section id="faq" className="border-t border-border px-6 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeader label="FAQ" heading="Common questions." />
        <div className="mx-auto max-w-[768px] divide-y divide-border border-t border-border">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.05}>
              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-h4 text-ink [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span
                    className="shrink-0 text-text-3 transition-transform duration-200 group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-body-sm text-text-2">{item.answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
