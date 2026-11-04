"""Verify real-problem references. Keeps publisher text in a temporary research cache only."""
from pathlib import Path
from urllib.request import urlopen, Request
from urllib.parse import urljoin
from concurrent.futures import ThreadPoolExecutor
from bs4 import BeautifulSoup
from content.lessons import LESSONS
import json,re,hashlib
BASE='https://live.poshenloh.com'
CACHE=Path('/tmp/amc-research/released')
CACHE.mkdir(parents=True,exist_ok=True)
EXISTING={s['lesson']:s for s in json.loads(Path('src/content/released.json').read_text()) if 'error' not in s} if Path('src/content/released.json').exists() else {}
def fetch(url):
 return BeautifulSoup(urlopen(Request(url,headers={'User-Agent':'AMCOntology curriculum reference check'}),timeout=35).read(),'html.parser')
index=fetch(BASE+'/past-contests/concepts')
links=[a for a in index.find_all('a',href=True) if '/past-contests/concepts/' in a['href']]
def verify(node):
 if node['id'] in EXISTING:return EXISTING[node['id']]
 try:
  term=node['sourceConcept'].casefold()
  link=next(a for a in links if re.sub(r'\s*\d+$','',a.get_text(' ',strip=True)).casefold().strip()==term)
  topicurl=urljoin(BASE,link['href'])
  page=fetch(topicurl)
  candidates=[]
  for a in page.find_all('a',href=True):
   m=re.search(r'/amc(10|12)/(\d{4}[ABCD]?)/problem/(\d+)$',a['href'].split('?')[0])
   if not m: continue
   track,year,num=int(m[1]),m[2],int(m[3])
   if track!=node['track'] or not 2000<=int(year[:4])<=2024: continue
   target=7 if node['domain']=='Foundations' else 14
   score=abs(num-target)*3+(2024-int(year[:4]))
   candidates.append((score,urljoin(BASE,a['href']),year,num))
  if not candidates: raise ValueError('No matching released problem in selected range')
  _,url,year,num=min(candidates)
  page=fetch(url)
  data=json.loads(page.find('script',type='application/json').get_text())['props']['pageProps']
  q=data['q']
  assert q['answer'].lower() in 'abcde'
  (CACHE/(node['id']+'.json')).write_text(json.dumps({'url':url,'q':q},ensure_ascii=False,indent=2))
  source=dict(lesson=node['id'],kind='released',title=f'{year[:4]} AMC {node["track"]}{year[4:]} · Problem {num}',url=url,conceptUrl=topicurl,answer=q['answer'].upper(),answerValue=q.get('answerFillIn',''),concepts=q['concepts'],verified='2026-11-03',statementHash=hashlib.sha256(q['question'].encode()).hexdigest(),attribution='Problem © Mathematical Association of America. Statement and solution hosted by LIVE by Po-Shen Loh.')
  print(node['id'],source['title'],source['answer'],flush=True)
  return source
 except Exception as e:
  print('FAILED',node['id'],str(e),flush=True)
  return {'lesson':node['id'],'error':str(e)}
with ThreadPoolExecutor(max_workers=3) as pool:
 sources=list(pool.map(verify,LESSONS))
 sources.extend(s for lid,s in EXISTING.items() if lid not in {n["id"] for n in LESSONS})
for s in sources:
 if 'title' in s and s['title'].startswith('2021'):
  for internal,official in [('10C','10A Fall'),('10D','10B Fall'),('12C','12A Fall'),('12D','12B Fall'),('10A ·','10A Spring ·'),('10B ·','10B Spring ·'),('12A ·','12A Spring ·'),('12B ·','12B Spring ·')]:
   s['title']=s['title'].replace(internal,official)
Path('src/content/released.json').write_text(json.dumps(sources,ensure_ascii=False,indent=2)+'\n')
assert all('error' not in s for s in sources), 'Inspect failed source checks'
