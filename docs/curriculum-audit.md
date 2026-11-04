# Curriculum rigor audit and revision

Completed locally on 4 November 2026 in response to the learner’s review. This records defects in the first curriculum, the resulting changes, and the limits of verification.

## Observed deficiencies

The original 50 lessons contained 91–151 words of main teaching (median 112). Their 700 original practice items used 350 families, each repeated with changed parameters; difficulty was assigned by array position, and some distractors were padded with nearby numbers. The 400-record formula bank contained 250 ordinary calculation problems. The initial recommendation began with fractions and treated missing prerequisite evidence too readily as an observed gap. Structural and answer checks did not establish the instructional depth or reasoning demanded by AMC problems.

## Completed changes

- The main course now has 18 competition studies, with 439–571 words of main teaching each (median 488), plus derivations, two worked examples, a completion task, feedback, and independent practice. Length is a descriptive audit measure, not a proxy for quality. Sections explain recognition, why a transformation works, domain or equality checks, and transfer between representations.
- Each study contains 14 deliberately authored problems and one linked released item. The 252 authored practice problems comprise 251 originals and one explicitly attributed adaptation; there are 36 additional worked examples. Sets include basic connections as well as unfamiliar constraints and synthesis, rather than merely repeating seven templates with different numbers.
- The original 50 compact lessons are explicitly labeled prerequisite references. The default course, home shortcuts, and practice builder use competition studies. Students can open references when needed; absence of an attempt does not force elementary remediation.
- Formula drill contains 388 multiple-choice and 122 matching records covering 122 relations. This includes 144 concrete objective/formula choices added in the interface polish. Competition material supplies 360 total records; its 288 multiple-choice questions form the default pool. Home, course lessons, practice filters, and notebook retries preserve the drill mode. Retired ordinary calculations remain readable in historical sessions but are excluded from new formula sessions. Equivalent relations and related special cases cannot appear as competing answers.
- Thirty-six new method questions compare plausible plans for competition problems and explain each rejected plan specifically. The 200 earlier method questions remain available with prerequisite references. The default method pool uses the new competition questions.
- The 15-item diagnostic samples competition connections using canonical course-question IDs. The same problem cannot become two independent mastery records merely by appearing in diagnosis and practice.
- The knowledge map includes all 68 studies/references and their prerequisite links, with specific techniques on each new node. Every new study has an interactive, accessible SVG exploration; controls update mathematical quantities, reset correctly, and respect reduced motion.
- Retired IDs remain in an archive for saved sessions and backups. Reordered or replaced choices receive new IDs, while choice-only revisions preserve the underlying family.

## Source audit

The supplied *Mastering AMC 10/12* has 686 pages. Its worked and practice material informed the methods and coverage below; the 118-page Crash Course provides a secondary coverage check. The textbook also contains AIME and olympiad material, which is not automatically classified as AMC. Hypotheses are checked independently: Fermat’s congruence, for example, is not an unrestricted converse test for primality. PDF extraction sometimes drops fraction bars, so mathematical reconstruction and visual inspection accompany text extraction.

| Competition study | Track | Mastering AMC 10/12 pages | Selected methods |
| --- | --- | --- | --- |
| Algebraic transformations & hidden structure | 10 | 168–182 | symmetric power sums, completing a product |
| Polynomial structure, shifted roots & remainders | 10 | 183–208 | shifted root products, higher Vieta |
| Sequences: transformations, sums & constraints | 10 | 209–233 | fixed-point shifts, reciprocal recurrences |
| Integer equations: factors, bounds & descent | 10 | 306–327 | shifted factorization, bounded congruence search |
| Congruences: inverses, cycles & compatibility | 10 | 291–305 | modular inverses, noncoprime cancellation |
| Prime valuations, divisors & factorials | 10 | 261–290 | Legendre’s valuation sum, exponent-vector counting |
| Auxiliary lines: altitude, reflection & extension | 10 | 367–397 | shared-altitude elimination, area invariants |
| Area ratios, cevians & similarity chains | 10 | 398–426 | shared-base areas, similarity scale chains |
| Circles: power, cyclic structure & tangents | 10 | 452–493 | tangent–secant power, radical-axis construction |
| Coordinates, transformations & lattice geometry | 10 | 574–597 | squared-distance cancellation, determinant area |
| Spatial geometry: nets, sections & volume | 10 | 511–573 | surface unfolding, oblique cross-sections |
| Constrained counting: gaps, exclusions & symmetry | 10 | 41–90 | gap bijections, bounded compositions |
| Double counting, coefficients & cancellation | 10 | 91–104 | marked-element double counting, Vandermonde partitions |
| Probability: conditioning, states & expectation | 10 | 124–167 | conditional normalization, parity-state compression |
| Invariants, pigeonholes & extremal constructions | 10 | 675–686 | transformed invariants, adapted pigeonhole partitions |
| Inequalities, equality cases & admissible roots | 10 | 590–608 | weighted AM–GM, Cauchy reciprocal bounds |
| AMC 12: logarithmic & trigonometric transformations | 12 | 609–652 | reciprocal logarithms, positive exponential substitution |
| AMC 12: complex geometry & roots of unity | 12 | 653–674 | conjugate reciprocals, complex affine rotations |

