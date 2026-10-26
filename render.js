'use strict';
// Lane Brawlers renderer: stages, effects, HUD, screens. Fighters + special FX come from characters.js.
const OUT='#1a0f1f';
let rt=0; // render frame counter
function rnd(seed){let s=seed;return()=>{s=(s*16807)%2147483647;return(s-1)/2147483646;};}
let SC=2; // internal render scale for offscreen caches (sharper on hi-dpi)
function mkCanvas(w,h){const c=document.createElement('canvas');c.width=Math.ceil(w*SC);c.height=Math.ceil(h*SC);c.lw=w;c.lh=h;c.getContext('2d').scale(SC,SC);return c;}
function di(c,img,x,y){c.drawImage(img,x,y,img.lw||img.width,img.lh||img.height);}
function limb(c,pts,w,col){c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(pts[0],pts[1]);
 for(let i=2;i<pts.length;i+=2)c.lineTo(pts[i],pts[i+1]);c.lineWidth=w+5;c.strokeStyle=OUT;c.stroke();c.lineWidth=w;c.strokeStyle=col;c.stroke();}
function dot(c,x,y,r,col){c.beginPath();c.arc(x,y,r,0,6.283);c.fillStyle=col;c.fill();c.lineWidth=2.5;c.strokeStyle=OUT;c.stroke();}
// ---------- stages (cached offscreen) ----------
const STG={};
function buildStage(name){const R=rnd(name==='sunset'?7:13),LW=W+120;
 const sky=mkCanvas(W,H),far=mkCanvas(LW,260),mid=mkCanvas(LW,260),near=mkCanvas(LW,280),floor=mkCanvas(W,H);
 let c=sky.getContext('2d');let g=c.createLinearGradient(0,0,0,240);
 if(name==='sunset'){g.addColorStop(0,'#21154a');g.addColorStop(0.35,'#6b2a73');g.addColorStop(0.62,'#e0506b');g.addColorStop(0.82,'#ff9a4d');g.addColorStop(1,'#ffd98a');}
 else{g.addColorStop(0,'#04051a');g.addColorStop(0.5,'#141a4a');g.addColorStop(0.85,'#3a2a6a');g.addColorStop(1,'#6a3c80');}
 c.fillStyle=g;c.fillRect(0,0,W,H);
 if(name==='sunset'){const sx=520,sy=175;let rg=c.createRadialGradient(sx,sy,10,sx,sy,260);rg.addColorStop(0,'rgba(255,240,180,.9)');rg.addColorStop(0.25,'rgba(255,170,90,.45)');rg.addColorStop(1,'rgba(255,120,90,0)');c.fillStyle=rg;c.fillRect(0,0,W,H);
  rg=c.createLinearGradient(0,sy-80,0,sy+80);rg.addColorStop(0,'#fff6c8');rg.addColorStop(1,'#ff6a3a');c.fillStyle=rg;c.beginPath();c.arc(sx,sy,82,0,6.283);c.fill();
  c.globalCompositeOperation='destination-out';for(let i=0;i<6;i++){c.fillRect(sx-90,sy+18+i*11,180,2+i*0.9);}c.globalCompositeOperation='source-over';
  for(let i=0;i<9;i++){const cx=R()*W,cy=30+R()*130,s=40+R()*90;c.fillStyle=`rgba(255,${150+R()*60|0},${170+R()*40|0},${0.12+R()*0.15})`;
   for(let k=0;k<6;k++){c.beginPath();c.ellipse(cx+(k-3)*s*0.35,cy+Math.sin(k)*6,s*0.5,s*0.14,0,0,6.283);c.fill();}}
  c.strokeStyle='rgba(255,220,200,.25)';c.lineWidth=2;for(let i=0;i<4;i++){c.beginPath();const y=60+i*25;c.moveTo(20+i*60,y);c.lineTo(260+i*80,y-4);c.stroke();}}
 else{for(let i=0;i<160;i++){c.fillStyle=`rgba(255,255,255,${0.3+R()*0.7})`;c.fillRect(R()*W,R()*200,R()<0.1?2:1,R()<0.1?2:1);}
  const mx=600,my=95;let rg=c.createRadialGradient(mx,my,20,mx,my,200);rg.addColorStop(0,'rgba(200,220,255,.55)');rg.addColorStop(1,'rgba(120,140,255,0)');c.fillStyle=rg;c.fillRect(0,0,W,H);
  c.fillStyle='#f4f2ff';c.beginPath();c.arc(mx,my,52,0,6.283);c.fill();c.fillStyle='rgba(180,180,220,.35)';for(const [a,b,r] of [[-15,-10,10],[12,8,14],[-8,22,7],[20,-22,6]]){c.beginPath();c.arc(mx+a,my+b,r,0,6.283);c.fill();}
  for(let i=0;i<5;i++){c.fillStyle='rgba(120,110,190,.18)';c.beginPath();c.ellipse(R()*W,40+R()*120,120,14,0,0,6.283);c.fill();}}
 // far buildings
 c=far.getContext('2d');let x=0;const fc=name==='sunset'?'#7a3a78':'#1e2050',fw=name==='sunset'?'rgba(255,220,140,.55)':'rgba(255,230,150,.75)';
 while(x<LW){const w=30+R()*60,h=(Math.abs(x-560)<140?40:70)+R()*(Math.abs(x-560)<140?60:130);c.fillStyle=fc;c.fillRect(x,260-h,w,h);if(R()<0.3){c.fillRect(x+w/2-1,260-h-20,2,20);}
  c.fillStyle=fw;for(let yy=260-h+8;yy<255;yy+=9)for(let xx=x+4;xx<x+w-4;xx+=7)if(R()<(name==='sunset'?0.18:0.35))c.fillRect(xx,yy,3,4);x+=w+2;}
 g=c.createLinearGradient(0,150,0,260);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,name==='sunset'?'rgba(255,140,120,.45)':'rgba(120,80,200,.35)');c.fillStyle=g;c.fillRect(0,0,LW,260);
 // mid buildings with neon signs
 c=mid.getContext('2d');x=-10;const mc=name==='sunset'?'#3d1a45':'#0e0f2c';
 while(x<LW){const w=60+R()*90,h=(Math.abs(x-560)<160?30:60)+R()*(Math.abs(x-560)<160?45:100);c.fillStyle=mc;c.fillRect(x,260-h,w,h);
  c.fillStyle=name==='sunset'?'#2c1234':'#090a20';c.fillRect(x+w*0.6,260-h-12,w*0.25,12);
  if(R()<0.5){c.fillStyle=mc;c.fillRect(x+10,260-h-22,18,22);c.fillRect(x+8,260-h-6,22,3);}
  c.fillStyle=name==='sunset'?'rgba(255,200,120,.5)':'rgba(255,220,140,.7)';for(let yy=260-h+12;yy<250;yy+=14)for(let xx=x+8;xx<x+w-8;xx+=12)if(R()<0.25)c.fillRect(xx,yy,6,7);
  if(R()<0.55){const nc=['#ff3fa0','#3ff0ff','#ffe03f','#ff6a3f'][(R()*4)|0],sx=x+w-16,sy=260-h+14,sh=40+R()*30;
   c.shadowColor=nc;c.shadowBlur=12;c.fillStyle=nc;c.fillRect(sx,sy,10,sh);c.shadowBlur=0;c.fillStyle=mc;for(let k=0;k<4;k++)c.fillRect(sx+2+(k%2)*3,sy+5+k*sh/4.5,4,sh/8);}
  x+=w+4;}
 // near: poles + wires + sakura
 c=near.getContext('2d');const nc2=name==='sunset'?'#1c0b22':'#05061a';c.fillStyle=nc2;c.strokeStyle=nc2;
 if(name==='sunset'){for(const px of [90,470,820]){c.fillRect(px,20,8,260);c.fillRect(px-22,46,52,5);c.fillRect(px-16,70,40,4);c.fillRect(px+8,90,10,14);}
  c.lineWidth=1.5;for(const yo of [48,52,72]){c.beginPath();c.moveTo(0,yo+10);c.quadraticCurveTo(45,yo+30,94,yo);c.quadraticCurveTo(280,yo+45,474,yo);c.quadraticCurveTo(650,yo+45,824,yo);c.quadraticCurveTo(880,yo+20,LW,yo+12);c.stroke();}}
 else{c.fillRect(640,120,90,110);c.fillRect(650,225,8,40);c.fillRect(712,225,8,40);c.beginPath();c.ellipse(685,120,45,12,0,0,6.283);c.fill();
  c.fillRect(120,40,4,220);c.fillRect(104,60,36,3);c.fillStyle='#ff2a3a';c.shadowColor='#f23';c.shadowBlur=10;c.beginPath();c.arc(122,38,3,0,6.283);c.fill();c.shadowBlur=0;}
 // sakura tree at left
 c.fillStyle=nc2;c.beginPath();c.moveTo(20,280);c.lineTo(34,140);c.lineTo(60,100);c.lineTo(40,150);c.lineTo(44,280);c.fill();
 c.lineWidth=5;c.beginPath();c.moveTo(36,150);c.lineTo(-10,100);c.moveTo(45,130);c.lineTo(110,90);c.stroke();
 for(let i=0;i<70;i++){const a=R()*6.283,d=R()*70;c.fillStyle=`rgba(${240+R()*15|0},${140+R()*60|0},${180+R()*40|0},${name==='sunset'?0.85:0.6})`;c.beginPath();c.arc(45+Math.cos(a)*d*1.3,90+Math.sin(a)*d*0.6,6+R()*10,0,6.283);c.fill();}
 // floor
 c=floor.getContext('2d');const FT=222;
 if(name==='sunset'){g=c.createLinearGradient(0,FT,0,H);g.addColorStop(0,'#5a3060');g.addColorStop(0.15,'#4a2752');g.addColorStop(1,'#1e1028');c.fillStyle=g;c.fillRect(0,FT,W,H-FT);
  c.fillStyle='#8a5070';c.fillRect(0,FT,W,10);c.fillStyle='#2a1230';c.fillRect(0,FT+10,W,4);
  const rg=c.createRadialGradient(520,FT+30,10,520,FT+60,300);rg.addColorStop(0,'rgba(255,170,110,.45)');rg.addColorStop(1,'rgba(255,120,120,0)');c.fillStyle=rg;c.fillRect(0,FT,W,H-FT);
  c.strokeStyle='rgba(255,210,180,.12)';c.lineWidth=1;for(let i=-12;i<=12;i++){c.beginPath();c.moveTo(W/2+i*20,FT+14);c.lineTo(W/2+i*120,H);c.stroke();}
  for(let z=GROUND_TOP;z<=GROUND_BOT;z+=36){const k=(z-FT)/(H-FT);c.strokeStyle=`rgba(255,240,220,${0.15+k*0.25})`;c.lineWidth=1+k*2;c.setLineDash([24+k*30,18+k*20]);c.beginPath();c.moveTo(0,z);c.lineTo(W,z);c.stroke();}
  c.setLineDash([]);c.fillStyle='rgba(255,235,225,.28)';for(let i=0;i<8;i++){c.fillRect(300+i*26,GROUND_TOP+60,14,40);}
 }else{g=c.createLinearGradient(0,FT,0,H);g.addColorStop(0,'#3a3a5c');g.addColorStop(1,'#15152a');c.fillStyle=g;c.fillRect(0,FT,W,H-FT);
  c.strokeStyle='rgba(180,180,255,.12)';c.lineWidth=1;for(let i=-14;i<=14;i++){c.beginPath();c.moveTo(W/2+i*24,FT);c.lineTo(W/2+i*110,H);c.stroke();}
  for(let z=GROUND_TOP;z<=GROUND_BOT;z+=36){const k=(z-FT)/(H-FT);c.strokeStyle=`rgba(150,200,255,${0.15+k*0.3})`;c.lineWidth=1+k*2;c.beginPath();c.moveTo(0,z);c.lineTo(W,z);c.stroke();}
  c.strokeStyle='#8a8ab8';c.lineWidth=3;c.beginPath();c.moveTo(0,FT-22);c.lineTo(W,FT-22);c.stroke();c.lineWidth=2;for(let xx=0;xx<W;xx+=40){c.beginPath();c.moveTo(xx,FT-22);c.lineTo(xx,FT+2);c.stroke();}
  c.fillStyle='#55557a';c.fillRect(0,FT,W,5);c.fillStyle='rgba(255,60,140,.6)';c.fillRect(0,FT+5,W,2);}
 STG[name]={sky,far,mid,near,floor};return STG[name];}
