'use strict';
// ===================== Vẽ =====================
function drawDish(B) {
  g.fillStyle = 'rgba(0,0,0,.18)'; ell(B.cx + 3, B.cy + B.ry * .25, B.rx * 1.1, B.ry * 1.1); g.fill();
  g.fillStyle = '#f7f4ee'; ell(B.cx, B.cy, B.rx * 1.08, B.ry * 1.08); g.fill();
  g.strokeStyle = '#2f5fa8'; g.lineWidth = 2; ell(B.cx, B.cy, B.rx, B.ry); g.stroke();
  g.fillStyle = '#e6dfd2'; ell(B.cx, B.cy, B.rx * .95, B.ry * .95); g.fill();
}
function drawPlate(B, items) {
  const { cx, cy, rx, ry } = B, s = rx / 185;
  g.fillStyle = 'rgba(40,20,5,.28)'; ell(cx + 10 * s, cy + ry * .3, rx * 1.03, ry * .95); g.fill();
  g.fillStyle = '#fbfaf6'; ell(cx, cy, rx * 1.05, ry * 1.05); g.fill();
  g.strokeStyle = '#d6d0c4'; g.lineWidth = 2 * s; g.stroke();
  g.strokeStyle = '#2f5fa8'; g.lineWidth = 2.5 * s; ell(cx, cy, rx * .98, ry * .98); g.stroke();
  const IB = { cx, cy: cy + ry * .02, rx: rx * .84, ry: ry * .8, s: rx * .84 / 180, icon: false };
  const gi = g.createRadialGradient(cx, IB.cy, 4, cx, IB.cy, IB.rx);
  gi.addColorStop(0, '#f4f0e8'); gi.addColorStop(1, '#e6dfd2');
  g.fillStyle = gi; ell(IB.cx, IB.cy, IB.rx, IB.ry); g.fill();
  g.save(); ell(IB.cx, IB.cy, IB.rx * 1.1, IB.ry * 1.1); g.clip();
  const ids = [...items.entries()].filter(([, t]) => t <= S.gt).map(([id]) => ING[BYID[id]]).sort((a, b) => a.layer - b.layer);
  for (const it of ids) it.draw(g, IB);
  g.restore();
}
function drawBowl(B, items) {
  if (S.dish.container === 'plate') return drawPlate(B, items);
  const { cx, cy, rx, ry } = B, s = rx / 185;
  g.fillStyle = 'rgba(40,20,5,.3)'; ell(cx + 12 * s, cy + ry * 1.42, rx * .72, ry * .4); g.fill();
  const gb = g.createLinearGradient(cx - rx, 0, cx + rx, 0);
  gb.addColorStop(0, '#d6d2ca'); gb.addColorStop(.35, '#ffffff'); gb.addColorStop(1, '#c4bfb4');
  g.fillStyle = gb; g.beginPath(); g.moveTo(cx - rx, cy);
  g.bezierCurveTo(cx - rx * .98, cy + ry * 1.95, cx + rx * .98, cy + ry * 1.95, cx + rx, cy); g.closePath(); g.fill();
  g.strokeStyle = '#2f5fa8'; g.lineWidth = 5 * s;
  g.beginPath(); g.moveTo(cx - rx * .95, cy + ry * .45);
  g.bezierCurveTo(cx - rx * .82, cy + ry * 1.5, cx + rx * .82, cy + ry * 1.5, cx + rx * .95, cy + ry * .45); g.stroke();
  g.lineWidth = 2 * s;
  g.beginPath(); g.moveTo(cx - rx * .88, cy + ry * .75);
  g.bezierCurveTo(cx - rx * .7, cy + ry * 1.65, cx + rx * .7, cy + ry * 1.65, cx + rx * .88, cy + ry * .75); g.stroke();
  g.fillStyle = '#fbfaf6'; ell(cx, cy, rx, ry); g.fill();
  g.strokeStyle = '#cfc9bd'; g.lineWidth = 2 * s; g.stroke();
  g.strokeStyle = '#2f5fa8'; g.lineWidth = 3 * s; ell(cx, cy, rx * .955, ry * .94); g.stroke();
  const IB = { cx, cy: cy + ry * .03, rx: rx * .9, ry: ry * .86, s: rx * .9 / 180, icon: false };
  const gi = g.createRadialGradient(cx, IB.cy + IB.ry * .3, 4, cx, IB.cy, IB.rx);
  gi.addColorStop(0, '#d9d1c2'); gi.addColorStop(1, '#f1ece2');
  g.fillStyle = gi; ell(IB.cx, IB.cy, IB.rx, IB.ry); g.fill();
  g.save(); ell(IB.cx, IB.cy, IB.rx, IB.ry); g.clip();
  const ids = [...items.entries()].filter(([, t]) => t <= S.gt).map(([id]) => ING[BYID[id]]).sort((a, b) => a.layer - b.layer);
  for (const it of ids) it.draw(g, IB);
  g.strokeStyle = 'rgba(0,0,0,.12)'; g.lineWidth = 12 * s; ell(IB.cx, IB.cy - 4 * s, IB.rx, IB.ry); g.stroke();
  g.restore();
}
function drawSteam(B) {
  if (![...S.bowl.entries()].some(([id, t]) => t <= S.gt && ING[BYID[id]].steam)) return;
  g.save(); g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 7; g.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    const x0 = B.cx + (i - 1) * B.rx * .35;
    g.beginPath();
    for (let j = 0; j <= 12; j++) {
      const yy = B.cy - B.ry * .3 - j * 9, xx = x0 + Math.sin(S.rt * 2.2 + i * 2 + j * .55) * 8;
      j ? g.lineTo(xx, yy) : g.moveTo(xx, yy);
    }
    g.stroke();
  }
  g.restore();
}
function heart(x, y, s, col) {
  g.fillStyle = col; g.beginPath(); g.moveTo(x, y + s * .3);
  g.bezierCurveTo(x, y, x - s * .5, y, x - s * .5, y + s * .3);
  g.bezierCurveTo(x - s * .5, y + s * .6, x, y + s * .8, x, y + s);
  g.bezierCurveTo(x, y + s * .8, x + s * .5, y + s * .6, x + s * .5, y + s * .3);
  g.bezierCurveTo(x + s * .5, y, x, y, x, y + s * .3); g.fill();
}
function check(x, y, r) {
  g.fillStyle = '#43a047'; ell(x, y, r, r); g.fill();
  g.strokeStyle = '#fff'; g.lineWidth = r * .28; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(x - r * .45, y); g.lineTo(x - r * .1, y + r * .38); g.lineTo(x + r * .5, y - r * .38); g.stroke();
}

