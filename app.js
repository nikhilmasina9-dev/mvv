/* MVV Aura v10: one-move story into the plan studio, floors on the real render, live map, projects, WhatsApp */
(function(){
const Q=(s,r=document)=>r.querySelector(s), QA=(s,r=document)=>[...r.querySelectorAll(s)];
const P=new URLSearchParams(location.search);
gsap.registerPlugin(ScrollTrigger);
const mob=()=>innerWidth<=900;

/* ---------- 1. pinned story: building → terrace rise → top view → plan (one settle, no multi-spin) ---------- */
const bld=Q('.st-bld'), photo=Q('.s-photo'), hero=Q('.st-hero'), splan=Q('.splan'), pwrap0=Q('.pwrap'), haze=Q('.st-haze'), glow=Q('.st-glow'), air=Q('.st-air');
const late=QA('.splan__txt > *, .ptabs, .pcap');
let tl;
function buildStory(){
  if(tl){tl.scrollTrigger&&tl.scrollTrigger.kill();tl.kill();}
  gsap.set([bld,air,hero,pwrap0,haze,glow,...late],{clearProps:'all'});
  const br=bld.getBoundingClientRect(), wr=pwrap0.getBoundingClientRect(), M=mob(), vw=innerWidth, vh=innerHeight;
  const fx=(f)=>br.left+br.width*f, fy=(f)=>br.top+br.height*f;
  // aim at the terrace / roof parapet of hero-aura-feather-v4
  const F=[fx(0.49), fy(0.12)], C=[wr.left+wr.width/2, wr.top+wr.height/2];
  const bH=br.height*0.72;
  // medium-fast: push → climb terrace → flat top hold → one plan settle (rotation always 0)
  const A0=0.04, B1=1.35, RISE=2.55, TV=3.25, TH=3.75, PL=4.95, END=5.4;
  const s1=(vh*(M?1.08:1.38))/bH, s2=s1*1.7;
  gsap.set(bld,{transformOrigin:(F[0]-br.left)+'px '+(F[1]-br.top)+'px',transformPerspective:1600});
  gsap.set(air,{xPercent:-50,yPercent:-50,transformPerspective:1600,transformOrigin:'50% 50%'});
  gsap.set(pwrap0,{transformPerspective:1600,transformOrigin:'50% 50%'});
  gsap.set(late,{autoAlpha:0,y:20}); gsap.set([pwrap0,air],{autoAlpha:0}); gsap.set(haze,{opacity:0});
  splan.classList.remove('live');
  const ar=air.getBoundingClientRect(), AC=[vw/2, vh*(M?0.48:0.50)];
  const pS=Math.min(1.12, Math.max(0.75, (ar.width*0.94)/Math.max(1,wr.width)));
  tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:'.story',pin:'.story__pin',start:'top top',end:()=>'+='+(vh*(M?2.6:2.85)),scrub:P.has('nosnap')?true:0.72,
     snap:P.has('nosnap')?false:{snapTo:(v,st)=>{const e=tl.labels.plan/tl.duration();return v<=0.001||v>=e-0.001?v:(st.direction>0?e:0);},inertia:false,duration:{min:.7,max:1.1},delay:.05,ease:'sine.inOut'},
     invalidateOnRefresh:true,onUpdate:self=>{splan.classList.toggle('live',self.progress>0.88);}}});
  const T=(el,a,b,at,d,ease='power2.inOut')=>tl.fromTo(el,a,{...b,duration:d,ease,immediateRender:false},at);
  tl.addLabel('render',0);
  T(hero,{autoAlpha:1,y:0},{autoAlpha:0,y:-32},0.02,0.4,'power2.in');
  T(Q('.st-cue'),{autoAlpha:1},{autoAlpha:0},0.02,0.22);
  T(glow,{opacity:1,scale:1},{opacity:0,scale:1.35},A0,B1,'power1.in');
  // 1 building: medium-fast push that centres the terrace / top floors
  T(bld,{scale:1,x:0,y:0,rotationX:0,opacity:1},{scale:s1,x:vw/2-F[0],y:vh*0.40-F[1],rotationX:0,opacity:1},A0,B1-A0,'sine.inOut');
  tl.addLabel('building',B1);
  // 2 rise toward the terrace: climb closer to the roof edge (keep it on screen), mild pitch only
  T(bld,{scale:s1,x:vw/2-F[0],y:vh*0.40-F[1],rotationX:0},{scale:s2,x:vw/2-F[0],y:vh*0.52-F[1],rotationX:18},B1,RISE-B1,'sine.inOut');
  tl.addLabel('terrace',RISE-0.2);
  // soft haze over the terrace, then hand off to the flat top view before the building leaves frame
  T(haze,{opacity:0},{opacity:0.62},RISE-0.55,0.4,'sine.out');
  T(bld,{opacity:1},{opacity:0},RISE-0.45,0.4,'power1.in');
  // 3 top view: aerial floor render arrives as the terrace haze clears — flat, no yaw
  T(air,{autoAlpha:0},{autoAlpha:1},RISE-0.5,0.45,'power1.out');
  T(air,{x:AC[0]-vw/2,y:AC[1]-vh/2+vh*0.05,scale:1.12,rotation:0,rotationX:8},{x:AC[0]-vw/2,y:AC[1]-vh/2,scale:1,rotation:0,rotationX:0},RISE-0.55,TV-(RISE-0.55),'power2.out');
  T(haze,{opacity:0.62},{opacity:0},TV-0.35,0.35,'sine.in');
  tl.addLabel('top',TV);
  T(air,{scale:1},{scale:1.015},TV,TH-TV,'none');
  // 4 plan: one clean settle — scale/position only, rotation stays 0; short sequential crossfade
  T(air,{x:AC[0]-vw/2,y:AC[1]-vh/2,scale:1.015,rotation:0},{x:C[0]-vw/2,y:C[1]-vh/2,scale:1.015/pS,rotation:0},TH,PL-TH,'power2.inOut');
  T(air,{autoAlpha:1},{autoAlpha:0},TH+0.15,0.32,'sine.in');
  T(pwrap0,{autoAlpha:0},{autoAlpha:1},TH+0.28,0.36,'sine.out');
  T(pwrap0,{x:AC[0]-C[0],y:AC[1]-C[1],scale:pS*1.015,rotation:0},{x:0,y:0,scale:1,rotation:0},TH,PL-TH,'power2.inOut');
  tl.addLabel('plan',END);
  late.forEach((el,k)=>T(el,{autoAlpha:0,y:20},{autoAlpha:1,y:0},PL-0.3+k*Math.min(0.055,0.28/Math.max(1,late.length)),0.38,'power2.out'));
  tl.to({},{duration:.01},END);
}
window.__story=()=>tl;
// nav "Plan" → the end of the story, where the plan lives
QA('a[href="#plan"]').forEach(a=>a.addEventListener('click',e=>{if(!tl)return;e.preventDefault();scrollTo({top:tl.scrollTrigger.end,behavior:'smooth'});}));

