"""Authored explanations accompanying attributed, locally supplied source examples."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
plates=[]
def steps(rows):
    return [dict(zip(['title','math','text','diagram'],r)) for r in rows]
def add(id,title,domain,section,formula,condition,lesson,scene,example,prompt,derivation,worked,trap,check,answer,track=10):
    plates.append(dict(id=id,title=title,domain=domain,section=section,formula=formula,condition=condition,lesson=lesson,scene=scene,example=example,prompt=prompt,derivation=steps(derivation),worked=steps(worked),trap=trap,check=check,answer=answer,track=track))
add('circular','Circular arrangements','Counting & probability','1.2',r'(n-1)!',
'Distinct objects on a circle; rotations are equivalent and reflections remain distinct.','permutations','circle','1.2',
'Six physicists sit around a circular table. Three are mutual enemies and no two enemies may be adjacent. How many arrangements are possible, with rotations identified?',[
('Begin with a row',r'n!', 'Label every seat temporarily. The first seat has n choices, the next n−1, and so on.','Six labeled seats distinguish rotations.'),
('Identify rotations',r'\frac{n!}{n}', 'Each circular arrangement appears n times in the labeled-seat count, once for each possible position of a fixed person.','The same circular order rotates through the seats.'),
('Fix an anchor',r'\frac{n!}{n}=(n-1)!', 'Equivalently, keep one person at the top and permute the others. No rotational duplication remains.','One seat becomes the fixed anchor.'),
('Check the symmetry',r'\text{reflections remain distinct}', 'Clockwise and counterclockwise orders generally differ. Divide by two only when the problem explicitly identifies reflections and no stabilizer changes the count.','The orientation is retained.')],[
('Force alternation',r'E\,F\,E\,F\,E\,F', 'The three enemies need three separating friends. With only six people, enemies and friends must alternate.','Enemy seats alternate with friend seats.'),
('Anchor a friend',r'2!', 'Fix Gauss at the top to remove rotations. Arrange the other two friends in the two remaining friend seats.','Gauss is fixed; two friend seats remain.'),
('Place the enemies',r'3!', 'Each of the three enemy seats is separated from the others. All six permutations of the enemies now work.','Three separated seats receive the enemies.'),
('Combine the choices',r'2!\cdot3!=12', 'The choices are independent, and the fixed anchor makes each arrangement unique.','There are twelve circular arrangements.')],
'Dividing by six after already fixing an anchor removes the same rotational duplication twice.',
'Why must there be exactly one friend between consecutive enemies?', 'There are three gaps between enemies and exactly three friends. Every gap must receive at least one friend, so each receives exactly one.')
add('stars-bars','Stars, bars & upper bounds','Counting & probability','1.13',r'\#\{x_1+\cdots+x_k=N\}=\binom{N+k-1}{k-1}',
'The variables are nonnegative integers; the bins are distinguishable. Upper bounds require extra work.','starsbars','bars','5.4',
'In how many ordered outcomes of five ordinary six-sided dice is the sum 24?',[
('Encode a distribution',r'x_1+\cdots+x_k=N', 'Write N stars in a row. Insert k−1 separators; the stars between successive separators give each variable.','Stars are separated into labeled bins.'),
('Choose separator positions',r'N+k-1\text{ positions}', 'Stars and bars occupy N+k−1 positions. Bars may be consecutive, representing an empty bin.','Separator positions become the objects being chosen.'),
('Count the encodings',r'\binom{N+k-1}{k-1}', 'Choose the positions of the bars. Every nonnegative solution has one encoding and every encoding has one solution.','Every arrangement corresponds to one distribution.'),
('Handle restrictions',r'x_i\ge a_i\ \Longrightarrow\ y_i=x_i-a_i', 'Subtract lower bounds first. For upper bounds, subtract invalid encodings with inclusion–exclusion; stars and bars alone does not enforce them.','Shifting a lower bound frees the remaining stars.')],[
('Count missing pips',r'y_i=6-d_i,\qquad \sum y_i=6', 'A total of 30 would mean all sixes. A total of 24 has six missing pips, with each deficit between zero and five.','Six deficit stars are placed in five bins.'),
('Temporarily ignore the ceiling',r'\binom{6+5-1}{4}=210', 'Count all nonnegative deficit vectors. These include vectors with a deficit of six, which would mean a die showing zero.','Four separators among ten positions give 210 encodings.'),
('Remove impossible dice',r'5\binom{4}{4}=5', 'If one deficit is at least six, all six missing pips are on that die. There are five such vectors; two cannot occur together.','The five all-in-one-bin cases are crossed out.'),
('Return to ordered outcomes',r'210-5=205', 'Dice are distinguished by position, so each allowed vector corresponds to exactly one ordered roll.','205 legal outcomes remain.')],
'Using positive-variable stars and bars without the ceiling permits values greater than six.',
'Why are there no intersections between the five invalid events?', 'Two deficits of at least six would sum to at least twelve, but the total deficit is only six.')
add('inclusion-exclusion','Count the complement carefully','Counting & probability','1.12',r'|A\cup B|=|A|+|B|-|A\cap B|',
'A and B are finite sets in the same universe. Count their overlap once.','inclusion','venn','4.3',
'How many subsets of {1,2,…,10} have at most four even elements and at most two elements divisible by three?',[
('Mark the two events',r'|A|+|B|', 'Counting each set separately counts points in their intersection twice.','Two overlapping regions are shaded.'),
('Locate the duplication',r'A\cap B', 'Every element of the overlap received one count from A and a second count from B.','The overlap is highlighted.'),
('Subtract one copy',r'|A\cup B|=|A|+|B|-|A\cap B|', 'Subtract the overlap exactly once. Every point in the union then has weight one.','The overlap carries one count.'),
('Use a complement',r'|U\setminus(A\cup B)|=|U|-|A|-|B|+|A\cap B|', 'When restrictions say “at most,” the violating events may be simpler to count than the allowed cases.','The region outside both events is retained.')],[
('Describe the violations',r'|U|=2^{10}=1024', 'Let A contain all five even numbers and let B contain all three multiples of three. A valid subset belongs to neither event.','The universe has 1024 subsets.'),
('Count each bad event',r'|A|=2^5=32,\quad |B|=2^7=128', 'Once the required elements are included, every remaining element may be present or absent.','A has 32 subsets and B has 128.'),
('Count their overlap',r'|A\cap B|=2^3=8', 'The required union is {2,3,4,6,8,9,10}. Only 1, 5, and 7 remain optional.','The overlap has eight subsets.'),
('Restore the overlap',r'1024-32-128+8=872', 'Subsets violating both conditions were removed twice. Add one copy back.','872 subsets satisfy both restrictions.')],
'The required sets overlap at 6; there are seven forced elements in the intersection, not eight.',
'What changes if the two sets of forbidden requirements share no elements?', 'Count the size of their union by adding their sizes. The number of optional elements is ten minus that union size.')
add('lattice-paths','Lattice paths through checkpoints','Counting & probability','1.19',r'\#\text{paths}=\binom{r+u}{r}',
'Each step is one unit right or up. Ordered checkpoints must be coordinatewise reachable.','paths','grid','7.12',
'How many right/up paths from (0,0) to (5,6) avoid visiting all three of (1,2), (3,4), and (5,5)? Visiting one or two is allowed.',[
('Encode the steps',r'R^rU^u', 'A path is a word containing r right moves and u up moves. The order determines its geometry.','A path becomes an ordered sequence of steps.'),
('Choose the right moves',r'\binom{r+u}{r}', 'Choose which r of the r+u positions contain R. The remaining positions must contain U.','Right-step positions are selected.'),
('Split at a checkpoint',r'\binom{a+b}{a}\binom{r-a+u-b}{r-a}', 'A path through (a,b) consists of an independently chosen prefix and suffix. Multiply their counts.','A marked checkpoint splits the path into two pieces.'),
('Subtract the forbidden event',r'\text{allowed}=\text{all}-\text{forbidden}', 'Distinguish “avoid every checkpoint” from “do not visit all checkpoints.” These are different events.','The forbidden family is isolated.')],[
('Count every path',r'\binom{11}{5}=462', 'Every complete path uses five right moves and six up moves.','An eleven-step path reaches (5,6).'),
('Order the checkpoints',r'(0,0)\to(1,2)\to(3,4)\to(5,5)\to(5,6)', 'Monotone paths visiting all three must visit them in this order.','The three checkpoints appear along a monotone route.'),
('Multiply the segment counts',r'\binom31\binom42\binom32\binom10=54', 'The displacements are (1,2), (2,2), (2,1), and (0,1). Choose each segment independently.','Four segments have counts 3, 6, 3, and 1.'),
('Exclude only that family',r'462-54=408', 'Paths visiting fewer than three checkpoints remain allowed.','408 paths remain.')],
'Subtracting paths through each checkpoint separately answers the stronger, incorrect restriction.',
'Could a right/up path visit (3,4) before (1,2)?', 'No. Both coordinates are nondecreasing, so a path cannot return to smaller coordinates.')
add('geometric-probability','Probability as an area ratio','Counting & probability','1.20',r'P(E)=\frac{\operatorname{area}(E)}{\operatorname{area}(\Omega)}',
'The joint distribution must be uniform over the sample region. Independence alone does not imply uniformity.','geometric-probability','probability','8.1',
'Alex and Bob independently arrive uniformly between 3 and 4 PM. Each waits fifteen minutes. What is the probability that they meet?',[
('Choose two coordinates',r'(x,y)\in\Omega', 'Represent the two random choices by a point. First identify the region of possible pairs.','Two axes describe the choices.'),
('Check uniform density',r'P(R)=c\,\operatorname{area}(R)', 'For independent uniform choices on intervals, equal-area subregions have equal probability.','Equal areas have equal probability.'),
('Normalize',r'c=\frac1{\operatorname{area}(\Omega)}', 'The whole sample region has probability one. Its area determines the density.','The whole sample square has probability one.'),
('Translate the condition',r'P(E)=\frac{\operatorname{area}(E)}{\operatorname{area}(\Omega)}', 'An inequality becomes a region. Often its complementary triangles are easiest to measure.','A band is retained while corner triangles are removed.')],[
('Measure minutes after three',r'0\le x,y\le60', 'The square of side 60 represents all equally likely arrival pairs.','The sample space is a 60-by-60 square.'),
('Draw the meeting condition',r'|x-y|\le15', 'They meet exactly when the later arrival is within fifteen minutes of the earlier one.','A diagonal band has boundaries y=x±15.'),
('Measure the missed meetings',r'2\cdot\frac12(60-15)^2=2025', 'The complement consists of two right triangles, each with legs 45.','Two corner triangles each have legs 45.'),
('Take the area ratio',r'1-\frac{2025}{3600}=\frac7{16}', 'The band occupies seven sixteenths of the square. Boundary points have probability zero.','The meeting probability is 7/16.')],
'The waiting time is fifteen minutes on either side of the diagonal, not a fixed quarter of the square.',
'If the waiting time doubles to thirty minutes, what is the probability?', 'The excluded triangles have legs thirty, so the probability is $1-30^2/60^2=3/4$.')
add('expectation','Indicators & linearity','Counting & probability','1.21',r'\mathbb E\!\left[\sum I_j\right]=\sum P(I_j=1)',
'Indicators take values zero or one. Linearity needs no independence between them.','expectation','indicators','9.4',
'A five-element subset of {1,2,…,30} is selected uniformly. What is the expected number of pairs of consecutive integers in it?',[
('Count one feature',r'I_j=\begin{cases}1&\text{feature }j\text{ occurs}\\0&\text{otherwise}\end{cases}', 'Replace a complicated total with simple yes/no contributions.','Each possible feature has its own indicator.'),
('Compute its expectation',r'\mathbb E[I_j]=1\cdot P(I_j=1)+0\cdot P(I_j=0)', 'A zero-one variable has expectation equal to the probability it is one.','An active indicator contributes one.'),
('Add the contributions',r'X=\sum_j I_j', 'Choose indicators so that each object being counted contributes exactly once.','The total is the sum of the highlighted indicators.'),
('Use linearity',r'\mathbb E[X]=\sum_j\mathbb E[I_j]', 'Dependencies may complicate the distribution of X, but they do not prevent adding expectations.','Expectations add even for overlapping features.')],[
('Index the adjacent pairs',r'(1,2),(2,3),\ldots,(29,30)', 'There are 29 possible consecutive pairs. An indicator records whether both members appear.','The number line has 29 adjacent pairs.'),
('Count subsets containing a pair',r'P(I_j=1)=\frac{\binom{28}{3}}{\binom{30}{5}}', 'Fix the two members of one pair, then choose the other three numbers from the remaining 28.','One fixed pair leaves three selections.'),
('Simplify the probability',r'\frac{\binom{28}{3}}{\binom{30}{5}}=\frac{5\cdot4}{30\cdot29}', 'Equivalently, require the first specified number and then the second in a sample without replacement.','Each pair has probability 20/870.'),
('Sum all indicators',r'29\cdot\frac{20}{30\cdot29}=\frac23', 'A run of three selected integers contributes two pairs, exactly as the question requires.','The expected count is 2/3.')],
'Consecutive pairs overlap and their indicators are dependent. Independence is unnecessary here.',
'Does the subset {1,2,3,10,20} contribute one pair or two?', 'Two: (1,2) and (2,3). Indicators count pairs, not runs.')
add('vieta','Roots without solving for roots','Algebra','2.7',r'r+s=-\frac ba,\qquad rs=\frac ca',
'The roots of ax²+bx+c are counted with multiplicity; a is nonzero.','vieta','roots','13.1',
'If r and s are the roots of $3x^2+6x-5=0$, find $r^3+s^3$.',[
('Factor over the roots',r'ax^2+bx+c=a(x-r)(x-s)', 'The leading coefficient a must remain in front. This identity also holds for repeated or complex roots.','Two root factors are placed side by side.'),
('Expand the product',r'a(x-r)(x-s)=ax^2-a(r+s)x+ars', 'The coefficient of x comes from choosing one root term, and the constant from choosing both.','The cross terms combine into the root sum.'),
('Compare coefficients',r'r+s=-b/a,\qquad rs=c/a', 'Equal polynomials have equal coefficients. This reads symmetric information directly from the equation.','Coefficient pairs are aligned.'),
('Build the desired expression',r'r^3+s^3=(r+s)^3-3rs(r+s)', 'Expand the cube of the sum and remove the two mixed terms together.','The mixed cubic terms are canceled.')],[
('Read the root data',r'r+s=-2,\qquad rs=-5/3', 'Divide coefficients by the leading coefficient 3 and keep the minus sign on the root sum.','The root sum is −2 and product is −5/3.'),
('Avoid radicals',r'(r+s)^3=r^3+s^3+3rs(r+s)', 'The requested expression is symmetric, so finding each root separately adds unnecessary work.','A cube expansion exposes the mixed terms.'),
('Substitute the two invariants',r'r^3+s^3=(-2)^3-3(-5/3)(-2)', 'The product term being subtracted is positive ten.','The values −8 and 10 are aligned.'),
('Finish',r'r^3+s^3=-18', 'The answer depends only on the sum and product, not on a labeling of the roots.','The symmetric result is −18.')],
'Forgetting to divide by a changes both the root sum and the root product.',
'What is $r^2+s^2$ for the same quadratic?', '$r^2+s^2=(r+s)^2-2rs=4+10/3=22/3$.')
add('polynomial-reduction','Reduce powers with an identity','Algebra','2.8',r'P(x)=(x-a)Q(x)+P(a)',
'Polynomial division by x−a leaves a constant remainder. Other known polynomial relations can reduce higher powers too.','polynomials','reduction','14.4',
r'A real number x satisfies $x+1/x=\sqrt5$. Find $x^{11}-7x^7+x^3$.',[
('Apply division',r'P(x)=(x-a)Q(x)+R', 'Dividing a polynomial by a linear factor leaves a remainder whose degree is less than one.','A polynomial is split into multiple plus remainder.'),
('Evaluate at the root',r'P(a)=R', 'Setting x=a makes the divisible part vanish.','The divisible part vanishes at x=a.'),
('Use a known relation',r'g(x)=0\ \Longrightarrow\ P(x)=R(x)', 'More generally, reduce P modulo any polynomial g satisfied by x. At that x, the multiple of g vanishes.','A known zero factor can be discarded.'),
('Seek structure first',r'P(x)=Q(x)g(x)+R(x)', 'Factor or group the requested expression before expanding large powers. The useful relation may be hidden by reciprocal terms.','The expression is regrouped around the known relation.')],[
('Square the given relation',r'x^2+x^{-2}=5-2=3', 'Since x is nonzero, reciprocal powers are legitimate. Remove the middle term 2.','The mixed term in the first square is removed.'),
('Square once more',r'x^4+x^{-4}=3^2-2=7', 'The same identity turns the sum of squares into a sum of fourth powers.','A second squaring reveals the coefficient 7.'),
('Clear the negative powers',r'x^8-7x^4+1=0', 'Multiply by x⁴ and move all terms to one side.','The reciprocal relation becomes a polynomial zero.'),
('Factor the requested expression',r'x^{11}-7x^7+x^3=x^3(x^8-7x^4+1)=0', 'Both possible real values of x satisfy the same zero factor, so no root choice is needed.','The entire expression contains the zero factor.')],
'Squaring can introduce extraneous solutions when solving an equation. Here only consequences of an already given solution are used.',
'Why is multiplying by $x^4$ permitted?', 'The original expression contains 1/x, so x is already known to be nonzero.')
add('geometric-series','Geometric sums by cancellation','Algebra','2.12',r'S_n=\frac{a(1-r^n)}{1-r};\qquad S_\infty=\frac a{1-r}',
'The finite formula requires r≠1; the infinite sum additionally requires |r|<1. At r=1 the finite sum is na.','geometric','series','16.2',
r'Let $S(r)=12+12r+12r^2+\cdots$ for $-1<r<1$. If $S(a)S(-a)=2016$, find $S(a)+S(-a)$.',[
('Write the finite sum',r'S_n=a+ar+\cdots+ar^{n-1}', 'Use a finite number of terms first so every cancellation is justified.','Successive terms form a geometric progression.'),
('Shift by one term',r'rS_n=ar+ar^2+\cdots+ar^n', 'Multiplication by r shifts each term into the position of its neighbor.','A shifted copy aligns matching terms.'),
('Subtract',r'(1-r)S_n=a-ar^n', 'Every interior term cancels. Only the first term of the original and the last term of the shifted sum remain.','Only the two boundary terms remain.'),
('Pass to a limit when allowed',r'|r|<1\ \Longrightarrow\ S_\infty=a/(1-r)', 'The tail arⁿ tends to zero only under the convergence condition.','The final tail shrinks to zero.')],[
('Write the two sums',r'S(a)=\frac{12}{1-a},\quad S(-a)=\frac{12}{1+a}', 'Both series converge because |a|<1. The opposite signs give conjugate denominators.','Two complementary denominators appear.'),
('Use their product',r'\frac{144}{1-a^2}=2016', 'Multiplying removes the linear terms from the denominator.','The product denominator is 1−a².'),
('Form their sum',r'S(a)+S(-a)=\frac{24}{1-a^2}', 'The same denominator appears, so solving for a itself is unnecessary.','The numerator becomes 24.'),
('Compare directly',r'S(a)+S(-a)=\frac{24}{144}\cdot2016=336', 'The sum is one sixth of the given product. Both signs of a give the same answer.','The sum is 336.')],
'A geometric series with r=−1 does not converge, even though 1−r is nonzero.',
'What happens when a=0?', 'Both sums equal 12. Their sum is 24 and their product is 144, still in the ratio one to six.')
add('telescoping','Telescoping to a Diophantine equation','Algebra','2.14',r'\sum_{k=m}^{n-1}\frac1{k(k+1)}=\frac1m-\frac1n',
'm and n are positive integers with m<n. Keep the first and last uncanceled terms.','telescoping','telescope','17.1',
r'For $a_k=1/(k^2+k)$, positive integers $m<n$ satisfy $a_m+\cdots+a_{n-1}=1/29$. Find $m+n$.',[
('Split one term',r'\frac1{k(k+1)}=\frac1k-\frac1{k+1}', 'Put the right side over a common denominator. The numerator is (k+1)−k=1.','Each fraction splits into a positive and negative neighbor.'),
('Write adjacent terms',r'(1/m-1/(m+1))+(1/(m+1)-1/(m+2))+\cdots', 'The negative part of each term cancels the positive part of the next.','Neighboring fractions line up.'),
('Cancel the interior',r'\sum_{k=m}^{n-1}\frac1{k(k+1)}=\frac1m-\frac1n', 'The last index is n−1, so the final negative denominator is n.','Only the first positive and last negative terms remain.'),
('Check endpoints',r'n=m+1\ \Longrightarrow\ \frac1m-\frac1{m+1}', 'A one-term sum reproduces the original fraction; this catches the common off-by-one error.','The endpoint check agrees with a single term.')],[
('Collapse the sum',r'\frac1m-\frac1n=\frac1{29}', 'The textbook expression has n−m terms, ending at n−1.','All interior fractions cancel.'),
('Solve for the second endpoint',r'n=\frac{29m}{29-m}', 'Because n is positive, the denominator is positive and 1≤m≤28.','The endpoint m lies below 29.'),
('Use divisibility',r'n=\frac{841}{29-m}-29', 'The positive integer 29−m lies between 1 and 28 and divides 29². The only possibility is 1.','The only admissible divisor is one.'),
('Recover the integers',r'm=28,\quad n=812,\quad m+n=840', 'Check: 1/28−1/812=1/29. The pair meets both positivity and order restrictions.','The valid endpoints are 28 and 812.')],
'Ending with −1/(n−1) loses the negative half of the last summand.',
'Why can 29−m not equal 29?', 'That would give m=0, which is excluded. The other divisor 841 is also outside the permitted range.')
add('divisor-sums','Divisor sums from independent exponents','Number theory','3.2',r'\sigma\!\left(\prod p_i^{a_i}\right)=\prod(1+p_i+\cdots+p_i^{a_i})',
'The pᵢ are distinct primes and the aᵢ are nonnegative integers; divisors are positive.','factors','divisors','21.4',
r'Let $f(n)=\sigma(n)/n$, where $\sigma(n)$ is the sum of positive divisors of n. Find $f(768)-f(384)$.',[
('Choose a prime exponent',r'1,p,p^2,\ldots,p^a', 'A divisor of pᵃ can contain any exponent from zero through a.','Exponent choices are listed along an axis.'),
('Combine distinct primes',r'd=\prod p_i^{e_i},\quad 0\le e_i\le a_i', 'Unique factorization makes these choices independent and produces every divisor once.','A grid combines two prime-exponent choices.'),
('Distribute the product',r'\sigma(n)=\prod_i\sum_{e=0}^{a_i}p_i^e', 'Expanding the product chooses one prime power from each factor, so its terms are exactly the divisors.','Every grid point contributes one divisor.'),
('Use geometric sums',r'\sigma(n)=\prod_i\frac{p_i^{a_i+1}-1}{p_i-1}', 'Each finite geometric sum has ratio pᵢ. Since pᵢ is prime, pᵢ−1 is nonzero.','Geometric sums compact the divisor total.')],[
('Factor the two inputs',r'768=3\cdot2^8,\quad384=3\cdot2^7', 'The inputs differ only by one factor of two, suggesting that most normalized divisor terms will cancel.','The exponent grids differ by one column.'),
('Normalize before subtracting',r'f(3\cdot2^a)=\frac43\left(1+\frac12+\cdots+\frac1{2^a}\right)', 'Dividing a divisor sum by n reverses the powers into reciprocals.','Normalized sums align their shared terms.'),
('Cancel their common part',r'f(768)-f(384)=\frac43\cdot\frac1{2^8}', 'All terms through 1/2⁷ cancel, leaving only the new last term.','Only the extra eighth-power term remains.'),
('Simplify',r'\frac4{3\cdot256}=\frac1{192}', 'This avoids computing and subtracting two large divisor sums.','The difference is 1/192.')],
'The divisor-sum function is multiplicative only for relatively prime factors.',
'Why is splitting 768 as 3·256 safe here?', 'The factors are relatively prime. Their prime-exponent choices are disjoint, so every divisor has a unique decomposition.')
add('congruences','Combine two congruences','Number theory','3.6',r'ax\equiv b\pmod m\ \Longrightarrow\ x\equiv a^{-1}b\pmod m',
'A modular inverse a⁻¹ exists exactly when gcd(a,m)=1. Otherwise first check the common divisor.','modular','clock','24.6',
'Find the smallest integer greater than 100 that leaves remainder 5 on division by 9 and remainder 4 on division by 17.',[
('Interpret a residue',r'x\equiv r\pmod m\ \Longleftrightarrow\ x=r+mk', 'A congruence describes an entire arithmetic progression, not one integer.','A residue class repeats around a modular clock.'),
('Substitute into the second condition',r'r+mk\equiv s\pmod n', 'Parameterize one condition exactly, then ask which values of k satisfy the other.','Each step of size m advances around the second clock.'),
('Find an inverse',r'um+vn=1\ \Longrightarrow\ um\equiv1\pmod n', 'When m and n are coprime, Bézout’s identity gives an inverse of m modulo n.','A multiplying step reverses the residue advance.'),
('Recover the progression',r'k\equiv u(s-r)\pmod n', 'Translate back to x, then impose the requested size or sign condition.','The combined solutions repeat every mn.')],[
('Encode the first remainder',r'N=5+9k', 'Every integer with remainder five modulo nine has this form.','Start at residue five and advance by nine.'),
('Impose the second remainder',r'9k\equiv-1\equiv16\pmod{17}', 'Substitute the expression for N and subtract five.','The target residue for 9k is sixteen.'),
('Invert nine',r'2\cdot9\equiv1\pmod{17},\quad k\equiv32\equiv15', 'Multiplication by two is valid because nine and seventeen are coprime.','Multiplication by two finds k≡15.'),
('Select the first valid integer',r'N=140+153t\quad\Longrightarrow\quad N_{\min>100}=140', 'The preceding representative is −13. Direct checks give 140=9·15+5=17·8+4.','The first representative above 100 is 140.')],
'Ordinary division is not automatically valid modulo m. It requires an invertible divisor or a careful reduction.',
'Why is the period 153?', 'Adding 9·17 preserves both remainders, and coprimality makes 153 the smallest positive common period.')
add('integer-factorization','Complete a product','Number theory','3.10',r'xy+ax+by=c\ \Longleftrightarrow\ (x+b)(y+a)=c+ab',
'The identity is algebraic; integer solutions require integer factor pairs and all original restrictions.','diophantine','border','25.4',
'A rectangular floor has integer side lengths $a<b$. A one-foot border occupies half the floor’s area. How many ordered pairs $(a,b)$ are possible?',[
('Look for a missing corner',r'xy+ax+by', 'Three terms resemble the area of a larger rectangle missing one corner.','A rectangle is shown with one corner missing.'),
('Add the corner',r'xy+ax+by+ab', 'The needed corner has side lengths a and b. Add its area to both sides of an equation.','The missing corner slides into place.'),
('Factor the completed rectangle',r'(x+b)(y+a)=c+ab', 'The new equation turns an additive relation into a product relation.','The complete rectangle factors into two side lengths.'),
('Enumerate valid factors',r'u=x+b,\quad v=y+a,\quad uv=c+ab', 'An integer equation now becomes a finite factor search when the right side is nonzero. Check signs, order, and original geometry.','Factor pairs are matched to candidate dimensions.')],[
('Write the painted area',r'(a-2)(b-2)=\frac{ab}{2}', 'One foot is removed at each end of each dimension. The painted interior is the other half of the floor.','The interior is inset one foot on every side.'),
('Complete the product',r'ab-4a-4b+8=0\ \Longrightarrow\ (a-4)(b-4)=8', 'Expand, double, rearrange, then add sixteen to form the product.','The area equation becomes a product of shifted lengths.'),
('Check the signs and order',r'(a-4,b-4)=(1,8)\text{ or }(2,4)', 'A nonempty painted rectangle requires a,b>2. Negative factors could only both be −1, whose product is not eight. Order requires the smaller factor first.','Only two positive factor pairs satisfy the order.'),
('Recover the dimensions',r'(a,b)=(5,12),(6,8)\quad\Longrightarrow\quad2', 'The interiors have areas 30 and 24, exactly half the outer areas 60 and 48.','Both candidate rectangles satisfy the area condition.')],
'A one-foot border shortens each interior dimension by two feet, not one.',
'Why is the factor pair (4,2) excluded?', 'It gives a=8 and b=6, contradicting a<b. It is the same rectangle with the forbidden order.')
add('triangle-centers','Inradius, circumradius & coordinates','Geometry','4.3',r'K=rs,\qquad R=\frac{abc}{4K}',
'A nondegenerate triangle has area K, semiperimeter s, inradius r, and circumradius R.','triangle-area','triangle','38.2',
'A triangle has side lengths 5, 12, and 13. Find the distance between its incenter and circumcenter.',[
('Join the incenter to the vertices',r'K=\tfrac12ar+\tfrac12br+\tfrac12cr', 'The perpendicular distance from the incenter to every side is r. The three subtriangle areas add.','Three equal inradii form the heights of subtriangles.'),
('Factor the common height',r'K=\tfrac12(a+b+c)r=sr', 'The half-perimeter appears naturally, giving r=K/s.','The three bases combine into the semiperimeter.'),
('Relate a side to its chord',r'c=2R\sin C', 'A chord subtending angle C at the circumference has length 2R sin C.','A side is a chord of the circumcircle.'),
('Eliminate the sine',r'K=\tfrac12ab\sin C=\frac{abc}{4R}', 'Combine the ordinary sine-area formula with the chord relation to obtain the circumradius formula.','The two area formulas identify the circumradius.')],[
('Place the right triangle',r'A=(0,0),\quad B=(5,0),\quad C=(0,12)', 'Since 5²+12²=13², the right angle can sit at the origin. The area is 30 and semiperimeter 15.','A 5–12–13 right triangle is placed on the axes.'),
('Locate the incenter',r'r=30/15=2,\qquad I=(2,2)', 'Tangency to both coordinate axes makes both coordinates of the incenter equal to r.','The incircle has center (2,2) and radius 2.'),
('Locate the circumcenter',r'O=\left(\frac52,6\right)', 'In a right triangle, the midpoint of the hypotenuse is equidistant from all three vertices.','The circumcenter is the hypotenuse midpoint.'),
('Measure the distance',r'OI=\sqrt{(5/2-2)^2+(6-2)^2}=\frac{\sqrt{65}}2', 'Coordinates avoid constructing the angle between the two centers.','The center-to-center segment has length √65/2.')],
'The incenter is generally not the centroid or the circumcenter; the centers must be located separately.',
'Can you check the result using Euler’s relation $OI^2=R(R-2r)$?', '$R=13/2$ and $r=2$ give $OI^2=(13/2)(5/2)=65/4$, agreeing with the coordinate result.')
add('shoelace','Signed area & an equal-area cut','Geometry','4.35',r'K=\frac12\left|\sum_i(x_i y_{i+1}-y_i x_{i+1})\right|',
'List the vertices of a simple polygon in boundary order and repeat the first vertex at the end.','coordinates','polygon','38.1',
'A quadrilateral has vertices A=(0,0), B=(1,2), C=(3,3), D=(4,0). A line through A bisects its area and meets CD at (p/q,r/s), in lowest terms. Find p+q+r+s.',[
('Use an oriented triangle',r'2[OAB]=x_Ay_B-y_Ax_B', 'The determinant gives twice the signed area. Reversing orientation reverses its sign.','A triangle is measured by its signed cross product.'),
('Sum around the boundary',r'2K_{\rm signed}=\sum_i(x_i y_{i+1}-y_i x_{i+1})', 'Oriented triangles from the origin add; contributions outside the polygon cancel.','Boundary triangles add with orientation.'),
('Close the polygon',r'(x_{n+1},y_{n+1})=(x_1,y_1)', 'The final edge back to the first vertex contributes too. Omitting it is safe only accidentally when that contribution is zero.','The last edge returns to the first vertex.'),
('Take one absolute value',r'K=\tfrac12|2K_{\rm signed}|', 'Sum signed terms first, then take the absolute value. Absolute values on individual terms destroy cancellation.','The final signed sum becomes ordinary area.')],[
('Compute the whole area',r'2K=|3-(6+12)|=15,\qquad K=15/2', 'The cross products for A,B,C,D in boundary order sum to −15.','The quadrilateral has area 15/2.'),
('Use the simple half',r'[ADE]=\tfrac12\cdot4\cdot y_E=2y_E', 'The side AD lies on the x-axis, so the half-area triangle needs only the height of E.','The cut isolates a triangle with base four.'),
('Find the height and position',r'2y_E=15/4\Rightarrow y_E=15/8;\quad CD:\ y=12-3x', 'Set the triangle area equal to half the quadrilateral area, then use the line through C and D.','The point E is where y=15/8 meets CD.'),
('Read the reduced coordinates',r'E=(27/8,15/8),\qquad27+8+15+8=58', 'Both fractions are already reduced and E lies between C and D.','The requested numerator-denominator sum is 58.')],
'Taking absolute values before summing the signed cross products can overcount the polygon.',
'Why must E actually lie on the segment CD?', 'Its x-coordinate 27/8 lies between 3 and 4, and its y-coordinate 15/8 lies between 0 and 3; it also satisfies the line equation.')
add('amgm','An attainable bound with AM–GM','Advanced topics','5.3',r'\frac{x_1+\cdots+x_n}{n}\ge\sqrt[n]{x_1\cdots x_n}',
'All variables are nonnegative. Equality holds exactly when they are equal. Integer restrictions may prevent equality.','inequalities','amgm','40.1',
'Nonnegative integers A,M,C satisfy A+M+C=12. Find the maximum of AMC+AM+MC+AC.',[
('Start with a square',r'(\sqrt x-\sqrt y)^2\ge0', 'For nonnegative x and y, both square roots exist and every real square is nonnegative.','Two nonnegative lengths determine a square difference.'),
('Rearrange',r'x+y\ge2\sqrt{xy}', 'Expanding gives x+y−2√xy≥0. Equality occurs when √x=√y.','The unequal pair is compared with an equal pair.'),
('Extend by equalizing pairs',r'\prod_{i=1}^n x_i\le\left(\frac{\sum x_i}{n}\right)^n', 'With a fixed positive sum, replacing an unequal positive pair by their average increases its product. A maximizing positive tuple must therefore have all entries equal. Zero-product boundary cases cannot beat it.','Equalizing factors raises the product while preserving the sum.'),
('Test attainability',r'x_1=\cdots=x_n', 'A numerical bound becomes the maximum only if the equality configuration satisfies every original restriction.','All factors coincide at equality.')],[
('Complete the product',r'(A+1)(M+1)(C+1)=AMC+AM+MC+AC+13', 'The extra terms are A+M+C+1=13, a fixed amount.','The target is shifted into a product of three factors.'),
('Apply the fixed sum',r'(A+1)+(M+1)+(C+1)=15', 'The shifted variables are positive and their sum is constant.','Three positive factors have total fifteen.'),
('Bound the product',r'(A+1)(M+1)(C+1)\le5^3=125', 'AM–GM gives equality at A+1=M+1=C+1=5.','The balanced factors are 5, 5, and 5.'),
('Check the original variables',r'A=M=C=4,\qquad\max=125-13=112', 'The equality case uses nonnegative integers with sum twelve, so the bound is attained.','The maximum 112 is attained.')],
'Bounding AMC and AM+MC+AC separately is valid only if their equality cases are compatible.',
'Why is “at most 112” not a complete maximum proof?', 'You must also produce an admissible triple attaining 112. Here (4,4,4) does so.',12)
add('logarithms','Change the base before comparing','Advanced topics','5.6',r'\log_b a=\frac{\ln a}{\ln b}',
'For real logarithms, a>0, b>0, and b≠1. Every variable base must satisfy these conditions.','logarithms','logs','41.1',
r'For positive x with $x\ne1/3,1/2$, solve $\log_{3x}4=\log_{2x}8$. Write x=p/q in lowest terms and find p+q.',[
('Return to the definition',r'y=\log_b a\ \Longleftrightarrow\ b^y=a', 'A logarithm asks which exponent of b produces a.','The logarithm is rewritten as an exponent equation.'),
('Take a common logarithm',r'\ln(b^y)=\ln a', 'The bases and arguments are positive, so taking natural logs is legitimate.','Both sides are measured with the same logarithm.'),
('Bring down the exponent',r'y\ln b=\ln a', 'The power rule follows from the exponential definition. The base cannot be one, so ln b is nonzero.','The unknown exponent becomes a linear multiplier.'),
('Divide and retain the domain',r'y=\frac{\ln a}{\ln b}', 'A common base turns comparisons of unrelated logarithms into ordinary algebra.','The change-of-base ratio appears.')],[
('Use one common base',r'\frac{2\ln2}{\ln(3x)}=\frac{3\ln2}{\ln(2x)}', 'The excluded values ensure neither denominator is zero.','The two logarithms share a numerator factor ln 2.'),
('Cross-multiply',r'2\ln(2x)=3\ln(3x)', 'Cancel ln 2, which is nonzero, then cross-multiply the nonzero denominators.','The equation becomes linear in ln x.'),
('Collect logarithms',r'\ln x=2\ln2-3\ln3=\ln(4/27)', 'Expand the logarithms of products using x>0.','The remaining logarithm is ln(4/27).'),
('Check and report',r'x=4/27,\qquad p+q=31', 'The result is positive and different from 1/3 and 1/2. The fraction is reduced.','The admissible solution gives 31.')],
'Canceling logarithms as if log(ab)=log(a)log(b) is invalid; products become sums.',
'Why were x=1/3 and x=1/2 excluded before the algebra?', 'They make one of the logarithm bases equal to one, so the original expression is undefined.',12)
add('complex-division','Complex division & a rotation','Advanced topics','5.22',r'\frac{a+bi}{c+di}=\frac{(ac+bd)+(bc-ad)i}{c^2+d^2}',
'All four coefficients are real and c+di is nonzero. Multiplying by i rotates a complex number 90° counterclockwise.','complex','complex','44.3',
'A complex number z has imaginary part 164 and satisfies $z/(z+n)=4i$ for a positive integer n. Find n.',[
('Use the conjugate',r'\frac{a+bi}{c+di}\cdot\frac{c-di}{c-di}', 'Multiplying numerator and denominator by the conjugate preserves the quotient and removes the imaginary denominator.','A vector and its reflection represent conjugates.'),
('Compute the real denominator',r'(c+di)(c-di)=c^2+d^2', 'Since i²=−1, the product is the squared modulus, positive for a nonzero denominator.','The denominator becomes a positive squared length.'),
('Expand the numerator',r'(a+bi)(c-di)=(ac+bd)+(bc-ad)i', 'Keep real and imaginary terms separate while expanding.','Real and imaginary components are collected.'),
('Read a geometric operation',r'i(x+yi)=-y+xi', 'Multiplication by i sends (x,y) to (−y,x): a quarter-turn preserving length.','The vector turns ninety degrees counterclockwise.')],[
('Name the real part',r'z=x+164i', 'The imaginary part is fixed, so only one real coordinate remains unknown.','z lies on the horizontal line Im z=164.'),
('Clear the denominator',r'x+164i=4i(x+n+164i)=-656+4(x+n)i', 'The equality says z is a quarter-turn and fourfold dilation of z+n.','The translated vector rotates and scales by four.'),
('Compare coordinates',r'x=-656,\qquad164=4(x+n)', 'Equality of complex numbers requires equality of both real and imaginary parts.','The real coordinate is fixed at −656.'),
('Solve and check',r'n=41-x=697', 'Then z+n=41+164i is nonzero, and 4i(41+164i)=−656+164i=z.','The shift n is 697.')],
'The imaginary part is the real coefficient 164, not the expression 164i.',
'What does multiplication by −i do geometrically?', 'It rotates a vector ninety degrees clockwise and preserves its length.',12)

sections={s['section']:s for s in json.loads((ROOT/'src/content/crash-sections.json').read_text())}
examples={e['number']:e for e in json.loads((ROOT/'src/content/textbook-examples.json').read_text())['examples']}
for p in plates:
 p['source']={'title':'Omega Learn AMC 10/12 Crash Course','section':p['section'],'page':sections[p['section']]['page']}
 p['lesson']={'starsbars':'stars-bars','paths':'geometric-counting'}.get(p['lesson'],p['lesson'])
 if examples[p['example']]['amc12']:p['track']=12
 p['source']['page']={'vieta':22,'geometric-series':30,'telescoping':32,'triangle-centers':59,'complex-division':114}.get(p['id'],p['source']['page'])
 p['exampleSource']={k:examples[p['example']][k] for k in ['id','page','attribution','level']}
 assert len(p['derivation'])==len(p['worked'])==4
(ROOT/'src/content/formulary.json').write_text(json.dumps(plates,ensure_ascii=False,indent=2)+'\n')
print(f'Wrote {len(plates)} formula plates with {len(plates)*8} explanatory steps.')