function star(x, y, r, fill, stroke) {
  g.beginPath();
  for (let k = 0; k < 10; k++) {
    const a = -Math.PI / 2 + k * Math.PI / 5, rad = k % 2 ? r * .45 : r;
    g.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
  }
  g.closePath();
  if (fill) { g.fillStyle = fill; g.fill(); }
  if (stroke) { g.strokeStyle = stroke; g.lineWidth = 2; g.stroke(); }
}

function drawScene() {
  const { edge, cx } = L;
  const gw = g.createLinearGradient(0, 0, 0, edge);
  gw.addColorStop(0, '#f6dfae'); gw.addColorStop(1, '#e8c07d');
  g.fillStyle = gw; g.fillRect(0, 0, LW, edge);
  g.strokeStyle = 'rgba(150,100,40,.13)'; g.lineWidth = 2;
  for (let y = 40; y < edge; y += 48) { g.beginPath(); g.moveTo(0, y); g.lineTo(LW, y); g.stroke(); }
  for (let y = 40, r = 0; y < edge; y += 48, r++)
    for (let x = (r % 2) * 32; x < LW; x += 64) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, Math.min(edge, y + 48)); g.stroke(); }
  // Ô khách đang được rê chuột
  const hv = S.hover;
  if (S.mode === 'play' && hv && hv.kind === 'seat' && S.seats[hv.i] && S.inputMode === 'mouse') {
    const s = L.seats[hv.i];
    g.fillStyle = 'rgba(255,255,255,.25)'; rr(s.x + 4, s.y + 4, s.w - 8, s.h - 18, 18); g.fill();
  }
  S.seats.forEach((c, i) => { if (c && L.seats[i]) drawCustomer(c, L.seats[i]); });
  // Mép quầy
  const gl = g.createLinearGradient(0, edge - 8, 0, edge + 26);
  gl.addColorStop(0, '#b47a48'); gl.addColorStop(1, '#6e4223');
  g.fillStyle = gl; g.fillRect(0, edge - 8, LW, 34);
  g.fillStyle = '#d29a66'; g.fillRect(0, edge - 8, LW, 4);
  // Món khách đã nhận, đặt trên mép quầy
  S.seats.forEach((c, i) => {
    if (!c || !L.seats[i]) return;
    const s = L.seats[i];
    if (c.gotPho && S.gt >= c.landPho) drawBowl({ cx: s.cx - 30, cy: edge + 2, rx: 40, ry: 23 }, c.bowlItems);
    if (c.gotDrink && S.gt >= c.landDrink) drawDrink(DBYID[c.drink], s.cx + 42, edge + 20, 50);
  });
  // Mặt bàn bếp theo phối cảnh
  const gs = g.createLinearGradient(0, edge + 26, 0, LH);
  gs.addColorStop(0, '#c39060'); gs.addColorStop(1, '#85552f');
  g.fillStyle = gs; g.fillRect(0, edge + 26, LW, LH - edge - 26);
  g.strokeStyle = 'rgba(60,30,10,.12)'; g.lineWidth = 2;
  for (let k = -14; k <= 14; k++) { g.beginPath(); g.moveTo(cx + k * 46, edge + 26); g.lineTo(cx + k * 260, LH); g.stroke(); }
}

