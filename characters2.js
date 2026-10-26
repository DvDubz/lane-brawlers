/* Lane Brawlers - Character Pack 2: two giant monsters + an ice princess (original designs).
   Load AFTER characters.js. Extends window.LaneBrawlerChars in place (also works standalone).
   Plain browser JS, no deps, no network. window.LaneBrawlerChars / module.exports.
   Coordinates: x,y = feet position, facing +1/-1. Monsters are ~160px tall (1.5x Gorran's ~106px). */
(function(root){
'use strict';
var BASE=(typeof window!=='undefined'&&window.LaneBrawlerChars)||(root&&root.LaneBrawlerChars)||null;
if(!BASE&&typeof require==='function'){try{BASE=require('./characters.js');}catch(e){BASE=null;}}

var CHARS2=[
 {id:'gorgath',name:'Gorgath, the Ember Tyrant',dynasty:'The Cinder Deeps (beneath Kholdra)',role:'Giant / Zoner-Bruiser',
  palette:{scale:'#2e2b31',scaleShade:'#18161b',scaleLight:'#4d4853',belly:'#6e5846',bellyShade:'#4a3a2e',ember:'#ff6a12',emberHot:'#ffd27a',horn:'#d8c9a8',hornShade:'#8f7f62',eye:'#ffb020',aura:'#ff6a12',line:'#0b0909'},
  scale:1.725,giant:true,
  hurtbox:{w:120,h:165,ox:10,tail:{w:90,h:40,ox:-95}},
  stats:{hp:900,speed:1.6,run:3.2,jump:6.0,power:1.6,mp:100,mpRegen:0.10,armor:0.25},
  moves:[
   {id:'punch',name:'Obsidian Claw',input:'A (A,A combo)',mp:0,dmg:[30,38],effect:'wide claw rake, 2nd hit knockback 8'},
   {id:'kick',name:'Tyrant Stomp-Kick',input:'S',mp:0,dmg:36,effect:'forward stomp, armored startup'},
   {id:'jump_attack',name:'Cinder Drop',input:'D then A or S (airborne)',mp:0,dmg:40,effect:'body drop, small quake knockdown'},
   {id:'magma_stomp',name:'Magma Stomp',input:'run + A',mp:0,dmg:34,effect:'stomp shockwave both sides (90px), knockdown, low'},
   {id:'block',name:'Scale Wall',input:'hold F',mp:0,dmg:0,effect:'front hits 10%; tail hits behind deal 50%'},
   {id:'ember_breath',name:'Ember Breath',input:'hold S + A',mp:30,dmg:60,effect:'sustained ember beam 440px, 6 hits, burn 4x5',special:true},
   {id:'cinder_tail',name:'Cinderlash Tail',input:'hold S + → + A',mp:30,dmg:55,effect:'360° tail sweep (r 150px), hits behind too, launch',special:true},
   {id:'ember_cataclysm',name:'ULT: Caldera Cataclysm',input:'hold S + D + A (MP ≥ 80)',mp:80,dmg:200,effect:'spines overcharge, earth-splitting stomp, lava pillars along the whole lane, burn + knockdown',ultimate:true}
  ],
  lore:'Gorgath slept for a thousand years in the Cinder Deeps, the magma caverns beneath the Mountain Dynasty, feeding on the heat of the world\'s core. When the Sun Dynasty\'s stolen brazier was carried down into the dark, its flame woke him. Now he walks the surface with his spine-crest glowing like a forge, searching for the fire that called him.'},
 {id:'bruntusk',name:'Bruntusk, the Jungle King',dynasty:'The Verdant Wilds of Maru-Tal',role:'Giant / Grappler-Rushdown',
  palette:{fur:'#3b2f2a',furShade:'#221a17',furLight:'#5c4a40',skin:'#8a7a6c',skinShade:'#5e5248',tusk:'#efe4c8',tuskShade:'#b3a37e',moss:'#5f8a35',mossShade:'#35561c',vine:'#8bbf4a',paint:'#e8342a',paint2:'#f2efe0',rage:'#ff4a1a',eye:'#ffd23a',aura:'#ff5a2a',line:'#0e0a08'},
  scale:1.725,giant:true,
  hurtbox:{w:130,h:150,ox:15},
  stats:{hp:860,speed:1.9,run:4.4,jump:7.5,power:1.5,mp:100,mpRegen:0.12,armor:0.2},
  moves:[
   {id:'punch',name:'Knuckle Hammer',input:'A (A,A combo)',mp:0,dmg:[28,36],effect:'long-reach overhand, 2nd hit knockback 8'},
   {id:'kick',name:'Shoulder Ram',input:'S',mp:0,dmg:32,effect:'charging shoulder, knockback 7'},
   {id:'jump_attack',name:'Ground Pound',input:'D then A or S (airborne)',mp:0,dmg:42,effect:'double-fist slam, shockwave 80px each side, knockdown'},
   {id:'war_drum',name:'War Drum (chest pound)',input:'hold F + A',mp:10,dmg:0,effect:'buff: +20% power, super armor for 3s'},
   {id:'block',name:'Bark Hide',input:'hold F',mp:0,dmg:0,effect:'front hits 12%'},
   {id:'boulder_hurl',name:'Boulder Hurl',input:'hold S + A',mp:25,dmg:55,effect:'rips up a mossy boulder, lobbed arc 380px, shatters into 3 shard hits, knockdown',special:true},
   {id:'canopy_crash',name:'Canopy Crash',input:'hold S + ↑ + A',mp:35,dmg:70,effect:'leaping slam ~150px forward, crater AoE, stun 30',special:true},
   {id:'primal_rampage',name:'ULT: Primal Rampage',input:'hold S + D + A (MP ≥ 80)',mp:80,dmg:190,effect:'rage mode: chest-pound roar (stun), then 3 ground pounds sending shockwaves down the lane; +30% power for 6s',ultimate:true}
  ],
  lore:'In the Verdant Wilds of Maru-Tal, Bruntusk is the moss-crowned king who settles the quarrels of the jungle with his fists. Vines grew into his fur during a century of sleep beneath the old canopy, and the tribes painted his chest for war. When Gorgath\'s fire scorched the edge of his forest, Bruntusk beat his chest once, and the whole jungle went quiet.'},
 {id:'lysa',name:'Princess Lysa Vaelmoor',dynasty:'The Frostcrown Court',role:'Mid-range Controller / Trapper',
  palette:{skin:'#f6e6e2',skinShade:'#cfb0b4',hair:'#e6f1ff',hairShade:'#9fb8e0',hairLight:'#ffffff',eye:'#4fc3ff',
   outfit:'#9fd6ff',outfitShade:'#5a92cc',trim:'#ffffff',pants:'#eaf6ff',pantsShade:'#b4cbe6',boots:'#7fc4f0',glove:'#cfeeff',cape:'#bfe8ff',crystal:'#e8fbff',aura:'#a8e6ff',line:'#1a2c52'},
  hair:'braid',scale:1.0,
  hurtbox:{w:34,h:92,ox:0},
  stats:{hp:450,speed:3.0,run:6.0,jump:11.5,power:0.95,mp:120,mpRegen:0.17},
  moves:[
   {id:'punch',name:'Crystal Palm',input:'A (A,A combo)',mp:0,dmg:[14,20],effect:'ice-gloved palms, 2nd hit chills (slow 10%)'},
   {id:'kick',name:'Sleet Arc',input:'S',mp:0,dmg:22,effect:'high sweeping kick trailing snow, knockback 4'},
   {id:'jump_attack',name:'Snowfall Pirouette',input:'D then A or S (airborne)',mp:0,dmg:24,effect:'spinning descent, 2 hits'},
   {id:'run_attack',name:'Rime Glide',input:'run + A',mp:0,dmg:22,effect:'skates on a frost trail, slides under projectiles'},
   {id:'block',name:'Crystal Veil',input:'hold F',mp:0,dmg:0,effect:'front hits 15%; attacker is chilled'},
   {id:'frost_bloom',name:'Frost Bloom',input:'hold S + A',mp:25,dmg:42,effect:'ice flower erupts 170px ahead (r 50), freeze 50 ticks',special:true},
   {id:'glacial_palace',name:'Glacial Palace',input:'hold S + ↑/↓/→ + A',mp:30,dmg:30,effect:'ice wall 70px ahead: blocks projectiles for 2s (HP 60), then shatters forward into 5 shards',special:true},
   {id:'winters_decree',name:'ULT: Winter\'s Decree',input:'hold S + D + A (MP ≥ 80)',mp:80,dmg:150,effect:'giant snowflake sigil + blizzard across the screen, 8 hits, freezes everything 100 ticks',ultimate:true}
  ],
  lore:'Lysa is the youngest daughter of the Frostcrown Court, a glittering palace that drifts on the northern ice beyond all three dynasties. She was born during a hundred-day winter, and snow still falls around her when she is calm. She came south as an envoy to stop the monsters\' war from melting her homeland. She is gracious, poised and patient, and she traps opponents in a garden of ice before ending the fight with a single curtsy.'}
];
var BY2={};for(var i=0;i<CHARS2.length;i++)BY2[CHARS2[i].id]=CHARS2[i];
var STATES=['idle','walk','punch','kick','jump','block','hurt','special','ultimate'];
var SPECIALS2={gorgath:['ember_breath','cinder_tail','ember_cataclysm'],bruntusk:['boulder_hurl','canopy_crash','primal_rampage'],lysa:['frost_bloom','glacial_palace','winters_decree']};
var EXTRA_FX={gorgath:['magma_stomp'],bruntusk:['war_drum','ground_pound'],lysa:[]};

/* ---------- caches / helpers ---------- */
var Q=Math.PI/180,SS=2;
function mkCanvas(w,h){if(typeof document==='undefined')return null;var c=document.createElement('canvas');c.width=w;c.height=h;return c;}
var glowCache={};
function glow(color,r){var k=color+r;if(glowCache[k])return glowCache[k];var c=mkCanvas(r*2,r*2);if(!c)return null;var g=c.getContext('2d');
 var gr=g.createRadialGradient(r,r,0,r,r,r);gr.addColorStop(0,color);gr.addColorStop(0.35,color+'aa');gr.addColorStop(1,color+'00');
 g.fillStyle=gr;g.fillRect(0,0,r*2,r*2);glowCache[k]=c;return c;}
function blit(ctx,img,x,y,s,a){if(!img||a<=0)return;var w=img.width*s,h=img.height*s;ctx.globalAlpha=a>1?1:a;ctx.drawImage(img,x-w/2,y-h/2,w,h);ctx.globalAlpha=1;}
var spr={};
function sprite(key,w,h,ox,oy,fn,arg){if(spr[key])return spr[key];var c=mkCanvas(w*SS,h*SS);if(!c)return null;var g=c.getContext('2d');g.scale(SS,SS);g.translate(ox,oy);g.lineJoin='round';g.lineCap='round';fn(g,arg);
 var o={c:c,w:w,h:h,ox:ox,oy:oy};spr[key]=o;return o;}
function put(ctx,s,x,y,r){if(!s)return;if(r){ctx.save();ctx.translate(x,y);ctx.rotate(r);ctx.drawImage(s.c,-s.ox,-s.oy,s.w,s.h);ctx.restore();}else ctx.drawImage(s.c,x-s.ox,y-s.oy,s.w,s.h);}
function rng(i){var x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function ease(p){return 1-(1-p)*(1-p);}
function clamp01(v){return v<0?0:v>1?1:v;}
function poly(g,a){g.beginPath();g.moveTo(a[0],a[1]);for(var i=2;i<a.length;i+=2)g.lineTo(a[i],a[i+1]);g.closePath();}
var RP={x:0,y:0};
function rot(x,y,a,o){var c=Math.cos(a),s=Math.sin(a);o.x=x*c-y*s;o.y=x*s+y*c;return o;}
var IK={x:0,y:0,ex:0,ey:0};
function ik(sx,sy,tx,ty,l1,l2,bend,o){var dx=tx-sx,dy=ty-sy,d=Math.sqrt(dx*dx+dy*dy),m=l1+l2-0.5;if(d>m){dx*=m/d;dy*=m/d;d=m;}if(d<1)d=1;
 var a=Math.atan2(dy,dx),b=Math.acos(Math.max(-1,Math.min(1,(l1*l1+d*d-l2*l2)/(2*l1*d))));o.x=sx+Math.cos(a+bend*b)*l1;o.y=sy+Math.sin(a+bend*b)*l1;o.ex=sx+dx;o.ey=sy+dy;return o;}
function seg(ctx,x1,y1,x2,y2,w,col,line){ctx.strokeStyle=line;ctx.lineWidth=w+4;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
function speedLines(ctx,cx,cy,len,n,col,a,dir,spread){ctx.strokeStyle=col;ctx.globalAlpha=a;ctx.lineWidth=1.6;ctx.beginPath();spread=spread||60;
 for(var i=0;i<n;i++){var yy=cy+(rng(i)-0.5)*spread,l=len*(0.5+rng(i+9));ctx.moveTo(cx-dir*10,yy);ctx.lineTo(cx-dir*(10+l),yy);}ctx.stroke();ctx.globalAlpha=1;}
function burst(ctx,cx,cy,r,col,inner,a,spikes,rt){if(a<=0||r<=0)return;ctx.globalAlpha=a>1?1:a;ctx.fillStyle=col;ctx.beginPath();
 for(var i=0;i<spikes*2;i++){var ang=rt+i*Math.PI/spikes,rr=i%2?r*0.45:r*(0.8+0.3*rng(i));ctx.lineTo(cx+Math.cos(ang)*rr,cy+Math.sin(ang)*rr);}ctx.closePath();ctx.fill();
 ctx.fillStyle=inner;ctx.beginPath();for(i=0;i<spikes*2;i++){ang=rt+i*Math.PI/spikes;rr=i%2?r*0.25:r*0.5;ctx.lineTo(cx+Math.cos(ang)*rr,cy+Math.sin(ang)*rr);}ctx.closePath();ctx.fill();ctx.globalAlpha=1;}
function spike(ctx,bx,by,w,h,c1,c2,line){if(h<=0)return;ctx.fillStyle=c1;ctx.strokeStyle=line;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(bx-w,by);ctx.lineTo(bx+w*0.2,by-h);ctx.lineTo(bx+w,by);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.fillStyle=c2;ctx.beginPath();ctx.moveTo(bx-w*0.2,by);ctx.lineTo(bx+w*0.2,by-h);ctx.lineTo(bx+w*0.7,by);ctx.closePath();ctx.fill();}
function ring(ctx,cx,cy,rx,ry,col,w,a){if(a<=0||rx<=0)return;ctx.globalAlpha=a>1?1:a;ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,6.2832);ctx.stroke();ctx.globalAlpha=1;}
function shadow(ctx,w,h,a){ctx.fillStyle='#000';ctx.globalAlpha=a;ctx.beginPath();ctx.ellipse(0,0,w,h,0,0,6.2832);ctx.fill();ctx.globalAlpha=1;}
function snowflake(ctx,cx,cy,r,rt,col,w){if(r<=0.5)return;ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();
 for(var k=0;k<6;k++){var a=rt+k*1.0472,c=Math.cos(a),s=Math.sin(a);ctx.moveTo(cx,cy);ctx.lineTo(cx+c*r,cy+s*r);
  for(var b=1;b<=2;b++){var bx=cx+c*r*b*0.33,by=cy+s*r*b*0.33,bl=r*(0.32-b*0.06);
   ctx.moveTo(bx,by);ctx.lineTo(bx+Math.cos(a+0.7)*bl,by+Math.sin(a+0.7)*bl);ctx.moveTo(bx,by);ctx.lineTo(bx+Math.cos(a-0.7)*bl,by+Math.sin(a-0.7)*bl);}}
 ctx.stroke();}

/* ===================== GORGATH - lizard kaiju ===================== */
function gHead(g,jaw){var p=BY2.gorgath.palette,i;g.strokeStyle=p.line;g.lineWidth=2.2;
 g.fillStyle=p.scaleShade;poly(g,[-4,-12,-30,-30,-22,-16,-38,-12,-24,-4,-34,8,-16,4,-6,10]);g.fill();g.stroke();
 g.strokeStyle=p.ember;g.lineWidth=1.6;g.beginPath();g.moveTo(-8,-8);g.lineTo(-27,-26);g.moveTo(-10,-4);g.lineTo(-33,-12);g.moveTo(-10,2);g.lineTo(-29,7);g.stroke();
 g.fillStyle=p.ember;poly(g,[-30,-30,-25,-25,-27,-22]);g.fill();poly(g,[-38,-12,-32,-10,-33,-14]);g.fill();poly(g,[-34,8,-28,4,-29,8]);g.fill();
 g.strokeStyle=p.line;g.lineWidth=2.2;
 g.save();g.translate(4,4);g.rotate(jaw);
 g.fillStyle=p.belly;poly(g,[-8,0,40,-1,44,2,36,9,8,13,-6,8]);g.fill();g.stroke();
 if(jaw>0.05){g.fillStyle='#fff6d8';for(i=0;i<5;i++){poly(g,[12+i*6,-1,15+i*6,-6,18+i*6,-1]);g.fill();}}
 g.restore();
 if(jaw>0.05){g.fillStyle=p.ember;g.beginPath();g.moveTo(8,4);g.lineTo(46,2);g.lineTo(40,4+jaw*30);g.lineTo(10,6+jaw*12);g.closePath();g.fill();g.fillStyle=p.emberHot;g.beginPath();g.moveTo(14,5);g.lineTo(40,4);g.lineTo(30,5+jaw*18);g.closePath();g.fill();}
 g.fillStyle=p.scale;poly(g,[-10,6,-8,-8,0,-17,16,-20,30,-17,44,-11,52,-6,51,1,46,3,8,4]);g.fill();g.stroke();
 g.fillStyle='#fff6d8';for(i=0;i<6;i++){poly(g,[14+i*6,3,17+i*6,8,20+i*6,3]);g.fill();}
 g.fillStyle=p.scaleLight;poly(g,[2,-15,16,-18,30,-15,42,-10,30,-12,16,-14]);g.fill();
 g.fillStyle=p.scaleShade;poly(g,[-10,6,-8,-8,-2,-4,0,4]);g.fill();
 g.strokeStyle=p.line;g.lineWidth=1;g.beginPath();g.moveTo(26,-4);g.lineTo(34,-2);g.moveTo(36,-6);g.lineTo(44,-4);g.stroke();
 g.strokeStyle=p.ember;g.lineWidth=1.6;g.beginPath();g.moveTo(-4,0);g.lineTo(6,-4);g.lineTo(14,-2);g.stroke();
 g.strokeStyle=p.line;g.lineWidth=2;g.fillStyle=p.horn;
 g.beginPath();g.moveTo(10,-18);g.quadraticCurveTo(-4,-34,-22,-44);g.quadraticCurveTo(-8,-30,2,-16);g.closePath();g.fill();g.stroke();
 g.beginPath();g.moveTo(22,-19);g.quadraticCurveTo(14,-34,2,-40);g.quadraticCurveTo(10,-30,14,-18);g.closePath();g.fill();g.stroke();
 g.beginPath();g.moveTo(40,-12);g.lineTo(44,-24);g.lineTo(47,-9);g.closePath();g.fill();g.stroke();
 g.fillStyle=p.hornShade;g.beginPath();g.moveTo(6,-18);g.quadraticCurveTo(-6,-30,-20,-42);g.quadraticCurveTo(-4,-28,2,-16);g.fill();
 g.fillStyle=p.line;poly(g,[18,-16,32,-12,30,-9,18,-11]);g.fill();
 g.fillStyle=p.eye;poly(g,[21,-11,29,-10,27,-7,21,-8]);g.fill();g.fillStyle='#fff8d0';g.fillRect(24,-10,2,2);
 g.fillStyle=p.line;g.beginPath();g.ellipse(48,-5,1.6,1,0,0,6.3);g.fill();}
function gTorso(g){var p=BY2.gorgath.palette,i;g.strokeStyle=p.line;g.lineWidth=2.5;
 var S=[[-30,-20,16],[-28,-36,22],[-20,-52,28],[-8,-64,30],[6,-72,26],[18,-74,18]];
 for(i=0;i<S.length;i++){var bx=S[i][0],by=S[i][1],h=S[i][2];
  g.fillStyle=p.scaleShade;poly(g,[bx+8,by+4,bx-h*0.75,by-h*0.55,bx-h*0.45,by-h*0.25,bx-h*0.9,by-h*0.05,bx-4,by+8]);g.fill();g.stroke();
  g.fillStyle=p.ember;poly(g,[bx+2,by+3,bx-h*0.62,by-h*0.42,bx-h*0.38,by-h*0.2,bx-h*0.7,by-h*0.02,bx-3,by+6]);g.fill();
  g.fillStyle=p.emberHot;poly(g,[bx-2,by+3,bx-h*0.5,by-h*0.3,bx-h*0.3,by-h*0.12,bx-4,by+5]);g.fill();}
 g.fillStyle=p.scale;g.beginPath();g.moveTo(-30,-4);g.quadraticCurveTo(-38,-40,-12,-66);g.quadraticCurveTo(10,-82,30,-70);g.quadraticCurveTo(44,-60,42,-40);g.quadraticCurveTo(36,-8,14,4);g.quadraticCurveTo(-10,10,-30,-4);g.closePath();g.fill();g.stroke();
 g.fillStyle=p.belly;g.beginPath();g.moveTo(30,-66);g.quadraticCurveTo(44,-52,40,-36);g.quadraticCurveTo(34,-8,12,2);g.quadraticCurveTo(22,-24,22,-44);g.quadraticCurveTo(24,-58,30,-66);g.fill();g.stroke();
 g.strokeStyle=p.bellyShade;g.lineWidth=1.4;g.beginPath();for(i=0;i<6;i++){var yy=-58+i*10;g.moveTo(24+i*0.2,yy);g.quadraticCurveTo(32,yy+2,40-i*1.5,yy-1);}g.stroke();
 g.fillStyle=p.scaleShade;g.beginPath();g.moveTo(-30,-4);g.quadraticCurveTo(-38,-40,-12,-66);g.quadraticCurveTo(-26,-36,-14,0);g.closePath();g.fill();
 g.fillStyle=p.scaleLight;g.beginPath();g.moveTo(-8,-66);g.quadraticCurveTo(12,-78,28,-70);g.quadraticCurveTo(10,-72,-4,-62);g.fill();
 g.strokeStyle=p.scaleShade;g.lineWidth=1.2;g.beginPath();for(i=0;i<14;i++){var sx=-24+rng(i)*40,sy=-60+rng(i+20)*55;g.moveTo(sx,sy);g.quadraticCurveTo(sx+3,sy+3,sx+6,sy);}g.stroke();
 g.strokeStyle=p.ember;g.lineWidth=2;g.beginPath();g.moveTo(-22,-30);g.lineTo(-12,-36);g.lineTo(-4,-30);g.lineTo(6,-38);g.moveTo(-18,-12);g.lineTo(-8,-16);g.lineTo(2,-10);g.moveTo(-6,-54);g.lineTo(4,-58);g.lineTo(12,-52);g.stroke();
 g.strokeStyle=p.emberHot;g.lineWidth=0.8;g.stroke();}
var GK={lean:0,jaw:0,tail:0,tailLift:0,fs:0,fe:0,bs:0,be:0,fh:0,fk:0,fa:0,bh:0,bk:0,ba:0,air:0,head:0,glow:0};
function gSet(o,lean,jaw,tail,fs,fe,bs,be,fh,fk,fa,bh,bk,ba,head){o.lean=lean*Q;o.jaw=jaw;o.tail=tail;o.fs=fs*Q;o.fe=fe*Q;o.bs=bs*Q;o.be=be*Q;o.fh=fh*Q;o.fk=fk*Q;o.fa=fa*Q;o.bh=bh*Q;o.bk=bk*Q;o.ba=ba*Q;o.head=head*Q;}
function gPose(state,t){var s=Math.sin(t*0.1),c,o=GK;o.air=0;o.glow=0.35+0.15*s;o.tailLift=0;
 switch(state){
 case 'walk':c=Math.sin(t*0.13);gSet(o,18,0.05,c*0.25,40+20*c,-70,20-20*c,-70,38+22*c,-88,48,22-22*c,-88,48,-4);break;
 case 'punch':gSet(o,30,0.25,0.2,110,-30,10,-90,50,-95,50,10,-80,45,-6);break;
 case 'kick':gSet(o,4,0.1,-0.25,30,-80,10,-80,95,-70,30,10,-75,48,4);break;
 case 'jump':gSet(o,18,0.2,0.4,60,-90,40,-90,70,-120,60,40,-120,60,-6);o.air=-30;break;
 case 'block':gSet(o,-4,0,0.15,155,-130,140,-120,34,-92,50,14,-84,48,18);o.glow=0.5;break;
 case 'hurt':gSet(o,-16,0.45,-0.3+0.05*s,20,-40,-10,-50,30,-82,48,10,-80,46,-28);o.glow=0.2;break;
 case 'special':gSet(o,26,0.6,0.15,40,-60,20,-70,48,-96,52,8,-80,46,4);o.glow=1;break;
 case 'ultimate':gSet(o,-14,0.7,-0.5,140+6*s,-40,120-6*s,-30,30,-86,50,10,-80,46,-26);o.glow=1;o.tailLift=1;break;
 default:gSet(o,18,0.03*(1+s),s*0.08,45+3*s,-70,25+3*s,-70,40,-90,50,18,-84,48,-4+2*s);}
 return o;}
var TP=new Float32Array(20);
function gTail(ctx,p,rx,ry,o,t){var n=8,x=rx,y=ry,L=18,w=26,i,ww,dy=8-o.tail*6-o.tailLift*9;
 TP[0]=x;TP[1]=y;for(i=1;i<=n;i++){x-=L;y+=dy+Math.sin(t*0.08+i*0.7)*1.5;dy-=0.75+o.tailLift*0.2;if(y>-3)y=-3;TP[i*2]=x;TP[i*2+1]=y;L*=0.96;}
 for(i=0;i<n;i++){ww=w*(1-i/(n+1.5));ctx.strokeStyle=p.line;ctx.lineWidth=ww+4;ctx.beginPath();ctx.moveTo(TP[i*2],TP[i*2+1]);ctx.lineTo(TP[i*2+2],TP[i*2+3]);ctx.stroke();}
 for(i=0;i<n;i++){ww=w*(1-i/(n+1.5));ctx.strokeStyle=p.scale;ctx.lineWidth=ww;ctx.beginPath();ctx.moveTo(TP[i*2],TP[i*2+1]);ctx.lineTo(TP[i*2+2],TP[i*2+3]);ctx.stroke();
  ctx.strokeStyle=p.belly;ctx.lineWidth=ww*0.28;ctx.beginPath();ctx.moveTo(TP[i*2],TP[i*2+1]+ww*0.3);ctx.lineTo(TP[i*2+2],TP[i*2+3]+ww*0.28);ctx.stroke();}
 for(i=0;i<n-1;i++){ww=w*(1-(i+1)/(n+1.5));var tx=TP[i*2+2],ty=TP[i*2+3]-ww*0.45,h=11-i;ctx.fillStyle=p.scaleShade;ctx.strokeStyle=p.line;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(tx+5,ty+2);ctx.lineTo(tx-h*0.8,ty-h);ctx.lineTo(tx-5,ty+2);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle=p.ember;ctx.beginPath();ctx.moveTo(tx+2,ty+1);ctx.lineTo(tx-h*0.6,ty-h*0.7);ctx.lineTo(tx-3,ty+1);ctx.fill();}
 var ex=TP[n*2],ey=TP[n*2+1];ctx.fillStyle=p.horn;ctx.strokeStyle=p.line;ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(ex+4,ey-4);ctx.lineTo(ex-18,ey-2);ctx.lineTo(ex+4,ey+4);ctx.closePath();ctx.fill();ctx.stroke();}
function gLeg(ctx,p,x,y,a1,a2,a3,front){var col=front?p.scale:p.scaleShade,i;
 var kx=x+Math.sin(a1)*30,ky=y+Math.cos(a1)*30,ax=kx+Math.sin(a1+a2)*28,ay=ky+Math.cos(a1+a2)*28,tx=ax+Math.sin(a1+a2+a3)*18,ty=ay+Math.cos(a1+a2+a3)*18;
 seg(ctx,x,y,kx,ky,26,col,p.line);seg(ctx,kx,ky,ax,ay,16,col,p.line);seg(ctx,ax,ay,tx,ty,11,col,p.line);
 ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y,14,0,6.3);ctx.fill();ctx.beginPath();ctx.arc(kx,ky,9,0,6.3);ctx.fill();
 if(front){ctx.strokeStyle=p.ember;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x-6,y+2);ctx.lineTo(kx-2,ky-4);ctx.stroke();}
 ctx.fillStyle=col;ctx.strokeStyle=p.line;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(tx-8,ty-6);ctx.lineTo(tx+12,ty-5);ctx.lineTo(tx+16,ty);ctx.lineTo(tx-10,ty+1);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.fillStyle=p.horn;for(i=0;i<3;i++){var cx=tx+6+i*4;ctx.beginPath();ctx.moveTo(cx,ty-3);ctx.lineTo(cx+6,ty+1);ctx.lineTo(cx,ty+1);ctx.closePath();ctx.fill();ctx.stroke();}}
function gArm(ctx,p,x,y,a1,a2,front){var col=front?p.scale:p.scaleShade;
 var ex=x+Math.sin(a1)*22,ey=y+Math.cos(a1)*22,hx=ex+Math.sin(a1+a2)*20,hy=ey+Math.cos(a1+a2)*20;
 seg(ctx,x,y,ex,ey,13,col,p.line);seg(ctx,ex,ey,hx,hy,10,col,p.line);
 var a=a1+a2;ctx.fillStyle=p.horn;ctx.strokeStyle=p.line;ctx.lineWidth=1.5;
 for(var i=-1;i<=1;i++){var ca=a+i*0.35,cx=hx+Math.sin(ca)*4,cy=hy+Math.cos(ca)*4;ctx.beginPath();ctx.moveTo(cx-Math.cos(ca)*2.5,cy+Math.sin(ca)*2.5);ctx.lineTo(cx+Math.sin(ca+0.5)*10,cy+Math.cos(ca+0.5)*10);ctx.lineTo(cx+Math.cos(ca)*2.5,cy-Math.sin(ca)*2.5);ctx.closePath();ctx.fill();ctx.stroke();}}
function drawGorgath(ctx,ch,state,t){var p=ch.palette,o=gPose(state,t),i;
 shadow(ctx,62,12,0.3);ctx.translate(0,o.air);
 var drop=30*Math.cos(o.fh)+28*Math.cos(o.fh+o.fk)+18*Math.cos(o.fh+o.fk+o.fa),drop2=30*Math.cos(o.bh)+28*Math.cos(o.bh+o.bk)+18*Math.cos(o.bh+o.bk+o.ba);
 if(state==='kick')drop=drop2;else if(state!=='jump')drop=Math.max(drop,drop2);
 var hipX=-6,hipY=-drop-4;
 var gl=o.glow*(0.85+0.15*Math.sin(t*0.4));
 blit(ctx,glow(p.ember,64),hipX-4,hipY-50,state==='ultimate'?2.6:1.7,gl*0.55);
 rot(-24,-6,o.lean,RP);var trx=hipX+RP.x,try_=hipY+RP.y;
 gTail(ctx,p,trx,try_,o,t);
 gLeg(ctx,p,hipX-6,hipY,o.bh,o.bk,o.ba,false);
 rot(26,-58,o.lean,RP);var shx=hipX+RP.x,shy=hipY+RP.y;
 gArm(ctx,p,shx-6,shy+2,o.bs,o.be,false);
 put(ctx,sprite('g_torso',110,110,60,90,gTorso),hipX,hipY,o.lean);
 for(i=0;i<6;i++){rot(-34+i*9,-28-i*9.5,o.lean,RP);blit(ctx,glow(p.emberHot,24),hipX+RP.x,hipY+RP.y,0.9+i*0.08,gl*(0.6+0.4*Math.sin(t*0.3-i*0.6)));}
 rot(36,-66,o.lean,RP);var nx=hipX+RP.x,ny=hipY+RP.y;
 put(ctx,sprite(o.jaw>0.4?'g_head_o':o.jaw>0.15?'g_head_m':'g_head_c',100,90,44,52,gHead,o.jaw>0.4?0.5:o.jaw>0.15?0.22:0),nx+2,ny-4,o.lean*0.35+o.head);
 gLeg(ctx,p,hipX+6,hipY,o.fh,o.fk,o.fa,true);
 gArm(ctx,p,shx+2,shy+4,o.fs,o.fe,true);
 if(state==='special'||state==='ultimate'){blit(ctx,glow(p.emberHot,24),nx+44,ny-2,1.5,0.9);}
 if(state==='hurt'){ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(nx+30,ny-40);ctx.lineTo(nx+36,ny-52);ctx.moveTo(nx+40,ny-30);ctx.lineTo(nx+52,ny-34);ctx.stroke();}
 if(state==='block'){ctx.strokeStyle=p.ember;ctx.globalAlpha=0.5;ctx.lineWidth=4;ctx.beginPath();ctx.arc(20,-90,70,-1.1,1.1);ctx.stroke();ctx.globalAlpha=1;}
 if(state==='punch'){ctx.strokeStyle=p.emberHot;ctx.lineWidth=3;ctx.globalAlpha=0.8;for(i=0;i<3;i++){ctx.beginPath();ctx.arc(shx+10,shy+10,48+i*7,-0.9,0.5);ctx.stroke();}ctx.globalAlpha=1;}}

/* ===================== BRUNTUSK - giant ape ===================== */
function bHead(g,mode){var p=BY2.bruntusk.palette;g.strokeStyle=p.line;g.lineWidth=2.2;
 g.fillStyle=p.fur;poly(g,[-18,8,-22,-6,-16,-20,-8,-28,2,-32,12,-30,20,-24,24,-14,26,-2,20,10,4,14]);g.fill();g.stroke();
 g.fillStyle=p.moss;poly(g,[-14,-20,-6,-30,4,-34,14,-30,8,-26,0,-28,-6,-22]);g.fill();g.stroke();
 g.fillStyle=p.vine;g.beginPath();g.arc(-2,-30,2,0,6.3);g.arc(8,-31,1.6,0,6.3);g.fill();
 g.fillStyle=p.skin;g.beginPath();g.moveTo(6,-14);g.quadraticCurveTo(22,-16,26,-6);g.lineTo(34,0);g.quadraticCurveTo(38,10,30,16);g.quadraticCurveTo(16,20,6,12);g.quadraticCurveTo(2,0,6,-14);g.closePath();g.fill();g.stroke();
 g.fillStyle=p.skinShade;g.beginPath();g.moveTo(6,12);g.quadraticCurveTo(2,0,6,-14);g.quadraticCurveTo(8,0,14,14);g.fill();
 g.strokeStyle=p.paint;g.lineWidth=2.4;g.beginPath();g.moveTo(10,-4);g.lineTo(18,0);g.moveTo(9,2);g.lineTo(17,6);g.stroke();
 g.fillStyle=p.paint2;g.beginPath();g.arc(22,-11,1.3,0,6.3);g.arc(26,-9,1.3,0,6.3);g.fill();
 g.fillStyle=p.furShade;g.strokeStyle=p.line;g.lineWidth=2;poly(g,[4,-16,30,-12,30,-7,18,-8,6,-10]);g.fill();g.stroke();
 g.fillStyle=mode==='rage'?p.rage:p.eye;poly(g,[18,-7,26,-6,25,-3,18,-4]);g.fill();g.fillStyle='#fff';g.fillRect(22,-6,1.6,1.6);
 if(mode==='rage'){g.strokeStyle=p.rage;g.lineWidth=1.2;g.beginPath();g.moveTo(16,-14);g.lineTo(12,-20);g.lineTo(14,-24);g.stroke();}
 g.fillStyle=p.line;g.beginPath();g.ellipse(33,1,1.5,1,0.3,0,6.3);g.fill();
 if(mode!=='closed'){g.fillStyle='#4a1414';g.beginPath();g.moveTo(16,8);g.quadraticCurveTo(26,6,34,9);g.quadraticCurveTo(28,22,16,16);g.closePath();g.fill();g.stroke();g.fillStyle='#fff6d8';poly(g,[20,9,22,12,24,9]);g.fill();poly(g,[27,9,29,12,31,9]);g.fill();}
 else{g.strokeStyle=p.line;g.lineWidth=1.6;g.beginPath();g.moveTo(16,10);g.quadraticCurveTo(26,12,33,9);g.stroke();}
 g.fillStyle=p.tusk;g.strokeStyle=p.line;g.lineWidth=1.8;
 g.beginPath();g.moveTo(18,14);g.quadraticCurveTo(28,10,30,-2);g.quadraticCurveTo(30,10,22,17);g.closePath();g.fill();g.stroke();
 g.beginPath();g.moveTo(26,14);g.quadraticCurveTo(38,12,40,0);g.quadraticCurveTo(40,12,30,18);g.closePath();g.fill();g.stroke();
 g.fillStyle=p.tuskShade;g.beginPath();g.moveTo(22,16);g.quadraticCurveTo(30,12,30,0);g.quadraticCurveTo(28,12,20,15);g.fill();
 g.fillStyle=p.skinShade;g.strokeStyle=p.line;g.lineWidth=1.6;g.beginPath();g.ellipse(-4,-4,4,6,0,0,6.3);g.fill();g.stroke();}
function furEdge(g,x1,y1,x2,y2,n,d){for(var i=0;i<n;i++){var t1=(i+0.5)/n,t2=(i+1)/n,nx=-(y2-y1),ny=(x2-x1),l=Math.sqrt(nx*nx+ny*ny);nx/=l;ny/=l;
 g.lineTo(x1+(x2-x1)*t1+nx*d,y1+(y2-y1)*t1+ny*d);g.lineTo(x1+(x2-x1)*t2,y1+(y2-y1)*t2);}}
function bTorso(g){var p=BY2.bruntusk.palette,i;g.strokeStyle=p.line;g.lineWidth=2.6;
 g.fillStyle=p.fur;g.beginPath();g.moveTo(-26,6);furEdge(g,-26,6,-38,-40,4,6);furEdge(g,-38,-40,-28,-82,4,7);furEdge(g,-28,-82,6,-104,4,7);furEdge(g,6,-104,40,-96,3,6);
 g.lineTo(46,-80);g.quadraticCurveTo(44,-40,26,-10);g.quadraticCurveTo(10,8,-26,6);g.closePath();g.fill();g.stroke();
 g.fillStyle=p.furShade;g.beginPath();g.moveTo(-26,6);g.lineTo(-38,-40);g.lineTo(-28,-82);g.quadraticCurveTo(-24,-40,-10,4);g.closePath();g.fill();
 g.fillStyle=p.furLight;g.beginPath();g.moveTo(-20,-84);g.quadraticCurveTo(6,-100,34,-94);g.quadraticCurveTo(8,-92,-14,-78);g.fill();
 g.fillStyle=p.skin;g.strokeStyle=p.line;g.lineWidth=2;g.beginPath();g.moveTo(14,-80);g.quadraticCurveTo(46,-80,42,-50);g.quadraticCurveTo(38,-24,22,-14);g.quadraticCurveTo(14,-40,14,-80);g.closePath();g.fill();g.stroke();
 g.strokeStyle=p.skinShade;g.lineWidth=1.4;g.beginPath();g.moveTo(18,-56);g.quadraticCurveTo(30,-50,40,-56);g.moveTo(20,-40);g.quadraticCurveTo(28,-36,36,-40);g.stroke();
 g.strokeStyle=p.paint;g.lineWidth=3;g.beginPath();g.moveTo(18,-72);g.lineTo(30,-62);g.lineTo(40,-72);g.stroke();
 g.strokeStyle=p.paint2;g.lineWidth=1.5;g.beginPath();g.moveTo(20,-66);g.lineTo(30,-56);g.lineTo(39,-66);g.stroke();
 g.fillStyle=p.paint2;g.beginPath();g.arc(24,-30,1.6,0,6.3);g.arc(30,-28,1.6,0,6.3);g.arc(36,-32,1.6,0,6.3);g.fill();
 g.strokeStyle=p.mossShade;g.lineWidth=5;g.beginPath();g.moveTo(-34,-30);g.quadraticCurveTo(0,-10,30,-14);g.stroke();g.strokeStyle=p.vine;g.lineWidth=2.4;g.stroke();
 g.fillStyle=p.moss;for(i=0;i<5;i++){g.beginPath();g.ellipse(-28+i*13,-24+i*1.8,4,2,0.6,0,6.3);g.fill();}
 g.fillStyle=p.moss;g.strokeStyle=p.line;g.lineWidth=2;poly(g,[-34,-50,-30,-78,-12,-94,4,-98,-6,-84,-18,-66,-26,-46]);g.fill();g.stroke();
 g.fillStyle=p.mossShade;poly(g,[-32,-52,-28,-74,-20,-70,-26,-50]);g.fill();
 g.fillStyle=p.vine;for(i=0;i<5;i++){g.beginPath();g.arc(-28+i*6,-58-i*7,1.8,0,6.3);g.fill();}}
function bPad(g){var p=BY2.bruntusk.palette;g.strokeStyle=p.line;g.lineWidth=2;g.fillStyle=p.moss;
 g.beginPath();g.moveTo(-16,4);g.quadraticCurveTo(-18,-14,0,-18);g.quadraticCurveTo(18,-16,18,2);g.lineTo(12,-2);g.lineTo(8,6);g.lineTo(2,0);g.lineTo(-4,7);g.lineTo(-8,1);g.closePath();g.fill();g.stroke();
 g.fillStyle=p.mossShade;g.beginPath();g.moveTo(-14,0);g.quadraticCurveTo(-14,-12,-2,-15);g.quadraticCurveTo(-8,-6,-8,2);g.fill();
 g.strokeStyle=p.vine;g.lineWidth=2;g.beginPath();g.moveTo(-14,-6);g.quadraticCurveTo(0,-12,16,-4);g.stroke();
 g.fillStyle=p.vine;g.beginPath();g.ellipse(6,-12,3,1.6,0.4,0,6.3);g.ellipse(-6,-10,3,1.6,-0.4,0,6.3);g.fill();}
function bBoulder(g){var p=BY2.bruntusk.palette;g.strokeStyle=p.line;g.lineWidth=2.4;g.fillStyle='#6f665c';
 poly(g,[-28,6,-24,-14,-10,-24,10,-24,26,-12,30,6,20,20,-8,22,-24,16]);g.fill();g.stroke();
 g.fillStyle='#8e857a';poly(g,[-20,-10,-8,-20,8,-20,18,-12,4,-14,-10,-12]);g.fill();
 g.fillStyle='#4e4740';poly(g,[-24,10,-8,18,16,16,6,20,-10,21]);g.fill();
 g.fillStyle=p.moss;g.beginPath();g.moveTo(-24,-12);g.quadraticCurveTo(-10,-28,12,-22);g.quadraticCurveTo(2,-16,-6,-16);g.quadraticCurveTo(-16,-10,-24,-12);g.fill();g.stroke();
 g.strokeStyle=p.vine;g.lineWidth=2;g.beginPath();g.moveTo(10,-22);g.quadraticCurveTo(22,-4,14,16);g.stroke();
 g.strokeStyle=p.line;g.lineWidth=1.2;g.beginPath();g.moveTo(-6,0);g.lineTo(2,6);g.lineTo(0,14);g.stroke();}
var BK={lean:0,head:0,fhx:0,fhy:0,bhx:0,bhy:0,ffx:0,ffy:0,bfx:0,bfy:0,air:0,mode:'closed',rage:0};
function bSet(o,lean,head,fhx,fhy,bhx,bhy,ffx,ffy,bfx,bfy){o.lean=lean*Q;o.head=head*Q;o.fhx=fhx;o.fhy=fhy;o.bhx=bhx;o.bhy=bhy;o.ffx=ffx;o.ffy=ffy;o.bfx=bfx;o.bfy=bfy;}
function bPose(state,t){var s=Math.sin(t*0.1),c,o=BK;o.air=0;o.rage=0;o.mode='closed';
 switch(state){
 case 'walk':c=Math.sin(t*0.13);bSet(o,40,-30,62+18*c,0,48-18*c,0,8-12*c,0,-24+12*c,0);if(c>0)o.fhy=-10*c;else o.bhy=10*c;break;
 case 'punch':bSet(o,30,-24,112,-62,30,-2,14,0,-26,0);o.mode='open';break;
 case 'kick':bSet(o,52,-38,52,-30,24,-24,24,0,-30,0);o.mode='open';break;
 case 'jump':bSet(o,14,-10,50,-110,8,-118,16,-14,-22,-6);o.air=-36;o.mode='open';break;
 case 'block':bSet(o,18,-6,44,-100,30,-104,10,0,-26,0);break;
 case 'hurt':bSet(o,-6,22,-6,-34,-30,-46,12,0,-26,0);o.mode='open';break;
 case 'special':bSet(o,8,-12,16,-150,-4,-146,14,0,-28,0);o.mode='open';break;
 case 'ultimate':var pnd=Math.sin(t*0.6);bSet(o,-6,16,34+10*pnd,-96,28-10*pnd,-94,16,0,-28,0);o.mode='rage';o.rage=1;break;
 default:bSet(o,38,-28,62,0,46,0,8,0,-24,0);o.lean+=s*0.02;}
 return o;}
function bLimb(ctx,p,sx,sy,tx,ty,l1,l2,w1,w2,bend,col,fist){ik(sx,sy,tx,ty,l1,l2,bend,IK);var ex=IK.x,ey=IK.y,hx=IK.ex,hy=IK.ey;
 seg(ctx,sx,sy,ex,ey,w1,col,p.line);seg(ctx,ex,ey,hx,hy,w2,col,p.line);
 ctx.fillStyle=col;ctx.beginPath();ctx.arc(sx,sy,w1*0.55,0,6.3);ctx.fill();ctx.beginPath();ctx.arc(ex,ey,w2*0.55,0,6.3);ctx.fill();
 ctx.strokeStyle=p.line;ctx.lineWidth=1.6;ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(ex-6,ey);ctx.lineTo(ex-12*bend,ey+8);ctx.lineTo(ex+2,ey+5);ctx.closePath();ctx.fill();ctx.stroke();
 if(fist){ctx.fillStyle=p.skinShade;ctx.beginPath();ctx.arc(hx,hy,fist,0,6.3);ctx.fill();ctx.stroke();ctx.strokeStyle=p.line;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(hx-fist*0.5,hy-fist*0.3);ctx.lineTo(hx+fist*0.6,hy-fist*0.3);ctx.stroke();}}
function drawBruntusk(ctx,ch,state,t){var p=ch.palette,o=bPose(state,t);
 shadow(ctx,70,13,0.3);ctx.translate(0,o.air);ctx.scale(1.3,1.3);
 var hipX=-26,hipY=-46+(state==='walk'?-Math.abs(Math.sin(t*0.13))*3:0);
 var rg=state==='ultimate'?1:state==='special'?0.6:0.15;
 blit(ctx,glow(p.aura,64),hipX+20,hipY-50,state==='ultimate'?2.8:1.7,rg*(0.8+0.2*Math.sin(t*0.5)));
 rot(18,-88,o.lean,RP);var shx=hipX+RP.x,shy=hipY+RP.y;
 bLimb(ctx,p,shx-12,shy+4,o.bhx-2,o.bhy,48,46,25,21,1,p.furShade,12);
 bLimb(ctx,p,hipX-6,hipY,o.bfx,o.bfy-4,26,24,22,16,-1,p.furShade,0);
 ctx.fillStyle=p.skinShade;ctx.strokeStyle=p.line;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(o.bfx+4,o.bfy-3,12,5,0,0,6.3);ctx.fill();ctx.stroke();
 put(ctx,sprite('b_torso',110,120,50,110,bTorso),hipX,hipY,o.lean);
 if(o.rage||state==='special'){ctx.save();ctx.translate(hipX,hipY);ctx.rotate(o.lean);ctx.globalAlpha=o.rage?0.6+0.4*Math.sin(t*0.7):0.4;ctx.strokeStyle=p.rage;ctx.lineWidth=2.2;ctx.beginPath();
  ctx.moveTo(-30,-40);ctx.lineTo(-20,-50);ctx.lineTo(-24,-62);ctx.lineTo(-12,-74);ctx.moveTo(-20,-50);ctx.lineTo(-8,-54);ctx.moveTo(0,-90);ctx.lineTo(8,-80);ctx.lineTo(4,-68);ctx.moveTo(-14,-20);ctx.lineTo(-4,-28);ctx.lineTo(6,-24);ctx.stroke();
  ctx.strokeStyle='#ffd0a0';ctx.lineWidth=0.8;ctx.stroke();ctx.globalAlpha=1;ctx.restore();}
 rot(40,-84,o.lean,RP);var nx=hipX+RP.x,ny=hipY+RP.y;
 bLimb(ctx,p,hipX+8,hipY,o.ffx,o.ffy-4,26,24,24,18,-1,p.fur,0);
 ctx.fillStyle=p.skin;ctx.strokeStyle=p.line;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(o.ffx+5,o.ffy-3,13,5,0,0,6.3);ctx.fill();ctx.stroke();
 put(ctx,sprite('b_head_'+o.mode,80,70,30,40,bHead,o.mode),nx+4,ny-2,o.head);
 bLimb(ctx,p,shx+2,shy+6,o.fhx,o.fhy,48,46,27,23,1,p.fur,13);
 put(ctx,sprite('b_pad',40,30,20,20,bPad),shx+2,shy+2,o.lean*0.6);
 if(state==='special')put(ctx,sprite('b_boulder',70,60,35,30,bBoulder),(o.fhx+o.bhx)/2,(o.fhy+o.bhy)/2-22,0);
 if(state==='punch'){speedLines(ctx,o.fhx-14,o.fhy,70,7,'#fff',0.7,1,30);burst(ctx,o.fhx+14,o.fhy,20,p.aura,'#fff3c0',0.9,8,0.3);}
 if(state==='hurt'){ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(nx+30,ny-36);ctx.lineTo(nx+36,ny-48);ctx.moveTo(nx+42,ny-26);ctx.lineTo(nx+54,ny-30);ctx.stroke();}
 if(state==='block'){ctx.strokeStyle=p.vine;ctx.globalAlpha=0.55;ctx.lineWidth=4;ctx.beginPath();ctx.arc(30,-90,72,-1.1,1.1);ctx.stroke();ctx.globalAlpha=1;}}

/* ===================== LYSA - ice princess (normal size) ===================== */
var LP={lean:0,bs:0,be:0,fs:0,fe:0,bh:0,bk:0,fh:0,fk:0,bob:0};
function lSet(o,lean,bs,be,fs,fe,bh,bk,fh,fk,bob){o.lean=lean*Q;o.bs=bs*Q;o.be=be*Q;o.fs=fs*Q;o.fe=fe*Q;o.bh=bh*Q;o.bk=bk*Q;o.fh=fh*Q;o.fk=fk*Q;o.bob=bob;}
function lPose(state,t){var s=Math.sin(t*0.1),c,o=LP;
 switch(state){
 case 'walk':c=Math.sin(t*0.2);lSet(o,3,-20*c+10,50,20*c+30,70,22*c-4,-8-12*Math.max(0,c),-22*c-4,-8-12*Math.max(0,-c),Math.abs(c)*1.5);break;
 case 'punch':lSet(o,10,-30,80,92,-6,-18,-8,18,-10,1);break;
 case 'kick':lSet(o,-26,-80,60,40,60,-8,-4,118,-4,0);break;
 case 'jump':lSet(o,6,-150,40,-110,40,-20,-90,30,-100,-6);break;
 case 'block':lSet(o,-6,70,110,100,100,-18,-14,16,-18,3);break;
 case 'hurt':lSet(o,-22,-70+5*s,30,-50,40,-16,-10,14,-18,2);break;
 case 'special':lSet(o,6,-60,30,100,-20,-20,-10,24,-14,3);break;
 case 'ultimate':lSet(o,-6,-160-4*s,20,160+4*s,-20,-20,-6,20,-6,-3+s);break;
 default:lSet(o,2,-14+3*s,50+4*s,40+4*s,110+3*s,-10,-6,12,-10,1.5+1.5*s);}
 return o;}
var LEND={x:0,y:0};
function lLimb(ctx,x,y,a1,a2,l1,l2,w1,w2,col,shade,line,endCol,endR){
 var kx=x+Math.sin(a1)*l1,ky=y+Math.cos(a1)*l1,ex=kx+Math.sin(a1+a2)*l2,ey=ky+Math.cos(a1+a2)*l2;
 ctx.strokeStyle=line;ctx.lineWidth=w1+3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(kx,ky);ctx.lineTo(ex,ey);ctx.stroke();
 ctx.strokeStyle=col;ctx.lineWidth=w1;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(kx,ky);ctx.stroke();ctx.lineWidth=w2;ctx.beginPath();ctx.moveTo(kx,ky);ctx.lineTo(ex,ey);ctx.stroke();
 ctx.strokeStyle=shade;ctx.lineWidth=w2*0.35;ctx.beginPath();ctx.moveTo(x-1,y+1);ctx.lineTo(kx-1,ky+1);ctx.lineTo(ex-1,ey);ctx.stroke();
 if(endCol){ctx.fillStyle=line;ctx.beginPath();ctx.arc(ex,ey,endR+1.5,0,7);ctx.fill();ctx.fillStyle=endCol;ctx.beginPath();ctx.arc(ex,ey,endR,0,7);ctx.fill();}
 LEND.x=ex;LEND.y=ey;}
function lBraid(g){var p=BY2.lysa.palette,i;g.strokeStyle=p.line;g.lineWidth=1.5;
 g.fillStyle=p.hairShade;for(i=0;i<6;i++){g.beginPath();g.ellipse(-9-i*1.2,4+i*6,4.2-i*0.3,3.8,0.3,0,7);g.fill();g.stroke();}
 g.fillStyle=p.crystal;g.beginPath();g.moveTo(-15,38);g.lineTo(-12,44);g.lineTo(-17,44);g.closePath();g.fill();g.stroke();
}
function lHead(g,blink){var p=BY2.lysa.palette,i;g.strokeStyle=p.line;g.lineWidth=1.5;
 g.fillStyle=p.skin;g.beginPath();g.moveTo(-8,-6);g.quadraticCurveTo(-9,6,-2,11);g.quadraticCurveTo(4,13,8,6);g.quadraticCurveTo(10,0,9,-6);g.quadraticCurveTo(0,-14,-8,-6);g.fill();g.stroke();
 g.fillStyle='#ffa0b8';g.globalAlpha=0.35;g.beginPath();g.ellipse(5,4.4,2.2,1.2,0,0,7);g.fill();g.globalAlpha=1;
 if(blink){g.lineWidth=1.5;g.beginPath();g.moveTo(1,0.5);g.quadraticCurveTo(4,2.5,7,0.5);g.stroke();}
 else{g.fillStyle='#fff';g.beginPath();g.moveTo(0.5,-2.6);g.quadraticCurveTo(4,-4.6,7.5,-2.6);g.lineTo(7.5,3);g.quadraticCurveTo(4,4.5,0.8,3);g.closePath();g.fill();
  var gr=g.createLinearGradient(0,-3,0,4);gr.addColorStop(0,p.line);gr.addColorStop(0.5,p.eye);gr.addColorStop(1,'#e8fbff');g.fillStyle=gr;g.beginPath();g.ellipse(4.6,0.5,2.3,3.2,0,0,7);g.fill();
  g.fillStyle='#fff';g.beginPath();g.arc(5.5,-1,0.9,0,7);g.fill();g.beginPath();g.arc(3.8,2,0.4,0,7);g.fill();
  g.strokeStyle=p.line;g.lineWidth=1.7;g.beginPath();g.moveTo(0,-2.8);g.quadraticCurveTo(4,-5.4,8.2,-3);g.stroke();g.lineWidth=0.8;g.beginPath();g.moveTo(8.2,-3);g.lineTo(9.8,-4.4);g.moveTo(7.5,-3.6);g.lineTo(8.6,-5.2);g.stroke();}
 g.strokeStyle=p.hairShade;g.lineWidth=1.1;g.beginPath();g.moveTo(2,-6.5);g.quadraticCurveTo(5,-7.8,8,-6.6);g.stroke();
 g.strokeStyle='#d07a8a';g.lineWidth=1.1;g.beginPath();g.moveTo(5,7);g.quadraticCurveTo(6.4,7.8,7.6,6.8);g.stroke();
 g.fillStyle=p.hair;g.strokeStyle=p.line;g.lineWidth=1.5;g.beginPath();g.moveTo(-10,4);g.bezierCurveTo(-13,-12,-2,-17,5,-15);g.bezierCurveTo(11,-13,13,-7,10,-2);g.quadraticCurveTo(6,-8,1,-6);g.quadraticCurveTo(-2,-3,-3,2);g.quadraticCurveTo(-5,-2,-6,8);g.closePath();g.fill();g.stroke();
 g.beginPath();g.moveTo(9,-4);g.quadraticCurveTo(12,4,9,12);g.quadraticCurveTo(8,4,7,-2);g.closePath();g.fill();g.stroke();
 g.strokeStyle='#fff';g.lineWidth=1.3;g.globalAlpha=0.9;g.beginPath();g.arc(1,-6,8,-2.6,-1.7);g.stroke();g.globalAlpha=1;
 g.fillStyle=p.crystal;g.strokeStyle='#3a6fb0';g.lineWidth=1;var T=[[-8,-12,5],[-4,-14,7],[1,-15,10],[6,-14,7],[9,-12,5]];
 for(i=0;i<T.length;i++){var tx=T[i][0],ty=T[i][1],h=T[i][2];g.beginPath();g.moveTo(tx-1.8,ty+1);g.lineTo(tx,ty-h);g.lineTo(tx+1.8,ty+1);g.closePath();g.fill();g.stroke();}
 g.strokeStyle='#bfeaff';g.lineWidth=1.6;g.beginPath();g.moveTo(-9,-11);g.quadraticCurveTo(1,-16,10,-11);g.stroke();
 g.fillStyle='#5fd0ff';g.beginPath();g.moveTo(1,-17);g.lineTo(2.4,-14.5);g.lineTo(1,-12);g.lineTo(-0.4,-14.5);g.closePath();g.fill();}
function lCape(ctx,p,nx,ny,hipY,wv,state){var fl=state==='walk'||state==='jump'||state==='kick'?1.4:state==='ultimate'?1.8:1;
 ctx.fillStyle=p.cape;ctx.strokeStyle='#6fa8dc';ctx.lineWidth=1.4;ctx.globalAlpha=0.55;
 ctx.beginPath();ctx.moveTo(nx-2,ny);ctx.quadraticCurveTo(nx-24,hipY-6+wv*4,nx-30*fl+wv*5,hipY+30);ctx.lineTo(nx-22*fl,hipY+34+wv*2);ctx.lineTo(nx-14*fl+wv*2,hipY+30);ctx.lineTo(nx-6,hipY+34);ctx.lineTo(nx+4,ny+4);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.globalAlpha=0.8;ctx.strokeStyle='#ffffff';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(nx-8,ny+8);ctx.quadraticCurveTo(nx-18,hipY+6,nx-22*fl+wv*3,hipY+28);ctx.stroke();ctx.globalAlpha=1;
 snowflake(ctx,nx-16*fl+wv*3,hipY+16,4,0,'#ffffff',0.9);}
function lBoot(ctx,p,an){ctx.save();ctx.translate(LEND.x,LEND.y);ctx.rotate(-an*0.6);
 ctx.fillStyle=p.boots;ctx.strokeStyle=p.line;ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-3.5,-6);ctx.lineTo(3.5,-6);ctx.lineTo(4,-1);ctx.lineTo(10,2);ctx.lineTo(9,4);ctx.lineTo(-1,4);ctx.lineTo(-3,6);ctx.lineTo(-4,4);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.fillStyle='#ffffff';ctx.fillRect(-3,-6,6.5,1.6);ctx.restore();}
