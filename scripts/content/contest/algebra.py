"""Algebraic structure: original problems, symbolic checks, explicit decisions."""
from fractions import Fraction as F
from itertools import product
import sympy as S
from .common import item,study,section,formula
x,y,z=S.symbols('x y z', real=True)

def q(n,stem,answer,wrong,solution,hints,decision,skills,check,method,level=3):
    return item(f'algebra-transformations-q{n:02d}',stem,answer,wrong,solution,hints,decision=decision,skills=skills,check=check,check_method=method,level=level)

problems=[
q(1,r'A positive real number $t$ satisfies $t+1/t=3$. What is $t^6+t^{-6}$?',322,
 [(729,'Raise the given sum to the sixth power without cross terms.'),(324,'Square the cubic sum but omit its cross term.'),(18,'Multiply the given sum by the exponent.'),(47,'Stop after computing the fourth powers.')],
 [r'Set $u=t^3+t^{-3}$. Cubing $t+t^{-1}$ gives $u+3(t+t^{-1})$, so $u=27-9=18$.',r'Squaring $u$ gives $t^6+2+t^{-6}$ because $t^3t^{-3}=1$.',r'Therefore the requested sum is $18^2-2=322$. No value of $t$ needs to be found.'],
 ['Pair each power with its reciprocal.',r'Obtain the cubic pair first, then square it and remove the cross term.'],
 'Recover a symmetric power without solving for the base.',['reciprocal symmetry','cross terms'],lambda:S.simplify(sum(r**6 for r in S.solve(x*x-3*x+1,x))), 'Solve the defining quadratic symbolically and sum the sixth powers of its reciprocal roots.',2),
q(2,r'Real numbers $a,b,c$ satisfy $a+b+c=6$ and $a^2+b^2+c^2=14$. What is $ab+bc+ca$?',11,
 [(22,'Forget that each mixed product appears twice.'),(25,'Add the given sum and sum of squares.'),(36,'Square the sum without removing the square terms.'),(7,'Halve the sum of squares instead of the mixed part.')],
 [r'Expand the square of the three-term sum: $(a+b+c)^2=a^2+b^2+c^2+2(ab+bc+ca)$.',r'Thus $36=14+2(ab+bc+ca)$.',r'Subtract and divide by two to obtain $11$. The data are attainable, for instance with $a,b,c=1,2,3$.'],
 ['Compare the square of the sum with the sum of squares.','Each unordered mixed pair appears twice in the expansion.'],
 'Extract the mixed part of an expansion.',['symmetric expressions','three-variable identity'],lambda:1*2+2*3+3*1,'Expand the polynomial identity and verify a feasible triple (1,2,3).',2),
q(3,r'Positive integers $a,b$ satisfy $ab+3a+2b=49$. What is the sum of all possible values of $a$?',12,
 [(2,'Count the possible values instead of summing them.'),(55,'Report the completed product.'),(14,'Forget to subtract 2 from each factor assigned to a.'),(10,'Omit a valid ordering of the factor pair.')],
 [r'Add $6$ to both sides: $(a+2)(b+3)=55$. Positivity requires $a+2\ge3$ and $b+3\ge4$.',r'The admissible ordered factor pairs are $(5,11)$ and $(11,5)$; the pairs involving $1$ violate a lower bound.',r'They give $(a,b)=(3,8)$ and $(9,2)$. The requested sum is $3+9=12$.'],
 ['Try turning the left side into one product.',r'The product $(a+2)(b+3)$ introduces the missing constant $6$.'],
 'Complete a product and enforce lower bounds on both factors.',['SFFT','ordered divisor pairs','integer restrictions'],lambda:sum(a for a in range(1,50) for b in range(1,50) if a*b+3*a+2*b==49),'Exhaustive positive-integer search with bounds supplied by the positive linear terms.'),
q(4,r'Let $u=\sqrt{29+12\sqrt5}+\sqrt{29-12\sqrt5}$. What is $u^2$?',80,
 [(58,'Omit the mixed radical term.'),(72,'Assume the radical product is 7.'),(116,'Double both radicands without evaluating the product.'),(22,'Report only the cross term.')],
 [r'Both radicands are positive: $29^2>(12\sqrt5)^2=720$.',r'Square the sum to obtain $u^2=58+2\sqrt{29^2-720}=58+2\sqrt{121}$.',r'The principal square root of $121$ is $11$, so $u^2=80$.'],
 ['The question asks for the square, so avoid denesting each radical separately.','The two radicands are conjugates; multiply them before simplifying.'],
 'Calculate the requested symmetric expression directly.',['conjugates','principal square roots'],lambda:S.simplify((S.sqrt(29+12*S.sqrt(5))+S.sqrt(29-12*S.sqrt(5)))**2),'Symbolic evaluation of the original radical expression.',2),
q(5,r'Real numbers $a,b$ satisfy $a+b=5$ and $a^3+b^3=35$. What is $a^5+b^5$?',275,
 [(3125,'Treat the fifth power of a sum as the sum of fifth powers.'),(175,'Multiply the cubic sum by the original sum.'),(243,'Use only the larger of the two values.'),(625,'Compute a fourth power of the given sum.')],
 [r'The cubic identity gives $35=5^3-3ab\cdot5$, hence $ab=6$.',r'The numbers $a,b$ are the roots of $t^2-5t+6=0$, namely $2$ and $3$, in either order.',r'The desired symmetric quantity is therefore $2^5+3^5=32+243=275$. Alternatively use $p_n=5p_{n-1}-6p_{n-2}$.'],
 ['Recover the missing product from the cubic sum.',r'Once sum and product are known, determine the unordered pair or use a power-sum recurrence.'],
 'Use one symmetric quantity to recover another before raising powers.',['cubic identity','Vieta','power sums'],lambda:sum(r**5 for r in S.solve(x*x-5*x+6,x)),'Solve the independently recovered quadratic and evaluate the fifth powers.'),
q(6,r'Real numbers $x,y$ satisfy $x+y=xy=6$. What is $\frac{x}{y-1}+\frac{y}{x-1}$?',18,
 [(6,'Cancel denominators termwise without a common denominator.'),(24,'Omit the linear terms from the numerator.'),(12,'Use twice the given product.'),(3,'Use xy as the common denominator instead of (x-1)(y-1).')],
 [r'The denominator after combining is $(x-1)(y-1)=xy-(x+y)+1=1$, so neither original denominator is zero.',r'The numerator is $x(x-1)+y(y-1)=(x+y)^2-2xy-(x+y)=36-12-6=18$.',r'The fraction is $18/1=18$. Finding the two irrational values individually would add work without useful information.'],
 ['Combine the fractions before finding the variables.',r'Express both the new numerator and denominator using $x+y$ and $xy$.'],
 'Reduce a rational symmetric expression while checking its denominators.',['common denominators','symmetric sums','domain'],lambda:S.simplify((3+S.sqrt(3))/(2-S.sqrt(3))+(3-S.sqrt(3))/(2+S.sqrt(3))),'Evaluate at the two exact roots of t²-6t+6.'),
q(7,r'Real numbers $x,y$ satisfy $x^2+y^2=13$ and $xy=6$. Find $x^4y^2+x^2y^4$.',468,
 [(78,'Use xy in place of x²y².'),(169,'Square the sum of squares.'),(936,'Count the factored expression twice.'),(360,'Use a sum of 10 in place of the given sum of squares.')],
 [r'The two terms have the common factor $x^2y^2$.',r'Factor to get $x^2y^2(x^2+y^2)=(xy)^2(x^2+y^2)$.',r'Substitution now gives $6^2\cdot13=468$. The conditions are consistent, for example $x=2,y=3$.'],
 ['Look for a common factor rather than expanding anything.','The remaining factor is exactly one of the quantities given.'],
 'Recognize the supplied invariants inside a higher-degree expression.',['factorization','invariants of a pair'],lambda:2**4*3**2+2**2*3**4,'Direct substitution into the original degree-six expression plus symbolic factorization.',2),
q(8,r'For how many positive integers $n$ is $n^4+4$ prime?',1,
 [(0,'Assume a sum of fourth powers is always composite.'),(2,'Treat the n=2 case as prime without checking both factors.'),(4,'Confuse the added constant with the number of solutions.'),(3,'Count initial cases without proving the general obstruction.')],
 [r'Introduce and remove $4n^2$: $n^4+4=(n^2+2)^2-(2n)^2$.',r'Thus $n^4+4=((n-1)^2+1)((n+1)^2+1)$. For every $n\ge2$, both factors exceed $1$, so the number is composite.',r'For $n=1$, the value is $5$, which is prime. Therefore exactly one positive integer works.'],
 ['Try converting a sum into a difference of squares.','Add and subtract the term that would make $(n²+2)²$.'],
 'Discover a factorization and use a bound to settle infinitely many integers.',['Sophie Germain identity','prime factor obstruction'],lambda:sum(S.isprime(n**4+4) for n in range(1,101)),'Symbolic factorization proves compositeness for n≥2; enumerate the first 100 values as a secondary check.'),
q(9,r'Positive integers $a,b$ have $\gcd(a,b)=7$ and $\frac ab+\frac ba=\frac{29}{10}$. What is $a+b$?',49,
 [(7,'Report only the common divisor.'),(35,'Recover the larger number but not the sum.'),(14,'Assume the reduced ratio is one to one.'),(70,'Use the product of the reduced ratio entries as their sum.')],
 [r'Write $a=7u,b=7v$ with $\gcd(u,v)=1$. The ratio condition becomes $10u^2-29uv+10v^2=0$.',r'Factor this as $(5u-2v)(2u-5v)=0$. Thus the reduced pair is $(u,v)=(2,5)$ or $(5,2)$; coprimality rules out a further common multiplier.',r'Therefore $a+b=7(2+5)=49$.'],
 ['Remove the known gcd before interpreting the rational ratio.','Clear denominators and factor the homogeneous quadratic.'],
 'Combine a ratio equation with coprimality to determine scale.',['homogeneous factorization','gcd normalization'],lambda:next(iter({a+b for a in range(1,100) for b in range(1,100) if S.gcd(a,b)==7 and 10*(a*a+b*b)==29*a*b})),'Enumerate integer solutions independently; the factored equation establishes the finite ratio possibilities.'),
q(10,r'Real numbers $x,y$ satisfy $x+y=3$ and $x^3+y^3=18$. What is $\frac1{x^2+1}+\frac1{y^2+1}$?',1,
 [(F(2,9),'Add the numerators but omit x²+y² from the new numerator.'),(F(7,9),'Forget the two constants in the numerator.'),(F(9,8),'Omit the constant term in the product denominator.'),(2,'Assume each reciprocal equals one.')],
 [r'The cubic identity yields $18=27-9xy$, so $xy=1$ and $x^2+y^2=9-2=7$.',r'The combined numerator is $x^2+y^2+2=9$. Its denominator is $x^2y^2+x^2+y^2+1=1+7+1=9$.',r'The value is $1$. The original denominators are strictly positive for real $x,y$, so the combination is valid.'],
 ['First find the product from the cubic identity.',r'Combine the reciprocals and express all terms using the sum and product.'],
 'Chain two symmetric reductions with a denominator check.',['cubic identity','rational symmetry'],lambda:S.simplify(sum(1/(r*r+1) for r in S.solve(x*x-3*x+1,x))),'Solve the defining quadratic and evaluate the original rational expression.'),
q(11,r'Nonzero real numbers $a,b,c$ satisfy $a+b+c=0$ and $a^3+b^3+c^3=81$. What is $(a+b)(b+c)(c+a)$?',-27,
 [(27,'Lose the three negative signs when replacing pair sums.'),(-81,'Forget the coefficient 3 in the cubic identity.'),(81,'Use the sum of cubes directly.'),(0,'Infer a zero pair sum from a zero total sum.')],
 [r'When $a+b+c=0$, substituting $c=-a-b$ gives $a^3+b^3+c^3=3abc$. Thus $abc=27$.',r'The three pair sums are $-c,-a,-b$. Their product is $-abc$.',r'The required value is $-27$. Nonzero real solutions exist: take $a=b=-\sqrt[3]{27/2}$ and $c=-2a$.'],
 ['Replace one variable using the zero total sum.',r'Each pair sum is the negative of the omitted variable.'],
 'Use the zero-sum constraint twice, first to reduce cubes and then the target.',['three-variable cubic identity','sign structure'],lambda:S.simplify((-2*S.real_root(S.Rational(27,2),3))*S.real_root(S.Rational(27,2),3)**2),'Expand after substituting c=-a-b and verify the exhibited real solution.'),
q(12,r'What is the product of all distinct real solutions of $\bigl((x-2)^2-5\bigr)^2=16$?',-15,
 [(15,'Discard the negative solution.'),(-5,'Use only the branch with inner expression +4.'),(3,'Use only the branch with inner expression -4.'),(-9,'Subtract the constants of the two quadratics instead of multiplying root products.')],
 [r'The inner expression is either $4$ or $-4$. Hence $(x-2)^2=9$ or $(x-2)^2=1$.',r'The four distinct roots are $5,-1,3,1$. Both branches are needed; all four satisfy the original equation.',r'The product is $5(-1)3(1)=-15$. Equivalently multiply the constant terms of the two monic quadratics.'],
 ['Introduce the repeated inner expression as a temporary variable.','A square equal to 16 has two possible signed square roots.'],
 'Reverse a composition and retain both branches.',['substitution','quadratic branches','distinct roots'],lambda:S.prod(S.solve(((x-2)**2-5)**2-16,x)),'Symbolically solve the original quartic and multiply its distinct real roots.'),
q(13,r'Positive real numbers $x,y$ satisfy $xy=4$ and $\frac xy+\frac yx=7$. What is $\frac{x+y}{(\sqrt{x}+\sqrt{y})^2}$?',F(3,5),
 [(1,'Omit the cross term when squaring the radical sum.'),(F(3,4),'Use sqrt(xy) instead of twice sqrt(xy).'),(F(7,11),'Confuse x²+y² with x+y.'),(F(5,3),'Invert the requested ratio.')],
 [r'Multiply the ratio condition by $xy=4$ to get $x^2+y^2=28$. Then $(x+y)^2=28+8=36$. Positivity selects $x+y=6$.',r'The denominator is $x+y+2\sqrt{xy}=6+4=10$.',r'The requested ratio is $6/10=3/5$. Choosing the negative square root for x+y would violate positivity.'],
 ['Recover the sum of squares, then the positive sum.',r'Expand $(\sqrt{x}+\sqrt{y})^2$ only after using the product.'],
 'Move between ratios, symmetric sums, and radical expressions.',['symmetric reduction','positivity','radical cross terms'],lambda:S.simplify(6/(S.sqrt(3+S.sqrt(5))+S.sqrt(3-S.sqrt(5)))**2),'Check with the exact pair 3+sqrt(5), 3-sqrt(5), whose sum/product satisfy the original conditions.'),
q(14,r'Define $f(t)=\frac{t-1}{t+1}$. Starting with $x_0=2$, let $x_{n+1}=f(x_n)$ for every $n\ge0$. What is $x_{2026}$?',F(-1,2),
 [(2,'Treat the iteration count as divisible by four.'),(F(1,3),'Stop after the first iterate.'),(-3,'Use remainder three instead of two.'),(F(1,2),'Lose the sign in the second iterate.')],
 [r'The first four steps are $2\to1/3\to-1/2\to-3\to2$. None of these values equals $-1$, so every step is defined.',r'The deterministic rule repeats the entire cycle whenever it returns to 2. Thus the sequence has period four.',r'Since $2026\equiv2\pmod4$, the answer is $x_2=-1/2$.'],
 ['Compute a few exact iterates before attempting a large expression.','A return to the starting value restarts the same cycle, provided every denominator is nonzero.'],
 'Recognize a fractional transformation cycle and verify its domain.',['functional iteration','rational arithmetic','modular index'],lambda:__import__('functools').reduce(lambda a,_:(a-1)/(a+1),range(2026),F(2)),'Perform 2026 iterations in exact rational arithmetic, independent of the period shortcut.')
]
# Explicit symbolic identity checks supplement the answer checks for universal claims.
assert S.expand((x*x-2*x+2)*(x*x+2*x+2)-(x**4+4))==0
assert S.expand(x**3+y**3+(-x-y)**3-3*x*y*(-x-y))==0
assert S.expand(x**4*y*y+x*x*y**4-(x*y)**2*(x*x+y*y))==0

