"""Build the checked-in curriculum. Python 3.12+ with SymPy."""
from content.lessons import LESSONS
from content.problems import GENERATORS
from content.drills import FORMULAS,BAD_PLANS
from content.formula_equivalence import group as formula_group
from content.formula_objectives import OBJECTIVES
from content.contest import STUDIES, FORMULAS as CONTEST_FORMULAS, CHECKS
from content.contest.methods import METHODS as CONTEST_METHODS
from copy import deepcopy
from pathlib import Path
import json,random,hashlib
OUT=Path(__file__).resolve().parents[1]/'src/content'
released={s['lesson']:s for s in json.loads((OUT/'released.json').read_text())}

def sentence(text):
 return text[:1].upper()+text[1:]

def choices(correct,wrong,seed):
 values=list(dict.fromkeys([correct]+wrong))[:5]
 random.Random(seed).shuffle(values)
 return values,values.index(correct)

def problem(raw,id,node,mode='problem',family=0,variant=0,level=1):
 opts,answer=choices('$'+raw['answer']+'$',['$'+v+'$' for v in raw['wrong']],id)
 return dict(id=id,lessonId=node['id'],kind=mode,stem=raw['stem'],options=opts,answer=answer,solution=raw['solution'],hints=raw['hints'],misconception=node['pitfall'],level=level,family=f'{node["id"]}-{family}',variant=variant,source={'kind':'original','title':'AMCOntology original'},verification={'exact':raw['exact'],'parameterChecked':raw['checked']})

lessons=[];questions=[];formulas=[];methods=[];assessments=[]
for ix,node in enumerate(LESSONS):
 id=node['id'];fn=GENERATORS[id]
 variants={t:fn(t) for t in [1,2,3,4]}
 assert all(len(q)==7 for q in variants.values())
 lesson_questions=[]
 for t in [2,3]:
  for j,raw in enumerate(variants[t]):
   level=1 if j<2 else 2 if j<5 else 3
   q=problem(raw,f'{id}-p{j+1}-v{t}',node,family=j,variant=t,level=level)
   lesson_questions.append(q)
 assert len({q['stem'] for q in lesson_questions})==14, f'Duplicate problem stem in {id}'
 lesson_questions.sort(key=lambda q:(q['level'],q['variant'],q['family']))
 s=released[id]
 num=int(s['title'].split('Problem ')[1])
 real=dict(id=f'{id}-released',lessonId=id,kind='released',stem=f'Work through {s["title"]} on the original source page, then select the same answer letter here.',options=['Original option '+c for c in 'ABCDE'],answer='ABCDE'.index(s['answer']),solution=[f'The verified source key is option {s["answer"]}.'+(f' Its value is ${s["answerValue"]}$.' if s['answerValue'] and len(s['answerValue'])<40 else ''),'Compare your reasoning with the source solution. Record the step that made the problem unlock in your notes.'],hints=[node['objectives'][0],'Use the source’s hints if you need a more specific starting point.'],misconception=node['pitfall'],level=1 if num<=10 else 2 if num<=20 else 3,family=f'{id}-released',variant=0,source=s)
 lesson_questions.append(real);questions+=lesson_questions
 examples=[problem(variants[1][0],f'{id}-example-1',node,family=0,variant=1),problem(variants[4][6],f'{id}-example-2',node,family=6,variant=4,level=3)]
 lessons.append({**node,'path':'reference','number':ix+1,'examples':examples,'questionIds':[q['id'] for q in lesson_questions]})
 # Four contextual method questions use authored recognition and setup hints.
 for j in [2,3,5,6]:
  raw=variants[1][j];mid=f'{id}-method-{j}'
  correct=' '.join(raw['hints'])
  options,answer=choices(correct,BAD_PLANS[id],mid)
  methods.append(dict(id=mid,lessonId=id,kind='method',stem=raw['stem'],prompt='Which plan is mathematically sound?',options=options,answer=answer,solution=[correct]+raw['solution'],hints=['Identify the structure before computing.','Check the assumptions of each proposed method.'],misconception=node['pitfall'],level=2 if j<5 else 3,family=f'{id}-method-{j}',source={'kind':'original','title':'AMCOntology method study'}))
 # A separate diagnostic samples routing, without claims of score prediction.
 if id in ['fractions','ratios','exponents','linear','identities','factors','angles','right-triangles','coordinates','counting','combinations','probability','logarithms','trigonometry','complex']:
  assessments.append(problem(variants[1][2],f'{id}-diagnostic',node,family=2,variant=1,level=2))

