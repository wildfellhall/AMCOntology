FORMULAS=[]
def f(id,tex,name,use,condition):
 FORMULAS.append(dict(lessonId=id,tex=tex,name=name,use=use,condition=condition))
f('fractions',r'\frac ab+\frac cd=\frac{ad+bc}{bd}','Common denominator','adding two fractions with possibly different denominators','The denominators b and d are nonzero.')
f('ratios',r'V_{\mathrm{new}}=V_{\mathrm{old}}(1+r)','Percentage change','updating a quantity by a relative change r','An increase uses positive r; a decrease uses negative r, expressed as a fraction rather than a percent number.')
f('rates',r'v_{\mathrm{avg}}=\frac{2uv}{u+v}','Equal-distance average speed','averaging two positive speeds over equal distances','The two traveled distances are equal and there is no extra waiting time.')
f('exponents',r'\sqrt{x^2}=|x|','Square root of a square','recovering the nonnegative magnitude of a real number','x is real; a square root denotes the principal nonnegative root.')
f('linear',r'x=\frac{ce-bf}{ae-bd}','Two-equation elimination','solving ax+by=c and dx+ey=f for x','The determinant ae-bd is nonzero.')
f('statistics',r'\bar x=\frac{ma+nb}{m+n}','Weighted mean','combining groups of sizes m,n and means a,b','The group sizes are positive; the group totals are ma and nb.')
f('identities',r'x^2+y^2=(x+y)^2-2xy','Symmetric squares','finding a sum of squares from a sum and a product','The identity holds for real or complex x and y.')
f('quadratics',r'x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}','Quadratic formula','solving ax squared plus bx plus c equals zero','The leading coefficient a is nonzero; real roots require a nonnegative discriminant.')
f('vieta',r'r+s=-\frac ba,\quad rs=\frac ca','Vieta for a quadratic','reading the sum and product of the roots from coefficients','r,s are roots of ax squared plus bx plus c, counted with multiplicity, and a is nonzero.')
f('polynomials',r'P(x)=(x-a)Q(x)+P(a)','Remainder theorem','finding the constant remainder when dividing P(x) by x-a','P and Q are polynomials and the divisor is the linear polynomial x-a.')
f('arithmetic',r'S_n=\frac n2\bigl(2a+(n-1)d\bigr)','Arithmetic sum','adding n terms starting at a with constant difference d','n is a positive integer and the common difference is fixed.')
f('geometric',r'S_n=\frac{a(1-r^n)}{1-r}','Finite geometric sum','adding n terms starting at a with constant ratio r','n is a positive integer and r is not one; r=1 instead gives na.')
f('telescoping',r'\frac1{k(k+1)}=\frac1k-\frac1{k+1}','Telescoping decomposition','turning consecutive-denominator fractions into cancelling differences','k is neither zero nor negative one.')
f('inequalities',r'\frac{a+b}{2}\ge\sqrt{ab}','Two-variable AM–GM','bounding a sum or product of two nonnegative quantities','a,b are nonnegative; equality holds exactly when a=b.')
f('factors',r'\tau\!\left(\prod p_i^{a_i}\right)=\prod(a_i+1)','Divisor count','counting positive divisors from a prime factorization','The p values are distinct primes and the exponents are nonnegative integers.')
f('divisibility',r'v_p(n!)=\sum_{j\ge1}\left\lfloor\frac n{p^j}\right\rfloor','Factorial valuation','counting how many factors of a prime occur in a factorial','p is prime and n is a nonnegative integer; terms eventually become zero.')
f('gcd',r'\gcd(a,b)\operatorname{lcm}(a,b)=ab','GCD–LCM product','connecting two positive integers to their greatest divisor and least multiple','a and b are positive integers; this product relation is for two numbers.')
f('modular',r'a\equiv b\pmod m\iff m\mid(a-b)','Congruence','expressing that two integers have the same remainder','The modulus m is a positive integer and a,b are integers.')
f('diophantine',r'xy+ax+by+ab=(x+b)(y+a)','Completing a product','turning a two-variable integer equation into factor pairs','The identity is algebraic; count only factor pairs meeting the original integer and sign restrictions.')
f('bases',r'(d_k\cdots d_0)_b=\sum_{j=0}^k d_jb^j','Place value','interpreting a numeral in an integer base','b is at least 2, digits lie from zero through b-1, and the leading digit is nonzero for a fixed-length numeral.')
f('floor',r'\lfloor x\rfloor=n\iff n\le x<n+1','Floor interval','replacing a floor equation by a half-open interval','n is an integer and x is real.')
f('angles',r'A+B+C=180^\circ','Triangle angle sum','connecting the three interior angles of a Euclidean triangle','A,B,C are interior angles of a nondegenerate triangle, measured in degrees.')
f('triangle-area',r'K=\frac12bh','Triangle area','measuring a triangle with a base and its perpendicular height','h is the altitude to the line containing base b, not generally a slanted side.')
f('right-triangles',r'a^2+b^2=c^2','Pythagorean theorem','finding a missing side of a right triangle','a,b are legs and c is the hypotenuse opposite the right angle.')
f('similarity',r'\frac{K_2}{K_1}=\left(\frac{\ell_2}{\ell_1}\right)^2','Similarity area scale','converting corresponding length ratios into area ratios','The two figures are similar and the lengths correspond.')
f('quadrilaterals',r'K=\frac{(a+b)h}{2}','Trapezoid area','measuring a trapezoid using its two parallel bases and height','a,b are the parallel base lengths and h is their perpendicular separation.')
f('circles',r'K_{\mathrm{sector}}=\frac{\theta}{360^\circ}\pi r^2','Sector area','finding the fraction of a circle occupied by a sector','The central angle theta is in degrees and r is the circle radius.')
f('circle-power',r'PT^2=PA\cdot PB','Tangent–secant power','connecting a tangent to an exterior-and-whole secant product','P is outside the circle, T is the tangency point, and A,B are near and far intersections on one secant ray.')
f('polygons',r'D=\frac{n(n-3)}2','Polygon diagonal count','counting diagonals in a convex polygon','n is the number of vertices, with n at least 3; each unordered diagonal is counted once.')
f('coordinates',r'd=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}','Coordinate distance','finding the distance between two points in the plane','The coordinate axes are perpendicular and use the same distance unit.')
f('solids',r'V_{\mathrm{cone}}=\frac13\pi r^2h','Cone volume','measuring the volume of a cone','r is the base radius and h is perpendicular height, not slant height.')
f('composite',r'[A\cup B]=[A]+[B]-[A\cap B]','Area union','combining two overlapping measurable planar regions','The intersection is included in both individual areas and removed once.')
f('counting',r'N=a_1a_2\cdots a_k','Product rule','counting outcomes built through stages with fixed numbers of choices','At stage j, every permitted earlier choice allows a_j continuations.')
f('permutations',r'N=\frac{n!}{a_1!\cdots a_k!}','Multiset arrangements','ordering objects with repeated identical types','The multiplicities a_1 through a_k sum to n; objects of a type are indistinguishable.')
f('combinations',r'\binom nk=\frac{n!}{k!(n-k)!}','Combinations','selecting k distinct objects without order from n objects','n,k are integers with 0≤k≤n and the original n objects are distinct.')
f('inclusion',r'|A\cup B|=|A|+|B|-|A\cap B|','Two-set inclusion–exclusion','counting members in at least one of two finite sets','The intersection consists of members counted in both individual sets.')
f('stars-bars',r'N=\binom{n+k-1}{k-1}','Stars and bars','distributing n identical objects into k labeled boxes allowing empty boxes','n is nonnegative and k is positive; there are no upper bounds on box counts.')
f('geometric-counting',r'N=\binom{a+b}{a}','Monotone paths','counting unit right/up paths from the origin to (a,b)','a,b are nonnegative integers and there are no forbidden vertices or edges.')
f('recurrence',r'f(n)=f(n-1)+f(n-2)','One-or-two-step recurrence','counting stair climbs whose last step has length one or two','Use f(0)=f(1)=1 and the recurrence for n≥2; the cases are disjoint and exhaustive.')
f('probability',r'P(A)=\frac{|A|}{|\Omega|}','Finite uniform probability','turning a favorable-outcome count into a probability','The elementary outcomes in the finite sample space are equally likely.')
f('conditional',r'P(A\mid B)=\frac{P(A\cap B)}{P(B)}','Conditional probability','restricting a probability calculation to an observed event B','P(B) is positive; independence is not assumed.')
f('geometric-probability',r'P(A)=\frac{\operatorname{area}(A)}{\operatorname{area}(\Omega)}','Uniform area probability','measuring a probability through a favorable region','The point is uniform on a finite positive-area region and A lies inside it.')
f('expectation',r'E[X_1+\cdots+X_n]=\sum_{j=1}^n E[X_j]','Linearity of expectation','finding the average of a sum of random contributions','The expectations exist; the random variables do not need to be independent.')
f('invariants',r'I(\text{after})=I(\text{before})','Invariant','certifying that every allowed move preserves a chosen quantity','The equality must hold for every legal move, not only selected examples.')
f('extremal',r'\max_j n_j\ge\left\lceil\frac Nk\right\rceil','General pigeonhole bound','guaranteeing a crowded box when N objects occupy k boxes','The k boxes partition the objects, k is positive, and their sizes sum to N.')
f('logarithms',r'\log_bx=\frac{\log_cx}{\log_cb}','Change of base','expressing a logarithm using a different common base','x>0; b,c are positive and neither base equals one.')
f('trigonometry',r'\sin2\theta=2\sin\theta\cos\theta','Sine double angle','connecting a doubled angle to a product of sine and cosine','The angle uses one consistent unit; the identity holds for every real angle.')
f('trig-geometry',r'c^2=a^2+b^2-2ab\cos C','Cosine law','relating two sides and their included angle to the third side','C is the angle between sides a and b and is opposite side c.')
f('complex',r'z\overline z=|z|^2=a^2+b^2','Complex conjugate product','converting a complex product into a real squared magnitude','z=a+bi with real a,b; its conjugate is a-bi.')
f('binomial',r'(a+b)^n=\sum_{k=0}^n\binom nk a^{n-k}b^k','Binomial theorem','finding terms and coefficients in a power of a two-term sum','n is a nonnegative integer; k counts the factors contributing the second term.')