examples=[
item('algebra-transformations-example-1',r'Real numbers $u,v$ satisfy $u+v=7$ and $uv=10$. Find $u^3+v^3$ without solving for $u$ and $v$.',133,[(343,'Drop all mixed terms.'),(273,'Subtract only one mixed contribution.'),(70,'Report the sum times the product.'),(123,'Evaluate only one cubic term.')],
 [r'The target is unchanged when $u$ and $v$ are exchanged. This is a cue to keep their sum and product rather than find two separate roots.',r'Expand $(u+v)^3=u^3+v^3+3u^2v+3uv^2$. The mixed terms factor as $3uv(u+v)$.',r'Rearrange to get $u^3+v^3=(u+v)^3-3uv(u+v)$.',r'Use the data only now: $7^3-3\cdot10\cdot7=343-210=133$.',r'As an independent check, the pair is $2,5$, whose cubes sum to $8+125=133$. Solving for the pair verifies the result but was unnecessary for discovering the efficient method.'],
 ['Look for a symmetry of the target.','Expand the cube of the given sum and group its mixed terms.'],decision='Keep exactly the symmetric information the problem gives.',skills=['symmetric cubes'],check=2**3+5**3,check_method='Evaluate both exact roots of the associated quadratic.',level=2),
item('algebra-transformations-example-2',r'Positive integers $a,b$ satisfy $ab+2a+2b=56$. What is the least possible value of $a+b$?',12,[(11,'Use the continuous minimum without respecting integrality.'),(14,'Choose a more distant factor pair.'),(16,'Forget to subtract the shifts from the factors.'),(28,'Treat the original left side as a linear sum.')],
 [r'The product $ab$ and equal linear terms suggest completing a rectangle: add $4$ to obtain $(a+2)(b+2)=60$.',r'Let $u=a+2,v=b+2$. Then $u,v\ge3$, $uv=60$, and minimizing $a+b$ is equivalent to minimizing $u+v$.',r'The unordered admissible factor pairs are $(3,20),(4,15),(5,12),(6,10)$. Their sums are $23,19,17,16$.',r'The closest pair gives $a=4,b=8$ and $a+b=12$. Substitution gives $32+8+16=56$, so the bound is attained.',r'A continuous AM–GM bound suggests searching near $u=v=\sqrt{60}$, but equality is impossible for integer factors. The divisor check is the step that turns a useful estimate into a valid exact optimum.'],
 ['Try adding a constant so the equation factors.','After shifting both variables, compare factor pairs around the square root.'],decision='Combine a completed product with an attainable integer optimum.',skills=['SFFT','integer optimization'],check=min(a+b for a in range(1,57) for b in range(1,57) if a*b+2*a+2*b==56),check_method='Enumerate all positive integer solutions; positive linear terms bound each variable.',level=3)
]

