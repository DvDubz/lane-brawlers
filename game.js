'use strict';
// Lane Brawlers - original code. Game rules, roster, moves, specials, CPU AI.
// Characters (stats, art, special FX) come from characters.js (window.LaneBrawlerChars).
const LBC=(typeof LaneBrawlerChars!=='undefined')?LaneBrawlerChars:(require('./characters.js'),require('./characters2.js')); // pack 2 (gorgath, bruntusk, lysa) extends pack 1
// [SPEED] one knob for overall tempo. 1 = original speed; 0.75 = ~25% slower movement, attacks, knockback and projectiles.
// Distances/heights stay the same (gravity is scaled by GAME_SPEED^2), so jumps last longer instead of going higher.
const GAME_SPEED=0.75;
const TS=t=>Math.max(1,Math.round(t/GAME_SPEED)); // ticks -> slowed ticks
const W=800,H=450,GROUND_TOP=250,GROUND_BOT=430,GRAV=0.6*GAME_SPEED*GAME_SPEED*0.92; // [SPEED] *0.92 = slightly floatier jumps
const ROSTER={},ORDER=[];
for(const c of LBC.CHARS){const mv={};for(const m of c.moves)mv[m.id]=m;
 ROSTER[c.id]={id:c.id,name:c.name,short:({lysa:'Lysa'})[c.id]||c.name.split(/[ ,]/)[0] /*[PACK2] short HUD names*/,dynasty:c.dynasty,role:c.role,color:c.palette.aura,pal:c.palette,
  hp:c.stats.hp,speed:c.stats.speed*GAME_SPEED,run:c.stats.run*GAME_SPEED,jump:c.stats.jump*GAME_SPEED*Math.sqrt(0.92),power:c.stats.power,mpMax:c.stats.mp,mpRegen:c.stats.mpRegen*GAME_SPEED,
  moves:mv,sp:LBC.SPECIALS[c.id],blockMul:{gorran:0.10,gorgath:0.10,bruntusk:0.12}[c.id]||0.15,reach:c.id==='mireya'?12:c.id==='gorran'?5:0,
  // [PACK2] giants: bigger hurtbox, 1.5x hitbox reach, light hits don't stagger them (armor)
  giant:!!c.giant,big:c.giant?1.5:1,armorStat:(c.stats.armor||0),hw:c.hurtbox?c.hurtbox.w/2:18,hh:c.hurtbox?c.hurtbox.h:80};ORDER.push(c.id);}
// frame data: w=ticks, hit={dx,dy,w,h,kx,ky,stun}; damage comes from the character's move table x power
const MOVES={
 punch:[{w:4},{w:4,hit:{dx:30,dy:-60,w:34,h:18,kx:2,ky:0,stun:14}},{w:6}],
 kick:[{w:6},{w:5,hit:{dx:36,dy:-38,w:40,h:20,kx:5,ky:-3,stun:20}},{w:9}],
 air:[{w:16,hit:{dx:22,dy:-30,w:38,h:34,kx:4,ky:-6,stun:30}}],
 dash:[{w:3},{w:8,hit:{dx:30,dy:-55,w:42,h:26,kx:7,ky:-4,stun:26}},{w:8}],
 grab:[{w:5},{w:4,hit:{dx:24,dy:-50,w:34,h:34,kx:6,ky:-8,stun:42}},{w:12}]
};
// specials: cost from the pack, dur = fx length (ticks), cast = startup before it goes off, lock = recovery after
const SPEC={
 sun_comet:{dur:52,cast:9,lock:16},solar_rise:{dur:38,cast:3,lock:30},supernova_rush:{dur:74,cast:12,lock:44},
 frost_lance:{dur:56,cast:9,lock:20},moon_mirror:{dur:66,cast:7,lock:18},eclipse_blizzard:{dur:132,cast:14,lock:40},
 quake_stomp:{dur:48,cast:12,lock:24},avalanche_grab:{dur:54,cast:4,lock:40},titan_fall:{dur:84,cast:12,lock:56}};
// [PACK2] new specials + [SPEED] stretch all frame data by 1/GAME_SPEED
Object.assign(SPEC,{ember_breath:{dur:70,cast:14,lock:20},cinder_tail:{dur:40,cast:6,lock:22},ember_cataclysm:{dur:120,cast:16,lock:40},
 boulder_hurl:{dur:60,cast:10,lock:18},canopy_crash:{dur:50,cast:4,lock:24},primal_rampage:{dur:130,cast:14,lock:36},
 frost_bloom:{dur:56,cast:9,lock:18},glacial_palace:{dur:120,cast:7,lock:18},winters_decree:{dur:140,cast:14,lock:40}});
