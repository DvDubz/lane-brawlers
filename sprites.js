'use strict';
// Lane Brawlers - painted sprite renderer. Atlases: assets/sprites/<id>.webp, metadata in sprites-data.js (LB_SPRITES).
// LBS.draw(ctx,id,pose,x,y,dir,o) draws a pose with feet at (x,y), facing dir (+1 right, -1 left via scale(-1,1)).
// If an atlas fails to load, LBS.has(id) is false and render.js falls back to the code-drawn fighter.
const LBS=(function(){
 const IDS=Object.keys(typeof LB_SPRITES!=='undefined'?LB_SPRITES:{}),img={},tint={},ok={};let done=0,failed=0,cbs=[];
 const FS=1.3; // same presence scale the code-drawn fighters used
 function bake(id,col,mode){ // pre-tinted copy of the atlas (white flash / ice / burn), built once
  const a=img[id],c=document.createElement('canvas');c.width=a.width;c.height=a.height;const g=c.getContext('2d');
  g.drawImage(a,0,0);g.globalCompositeOperation=mode;g.fillStyle=col;g.fillRect(0,0,c.width,c.height);
  g.globalCompositeOperation='destination-in';g.drawImage(a,0,0);return c;}
 function fin(){if(done+failed===IDS.length){const l=cbs;cbs=[];l.forEach(f=>f());}}
 function load(cb){if(cb)cbs.push(cb);if(!IDS.length||typeof Image==='undefined'){fin();return;}
  if(load.started){fin();return;}load.started=true;
  IDS.forEach(id=>{const im=new Image();im.onload=()=>{img[id]=im;try{tint[id]={white:bake(id,'#fff','source-atop'),ice:bake(id,'#7fd8ff','source-atop'),burn:bake(id,'#ff6a1a','source-atop')};}catch(e){tint[id]={};}
    ok[id]=true;done++;fin();};im.onerror=()=>{failed++;fin();};im.src='assets/sprites/'+id+'.webp'+(typeof LB_SPRITES_V!=='undefined'?'?v='+LB_SPRITES_V:'');/* (anim fix) cache-bust */});}
 function progress(){return IDS.length?(done+failed)/IDS.length:1;}
 function has(id,pose){return !!ok[id]&&(!pose||!!LB_SPRITES[id].frames[pose]);}
 function frame(id,pose){const F=LB_SPRITES[id].frames;return F[pose]||F.idle;}
 // o: {sx,sy,rot,alpha,tint:'white'|'ice'|'burn',ta:tintAlpha}
 function draw(c,id,pose,x,y,dir,o){if(!ok[id])return false;const m=LB_SPRITES[id],f=frame(id,pose),k=FS/m.res;
  c.save();c.translate(x,y);if(o&&o.rot)c.rotate(o.rot);c.scale(dir*k*(o&&o.sx||1),k*(o&&o.sy||1));
  const a=o&&o.alpha!=null?o.alpha:1,ga=c.globalAlpha;c.globalAlpha=ga*a;
  c.drawImage(img[id],f.x,f.y,f.w,f.h,-f.ax,-f.ay,f.w,f.h);
  if(o&&o.tint&&o.ta>0&&tint[id][o.tint]){c.globalAlpha=ga*a*Math.min(1,o.ta);c.drawImage(tint[id][o.tint],f.x,f.y,f.w,f.h,-f.ax,-f.ay,f.w,f.h);}
  c.globalAlpha=ga;c.restore();return true;}
 function height(id){return ok[id]?LB_SPRITES[id].frames.idle.h*FS/LB_SPRITES[id].res:110;}
 // face crop for HUD portraits / cut-ins: draws the head region of the idle pose centred in a w x h box
 function face(c,id,x,y,w,h,flip){if(!ok[id])return false;const r=LB_SPRITES[id].face;const s=Math.max(w/r.w,h/r.h)*1.05;
  c.save();c.translate(x,y);c.scale(flip?-s:s,s);c.drawImage(img[id],r.x,r.y,r.w,r.h,-r.w/2,-r.h*0.42,r.w,r.h);c.restore();return true;}
 return{load,progress,has,draw,height,face,FS};})();
if(typeof module!=='undefined'&&module.exports)module.exports=LBS;
