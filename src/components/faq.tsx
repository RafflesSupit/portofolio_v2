"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion";
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
              <FaqItem item={item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Native <details>/<summary> only animated the "+" icon — the answer panel
 * itself snapped open/closed instantly (details has no native height
 * transition). Custom controlled accordion instead, animating height via
 * Framer Motion's `AnimatePresence`, which does support animating to/from
 * "auto" by measuring actual content height.
 */
function FaqItem({ item }: { item: FaqItemData }) {
  const [open, setOpen] = useState(false);
  const shouldReduceMotion = useSafeReducedMotion();
  const panelId = `faq-panel-${item.id}`;
  const buttonId = `faq-button-${item.id}`;

  return (
    <div className="py-5">
      <button
        id={buttonId}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-4 text-left text-h4 text-ink"
      >
        {item.question}
        <span
          className="shrink-0 text-text-3 transition-transform duration-200"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
          aria-hidden="true"
        >
          +
        </span>
      </button>

      {shouldReduceMotion ? (
        open ? (
          <div id={panelId} role="region" aria-labelledby={buttonId} className="mt-3">
            <p className="text-body-sm text-text-2">{item.answer}</p>
          </div>
        ) : null
      ) : (
        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden" }}
            >
              <p className="mt-3 text-body-sm text-text-2">{item.answer}</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      )}
    </div>
  );
}