function drawCustomer(c, s) {
  const t = S.gt;
  let dy = 0, dx = 0;
  if (c.state === 'enter') dy = (1 - easeOut(clamp((t - c.enterT) / .35))) * 230;
  if (c.state === 'leaving') {
    const k = clamp((t - c.leaveT) / .6);
    dy = easeIn(k) * 240;
    if (c.happy) dy -= Math.abs(Math.sin(clamp((t - c.leaveT + .45) / 1.05) * Math.PI * 2)) * 18;
  }
  if (t - c.hurtT < .4) dx = Math.sin((t - c.hurtT) * 60) * 6 * (1 - (t - c.hurtT) / .4);
  const p = c.patience / c.max, lk = c.look, hy = -140;
  const happy = c.state === 'leaving' && c.happy, angry = c.state === 'leaving' && !c.happy;
  g.save(); g.translate(s.cx + dx, L.edge + dy); g.scale(s.sc, s.sc);
  g.fillStyle = lk.shirt; rr(-95, -62, 190, 150, 60); g.fill();
  g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.moveTo(-22, -62); g.lineTo(0, -30); g.lineTo(22, -62); g.fill();
  g.fillStyle = lk.skin; g.fillRect(-18, -92, 36, 34);
  ell(-62, hy + 4, 11, 15); g.fill(); ell(62, hy + 4, 11, 15); g.fill();
  ell(0, hy, 62, 64); g.fill();
  if (angry) { g.fillStyle = 'rgba(230,30,30,.28)'; ell(0, hy, 62, 64); g.fill(); }
  g.fillStyle = lk.hair;
  g.beginPath(); g.ellipse(0, hy - 14, 66, 56, 0, Math.PI, 0); g.closePath(); g.fill();
  if (lk.style) { ell(0, hy - 78, 24, 20); g.fill(); }
  else { g.beginPath(); g.moveTo(-64, hy - 14); g.quadraticCurveTo(-20, hy - 2, 10, hy - 34); g.quadraticCurveTo(40, hy - 8, 66, hy - 14); g.lineTo(66, hy - 30); g.lineTo(-64, hy - 30); g.fill(); }
  g.strokeStyle = g.fillStyle = '#2b1b10'; g.lineWidth = 4.5; g.lineCap = 'round';
  if (happy) { for (const d of [-1, 1]) { g.beginPath(); g.arc(d * 22, hy + 4, 9, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); } }
  else { ell(-22, hy, 6.5, 7.5); g.fill(); ell(22, hy, 6.5, 7.5); g.fill(); }
  if ((c.state === 'wait' && p < .3) || angry || t - c.hurtT < .8) {
    g.beginPath(); g.moveTo(-34, hy - 22); g.lineTo(-12, hy - 14); g.moveTo(34, hy - 22); g.lineTo(12, hy - 14); g.stroke();
  }
  if (happy || (p > .55 && !angry && t - c.hurtT > .8)) {
    g.beginPath(); g.arc(0, hy + 22, happy ? 20 : 16, Math.PI * .15, Math.PI * .85); g.stroke();
    g.fillStyle = 'rgba(255,120,120,.35)'; ell(-38, hy + 22, 10, 6); g.fill(); ell(38, hy + 22, 10, 6); g.fill();
  } else if (p > .3 && !angry) { g.beginPath(); g.moveTo(-14, hy + 34); g.lineTo(14, hy + 34); g.stroke(); }
  else { g.beginPath(); g.arc(0, hy + 48, 16, Math.PI * 1.2, Math.PI * 1.8); g.stroke(); }
  if (c.state !== 'leaving') {
    const bw = 140, bx = -bw / 2, by = hy - 98;
    g.fillStyle = 'rgba(0,0,0,.25)'; rr(bx, by, bw, 18, 9); g.fill();
    const col = p > .5 ? '#43a047' : p > .25 ? '#fbc02d' : '#e53935';
    g.globalAlpha = p < .25 ? .6 + .4 * Math.abs(Math.sin(S.rt * 8)) : 1;
    g.fillStyle = col; rr(bx + 3, by + 3, Math.max(8, (bw - 6) * p), 12, 6); g.fill(); g.globalAlpha = 1;
  }
  g.restore();
}

function drawTicket(c, i) {
  const s = L.seats[i], T = s.tk, t = S.gt;
  let a = 1;
  if (c.state === 'enter') a = clamp((t - c.enterT - .1) / .2);
  if (c.state === 'leaving') a = 1 - clamp((t - c.leaveT) / .15);
  if (a <= 0) return;
  const rows = [];
  if (c.pho) { if (c.gotPho) rows.push({ k: 'phodone' }); else c.pho.forEach(id => rows.push({ k: 'ing', id })); }
  if (c.drink) rows.push({ k: 'drink', id: c.drink });
  const ready = (needPho(c) && S.bowl.size && exact(c)) || (needDrink(c) && S.drink === c.drink);
  const rowH = Math.min(portrait ? 32 : 26, (T.h - 14) / Math.max(rows.length, 3));
  const h = rows.length * rowH + 14;
  const ty = s.tail === 'down' ? T.y + T.h - h : T.y + (T.h - h) / 2;
  g.save(); g.globalAlpha = a;
  g.fillStyle = 'rgba(60,30,10,.16)'; rr(T.x + 3, ty + 5, T.w, h, 14); g.fill();
  g.fillStyle = '#fffdf7';
  rr(T.x, ty, T.w, h, 14); g.fill();
  g.beginPath();
  if (s.tail === 'left') { const m = Math.min(ty + h - 22, L.edge - 140 * s.sc - 4); g.moveTo(T.x + 3, m - 10); g.lineTo(T.x - 18, m + 4); g.lineTo(T.x + 3, m + 12); }
  else { g.moveTo(s.cx - 11, ty + h - 3); g.lineTo(s.cx, ty + h + 14); g.lineTo(s.cx + 11, ty + h - 3); }
  g.fill();
  if (ready) { g.shadowColor = 'rgba(67,160,71,.8)'; g.shadowBlur = 14; }
  g.strokeStyle = ready ? '#43a047' : '#e8d8bd'; g.lineWidth = ready ? 4 : 2;
  rr(T.x, ty, T.w, h, 14); g.stroke(); g.shadowBlur = 0;
  const fs = Math.min(portrait ? 20 : 16, rowH * .68), ir = Math.min(portrait ? 12 : 10, rowH * .38);
  g.textAlign = 'left'; g.textBaseline = 'middle';
  rows.forEach((r, ri) => {
    const y = ty + 7 + ri * rowH, mid = y + rowH / 2, ix = T.x + 10 + ir, cxk = T.x + T.w - 16;
    if (r.k === 'ing') {
      const has = S.bowl.has(r.id);
      g.fillStyle = '#f1e9da'; ell(ix, mid, ir + 2, ir + 2); g.fill();
      ING[BYID[r.id]].draw(g, { cx: ix, cy: mid, rx: ir, ry: ir * .65, s: ir / 60, icon: true });
      g.fillStyle = has ? '#8d9a86' : '#3e2412';
      fitText(ING[BYID[r.id]].name, ix + ir + 8, mid + 1, cxk - 12 - (ix + ir + 8), fs, 600);
      if (has) check(cxk, mid, Math.min(9, rowH * .32));
      else { g.strokeStyle = '#cdbfa6'; g.lineWidth = 1.5; ell(cxk, mid, Math.min(8, rowH * .3), Math.min(8, rowH * .3)); g.stroke(); }
    } else if (r.k === 'phodone') {
      check(ix, mid, ir); g.fillStyle = '#2e7d32';
      fitText('Đã nhận ' + S.dish.short, ix + ir + 8, mid + 1, T.x + T.w - 8 - (ix + ir + 8), fs, 700);
    } else {
      if (ri > 0) { g.strokeStyle = '#e3d3b6'; g.lineWidth = 1.5; g.setLineDash([4, 4]); g.beginPath(); g.moveTo(T.x + 10, y); g.lineTo(T.x + T.w - 10, y); g.stroke(); g.setLineDash([]); }
      const d = DBYID[r.id], done = c.gotDrink, holding = S.drink === r.id;
      drawDrink(d, ix, mid + rowH * .42, rowH * .82);
      g.fillStyle = done ? '#2e7d32' : '#0d47a1';
      fitText(d.name, ix + ir + 8, mid + 1, cxk - 12 - (ix + ir + 8), fs, 700);
      if (done || holding) check(cxk, mid, Math.min(9, rowH * .32));
      else { g.strokeStyle = '#cdbfa6'; g.lineWidth = 1.5; ell(cxk, mid, Math.min(8, rowH * .3), Math.min(8, rowH * .3)); g.stroke(); }
    }
  });
  if (S.inputMode !== 'touch') {
    const bx = T.x + T.w - 22, by = ty - 12;
    g.fillStyle = 'rgba(30,18,8,.85)'; rr(bx, by, 26, 24, 7); g.fill();
    g.fillStyle = '#fff'; g.font = font(14, 800); g.textAlign = 'center'; g.fillText(SEATKEYS[i], bx + 13, by + 12.5);
  }
  g.restore();
}

