"""Extract numbered examples from the user-supplied local textbooks.

Requires PyMuPDF: uv run --with pymupdf python scripts/textbooks/extract.py
PDFs stay local. SVG excerpts preserve original notation and source illustrations.
"""
from pathlib import Path
import json, re, hashlib
import pymupdf as fitz

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'public' / 'textbook'
OUT.mkdir(parents=True, exist_ok=True)
doc = fitz.open(ROOT / 'Mastering_AMC_1012_Book.pdf')
chapter_toc = [t for t in doc.get_toc() if t[0] == 2][:44]
chapters = [{'number': i+1, 'title': t[1], 'page': t[2], 'domain': 'Counting & probability' if i<11 else 'Algebra' if i<20 else 'Number theory' if i<28 else 'Geometry' if i<38 else 'Advanced topics'} for i,t in enumerate(chapter_toc)]
lines=[]; boxes={}; markers=[]; boundaries=[]
for pi,p in enumerate(doc):
    boxes[pi]=[d['rect'] for d in p.get_drawings() if d['fill'] and d['color'] and d['rect'].width>400 and d['color'][1] > d['color'][0]+.15 and d['color'][1]>d['color'][2]+.15]
    for b in p.get_text('dict')['blocks']:
        for l in b.get('lines',[]):
            text=''.join(s['text'] for s in l['spans']).strip()
            if not text or l['bbox'][1]<82 or l['bbox'][3]>758: continue
            item={'page':pi,'text':text,'rect':fitz.Rect(l['bbox']), 'size':max(s['size'] for s in l['spans'])}
            lines.append(item)
            if re.match(r'^Example\s+\d+\.\d+',text): markers.append(item)
            if re.match(r'^(Example|Problem|Theorem|Concept|Remark|Definition|Lemma)\s+\d',text) or (item['size']>16 and re.match(r'^\d',text)):
                boundaries.append(item)

def position(x): return (x['page'],x['rect'].y0)
lines.sort(key=position); boundaries.sort(key=position);markers.sort(key=position)

def svg(pi,rect,name):
    # Clip on a fresh page, converting fonts to paths to preserve TeX glyphs.
    tmp=fitz.open();tmp.insert_pdf(doc,from_page=pi,to_page=pi)
    p=tmp[0]
    for outside in [fitz.Rect(0,0,p.rect.width,rect.y0),fitz.Rect(0,rect.y1,p.rect.width,p.rect.height),fitz.Rect(0,rect.y0,rect.x0,rect.y1),fitz.Rect(rect.x1,rect.y0,p.rect.width,rect.y1)]:
        if not outside.is_empty:p.add_redact_annot(outside,fill=None)
    p.apply_redactions(images=2,graphics=1,text=0)
    p.set_cropbox(rect)
    data=p.get_svg_image(text_as_path=True)
    # Remove only the pale green source box fill; retain semantic diagram colors.
    data=re.sub(r'fill="#(?:f7fa[0-9a-f]{2}|f7fb[0-9a-f]{2}|f7fc[0-9a-f]{2})"', 'fill="none"', data)
    # Keep blue/red distinctions, using the site's manuscript pigments.
    data=data.replace('#0000ff','#344f64').replace('#ff0000','#984538')
    (OUT/name).write_text(data)
    return {'src':'/textbook/'+name,'width':round(rect.width,2),'height':round(rect.height,2),'page':pi+1,'crop':[round(v,4) for v in rect]}