for(const k in SPEC){const d=SPEC[k];d.dur=TS(d.dur);d.cast=TS(d.cast);d.lock=TS(d.lock);}
for(const k in MOVES)for(const fr of MOVES[k]){fr.w=TS(fr.w);if(fr.hit)fr.hit.stun=TS(fr.hit.stun);}
const ULT_COST=80;
function moveInfo(id,mid){return ROSTER[id].moves[mid];}
function mk(type,x,z,dir,cpu){const s=ROSTER[type];return{type,s,x,z,y:0,vx:0,vy:0,vz:0,dir,hp:s.hp,mp:40,state:'idle',move:null,fi:0,ft:0,stun:0,hitDone:false,block:false,cpu,runDir:0,ai:0,
 combo:0,comboT:0,flash:0,hpLag:s.hp,pc:0,pcT:0,burn:null,frozen:0,slow:0,kd:false,armor:false,hidden:false,spId:null,castT:0,lockT:0,land:0};}
let P,E,projs=[],specials=[],fx=[],mode='title',pick='ryn',pick2='mireya',winner='',keys={},last={},tapT={};
let hitstop=0,shake=0,flashScr=0,ko=null,tick=0,stage='sunset',STAGES=['sunset','night'];
const K={left:'ArrowLeft',right:'ArrowRight',up:'ArrowUp',down:'ArrowDown',a:'KeyA',s:'KeyS',d:'KeyD',f:'KeyF'};
function start(a,b){if(a)pick=a;if(b)pick2=b;P=mk(pick,200,340,1,false);E=mk(pick2,600,340,-1,true);projs=[];specials=[];fx=[];mode='fight';hitstop=0;shake=0;ko=null;flashScr=0;tick=0;
 fx.push({k:'banner',txt:'FIGHT!',t:70,max:70});return{P,E};}
function nextOpp(){const i=ORDER.indexOf(pick2);pick2=ORDER[(i+1)%ORDER.length];}
// key handler shared by the standalone page and the in-app canvas. returns true if the key should be swallowed
function onKey(code,down,now){
 if(!down){keys[code]=false;if((code===K.left||code===K.right)&&P)P.runDir=0;return code.startsWith('Arrow')||code==='Space';}
 if(!keys[code]){if(code===K.left||code===K.right){const t=now;if(t-(tapT[code]||0)<250&&P)P.runDir=code===K.left?-1:1;tapT[code]=t;}last[code]=true;}
 keys[code]=true;
 if(mode!=='fight'){
  const n=['Digit1','Digit2','Digit3','Digit4','Digit5','Digit6'].indexOf(code); // [PACK2] six fighters
  if(n>=0&&ORDER[n]){pick=ORDER[n];if(pick2===pick)nextOpp();if(mode==='title')mode='select';}
  if(code==='KeyC'){nextOpp();if(pick2===pick)nextOpp();if(mode==='title')mode='select';}
  if(code==='KeyB')stage=STAGES[(STAGES.indexOf(stage)+1)%STAGES.length];
  if(code==='Enter'){if(mode==='title')mode='select';else start();}}
 else if(code==='Escape'){mode='select';}
 return code.startsWith('Arrow')||code==='Space';}
function input(f){ // returns intent object
 if(!f.cpu){const dirHeld=keys[K.up]||keys[K.down]||keys[K.left]||keys[K.right];
  const i={mx:(keys[K.right]?1:0)-(keys[K.left]?1:0),mz:(keys[K.down]?1:0)-(keys[K.up]?1:0),a:last[K.a],s:last[K.s],j:last[K.d]&&!keys[K.s],b:keys[K.f],run:f.runDir};
  if(i.a&&keys[K.s]){i.sp=keys[K.d]?3:dirHeld?2:1;i.a=i.s=false;}
  last={};return i;}
 return aiThink(f,f===E?P:E);}