function drawTrays() {
  const showKeys = S.inputMode !== 'touch';
  const ready = S.mode === 'play' && active().some(c => (needPho(c) && S.bowl.size && exact(c)) || (needDrink(c) && S.drink === c.drink));
  for (let i = 0; i < L.trays.length; i++) {
    const T = L.trays[i];
    const pk = clamp((S.rt - T.pressT) / .16), sc = pk < 1 ? 1 - .08 * Math.sin(Math.PI * pk) : 1;
    const hov = S.mode === 'play' && S.inputMode === 'mouse' && S.hover && S.hover.kind === 'tray' && S.hover.i === i;
    g.save(); g.translate(T.x + T.w / 2, T.y + T.h / 2 - (hov ? 3 : 0)); g.scale(sc, sc); g.translate(-T.w / 2, -T.h / 2);
    if (T.kind !== 'held') { g.fillStyle = 'rgba(40,20,5,.35)'; rr(3, 6, T.w, T.h, 16); g.fill(); }
    const label = txt => {
      g.fillStyle = '#3a2614'; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
      fitText(txt, T.w / 2, T.h - 9, T.w - 10, clamp(T.w / 9, 13, 18), 700);
    };
    if (T.kind === 'ing' || T.kind === 'drink') {
      const isD = T.kind === 'drink';
      const gr = g.createLinearGradient(0, 0, 0, T.h);
      if (isD) { gr.addColorStop(0, hov ? '#f2fafd' : '#dcecf3'); gr.addColorStop(1, hov ? '#c4dbe5' : '#a9c4cf'); }
      else { gr.addColorStop(0, hov ? '#f7fafb' : '#e4e9ec'); gr.addColorStop(1, hov ? '#cdd6dc' : '#b3bec5'); }
      g.fillStyle = gr; rr(0, 0, T.w, T.h, 16); g.fill();
      g.strokeStyle = hov ? '#ffffff' : 'rgba(255,255,255,.6)'; g.lineWidth = 2; rr(1, 1, T.w - 2, T.h - 2, 15); g.stroke();
      if (isD) {
        const d = DRINKS[T.idx], gh = Math.min(T.h - 42, T.w * .9), locked = T.idx >= S.cfg.drinks;
        if (locked) g.globalAlpha = .35;
        drawDrink(d, T.w / 2, T.h - 34, gh);
        label(d.name);
        g.globalAlpha = 1;
        if (locked) {
          g.fillStyle = 'rgba(60,40,30,.35)'; rr(0, 0, T.w, T.h, 16); g.fill();
          lockIcon(T.w / 2, T.h / 2 - 12, 13);
          g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = font(13, 700);
          g.fillText('Mở ở màn ' + drinkUnlockLevel(T.idx), T.w / 2, T.h / 2 + 16);
        }
        if (S.drink === d.id) check(T.w - 16, 16, 11);
      } else {
        const it = ING[T.idx], ia = T.h - 30, rx = Math.min((T.w - 24) / 2, ia / 2 / .6 * .9);
        const B = { cx: T.w / 2, cy: ia / 2 + 6, rx, ry: rx * .6, s: rx / 95, icon: true };
        drawDish(B);
        it.draw(g, { ...B, rx: rx * .88, ry: B.ry * .88, s: B.s * .88 });
        label(it.name);
        if (S.bowl.has(it.id)) check(T.w - 16, 16, 11);
      }
    } else if (T.kind === 'held') {
      g.fillStyle = hov && S.drink ? 'rgba(60,30,10,.45)' : 'rgba(60,30,10,.3)'; rr(0, 0, T.w, T.h, 16); g.fill();
      g.strokeStyle = 'rgba(255,240,220,.5)'; g.lineWidth = 2; g.setLineDash([7, 6]); rr(2, 2, T.w - 4, T.h - 4, 14); g.stroke(); g.setLineDash([]);
      g.textAlign = 'center'; g.textBaseline = 'alphabetic';
      if (S.drink && S.gt >= S.drinkAt) {
        const d = DBYID[S.drink];
        drawDrink(d, T.w / 2, T.h - 26, Math.min(T.h - 34, 74));
        g.fillStyle = '#fff3e0'; g.font = font(clamp(T.w / 8, 12, 15), 700); g.fillText(d.name, T.w / 2, T.h - 7);
      } else {
        g.fillStyle = 'rgba(255,240,220,.65)'; g.font = font(clamp(T.w / 8, 12, 15), 600);
        g.fillText('Ly nước', T.w / 2, T.h / 2 - 2); g.fillText('đang cầm', T.w / 2, T.h / 2 + 17);
      }
    } else {
      const serveBtn = T.kind === 'serve';
      const glow = serveBtn && ready ? .5 + .5 * Math.sin(S.rt * 9) : 0;
      const gr = g.createLinearGradient(0, 0, 0, T.h);
      if (serveBtn) { gr.addColorStop(0, glow ? '#8be08f' : '#66bb6a'); gr.addColorStop(1, '#2e7d32'); }
      else { gr.addColorStop(0, '#ef7a6b'); gr.addColorStop(1, '#b8322a'); }
      if (glow) { g.shadowColor = 'rgba(255,240,120,' + (.5 + .5 * glow) + ')'; g.shadowBlur = 24; }
      g.fillStyle = gr; rr(0, 0, T.w, T.h, 16); g.fill(); g.shadowBlur = 0;
      g.strokeStyle = 'rgba(255,255,255,.45)'; g.lineWidth = 2; rr(1, 1, T.w - 2, T.h - 2, 15); g.stroke();
      g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.font = font(clamp(T.w / 7.5, 15, 28), 800);
      g.fillText(serveBtn ? 'PHỤC VỤ' : 'ĐỔ BỎ', T.w / 2, T.h / 2 - 9);
      g.font = font(clamp(T.w / 13, 11, 15), 600); g.globalAlpha = .9;
      const sub = serveBtn ? (S.combo >= 2 ? 'Combo x' + S.combo : 'tự giao đúng khách') : 'làm lại bát';
      g.fillText(sub, T.w / 2, T.h / 2 + 17); g.globalAlpha = 1;
    }
    if (showKeys && T.kind !== 'held' && !(T.kind === 'drink' && T.idx >= S.cfg.drinks)) {
      const lb = T.kind === 'ing' ? KEYLABEL[T.idx] : T.kind === 'drink' ? DKEYS[T.idx] : T.kind === 'serve' ? 'Enter' : 'X';
      g.font = font(14, 700); const tw = Math.max(24, g.measureText(lb).width + 14);
      g.fillStyle = 'rgba(30,18,8,.78)'; rr(8, 8, tw, 24, 7); g.fill();
      g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(lb, 8 + tw / 2, 20.5);
    }
    g.restore();
  }
}

