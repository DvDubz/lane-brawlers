'use strict';
// Lane Brawlers - FLOW layer (menus, arcade ladder, versus CPU/2P, practice, pause, rounds, persistence, beeps).
// Self-contained: loads AFTER game.js (+ render.js in the browser) and wraps the global functions
// onKey / step / input / aiThink / draw. No edits to game rules are needed. Everything is data-driven off ORDER.
const FLOW=(function(){
const F={game:'cpu',cur:0,t:0,fade:0,sel:{step:'p1',stg:0},round:1,wins:[0,0],lad:null,diff:0.5,p2:false,hit:[],lastResult:null,showMoves:false,hard:false,clearedNow:false};
const STORY={ // one line per dynasty / fighter id (lore: lf2-clone-chars/characters.md); unknown ids fall back to dynasty name
 ryn:'Flame-sworn of Aurath, hunting the thief of the eternal brazier.',
 mireya:'Heir of the silent observatories of Selvaris. Never touched, never hurried.',
 gorran:'Quarry-warden of Kholdra, skin of living basalt. What he catches stays down.',
 gorgath:'Woken by the stolen brazier, the Ember Tyrant climbs from the Cinder Deeps to claim its fire.',
 bruntusk:'The Jungle King of Maru-Tal. Scorch his forest and the whole jungle goes quiet.',
 lysa:'Envoy of the Frostcrown Court, come south to stop the monsters\' war from melting her home.'};
function story(id){return STORY[id]||(ROSTER[id].dynasty+' sends its champion.');}
// ---------- persistence (guarded: node/headless/private mode) ----------
const SKEY='laneBrawlers.progress.v1';
function load(){try{const s=typeof localStorage!=='undefined'&&localStorage.getItem(SKEY);if(s)return Object.assign(blank(),JSON.parse(s));}catch(e){}return blank();}
function blank(){return{cleared:{},best:{},wins:0,hard:false,unlocked:[]};}
F.save=load();
function persist(){try{if(typeof localStorage!=='undefined')localStorage.setItem(SKEY,JSON.stringify(F.save));}catch(e){}}
// ---------- audio (WebAudio beeps, no assets) ----------
let AC=null;
function beep(kind){try{if(typeof window==='undefined')return;AC=AC||new (window.AudioContext||window.webkitAudioContext)();
 const f={move:520,ok:780,back:300,ko:160,go:660}[kind]||440,o=AC.createOscillator(),g=AC.createGain();o.type=kind==='ko'?'sawtooth':'square';o.frequency.value=f;
 if(kind==='ok')o.frequency.linearRampToValueAtTime(f*1.5,AC.currentTime+0.08);g.gain.value=0.05;g.gain.exponentialRampToValueAtTime(0.0001,AC.currentTime+(kind==='ko'?0.4:0.12));
 o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+0.45);}catch(e){}}
// ---------- helpers ----------
function clearKeys(){for(const k in keys)keys[k]=false;last={};F.l2={};if(P)P.runDir=0;if(E)E.runDir=0;}
function go(m){mode=m;F.cur=0;F.t=0;F.fade=1;clearKeys();}
function wrap(i,n){return (i+n)%n;}
function others(id){return ORDER.filter(x=>x!==id);}
// ---------- menus ----------
function titleItems(){const it=[['ARCADE','arcade'],['VERSUS CPU','cpu'],['VERSUS 2P','2p'],['PRACTICE','practice']];if(F.save.hard)it.splice(1,0,['ARCADE · HARD','hard']);return it;}
function pauseItems(){const it=[['RESUME','resume'],['RESTART FIGHT','restart'],['CHANGE FIGHTER','fighter'],['QUIT TO TITLE','title']];if(F.game==='practice')it.splice(1,0,['MOVE LIST '+(F.showMoves?'(ON)':'(OFF)'),'moves']);return it;}
function overItems(){const r=F.lastResult;
 if(F.game==='arcade'){if(r==='win')return[['NEXT FIGHT','next'],['QUIT TO TITLE','title']];
  if(F.lad.cont>0)return[['CONTINUE ('+F.lad.cont+' LEFT)','continue'],['CHANGE FIGHTER','fighter'],['QUIT TO TITLE','title']];
  return[['RETRY LADDER','retry'],['CHANGE FIGHTER','fighter'],['QUIT TO TITLE','title']];}
 return[['REMATCH','rematch'],['CHANGE OPPONENT','opp'],['CHANGE FIGHTER','fighter'],['QUIT TO TITLE','title']];}
function items(){return mode==='title'?titleItems():mode==='paused'?pauseItems():mode==='over'?overItems():mode==='clear'?[['BACK TO TITLE','title']]:[];}
// ---------- starting fights ----------
function setDiff(d){F.diff=Math.max(0,Math.min(1,d));}
function begin(){F.round=1;F.wins=[0,0];startRound();go('vs');}
function startRound(keepHp){const L=F.lad,boss=L&&L.i===L.list.length-1&&L.boss;
 start(pick,pick2);
 if(F.game==='arcade')stage=STAGES[L.i%STAGES.length];
 if(boss){E.s=Object.assign({},E.s,{hp:Math.round(E.s.hp*1.3),short:'Rival '+E.s.short});E.hp=E.hpLag=E.s.hp;}
 if(F.game==='arcade'&&F.round===1&&L.carry!=null){P.hp=P.hpLag=Math.min(P.s.hp,Math.round(L.carry+P.s.hp*0.35));P.mp=P.s.mpMax;}
 E.cpu=!F.p2;
 for(const e of fx)if(e.k==='banner'){e.txt=F.game==='practice'?'PRACTICE':'ROUND '+F.round;e.t=e.max=55;}
 F.fightBanner=F.game!=='practice';}
function arcadeOpp(){const L=F.lad;pick2=L.list[L.i];setDiff((F.hard?0.35:0.1)+0.7*L.i/Math.max(1,L.list.length-1));}
function newLadder(hard){F.hard=!!hard;F.lad={list:others(pick).concat([pick]),boss:true,i:0,cont:3,contUsed:0,won:0,t0:0,ticks:0,carry:null};arcadeOpp();}
function act(a){beep(a==='title'||a==='back'?'back':'ok');
 switch(a){
 case'arcade':case'hard':F.game='arcade';F.hard=a==='hard';F.p2=false;F.sel={step:'p1'};go('select');break;
 case'cpu':case'2p':F.game='cpu';F.p2=a==='2p';F.sel={step:'p1'};go('select');break;
 case'practice':F.game='practice';F.p2=false;F.sel={step:'p1'};go('select');break;
 case'resume':mode='fight';clearKeys();break;
 case'restart':F.round=1;F.wins=[0,0];startRound();mode='fight';clearKeys();break;
 case'moves':F.showMoves=!F.showMoves;break;
 case'fighter':F.sel={step:'p1'};go('select');break;
 case'opp':F.sel={step:'opp'};go('select');break;
 case'title':go('title');break;
 case'rematch':begin();break;
 case'next':F.lad.i++;arcadeOpp();begin();break;
 case'continue':F.lad.cont--;F.lad.contUsed++;F.lad.carry=null;begin();break;
 case'retry':newLadder(F.hard);begin();break;}}
function confirmSelect(){const s=F.sel;
 if(s.step==='p1'){if(F.game==='arcade'){newLadder(F.hard);begin();return;}
  if(F.game==='practice'){if(pick2===pick)pick2=others(pick)[0];setDiff(0);begin();return;}
  if(pick2===pick&&!F.p2)pick2=others(pick)[0];s.step='opp';beep('ok');return;}
 if(s.step==='opp'){s.step='stage';beep('ok');return;}
 setDiff(0.5);begin();}
// ---------- keys ----------
const P2K={up:'KeyI',down:'KeyK',left:'KeyJ',right:'KeyL',a:'KeyU',s:'KeyO',d:'KeyP',f:'Semicolon'};
const MENU_KEYS=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Enter','Escape','Space','KeyB','KeyC','KeyP','KeyM','Digit1','Digit2','Digit3','Digit4','Digit5','Digit6','Digit7','Digit8','Digit9'];
F.l2={};
function menuKey(code){const it=items();if(F.cur>=it.length)F.cur=0;
 if(code==='ArrowUp'||code==='ArrowDown'){if(it.length){F.cur=wrap(F.cur+(code==='ArrowUp'?-1:1),it.length);beep('move');}return;}
 if(code==='Enter'||code==='Space'){if(it.length)act(it[F.cur][1]);return;}
 if(code==='Escape'||(code==='KeyP'&&mode==='paused'&&!F.p2)){
  if(mode==='paused'){act('resume');return;}
  if(mode==='over'){F.game==='arcade'?act('fighter'):act('opp');return;}
  if(mode==='clear'){act('title');return;}}}
function selectKey(code){const s=F.sel,n=ORDER.indexOf(code.startsWith('Digit')?ORDER[+code.slice(5)-1]:null);
 const dx=code==='ArrowRight'?1:code==='ArrowLeft'?-1:0;
 if(code==='Escape'){beep('back');if(s.step==='p1')go('title');else if(s.step==='opp')s.step='p1';else s.step='opp';return;}
 if(code==='Enter'||code==='Space'){confirmSelect();return;}
 if(s.step==='p1'){if(dx){pick=ORDER[wrap(ORDER.indexOf(pick)+dx,ORDER.length)];beep('move');}if(n>=0){pick=ORDER[n];beep('move');}}
 else if(s.step==='opp'){if(dx||code==='KeyC'){const o=F.p2?ORDER:others(pick);pick2=o[wrap(Math.max(0,o.indexOf(pick2))+(dx||1),o.length)];beep('move');}if(n>=0&&(F.p2||ORDER[n]!==pick)){pick2=ORDER[n];beep('move');}}
 else if(dx||code==='KeyB'){stage=STAGES[wrap(STAGES.indexOf(stage)+(dx||1),STAGES.length)];beep('move');}}
const _onKey=onKey;
function flowKey(code,down,now){
 if(!down){if(F.p2&&(code===P2K.left||code===P2K.right)&&E)E.runDir=0;_onKey(code,false,now);return code.startsWith('Arrow')||code==='Space'||code==='Tab';}
 const rep=keys[code];
 if(mode==='fight'){
  if(!rep&&(code==='Escape'||(code==='KeyP'&&!F.p2))){mode='paused';F.cur=0;F.t=0;clearKeys();beep('back');return true;}
  if(!rep&&code==='KeyM'&&F.game==='practice')F.showMoves=!F.showMoves;
  if(F.p2&&!rep){F.l2[code]=true;if((code===P2K.left||code===P2K.right)&&E){if(now-(F.tap2[code]||0)<250)E.runDir=code===P2K.left?-1:1;F.tap2[code]=now;}}
  return _onKey(code,true,now);}
 keys[code]=true;if(rep&&code!=='ArrowUp'&&code!=='ArrowDown'&&code!=='ArrowLeft'&&code!=='ArrowRight')return true;
 if(mode==='vs'){if((code==='Enter'||code==='Space')&&F.t>10)toFight();else if(code==='Escape'){beep('back');F.sel={step:'p1'};go('select');}return true;}
 if(mode==='select'){selectKey(code);return true;}
 if(mode==='over'&&F.t<30)return true; // ignore mashing right after KO
 menuKey(code);return MENU_KEYS.includes(code)||code.startsWith('Arrow');}
F.tap2={};
function toFight(){mode='fight';F.t=0;clearKeys();beep('go');}
onKey=flowKey;
// ---------- input: second human ----------
const _input=input;
input=function(f){if(F.p2&&f===E){const k=keys,l=F.l2,dirHeld=k[P2K.up]||k[P2K.down]||k[P2K.left]||k[P2K.right];
  const i={mx:(k[P2K.right]?1:0)-(k[P2K.left]?1:0),mz:(k[P2K.down]?1:0)-(k[P2K.up]?1:0),a:l[P2K.a],s:l[P2K.s],j:l[P2K.d]&&!k[P2K.s],b:k[P2K.f]||k.BracketLeft,run:f.runDir};
  if(i.a&&k[P2K.s]){i.sp=k[P2K.d]?3:dirHeld?2:1;i.a=i.s=false;}F.l2={};return i;}
 return _input(f);};
// ---------- AI difficulty / practice dummy ----------
const _ai=aiThink;
aiThink=function(f,t){if(F.game==='practice'&&f===E){return{mx:0,mz:0};}
 const d=F.diff,before=f.ai,r=_ai(f,t);
 if(f.ai>before){f.ai=Math.round(f.ai*(1.6-1.0*d));if(Math.random()>0.5+0.5*d)r.a=r.s=r.j=false;}
 if(r.sp&&Math.random()>0.35+0.65*d)r.sp=0;
 if(!r.b&&(t.move||t.spId)&&Math.abs(t.x-f.x)<90&&Math.random()<0.2*d)r.b=true;return r;};
// ---------- step: timers, rounds, ladder ----------
const _step=step; // NOTE: flow timers count step() calls = real 60Hz time (not GAME_SPEED-scaled): VS 90=1.5s, result lockout 30=0.5s
step=function(){F.t++;
 if(mode==='vs'){if(F.t>=90)toFight();return;}
 if(mode!=='fight')return;
 if(F.game==='practice'){P.mp=P.s.mpMax;if(!ko&&E.hp<E.s.hp*0.3)E.hp=E.s.hp;}
 if(F.lad)F.lad.ticks++;
 if(F.fightBanner&&F.t===50){fx.push({k:'banner',txt:'FIGHT!',t:45,max:45});F.fightBanner=false;}
 const kob=ko;_step();if(ko&&!kob)beep('ko');
 if(mode!=='over')return;
 if(F.game==='practice'){startRound();mode='fight';return;}
 const pw=P.hp>0;F.wins[pw?0:1]++;
 if(F.wins[0]<2&&F.wins[1]<2){F.round++;const t=F.t;startRound();mode='fight';F.t=0;return;}
 F.lastResult=pw?'win':'lose';winner=pw?'YOU WIN!':(F.p2?'P2 WINS!':'CPU WINS');
 if(F.p2&&pw)winner='P1 WINS!';
 if(pw)F.save.wins++;
 if(F.game==='arcade'&&pw){const L=F.lad;L.won++;L.carry=P.hp;
  if(L.i>=L.list.length-1){F.save.cleared[pick]=true;const b=F.save.best[pick];if(!b||L.contUsed<b.cont||(L.contUsed===b.cont&&L.ticks<b.ticks))F.save.best[pick]={cont:L.contUsed,ticks:L.ticks};
   F.newUnlock=!F.save.hard;F.save.hard=true;persist();go('clear');return;}}
 persist();mode='over';F.cur=0;F.t=0;clearKeys();};
// ---------- drawing (browser only) ----------
if(typeof draw==='function'){
const _draw=draw;
function hint(c,s){c.fillStyle='rgba(0,0,0,.7)';c.fillRect(0,H-22,W,22);txt(c,s,W/2,H-7,'#fff','bold 12px sans-serif');}
function menu(c,it,x,y,gap,w){F.hit=[];it.forEach((m,i)=>{const on=i===F.cur,yy=y+i*gap;
  c.fillStyle=on?'rgba(255,200,60,.9)':'rgba(0,0,0,.6)';c.fillRect(x-w/2,yy-gap/2+3,w,gap-6);if(on){c.strokeStyle='#fff';c.lineWidth=2;c.strokeRect(x-w/2,yy-gap/2+3,w,gap-6);}
  txt(c,(on?'▶ ':'')+m[0],x,yy+6,on?'#200':'#fff','900 italic 18px Impact,"Arial Black",sans-serif');F.hit.push({x:x-w/2,y:yy-gap/2+3,w,h:gap-6,i});});}
function dim(c,a){c.fillStyle='rgba(8,0,20,'+a+')';c.fillRect(0,0,W,H);}
function fmt(t){const s=Math.floor(t/60);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
function drawTitleF(c){const m=mode;_draw(c);// render.js title art (has its own PRESS ENTER line; we cover it)
 c.fillStyle='rgba(10,0,25,1)';c.fillRect(W/2-130,262,260,H-262-22);
 menu(c,titleItems(),W/2,284,30,230);
 const cl=ORDER.filter(id=>F.save.cleared[id]).map(id=>ROSTER[id].short.toUpperCase());
 if(cl.length)txt(c,'★ ARCADE CLEARED: '+cl.join(', '),W/2,H-30,'#ffe66a','bold 12px sans-serif');
 hint(c,'↑/↓ choose  ·  ENTER / click confirm  ·  wins: '+F.save.wins+(F.save.hard?'  ·  HARD MODE unlocked':''));}
function drawSelectF(c){const s=F.sel,n=ORDER.length;drawStage(c,0);drawPetals(c);dim(c,0.6);
 const title=s.step==='p1'?(F.p2?'P1: CHOOSE FIGHTER':'CHOOSE YOUR FIGHTER'):s.step==='opp'?(F.p2?'P2: CHOOSE FIGHTER':'CHOOSE OPPONENT'):'CHOOSE STAGE';
 mangaText(c,title,W/2,24,26,'#fff','#ffd060',-0.2);
 const tag={arcade:F.hard?'ARCADE · HARD':'ARCADE',cpu:F.p2?'VERSUS 2P':'VERSUS CPU',practice:'PRACTICE'}[F.game];txt(c,tag,16,24,'#ffe66a','bold 13px sans-serif','left');
 const showOpp=s.step!=='p1'&&F.game==='cpu',sw=Math.min(96,(W-40)/n);
 ORDER.forEach((id,i)=>{const R=ROSTER[id],x=W/2+(i-(n-1)/2)*sw,y=88,me=pick===id,op=showOpp&&pick2===id,cur=s.step==='p1'?me:s.step==='opp'?op:false;
  c.save();c.translate(x,y);c.transform(1,0,-0.15,1,0,0);c.fillStyle=me?R.color+'66':op?'rgba(255,80,80,.35)':'rgba(0,0,0,.5)';c.fillRect(-42,-28,84,56);c.beginPath();c.rect(-42,-28,84,56);c.save();c.clip();c.transform(1,0,0.15,1,0,0);
  if(!(typeof LBS!=='undefined'&&LBS.face(c,id,0,6,84,60,false)))heroAt(c,id,0,60,0.6,1,'idle');c.restore();
  c.lineWidth=cur?4:2;c.strokeStyle=cur?'#fff':me?R.color:op?'#ff6a6a':'#555';c.strokeRect(-42,-28,84,56);c.restore();
  txt(c,(i+1)+' '+R.short.replace(',','').toUpperCase(),x,y+44,me||op?'#fff':R.color,'bold 11px sans-serif');
  if(F.save.cleared[id])txt(c,'★',x+34,y+44,'#ffe66a','bold 13px sans-serif');
  if(me)txt(c,'P1',x-34,y-32,'#7fe0ff','900 italic 14px Impact,sans-serif');if(op)txt(c,F.p2?'P2':'CPU',x+30,y-32,'#ff8080','900 italic 14px Impact,sans-serif');});
 const fid=s.step==='opp'?pick2:pick,R=ROSTER[fid],col=R.color;
 c.globalCompositeOperation='lighter';c.drawImage(auraTex(col),40,160,260,270);c.globalCompositeOperation='source-over';
 heroAt(c,fid,175,410,R.giant?1.0:1.6,1,(rt%240)<150?'idle':'special');
 mangaText(c,R.name.replace(/, the .*/,'').toUpperCase(),175,158,R.name.length>16?20:26,'#fff',col,-0.2);
 txt(c,R.dynasty,175,178,'#ffd','bold 11px sans-serif');
 c.fillStyle='rgba(0,0,0,.65)';c.fillRect(340,146,W-360,258);c.strokeStyle=col;c.lineWidth=2;c.strokeRect(340,146,W-360,258);const cx=340+(W-360)/2;
 if(s.step==='stage'){mangaText(c,'STAGE',cx,200,26,'#fff',col,-0.2);txt(c,'◀  '+stageName()+'  ▶',cx,260,'#fff','900 italic 22px Impact,sans-serif');txt(c,'P1 '+ROSTER[pick].short.toUpperCase()+'  vs  '+(F.p2?'P2 ':'CPU ')+ROSTER[pick2].short.toUpperCase(),cx,310,'#ffd','bold 13px sans-serif');}
 else{txt(c,story(fid),cx,166,'#fff','italic 11px sans-serif');
  txt(c,R.role+'  ·  HP '+R.hp+'  ·  POW x'+R.power,cx,184,'#ffd','11px sans-serif');
  Object.values(R.moves).slice(0,9).forEach((m,i)=>{const y=206+i*21,sp=m.special||m.ultimate;
   txt(c,m.name.replace('ULT: ','★ '),352,y,m.ultimate?'#ffe66a':sp?col:'#fff',(sp?'bold ':'')+'12px sans-serif','left');
   txt(c,m.input+(m.mp?'  ['+m.mp+' MP]':''),536,y,'#cde','11px sans-serif','left');});}
 if(F.game==='arcade')txt(c,'LADDER: '+others(pick).map(id=>ROSTER[id].short.replace(',','').toUpperCase()).concat(['RIVAL '+ROSTER[pick].short.replace(',','').toUpperCase()]).join(' → '),W/2,418,'#fff','bold 12px sans-serif');
 hint(c,s.step==='stage'?'←/→ or B stage  ·  ENTER fight  ·  ESC back':s.step==='opp'?'←/→ or C '+(F.p2?'P2 fighter':'opponent')+'  ·  1-'+n+' pick  ·  ENTER next  ·  ESC back':'←/→ or 1-'+n+' fighter  ·  ENTER confirm  ·  ESC back to title');}
function drawVS(c){drawStage(c,0);dim(c,0.55);const k=Math.min(1,F.t/20),ease=1-(1-k)*(1-k);
 c.fillStyle=P.s.color+'66';c.beginPath();c.moveTo(0,0);c.lineTo(W/2+40,0);c.lineTo(W/2-40,H);c.lineTo(0,H);c.fill();
 c.fillStyle=E.s.color+'66';c.beginPath();c.moveTo(W,0);c.lineTo(W/2+40,0);c.lineTo(W/2-40,H);c.lineTo(W,H);c.fill();
 heroAt(c,P.type,-120+ease*300,340,P.s.giant?1.35:2.3,1,'idle');heroAt(c,E.type,W+120-ease*300,340,E.s.giant?1.35:2.3,-1,'idle');
 mangaText(c,P.s.short.toUpperCase(),190,370,36,'#fff',P.s.color,-0.2);mangaText(c,E.s.short.toUpperCase(),W-190,370,36,'#fff',E.s.color,-0.2);
 txt(c,ROSTER[P.type].dynasty,190,392,'#ffd','12px sans-serif');txt(c,ROSTER[E.type].dynasty,W-190,392,'#ffd','12px sans-serif');
 starburst(c,W/2,180,90,60,14,F.t*0.02,'rgba(220,20,30,.9)','#000');mangaText(c,'VS',W/2,180,70,'#fff36a','#ff2a10',-0.25);
 if(F.game==='arcade')mangaText(c,(F.lad.i===F.lad.list.length-1?'FINAL STAGE':'STAGE '+(F.lad.i+1)+'/'+F.lad.list.length),W/2,50,30,'#fff','#ffb020',-0.2);
 txt(c,story(E.type),W/2,420,'#fff','italic bold 13px sans-serif');
 txt(c,'Stage: '+stageName()+(F.game==='arcade'&&F.lad.carry!=null&&F.round===1?'  ·  HP carried over +35%, MP full':''),W/2,78,'#cde','bold 13px sans-serif');
 hint(c,'ENTER skip  ·  ESC back');}
function pips(c){if(F.game==='practice')return;for(let s=0;s<2;s++)for(let i=0;i<2;i++){const x=W/2+(s?28+i*14:-28-i*14),y=56;c.beginPath();c.arc(x,y,5,0,6.283);c.fillStyle=F.wins[s]>i?'#ffe66a':'rgba(0,0,0,.6)';c.fill();c.lineWidth=1.5;c.strokeStyle='#fff';c.stroke();}
 txt(c,'ROUND '+F.round,W/2,74,'#fff','bold 11px sans-serif');}
function moveList(c){const R=P.s;c.fillStyle='rgba(0,0,0,.7)';c.fillRect(W-330,90,320,190);txt(c,'MOVE LIST (M)',W-170,108,R.color,'bold 13px sans-serif');
 Object.values(ROSTER[P.type].moves).slice(0,9).forEach((m,i)=>{txt(c,m.name,W-320,128+i*17,'#fff','11px sans-serif','left');txt(c,m.input,W-20,128+i*17,'#cde','11px sans-serif','right');});}
function drawFightF(c){const m=mode,k=ko;if(m!=='fight'){mode='paused';if(m==='over')ko=null;}_draw(c);mode=m;ko=k;pips(c);
 if(F.game==='practice'&&F.showMoves)moveList(c);
 if(m==='fight'){c.globalAlpha=0.7;txt(c,F.p2?'ESC pause':'ESC / P pause'+(F.game==='practice'?'  ·  M move list  ·  infinite MP':''),W/2,H-6,'#fff','bold 11px sans-serif');c.globalAlpha=1;
  if(F.p2)txt(c,'P2: I/J/K/L move · U punch · O kick · P jump · ; block',W/2,H-20,'#ffd','10px sans-serif');return;}
 if(m==='paused'){dim(c,0.55);mangaText(c,'PAUSED',W/2,110,56,'#fff','#7fd8ff',-0.2);menu(c,pauseItems(),W/2,170,36,260);hint(c,'↑/↓ choose  ·  ENTER confirm  ·  ESC'+(F.p2?'':' / P')+' resume');return;}
 if(m==='over'){dim(c,0.45);const win=F.lastResult==='win',ar=F.game==='arcade';
  mangaText(c,ar&&win?'STAGE '+(F.lad.i+1)+' CLEARED':ar&&F.lad.cont===0?'GAME OVER':winner,W/2,128,ar?48:52,'#fff',win?'#7fd8ff':'#ff6a6a',-0.2);
  txt(c,'Rounds '+F.wins[0]+' - '+F.wins[1]+(ar?'  ·  continues used '+F.lad.contUsed+' (left '+F.lad.cont+')':''),W/2,165,'#fff','bold 14px sans-serif');
  if(ar&&win)txt(c,'Next: '+(F.lad.i+1===F.lad.list.length-1?'RIVAL '+ROSTER[pick].short.toUpperCase()+' (final, 1.3x HP)':ROSTER[F.lad.list[F.lad.i+1]].short.toUpperCase()),W/2,185,'#ffe66a','bold 13px sans-serif');
  c.globalAlpha=F.t<30?0.5:1;menu(c,overItems(),W/2,225,36,280);c.globalAlpha=1;
  pips(c);hint(c,'↑/↓ choose  ·  ENTER confirm  ·  ESC '+(ar?'change fighter':'change opponent'));}}
function drawClear(c){drawStage(c,0);drawPetals(c);dim(c,0.6);const R=ROSTER[pick],L=F.lad;
 starburst(c,W/2,110,220,130,18,F.t*0.003,'rgba(255,170,40,.85)','#000');mangaText(c,'ARCADE CLEAR!',W/2,100,56,'#fff','#ff8a1a',-0.25);
 heroAt(c,pick,130,430,ROSTER[pick].giant?1.1:1.8,1,'special');
 mangaText(c,R.dynasty.split(' of ')[0].toUpperCase()+' CHAMPION: '+R.short.toUpperCase(),W/2,180,24,'#fff',R.color,-0.2);
 txt(c,'Fights won '+L.won+'  ·  continues used '+L.contUsed+'  ·  time '+fmt(L.ticks),W/2,210,'#fff','bold 14px sans-serif');
 if(F.newUnlock)txt(c,'UNLOCKED: ARCADE · HARD MODE (on the title menu)',W/2,232,'#ffe66a','bold 14px sans-serif');
 txt(c,'Lane Brawlers · original game · thanks for playing',W/2,H-34,'#cde','11px sans-serif');
 menu(c,[['BACK TO TITLE','title']],W/2,300,34,240);hint(c,'ENTER / ESC back to title');}
draw=function(c,alpha){
 if(mode==='title')drawTitleF(c);else if(mode==='select')drawSelectF(c);else if(mode==='vs'){rt++;drawVS(c);}else if(mode==='clear'){rt++;drawClear(c);}
 else if(P)drawFightF(c);else _draw(c,alpha);
 if(F.fade>0){c.fillStyle='rgba(0,0,0,'+F.fade+')';c.fillRect(0,0,W,H);F.fade=Math.max(0,F.fade-0.08);}};
F.draw=draw;}
// ---------- mouse (menus) ----------
if(typeof document!=='undefined')addEventListener('DOMContentLoaded',()=>{const cv=document.getElementById('c');if(!cv)return;
 const pt=e=>{const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H};};
 const at=p=>F.hit.find(h=>p.x>=h.x&&p.x<=h.x+h.w&&p.y>=h.y&&p.y<=h.y+h.h);
 cv.addEventListener('mousemove',e=>{if(!items().length)return;const h=at(pt(e));if(h&&h.i!==F.cur){F.cur=h.i;}});
 cv.addEventListener('click',e=>{const it=items();if(!it.length||(mode==='over'&&F.t<30))return;const h=at(pt(e));if(h&&it[h.i])act(it[h.i][1]);});});
// ---------- test / screenshot helpers ----------
F.forceKO=function(who){const t=who==='E'?E:P,o=t===P?E:P;t.hp=0;checkKo(t,o.x);};
F.shot=function(name,c){const draw30=()=>{for(let i=0;i<30;i++){c.setTransform(2,0,0,2,0,0);draw(c,1);}F.fade=0;c.setTransform(2,0,0,2,0,0);draw(c,1);};
 const pickF=()=>{pick='ryn';pick2='gorran';};
 const toOver=(who,game,cont)=>{F.game=game;pickF();if(game==='arcade'){newLadder();if(cont!=null)F.lad.cont=cont;}begin();toFight();for(let r=0;r<2;r++){F.forceKO(who);let n=0;while(mode==='fight'&&n++<400)step();}for(let i=0;i<40;i++)step();};
 switch(name){
 case'title':mode='title';F.cur=0;break;
 case'select':F.game='arcade';pickF();F.sel={step:'p1'};mode='select';break;
 case'select_opp':F.game='cpu';pick='mireya';pick2='gorran';F.sel={step:'opp'};mode='select';break;
 case'vs':F.game='arcade';pickF();newLadder();F.lad.i=1;arcadeOpp();begin();for(let i=0;i<30;i++)step();break;
 case'fight_banner':F.game='arcade';pickF();newLadder();begin();toFight();for(let i=0;i<20;i++)step();break;
 case'pause':F.game='cpu';pickF();begin();toFight();for(let i=0;i<70;i++)step();P.x=330;E.x=470;mode='paused';break;
 case'practice':F.game='practice';pickF();F.showMoves=true;begin();toFight();for(let i=0;i<100;i++)step();break;
 case'versus2p':F.game='cpu';F.p2=true;pickF();begin();toFight();for(let i=0;i<100;i++)step();break;
 case'over_win':toOver('E','arcade');break;
 case'over_lose':toOver('P','arcade');break;
 case'over_versus':toOver('E','cpu');break;
 case'gameover':toOver('P','arcade',0);break;
 case'arcade_clear':F.game='arcade';pickF();newLadder();F.lad.i=F.lad.list.length-1;F.lad.contUsed=1;F.lad.won=F.lad.list.length-1;F.lad.ticks=60*254;arcadeOpp();begin();toFight();for(let r=0;r<2;r++){F.forceKO('E');let n=0;while(mode==='fight'&&n++<400)step();}F.t=40;break;
 default:return false;}
 draw30();return true;};
F.items=items;F.story=story;
return F;})();
if(typeof module!=='undefined'&&module.exports)module.exports.FLOW=FLOW;
