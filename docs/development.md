# Development and content maintenance

The application is a static React/TypeScript app built with Vite. It has no server-side account system, database, analytics, or third-party runtime font requests. Fonts, KaTeX, lessons, and question banks are bundled. The graded course links released contest statements to their attributed external source. The separate textbook collection includes attributed SVG excerpts from the two user-supplied reference books.

## Local development

Use Node 22.18 or newer (the delivered project was checked with Node 25.2.1) and Python 3.12 or newer with SymPy for content generation.

- `npm ci` installs the locked JavaScript dependencies.
- `npm run dev` serves the app at `http://127.0.0.1:5173`.
- `npm run build` type-checks and produces the static `dist/` directory.
- `npm run preview` serves that production build at `http://127.0.0.1:4174`.
- `npm test` checks progress logic and selected mathematical families with separate numerical/enumerative checks.
- `npm run validate:content` validates the complete bank, prerequisite graph, provenance, and KaTeX expressions.
- With both local servers running, `npm run test:browser` exercises study flows on desktop and mobile. `npm run test:competition` checks all 18 competition explorations, formula entry points, practice defaults, contextual feedback, graph bounds, and historical backup references. `npm run test:a11y` performs automated accessibility checks.
- If needed, `npx playwright install chromium` installs the browser used by the checks. Screenshots and check reports are written under `/tmp/amc-qa` and `/tmp/amc-rigor`, outside the repository.

## Content sources

The main course is authored in `scripts/content/contest/`: 18 studies with three explanatory sections, a derivation, two worked examples, a completion task, four formula relations, 14 authored problems, and one linked released problem per study. Sixteen studies are in AMC 10 scope; two add AMC 12 logarithmic/trigonometric and complex-number synthesis. The 252 practice items comprise 251 original problems and one explicitly attributed adaptation. Each records its decisive inference, prerequisites, five choice rationales, exact answer, and verification method. `methods.py` supplies 36 comparisons of plausible approaches with feedback specific to each rejected plan.

The earlier 50 lessons in `scripts/content/lessons.py` remain labeled prerequisite references. `problems.py` supplies their 350 structural families, with two numerical practice variants per family. These references are optional; the default course and practice selectors use competition studies. The old method bank remains available under prerequisite material.

Run `python3 scripts/build_content.py` with SymPy installed, or `uv run --with sympy python scripts/build_content.py`. The generator executes authored checks and writes the checked-in JSON. The browser does not generate unreviewed variants. When publication is authorized, keep sources and generated data together.

The active content comprises 68 lessons, 1,020 course items/references, 510 formula drills, and 236 method questions: 1,766 unique active records. Formula drills cover 122 relations in objective-to-formula, formula-to-objective, and three-pair matching formats. `formula_objectives.py` supplies 72 concrete scenarios used in both multiple-choice directions. Default home, lesson, and builder sessions alternate the two multiple-choice directions; matching is selectable in the practice builder. Ordinary calculation questions are excluded. `formula_equivalence.py` groups equivalent relations and relevant special cases so they cannot compete as different answers. Conditions accompany recognition prompts and feedback. Formula pools respect the selected exam track.

The diagnostic stores 15 canonical course-question IDs, of which 12 are in AMC 10 scope. It does not clone the same mathematical item under a second ID. Retired calculation drills and superseded questions live in `legacy-questions.json` so saved sessions, notes, bookmarks, and backups remain readable. Never reuse an existing ID for a changed mathematical item or reordered answer choices. A choice-only revision preserves the structural family. Historical calculation retries use review, not formula mode.

`python3 scripts/verify_contest.py` replays all 288 authored answer checks and checks generated content against its sources. `uv run --with sympy --with antlr4-python3-runtime==4.11.0 python scripts/verify_contest.py --choices` also parses all 1,440 numeric choices, compares selected answers to exact values, and rejects algebraically equivalent choices. Finite enumeration, exact coordinates, and symbolic calculations independently check many answers; some checks are direct evaluations or certificates supporting a written proof. They are not all independent proofs. Structural counts and TeX parsing do not establish contest demand or instructional effectiveness. Editorial review must also check the decisive inference, domain, attainability, distinct structures, and whether each distractor actually follows from its stated error.

The authoring skill is included under `skills/amc10-12-problems` and synchronized with the installed skill. Its calibration reference records concrete failures and released-contest benchmarks.

`scripts/research_sources.py` refreshes released-item provenance from the LIVE archive. It requires Beautiful Soup (`uv run --with beautifulsoup4 python scripts/research_sources.py`). Its statement cache is under `/tmp/amc-research/released`; copyrighted statements are not written into the distributable curriculum. Generated metadata records the source URL, key, verification date, and statement hash.

## State and evidence

`src/model.ts` is the pure progress model; `src/main.tsx` loads and saves the versioned local state. Reading, full problem solving, formula practice, and method practice are distinct. Only the first full-problem attempt at an item per local calendar day can supply independent evidence. A supported first attempt blocks later same-day attempts at that item from becoming independent evidence.