The [official 2022 AMC 10A paper](https://maa.org/wp-content/uploads/2024/08/2022_AMC10A-Problems.pdf) and [official solutions](https://maa.org/wp-content/uploads/2024/08/2022-AMC-10A-solutions.pdf) show representation changes and connected reasoning: shifted roots (#16), composed transformations (#18), modular cancellation (#19), and arithmetic/geometric sequence synthesis (#20). Further inspected benchmarks include [2023 AMC 10B #21](https://live.poshenloh.com/past-contests/amc10/2023B/problem/21), which compresses random occupancy into parity states; [2023 AMC 12A #20](https://live.poshenloh.com/past-contests/amc12/2023A/problem/20), which derives a row-sum recurrence from modified boundaries; and [2023 AMC 12A #23](https://live.poshenloh.com/past-contests/amc12/2023A/problem/23), which forces simultaneous equality conditions. These calibrate types of reasoning, not a numerical difficulty scale.

AoPS wiki requests returned HTTP 403. Its [instructional handbook](https://artofproblemsolving.com/school/handbook/current/hard) and [guidance for getting unstuck](https://artofproblemsolving.com/school/handbook/current/stuck) were read directly. Released statements remain at their attributed source; the app stores answer/provenance metadata and links rather than redistributing the archive. The nine-ball parity problem is explicitly labeled as adapted from the released large-n estimation problem, with the changes stated.

## Learning-science application

Worked examples expose the inference and justify the method; completion tasks remove some support; subsequent problems vary constraints and combine prerequisites. Mixed review asks learners to select methods without a chapter title announcing one. Hints support progress without silently counting supported work as independent mastery evidence. Prerequisite help remains available without mandatory elementary sequencing.

The [worked-example meta-analysis](https://www.danamillercotto.com/uploads/4/7/7/2/47725475/barbieri_et_al__2023__we_meta-analysis.pdf) supports worked examples in mathematics while showing variation, including no uniform improvement from added self-explanation prompts. The [mathematics spacing/retrieval review](https://doi.org/10.1007/s10648-025-10035-1) supports spacing more clearly than a broad claim for retrieval over restudy. AoPS guidance is instructional practice, not an independent causal trial. Lesson structure, question mix, scheduling intervals, and mastery thresholds are editorial decisions; this app has not been experimentally validated. See [learning design](learning-design.md) for the fuller evidence synthesis.

## Verification and authoring corrections

The builder executes 288 answer checks covering every new practice item and worked example. These include exact rational/symbolic evaluation, finite enumeration, recurrence equations, geometry coordinates, and equality witnesses. Some are direct evaluations or supporting certificates, not independently complete proofs. The separate verification script also parses 1,440 answer choices, checks exact keys, and rejects algebraically equivalent choices. The written arguments and reasoning demand still require editorial review.

That review corrected a distinct-integer product maximum, a circle radius calculation, an inradius check, weak same-family reuse, and distractor rationales whose arithmetic did not match their choices. Formula-equivalence groups prevent two valid versions of a relation from competing. These observed failures have been added to the revised [AMC authoring skill](../skills/amc10-12-problems/SKILL.md) and its calibration reference, synchronized with the installed skill.

Software checks cover every lesson, all drill entry points, mobile layouts, old backup references, and accessible interaction. The [verification record](verification.md) separates those results from claims about rigor or educational effectiveness.