function drawFx() {
  const t = S.gt;
  for (const f of S.fx) {
    const k = clamp((t - f.t0) / f.dur);
    if (f.type === 'fly') {
      ING[f.i].draw(g, { cx: lerp(f.x0, f.x1, k), cy: lerp(f.y0, f.y1, k) - Math.sin(Math.PI * k) * 70, rx: 30, ry: 18, s: .45, icon: true });
    } else if (f.type === 'glass') {
      drawDrink(DBYID[f.id], lerp(f.x0, f.x1, easeOut(k)), lerp(f.y0, f.y1, easeOut(k)) - Math.sin(Math.PI * k) * 60, lerp(f.h0, f.h1, k));
    } else if (f.type === 'bowl') {
      const e = easeOut(k), sc = lerp(1, f.sc1, e);
      drawBowl({ cx: lerp(f.x0, f.x1, e), cy: lerp(f.y0, f.y1, e) - Math.sin(Math.PI * k) * 60, rx: L.bowl.rx * sc, ry: L.bowl.ry * sc }, f.items);
    } else if (f.type === 'text') {
      g.save(); g.globalAlpha = 1 - k * k; g.font = font(f.size, 800); g.textAlign = 'center'; g.textBaseline = 'middle';
      const sc = k < .12 ? .6 + .4 * (k / .12) : 1;
      g.translate(clamp(f.x, 150, LW - 150), f.y - 60 * easeOut(k)); g.scale(sc, sc);
      g.lineWidth = 6; g.strokeStyle = '#fff'; g.lineJoin = 'round'; g.strokeText(f.text, 0, 0);
      g.fillStyle = f.col; g.fillText(f.text, 0, 0); g.restore();
    } else if (f.type === 'spark') {
      const tt = t - f.t0;
      g.globalAlpha = 1 - k; g.fillStyle = f.col;
      ell(f.x + f.vx * tt, f.y + f.vy * tt + 400 * tt * tt, 6 * (1 - k) + 1, 6 * (1 - k) + 1); g.fill(); g.globalAlpha = 1;
    }
  }
}

