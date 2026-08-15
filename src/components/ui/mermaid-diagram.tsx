"use client";

import { useEffect, useId, useState } from "react";

/**
 * Mermaid only knows how to render in a browser — it builds the diagram by
 * walking the DOM, not by producing static markup — so this has to run on
 * the client after mount rather than during SSR. The library itself is
 * fairly heavy, so it's imported dynamically here rather than at module
 * scope: pages/posts without a diagram never pay for it.
 */
export function MermaidDiagram({ code }: { code: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    import("mermaid").then(async ({ default: mermaid }) => {
      // Mermaid's default behavior on a parse error is to swallow it and
      // resolve with its own built-in "Syntax error in text..." SVG
      // instead of rejecting — suppressErrorRendering makes it actually
      // throw, so a malformed diagram falls through to the catch below
      // (raw-code fallback) instead of showing that built-in graphic.
      mermaid.initialize({
        startOnLoad: false,
        theme: "neutral",
        fontFamily: "inherit",
        suppressErrorRendering: true,
      });
      try {
        const { svg } = await mermaid.render(`mermaid-${id}`, code);
        if (!cancelled) setSvg(svg);
      } catch {
        if (!cancelled) setFailed(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [code, id]);

  if (failed) {
    return (
      <pre>
        <code className="language-mermaid">{code}</code>
      </pre>
    );
  }

  if (!svg) {
    return <div className="h-40 animate-pulse rounded-lg bg-surface-2" aria-hidden="true" />;
  }

  return (
    <div
      className="overflow-x-auto rounded-lg border border-border bg-surface-2 p-4 [&_svg]:mx-auto"
      // Mermaid sanitizes the markup it produces before returning it, and
      // the source is authored content from the admin CMS, not arbitrary
      // user input — this isn't rendering untrusted HTML.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
