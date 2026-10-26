/* Lane Brawlers - Character Pack (original characters, procedural anime-style art).
   Plain browser JS, no deps. window.LaneBrawlerChars / module.exports.
   Coordinates: x,y = feet position on screen, facing +1 (right) / -1 (left). ~92px tall fighters
   (Gorran ~106px) to match lf2-clone's 800x450 canvas. */
(function(root){
'use strict';
var CHARS=[
 {id:'ryn',name:'Ryn Solkar',dynasty:'Sun Dynasty of Aurath',role:'Rushdown',
  palette:{skin:'#f6cfa8',skinShade:'#d99a74',hair:'#ff7a1a',hairShade:'#c2380c',hairLight:'#ffd04a',eye:'#ff3d00',
   outfit:'#c8102e',outfitShade:'#7d0a1d',trim:'#ffc93c',pants:'#2b2233',pantsShade:'#17121d',boots:'#5a2a12',aura:'#ffa830',line:'#2a0f08'},
  hair:'spiky',scale:1.0,
  stats:{hp:480,speed:3.4,run:7.0,jump:11.5,power:1.0,mp:100,mpRegen:0.12},
  moves:[
   {id:'punch',name:'Ember Jab',input:'A (A,A,A combo)',mp:0,dmg:[16,16,24],effect:'3-hit string; 3rd hit small knockback'},
   {id:'kick',name:'Flare Kick',input:'S',mp:0,dmg:24,effect:'knockback 5, launches slightly'},
   {id:'jump_attack',name:'Falling Sunspike',input:'D then A or S (airborne)',mp:0,dmg:28,effect:'downward kick, knockdown'},
   {id:'run_attack',name:'Dash Elbow',input:'run (→→ hold) + A',mp:0,dmg:30,effect:'knockback 7'},
   {id:'block',name:'Guard',input:'hold F',mp:0,dmg:0,effect:'front hits deal 15%'},
   {id:'sun_comet',name:'Sun Comet',input:'hold S + A',mp:25,dmg:45,effect:'flame-comet projectile, burn 3x4 dmg, knockback 6',special:true},
   {id:'solar_rise',name:'Solar Rise',input:'hold S + ↑ + A',mp:30,dmg:55,effect:'rising flame uppercut, anti-air, launch + burn',special:true},
   {id:'supernova_rush',name:'ULT: Supernova Rush',input:'hold S + D + A (MP ≥ 80)',mp:80,dmg:160,effect:'dash through foe, 8-hit flurry, final sun-burst explosion, burn',ultimate:true}
  ],
  lore:'The youngest flame-sworn of the Sun Dynasty, Ryn was raised in the brass temple-forges of Aurath where fire is prayer. When the eternal brazier was stolen he left with nothing but his wraps and a temper hotter than the sun. He fights close and fast, believing any fight should end before the opponent can breathe.'},
 {id:'mireya',name:'Mireya Tsukane',dynasty:'Moon Dynasty of Selvaris',role:'Zoner',
  palette:{skin:'#f3dcd0',skinShade:'#c9a2a0',hair:'#cfe6ff',hairShade:'#6f8fd6',hairLight:'#ffffff',eye:'#38b6ff',
   outfit:'#2b3f8f',outfitShade:'#17214f',trim:'#bfe9ff',pants:'#e8f2ff',pantsShade:'#9fb3d8',boots:'#1b2550',aura:'#7fd4ff',line:'#0b1230'},
  hair:'flowing',scale:1.0,
  stats:{hp:440,speed:3.0,run:6.0,jump:12.0,power:0.9,mp:120,mpRegen:0.18},
  moves:[
   {id:'punch',name:'Rime Palm',input:'A (A,A combo)',mp:0,dmg:[14,20],effect:'2-hit, long reach palm'},
   {id:'kick',name:'Crescent Kick',input:'S',mp:0,dmg:22,effect:'wide arc, knockback 4'},
   {id:'jump_attack',name:'Moonfall Heel',input:'D then A or S (airborne)',mp:0,dmg:24,effect:'slow 15% for 1s'},
   {id:'run_attack',name:'Glide Slash',input:'run + A',mp:0,dmg:24,effect:'slides under projectiles'},
   {id:'block',name:'Lunar Ward',input:'hold F',mp:0,dmg:0,effect:'front hits 15%; +3 MP per blocked hit'},
   {id:'frost_lance',name:'Frost Lance',input:'hold S + A',mp:25,dmg:40,effect:'ice spikes erupt along the lane (240px), freeze 40 ticks',special:true},
   {id:'moon_mirror',name:'Moon Mirror',input:'hold S + ↓ + A',mp:30,dmg:30,effect:'crescent ice wall: reflects projectiles, then flies forward, chill slow',special:true},
   {id:'eclipse_blizzard',name:'ULT: Eclipse Blizzard',input:'hold S + D + A (MP ≥ 80)',mp:80,dmg:140,effect:'full-screen blizzard under a black moon, ice shards rain 10 hits, freeze 90 ticks',ultimate:true}
  ],
  lore:'Heir to the silent observatories of Selvaris, Mireya was taught that the Moon Dynasty wins by never being touched. She carries her mother\'s cracked moonstone, which hums with frost whenever the Sun Dynasty draws near. Patient and precise, she controls space and lets her opponents freeze in their own mistakes.'},
 {id:'gorran',name:'Gorran Basaltheart',dynasty:'Mountain Dynasty of Kholdra',role:'Grappler / Tank',
  palette:{skin:'#c98a5e',skinShade:'#8f5a3a',hair:'#3c3a36',hairShade:'#1d1c1a',hairLight:'#7d7a70',eye:'#3ddc84',
   outfit:'#556b2f',outfitShade:'#2f3d18',trim:'#d6a84a',pants:'#6b4a2e',pantsShade:'#3e2a19',boots:'#2a2622',aura:'#c9a64a',line:'#1a120a'},
  hair:'mohawk',scale:1.15,
  stats:{hp:640,speed:2.4,run:5.0,jump:9.0,power:1.3,mp:90,mpRegen:0.10},
  moves:[
   {id:'punch',name:'Boulder Fist',input:'A (A,A combo)',mp:0,dmg:[22,30],effect:'2nd hit heavy knockback 7'},
   {id:'kick',name:'Pillar Kick',input:'S',mp:0,dmg:30,effect:'armored startup (takes hit without flinching)'},
   {id:'jump_attack',name:'Rockfall Body Slam',input:'D then A or S (airborne)',mp:0,dmg:34,effect:'knockdown, small ground quake'},
   {id:'grab',name:'Mountain Grip',input:'walk into stunned foe + A',mp:0,dmg:40,effect:'throw, knockdown'},
   {id:'block',name:'Stoneguard',input:'hold F',mp:0,dmg:0,effect:'front hits 10% (better than others)'},
   {id:'quake_stomp',name:'Quake Stomp',input:'hold S + A',mp:25,dmg:50,effect:'rock spikes both directions, knockdown, unblockable low',special:true},
   {id:'avalanche_grab',name:'Avalanche Grab',input:'hold S + → + A',mp:35,dmg:65,effect:'lunging command grab, slam into crater, stun 30',special:true},
   {id:'titan_fall',name:'ULT: Titan\'s Fall',input:'hold S + D + A (MP ≥ 80)',mp:80,dmg:180,effect:'leaps off-screen and crashes down as a meteor of stone; huge AoE knockdown',ultimate:true}
  ],
  lore:'Gorran was a quarry-warden of Kholdra, the Mountain Dynasty that neither bows to the Sun nor waits for the Moon. When an avalanche buried his village he dug every survivor out with bare hands, and the mountain answered by turning his skin to living basalt. He moves slowly, but whatever he catches does not get back up quickly.'}
];
var BY={};for(var i=0;i<CHARS.length;i++)BY[CHARS[i].id]=CHARS[i];
var STATES=['idle','walk','punch','kick','jump','block','hurt','special','ultimate'];

/* ---------- offscreen caches ---------- */
function mkCanvas(w,h){if(typeof document==='undefined')return null;var c=document.createElement('canvas');c.width=w;c.height=h;return c;}
var glowCache={};
function glow(color,r){var k=color+r;if(glowCache[k])return glowCache[k];var c=mkCanvas(r*2,r*2);if(!c)return null;var g=c.getContext('2d');
 var gr=g.createRadialGradient(r,r,0,r,r,r);gr.addColorStop(0,color);gr.addColorStop(0.35,color+'aa');gr.addColorStop(1,color+'00');
 g.fillStyle=gr;g.fillRect(0,0,r*2,r*2);glowCache[k]=c;return c;}
function blit(ctx,img,x,y,s,a){if(!img)return;var w=img.width*s,h=img.height*s;ctx.globalAlpha=a;ctx.drawImage(img,x-w/2,y-h/2,w,h);ctx.globalAlpha=1;}

var HS=3; // head cache supersample
var headCache={};
function getHead(ch,blink){var k=ch.id+(blink?'b':'o');if(headCache[k])return headCache[k];
 var S=48,c=mkCanvas(S*HS,S*HS);if(!c)return null;var g=c.getContext('2d');g.scale(HS,HS);g.translate(S/2,S/2+2);
 drawHead(g,ch,blink);headCache[k]=c;return c;}
function drawHead(g,ch,blink){var p=ch.palette;g.lineJoin='round';g.lineCap='round';
 // back hair
 g.fillStyle=p.hairShade;g.strokeStyle=p.line;g.lineWidth=1.6;
 if(ch.hair==='flowing'){g.beginPath();g.moveTo(-9,-8);g.bezierCurveTo(-18,0,-16,14,-20,22);g.lineTo(-10,18);g.lineTo(-12,24);g.lineTo(-3,14);g.lineTo(2,8);g.closePath();g.fill();g.stroke();}
 // face
 g.fillStyle=p.skin;g.beginPath();g.moveTo(-8,-6);g.quadraticCurveTo(-9,6,-2,11);g.quadraticCurveTo(4,13,8,6);g.quadraticCurveTo(10,0,9,-6);g.quadraticCurveTo(0,-14,-8,-6);g.fill();g.stroke();
 // neck shade + cheek
 g.fillStyle=p.skinShade;g.globalAlpha=0.5;g.beginPath();g.moveTo(-8,-2);g.quadraticCurveTo(-7,7,-2,11);g.quadraticCurveTo(-5,4,-4,-2);g.fill();g.globalAlpha=1;
 g.fillStyle='#ff8080';g.globalAlpha=0.35;g.beginPath();g.ellipse(5,4,2.2,1.2,0,0,7);g.fill();g.globalAlpha=1;
 // ear
 g.fillStyle=p.skin;g.beginPath();g.ellipse(-6,1,2,3,0,0,7);g.fill();g.stroke();
 // eye (big anime)
 if(blink){g.strokeStyle=p.line;g.lineWidth=1.6;g.beginPath();g.moveTo(1,0);g.quadraticCurveTo(4,2,7,0);g.stroke();}
 else{g.fillStyle='#fff';g.beginPath();g.moveTo(0.5,-3);g.quadraticCurveTo(4,-5,7.5,-3);g.lineTo(7.5,3);g.quadraticCurveTo(4,4.5,0.8,3);g.closePath();g.fill();
  var gr=g.createLinearGradient(0,-3,0,4);gr.addColorStop(0,p.line);gr.addColorStop(0.45,p.eye);gr.addColorStop(1,'#fff');
  g.fillStyle=gr;g.beginPath();g.ellipse(4.6,0.4,2.3,3.3,0,0,7);g.fill();g.fillStyle=p.line;g.beginPath();g.ellipse(4.8,0.6,1,1.6,0,0,7);g.fill();
  g.fillStyle='#fff';g.beginPath();g.arc(5.6,-1.2,0.9,0,7);g.fill();g.beginPath();g.arc(3.8,2,0.45,0,7);g.fill();
  g.strokeStyle=p.line;g.lineWidth=1.8;g.beginPath();g.moveTo(0,-3.2);g.quadraticCurveTo(4,-5.6,8.2,-3.4);g.stroke();
  g.lineWidth=0.8;g.beginPath();g.moveTo(8.2,-3.4);g.lineTo(9.6,-4.4);g.stroke();}
 // brow
 g.strokeStyle=ch.id==='mireya'?p.hairShade:p.line;g.lineWidth=1.3;g.beginPath();
 if(ch.id==='ryn'){g.moveTo(1,-7.5);g.lineTo(8,-5.2);}else if(ch.id==='gorran'){g.lineWidth=2;g.moveTo(0,-6.5);g.lineTo(8.5,-5.5);}else{g.moveTo(1.5,-6.5);g.quadraticCurveTo(5,-8,8,-6.5);}g.stroke();
 // nose / mouth
 g.strokeStyle=p.skinShade;g.lineWidth=0.9;g.beginPath();g.moveTo(9,1);g.lineTo(9.6,3);g.lineTo(8.6,3.4);g.stroke();
 g.strokeStyle=p.line;g.lineWidth=1;g.beginPath();g.moveTo(4.5,7.2);g.lineTo(7.4,6.6);g.stroke();
 // front hair
 g.fillStyle=p.hair;g.strokeStyle=p.line;g.lineWidth=1.6;g.beginPath();
 if(ch.hair==='spiky'){var sp=[[-11,-2],[-19,-8],[-11,-10],[-17,-19],[-6,-14],[-5,-25],[1,-15],[8,-23],[8,-13],[16,-14],[10,-7],[12,-1],[6,-6],[3,-2],[1,-7],[-3,-1],[-5,-6],[-9,3]];
  g.moveTo(sp[0][0],sp[0][1]);for(var i=1;i<sp.length;i++)g.lineTo(sp[i][0],sp[i][1]);g.closePath();g.fill();g.stroke();
  g.fillStyle=p.hairLight;g.globalAlpha=0.8;g.beginPath();g.moveTo(-5,-20);g.lineTo(-2,-14);g.lineTo(3,-15);g.lineTo(-1,-12);g.lineTo(-6,-13);g.fill();g.globalAlpha=1;
  // headband
  g.fillStyle=p.trim;g.beginPath();g.moveTo(-9,-6);g.lineTo(9,-7);g.lineTo(9,-4.5);g.lineTo(-9,-3.5);g.closePath();g.fill();g.stroke();
  g.fillStyle=p.outfit;g.beginPath();g.moveTo(-9,-5);g.lineTo(-18,-2);g.lineTo(-15,1);g.lineTo(-20,5);g.lineTo(-9,-3);g.fill();g.stroke();}
 else if(ch.hair==='flowing'){g.moveTo(-10,2);g.bezierCurveTo(-13,-12,-4,-17,4,-15);g.bezierCurveTo(10,-14,13,-8,11,1);g.lineTo(9,-4);g.lineTo(7,2);g.lineTo(5,-5);g.quadraticCurveTo(1,-4,-1,1);g.lineTo(-3,-4);g.quadraticCurveTo(-6,0,-6,6);g.closePath();g.fill();g.stroke();
  g.strokeStyle='#ffffff';g.lineWidth=1.4;g.globalAlpha=0.9;g.beginPath();g.arc(1,-6,8,-2.6,-1.6);g.stroke();g.globalAlpha=1;
  // crescent ornament
  g.fillStyle='#fff6c8';g.strokeStyle=p.line;g.lineWidth=0.8;g.beginPath();g.arc(-6,-11,3.4,0,7);g.arc(-4.8,-12,2.8,0,7,true);g.fill('evenodd');}
 else {g.moveTo(-8,-6);g.quadraticCurveTo(0,-12,9,-6);g.lineTo(9,-8);g.lineTo(5,-12);g.lineTo(6,-17);g.lineTo(0,-14);g.lineTo(-1,-20);g.lineTo(-5,-14);g.lineTo(-9,-18);g.lineTo(-10,-11);g.lineTo(-14,-12);g.lineTo(-10,-4);g.closePath();g.fill();g.stroke();
  g.fillStyle=p.hairLight;g.globalAlpha=0.6;g.beginPath();g.moveTo(-1,-18);g.lineTo(1,-14);g.lineTo(-3,-14);g.fill();g.globalAlpha=1;
  // beard + scar
  g.fillStyle=p.hair;g.beginPath();g.moveTo(-3,9);g.quadraticCurveTo(3,15,9,6);g.lineTo(8,9);g.quadraticCurveTo(3,16,-4,11);g.fill();
  g.strokeStyle='#e8b090';g.lineWidth=0.9;g.beginPath();g.moveTo(2,-6);g.lineTo(5,3);g.stroke();}
}

/* ---------- poses ---------- */
// pose fields: lean, back arm(sh,el), front arm(sh,el), back leg(hip,knee), front leg(hip,knee), bob, crouch
// angles in radians from straight-down, positive = toward facing.
var Q=Math.PI/180;
function setPose(o,lean,bs,be,fs,fe,bh,bk,fh,fk,bob){o.lean=lean*Q;o.bs=bs*Q;o.be=be*Q;o.fs=fs*Q;o.fe=fe*Q;o.bh=bh*Q;o.bk=bk*Q;o.fh=fh*Q;o.fk=fk*Q;o.bob=bob;}
var P={lean:0,bs:0,be:0,fs:0,fe:0,bh:0,bk:0,fh:0,fk:0,bob:0};
function pose(state,t,o,ph){var s=Math.sin(t*0.12),c;ph=ph==null?0.5:ph;
 switch(state){
 case 'walk':c=Math.sin(t*0.22);setPose(o,6,-30*c+10,60,30*c+20,80,30*c-5,-10-15*Math.max(0,c),-30*c-5,-10-15*Math.max(0,-c),Math.abs(c)*2);break;
 case 'run':c=Math.sin(t*0.34);setPose(o,18,-55*c,80,55*c+10,90,45*c-10,-20-40*Math.max(0,c),-45*c-10,-20-40*Math.max(0,-c),Math.abs(c)*4);break;
 case 'punch':if(ph<0.33)setPose(o,-8,-5,60,-35,125,-18,-8,20,-14,2);else setPose(o,14,-25,75,90,2,-24,-10,24,-14,1);break;
 case 'getup':setPose(o,22,-20,40,30,60,-50,90,55,-95,-9);break;
 case 'kick':if(ph<0.33)setPose(o,-6,-40,70,10,90,-14,-6,75,-115,-3);else setPose(o,-22,-50,80,20,100,-10,-6,100,-6,0);break;
 case 'jump':if(ph<0.4)setPose(o,8,-120,70,-60,100,-30,-100,40,-110,-6);else if(ph<0.6)setPose(o,4,-140,60,-100,90,-40,-120,55,-125,-8);else setPose(o,-4,-150,40,150,-40,-14,-30,22,-40,-2);break;
 case 'block':setPose(o,-6,60,120,75,125,-25,-20,20,-25,4);break;
 case 'hurt':setPose(o,-24,-70+5*s,30,-40,40,-18,-10,15,-20,2);break;
 case 'special':setPose(o,14,-40,40,95,0,-30,-15,30,-25,5);break;
 case 'ultimate':setPose(o,-4,-140-5*s,-10,140+5*s,10,-28,-8,28,-8,-2+s);break;
 case 'stomp':setPose(o,-14,-150,-30,150,30,-8,-4,85,-95,-4);break;
 case 'slam':setPose(o,22,-30,20,35,15,-38,35,40,-40,-7);break;
 case 'rise':setPose(o,-10,-40,60,172,-6,-6,-4,75,-80,-6);break;
 case 'dash':setPose(o,28,-60,60,92,0,-50,-10,40,-30,-2);break;
 default:setPose(o,4,-12+3*s,58+4*s,22+3*s,85+4*s,-14,-8,16,-14,1.5+1.5*s);}
 return o;}

/* ---------- limb drawing ---------- */
function limb(ctx,x,y,a1,a2,l1,l2,w1,w2,col,shade,line,endCol,endR,out){
 var kx=x+Math.sin(a1)*l1,ky=y+Math.cos(a1)*l1,ex=kx+Math.sin(a1+a2)*l2,ey=ky+Math.cos(a1+a2)*l2;
 ctx.strokeStyle=line;ctx.lineWidth=w1+3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(kx,ky);ctx.lineTo(ex,ey);ctx.stroke();
 ctx.strokeStyle=col;ctx.lineWidth=w1;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(kx,ky);ctx.stroke();
 ctx.lineWidth=w2;ctx.beginPath();ctx.moveTo(kx,ky);ctx.lineTo(ex,ey);ctx.stroke();
 ctx.strokeStyle=shade;ctx.lineWidth=w2*0.35;ctx.beginPath();ctx.moveTo(x-1,y+1);ctx.lineTo(kx-1,ky+1);ctx.lineTo(ex-1,ey);ctx.stroke();
 if(endCol){ctx.fillStyle=line;ctx.beginPath();ctx.arc(ex,ey,endR+1.5,0,7);ctx.fill();ctx.fillStyle=endCol;ctx.beginPath();ctx.arc(ex,ey,endR,0,7);ctx.fill();}
 out.x=ex;out.y=ey;}
var END={x:0,y:0};
function leg(ctx,x,y,a1,a2,p,scale,front){var L=17;
 limb(ctx,x,y,a1,a2,L,L,8,6.5,front?p.pants:p.pantsShade,p.pantsShade,p.line,null,0,END);
 // boot
 var ex=END.x,ey=END.y,an=a1+a2;ctx.save();ctx.translate(ex,ey);ctx.rotate(-an*0.6);
 ctx.fillStyle=p.boots;ctx.strokeStyle=p.line;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-4,-5);ctx.lineTo(4,-5);ctx.lineTo(5,0);ctx.lineTo(10,1);ctx.lineTo(10,4);ctx.lineTo(-5,4);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
function arm(ctx,x,y,a1,a2,p,front,big){
 limb(ctx,x,y,a1,a2,13,12,big?8:6.5,big?7:5.5,front?p.skin:p.skinShade,p.skinShade,p.line,front?p.trim:p.outfitShade,big?4.6:3.6,END);}

/* ---------- main fighter draw ---------- */
function auraFor(state){return (state==='special'||state==='stomp'||state==='slam'||state==='rise'||state==='dash')?0.8:state==='ultimate'?1:state==='block'?0.35:0.18;}
function drawFighter(ctx,char,state,x,y,facing,t,anim){
 var ch=typeof char==='string'?BY[char]:char;if(!ch)return;var p=ch.palette;t=t||0;
 var o=pose(state,t,P,anim?anim.ph:null);if(anim){if(!anim.p){anim.p={};for(var kk in o)anim.p[kk]=o[kk];}else{var bk=anim.k||0.38;for(var kk2 in o)anim.p[kk2]+=(o[kk2]-anim.p[kk2])*bk;}o=anim.p;}var sc=ch.scale,big=ch.id==='gorran';
 ctx.save();ctx.translate(x,y);
 // shadow
 ctx.fillStyle='rgba(0,0,0,0.28)';ctx.beginPath();ctx.ellipse(0,0,22*sc,5*sc,0,0,7);ctx.fill();
 var air=0;ctx.translate(0,air);
 ctx.scale(facing*sc,sc);ctx.lineCap='round';ctx.lineJoin='round';
 // aura
 var aA=auraFor(state)*(0.8+0.2*Math.sin(t*0.3));blit(ctx,glow(p.aura,64),0,-46,state==='ultimate'?1.6:1.1,aA);
 if(state!=='idle'&&state!=='walk'&&state!=='punch'&&state!=='kick'&&state!=='jump'&&state!=='block'&&state!=='hurt'&&state!=='run'&&state!=='getup'){ctx.strokeStyle=p.aura;ctx.lineWidth=2;ctx.globalAlpha=0.7;for(var i=0;i<6;i++){var ph=(t*0.15+i*1.05)%1,ax=Math.sin(i*2.3)*22;ctx.beginPath();ctx.moveTo(ax,-10-ph*70);ctx.lineTo(ax+Math.sin(t*0.2+i)*3,-22-ph*70);ctx.stroke();}ctx.globalAlpha=1;}
 var hipY=-36+o.bob*-1+(state==='block'?4:0)+(state==='walk'?-o.bob:0);
 var hx=0,lean=o.lean;
 var nx=hx+Math.sin(lean)*30,ny=hipY-Math.cos(lean)*30;
 // back limbs
 arm(ctx,nx-3,ny+3,o.bs,o.be,p,false,big);
 leg(ctx,hx-3,hipY,o.bh,o.bk,p,sc,false);
 // cape / scarf / sash behind torso
 var wv=Math.sin(t*0.18);
 if(ch.id==='ryn'){ctx.fillStyle=p.trim;ctx.strokeStyle=p.line;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(hx-4,hipY-2);ctx.quadraticCurveTo(hx-16,hipY+4+wv*3,hx-22,hipY+12+wv*4);ctx.lineTo(hx-14,hipY+10);ctx.lineTo(hx-2,hipY+2);ctx.fill();ctx.stroke();}
 if(ch.id==='mireya'){ctx.fillStyle=p.outfitShade;ctx.strokeStyle=p.line;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(nx-6,ny+2);ctx.quadraticCurveTo(hx-20,hipY+wv*4,hx-24+wv*3,hipY+26);ctx.lineTo(hx-12,hipY+22);ctx.lineTo(hx-2,hipY+28);ctx.lineTo(hx+4,hipY);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle=p.trim;ctx.globalAlpha=0.6;ctx.beginPath();ctx.moveTo(hx-24+wv*3,hipY+26);ctx.lineTo(hx-12,hipY+22);ctx.lineTo(hx-14,hipY+18);ctx.fill();ctx.globalAlpha=1;}
 // torso
 ctx.save();ctx.translate(hx,hipY);ctx.rotate(lean);
 var tw=big?13:10;
 ctx.fillStyle=p.outfit;ctx.strokeStyle=p.line;ctx.lineWidth=1.8;ctx.beginPath();
 ctx.moveTo(-tw+2,2);ctx.lineTo(-tw-1,-26);ctx.quadraticCurveTo(0,-34,tw+1,-26);ctx.lineTo(tw-1,2);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.fillStyle=p.outfitShade;ctx.beginPath();ctx.moveTo(-tw+2,2);ctx.lineTo(-tw-1,-26);ctx.lineTo(-tw+5,-26);ctx.lineTo(-2,2);ctx.fill();
 if(ch.id==='ryn'){ctx.fillStyle=p.skin;ctx.beginPath();ctx.moveTo(1,-29);ctx.lineTo(7,-29);ctx.lineTo(3,-14);ctx.closePath();ctx.fill();ctx.strokeStyle=p.trim;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-tw+1,-27);ctx.lineTo(3,-12);ctx.lineTo(tw,-27);ctx.stroke();
  ctx.fillStyle=p.trim;ctx.beginPath();ctx.arc(-3,-18,3,0,7);ctx.fill();}
 if(ch.id==='mireya'){ctx.strokeStyle=p.trim;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-6,-30);ctx.lineTo(4,-8);ctx.stroke();ctx.fillStyle='#fff6c8';ctx.beginPath();ctx.arc(2,-20,3,0,7);ctx.arc(3.4,-21,2.4,0,7,true);ctx.fill('evenodd');}
 if(ch.id==='gorran'){ctx.fillStyle=p.skin;ctx.beginPath();ctx.moveTo(-2,-31);ctx.lineTo(tw,-27);ctx.lineTo(tw-1,-8);ctx.quadraticCurveTo(4,-6,-1,-12);ctx.closePath();ctx.fill();ctx.strokeStyle=p.line;ctx.lineWidth=1.4;ctx.stroke();
  ctx.strokeStyle=p.skinShade;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(3,-24);ctx.quadraticCurveTo(7,-20,11,-23);ctx.moveTo(5,-15);ctx.lineTo(10,-15);ctx.stroke();
  ctx.strokeStyle=p.trim;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(-tw,-26);ctx.lineTo(tw-2,-4);ctx.stroke();}
 // belt
 ctx.fillStyle=p.trim;ctx.strokeStyle=p.line;ctx.lineWidth=1.4;ctx.fillRect(-tw+1,-3,tw*2-2,5);ctx.strokeRect(-tw+1,-3,tw*2-2,5);
 ctx.restore();
 // head
 var hd=getHead(ch,(t%180)<6),hy=ny-10,hxx=nx+1;
 if(hd){ctx.save();ctx.translate(hxx,hy);ctx.rotate(state==='hurt'?-0.3:lean*0.5);var hs=big?0.92:1;ctx.drawImage(hd,-24*hs,-26*hs,48*hs,48*hs);ctx.restore();}
 // front limbs
 leg(ctx,hx+3,hipY,o.fh,o.fk,p,sc,true);
 arm(ctx,nx+3,ny+3,o.fs,o.fe,p,true,big);
 // hand fx
 if(state==='punch'||state==='special'||state==='rise'||state==='dash'){var fxc=glow(p.aura,24);blit(ctx,fxc,END.x+3,END.y,1,0.9);}
 if(state==='hurt'){ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(hxx+12,hy-14);ctx.lineTo(hxx+16,hy-20);ctx.moveTo(hxx+15,hy-10);ctx.lineTo(hxx+22,hy-12);ctx.stroke();}
 if(state==='block'){ctx.strokeStyle=p.aura;ctx.globalAlpha=0.55;ctx.lineWidth=3;ctx.beginPath();ctx.arc(6,-48,30,-1.1,1.1);ctx.stroke();ctx.globalAlpha=1;}
 ctx.restore();}