const PET=[];function initPetals(){for(let i=0;i<46;i++)PET.push({x:Math.random()*W,y:Math.random()*H,s:2+Math.random()*3,v:0.4+Math.random()*0.8,ph:Math.random()*6.28,r:Math.random()*6});}
function drawStageProc(c,cam){const st=STG[stage]||buildStage(stage);di(c,st.sky,0,0);
 di(c,st.far,-60-cam*0.15,0);di(c,st.mid,-60-cam*0.3,10);di(c,st.near,-60-cam*0.55,-40);di(c,st.floor,0,0);}
function drawPetalsProc(c){if(!PET.length)initPetals();c.fillStyle=stage==='sunset'?'#ffc0d8':'#f6c6e6';
 for(const p of PET){p.ph+=0.03;p.x+=-0.6-p.v*0.6+Math.sin(p.ph)*0.5;p.y+=p.v;p.r+=0.03;if(p.y>H+10||p.x<-10){p.y=-10;p.x=Math.random()*W*1.3;}
  c.save();c.translate(p.x,p.y);c.rotate(p.r);c.scale(1,Math.abs(Math.sin(p.ph))*0.7+0.3);c.beginPath();c.ellipse(0,0,p.s*1.6,p.s,0,0,6.283);c.fill();c.restore();}}

