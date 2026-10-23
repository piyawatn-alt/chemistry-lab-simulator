export type TextPart = { text: string; highlighted: boolean };
/** Match explicit editorial phrases literally. Never interpret article text as HTML. */
export function highlightParts(
  text: string,
  phrases: readonly string[] = [],
): TextPart[] {
  const terms = Array.from(new Set(phrases.filter(Boolean))).sort(
    (a, b) => b.length - a.length,
  );
  const parts: TextPart[] = [];
  let cursor = 0;
  while (cursor < text.length) {
    let at = -1;
    let match = "";
    for (const term of terms) {
      const index = text.indexOf(term, cursor);
      if (index !== -1 && (at === -1 || index < at)) {
        at = index;
        match = term;
      }
    }
    if (at === -1) {
      parts.push({ text: text.slice(cursor), highlighted: false });
      break;
    }
    if (at > cursor)
      parts.push({ text: text.slice(cursor, at), highlighted: false });
    parts.push({ text: match, highlighted: true });
    cursor = at + match.length;
  }
  return parts;
}
