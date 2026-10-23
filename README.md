# ChemLab RX

**Explore Chemistry, Understand Medicine.** A Thai-first interactive chemistry learning application for upper-secondary students (ม.4–ม.6).

## Run locally

Requires **Node.js 22+** and npm. No API keys, database, or `.env` file are required for Phase 1.

```bash
npm ci
npm run dev
```

The development server uses port 3000. In the cloud workspace, run commands from `/workspace/chemistry-lab-simulator`. If the default npm cache is not writable, use `npm ci --cache /workspace/.npm-cache`.

```bash
npm test           # Scientific model and basic bond-order sanity tests
npm run typecheck  # TypeScript
npm run build      # Production bundle and type checks
npm start          # Serve the production build on port 3000
```

## Browser smoke checks

With the app running in a separate terminal:

```bash
npx playwright install chromium
npm run test:smoke
npm run test:molecules # Interactive molecular diagram checks
# Or use an existing system browser:
CHROMIUM_PATH=/usr/bin/chromium npm run test:smoke
```

This exercises search, grade filtering, all learning stages, hints, quiz feedback and persistence, exploration tracking, live graph controls, mobile navigation, route layouts, and confirmed progress deletion. The smoke test uses an isolated browser context and saves screenshots in `/tmp`.

## Phase 1 features

- Responsive dashboard, mobile navigation, live lesson search, grade filtering, and curriculum browsing.
- Six project-authored sample lessons, one for each supplied course. Each follows **Learn → Guided Practice → Free Experiment → Quiz**, with objectives, hints, misconceptions, and pharmacy connections.
- Functional Group Explorer: four curated structural examples (alcohol, carboxylic acid, ester, amide), interactive atom-and-bond diagrams, three guided visual stages, functional-group highlighting, clickable atom/bond explanations, optional explicit hydrogens, a find-the-group challenge, and exploration tracking.
- Interactive first-order concentration graph in the lesson activities, with units, assumptions, reset controls, half-life, and reflection prompts.
- Six working quizzes with hints, immediate feedback, retry, and latest scores. A correct answer marks the lesson complete.
- Actual local progress, last lesson, explored groups, and scores persist across reloads. Progress can be explicitly reset. Storage failures are shown in the UI.

Curriculum titles come from the project brief. Sample lessons and learning objectives are **not an official school chapter list or official learning outcomes**. The graph represents an ideal irreversible, well-mixed, constant-temperature first-order model; it is not a clinical model.

## Scope and future work

The molecular editor, full titration/esterification/multi-order kinetics simulators, electrochemical cell, drug library, saved experiments, and verified 3D viewer are explicitly labeled **Coming Soon**. No arbitrary molecular geometry or unsupported clinical claims are generated. 3Dmol.js is deferred until verified coordinates and supported structures are implemented in Phase 3.

The molecular diagram on the homepage is decorative and explicitly labeled as an illustration, not a specific chemical structure. The explorer uses curated 2D connectivity graphs with all atoms and bonds specified. Layout positions do not represent physical coordinates, bond lengths, or bond angles. Condensed formulas are available in an optional disclosure. These examples are not a general molecular structure validator. `checkBasicValence` is a tested low-level helper for a future editor and **does not establish chemical validity**.

## Architecture

- `src/app`: Next.js App Router routes and responsive Tailwind/CSS theme.
- `src/components`: dashboard, lesson flow, explorers/graphs, shared components, and shadcn-style Button built with Radix Slot/CVA.
- `src/data/curriculum`: configurable course titles, sample lessons, questions, and structural examples.
- `src/data/molecules`: curated molecular graphs and 2D layout positions.
- `src/lib/chemistry`: scientific calculations, molecular graph checks, and independent tests.
- `src/lib/storage`: versioned local progress schema and defensive reader.
- `src/hooks/use-progress.ts`: UI-facing persistence adapter. Replace this boundary with a Supabase-backed store and add authentication later; no auth or remote persistence is implied today.

Thai and English typography uses self-hosted Noto Sans Thai and Inter from Fontsource, with system fallbacks. Fonts are bundled with the app; no Google Fonts network access is needed. Science graphs use Recharts; transitions use Motion; icons use Lucide React. `components.json` provides shadcn/ui configuration.

## Deploy to Vercel

1. Push the source to your GitHub repository and import it into Vercel.
2. Select the **Next.js** preset and repository root. Use Node.js 22+.
3. Install command: `npm ci`. Build command: `npm run build`. Keep the default output directory.
4. No environment variables are required. Deploy.

Learning progress stays in each browser's local storage, including after deployment, and is not shared across devices or domains. This repository does not deploy automatically or configure a Vercel account.

## Educational references

- [OpenStax Chemistry 2e](https://openstax.org/details/books/chemistry-2e) — bonding, concentrations, reaction rates.
- [IUPAC Gold Book](https://goldbook.iupac.org/) — chemical terminology.
- [PubChem](https://pubchem.ncbi.nlm.nih.gov/) — reference information for future verified molecular structures.

For education only; not medical advice or dosing guidance.
