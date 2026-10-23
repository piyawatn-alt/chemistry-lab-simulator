const fs = require("node:fs");
const assert = require("node:assert/strict");
const init = require("@rdkit/rdkit");
// Explicit representations of the structures discussed in the existing PubChem references.
// RDKit validates connectivity and generates explanatory 2D layouts, never 3D geometry.
const definitions = [
  {
    id: "aspirin",
    smiles: "CC(=O)Oc1ccccc1C(=O)O",
    formula: { C: 9, H: 8, O: 4 },
    pubchem: "https://pubchem.ncbi.nlm.nih.gov/compound/2244",
    groups: [
      {
        name: "เอสเทอร์",
        highlightAtomCount: 3,
        smarts: "[CX3](=[OX1])[OX2][#6]",
        color: [1, 0.83, 0.64],
      },
      {
        name: "คาร์บอกซิล",
        smarts: "[CX3](=[OX1])[OX2H]",
        color: [0.7, 0.89, 0.76],
      },
    ],
  },
  {
    id: "paracetamol",
    smiles: "CC(=O)Nc1ccc(O)cc1",
    formula: { C: 8, H: 9, N: 1, O: 2 },
    pubchem: "https://pubchem.ncbi.nlm.nih.gov/compound/1983",
    groups: [
      { name: "เอไมด์", smarts: "[CX3](=[OX1])[NX3]", color: [1, 0.83, 0.64] },
      { name: "ฟีนอล", smarts: "[c][OX2H]", color: [0.7, 0.89, 0.76] },
    ],
  },
];
(async () => {
  const rd = await init();
  const meta = [];
  fs.mkdirSync("public/diagrams", { recursive: true });
  for (const d of definitions) {
    const mol = rd.get_mol(d.smiles);
    assert.ok(mol?.is_valid(), d.id);
    const data = JSON.parse(mol.get_json());
    const counts = {};
    for (const a of data.molecules[0].atoms) {
      const symbol = { 1: "H", 6: "C", 7: "N", 8: "O" }[
        a.z ?? data.defaults.atom.z
      ];
      assert.ok(symbol);
      counts[symbol] = (counts[symbol] || 0) + 1;
      counts.H = (counts.H || 0) + (a.impHs ?? data.defaults.atom.impHs);
    }
    assert.deepEqual(counts, d.formula);
    const atoms = [],
      bonds = [],
      highlightAtomColors = {},
      highlightBondColors = {},
      groups = [];
    for (const g of d.groups) {
      const q = rd.get_qmol(g.smarts);
      const matches = JSON.parse(mol.get_substruct_matches(q));
      q.delete();
      assert.equal(matches.length, 1, `${d.id}: ${g.name}`);
      const match = matches[0];
      if (g.highlightAtomCount) {
        match.atoms = match.atoms.slice(0, g.highlightAtomCount);
        match.bonds = match.bonds.filter((i) =>
          data.molecules[0].bonds[i].atoms.every((a) =>
            match.atoms.includes(a),
          ),
        );
      }
      for (const a of match.atoms) {
        atoms.push(a);
        highlightAtomColors[a] = g.color;
      }
      for (const b of match.bonds) {
        bonds.push(b);
        highlightBondColors[b] = g.color;
      }
      groups.push({ name: g.name, atoms: match.atoms, bonds: match.bonds });
    }
    const atomLabels = {};
    for (const [i, a] of data.molecules[0].atoms.entries()) {
      const element = { 6: "C", 7: "N", 8: "O" }[a.z ?? 6];
      const h = a.impHs ?? 0;
      atomLabels[i] = element + (h ? "H" + (h > 1 ? h : "") : "");
    }
    mol.set_new_coords();
    const svg = mol.get_svg_with_highlights(
      JSON.stringify({
        width: 760,
        height: 400,
        atoms: [...new Set(atoms)],
        bonds: [...new Set(bonds)],
        highlightAtomColors,
        highlightBondColors,
        highlightRadius: 0.35,
        explicitMethyl: true,
        atomLabels,
        backgroundColour: [1, 1, 1, 1],
        bondLineWidth: 2.5,
      }),
    );
    assert.ok(svg.includes("<svg"));
    fs.writeFileSync(`public/diagrams/${d.id}.svg`, svg);
    meta.push({
      id: d.id,
      smiles: mol.get_smiles(),
      formula: counts,
      source: d.pubchem,
      rdkit: rd.version(),
      groups,
      layout: "2D explanatory coordinates",
    });
    mol.delete();
  }
  fs.writeFileSync(
    "public/diagrams/molecules.json",
    JSON.stringify(meta, null, 2) + "\n",
  );
  console.log(
    "Generated 2 chemically validated 2D structure images, matched functional groups, and checked formulas.",
  );
})();