function drawLysa(ctx,ch,state,t){var p=ch.palette,o=lPose(state,t),i;
 shadow(ctx,22,5,0.28);ctx.translate(0,state==='jump'?-14:0);
 var aA=(state==='special'?0.8:state==='ultimate'?1:state==='block'?0.4:0.2)*(0.8+0.2*Math.sin(t*0.3));
 blit(ctx,glow(p.aura,64),0,-46,state==='ultimate'?1.7:1.15,aA);
 ctx.fillStyle='#ffffff';for(i=0;i<6;i++){var ph=(t*0.01+rng(i))%1;ctx.globalAlpha=0.8*(1-ph);ctx.fillRect(-26+rng(i+4)*52+Math.sin(t*0.05+i)*4,-90+ph*80,2,2);}ctx.globalAlpha=1;
 var hipY=-36-o.bob+(state==='block'?4:0),hx=0,lean=o.lean,nx=hx+Math.sin(lean)*30,ny=hipY-Math.cos(lean)*30,wv=Math.sin(t*0.16);
 lCape(ctx,p,nx,ny,hipY,wv,state);
 put(ctx,sprite('l_braid',48,64,24,22,lBraid),nx+1,ny-8,state==='hurt'?-0.3:lean*0.5);
 ctx.fillStyle=p.outfitShade;ctx.strokeStyle=p.line;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(hx-9,hipY);ctx.quadraticCurveTo(hx-18,hipY+18,hx-22+wv*2,hipY+34);ctx.lineTo(hx-6,hipY+30);ctx.lineTo(hx+2,hipY);ctx.closePath();ctx.fill();ctx.stroke();
 lLimb(ctx,nx-3,ny+3,o.bs,o.be,13,12,5.5,4.8,p.skinShade,p.skinShade,p.line,p.glove,3.4);
 lLimb(ctx,hx-3,hipY,o.bh,o.bk,17,17,6.5,5.5,p.pantsShade,p.pantsShade,p.line,null,0);lBoot(ctx,p,o.bh+o.bk);
 ctx.save();ctx.translate(hx,hipY);ctx.rotate(lean);
 ctx.fillStyle=p.outfit;ctx.strokeStyle=p.line;ctx.lineWidth=1.7;ctx.beginPath();ctx.moveTo(-7,2);ctx.lineTo(-9,-26);ctx.quadraticCurveTo(0,-32,9,-26);ctx.lineTo(7,2);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.fillStyle=p.outfitShade;ctx.beginPath();ctx.moveTo(-7,2);ctx.lineTo(-9,-26);ctx.lineTo(-4,-26);ctx.lineTo(-2,2);ctx.fill();
 ctx.fillStyle=p.skin;ctx.beginPath();ctx.moveTo(-6,-28);ctx.quadraticCurveTo(0,-22,8,-27);ctx.lineTo(7,-30);ctx.quadraticCurveTo(0,-32,-7,-29);ctx.fill();
 ctx.strokeStyle=p.trim;ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-8,-26);ctx.quadraticCurveTo(0,-20,8,-26);ctx.stroke();
 blit(ctx,glow('#bff0ff',24),1,-15,0.6,0.8);snowflake(ctx,1,-15,4.5,t*0.02,'#ffffff',1.2);
 ctx.fillStyle=p.outfit;ctx.strokeStyle=p.line;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-8,0);ctx.quadraticCurveTo(-14,10,-15+wv,18);ctx.lineTo(-6,15);ctx.lineTo(2,19);ctx.lineTo(8,10);ctx.lineTo(7,0);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.strokeStyle=p.trim;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-15+wv,18);ctx.lineTo(-6,15);ctx.lineTo(2,19);ctx.lineTo(8,10);ctx.stroke();
 ctx.fillStyle='#e8fbff';ctx.fillRect(-7,-2,14,3.4);ctx.strokeStyle=p.line;ctx.lineWidth=1;ctx.strokeRect(-7,-2,14,3.4);
 ctx.restore();
 var bl=(t%200)<6,hy=ny-10,hxx=nx+1;
 put(ctx,sprite(bl?'l_head_b':'l_head_o',48,64,24,22,lHead,bl),hxx,hy+2,state==='hurt'?-0.3:lean*0.5);
 lLimb(ctx,hx+3,hipY,o.fh,o.fk,17,17,6.5,5.5,p.pants,p.pantsShade,p.line,null,0);lBoot(ctx,p,o.fh+o.fk);
 lLimb(ctx,nx+3,ny+3,o.fs,o.fe,13,12,5.5,4.8,p.skin,p.skinShade,p.line,p.glove,3.6);
 if(state==='punch'||state==='special'||state==='ultimate'){blit(ctx,glow(p.aura,24),LEND.x+2,LEND.y,1,0.95);snowflake(ctx,LEND.x+2,LEND.y,6,t*0.1,'#ffffff',1.2);}
 if(state==='kick'){ctx.strokeStyle='#e8fbff';ctx.globalAlpha=0.7;ctx.lineWidth=3;ctx.beginPath();ctx.arc(hx,hipY,34,-1.9,-0.2);ctx.stroke();ctx.globalAlpha=1;}
 if(state==='hurt'){ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(hxx+12,hy-14);ctx.lineTo(hxx+16,hy-20);ctx.moveTo(hxx+15,hy-10);ctx.lineTo(hxx+22,hy-12);ctx.stroke();}
 if(state==='block'){ctx.fillStyle='#cfefff';ctx.strokeStyle='#4f8fd0';ctx.lineWidth=1.6;ctx.globalAlpha=0.5;ctx.beginPath();for(i=0;i<6;i++){var a=-0.5*Math.PI+i*1.0472;ctx.lineTo(22+Math.cos(a)*24,-50+Math.sin(a)*30);}ctx.closePath();ctx.fill();ctx.stroke();ctx.globalAlpha=1;snowflake(ctx,22,-50,12,0,'#ffffff',1.2);}}

