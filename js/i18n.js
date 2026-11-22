/* js/i18n.js — движок переводов. Словари лежат в i18n/<код>.js */
(function(){
'use strict';
const REG=Object.create(null),META=Object.create(null),listeners=new Set(),STORE='hubpad.lang';
let current='ru',resolveReady,rejectReady;
const ready=new Promise((res,rej)=>{resolveReady=res;rejectReady=rej;});

function register(code,meta,messages){
  if(!code||!messages)return false;
  REG[code]=messages;
  META[code]=Object.assign({tag:code,name:code,english:code,dir:'ltr'},meta||{});
  return true;
}
window.HubPadLocale=register;

function lookup(dict,key){return String(key).split('.').reduce((o,k)=>(o&&typeof o==='object')?o[k]:undefined,dict);}
function interp(s,v){return v?String(s).replace(/\{(\w+)\}/g,(m,k)=>(k in v)?String(v[k]):m):String(s);}
function fallbackCode(){return REG.ru?'ru':Object.keys(REG)[0];}
function t(key,vars){
  let v=lookup(REG[current],key);
  if(typeof v!=='string')v=lookup(REG[fallbackCode()],key);
  if(typeof v!=='string')return key;
  return interp(v,vars);
}
function meta(c){return META[c||current]||META[fallbackCode()]||{tag:'ru-RU'};}
function category(n){
  try{if(window.Intl&&Intl.PluralRules)return new Intl.PluralRules(meta().tag).select(n);}catch(e){}
  if(current==='ru'){const a=Math.abs(n)%100,b=a%10;if(a>10&&a<20)return'many';if(b>1&&b<5)return'few';if(b===1)return'one';return'many';}
  return Math.abs(n)===1?'one':'other';
}
function plural(key,n){const f=lookup(REG[current],'plural.'+key)||lookup(REG[fallbackCode()],'plural.'+key)||{};return f[category(n)]||f.other||f.many||f.one||key;}
function num(n){try{return new Intl.NumberFormat(meta().tag).format(n);}catch(e){return String(n);}}
function decimal(n,d){try{return new Intl.NumberFormat(meta().tag,{minimumFractionDigits:d,maximumFractionDigits:d}).format(n);}catch(e){return n.toFixed(d);}}
function date(ts,o){try{return new Date(ts).toLocaleDateString(meta().tag,o);}catch(e){return new Date(ts).toLocaleDateString('ru-RU',o);}}
function dateTime(ts,o){try{return new Date(ts).toLocaleString(meta().tag,o);}catch(e){return new Date(ts).toLocaleString('ru-RU',o);}}
function np(k,n){return num(n)+' '+plural(k,n);}
function apply(root){
  const scope=root||document;
  scope.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t(el.getAttribute('data-i18n'));});
  scope.querySelectorAll('[data-i18n-html]').forEach(el=>{el.innerHTML=t(el.getAttribute('data-i18n-html'));});
  scope.querySelectorAll('[data-i18n-attr]').forEach(el=>{
    el.getAttribute('data-i18n-attr').split(';').forEach(p=>{
      const i=p.indexOf(':');if(i<0)return;
      const a=p.slice(0,i).trim(),k=p.slice(i+1).trim();
      if(a&&k)el.setAttribute(a,t(k));
    });
  });
  document.documentElement.lang=current;
  document.documentElement.dir=meta().dir||'ltr';
  document.title=t('app.title');
}
function emit(){listeners.forEach(fn=>{try{fn(current);}catch(e){console.error(e);}});}
function set(code){
  if(!REG[code]||code===current)return false;
  current=code;
  try{localStorage.setItem(STORE,code);}catch(e){}
  apply(document);emit();return true;
}
function inject(src){
  return new Promise((res,rej)=>{
    const s=document.createElement('script');
    s.src=src;s.async=false;
    s.onload=()=>res();
    s.onerror=()=>rej(new Error(src));
    document.head.appendChild(s);
  });
}
async function load(code){
  if(REG[code])return true;
  try{await inject('i18n/'+code+'.js');}catch(e){return false;}
  return !!REG[code];
}
async function use(code){const ok=await load(code);if(ok)set(code);return ok;}
function pick(codes){
  try{const q=new URLSearchParams(location.search).get('lang');if(q&&REG[q])return q;}catch(e){}
  try{const s=localStorage.getItem(STORE);if(s&&REG[s])return s;}catch(e){}
  const navs=(navigator.languages&&navigator.languages.length)?navigator.languages:[navigator.language||'ru'];
  for(const n of navs){const c=String(n).toLowerCase().split('-')[0];if(REG[c])return c;}
  for(const c of codes)if(REG[c])return c;
  return fallbackCode();
}
async function boot(){
  const manifest=Array.isArray(window.HUBPAD_I18N_MANIFEST)?window.HUBPAD_I18N_MANIFEST:['ru','en'];
  const codes=manifest.map(x=>typeof x==='string'?x:(x&&x.code)).filter(Boolean);
  for(const c of codes){
    if(!REG[c]){
      try{await inject('i18n/'+c+'.js');}
      catch(e){console.warn('i18n: не удалось загрузить '+c);}
    }
  }
  if(!Object.keys(REG).length){rejectReady(new Error('Нет ни одного языкового файла в i18n/'));return;}
  current=pick(codes);
  apply(document);
  resolveReady(api);
  emit();
}
const api={
  ready,t,plural,np,num,decimal,date,dateTime,apply,set,load,use,register,meta,
  onChange(fn){listeners.add(fn);return()=>listeners.delete(fn);},
  list(){return Object.keys(REG).map(c=>({code:c,...META[c]}));},
  has:c=>!!REG[c],
  get lang(){return current;}
};
window.HubPadI18n=api;
if(document.readyState==='complete')boot();
else document.addEventListener('DOMContentLoaded',boot);
})();
