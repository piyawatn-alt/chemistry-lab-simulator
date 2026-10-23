# ChemLab RX

**Chemistry Content Library.** A Thai chemistry reference organized by ม.4, ม.5, ม.6, subject, and content heading. Readers browse the directory, open explanatory material, and use visual tools alongside it. Headings are declarative subject names rather than FAQ questions. There are no quizzes, scores, or completion requirements.

## Development

Requires Node.js 22+ and npm. No API keys, account, database, or environment variables are required.

```bash
npm ci
npm run dev
```

Run commands from the repository root (`/workspace/chemistry-lab-simulator` in the cloud). The server uses port 3000. For a restricted home directory, use `npm ci --cache /workspace/.npm-cache`.

```bash
npm test           # Scientific graphs, curated molecular connectivity, reading-list parsing
npm run typecheck  # TypeScript
npm run build      # Production build and type checks
npm start          # Serve the production build
```

## Current experience

- A content directory with three grade collections, six subject collections, global search, and grade/subject/search filters.
- Twenty-four illustrated content entries across atomic structure, periodic trends, bonding, stoichiometry, gas laws, concentrations, kinetics, equilibria, acids/bases, titration, organic chemistry, polymers, electrochemistry, and experimental methods. Course names come from the project brief; entries are selected available topics, not a claim of complete official syllabus coverage.
- Article pages with explicit yellow highlights (toggleable without removing text), key-point summaries, explanatory figures placed beside relevant paragraphs, formulas, worked examples, comparison tables, caution notes, glossaries, sources, and relevant subject/tool links.
- A personal reading shelf with persistent add/remove controls. Bookmarks are stored locally, without sign-in; malformed or unavailable storage is handled.
- Interactive 2D molecular examples: ethanol, ethanoic acid, ethyl ethanoate, and ethanamide. Readers can select atoms and bonds, highlight functional groups, show hydrogens, or try identifying the group themselves.
- An interactive first-order concentration graph with adjustable inputs, units, assumptions, half-life, and reset.
- Responsive navigation and layouts; keyboard-accessible controls, skip navigation, and self-hosted Inter/Noto Sans Thai fonts.

Drug content discusses aspirin and paracetamol and links to PubChem. The full content pages now show the actual named 2D structures, generated with RDKit from explicit SMILES, checked for validity, molecular formula, and functional-group matches. Card thumbnails still use clearly labeled simpler functional-group examples. The text does not provide dosing or clinical advice. Sources are provided for further reading, and explanatory text is authored by the project.

## Visual and scientific boundaries

Molecular diagram coordinates are **2D layout positions**, not physical coordinates, bond angles, or verified 3D geometry. Explicit atom/bond data are tested for composition, ordinary neutral valence, connectivity, and highlighted groups. These checks are not a general chemical validity proof. Condensed formulas remain available as optional reference text.

The concentration graph is an ideal irreversible, well-mixed, constant-temperature first-order model. It does not represent every reaction or a clinical dosing model. Scientific calculations stay separate from UI components.

## Browser checks

Start the app in a separate terminal, then run:

```bash
npx playwright install chromium
npm run test:smoke
npm run test:molecules
npm run test:content # All content pages and the highlight controls
```

To use a system browser instead:

```bash
CHROMIUM_PATH=/usr/bin/chromium npm run test:smoke
CHROMIUM_PATH=/usr/bin/chromium npm run test:molecules
CHROMIUM_PATH=/usr/bin/chromium npm run test:content
```

Set `TEST_BASE_URL` for a different port. The checks cover the reading experience, search/filtering, empty states, bookmark persistence, storage failures, legacy redirects, responsive routes, molecular interactions, literal highlight rendering/toggling, all 24 content pages, all inline figures, loaded molecular structure assets, particle/electron counts, and mobile table/image scrolling. Unit checks also verify highlighted excerpts exist, table rows match headers, and worked numerical answers agree with their stated simplified models. They use isolated browser contexts and write screenshots to `/tmp`.

## Architecture

