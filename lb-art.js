/* Lane Brawlers Art Pack — lb-art.js  (classic script, no modules, file:// safe)
 * Exposes window.LBArt. All art is original. No getImageData, no fetch/XHR.
 * Coordinate conventions match /lf2-clone/game.js: canvas 800x450, a fighter is drawn
 * with its FEET at (x,y); facing = +1 (right) or -1 (left).
 */
(function (root) {
  'use strict';
  var cs = document.currentScript;
  var base = cs && cs.src ? cs.src.replace(/[^\/]*$/, '') : '';
  var config = {
    width: 800, height: 450,          // target canvas size (from lf2-clone). Layers are 450px tall & scale to h.
    basePath: base,                   // where assets/ lives (auto-detected from this script's src)
    fighterScale: 1,                  // 1 => ~100px tall fighter (game's stick figures are ~85px)
    particles: true
  };
  var IMG = {};
  var STAGES = {
    sunset: { name: 'Sunset Street', particles: ['petals', 'fireflies'], layers: [
      ['sunset_0_sky', 0.0], ['sunset_1_far', 0.08], ['sunset_2_mid', 0.18], ['sunset_3_city', 0.35],
      ['sunset_4_props', 0.6], ['sunset_5_street', 1.0], ['sunset_6_fore', 1.35, true]] },
    night: { name: 'Night Rooftop', particles: ['rain', 'embers'], layers: [
      ['night_0_sky', 0.0], ['night_1_far', 0.1], ['night_2_city', 0.3], ['night_3_props', 0.65],
      ['night_4_roof', 1.0], ['night_5_fore', 1.35, true]] }
  };
  STAGES['Sunset Street'] = STAGES.sunset; STAGES['Night Rooftop'] = STAGES.night;

  function load(cb) {
    var names = [];
    ['sunset', 'night'].forEach(function (k) { STAGES[k].layers.forEach(function (l) { names.push(l[0]); }); });
    var left = names.length, errs = [];
    names.forEach(function (n) {
      var im = new Image();
      im.onload = im.onerror = function (e) { if (e.type === 'error') errs.push(n); IMG[n] = im; if (--left === 0 && cb) cb(errs.length ? errs : null); };
      im.src = config.basePath + 'assets/' + n + '.png';
    });
  }

  /* ---------------- particles ---------------- */
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function makeParticles(kind, n) {
    var arr = [];
    for (var i = 0; i < n; i++) arr.push(resetP(kind, {}, true));
    return { kind: kind, list: arr };
  }
  function resetP(kind, p, init) {
    var W = config.width, H = config.height;
    p.x = rnd(-50, W + 50); p.y = init ? rnd(0, H) : -20; p.ph = rnd(0, 6.28); p.z = rnd(0.5, 1.5);
    if (kind === 'petals') { p.vx = rnd(-40, -15); p.vy = rnd(18, 40); p.r = rnd(0, 6.28); p.vr = rnd(-3, 3); }
    if (kind === 'fireflies') { p.y = rnd(H * 0.3, H * 0.8); p.vx = rnd(-8, 8); p.vy = rnd(-6, 6); }
    if (kind === 'rain') { p.vx = -90; p.vy = rnd(520, 700); }
    if (kind === 'embers') { p.y = init ? rnd(0, H) : H + 10; p.vx = rnd(-15, 15); p.vy = rnd(-50, -20); }
    return p;
  }
  function updateParticles(P, dt, dcam) {
    var W = config.width, H = config.height;
    P.list.forEach(function (p) {
      p.ph += dt; p.x += (p.vx + Math.sin(p.ph * 1.7) * (P.kind === 'rain' ? 0 : 12)) * dt * p.z - dcam * p.z;
      p.y += p.vy * dt * (P.kind === 'rain' ? 1 : p.z);
      if (p.r !== undefined) p.r += p.vr * dt;
      if (p.x < -60) p.x += W + 120; if (p.x > W + 60) p.x -= W + 120;
      if (P.kind === 'embers' ? p.y < -20 : p.y > H + 20) resetP(P.kind, p, false);
      if (P.kind === 'fireflies' && (p.y < H * 0.2 || p.y > H * 0.85)) p.vy = -p.vy;
    });
  }
  function drawParticles(ctx, P, front, sx, sy) {
    ctx.save(); ctx.scale(sx, sy);
    P.list.forEach(function (p) {
      if ((p.z > 1.1) !== front) return;
      if (P.kind === 'petals') {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.scale(1, Math.abs(Math.sin(p.ph * 2)) * 0.7 + 0.3);
        ctx.fillStyle = 'rgba(255,' + (170 + (p.z * 30 | 0)) + ',210,0.9)';
        ctx.beginPath(); ctx.ellipse(0, 0, 4 * p.z, 2.4 * p.z, 0, 0, 7); ctx.fill(); ctx.restore();
      } else if (P.kind === 'fireflies' || P.kind === 'embers') {
        if (front && P.kind !== 'petals') return; var a = 0.5 + 0.5 * Math.sin(p.ph * 3), r = (P.kind === 'embers' ? 0.9 : 1.2) * p.z;
        var col = P.kind === 'fireflies' ? '255,240,150' : '255,150,80';
        ctx.globalCompositeOperation = 'lighter';
        var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 5);
        g.addColorStop(0, 'rgba(' + col + ',' + (0.9 * a) + ')'); g.addColorStop(1, 'rgba(' + col + ',0)');
        ctx.fillStyle = g; ctx.fillRect(p.x - r * 5, p.y - r * 5, r * 10, r * 10);
        ctx.globalCompositeOperation = 'source-over';
      } else if (P.kind === 'rain') {
        ctx.strokeStyle = 'rgba(170,190,255,' + (0.25 * p.z) + ')'; ctx.lineWidth = p.z;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - 3 * p.z, p.y - 14 * p.z); ctx.stroke();
      }
    });
    ctx.restore();
  }

  /* ---------------- stage ---------------- */
  function createStage(name) {
    var def = STAGES[name] || STAGES.sunset, lastCam = null;
    var parts = config.particles ? def.particles.map(function (k) {
      return makeParticles(k, { petals: 60, fireflies: 26, rain: 160, embers: 30 }[k]);
    }) : [];
    function drawLayers(ctx, w, h, cam, fore) {
      def.layers.forEach(function (L) {
        if (!!L[2] !== fore) return;
        var im = IMG[L[0]]; if (!im || !im.width) return;
        var s = h / im.height, tw = im.width * s;
        var off = -((cam * L[1] * (w / config.width)) % tw); if (off > 0) off -= tw;
        for (var x = off; x < w; x += tw) ctx.drawImage(im, Math.floor(x), 0, Math.ceil(tw) + 1, h);
      });
    }
    return {
      name: def.name, layers: def.layers.map(function (l) { return { image: l[0], parallax: l[1], foreground: !!l[2] }; }),
      groundTop: 250, groundBottom: 430,
      update: function (dt, cameraX) {
        var d = lastCam === null ? 0 : (cameraX - lastCam) * 0.9; lastCam = cameraX;
        parts.forEach(function (P) { updateParticles(P, dt, d); });
      },
      draw: function (ctx, w, h, cameraX) {   // background: everything behind fighters
        drawLayers(ctx, w, h, cameraX || 0, false);
        parts.forEach(function (P) { drawParticles(ctx, P, false, w / config.width, h / config.height); });
      },
      drawForeground: function (ctx, w, h, cameraX) { // call AFTER fighters & fx
        drawLayers(ctx, w, h, cameraX || 0, true);
        parts.forEach(function (P) { drawParticles(ctx, P, true, w / config.width, h / config.height); });
      }
    };
  }

  /* ---------------- fighters ---------------- */
  var D = Math.PI / 180, RIM = null;
  var palettes = {
    kaito: { name: 'Kaito', hairStyle: 'spiky', hair: '#2b3a8f', hairHi: '#5a74e0', skin: '#ffd9bf', skinSh: '#e8a98f',
      outfit: '#f2f2f6', outfitSh: '#b8b8d0', outfit2: '#d8323c', pants: '#1f2240', pantsSh: '#14152c', eye: '#3fa0ff',
      scarf: '#e8323c', aura: 'rgba(80,160,255,', line: '#1a1020' },
    yuki: { name: 'Yuki', hairStyle: 'long', hair: '#f0f0ff', hairHi: '#ffffff', skin: '#ffe2cf', skinSh: '#e9b29c',
      outfit: '#3a2a6e', outfitSh: '#261a4e', outfit2: '#7fe0ff', pants: '#2a2a3a', pantsSh: '#1a1a26', eye: '#b04aff',
      scarf: '#7fe0ff', aura: 'rgba(200,120,255,', line: '#160e22' },
    ren: { name: 'Ren', hairStyle: 'spiky', hair: '#d43a1e', hairHi: '#ff8a3a', skin: '#f2c49e', skinSh: '#d0946e',
      outfit: '#1c1c22', outfitSh: '#0e0e14', outfit2: '#ffb020', pants: '#4a3020', pantsSh: '#2e1c12', eye: '#ffb020',
      scarf: '#ffb020', aura: 'rgba(255,140,40,', line: '#140a08' }
  };
  function makeFighter(spec) { var o = {}, k; for (k in palettes.kaito) o[k] = palettes.kaito[k]; for (k in spec) o[k] = spec[k]; return o; }

  // pose: angles in degrees measured from straight-down, + = toward facing direction
  function pose(state, t) {
    var b = Math.sin(t * 4);
    var P = { hipY: 0, lean: 4, head: 0, bAu: -20, bAl: 120, fAu: 35, fAl: 150, bTh: -14, bSh: -6, fTh: 18, fSh: 2, expr: 'neutral', scarf: 0.4, ko: 0 };
    if (state === 'idle') { P.hipY = 1.5 + b * 1.5; P.fAl += b * 6; P.bAl += b * 6; P.bTh -= 4; P.fTh += 4; P.bSh = -14; P.fSh = -2; }
    else if (state === 'walk') {
      var s = Math.sin(t * 10); P.fTh = 30 * s; P.fSh = P.fTh - 10 - 20 * Math.max(0, -Math.cos(t * 10));
      P.bTh = -30 * s; P.bSh = P.bTh - 10 - 20 * Math.max(0, Math.cos(t * 10)); P.hipY = Math.abs(Math.cos(t * 10)) * 2; P.lean = 10; P.scarf = 1;
    } else if (state === 'punch') {
      var p = Math.min(1, t / 0.12), r = t > 0.25 ? Math.max(0, 1 - (t - 0.25) / 0.15) : 1, k = p * r;
      P.fAu = 35 + 55 * k; P.fAl = 150 - 60 * k; P.bAu = -20 - 15 * k; P.bAl = 120 - 40 * k; P.lean = 4 + 14 * k; P.fTh = 18 + 12 * k; P.bTh = -14 - 16 * k; P.expr = 'shout'; P.scarf = 0.8;
    } else if (state === 'kick') {
      var p2 = Math.min(1, t / 0.14), r2 = t > 0.3 ? Math.max(0, 1 - (t - 0.3) / 0.15) : 1, k2 = p2 * r2;
      P.fTh = 18 + 82 * k2; P.fSh = 2 + 96 * k2; P.bTh = -8; P.bSh = -6; P.lean = 4 - 22 * k2; P.fAu = 35 - 60 * k2; P.fAl = 150 - 40 * k2;
      P.bAu = -20 + 50 * k2; P.bAl = 120; P.expr = 'angry'; P.hipY = 2 * k2; P.scarf = 0.9;
    } else if (state === 'hurt') {
      var j = Math.sin(t * 40) * 3 * Math.max(0, 1 - t * 2);
      P.lean = -22 + j; P.head = -20; P.fAu = -30; P.fAl = 30; P.bAu = -60; P.bAl = 10; P.fTh = 10; P.fSh = 0; P.bTh = -24; P.bSh = -20; P.expr = 'hurt'; P.scarf = 0.2;
    } else if (state === 'ko') {
      P.ko = Math.min(1, t / 0.4); P.lean = -8; P.head = -10; P.fAu = -100; P.fAl = -150; P.bAu = -80; P.bAl = -120; P.fTh = 8; P.fSh = 2; P.bTh = -8; P.bSh = 4; P.expr = 'ko'; P.scarf = 0;
    } else if (state === 'shout') { P.expr = 'shout'; P.fAu = -25; P.fAl = -10; P.bAu = -45; P.bAl = -30; P.lean = -8; P.head = -14; P.fTh = 24; P.bTh = -22; P.scarf = 1; }
    else if (state === 'angry') { P.expr = 'angry'; P.fAu = 45; P.fAl = 165; P.bAu = 10; P.bAl = 150; P.lean = 10; }
    return P;
  }
  function pt(x, y, a, l) { return [x + Math.sin(a * D) * l, y + Math.cos(a * D) * l]; }
  function limb(ctx, F, pts, w, fill, shade) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    function path() { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); }
    path(); ctx.strokeStyle = F.line; ctx.lineWidth = w + 3.2; if (RIM) { ctx.save(); ctx.shadowColor = RIM; ctx.shadowBlur = 6; ctx.stroke(); ctx.restore(); } ctx.stroke();
    path(); ctx.strokeStyle = fill; ctx.lineWidth = w; ctx.stroke();
    ctx.save(); ctx.translate(-w * 0.22, w * 0.1); path(); ctx.strokeStyle = shade; ctx.lineWidth = w * 0.4; ctx.globalAlpha = 0.9; ctx.stroke(); ctx.restore();
  }
  function drawHead(ctx, F, P, t) {
    var L = F.line;
    // back hair
    ctx.fillStyle = F.hair; ctx.strokeStyle = L; ctx.lineWidth = 1.8; ctx.lineJoin = 'round';
    if (F.hairStyle === 'long') {
      var sw = Math.sin(t * 3) * 3 + P.scarf * -4;
      ctx.beginPath(); ctx.moveTo(-12, -6); ctx.quadraticCurveTo(-20 + sw, 14, -26 + sw, 30); ctx.lineTo(-14 + sw, 24); ctx.lineTo(-10 + sw, 32);
      ctx.quadraticCurveTo(-4, 14, 4, 2); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    // face
    ctx.fillStyle = F.skin; ctx.beginPath(); ctx.moveTo(-11, -4); ctx.quadraticCurveTo(-12, 9, -2, 13); ctx.quadraticCurveTo(8, 12, 12, 3);
    ctx.quadraticCurveTo(13, -6, 10, -10); ctx.lineTo(-11, -10); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = F.skinSh; ctx.beginPath(); ctx.moveTo(-11, -2); ctx.quadraticCurveTo(-11, 8, -3, 12); ctx.quadraticCurveTo(-8, 5, -6, -2); ctx.fill();
    // ear
    ctx.fillStyle = F.skin; ctx.beginPath(); ctx.ellipse(-7, 0, 3, 4, 0, 0, 7); ctx.fill(); ctx.stroke();
    // eyes
    var e = P.expr, ex = 5, ey = -1;
    ctx.lineWidth = 1.6;
    if (e === 'ko') { ctx.strokeStyle = L; ctx.beginPath(); ctx.moveTo(ex - 3, ey - 3); ctx.lineTo(ex + 3, ey + 3); ctx.moveTo(ex + 3, ey - 3); ctx.lineTo(ex - 3, ey + 3); ctx.stroke(); }
    else if (e === 'hurt') { ctx.strokeStyle = L; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ex - 3, ey - 3); ctx.lineTo(ex + 2, ey); ctx.lineTo(ex - 3, ey + 3); ctx.stroke(); }
    else {
      var blink = (t % 3.3) < 0.1 && e === 'neutral';
      if (blink) { ctx.strokeStyle = L; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ex - 3, ey + 1); ctx.lineTo(ex + 4, ey + 1); ctx.stroke(); }
      else {
        var eh = e === 'angry' ? 4.2 : 5.5;
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(ex, ey, 3.6, eh, 0, 0, 7); ctx.fill();
        ctx.fillStyle = F.eye; ctx.beginPath(); ctx.ellipse(ex + 1, ey + 0.5, 2.6, eh - 1, 0, 0, 7); ctx.fill();
        ctx.fillStyle = '#120818'; ctx.beginPath(); ctx.ellipse(ex + 1.3, ey + 0.8, 1.3, eh - 2.4, 0, 0, 7); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ex + 0.2, ey - 1.8, 1.1, 0, 7); ctx.fill();
        ctx.strokeStyle = L; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(ex - 4, ey - eh + 0.5); ctx.quadraticCurveTo(ex, ey - eh - 1.5, ex + 4.5, ey - eh + 1); ctx.stroke();
      }
    }
    // brows
    ctx.strokeStyle = F.hair === '#f0f0ff' ? '#8a8ab0' : L; ctx.lineWidth = 2;
    ctx.beginPath();
    if (e === 'angry' || e === 'shout') { ctx.moveTo(ex - 4, ey - 10); ctx.lineTo(ex + 4, ey - 6.5); }
    else if (e === 'hurt' || e === 'ko') { ctx.moveTo(ex - 4, ey - 6.5); ctx.lineTo(ex + 4, ey - 9.5); }
    else { ctx.moveTo(ex - 4, ey - 9); ctx.quadraticCurveTo(ex, ey - 10.5, ex + 4, ey - 9); }
    ctx.stroke();
    // mouth
    ctx.strokeStyle = L; ctx.lineWidth = 1.4;
    if (e === 'shout' || e === 'hurt') { ctx.fillStyle = '#6a1020'; ctx.beginPath(); ctx.ellipse(7, 8, e === 'shout' ? 3 : 2.2, e === 'shout' ? 3 : 1.8, 0, 0, 7); ctx.fill(); ctx.stroke(); }
    else if (e === 'angry') { ctx.beginPath(); ctx.moveTo(5, 8); ctx.lineTo(9, 7.5); ctx.stroke(); }
    else if (e === 'ko') { ctx.beginPath(); ctx.moveTo(5, 8); ctx.quadraticCurveTo(7, 6.5, 9, 8); ctx.stroke(); }
    else { ctx.beginPath(); ctx.moveTo(5.5, 7.5); ctx.lineTo(8, 7.8); ctx.stroke(); }
    if (e === 'neutral' || e === 'shout') { ctx.fillStyle = 'rgba(255,120,140,0.35)'; ctx.beginPath(); ctx.ellipse(3, 4, 2.5, 1.2, 0, 0, 7); ctx.fill(); }
    // front hair
    ctx.fillStyle = F.hair; ctx.strokeStyle = L; ctx.lineWidth = 1.8;
    var fl = Math.sin(t * 3) * 1.5 - P.scarf * 2;
    ctx.beginPath();
    if (F.hairStyle === 'spiky') {
      ctx.moveTo(-12, 2); ctx.lineTo(-22 + fl, -4); ctx.lineTo(-14, -9); ctx.lineTo(-24 + fl, -18); ctx.lineTo(-10, -16); ctx.lineTo(-14 + fl, -28);
      ctx.lineTo(-2, -19); ctx.lineTo(4, -30); ctx.lineTo(7, -18); ctx.lineTo(16, -22); ctx.lineTo(12, -13); ctx.lineTo(17, -8);
      ctx.lineTo(10, -7); ctx.lineTo(11, -1); ctx.lineTo(5, -7); ctx.lineTo(2, -2); ctx.lineTo(-1, -8); ctx.lineTo(-5, -3); ctx.closePath();
    } else {
      ctx.moveTo(-12, 4); ctx.quadraticCurveTo(-16, -18, 0, -19); ctx.quadraticCurveTo(14, -18, 14, -4); ctx.lineTo(12, 6);
      ctx.lineTo(9, -4); ctx.lineTo(6, 1); ctx.lineTo(3, -6); ctx.lineTo(-1, -1); ctx.lineTo(-4, -7); ctx.closePath();
    }
    ctx.fill(); ctx.stroke();
    ctx.strokeStyle = F.hairHi; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-6, -14); ctx.quadraticCurveTo(0, -17, 6, -14); ctx.stroke();
    // headband
    if (F.hairStyle === 'spiky') { ctx.fillStyle = F.outfit2; ctx.strokeStyle = L; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-12, -10); ctx.lineTo(12, -11); ctx.lineTo(12, -7.5); ctx.lineTo(-12, -6.5); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  }
  /**
   * drawFighter(ctx, spec, state, t, x, y, facing, opts)
   *  spec: palette object (LBArt.palettes.kaito / makeFighter({...}))
   *  state: 'idle'|'walk'|'punch'|'kick'|'hurt'|'ko'  (+ 'shout'|'angry' poses)
   *  t: seconds. For idle/walk pass a running clock; for punch/kick/hurt/ko pass seconds SINCE the state began.
   *  x,y: screen position of the feet; facing: 1 right, -1 left.
   *  opts: {rim: css colour of soft back-glow (null = off; default warm white) , scale, aura:bool, flash:0..1 (white hit-flash), vx (for scarf)}
   */
  function drawFighter(ctx, F, state, t, x, y, facing, opts) {
    opts = opts || {}; RIM = opts.rim === undefined ? 'rgba(255,240,220,0.9)' : opts.rim; var s = (opts.scale || 1) * config.fighterScale, P = pose(state, t || 0);
    ctx.save(); ctx.translate(x, y); ctx.scale(facing < 0 ? -s : s, s);
    // shadow
    ctx.fillStyle = 'rgba(10,0,20,0.35)'; ctx.beginPath(); ctx.ellipse(P.ko ? -20 * P.ko : 0, 0, 24 + 18 * P.ko, 5, 0, 0, 7); ctx.fill();
    if (P.ko) { ctx.translate(-6 * P.ko, -6 * P.ko); ctx.rotate(-P.ko * Math.PI / 2 * 0.98); ctx.translate(0, 0); }
    if (opts.aura) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (var a = 0; a < 3; a++) {
        var R = 52 + a * 6 + Math.sin(t * 8 + a) * 4; ctx.save(); ctx.translate(0, -50); ctx.scale(0.8, 1.25);
        var g = ctx.createRadialGradient(0, 0, 5, 0, 0, R);
        g.addColorStop(0, F.aura + '0.0)'); g.addColorStop(0.55, F.aura + '0.16)'); g.addColorStop(1, F.aura + '0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, R, 0, 7); ctx.fill(); ctx.restore();
      }
      ctx.restore();
    }
    var hip = [0, -46 + P.hipY], neck = pt(hip[0], hip[1], 180 - P.lean, 30), sh = pt(hip[0], hip[1], 180 - P.lean, 26);
    var headC = pt(neck[0], neck[1], 180 - P.lean - P.head * 0.5, 11);
    var hs = [hip[0] - 1, hip[1]], hf = [hip[0] + 2, hip[1]];
    function leg(h, th, shn) { var k = pt(h[0], h[1], th, 23), f = pt(k[0], k[1], shn, 23); return [h, k, f]; }
    function arm(o, u, l) { var e = pt(o[0], o[1], u - P.lean, 16), hnd = pt(e[0], e[1], l - P.lean, 15); return [o, e, hnd]; }
    var bl = leg(hs, P.bTh, P.bSh), fl = leg(hf, P.fTh, P.fSh), ba = arm([sh[0] - 3, sh[1]], P.bAu, P.bAl), fa = arm([sh[0] + 2, sh[1]], P.fAu, P.fAl);
    // scarf (behind)
    var sp = [[neck[0] - 2, neck[1] + 2]], wv = 2 + P.scarf * 3 + (opts.vx ? Math.min(4, Math.abs(opts.vx) / 30) : 0);
    for (var i = 1; i <= 6; i++) sp.push([neck[0] - 2 - i * (5 + P.scarf * 2.2), neck[1] + 2 + i * (2.6 - P.scarf * 1.6) + Math.sin(t * 9 - i * 0.9) * wv * i / 6]);
    limb(ctx, F, sp, 5, F.scarf, 'rgba(0,0,0,0.25)');
    // back limbs
    limb(ctx, F, bl, 9, F.pantsSh, F.pantsSh); foot(ctx, F, bl, F.pantsSh);
    limb(ctx, F, ba, 6.5, F.outfitSh, F.outfitSh); fist(ctx, F, ba[2], F.skinSh);
    // torso
    var torso = function () { ctx.beginPath(); ctx.moveTo(hip[0] - 8, hip[1] + 2); ctx.lineTo(sh[0] - 11, sh[1] - 2); ctx.quadraticCurveTo(sh[0], sh[1] - 6, sh[0] + 10, sh[1] - 1); ctx.lineTo(hip[0] + 8, hip[1] + 2); ctx.closePath(); };
    ctx.save(); ctx.lineJoin = 'round'; torso(); ctx.fillStyle = F.outfit; ctx.fill(); ctx.clip();
    ctx.fillStyle = F.outfitSh; ctx.beginPath(); ctx.moveTo(hip[0] - 9, hip[1] + 3); ctx.lineTo(sh[0] - 12, sh[1] - 3); ctx.lineTo(sh[0] - 4, sh[1] - 3); ctx.lineTo(hip[0] - 1, hip[1] + 3); ctx.fill();
    ctx.restore(); torso(); ctx.strokeStyle = F.line; ctx.lineWidth = 1.8; ctx.stroke();
    // belt + trim
    ctx.strokeStyle = F.outfit2; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(hip[0] - 9, hip[1] - 3); ctx.lineTo(hip[0] + 9, hip[1] - 3); ctx.stroke();
    ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sh[0] + 2, sh[1] - 2); ctx.lineTo(hip[0] + 2, hip[1] - 4); ctx.stroke();
    // front leg, head, front arm
    limb(ctx, F, fl, 9.5, F.pants, F.pantsSh); foot(ctx, F, fl, F.pants);
    ctx.save(); ctx.translate(headC[0], headC[1] - 8); ctx.rotate((P.lean + P.head) * D * 0.6); drawHead(ctx, F, P, t); ctx.restore();
    limb(ctx, F, fa, 7, F.outfit, F.outfitSh); fist(ctx, F, fa[2], F.skin);
    if (opts.flash) { ctx.globalCompositeOperation = 'source-atop'; }
    ctx.restore();
    if (opts.flash) { // white hit flash as additive glow
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = opts.flash * 0.6;
      var g2 = ctx.createRadialGradient(x, y - 50 * s, 0, x, y - 50 * s, 60 * s); g2.addColorStop(0, '#fff'); g2.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g2; ctx.fillRect(x - 60 * s, y - 110 * s, 120 * s, 120 * s); ctx.restore();
    }
  }
  function fist(ctx, F, p, c) { ctx.fillStyle = c; ctx.strokeStyle = F.line; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(p[0], p[1], 4.2, 0, 7); ctx.fill(); ctx.stroke(); }
  function foot(ctx, F, L, c) {
    var k = L[1], f = L[2], a = Math.atan2(f[1] - k[1], f[0] - k[0]) - Math.PI / 2;
    ctx.save(); ctx.translate(f[0], f[1]); ctx.rotate(a); ctx.fillStyle = '#2a1a22'; ctx.strokeStyle = F.line; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(-4, -3); ctx.lineTo(9, -1); ctx.quadraticCurveTo(11, 2, 8, 3); ctx.lineTo(-5, 3); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = F.outfit2; ctx.fillRect(-4, -3, 4, 3); ctx.restore();
  }

  /* ---------------- effects ---------------- */
  var fxList = [], flashA = 0, flashC = '#fff', speed = 0;
  var FX = {
    impact: { life: 0.28, draw: function (ctx, e, k) {
      var r = e.size * (0.5 + k * 0.9), n = 12; ctx.globalAlpha = 1 - k;
      [[e.color, 1], ['#fff', 0.55]].forEach(function (L) {
        ctx.fillStyle = L[0]; ctx.beginPath();
        for (var i = 0; i < n * 2; i++) { var a = i / (n * 2) * 6.283 + e.rot, rr = (i % 2 ? r * 0.38 : r * (0.9 + 0.3 * ((i * 7) % 3) / 2)) * L[1]; ctx.lineTo(e.x + Math.cos(a) * rr, e.y + Math.sin(a) * rr); }
        ctx.closePath(); ctx.fill(); });
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 3 * (1 - k); ctx.beginPath(); ctx.arc(e.x, e.y, r * 1.3, 0, 7); ctx.stroke(); } },
    spark: { life: 0.35, init: function (e) { e.p = []; for (var i = 0; i < 14; i++) { var a = Math.random() * 6.28, v = 120 + Math.random() * 260; e.p.push([Math.cos(a) * v, Math.sin(a) * v]); } },
      draw: function (ctx, e, k) { ctx.strokeStyle = e.color; ctx.lineWidth = 2.5 * (1 - k); ctx.lineCap = 'round'; ctx.beginPath();
        e.p.forEach(function (v) { var d = k * 0.35, x = e.x + v[0] * d, y = e.y + v[1] * d + 200 * d * d; ctx.moveTo(x, y); ctx.lineTo(x - v[0] * 0.04, y - v[1] * 0.04); }); ctx.stroke(); } },
    slash: { life: 0.3, draw: function (ctx, e, k) {
      var r = e.size, a0 = -1.2 + k * 0.5, a1 = a0 + 2.4 * Math.min(1, k * 3);
      ctx.save(); ctx.translate(e.x, e.y); ctx.scale(e.dir, 0.6); ctx.rotate(e.rot); ctx.globalAlpha = 1 - k * k;
      for (var i = 0; i < 3; i++) { ctx.strokeStyle = i ? (i === 1 ? e.color : '#fff') : e.color; ctx.lineWidth = [14, 7, 2.5][i] * (1 - k * 0.6); ctx.globalAlpha = (1 - k * k) * [0.35, 0.9, 1][i];
        ctx.beginPath(); ctx.arc(0, 0, r, a0, a1); ctx.stroke(); }
      ctx.restore(); } },
    ice: { life: 0.7, init: function (e) { e.c = []; for (var i = 0; i < 7; i++) e.c.push([(Math.random() - 0.5) * 50, -Math.random() * 40, 8 + Math.random() * 14, Math.random() * 6]); },
      draw: function (ctx, e, k) { ctx.globalAlpha = k < 0.7 ? 1 : (1 - k) / 0.3; var gk = Math.min(1, k * 5);
        e.c.forEach(function (c) { var h = c[2] * gk; ctx.save(); ctx.translate(e.x + c[0], e.y + c[1]); ctx.rotate(c[3]);
          ctx.fillStyle = 'rgba(170,230,255,0.85)'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(0, -h); ctx.lineTo(h * 0.35, 0); ctx.lineTo(0, h); ctx.lineTo(-h * 0.35, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(0, -h); ctx.lineTo(h * 0.12, 0); ctx.lineTo(0, h * 0.4); ctx.fill(); ctx.restore(); }); } },
    flame: { life: 1.2, update: function (e, dt) { e.x += e.vx * dt; e.tr.unshift([e.x, e.y]); if (e.tr.length > 14) e.tr.pop(); }, init: function (e) { e.vx = (e.speed || 420) * e.dir; e.tr = []; },
      draw: function (ctx, e, k) { ctx.globalCompositeOperation = 'lighter';
        e.tr.forEach(function (p, i) { var r = (16 - i) * e.size / 16, j = Math.sin(e.age * 40 + i) * 3;
          var g = ctx.createRadialGradient(p[0], p[1] + j, 0, p[0], p[1] + j, r); g.addColorStop(0, i < 3 ? '#fff6c0' : '#ffb040'); g.addColorStop(0.5, 'rgba(255,90,20,0.6)'); g.addColorStop(1, 'rgba(200,20,0,0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1] + j, r, 0, 7); ctx.fill(); }); } },
    dust: { life: 0.6, init: function (e) { e.p = []; for (var i = 0; i < 6; i++) e.p.push([(i - 2.5) * 6, (i < 3 ? -1 : 1) * (20 + Math.random() * 30)]); },
      draw: function (ctx, e, k) { ctx.fillStyle = 'rgba(230,210,220,' + (0.6 * (1 - k)) + ')';
        e.p.forEach(function (p) { ctx.beginPath(); ctx.arc(e.x + p[0] + p[1] * k, e.y - 6 * k - 4, (5 + 10 * k) * e.size / 20, 0, 7); ctx.fill(); }); } },
    text: { life: 0.7, draw: function (ctx, e, k) { ctx.globalAlpha = 1 - k; ctx.font = 'bold ' + e.size + 'px sans-serif'; ctx.textAlign = 'center';
      ctx.lineWidth = 4; ctx.strokeStyle = '#1a0a20'; ctx.strokeText(e.text, e.x, e.y - k * 30); ctx.fillStyle = e.color; ctx.fillText(e.text, e.x, e.y - k * 30); } }
  };
  var defaults = { impact: ['#ffd040', 34], spark: ['#fff2a0', 1], slash: ['#80e8ff', 42], ice: ['#aee', 1], flame: ['#f80', 22], dust: ['#ddd', 20], text: ['#fff', 22] };
  var fx = {
    /** spawn(type, x, y, opts) type: impact|spark|slash|ice|flame|dust|text. opts: {color,size,dir,rot,life,speed,text} */
    spawn: function (type, x, y, o) { o = o || {}; var T = FX[type]; if (!T) return null;
      var e = { type: type, x: x, y: y, age: 0, life: o.life || T.life, color: o.color || defaults[type][0], size: o.size || defaults[type][1], dir: o.dir || 1, rot: o.rot !== undefined ? o.rot : Math.random() * 6.28, speed: o.speed, text: o.text };
      if (type === 'slash' && o.rot === undefined) e.rot = 0;
      if (T.init) T.init(e); fxList.push(e); return e; },
    /** hitSpark(x,y,dir,strength) — impact + sparks combo */
    hitSpark: function (x, y, dir, str) { str = str || 1; fx.spawn('impact', x, y, { size: 26 + 14 * str }); fx.spawn('spark', x, y); if (str > 1.2) fx.flash(0.35); },
    /** flash(alpha, color) full-screen flash that fades out */
    flash: function (a, c) { flashA = a === undefined ? 0.6 : a; flashC = c || '#fff'; },
    /** speedLines(amount 0..1) overlay, decays automatically */
    speedLines: function (a) { speed = a === undefined ? 1 : a; },
    update: function (dt) { for (var i = fxList.length - 1; i >= 0; i--) { var e = fxList[i]; e.age += dt; if (FX[e.type].update) FX[e.type].update(e, dt); if (e.age >= e.life) fxList.splice(i, 1); }
      flashA = Math.max(0, flashA - dt * 3); speed = Math.max(0, speed - dt * 1.5); },
    /** draw(ctx) world-space effects; drawOverlay(ctx,w,h) screen flash + speed lines */
    draw: function (ctx) { fxList.forEach(function (e) { ctx.save(); FX[e.type].draw(ctx, e, Math.min(1, e.age / e.life)); ctx.restore(); }); },
    drawOverlay: function (ctx, w, h) {
      if (speed > 0) { ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,' + 0.5 * speed + ')'; var cx = w / 2, cy = h / 2;
        for (var i = 0; i < 60; i++) { var a = i * 2.39996 + (Date.now() / 50 | 0) % 7, r0 = Math.max(w, h) * (0.35 + ((i * 37) % 10) / 40);
          ctx.lineWidth = 1 + (i % 3); ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); ctx.lineTo(cx + Math.cos(a) * w, cy + Math.sin(a) * w); ctx.stroke(); }
        ctx.restore(); }
      if (flashA > 0) { ctx.save(); ctx.globalAlpha = flashA; ctx.fillStyle = flashC; ctx.fillRect(0, 0, w, h); ctx.restore(); } },
    clear: function () { fxList.length = 0; flashA = 0; speed = 0; },
    list: fxList, types: Object.keys(FX)
  };

  root.LBArt = { version: '1.0.0', config: config, load: load, images: IMG, stages: ['sunset', 'night'], createStage: createStage,
    drawFighter: drawFighter, palettes: palettes, makeFighter: makeFighter, pose: pose, fx: fx };
})(window);
