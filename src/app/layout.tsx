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
export const metadata: Metadata = {
  title: "ChemLab RX — Explore Chemistry, Understand Medicine",
  description:
    "เรียนรู้ ทดลอง และค้นพบความสัมพันธ์ระหว่างเคมีกับเภสัชศาสตร์ สำหรับนักเรียน ม.4–ม.6",
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