/* ---------- fighter dispatch ---------- */
function drawFighter2(ctx,char,state,x,y,facing,t){var ch=typeof char==='string'?BY2[char]:(char&&BY2[char.id]);if(!ch)return false;t=t||0;
 ctx.save();ctx.translate(x,y);ctx.scale(facing,1);ctx.lineCap='round';ctx.lineJoin='round';
 if(ch.id==='gorgath')drawGorgath(ctx,ch,state,t);else if(ch.id==='bruntusk')drawBruntusk(ctx,ch,state,t);else drawLysa(ctx,ch,state,t);
 ctx.restore();return true;}

/* ---------- special effects ---------- */
var G_MOUTH_X=104,G_MOUTH_Y=-142; // Gorgath mouth in 'special' pose, relative to feet (facing right)
function fxGorgath(ctx,id,p){var i,k,q,R,a;
 switch(id){
 case 'ember_breath':{var mx=G_MOUTH_X,my=G_MOUTH_Y,len=ease(clamp01(p/0.3))*440,fade=p>0.82?(1-p)/0.18:1,ex=mx+len,ey=my+len*0.22;
  if(p<0.2){blit(ctx,glow('#ffb020',48),mx,my,1+p*4,1);for(i=0;i<10;i++){a=i*0.628+p*9;R=60*(1-p/0.2);ctx.fillStyle='#ffcf70';ctx.fillRect(mx+Math.cos(a)*R-1.5,my+Math.sin(a)*R-1.5,3,3);}}
  if(len>4){var ang=Math.atan2(ey-my,ex-mx),L2=Math.sqrt((ex-mx)*(ex-mx)+(ey-my)*(ey-my)),xx;ctx.save();ctx.translate(mx,my);ctx.rotate(ang);
   ctx.globalAlpha=0.55*fade;ctx.fillStyle='#3a1208';ctx.beginPath();ctx.moveTo(0,-10);for(i=0;i<=10;i++){xx=L2*i/10;ctx.lineTo(xx,-12-i*2.4-Math.sin(p*40+i*1.3)*5);}for(i=10;i>=0;i--){xx=L2*i/10;ctx.lineTo(xx,12+i*2.4+Math.sin(p*37+i*1.7)*5);}ctx.closePath();ctx.fill();
   ctx.globalAlpha=0.95*fade;ctx.fillStyle='#d4300c';ctx.beginPath();ctx.moveTo(0,-8);for(i=0;i<=10;i++){xx=L2*i/10;ctx.lineTo(xx,-8-i*1.8-Math.sin(p*50+i)*4);}for(i=10;i>=0;i--){xx=L2*i/10;ctx.lineTo(xx,8+i*1.8+Math.sin(p*45+i*1.4)*4);}ctx.closePath();ctx.fill();
   ctx.fillStyle='#ff7a12';ctx.beginPath();ctx.moveTo(0,-5);for(i=0;i<=10;i++){xx=L2*i/10;ctx.lineTo(xx,-5-i*1.1-Math.sin(p*60+i*2)*2);}for(i=10;i>=0;i--){xx=L2*i/10;ctx.lineTo(xx,5+i*1.1+Math.sin(p*55+i)*2);}ctx.closePath();ctx.fill();
   ctx.fillStyle='#ffd27a';ctx.fillRect(0,-3.5,L2,7);ctx.fillStyle='#fff6d8';ctx.fillRect(0,-1.5,L2,3);
   ctx.fillStyle='#ffb020';for(i=0;i<12;i++){var fx=(rng(i)*L2+p*600)%L2,fy=(rng(i+7)-0.5)*30;ctx.beginPath();ctx.moveTo(fx,fy-4);ctx.lineTo(fx-16,fy);ctx.lineTo(fx,fy+4);ctx.closePath();ctx.fill();}
   ctx.fillStyle='#ffe6a0';for(i=0;i<16;i++){fx=(rng(i+30)*L2+p*900)%L2;fy=(rng(i+40)-0.5)*(20+fx*0.12);ctx.fillRect(fx,fy,2.5,2.5);}
   ctx.restore();ctx.globalAlpha=1;
   speedLines(ctx,mx+len*0.6,my+len*0.13,120,10,'#ffcf70',0.6*fade,1,70);
   blit(ctx,glow('#ff9020',64),mx+6,my,1.1,fade);
   if(p>0.3){burst(ctx,ex,ey,34+Math.sin(p*60)*6,'#ff5a10','#fff3b0',fade,11,p*6);blit(ctx,glow('#ff6a12',64),ex,ey,1.4,0.8*fade);
    ctx.fillStyle='#2a1a14';ctx.globalAlpha=0.6*fade;for(i=0;i<6;i++){ctx.beginPath();ctx.arc(ex-10+rng(i)*30,ey-20-((p*120+rng(i+3)*60)%60),6+rng(i)*6,0,6.3);ctx.fill();}ctx.globalAlpha=1;}}
  return true;}
 case 'cinder_tail':{var cx=-10,cy=-40,sw=-0.9*Math.PI+ease(p)*2.1*Math.PI,f2=p>0.75?(1-p)/0.25:1;
  for(k=0;k<3;k++){ctx.globalAlpha=f2*(0.85-k*0.25);ctx.strokeStyle=k===0?'#fff0b0':k===1?'#ff8a20':'#c2380c';ctx.lineWidth=18-k*5;ctx.beginPath();ctx.ellipse(cx,cy,150-k*12,52-k*5,0,Math.max(-0.9*Math.PI,sw-1.6),sw);ctx.stroke();}
  ctx.globalAlpha=f2*0.6;ctx.strokeStyle='#2a1a14';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(cx,cy,164,60,0,Math.max(-0.9*Math.PI,sw-1.2),sw);ctx.stroke();ctx.globalAlpha=1;
  var tx=cx+Math.cos(sw)*150,ty=cy+Math.sin(sw)*52;blit(ctx,glow('#ff8a20',48),tx,ty,1.2,f2);
  ctx.save();ctx.translate(tx,ty);ctx.rotate(sw+Math.PI/2);ctx.fillStyle='#d8c9a8';ctx.strokeStyle='#0b0909';ctx.lineWidth=2;ctx.globalAlpha=f2;ctx.beginPath();ctx.moveTo(-6,-6);ctx.lineTo(24,0);ctx.lineTo(-6,6);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();ctx.globalAlpha=1;
  if(p>0.35&&p<0.8){q=(p-0.35)/0.45;burst(ctx,130,-30,26+q*30,'#ff7a1a','#fff3b0',1-q,10,q*3);speedLines(ctx,150,-34,70,8,'#ffe0a0',0.8*(1-q),1,50);}
  ctx.fillStyle='#8a7a62';for(i=0;i<10;i++){var da=rng(i)*6.28,dd=60+p*120*rng(i+3);ctx.globalAlpha=0.6*f2;ctx.beginPath();ctx.ellipse(cx+Math.cos(da)*dd,-4-rng(i+9)*10*p,10*p+3,4,0,0,6.3);ctx.fill();}ctx.globalAlpha=1;
  return true;}
 case 'magma_stomp':{burst(ctx,10,-4,p<0.2?p/0.2*44:44,'#ff6a12','#ffe6a0',p<0.3?1:Math.max(0,1-(p-0.3)*1.6),10,0.2);
  R=30+ease(p)*130;ring(ctx,10,0,R,R*0.22,'#ffd27a',6*(1-p)+1,1-p);ring(ctx,10,0,R*0.7,R*0.16,'#ff6a12',3,0.8*(1-p));
  ctx.strokeStyle='#ff6a12';ctx.lineWidth=3;ctx.globalAlpha=Math.min(1,p*4)*(1-p*0.8);ctx.beginPath();for(k=-1;k<=1;k+=2){ctx.moveTo(10,0);for(i=1;i<6;i++)ctx.lineTo(10+k*i*R*0.18,(i%2?3:-1));}ctx.stroke();ctx.strokeStyle='#ffe6a0';ctx.lineWidth=1;ctx.stroke();ctx.globalAlpha=1;
  for(i=0;i<8;i++){var ra=-Math.PI*(0.1+0.8*rng(i)),rd=p*(40+rng(i+5)*70);ctx.fillStyle=i%2?'#5a4a3a':'#ff8a20';ctx.fillRect(10+Math.cos(ra)*rd-3,-6+Math.sin(ra)*rd+p*p*60-3,6,6);}
  return true;}
 case 'ember_cataclysm':{var dark=Math.min(1,p*4)*(p>0.88?(1-p)/0.12:1);
  ctx.globalAlpha=0.45*dark;ctx.fillStyle='#2a0800';ctx.fillRect(-1200,-600,2600,700);ctx.globalAlpha=1;
  if(p<0.35){q=p/0.35;for(i=0;i<7;i++){var sx=-60+i*14,h=q*(80+rng(i)*80);ctx.globalAlpha=0.8;ctx.fillStyle=i%2?'#ff6a12':'#ffb020';ctx.beginPath();ctx.moveTo(sx-6,-110+i*4);ctx.quadraticCurveTo(sx+Math.sin(p*40+i)*8,-110-h,sx+6,-110+i*4);ctx.fill();}
   ctx.globalAlpha=1;blit(ctx,glow('#ff8a20',96),-20,-120,0.8+q*0.6,0.45);}
  else{q=(p-0.35)/0.65;R=40+ease(q)*420;ring(ctx,0,0,R,R*0.2,'#ffe6a0',8*(1-q)+1,1-q);ring(ctx,0,0,R*0.75,R*0.15,'#ff5a10',5,0.9*(1-q));
   burst(ctx,10,-10,q<0.15?q/0.15*80:80,'#ff5a10','#fff3b0',1-q,14,q*2);
   ctx.strokeStyle='#ff6a12';ctx.lineWidth=4;ctx.globalAlpha=dark;ctx.beginPath();for(k=-1;k<=1;k+=2){ctx.moveTo(0,0);for(i=1;i<12;i++)ctx.lineTo(k*Math.min(R,i*40),(i%2?4:-2));}ctx.stroke();ctx.strokeStyle='#fff0b0';ctx.lineWidth=1.4;ctx.stroke();ctx.globalAlpha=1;
   for(k=-1;k<=1;k+=2)for(i=0;i<6;i++){var st=0.05+i*0.08,lp=(q-st)/0.4;if(lp<=0||lp>=1)continue;var px=k*(70+i*65),ph=(lp<0.3?lp/0.3:1-(lp-0.3)/0.7)*(120+rng(i+k)*60),pw=14;
    blit(ctx,glow('#ff6a12',48),px,-ph*0.5,1.2,0.8);ctx.fillStyle='#c2280c';ctx.beginPath();ctx.moveTo(px-pw,0);ctx.quadraticCurveTo(px-pw*0.6+Math.sin(p*50+i)*4,-ph*0.6,px,-ph);ctx.quadraticCurveTo(px+pw*0.6,-ph*0.6,px+pw,0);ctx.fill();
    ctx.fillStyle='#ff9a20';ctx.beginPath();ctx.moveTo(px-pw*0.55,0);ctx.quadraticCurveTo(px,-ph*0.5,px,-ph*0.85);ctx.quadraticCurveTo(px+2,-ph*0.5,px+pw*0.55,0);ctx.fill();ctx.fillStyle='#fff0b0';ctx.fillRect(px-2,-ph*0.6,4,ph*0.6);
    ctx.fillStyle='#ffcf70';for(var e=0;e<4;e++)ctx.fillRect(px+(rng(i*4+e)-0.5)*40,-ph-rng(e+i)*30*lp,3,3);}}
  return true;}}
 return false;}
