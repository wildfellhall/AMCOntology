"""Compare rendered excerpt ink to the same source-PDF crop; write QA outside the repo."""
from pathlib import Path
import json
import pymupdf as fitz
from PIL import Image, ImageFilter,ImageDraw
import numpy as np
root=Path(__file__).resolve().parents[2]
book=json.loads((root/'src/content/textbook-examples.json').read_text());doc=fitz.open(root/'Mastering_AMC_1012_Book.pdf')
out=Path('/tmp/amc-formulary/source-audit');out.mkdir(parents=True,exist_ok=True)
scores=[];thumbs=[];blanks=[]
for e in book['examples']:
 for asset in e['statement']+e['solution']+((e['correction']['statement']+[e['correction']['figure']]) if e.get('correction') else []):
  if not asset.get('crop'):continue
  page=doc[asset['page']-1];crop=fitz.Rect(asset['crop'])
  original=page.get_pixmap(matrix=fitz.Matrix(1.5,1.5),clip=crop,alpha=False)
  svg=fitz.open(root/'public'/asset['src'].lstrip('/'))
  rendered=svg[0].get_pixmap(matrix=fitz.Matrix(1.5,1.5),alpha=False)
  a=Image.frombytes('RGB',[original.width,original.height],original.samples)
  b=Image.frombytes('RGB',[rendered.width,rendered.height],rendered.samples).resize(a.size)
  # A one-pixel halo permits fractional crop origins and rasterization differences.
  mask=(np.min(np.array(a),axis=2)<110)
  other=Image.fromarray(((np.min(np.array(b),axis=2)<170)*255).astype('uint8')).filter(ImageFilter.MaxFilter(5))
  if mask.sum()==0:
   blanks.append(asset['src']);continue
  coverage=float(((np.array(other)>0)&mask).sum()/mask.sum())
  scores.append((coverage,asset['src']))
  if e['number'].endswith('.1') and asset==e['statement'][0]:
   b.thumbnail((480,250));thumbs.append((e['number'],b.copy()))
for start in range(0,len(thumbs),6):
 sheet=Image.new('RGB',(1000,900),'#fffdf4');d=ImageDraw.Draw(sheet)
 for j,(num,im) in enumerate(thumbs[start:start+6]):
  x=10+(j%2)*500;y=30+(j//2)*300;sheet.paste(im,(x,y));d.text((x,y-20),'Example '+num,fill='black')
 sheet.save(out/f'chapters-{start//6}.png')
print('Blank source slices',blanks)
print('Compared',len(scores),'SVG excerpts with their PDF crops; lowest ink coverage:')
print(json.dumps(sorted(scores)[:12],indent=2))
# Missing a little anti-aliased edge is harmless; losing body text is not.
assert not blanks,blanks
assert min(s[0] for s in scores)>.90
