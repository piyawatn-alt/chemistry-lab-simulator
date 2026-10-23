import Link from "next/link";
import { ArrowUpRight, Bookmark, Check } from "lucide-react";
import { type Article, readingMinutes, topicName } from "@/data/knowledge";
import type { ReadingList } from "@/hooks/use-reading-list";
import { ArticleArt } from "./article-art";
export function ArticleCard({
  article: a,
  list,
}: {
  article: Article;
  list: ReadingList;
}) {
  const saved = list.saved.includes(a.id);
  return (
    <article className="story-card">
      <Link
        href={`/read/${a.id}`}
        className="story-card-art"
        aria-label={`อ่าน ${a.title}`}
      >
        <ArticleArt visual={a.visual} conceptOnly={a.topic === "medicine"} />
      </Link>
      <div className="story-card-content">
        <div className="story-card-meta">
          <span>{topicName(a.topic)}</span>
          <button
            disabled={!list.ready}
            aria-label={`${saved ? "นำออกจาก" : "เพิ่มใน"}รายการอ่าน: ${a.title}`}
            aria-pressed={saved}
            onClick={() => list.toggle(a.id)}
          >
            {saved ? <Check size={17} /> : <Bookmark size={17} />}
          </button>
        </div>
        <Link href={`/read/${a.id}`}>
          <h3>{a.title}</h3>
          <p>{a.dek}</p>
        </Link>
        <Link className="story-card-bottom" href={`/read/${a.id}`}>
          <span>อ่านประมาณ {readingMinutes(a)} นาที</span>
          <ArrowUpRight size={17} />
        </Link>
      </div>
    </article>
  );
}
