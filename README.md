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
- Nine illustrated content entries across bonding and solution properties, concentrations, kinetics, organic chemistry, polymers, and integrated chemical models. Course names come from the project brief; entries are selected available topics, not a claim of complete official syllabus coverage.
- Article pages with key ideas, headings, optional formulas, reference links, related articles, article metadata, and contextual tool links.
- A personal reading shelf with persistent add/remove controls. Bookmarks are stored locally, without sign-in; malformed or unavailable storage is handled.
- Interactive 2D molecular examples: ethanol, ethanoic acid, ethyl ethanoate, and ethanamide. Readers can select atoms and bonds, highlight functional groups, show hydrogens, or try identifying the group themselves.
- An interactive first-order concentration graph with adjustable inputs, units, assumptions, half-life, and reset.
- Responsive navigation and layouts; keyboard-accessible controls, skip navigation, and self-hosted Inter/Noto Sans Thai fonts.

Drug articles discuss the chemistry of aspirin and paracetamol and link to PubChem. Illustrations in those articles show simpler functional-group examples and explicitly state that they are **not the drug's molecular structure**. The text does not provide dosing or clinical advice. Sources are provided for further reading, and explanatory text is authored by the project.

## Visual and scientific boundaries

Molecular diagram coordinates are **2D layout positions**, not physical coordinates, bond angles, or verified 3D geometry. Explicit atom/bond data are tested for composition, ordinary neutral valence, connectivity, and highlighted groups. These checks are not a general chemical validity proof. Condensed formulas remain available as optional reference text.

The concentration graph is an ideal irreversible, well-mixed, constant-temperature first-order model. It does not represent every reaction or a clinical dosing model. Scientific calculations stay separate from UI components.

## Browser checks

Start the app in a separate terminal, then run:

```bash
npx playwright install chromium
npm run test:smoke
npm run test:molecules
```

To use a system browser instead:

```bash
CHROMIUM_PATH=/usr/bin/chromium npm run test:smoke
CHROMIUM_PATH=/usr/bin/chromium npm run test:molecules
```

Set `TEST_BASE_URL` for a different port. The checks cover the reading experience, search/filtering, empty states, bookmark persistence, storage failures, legacy redirects, responsive routes, and molecular interactions. They use isolated browser contexts and write screenshots to `/tmp`.

## Architecture

- `src/app`: App Router entry, article metadata, legacy redirects, base/tool CSS and the publication theme.
- `src/components/knowledge`: homepage, cards, article illustrations, collections, reading shelf, and reader.
- `src/components/workspace.tsx`: shared publication header, search, navigation, and route composition.
- `src/components/simulators`: molecular diagrams and the concentration visualizer.
- `src/data/knowledge`: grade/subject definitions, content-to-subject mappings, explanatory text, references, tool links, and search helpers.
- `src/data/molecules`: curated structures, functional-group descriptions, and 2D layouts.
- `src/lib/chemistry`: model calculations and scientific tests.
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