function aiThink(f,t){const i={mx:0,mz:0};const dx=t.x-f.x,dz=t.z-f.z,adx=Math.abs(dx),id=f.type;f.ai--;
 const zoner=id==='mireya';
 if(Math.abs(dz)>8)i.mz=Math.sign(dz);
 if(zoner&&adx<120&&Math.random()<0.5)i.mx=-Math.sign(dx);else if(adx>60)i.mx=Math.sign(dx);
 if(adx>250)i.run=Math.sign(dx);
 if((t.move||t.spId)&&adx<90&&Math.random()<0.25)i.b=true;
 const inLane=Math.abs(dz)<20,R=Math.random();
 if(f.mp>=ULT_COST&&R<0.012&&(zoner||adx<200)&&Math.abs(dz)<40){i.sp=3;return i;}
 if(id==='ryn'){if(f.mp>=25&&inLane&&adx>150&&R<0.03)i.sp=1;else if(f.mp>=30&&adx<75&&inLane&&(t.y<-20||R<0.012))i.sp=2;}
 if(id==='mireya'){const inc=specials.some(s=>s.owner===t&&s.id==='sun_comet');if(f.mp>=30&&inLane&&(inc||(adx>160&&R<0.01)))i.sp=2;else if(f.mp>=25&&inLane&&adx>70&&adx<260&&R<0.03)i.sp=1;}
 if(id==='gorran'){if(f.mp>=25&&inLane&&adx<200&&R<0.02)i.sp=1;else if(f.mp>=35&&inLane&&adx<110&&R<0.02)i.sp=2;}
 if(id==='gorgath'){if(f.mp>=30&&inLane&&adx>90&&adx<420&&R<0.025)i.sp=1;else if(f.mp>=30&&adx<140&&R<0.02)i.sp=2;} // [PACK2]
 if(id==='bruntusk'){if(f.mp>=25&&inLane&&adx>250&&adx<460&&R<0.025)i.sp=1;else if(f.mp>=35&&inLane&&adx>100&&adx<200&&R<0.02)i.sp=2;}
 if(id==='lysa'){if(f.mp>=25&&inLane&&adx>120&&adx<220&&R<0.03)i.sp=1;else if(f.mp>=30&&inLane&&adx<160&&R<0.01)i.sp=2;}
 if(i.sp)return i;
 if(f.ai<=0&&adx<70*f.s.big&&Math.abs(dz)<20){f.ai=TS(20+Math.random()*25|0);const r=Math.random();if(r<.5)i.a=true;else if(r<.85)i.s=true;else i.j=true;}
 return i;}
function startMove(f,m){f.move=m;f.fi=0;f.ft=MOVES[m][0].w;f.hitDone=false;f.state='attack';f.vx=0;
 if(m==='punch'){const arr=f.s.moves.punch.dmg;f.pc=f.pcT>0?(f.pc+1)%arr.length:0;}
 f.armor=(m==='kick'&&(f.type==='gorran'||f.type==='gorgath'));}
function moveDmg(f,m){const mv=f.s.moves;let d,heavy=false,kx=null,ky=null,eff={};
 if(m==='punch'){const arr=mv.punch.dmg;d=arr[f.pc];if(f.pc===arr.length-1){heavy=true;kx=f.type==='gorran'?7:6;}}
 else if(m==='kick'){d=mv.kick.dmg;heavy=true;if(f.type==='mireya'){kx=4;ky=0;}}
 else if(m==='air'){d=mv.jump_attack.dmg;heavy=true;if(f.type==='mireya'){eff.slow=60;ky=-3;}}
 else if(m==='dash'){d=(mv.run_attack||mv.punch).dmg;heavy=true;}
 else if(m==='grab'){d=mv.grab.dmg;heavy=true;eff.unblock=true;}
 return{d:Math.round(d*f.s.power),heavy,kx,ky,eff};}
