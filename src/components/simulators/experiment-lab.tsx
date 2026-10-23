"use client";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookmarkPlus,
  Lightbulb,
  SlidersHorizontal,
} from "lucide-react";
import { experiments, type ExperimentId } from "@/data/experiments";
import {
  neutralization,
  electrolyte,
  precipitate,
  gasVolume,
  temperatureRate,
  reactantAt,
  diffusionFraction,
  type Electrolyte,
} from "@/lib/chemistry/experiments";

const defaults: Record<ExperimentId, number> = {
  neutralization: 20,
  diffusion: 25,
  conductivity: 0.1,
  precipitation: 20,
  "gas-pressure": 2,
  "temperature-rate": 25,
};
const particleIds = Array.from({ length: 48 }, (_, i) => i);
function phColor(ph: number) {
  return ph < 3
    ? "#f27681"
    : ph < 6
      ? "#efb961"
      : ph < 8
        ? "#7fce9c"
        : ph < 11
          ? "#62bdd7"
          : "#b28be4";
}
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="experiment-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
function Range({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (n: number) => void;
}) {
  return (
    <label className="experiment-range">
      <span>
        {label}
        <output>
          {value.toLocaleString("en-US", { maximumFractionDigits: 3 })} {unit}
        </output>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <small>
        {min} {unit}
        <span>
          {max} {unit}
        </span>
      </small>
    </label>
  );
}
function Vessel({
  color,
  level = 100,
  children,
}: {
  color: string;
  level?: number;
  children?: ReactNode;
}) {
  const y = 292 - level;
  return (
    <>
      <path
        d={`M184 ${y} H416 V292 Q416 310 398 310 H202 Q184 310 184 292Z`}
        fill={color}
        opacity=".38"
      />
      <path
        d="M180 118V292Q180 314 202 314H398Q420 314 420 292V118"
        fill="none"
        stroke="#9cbac6"
        strokeWidth="3"
      />
      <path d="M173 118h17M410 118h17" stroke="#9cbac6" strokeWidth="3" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M400 ${155 + i * 38}h13`} stroke="#b6cdd4" />
      ))}
      {children}
    </>
  );
}

function ExperimentScene({
  id,
  value,
  option,
  progress,
  running,
}: {
  id: ExperimentId;
  value: number;
  option: string;
  progress: number;
  running: boolean;
}) {
  const acid = neutralization(value * progress);
  const salt = electrolyte(
    id === "conductivity" ? value : 0.1,
    (id === "conductivity" ? option : "salt") as Electrolyte,
  );
  const solid = precipitate(value * progress, option === "chloride");
  const spread = diffusionFraction(value, progress * 60);
  const volume =
    gasVolume(1) +
    (gasVolume(id === "gas-pressure" ? value : 1) - gasVolume(1)) * progress;
  const gasHeight = (178 * volume) / gasVolume(0.5);
  const pistonY = 310 - gasHeight;
  const concentration = reactantAt(value, progress * 60);
  const converted = 1 - concentration / 0.1;
  const glow = progress > 0 ? salt.index / 200 : 0;
  return (
    <svg
      viewBox="0 0 600 380"
      className="experiment-scene"
      role="img"
      aria-label={experiments.find((e) => e.id === id)!.title + " ภาพจำลอง"}
      data-running={running}
    >
      <defs>
        <radialGradient id="lab-light">
          <stop stopColor="#e8c66f" stopOpacity={Math.min(1, glow * 2)} />
          <stop offset="1" stopColor="#e8c66f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M45 330H555" stroke="#465c70" />
      <ellipse cx="300" cy="331" rx="150" ry="9" fill="#091623" />
      {id === "neutralization" && (
        <>
          <Vessel
            color={phColor(acid.ph)}
            level={80 + value * progress * 1.7}
          />
          <path
            d="M290 26H310V102L300 126L290 102Z"
            fill="#acd6e2"
            opacity=".6"
          />
          <path d="M285 25H315M290 75H310" stroke="#c9e0e4" strokeWidth="3" />
          {running &&
            [0, 1, 2].map((i) => (
              <circle
                className="experiment-drop"
                key={i}
                cx="300"
                cy={128 + i * 21}
                r="4"
                fill="#d7f0ed"
                style={{ animationDelay: `${i * 0.25}s` }}
              />
            ))}
          <text x="350" y="65">
            NaOH 0.100 mol/L
          </text>
          <text x="300" y="360" textAnchor="middle">
            HCl เริ่มต้น 20.0 mL · สีแทนสเกล pH
          </text>
          <text
            x="300"
            y="245"
            textAnchor="middle"
            className="experiment-svg-large"
          >
            pH {acid.ph.toFixed(2)}
          </text>
        </>
      )}
      {id === "diffusion" && (
        <>
          <Vessel color="#65a7be" level={150} />
          {particleIds.map((i) => {
            const angle = i * 2.39996;
            const radius = Math.sqrt((i + 0.5) / 48);
            const x = 300 + Math.cos(angle) * radius * (10 + 100 * spread);
            const y = 220 + Math.sin(angle) * radius * (8 + 68 * spread);
            return (
              <circle
                key={i}
                cx={Number(x.toFixed(3))}
                cy={Number(y.toFixed(3))}
                r="4"
                fill="#99b7ff"
                className="experiment-jitter"
                style={{
                  animationDelay: `-${i * 0.13}s`,
                  animationDuration: `${2.4 - (i % 4) * 0.3}s`,
                }}
              />
            );
          })}
          <text x="300" y="80" textAnchor="middle">
            ตัวถูกละลาย 48 อนุภาค · น้ำ {value} °C
          </text>
          <text x="300" y="360" textAnchor="middle">
            จุดสีแทนตัวถูกละลาย · ไม่แสดงโมเลกุลน้ำ
          </text>
        </>
      )}
      {id === "conductivity" && (
        <>
          <Vessel color="#77b5c4" level={130} />
          <path
            d="M230 230V80H270M370 230V80H330"
            fill="none"
            stroke="#d3d9bb"
            strokeWidth="5"
          />
          <circle cx="300" cy="79" r="70" fill="url(#lab-light)" />
          <circle
            cx="300"
            cy="79"
            r="28"
            fill={glow > 0 ? "#f7db83" : "#4a5d69"}
            fillOpacity={glow > 0 ? Math.max(0.2, glow) : 1}
            stroke="#e4ddbd"
            strokeWidth="2"
          />
          <path
            d="M287 80l8 8 10-17 8 10"
            fill="none"
            stroke="#f6e8b8"
            strokeWidth="2"
          />
          <text x="155" y="100" textAnchor="middle">
            ~
          </text>
          {particleIds.slice(0, 24).map((i) => {
            const ionCount =
              salt.alpha > 0 ? Math.max(2, 2 * Math.round(12 * salt.alpha)) : 0;
            const ion = i < ionCount;
            return (
              <g
                key={i}
                className={progress > 0 ? "experiment-jitter" : ""}
                style={{ animationDelay: `-${i * 0.2}s` }}
              >
                <circle
                  cx={205 + (i % 6) * 37}
                  cy={202 + Math.floor(i / 6) * 27}
                  r={ion ? 10 : 6}
                  fill={ion ? (i % 2 ? "#8fc9fc" : "#f1ad8a") : "#d9e8df"}
                  opacity={ion ? 0.9 : 0.6}
                />
                {ion && (
                  <text
                    x={205 + (i % 6) * 37}
                    y={207 + Math.floor(i / 6) * 27}
                    textAnchor="middle"
                    className="experiment-ion-label"
                  >
                    {i % 2 ? "−" : "+"}
                  </text>
                )}
              </g>
            );
          })}
          <text x="300" y="360" textAnchor="middle">
            {option === "sugar"
              ? "โมเลกุลน้ำตาลไม่แตกตัวเป็นไอออน"
              : option === "acid"
                ? "กรดอ่อนแตกตัวบางส่วน · ไอออนมีจำนวนน้อย"
                : "ไอออนบวกและลบเคลื่อนที่ได้"}
          </text>
        </>
      )}
      {id === "precipitation" && (
        <>
          <Vessel color="#91c1cf" level={95 + value * progress * 1.4} />
          <g className={running ? "experiment-pouring" : ""}>
            <path
              d="M314 34L365 47L350 100L326 111L301 87Z"
              fill="#8eb6c6"
              opacity=".5"
            />
            <path d="M315 33L366 46" stroke="#cce7ec" strokeWidth="3" />
          </g>
          {running && (
            <path
              d="M325 112Q300 136 300 185"
              stroke="#b6e2e4"
              strokeWidth="5"
              strokeDasharray="6 8"
              className="experiment-stream"
            />
          )}
          {particleIds
            .slice(0, Math.round((solid.solidMmol / 2) * 48))
            .map((i) => (
              <circle
                key={i}
                cx={199 + (i % 12) * 18}
                cy={300 - Math.floor(i / 12) * 7}
                r="4"
                fill="#eff5ee"
              />
            ))}
          {particleIds.slice(0, 12).map((i) => (
            <circle
              key={i}
              cx={207 + (i % 6) * 36}
              cy={213 + Math.floor(i / 6) * 40}
              r="3"
              fill="#a6c0e0"
              opacity=".5"
            />
          ))}
          <text x="400" y="64" textAnchor="middle">
            {option === "chloride" ? "NaCl" : "KNO₃"}
          </text>
          <text x="300" y="360" textAnchor="middle">
            {solid.solidMmol > 0
              ? "ตะกอนสีขาว AgCl สะสมที่ก้นบีกเกอร์"
              : "AgNO₃ เริ่มต้น · ยังไม่มีตะกอน"}
          </text>
        </>
      )}
      {id === "gas-pressure" && (
        <>
          <path
            d={`M190 ${pistonY}H410V307H190Z`}
            fill="#86c6b3"
            opacity=".15"
          />
          <path
            d="M187 70V312H413V70"
            stroke="#a8c6cd"
            strokeWidth="4"
            fill="none"
          />
          <path
            d={`M300 ${pistonY - 12}V30M250 30H350`}
            stroke="#adc1c5"
            strokeWidth="12"
          />
          <rect
            x="187"
            y={pistonY - 12}
            width="226"
            height="15"
            rx="3"
            fill="#cad5d4"
          />
          {particleIds.slice(0, 24).map((i) => (
            <circle
              key={i}
              cx={207 + (i % 6) * 37}
              cy={
                pistonY +
                12 +
                ((Math.floor(i / 6) + 0.5) * (gasHeight - 24)) / 4
              }
              r="4"
              fill="#b4d7a0"
              className="experiment-jitter"
              style={{ animationDelay: `-${i * 0.23}s` }}
            />
          ))}
          <text x="472" y="110" textAnchor="middle">
            แรงกด ↓
          </text>
          <text x="300" y="360" textAnchor="middle">
            อุณหภูมิคงที่ 25 °C · จำนวนโมลคงที่
          </text>
        </>
      )}
      {id === "temperature-rate" && (
        <>
          <Vessel color="#91b2c8" level={155} />
          {particleIds.map((i) => (
            <circle
              key={i}
              cx={204 + (i % 8) * 27}
              cy={172 + Math.floor(i / 8) * 23}
              r="7"
              fill={i < Math.round(converted * 48) ? "#e7b877" : "#8ebbec"}
              className="experiment-jitter"
              style={{
                animationDelay: `-${i * 0.14}s`,
                animationDuration: `${3 - (value - 15) / 30}s`,
              }}
            />
          ))}
          <text x="300" y="80" textAnchor="middle">
            A → B · อุณหภูมิ {value} °C
          </text>
          <circle cx="205" cy="359" r="5" fill="#8ebbec" />
          <text x="220" y="364">
            A สารตั้งต้น
          </text>
          <circle cx="352" cy="359" r="5" fill="#e7b877" />
          <text x="367" y="364">
            B ผลิตภัณฑ์
          </text>
        </>
      )}
    </svg>
  );
}

export function ExperimentLab({ id }: { id: ExperimentId }) {
  const experiment = experiments.find((e) => e.id === id)!;
  const [value, setValue] = useState(defaults[id]);
  const [option, setOption] = useState(
    id === "precipitation" ? "chloride" : "salt",
  );
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [records, setRecords] = useState<{ label: string; result: string }[]>(
    [],
  );
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const duration =
    id === "conductivity"
      ? 4000
      : id === "temperature-rate" || id === "diffusion"
        ? 12000
        : 6000;
  useEffect(() => {
    if (!running) return;
    let previous = performance.now();
    const timer = setInterval(() => {
      const now = performance.now();
      const elapsed = now - previous;
      previous = now;
      setProgress((p) => Math.min(1, p + Math.min(elapsed, 250) / duration));
    }, 50);
    return () => clearInterval(timer);
  }, [running, duration]);
  useEffect(() => {
    if (progress >= 1) setRunning(false);
  }, [progress]);
  function change(next: number) {
    setRunning(false);
    setProgress(0);
    setValue(next);
  }
  function choose(next: string) {
    setRunning(false);
    setProgress(0);
    setOption(next);
  }
  function reset() {
    setRunning(false);
    setProgress(0);
    setValue(defaults[id]);
    setOption(id === "precipitation" ? "chloride" : "salt");
    setRecords([]);
  }
  const acid = neutralization(value * progress);
  const ions = electrolyte(
    id === "conductivity" ? value : 0.1,
    (id === "conductivity" ? option : "salt") as Electrolyte,
  );
  const solid = precipitate(value * progress, option === "chloride");
  const volume =
    gasVolume(1) +
    (gasVolume(id === "gas-pressure" ? value : 1) - gasVolume(1)) * progress;
  const pressure = gasVolume(1) / volume;
  const concentration = reactantAt(value, progress * 60);
  const result =
    id === "neutralization"
      ? `pH ${acid.ph.toFixed(2)}`
      : id === "diffusion"
        ? `48 อนุภาค · ${value} °C`
        : id === "conductivity"
          ? `ดัชนีไอออน ${ions.index.toFixed(2)}`
          : id === "precipitation"
            ? `AgCl ${solid.massGrams.toFixed(3)} g`
            : id === "gas-pressure"
              ? `V ${volume.toFixed(3)} L`
              : `[A] ${concentration.toFixed(4)} mol/L`;
  const selection =
    id === "conductivity"
      ? `${option === "salt" ? "NaCl" : option === "acid" ? "CH₃COOH" : "น้ำตาล"} · ${value} mol/L`
      : id === "precipitation"
        ? `${option === "chloride" ? "NaCl" : "KNO₃"} · ${value} mL`
        : id === "neutralization"
          ? `NaOH ${value} mL`
          : id === "gas-pressure"
            ? `${value.toFixed(1)} atm`
            : `${value} °C`;
  const observation =
    id === "neutralization"
      ? acid.acidMmol > 1e-8
        ? "กรดยังเหลืออยู่ สีอยู่ฝั่งกรด"
        : acid.baseMmol > 1e-8
          ? "เบสเหลือหลังทำปฏิกิริยา สีอยู่ฝั่งเบส"
          : "ถึงจุดสมมูล กรดและเบสใช้หมดพอดีกัน"
      : id === "conductivity"
        ? option === "salt"
          ? "เกลือแตกตัวเป็นไอออน จึงมีพาหะประจุจำนวนมาก"
          : option === "acid"
            ? "กรดอ่อนแตกตัวเพียงบางส่วน ไอออนมีน้อยกว่าเกลือที่ความเข้มข้นเดียวกัน"
            : "น้ำตาลละลายเป็นโมเลกุล ไม่เพิ่มพาหะประจุในแบบจำลองนี้"
        : id === "precipitation"
          ? solid.solidMmol === 0
            ? "ไม่มีตะกอนปรากฏ ลองเทียบกับการเติม NaCl"
            : solid.silverMmol < 1e-8
              ? "Ag⁺ ถูกใช้หมด ตะกอนถึงขีดจำกัดของ AgNO₃ เริ่มต้น"
              : "Ag⁺ รวมกับ Cl⁻ เกิดของแข็ง AgCl ที่ก้นภาชนะ"
          : id === "gas-pressure"
            ? pressure > 1.001
              ? "แรงดันสูงขึ้น ปริมาตรลดลง โดยอนุภาคไม่หายไป"
              : pressure < 0.999
                ? "แรงดันลดลง แก๊สขยายตัว โดยจำนวนอนุภาคคงเดิม"
                : "เริ่มจากความดัน 1 atm ลองเปลี่ยนแรงดันเป้าหมาย"
            : id === "temperature-rate"
              ? `${value > 25 ? "ร้อนกว่า" : value < 25 ? "เย็นกว่า" : "เท่ากับ"}สภาวะอ้างอิง 25 °C อัตราการลดลงของ A ขึ้นกับ k และปริมาณ A ที่ยังเหลือ`
              : "กลุ่มอนุภาคกระจายตัวออก แต่จำนวนยังเท่าเดิม อุณหภูมิสูงขึ้นทำให้กระจายเร็วขึ้นในภาพจำลองนี้";
  return (
    <section
      className="experiment-lab"
      style={{ "--experiment-accent": experiment.color } as CSSProperties}
    >
      <Link className="experiment-back" href="/tools/experiments">
        <ArrowLeft size={16} /> การทดลองทั้งหมด
      </Link>
      <header className="experiment-lab-heading">
        <span className="journal-kicker">
          VIRTUAL LAB · {experiment.grade} · {experiment.category}
        </span>
        <h1>{experiment.title}</h1>
        <p>{experiment.short}</p>
      </header>
      <div className="experiment-workbench">
        <aside className="experiment-controls">
          <h2>
            <SlidersHorizontal size={18} /> ปรับตัวแปร
          </h2>
          {id === "neutralization" && (
            <>
              <p>
                เริ่มด้วย HCl 0.100 mol/L ปริมาตร 20.0 mL เลือกปริมาตร NaOH
                ที่จะเติม
              </p>
              <Range
                label="NaOH ที่ต้องการเติม"
                value={value}
                min={0}
                max={40}
                unit="mL"
                onChange={change}
              />
              <div className="experiment-presets">
                {[10, 20, 30].map((v) => (
                  <button
                    key={v}
                    onClick={() => change(v)}
                    aria-pressed={value === v}
                  >
                    {v} mL
                  </button>
                ))}
              </div>
              <small>ความเข้มข้น NaOH 0.100 mol/L</small>
            </>
          )}
          {id === "diffusion" && (
            <>
              <p>หยดตัวถูกละลายจำนวนเท่ากัน เปลี่ยนเฉพาะอุณหภูมิของน้ำ</p>
              <Range
                label="อุณหภูมิน้ำ"
                value={value}
                min={15}
                max={55}
                step={5}
                unit="°C"
                onChange={change}
              />
              <div className="experiment-presets">
                {[15, 25, 55].map((v) => (
                  <button
                    key={v}
                    onClick={() => change(v)}
                    aria-pressed={value === v}
                  >
                    {v} °C
                  </button>
                ))}
              </div>
            </>
          )}
          {id === "conductivity" && (
            <>
              <label className="experiment-select">
                สารตัวอย่าง
                <select value={option} onChange={(e) => choose(e.target.value)}>
                  <option value="salt">NaCl · เกลือแกง</option>
                  <option value="acid">CH₃COOH · กรดแอซีติก</option>
                  <option value="sugar">ซูโครส · น้ำตาล</option>
                </select>
              </label>
              <Range
                label="ความเข้มข้นเริ่มต้น"
                value={value}
                min={0.01}
                max={0.2}
                step={0.01}
                unit="mol/L"
                onChange={change}
              />
              <p>
                จุดสีส้มและฟ้าแทนไอออน จุดสีอ่อนแทนโมเลกุล
                จำนวนจุดเป็นภาพแทนชนิดอนุภาค ไม่ใช่สัดส่วนจริง ดัชนีอ้างอิง NaCl
                0.100 mol/L = 100
              </p>
            </>
          )}
          {id === "precipitation" && (
            <>
              <p>บีกเกอร์มี AgNO₃ 0.100 mol/L ปริมาตร 20.0 mL</p>
              <label className="experiment-select">
                สารที่จะเติม
                <select value={option} onChange={(e) => choose(e.target.value)}>
                  <option value="chloride">NaCl · ให้ไอออน Cl⁻</option>
                  <option value="nitrate">KNO₃ · ไม่มี Cl⁻</option>
                </select>
              </label>
              <Range
                label="ปริมาตรที่ต้องการเติม"
                value={value}
                min={5}
                max={40}
                step={5}
                unit="mL"
                onChange={change}
              />
              <small>สารที่เติมมีความเข้มข้น 0.100 mol/L</small>
            </>
          )}
          {id === "gas-pressure" && (
            <>
              <p>
                แก๊ส 0.0500 mol ที่ 25 °C เริ่มต้นที่ 1 atm
                เปลี่ยนแรงดันแล้วดูลูกสูบ
              </p>
              <Range
                label="ความดันเป้าหมาย"
                value={value}
                min={0.5}
                max={3}
                step={0.1}
                unit="atm"
                onChange={change}
              />
              <div className="experiment-presets">
                {[1, 2, 3].map((v) => (
                  <button
                    key={v}
                    onClick={() => change(v)}
                    aria-pressed={value === v}
                  >
                    {v} atm
                  </button>
                ))}
              </div>
            </>
          )}
          {id === "temperature-rate" && (
            <>
              <p>
                ใช้ A เริ่มต้น 0.100 mol/L เท่ากันทุกครั้ง ปรับเฉพาะอุณหภูมิ
              </p>
              <Range
                label="อุณหภูมิของปฏิกิริยา"
                value={value}
                min={15}
                max={55}
                step={5}
                unit="°C"
                onChange={change}
              />
              <div className="experiment-presets">
                {[15, 25, 55].map((v) => (
                  <button
                    key={v}
                    onClick={() => change(v)}
                    aria-pressed={value === v}
                  >
                    {v} °C
                  </button>
                ))}
              </div>
              <small>ใช้เวลาจำลอง 0–60 วินาที</small>
            </>
          )}
          <div className="experiment-control-tip">
            <Lightbulb size={17} />
            <span>
              เปลี่ยนตัวแปรแล้วกดเริ่มอีกครั้ง
              เพื่อเปรียบเทียบภายใต้เงื่อนไขใหม่
            </span>
          </div>
        </aside>
        <div className="experiment-stage-panel">
          <div className="experiment-stage-top">
            <span>ภาพการทดลองจำลอง</span>
            <span className="experiment-state" role="status">
              {running
                ? "กำลังทดลอง"
                : progress >= 1
                  ? "เสร็จแล้ว"
                  : progress > 0
                    ? "หยุดชั่วคราว"
                    : "พร้อมทดลอง"}
            </span>
          </div>
          <ExperimentScene
            id={id}
            value={value}
            option={option}
            progress={progress}
            running={running}
          />
          <div className="experiment-playback">
            <div className="experiment-play-buttons">
              <button
                className="journal-button"
                onClick={() => {
                  if (running) {
                    setRunning(false);
                    return;
                  }
                  if (reduced) {
                    setProgress(1);
                    setRunning(false);
                    return;
                  }
                  if (progress >= 1) setProgress(0);
                  setRunning(true);
                }}
              >
                {running ? <Pause size={17} /> : <Play size={17} />}{" "}
                {running
                  ? "หยุดชั่วคราว"
                  : progress >= 1
                    ? "ทดลองซ้ำ"
                    : progress > 0
                      ? "เล่นต่อ"
                      : "เริ่มทดลอง"}
              </button>
              <button className="experiment-reset" onClick={reset}>
                <RotateCcw size={17} /> เริ่มใหม่
              </button>
            </div>
            <progress
              max={1}
              value={progress}
              aria-label="ความคืบหน้าการทดลอง"
            />
            <p>
              {reduced
                ? "โหมดลดการเคลื่อนไหว: กดเริ่มเพื่อแสดงผลทันที"
                : "ภาพแสดงแบบเร่งเวลา · กดหยุดเพื่อสังเกตรายละเอียดได้"}
            </p>
          </div>
        </div>
      </div>
      <section className="experiment-results" aria-label="ผลการทดลอง">
        <div className="experiment-results-top">
          <h2>สังเกตผล</h2>
          <button
            onClick={() =>
              setRecords((old) => [
                ...old.slice(-3),
                { label: selection, result },
              ])
            }
            disabled={
              progress < 1 || records.some((r) => r.label === selection)
            }
          >
            <BookmarkPlus size={16} /> บันทึกผลเปรียบเทียบ
          </button>
        </div>
        <div className="experiment-metrics">
          <Metric label="เงื่อนไขที่เลือก" value={selection} />
          <Metric
            label={progress === 0 ? "ค่าเริ่มต้น / เงื่อนไข" : "ผลขณะนี้"}
            value={result}
          />
          {id === "neutralization" && (
            <Metric
              label="ปริมาณที่เติมแล้ว"
              value={`${(value * progress).toFixed(1)} mL`}
            />
          )}
          {id === "conductivity" && (
            <Metric
              label="สัดส่วนแตกตัวเป็นไอออน"
              value={`${(ions.alpha * 100).toFixed(2)} %`}
            />
          )}
          {id === "precipitation" && (
            <Metric
              label="Ag⁺ ที่เหลือในสารละลาย"
              value={`${solid.silverMmol.toFixed(2)} mmol`}
            />
          )}
          {id === "gas-pressure" && (
            <Metric
              label="ความดันขณะนี้"
              value={`${pressure.toFixed(2)} atm`}
            />
          )}
          {id === "temperature-rate" && (
            <>
              <Metric
                label="เวลาปฏิกิริยาจำลอง"
                value={`${(progress * 60).toFixed(1)} s`}
              />
              <Metric
                label="ค่าคงที่อัตรา k"
                value={`${temperatureRate(value).toFixed(4)} s⁻¹`}
              />
            </>
          )}
          {id === "diffusion" && (
            <Metric label="จำนวนอนุภาคตลอดการทดลอง" value="48 อนุภาค" />
          )}
        </div>
        <p className="experiment-observation">
          <Lightbulb size={19} />
          {progress > 0
            ? observation
            : "เลือกเงื่อนไขแล้วกดเริ่มทดลอง ดูภาพและค่าที่เปลี่ยนไปพร้อมกัน"}
        </p>
        {id === "neutralization" && (
          <div className="experiment-ph-scale">
            <div
              style={{
                background:
                  "linear-gradient(90deg,#f27681,#efb961,#7fce9c,#62bdd7,#b28be4)",
              }}
            >
              <i style={{ left: `${((acid.ph / 14) * 100).toFixed(3)}%` }} />
            </div>
            <span>
              กรด · pH 0<b>กลาง · 7</b>เบส · 14
            </span>
          </div>
        )}
        {id === "temperature-rate" && (
          <div className="experiment-chart">
            <svg
              viewBox="0 0 600 220"
              role="img"
              aria-label="กราฟความเข้มข้น A ตามเวลา เปรียบเทียบอุณหภูมิที่เลือกกับ 25 องศา"
            >
              <path d="M60 15V175H570" stroke="#9cae9b" fill="none" />
              {[0, 0.05, 0.1].map((c) => (
                <g key={c}>
                  <path
                    d={`M60 ${175 - (c / 0.1) * 145}H570`}
                    stroke="#dce4d7"
                    strokeDasharray="3 4"
                  />
                  <text x="48" y={179 - (c / 0.1) * 145} textAnchor="end">
                    {c.toFixed(2)}
                  </text>
                </g>
              ))}
              {[25, value].map((temp, index) => (
                <path
                  key={index}
                  d={Array.from(
                    { length: 61 },
                    (_, s) =>
                      `${s === 0 ? "M" : "L"}${(60 + (s / 60) * 510).toFixed(3)} ${(175 - (reactantAt(temp, s) / 0.1) * 145).toFixed(3)}`,
                  ).join(" ")}
                  fill="none"
                  stroke={index ? "#bd724b" : "#7e9a81"}
                  strokeWidth="3"
                  strokeDasharray={index ? undefined : "6 5"}
                />
              ))}
              <circle
                cx={60 + progress * 510}
                cy={175 - (concentration / 0.1) * 145}
                r="5"
                fill="#bd724b"
              />
              {[0, 20, 40, 60].map((t) => (
                <text
                  key={t}
                  x={60 + (t / 60) * 510}
                  y="195"
                  textAnchor="middle"
                >
                  {t}
                </text>
              ))}
              <text x="310" y="217" textAnchor="middle">
                เวลา (s)
              </text>
            </svg>
            <p>
              แกนตั้ง [A] (mol/L) · <span>━ {value} °C</span> · ┄ อ้างอิง 25 °C
            </p>
          </div>
        )}
        {records.length > 0 && (
          <div className="experiment-records" aria-label="ผลที่บันทึกไว้">
            <h3>ผลในหน้านี้ · สูงสุด 4 เงื่อนไขล่าสุด</h3>
            <div>
              {records.map((r, i) => (
                <div key={i}>
                  <span>{r.label}</span>
                  <strong>{r.result}</strong>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      <div className="experiment-reading">
        <section>
          <span className="journal-kicker">เข้าใจสิ่งที่เกิดขึ้น</span>
          <h2>หลักการที่อยู่เบื้องหลัง</h2>
          <p>
            <mark>{experiment.principle}</mark>
          </p>
          <div className="experiment-equation">{experiment.equation}</div>
          <div className="experiment-try">
            <Lightbulb size={20} />
            <div>
              <strong>ลองเปลี่ยนแล้วสังเกต</strong>
              <p>{experiment.challenge}</p>
            </div>
          </div>
        </section>
        <aside>
          <h3>เงื่อนไขของแบบจำลอง</h3>
          <p>{experiment.limit}</p>
          <a href={experiment.source} target="_blank" rel="noreferrer">
            อ่านหลักการเพิ่มเติม · OpenStax ↗
          </a>
          <p className="experiment-safety">
            กิจกรรมนี้เป็นการทดลองเสมือน
            สารบางชนิดและอุปกรณ์จริงต้องใช้ภายใต้การดูแลในห้องปฏิบัติการ
          </p>
        </aside>
      </div>
      <div className="tool-related">
        <span>เนื้อหาที่เกี่ยวข้อง</span>
        <Link href={`/read/${experiment.article}`}>
          อ่านคำอธิบายและภาพประกอบ <ArrowRight size={17} />
        </Link>
      </div>
      <nav className="experiment-next" aria-label="การทดลองอื่น">
        <h2>ลองการทดลองอื่นต่อ</h2>
        <div>
          {experiments
            .filter((e) => e.id !== id)
            .map((e) => (
              <Link key={e.id} href={`/tools/${e.id}`}>
                {e.title}
                <ArrowUpRight size={16} />
              </Link>
            ))}
          <Link href="/tools/flame-test">
            ทดลองสีเปลวไฟ
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </nav>
    </section>
  );
}