// ---------- effects ----------
function starburst(c,x,y,r1,r2,n,rot,fill,stroke){c.beginPath();for(let i=0;i<n*2;i++){const a=rot+i*Math.PI/n,r=i%2?r2:r1*(0.85+((i*7)%5)*0.06);c.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);}c.closePath();c.fillStyle=fill;c.fill();if(stroke){c.lineWidth=3;c.strokeStyle=stroke;c.stroke();}}
function mangaText(c,txt,x,y,size,c1,c2,skew){c.save();c.translate(x,y);c.transform(1,0,skew||-0.2,1,0,0);c.font=`900 italic ${size}px Impact,"Arial Black","Segoe UI Black",sans-serif`;c.textAlign='center';c.textBaseline='middle';
 c.lineJoin='round';c.lineWidth=size*0.22;c.strokeStyle='#000';c.strokeText(txt,0,0);c.lineWidth=size*0.1;c.strokeStyle='#fff';c.strokeText(txt,0,0);
 const g=c.createLinearGradient(0,-size/2,0,size/2);g.addColorStop(0,c1);g.addColorStop(1,c2);c.fillStyle=g;c.fillText(txt,0,0);c.restore();}
function speedLines(c,f){const n=6;c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=2;c.beginPath();
 for(let i=0;i<n;i++){const y=f.z+f.y-15-((i*23+rt*3)%80),l=30+((i*37+rt*5)%40),x0=f.x-f.dir*(22+((i*13+rt*7)%30));c.moveTo(x0,y);c.lineTo(x0-f.dir*l,y);}c.stroke();}
function iceSpike(c,x,y,h,s,a){c.globalAlpha=a;c.beginPath();c.moveTo(x-9,y);c.lineTo(x+s*h,y-h);c.lineTo(x+9,y);c.closePath();
 const g=c.createLinearGradient(x,y-h,x,y);g.addColorStop(0,'#ffffff');g.addColorStop(0.5,'#9fe6ff');g.addColorStop(1,'#2a7fd0');c.fillStyle=g;c.fill();c.lineWidth=2;c.strokeStyle='#0c2a55';c.stroke();
 c.beginPath();c.moveTo(x+s*h*0.9,y-h*0.9);c.lineTo(x-2,y-2);c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=1.5;c.stroke();c.globalAlpha=1;}
function drawFxWorld(c){for(const e of fx){const k=e.t/e.max;
 if(e.k==='burst'){const s=(e.big?1.4:1)*(0.6+(1-k)*0.8);const x=e.x,y=e.z+e.y;c.globalAlpha=Math.min(1,k*2);
  starburst(c,x,y,46*s,18*s,12,e.rot,e.c,'#000');starburst(c,x,y,30*s,12*s,10,e.rot+0.3,'#fff6b0',null);starburst(c,x,y,16*s,7*s,8,e.rot,'#fff',null);
  if(e.word)mangaText(c,e.word,x+10,y-48,26+(1-k)*8,'#fff27a','#ff5a1f',-0.25);c.globalAlpha=1;}
 else if(e.k==='spark'){c.strokeStyle=e.c;c.lineWidth=3*e.t/e.max+1;c.beginPath();c.moveTo(e.x,e.z+e.y);c.lineTo(e.x-e.vx*2.5,e.z+e.y-e.vy*2.5);c.stroke();}
 else if(e.k==='guard'){c.strokeStyle=`rgba(190,240,255,${k})`;c.lineWidth=4;c.beginPath();c.arc(e.x,e.z+e.y,18+(1-k)*20,-1.3,1.3);c.stroke();}
 else if(e.k==='shard'){const g=e.t>e.max-5?(e.max-e.t)/5:Math.min(1,e.t/8);iceSpike(c,e.x,e.z,e.h*g,e.s,Math.min(1,e.t/8));}
 else if(e.k==='ring'){c.strokeStyle=`rgba(200,245,255,${k})`;c.lineWidth=6*k+1;c.beginPath();c.ellipse(e.x,e.z,(1-k)*160+20,((1-k)*160+20)*0.25,0,0,6.283);c.stroke();}
 else if(e.k==='cast'){const x=e.x,y=e.z-40,r=(1-k)*90;c.globalCompositeOperation='lighter';c.strokeStyle=e.c;c.globalAlpha=k;c.lineWidth=5;c.beginPath();c.arc(x,y,r,0,6.283);c.stroke();
  c.lineWidth=2;c.beginPath();for(let i=0;i<14;i++){const a=i*0.45+rt*0.02;c.moveTo(x+Math.cos(a)*r*1.2,y+Math.sin(a)*r*1.2);c.lineTo(x+Math.cos(a)*(r*1.2+30),y+Math.sin(a)*(r*1.2+30));}c.stroke();c.globalAlpha=1;c.globalCompositeOperation='source-over';}}}
function drawFxTop(c){for(const e of fx){const k=e.t/e.max;
 if(e.k==='num'){const y=e.z+e.y-(1-k)*30-(k>0.85?(k-0.85)*-60:0);const sc=k>0.85?1+(k-0.85)*5:1;c.globalAlpha=Math.min(1,k*3);
  mangaText(c,e.txt,e.x,y,(e.big?30:22)*sc,e.c,e.big?'#ff6a00':'#ffd0a0',-0.2);c.globalAlpha=1;}}}
function bar(c,x,y,w,h,frac,lag,cols,flip){const sk=10;const X=flip?x+w:x,d=flip?-1:1;
 const path=(f)=>{c.beginPath();c.moveTo(X,y);c.lineTo(X+d*w*f,y);c.lineTo(X+d*(w*f-sk),y+h);c.lineTo(X-d*sk,y+h);c.closePath();};
 path(1);c.fillStyle='rgba(0,0,0,.65)';c.fill();
 if(lag>frac){path(lag);c.fillStyle='#fff';c.fill();}
 if(frac>0){path(frac);const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,cols[0]);g.addColorStop(1,cols[1]);c.fillStyle=g;c.fill();
  c.fillStyle='rgba(255,255,255,.35)';c.fillRect(flip?X-w*frac:X,y+1,w*frac,h*0.3);}
 path(1);c.lineWidth=2.5;c.strokeStyle='#000';c.stroke();}
