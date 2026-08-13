import { parseStoryText } from "@/lib/parse-story-text";

export function StoryText({ text }: { text: string }) {
  const blocks = parseStoryText(text);

  return (
    <div className="mt-4 max-w-[65ch] space-y-4">
      {blocks.map((block, i) =>
        block.type === "list" ? (
          <ul key={i} className="space-y-2">
            {block.items.map((item, j) => (
              <li key={j} className="flex gap-3 text-h4 font-normal text-text-2">
                <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-ink" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p key={i} className="text-h4 font-normal text-text-2">
            {block.text}
          </p>
        ),
      )}
    </div>
  );
}
