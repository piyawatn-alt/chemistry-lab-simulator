import type { ReactNode } from "react";

const scriptCharacters: Record<string, string> = {
  "₀": "0",
  "₁": "1",
  "₂": "2",
  "₃": "3",
  "₄": "4",
  "₅": "5",
  "₆": "6",
  "₇": "7",
  "₈": "8",
  "₉": "9",
  ₐ: "a",
  ₜ: "t",
  ₙ: "n",
  ᵦ: "b",
  "⁰": "0",
  "¹": "1",
  "²": "2",
  "³": "3",
  "⁴": "4",
  "⁵": "5",
  "⁶": "6",
  "⁷": "7",
  "⁸": "8",
  "⁹": "9",
  "⁺": "+",
  "⁻": "−",
  ᵏ: "k",
  ᵗ: "t",
  ᵐ: "m",
  ⁿ: "n",
};
/** Use normal glyphs inside actual sub/sup elements, rather than tiny Unicode approximations. */
function scripts(text: string): ReactNode {
  return text
    .split(/([₀₁₂₃₄₅₆₇₈₉ₐₜₙᵦ]+|[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ᵏᵗᵐⁿ]+)/g)
    .map((part, index) => {
      const normal = Array.from(part, (c) => scriptCharacters[c] ?? c).join("");
      if (/^[₀₁₂₃₄₅₆₇₈₉ₐₜₙᵦ]+$/.test(part))
        return <sub key={index}>{normal}</sub>;
      if (/^[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ᵏᵗᵐⁿ]+$/.test(part))
        return <sup key={index}>{normal}</sup>;
      return part;
    });
}
function Fraction({ top, bottom }: { top: ReactNode; bottom: ReactNode }) {
  return (
    <span className="formula-fraction">
      <span>{top}</span>
      <span>{bottom}</span>
    </span>
  );
}
function Sub({ children, index }: { children: ReactNode; index: ReactNode }) {
  return (
    <>
      {children}
      <sub>{index}</sub>
    </>
  );
}
const fraction = (top: ReactNode, bottom: ReactNode) => (
  <Fraction top={top} bottom={bottom} />
);
const concentration = (index: string) => <Sub index={index}>[A]</Sub>;
const decay = (
  <>
    {concentration("t")} = {concentration("0")} e<sup>−kt</sup>
  </>
);

