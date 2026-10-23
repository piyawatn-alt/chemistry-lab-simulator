export const figureKinds = [
  "dilution",
  "gas-compression",
  "stoichiometry",
  "atom-ion",
  "electron-shells",
  "polarity",
  "solubility",
  "half-life",
  "activation",
  "equilibrium",
  "acid-dissociation",
  "titration",
  "functional-groups",
  "hydrocarbons",
  "ester-equilibrium",
  "galvanic",
  "electrolysis",
  "polymer",
  "model-process",
  "precision",
  "safety",
  "aspirin",
  "paracetamol",
] as const;
export type FigureKind = (typeof figureKinds)[number];
export type FigureSpec = {
  kind: FigureKind;
  section: string;
  title: string;
  caption: string;
};
export const contentFigures: Record<string, FigureSpec> = {
  "small-groups-big-difference": {
    kind: "functional-groups",
    section: "นิยามและการจำแนกหมู่ฟังก์ชัน",
    title: "ภาพเปรียบเทียบหมู่ฟังก์ชัน",
    caption:
      "ดูอะตอมที่อยู่ติดกับ C=O และ O–H ภาพเป็นสูตรโครงสร้าง 2 มิติแบบย่อ ไม่ใช่มุมพันธะจริง",
  },
  "why-water-dissolves": {
    kind: "solubility",
    section: "แรงระหว่างไอออนกับโมเลกุลน้ำ",
    title: "การแยกไอออนและการล้อมรอบด้วยน้ำ",
    caption:
      "ภาพเฉพาะส่วนเพื่ออธิบายการละลาย ไม่ได้แสดงไอออนหรือน้ำทั้งหมด สีและเครื่องหมายแสดงชนิดประจุ",
  },
  "aspirin-two-groups": {
    kind: "aspirin",
    section: "หมู่เอสเทอร์และหมู่คาร์บอกซิล",
    title: "โครงสร้างแอสไพรินและตำแหน่งหมู่สำคัญ",
    caption:
      "ภาพโครงสร้างแอสไพริน C₉H₈O₄ สร้างเป็นภาพ 2 มิติจากโครงสร้างที่ตรวจด้วย RDKit และตรวจสูตรกับข้อมูลอ้างอิง PubChem ไม่ใช่รูปร่างสามมิติ",
  },
  "concentration-is-a-ratio": {
    kind: "dilution",
    section: "การเจือจางสารละลาย",
    title: "ก่อนและหลังเจือจาง: โมลเท่าเดิม ปริมาตรเพิ่ม",
    caption:
      "วงกลม 6 จุดในแต่ละภาพแทนตัวละลายปริมาณเท่ากัน ไม่ใช่จำนวนอนุภาคจริง และระดับน้ำเป็นภาพแนวคิด ไม่ใช่มาตราส่วนปริมาตร",
  },
  "why-reactions-slow-down": {
    kind: "half-life",
    section: "ครึ่งชีวิตและสัดส่วนสารที่เหลือ",
    title: "สัดส่วนที่เหลือเมื่อผ่านแต่ละครึ่งชีวิต",
    caption:
      "ตัวอย่างปฏิกิริยาอันดับหนึ่งที่ k คงที่ จุดแต่ละจุดแทนปริมาณสัมพัทธ์ ไม่ใช่จำนวนโมเลกุลที่วัดจริง",
  },
  "paracetamol-chemistry": {
    kind: "paracetamol",
    section: "การระบุหมู่เอไมด์",
    title: "โครงสร้างพาราเซตามอล: เอไมด์และฟีนอล",
    caption:
      "ภาพพาราเซตามอล C₈H₉NO₂ สร้างเป็นภาพ 2 มิติจากโครงสร้างที่ตรวจด้วย RDKit และตรวจสูตรกับข้อมูลอ้างอิง PubChem ไม่ใช่ภาพเอทานาไมด์",
  },
  "polymers-around-us": {
    kind: "polymer",
    section: "มอนอเมอร์และพอลิเมอไรเซชัน",
    title: "มอนอเมอร์เชื่อมต่อเป็นสายโซ่",
    caption:
      "แสดงสมการรวมอย่างง่ายของพอลิเอทิลีน ไม่ใช่กลไกเริ่มปฏิกิริยาหรือการจัดเรียงสามมิติ",
  },
  "carboxyl-vs-alcohol": {
    kind: "functional-groups",
    section: "โครงสร้างของกรดเอทาโนอิก",
    title: "ตำแหน่งของ –OH ทำให้จำแนกกลุ่มสารต่างกัน",
    caption:
      "เปรียบเทียบเอทานอลกับกรดเอทาโนอิก ส่วน C=O ที่อยู่ติดกันเป็นจุดสังเกตสำคัญ",
  },
  "chemical-models": {
    kind: "model-process",
    section: "องค์ประกอบของแบบจำลอง",
    title: "จากข้อมูล สู่แบบจำลอง และการตรวจสอบ",
    caption:
      "ลูกศรแสดงลำดับการพิจารณา ต้องย้อนปรับสมมติฐานเมื่อผลไม่สอดคล้องกับข้อมูล ไม่ใช่ยืนยันจากกราฟเพียงจุดเดียว",
  },
  "atomic-structure": {
    kind: "atom-ion",
    section: "จำนวนอิเล็กตรอนในไอออน",
    title: "Na เปลี่ยนเป็น Na⁺ โดยเสียอิเล็กตรอน",
    caption:
      "ตัวอย่าง ²³Na ที่ Z=11 เปรียบเทียบจำนวนอนุภาคก่อนและหลัง ไม่ได้แสดงวงโคจรจริง",
  },
  "electrons-periodic-table": {
    kind: "electron-shells",
    section: "หลักการจัดเรียงอิเล็กตรอน",
    title: "การนับอิเล็กตรอนของ Na เป็น 2, 8, 1",
    caption:
      "วงแสดงการจัดกลุ่มตามระดับพลังงานหลักเพื่อช่วยนับ ไม่ใช่วงโคจรจริงหรือรูปร่างออร์บิทัล",
  },
  "chemical-bonding": {
    kind: "polarity",
    section: "รูปร่างโมเลกุลและสภาพขั้ว",
    title: "เปรียบเทียบโมเลกุลงอกับโมเลกุลสมมาตร",
    caption:
      "ภาพแนวคิดของน้ำกับ CO₂ ลูกศรชี้ทิศขั้วพันธะเข้าหา O ไม่ใช่ภาพตามมาตราส่วนจริง",
  },
  "mole-stoichiometry": {
    kind: "stoichiometry",
    section: "การดุลสมการเคมี",
    title: "นับอะตอมก่อนและหลังในสมการที่ดุลแล้ว",
    caption:
      "วงสีขาวแทน H และวงสีส้มแทน O แต่ละฝั่งมี H 4 อะตอม และ O 2 อะตอมเท่ากัน",
  },
  "states-ideal-gas": {
    kind: "gas-compression",
    section: "ความสัมพันธ์ของตัวแปรแก๊ส",
    title: "ปริมาตรและความดันของแก๊ส",
    caption:
      "เมื่อ n และ T คงที่ในแบบจำลองแก๊สอุดมคติ การลด V เหลือครึ่งหนึ่งทำให้ P เป็นสองเท่า",
  },
  "reaction-rates": {
    kind: "activation",
    section: "ตัวเร่งและสมดุลเคมี",
    title: "ตัวเร่งลดอุปสรรคพลังงาน แต่ไม่เปลี่ยนระดับต้น–ปลาย",
    caption:
      "กราฟเป็นแผนภาพพลังงานเชิงคุณภาพ แกนนอนไม่ใช่เวลา และความสูงไม่ได้เป็นค่าที่วัดของปฏิกิริยาเฉพาะ",
  },
  "chemical-equilibrium": {
    kind: "equilibrium",
    section: "สมดุลพลวัตและระบบปิด",
    title: "อัตราเท่ากัน ไม่จำเป็นต้องมีปริมาณเท่ากัน",
    caption:
      "ภาพ A ⇌ B แสดงสัดส่วนเฉลี่ยเชิงแนวคิดที่สมดุล จุดไม่ใช่ค่าความเข้มข้นจริง",
  },
  "acids-bases-ph": {
    kind: "acid-dissociation",
    section: "กรดแก่ กรดอ่อน และความเข้มข้น",
    title: "เปรียบเทียบการแตกตัวจากปริมาณกรดเริ่มต้นเท่ากัน",
    caption:
      "แสดงกรดหนึ่งโปรตอนอย่างง่าย สัดส่วนกรดอ่อนในภาพใช้สื่อแนวคิด ไม่ใช่ค่าเปอร์เซ็นต์การแตกตัวจริง",
  },
  "strong-acid-base-titration": {
    kind: "titration",
    section: "ที่สมมูลและหลังสมมูล",
    title: "HCl 25.0 mL กับ NaOH: ก่อน–พอดี–เกิน",
    caption:
      "สำหรับ HCl และ NaOH 0.100 mol/L ที่ 25°C ในแบบจำลองเจือจาง ภาพแสดงเฉพาะ H₃O⁺ หรือ OH⁻ ส่วนเกิน ไม่ได้แสดง Na⁺ และ Cl⁻",
  },
  "hydrocarbons-nomenclature": {
    kind: "hydrocarbons",
    section: "การจำแนกไฮโดรคาร์บอน",
    title: "พันธะเดี่ยว คู่ และสามในสารคาร์บอนสองอะตอม",
    caption:
      "แสดงเอเทน เอทีน และเอไทน์แบบ 2 มิติ จำนวน H เปลี่ยนตามชนิดพันธะระหว่าง C ในตัวอย่างเหล่านี้",
  },
  "esterification-equilibrium": {
    kind: "ester-equilibrium",
    section: "ตัวอย่างองค์ประกอบสมดุลแบบอุดมคติ",
    title: "ปริมาณสารก่อนปฏิกิริยากับที่สมดุล",
    caption:
      "ใช้ข้อมูลสมมติ K=4.0 ตามตัวอย่างในเนื้อหา เป็นองค์ประกอบสมดุล ไม่ใช่อัตราหรือเวลาที่ถึงสมดุล",
  },
  "redox-galvanic-cells": {
    kind: "galvanic",
    section: "องค์ประกอบของเซลล์ Zn–Cu",
    title: "อิเล็กตรอนผ่านลวด ไอออนผ่านสารละลาย",
    caption:
      "แผนผังเซลล์กัลวานิก Zn–Cu ไม่ใช่แผนการประกอบอุปกรณ์ ขั้วและทิศทางอ้างถึงปฏิกิริยานี้",
  },
  "electrolysis-faraday": {
    kind: "electrolysis",
    section: "ขั้วและแหล่งพลังงานภายนอก",
    title: "เทียบการจ่ายพลังงานกับการขับปฏิกิริยา",
    caption:
      "แสดงเซลล์ทั่วไปเชิงแนวคิด ไม่ระบุผลิตภัณฑ์จริงของระบบอิเล็กโทรไลต์ซึ่งขึ้นกับสารและเงื่อนไข",
  },
  "experimental-data": {
    kind: "precision",
    section: "การทำซ้ำ ความแม่น และความเที่ยง",
    title: "ความแม่นและความเที่ยงเป็นคนละประเด็น",
    caption:
      "จุดแทนผลวัดสมมติ ตำแหน่งกลางแทนค่าอ้างอิง ใช้อธิบายความหมาย ไม่ใช่ข้อมูลการทดลองจริง",
  },
  "chemical-safety": {
    kind: "safety",
    section: "ข้อมูลบนฉลากและเอกสาร SDS",
    title: "อ่านข้อมูลก่อนเลือกวิธีจัดการสาร",
    caption:
      "แผนภาพสรุปข้อมูลที่ต้องตรวจ ไม่ทดแทน SDS เฉพาะสารหรือคำแนะนำของผู้ควบคุมห้องปฏิบัติการ",
  },
};