Readiness requires at least four distinct problems across three families, with at least 80% accuracy among the last eight distinct independently attempted problems. Retention additionally requires correct independent work on two distinct problems at least 20 hours after the first successful attempt. These thresholds are product heuristics, not psychometric estimates. Diagnostic successes may route forward without granting mastery. A missing prerequisite attempt is not evidence of a gap; prerequisite remediation requires observed evidence. New learners can begin the competition sequence directly.

Successful spaced returns advance through 1, 3, 7, 14, and 30 days. Wrong, skipped, or supported attempts request a return after 15 minutes. Same-day duplicate attempts cannot postpone a review. Formula and method drills do not advance the full-problem review schedule. An initial success can set a review date before a concept is ready; the date means “worth revisiting,” not “mastered.”

Sessions store answers and assistance immediately. The last answered question remains resumable until the learner finishes the session. JSON backup import validates the schema and known lesson/question IDs, merges attempts by ID, and lets imported notes/settings take precedence. Browser storage failures are surfaced, with export still available. Invalid existing saved data is left untouched rather than overwritten.

## Deployment and repository boundaries

The app uses hash navigation, so ordinary static hosting does not need route rewrites. `dist/` is the build output. Keep environment files, dependencies, supplied reference PDFs, research caches, and screenshots out of version control. The README intentionally contains feature bullets only, as requested.

The user authorized a tentative GitHub checkpoint for this revision. Publish through the existing GitHub CLI connection to the public `AMCOntology` repository. Keep the README limited to feature bullets and exclude source PDFs, the task brief, screenshots, caches, dependencies, environment files, and build output.

## Manuscript artwork and personalization

`src/components/Manuscript.tsx` contains the original, editable SVG armillary sphere, botanical geometry, reflection study, illuminated initials, and folio ornaments. `Illustrations.tsx` contains subject diagrams and the interactive equivalent-fraction preview. `ContestVisual.tsx` and `StudyVisual.tsx` contain the 18 competition explorations, including polynomial remainders, residue intersections, lattice geometry, probability states, and roots of unity. `public/art/paper-grain.svg` supplies the subtle paper texture. The illustrations are decorative interpretations; linked lessons contain the mathematical instruction. No AI image generation is used. The new textbook facsimiles preserve the supplied books’ original illustrations, including embedded image content where present.

`src/notebook.css` defines the cream palette, manuscript typography, ornament placement, and responsive treatment. Text and diagram ink can be blue, plum, or graphite; the cream page and botanical pigments remain consistent. Optional name and ink preferences are stored with the existing local state and included in validated progress backups. Older backups without these preferences remain compatible.

## Textbook formulary

`#/formulary` lazily loads the formula book. Its three views provide 18 animated studies (144 explanatory steps), 112 source-attributed crash-course formula entries plus the existing 122-relation course index, and every one of the 232 numbered examples in the supplied Mastering AMC 10/12 edition. Examples retain their printed attribution, chapter, page range, original excerpts, marked diagram corrections, 44 written solutions, and 182 video links. Six examples have neither a written nor linked video solution in that edition; one of those, 25.4, has an authored interactive walkthrough. AIME and other advanced source labels remain distinct from AMC scope.

The 118-page Crash Course contains 116 numbered main sections but no numbered example bank. Repeated formulas are consolidated, and strategy-only sections remain in its source index. Conditions and mathematical errors are corrected in the authored reference; see `docs/textbook-sources.md`. Facsimiles preserve source content and are not independently re-solved en masse. The reader corrects 23 displaced geometry figures using the explicit mapping in `scripts/textbooks/figure-repairs.json`; original excerpts remain available for comparison.

Rebuild source excerpts with `uv run --with pymupdf python scripts/textbooks/extract.py` when the two local PDFs are present. Then run `python3 scripts/textbooks/formulary.py` and `python3 scripts/textbooks/reference.py`. The PDFs are intentionally untracked; checked-in JSON and necessary SVG excerpts make the published app self-contained. Excerpts use outlined fonts for faithful TeX and illustrations. Wide source facsimiles scroll within their reader on small screens and offer enlargement. Authored explanations and reference formulas use accessible KaTeX/MathML; the facsimiles are visual source documents rather than fully transcribed accessible mathematics.

`uv run --with sympy python scripts/textbooks/verify.py` independently checks all 18 new walkthrough answers by enumeration or an alternative exact calculation. `npm run validate:content` also validates the formulary, source assets, and its TeX. `uv run --with pymupdf --with pillow --with numpy python scripts/textbooks/audit_excerpts.py` compares all 353 source crops against their PDF originals. `npm run test:formulary` checks every step, source image, diagram correction, filters, route connections, live controls, keyboard playback, reduced motion, mobile bounds, and accessibility. Artifacts go to `/tmp/amc-formulary`, never the repository.

Formulary reading, playback, and self-explanation do not create mastery evidence, alter quiz identities, or change saved-session/backup schemas.