// ---------- art-pack stages (REA Lab lb-art.js) ----------
const ART={};let artReady=false;
function artStage(name){if(!ART[name])ART[name]=LBArt.createStage(name);return ART[name];}
function isArt(){return stage.indexOf('art_')===0;}
let lastCam=0,lastT=0;
function drawStage(c,cam){if(isArt()&&artReady){const st=artStage(stage.slice(4));const now=rt/60;st.update(Math.min(0.05,now-lastT||0.016),cam);lastT=now;st.draw(c,W,H,cam);lastCam=cam;}else drawStageProc(c,cam);}
function drawStageFore(c){if(isArt()&&artReady)artStage(stage.slice(4)).drawForeground(c,W,H,lastCam);}
function drawPetals(c){if(!isArt())drawPetalsProc(c);}
function stageName(){return {sunset:'Sunset Street',night:'Night Rooftop',art_sunset:'Sunset Street (painted)',art_night:'Night Rooftop (painted)'}[stage]||stage;}
// ---------- fighters ----------
const FS=1.3; // fighter draw scale (pack art is ~92px; scaled up for presence)
function lerp(a,b,k){return a+(b-a)*k;}
function specOf(f){for(const s of specials)if(s.owner===f&&s.id===f.spId)return s;return null;}
function animState(f){ // -> [packState, phase 0..1]
 if(f.hp<=0||f.state==='down')return['hurt',0];
 if(f.state==='hurt')return['hurt',0];
 if(f.getup>0)return['getup',0];
 if(f.state==='block')return['block',0];
 if(f.state==='attack'){
  if(f.move==='sp'){const id=f.spId,s=specOf(f),p=s?s.t/s.dur:0,cast=f.castT>0;
   switch(id){case 'quake_stomp':return[cast?'stomp':'slam',0];case 'solar_rise':return[cast?'slam':'rise',0];
    case 'supernova_rush':return cast?['ultimate',0]:p<0.5?[((rt>>2)&1)?'punch':'kick',1]:['slam',0];
    case 'avalanche_grab':return[p<0.45?'dash':'slam',0];case 'titan_fall':return[cast?'ultimate':'slam',0];
    case 'eclipse_blizzard':return['ultimate',0];default:return[cast?'stomp':'special',0];}}
  const fr=MOVES[f.move]||[],tot=fr.reduce((a,b)=>a+b.w,0);let el=0;for(let i=0;i<f.fi;i++)el+=fr[i].w;el+=(fr[f.fi]?fr[f.fi].w:0)-f.ft;const ph=tot?el/tot:1;
  if(f.move==='dash')return['dash',ph];if(f.move==='air')return['kick',1];if(f.move==='kick')return['kick',ph];return['punch',ph];}
 if(f.y<-1)return['jump',f.vy<-3?0.2:f.vy<3?0.5:0.8];
 if(f.state==='run')return['run',0];if(f.state==='walk')return['walk',0];return['idle',0];}
// ---------- painted sprites (sprites.js). game state -> atlas pose ----------
const SPIDX={};for(const id in ROSTER)(ROSTER[id].sp||[]).forEach((m,i)=>SPIDX[m]=i);
function spritePose(f,st,ph){
 if(f.hp<=0||(f.kd&&(f.state==='hurt'||f.state==='down')&&f.y>-6))return 'ko';
 if(mode==='over'&&f.hp>0)return 'victory';
 if(f.state==='hurt'||st==='hurt')return 'hurt';
 if(st==='getup')return 'jump_down';
 if(st==='block')return 'block';
 if(f.move==='sp'){const i=SPIDX[f.spId]||0;if(f.castT>0)return i===2?'ult':'sp1a';
  if(f.spId==='supernova_rush')return (((nowTick()|0)>>2)&1)?'punch2':'kick2';
  if(f.spId==='canopy_crash')return f.y<-10?'jump_up':'sp2';
  return i===0?'sp1b':i===1?'sp2':'ult';}
 if(st==='punch'||st==='dash')return ph<0.34?'punch1':'punch2';
 if(st==='kick')return f.move==='air'?'kick2':ph<0.34?'kick1':'kick2';
 if(st==='jump')return f.vy<0?'jump_up':'jump_down';
 if(st==='run')return 'run';
 if(st==='walk'){const c=((f.x+f.z*0.7+1000)/(13*f.s.big))|0; return ['walk1','idle','walk2','idle'][c&3];} // walk pose follows distance walked
 return 'idle';}
const SPO={sx:1,sy:1,rot:0,alpha:1,tint:null,ta:0}; // reused draw options (no per-frame allocation)
// (anim fix) pose state machine: wall-clock 60Hz ticks (not render frames, so 144Hz screens time the same),
// minimum hold per pose so poses never flash for a single frame, no cross-fade (double images); instead a
// short eased squash/lean "settle" on each pose change, phase-keyed anticipation/strike/recovery lean.
const LOCO={idle:1,walk1:1,walk2:1,run:1,jump_down:1};
const HOLD={hurt:8,block:4,punch1:3,kick1:3,punch2:4,kick2:4,jump_up:4,jump_down:4,idle:4,walk1:4,walk2:4,run:4};
const URGENT={hurt:1,ko:1,victory:1};
function nowTick(){return (typeof performance!=='undefined'?performance.now():Date.now())/16.667;}
function drawSprite(c,f,ghost,st,ph){const id=f.type,want=spritePose(f,st,ph),A=f.anim,T=nowTick();
 if(!A.pose){A.pose=want;A.t0=T;}
 if(!ghost&&want!==A.pose){const held=T-A.t0;
  // attacks/specials start at once (input feel); falling back to locomotion waits out the hold
  if(URGENT[want]||(!LOCO[want]&&A.pose!=='hurt')||held>=(HOLD[A.pose]||3)){A.prev=A.pose;A.pose=want;A.t0=T;}}
 const pose=A.pose,age=T-A.t0;
 let sx=1,sy=1,rot=0,oy=0;const t=T+(f===E?37:0),fd=f.dir;
 if(pose==='idle'||pose==='victory'){const b=Math.sin(t*0.06);sy=1+b*0.012;sx=1-b*0.008;}
 if(pose==='run'){rot=0.05*fd;const b=Math.sin(t*0.4);sy=1+b*0.03;oy=-Math.abs(b)*1.5;}
 if(pose==='walk1'||pose==='walk2'||(pose==='idle'&&st==='walk')){const b=Math.abs(Math.sin(t*0.2));sy=1-b*0.02;oy=-b*1.2;rot=0.015*fd;}
 // anticipation (lean back) -> strike (stretch forward) -> recovery (ease to neutral), ±4% / ±3°
 if(pose==='punch1'||pose==='kick1'){const k=Math.min(1,age/4);rot=-0.04*fd*k;sx=1-0.03*k;sy=1+0.02*k;}
 if(pose==='punch2'||pose==='kick2'){const k=Math.max(0,1-age/8),e=k*k*(3-2*k);rot=0.045*fd*e;sx=1+0.04*e;sy=1-0.035*e;}
 if(pose==='jump_up'){sx=0.96;sy=1.04;}
 if(pose==='jump_down'){sx=1.0;sy=1.0;}
 // settle pulse on every pose change: tiny ease-out squash, hides the pose swap
 if(age<6&&A.prev&&A.prev!==pose){const k=1-age/6,e=k*k;sx*=1+0.03*e;sy*=1-0.03*e;}
 if(f.land>0){sx*=1+f.land*0.012;sy*=1-f.land*0.016;}
 let shx=0;if(pose==='hurt'&&f.stun>0)shx=Math.sin(t*1.7)*2.5;
 A.tilt=lerp(A.tilt||0,pose==='hurt'?-0.06*fd:0,0.25);rot+=A.tilt;
 SPO.sx=sx;SPO.sy=sy;SPO.rot=rot;SPO.tint=null;SPO.ta=0;SPO.alpha=1;
 if(!ghost){if(f.flash>0){SPO.tint='white';SPO.ta=f.flash/5*0.85;}else if(f.frozen>0){SPO.tint='ice';SPO.ta=0.45*Math.min(1,f.frozen/20);}else if(f.burn){SPO.tint='burn';SPO.ta=0.18+0.12*Math.sin(rt*0.5);}}
 const x=f.x+shx,y=f.z+f.y+oy;
 LBS.draw(c,id,pose,x,y,f.dir,SPO);}