function fxBruntusk(ctx,id,p){var i,k,q,R;
 switch(id){
 case 'boulder_hurl':{var bs=sprite('b_boulder',70,60,35,30,bBoulder);
  if(p<0.25){put(ctx,bs,6,-196,0);ctx.fillStyle='#3a2f22';ctx.beginPath();ctx.ellipse(40,0,26,6,0,0,6.3);ctx.fill();
   ctx.fillStyle='#6f665c';for(i=0;i<6;i++){ctx.fillRect(30+rng(i)*30,-10-p*80*rng(i+2),5,5);}}
  else if(p<0.85){q=(p-0.25)/0.6;var bx=6+q*380,by=-196+q*182-Math.sin(q*Math.PI)*90;
   ctx.fillStyle='#000';ctx.globalAlpha=0.25;ctx.beginPath();ctx.ellipse(bx,0,20+q*14,5+q*2,0,0,6.3);ctx.fill();ctx.globalAlpha=1;
   var an=Math.atan2(182-Math.cos(q*Math.PI)*90*Math.PI,380);
   ctx.save();ctx.translate(bx,by);ctx.rotate(an);speedLines(ctx,-24,0,90,10,'#e9d7a8',0.75,1,40);ctx.restore();
   ctx.fillStyle='#5f8a35';for(i=0;i<5;i++){ctx.globalAlpha=0.8-i*0.15;ctx.beginPath();ctx.ellipse(bx-34-i*18,by-(i+1)*12*Math.cos(q*Math.PI),4,2,i,0,6.3);ctx.fill();}ctx.globalAlpha=1;
   put(ctx,bs,bx,by,q*9);}
  else{q=(p-0.85)/0.15;ctx.fillStyle='#3a2f22';ctx.beginPath();ctx.ellipse(386,0,36,8,0,0,6.3);ctx.fill();
   burst(ctx,386,-16,30+q*40,'#c9a64a','#fff2c0',1-q*0.6,10,q);
   for(i=0;i<12;i++){var sa=-Math.PI*(0.08+0.84*rng(i)),sd=q*(50+rng(i+5)*80);ctx.fillStyle=i%3===0?'#5f8a35':i%2?'#6f665c':'#8e857a';ctx.save();ctx.translate(386+Math.cos(sa)*sd,-14+Math.sin(sa)*sd+q*q*50);ctx.rotate(i+q*4);ctx.fillRect(-5,-4,10,8);ctx.strokeStyle='#0e0a08';ctx.lineWidth=1.2;ctx.strokeRect(-5,-4,10,8);ctx.restore();}
   ctx.fillStyle='#c8b88a';ctx.globalAlpha=0.5*(1-q);ctx.beginPath();ctx.ellipse(386,-12,50+q*30,18+q*8,0,0,6.3);ctx.fill();ctx.globalAlpha=1;}
  return true;}
 case 'canopy_crash':{var lx=150;
  if(p<0.5){q=p/0.5;ctx.fillStyle='#000';ctx.globalAlpha=0.15+0.3*q;ctx.beginPath();ctx.ellipse(lx,0,30+q*50,6+q*8,0,0,6.3);ctx.fill();ctx.globalAlpha=1;
   ctx.strokeStyle='#e9f0c0';ctx.lineWidth=2;ctx.globalAlpha=0.7*q;ctx.beginPath();for(i=0;i<12;i++){var vx2=lx+(rng(i)-0.5)*120,vy2=-260+((rng(i+3)*200+q*400)%200);ctx.moveTo(vx2,vy2);ctx.lineTo(vx2,vy2-40);}ctx.stroke();ctx.globalAlpha=1;
   ctx.fillStyle='#5f8a35';for(i=0;i<8;i++){ctx.beginPath();ctx.ellipse(lx+(rng(i+20)-0.5)*160+Math.sin(q*6+i)*10,-220+q*200*rng(i+2),5,2.4,q*5+i,0,6.3);ctx.fill();}
   ring(ctx,lx,0,40+q*30,8+q*6,'#ff5a2a',2,q*0.8);}
  else{q=(p-0.5)/0.5;ctx.fillStyle='#2a2016';ctx.beginPath();ctx.ellipse(lx,0,80+q*14,15,0,0,6.3);ctx.fill();
   R=30+ease(q)*220;ring(ctx,lx,0,R,R*0.24,'#fff2c0',7*(1-q)+1,1-q);ring(ctx,lx,0,R*0.7,R*0.17,'#ff5a2a',3,0.8*(1-q));
   burst(ctx,lx,-26,46+q*60,'#ff7a2a','#fff2c0',1-q*0.8,14,q);
   for(i=0;i<8;i++){spike(ctx,lx+(i-3.5)*30,0,11,(1-q)*(30+rng(i)*40),'#6f665c','#8e857a','#0e0a08');}
   for(i=0;i<14;i++){var aa=-Math.PI*(0.05+0.9*rng(i)),ds=q*(60+rng(i+1)*150);ctx.fillStyle=i%3===0?'#5f8a35':'#7a6a55';ctx.fillRect(lx+Math.cos(aa)*ds-4,-20+Math.sin(aa)*ds+q*q*120-4,8,8);}
   ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.globalAlpha=1-q;ctx.beginPath();for(i=0;i<10;i++){var ang2=-Math.PI*(i/9);ctx.moveTo(lx+Math.cos(ang2)*(R*0.4),-20+Math.sin(ang2)*R*0.3);ctx.lineTo(lx+Math.cos(ang2)*(R*0.6),-20+Math.sin(ang2)*R*0.45);}ctx.stroke();ctx.globalAlpha=1;}
  return true;}
 case 'war_drum':{var cxd=30,cyd=-110;for(i=0;i<4;i++){var rp=(p*2+i*0.25)%1;ring(ctx,cxd,cyd,20+rp*110,14+rp*76,i%2?'#ff5a2a':'#ffd23a',4*(1-rp)+1,(1-rp)*0.9);}
  burst(ctx,cxd,cyd,26+Math.sin(p*40)*6,'#ff5a2a','#fff3c0',0.85*(1-p*0.5),9,p*4);
  blit(ctx,glow('#ff5a2a',96),cxd,cyd+30,1.4,0.6*(1-p*0.4));
  ctx.fillStyle='#ffd23a';for(i=0;i<12;i++){var ph2=(p*1.5+rng(i))%1,bx2=-40+rng(i+5)*140;ctx.globalAlpha=1-ph2;ctx.beginPath();ctx.moveTo(bx2,-20-ph2*160);ctx.lineTo(bx2+3,-30-ph2*160);ctx.lineTo(bx2+6,-20-ph2*160);ctx.fill();}ctx.globalAlpha=1;
  return true;}
 case 'ground_pound':{var gx=70;burst(ctx,gx,-6,p<0.2?p/0.2*40:40,'#c9a64a','#fff2c0',p<0.3?1:Math.max(0,1-(p-0.3)*1.6),10,0.4);
  R=20+ease(p)*120;ring(ctx,gx,0,R,R*0.22,'#fff2c0',5*(1-p)+1,1-p);
  for(k=-1;k<=1;k+=2)for(i=0;i<4;i++){var lp2=(p-i*0.08)/0.4;if(lp2<=0)continue;spike(ctx,gx+k*(30+i*26),0,9,(lp2<0.3?lp2/0.3:Math.max(0,1-(lp2-0.3)/0.7))*(22+rng(i)*14),'#6f665c','#8e857a','#0e0a08');}
  ctx.fillStyle='#c8b88a';ctx.globalAlpha=0.5*(1-p);ctx.beginPath();ctx.ellipse(gx,-8,40+p*60,10+p*10,0,0,6.3);ctx.fill();ctx.globalAlpha=1;
  return true;}
 case 'primal_rampage':{var dk=Math.min(1,p*4)*(p>0.9?(1-p)/0.1:1);
  ctx.globalAlpha=0.4*dk;ctx.fillStyle='#3a0606';ctx.fillRect(-1200,-600,2600,700);ctx.globalAlpha=1;
  for(i=0;i<10;i++){var fx2=-70+i*16,fh2=60+rng(i)*60+Math.sin(p*30+i)*16;ctx.globalAlpha=0.5*dk;ctx.fillStyle=i%2?'#ff4a1a':'#ffb020';ctx.beginPath();ctx.moveTo(fx2-12,0);ctx.quadraticCurveTo(fx2+Math.sin(p*20+i)*10,-fh2*1.6,fx2+12,0);ctx.fill();}ctx.globalAlpha=1;
  if(p<0.4){q=p/0.4;for(i=0;i<3;i++){var r2=(q*2+i/3)%1;ring(ctx,20,-110,20+r2*130,14+r2*90,'#ffd23a',5*(1-r2)+1,(1-r2));}burst(ctx,20,-110,34,'#ff4a1a','#fff3c0',0.9,10,q*6);
   ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.globalAlpha=0.7;ctx.beginPath();for(i=0;i<14;i++){var a4=i/14*6.283;ctx.moveTo(20+Math.cos(a4)*80,-110+Math.sin(a4)*62);ctx.lineTo(20+Math.cos(a4)*140,-110+Math.sin(a4)*105);}ctx.stroke();ctx.globalAlpha=1;}
  else{for(k=0;k<3;k++){var lq=(p-0.4-k*0.18)/0.3;if(lq<=0||lq>=1)continue;var sxk=60+lq*300;
    burst(ctx,60,-6,lq<0.2?lq/0.2*40:40*(1-lq),'#ff4a1a','#fff3c0',1-lq,10,k);
    ctx.fillStyle='#ff6a2a';ctx.globalAlpha=1-lq*0.7;ctx.beginPath();ctx.moveTo(sxk-50,0);ctx.quadraticCurveTo(sxk-10,-50*(1-lq*0.5),sxk+16,0);ctx.closePath();ctx.fill();
    ctx.fillStyle='#ffe6a0';ctx.beginPath();ctx.moveTo(sxk-30,0);ctx.quadraticCurveTo(sxk-6,-30*(1-lq*0.5),sxk+10,0);ctx.closePath();ctx.fill();ctx.globalAlpha=1;
    for(i=0;i<3;i++)spike(ctx,sxk-20-i*30,0,9,(1-lq)*(24-i*6),'#6f665c','#8e857a','#0e0a08');
    speedLines(ctx,sxk-30,-20,60,6,'#fff',0.6*(1-lq),1,30);}}
  return true;}}
 return false;}
