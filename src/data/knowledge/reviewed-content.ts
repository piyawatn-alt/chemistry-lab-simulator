import type { Article, ContentSection } from "./index";
/** Targeted additions found during the whole-catalog consistency review.
 * References identify the relevant textbook sections; they are not live-link attestations. */
const sections: Record<string, ContentSection[]> = {
  "electrons-periodic-table": [
    {
      title: "ข้อยกเว้นในการจัดอิเล็กตรอนและแนวโน้มธาตุ",
      text: "ลำดับเติมออร์บิทัลอย่างง่ายเป็นแนวทาง ไม่ใช่กฎไร้ข้อยกเว้น เช่น Cr สถานะพื้นเขียน [Ar] 3d⁵ 4s¹ และ Cu เขียน [Ar] 3d¹⁰ 4s¹ เมื่อเกิดไอออนแทรนซิชันมักนำอิเล็กตรอนชั้น ns ออกก่อน (n−1)d ส่วนพลังงานไอออไนเซชันไม่ได้เพิ่มเรียบทุกช่อง เช่น B ต่ำกว่า Be และ O ต่ำกว่า N",
      highlights: ["ไม่ใช่กฎไร้ข้อยกเว้น"],
    },
  ],
  "chemical-bonding": [
    {
      title: "เกณฑ์พื้นฐานของพันธะไฮโดรเจน",
      text: "ในตัวอย่างพื้นฐาน มักพิจารณา H ที่ต่อกับ N, O หรือ F เป็นผู้ให้พันธะไฮโดรเจน และอะตอมที่มีคู่อิเล็กตรอนเหมาะสมเป็นผู้รับ การมี N หรือ O ไม่รับประกันว่าเป็นตัวรับ เช่น N ของเอไมด์ต่างจาก N ของเอมีน ต้องดูเรโซแนนซ์และประจุด้วย",
      highlights: ["ต้องดูเรโซแนนซ์และประจุด้วย"],
      note: "นี่เป็นเกณฑ์พื้นฐานสำหรับสารที่ใช้ในคลังนี้ ไม่ใช่นิยามที่ตัดข้อยกเว้นทุกระบบในเคมีขั้นสูง",
    },
  ],
  "mole-stoichiometry": [
    {
      title: "สูตรเอมพิริคัลและสูตรโมเลกุล",
      text: "สูตรเอมพิริคัลให้อัตราส่วนจำนวนอะตอมอย่างต่ำ สูตรโมเลกุลให้จำนวนจริงในหนึ่งโมเลกุล ต้องหารมวลแต่ละธาตุด้วยมวลโมลาร์ก่อนหาอัตราส่วน และต้องทราบมวลโมลาร์ของสารเพื่อเปลี่ยนสูตรเอมพิริคัลเป็นสูตรโมเลกุล",
      highlights: ["อัตราส่วนจำนวนอะตอมอย่างต่ำ"],
      example: {
        title: "สารมีสูตรเอมพิริคัล CH₂O และมวลโมลาร์ 180 g/mol",
        steps: [
          "มวลของหน่วย CH₂O โดยใช้ C=12, H=1, O=16 คือ 30 g/mol",
          "ตัวคูณ = 180 / 30 = 6",
          "คูณเลขห้อยทุกธาตุด้วย 6",
        ],
        result:
          "สูตรโมเลกุล C₆H₁₂O₆ ไม่ใช้สูตรเอมพิริคัลอย่างเดียวเพื่อยืนยันชนิดหรือการเชื่อมต่อของสาร",
      },
    },
  ],
  "concentration-is-a-ratio": [
    {
      title: "โมแลลิตี ร้อยละ และส่วนในล้านส่วน",
      text: "โมแลลิตีใช้โมลตัวละลายต่อกิโลกรัมตัวทำละลาย ต่างจากโมลาริตีที่ใช้ลิตรสารละลาย ร้อยละโดยมวลใช้มวลตัวละลายหารมวลสารละลายทั้งหมด ส่วน ppm ต้องบอกฐานการเทียบ ไม่เท่ากับ mg/L ทุกกรณี",
      highlights: ["กิโลกรัมตัวทำละลาย", "ไม่เท่ากับ mg/L ทุกกรณี"],
      table: {
        headers: ["หน่วย", "นิยาม / เงื่อนไข"],
        rows: [
          ["mol/kg (โมแลลิตี)", "โมลตัวละลายต่อ kg ตัวทำละลาย"],
          ["% โดยมวล", "มวลตัวละลาย / มวลสารละลาย × 100"],
          ["% มวลต่อปริมาตร", "กรัมตัวละลายต่อสารละลาย 100 mL"],
          ["ppm โดยมวล", "มวลตัวละลาย / มวลสารละลาย × 10⁶; เท่ากับ mg/kg"],
          [
            "mg/L ≈ ppm โดยมวล",
            "ใช้ประมาณได้เมื่อความหนาแน่นสารละลายใกล้ 1.00 kg/L",
          ],
        ],
      },
      note: "mol/L เปลี่ยนตามการเปลี่ยนปริมาตรเมื่ออุณหภูมิเปลี่ยน ส่วนโมแลลิตีซึ่งอิงมวลไม่เปลี่ยนด้วยผลการขยายตัวของปริมาตรเพียงอย่างเดียว",
    },
  ],
  "states-ideal-gas": [
    {
      title: "เงื่อนไขมาตรฐานและหน่วยความดัน",
      text: "คำว่า STP ต้องระบุค่าที่ใช้ เพราะ 0 °C กับ 1 atm ให้ปริมาตรโมลาร์แก๊สอุดมคติประมาณ 22.414 L/mol ส่วน 0 °C กับ 1 bar ให้ประมาณ 22.711 L/mol โดย 1 atm = 101325 Pa และ 1 bar = 100000 Pa ไม่ใช้ตัวเลข 22.4 โดยไม่ตรวจเงื่อนไข",
      highlights: ["ต้องระบุค่าที่ใช้"],
      note: "ค่า R มีหลายรูปหน่วย เช่น 8.314462618 J·mol⁻¹·K⁻¹ หรือประมาณ 0.082057 L·atm·mol⁻¹·K⁻¹ ต้องเลือกให้ตรงกับ P และ V",
    },
  ],
  "reaction-rates": [
    {
      title: "พลังงานปฏิกิริยากับพลังงานก่อกัมมันต์",
      text: "การสลายพันธะต้องรับพลังงาน ส่วนการสร้างพันธะปล่อยพลังงาน ประมาณเอนทัลปีปฏิกิริยาจากผลรวมพลังงานพันธะที่สลายลบผลรวมพลังงานพันธะที่สร้างได้ โดยใช้ข้อมูลพลังงานพันธะเฉลี่ยอย่างเหมาะสม ค่าพลังงานก่อกัมมันต์เป็นอุปสรรคของเส้นทาง ไม่ใช่ค่าเดียวกับความร้อนของปฏิกิริยา",
      highlights: ["ไม่ใช่ค่าเดียวกับความร้อนของปฏิกิริยา"],
      bullets: [
        "ΔH < 0 หมายถึงคายความร้อน; ΔH > 0 หมายถึงดูดความร้อน ภายใต้การระบุระบบและเงื่อนไข",
        "ตัวเร่งเปลี่ยนเส้นทางและอัตรา แต่ไม่เปลี่ยน ΔH หรือ K ของปฏิกิริยารวมที่อุณหภูมิเดิม",
        "ปฏิกิริยาคายความร้อนไม่จำเป็นต้องเกิดเร็ว เพราะอาจมีอุปสรรคพลังงานสูง",
      ],
    },
  ],
  "chemical-equilibrium": [
    {
      title: "สมดุลการละลายและการเกิดตะกอน",
      text: "สำหรับ AgCl(s) ⇌ Ag⁺(aq) + Cl⁻(aq) นิพจน์พื้นฐาน Ksp ≈ [Ag⁺][Cl⁻] ไม่นำ AgCl ของแข็งมาเป็นตัวแปรความเข้มข้น เปรียบเทียบผลคูณไอออน Qsp กับ Ksp: เมื่อ Qsp > Ksp มีแนวโน้มตกตะกอนจนสมดุล ถ้า Qsp < Ksp สารละลายยังไม่อิ่มตัวต่อ AgCl",
      highlights: ["Qsp > Ksp"],
      note: "ตะกอนไม่ได้แปลว่าละลายเป็นศูนย์ การทดลองจำลองในเว็บใช้สารกำหนดปริมาณและละเลย AgCl ที่ละลายเล็กน้อย จึงไม่ใช่เครื่องคำนวณสมดุลการละลายเต็มรูปแบบ",
    },
    {
      title: "ความสัมพันธ์ Kp และ Kc ของแก๊ส",
      text: "สำหรับแก๊สอุดมคติในรูปแบบการคำนวณพื้นฐาน Kp เท่ากับ Kc คูณ (RT) ยกกำลัง Δn โดย Δn คือผลรวมสัมประสิทธิ์แก๊สด้านผลิตภัณฑ์ลบด้านสารตั้งต้น ใช้ T หน่วยเคลวิน และนิยามหน่วยของ Kp, Kc และ R ให้สอดคล้องกัน",
      highlights: ["สัมประสิทธิ์แก๊ส"],
      note: "ค่าคงที่สมดุลเชิงอุณหพลศาสตร์นิยามด้วยแอกทิวิตีเทียบสถานะมาตรฐาน จึงไม่มีหน่วย สูตรความเข้มข้นหรือความดันพื้นฐานต้องระบุข้อตกลงที่ใช้",
    },
  ],
  "acids-bases-ph": [
    {
      title: "Kw คู่กรด–เบส และเกลือในน้ำ",
      text: "ที่ประมาณ 25 °C ใช้ Kw ≈ 1.0 × 10⁻¹⁴ และ pH + pOH ≈ 14.00 ในการประมาณพื้นฐาน สำหรับคู่กรด–เบสเดียวกัน Ka × Kb = Kw น้ำเป็นกลางเมื่อ [H₃O⁺] = [OH⁻] จึงมี pH = pKw/2 ซึ่งไม่จำเป็นต้องเป็น 7 ที่ทุกอุณหภูมิ",
      highlights: ["ไม่จำเป็นต้องเป็น 7 ที่ทุกอุณหภูมิ"],
      table: {
        headers: ["เกลือตัวอย่าง", "แนวโน้มในน้ำ"],
        rows: [
          ["NaCl", "ใกล้กลางในแบบจำลองเจือจาง; เกิดจากกรดแก่–เบสแก่"],
          ["CH₃COONa", "CH₃COO⁻ รับโปรตอนจากน้ำได้ จึงมีแนวโน้มเป็นเบส"],
          ["NH₄Cl", "NH₄⁺ ให้โปรตอนแก่น้ำได้ จึงมีแนวโน้มเป็นกรด"],
        ],
      },
      note: "เกลือไม่ได้เป็นกลางทุกชนิด และ pH อาจอยู่นอกช่วง 0–14 ในสารละลายบางระบบ ช่วงดังกล่าวเป็นช่วงคุ้นเคย ไม่ใช่ขอบเขตตายตัว",
    },
  ],
  "strong-acid-base-titration": [
    {
      title: "สัมประสิทธิ์กับกรดหลายโปรตอน",
      text: "สมการ cₐVₐ = cᵦVᵦ ใช้ตรง ๆ เฉพาะกรณีอัตราส่วนโมล 1:1 เมื่อไทเทรต H₂SO₄ ให้สะเทินครบสองโปรตอนด้วย NaOH ต้องใช้ H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O จึงมี n(NaOH) = 2n(H₂SO₄) ต้องแยกการดุลปริมาณสัมพันธ์ออกจากการคำนวณ pH ของแต่ละขั้น",
      highlights: ["เฉพาะกรณีอัตราส่วนโมล 1:1"],
      note: "NaOH เป็นเบสที่ให้ OH⁻ หนึ่งโมลต่อหนึ่งโมล NaOH การหาอัตราส่วนโมลต้องยึดสมการที่ดุลแล้ว",
    },
  ],
  "hydrocarbons-nomenclature": [
    {
      title: "ไอโซเมอร์เรขาคณิตและวงอะโรมาติก",
      text: "พันธะคู่ C=C หมุนได้ยากเมื่อเทียบกับพันธะเดี่ยวทั่วไป ถ้าคาร์บอนทั้งสองด้านของ C=C ต่างต่อกับหมู่แทนที่สองชนิดที่ไม่เหมือนกัน อาจมีไอโซเมอร์ E/Z เช่น but-2-ene ซึ่งในกรณีนี้อธิบาย cis/trans ได้ เอทีนไม่มีไอโซเมอร์ชนิดนี้ เพราะคาร์บอนแต่ละด้านต่อ H เหมือนกันสองตัว",
      highlights: ["ไม่เหมือนกัน"],
      note: "เบนซีนเป็นอะโรมาติกที่มีอิเล็กตรอน π กระจายบนวง ไม่จำแนกเป็นไซโคลแอลคีนทั่วไปจากรูปพันธะสลับอย่างเดียว",
    },
  ],
  "redox-galvanic-cells": [
    {
      title: "หลักพื้นฐานของเลขออกซิเดชัน",
      text: "ธาตุอิสระมีเลขออกซิเดชัน 0 ไอออนอะตอมเดี่ยวมีค่าเท่าประจุ ผลรวมเลขออกซิเดชันเท่ากับประจุรวมของอนุภาค F ในสารประกอบทั่วไปเป็น −1, O มักเป็น −2 แต่ในเปอร์ออกไซด์เป็น −1 และ H มักเป็น +1 แต่ในไฮไดรด์โลหะเป็น −1 จึงต้องตรวจชนิดสารก่อนใช้กฎอย่างย่อ",
      highlights: ["ผลรวมเลขออกซิเดชันเท่ากับประจุรวม"],
      example: {
        title: "เลขออกซิเดชันของ S ใน SO₄²⁻",
        steps: [
          "กำหนด O แต่ละตัวเป็น −2 ในซัลเฟต",
          "ให้ x เป็นเลขออกซิเดชันของ S: x + 4(−2) = −2",
          "ได้ x = +6",
        ],
        result:
          "S มีเลขออกซิเดชัน +6 ซึ่งไม่ใช่การบอกว่า S มีประจุจริง +6 ภายในไอออน",
      },
    },
  ],
  "polymers-around-us": [
    {
      title: "เทอร์มอพลาสติก เทอร์มอเซต และข้อจำกัดการรีไซเคิล",
      text: "เทอร์มอพลาสติกโดยทั่วไปอ่อนตัวหรือหลอมเมื่อให้ความร้อนและขึ้นรูปซ้ำได้ภายใต้เงื่อนไขเหมาะสม ส่วนเทอร์มอเซตที่บ่มแล้วมีโครงข่ายเชื่อมขวางถาวร ไม่หลอมขึ้นรูปซ้ำแบบเดียวกัน แต่เสื่อมสลายเมื่อร้อนมาก รหัสชนิดเรซินไม่รับประกันว่าวัสดุชิ้นนั้นจะรีไซเคิลได้ในทุกพื้นที่",
      highlights: ["ไม่รับประกันว่าวัสดุชิ้นนั้นจะรีไซเคิลได้"],
      note: "พอลิเมอร์จากชีวมวล พอลิเมอร์ย่อยสลายได้ และวัสดุที่ทำปุ๋ยหมักได้เป็นคนละข้ออ้าง ต้องมีข้อมูลชนิดวัสดุ มาตรฐาน และเงื่อนไขรองรับ",
    },
  ],
};
const chapters: Record<string, string[]> = {
  "small-groups-big-difference": [
    "20-2-alcohols-and-ethers",
    "20-3-aldehydes-ketones-carboxylic-acids-and-esters",
    "20-4-amines-and-amides",
  ],
  "why-water-dissolves": [
    "10-1-intermolecular-forces",
    "11-1-the-dissolution-process",
  ],
  "aspirin-two-groups": ["20-3-aldehydes-ketones-carboxylic-acids-and-esters"],
  "concentration-is-a-ratio": [
    "3-3-molarity",
    "3-4-other-units-for-solution-concentrations",
  ],
  "why-reactions-slow-down": ["12-4-integrated-rate-laws"],
  "paracetamol-chemistry": ["20-4-amines-and-amides"],
  "polymers-around-us": ["20-5-polymers"],
  "carboxyl-vs-alcohol": [
    "20-2-alcohols-and-ethers",
    "20-3-aldehydes-ketones-carboxylic-acids-and-esters",
  ],
  "chemical-models": [
    "1-1-chemistry-in-context",
    "1-5-measurement-uncertainty-accuracy-and-precision",
  ],
  "atomic-structure": ["2-3-atomic-structure-and-symbolism"],
  "electrons-periodic-table": [
    "6-4-electronic-structure-of-atoms-electron-configurations",
    "6-5-periodic-variations-in-element-properties",
  ],
  "chemical-bonding": [
    "7-3-lewis-symbols-and-structures",
    "7-6-molecular-structure-and-polarity",
    "10-1-intermolecular-forces",
  ],
  "mole-stoichiometry": [
    "3-2-determining-empirical-and-molecular-formulas",
    "4-3-reaction-stoichiometry",
    "4-4-reaction-yields",
  ],
  "states-ideal-gas": [
    "9-2-relating-pressure-volume-amount-and-temperature-the-ideal-gas-law",
    "9-6-non-ideal-gas-behavior",
  ],
  "reaction-rates": [
    "12-3-rate-laws",
    "12-5-collision-theory",
    "12-7-catalysis",
    "5-3-enthalpy",
  ],
  "chemical-equilibrium": [
    "13-2-equilibrium-constants",
    "13-3-shifting-equilibria-le-chateliers-principle",
    "15-1-precipitation-and-dissolution",
  ],
  "acids-bases-ph": [
    "14-2-ph-and-poh",
    "14-3-relative-strengths-of-acids-and-bases",
    "14-4-hydrolysis-of-salts",
    "14-6-buffers",
  ],
  "strong-acid-base-titration": ["14-7-acid-base-titrations"],
  "hydrocarbons-nomenclature": ["20-1-hydrocarbons"],
  "esterification-equilibrium": [
    "20-3-aldehydes-ketones-carboxylic-acids-and-esters",
    "13-4-equilibrium-calculations",
  ],
  "redox-galvanic-cells": [
    "17-1-review-of-redox-chemistry",
    "17-2-galvanic-cells",
    "17-3-electrode-and-cell-potentials",
  ],
  "electrolysis-faraday": ["17-7-electrolysis"],
  "experimental-data": ["1-5-measurement-uncertainty-accuracy-and-precision"],
  "chemical-safety": [],
};
export function addReviewedCoverage(articles: Article[]) {
  for (const article of articles) {
    for (const section of sections[article.id] ?? []) {
      if (
        !article.sections.some((existing) => existing.title === section.title)
      )
        article.sections.push(section);
    }
    for (const chapter of chapters[article.id] ?? []) {
      const url = `https://openstax.org/books/chemistry-2e/pages/${chapter}`;
      if (!article.sources.some((s) => s.url === url))
        article.sources.push({
          name: `OpenStax · Chemistry 2e · ${chapter.split("-").slice(0, 2).join(".")}`,
          url,
        });
    }
  }
}