/* ---------- 2. section reveals ---------- */
QA('.rv').forEach(el=>gsap.from(el,{y:46,opacity:0,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}}));

/* ---------- 3. projects: film slides in, lines follow one by one, the row drifts as you pass ---------- */
QA('.pj').forEach(row=>{const m=row.querySelector('.pj__m'),par=row.querySelector('.pj__par'),t=row.querySelector('.pj__t'),
  dir=row.classList.contains('pj--r')?1:-1, lines=row.querySelectorAll('.pj-ln');
  gsap.from(m,{x:dir*70,scale:.93,opacity:0,duration:1.6,ease:'power3.out',scrollTrigger:{trigger:row,start:'top 82%',once:true}});
  gsap.from(lines,{y:22,opacity:0,duration:.9,ease:'power2.out',stagger:.11,delay:.25,scrollTrigger:{trigger:row,start:'top 78%',once:true}});
  gsap.fromTo(par,{yPercent:-4},{yPercent:4,ease:'none',scrollTrigger:{trigger:row,start:'top bottom',end:'bottom top',scrub:true}});
  const amp=matchMedia('(max-width:900px)').matches?0:36;
  if(amp)gsap.fromTo(t,{y:amp},{y:-amp,ease:'none',scrollTrigger:{trigger:row,start:'top bottom',end:'bottom top',scrub:true}});
});
/* films play only while on screen, no controls */
const io=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target;if(e.isIntersecting){v.play().catch(()=>{})}else v.pause()}),{threshold:.3});
QA('video').forEach(v=>{v.muted=true;v.playsInline=true;io.observe(v)});