function drawTopBar() {
  const TB = L.TB, P = L.pause;
  g.fillStyle = 'rgba(58,30,12,.96)'; g.fillRect(0, 0, LW, TB);
  g.fillStyle = 'rgba(255,255,255,.16)'; rr(P.x, P.y, P.w, P.h, 12); g.fill();
  g.fillStyle = '#fff'; const bw = P.w * .14, bh = P.h * .42;
  g.fillRect(P.x + P.w * .32, P.y + (P.h - bh) / 2, bw, bh); g.fillRect(P.x + P.w * .54, P.y + (P.h - bh) / 2, bw, bh);
  g.textBaseline = 'middle'; g.textAlign = 'left';
  const lx = P.x + P.w + 12;
  g.fillStyle = '#ffe0b2'; g.font = font(20, 800); g.fillText('Màn ' + S.level, lx, TB / 2 - 9);
  const w1 = g.measureText('Màn ' + S.level).width;
  g.fillStyle = '#ffcc80'; g.font = font(14, 600); g.fillText(S.dish.name, lx, TB / 2 + 12);
  const bx0 = lx + Math.max(w1, g.measureText(S.dish.name).width) + 16;
  // Thanh doanh thu: 1★ = mục tiêu, 2★ = 1,5×, 3★ = 2×
  const b = { x: bx0, w: L.bar.x + L.bar.w - bx0 }, bh2 = 22, by = TB / 2 - bh2 / 2, k = clamp(S.money / (S.target * 2));
  g.fillStyle = 'rgba(255,255,255,.14)'; rr(b.x, by, b.w, bh2, 11); g.fill();
  if (k > 0) {
    const gr = g.createLinearGradient(b.x, 0, b.x + b.w, 0); gr.addColorStop(0, '#ffb300'); gr.addColorStop(1, '#ffd54f');
    g.fillStyle = gr; rr(b.x, by, Math.max(bh2, b.w * k), bh2, 11); g.fill();
  }
  [.5, .75, 1].forEach(f => star(b.x + b.w * f - (f === 1 ? 12 : 0), TB / 2, 13, k >= f - 1e-9 ? '#fff176' : 'rgba(80,40,10,.95)', k >= f - 1e-9 ? '#f57f17' : 'rgba(255,255,255,.55)'));
  const txt = fmt(S.money) + ' / ' + fmt(S.target);
  g.font = font(portrait ? 14 : 15, 800); g.textAlign = 'center';
  g.lineWidth = 4; g.strokeStyle = 'rgba(60,30,10,.85)'; g.lineJoin = 'round';
  g.strokeText(txt, b.x + b.w * .25, TB / 2 + 1); g.fillStyle = '#fff'; g.fillText(txt, b.x + b.w * .25, TB / 2 + 1);
  // Đồng hồ
  const tl = Math.ceil(S.timeLeft), tt = Math.floor(tl / 60) + ':' + String(tl % 60).padStart(2, '0'), low = S.timeLeft < 10 && S.mode === 'play';
  g.font = font(26, 800); g.textAlign = 'right';
  const col = low ? (Math.sin(S.rt * 10) > 0 ? '#ff5252' : '#ffcdd2') : '#fff';
  g.fillStyle = col; g.fillText(tt, L.timerX, TB / 2 + 1);
  const ix = L.timerX - g.measureText(tt).width - 20;
  g.strokeStyle = col; g.lineWidth = 3; ell(ix, TB / 2, 11, 11); g.stroke();
  g.beginPath(); g.moveTo(ix, TB / 2); g.lineTo(ix, TB / 2 - 7); g.moveTo(ix, TB / 2); g.lineTo(ix + 5, TB / 2 + 2); g.stroke();
}

