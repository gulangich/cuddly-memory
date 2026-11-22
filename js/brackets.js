/* js/brackets.js — подсветка парных скобок и HTML-тегов.
   Строки берутся из i18n/*.js (раздел brackets). */
(function(){
const I18N=window.HubPadI18n;
if(!I18N)return;
I18N.ready.then(start).catch(()=>{});
function start(){
const $=s=>document.querySelector(s);
const code=$('#code'),hl=$('#hl'),edScroll=$('#edScroll'),toolbar=$('#edToolbar'),gutter=$('#gutter'),metrics=$('#metrics');
if(!code||!hl||!edScroll||!toolbar)return;
const t=I18N.t;
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const escA=s=>esc(s).replace(/"/g,'&quot;');
const KEY='hubpad.brackets';
const DEF={rainbow:true,pair:true,tags:true,bad:true,style:'box',hues:6,intensity:45};
let cfg={...DEF};
try{
  const raw=localStorage.getItem(KEY);
  if(raw){
    const d=JSON.parse(raw);
    if(d&&typeof d==='object'){
      ['rainbow','pair','tags','bad'].forEach(k=>{if(typeof d[k]==='boolean')cfg[k]=d[k];});
      if(['box','line','glow'].includes(d.style))cfg.style=d.style;
      if(Number.isFinite(d.hues))cfg.hues=Math.min(6,Math.max(1,d.hues|0));
      if(Number.isFinite(d.intensity))cfg.intensity=Math.min(100,Math.max(10,d.intensity|0));
    }
  }
}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(cfg));}catch(e){}}
const P=d=>'<path d="'+d+'"/>';
const ICO={
rainbow:'<circle cx="8" cy="8" r="6.2"/>'+P('M8 1.8a6.2 6.2 0 0 1 0 12.4')+P('M4.6 3.2a6.2 6.2 0 0 0 0 9.6'),
pair:P('M6 2.5C4 4 3.2 6 3.2 8s.8 4 2.8 5.5')+P('M10 2.5c2 1.5 2.8 3.5 2.8 5.5s-.8 4-2.8 5.5'),
tag:P('m5.5 4.5-3.5 3.5 3.5 3.5M10.5 4.5l3.5 3.5-3.5 3.5'),
bad:P('M8 2 14.5 13.5h-13Z')+P('M8 6.5v3')+'<circle cx="8" cy="11.6" r=".8" fill="currentColor" stroke="none"/>',
jump:P('M3 8h9')+P('m8.5 4.5 3.5 3.5-3.5 3.5')+P('M13.5 3v10'),
select:'<rect x="2.5" y="3.5" width="11" height="9" rx="1.5"/>'+P('M6 6.5v3M10 6.5v3'),
reset:P('M13.5 3v3.5H10')+P('M13.2 6.5A5.5 5.5 0 1 0 13.5 8')
};
const ic=(n,s=14)=>'<svg width="'+s+'" height="'+s+'" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+ICO[n]+'</svg>';
const OPEN={')':'(',']':'[','}':'{'};
const CLOSE={'(':')','[':']','{':'}'};
const VOID=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
const RX_KW=new Set(['return','typeof','instanceof','in','of','new','delete','void','throw','case','do','else','yield','await']);
const MAX=260000;
function regexAllowed(prev){
  if(!prev)return true;
  if(prev==='value')return false;
  if(RX_KW.has(prev)||prev==='=>')return true;
  if(/^[{}()\[\];,:?=!&|+\-*%<>~^]$/.test(prev))return true;
  if(/^[+\-*\/%<>=!&|?:]+$/.test(prev))return true;
  return false;
}
function scanRegex(src,start){
  let j=start+1,cls=false;
  while(j<src.length){
    const c=src[j];
    if(c==='\\'){j+=2;continue;}
    if(c==='\n'||c==='\r')return -1;
    if(c==='[')cls=true;
    else if(c===']')cls=false;
    else if(c==='/'&&!cls){j++;while(j<src.length&&/[dgimsuvy]/.test(src[j]))j++;return j;}
    j++;
  }
  return -1;
}
function scanJs(src,base,out){
  const re=/\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$)|`(?:\\[\s\S]|[^\\`])*`?|"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?|[{}()\[\]]|[A-Za-z_$][\w$]*|\d+(?:\.\d+)?|=>|[+\-*\/%<>=!&|?:]+|\s+|[\s\S]/g;
  const stack=[];let m,prev='';
  while((m=re.exec(src))){
    const tk=m[0];
    if(tk.startsWith('//')||tk.startsWith('/*'))continue;
    if(tk[0]==='"'||tk[0]==="'"||tk[0]==='`'){prev='value';continue;}
    if(tk[0]==='/'&&regexAllowed(prev)){const end=scanRegex(src,m.index);if(end>m.index){re.lastIndex=end;prev='value';continue;}}
    if(/^\s+$/.test(tk))continue;
    if(/^[A-Za-z_$]/.test(tk)){prev=tk;continue;}
    if(/^\d/.test(tk)){prev='value';continue;}
    if(tk==='{'||tk==='('||tk==='['){stack.push({ch:tk,i:m.index});prev=tk;continue;}
    if(tk==='}'||tk===')'||tk===']'){
      const top=stack[stack.length-1];
      if(top&&top.ch===OPEN[tk]){stack.pop();out.push({a:base+top.i,b:base+m.index,depth:stack.length,ch:top.ch,bad:false});}
      else out.push({a:base+m.index,b:-1,depth:0,ch:tk,bad:true});
      prev=tk;continue;
    }
    prev=tk;
  }
  stack.forEach(s=>out.push({a:base+s.i,b:-1,depth:0,ch:s.ch,bad:true}));
}
function scanCss(src,base,out){
  const re=/\/\*[\s\S]*?(?:\*\/|$)|"[^"\n]*"?|'[^'\n]*'?|[{}()\[\]]|[\s\S]/g;
  const stack=[];let m;
  while((m=re.exec(src))){
    const tk=m[0];if(tk.length!==1||!'{}()[]'.includes(tk))continue;
    if(tk==='{'||tk==='('||tk==='['){stack.push({ch:tk,i:m.index});continue;}
    const top=stack[stack.length-1];
    if(top&&top.ch===OPEN[tk]){stack.pop();out.push({a:base+top.i,b:base+m.index,depth:stack.length,ch:top.ch,bad:false});}
    else out.push({a:base+m.index,b:-1,depth:0,ch:tk,bad:true});
  }
  stack.forEach(s=>out.push({a:base+s.i,b:-1,depth:0,ch:s.ch,bad:true}));
}
function scanHtml(src,out,tags){
  const block=/<(script|style)\b((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)(?:<\/\1\s*>|$)/gi;
  let m;
  while((m=block.exec(src))){
    const innerStart=m.index+1+m[1].length+m[2].length+1;
    (m[1].toLowerCase()==='script'?scanJs:scanCss)(m[3],innerStart,out);
  }
  const tagRe=/<!--[\s\S]*?(?:-->|$)|<![^>]*>|<(script|style)\b(?:[^>"']|"[^"]*"|'[^']*')*>[\s\S]*?(?:<\/\1\s*>|$)|<(\/?)([a-zA-Z][\w:-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
  const stack=[];
  while((m=tagRe.exec(src))){
    if(m[2]===undefined)continue;
    const closing=m[2]==='/',name=m[3].toLowerCase(),self=/\/\s*$/.test(m[4]||'');
    const start=m.index,end=start+m[0].length,nameStart=start+(closing?2:1),nameEnd=nameStart+m[3].length;
    if(closing){
      let at=-1;
      for(let i=stack.length-1;i>=0;i--)if(stack[i].name===name){at=i;break;}
      if(at>-1){tags.push({open:stack[at],close:{start,end,nameStart,nameEnd,name},name});stack.length=at;}
    }else if(!self&&!VOID.has(name))stack.push({start,end,nameStart,nameEnd,name});
  }
}
let pairs=[],tagPairs=[],byPos=new Map(),lineItems=new Map(),starts=[0],lastText=null,tooBig=false,active=null,lastActiveKey='';
function lineStarts(s){const a=[0];for(let i=0;i<s.length;i++)if(s[i]==='\n')a.push(i+1);return a;}
function lineOf(i){let lo=0,hi=starts.length-1;while(lo<hi){const mid=(lo+hi+1)>>1;if(starts[mid]<=i)lo=mid;else hi=mid-1;}return lo;}
function extOf(n){const i=n.lastIndexOf('.');return i>0?n.slice(i+1).toLowerCase():'';}
function kindOf(){
  const el=$('#crumbName'),n=el?el.textContent.trim():'',e=extOf(n);
  if(e==='js'||e==='mjs'||e==='json')return 'js';
  if(e==='css')return 'css';
  if(e==='html'||e==='htm'||e==='svg'||e==='xml')return 'html';
  return 'none';
}
function addItem(ln,col,len,cls,key,val){
  if(col<0||len<1)return;
  if(!lineItems.has(ln))lineItems.set(ln,[]);
  lineItems.get(ln).push({col,len,cls,key,val});
}
function build(src){
  pairs=[];tagPairs=[];byPos=new Map();lineItems=new Map();
  starts=lineStarts(src);tooBig=src.length>MAX;
  if(tooBig)return;
  const kind=kindOf();
  if(kind==='js')scanJs(src,0,pairs);
  else if(kind==='css')scanCss(src,0,pairs);
  else if(kind==='html')scanHtml(src,pairs,tagPairs);
  else return;
  pairs.forEach((p,i)=>{
    const cls='bk'+(p.bad?(cfg.bad?' bad':''):(cfg.rainbow?' d'+(p.depth%cfg.hues):''));
    const la=lineOf(p.a);addItem(la,p.a-starts[la],1,cls,'b',i);byPos.set(p.a,i);
    if(p.b>=0){const lb=lineOf(p.b);addItem(lb,p.b-starts[lb],1,cls,'b',i);byPos.set(p.b,i);}
  });
  if(cfg.tags){
    tagPairs.forEach((tp,i)=>{
      const lo=lineOf(tp.open.nameStart),lc=lineOf(tp.close.nameStart);
      addItem(lo,tp.open.nameStart-starts[lo],tp.open.name.length,'tg','t',i);
      addItem(lc,tp.close.nameStart-starts[lc],tp.close.name.length,'tg','t',i);
    });
  }
  lineItems.forEach(list=>list.sort((x,y)=>x.col-y.col));
}
function undecorate(){
  const spans=hl.querySelectorAll('span.bk, span.tg');
  if(!spans.length)return;
  const parents=new Set();
  spans.forEach(s=>{const p=s.parentNode;p.replaceChild(document.createTextNode(s.textContent),s);parents.add(p);});
  parents.forEach(p=>{try{p.normalize();}catch(e){}});
}
function decorate(){
  if(tooBig||!lineItems.size)return;
  const lines=hl.children;
  lineItems.forEach((items,ln)=>{
    const el=lines[ln];if(!el||!el.firstChild)return;
    const nodes=[];let pos=0,n;
    const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null);
    while((n=w.nextNode())){nodes.push({n,start:pos,len:n.nodeValue.length});pos+=n.nodeValue.length;}
    for(let k=items.length-1;k>=0;k--){
      const it=items[k];let rec=null;
      for(let j=0;j<nodes.length;j++){const r=nodes[j];if(it.col>=r.start&&it.col<r.start+r.len){rec=r;break;}}
      if(!rec||!rec.n.parentNode)continue;
      const local=it.col-rec.start;
      if(local<0||local+it.len>rec.n.nodeValue.length)continue;
      const mid=rec.n.splitText(local);
      if(it.len<mid.nodeValue.length)mid.splitText(it.len);
      const span=document.createElement('span');
      span.className=it.cls;
      span.setAttribute('data-'+it.key,it.val);
      span.textContent=mid.nodeValue;
      mid.parentNode.replaceChild(span,mid);
    }
  });
}
function clearActive(){hl.querySelectorAll('.bk.on, .tg.on').forEach(e=>e.classList.remove('on','pop'));}
function pulse(nodes){nodes.forEach(e=>{e.classList.add('on');void e.offsetWidth;e.classList.add('pop');setTimeout(()=>e.classList.remove('pop'),360);});}
function markActive(){
  clearActive();active=null;
  if(tooBig||(!pairs.length&&!tagPairs.length)){readout();return;}
  const pos=code.selectionStart;
  if(cfg.pair){
    let idx=byPos.get(pos);
    if(idx===undefined&&pos>0)idx=byPos.get(pos-1);
    if(idx!==undefined){
      const p=pairs[idx],here=(pos===p.a||pos-1===p.a)?p.a:p.b,there=here===p.a?p.b:p.a;
      active={type:'bracket',idx,pair:p,there};
      const nodes=Array.from(hl.querySelectorAll('[data-b="'+idx+'"]')),key='b'+idx;
      if(key!==lastActiveKey){pulse(nodes);lastActiveKey=key;}
      else nodes.forEach(e=>e.classList.add('on'));
      readout();return;
    }
  }
  if(cfg.tags){
    for(let i=0;i<tagPairs.length;i++){
      const tp=tagPairs[i],inOpen=pos>=tp.open.start&&pos<=tp.open.end,inClose=pos>=tp.close.start&&pos<=tp.close.end;
      if(inOpen||inClose){
        const there=inOpen?tp.close.nameStart:tp.open.nameStart;
        active={type:'tag',idx:i,pair:tp,there};
        const nodes=Array.from(hl.querySelectorAll('[data-t="'+i+'"]')),key='t'+i;
        if(key!==lastActiveKey){pulse(nodes);lastActiveKey=key;}
        else nodes.forEach(e=>e.classList.add('on'));
        readout();return;
      }
    }
  }
  lastActiveKey='';readout();
}
const read=document.createElement('button');
read.type='button';read.className='bk-read';
function readout(){
  read.className='bk-read';
  const crumb=$('#crumbName');
  if(!crumb||crumb.textContent.trim()==='—'){read.textContent=t('brackets.nofile');read.disabled=true;return;}
  if(tooBig){read.textContent=t('brackets.big');read.disabled=true;return;}
  if(active){
    read.disabled=false;read.classList.add('live');
    if(active.type==='bracket'){
      const p=active.pair;
      if(p.bad||p.b<0){
        read.classList.add('bad');read.disabled=true;
        read.innerHTML='<span class="bk-chip">'+esc(p.ch)+'</span>'+esc(t('brackets.unmatched',{line:lineOf(p.a)+1}));
      }else{
        const chars=p.ch+CLOSE[p.ch];
        read.innerHTML='<span class="bk-chip">'+esc(chars)+'</span>'+esc(t('brackets.matched',{chars:'',depth:p.depth,line:lineOf(active.there)+1})).replace(/^ · /,'');
      }
    }else{
      read.innerHTML='<span class="bk-chip">'+esc(active.pair.name)+'</span>'+esc(t('brackets.tagmatch',{name:'',line:lineOf(active.there)+1})).replace(/^<>\s*…\s*<\/>\s*·\s*/,'');
    }
    return;
  }
  read.disabled=true;
  const total=pairs.filter(p=>!p.bad).length,bad=pairs.filter(p=>p.bad).length;
  read.textContent=(total||bad)?t('brackets.idle',{count:total,bad}):t('brackets.none');
}
function reveal(offset){
  const ln=lineOf(offset),g=gutter.children[ln];
  if(g){
    const y=g.offsetTop,h=g.offsetHeight||20,st=edScroll.scrollTop,ch=edScroll.clientHeight;
    if(y<st+4)edScroll.scrollTop=Math.max(0,y-4);
    else if(y+h>st+ch-4)edScroll.scrollTop=y+h-ch+4;
  }
  if(!edScroll.classList.contains('wrap')&&metrics){
    const cw=metrics.getBoundingClientRect().width/10||7.8,col=offset-starts[ln];
    const x=16+col*cw,sl=edScroll.scrollLeft,vw=edScroll.clientWidth-gutter.offsetWidth;
    if(x<sl+30)edScroll.scrollLeft=Math.max(0,x-30);
    else if(x>sl+vw-40)edScroll.scrollLeft=x-vw+40;
  }
}
function jump(){
  if(!active||active.there==null||active.there<0)return;
  code.focus({preventScroll:true});code.setSelectionRange(active.there,active.there);
  reveal(active.there);markActive();
}
function selectInside(){
  if(!active)return;
  let a,b;
  if(active.type==='bracket'){const p=active.pair;if(p.bad||p.b<0)return;a=p.a+1;b=p.b;}
  else{a=active.pair.open.end;b=active.pair.close.start;}
  if(b<a)return;
  code.focus({preventScroll:true});code.setSelectionRange(a,b);reveal(a);markActive();
}
const bar=document.createElement('div');
bar.className='bk-bar';bar.id='bkBar';bar.setAttribute('role','group');
toolbar.parentNode.insertBefore(bar,toolbar.nextSibling);
function tgBtn(key,icon){
  return '<button type="button" class="bk-tg" data-toggle="'+key+'" aria-pressed="'+cfg[key]+'" title="'+escA(t('brackets.'+key))+'">'+ic(icon)+'<span class="bk-tg-label">'+esc(t('brackets.'+key))+'</span></button>';
}
function buildBar(){
  const legend=['(',')','{','}','[',']'].map((c,i)=>'<i style="color:var(--bk'+i+')">'+esc(c)+'</i>').join('');
  bar.innerHTML='<span class="bk-legend" aria-hidden="true">'+legend+'</span><span class="bk-name">'+esc(t('brackets.name'))+'</span><span class="bk-sep"></span>'
    +tgBtn('rainbow','rainbow')+tgBtn('pair','pair')+tgBtn('tags','tag')+tgBtn('bad','bad')
    +'<span class="bk-sep"></span><label class="bk-field"><span>'+esc(t('brackets.style'))+'</span><select class="sel" data-cfg="style"><option value="box">'+esc(t('brackets.box'))+'</option><option value="line">'+esc(t('brackets.line'))+'</option><option value="glow">'+esc(t('brackets.glow'))+'</option></select></label>'
    +'<span class="bk-field"><span>'+esc(t('brackets.hues'))+'</span><span class="bk-step"><button type="button" data-hue="-1" aria-label="−">−</button><b id="bkHues">'+cfg.hues+'</b><button type="button" data-hue="1" aria-label="+">+</button></span></span>'
    +'<label class="bk-field"><span>'+esc(t('brackets.intensity'))+'</span><input type="range" class="bk-range" min="10" max="100" step="5" data-cfg="intensity" value="'+cfg.intensity+'" aria-label="'+escA(t('brackets.intensity'))+'"></label>'
    +'<span class="bk-sep"></span><button type="button" class="bk-act" id="bkJump" title="'+escA(t('brackets.jumpTitle'))+'">'+ic('jump')+'<span class="bk-act-label">'+esc(t('brackets.jump'))+'</span><kbd>Ctrl M</kbd></button>'
    +'<button type="button" class="bk-act" id="bkSel" title="'+escA(t('brackets.selectTitle'))+'">'+ic('select')+'<span class="bk-act-label">'+esc(t('brackets.select'))+'</span></button>'
    +'<button type="button" class="bk-act" id="bkReset" title="'+escA(t('brackets.reset'))+'" aria-label="'+escA(t('brackets.reset'))+'">'+ic('reset')+'</button>';
  bar.appendChild(read);
  syncBar();
}
function syncBar(){
  bar.querySelectorAll('[data-toggle]').forEach(b=>b.setAttribute('aria-pressed',String(cfg[b.dataset.toggle])));
  const st=bar.querySelector('[data-cfg="style"]');if(st)st.value=cfg.style;
  const rn=bar.querySelector('[data-cfg="intensity"]');if(rn)rn.value=cfg.intensity;
  const hv=bar.querySelector('#bkHues');if(hv)hv.textContent=cfg.hues;
  bar.querySelectorAll('[data-hue]').forEach(b=>{const d=+b.dataset.hue;b.disabled=(d<0&&cfg.hues<=1)||(d>0&&cfg.hues>=6);});
  edScroll.setAttribute('data-bstyle',cfg.style);
  edScroll.style.setProperty('--bk-a',(cfg.intensity/100*0.5).toFixed(3));
  edScroll.style.setProperty('--bk-glow',Math.round(4+cfg.intensity/100*14)+'px');
  const j=bar.querySelector('#bkJump'),s=bar.querySelector('#bkSel');
  const usable=!!active&&(active.type==='tag'||(!active.pair.bad&&active.pair.b>=0));
  if(j)j.disabled=!usable;
  if(s)s.disabled=!usable;
}
bar.addEventListener('click',e=>{
  const tgl=e.target.closest('[data-toggle]');
  if(tgl){const k=tgl.dataset.toggle;cfg[k]=!cfg[k];save();syncBar();refresh(true);return;}
  const hue=e.target.closest('[data-hue]');
  if(hue){cfg.hues=Math.min(6,Math.max(1,cfg.hues+(+hue.dataset.hue)));save();syncBar();refresh(true);return;}
  if(e.target.closest('#bkJump')){jump();return;}
  if(e.target.closest('#bkSel')){selectInside();return;}
  if(e.target.closest('#bkReset')){cfg={...DEF};save();syncBar();refresh(true);return;}
});
bar.addEventListener('input',e=>{
  const f=e.target.closest('[data-cfg]');if(!f)return;
  if(f.dataset.cfg==='intensity'){cfg.intensity=+f.value;save();syncBar();}
  if(f.dataset.cfg==='style'){cfg.style=f.value;save();syncBar();}
});
bar.addEventListener('change',e=>{const f=e.target.closest('[data-cfg="style"]');if(f){cfg.style=f.value;save();syncBar();}});
read.addEventListener('click',()=>{if(!read.disabled)jump();});
const observer=new MutationObserver(()=>schedule());
let queued=false;
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;refresh(false);});}
function refresh(force){
  const src=code.value;
  if(force||src!==lastText){lastText=src;build(src);}
  observer.disconnect();
  undecorate();decorate();
  observer.observe(hl,{childList:true,subtree:true});
  markActive();syncBar();
}
function caret(){markActive();syncBar();}
code.addEventListener('keyup',caret);
code.addEventListener('click',caret);
code.addEventListener('input',()=>schedule());
code.addEventListener('focus',caret);
document.addEventListener('selectionchange',()=>{if(document.activeElement===code)requestAnimationFrame(caret);});
document.addEventListener('keydown',e=>{
  if(document.activeElement!==code)return;
  const mod=e.ctrlKey||e.metaKey;
  if(mod&&e.key.toLowerCase()==='m'){e.preventDefault();if(e.shiftKey)selectInside();else jump();}
});
window.addEventListener('resize',()=>{if(active)reveal(active.there);});
if(I18N.onChange)I18N.onChange(()=>{buildBar();refresh(true);});
buildBar();refresh(true);
observer.observe(hl,{childList:true,subtree:true});
}
})();
