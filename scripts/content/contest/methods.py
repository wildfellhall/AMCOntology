"""Context-specific competing plans. Every rejected plan has a mathematical reason."""
from .common import STUDIES
from copy import deepcopy
import random
# lesson, source item, correct plan, justification, three competing plans with diagnoses
PLANS=[
('algebra-transformations',3,'Complete a product by adding the missing constant, then enumerate admissible factor pairs.','The shifts make the equation equivalent to a fixed product; the original integer restrictions still apply.',[
 ('Treat the equation as linear in both variables and solve a two-equation system.','Only one equation is supplied, and the product term is not linear in the pair of variables.'),
 ('List positive factors of the original right side before changing the left side.','The left side is not yet a product; completing it changes the constant on the right.'),
 ('Solve for one variable over the reals and count every real solution.','The question asks for integer solutions, which require divisibility and bounds.')]),
('algebra-transformations',14,'Find the transformation’s short iterate cycle, then reduce the number of applications by its period.','An exact repeated composition can return to the starting input; the intermediate denominators must remain defined.',[
 ('Multiply the initial value by the number of iterations.','Iteration of a fractional map is not repeated addition of the initial value.'),
 ('Raise the numerator and denominator separately to the iteration count.','Composing a rational function is not the same as taking a power of its value.'),
 ('Replace every intermediate input by the original input.','Each iterate must act on the output of the preceding iterate.')]),
('polynomial-structure',9,'Subtract the integer linear polynomial matching the two values, then factor the two resulting integer roots.','Monic division preserves integer coefficients, yielding a divisibility restriction at the third input and explicit attainable values.',[
 ('Assume the two values determine P as a linear polynomial.','The degree of P is unrestricted; higher-degree terms can vanish at both supplied inputs.'),
 ('Apply only the fact that P(8) is an integer and accept all listed integers.','Integer coefficients impose stronger congruences between values at integer inputs.'),
 ('Interpolate a unique quadratic from the two supplied values.','Two values do not determine a unique quadratic.')]),
('polynomial-structure',5,'Reduce t² to t+1 and track the two coefficients of the remainder as powers increase.','Multiplication by t updates a two-dimensional remainder, so no full tenth-degree expansion is required.',[
 ('Substitute t=1 into the original power to obtain the remainder’s coefficient sum.','One is not a root of the divisor, so the quotient term need not vanish there.'),
 ('Assume the remainder is constant because the dividend is a single monomial.','A quadratic divisor can leave an affine remainder regardless of the dividend’s number of terms.'),
 ('Use t²=1 and reduce the exponent modulo two.','The divisor relation is t²=t+1, not t²=1.')]),
('sequence-synthesis',5,'Add a suitable linear function of n to a_n so that the corrected sequence doubles.','Matching the constant and linear terms removes the nonconstant forcing term.',[
 ('Subtract one fixed constant and assume the n term disappears.','A constant correction cannot cancel an increment that changes with n.'),
 ('Use an arithmetic-series formula because the added term is n.','Each step also doubles the accumulated value, so the increments are not simply added once.'),
 ('Use a geometric progression with first term zero and ratio two.','The nonzero forcing term prevents the zero sequence from satisfying the recurrence.')]),
('sequence-synthesis',14,'Find both fixed points and track the ratio of the distances from them under the update.','For this fractional transformation the distance ratio becomes geometric, and it can be inverted to recover the requested quantity.',[
 ('Subtract only the numerator’s constant and treat the result as geometric.','The denominator still depends on the current term, so the update has not become multiplicative.'),
 ('Replace a_n by its apparent limiting value before evaluating the finite-index target.','A finite term is not its limit, and the target reciprocal amplifies the difference.'),
 ('Assume every fractional recurrence becomes arithmetic after taking reciprocals.','Reciprocation alone leaves a nonconstant fractional update in this problem.')]),
('integer-constraints',11,'Reduce modulo three, then use the forced common factor to construct a smaller positive solution.','The equation is preserved after dividing both variables by three, contradicting a least positive solution.',[
 ('Search all pairs below one thousand and infer there are no larger solutions.','A bounded search cannot exclude an unbounded integer solution.'),
 ('Divide by x+y and conclude x=y.','The equation does not imply equality of the variables, and this division does not produce that relation.'),
 ('Use the real quadratic roots and count both ratios as positive integer solutions.','An irrational real ratio does not produce a pair of positive integers.')]),
('integer-constraints',13,'Impose the square and cube conditions on each prime exponent, then choose the least compatible exponents.','The quotients change prime exponents by different offsets; both congruences must hold at every prime.',[
 ('Make n a sixth power so both quotients are automatically perfect powers.','Dividing by six and ten changes exponents, so a sixth power n does not guarantee either quotient condition.'),
 ('Take lcm(6,10) and stop once both quotients are integers.','Integrality is necessary but does not make the quotients a square and a cube.'),
 ('Minimize the square quotient and cube quotient independently, then multiply their values.','Both quotients come from the same n, so their exponent requirements must be compatible.')]),
('congruence-systems',2,'Divide the coefficient, target, and modulus by their common factor, then solve the reduced congruence.','Canceling in a divisibility statement changes its modulus; all representatives in the requested interval must then be listed.',[
 ('Divide six and eight by two but retain modulus fourteen.','This discards valid residue classes by leaving the period too large.'),
 ('Multiply by an inverse of six modulo fourteen.','Six is not coprime to fourteen, so that inverse does not exist.'),
 ('Find the least positive solution and count it as the only solution.','The reduced congruence repeats, and several representatives lie in the interval.')]),
('congruence-systems',5,'Solve the square condition modulo eight and modulo three, then combine and count the residue classes.','The moduli are coprime, so satisfying both is equivalent to satisfying the original condition modulo twenty-four.',[
 ('Require only that n be odd, because every odd square is one modulo twenty-four.','Odd squares divisible by three are not one modulo twenty-four.'),
 ('Require only that n avoid multiples of three.','Even numbers can pass that condition while failing the condition modulo eight.'),
 ('Divide the number of integers by twenty-four and count one residue per full block.','There are several qualifying residues, and the final incomplete block also matters.')]),
('valuations-divisors',2,'Count the exponents of two and three in the factorial, divide by their exponents in twelve, and take the smaller complete-group count.','Each trailing zero consumes two twos and one three simultaneously.',[
 ('Count factors of five as for ordinary decimal trailing zeros.','The base is twelve, whose prime factors are two and three.'),
 ('Add the available counts of twos and threes.','A base-twelve factor requires both resources together, so the bottleneck is a minimum.'),
 ('Use the exponent of two directly as the number of zeros.','Every factor of twelve consumes two copies of two, not one.')]),
('valuations-divisors',4,'Factor the divisor count into exponent increments and compare all allowed exponent patterns.','Both primes must occur; the possible positive exponent pairs are finite, and their resulting numbers must be compared.',[
 ('Give both primes the same exponent because the minimum must be symmetric.','The primes have different sizes, and equal exponents may not produce twelve divisors.'),
 ('Choose exponents whose sum is twelve.','The divisor count is the product of exponent increments, not the sum of exponents.'),
 ('Use the smallest exponent on each prime independently.','Those exponents must jointly meet the divisor-count constraint.')]),
('geometric-constructions',8,'Reflect one endpoint across the axis and intersect the straight segment from its image to the other endpoint with the axis.','Reflection preserves the broken-path length, and the straight segment attains the triangle-inequality lower bound.',[
 ('Choose the midpoint of the endpoints’ horizontal coordinates.','Different heights mean the minimizing crossing need not be horizontally centered.'),
 ('Use the direct segment joining the two original endpoints.','That segment does not pass through the required axis point.'),
 ('Minimize the first distance alone by choosing its perpendicular foot.','The second distance also changes, so minimizing one summand does not minimize the total.')]),
('geometric-constructions',12,'Use the smaller triangle above the square and express its base and remaining altitude in terms of the square’s side.','Similarity gives one equation because the smaller base equals the square side.',[
 ('Use the formula for a square with two sides lying along the triangle’s legs.','This square is based on the hypotenuse, so that is a different configuration.'),
 ('Set the square side equal to half the hypotenuse.','No midpoint condition or symmetry establishes that length.'),
 ('Subtract the square side from both legs and call the leftovers similar sides.','The square’s height is perpendicular to the hypotenuse, not measured along each leg.')]),
('ratio-geometry',4,'Assign consistent masses to A,B,C from the two side ratios, then balance A against the combined mass at D.','The two ratios determine one compatible mass system; the requested distance ratio is the inverse mass ratio.',[
 ('Use the centroid’s two-to-one ratio because two cevians intersect.','The cevians are not both medians, so the centroid theorem does not apply.'),
 ('Multiply BD/DC and CE/EA and use that product directly as AP/PD.','The intersection depends on combined masses or area sums, not just the product of these two ratios.'),
 ('Use only BD/DC to locate P along AD.','The position of E changes the second line and therefore changes P.')]),
('ratio-geometry',6,'Prove the triangles at the two parallel bases similar, divide the total height in their base ratio, and compute the smaller area.','Their corresponding heights add to the given trapezoid height.',[
 ('Place O halfway between the bases because diagonals bisect each other.','Diagonals bisect each other in a parallelogram, not in a general trapezoid.'),
 ('Use the full trapezoid height as the altitude of AOB.','O lies inside the trapezoid, so its distance to AB is only part of the total height.'),
 ('Use the base ratio itself as the area ratio of the similar triangles.','Similar areas scale by the square of the length ratio.')]),
('circle-synthesis',3,'Compute outside times whole on the first secant, find the second whole length, then remove its outside part.','Point power uses distances from the external point to both intersections.',[
 ('Equate the products of the outside and inside portions of each secant.','The second factor must be the whole secant length, not just the inside portion.'),
 ('Equate the two full secant lengths because both cross the same circle.','Different lines through an external point generally have different full lengths.'),
 ('Find the second whole length and report it as CD.','CD is only the internal segment; PC must be subtracted.')]),
('circle-synthesis',4,'Drop the common-chord perpendicular to the center line and subtract the two radius-square equations.','The shared half-chord term cancels, locating the chord before its length is found.',[
 ('Bisect the center distance because a common chord always passes through that midpoint.','That midpoint claim requires equal radii, which are not given here.'),
 ('Add the radii and use the sum as the chord length.','A common chord is determined by the intersection geometry, not the sum of radii.'),
 ('Use the center distance as a chord in either circle.','The other center is not generally on the circle.')]),
('coordinate-lattice',1,'Compute the triangle area and boundary gcd count, then solve Pick’s theorem for the strictly interior count.','The boundary count must include each vertex exactly once.',[
 ('Count all integer points in the bounding rectangle and divide by two.','The sloping sides and boundary exclusions prevent that uniform halving.'),
 ('Use area as the number of interior lattice points.','Pick’s theorem contains a boundary correction; area and point count are different quantities.'),
 ('Add closed-edge point counts without correcting shared vertices.','Each vertex would be counted twice in the boundary total.')]),
('coordinate-lattice',14,'Write the absolute determinant area equation, solve both signs, and keep only lattice points inside the box.','The two signs represent the two sides of the fixed base.',[
 ('Drop the absolute value and solve only the positive determinant equation.','Valid points on the other side of the base would be omitted.'),
 ('Treat the sloping base’s horizontal projection as its full length.','That projection is not the actual base, and the corresponding vertical distance is not its altitude.'),
 ('Count every integer point on the two infinite area lines.','The coordinate box restricts both lines to finite segments.')]),
('spatial-geometry',2,'Compare straight segments in each of the three basic opposite-corner unfoldings and take the shortest feasible one.','Unfolding preserves surface distances while making the candidate path planar.',[
 ('Use the space diagonal from the three-dimensional Pythagorean theorem.','That segment goes through the box interior, which the ant cannot use.'),
 ('Add all three edge lengths because a surface path must follow edges.','The ant may cross face interiors, producing shorter paths.'),
 ('Choose one unfolding arbitrarily because all three have equal dimensions.','The box is not a cube; the three unfolded diagonals have different lengths.')]),
('spatial-geometry',11,'Compare horizontal annular cross-sections with disks of a smaller sphere, then use equal-section volume comparison.','Subtracting the hole radius squared from each sphere section leaves the section formula of a sphere of radius four.',[
 ('Subtract a cylinder of the full sphere diameter from the sphere volume.','The removed solid includes spherical caps and does not have that constant cylindrical volume.'),
 ('Subtract only a cylinder of the remaining ring’s height and ignore the caps.','The drilling removes the end caps as well as the central cylinder segment.'),
 ('Scale the original sphere volume by the ratio of the two radii.','Volume does not scale linearly, and the remaining solid is not a scaled copy of the original sphere.')]),
('constrained-counting',6,'Count all nonnegative compositions, subtract each cap violation, and restore pairwise overlaps.','Two variables can simultaneously be six, so the overlapping forbidden sets are nonempty.',[
 ('Subtract three single-violation counts and stop.','This removes double violations twice, requiring them to be restored.'),
 ('Shift a violating variable by five.','The forbidden region starts at six because five is still allowed.'),
 ('Divide an unrestricted stars-and-bars count by three factorial.','The variables are labeled, and permutation symmetry does not enforce upper bounds.')]),
('constrained-counting',13,'Average the numbers of colorings fixed by the identity, half-turn, and two quarter-turns.','Colorings have different orbit sizes, which the fixed-point average accounts for.',[
 ('Divide all labeled colorings by four because every coloring has four distinct rotations.','Monochromatic and alternating colorings have fewer distinct rotations.'),
 ('Fix the first bead’s color and multiply by three after dividing by rotations.','A repeated-color necklace has no uniquely distinguished bead to fix.'),
 ('Identify reflected necklaces while counting only rotations.','The statement keeps reflections distinct; adding those symmetries changes the equivalence relation.')]),
('combinatorial-identities',5,'Split k² into one-mark and two-distinct-mark counts, then toggle an unmarked element to cancel opposite signs.','The toggle preserves the marks, reverses parity, and is a fixed-point-free involution.',[
 ('Remove the alternating signs because every binomial coefficient is positive.','The signs are part of the sum and determine its cancellation.'),
 ('Pair k with 6-k and assume their signs are opposite.','Six is even, so k and 6-k have the same parity.'),
 ('Replace k² by k(k-1) and omit the remaining k term.','That changes the weight; both marked interpretations must be included.')]),
('combinatorial-identities',11,'Interpret the coefficient as five exponents from zero through two summing to five, then exclude cap violations.','Every factor contributes one bounded exponent, giving a precise composition model.',[
 ('Use unrestricted stars and bars without upper bounds.','A factor cannot contribute x³ or a higher power.'),
 ('Choose five of the fifteen written terms without regard to their factors.','Exactly one term must come from each factor, not an arbitrary subset of all terms.'),
 ('Treat each selected x² as contributing only one to the exponent total.','Exponents add with their actual values; x² contributes two.')]),
('probability-states',5,'Track whether there is one trailing head, and write a remaining-expectation equation for each nonabsorbing state.','The last symbol is exactly the memory needed for the consecutive-head target.',[
 ('Track only the total number of heads observed so far.','Two heads separated by tails do not complete the target.'),
 ('Split tosses into disjoint pairs and use a geometric waiting time for HH pairs.','The first HH can overlap those artificial pair boundaries.'),
 ('Multiply the reciprocal of the HH probability by one toss.','The overlapping waiting process is not an independent one-toss Bernoulli trial.')]),
('probability-states',10,'At odd times track one-odd versus three-odd box states and derive their two-placement transition probabilities.','This retains the relevant parity information while removing exact occupancies.',[
 ('Multiply three independent one-half probabilities for the three box parities.','The total number of balls couples the parities, and finite-time parity probabilities are not exactly one-half.'),
 ('Assume all four possible odd-time parity patterns are equally likely after nine placements.','They approach balance but need not be exactly equally likely at a finite time.'),
 ('Count only assignments with equal occupancies in all boxes.','All-odd occupancy permits unequal counts such as one, one, and seven.')]),
('invariant-extremal',2,'Partition numbers by their odd part, force two in one divisibility chain, and exhibit a largest avoiding interval.','The partition proves the guarantee and the interval of large numbers proves sharpness.',[
 ('Partition only by parity and conclude two of the same parity divide each other.','Equal parity does not imply divisibility.'),
 ('Find one pair of divisible numbers and claim any equally sized selection contains such a pair.','An example of possibility is not a guarantee for every selection.'),
 ('Use consecutive pairs as pigeonholes, since one consecutive number always divides the other.','Consecutive positive integers usually do not divide one another.')]),
('invariant-extremal',9,'Use even tail parity as a necessary condition, then fix positions left to right to prove it is sufficient.','The final unfixed coin is forced by parity after the first five positions agree with the target.',[
 ('Count all even-tail configurations and stop without showing they are reachable.','An invariant alone gives an upper bound; it need not characterize reachability.'),
 ('Assume the number of tails itself is unchanged by every move.','Flipping two equal faces changes the tail count by two.'),
 ('Use the number of legal first moves as the number of reachable configurations.','Multiple moves can reach configurations not available in one step.')]),
('inequalities-domains',13,'Check the usual inequality’s equality point against the interval, then factor the difference from the attainable endpoint value.','The unrestricted lower bound is not attained on the specified interval.',[
 ('Report the AM–GM bound four without checking its equality point.','Equality requires x=√2, which is outside [2,5].'),
 ('Minimize x² and 4/x² independently at their separate endpoints and add those values.','The two minima occur at different x-values and cannot be combined.'),
 ('Assume the largest x minimizes the sum because the reciprocal term decreases.','The x² term increases and dominates; both terms must be considered.')]),
('inequalities-domains',14,'Show that transferring one unit between entries differing by at least two increases the product, then use the most balanced integer triple.','This local improvement preserves positivity and the total and proves the discrete optimum.',[
 ('Use the equal real triple and report the continuous AM–GM value.','The equal value eleven-thirds is not an integer.'),
 ('Make one variable as large as possible because it appears in the product.','That shrinks the other positive factors and can lower the product.'),
 ('Round each equal real value independently to the nearest integer.','Independent rounding can change the required sum.')]),
('log-trig-synthesis',1,'Set t equal to one logarithm, replace the reversed-base logarithm by its reciprocal, and recover x from both roots.','The common-base relation creates a quadratic, with t nonzero and x in the original domain.',[
 ('Combine the two logarithms by adding their arguments.','Logarithm sums correspond to products only with a common base; these bases differ.'),
 ('Use the sum of the quadratic roots directly as the requested sum of x-values.','The quadratic variable is a logarithm of x, not x itself.'),
 ('Discard a fractional logarithm root because x must be an integer.','The statement allows positive real x and imposes no integrality condition.')]),
('log-trig-synthesis',10,'Use the double-angle identity, factor, and solve both zero-factor branches on the given interval.','Keeping the cosine-zero branch avoids losing valid solutions.',[
 ('Divide by cosθ immediately and solve only sinθ=1/2.','The divisor can vanish, and those zero-cosine angles satisfy the original equation.'),
 ('Use only the principal inverse-sine value for each branch.','The interval contains other angles with the same sine or cosine value.'),
 ('Count zero and 2π as separate solutions whenever a full cycle is given.','The interval excludes 2π, and neither endpoint automatically satisfies the equation.')]),
('complex-roots-unity',5,'Pair each nontrivial root with its inverse and simplify each pair of rational terms.','Each pair contributes one, and no nontrivial seventh root is self-inverse.',[
 ('Use the ordinary sum of the roots as the sum of their reciprocal differences.','The nonlinear transformation 1/(1-ζ) does not preserve the root sum.'),
 ('Include ζ=1 to complete the root set before summing.','That introduces a zero denominator.'),
 ('Treat each root as a real number of modulus one and replace it by one.','Modulus one does not mean the complex number equals one.')]),
('complex-roots-unity',11,'Average polynomial evaluations at 1,-1,i,-i to retain precisely exponents divisible by four.','The fourth-root power sum is four on the desired residue class and zero on the others.',[
 ('Divide the total coefficient sum by four because all residue classes have equal sums.','Finite binomial rows need not distribute their coefficients equally across residue classes.'),
 ('Average only the evaluations at 1 and -1.','That filters even exponents, including exponents congruent to two modulo four.'),
 ('Evaluate only at i and take the real part without averaging.','That alternates signs between the two even residue classes instead of keeping just one.')]),
]
METHODS=[]
for lid,num,correct,reason,wrong in PLANS:
 node=next(s for s in STUDIES if s['id']==lid)
 source=next(q for q in node['originalProblems'] if q['id'].removesuffix('-choices-v2')==f'{lid}-q{num:02}')
 opts=[(correct,reason)]+wrong
 random.Random(lid+str(num)+'method-v2').shuffle(opts)
 METHODS.append(dict(id=f'{lid}-method-{num:02}',lessonId=lid,kind='method',stem=source['stem'],prompt='Which plan is valid as written?',options=[v for v,_ in opts],answer=next(i for i,(v,_) in enumerate(opts) if v==correct),optionRationales=[r for _,r in opts],solution=[correct,reason]+deepcopy(source['solution']),hints=['Compare the assumptions of the plans with the exact conditions in the problem.','Check whether a plan changes the domain, loses a case, or counts the same object more than once.'],misconception=wrong[0][1],level=source['level'],family=source['family'],source=dict(kind='original',title='AMCOntology competition method study'),decision=source['decision']))
assert len(METHODS)==36