# Competition studies are authored as distinct problems, not parameter sweeps.
for offset,source in enumerate(STUDIES):
 node=deepcopy(source); id=node['id']
 originals=node.pop('originalProblems'); reference=deepcopy(released[node.pop('releasedFrom')])
 real=deepcopy(next(q for q in questions if q['kind']=='released'))
 rid=id+'-released'+('-2023b21' if id=='probability-states' else '')
 real.update(id=rid,lessonId=id,family=rid,stem=f'Work through {reference["title"]} on the original source page, then select the same answer letter here.',answer='ABCDE'.index(reference['answer']),source=reference,solution=[f'The verified source key is option {reference["answer"]}.','Compare your reasoning with the linked source solution, and record the decisive mathematical step.'],hints=[node['objectives'][0],'Use the source’s hints for a more specific starting point.'],misconception=node['pitfall'],level=3 if int(reference['title'].split('Problem ')[1])>20 else 2)
 node.update(number=offset+1,questionIds=[q['id'] for q in originals]+[real['id']])
 lessons.append(node);questions.extend(originals+[real])

methods.extend(CONTEST_METHODS)
ALL_FORMULAS=FORMULAS+CONTEST_FORMULAS
objective_lookup={}
for lid,objectives in OBJECTIVES.items():
 relations=[f for f in CONTEST_FORMULAS if f['lessonId']==lid]
 assert len(relations)==len(objectives)
 for relation,objective in zip(relations,objectives):
  objective_lookup[(lid,relation['name'])]=objective

def objective_for(relation):
 return objective_lookup.get((relation['lessonId'],relation['name']),sentence(relation['use'])+'.')

formula_counts={}
for i,entry in enumerate(ALL_FORMULAS):
 node=next(n for n in lessons if n['id']==entry['lessonId']);id=node['id']
 formula_counts[id]=formula_counts.get(id,0)+1
 prefix=(id if formula_counts[id]==1 else id+'-relation-'+str(formula_counts[id]))+'-v2'
 pool=[f for f in ALL_FORMULAS if formula_group(f)!=formula_group(entry) and f['tex']!=entry['tex'] and f['lessonId']!=id and next(n for n in lessons if n['id']==f['lessonId'])['track']<=node['track']]
 rng=random.Random(id);rng.shuffle(pool)
 related=[f for f in pool if next(n for n in lessons if n['id']==f['lessonId'])['domain']==node['domain']]
 others=[]; seen_groups={formula_group(entry)}
 for candidate in related+[f for f in pool if f not in related]:
  if formula_group(candidate) not in seen_groups:
   others.append(candidate);seen_groups.add(formula_group(candidate))
  if len(others)==4:break
 assert len(others)==4
 base=dict(lessonId=id,level=1,source={'kind':'original','title':'AMCOntology formula study'},misconception=node['pitfall'],hints=[entry['condition'],'Think about what each symbol measures.'],family=f'{id}-formula')
 options,answer=choices('$'+entry['tex']+'$',['$'+o['tex']+'$' for o in others],id+'recognition')
 formulas.append(dict(**base,id=prefix+'-formula-recall',kind='formula',stem='Which relation directly matches this task and the stated quantities?',context=sentence(entry['use'])+'. '+entry['condition'],options=options,answer=answer,solution=['$'+entry['tex']+'$',entry['condition']]))
 options,answer=choices(sentence(entry['use'])+'.',[sentence(o['use'])+'.' for o in others],id+'meaning')
 formulas.append(dict(**base,id=prefix+'-formula-meaning',kind='definition',stem='What does this relation help you do?',context='$'+entry['tex']+'$',options=options,answer=answer,solution=[sentence(entry['use'])+'.',entry['condition']]))
 pairs=[{'left':sentence(x['use'])+'.','right':'$'+x['tex']+'$'} for x in [entry]+others[:2]]
 formulas.append(dict(**base,id=prefix+'-formula-match',kind='matching',stem='Match each situation to its mathematical relation.',pairs=pairs,options=[],answer=0,solution=[x['left']+' '+x['right'] for x in pairs]))
 if id in OBJECTIVES:
  scenario_id=prefix.removesuffix('-v2')+'-choice-v1'
  objective=objective_for(entry)
  distractor_map={'$'+o['tex']+'$':o for o in others}
  options,answer=choices('$'+entry['tex']+'$',list(distractor_map),scenario_id+'forward')
  rationales=[entry['condition'] if j==answer else 'This relation is for '+distractor_map[value]['use']+'.' for j,value in enumerate(options)]
  formulas.append(dict(**base,id=scenario_id+'-objective-formula',kind='formula',context=objective,stem='Which formula directly accomplishes this objective?',options=options,answer=answer,optionRationales=rationales,solution=['$'+entry['tex']+'$',sentence(entry['use'])+'. '+entry['condition']]))
  distractor_map={objective_for(o):o for o in others}
  assert len(distractor_map)==4 and objective not in distractor_map
  options,answer=choices(objective,list(distractor_map),scenario_id+'reverse')
  rationales=[entry['condition'] if j==answer else 'That objective instead calls for $'+distractor_map[value]['tex']+'$.' for j,value in enumerate(options)]
  formulas.append(dict(**base,id=scenario_id+'-formula-objective',kind='definition',context='$'+entry['tex']+'$',stem='Which objective is directly fulfilled by this formula?',options=options,answer=answer,optionRationales=rationales,solution=[objective,entry['condition']]))

