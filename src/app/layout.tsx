import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/noto-sans-thai/400.css";
import "@fontsource/noto-sans-thai/500.css";
import "@fontsource/noto-sans-thai/600.css";
import "@fontsource/noto-sans-thai/700.css";
import "./globals.css";
import "./knowledge.css";
import "./experiments.css";
import "./formulas.css";
import "./refresh.css";
import "./clarity.css";
import { author } from "@/data/site";
export const metadata: Metadata = {
  authors: [{ name: author.name }],
  creator: author.name,
  title: "ChemLab RX — คลังเนื้อหาเคมี ม.4–ม.6",
  description:
    "คลังเนื้อหาเคมี ม.4 ม.5 และ ม.6 แบ่งตามรายวิชาและหัวข้อ พร้อมภาพประกอบ สูตรสำคัญ และเครื่องมือจำลอง",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