function box(f,h){const r=f.s.reach,b=f.s.big,dx=h.dx*b,w=h.w*b,hh=h.h*b,dy=h.dy*b;const x=f.dir>0?f.x+dx+r-w/2:f.x-dx-r-w/2;return{x,y:f.y+dy-hh/2,w,h:hh,z:f.z};} // [PACK2] giants x1.5
function overlap(b,t){const hw=t.s.hw;return !t.hidden&&Math.abs(b.z-t.z)<18&&b.x<t.x+hw&&b.x+b.w>t.x-hw&&b.y<t.y&&b.y+b.h>t.y-t.s.hh;} // [PACK2] per-fighter hurtbox
const WORDS=['POW!','BAM!','WHAM!','SMASH!','KRAK!'];
function addMp(f,v){f.mp=Math.max(0,Math.min(f.s.mpMax,f.mp+v));}
function damage(t,dmg,kx,ky,stun,from,heavy,eff){if(t.hp<=0||t.hidden)return;eff=eff||{};
 kx=(kx||0)*GAME_SPEED;ky=(ky||0)*GAME_SPEED;stun=TS(stun); // [SPEED]
 const a=t===P?E:P;
 const facing=Math.sign(from-t.x)===t.dir||from===t.x;
 const hx=t.x+Math.sign(from-t.x)*14,hy=t.y-55;
 if(t.block&&facing&&t.state!=='hurt'&&!eff.unblock){dmg=Math.ceil(dmg*t.s.blockMul);kx*=0.3;ky=0;stun=6;
  if(t.type==='mireya')addMp(t,3);
  fx.push({k:'num',x:t.x,y:t.y-95,z:t.z,t:40,max:40,c:'#cfe',txt:'BLOCK'});
  fx.push({k:'guard',x:hx,y:hy,z:t.z,t:12,max:12,dir:t.dir,c:t.s.color});hitstop=Math.max(hitstop,3);
  t.hp=Math.max(0,t.hp-dmg);t.stun=stun;t.state='hurt';t.move=null;t.spId=null;t.vx=kx*Math.sign(t.x-from||1);checkKo(t,from);return;}
 if(a.comboT>0)a.combo++;else a.combo=1;a.comboT=55;
 const big=heavy||dmg>=25,col=a.s.color;
 fx.push({k:'num',x:t.x+(Math.random()*20-10),y:t.y-100,z:t.z,t:45,max:45,c:big?'#ffdf3a':'#fff',txt:''+dmg,big});
 fx.push({k:'burst',x:hx,y:hy,z:t.z,t:big?16:11,max:big?16:11,big,c:col,rot:Math.random()*6,word:big?WORDS[(Math.random()*WORDS.length)|0]:''});
 for(let n=0;n<(big?10:6);n++){const an=Math.random()*6.28,sp=2+Math.random()*(big?7:4);
  fx.push({k:'spark',x:hx,y:hy,z:t.z,vx:Math.cos(an)*sp,vy:Math.sin(an)*sp-1,t:14+Math.random()*8|0,max:22,c:a.s.pal.trim});}
 hitstop=Math.max(hitstop,big?7:4);if(big)shake=Math.max(shake,dmg>=50?14:7);t.flash=5;
 t.hp=Math.max(0,t.hp-dmg);addMp(t,5);
 if(eff.burn){t.burn={n:3,next:TS(20),dmg:4};}
 if(eff.freeze){eff.freeze=TS(eff.freeze);t.frozen=Math.max(t.frozen,eff.freeze);stun=Math.max(stun,eff.freeze);fx.push({k:'num',x:t.x,y:t.y-120,z:t.z,t:40,max:40,c:'#bff',txt:'FROZEN!'});}
 if(eff.slow)t.slow=Math.max(t.slow,TS(eff.slow));
 if(t.s.giant&&!heavy&&t.hp>0){checkKo(t,from);return;} // [PACK2] giants shrug off light hits
 if(t.armor&&t.hp>0){checkKo(t,from);return;} // super armor: take damage, keep going
 t.stun=stun;t.move=null;t.spId=null;t.state='hurt';t.hidden=false;
 t.vx=kx*Math.sign(t.x-from||1);if(ky){t.vy=ky;if(ky<=-6)t.kd=true;}
 checkKo(t,from);}
function checkKo(t,from){if(t.hp<=0&&!ko){t.state='down';t.vy=-9*GAME_SPEED;t.vx=5*GAME_SPEED*Math.sign(t.x-from||1);t.kd=true;hitstop=14;shake=20;flashScr=10;ko={t:0,who:t};}}
function startSpecial(f,n){const id=f.s.sp[n-1],cost=n===3?ULT_COST:f.s.moves[id].mp;
 if(f.mp<cost){if(!f.cpu)fx.push({k:'num',x:f.x,y:f.y-110,z:f.z,t:30,max:30,c:'#9cf',txt:'NEED '+cost+' MP'});return false;}
 addMp(f,-cost);f.state='attack';f.move='sp';f.spId=id;f.castT=SPEC[id].cast;f.lockT=0;f.vx=0;f.vz=0;f.armor=(id==='supernova_rush'||id==='titan_fall'||id==='avalanche_grab'||id==='canopy_crash'||id==='primal_rampage'||id==='ember_cataclysm');
 fx.push({k:'cast',x:f.x,y:f.y,z:f.z,t:30,max:30,c:f.s.color});
 if(n===3){hitstop=Math.max(hitstop,22);flashScr=8;fx.push({k:'cutin',name:f.s.moves[id].name.replace('ULT: ',''),who:f.type,c:f.s.color,t:34,max:34,left:f===P});}
 else fx.push({k:'mname',txt:f.s.moves[id].name.toUpperCase(),x:f.x,y:f.y-130,z:f.z,t:40,max:40,c:f.s.color});
 return true;}
