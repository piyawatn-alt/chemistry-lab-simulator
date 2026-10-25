"use client";
import { useId } from "react";

const previews = {
  atom: { title: "อะตอมโซเดียมและเวเลนซ์อิเล็กตรอน", description: "Na เป็นกลางมีอิเล็กตรอน 11 ตัว จัดกลุ่มตามระดับพลังงานหลักเป็น 2, 8, 1 วงเป็นภาพช่วยนับ ไม่ใช่วงโคจรจริง" },
  water: { title: "รูปร่างงอทำให้โมเลกุลน้ำมีขั้ว", description: "ออกซิเจนมีประจุลบบางส่วน ไฮโดรเจนมีประจุบวกบางส่วน ลูกศรขั้วพันธะชี้เข้าหาออกซิเจนและไม่หักล้างกัน ภาพไม่แสดงขนาดหรือมุมตามมาตราส่วน" },
  gas: { title: "แก๊สปริมาณเท่าเดิมในปริมาตรที่ลดลง", description: "แบบจำลองแก๊สอุดมคติ เมื่อจำนวนโมลและอุณหภูมิคงที่ ปริมาตรลดเหลือครึ่งหนึ่ง ความดันเพิ่มเป็นสองเท่า จุดแทนอนุภาคเชิงแนวคิด" },
};

/** Small explanatory illustrations; all visible text is also described for screen readers. */
export function ConceptPreview({ variant }: { variant: keyof typeof previews }) {
  const id = useId();
  const { title, description } = previews[variant];
  return (
    <svg viewBox="0 0 360 230" className={`concept-preview preview-${variant}`} role="img" aria-labelledby={`${id}-title`} aria-describedby={`${id}-desc`}>
      <title id={`${id}-title`}>{title}</title>
      <desc id={`${id}-desc`}>{description}</desc>
      {variant === "atom" ? <>
        {[39, 68, 98].map((r, shell) => <g key={r}>
          <circle cx="171" cy="113" r={r} fill="none" stroke="#b8d0cb" strokeWidth="1.5" strokeDasharray={shell === 2 ? "5 5" : undefined}/>
          {Array.from({ length: [2, 8, 1][shell] }, (_, i) => {
            const a = i * Math.PI * 2 / [2, 8, 1][shell] - Math.PI / 2;
            return <circle key={i} cx={171 + r * Math.cos(a)} cy={113 + r * Math.sin(a)} r={shell === 2 ? 7 : 5} fill={shell === 2 ? "#bd5d32" : "#24776c"}/>;
          })}
        </g>)}
        <circle cx="171" cy="113" r="22" fill="#17665c"/>
        <text x="171" y="119" textAnchor="middle" fill="white" fontSize="17" fontWeight="600">Na</text>
        <path d="M185 15H271V39" stroke="#bd5d32" fill="none" strokeWidth="1.5"/>
        <text x="276" y="52" textAnchor="middle" fill="#964724" fontSize="12">เวเลนซ์ 1 ตัว</text>
        <text x="171" y="228" textAnchor="middle" fill="#315e58" fontSize="13">2 · 8 · 1 — ภาพช่วยนับ</text>
      </> : variant === "water" ? <>
        <path d="M180 87 100 153M180 87 260 153" stroke="#c3a18c" strokeWidth="11" strokeLinecap="round"/>
        <circle cx="180" cy="87" r="33" fill="#b96141"/>
        <circle cx="100" cy="153" r="23" fill="white" stroke="#9baba4" strokeWidth="2"/>
        <circle cx="260" cy="153" r="23" fill="white" stroke="#9baba4" strokeWidth="2"/>
        <text x="180" y="94" textAnchor="middle" fontSize="23" fill="white">O</text>
        <text x="100" y="160" textAnchor="middle" fontSize="20" fill="#33594f">H</text>
        <text x="260" y="160" textAnchor="middle" fontSize="20" fill="#33594f">H</text>
        <text x="180" y="35" textAnchor="middle" fontSize="18" fill="#944d30">δ−</text>
        <text x="69" y="191" textAnchor="middle" fontSize="18" fill="#315e58">δ+</text>
        <text x="291" y="191" textAnchor="middle" fontSize="18" fill="#315e58">δ+</text>
        <path d="M112 116 141 91 128 92M141 91 139 104M248 116 219 91 232 92M219 91 221 104" stroke="#17665c" strokeWidth="2.5" fill="none"/>
        <text x="180" y="224" textAnchor="middle" fill="#315e58" fontSize="13">ขั้วพันธะไม่หักล้างกัน → มีขั้ว</text>
      </> : <>
        <rect x="35" y="49" width="118" height="140" rx="7" fill="#e8f2f0" stroke="#97b9b1" strokeWidth="2"/>
        <rect x="207" y="119" width="118" height="70" rx="7" fill="#e8f2f0" stroke="#97b9b1" strokeWidth="2"/>
        <path d="M204 111H328" stroke="#5d837a" strokeWidth="8"/>
        {[0,1,2,3,4,5].map(i => <g key={i}>
          <circle cx={61 + (i % 3) * 33} cy={86 + Math.floor(i / 3) * 63} r="6" fill="#277a70"/>
          <circle cx={233 + (i % 3) * 33} cy={139 + Math.floor(i / 3) * 28} r="6" fill="#277a70"/>
        </g>)}
        <path d="M166 145H190L183 138M190 145 183 152" stroke="#a86839" strokeWidth="2.5" fill="none"/>
        <text x="94" y="30" textAnchor="middle" fill="#315e58" fontSize="14">V · P</text>
        <text x="266" y="88" textAnchor="middle" fill="#315e58" fontSize="14">½V · 2P</text>
        <text x="180" y="221" textAnchor="middle" fill="#315e58" fontSize="13">จำนวนอนุภาคและอุณหภูมิคงที่</text>
      </>}
    </svg>
  );
}
