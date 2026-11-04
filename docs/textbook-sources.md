# Textbook integration and editorial notes

The user supplied two local PDFs and requested their examples and formulas be integrated into the site. This catalog records the supplied editions rather than silently substituting a different web edition.

- **Mastering AMC 10/12**, Omega Learn: 686 PDF pages, 44 mathematical chapters containing 232 numbered `Example` blocks. The extraction includes those blocks and their available written solutions or linked videos. It does not label the separate numbered `Problem` practice sets as examples. The source SHA-256 is stored with the catalog. Original contest attributions remain visible. Source: <https://www.omegalearn.org/mastering-amc1012>.
- **Omega Learn AMC 10/12 Crash Course**: 118 PDF pages, 116 numbered main sections, no numbered example-problem collection. Its subject organization and formulas inform the 112-entry reference and 18 interactive studies. Each entry records its section and actual printed/PDF page. The additional 122-relation index is explicitly labeled as the course index.

The 354 necessary SVG assets comprise 232 original statements, 76 written-solution page segments, 23 corrected statement crops, 22 reassociated source figures, and one newly constructed diagram. Forty-four examples have written solutions; 182 have linked videos. Examples 7.2, 7.3, 25.4, 28.1, 28.2, and 28.3 have neither in the supplied edition. The new authored walkthrough covers 25.4. The crash course's unnumbered explanatory snippets are not counted as a second numbered problem bank.

The extraction strips running headers, page footers, source box titles, and unused surrounding content. It preserves the original problem notation and figures using outlined-font SVG. Solution excerpts may span multiple pages. Search text is an imperfect PDF extraction and is used for search only; mathematical display uses the source facsimile or an authored TeX transcription. The originals are not committed. The excerpts retain source attribution; they are not relabeled as original course problems or assigned an invented redistribution license.

The 18 authored walkthroughs give a separate explanation of specific source examples, with four derivation steps and four worked-example steps each. Every answer has an independent exact check in `scripts/textbooks/verify.py`. This is not a claim that all 232 source solutions were independently verified. Reading a source solution does not count as a successful independent quiz attempt.

## Corrections and conditions

The curated reference is not a blind transcription. Corrections include:

- Crash Course p. 41: Fermat's little theorem is a consequence of primality and coprimality; its congruence is not an if-and-only-if primality test.
- P. 48: the Frobenius counting formula uses **nonnegative** coefficients, with coprime denominations at least two, despite the source's positive-coefficient wording.
- P. 100: equality in Cauchy–Schwarz is stated as linear dependence, including zero-vector cases. The course's reciprocal form requires positive denominators.
- P. 110: the fundamental period of tangent is π, not 2π; the scaled-period formulas require a nonzero scale.
- Pp. 113–114: the imaginary part of a+bi is b, not bi. Complex division requires a nonzero denominator.
- P. 117: the unqualified version of De Moivre's formula is stated for integer powers. Arbitrary real powers require a branch convention.
- Geometric sums, logarithms, modular inverses, cyclic quadrilateral formulas, and area-probability formulas retain their convergence, domain, geometric, and distribution assumptions.

The source index retains the supplied book's section numbering. A section reference identifies where an idea is discussed; a multi-line reference entry may consolidate neighboring formulas. Authored SVG diagrams use the site's cream paper and manuscript pigments. Source facsimiles retain color distinctions; pure blue and red vector ink is mapped to the site’s corresponding manuscript pigments. Embedded source illustrations retain their original colors.


## Displaced geometry figures in the supplied edition

Visual inspection of the geometry examples found 23 problems paired with unrelated illustrations in the PDF itself. The reader shows a corrected statement-and-figure pairing and a marked correction note. The original, uncorrected excerpt remains available in a disclosure for comparison. Twenty-two figures were recovered elsewhere in the same supplied PDF; example 38.4 received a new SVG constructed from its stated lengths. This does not change the problem text or imply that the unrelated source figure was mathematically valid.

| Example | Statement page | Matching figure page |
| --- | --- | --- |
| 34.1 | 456 | 458 |
| 34.2 | 457 | 459 |
| 34.3 | 458 | 461 |
| 34.4 | 459 | 462 |
| 34.5 | 461 | 466 |
| 34.6 | 462 | 467 |
| 34.7 | 466 | 468 |
| 34.8 | 467 | 469 |
| 35.1 | 498 | 499 |
| 35.2 | 498 | 501 |
| 35.3 | 499 | 502 |
| 35.4 | 501 | 504 |
| 35.5 | 502 | 505 |
| 36.4 | 521 | 523 |
| 36.6 | 522 | 524 |
| 37.2 | 554 | 556 |
| 37.4 | 555 | 557 |
| 37.5 | 556 | 558 |
| 38.1 | 578 | 580 |
| 38.3 | 579 | 582 |
| 38.4 | 580 | New construction |
| 43.2 | 641 | 643 |
| 43.3 | 642 | 645 |

The exact crop coordinates and accessible figure descriptions are versioned in `scripts/textbooks/figure-repairs.json`. Source figures can be schematic rather than to scale; geometric conditions come from the statements. For the new 38.4 construction, coordinates C=(0,0), A=(0,12), E=(16,0), B=(0,9), D=(4,0), F=(12,3) verify all three quarter-division conditions. Source box backgrounds are removed; original diagram shading is retained.