examples=[];issues=[]
for m in markers:
    num=re.search(r'\d+\.\d+',m['text'])[0];chapter=int(num.split('.')[0]);start=m['page']
    following=next((b for b in boundaries if position(b)>position(m)),None)
    endpage=following['page'] if following else start
    endy=following['rect'].y0-11 if following else 754
    containing=[r for r in boxes[start] if r.contains(m['rect'])]
    if not containing: issues.append(('missing box',num));continue
    box=min(containing,key=lambda r:r.height)
    # A broken example box continues at the top of the following page.
    stem_boxes=[(start,box)]
    pi=start
    while stem_boxes[-1][1].y1>747 and pi<endpage:
        pi+=1
        candidates=[r for r in boxes[pi] if r.y0<100 and r.y0< (endy if pi==endpage else 754)]
        if not candidates:break
        stem_boxes.append((pi,min(candidates,key=lambda r:r.y0)))
    stem=[];stem_text=[];videos=[]
    for j,(pi,r) in enumerate(stem_boxes):
        y0=m['rect'].y1+1 if j==0 else r.y0+5
        y1=r.y1-8
        vl=[l for l in lines if l['page']==pi and 'Video Solution' in l['text'] and y0<l['rect'].y0<r.y1]
        if vl:y1=min(l['rect'].y0 for l in vl)-6
        if y1>y0:stem.append(svg(pi,fitz.Rect(80,y0,532,y1),f'example-{num}-{j+1}.svg'))
        stem_text.extend(l['text'] for l in lines if l['page']==pi and y0<=l['rect'].y0<y1)
        videos.extend(link['uri'] for link in doc[pi].get_links() if link.get('uri','').startswith(('https://youtu','https://www.youtube')) and r.intersects(link['from']))
    lastpi,lastbox=stem_boxes[-1]
    # Only label a written solution if the actual source has a Solution heading.
    solheading=next((l for l in lines if position(l)>(lastpi,lastbox.y1) and position(l)<(endpage,endy) and re.match(r'^Solution\b',l['text'])),None)
    solution=[]
    if solheading:
        for pi in range(solheading['page'],endpage+1):
            y0=solheading['rect'].y1+8 if pi==solheading['page'] else 88
            y1=endy if pi==endpage else 754
            # Trim unused bottom whitespace using actual text/drawing extents.
            present=[l['rect'].y1 for l in lines if l['page']==pi and y0<l['rect'].y0<y1]
            for d in doc[pi].get_drawings():
                r=d['rect']
                if r.height>2 and r.y0>=y0 and r.y1<=y1:present.append(r.y1)
            if present:y1=min(y1,max(present)+4)
            for block in doc[pi].get_text("dict")["blocks"]:
                if block["type"]==1 and block["bbox"][1]>=y0 and block["bbox"][3]<=y1:present.append(block["bbox"][3])
            if present and y1>y0+4:solution.append(svg(pi,fitz.Rect(72,y0,540,y1),f'solution-{num}-{pi-solheading["page"]+1}.svg'))
    videos.extend(link['uri'] for pi in range(start,endpage+1) for link in doc[pi].get_links() if link.get('uri','').startswith(('https://youtu','https://www.youtube')) and (pi,link['from'].y0)>position(m) and (pi,link['from'].y0)<(endpage,endy))
    source_type='AMC 12' if 'AMC 12' in m['text'] else 'AMC 10' if 'AMC 10' in m['text'] else 'Enrichment' if any(s in m['text'] for s in ['AIME','PUMAC','HMMT','USAMO','BMT','SMT','IMO']) else 'Textbook'
    examples.append({'id':'example-'+num,'number':num,'chapter':chapter,'chapterTitle':chapters[chapter-1]['title'],'domain':chapters[chapter-1]['domain'],'page':start+1,'lastPage':max([s['page'] for s in stem+solution]),'attribution':m['text'],'level':source_type,'amc12':chapter>=41 or source_type=='AMC 12','searchText':re.sub(r'[\x00-\x1f]', ' ', ' '.join(stem_text)),'statement':stem,'solution':solution,'videos':list(dict.fromkeys(videos))})