function update(f){const o=f===P?E:P;
 if(ko){f.block=false;if(f.hp>0&&f.state!=='attack'&&!f.hidden)f.state=f.y<0?'jump':'idle';if(f.state==='attack'&&!f.spId)f.move=null,f.state='idle';f.vx*=0.85;f.vz=0;physics(f);return;}
 const i=input(f);f.block=false;
 if(f.hp<=0){physics(f);return;}
 if(f.state==='hurt'){if(--f.stun<=0){f.state='idle';if(f.kd)f.getup=TS(14);f.kd=false;}physics(f);return;}
 if(f.state==='attack'){
  if(f.move==='sp'){
   if(f.castT>0){if(--f.castT===0){spawnSpecial(f,o);f.lockT=SPEC[f.spId].lock+(f.spId==='titan_fall'||f.spId==='supernova_rush'||f.spId==='avalanche_grab'||f.spId==='canopy_crash'?Math.floor(SPEC[f.spId].dur*0.5):0);}}
   else if(--f.lockT<=0){f.move=null;f.spId=null;f.state='idle';f.armor=false;}
   physics(f);return;}
  if(f.move==='kick'&&f.fi<=1&&i.sp&&!f.hitDone){f.move=null;if(startSpecial(f,i.sp))return;f.state='idle';}
  else{const fr=MOVES[f.move][f.fi];
   if(fr.hit&&!f.hitDone){const b=box(f,fr.hit);if(overlap(b,o)){const m=moveDmg(f,f.move);
     damage(o,m.d,m.kx!=null?m.kx:fr.hit.kx,m.ky!=null?m.ky:fr.hit.ky,fr.hit.stun,f.x,m.heavy,m.eff);f.hitDone=true;addMp(f,3);}}
   if(f.move==='air'&&f.y>=0){f.move=null;f.state='idle';}
   else if(--f.ft<=0){f.fi++;if(f.fi>=MOVES[f.move].length){if(f.move==='punch')f.pcT=TS(22);if(f.move==='kick')f.armor=false;f.move=null;f.state='idle';}else{f.ft=MOVES[f.move][f.fi].w;if(f.move==='kick')f.armor=false;}}
   if(f.move==='dash')f.vx=f.dir*f.s.run*0.8*(f.fi<2?1:0.3);
   physics(f);return;}}
 if(f.pcT>0)f.pcT--;
 const air=f.y<0;
 if(!air){
  if(i.b){f.block=true;f.vx=0;f.vz=0;f.state='block';physics(f);return;}
  if(i.sp&&startSpecial(f,i.sp))return;
  if(i.a){const close=Math.abs(o.x-f.x)<55*f.s.big&&Math.abs(o.z-f.z)<18;
   if(f.type==='gorran'&&o.state==='hurt'&&close&&o.y>-30){startMove(f,'grab');return;}
   if(f.state==='run'&&f.s.moves.run_attack){startMove(f,'dash');return;}
   startMove(f,'punch');return;}
  if(i.s){startMove(f,'kick');return;}
  const run=i.run&&i.run===i.mx;let sp=run?f.s.run:f.s.speed;if(f.slow>0)sp*=0.85;
  // [SPEED] ease toward target velocity (accelerate/decelerate) instead of snapping
  const tx=i.mx*sp,tz=i.mz*f.s.speed*0.6,acc=i.mx?0.22:0.3;f.vx+=(tx-f.vx)*acc;f.vz+=(tz-f.vz)*0.3;
  if(Math.abs(f.vx)<0.02)f.vx=0;if(Math.abs(f.vz)<0.02)f.vz=0;if(i.mx)f.dir=i.mx;
  f.state=run?'run':(i.mx||i.mz)?'walk':'idle';
  if(i.j){f.vy=-f.s.jump;f.state='jump';}
 } else if((i.a||i.s)&&!f.move){f.move='air';f.fi=0;f.ft=MOVES.air[0].w;f.hitDone=false;f.state='attack';}
 physics(f);}
function physics(f){if(f.hidden)return;f.x+=f.vx;f.z+=f.vz;f.vy+=GRAV;f.y+=f.vy;
 if(f.y>=0){if(f.vy>4*GAME_SPEED)f.land=8;f.y=0;f.vy=0;if(f.state==='hurt'||f.state==='down'||f.state==='attack')f.vx*=0.7;if(f.state==='jump')f.state='idle';}
 f.x=Math.max(20,Math.min(W-20,f.x));f.z=Math.max(GROUND_TOP,Math.min(GROUND_BOT,f.z));}