/* ---------- special effects ---------- */
function rng(i){var x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function speedLines(ctx,cx,cy,len,n,col,a,dir){ctx.strokeStyle=col;ctx.globalAlpha=a;ctx.lineWidth=1.5;ctx.beginPath();
 for(var i=0;i<n;i++){var yy=cy+(rng(i)-0.5)*60,l=len*(0.5+rng(i+9));ctx.moveTo(cx-dir*10,yy);ctx.lineTo(cx-dir*(10+l),yy);}ctx.stroke();ctx.globalAlpha=1;}
function burst(ctx,cx,cy,r,col,inner,a,spikes,rot){ctx.globalAlpha=a;ctx.fillStyle=col;ctx.beginPath();
 for(var i=0;i<spikes*2;i++){var ang=rot+i*Math.PI/spikes,rr=i%2?r*0.45:r*(0.8+0.3*rng(i));ctx.lineTo(cx+Math.cos(ang)*rr,cy+Math.sin(ang)*rr);}ctx.closePath();ctx.fill();
 ctx.fillStyle=inner;ctx.beginPath();for(i=0;i<spikes*2;i++){ang=rot+i*Math.PI/spikes;rr=i%2?r*0.25:r*0.5;ctx.lineTo(cx+Math.cos(ang)*rr,cy+Math.sin(ang)*rr);}ctx.closePath();ctx.fill();ctx.globalAlpha=1;}
function spike(ctx,bx,by,w,h,c1,c2,line){ctx.fillStyle=c1;ctx.strokeStyle=line;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(bx-w,by);ctx.lineTo(bx+w*0.2,by-h);ctx.lineTo(bx+w,by);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.fillStyle=c2;ctx.beginPath();ctx.moveTo(bx-w*0.2,by);ctx.lineTo(bx+w*0.2,by-h);ctx.lineTo(bx+w*0.7,by);ctx.closePath();ctx.fill();}
function ease(p){return 1-(1-p)*(1-p);}
function drawSpecial(ctx,moveId,progress,x,y,facing){var p=Math.max(0,Math.min(1,progress)),i,a,d=1;
 ctx.save();ctx.translate(x,y);ctx.scale(facing,1);ctx.lineCap='round';ctx.lineJoin='round';
 switch(moveId){
 case 'sun_comet':{var cx=30+ease(p)*360,cy=-50;
  speedLines(ctx,cx,cy,90,10,'#ffd27a',0.8*(1-p*0.5),1);
  for(i=0;i<8;i++){var tx=cx-14-i*13,ty=cy+Math.sin(p*30+i)*3;blit(ctx,glow('#ff5a10',30),tx,ty,1-i*0.1,0.6-i*0.06);}
  blit(ctx,glow('#ffb020',48),cx,cy,1,1);
  ctx.fillStyle='#ff5a10';ctx.beginPath();ctx.moveTo(cx+22,cy);ctx.quadraticCurveTo(cx,cy-24,cx-60,cy-16+Math.sin(p*50)*4);ctx.lineTo(cx-34,cy-4);ctx.lineTo(cx-70,cy+4);ctx.lineTo(cx-34,cy+8);ctx.quadraticCurveTo(cx-50,cy+20,cx-58,cy+18);ctx.quadraticCurveTo(cx,cy+24,cx+22,cy);ctx.fill();ctx.fillStyle='#ffb020';ctx.beginPath();ctx.moveTo(cx+19,cy);ctx.quadraticCurveTo(cx,cy-17,cx-40,cy-9);ctx.lineTo(cx-24,cy);ctx.lineTo(cx-40,cy+9);ctx.quadraticCurveTo(cx,cy+17,cx+19,cy);ctx.fill();ctx.fillStyle='#fff3b0';ctx.strokeStyle='#ff6a00';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx+16,cy);ctx.quadraticCurveTo(cx+4,cy-14,cx-26,cy-10+Math.sin(p*40)*3);ctx.quadraticCurveTo(cx-10,cy,cx-26,cy+10);ctx.quadraticCurveTo(cx+4,cy+14,cx+16,cy);ctx.fill();ctx.stroke();
  if(p>0.85)burst(ctx,cx+14,cy,40*(p-0.85)/0.15+10,'#ff7a1a','#fff3b0',1-(p-0.85)/0.15*0.6,10,p*3);
  break;}
 case 'solar_rise':{var h=45+ease(Math.min(1,p*2.2))*110,al=p<0.7?1:1-(p-0.7)/0.3;
  blit(ctx,glow('#ff8a20',64),20,-h*0.5,1.4,al*0.8);
  for(i=0;i<9;i++){var fy=-(i/9)*h,fw=22-i*1.4+Math.sin(p*25+i)*3;ctx.globalAlpha=al;ctx.fillStyle=i%2?'#ff5a10':'#ffb020';ctx.beginPath();ctx.moveTo(20-fw,fy);ctx.quadraticCurveTo(20+Math.sin(i+p*20)*6,fy-24,20+fw,fy);ctx.fill();}
  ctx.globalAlpha=al;ctx.fillStyle='#fff6c0';ctx.beginPath();ctx.ellipse(20,-h*0.5,5,h*0.5,0,0,7);ctx.fill();
  speedLines(ctx,20,-h,0,0,'#fff',0,1);ctx.strokeStyle='#ffe08a';ctx.lineWidth=2;ctx.beginPath();for(i=0;i<8;i++){var sx=20+(rng(i)-0.5)*50;ctx.moveTo(sx,-h*rng(i+3));ctx.lineTo(sx,-h*rng(i+3)+30);}ctx.stroke();ctx.globalAlpha=1;
  if(p<0.35)burst(ctx,20,-4,26*(p/0.35)+22,'#ff7a1a','#fff3b0',1,8,0);
  break;}
 case 'supernova_rush':{var dx=ease(Math.min(1,p*2))*180;
  if(p<0.5){speedLines(ctx,dx,-50,160,16,'#ffcf70',0.9,1);ctx.globalAlpha=0.5;for(i=0;i<4;i++)blit(ctx,glow('#ff6a10',40),dx-i*40,-48,1,0.5-i*0.1);ctx.globalAlpha=1;
   for(i=0;i<5;i++)burst(ctx,dx+20+(rng(i+Math.floor(p*16))-0.5)*40,-50+(rng(i*3+Math.floor(p*16))-0.5)*50,16,'#ffa020','#fff',0.9,7,i);}
  else{var q=(p-0.5)/0.5,R=50+ease(q)*110,ox=200;
   blit(ctx,glow('#ff9020',96),ox,-50,R/60,1-q*0.6);
   ctx.strokeStyle='#fff2b0';ctx.lineWidth=4*(1-q)+1;ctx.globalAlpha=1-q;ctx.beginPath();ctx.arc(ox,-50,R,0,7);ctx.stroke();
   ctx.lineWidth=2;ctx.beginPath();for(i=0;i<16;i++){var ang=i/16*6.283+q;ctx.moveTo(ox+Math.cos(ang)*R*0.6,-50+Math.sin(ang)*R*0.6);ctx.lineTo(ox+Math.cos(ang)*R*1.2,-50+Math.sin(ang)*R*1.2);}ctx.stroke();ctx.globalAlpha=1;
   burst(ctx,ox,-50,R*0.6,'#ff5010','#fff8d0',1-q*0.7,12,q*2);}
  break;}
 case 'frost_lance':{for(i=0;i<8;i++){var st=i*0.07,lp=(p-st)/0.45;if(lp<=0)continue;var gx=50+i*30,hh=(lp<0.3?lp/0.3:lp<0.7?1:Math.max(0,1-(lp-0.7)/0.3))*(34+rng(i)*30);
   blit(ctx,glow('#8fe0ff',30),gx,-hh*0.4,1,0.6);spike(ctx,gx,0,9,hh,'#bfeaff','#ffffff','#1d4f8a');spike(ctx,gx+10,0,6,hh*0.6,'#8fd0ff','#e8f8ff','#1d4f8a');
   if(lp<0.35){ctx.fillStyle='#e8f8ff';for(var k=0;k<4;k++){ctx.fillRect(gx+(rng(i*4+k)-0.5)*30,-hh-rng(k+i)*20,2,2);}}}
  ctx.strokeStyle='#bfeaff';ctx.globalAlpha=0.5*(1-p);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(30,1);ctx.lineTo(30+p*300,1);ctx.stroke();ctx.globalAlpha=1;
  break;}
 case 'moon_mirror':{var mx=p<0.5?50:50+ease((p-0.5)/0.5)*300,al2=p>0.9?(1-p)/0.1:1;
  if(p>=0.5)speedLines(ctx,mx,-50,80,8,'#cfefff',0.7,1);
  blit(ctx,glow('#7fd4ff',64),mx,-50,1.1,0.8*al2);
  ctx.globalAlpha=al2;var s2=p<0.15?p/0.15:1;ctx.fillStyle='#e8f6ff';ctx.strokeStyle='#2a5fb0';ctx.lineWidth=2.5;
  ctx.beginPath();ctx.ellipse(mx,-50,20*s2,46*s2,0,-Math.PI/2,Math.PI/2);ctx.ellipse(mx-8*s2,-50,12*s2,40*s2,0,Math.PI/2,-Math.PI/2,true);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#ffffff';ctx.beginPath();ctx.ellipse(mx+6*s2,-56,4*s2,24*s2,0,0,7);ctx.fill();
  for(i=0;i<6;i++){var a3=p*8+i;ctx.fillStyle='#bfeaff';ctx.fillRect(mx+Math.cos(a3)*30-1,-50+Math.sin(a3)*50-1,3,3);}
  ctx.globalAlpha=1;break;}
 case 'eclipse_blizzard':{var dark=Math.min(1,p*4)*(p>0.85?(1-p)/0.15:1);
  ctx.fillStyle='rgba(8,12,40,'+(0.55*dark).toFixed(3)+')';ctx.fillRect(-x*facing-900,-500,2400,600);
  var mY=-180,mX=150;blit(ctx,glow('#9fe0ff',96),mX,mY,1.3,dark);
  ctx.fillStyle='#ffffff';ctx.globalAlpha=dark;ctx.beginPath();ctx.arc(mX,mY,34,0,7);ctx.fill();ctx.fillStyle='#070a1e';ctx.beginPath();ctx.arc(mX+8*Math.min(1,p*2),mY-3,32,0,7);ctx.fill();
  ctx.strokeStyle='#dff4ff';ctx.lineWidth=2;ctx.beginPath();
  for(i=0;i<36;i++){var sx=-40+rng(i)*420,sy=-260+((rng(i+50)*300+p*900)%300);ctx.moveTo(sx,sy);ctx.lineTo(sx-10,sy-18);}ctx.stroke();
  for(i=0;i<6;i++){var sp=(p*3+rng(i))%1,gx2=40+i*55,gy=-200+sp*200;spike(ctx,gx2,gy,4,-26,'#bfeaff','#fff','#1d4f8a');if(sp>0.85)burst(ctx,gx2,0,18,'#bfeaff','#fff',0.8,6,i);}
  ctx.globalAlpha=1;break;}
 case 'quake_stomp':{burst(ctx,0,-2,p<0.25?p/0.25*36:36,'#c9a64a','#fff2c0',p<0.3?1:Math.max(0,1-(p-0.3)*2),9,0.3);
  for(d=-1;d<=1;d+=2)for(i=0;i<6;i++){var st2=i*0.08,lp2=(p-st2)/0.4;if(lp2<=0)continue;var rx=d*(40+i*32),rh=(lp2<0.3?lp2/0.3:lp2<0.6?1:Math.max(0,1-(lp2-0.6)/0.4))*(26+rng(i)*18);
   spike(ctx,rx,0,11,rh,'#7a6a55','#a8957a','#2a2016');spike(ctx,rx+d*9,0,7,rh*0.6,'#5e5040','#8a7a62','#2a2016');
   ctx.fillStyle='rgba(180,160,120,'+(0.5*(1-lp2)).toFixed(3)+')';ctx.beginPath();ctx.ellipse(rx,-4,20,7,0,0,7);ctx.fill();}
  ctx.strokeStyle='#2a2016';ctx.lineWidth=2;ctx.globalAlpha=Math.min(1,p*3)*(1-p);ctx.beginPath();ctx.moveTo(-200*ease(p),1);ctx.lineTo(-40,3);ctx.lineTo(0,0);ctx.lineTo(40,3);ctx.lineTo(200*ease(p),1);ctx.stroke();ctx.globalAlpha=1;break;}
 case 'avalanche_grab':{if(p<0.45){var lx=ease(p/0.45)*90;speedLines(ctx,lx+30,-50,90,10,'#e9d7a8',0.8,1);
   blit(ctx,glow('#c9a64a',40),lx+40,-55,1,0.8);ctx.fillStyle='#8a7a62';ctx.strokeStyle='#2a2016';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(lx+28,-70);ctx.lineTo(lx+56,-64);ctx.lineTo(lx+60,-44);ctx.lineTo(lx+30,-40);ctx.closePath();ctx.fill();ctx.stroke();}
  else{var q2=(p-0.45)/0.55;ctx.fillStyle='#3a2f22';ctx.beginPath();ctx.ellipse(110,0,40+q2*20,8+q2*3,0,0,7);ctx.fill();
   burst(ctx,110,-8,30+q2*40,'#c9a64a','#fff2c0',1-q2*0.8,10,q2);
   for(i=0;i<10;i++){var ang2=-Math.PI*(0.1+0.8*rng(i)),dist=q2*(40+rng(i+5)*60);ctx.fillStyle=i%2?'#7a6a55':'#a8957a';ctx.fillRect(110+Math.cos(ang2)*dist-3,-8+Math.sin(ang2)*dist+q2*q2*40-3,6,6);}
   ctx.fillStyle='rgba(200,180,140,'+(0.6*(1-q2)).toFixed(3)+')';ctx.beginPath();ctx.ellipse(110,-10,60*q2+20,20*q2+6,0,0,7);ctx.fill();}
  break;}
 case 'titan_fall':{var fall=Math.min(1,p/0.5),bx=140,by=-230+fall*fall*220;
  if(p<0.5){ctx.fillStyle='rgba(0,0,0,'+(0.4*fall).toFixed(3)+')';ctx.beginPath();ctx.ellipse(bx,0,30+fall*40,8+fall*6,0,0,7);ctx.fill();
   ctx.strokeStyle='#ffcf70';ctx.lineWidth=2;ctx.globalAlpha=0.8;ctx.beginPath();for(i=0;i<10;i++){var lx2=bx+(rng(i)-0.5)*70;ctx.moveTo(lx2,by-30);ctx.lineTo(lx2,by-60-rng(i+2)*80);}ctx.stroke();ctx.globalAlpha=1;
   blit(ctx,glow('#ff8a30',80),bx,by,1,0.9);ctx.fillStyle='#6a5a48';ctx.strokeStyle='#1a120a';ctx.lineWidth=3;ctx.beginPath();
   for(i=0;i<9;i++){var aa=i/9*6.283,rr=36+rng(i)*12;ctx.lineTo(bx+Math.cos(aa)*rr,by+Math.sin(aa)*rr);}ctx.closePath();ctx.fill();ctx.stroke();
   ctx.fillStyle='#ff9a3a';ctx.globalAlpha=0.7;ctx.beginPath();ctx.ellipse(bx,by+26,26,10,0,0,3.14);ctx.fill();ctx.globalAlpha=1;
   ctx.strokeStyle='#2a2016';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(bx-10,by-20);ctx.lineTo(bx,by);ctx.lineTo(bx+14,by+4);ctx.stroke();}
  else{var q3=(p-0.5)/0.5,R3=30+ease(q3)*170;ctx.fillStyle='#2a2016';ctx.beginPath();ctx.ellipse(bx,0,70+q3*10,14,0,0,7);ctx.fill();
   ctx.strokeStyle='#fff2c0';ctx.lineWidth=5*(1-q3)+1;ctx.globalAlpha=1-q3;ctx.beginPath();ctx.ellipse(bx,0,R3,R3*0.25,0,0,7);ctx.stroke();ctx.globalAlpha=1;
   burst(ctx,bx,-20,40+q3*60,'#ff8a30','#fff2c0',1-q3*0.8,14,q3);
   for(i=0;i<8;i++){var off=(i-3.5)*32;spike(ctx,bx+off,0,12,(1-q3)*(40+rng(i)*40),'#7a6a55','#a8957a','#2a2016');}
   for(i=0;i<14;i++){var ang3=-Math.PI*(0.05+0.9*rng(i)),ds=q3*(60+rng(i+1)*140);ctx.fillStyle=i%2?'#6a5a48':'#9a8668';ctx.fillRect(bx+Math.cos(ang3)*ds-4,-20+Math.sin(ang3)*ds+q3*q3*120-4,8,8);}}
  break;}
 }
 ctx.restore();}

var API={CHARS:CHARS,byId:BY,STATES:STATES,drawFighter:drawFighter,drawSpecial:drawSpecial,
 SPECIALS:{ryn:['sun_comet','solar_rise','supernova_rush'],mireya:['frost_lance','moon_mirror','eclipse_blizzard'],gorran:['quake_stomp','avalanche_grab','titan_fall']},
 head:getHead,warm:function(){for(var i=0;i<CHARS.length;i++){getHead(CHARS[i],0);getHead(CHARS[i],1);glow(CHARS[i].palette.aura,64);glow(CHARS[i].palette.aura,24);}}};
if(typeof window!=='undefined')window.LaneBrawlerChars=API;
if(typeof module!=='undefined'&&module.exports)module.exports=API;
})(this);
