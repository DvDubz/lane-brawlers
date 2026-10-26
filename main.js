// standalone boot: keyboard + loop.  ?shot=... renders a deterministic still for screenshots/tests.
addEventListener('keydown',e=>{if(onKey(e.code,true,performance.now()))e.preventDefault();});
addEventListener('keyup',e=>{if(onKey(e.code,false,performance.now()))e.preventDefault();});
const Q=new URLSearchParams(location.search);
// preload painted sprite atlases with a tiny loading bar; fall back to code-drawn fighters if any fail
function preload(cb){if(typeof LBS==='undefined'){cb();return;}const cv=document.getElementById('c'),c=cv.getContext('2d');let fin=false;
 const tick=()=>{if(fin)return;c.setTransform(cv.width/800,0,0,cv.width/800,0,0);c.fillStyle='#0a0612';c.fillRect(0,0,800,450);c.fillStyle='#fff';c.font='bold 16px sans-serif';c.textAlign='center';c.fillText('LOADING FIGHTERS…',400,210);
  c.strokeStyle='#ffd070';c.strokeRect(300,225,200,12);c.fillStyle='#ffa830';c.fillRect(302,227,196*LBS.progress(),8);requestAnimationFrame(tick);};tick();
 const go=()=>{if(!fin){fin=true;cb();}};LBS.load(go);setTimeout(go,10000);}
if(!Q.get('shot'))preload(()=>startLoop(document.getElementById('c')));
else{const cv=document.getElementById('c'),c=cv.getContext('2d');cv.width=1600;cv.height=900;cv.style.cssText='width:1600px;height:900px;margin:0;border:0;position:fixed;left:0;top:0';LBC.warm();
 if(Q.get('stage'))stage=Q.get('stage');
 const go=()=>{const m=Q.get('shot');
  if(typeof FLOW!=='undefined'&&FLOW.shot(m,c))return; // FLOW hook: menu/flow stills
  if(m==='title'){mode='title';for(let i=0;i<30;i++){c.setTransform(2,0,0,2,0,0);draw(c,1);}return;}
  if(m==='select'){mode='select';pick=Q.get('p')||'ryn';pick2=Q.get('e')||'mireya';for(let i=0;i<30;i++){c.setTransform(2,0,0,2,0,0);draw(c,1);}return;}
  start(Q.get('p')||'ryn',Q.get('e')||'mireya');E.cpu=false;P.x=+(Q.get('px')||300);E.x=+(Q.get('ex')||520);
  const sp=+(Q.get('sp')||0),T=+(Q.get('t')||20);P.mp=E.mp=100;let did=false;
  for(let i=0;i<T;i++){if(i===5&&sp&&!did){did=true;startSpecial(P,sp);}if(Q.get('pm')&&i===T-6){startMove(P,Q.get('pm'));}step();c.setTransform(2,0,0,2,0,0);draw(c,1);}
  fx=fx.filter(e=>e.k!=='banner');c.setTransform(2,0,0,2,0,0);draw(c,1);};
 const go0=go;const boot=()=>{if(typeof LBArt!=='undefined'){STAGES=['art_sunset','art_night','sunset','night'];if(!Q.get('stage'))stage='art_sunset';LBArt.load(()=>{artReady=true;go0();});}else go0();};if(typeof LBS!=='undefined')LBS.load(boot);else boot();}
