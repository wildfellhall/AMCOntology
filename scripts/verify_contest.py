"""Replay authored mathematics checks; optionally parse every numeric TeX choice.

Run with SymPy. --choices additionally needs antlr4-python3-runtime==4.11.0.
These checks supplement, rather than replace, review of the written proofs.
"""
import argparse
import json
from pathlib import Path

import sympy as sp

from content.contest import STUDIES, CHECKS

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--choices', action='store_true')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
read = lambda name: json.loads((root / 'src/content' / f'{name}.json').read_text())
published = {q['id']: q for q in read('questions')}
published.update({q['id']: q for l in read('lessons') for q in l['examples']})
authored = [q for s in STUDIES for q in s['originalProblems'] + s['examples']]
assert len(authored) == len(CHECKS) == 288
assert len({q['id'] for q in authored}) == len(authored)
for q in authored:
    assert published[q['id']] == q, f"Regenerate stale content: {q['id']}"
print(f'{len(CHECKS)} authored answer checks replayed; generated content matches its sources.')

if args.choices:
    from sympy.parsing.latex import parse_latex
    count = 0
    for q in authored:
        values = [parse_latex(choice.strip('$')) for choice in q['options']]
        expected = sp.sympify(q['verification']['exact'])
        assert sp.simplify(values[q['answer']] - expected) == 0, q['id']
        for i, value in enumerate(values):
            for other in values[:i]:
                assert sp.simplify(value - other) != 0, f"Equivalent choices: {q['id']}"
        count += len(values)
    print(f'{count} TeX answer choices parsed; keys match exact answers and choices are algebraically distinct.')