diagnostic_ids=[
 'algebra-transformations-q02','polynomial-structure-q01','sequence-synthesis-q08',
 'integer-constraints-q03','congruence-systems-q02','valuations-divisors-q08',
 'geometric-constructions-q01','ratio-geometry-q04','circle-synthesis-q03',
 'coordinate-lattice-q14','constrained-counting-q06','probability-states-q06',
 'log-trig-synthesis-q01','log-trig-synthesis-q10','complex-roots-unity-q07',
]
assessments=[next(q for q in questions if q['id']==qid) for qid in diagnostic_ids]

assert len(questions)==15*len(lessons)
assert len(formulas)==3*len(ALL_FORMULAS)+2*len(CONTEST_FORMULAS)
assert len(methods)==200+len(CONTEST_METHODS)
assert set(GENERATORS)=={l['id'] for l in LESSONS}==set(BAD_PLANS)=={f['lessonId'] for f in FORMULAS}
legacy_path=OUT/'legacy-questions.json'
legacy={q['id']:q for q in json.loads(legacy_path.read_text())} if legacy_path.exists() else {}
active_ids={q['id'] for q in questions+formulas+methods+assessments}
for filename in ['questions.json','formula-questions.json','method-questions.json','diagnostic.json']:
 path=OUT/filename
 if path.exists():
  for q in json.loads(path.read_text()):
   if isinstance(q,dict) and q['id'] not in active_ids:legacy[q['id']]=q
legacy={qid:q for qid,q in legacy.items() if qid not in active_ids}
legacy_path.write_text(json.dumps(list(legacy.values()),ensure_ascii=False,indent=2)+'\n')
(OUT/'contest-verification.json').write_text(json.dumps(CHECKS,ensure_ascii=False,indent=2)+'\n')
for filename,data in [('lessons.json',lessons),('questions.json',questions),('formula-questions.json',formulas),('method-questions.json',methods),('formulas.json',ALL_FORMULAS),('diagnostic.json',diagnostic_ids)]:
 (OUT/filename).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
print(f'Built {len(lessons)} lessons, {len(questions)} course questions, {len(formulas)} formula drills, {len(methods)} method questions, and {len(assessments)} diagnostic items.')