function wrap(text, x, y, maxW, lh, draw = true) {
  const words = text.split(' '), lines = []; let line = '';
  for (const w of words) { const test = line ? line + ' ' + w : w; if (g.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test; }
  if (line) lines.push(line);
  if (draw) lines.forEach((l, i) => g.fillText(l, x, y + i * lh));
  return lines.length * lh;
}
function overlay(title, lines, buttons, stars = -1, ready = true, extra = null) {
  g.fillStyle = 'rgba(25,12,4,.72)'; g.fillRect(0, 0, LW, LH);
  const w = Math.min(700, LW - 40), x = (LW - w) / 2;
  const fontOf = st => st === 'b' ? font(21, 800) : font(18, 500);
  let lh = 0;
  for (const [txt, st] of lines) { g.font = fontOf(st); lh += wrap(txt, 0, 0, w - 56, 27, false) + 6; }
  const h = 100 + (stars >= 0 ? 76 : 0) + lh + (extra ? extra.h + 10 : 0) + 100;
  const y = Math.max(16, (LH - h) / 2);
  g.fillStyle = '#fff8ec'; rr(x, y, w, h, 28); g.fill();
  g.fillStyle = '#b23a12'; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  g.font = font(portrait ? 42 : 48, 900); g.fillText(title, LW / 2, y + 66);
  let yy = y + 104;
  if (stars >= 0) {
    for (let k = 0; k < 3; k++) {
      const on = k < stars;
      star(LW / 2 + (k - 1) * 78, yy + 22 - (k === 1 ? 8 : 0), k === 1 ? 34 : 27, on ? '#ffca28' : '#e7ddd0', on ? '#f57f17' : '#c9b9ab');
    }
    yy += 76;
  }
  for (const [txt, st] of lines) {
    g.font = fontOf(st); g.fillStyle = st === 'b' ? '#3e2412' : '#5d4037';
    yy += wrap(txt, LW / 2, yy, w - 56, 27) + 6;
  }
  if (extra) extra.draw(x + 28, yy - 10, w - 56);
  const n = buttons.length, gap = 16, bw = Math.min(260, (w - 48 - (n - 1) * gap) / n), bh = 58;
  const bx0 = LW / 2 - (n * bw + (n - 1) * gap) / 2, by = y + h - bh - 26;
  S.buttons = buttons.map((b, i) => ({ ...b, x: bx0 + i * (bw + gap), y: by, w: bw, h: bh }));
  g.globalAlpha = ready ? 1 : .45;
  for (const b of S.buttons) {
    const pulse = b.primary && ready ? 1 + .03 * Math.sin(S.rt * 5) : 1;
    g.save(); g.translate(b.x + b.w / 2, b.y + b.h / 2); g.scale(pulse, pulse);
    g.fillStyle = 'rgba(60,30,10,.25)'; rr(-b.w / 2 + 2, -b.h / 2 + 5, b.w, b.h, 16); g.fill();
    g.fillStyle = b.primary ? '#43a047' : '#efe2cf'; rr(-b.w / 2, -b.h / 2, b.w, b.h, 16); g.fill();
    g.fillStyle = b.primary ? '#fff' : '#5d4037'; g.font = font(20, 800); g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(b.label, 0, 1);
    g.restore();
  }
  g.globalAlpha = 1;
}

function fitText(txt, x, y, maxW, fs, wgt = 700) {
  g.font = font(fs, wgt);
  const w = g.measureText(txt).width;
  if (w > maxW && maxW > 0) g.font = font(Math.max(9, fs * maxW / w), wgt);
  g.fillText(txt, x, y);
}
function lockIcon(x, y, r) {
  g.strokeStyle = '#fff'; g.lineWidth = r * .28; g.beginPath(); g.arc(x, y - r * .2, r * .5, Math.PI, 0); g.stroke();
  g.fillStyle = '#fff'; rr(x - r * .75, y - r * .2, r * 1.5, r * 1.2, r * .25); g.fill();
  g.fillStyle = 'rgba(60,40,30,.8)'; ell(x, y + r * .35, r * .16, r * .2); g.fill();
}
// Màn hình chọn màn: mỗi hàng là một món (chương) gồm 10 màn
function drawLevels() {
  g.fillStyle = 'rgba(25,12,4,.92)'; g.fillRect(0, 0, LW, LH);
  const mx = maxUnlocked(), btns = [];
  const back = { label: '◀ Về', x: 16, y: 16, w: 110, h: 48, action: () => { S.mode = 'title'; } };
  btns.push(back);
  g.fillStyle = 'rgba(255,255,255,.14)'; rr(back.x, back.y, back.w, back.h, 14); g.fill();
  g.fillStyle = '#fff'; g.font = font(20, 800); g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(back.label, back.x + back.w / 2, back.y + back.h / 2 + 1);
  g.fillStyle = '#ffe0b2'; g.font = font(34, 900); g.fillText('Chọn màn', LW / 2, 42);
  const top = 84, rowH = (LH - top - 12) / CHAPTERS.length;
  CHAPTERS.forEach((d, ci) => {
    const y = top + ci * rowH, first = ci * 10 + 1, open = first <= mx;
    let lx, ly, cx0, cy0, cw, chh, gap;
    if (!portrait) { lx = 24; ly = y + rowH / 2; cx0 = 250; gap = 8; cw = (LW - cx0 - 20 - gap * 9) / 10; chh = Math.min(rowH - 18, 74); cy0 = y + (rowH - chh) / 2; }
    else { lx = 20; ly = y + 20; cx0 = 16; gap = 6; cw = (LW - 32 - gap * 9) / 10; chh = Math.min(rowH - 52, 72); cy0 = y + 40; }
    g.textAlign = 'left'; g.textBaseline = 'middle';
    g.fillStyle = open ? '#fff' : 'rgba(255,255,255,.4)'; g.font = font(portrait ? 22 : 24, 800);
    g.fillText(d.name, lx, portrait ? ly : ly - 12);
    const nameW = g.measureText(d.name).width;
    g.fillStyle = open ? '#ffcc80' : 'rgba(255,255,255,.35)'; g.font = font(15, 600);
    const sub = open ? 'Màn ' + first + '–' + (first + 9) : 'Qua màn ' + (first - 1) + ' để mở';
    if (portrait) g.fillText(sub, lx + nameW + 14, ly + 1); else g.fillText(sub, lx, ly + 16);
    for (let k = 0; k < 10; k++) {
      const lv = first + k, unlocked = lv <= mx, st = STARS[lv - 1] || 0, bx = cx0 + k * (cw + gap);
      g.fillStyle = unlocked ? (st ? '#fff3e0' : '#ffe0b2') : 'rgba(255,255,255,.1)';
      rr(bx, cy0, cw, chh, 12); g.fill();
      if (lv === mx) { g.strokeStyle = '#66bb6a'; g.lineWidth = 3 + Math.abs(Math.sin(S.rt * 4)) * 2; rr(bx, cy0, cw, chh, 12); g.stroke(); }
      if (unlocked) {
        g.fillStyle = '#5d2a0c'; g.textAlign = 'center'; g.font = font(Math.min(24, cw * .35), 800);
        g.fillText(String(lv), bx + cw / 2, cy0 + chh * .38);
        const sr = Math.min(7, cw * .09);
        for (let j = 0; j < 3; j++) star(bx + cw / 2 + (j - 1) * sr * 2.4, cy0 + chh * .74, sr, j < st ? '#ffb300' : '#e0d2c0', null);
        btns.push({ x: bx, y: cy0, w: cw, h: chh, action: () => startLevel(lv) });
      } else lockIcon(bx + cw / 2, cy0 + chh / 2, Math.min(12, cw * .18));
    }
  });
  S.buttons = btns;
}

function render() {
  g.setTransform(DPR, 0, 0, DPR, 0, 0);
  g.fillStyle = '#2b1d14'; g.fillRect(0, 0, VW, VH);
  let sx = 0, sy = 0;
  const sk = S.gt - S.shake;
  if (sk < .25 && S.mode === 'play') { const a = 10 * (1 - sk / .25); sx = (Math.random() - .5) * a; sy = (Math.random() - .5) * a; }
  g.setTransform(DPR * SC, 0, 0, DPR * SC, DPR * (OX + sx * SC), DPR * (OY + sy * SC));
  g.save(); g.beginPath(); g.rect(0, 0, LW, LH); g.clip();
  drawScene();
  drawTrays();
  const bb = S.gt - S.bowlBump, B = L.bowl;
  const bx = bb < .25 ? Math.sin(bb * 50) * 6 * (1 - bb / .25) : 0;
  drawBowl({ cx: B.cx + bx, cy: B.cy, rx: B.rx, ry: B.ry }, S.bowl);
  drawSteam(B);
  S.seats.forEach((c, i) => { if (c && L.seats[i]) drawTicket(c, i); });
  drawFx();
  drawTopBar();
  const mouse = S.inputMode !== 'touch';
  const toLevels = { label: 'Chọn màn', action: () => { S.mode = 'levels'; } };
  if (S.mode === 'title') {
    const mx = maxUnlocked();
    overlay('Quán Phở Góc Phố', [
      ['Nấu và phục vụ món Việt cho nhiều khách cùng lúc. Mỗi màn 90 giây, đạt mục tiêu doanh thu để qua màn. Cứ 10 màn mở khóa một món mới:', ''],
      [CHAPTERS.map(d => d.name).join(' → '), 'b'],
      [mouse ? 'Phím 1–0: nguyên liệu · A–H: đồ uống · Enter: phục vụ · Q W E R: giao cho từng khách · X: đổ bỏ' : 'Chạm khay để thêm món, chạm PHỤC VỤ hoặc chạm vào khách để giao', ''],
    ], [toLevels, { label: mx > 1 ? 'Chơi Màn ' + mx : 'Bắt đầu', primary: true, action: () => startLevel(mx) }]);
  } else if (S.mode === 'intro') {
    const d = S.dish, cols = 5, cellH = portrait ? 96 : 84;
    overlay(S.level === 1 ? d.name : 'Món mới: ' + d.name, [
      [d.desc, ''],
      ['Màn ' + S.level + '–' + (S.level + 9) + ' · Mục tiêu màn này ' + fmt(S.target), 'b'],
    ], [toLevels, { label: 'Vào bếp!', primary: true, action: beginPlay }], -1, true, {
      h: cellH * 2,
      draw(x, y, w) {
        const cw = w / cols;
        ING.forEach((sp, k) => {
          const cx = x + (k % cols) * cw + cw / 2, cy = y + Math.floor(k / cols) * cellH;
          const rx = Math.min(cw * .3, 30), B = { cx, cy: cy + 30, rx, ry: rx * .6, s: rx / 95, icon: true };
          drawDish(B); sp.draw(g, { ...B, rx: rx * .88, ry: B.ry * .88, s: B.s * .88 });
          g.fillStyle = d.base.includes(sp.id) ? '#b23a12' : '#3e2412'; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
          fitText(sp.name, cx, cy + 72, cw - 6, 15, 700);
        });
      },
    });
  } else if (S.mode === 'levels') {
    drawLevels();
  } else if (S.mode === 'pause') {
    overlay('Tạm dừng', [['Game tự dừng khi bạn chuyển tab hoặc rời cửa sổ.', '']],
      [toLevels, { label: 'Chơi lại', action: () => startLevel(S.level) }, { label: 'Tiếp tục', primary: true, action: resume }]);
  } else if (S.mode === 'result') {
    const pass = S.stars > 0, next = S.level + 1, newDish = pass && next % 10 === 1 && next <= CHAPTERS.length * 10;
    overlay(pass ? 'Qua màn ' + S.level + '!' : 'Chưa đạt mục tiêu', [
      ['Doanh thu ' + fmt(S.money) + ' / mục tiêu ' + fmt(S.target), 'b'],
      ['Phục vụ ' + S.served + ' khách · ' + S.lost + ' khách bỏ đi', ''],
      ...(newDish ? [['Mở khóa món mới: ' + CHAPTERS[(next - 1) / 10].name + '!', 'b']] : []),
      ...(mouse ? [['Enter: ' + (pass ? 'màn tiếp' : 'chơi lại') + ' · R: chơi lại màn này', '']] : []),
    ], pass
      ? [toLevels, { label: 'Chơi lại', action: () => startLevel(S.level) }, { label: (newDish ? 'Món mới' : 'Màn ' + next) + ' ▶', primary: true, action: () => startLevel(next) }]
      : [toLevels, { label: 'Chơi lại', primary: true, action: () => startLevel(S.level) }],
    S.stars, S.rt - S.resultAt > .8);
  } else S.buttons = [];
  g.restore();
}

