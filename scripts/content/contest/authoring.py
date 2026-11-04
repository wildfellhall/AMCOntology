"""Compact authoring helpers; never synthesize answers or distractors."""
from .common import item,study,section,formula

def maker(lid,skills):
 def q(n,stem,answer,wrong,steps,hints,decision,check,method='Independent finite enumeration.',level=3,suffix=''):
  return item(f'{lid}-'+(f'q{n:02}' if n<100 else f'example-{n-100}')+suffix,stem,answer,wrong,steps,hints,decision=decision,skills=skills,check=check,check_method=method,level=level)
 return q

def finish(lid,title,domain,prereq,chapter,pages,intro,sections,objectives,derivation,pitfall,examples,problems,activity,techniques,formulas,released,track=10):
 study(lid,title,domain,prereq,chapter,pages,intro,sections,objectives,derivation,pitfall,examples,problems,activity,techniques=techniques,released_from=released,track=track)
 for f in formulas:formula(lid,*f)
