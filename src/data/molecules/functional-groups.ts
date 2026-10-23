/** Curated 2D connectivity diagrams. Coordinates are layout positions, not 3D
 * coordinates, bond lengths, or bond angles. All hydrogens are explicit in data. */
export type Element = "C" | "H" | "O" | "N";
export type DiagramAtom = {
  id: string;
  element: Element;
  x: number;
  y: number;
  group?: boolean;
};
export type DiagramBond = { from: string; to: string; order: 1 | 2 };
export type MoleculeDiagram = {
  atoms: DiagramAtom[];
  bonds: DiagramBond[];
  formula: string;
  clue: string;
  explanation: string;
};
function molecule(
  heavy: DiagramAtom[],
  bonds: DiagramBond[],
  hydrogens: [string, number, number, boolean?][],
  rest: Omit<MoleculeDiagram, "atoms" | "bonds">,
): MoleculeDiagram {
  const atoms = [...heavy];
  const allBonds = [...bonds];
  hydrogens.forEach(([parent, x, y, group], i) => {
    const id = `h${i + 1}`;
    atoms.push({ id, element: "H", x, y, group });
    allBonds.push({ from: parent, to: id, order: 1 });
  });
  return { atoms, bonds: allBonds, ...rest };
}
export const diagrams: Record<string, MoleculeDiagram> = {
  alcohol: molecule(
    [
      { id: "c1", element: "C", x: 180, y: 235 },
      { id: "c2", element: "C", x: 340, y: 235 },
      { id: "o1", element: "O", x: 500, y: 235, group: true },
    ],
    [
      { from: "c1", to: "c2", order: 1 },
      { from: "c2", to: "o1", order: 1 },
    ],
    [
      ["c1", 100, 145],
      ["c1", 75, 265],
      ["c1", 180, 355],
      ["c2", 340, 110],
      ["c2", 340, 355],
      ["o1", 625, 235, true],
    ],
    {
      formula: "C₂H₆O",
      clue: "มองหา O ที่ต่อกับ H และต่อกับคาร์บอนด้วยพันธะเดี่ยว",
      explanation:
        "O และ H ที่ต่อกันเป็นหมู่ไฮดรอกซิล (–OH) ในเอทานอล โดย O ต่อกับคาร์บอนอิ่มตัวอีกด้าน",
    },
  ),
  acid: molecule(
    [
      { id: "c1", element: "C", x: 175, y: 250 },
      { id: "c2", element: "C", x: 340, y: 250, group: true },
      { id: "o1", element: "O", x: 340, y: 100, group: true },
      { id: "o2", element: "O", x: 505, y: 250, group: true },
    ],
    [
      { from: "c1", to: "c2", order: 1 },
      { from: "c2", to: "o1", order: 2 },
      { from: "c2", to: "o2", order: 1 },
    ],
    [
      ["c1", 90, 155],
      ["c1", 65, 280],
      ["c1", 175, 370],
      ["o2", 630, 250, true],
    ],
    {
      formula: "C₂H₄O₂",
      clue: "หา C ที่ต่อกับ O สองตัว: หนึ่งพันธะคู่ และอีกตัวเป็น O–H",
      explanation:
        "C=O และ O–H ที่ต่อกับคาร์บอนเดียวกัน รวมกันเป็นหมู่คาร์บอกซิล (–COOH) ไม่ใช่หมู่แอลกอฮอล์แยกต่างหาก",
    },
  ),
  ester: molecule(
    [
      { id: "c1", element: "C", x: 100, y: 245 },
      { id: "c2", element: "C", x: 245, y: 245, group: true },
      { id: "o1", element: "O", x: 245, y: 90, group: true },
      { id: "o2", element: "O", x: 390, y: 245, group: true },
      { id: "c3", element: "C", x: 520, y: 200 },
      { id: "c4", element: "C", x: 650, y: 260 },
    ],
    [
      { from: "c1", to: "c2", order: 1 },
      { from: "c2", to: "o1", order: 2 },
      { from: "c2", to: "o2", order: 1 },
      { from: "o2", to: "c3", order: 1 },
      { from: "c3", to: "c4", order: 1 },
    ],
    [
      ["c1", 45, 145],
      ["c1", 35, 300],
      ["c1", 100, 365],
      ["c3", 485, 85],
      ["c3", 550, 90],
      ["c4", 685, 150],
      ["c4", 710, 320],
      ["c4", 620, 375],
    ],
    {
      formula: "C₄H₈O₂",
      clue: "หา C=O ที่ต่อกับ O แล้ว O ตัวนั้นต่อกับ C อีกด้าน แทนที่จะเป็น H",
      explanation:
        "ส่วน C(=O)–O เป็นหมู่เอสเทอร์ ออกซิเจนที่พันธะเดี่ยวต่อกับคาร์บอนอีกด้าน จึงต่างจากกรดคาร์บอกซิลิก",
    },
  ),
  amide: molecule(
    [
      { id: "c1", element: "C", x: 175, y: 250 },
      { id: "c2", element: "C", x: 340, y: 250, group: true },
      { id: "o1", element: "O", x: 340, y: 95, group: true },
      { id: "n1", element: "N", x: 505, y: 250, group: true },
    ],
    [
      { from: "c1", to: "c2", order: 1 },
      { from: "c2", to: "o1", order: 2 },
      { from: "c2", to: "n1", order: 1 },
    ],
    [
      ["c1", 90, 155],
      ["c1", 65, 280],
      ["c1", 175, 370],
      ["n1", 610, 165, true],
      ["n1", 610, 335, true],
    ],
    {
      formula: "C₂H₅NO",
      clue: "มองหา N ที่ต่อกับ C ของ C=O โดยตรง",
      explanation:
        "เมื่อ N ต่อกับคาร์บอนิลโดยตรง จะเกิดหมู่เอไมด์ ตัวอย่างนี้เป็น –CONH₂ ซึ่งต่างจากหมู่เอมีนที่ไม่มีการเชื่อมต่อแบบนี้",
    },
  ),
};
export const elementNames: Record<Element, string> = {
  C: "คาร์บอน",
  H: "ไฮโดรเจน",
  O: "ออกซิเจน",
  N: "ไนโตรเจน",
};
