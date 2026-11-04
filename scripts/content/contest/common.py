from fractions import Fraction
import random

STUDIES=[]
FORMULAS=[]
CHECKS=[]

def tex(value):
    if isinstance(value,str): return value
    import sympy
    if isinstance(value,sympy.Basic): return sympy.latex(value)
    value=Fraction(value)
    if value.denominator==1: return str(value.numerator)
    return ('-' if value<0 else '')+r'\frac{'+str(abs(value.numerator))+'}{'+str(value.denominator)+'}'

def item(key,stem,answer,wrong,solution,hints,*,decision,skills,check,check_method,level=3):
    """Every distractor has an explicit rationale; no numerical filler fallback."""
    assert len(wrong)==4 and all(len(x)==2 for x in wrong),key
    assert len(hints)==2 and len(solution)>=3,key
    exact=tex(answer)
    if callable(check): result=check()
    else: result=check
    if result != answer:
        import sympy
        difference=sympy.simplify(sympy.sympify(result)-sympy.sympify(answer))
        assert difference == 0 or difference.equals(0),(key,answer,result)
    choices=[(exact,'Correct: '+decision)]+[(tex(v),why) for v,why in wrong]
    assert len({v for v,_ in choices})==5,key
    random.Random(key).shuffle(choices)
    CHECKS.append(dict(id=key,method=check_method))
    return dict(id=key,kind='problem',stem=stem,options=['$'+v+'$' for v,_ in choices],answer=next(i for i,(v,_) in enumerate(choices) if v==exact),optionRationales=[why for _,why in choices],solution=solution,hints=hints,misconception=' '.join(why for _,why in wrong[:1]),level=level,family=key,source=dict(kind='original',title='AMCOntology competition study'),demand='contest' if level==3 else 'connection',decision=decision,skills=skills,verification=dict(exact=str(answer),parameterChecked=True,method=check_method))

def section(title,*paragraphs): return dict(title=title,paragraphs=list(paragraphs))

def study(id,title,domain,prerequisites,chapter,pages,introduction,sections,objectives,derivation,pitfall,examples,problems,activity,*,track=10,visual=None,techniques=None,released_from=None):
    assert len(problems)==14,(id,len(problems))
    assert len(examples)==2
    for q in examples+problems:q['lessonId']=id
    STUDIES.append(dict(id=id,title=title,domain=domain,track=track,summary=introduction[0].split('. ')[0]+'.',minutes=40,prerequisites=prerequisites.split(),chapter=chapter,sourceConcept=title,objectives=objectives,teaching=introduction,sections=sections,derivation=derivation,pitfall=pitfall,visual=visual or id,examples=examples,originalProblems=problems,activity=activity,path='competition',techniques=techniques or [],reference=dict(book='Mastering AMC 10/12',chapter=chapter,pages=pages),releasedFrom=released_from))

def formula(lesson,tex,name,use,condition):
    FORMULAS.append(dict(lessonId=lesson,tex=tex,name=name,use=use,condition=condition))