function ease(p){return 1-(1-p)*(1-p);}
function spawnSpecial(f,o){const id=f.spId,d=SPEC[id];flashScr=Math.max(flashScr,4);
 const s={id,owner:f,t:0,dur:d.dur,x:f.x,z:f.z,dir:f.dir,hit:false,n:0,grab:false};specials.push(s);
 if(id==='solar_rise'){f.vy=-10*GAME_SPEED;}
 if(id==='quake_stomp'){shake=Math.max(shake,12);fx.push({k:'ring',x:f.x,y:0,z:f.z,t:24,max:24,c:f.s.color});}
 if(id==='titan_fall'){f.hidden=true;}
 return s;}
function cl(x){return Math.max(20,Math.min(W-20,x));}
function updSpecial(s){const f=s.owner,o=f===P?E:P;s.t++;const p=s.t/s.dur,dz=Math.abs(o.z-s.z),pw=f.s.power,D=b=>Math.round(b*pw),dir=s.dir,live=!ko&&f.hp>0;
 const ctrl=f.spId===s.id&&f.state==='attack'; // caster still performing it
 switch(s.id){
 case 'sun_comet':{s.cx=s.x+dir*(30+ease(p)*360);
  if(live&&!s.hit&&p<0.86&&dz<22&&Math.abs(o.x-s.cx)<32&&o.y>-110){s.hit=true;damage(o,D(45),6,-4,26,s.cx-dir*10,true,{burn:1});
   s.t=Math.ceil(s.dur*0.86);s.x=s.cx-dir*(30+ease(0.86)*360);}
  break;}
 case 'solar_rise':{if(live&&!s.hit&&p<0.5&&Math.abs(o.z-f.z)<24){const rel=(o.x-f.x)*dir;if(rel>-10&&rel<75&&o.y>f.y-150){s.hit=true;damage(o,D(55),3,-11,40,f.x,true,{burn:1});}}
  if(p>0.95)f.armor=false;break;}
 case 'supernova_rush':{if(p<0.5){if(ctrl)f.x=cl(s.x+dir*ease(p*2)*180);if(f.state==='attack')f.state='attack';
   if(live&&s.t%4===0&&s.n<8&&Math.abs(o.x-f.x)<65&&dz<30){s.n++;damage(o,D(10),0,0,22,f.x,s.n===8,{});shake=Math.max(shake,4);}}
  if(s.t===Math.floor(s.dur*0.5)){const bx=s.x+dir*200;shake=Math.max(shake,18);flashScr=Math.max(flashScr,8);
   if(live&&Math.abs(o.x-bx)<125&&dz<40)damage(o,D(80),8,-9,40,bx-dir*40,true,{burn:1});f.armor=false;}
  break;}
 case 'frost_lance':{const rel=(o.x-s.x)*dir;
  if(live&&!s.hit&&dz<22&&rel>35&&rel<285&&o.y>-60&&p>=((rel-50)/30)*0.07+0.12&&p<0.7){s.hit=true;damage(o,D(40),2,0,20,o.x-dir*20,true,{freeze:40});}
  break;}
 case 'moon_mirror':{s.mx=s.x+dir*(p<0.5?50:50+ease((p-0.5)/0.5)*300);
  for(const c of specials)if(c.id==='sun_comet'&&c.owner!==f&&c.cx!=null&&Math.abs(c.cx-s.mx)<34&&Math.abs(c.z-s.z)<22&&c.t<c.dur*0.86){
   c.owner=f;c.dir=dir;c.t=0;c.x=s.mx-dir*10;c.hit=false;fx.push({k:'num',x:s.mx,y:-110,z:s.z,t:40,max:40,c:'#bff',txt:'REFLECT!'});}
  if(live&&!s.hit&&p>0.08&&Math.abs(o.x-s.mx)<30&&dz<22&&o.y>-110){s.hit=true;damage(o,D(30),4,-2,22,s.mx-dir*10,true,{slow:90});}
  break;}
 case 'eclipse_blizzard':{const k=Math.floor((p-0.2)/0.06);
  if(live&&p>=0.2&&k<10&&k>=s.n){s.n=k+1;damage(o,D(14),0,0,14,o.x-o.dir*5,s.n===10,s.n===10?{freeze:90}:{});shake=Math.max(shake,3);}
  break;}
 case 'quake_stomp':{if(live&&!s.hit&&p>0.08&&p<0.5&&Math.abs(o.x-s.x)<215&&dz<24&&o.y>-25){s.hit=true;damage(o,D(50),5,-8,40,s.x,true,{unblock:true});}
  break;}
 case 'avalanche_grab':{if(p<0.45){if(ctrl)f.x=cl(s.x+dir*ease(p/0.45)*90);
   if(live&&!s.grab&&ctrl&&Math.abs(o.x-(f.x+dir*30))<40&&dz<24&&o.y>-40&&!o.hidden){s.grab=true;o.state='hurt';o.stun=999;o.move=null;o.spId=null;}
   if(s.grab){o.x=cl(f.x+dir*32);o.y=-24;o.vy=0;o.vx=0;}}
  else if(s.grab&&!s.hit){s.hit=true;o.x=cl(s.x+dir*110);o.y=0;o.vy=0;shake=Math.max(shake,16);if(live)damage(o,D(65),1,-5,30,f.x,true,{unblock:true});else o.stun=10;}
  if(p>=0.45)f.armor=false;break;}
 // ---- [PACK2] Gorgath / Bruntusk / Lysa specials (anchors from characters2.md) ----
 case 'ember_breath':{const len=440*Math.min(1,p*3),rel=(o.x-s.x)*dir,k=Math.floor((p-0.1)/0.12);
  if(live&&p>=0.1&&k<6&&k>=s.n&&dz<26&&rel>40&&rel<104+len&&o.y>-170){s.n=k+1;damage(o,D(10),s.n===6?5:1,s.n===6?-4:0,16,o.x-dir*10,s.n===6,s.n===6?{burn:1}:{});}
  break;}
 case 'cinder_tail':{if(live&&!s.hit&&p>0.15&&p<0.7&&Math.abs(o.x-s.x)<150&&dz<30&&o.y>-80){s.hit=true;damage(o,D(55),6,-9,30,s.x,true,{});}break;}
 case 'ember_cataclysm':{if(s.t===Math.floor(s.dur*0.3)){shake=Math.max(shake,22);flashScr=Math.max(flashScr,10);}
  const k=Math.floor((p-0.3)/0.1);if(live&&p>=0.3&&k<4&&k>=s.n&&dz<60){s.n=k+1;damage(o,D(50),s.n===4?7:1,s.n===4?-10:-2,30,o.x-dir*10,s.n===4,s.n===4?{burn:1}:{});}
  break;}
 case 'boulder_hurl':{const lx=s.x+dir*386;if(live&&!s.hit&&p>=0.85&&Math.abs(o.x-lx)<80&&dz<34){s.hit=true;shake=Math.max(shake,10);damage(o,D(55),5,-8,34,lx-dir*20,true,{});}break;}
 case 'canopy_crash':{if(p<0.5){if(ctrl){f.x=cl(s.x+dir*ease(p*2)*150);f.y=-Math.sin(p*2*Math.PI)*90;f.vy=0;}}
  else if(!s.hit){s.hit=true;f.y=0;shake=Math.max(shake,16);fx.push({k:'ring',x:f.x,y:0,z:s.z,t:24,max:24,c:f.s.color});
   if(live&&Math.abs(o.x-f.x)<95&&dz<34&&o.y>-40)damage(o,D(70),4,-7,30,f.x,true,{});f.armor=false;}
  break;}
 case 'primal_rampage':{if(s.t===Math.floor(s.dur*0.12)&&live&&Math.abs(o.x-f.x)<220&&dz<50&&o.state!=='hurt'){o.state='hurt';o.stun=TS(30);o.move=null;o.spId=null;}
  const k=Math.floor((p-0.35)/0.2);if(p>=0.35&&k<3&&k>=s.n){s.n=k+1;shake=Math.max(shake,14);fx.push({k:'ring',x:f.x,y:0,z:s.z,t:24,max:24,c:f.s.color});
   if(live&&Math.abs(o.x-f.x)<320&&dz<40&&o.y>-30)damage(o,D(63),s.n===3?8:2,s.n===3?-9:-3,30,f.x,true,{});}
  if(p>0.9)f.armor=false;break;}
 case 'frost_bloom':{const bx=s.x+dir*170;if(live&&!s.hit&&p>0.15&&p<0.6&&Math.abs(o.x-bx)<50&&dz<26&&o.y>-80){s.hit=true;damage(o,D(42),2,0,20,bx-dir*10,true,{freeze:50});}break;}
 case 'glacial_palace':{const wx=s.x+dir*72;
  if(p<0.6)for(const c of specials)if(c.owner!==f&&(c.id==='sun_comet'||c.id==='boulder_hurl')&&c.t<c.dur*0.86){const cx=c.cx!=null?c.cx:c.x+c.dir*386*(c.t/c.dur);
   if(Math.abs(cx-wx)<30&&Math.abs(c.z-s.z)<24){c.t=c.dur;fx.push({k:'num',x:wx,y:-110,z:s.z,t:40,max:40,c:'#bff',txt:'BLOCKED!'});}}
  if(p>=0.6){const front=wx+dir*((p-0.6)/0.4)*300;if(live&&!s.hit&&Math.abs(o.x-front)<34&&dz<24&&o.y>-110){s.hit=true;damage(o,D(30),4,-2,22,front-dir*10,true,{slow:90});}}
  else if(live&&Math.abs(o.x-wx)<20&&dz<24){o.x=cl(wx+Math.sign(o.x-wx||dir)*20);} // wall is solid
  break;}
 case 'winters_decree':{const k=Math.floor((p-0.2)/0.08);
  if(live&&p>=0.2&&k<8&&k>=s.n){s.n=k+1;damage(o,D(19),0,0,14,o.x-o.dir*5,s.n===8,s.n===8?{freeze:100}:{});shake=Math.max(shake,3);}
  break;}
 case 'titan_fall':{if(s.t===Math.floor(s.dur*0.5)){const lx=cl(s.x+dir*140);f.hidden=false;f.x=lx;f.y=0;f.vy=0;shake=Math.max(shake,24);flashScr=Math.max(flashScr,10);
   fx.push({k:'ring',x:lx,y:0,z:s.z,t:30,max:30,c:f.s.color});
   if(live&&Math.abs(o.x-lx)<200&&Math.abs(o.z-s.z)<90)damage(o,D(180),9,-10,50,lx,true,{});f.armor=false;}
  break;}}}