function shadowAt(c,f){const w=(f.s.giant?62:30)*(1+f.y/400),a=0.35*(1+f.y/300);if(a<=0)return;c.globalAlpha=a;c.fillStyle='#000';c.beginPath();c.ellipse(f.x,f.z+2,Math.max(8,w),Math.max(3,w*0.22),0,0,6.283);c.fill();c.globalAlpha=1;}
function drawOne(c,f,ghost){const [st,ph]=animState(f);if(!f.anim)f.anim={};
 if(typeof LBS!=='undefined'&&LBS.has(f.type)){if(!ghost)shadowAt(c,f);drawSprite(c,f,ghost,st,ph);drawOneFx(c,f,ghost,ph);return;}
 drawOneCode(c,f,ghost,st,ph);}
function drawOneCode(c,f,ghost,st,ph){if(!f.anim)f.anim={};f.anim.ph=ph;f.anim.k=ghost?0:(st==='punch'||st==='kick'?0.55:0.32);
 const lying=f.kd&&(f.state==='hurt'||f.state==='down')&&f.y>-6;f.rot=lerp(f.rot||0,lying?-Math.PI/2*f.dir:0,0.25);
 c.save();c.translate(f.x,f.z+f.y);if(f.rot)c.rotate(f.rot);c.scale(FS,FS);
 if(!ghost&&f.land>0)c.scale(1+f.land*0.012,1-f.land*0.015);
 LBC.drawFighter(c,f.type,st,0,0,f.dir,rt+(f===E?40:0),ghost?{ph,k:1,p:null}:f.anim);
 if(!ghost&&f.flash>0){c.globalCompositeOperation='lighter';c.globalAlpha=0.6;LBC.drawFighter(c,f.type,st,0,0,f.dir,rt,{ph,k:0,p:Object.assign({},f.anim.p)});c.globalAlpha=1;c.globalCompositeOperation='source-over';}
 c.restore();
 // smear arc on strike frames
 if(!ghost&&f.state==='attack'&&(f.move==='punch'||f.move==='kick'||f.move==='dash'||f.move==='air')&&ph>0.3&&ph<0.7){const kick=f.move!=='punch'&&f.move!=='dash';
  const b=f.s.big,cx=f.x+f.dir*(kick?28:20)*FS*b,cy=f.z+f.y-(kick?40:60)*FS*b,col=f.s.color;
  c.save();c.translate(cx,cy);c.scale(f.dir*b,b);c.globalCompositeOperation='lighter';
  for(let i=0;i<3;i++){c.strokeStyle=i?col:'#fff';c.globalAlpha=0.7-i*0.2;c.lineWidth=(8-i*2.5);c.beginPath();c.arc(-6,kick?6:4,(kick?38:30)+i*4,kick?-1.3:-0.7,kick?0.5:0.5);c.stroke();}
  c.restore();}
 drawOneFx(c,f,ghost,ph,true);}
function drawOneFx(c,f,ghost,ph,code){
 if(!ghost&&code&&f.frozen>0){const a=Math.min(1,f.frozen/20);c.save();c.globalAlpha=0.45*a;const g=c.createLinearGradient(0,f.z+f.y-120,0,f.z+f.y);g.addColorStop(0,'#e8fbff');g.addColorStop(1,'#5ac8ff');
  c.fillStyle=g;c.strokeStyle='#dff';c.lineWidth=2;c.beginPath();const x=f.x,y=f.z+f.y;c.moveTo(x-28,y);c.lineTo(x-34,y-70);c.lineTo(x-18,y-128);c.lineTo(x+14,y-136);c.lineTo(x+32,y-90);c.lineTo(x+28,y);c.closePath();c.fill();c.globalAlpha=0.9*a;c.stroke();
  c.beginPath();c.moveTo(x-14,y-110);c.lineTo(x-4,y-60);c.moveTo(x+12,y-120);c.lineTo(x+18,y-80);c.strokeStyle='rgba(255,255,255,.8)';c.stroke();c.restore();}
 if(!ghost&&f.burn){c.save();c.globalCompositeOperation='lighter';for(let i=0;i<5;i++){const ph2=((rt*0.05+i*0.21)%1),x=f.x+Math.sin(i*2.1+rt*0.1)*14,y=f.z+f.y-20-ph2*90;
  c.fillStyle=`rgba(255,${120+i*20},30,${0.55*(1-ph2)})`;c.beginPath();c.ellipse(x,y,6*(1-ph2)+2,11*(1-ph2)+3,0,0,6.283);c.fill();}c.restore();}}
// ---------- effects specific to the roster ----------
const BEHIND={eclipse_blizzard:1,frost_lance:1,quake_stomp:1};
function drawSpecials(c,behind){for(const s of specials){if(!!BEHIND[s.id]!==behind)continue;LBC.drawSpecial(c,s.id,s.t/s.dur,s.x,s.z,s.dir);}}
function drawFxExtra(c){for(const e of fx){const k=e.t/e.max;
 if(e.k==='ember'){c.fillStyle=`rgba(255,160,40,${k})`;c.beginPath();c.arc(e.x,e.z+e.y,2+k*2,0,6.283);c.fill();}
 else if(e.k==='mname'){c.globalAlpha=Math.min(1,k*3);mangaText(c,e.txt,e.x,e.z+e.y-(1-k)*14,20,'#fff',e.c,-0.2);c.globalAlpha=1;}}}
const AURA={};function auraTex(col){if(AURA[col])return AURA[col];const cv=mkCanvas(62,100),g=cv.getContext('2d'),rg=g.createRadialGradient(31,50,3,31,50,46);rg.addColorStop(0,col+'aa');rg.addColorStop(0.6,col+'44');rg.addColorStop(1,col+'00');g.setTransform(SC*0.5,0,0,SC,0,0);g.fillStyle=rg;g.fillRect(0,0,124,100);return AURA[col]=cv;}
function aura(c,f){const col=f.s.color;const x=f.x,y=f.z+f.y-55;c.globalCompositeOperation='lighter';
 const b=f.s.big,g=auraTex(col);c.drawImage(g,x-62*b,y-100*b-(b-1)*40,124*b,200*b);
 c.strokeStyle=col;c.lineWidth=2;c.beginPath();for(let i=0;i<10;i++){const xx=x-34+((i*17+rt*3)%68),yy=f.z-((i*31+rt*6)%130);c.moveTo(xx,yy);c.lineTo(xx,yy-16);}c.stroke();c.globalCompositeOperation='source-over';}
