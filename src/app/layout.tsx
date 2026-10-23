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
export const metadata: Metadata = {
  title: "ChemLab RX — Explore Chemistry, Understand Medicine",
  description:
    "แหล่งความรู้เคมีที่เชื่อมโยงยาและชีวิตประจำวัน อ่านเรื่องที่สงสัยผ่านภาพและเครื่องมือสำรวจ",
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