/* ---------- 4. floors: the real render, a label beside each floor; hover / tap lights that band ---------- */
const fband=Q('.fl-band'), flabs=QA('.fl-lab'), fpn=Q('.fl-pick__n'), fpd=Q('.fl-pick__d'), fwa=Q('.fl-wa a');
function pickFloor(b){if(!b)return;flabs.forEach(x=>x.classList.toggle('on',x===b));QA('.fl-lead g').forEach(g=>g.classList.toggle('on',g.dataset.f===b.dataset.f));
  fband.style.setProperty('--a',b.dataset.a+'%');fband.style.setProperty('--b',b.dataset.b+'%');
  const n=b.querySelector('b').textContent, d=b.querySelector('span').textContent;
  if(fpn.textContent!==n){gsap.fromTo([fpn,fpd],{opacity:0,y:8},{opacity:1,y:0,duration:.45,ease:'power2.out',stagger:.05});}
  fpn.textContent=n;fpd.textContent=d;
  if(fwa)fwa.href=WAURL+encodeURIComponent("Hello MVV, I'd like to know about the "+(b.dataset.f==='G'?'ground floor':n)+' at MVV Aura');}
flabs.forEach(b=>{b.addEventListener('mouseenter',()=>pickFloor(b));b.addEventListener('click',()=>pickFloor(b));b.addEventListener('focus',()=>pickFloor(b));});
const fimg=Q('.fl-img');fimg&&fimg.addEventListener('pointermove',e=>{const r=fimg.getBoundingClientRect(),y=(e.clientY-r.top)/r.height*100;
  const b=flabs.find(x=>y>=+x.dataset.a&&y<+x.dataset.b);if(b&&!b.classList.contains('on'))pickFloor(b);});

/* ---------- 5. plan studio: 2D / 3D; a room opens out of its own spot on the plan ---------- */
const RM=window.ROOMS||{}, pw=Q('.pwrap'), rv=Q('.rview'), rimg=rv&&rv.querySelector('img'), hint=Q('.phint'), back=Q('.pback'), bname=Q('.pback__n');
let cur=null, rtl=null;
const box=()=>Q('.pbox.on');
function openRoom(r){if(!RM[r]||!pw)return;const b=box(),hs=b.querySelector('.ra[data-r="'+r+'"]');if(!hs)return;
  const wr=pw.getBoundingClientRect(),hr=hs.getBoundingClientRect();
  const ox=((hr.left+hr.width/2-wr.left)/wr.width*100).toFixed(1)+'%', oy=((hr.top+hr.height/2-wr.top)/wr.height*100).toFixed(1)+'%';
  const bx=((hr.left+hr.width/2-b.getBoundingClientRect().left)/b.offsetWidth*100).toFixed(1)+'%', by=((hr.top+hr.height/2-b.getBoundingClientRect().top)/b.offsetHeight*100).toFixed(1)+'%';
  const go=()=>{rtl&&rtl.kill();cur=r;
    QA('[data-r]').forEach(x=>x.classList.toggle('sel',x.dataset.r===r));
    hint.hidden=true;back.hidden=false;bname.innerHTML=RM[r][0]+(RM[r][1]?'<small>'+RM[r][1]+'</small>':'');
    gsap.set(rv,{visibility:'visible',clipPath:'circle(0% at '+ox+' '+oy+')'});gsap.set(rimg,{scale:1.35,transformOrigin:ox+' '+oy});
    rtl=gsap.timeline()
     .to(b.querySelectorAll('.ra'),{opacity:0,duration:.25},0)
     .fromTo(b,{scale:1,transformOrigin:bx+' '+by},{scale:2.6,duration:1.2,ease:'power2.in',transformOrigin:bx+' '+by},0)
     .to(b,{opacity:0,duration:.45,ease:'sine.in'},.65)
     .to(rv,{clipPath:'circle(150% at '+ox+' '+oy+')',duration:1.25,ease:'power2.in'},.3)
     .to(rimg,{scale:1,duration:1.6,ease:'power3.out'},.3);};
  if(cur){closeRoom(()=>openRoom(r));return;}
  if(rimg.getAttribute('src')!=='assets/'+r+'-1280.webp'){rimg.onload=()=>{rimg.onload=null;go();};rimg.src='assets/'+r+'-1280.webp';rimg.alt=RM[r][0];}else go();}