function fxLysa(ctx,id,p){var i,k,q;
 switch(id){
 case 'frost_bloom':{var fxp=170,gq=clamp01(p/0.25),bl=clamp01((p-0.2)/0.35),fd=p>0.85?(1-p)/0.15:1;
  ctx.globalAlpha=0.7*fd;ctx.fillStyle='#cfefff';ctx.beginPath();ctx.ellipse(fxp,0,Math.max(0.1,60*gq),Math.max(0.1,12*gq),0,0,6.3);ctx.fill();ctx.globalAlpha=fd;
  ctx.save();ctx.translate(fxp,0);ctx.scale(1,0.2);snowflake(ctx,0,0,58*gq,p,'#ffffff',4);ctx.restore();
  ctx.strokeStyle='#bfeaff';ctx.globalAlpha=0.6*(1-gq*0.5)*fd;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(20,0);ctx.lineTo(20+(fxp-20)*gq,0);ctx.stroke();ctx.globalAlpha=1;
  if(bl>0){blit(ctx,glow('#8fe0ff',64),fxp,-40*bl,1.3,0.8*fd);
   for(k=0;k<2;k++)for(i=0;i<5;i++){var pa=(i-2)*(0.42+0.18*bl)*(k?1:1.25),pl=(k?54:70)*ease(bl),pw=k?12:15;
    ctx.save();ctx.translate(fxp,-4);ctx.rotate(pa);ctx.globalAlpha=fd*(k?1:0.85);ctx.fillStyle=k?'#e8fbff':'#9fd6ff';ctx.strokeStyle='#2a5fb0';ctx.lineWidth=1.6;
    ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-pw,-pl*0.55);ctx.lineTo(0,-pl);ctx.lineTo(pw,-pl*0.55);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#ffffff';ctx.beginPath();ctx.moveTo(0,-4);ctx.lineTo(-pw*0.3,-pl*0.55);ctx.lineTo(0,-pl*0.9);ctx.closePath();ctx.fill();ctx.restore();}
   ctx.globalAlpha=fd;ctx.fillStyle='#ffffff';ctx.strokeStyle='#2a5fb0';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(fxp,-22*bl,8*bl+0.1,0,6.3);ctx.fill();ctx.stroke();
   snowflake(ctx,fxp,-22*bl,7*bl,p*3,'#5fc8ff',1.4);ctx.globalAlpha=1;
   if(bl<0.5)burst(ctx,fxp,-20,30+bl*60,'#bfeaff','#ffffff',1-bl*1.6,10,0);
   ctx.fillStyle='#ffffff';for(i=0;i<10;i++){var sa2=rng(i)*6.28,sr=30+bl*60*rng(i+2);ctx.globalAlpha=fd*(0.5+0.5*Math.sin(p*30+i));ctx.fillRect(fxp+Math.cos(sa2)*sr,-40+Math.sin(sa2)*sr*0.7,2.5,2.5);}ctx.globalAlpha=1;}
  return true;}
 case 'glacial_palace':{var wx=72,rise=ease(clamp01(p/0.22)),sh=clamp01((p-0.72)/0.28);
  if(sh<=0){blit(ctx,glow('#8fe0ff',64),wx,-50*rise,1.3,0.7);
   var T2=[[-32,56,9],[30,62,9],[-18,84,12],[18,92,12],[0,120,16]];
   for(i=0;i<T2.length;i++){var tx2=wx+T2[i][0],th=T2[i][1]*rise,tw=T2[i][2];if(th<2)continue;
    ctx.fillStyle='#bfe8ff';ctx.strokeStyle='#2a5fb0';ctx.lineWidth=2;ctx.globalAlpha=0.92;ctx.beginPath();ctx.moveTo(tx2-tw,0);ctx.lineTo(tx2-tw,Math.min(0,-th+tw*1.6));ctx.lineTo(tx2,-th);ctx.lineTo(tx2+tw,Math.min(0,-th+tw*1.6));ctx.lineTo(tx2+tw,0);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#ffffff';ctx.globalAlpha=0.85;ctx.beginPath();ctx.moveTo(tx2-tw*0.5,-4);ctx.lineTo(tx2-tw*0.5,Math.min(-4,-th+tw*2));ctx.lineTo(tx2,-th+tw*0.6);ctx.lineTo(tx2-tw*0.1,-4);ctx.closePath();ctx.fill();
    ctx.fillStyle='#7fb8ec';ctx.globalAlpha=0.6;if(th>tw*1.8)ctx.fillRect(tx2+tw*0.3,-th+tw*1.8,tw*0.6,th-tw*1.8);}
   ctx.globalAlpha=1;snowflake(ctx,wx,-60*rise,12*rise,p*2,'#ffffff',1.6);
   if(p<0.25){ctx.fillStyle='#e8fbff';for(i=0;i<10;i++)ctx.fillRect(wx+(rng(i)-0.5)*90,-rng(i+3)*130*rise,2.5,2.5);burst(ctx,wx,-6,30*rise+8,'#bfeaff','#ffffff',1-p*3,8,0);}
   if(p>0.4&&p<0.7){q=(p-0.4)/0.3;burst(ctx,wx+26,-70,18+q*14,'#ffffff','#bfeaff',1-q,8,q*3);speedLines(ctx,wx+60,-70,40,5,'#ffffff',0.6*(1-q),-1,30);}}
  else{burst(ctx,wx,-60,40+sh*30,'#cfefff','#ffffff',1-sh,12,sh*2);
   for(i=0;i<14;i++){var sdx=wx+(rng(i)-0.5)*60+ease(sh)*(120+rng(i+4)*200),sdy=-20-rng(i+8)*110+sh*sh*60*rng(i+2),rs=6+rng(i+1)*8;
    ctx.save();ctx.translate(sdx,sdy);ctx.rotate((rng(i+11)-0.5)*0.8+sh*2);ctx.globalAlpha=1-sh*0.7;ctx.fillStyle=i%2?'#e8fbff':'#9fd6ff';ctx.strokeStyle='#2a5fb0';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-rs,0);ctx.lineTo(0,-rs*0.5);ctx.lineTo(rs*1.6,0);ctx.lineTo(0,rs*0.5);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
   ctx.globalAlpha=1;speedLines(ctx,wx+80+sh*200,-70,90,9,'#e8fbff',0.7*(1-sh),1,100);}
  return true;}
 case 'winters_decree':{var dk2=Math.min(1,p*4)*(p>0.88?(1-p)/0.12:1),sg=ease(clamp01(p/0.3)),bxs,bys;
  ctx.globalAlpha=0.5*dk2;ctx.fillStyle='#0a1a3a';ctx.fillRect(-1200,-600,2600,700);ctx.globalAlpha=1;
  ctx.save();ctx.translate(170,0);ctx.scale(1,0.22);ring(ctx,0,0,240*sg,240*sg,'#8fe0ff',5,dk2);ring(ctx,0,0,200*sg,200*sg,'#ffffff',2,dk2);ctx.globalAlpha=dk2;snowflake(ctx,0,0,220*sg,p*1.5,'#dff6ff',6);ctx.globalAlpha=1;ctx.restore();
  blit(ctx,glow('#9fe8ff',96),170,-180,1.6*sg,0.8*dk2);
  ctx.globalAlpha=dk2;snowflake(ctx,170,-180,80*sg,-p*2,'#ffffff',4);snowflake(ctx,170,-180,50*sg,p*2+0.5,'#8fe0ff',2.5);ctx.globalAlpha=1;ring(ctx,170,-180,90*sg,90*sg,'#bfeaff',2,dk2);
  if(p>0.2){var bz=clamp01((p-0.2)*3)*dk2;ctx.strokeStyle='#e8f8ff';ctx.lineWidth=2;ctx.globalAlpha=bz;ctx.beginPath();
   for(i=0;i<44;i++){bxs=-120+((rng(i)*560+p*1400)%560);bys=-280+rng(i+50)*280;ctx.moveTo(bxs,bys);ctx.lineTo(bxs-26,bys-8);}ctx.stroke();
   ctx.fillStyle='#ffffff';for(i=0;i<24;i++){bxs=-100+((rng(i+90)*520+p*900)%520);bys=-260+((rng(i+120)*260+p*300)%260);ctx.fillRect(bxs,bys,3,3);}ctx.globalAlpha=1;}
  if(p>0.55){var fz=ease(clamp01((p-0.55)/0.25))*dk2;for(i=0;i<9;i++){var ix=40+i*42,ih=fz*(30+rng(i)*50);spike(ctx,ix,0,12,ih,'#bfeaff','#ffffff','#1d4f8a');spike(ctx,ix+14,0,8,ih*0.6,'#8fd0ff','#e8f8ff','#1d4f8a');}
   if(p<0.7)burst(ctx,170,-60,60+(p-0.55)*400,'#ffffff','#bfeaff',1-(p-0.55)/0.15,16,p);}
  return true;}}
 return false;}