study('algebra-transformations','Algebraic transformations & hidden structure','Algebra','identities exponents linear diophantine',12,'168–182',
 [r'Competition algebra often asks for an expression, not the individual unknowns. The first decision is therefore what information to preserve. A symmetric target may depend only on a sum and a product; a mixed integer equation may become a product after a small shift; a nested transformation may repeat after a few steps.',
 r'Begin with this question: if $u+v=7$ and $uv=10$, why is finding $u$ and $v$ individually more information than is needed to obtain $u^3+v^3$? Try an expansion before reading the first worked example. The useful move is to reconstruct the target from quantities already known, not to expand everything in sight.'],
 [section('Choose a representation that preserves the target',
 r'An algebraic manipulation is useful when it reduces the number of unknown quantities that still matter. If a target is unchanged by exchanging two variables, inspect $s=x+y$ and $p=xy$. Expanding $s^2$ yields $x^2+y^2=s^2-2p$; expanding $s^3$ yields $x^3+y^3=s^3-3ps$. These are not isolated tricks to memorize: every occurrence of a mixed term can be regrouped into $s$ and $p$.',
 r'For higher powers, each root of $t^2-st+p=0$ satisfies $t^n=st^{n-1}-pt^{n-2}$. Adding the equations for the two roots gives the recurrence $P_n=sP_{n-1}-pP_{n-2}$, with $P_0=2$ and $P_1=s$. The initial value is two because there are two zeroth powers. This recurrence avoids both radicals and a long binomial expansion.',
 r'A rational target needs a separate domain check. Combining $x/(y-1)+y/(x-1)$ creates the denominator $p-s+1$. If that quantity is zero, the simplification does not rescue an undefined original expression. Conversely, a nonzero computed product of denominators proves that both denominators are nonzero.'),
 section('Complete a product; then use the original restrictions',
 r'An expression $xy+ax+by$ is nearly the expansion of $(x+b)(y+a)$. The missing constant is $ab$. Adding it to both sides converts an equation in two integers into a divisor problem. The reversal matters: every original solution gives a factor pair, and every admissible factor pair must give an original solution after the shifts are undone.',
 r'Positivity does not mean merely that both factors are positive. If $x,y$ are positive integers, the shifted factors satisfy $x+b\ge b+1$ and $y+a\ge a+1$ when the shifts are nonnegative. Counting all factor pairs of the completed product can therefore overcount. Ordered pairs are different when the unknowns have distinct roles; a requested sum, number of pairs, or optimum must be computed from the original variables.',
 r'The same idea produces a less obvious factorization: $n^4+4=(n^2+2)^2-(2n)^2$. The inserted middle term makes a difference of squares. To prove the resulting number composite, it is not enough to display two factors: prove each is an integer greater than one. The exceptional small value must be handled separately.'),
 section('Work backward through compositions',
 r'For a nested square, introduce the repeated inner expression and solve the outer equation first. A step $u^2=c$ with $c>0$ produces two signed branches. Returning to the original variable may remove a branch or create duplicate roots, so count or multiply distinct permitted roots only after checking them.',
 r'For a repeated rational transformation, exact small cases can reveal a cycle. A return to the starting input proves that future iterates repeat because the rule is deterministic, provided no denominator vanishes along the cycle. Observing three similar outputs without a return would not prove periodicity. In a contest, look for such a structural reduction before trying hundreds of substitutions.',
 r'The common thread is economy of information. Keep symmetric data when the target is symmetric, preserve integer constraints when factoring, and preserve all valid branches when reversing an operation. The independent check can use a less elegant method; its purpose is to challenge the proposed solution rather than repeat it.')],
 ['Recover higher symmetric powers from lower symmetric data.','Transform mixed integer expressions into bounded factor-pair problems.','Reverse algebraic compositions without losing branches or admitting undefined values.'],
 [r'Expand $(x+y)^3=x^3+y^3+3xy(x+y)$ and isolate the cubic pair.',r'From $t^2-st+p=0$, multiply by $t^{n-2}$ and sum over the two roots to obtain $P_n=sP_{n-1}-pP_{n-2}$.',r'Expand $(x+b)(y+a)=xy+ax+by+ab$; the added constant creates an exact reversible factorization.'],
 'A helpful factorization or square-root step is not the end of the solution: check shifted lower bounds, signs, denominator restrictions, and whether equality or every proposed branch is attainable.',examples,problems,
 dict(prompt=r'Complete the missing connection: $u+v=8$ and $u^2+v^2=40$. Find $uv$, then $u^3+v^3$. Explain why solving the quadratic is optional.',answer=r'$uv=12$ and $u^3+v^3=224$.',steps=[r'$64=40+2uv$ gives $uv=12$.',r'$u^3+v^3=8^3-3\cdot12\cdot8=224$.',r'Both target quantities depend only on the symmetric data. The pair $2,6$ provides a separate check.']),
 techniques=['symmetric power sums','completing a product','conjugate expressions','composition and domain'],released_from='identities')
formula('algebra-transformations',r'x^3+y^3=(x+y)^3-3xy(x+y)','Symmetric cubic reduction','finding a cubic power sum from the sum and product of two variables','The variables lie in a field of characteristic zero; for this course they are real or complex.')
formula('algebra-transformations',r'P_n=sP_{n-1}-pP_{n-2}','Two-root power-sum recurrence','recovering higher powers of two roots with sum s and product p','$P_0=2$, $P_1=s$, and $n\\ge2$; both roots satisfy $t^2-st+p=0$.')
formula('algebra-transformations',r'(x+b)(y+a)=xy+ax+by+ab','Completed product','converting a mixed two-variable integer equation into factor pairs','After undoing the shifts, every factor pair must satisfy the original sign and integer restrictions.')
formula('algebra-transformations',r'a^4+4b^4=(a^2-2ab+2b^2)(a^2+2ab+2b^2)','Sophie Germain factorization','factoring a fourth-power sum by completing a square','The identity is algebraic; a primality conclusion additionally requires both integer factors to exceed one.')