function closeRoom(done){if(!cur){done&&done();return;}const b=box();rtl&&rtl.kill();
  rtl=gsap.timeline({onComplete:()=>{gsap.set(rv,{visibility:'hidden'});cur=null;done&&done();}})
   .to(rv,{clipPath:rv.style.clipPath.replace(/circle\([^ ]+/,'circle(0%'),duration:.75,ease:'power2.out'},0)
   .to(b,{opacity:1,scale:1,duration:.85,ease:'power3.out'},.15)
   .to(b.querySelectorAll('.ra'),{opacity:1,duration:.3},.7);
  QA('[data-r]').forEach(x=>x.classList.remove('sel'));hint.hidden=false;back.hidden=true;}
QA('.ra,.rlist li').forEach(x=>x.addEventListener('click',()=>openRoom(x.dataset.r)));
Q('.pback__b')&&Q('.pback__b').addEventListener('click',()=>closeRoom());
QA('.seg a').forEach(a=>a.addEventListener('click',()=>{if(a.classList.contains('on'))return;const go=()=>{QA('.seg a').forEach(x=>x.classList.toggle('on',x===a));
  const is2=a.dataset.v==='2d',nb=Q(is2?'.pbox-2d':'.pbox-3d'),ob=Q(is2?'.pbox-3d':'.pbox-2d');pw.classList.toggle('is2d',is2);
  ob.classList.remove('on');nb.classList.add('on');gsap.set(ob,{clearProps:'opacity,scale,transform'});
  gsap.fromTo(nb,{opacity:0,scale:.96,rotationX:is2?18:-18,transformPerspective:1200},{opacity:1,scale:1,rotationX:0,duration:.7,ease:'power3.out'});
  gsap.set(nb.querySelectorAll('.ra'),{opacity:1});};closeRoom(go);}));
window.__room=openRoom;window.__closeRoom=closeRoom;

/* ---------- 7. live map: five cars on real OSRM routes ---------- */
const MM=window.MAPMETA||{};
const prep={};for(const u in MM){prep[u]={};for(const k in MM[u]){const m=MM[u][k],ps=m.ps,c=[0];for(let i=1;i<ps.length;i++)c.push(c[i-1]+Math.hypot(ps[i][0]-ps[i-1][0],ps[i][1]-ps[i-1][1]));prep[u][k]={...m,c};}}
function at(m,t){const L=m.c[m.c.length-1]*t;let i=1;while(i<m.c.length-1&&m.c[i]<L)i++;const a=m.ps[i-1],b=m.ps[i],f=Math.max(0,Math.min(1,(L-m.c[i-1])/Math.max(1e-9,m.c[i]-m.c[i-1])));
  return [a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI];}
const ORDER=['bus','hosp','ghat','rail','air'];
function drawMap(T){
  for(const u in prep){const svg=Q(u==='d'?'.map7-d':'.map7-m');if(!svg)continue;
    for(const k in prep[u]){const m=prep[u][k],t=Math.min(1,T/m.min),tc=Math.min(t,m.rest);
      QA('path[data-k="'+k+'"]',svg).forEach(p=>p.setAttribute('stroke-dasharray',(t*1000).toFixed(1)+' 3000'));
      const [x,y,a]=at(m,tc);const car=Q('.car[data-k="'+k+'"]',svg);car&&car.setAttribute('transform',`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${a.toFixed(1)}) scale(${m.sc})`);
      const km=Q('.km[data-k="'+k+'"]',svg);if(km){const show=t>0.02&&t<.999&&!(t>m.rest);km.classList.toggle('style-hide',!show);km.setAttribute('x',(x+m.kx).toFixed(0));km.setAttribute('y',(y+m.ky).toFixed(0));km.textContent=(m.km*t).toFixed(1)+' km';}}}
  const d=prep.d||prep.m;QA('.llist li').forEach((li,i)=>{const k=ORDER[i],m=d[k];if(!m)return;const t=Math.min(1,T/m.min),done=t>=.999;
    li.classList.toggle('on',done);li.querySelector('b').textContent=(m.km*t).toFixed(1);li.querySelector('em').textContent=T<=0?'':(done?'Arrived':'On the way');li.querySelector('.bar i').style.width=(t*100).toFixed(0)+'%';});
}
window.__mapT=drawMap;
const clock={T:0};let drive;
function run(){drive&&drive.kill();clock.T=0;drawMap(0);drive=gsap.to(clock,{T:18.6,duration:10,ease:'none',onUpdate:()=>drawMap(clock.T)});}
if(Object.keys(prep).length){drawMap(0);ScrollTrigger.create({trigger:'.loc',start:'top 45%',once:true,onEnter:()=>{if(!P.has('nomap'))run()}});
  const rb=Q('.replay');rb&&rb.addEventListener('click',run);}

/* ---------- 8. gold thread ---------- */
function thread(){const s=Q('.thread'),p=document.getElementById('threadPath');if(!s)return;s.setAttribute('height',0);const H=document.documentElement.scrollHeight,W=document.documentElement.clientWidth;
 s.setAttribute('width',W);s.setAttribute('height',H);s.setAttribute('viewBox','0 0 '+W+' '+H);
 const x0=W<=900?11:Math.max(28,Math.min(56,W*.039));const st=Q('.band'),y0=st?st.getBoundingClientRect().top+scrollY:200,y1=Q('.foot').offsetTop+120;
 let d='M'+x0+','+y0;for(let y=y0;y<y1;y+=40){d+=' L'+(x0+Math.sin(y/520)*(W<=900?3:9)).toFixed(1)+','+y}p.setAttribute('d',d);
 const g=document.getElementById('threadDots');g.innerHTML='';QA('main section:not(.story) .eyebrow').forEach(e=>{const y=e.getBoundingClientRect().top+scrollY+6;const x=x0+Math.sin(y/520)*(W<=900?3:9);g.insertAdjacentHTML('beforeend','<circle cx="'+x+'" cy="'+y+'" r="'+(W<=900?2.5:3.5)+'"/>')})}

/* ---------- header state ---------- */
ScrollTrigger.create({start:60,end:'max',onToggle:s=>Q('.top').classList.toggle('scrolled',s.isActive)});

function init(){buildStory();ScrollTrigger.refresh();thread();}
if(document.readyState==='complete')init();else addEventListener('load',init);
let rw=innerWidth;addEventListener('resize',()=>{if(Math.abs(innerWidth-rw)>40){rw=innerWidth;buildStory();ScrollTrigger.refresh();}thread();});
ScrollTrigger.addEventListener('refresh',thread);
})();
