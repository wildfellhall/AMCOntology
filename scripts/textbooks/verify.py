"""Independent exact checks of the 18 authored source-example walkthroughs."""
from itertools import permutations,product,combinations
from fractions import Fraction as F
from math import comb
from pathlib import Path
import json
import sympy as s
checks={}
# Circular orders: fix friend zero, then enumerate every remaining labeled order.
checks['circular']=sum(all(not(a in {3,4,5} and b in {3,4,5}) for a,b in zip((0,)+p,p+(0,))) for p in permutations(range(1,6)))
assert checks['circular']==12
checks['stars-bars']=sum(sum(p)==24 for p in product(range(1,7),repeat=5));assert checks['stars-bars']==205
checks['inclusion-exclusion']=sum(sum(i%2==0 for i in sub)<=4 and sum(i%3==0 for i in sub)<=2 for n in range(11) for sub in combinations(range(1,11),n));assert checks['inclusion-exclusion']==872
valid=0
for right in combinations(range(11),5):
 x=y=0;visited=set()
 for i in range(11):
  if i in right:x+=1
  else:y+=1
  visited.add((x,y))
 valid+=not {(1,2),(3,4),(5,5)}.issubset(visited)
checks['lattice-paths']=valid;assert valid==408
x=s.symbols('x',real=True)
checks['geometric-probability']=s.integrate(x+15,(x,0,15))+s.integrate(30,(x,15,45))+s.integrate(75-x,(x,45,60));assert checks['geometric-probability']/3600==s.Rational(7,16)
total=sum(sum(b-a==1 for a,b in zip(sub,sub[1:])) for sub in combinations(range(1,31),5));checks['expectation']=F(total,comb(30,5));assert checks['expectation']==F(2,3)
roots=s.solve(3*x*x+6*x-5,x);checks['vieta']=s.simplify(sum(r**3 for r in roots));assert checks['vieta']==-18
for root in s.solve(x*x-s.sqrt(5)*x+1,x):assert s.simplify(root**11-7*root**7+root**3)==0
checks['polynomial-reduction']=0
a=s.sqrt(s.Rational(13,14));checks['geometric-series']=s.simplify(12/(1-a)+12/(1+a));assert checks['geometric-series']==336
pairs=[]
for m in range(1,29):
 n=F(29*m,29-m)
 if n.denominator==1 and n>m:pairs.append((m,int(n)))
assert pairs==[(28,812)] and sum((F(1,k*(k+1)) for k in range(28,812)),F())==F(1,29)
checks['telescoping']=840
checks['divisor-sums']=F(sum(s.divisors(768)),768)-F(sum(s.divisors(384)),384);assert checks['divisor-sums']==F(1,192)
checks['congruences']=next(n for n in range(101,1000) if n%9==5 and n%17==4);assert checks['congruences']==140
pairs=[(a,b) for a in range(3,101) for b in range(a+1,101) if 2*(a-2)*(b-2)==a*b];assert pairs==[(5,12),(6,8)]
checks['integer-factorization']=len(pairs)
checks['triangle-centers']=s.sqrt(s.Rational(13,2)*(s.Rational(13,2)-4));assert checks['triangle-centers']==s.sqrt(65)/2
A,B,C,D=map(s.Point,[(0,0),(1,2),(3,3),(4,0)])
E=s.Point(s.Rational(27,8),s.Rational(15,8));assert abs(s.Triangle(A,D,E).area)==abs(s.Polygon(A,B,C,D).area)/2
checks['shoelace']=58
checks['amgm']=max(a*m*c+a*m+m*c+a*c for a in range(13) for m in range(13-a) for c in [12-a-m]);assert checks['amgm']==112
x=s.Rational(4,27);assert s.simplify(2*s.log(2*x)-3*s.log(3*x))==0
checks['logarithms']=31
z=-656+164*s.I;assert s.simplify(z/(z+697))==4*s.I
checks['complex-division']=697
plates=json.loads((Path(__file__).resolve().parents[2]/'src/content/formulary.json').read_text());assert set(checks)=={p['id'] for p in plates}
print(json.dumps({k:str(v) for k,v in checks.items()},indent=2));print('18 independent source-example checks passed.')
