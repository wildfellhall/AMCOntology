"""Keep equivalent relations and their special cases out of competing choices."""
GROUPS=[
 {'Completing a product','Completed product','Product completion'},
 {'Finite geometric sum'},
 {'Telescoping decomposition','Shifted telescoping identity'},
 {'Two-variable AM–GM','Arithmetic–geometric mean'},
 {'Divisor count'}, {'Factorial valuation'}, {'GCD–LCM product','Gcd–lcm product'},
 {'Triangle area','Base–height area','Triangle determinant','Triangle circle-area identities'},
 {'Similarity area scale','Similar-area scaling'},
 {'Tangent–secant power','External point power'},
 {'Stars and bars','Nonnegative composition count'},
 {'Two-set inclusion–exclusion','Three-set inclusion–exclusion','Area union'},
 {'Linearity of expectation','Indicator expectation'},
 {'Conditional probability'}, {'General pigeonhole bound','Pigeonhole occupancy bound','Average lower bound'},
 {'Change of base'}, {'Sine double angle'},
 {'Complex conjugate product','Conjugate reciprocal'},
 {'Root factorization','Unity-root factorization'},
 {'Remainder theorem','Polynomial division'},
]
def group(entry):
 return next((f'group-{i}' for i,g in enumerate(GROUPS) if entry['name'] in g),entry['name'])
