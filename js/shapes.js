'use strict';
// ===================== Nguyên liệu: mô tả bằng dữ liệu =====================
// B = {cx, cy, rx, ry, s, icon}: vùng elip để vẽ, s = tỉ lệ kích thước miếng
const X = (B, u) => B.cx + u * B.rx, Y = (B, v) => B.cy + v * B.ry;
function hashStr(str) { let h = 2166136261; for (const ch of str) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function ptsOf(B, sp) {
  const n = B.icon ? sp.n[1] : sp.n[0], r = B.icon ? [0, 0, .55] : sp.reg;
  return spots(n, sp.seed, r[0], r[1], r[2]);
}
// Mỗi "shape" là một cách vẽ; nguyên liệu mới chỉ cần chọn shape + màu
const SH = {
  fill(g, B, sp) {
    const gr = g.createRadialGradient(B.cx - B.rx * .2, B.cy - B.ry * .3, B.rx * .1, B.cx, B.cy, B.rx);
    gr.addColorStop(0, sp.c[0]); gr.addColorStop(1, sp.c[1]);
    g.fillStyle = gr; ell(B.cx, B.cy, B.rx, B.ry); g.fill();
    g.fillStyle = sp.c[2];
    for (const p of spots(B.icon ? 4 : 10, 77, 0, 0, .75)) { ell(X(B, p.u), Y(B, p.v), (3 + p.k * 5) * B.s, (2 + p.k * 3) * B.s); g.fill(); }
  },
  paper(g, B, sp) {
    g.save(); ell(B.cx, B.cy, B.rx * .9, B.ry * .9); g.fillStyle = sp.c[0]; g.fill(); g.clip();
    g.strokeStyle = sp.c[1]; g.lineWidth = Math.max(.6, 1.1 * B.s);
    for (let i = -12; i <= 12; i++) { const x = B.cx + i * B.rx * .09; g.beginPath(); g.moveTo(x - B.rx * .3, B.cy - B.ry); g.lineTo(x + B.rx * .3, B.cy + B.ry); g.stroke(); }
    g.restore();
    g.strokeStyle = 'rgba(190,170,140,.6)'; g.lineWidth = 1.5 * B.s; ell(B.cx, B.cy, B.rx * .9, B.ry * .9); g.stroke();
  },
  rice(g, B, sp) {
    const r = B.icon ? [0, 0, .7] : sp.reg, cx = X(B, r[0]), cy = Y(B, r[1]);
    g.fillStyle = sp.c[1]; ell(cx, cy + 3 * B.s, B.rx * r[2] * 1.15, B.ry * r[2] * 1.15); g.fill();
    g.fillStyle = sp.c[0]; ell(cx, cy, B.rx * r[2] * 1.1, B.ry * r[2] * 1.1); g.fill();
    for (const p of spots(B.icon ? 30 : 90, sp.seed, r[0], r[1], r[2])) {
      g.fillStyle = p.k > .5 ? '#ffffff' : sp.c[1];
      g.save(); g.translate(X(B, p.u), Y(B, p.v)); g.rotate(p.rot); ell(0, 0, 3 * B.s, 1.5 * B.s); g.fill(); g.restore();
    }
  },
  strands(g, B, sp) {
    const pts = ptsOf(B, sp), z = sp.size || 1;
    g.lineCap = 'round';
    for (const [col, lw] of [[sp.c[0], 7], [sp.c[1], 4.2]]) {
      g.strokeStyle = col; g.lineWidth = lw * z * B.s;
      for (const p of pts) {
        const l = 46 * B.s, w = 10 * B.s * (p.k > .5 ? 1 : -1);
        g.save(); g.translate(X(B, p.u), Y(B, p.v)); g.rotate((p.rot % 1.2) - .6);
        g.beginPath(); g.moveTo(-l / 2, 0); g.bezierCurveTo(-l / 5, -w, l / 5, w, l / 2, 0); g.stroke(); g.restore();
      }
    }
  },
  shreds(g, B, sp) {
    const z = sp.size || 1; g.lineCap = 'round';
    for (const p of ptsOf(B, sp)) {
      const l = (14 + p.k * 12) * B.s * (sp.len || 1);
      g.save(); g.translate(X(B, p.u), Y(B, p.v)); g.rotate(p.rot);
      g.strokeStyle = 'rgba(0,0,0,.12)'; g.lineWidth = (3.4 * z + 1.2) * B.s;
      g.beginPath(); g.moveTo(-l / 2, 1.2 * B.s); g.lineTo(l / 2, 1.2 * B.s); g.stroke();
      g.strokeStyle = sp.c[p.k > .5 ? 0 : 1]; g.lineWidth = 3.4 * z * B.s;
      g.beginPath(); g.moveTo(-l / 2, 0); g.quadraticCurveTo(0, (p.k - .5) * 6 * B.s, l / 2, 0); g.stroke();
      g.restore();
    }
  },
  slices(g, B, sp) {
    const z = sp.size || 1;
    for (const p of ptsOf(B, sp)) {
      g.save(); g.translate(X(B, p.u), Y(B, p.v)); g.rotate(p.rot); g.scale(1, .75);
      g.fillStyle = 'rgba(0,0,0,.18)'; ell(1.5 * B.s, 3 * B.s, 30 * z * B.s, 15 * z * B.s); g.fill();
      g.fillStyle = sp.c[0]; ell(0, 0, 30 * z * B.s, 15 * z * B.s); g.fill();
      g.strokeStyle = sp.c[1]; g.lineWidth = 3 * B.s; g.lineCap = 'round';
      g.beginPath(); g.moveTo(-22 * z * B.s, -3 * B.s); g.quadraticCurveTo(0, -9 * z * B.s, 22 * z * B.s, -2 * B.s); g.stroke();
      g.restore();
    }
  },
  balls(g, B, sp) {
    const z = sp.size || 1;
    for (const p of ptsOf(B, sp)) {
      const x = X(B, p.u), y = Y(B, p.v), r = 11 * z * B.s;
      g.fillStyle = 'rgba(0,0,0,.2)'; ell(x + 2 * B.s, y + 3 * B.s, r, r * .8); g.fill();
      const gr = g.createRadialGradient(x - r * .35, y - r * .35, r * .1, x, y, r);
      gr.addColorStop(0, sp.c[0]); gr.addColorStop(1, sp.c[1]);
      g.fillStyle = gr; ell(x, y, r, r); g.fill();
    }
  },
  rings(g, B, sp) {
    const z = sp.size || 1; g.lineWidth = 2.6 * z * B.s;
    for (const p of ptsOf(B, sp)) { g.strokeStyle = p.k > .78 ? sp.c[1] : sp.c[0]; ell(X(B, p.u), Y(B, p.v), 4.6 * z * B.s, 3.8 * z * B.s); g.stroke(); }
  },
  chili(g, B, sp) {
    for (const p of ptsOf(B, sp)) {
      const x = X(B, p.u), y = Y(B, p.v);
      g.fillStyle = sp.c[1]; ell(x, y, 5 * B.s, 4.2 * B.s); g.fill();
      g.strokeStyle = sp.c[0]; g.lineWidth = 3.2 * B.s; ell(x, y, 6.2 * B.s, 5.2 * B.s); g.stroke();
      g.fillStyle = '#ffc107'; ell(x + 1.5 * B.s, y, 1.4 * B.s, 1.4 * B.s); g.fill();
    }
  },
  leaves(g, B, sp) {
    const z = sp.size || 1;
    for (const p of ptsOf(B, sp)) {
      g.save(); g.translate(X(B, p.u), Y(B, p.v)); g.rotate(p.rot);
      g.fillStyle = p.k > .5 ? sp.c[0] : sp.c[1]; ell(0, 0, 13 * z * B.s, 6 * z * B.s); g.fill();
      g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 1.2 * B.s;
      g.beginPath(); g.moveTo(-11 * z * B.s, 0); g.lineTo(11 * z * B.s, 0); g.stroke();
      g.restore();
    }
  },
  sprouts(g, B, sp) {
    const pts = ptsOf(B, sp); g.lineCap = 'round';
    for (const [col, lw] of [[sp.c[1], 5.4], [sp.c[0], 3.6]]) {
      g.strokeStyle = col; g.lineWidth = lw * B.s;
      for (const p of pts) {
        g.save(); g.translate(X(B, p.u), Y(B, p.v)); g.rotate(p.rot);
        g.beginPath(); g.moveTo(-12 * B.s, 0); g.quadraticCurveTo(0, -6 * B.s, 12 * B.s, 0); g.stroke(); g.restore();
      }
    }
    g.fillStyle = sp.c[2];
    for (const p of pts) { g.save(); g.translate(X(B, p.u), Y(B, p.v)); g.rotate(p.rot); ell(12 * B.s, 0, 3.2 * B.s, 2.6 * B.s); g.fill(); g.restore(); }
  },
  wedge(g, B, sp) {
    for (const p of ptsOf(B, sp)) {
      const r = 17 * (sp.size || 1) * B.s;
      g.save(); g.translate(X(B, p.u), Y(B, p.v)); g.rotate(B.icon ? p.rot : -.4);
      g.fillStyle = sp.c[0]; g.beginPath(); g.arc(0, 0, r, 0, Math.PI); g.closePath(); g.fill();
      g.fillStyle = sp.c[1]; g.beginPath(); g.arc(0, 0, r * .8, 0, Math.PI); g.closePath(); g.fill();
      g.strokeStyle = 'rgba(255,255,240,.9)'; g.lineWidth = 1.3 * B.s;
      for (const a of [Math.PI / 4, Math.PI / 2, Math.PI * 3 / 4]) { g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a) * r * .8, Math.sin(a) * r * .8); g.stroke(); }
      g.restore();
    }
  },
  shrimp(g, B, sp) {
    const z = sp.size || 1;
    for (const p of ptsOf(B, sp)) {
      const r = 11 * z * B.s, lw = 8 * z * B.s;
      g.save(); g.translate(X(B, p.u), Y(B, p.v)); g.rotate(p.rot); g.lineCap = 'round';
      g.strokeStyle = 'rgba(0,0,0,.15)'; g.lineWidth = lw; g.beginPath(); g.arc(1 * B.s, 2 * B.s, r, .25 * Math.PI, 1.55 * Math.PI); g.stroke();
      g.strokeStyle = sp.c[0]; g.beginPath(); g.arc(0, 0, r, .25 * Math.PI, 1.55 * Math.PI); g.stroke();
      g.strokeStyle = sp.c[1]; g.lineWidth = 1.4 * B.s;
      for (let a = .45; a < 1.5; a += .22) {
        g.beginPath(); g.moveTo(Math.cos(a * Math.PI) * (r - lw * .45), Math.sin(a * Math.PI) * (r - lw * .45));
        g.lineTo(Math.cos(a * Math.PI) * (r + lw * .45), Math.sin(a * Math.PI) * (r + lw * .45)); g.stroke();
      }
      const tx = Math.cos(.25 * Math.PI) * r, ty = Math.sin(.25 * Math.PI) * r;
      g.fillStyle = '#e64a19'; g.beginPath(); g.moveTo(tx, ty); g.lineTo(tx + 8 * z * B.s, ty + 2 * B.s); g.lineTo(tx + 2 * B.s, ty + 9 * z * B.s); g.closePath(); g.fill();
      g.restore();
    }
  },
  dots(g, B, sp) {
    const z = sp.size || 1;
    for (const p of ptsOf(B, sp)) { g.fillStyle = sp.c[p.k > .5 ? 0 : 1]; ell(X(B, p.u), Y(B, p.v), (1.8 + p.k * 1.4) * z * B.s, (1.5 + p.k * 1.2) * z * B.s); g.fill(); }
  },
  dollop(g, B, sp) {
    const z = sp.size || 1;
    for (const p of ptsOf(B, sp)) {
      const x = X(B, p.u), y = Y(B, p.v), r = 14 * z * B.s;
      g.fillStyle = 'rgba(0,0,0,.15)'; ell(x + 2 * B.s, y + 3 * B.s, r, r * .72); g.fill();
      g.fillStyle = sp.c[0]; ell(x, y, r, r * .72); g.fill(); ell(x + r * .45, y - r * .2, r * .55, r * .45); g.fill();
      g.fillStyle = sp.c[1]; ell(x - r * .3, y - r * .25, r * .3, r * .16); g.fill();
    }
  },
  patty(g, B, sp) {
    const z = (sp.size || 1) * B.s;
    for (const p of ptsOf(B, sp)) {
      g.save(); g.translate(X(B, p.u), Y(B, p.v)); g.rotate(p.rot); g.scale(z, z);
      g.fillStyle = 'rgba(0,0,0,.2)'; rr(-14, -6, 32, 18, 7); g.fill();
      g.fillStyle = sp.c[0]; rr(-16, -9, 32, 18, 7); g.fill();
      g.strokeStyle = sp.c[1]; g.lineWidth = 2.2; g.lineCap = 'round';
      for (let i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(i * 9 - 4, -6); g.lineTo(i * 9 + 4, 6); g.stroke(); }
      g.restore();
    }
  },
  sticks(g, B, sp) {
    const z = (sp.size || 1) * B.s;
    for (const p of ptsOf(B, sp)) {
      g.save(); g.translate(X(B, p.u), Y(B, p.v)); g.rotate(p.rot); g.scale(z, z);
      g.fillStyle = sp.c[p.k > .5 ? 0 : 1]; rr(-10, -2.6, 20, 5.2, 2); g.fill(); g.restore();
    }
  },
  caps(g, B, sp) {
    const z = sp.size || 1;
    for (const p of ptsOf(B, sp)) {
      const x = X(B, p.u), y = Y(B, p.v), r = 9 * z * B.s;
      g.fillStyle = 'rgba(0,0,0,.2)'; ell(x + 1.5 * B.s, y + 2.5 * B.s, r, r * .85); g.fill();
      g.fillStyle = sp.c[0]; ell(x, y, r, r * .85); g.fill();
      g.strokeStyle = sp.c[1]; g.lineWidth = 1.8 * B.s;
      g.beginPath(); g.moveTo(x - r * .5, y - r * .4); g.lineTo(x + r * .5, y + r * .4); g.moveTo(x + r * .5, y - r * .4); g.lineTo(x - r * .5, y + r * .4); g.stroke();
    }
  },
  egg(g, B, sp) {
    const z = sp.size || 1;
    for (const p of ptsOf(B, sp)) {
      const x = X(B, p.u), y = Y(B, p.v), r = 22 * z * B.s;
      g.fillStyle = 'rgba(0,0,0,.15)'; ell(x + 2 * B.s, y + 3 * B.s, r, r * .75); g.fill();
      g.fillStyle = '#fffdf6'; ell(x, y, r, r * .75); g.fill(); ell(x + r * .45, y - r * .25, r * .6, r * .5); g.fill(); ell(x - r * .4, y + r * .2, r * .55, r * .45); g.fill();
      const gr = g.createRadialGradient(x - r * .12, y - r * .12, 1, x, y, r * .42);
      gr.addColorStop(0, '#ffe082'); gr.addColorStop(1, '#ff9800');
      g.fillStyle = gr; ell(x, y, r * .4, r * .34); g.fill();
    }
  },
  rib(g, B, sp) {
    const z = (sp.size || 1) * B.s;
    for (const p of ptsOf(B, sp)) {
      g.save(); g.translate(X(B, p.u), Y(B, p.v)); g.rotate(-.25); g.scale(z, z);
      g.fillStyle = '#f3ead6'; rr(22, -5, 20, 10, 5); g.fill(); ell(42, -4, 5, 5); g.fill(); ell(42, 4, 5, 5); g.fill();
      g.fillStyle = 'rgba(0,0,0,.2)'; rr(-30, -11, 58, 26, 11); g.fill();
      g.fillStyle = sp.c[0]; rr(-32, -14, 58, 26, 11); g.fill();
      g.fillStyle = sp.c[1]; rr(-26, -10, 44, 7, 3.5); g.fill();
      g.strokeStyle = 'rgba(40,10,0,.55)'; g.lineWidth = 2.4; g.lineCap = 'round';
      for (let i = -2; i <= 1; i++) { g.beginPath(); g.moveTo(i * 11 - 3, -9); g.lineTo(i * 11 + 5, 9); g.stroke(); }
      g.restore();
    }
  },
  cubes(g, B, sp) {
    const z = (sp.size || 1) * B.s;
    for (const p of ptsOf(B, sp)) {
      g.save(); g.translate(X(B, p.u), Y(B, p.v)); g.rotate(p.rot * .3); g.scale(z, z);
      g.fillStyle = 'rgba(0,0,0,.2)'; rr(-6, -4, 13, 13, 3); g.fill();
      g.fillStyle = sp.c[0]; rr(-7, -7, 13, 13, 3); g.fill();
      g.fillStyle = sp.c[1]; rr(-5, -6, 8, 3, 1.5); g.fill();
      g.restore();
    }
  },
  discs(g, B, sp) {
    const z = sp.size || 1;
    for (const p of ptsOf(B, sp)) {
      const x = X(B, p.u), y = Y(B, p.v), r = 10 * z * B.s;
      g.fillStyle = 'rgba(0,0,0,.15)'; ell(x + 1.5 * B.s, y + 2.5 * B.s, r, r * .8); g.fill();
      g.fillStyle = sp.c[0]; ell(x, y, r, r * .8); g.fill();
      g.fillStyle = sp.c[1]; ell(x, y, r * .76, r * .6); g.fill();
      g.fillStyle = sp.c[2];
      for (let a = 0; a < 5; a++) { ell(x + Math.cos(a * 1.26) * r * .35, y + Math.sin(a * 1.26) * r * .28, r * .1, r * .08); g.fill(); }
    }
  },
  drizzle(g, B, sp) {
    const r = B.icon ? [0, 0, .5] : sp.reg;
    g.strokeStyle = sp.c[0]; g.lineWidth = 3.2 * B.s; g.lineCap = 'round'; g.lineJoin = 'round';
    for (let j = 0; j < 2; j++) {
      g.beginPath();
      for (let i = 0; i <= 16; i++) {
        const f = i / 16, u = r[0] + (f - .5) * r[2] * 2, v = r[1] + (j - .5) * r[2] * .6 + Math.sin(f * Math.PI * 5 + j) * r[2] * .25;
        i ? g.lineTo(X(B, u), Y(B, v)) : g.moveTo(X(B, u), Y(B, v));
      }
      g.stroke();
    }
    g.fillStyle = sp.c[1];
    for (const p of spots(B.icon ? 4 : 8, sp.seed, r[0], r[1], r[2])) { ell(X(B, p.u), Y(B, p.v), 2.2 * B.s, 1.8 * B.s); g.fill(); }
  },
};

// I(id, tên, lớp vẽ, shape, màu, [số miếng trong bát, số miếng ở khay], [vùng u, v, độ rải], thêm)
function I(id, name, layer, shape, c, n, reg, extra = {}) { return { id, name, layer, shape, c, n, reg, ...extra }; }
const BUN = ['#ddd5c2', '#ffffff'], HANH = ['#43a047', '#d6e8b0'], RAU = ['#2e7d32', '#388e3c'];