function step(){if(mode!=='fight')return;tick++;
 for(const f of[P,E]){f.px=f.x;f.py=f.y;f.pz=f.z;if(f.getup>0)f.getup--;if(f.flash>0)f.flash--;if(f.land>0)f.land--;}
 if(hitstop>0){hitstop--;return;}
 update(P);update(E);
 if(!ko){
 if(!P.move&&P.state!=='hurt'&&P.hp>0&&!P.block)P.dir=Math.sign(E.x-P.x)||P.dir;
 if(!E.move&&E.state!=='hurt'&&E.hp>0)E.dir=Math.sign(P.x-E.x)||E.dir;}
 for(const s of specials)updSpecial(s);
 specials=specials.filter(s=>s.t<s.dur);
 for(const f of[P,E]){if(f.hidden&&!specials.some(s=>s.owner===f&&s.id==='titan_fall')){f.hidden=false;f.y=0;}
  if(f.hp>0&&!ko)addMp(f,f.s.mpRegen);if(f.comboT>0&&--f.comboT===0)f.combo=0;
  if(f.frozen>0)f.frozen--;if(f.slow>0)f.slow--;
  if(f.burn&&f.hp>0&&!ko){if(--f.burn.next<=0){f.burn.next=TS(20);f.hp=Math.max(0,f.hp-f.burn.dmg);fx.push({k:'num',x:f.x+8,y:f.y-90,z:f.z,t:30,max:30,c:'#ffa040',txt:''+f.burn.dmg});
    for(let n=0;n<4;n++)fx.push({k:'ember',x:f.x+(Math.random()-0.5)*24,y:f.y-20-Math.random()*50,z:f.z,vy:-1-Math.random()*1.5,t:24,max:24});
    checkKo(f,f.x-f.dir);if(--f.burn.n<=0)f.burn=null;}}}
 for(const e of fx){e.t--;if(e.k==='spark'){e.x+=e.vx*GAME_SPEED;e.y+=e.vy*GAME_SPEED;e.vy+=0.3*GAME_SPEED;e.vx*=0.94;}if(e.k==='ember')e.y+=e.vy;}
 fx=fx.filter(e=>e.t>0);
 if(ko){ko.t++;if(ko.t>=110){ // (ko timeline is presentation, not scaled)
 mode='over';winner=P.hp>0?'YOU WIN!':'CPU WINS';}}}
if(typeof module!=='undefined'&&module.exports)module.exports={mk,step,ROSTER,ORDER,MOVES,SPEC,start,onKey,state:()=>({P,E,mode,specials,fx,ko,tick})};