function drawSpecial2(ctx,moveId,progress,x,y,facing){var p=clamp01(progress);
 ctx.save();ctx.translate(x,y);ctx.scale(facing,1);ctx.lineCap='round';ctx.lineJoin='round';
 var hit=fxGorgath(ctx,moveId,p)||fxBruntusk(ctx,moveId,p)||fxLysa(ctx,moveId,p);
 ctx.globalAlpha=1;ctx.restore();return hit;}

/* ---------- warm (pre-build every cached sprite / glow) ---------- */
function warm2(){sprite('g_torso',110,110,60,90,gTorso);sprite('g_head_c',100,90,44,52,gHead,0);sprite('g_head_m',100,90,44,52,gHead,0.22);sprite('g_head_o',100,90,44,52,gHead,0.5);
 sprite('b_torso',110,120,50,110,bTorso);sprite('b_pad',40,30,20,20,bPad);sprite('b_boulder',70,60,35,30,bBoulder);
 sprite('b_head_closed',80,70,30,40,bHead,'closed');sprite('b_head_open',80,70,30,40,bHead,'open');sprite('b_head_rage',80,70,30,40,bHead,'rage');
 sprite('l_braid',48,64,24,22,lBraid);sprite('l_head_o',48,64,24,22,lHead,false);sprite('l_head_b',48,64,24,22,lHead,true);
 var G=[['#ff6a12',64],['#ff6a12',48],['#ffd27a',24],['#ffb020',48],['#ff9020',64],['#ff8a20',48],['#ff8a20',96],['#ff5a2a',64],['#ff5a2a',96],['#8fe0ff',64],['#9fe8ff',96],['#bff0ff',24],['#a8e6ff',64],['#a8e6ff',24]];
 for(var i=0;i<G.length;i++)glow(G[i][0],G[i][1]);}

