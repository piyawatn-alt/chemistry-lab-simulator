import { test } from "node:test";
import assert from "node:assert/strict";
import { articles } from "../../data/knowledge";
import { allRecallGuides, recallGuides } from "../../data/knowledge/recall";
import type { FormulaReference } from "../../data/knowledge/recall/types";

const formulas = new Map(allRecallGuides.flatMap(guide => guide.formulas.map(formula => [formula.id, formula] as const)));
function formula(id: string): FormulaReference {
  const found = formulas.get(id);
  assert.ok(found, `Missing reference: ${id}`);
  return found;
}
function workedText(id: string): string {
  const example = formula(id).example;
  return [example.given, ...example.steps, example.result].join(" ");
}

test("every published chapter has bounded recall aids and unique direct-link targets", () => {
  assert.deepEqual(allRecallGuides.map(guide => guide.articleId).sort(), articles.map(article => article.id).sort());
  const targets: string[] = [];
  for (const guide of allRecallGuides) {
    assert.equal(recallGuides[guide.articleId], guide);
    assert.equal(guide.thinkingSteps.length, 3);
    assert.ok(new Set(guide.thinkingSteps).size === 3);
    assert.ok(guide.coreIdea.length > 20);
    assert.ok(guide.memoryAids.length >= 2);
    for (const aid of guide.memoryAids) {
      targets.push(`memory-${aid.id}`);
      assert.match(aid.id, /^[a-z0-9-]+$/);
      for (const text of [aid.title, aid.chant, aid.meaning, aid.boundary]) assert.ok(text.trim().length > 10, aid.id);
    }
    for (const entry of guide.formulas) {
      targets.push(`formula-${entry.id}`);
      assert.match(entry.id, /^[a-z0-9-]+$/);
      assert.ok(entry.variables.length > 0, entry.id);
      for (const variable of entry.variables) assert.ok(variable.symbol.trim() && variable.meaning.trim(), entry.id);
      assert.ok(entry.useWhen.length > 15 && entry.caution.length > 15, entry.id);
      assert.ok(entry.example.given.trim() && entry.example.result.trim(), entry.id);
      assert.ok(entry.example.steps.length >= 2, entry.id);
      assert.ok(!/\\(?:frac|sqrt|begin)|\$\$/.test(entry.expression), `Raw formula markup: ${entry.id}`);
    }
  }
  assert.equal(new Set(targets).size, targets.length);
  assert.equal(recallGuides["chemical-safety"].formulas.length, 0, "Safety principles must not become invented numerical risk equations");
});

