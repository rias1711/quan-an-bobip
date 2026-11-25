'use strict';
// ===================== Đồ uống =====================
const DRINKS = [
  { id: 'tra',      name: 'Trà đá',     price: 5000,  col: '#b98a36', top: '#dcb565', ice: true,  glass: 'tall' },
  { id: 'nhantran', name: 'Nhân trần',  price: 8000,  col: '#d9b54a', top: '#efd88a', ice: true,  glass: 'short', garnish: 'leaf' },
  { id: 'voi',      name: 'Nước vối',   price: 8000,  col: '#6e3418', top: '#9c5530', ice: true,  glass: 'tall' },
  { id: 'coca',     name: 'Coca',       price: 15000, col: '#2a0f05', top: '#4e2210', ice: true,  glass: 'tall', garnish: 'straw', fizz: true },
  { id: 'nchanh',   name: 'Nước chanh', price: 12000, col: '#dfe69a', top: '#f4f7c8', ice: true,  glass: 'tall', garnish: 'lemon' },
  { id: 'suadau',   name: 'Sữa đậu',    price: 10000, col: '#f1e6c8', top: '#fbf5e4', ice: false, glass: 'bottle' },
];
const DBYID = Object.fromEntries(DRINKS.map(d => [d.id, d]));
const DKEYS = ['A', 'S', 'D', 'F', 'G', 'H'];
const SEATKEYS = ['Q', 'W', 'E', 'R'];

// Vẽ ly nước, (x, y) là tâm đáy ly, h là chiều cao
function drawDrink(d, x, y, h) {
  g.save(); g.translate(x, y);
  g.fillStyle = 'rgba(0,0,0,.2)'; ell(0, 0, h * .3, h * .07); g.fill();
  if (d.glass === 'bottle') {
    const w = h * .38, bh = h * .64;
    g.fillStyle = d.col;
    rr(-w / 2, -bh, w, bh, w * .28); g.fill();
    g.beginPath(); g.moveTo(-w / 2, -bh + w * .3);
    g.quadraticCurveTo(-w / 2, -bh - h * .1, -w * .2, -bh - h * .14); g.lineTo(-w * .2, -h * .9);
    g.lineTo(w * .2, -h * .9); g.lineTo(w * .2, -bh - h * .14);
    g.quadraticCurveTo(w / 2, -bh - h * .1, w / 2, -bh + w * .3); g.closePath(); g.fill();
    g.fillStyle = '#2e7d32'; rr(-w * .26, -h, w * .52, h * .11, 3); g.fill();
    g.fillStyle = '#8bc34a'; g.fillRect(-w / 2, -bh * .66, w, bh * .28);
    g.fillStyle = '#f1f8e9'; ell(0, -bh * .52, w * .18, w * .1); g.fill();
    g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = Math.max(1, h * .03); g.lineCap = 'round';
    g.beginPath(); g.moveTo(-w * .3, -bh * .92); g.lineTo(-w * .3, -bh * .75); g.stroke();
  } else {
    const tall = d.glass === 'tall';
    const gh = tall ? h : h * .74, wb = tall ? h * .36 : h * .5, wt = tall ? h * .5 : h * .64;
    const wAt = f => wb + (wt - wb) * f, lv = .8, ins = h * .025;
    g.fillStyle = 'rgba(215,235,245,.3)';
    g.beginPath(); g.moveTo(-wb / 2, 0); g.lineTo(-wt / 2, -gh); g.lineTo(wt / 2, -gh); g.lineTo(wb / 2, 0); g.closePath(); g.fill();
    const gr = g.createLinearGradient(0, 0, 0, -gh * lv);
    gr.addColorStop(0, d.col); gr.addColorStop(1, d.top);
    g.fillStyle = gr;
    g.beginPath(); g.moveTo(-wb / 2 + ins, -ins); g.lineTo(-wAt(lv) / 2 + ins, -gh * lv);
    g.lineTo(wAt(lv) / 2 - ins, -gh * lv); g.lineTo(wb / 2 - ins, -ins); g.closePath(); g.fill();
    if (d.ice) {
      g.fillStyle = 'rgba(255,255,255,.45)'; g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = Math.max(1, h * .015);
      const cs = h * .15;
      for (const [u, f, r] of [[-.17, .7, .3], [.13, .74, -.25], [-.01, .56, .1]]) {
        g.save(); g.translate(u * wt, -gh * f); g.rotate(r); rr(-cs / 2, -cs / 2, cs, cs, cs * .25); g.fill(); g.stroke(); g.restore();
      }
    }
    if (d.fizz) {
      g.fillStyle = 'rgba(255,255,255,.6)';
      for (let i = 0; i < 8; i++) { const f = .08 + ((i * 37) % 70) / 100; ell(((i * 53) % 100 / 100 - .5) * wAt(f) * .7, -gh * f * lv, h * .02, h * .02); g.fill(); }
    }
    g.strokeStyle = 'rgba(255,255,255,.92)'; g.lineWidth = Math.max(1.2, h * .03); g.lineJoin = 'round';
    g.beginPath(); g.moveTo(-wt / 2, -gh); g.lineTo(-wb / 2, 0); g.lineTo(wb / 2, 0); g.lineTo(wt / 2, -gh); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,.75)'; ell(0, -gh, wt / 2, h * .035); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = Math.max(1, h * .035); g.lineCap = 'round';
    g.beginPath(); g.moveTo(-wb * .28, -h * .08); g.lineTo(-wt * .3, -gh * .88); g.stroke();
    if (d.garnish === 'straw') {
      g.strokeStyle = '#e53935'; g.lineWidth = Math.max(2, h * .055);
      g.beginPath(); g.moveTo(wt * .05, -gh * .5); g.lineTo(wt * .34, -gh - h * .22); g.stroke();
    }
    if (d.garnish === 'lemon') {
      const r = h * .14;
      g.save(); g.translate(wt * .46, -gh);
      g.fillStyle = '#f9e04b'; ell(0, 0, r, r); g.fill();
      g.fillStyle = '#fff7c2'; ell(0, 0, r * .78, r * .78); g.fill();
      g.strokeStyle = '#f2cf2a'; g.lineWidth = Math.max(1, h * .014);
      for (let a = 0; a < 6; a++) { g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a * Math.PI / 3) * r * .75, Math.sin(a * Math.PI / 3) * r * .75); g.stroke(); }
      g.restore();
    }
    if (d.garnish === 'leaf') {
      g.save(); g.translate(wt * .28, -gh - h * .03); g.rotate(-.6);
      g.fillStyle = '#558b2f'; ell(0, 0, h * .14, h * .055); g.fill();
      g.strokeStyle = '#9ccc65'; g.lineWidth = Math.max(1, h * .012);
      g.beginPath(); g.moveTo(-h * .12, 0); g.lineTo(h * .12, 0); g.stroke();
      g.restore();
    }
  }
  g.restore();
}

