"use client";
import { useState } from "react";
import { Sparkles, RotateCcw, Lightbulb } from "lucide-react";
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
import { MoleculeDiagram } from "./molecule-diagram";
import { groups } from "@/data/molecules/groups";
import { firstOrder } from "@/lib/chemistry/models";
export function Explorer() {
  const [index, setIndex] = useState(0);
  const [reset, setReset] = useState(0);
  const g = groups[index];
  function select(i: number) {
    setIndex(i);
  }
  return (
    <div className="explorer">
      <div className="explorer-intro">
        <span className="step-number">01</span>
        <div>
          <h3>เห็นอะตอม เข้าใจพันธะ แล้วลองหาหมู่ฟังก์ชัน</h3>
          <p>
            เลือกตัวอย่างด้านล่าง แล้วสำรวจภาพทีละขั้น
            แตะอะตอมหรือพันธะเพื่อดูคำอธิบาย
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
        <MoleculeDiagram
          key={`${g.id}-${reset}`}
          groupId={g.id}
          name={g.name}
          example={g.example}
        />
        <div className="explorer-details">
          <span className="pill">{g.english}</span>
          <h3>{g.name}</h3>
          <details className="formula-disclosure">
            <summary>เทียบกับสูตรโครงสร้างแบบย่อ</summary>
            <code>{g.structure}</code>
            <p>สูตรทั่วไป: {g.formula} โดย R และ R′ แทนหมู่ไฮโดรคาร์บอน</p>
          </details>
          <p>{g.description}</p>
          <div className="callout">
            <Sparkles size={18} />
            <div>
              <strong>Chemistry to Pharmacy</strong>
              <p>{g.connection}</p>
            </div>
          </div>
          <div className="actions">
            <Button
              variant="outline"
              onClick={() => {
                setIndex(0);
                setReset((n) => n + 1);
              }}
            >
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
        ปรับค่าความเข้มข้นเริ่มต้นและค่าคงที่อัตรา
        เพื่อเปรียบเทียบเส้นกราฟและครึ่งชีวิต
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
          เมื่อเพิ่ม [A]₀ เป็นสองเท่าโดย k คงที่ ครึ่งชีวิตไม่เปลี่ยน
          ส่วนการเพิ่ม k เป็นสองเท่าทำให้ครึ่งชีวิตลดลงครึ่งหนึ่ง ตามสมการ t½ =
          ln(2)/k
        </p>
      </div>
    </div>
  );
}