function textbookLine(text: string): ReactNode {
  switch (text) {
    case "c = n / V":
      return <>c = {fraction("n", "V")}</>;
    case "n = m / M":
      return <>n = {fraction("m", "M")}</>;
    case "t½ = ln(2) / k":
      return (
        <>
          <Sub index={fraction("1", "2")}>t</Sub> = {fraction("ln 2", "k")}
        </>
      );
    case "[A]ₜ = [A]₀ e⁻ᵏᵗ":
    case "[A] = [A]₀e⁻ᵏᵗ":
      return decay;
    case "k(T) = k₂₅ exp[−Eₐ/R (1/T − 1/298.15)]":
      return (
        <>
          k(T) = <Sub index="25">k</Sub> e
          <sup className="formula-exponent">
            −{fraction(<Sub index="a">E</Sub>, "R")} ({fraction("1", "T")} −{" "}
            {fraction("1", <Sub index="25">T</Sub>)})
          </sup>
        </>
      );
    case "ΔE = hν = hc/λ":
      return <>ΔE = hν = {fraction("hc", "λ")}</>;
    case "Kc = [HI]² / ([H₂][I₂])":
      return (
        <>
          <Sub index="c">K</Sub> ={" "}
          {fraction(scripts("[HI]²"), scripts("[H₂][I₂]"))}
        </>
      );
    case "Ka ≈ [H₃O⁺][A⁻] / [HA]":
      return (
        <>
          <Sub index="a">K</Sub> ≈ {fraction(scripts("[H₃O⁺][A⁻]"), "[HA]")}
        </>
      );
    case "K = x² / (1 − x)² = 4.0":
      return <>K = {fraction(scripts("x²"), scripts("(1 − x)²"))} = 4.0</>;
    case "ผลได้ร้อยละ = (ผลได้จริง / ผลได้ตามทฤษฎี) × 100%":
      return <>ผลได้ร้อยละ = {fraction("ผลได้จริง", "ผลได้ตามทฤษฎี")} × 100%</>;
    case "สำหรับ aA → bB: r = −(1/a)Δ[A]/Δt = (1/b)Δ[B]/Δt":
      return (
        <>
          สำหรับ aA → bB
          <br />r = −{fraction("1", "a")}
          {fraction("Δ[A]", "Δt")} = {fraction("1", "b")}
          {fraction("Δ[B]", "Δt")}
        </>
      );
    case "n(e⁻) = Q/F":
      return (
        <>
          n(e<sup>−</sup>) = {fraction("Q", "F")}
        </>
      );
    case "m = ItM/(zF)":
      return <>m = {fraction("ItM", "zF")}</>;
    case "E°cell = E°cathode − E°anode":
      return (
        <>
          E<sup>°</sup>
          <sub>cell</sub> = E<sup>°</sup>
          <sub>cathode</sub> − E<sup>°</sup>
          <sub>anode</sub>
        </>
      );
    case "ΔG = −nFEcell":
      return (
        <>
          ΔG = −nFE<sub>cell</sub>
        </>
      );
    case "pKa = −log₁₀Ka":
      return (
        <>
          pK<sub>a</sub> = −log<sub>10</sub> K<sub>a</sub>
        </>
      );
    case "pH ≈ pKa + log₁₀([A⁻]/[HA])":
      return (
        <>
          pH ≈ pK<sub>a</sub> + log<sub>10</sub> (
          {fraction(scripts("[A⁻]"), "[HA]")})
        </>
      );
    default:
      return scripts(text);
  }
}
const definitions: Record<string, string> = {
  "c = n / V":
    "c = ความเข้มข้น (mol/L), n = จำนวนโมล (mol), V = ปริมาตรสารละลาย (L)",
  "n = m / M": "n = จำนวนโมล, m = มวล (g), M = มวลโมลาร์ (g/mol)",
  "[A]ₜ = [A]₀ e⁻ᵏᵗ":
    "[A]t คือความเข้มข้นที่เวลา t, [A]0 คือความเข้มข้นเริ่มต้น, k คือค่าคงที่อัตรา, t คือเวลา และ e คือค่าคงที่ประมาณ 2.718",
  "t½ = ln(2) / k":
    "t½ คือเวลาที่สารตั้งต้นเหลือครึ่งหนึ่ง, ln 2 ≈ 0.693 และ k คือค่าคงที่อัตรา หน่วยของเวลาเป็นหน่วยผกผันกับ k",
  "k(T) = k₂₅ exp[−Eₐ/R (1/T − 1/298.15)]":
    "T คืออุณหภูมิหน่วยเคลวิน (°C + 273.15), T25 = 298.15 K, k25 คือค่าคงที่อัตราที่ 25 °C, Ea คือพลังงานก่อกัมมันต์ และ R คือค่าคงที่แก๊ส โดยใช้หน่วยพลังงานให้ตรงกัน",
  "[A] = [A]₀e⁻ᵏᵗ":
    "[A]t คือความเข้มข้นของ A ที่เวลา t, [A]0 คือความเข้มข้นเริ่มต้น, k คือค่าคงที่อัตรา และ e ≈ 2.718",
  "P₁V₁ = P₂V₂":
    "P = ความดัน, V = ปริมาตร; เลข 1 และ 2 แทนก่อนและหลังเปลี่ยนสภาวะ ใช้เมื่ออุณหภูมิและจำนวนโมลคงที่",
  "PV = nRT":
    "P = ความดัน, V = ปริมาตร, n = จำนวนโมล, R = ค่าคงที่แก๊ส และ T = อุณหภูมิหน่วยเคลวิน โดยเลือกหน่วยให้เข้ากัน",
  "ΔE = hν = hc/λ":
    "ΔE = พลังงานแสง, h = ค่าคงที่ของพลังค์, ν (นิว) = ความถี่, c = อัตราเร็วแสง และ λ (แลมบ์ดา) = ความยาวคลื่น",
  "H⁺(aq) + OH⁻(aq) → H₂O(l)":
    "H⁺ คือไฮโดรเจนไอออน, OH⁻ คือไฮดรอกไซด์ไอออน; aq หมายถึงอยู่ในสารละลายน้ำ และ l หมายถึงของเหลว",
  "Ag⁺(aq) + Cl⁻(aq) → AgCl(s)":
    "ไอออนเงินรวมกับไอออนคลอไรด์ ได้ตะกอนซิลเวอร์คลอไรด์; aq คืออยู่ในสารละลายน้ำ และ s คือของแข็ง",
};

export function ScientificFormula({
  text,
  explain = true,
}: {
  text: string;
  explain?: boolean;
}) {
  const lines = text.split(/\s+·\s+/);
  return (
    <div className="scientific-formula">
      {lines.map((line, index) => {
        const clean = line.trim();
        const definition = definitions[clean];
        return (
          <div className="formula-entry" key={index}>
            <div className="formula-typeset" role="math">
              {textbookLine(clean)}
            </div>
            {explain && definition && (
              <p className="formula-definition">{definition}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