- `src/app`: App Router entry, article metadata, legacy redirects, base/tool CSS and the publication theme.
- `src/components/knowledge`: homepage, cards, article illustrations, collections, reading shelf, and reader. `learning-figure.tsx` contains the labeled explanatory diagrams.
- `src/components/workspace.tsx`: shared publication header, search, navigation, and route composition.
- `src/components/simulators`: molecular diagrams and the concentration visualizer.
- `src/data/knowledge`: grade/subject definitions, content-to-subject mappings, explanatory text, references, tool links, and search helpers. `expanded-content.ts` holds the additional core topics; `study-guides.ts` enriches the initial entries with summaries and worked examples. `figures.ts` maps each content entry to the exact paragraph/section it illustrates.
- `src/data/molecules`: curated structures, functional-group descriptions, and 2D layouts.
- `src/lib/chemistry`: model calculations and scientific tests.
- `src/lib/content`: literal-text highlight segmentation, content consistency checks, and worked-answer checks.
- `src/lib/storage` and `src/hooks`: local reading-list persistence. The legacy progress parser remains for compatibility; old browser-local progress is neither erased nor displayed as scores.
- `src/components/ui`: reusable Radix/CVA Button with shadcn configuration in `components.json`.

Persistence can be replaced behind the hook/storage boundary if remote bookmarks or authentication are introduced later. No remote authentication or database is implied today.

Use `/grades/4`, `/grades/5`, `/grades/6` for grade collections and `/courses/<subject-id>` for subject collections.

## Existing links

Old course and lesson URLs redirect to relevant articles or the knowledge collection. `/labs` and `/builder` redirect to `/tools`, `/drugs` to the organic chemistry collection, `/quizzes` to discovery, and `/progress` to the reading shelf. Old browser-local activity data is left untouched; it is not converted into bookmarks.

## Vercel deployment

1. Import this GitHub repository into Vercel.
2. Use Node.js 22+ and the repository root.
3. `vercel.json` explicitly selects **Next.js**, `npm ci`, `npm run build`, and output `.next`. Do not set the output directory to `public`.
4. No environment variables are needed. Deploy the latest commit.

With an existing Git integration, a push to the configured production branch triggers a new deployment. The app itself does not manage a Vercel account or prove deployment success.

## References

- [OpenStax Chemistry 2e](https://openstax.org/details/books/chemistry-2e)
- [OpenStax Organic Chemistry](https://openstax.org/details/books/organic-chemistry)
- [PubChem Aspirin](https://pubchem.ncbi.nlm.nih.gov/compound/2244)
- [PubChem Acetaminophen](https://pubchem.ncbi.nlm.nih.gov/compound/1983)

## Editing content and emphasis

Use `ContentSection.highlights` for exact phrases from that section's `text`. Rendering splits plain text into ordinary spans and `<mark>` elements; it never interprets source text as HTML. Keep emphasis selective. Add `example` for a named worked problem with ordered steps and a result, `note` for assumptions/misconceptions, `table` for comparisons, and article-level `keyPoints`/`terms` for summaries and definitions. Checks reject highlights that do not occur in their source paragraph.

Core coverage is expanded across all six configured subjects, but the site does not claim to be a complete official syllabus or a substitute for an approved textbook. Numerical examples state their approximations and conditions. The esterification equilibrium value used in the example is specified for illustration, not asserted as a measured constant at every temperature. Safety content links to [OSHA Hazard Communication](https://www.osha.gov/hazcom) alongside the chemistry references.

## Explanatory images

Every content page includes a labeled figure inside its relevant section. Panels stack on small screens so labels remain readable. Figures illustrate changes, counts, directions, comparisons, or process order; captions identify symbolic quantities and limitations. The dilution figure preserves six equal-size solute symbols, the ion figure shows 11 → 10 electrons, and the half-life figure uses 8 → 4 → 2 proportional units.

The aspirin and paracetamol structures are static SVG assets under `public/diagrams`. Carbon-containing atom labels are explicit for beginner readability; colors mark matched functional groups. RDKit is a **development dependency only** and its WASM is not loaded into the reading app. Regenerate and verify the assets with:

```bash
npm run figures:generate
npm test
```

`scripts/generate-molecular-figures.cjs` validates the supplied SMILES, checks the expected formulas, matches groups, and generates 2D layouts. Metadata in `public/diagrams/molecules.json` records representations, group atom indices, source references, and the generator version. The script uses the official [RDKit.js distribution](https://www.rdkitjs.com/) (BSD-3-Clause); the files are not copied PubChem images and are not 3D geometries. No generation step is required at runtime because the generated SVGs are committed.
