const fs = require("node:fs");
const assert = require("node:assert/strict");
const init = require("@rdkit/rdkit");
const catalog = require("../src/data/molecules/functional-group-catalog.json");
const curated = new Set(["alcohol", "acid", "ester", "amide"]);
const symbols = { 1: "H", 6: "C", 7: "N", 8: "O", 16: "S", 17: "Cl" };
(async () => {
  const rd = await init();
  const generated = {};
  const metadata = [];
  for (const group of catalog) {
    const base = rd.get_mol(group.smiles);
    assert.ok(base?.is_valid(), group.id);
    const mol = rd.get_mol(base.add_hs());
    assert.ok(mol?.is_valid());
    const query = rd.get_qmol(group.smarts);
    const matches = JSON.parse(mol.get_substruct_matches(query));
    query.delete();
    assert.ok(matches.length > 0, group.id + " functional pattern");
    const highlighted = new Set(matches[0].atoms);
    // Ether/ketone/haloalkane patterns include neighboring carbon context. Highlight the identifying atoms only.
    if (group.id === "ether")
      for (const i of [...highlighted]) if (i !== 1) highlighted.delete(i);
    if (group.id === "haloalkane") highlighted.delete(1);
    if (group.id === "aldehyde") highlighted.delete(0);
    if (group.id === "ketone") {
      highlighted.delete(0);
      highlighted.delete(3);
    }
    mol.set_new_coords();
    mol.convert_to_kekule_form();
    const json = JSON.parse(mol.get_json()),
      data = json.molecules[0],
      counts = {},
      ids = {},
      serial = {};
    for (const atom of data.atoms) {
      const symbol = symbols[atom.z ?? json.defaults.atom.z];
      assert.ok(symbol);
      counts[symbol] = (counts[symbol] || 0) + 1;
      assert.equal(atom.impHs ?? json.defaults.atom.impHs, 0, "all H explicit");
    }
    const expected = {};
    for (const m of group.molecularFormula.matchAll(/([A-Z][a-z]?)(\d*)/g))
      expected[m[1]] = Number(m[2] || 1);
    assert.deepEqual(counts, expected, group.id + " formula");
    // Include diagnostic O–H, N–H, S–H and aldehyde C–H, not hydrocarbon substituent H.
    const hydrogenBelongs = (parent) =>
      ["O", "N", "S"].includes(symbols[data.atoms[parent].z ?? 6]) ||
      group.id === "aldehyde";
    for (const bond of data.bonds) {
      const [a, b] = bond.atoms;
      if (
        symbols[data.atoms[a].z ?? 6] === "H" &&
        highlighted.has(b) &&
        hydrogenBelongs(b)
      )
        highlighted.add(a);
      if (
        symbols[data.atoms[b].z ?? 6] === "H" &&
        highlighted.has(a) &&
        hydrogenBelongs(a)
      )
        highlighted.add(b);
    }
    let coords = data.conformers[0].coords.map(([x, y]) => [x, -y]);
    const width =
      Math.max(...coords.map((c) => c[0])) -
      Math.min(...coords.map((c) => c[0]));
    const height =
      Math.max(...coords.map((c) => c[1])) -
      Math.min(...coords.map((c) => c[1]));
    if (height > width * 1.3) coords = coords.map(([x, y]) => [y, -x]);
    const xs = coords.map((c) => c[0]),
      ys = coords.map((c) => c[1]);
    const cx = (Math.max(...xs) + Math.min(...xs)) / 2,
      cy = (Math.max(...ys) + Math.min(...ys)) / 2;
    const scale = Math.min(
      95,
      570 / (Math.max(...xs) - Math.min(...xs) || 1),
      290 / (Math.max(...ys) - Math.min(...ys) || 1),
    );
    const atoms = data.atoms.map((a, i) => {
      const element = symbols[a.z ?? json.defaults.atom.z];
      const key = element.toLowerCase();
      serial[key] = (serial[key] || 0) + 1;
      const id = key + serial[key];
      ids[i] = id;
      return {
        id,
        element,
        x: Number((370 + (coords[i][0] - cx) * scale).toFixed(2)),
        y: Number((215 + (coords[i][1] - cy) * scale).toFixed(2)),
        group: highlighted.has(i),
      };
    });
    const bonds = data.bonds.map((b) => {
      const order = b.bo ?? json.defaults.bond.bo;
      assert.ok([1, 2, 3].includes(order));
      return { from: ids[b.atoms[0]], to: ids[b.atoms[1]], order };
    });
    const formatted = group.molecularFormula.replace(
      /\d/g,
      (d) => "₀₁₂₃₄₅₆₇₈₉"[Number(d)],
    );
    if (!curated.has(group.id))
      generated[group.id] = {
        atoms,
        bonds,
        formula: formatted,
        clue: group.pitfall,
        explanation: group.description,
        compact: true,
      };
    metadata.push({
      id: group.id,
      smiles: group.smiles,
      smarts: group.smarts,
      counts,
      matchedAtoms: matches[0].atoms,
      generated: !curated.has(group.id),
    });
    base.delete();
    mol.delete();
  }
  fs.writeFileSync(
    "src/data/molecules/generated-diagrams.json",
    JSON.stringify(generated, null, 2) + "\n",
  );
  fs.writeFileSync(
    "src/data/molecules/verification.json",
    JSON.stringify(
      { toolkit: "RDKit.js", version: rd.version(), structures: metadata },
      null,
      2,
    ) + "\n",
  );
  console.log(
    "Verified all " +
      catalog.length +
      " formulas and identifying substructures; generated " +
      Object.keys(generated).length +
      " additional interactive diagrams.",
  );
})();
