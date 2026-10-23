"use client";
import { useState } from "react";
import { Sparkles, Check, RotateCcw, Lightbulb } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { groups } from "@/data/curriculum";
import { firstOrder } from "@/lib/chemistry/models";
import type { ProgressStore as Store } from "@/hooks/use-progress";
export function Explorer({ store }: { store: Store }) {
  const [index, setIndex] = useState(0);
  const g = groups[index];
  const before = g.structure.slice(0, g.structure.indexOf(g.highlight));
  const after = g.structure.slice(
    g.structure.indexOf(g.highlight) + g.highlight.length,
  );
  function select(i: number) {
    setIndex(i);
    store.update((p) => ({
      ...p,
      explored: Array.from(new Set([...p.explored, groups[i].id])),
    }));
  }
  return (
    <div className="explorer">
      <div className="explorer-intro">
        <span className="step-number">01</span>
        <div>
          <h3>เลือกหมู่ฟังก์ชัน แล้วกด “บันทึกการสำรวจ”</h3>
          <p>
            สีเขียวเน้นกลุ่มอะตอมที่กำลังศึกษา สูตรแสดงการเชื่อมต่อแบบย่อ
            ไม่ใช่รูปร่างสามมิติ
          </p>
        </div>
      </div>
      <div className="tabs wrap">
        {groups.map((g, i) => (
          <button
            key={g.id}
            onClick={() => select(i)}
            aria-pressed={index === i}
            className={index === i ? "selected" : ""}
          >
            {g.name}
            <small>{g.english}</small>
          </button>
        ))}
      </div>
      <div className="explorer-body">
        <div className="structure-panel">
          <span className="tiny-label">CONDENSED STRUCTURAL FORMULA</span>
          <div className="structure-formula">
            {before}
            <mark>{g.highlight}</mark>
            {after}
          </div>
          <strong>{g.example}</strong>
          <span className="structure-caption">
            R และ R′ แทนหมู่ไฮโดรคาร์บอนในสูตรทั่วไป
          </span>
        </div>
        <div className="explorer-details">
          <span className="pill">{g.english}</span>
          <h3>{g.name}</h3>
          <code>{g.formula}</code>
          <p>{g.description}</p>
          <div className="callout">
            <Sparkles size={18} />
            <div>
              <strong>Chemistry to Pharmacy</strong>
              <p>{g.connection}</p>
            </div>
          </div>
          <div className="actions">
            <Button onClick={() => select(index)}>
              {store.progress.explored.includes(g.id) ? (
                <>
                  <Check size={16} />
                  สำรวจแล้ว
                </>
              ) : (
                "บันทึกการสำรวจ"
              )}
            </Button>
            <Button variant="outline" onClick={() => setIndex(0)}>
              <RotateCcw size={15} />
              เริ่มใหม่
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DecayExperiment() {
  const [c, setC] = useState(1);
  const [k, setK] = useState(0.05);
  const data = Array.from({ length: 31 }, (_, i) => ({
    time: i * 2,
    concentration: firstOrder(c, k, i * 2),
  }));
  return (
    <div className="panel">
      <h3>ทดลอง: ความเข้มข้นเปลี่ยนไปอย่างไร?</h3>
      <p>
        ลากตัวเลื่อนเพื่อเปรียบเทียบกราฟ คาดการณ์ก่อนว่าเมื่อเพิ่ม k
        เส้นกราฟจะชันขึ้นหรือไม่
      </p>
      <div className="slider-grid">
        <label>
          [A]₀ = {c.toFixed(1)} mol/L
          <input
            aria-label="ความเข้มข้นเริ่มต้น"
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={c}
            onChange={(e) => setC(+e.target.value)}
          />
        </label>
        <label>
          k = {k.toFixed(2)} s⁻¹
          <input
            aria-label="ค่าคงที่อัตรา"
            type="range"
            min="0.01"
            max="0.15"
            step="0.01"
            value={k}
            onChange={(e) => setK(+e.target.value)}
          />
        </label>
      </div>
      <div
        className="chart"
        role="img"
        aria-label={`กราฟความเข้มข้นที่เวลา 60 วินาที เท่ากับ ${firstOrder(c, k, 60).toFixed(3)} โมลต่อลิตร`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 15, right: 15, bottom: 25, left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="time"
              label={{
                value: "เวลา (s)",
                position: "insideBottom",
                offset: -15,
              }}
            />
            <YAxis
              domain={[0, 2]}
              label={{ value: "mol/L", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              formatter={(v) => [Number(v).toFixed(3) + " mol/L", "[A]"]}
              labelFormatter={(v) => `เวลา ${v} s`}
            />
            <Area
              type="monotone"
              dataKey="concentration"
              stroke="#0f766e"
              fill="#d8f0e8"
              strokeWidth={2}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="result-line">
        <span>
          ครึ่งชีวิต <strong>{(Math.log(2) / k).toFixed(2)} s</strong>
        </span>
        <span>
          [A] ที่ 60 s <strong>{firstOrder(c, k, 60).toFixed(3)} mol/L</strong>
        </span>
        <Button
          variant="outline"
          onClick={() => {
            setC(1);
            setK(0.05);
          }}
        >
          <RotateCcw size={15} />
          คืนค่าเริ่มต้น
        </Button>
      </div>
      <p className="data-note">
        แบบจำลองอันดับหนึ่ง: ระบบผสมสม่ำเสมอ อุณหภูมิคงที่ ไม่ย้อนกลับ
        ใช้เพื่อการศึกษาเท่านั้น
      </p>
      <div className="callout">
        <Lightbulb size={18} />
        <p>
          ลองเพิ่ม [A]₀ เป็นสองเท่า ครึ่งชีวิตเปลี่ยนหรือไม่?
          เปรียบเทียบกับการเพิ่ม k เป็นสองเท่า แล้วอธิบายด้วยสมการ
        </p>
      </div>
    </div>
  );
}