function drawCutins(c){for(const e of fx){if(e.k!=='cutin')continue;e.r=(e.r||0)+1;const k=e.t/e.max,ent=Math.min(1,e.r/10),a=Math.min(1,k*4);
 c.save();c.globalAlpha=a;const y=H/2-20,dir=e.left?1:-1;
 c.fillStyle='rgba(0,0,0,.55)';c.fillRect(0,0,W,H);
 c.translate(W/2+(1-ent)*-dir*W,y);c.transform(1,0,-0.25,1,0,0);
 const g=c.createLinearGradient(-W/2,0,W/2,0);g.addColorStop(0,e.c+'00');g.addColorStop(0.2,e.c);g.addColorStop(0.8,e.c);g.addColorStop(1,e.c+'00');c.fillStyle=g;c.fillRect(-W/2-60,-62,W+120,124);
 c.fillStyle='rgba(0,0,0,.6)';c.fillRect(-W/2-60,-50,W+120,100);
 c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=2;c.beginPath();for(let i=0;i<14;i++){const yy=-48+((i*13+e.r*9)%96);c.moveTo(-W/2-60,yy);c.lineTo(W/2+60,yy);}c.stroke();c.restore();
 c.save();c.globalAlpha=a;c.translate(W/2-dir*230+(1-ent)*-dir*W,y+8);
 if(!(typeof LBS!=='undefined'&&LBS.face(c,e.who,0,-10,130,120,dir<0))){const hd=LBC.head&&LBC.head(LBC.byId[e.who],0);if(hd){c.scale(-dir*-1,1);c.drawImage(hd,-60,-70,120,120);}}c.restore();
 c.save();c.globalAlpha=a;mangaText(c,e.name.toUpperCase(),W/2+dir*60+(1-ent)*dir*W,y,44,'#fff',e.c,-0.25);mangaText(c,'ULTIMATE',W/2+dir*60,y-48,20,'#fff36a','#ff3a1a',-0.2);c.restore();}}
// ---------- HUD ----------
const PBG={};function portraitBg(type){if(PBG[type])return PBG[type];const pal=ROSTER[type].pal,cv=mkCanvas(1,62),g=cv.getContext('2d'),gr=g.createLinearGradient(0,0,0,62);gr.addColorStop(0,pal.aura);gr.addColorStop(1,pal.outfitShade||pal.line||'#222');g.fillStyle=gr;g.fillRect(0,0,1,62);const pat=document.createElement('canvas').getContext('2d').createPattern(cv,'repeat-x');const m=new DOMMatrix();pat.setTransform(m.translate(0,-30).scale(1/SC));return PBG[type]=pat;}
function portrait(c,type,x,y,flip,hurt){const pal=ROSTER[type].pal;c.save();c.translate(x,y);
 c.beginPath();c.moveTo(-34,-30);c.lineTo(40,-30);c.lineTo(30,32);c.lineTo(-44,32);c.closePath();
 c.fillStyle=portraitBg(type);c.fill();
 c.save();c.clip();if(hurt&&(rt>>3)&1)c.translate(2,0);if(!(typeof LBS!=='undefined'&&LBS.face(c,type,0,4,80,64,flip))){const hd=LBC.head&&LBC.head(LBC.byId[type],hurt&&(rt>>3)&1);if(hd){c.scale(flip?-1:1,1);c.drawImage(hd,-46,-48,96,96);}}c.restore();
 c.lineWidth=4;c.strokeStyle='#000';c.stroke();c.lineWidth=2;c.strokeStyle='#fff';c.stroke();c.restore();}
function hudSide(c,f,left,label){f.hpLag=Math.max(f.hp,f.hpLag-(f.hpLag>f.hp?2.2:0));const fr=f.hp/f.s.hp,lag=f.hpLag/f.s.hp;
 const bx=left?78:W-78-300;
 portrait(c,f.type,left?44:W-44,40,!left,f.state==='hurt'||f.hp<=0);
 bar(c,bx,16,300,20,fr,lag,fr>0.3?['#fff36a','#ff9a1a']:['#ff7a7a','#d01818'],!left);
 const ult=f.mp>=ULT_COST;bar(c,left?bx-6:bx+6+90,40,210,9,f.mp/f.s.mpMax,0,ult?['#fff','#ffd040']:['#7ff6ff','#2a6bff'],!left);
 c.save();c.font='900 italic 18px Impact,"Arial Black",sans-serif';c.textAlign=left?'left':'right';c.lineWidth=4;c.strokeStyle='#000';
 const tx=left?bx+4:bx+296;c.strokeText(label,tx,68);c.fillStyle=f.s.color;c.fillText(label,tx,68);
 c.font='bold 11px sans-serif';c.fillStyle='#fff';c.strokeText(Math.ceil(f.hp)+' HP',left?bx+20:bx+280,31);c.fillText(Math.ceil(f.hp)+' HP',left?bx+20:bx+280,31);
 const mpx=left?bx+210:bx+96;c.textAlign=left?'left':'right';const ms=Math.floor(f.mp)+' MP'+(ult?'  ULT READY!':'');c.strokeText(ms,tx,86);c.fillStyle=ult?'#ffe66a':'#bfefff';c.fillText(ms,tx,86);c.restore();
 if(f.combo>=2&&f.comboT>0){const a=Math.min(1,f.comboT/20);c.globalAlpha=a;const cx=left?110:W-110;mangaText(c,f.combo+'',cx,140,52+(f.comboT>48?(f.comboT-48)*3:0),'#fff36a','#ff3a1a',-0.2);mangaText(c,'HITS!',cx+(left?62:-62),150,24,'#fff','#ffc0a0',-0.2);c.globalAlpha=1;}}
// ---------- screens ----------
const HPOSE={idle:'idle',special:'victory',ult:'ult'};
function heroAt(c,id,x,y,s,dir,state){if(typeof LBS!=='undefined'&&LBS.has(id)){const b=Math.sin((rt+id.length*13)*0.06);SPO.sx=s*(1-b*0.008);SPO.sy=s*(1+b*0.012);SPO.rot=0;SPO.tint=null;SPO.ta=0;SPO.alpha=1;
  c.globalAlpha*=0.3;c.fillStyle='#000';c.beginPath();c.ellipse(x,y+2,(ROSTER[id].giant?60:30)*s,8*s,0,0,6.283);c.fill();c.globalAlpha/=0.3;LBS.draw(c,id,HPOSE[state]||state||'idle',x,y,dir,SPO);return;}
 const d=HERO[id]||(HERO[id]={});c.save();c.translate(x,y);c.scale(s,s);LBC.drawFighter(c,id,state||'idle',0,0,dir,rt+id.length*13,d);c.restore();}
