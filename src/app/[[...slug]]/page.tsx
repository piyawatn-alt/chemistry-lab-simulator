import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Workspace from "@/components/workspace";
import { articles, topics } from "@/data/knowledge";
type Props = { params: Promise<{ slug?: string[] }> };
const legacy: Record<string, string> = {
  lessons: "/discover",
  labs: "/tools",
  builder: "/tools",
  drugs: "/topics/medicine",
  quizzes: "/discover",
  progress: "/saved",
  "lessons/bonds": "/read/small-groups-big-difference",
  "lessons/organic": "/read/small-groups-big-difference",
  "lessons/moles": "/read/concentration-is-a-ratio",
  "lessons/kinetics": "/read/why-reactions-slow-down",
  "lessons/polymers": "/read/polymers-around-us",
  "lessons/integration": "/read/why-reactions-slow-down",
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug = [] } = await params;
  const a = articles.find((a) => `read/${a.id}` === slug.join("/"));
  return a
    ? {
        title: `${a.title} — ChemLab RX`,
        description: a.intro,
        openGraph: {
          title: a.title,
          description: a.intro,
          type: "article",
          locale: "th_TH",
        },
      }
    : { title: "ChemLab RX — เคมีที่เชื่อมโยงยาและชีวิตประจำวัน" };
}
export default async function Page({ params }: Props) {
  const { slug = [] } = await params;
  const path = slug.join("/");
  if (legacy[path]) redirect(legacy[path]);
  const known =
    [
      "",
      "discover",
      "tools",
      "tools/kinetics",
      "saved",
      "about",
      "explorer",
    ].includes(path) ||
    articles.some((a) => path === `read/${a.id}`) ||
    topics.slice(1).some((t) => path === `topics/${t.id}`);
  if (!known) notFound();
  return <Workspace path={path} />;
}
