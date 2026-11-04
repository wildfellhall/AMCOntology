# Delivery verification

Checked locally on 4 November 2026. These checks verify software behavior and selected mathematical properties; they do not establish educational efficacy or psychometric difficulty.

## Curriculum and mathematics

- All 26 automated model/content tests passed. They cover evidence independence, supported and same-day retries, delayed retention, spaced scheduling, canonical diagnostic IDs, competition-first routing, backup merging, personalization compatibility, interleaved selection, track boundaries, formula-only pools, and independently checked mathematical families.
- Complete content validation passed: 68 lessons, two worked examples per lesson, 1,020 course questions/references, 510 formula drills, and 236 method questions. The 15 diagnostic IDs reference existing course items. All 1,766 unique active records and 15,334 TeX expressions passed structural/rendering checks. The prerequisite graph is acyclic and AMC 10 prerequisites stay within track scope.
- The 18 competition studies provide 252 authored practice items (251 original, one explicitly adapted), 36 worked examples, 18 linked released slots, completion activities, 72 formula relations, and 36 contextual method questions. The earlier 50 lessons remain explicit prerequisite references.
- The builder executed 288 authored answer checks, covering every new practice item and example. `scripts/verify_contest.py --choices` replayed those checks, confirmed generated content matches the sources, parsed all 1,440 answer choices, checked exact answer keys, and found no algebraically equivalent choices. Checks include enumeration, symbolic arithmetic, coordinate geometry, recurrence equations, and equality witnesses; some are direct evaluations or proof certificates rather than fully independent proofs.
- Editorial review corrected distractor arithmetic, domain/equality issues, a repeated valuation structure, and source labeling. Formula-equivalence groups prevent equivalent relations from competing. A passing numeric or structural check does not by itself verify a solution’s reasoning or contest demand.

## Browser and interaction checks

- The full browser suite visited all 68 lessons, adjusted explorations, revealed worked-example steps, and found no math-rendering or browser-console errors. Course filters expose 16 AMC 10 competition studies, 18 AMC 12 studies, 50 total prerequisite references, and 68 combined nodes. The full graph remains navigable.
- End-to-end flows passed for hints, answer submission, reload/resume, matching, export/restore, a complete 12-item AMC 10 diagnostic, a complete 15-item lesson set, method practice, notes, bookmarks, map search, and the production bundle. Released-problem links retain their verified source URL.
- `npm run test:competition` passed for all 18 study explorations, reset behavior, accessible diagram labels, and 320px layouts. It checks all five formula-format filter settings; home, lesson, builder, and notebook formula entry points; competition-only default practice pools; specific feedback for a rejected method; graph node bounds; and historical calculation notes/bookmarks restored from backup. It also checks the new probability source link and adaptation metadata.
- Desktop screenshots of every competition exploration were visually inspected, along with the home, course, new lesson, formula session, and mobile lesson. Corrections included visible residue labels, a distinguished-member ring, and a roots-of-unity polynomial label that avoids substituting into an undefined quotient.
- Eight principal mobile routes at 390px and all 18 competition lessons at 320px showed no page-level horizontal overflow. Wide mathematical expressions may scroll within their own container.
- Automated axe checks found no WCAG 2 A/AA or WCAG 2.1 AA violations in 16 checked states, including new lessons, selected answers, feedback, and mobile matching. Reduced-motion behavior passed. This is not comprehensive accessibility certification.

## Build, design, and artifacts

The TypeScript/Vite production build passes. Its expanded question bank produces a roughly 935 kB minified question chunk (about 153 kB gzip), exceeding the configured chunk-size warning threshold; this is recorded rather than hidden by raising the threshold. The development server uses `http://127.0.0.1:5173`; the production preview uses port 4174.

The cream manuscript design uses `#fffdf4`, locally bundled Cormorant Garamond and Source Serif, top navigation, botanical corners, illuminated initials, and original SVG astronomy, botany, and optics illustrations. No image-generation output is used. Earlier manuscript checks also exercised all three illustrated study selectors, five-question shortcuts, ink/name persistence and backup restoration, dialog Escape/focus behavior, and seven routes at 320, 390, 768, 1024, and 1440px. All three ink palettes and the personalization dialog passed their automated accessibility checks.

