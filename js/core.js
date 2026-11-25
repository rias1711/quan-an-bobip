'use strict';
// ===================== Cơ bản =====================
const cv = document.getElementById('c');
const g = cv.getContext('2d');
let DPR = 1, VW = 1, VH = 1, LW = 1280, LH = 720, SC = 1, OX = 0, OY = 0, portrait = false;
let L = {};
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const easeOut = k => 1 - Math.pow(1 - k, 3);
const easeIn = k => k * k * k;
const fmt = n => n.toLocaleString('vi-VN') + 'đ';
const FONT = 'system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
const font = (sz, w = 700) => `${w} ${sz}px ${FONT}`;

function rng(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function spots(n, seed, uc, vc, spread) {
  const r = rng(seed), out = [];
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2, d = Math.sqrt(r()) * spread;
    let u = uc + Math.cos(a) * d, v = vc + Math.sin(a) * d;
    const m = Math.hypot(u, v);
    if (m > 0.85) { u *= 0.85 / m; v *= 0.85 / m; }
    out.push({ u, v, rot: r() * Math.PI * 2, k: r() });
  }
  return out;
}
function rr(x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  g.beginPath();
  g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}
function ell(x, y, rx, ry) { g.beginPath(); g.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, Math.PI * 2); }