test("worked reference arithmetic agrees with independently calculated quantities", () => {
  const checks: [string, string][] = [
    ["atomic-neutrons", `${23 - 11} ตัว`],
    ["atomic-electrons", `${8 - (-2)} ตัว`],
    ["atomic-weighted-mass", `${(10 * .2 + 11 * .8).toFixed(1)} u`],
    ["concentration-molarity", `${(.05 / .25).toFixed(3)} mol/L`],
    ["concentration-dilution-formula", `${(.2 * 50 / 100).toFixed(3)} mol/L`],
    ["concentration-molality", `${(.1 / .2).toFixed(3)} mol/kg`],
    ["concentration-mass-percent", `${(5 / (5 + 95) * 100).toFixed(2)}%`],
    ["mole-mass-conversion", `${(36 / 18).toFixed(2)} mol`],
    ["mole-particle-conversion", `${(.5 * 6.02214076).toFixed(2)} × 10²³`],
    ["mole-balanced-ratio", `${(.4 * 1 / 2).toFixed(3)} mol`],
    ["mole-percent-yield", `${(8.5 / 10 * 100).toFixed(1)}%`],
    ["gas-ideal-equation", `${(.1 * .082057 * 298.15 / 1).toFixed(2)} L`],
    ["gas-combined", `${(1 * 2 * 450 / (300 * 1.5)).toFixed(2)} L`],
    ["gas-kelvin", `${(27 + 273.15).toFixed(2)} K`],
    ["average-reaction-rate", `${((.8 - .5) / 30 / 2).toFixed(4)} mol`],
    ["bond-enthalpy", `−${Math.abs(436 + 243 - 2 * 431)} kJ/mol`],
    ["first-order-concentration", `${(.1 * Math.exp(-.05 * 20)).toFixed(4)} mol/L`],
    ["first-order-half-life", `${(Math.log(2) / .05).toFixed(1)} s`],
    ["half-life-fraction", `${(100 / 2 ** 3).toFixed(1)}%`],
    ["equilibrium-hi", (0.4 ** 2 / (.2 * .2)).toFixed(1)],
    ["reaction-quotient-hi", (0.1 ** 2 / (.2 * .2)).toFixed(2)],
    ["weak-acid-square-root", (-Math.log10(Math.sqrt(1.8e-5 * .1))).toFixed(2)],
    ["buffer-henderson-hasselbalch", (4.76 + Math.log10(.2 / .1)).toFixed(2)],
    ["titration-before-equivalence", (-Math.log10((.1 * .025 - .1 * .01) / (.025 + .01))).toFixed(2)],
    ["titration-after-equivalence", (14 + Math.log10((.1 * .03 - .1 * .025) / (.025 + .03))).toFixed(2)],
    ["ester-ice-x", (2 / 3).toFixed(3)],
    ["redox-standard-cell", `${(.34 - (-.76)).toFixed(2)} V`],
    ["redox-free-energy", `−${Math.round(2 * 96485 * 1.1 / 1000)} kJ/mol`],
    ["electrolysis-electron-moles", `${(1930 / 96500).toFixed(4)} mol`],
    ["electrolysis-deposited-mass", `${(1 * 1930 * 63.5 / (2 * 96500)).toFixed(3)} g`],
    ["model-first-order-check", `${Math.exp(-.05 * 20).toFixed(3)} mol/L`],
    ["model-first-order-check", `${(.390 - Number(Math.exp(-.05 * 20).toFixed(3))).toFixed(3)} mol/L`],
    ["data-arithmetic-mean", `${((10.1 + 10.2 + 10) / 3).toFixed(1)} mL`],
  ];
  for (const [id, expected] of checks) assert.ok(workedText(id).includes(expected), `${id}: expected ${expected}`);
  // AgCl is 1:1 in pure water; an incorrect use of Ksp or a forgotten square root must fail.
  const solubility = Math.sqrt(1.8e-10);
  assert.ok(Math.abs(solubility / 1.3e-5 - 1) < .04);
  assert.ok(formula("solubility-product-agcl").example.result.includes("1.3 × 10⁻⁵"));
});

test("short chants and quantitative formulas retain their scientific boundaries", () => {
  assert.match(formula("electrons-shell-maximum").caution, /ไม่ได้บอกลำดับการเติม/);
  assert.match(formula("gas-ideal-equation").caution, /ความดันสัมบูรณ์/);
  assert.match(formula("gas-combined").caution, /K.*°C/);
  assert.match(formula("first-order-concentration").useWhen, /อันดับหนึ่ง.*k คงที่/);
  assert.match(formula("ph-poh-temperature").useWhen + formula("ph-poh-temperature").caution, /25/);
  assert.match(formula("buffer-henderson-hasselbalch").useWhen, /กรดอ่อน|บัฟเฟอร์/);
  assert.match(formula("titration-equivalence-volume").caution, /1:1|สองโมล|ทุกคู่/);
  assert.match(workedText("titration-equivalence-volume"), /25\.0 mL/);
  assert.match(formula("electrolysis-deposited-mass").useWhen, /100%/);
  assert.match(formula("redox-standard-cell").caution, /คูณ|สัมประสิทธิ์/);
  assert.match(formula("hydrocarbon-alkane").useWhen, /สายเปิด/);
  const neighbor = recallGuides["small-groups-big-difference"].memoryAids.find(aid => aid.id === "groups-carbonyl-neighbor")!;
  assert.match(neighbor.chant, /โอต่อซี/);
  assert.match(neighbor.boundary, /กรดคาร์บอกซิลิก/);
  const acid = recallGuides["carboxyl-vs-alcohol"].memoryAids.find(aid => aid.id === "alcohol-acid-oh")!;
  assert.ok(acid.chant.includes("ติดโอเอช"));
});
