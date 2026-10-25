# Chapter visual reference sheets — 25 October 2026

## Scope and provenance

Original infographic components accompany all24 currently published chemistry articles. They are a visual layer for the existing library, not a claim to complete the official ม.4–ม.6 curriculum. The supplied functional-group poster informed the comparison format; its artwork is not embedded or republished. New diagrams and text are authored as SVG/HTML. The two existing full-molecule SVGs were previously generated locally with RDKit and referenced to PubChem.

The chemical foundations are the article text, source references and prior consistency review in `content-review-2026-10-23.md`. This round includes independent source-code review of formulas, particle counts, valences, charges, naming conventions and diagram directions. It does not claim that every external textbook page was freshly opened or that the material received professional certification.

## Inventory

| Collection | Chapters | Panels | Explanations |
| --- | ---: | ---: | --- |
| Foundations | 7 | 28 | Atomic notation, isotopes, ions, weighted mass, electron configuration, periodic trends, bonding, hydration, concentration, dilution, moles, stoichiometry, gases |
| Reactions | 6 | 24 | Collision, activation energy/enthalpy, catalysts, first-order decay, half-life, equilibrium, Q/K, acids/bases, buffers, titration, esterification |
| Organic | 5 | 32 | Fifteen reference groups/structures plus alkane, naming and branching, alcohol/carboxyl comparison, resonance, actual aspirin/paracetamol structures, H-bond roles |
| Materials and scientific practice | 6 | 24 | Polymer connections, galvanic/ electrolytic circuits, Faraday, model assumptions/residuals, experimental variables, precision/accuracy, SDS and controls |
| Total | 24 | 108 | Each sheet is accessible within its related article |

## Scientific details explicitly preserved

- Na and Na⁺ have11 and10 electrons respectively; both retain11 protons. Electron shells are counting aids, not actual orbits.
- Hydration diagrams face O toward cations and H toward anions. Hydrogen bonds are distinguished from covalent O–H bonds.
- Dilution conserves solute only under stated no-loss/no-reaction assumptions. Gas equations identify fixed variables and temperature in kelvin.
- First-order decay keeps A+B conserved in the A→B illustration; half-life positions on its curve are generated from the decay relationship.
- Equilibrium keeps forward/reverse processes active; equal rates do not require equal concentrations. Catalyst effects on rate are separated from K at fixed temperature.
- The titration sheet uses the article's25.0mL HCl example, explicitly distinguished from the simulator's20.0mL initial acid. Neutrality and pH+pOH≈14 refer to25°C approximations.
- The ester equilibrium value K=4.0 is a specified hypothetical ideal example, not a universal measured constant.
- Ether naming uses alkoxy as a prefix, not a universal “-oxy” suffix. Benzene and phenyl are distinct. Alkane is a structural reference, not a special functional group.
- Amide N and amine N are not interchangeable; secondary-amide N–H is drawn explicitly for paracetamol. Molecular formulas alone do not identify atom connectivity.
- Galvanic electron flow is Zn→Cu externally; nitrate/cation movement through the salt bridge is labeled. Electrolytic electrodes share an electrolyte bath with an ionic path; anode oxidation remains distinct from electrode sign.
- Faraday calculations state electron stoichiometry and current-efficiency assumptions. Targets, residuals and measurement examples are illustrative data.
- Safety diagrams describe SDS/exposure/control principles and do not replace substance-specific information or supervised procedures.

## Integration and verification

Components live under `src/components/knowledge/atlases`. `chapter-atlas.tsx` maps existing article IDs to topic-specific renderers. The shared kit supplies consistent cards, accessible SVG titles and native full-screen dialogs. Preview expansion limits the initial reading length while keeping every panel available.

Browser checks visit all24 sheets, compare expanded and full-screen panel counts, verify named SVG/image content, Escape and focus restoration, scroll unlock, and320/390/768px layouts. A separate SVG text-bounds inspection checks labels stay inside their viewBoxes. Existing content tests continue checking original conserved particle/electron counts and literal highlights. Build/TypeScript and existing numerical/content tests remain necessary.

Final local production-build results:55 existing unit checks passed; `test:atlases` confirmed24 sheets/108 panels and all modal/mobile assertions; `test:content` and `test:smoke` passed. Independent browser geometry inspection found no SVG text outside its viewBox at390px in either expanded inline or full-screen mode. Build and TypeScript passed. These results describe the local built application, not a verified live Vercel deployment.