/* ---------- merge into LaneBrawlerChars ---------- */
var API=BASE||{CHARS:[],byId:{},STATES:STATES,SPECIALS:{},drawFighter:function(){},drawSpecial:function(){},warm:function(){}};
if(!API.__pack2){
 var oF=API.drawFighter,oS=API.drawSpecial,oW=API.warm;
 for(i=0;i<CHARS2.length;i++){if(!API.byId[CHARS2[i].id]){API.CHARS.push(CHARS2[i]);API.byId[CHARS2[i].id]=CHARS2[i];}}
 for(var key in SPECIALS2)API.SPECIALS[key]=SPECIALS2[key];
 API.EXTRA_FX=EXTRA_FX;API.PACK2_IDS=['gorgath','bruntusk','lysa'];
 API.drawFighter=function(ctx,char,state,x,y,facing,t){if(!drawFighter2(ctx,char,state,x,y,facing,t))oF(ctx,char,state,x,y,facing,t);};
 API.drawSpecial=function(ctx,moveId,progress,x,y,facing){if(!drawSpecial2(ctx,moveId,progress,x,y,facing))oS(ctx,moveId,progress,x,y,facing);};
 API.warm=function(){if(oW)oW();warm2();};
 API.__pack2=true;}
if(typeof window!=='undefined')window.LaneBrawlerChars=API;
if(typeof module!=='undefined'&&module.exports)module.exports=API;
})(this);