The revised AMC authoring skill is synchronized with its installed copy and passes the skill validator. Its calibration guide records the observed failures, actual released-contest benchmarks, formula separation, distractor arithmetic, and stable-ID requirements.

Screenshots, logs, extracted source text, and test backups remain outside the repository under `/tmp/amc-qa`, `/tmp/amc-rigor`, `/tmp/amc-manuscript`, and `/tmp/amc-notebook`. Isolated browser contexts do not overwrite the learner’s normal state. The supplied PDFs and brief remain untouched. The README contains feature bullets only; the later textbook revision is authorized for a public GitHub review checkpoint.

## Interface detail and formula-choice revision

Removed colored side rules from resume panels, objectives, question context, and pitfall notes; removed the session margin rule and matching inset shadow. Choice letters, trail numbers, chapter numbers, and step counters now use controlled line height and numeral metrics. Small SVG arrows retain their dimensions and spacing; matching indicators use an aligned arrow/letter group. Mobile question metadata keeps its bookmark beside the labels. Course chapter numbers agree with the subject index.

Added 144 concrete objective/formula multiple-choice questions, bringing the formula bank to 510 records: 388 multiple-choice and 122 matching. Default home, lesson, and builder sessions alternate the two multiple-choice directions. Either direction, matching, or all formats can be selected explicitly. Both directions have five options; feedback explains the selected relation or objective and renders its mathematics. Switching from a challenge-filtered mixed session cannot silently empty the formula pool.

The 26-test suite, complete content validation, production build, competition browser checks, and 16-state accessibility suite passed. Additional isolated browser checks exercised both new directions, five-option answer submission, default alternation, matching indicators, neutral borders, centered badges, and five routes at 320, 390, 768, and 1440px. Screenshots and logs are outside the project under `/tmp/amc-polish`.


## Textbook formula book and source catalog

The new section includes 18 animated studies with 144 explanatory steps, 112 crash-course reference entries, the separate 122-relation course index, and all 232 numbered textbook examples across 44 chapters. Original attributions, 44 written solutions, and 182 source-provided video links remain available. Six source examples lack either kind of source solution; one of those has an authored walkthrough. These reading activities do not manufacture mastery evidence.

- Exact independent calculations in `scripts/textbooks/verify.py` verify all 18 new worked-example answers. Methods include enumerating circular orders, lattice paths and subsets; symbolic roots and integrals; rational telescoping; divisor enumeration; coordinate areas; and a complex-quotient identity.
- Content validation checks all 232 stable example IDs, source metadata, 354 necessary SVG assets, 112 formula conditions, study/lesson links, and 302 additional TeX expressions. The existing 1,766-question corpus and 15,334 TeX expressions still pass.
- Source QA compares 353 extracted SVG crops with the corresponding original PDF regions. No blank slices remain, and the minimum matched dark-ink coverage is 96.9%, allowing a small rasterization tolerance. The remaining SVG is an authored replacement diagram. A crop comparison establishes extraction fidelity, not mathematical correctness of the supplied PDF.
- Visual review identified 23 geometry examples with displaced source figures. Twenty-two correct figures were recovered elsewhere in the book, and one was constructed from the statement. Each correction has a source note, accessible description, and an expandable uncorrected original. All 23 corrected pairs were visually reviewed; exact mappings are documented in `docs/textbook-sources.md`.
- `npm run test:formulary` passes all 18 studies × 8 steps, all 232 source pages, every corrected diagram, both formula collections, search/filter/empty states, lesson and drill links, solution disclosure, step playback and pause, keyboard tabs, three adjustable explorations, reduced-motion behavior, and 320px layout bounds. Five additional axe states pass, including the original/corrected source comparison and mobile enlargement. No browser errors occur.
- The existing 26-test unit suite, 68-lesson browser and session suites, competition/drill suite, and 16-state accessibility suite were rerun successfully for this revision. The final TypeScript/Vite build passes with the previously documented question-chunk warning. A production-preview smoke test also passes study playback, all 112 reference cards, the 232-example selector, and corrected figure loading.

Settled animation states, corrected source pages, formula cards, and mobile layouts were visually inspected. QA images, extracted text, and logs remain under `/tmp/amc-formulary`; the original PDFs and task brief remain local and untracked. README content remains feature bullets only.
