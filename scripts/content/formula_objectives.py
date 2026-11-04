"""Concrete objectives for both directions of multiple-choice formula practice.

Each list follows its study's four reviewed relations. These ask for a relation
or its objective, never for a numerical answer. Stable scenario IDs preserve saves.
"""
OBJECTIVES = {
'algebra-transformations': [
 r'You know $x+y$ and $xy$. Find $x^3+y^3$ without solving separately for $x$ and $y$.',
 r'Two roots have sum $s$ and product $p$. With $P_0=2$ and $P_1=s$, build their higher power sums $P_n$ from the preceding two sums.',
 r'Turn $xy+ax+by=N$ into a product of two shifted variables so that integer solutions can be studied through factor pairs.',
 r'Factor $a^4+4b^4$ into two quadratic expressions to investigate when its integer value is composite.',
],
'polynomial-structure': [
 r'A degree-$n$ polynomial has leading coefficient $A$ and roots $r_1,\ldots,r_n$, counted with multiplicity. Reconstruct the polynomial from these data.',
 r'Three nonzero roots have known values of $ab+bc+ca$ and $abc$. Find the sum of their reciprocals without finding the individual roots.',
 r'Replace a polynomial by its lower-degree remainder modulo a nonconstant divisor $D$, keeping an identity valid for every input.',
 r'Remove every odd-degree term of $P(t)$ using only evaluations at $t$ and $-t$.',
],
'sequence-synthesis': [
 r'For $a_{n+1}=ra_n+s$ with $r\ne1$, subtract the fixed point $c=s/(1-r)$ and express $a_n$ directly in terms of $a_1$.',
 r'Rewrite $1/[k(k+h)]$ as a difference of reciprocal terms so a sum can telescope; $h,k,k+h$ are nonzero.',
 r'Add $1+r+\cdots+r^{n-1}$ for a positive integer $n$ and $r\ne1$.',
 r'Test whether three nonzero terms $a,b,c$, in that order, have a common ratio by comparing the middle term with the endpoints.',
],
'integer-constraints': [
 r'Add a constant to $xy+ax+by$ so the expression factors into two linear terms with integer shifts.',
 r'Positive integers $x,y$ and their greatest common divisor are known. Recover their least common multiple from a product identity.',
 r'Turn the integer equation $x^2-y^2=N$ into a factor-pair problem while retaining the parity requirement for integer $x,y$.',
 r'Given the exponent of a prime $p$ in $n$, find its exponent in the positive integer power $n^k$.',
],
'congruence-systems': [
 r'Solve $ax\equiv b\pmod m$ by multiplying by a modular inverse, knowing that $\gcd(a,m)=1$.',
 r'Reduce $ax\equiv b\pmod m$ when a positive integer $d$ divides $a,b,m$, preserving every solution by changing the modulus too.',
 r'Reduce a large power of $a$ modulo a prime $p$ when $p$ does not divide $a$, using a guaranteed exponent period.',
 r'Decide whether the requirements $x\equiv a\pmod m$ and $x\equiv b\pmod n$ are compatible when the positive moduli need not be coprime.',
],
'valuations-divisors': [
 r'Count every copy of a prime $p$ among the factors of $n!$, including the extra copies supplied by multiples of $p^2,p^3,\ldots$.',
 r'Given $n=\prod_i p_i^{a_i}$, count its positive divisors by choosing the exponent of each prime independently.',
 r'Given the prime factorization of a positive integer, add all its positive divisors without listing them individually.',
 r'Find the number of terminal zero digits of a positive integer $N$ written in base $B\ge2$, using the prime powers required by that base.',
],
'geometric-constructions': [
 r'Find a triangle’s area after constructing the perpendicular altitude $h$ to a base of length $b$.',
 r'In triangle $ABC$, a cevian $AD$ divides $BC$ into $BD=m$ and $DC=n$. Relate its length $d$ to the three sides $a=BC,b=CA,c=AB$.',
 r'The three side lengths $a,b,c$ of a triangle are known. Find the length of the median to side $a$.',
 r'Minimize $AP+PB$ with $P$ on a mirror line. Reflect $A$ to $A\prime$, and suppose segment $A\prime B$ meets the permitted part of the line.',
],
'ratio-geometry': [
 r'Two similar triangles have a known ratio of corresponding lengths. Determine their area ratio.',
 r'In triangle $ABC$, the internal angle bisector from $A$ meets $BC$ at $D$. Divide $BC$ using the adjacent side lengths.',
 r'A consistent mass assignment places masses $m_A,m_D$ at the endpoints of a cevian. Find how its balance point $P$ divides $AD$.',
 r'A transversal meets the three side lines of a triangle at $D,E,F$, with one intersection on an extension. Relate the three unsigned side-division ratios.',
],
'circle-synthesis': [
 r'Two secants and a tangent start at the same external point $P$. Relate the near/far secant distances to the tangent length.',
 r'A chord through an interior point $P$ meets a circle at $A,B$. Find $PA\cdot PB$ from the radius $R$ and center distance $OP$.',
 r'A cyclic quadrilateral has known side lengths and one diagonal. Relate these to the other diagonal using the vertex order $A,B,C,D$.',
 r'Express the area of a triangle using its inradius and semiperimeter, or using its three sides and circumradius.',
],
'coordinate-lattice': [
 r'Two sides of a triangle, drawn from the same vertex, have vectors $(a,b)$ and $(c,d)$. Find the triangle’s area.',
 r'Count the lattice points on a polygon’s boundary from the integer coordinate differences along its edges, counting shared vertices only once.',
 r'A simple lattice polygon has $I$ interior lattice points and $B$ boundary lattice points. Find its area.',
 r'Rotate the point $(x,y)$ counterclockwise through a right angle about the origin without changing its distance from the origin.',
],
'spatial-geometry': [
 r'Find the straight interior diagonal of a rectangular box whose mutually perpendicular edge lengths are $a,b,c$.',
 r'Two similar solids have corresponding length ratio $k$. Determine their volume ratio.',
 r'A cone is cut by a plane parallel to its base. Find the frustum volume from its two radii $R,r$ and perpendicular height $h$.',
 r'An immersed object displaces a known volume in a vessel of constant horizontal area $A$. Find the water-level rise when no water spills.',
],
'constrained-counting': [
 r'Choose $k$ positions among $n$ positions in a row with no two chosen positions adjacent; assume $n\ge2k-1$. Count the allowed choices.',
 r'Distribute $N$ identical counters among $r$ labeled boxes, allowing empty boxes and imposing no upper bounds.',
 r'Count elements in at least one of three finite sets when all single, pairwise, and triple intersection sizes are known.',
 r'Count distinct arrangements under a finite symmetry group when different arrangements may have different numbers of equivalent labeled representations.',
],
'combinatorial-identities': [
 r'Count a $k$-element subset of an $n$-element set together with one distinguished member, either by choosing the subset or the distinguished member first.',
 r'Choose $r$ people from two disjoint groups of sizes $a,b$, and reconcile the count obtained by splitting according to how many come from the first group.',
 r'Collapse $\binom rr+\binom{r+1}r+\cdots+\binom nr$ into a single binomial coefficient for integers $n\ge r\ge0$.',
 r'Count paths from $(0,0)$ to $(n,n)$ with unit east/north steps that never rise above the diagonal, subtracting reflected forbidden paths.',
],
'probability-states': [
 r'Update the chance of event $A$ after observing event $B$, given their joint probability and $P(B)>0$.',
 r'Find the probability of an event by splitting the experiment into disjoint, exhaustive branches with known branch and conditional probabilities.',
 r'Find the expected number of remaining trials in a finite-mean absorbing process from its transition probabilities between sufficient states.',
 r'Find the expected number of successful positions by adding their individual success probabilities, even when the successes are dependent.',
],
'invariant-extremal': [
 r'The sum of $n$ real quantities is known. Give a lower bound for the largest quantity by comparing it with their average.',
 r'Place $N$ objects in $k$ groups. Determine the minimum occupancy that must occur in at least one group, using an integer bound.',
 r'Replace the larger of two unequal positive integers by their difference. Identify the divisibility quantity preserved by this move.',
 r'Repeatedly replace two entries $a,b$ with $a+b+ab$. Find a multiplicative quantity that stays unchanged after each replacement.',
],
'inequalities-domains': [
 r'For nonnegative quantities with a fixed sum, bound their product and identify the equality condition.',
 r'For positive $x_1,\ldots,x_n$ with known sum, bound the sum of their reciprocals from below.',
 r'Find the least sum of distances from a real point $x$ to two fixed points $a,b$ on a line, including the full equality interval.',
 r'Decide whether a real quadratic with $a\ne0$ has distinct, repeated, or no real roots before imposing further root-sign restrictions.',
],
'log-trig-synthesis': [
 r'Calculate a logarithm to base $a$ using logarithms to an available base $c$, where both bases are positive and not one.',
 r'Express the sine of twice an angle as a product involving the sine and cosine of the original angle.',
 r'Express $\cos(2\theta)$ using only $\tan\theta$, assuming the tangent is defined.',
 r'Find the maximum of $a\sin\theta+b\cos\theta$ when $\theta$ can be any real angle.',
],
'complex-roots-unity': [
 r'Rewrite the reciprocal of a nonzero complex number using its conjugate and squared modulus.',
 r'Rotate a complex point $z$ counterclockwise through angle $\theta$ about a specified center $c$.',
 r'Reconstruct the monic polynomial whose roots are all powers of a primitive $n$th root of unity, with each root included once.',
 r'Isolate polynomial terms whose integer exponents are divisible by $m$ by averaging powers of a primitive $m$th root of unity.',
],
}
assert len(OBJECTIVES)==18 and all(len(v)==4 for v in OBJECTIVES.values())