const HERO={};
function drawTitle(c){drawStage(c,0);drawPetals(c);
 c.fillStyle='rgba(10,0,25,.35)';c.fillRect(0,0,W,H);
 c.save();c.translate(W/2,150);c.globalCompositeOperation='lighter';c.strokeStyle='rgba(255,220,160,.25)';c.lineWidth=3;c.beginPath();
 for(let i=0;i<48;i++){const a=i*Math.PI/24+rt*0.002;c.moveTo(Math.cos(a)*120,Math.sin(a)*60);c.lineTo(Math.cos(a)*600,Math.sin(a)*300);}c.stroke();c.restore();c.globalCompositeOperation='source-over';
 starburst(c,W/2,150,250,150,18,rt*0.003,'rgba(255,60,40,.85)','#000');
 if(ROSTER.gorgath&&typeof LBS!=='undefined'&&LBS.has('gorgath')){heroAt(c,'gorgath',90,445,1.25,1,'idle');heroAt(c,'bruntusk',715,445,1.25,-1,'idle');heroAt(c,'ryn',215,445,1.7,1,'idle');heroAt(c,'lysa',585,445,1.7,-1,'idle');heroAt(c,'gorran',330,445,1.45,1,'idle');heroAt(c,'mireya',470,445,1.7,-1,'idle');}
 else{heroAt(c,'gorran',W/2,440,2.0,1,'idle');heroAt(c,'ryn',130,440,2.3,1,'idle');heroAt(c,'mireya',670,440,2.3,-1,'idle');}
 const bob=Math.sin(rt*0.05)*3;
 mangaText(c,'LANE',W/2-10,108+bob,84,'#fff7a0','#ff8a1a',-0.25);
 mangaText(c,'BRAWLERS',W/2+10,188+bob,92,'#ffffff','#5ad0ff',-0.25);
 mangaText(c,'SUN · MOON · MOUNTAIN · BEASTS · FROST',W/2,240,20,'#fff','#ffc070',-0.2);
 {c.globalAlpha=0.55+0.45*Math.sin(rt*0.1);c.font='bold 22px sans-serif';c.textAlign='center';c.lineWidth=5;c.strokeStyle='#000';c.strokeText('PRESS ENTER',W/2,300);c.fillStyle='#fff';c.fillText("PRESS ENTER",W/2,300);c.globalAlpha=1;}
 c.font='bold 13px sans-serif';c.textAlign='center';c.lineWidth=4;c.strokeStyle='#000';const t='B: stage ('+stageName()+')';c.strokeText(t,W/2,326);c.fillStyle='#ffe';c.fillText(t,W/2,326);}
function txt(c,s,x,y,col,font,align){c.font=font||'bold 12px sans-serif';c.textAlign=align||'center';c.lineWidth=3;c.strokeStyle='rgba(0,0,0,.85)';c.strokeText(s,x,y);c.fillStyle=col||'#fff';c.fillText(s,x,y);}
function drawSelect(c){drawStage(c,0);drawPetals(c);c.fillStyle='rgba(10,0,25,.6)';c.fillRect(0,0,W,H);
 mangaText(c,'CHOOSE YOUR FIGHTER',W/2,26,28,'#fff','#ffd060',-0.2);
 // [PACK2] six fighters: portrait strip on top, big painted hero on the left, move list on the right
 ORDER.forEach((id,n)=>{const R=ROSTER[id],x=W/2+(n-(ORDER.length-1)/2)*96,y=72,sel=pick===id,cpu=pick2===id;
  c.save();c.translate(x,y);c.transform(1,0,-0.15,1,0,0);c.fillStyle=sel?R.color+'66':'rgba(0,0,0,.5)';c.fillRect(-42,-28,84,56);c.beginPath();c.rect(-42,-28,84,56);c.save();c.clip();c.transform(1,0,0.15,1,0,0);
  if(!(typeof LBS!=='undefined'&&LBS.face(c,id,0,6,84,60,false)))heroAt(c,id,0,60,0.6,1,'idle');c.restore();
  c.lineWidth=sel?4:2;c.strokeStyle=sel?'#fff':cpu?'#ff6a6a':'#555';c.strokeRect(-42,-28,84,56);c.restore();
  txt(c,(n+1)+' '+R.short.replace(',','').toUpperCase(),x,y+44,sel?'#fff':R.color,'bold 11px sans-serif');
  if(sel)txt(c,'P1',x-34,y-32,'#7fe0ff','900 italic 14px Impact,sans-serif');if(cpu)txt(c,'CPU',x+30,y-32,'#ff8080','900 italic 14px Impact,sans-serif');});
 const R=ROSTER[pick],col=R.color;
 c.globalCompositeOperation='lighter';c.drawImage(auraTex(col),40,150,260,300);c.globalCompositeOperation='source-over';
 const big=R.giant?1.05:1.75;heroAt(c,pick,175,418,big,1,(rt%240)<150?'idle':'victory');
 mangaText(c,R.name.replace(/, the .*/,'').toUpperCase(),175,140,R.name.length>16?22:28,'#fff',col,-0.2);
 txt(c,R.dynasty,175,160,'#ffd','bold 11px sans-serif');
 c.fillStyle='rgba(0,0,0,.6)';c.fillRect(340,130,W-360,250);c.strokeStyle=col;c.lineWidth=2;c.strokeRect(340,130,W-360,250);
 txt(c,'MOVE LIST',350+(W-380)/2,150,col,'900 italic 16px Impact,"Arial Black",sans-serif');
 txt(c,R.role+'  ·  HP '+R.hp+'  ·  POW x'+R.power,350+(W-380)/2,168,'#fff','11px sans-serif');
 Object.values(R.moves).forEach((m,i)=>{const y=190+i*22;const sp=m.special||m.ultimate;
  txt(c,m.name.replace('ULT: ','★ '),352,y,m.ultimate?'#ffe66a':sp?col:'#fff',(sp?'bold ':'')+'12px sans-serif','left');
  txt(c,m.input+(m.mp?'  ['+m.mp+' MP]':''),540,y,'#cde','11px sans-serif','left');});
 const vs=ROSTER[pick2];txt(c,'CPU: '+vs.name,350+(W-380)/2,372,'#ff9a9a','bold 12px sans-serif');
 const s='1-'+ORDER.length+' pick  ·  C: CPU opponent  ·  B stage: '+stageName()+'  ·  ENTER to fight';txt(c,s,W/2,440,'#fff','bold 14px sans-serif');}
