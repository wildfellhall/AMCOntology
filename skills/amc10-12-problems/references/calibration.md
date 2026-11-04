# Demand calibration and failure checks

## What went wrong in the first bank

The original generator assigned difficulty from template index, reused each of seven structures twice, supplied some incorrect choices by adding small offsets to the answer, and used its ordinary calculation generators for 250 of 400 formula-drill records. The lessons contained a median of 112 words of main teaching. Those are observable implementation defects; total record count and a passing structural validator did not establish contest quality.

## Demand is a property of reasoning

| Band | Evidence in the solution | Insufficient evidence |
| --- | --- | --- |
| Prerequisite fluency | Correct execution of a named relation or definition | Calling it a late AMC problem because the arithmetic is large |
| Connection | Choose a representation or connect two quantities without being told the operation | Two consecutive substitutions into supplied formulas |
| Contest application | A non-obvious first move, a constraint that determines the approach, and a complete chain of reasoning | A familiar formula with names or numbers changed |
| Transfer / synthesis | A structurally different setting, interacting concepts, and a necessary check or case split | Repeating the worked example's steps with different parameters |

Contest positions are useful contextual benchmarks, not measured item difficulties. Do not assign predicted scores or qualification claims to editorial bands.

## Released benchmark observations

Read the official [2022 AMC 10A paper](https://maa.org/wp-content/uploads/2024/08/2022_AMC10A-Problems.pdf) and [solutions](https://maa.org/wp-content/uploads/2024/08/2022-AMC-10A-solutions.pdf).

- #10: compare two distance equations to recover a rectangle's area without first finding its individual dimensions.
- #13: an auxiliary perpendicular and parallel line make the angle-bisector configuration usable.
- #15: cyclic geometry and two right-triangle structures determine a circle and a composite area.
- #16: a product of shifted roots is a polynomial evaluation in geometric disguise.
- #18: compose rotation and reflection in the correct order; parity changes the resulting action.
- #19: a common denominator and a prime modulus eliminate almost all terms in a rational sum.
- #20: successive differences eliminate an arithmetic component; positivity and integrality constrain the geometric component.
- #21: interpret a spatial construction through planar distances before computing the rim area.

These are observations of mathematical structure. Do not copy their wording or merely substitute new numbers and call the resulting item original. Read a second contest and AMC 12 examples before claiming broad calibration.

Additional inspected benchmarks:

- [2023 AMC 10B #21](https://live.poshenloh.com/past-contests/amc10/2023B/problem/21): box occupancies can be compressed into parity states; a recurrence explains convergence near one quarter. A finite exact variant of this same setup is an adaptation, not an unrelated original.
- [2023 AMC 12A #20](https://live.poshenloh.com/past-contests/amc12/2023A/problem/20): modified Pascal boundaries produce a nonhomogeneous row-sum recurrence; solving it makes a units-digit question manageable.
- [2023 AMC 12A #23](https://live.poshenloh.com/past-contests/amc12/2023A/problem/23): factorwise inequalities force simultaneous equality, narrowing a seemingly broad algebraic solution set to an attainable configuration.

## Textbook anchors

In the supplied *Mastering AMC 10/12*: combinatorial identities, chapter 6, pp. 91–104; recursion and probability states, chapters 10–11, pp. 143–167; polynomial structure, chapters 13–14, pp. 183–208; modular and algebraic number theory, chapters 24–26, pp. 291–327; similarity, chapter 32, pp. 398–426; circle geometry, chapter 34, pp. 452–493; inequalities, chapter 40, pp. 598–608; complex numbers, chapter 44, pp. 653–674. Confirm mathematical notation visually when extraction loses fractions or symbols. Do not copy a source's inaccurate hypothesis: in particular, Fermat's little theorem is not an unrestricted converse test for primality.

## Learning-design checks

Worked examples should expose the reasoning that a novice cannot yet generate, then gradually remove support. Interleave methods after initial instruction so topic labels do not always announce the solution. Use delayed fresh-family problems to check retention and transfer. Offer a prerequisite explanation when it is needed instead of forcing every learner through elementary material.

The [2023 worked-example meta-analysis](https://www.danamillercotto.com/uploads/4/7/7/2/47725475/barbieri_et_al__2023__we_meta-analysis.pdf) supports worked examples in mathematics while finding substantial variation; self-explanation prompts are not a guaranteed improvement. [AoPS's handbook](https://artofproblemsolving.com/school/handbook/current/hard) supplies relevant instructional practice, not an independent causal experiment. Neither source validates a particular app, lesson length, or fixed problem ratio.

## Regression cases from the revision

- A factorial valuation lesson should not count two different numerical-base trailing-zero questions as its only distinct late-stage structures. Add exponent compatibility, divisor restrictions, or a different necessary inference.
- A distractor described as sampling with replacement must equal the actual replacement-model probability. For exactly two red draws from red probability 5/9 in three independent draws, that is 3(5/9)²(4/9), not (5/9)².
- A capped-composition distractor must specify exactly which positivity or endpoint constraint was lost. Compute that alternate model; do not attach a plausible-sounding explanation to an arbitrary number.
- Similarity area scaling, point power, and equivalent stars-and-bars formulas cannot be competing answers to a prompt that accepts both. Use semantic equivalence groups and inspect the situation as well as the symbols.
- A formula route is not fixed merely by changing its title. Test its saved session mode, allowed question kinds, filters, feedback, and every entry point, including bookmarks. Retired calculation questions may remain loadable without re-entering the formula pool.
- Diagnostic and lesson appearances of the same mathematical item must share an ID. Choice order changes require versioned IDs, with archived records for existing answers.
- Exact arithmetic, distinct choices, rendered TeX, and passing browser tests do not prove that the solution teaches a productive first move or matches contest demand. Audit the explanation and the actual sequence of decisions separately.