# Incorrect plans encode common mathematical errors for contrast with a valid plan.
BAD_PLANS={
'fractions':['Add numerators and denominators separately.','Cancel terms across addition as though they were factors.','Evaluate every outer operation before the inner denominator.'],
'ratios':['Treat every successive percentage as a fraction of the original amount.','Reverse a percentage decrease by increasing by the same percentage.','Add the ratio numbers directly to the physical quantities.'],
'rates':['Average all given speeds without considering the times.','Add completion times to obtain the time for simultaneous work.','Treat time and distance as interchangeable quantities.'],
'exponents':['Replace the square of a sum with the sum of the squares.','Treat the square root of a square as the original signed value in every case.','Multiply exponents whenever powers with a common base are multiplied.'],
'linear':['Change just one side of an equation to isolate a variable.','Assume the two variables are equal without using the constraints.','Drop constant terms from both equations before solving.'],
'statistics':['Use the mean and median as interchangeable values.','Average group means without weighting by group size.','Change a mean without updating the number of values.'],
'identities':['Drop every cross term when expanding a square or cube.','Cancel additive terms as if they were common factors.','Set every factor equal to zero even when their product is nonzero.'],
'quadratics':['Declare all quadratics to have exactly two distinct real solutions.','Accept every root obtained after squaring without checking the original equation.','Use the discriminant itself as the value of each root.'],
'vieta':['Take the root sum to be b/a for ax squared plus bx plus c.','Ignore the leading coefficient when applying Vieta.','Replace the sum of squared roots with the square of their sum.'],
'polynomials':['Assume the constant coefficient is always the remainder for every linear divisor.','Drop the leading coefficient from a nonmonic root factorization.','Infer that two polynomials agree everywhere from just one matching input.'],
'arithmetic':['Use n common-difference jumps to reach the nth term from the first.','Add the endpoints without multiplying by the number of terms.','Count an inclusive integer interval by subtracting endpoints only.'],
'geometric':['Replace a fixed multiplicative ratio by an additive difference.','Use an infinite-sum formula for a finite sum without checking the tail.','Apply a geometric-sum formula with denominator zero when the ratio is one.'],
'inequalities':['Apply nonnegative-variable AM–GM to arbitrary negative quantities.','Treat a numerical bound as an attainable optimum without checking equality.','Ignore an integer restriction when choosing the equality case.'],
'factors':['Count only nonzero exponents when enumerating divisors.','Treat 1 as a prime factor.','Declare a number square when its total exponent sum is even, regardless of each prime.'],
'divisibility':['Count multiples of p in a factorial and ignore extra factors from higher powers.','Use the same trailing-zero count in every numeral base.','Apply a divisibility test for 9 to every possible divisor.'],
'gcd':['Use the product of two integers as their LCM in every case.','Use the maximum prime exponents to form the GCD.','Discard the coprimality condition after removing a specified common divisor.'],
'modular':['Cancel any coefficient while leaving the modulus unchanged.','Treat an exponent remainder of zero as a residue value of zero.','Reduce an exponent modulo the modulus without establishing a power cycle.'],
'diophantine':['Count every real solution as an integer solution.','Include factor pairs that violate the original positivity restrictions.','Treat ordered factor pairs as unordered without adjusting the count.'],
'bases':['Read a base-b numeral as the same decimal numeral.','Allow a digit equal to the numeral base.','Allow a leading zero when counting fixed-length numbers.'],
'floor':['Round every negative number toward zero to compute its floor.','Distribute a floor across addition in all cases.','Solve each piecewise equation without checking its input interval.'],
'angles':['Measure the diagram and assume those measured values are exact.','Assume visually parallel lines are parallel without a given or proof.','Use 360 degrees as the interior-angle sum of a triangle.'],
'triangle-area':['Use a slanted side as the height without checking perpendicularity.','Use the full perimeter in place of the semiperimeter in Heron’s formula.','Square a base ratio even when two triangles share the same height.'],
'right-triangles':['Add leg lengths to obtain the hypotenuse.','Apply the Pythagorean theorem without establishing a right angle.','Use the full base where an altitude has bisected it.'],
'similarity':['Use a length scale directly as the area scale.','Match sides only by how close they appear in the drawing.','Apply a part-to-part ratio as a part-to-whole similarity factor.'],
'quadrilaterals':['Assume every parallelogram has equal diagonals.','Use half the diagonal product for every quadrilateral without checking perpendicularity.','Use a slanted trapezoid side as its height.'],
'circles':['Use the diameter as the radius in the area formula.','Set an inscribed angle equal to its intercepted arc.','Use a full chord where a perpendicular from the center has bisected it.'],
'circle-power':['Multiply only the exterior and interior secant portions.','Add chord-segment lengths instead of equating their products.','Assume opposite angles of every cyclic quadrilateral are equal.'],
'polygons':['Count every vertex pair as a diagonal, including sides.','Use equal side lengths alone to conclude that a polygon is regular.','Divide the total interior-angle sum by n minus two to find a regular polygon’s angle.'],
'coordinates':['Use absolute coordinates instead of coordinate differences for distance.','Treat a vertical line as having slope zero.','Apply shoelace to vertices in a scrambled rather than boundary order.'],
'solids':['Use the square of a length scale to scale volume.','Use a cone’s slant height as its perpendicular height.','Treat an interior diagonal as a path constrained to a surface.'],
'composite':['Subtract lengths instead of subtracting the corresponding areas.','Add overlapping areas without correcting for the intersection.','Assume equal-looking regions have equal area without a geometric reason.'],
'counting':['Add the numbers of choices for successive independent stages.','Combine overlapping cases without correcting their duplicate outcomes.','Count an ordered outcome as an unordered selection.'],
'permutations':['Divide every circular arrangement by two even when reflections are distinct.','Treat identical repeated letters as distinct in the final count.','Use an adjacency block but ignore the order of the objects inside it.'],
'combinations':['Count every ordering of a committee as a new committee.','Assign a chair from the full population after choosing a committee.','Apply a combinations formula to an ordered outcome without accounting for order.'],
'inclusion':['Add all set sizes without subtracting intersections.','Treat exactly one membership as equivalent to at least one membership.','Subtract pairwise intersections but never restore a triple intersection.'],
'stars-bars':['Apply the nonnegative formula unchanged to strictly positive variables.','Treat labeled boxes as indistinguishable.','Ignore upper bounds when using the unrestricted stars-and-bars count.'],
'geometric-counting':['Choose grid cells in place of the boundary lines of a rectangle.','Treat every three-point selection as a triangle even when the points are collinear.','Count a path through a required point by adding its before and after path counts.'],
'recurrence':['Guess a pattern from two small values and treat that as a proof.','Write a recurrence without specifying any base cases.','Add overlapping last-step cases as if they were disjoint.'],
'probability':['Treat dice sums as equally likely elementary outcomes.','Mix ordered favorable outcomes with an unordered total.','Assume the probabilities of an event and its complement are equal.'],
'conditional':['Keep the same denominator after a draw without replacement.','Treat mutually exclusive positive-probability events as independent.','Ignore the given condition and calculate the unconditional probability.'],
'geometric-probability':['Use an area ratio without checking that the sampling is uniform.','Replace two independent coordinates with one interval sample space.','Use boundary length instead of area for a uniform planar point.'],
'expectation':['Require an expected value to be an outcome possible in one trial.','Refuse to add expectations whenever the variables are dependent.','Multiply expectations of dependent variables as a general rule.'],
'invariants':['Check a few moves and assume the quantity is invariant under every legal move.','Conclude a target is reachable merely because it has the same invariant value.','Track a changing quantity as though its value were preserved.'],
'extremal':['Give an average-case estimate as a worst-case guarantee.','Declare a threshold sharp without showing that one fewer can fail.','Use overlapping boxes without controlling how each object is assigned.'],
'logarithms':['Split the logarithm of a sum into a sum of logarithms.','Accept a solution with a nonpositive logarithm argument.','Treat a logarithm base of one as valid.'],
'trigonometry':['Divide by sine without checking its zero cases.','Use degrees and radians interchangeably in one equation.','Find one angle and ignore the function’s periodicity.'],
'trig-geometry':['Pair each side with an adjacent rather than opposite angle in the sine law.','Assume an SSA specification always determines exactly one triangle.','Remove the cosine-law cross term when the included angle is not a right angle.'],
'complex':['Treat i squared as positive one.','Assume modulus distributes over complex addition.','Add angles and also add magnitudes when multiplying complex numbers.'],
'binomial':['Use the selected-term index as the final exponent without checking the two monomials.','Omit powers of numerical coefficients when extracting a term.','Accept a noninteger selection index in a finite binomial expansion.']}
BAD_PLANS['telescoping']=['Cancel terms before checking which endpoints survive.','Treat a gap-two telescoping difference as leaving only one term at each end.','Replace a sum of squares by the square of the sum.']