let VIG=null;
let lastDraw=0,camS=null;const SAVE=[[0,0,0],[0,0,0]],LIST=[null,null];
function draw(c,alpha,dtf){rt++;dtf=dtf||1; // dtf = elapsed time in 60Hz frames since last draw
 if(mode==='title'){drawTitle(c);return;}
 if(mode==='select'||!P){drawSelect(c);return;}
 // interpolate positions between fixed 60Hz logic steps
 const save=SAVE;for(let i=0;i<2;i++){const f=i?E:P;save[i][0]=f.x;save[i][1]=f.y;save[i][2]=f.z;if(f.px!=null&&alpha!=null&&!hitstop){f.x=lerp(f.px,f.x,alpha);f.y=lerp(f.py,f.y,alpha);f.z=lerp(f.pz,f.z,alpha);}}
 if(!P.hist){for(const f of[P,E]){f.hist=[];for(let i=0;i<6;i++)f.hist.push({x:f.x,y:f.y,z:f.z,on:false});f.hi=0;}}
 const camT=(P.x+E.x)/2-W/2;if(camS==null||mode!=='fight')camS=camT;camS+=(camT-camS)*(1-Math.pow(0.85,dtf));const cam=camS;
 let zoom=1,zx=W/2,zy=H/2;
 if(ko){const k=Math.min(1,ko.t/40),back=ko.t>85?Math.max(0,1-(ko.t-85)/25):1;zoom=1+0.35*k*back*(mode==='over'?0:1);zx=Math.max(W/2/zoom,Math.min(W-W/2/zoom,ko.who.x));zy=Math.max(H/2/zoom,Math.min(H-H/2/zoom,ko.who.z-50));}
 c.save();
 if(shake>0){const sk=shake*(1+0.5*Math.sin(rt*0.9));c.translate(Math.sin(rt*1.31)*sk*0.5,Math.cos(rt*1.73)*sk*0.5);shake*=Math.pow(0.86,dtf);if(shake<0.5)shake=0;}
 if(zoom!==1){c.translate(W/2,H/2);c.scale(zoom,zoom);c.translate(-zx,-zy);}
 drawStage(c,cam);
 drawSpecials(c,true);
 for(const f of[P,E]){const h=f.hist[f.hi=(f.hi+1)%f.hist.length];h.x=f.x;h.y=f.y;h.z=f.z;h.on=(f.move==='sp'||f.state==='run'||f.move==='dash'||f.move==='air')&&f.hp>0&&!f.hidden;}
 const list=LIST;if(P.z<=E.z){list[0]=P;list[1]=E;}else{list[0]=E;list[1]=P;}
 for(const f of list){if(f.hidden)continue;
  if(f.move==='sp')aura(c,f);
  let any=false;for(const h of f.hist)if(h.on)any=true;
  if(any){const sx=f.x,sy=f.y,sz=f.z;for(let i=1;i<f.hist.length;i+=2){const h=f.hist[(f.hi-i+f.hist.length*4)%f.hist.length];if(!h.on)continue;
   f.x=h.x-f.dir*i*5;f.y=h.y;f.z=h.z;c.globalAlpha=0.3-i*0.045;c.globalCompositeOperation='lighter';drawOne(c,f,true);}
   c.globalAlpha=1;c.globalCompositeOperation='source-over';f.x=sx;f.y=sy;f.z=sz;}
  if(f.state==='run'||(f.state==='attack'&&f.fi===1))speedLines(c,f);
  drawOne(c,f,false);}
 drawSpecials(c,false);
 drawFxWorld(c);drawFxExtra(c);drawStageFore(c);drawPetals(c);drawFxTop(c);
 c.restore();
 if(hitstop>4||flashScr>0){c.fillStyle=`rgba(255,255,255,${flashScr>0?flashScr*0.06:0.06})`;c.fillRect(0,0,W,H);if(flashScr>0)flashScr--;}
 if(!VIG){VIG=mkCanvas(W,H);const v=VIG.getContext('2d');const rg=v.createRadialGradient(W/2,H/2,H*0.4,W/2,H/2,H*0.95);rg.addColorStop(0,'rgba(0,0,0,0)');rg.addColorStop(1,'rgba(0,0,20,.55)');v.fillStyle=rg;v.fillRect(0,0,W,H);}
 di(c,VIG,0,0);
 drawCutins(c);
 hudSide(c,P,true,'P1  '+P.s.short.toUpperCase());hudSide(c,E,false,E.s.short.toUpperCase()+(typeof FLOW!=='undefined'&&FLOW.p2?'  P2':'  CPU')); // FLOW hook: 2P label
 mangaText(c,'VS',W/2,32,30,'#fff36a','#ff3a1a',-0.2);
 for(const e of fx)if(e.k==='banner'){const k=e.t/e.max;const s=k>0.8?1+(k-0.8)*6:1;c.globalAlpha=Math.min(1,k*4);mangaText(c,e.txt,W/2,H/2-30,80*s,'#fff','#ffb020',-0.25);c.globalAlpha=1;}
 if(ko&&mode==='over'){mangaText(c,'K.O.!',W/2,130,80,'#fff36a','#ff2a10',-0.3);}
 else if(ko){const k=Math.min(1,ko.t/12);
  if(ko.t<40){c.fillStyle=`rgba(0,0,0,${0.35*(1-ko.t/40)})`;c.fillRect(0,0,W,H);}
  c.save();c.translate(W/2,H/2-20);c.globalCompositeOperation='lighter';c.strokeStyle='rgba(255,255,255,.18)';c.lineWidth=4;c.beginPath();for(let i=0;i<40;i++){const a=i*0.157;c.moveTo(Math.cos(a)*140,Math.sin(a)*80);c.lineTo(Math.cos(a)*700,Math.sin(a)*400);}c.stroke();c.restore();
  starburst(c,W/2,H/2-20,200*k,120*k,16,0.2,'rgba(220,20,30,.92)','#000');
  mangaText(c,'K.O.!',W/2,H/2-20,(1.8-0.8*k)*110,'#fff36a','#ff2a10',-0.3);}
 if(mode==='over'){mangaText(c,winner,W/2,H/2+70,46,'#ffffff','#7fd8ff',-0.2);
  txt(c,'Enter = rematch  ·  1-6 = change fighter  ·  C = CPU  ·  B = stage',W/2,H/2+110,'#fff','bold 16px sans-serif');}
 for(let i=0;i<2;i++){const f=[P,E][i];f.x=save[i][0];f.y=save[i][1];f.z=save[i][2];}}
// ---------- loop: fixed 60 Hz logic, render every animation frame at device resolution ----------
function startLoop(canvas){const ctx=canvas.getContext('2d');let RS=1,acc=0,prev=performance.now(),raf=0,alive=true;
 function fit(){RS=Math.min(3,Math.max(2,Math.ceil(window.devicePixelRatio||1)));if(canvas.width!==W*RS){canvas.width=W*RS;canvas.height=H*RS;}}
 if(typeof LBArt!=='undefined'){LBArt.load(function(){artReady=true;});STAGES=['art_sunset','art_night','sunset','night'];if(stage==='sunset')stage='art_sunset';}
 LBC.warm();
 document.addEventListener('visibilitychange',()=>{prev=performance.now();acc=0;});
 function loop(now){if(!alive)return;fit();const rate=(ko&&ko.t<70&&mode==='fight')?0.3:1;const dt=Math.min(100,Math.max(0,now-prev));acc+=dt*rate;prev=now; // clamp dt after tab switches
  while(acc>=1000/60){step();acc-=1000/60;}
  ctx.setTransform(RS,0,0,RS,0,0);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';draw(ctx,acc/(1000/60),dt/(1000/60));raf=requestAnimationFrame(loop);}
 raf=requestAnimationFrame(loop);return function(){alive=false;cancelAnimationFrame(raf);};}
