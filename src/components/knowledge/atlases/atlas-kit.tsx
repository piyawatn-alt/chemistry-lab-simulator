"use client";
import { Children, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Expand, X, ChevronDown, AlertCircle } from "lucide-react";
import { ScientificFormula } from "@/components/ui/scientific-formula";
import "./atlas.css";

export type AtlasTone = "teal" | "blue" | "amber" | "purple" | "rose";
export function AtlasCard({ title, subtitle, formula, example, insight, caution, children, tone = "teal" }: {
  title: string; subtitle?: string; formula?: string; example?: string;
  insight: string; caution?: string; children: ReactNode; tone?: AtlasTone;
}) {
  return <article className={`visual-atlas-card atlas-tone-${tone}`}>
    <header><h3>{title}</h3>{subtitle && <span>{subtitle}</span>}</header>
    <div className="visual-atlas-drawing">{children}</div>
    <div className="visual-atlas-card-copy">
      {formula && <div className="visual-atlas-formula"><ScientificFormula text={formula} explain={false} /></div>}
      {example && <p className="visual-atlas-example"><strong>ตัวอย่าง</strong>{example}</p>}
      <p>{insight}</p>
      {caution && <aside className="visual-atlas-caution"><AlertCircle size={14} /><span>{caution}</span></aside>}
    </div>
  </article>;
}
export function AtlasSvg({ label, children, viewBox = "0 0 320 200" }: { label: string; children: ReactNode; viewBox?: string }) {
  const id = useId();
  return <svg viewBox={viewBox} role="img" aria-labelledby={`${id}-title`} className="atlas-svg"><title id={`${id}-title`}>{label}</title>{children}</svg>;
}
export function AtlasArrow({ x1, y1, x2, y2, color = "#2e7163", dashed = false }: { x1: number; y1: number; x2: number; y2: number; color?: string; dashed?: boolean }) {
  const angle = Math.atan2(y2 - y1, x2 - x1), size = 8;
  return <g stroke={color} fill="none" strokeWidth="2" strokeLinecap="round"><line x1={x1} y1={y1} x2={x2} y2={y2} strokeDasharray={dashed ? "4 4" : undefined}/><path d={`M${x2 - size * Math.cos(angle - .5)} ${y2 - size * Math.sin(angle - .5)} L${x2} ${y2} L${x2 - size * Math.cos(angle + .5)} ${y2 - size * Math.sin(angle + .5)}`}/></g>;
}
export function AtlasNode({ x, y, label, color = "#2e7163", radius = 21 }: { x: number; y: number; label: string; color?: string; radius?: number }) {
  return <g><circle cx={x} cy={y} r={radius} fill={color}/><text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fill="white" className="atlas-node-label">{label}</text></g>;
}
export function VisualAtlas({ title, intro, children, legend, note, initialCount = 2 }: {
  title: string; intro: string; children: ReactNode; legend?: string; note: string; initialCount?: number;
}) {
  const panels = Children.toArray(children);
  const [all, setAll] = useState(false);
  const [full, setFull] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const heading = useId();
  const gridId = useId();
  useEffect(() => {
    if (!full || !dialog.current) return;
    const element = dialog.current;
    element.showModal();
    return () => { opener.current?.focus(); };
  }, [full]);
  const content = (complete: boolean) => <>
    {legend && <p className="visual-atlas-legend">{legend}</p>}
    <div className="visual-atlas-grid">{complete ? panels : panels.slice(0, initialCount)}</div>
    <p className="visual-atlas-note">{note}</p>
    <p className="visual-atlas-credit">ภาพเรียบเรียงโดย ChemLab RX · อ่านคำอธิบายและแหล่งอ้างอิงประกอบท้ายบท</p>
  </>;
  return <div className="visual-atlas" data-panel-count={panels.length}>
    <header className="visual-atlas-heading"><div><span className="journal-kicker">VISUAL REFERENCE / สรุปด้วยภาพ</span><h2>{title}</h2><p>{intro}</p></div><button ref={opener} onClick={() => setFull(true)} className="atlas-expand-button"><Expand size={17}/>เปิดเต็มจอ</button></header>
    <div id={gridId} className="atlas-inline-content" data-expanded={all}>{content(all)}</div>
    {panels.length > initialCount && <button className="atlas-show-all" aria-expanded={all} aria-controls={gridId} onClick={() => setAll(value => !value)}>{all ? "ย่อแผ่นภาพ" : `ดูครบทั้ง ${panels.length} ภาพสรุป`}<ChevronDown size={17} style={{ transform: all ? "rotate(180deg)" : undefined }}/></button>}
    {full && <dialog ref={dialog} className="visual-atlas-dialog" aria-labelledby={heading} onClose={() => setFull(false)} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className="atlas-dialog-bar"><div><span>CHEMLAB RX / VISUAL REFERENCE</span><h2 id={heading}>{title}</h2></div><button autoFocus aria-label="ปิดภาพเต็มจอ" onClick={() => dialog.current?.close()}><X size={23}/></button></div>
      <div className="atlas-dialog-content"><p className="atlas-dialog-intro">{intro}</p>{content(true)}</div>
    </dialog>}
  </div>;
}
