import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Workspace from "@/components/workspace";
import { articles, topics, courses } from "@/data/knowledge";
type Props = { params: Promise<{ slug?: string[] }> };
const legacy: Record<string, string> = {
 "topics/medicine":"/courses/organic",
 "topics/molecules":"/courses/organic",
 "topics/everyday":"/discover",
 "topics/ideas":"/discover",
  lessons: "/discover",
  labs: "/tools",
  builder: "/tools",
  drugs: "/courses/organic",
  quizzes: "/discover",
  progress: "/saved",
  "lessons/bonds": "/read/small-groups-big-difference",
  "lessons/organic": "/read/small-groups-big-difference",
  "lessons/moles": "/read/concentration-is-a-ratio",
  "lessons/kinetics": "/read/why-reactions-slow-down",
  "lessons/polymers": "/read/polymers-around-us",
  "lessons/integration": "/read/chemical-models",
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug = [] } = await params;
  if (slug.join("/") === "tools/flame-test") return { title: "ทดลองสีเปลวไฟ — ChemLab RX", description: "การทดลองจำลองแบบแอนิเมชัน เลือกเกลือโลหะ 6 ชนิด สังเกตสีเปลวไฟ และเข้าใจระดับพลังงานของอิเล็กตรอน" };
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
    : { title: "ChemLab RX — คลังเนื้อหาเคมี ม.4–ม.6" };
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
      "tools/flame-test",
      "saved",
      "about",
      "explorer",
    ].includes(path) ||
    articles.some((a) => path === `read/${a.id}`) ||
    topics.slice(1).some((t) => path === `topics/${t.id}`) ||
    ["4", "5", "6"].some((g) => path === `grades/${g}`) ||
    courses.some((c) => path === `courses/${c.id}`);
  if (!known) notFound();
  return <Workspace path={path} />;
}
