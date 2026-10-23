import { highlightParts } from "@/lib/content/highlights";
export function HighlightedText({
  text,
  phrases,
  enabled = true,
}: {
  text: string;
  phrases?: string[];
  enabled?: boolean;
}) {
  if (!enabled) return <>{text}</>;
  return (
    <>
      {highlightParts(text, phrases).map((p, i) =>
        p.highlighted ? (
          <mark className="content-highlight" key={i}>
            {p.text}
          </mark>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
}