assert len(examples)==len(markers)==232,issues
assert len({e['id'] for e in examples})==232
# The supplied edition displaces 23 geometry figures. Preserve each original
# excerpt, but show a corrected reading copy with an explicitly documented figure.
repairs=json.loads((Path(__file__).with_name('figure-repairs.json')).read_text())
for example in examples:
    repair=repairs.get(example['number'])
    example['correction']=None
    if not repair:continue
    original=example['statement'][0]
    rect=fitz.Rect(original['crop']);rect.y1=repair['statementBottom']
    reading=svg(original['page']-1,rect,f"reading-{example['number']}.svg")
    if 'page' in repair:
        figure=svg(repair['page']-1,fitz.Rect(repair['crop']),f"figure-{example['number']}.svg")
        note=f"The supplied edition pairs this problem with an unrelated diagram. The matching source figure from page {repair['page']} is shown here."
    else:
        # Exact quarter-division construction; no inference from the wrong figure.
        data='''<svg xmlns="http://www.w3.org/2000/svg" width="448" height="260" viewBox="0 0 448 260">
<title>Right triangle ACE and its quarter-division triangle DBF</title>
<g fill="none" stroke="#344f64" stroke-width="1.6" stroke-linejoin="round">
<path d="M100 30V210H340Z"/><path d="M100 198H112V210"/>
<path d="M100 75L160 210L280 165Z" fill="#ece5bd"/>
</g><g fill="#29382d" font-family="Georgia,serif" font-size="16">
<text x="95" y="21">A</text><text x="79" y="79">B</text>
<text x="86" y="231">C</text><text x="155" y="231">D</text>
<text x="343" y="222">E</text><text x="284" y="158">F</text>
<text x="65" y="137">12</text><text x="224" y="232">16</text>
<text x="231" y="111">20</text></g></svg>'''
        name=f"figure-{example['number']}.svg";(OUT/name).write_text(data)
        figure={'src':'/textbook/'+name,'width':448,'height':260,'page':original['page'],'crop':None}
        note="The supplied edition pairs this problem with an unrelated diagram. This replacement is constructed from the stated side lengths and quarter-division points."
    example['correction']={'note':note,'statement':[reading],'figure':figure,'description':repair['description'],'kind':'reassociated' if 'page' in repair else 'constructed'}
used={Path(a['src']).name for e in examples for a in e['statement']+e['solution']}
for old in OUT.glob('*.svg'):
    if re.fullmatch(r'(?:example|solution)-\d+\.\d+-\d+\.svg',old.name) and old.name not in used:old.unlink()
payload={'book':'Mastering AMC 10/12','author':'Omega Learn','sourceUrl':'https://www.omegalearn.org/mastering-amc1012','sourceSha256':hashlib.sha256((ROOT/'Mastering_AMC_1012_Book.pdf').read_bytes()).hexdigest(),'chapters':chapters,'examples':examples}
(ROOT/'src/content/textbook-examples.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n')
# Crash-course section markers often occupy two adjacent lines.
crash=fitz.open(ROOT/'OmegaLearn_AMC1012_CrashCourse.pdf');sections=[]
for pi,p in enumerate(crash):
    blocks=p.get_text('dict')['blocks']
    for b in blocks:
        ls=b.get('lines',[])
        for j,l in enumerate(ls):
            text=''.join(s['text'] for s in l['spans']).strip()
            if re.fullmatch(r'\d+\.\d+',text) and max(s['size'] for s in l['spans'])>15 and j+1<len(ls):
                title=''.join(s['text'] for s in ls[j+1]['spans']).strip()
                sections.append({'section':text,'title':title,'page':pi+1})
(ROOT/'src/content/crash-sections.json').write_text(json.dumps(sections,indent=2)+'\n')
print(json.dumps({'examples':len(examples),'writtenSolutions':sum(bool(e['solution']) for e in examples),'videoSolutions':sum(bool(e['videos']) for e in examples),'crashSections':len(sections),'issues':issues,'assets':len(list(OUT.glob('*.svg'))),'bytes':sum(p.stat().st_size for p in OUT.glob('*.svg'))},indent=2))
