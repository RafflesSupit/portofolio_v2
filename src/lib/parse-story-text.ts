export type StoryBlock = { type: "paragraph"; text: string } | { type: "list"; items: string[] };

const BULLET_PREFIX = /^[-*•]\s+/;

/**
 * Challenge/Solution/Result are stored as a single string (a `<textarea>`
 * in the admin form), so paragraph and list structure has to be inferred
 * from plain text rather than read off separate fields: blank lines split
 * paragraphs (same convention as the profile bio), and a block where every
 * line starts with "- " becomes a bullet list.
 */
export function parseStoryText(text: string): StoryBlock[] {
  return text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      const isList = lines.length > 0 && lines.every((line) => BULLET_PREFIX.test(line));

      if (isList) {
        return { type: "list", items: lines.map((line) => line.replace(BULLET_PREFIX, "")) };
      }
      return { type: "paragraph", text: lines.join(" ") };
    });
}
