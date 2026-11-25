'use strict';
// ===================== Bố cục (tự đổi ngang/dọc) =====================
function resize() {
  VW = innerWidth; VH = innerHeight; DPR = Math.min(devicePixelRatio || 1, 2);
  cv.width = Math.round(VW * DPR); cv.height = Math.round(VH * DPR);
  portrait = VH > VW;
  if (portrait) { LW = 720; LH = Math.round(clamp(VH / VW * 720, 1400, 1640)); }
  else { LH = 720; LW = Math.round(clamp(VW / VH * 720, 1000, 1700)); }
  SC = Math.min(VW / LW, VH / LH); OX = (VW - LW * SC) / 2; OY = (VH - LH * SC) / 2;
  layout();
}
function layout() {
  const trays = [], gap = 12, n = S.seatsN;
  const mk = (x, y, w, h, slot) => {
    let kind, idx = -1;
    if (typeof slot === 'number') { kind = 'ing'; idx = slot; }
    else if (slot[0] === 'd' && slot.length === 2) { kind = 'drink'; idx = +slot[1]; }
    else kind = slot;
    trays.push({ x, y, w, h, kind, idx, pressT: -9 });
  };
  const grid = (x0, x1, y0, y1, rows) => {
    const rh = (y1 - y0 - gap * (rows.length - 1)) / rows.length;
    rows.forEach((r, ri) => {
      const cw = (x1 - x0 - gap * (r.length - 1)) / r.length;
      r.forEach((s, ci) => mk(x0 + ci * (cw + gap), y0 + ri * (rh + gap), cw, rh, s));
    });
  };
  L = { seats: [] };
  if (!portrait) {
    const TB = 56, edge = 300, cx = LW / 2, bowl = { cx, cy: 455, rx: 148, ry: 86 }, cw = 2 * bowl.rx + 24;
    Object.assign(L, { TB, edge, cx, bowl, pause: { x: 8, y: 4, w: 48, h: 48 }, bar: { x: 170, w: LW - 170 - 170 }, timerX: LW - 22 });
    const sw = (LW - 24) / n;
    for (let i = 0; i < n; i++) {
      const x = 12 + i * sw, tw = Math.min(290, sw - 142), gw = 130 + tw, ox = x + (sw - gw) / 2;
      L.seats.push({ x, y: TB, w: sw, h: edge - TB + 10, cx: ox + 62, sc: .7, tail: 'left',
        tk: { x: ox + 130, y: TB + 10, w: tw, h: edge - TB - 24 } });
    }
    const sideW = (LW - 32 - cw - 32) / 2, y0 = edge + 38, y1 = LH - 14;
    grid(16, 16 + sideW, y0, y1, sideW >= 400 ? [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 'trash']] : [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 'trash']]);
    grid(LW - 16 - sideW, LW - 16, y0, y1, [['d0', 'd1'], ['d2', 'd3'], ['d4', 'd5']]);
    const sy = bowl.cy + bowl.ry * 1.45 + 10, sx0 = cx - cw / 2, w1 = cw * .62;
    mk(sx0, sy, w1, y1 - sy, 'serve');
    mk(sx0 + w1 + gap, sy, cw - w1 - gap, y1 - sy, 'held');
  } else {
    const TB = 64, edge = TB + Math.round(clamp((LH - TB) * .31, 400, 470)), cx = LW / 2, bowl = { cx, cy: edge + 26 + 128, rx: 200, ry: 112 };
    Object.assign(L, { TB, edge, cx, bowl, pause: { x: 8, y: 8, w: 48, h: 48 }, bar: { x: 150, w: LW - 150 - 140 }, timerX: LW - 14 });
    const sw = (LW - 16) / n;
    for (let i = 0; i < n; i++) {
      const x = 8 + i * sw;
      L.seats.push({ x, y: TB, w: sw, h: edge - TB + 10, cx: x + sw / 2, sc: .62, tail: 'down',
        tk: { x: x + 6, y: TB + 8, w: sw - 12, h: edge - 160 - TB - 8 } });
    }
    const sy = bowl.cy + bowl.ry * 1.45 + 10, sh = 84, w1 = (LW - 28) * .62;
    mk(14, sy, w1, sh, 'serve');
    mk(14 + w1 + gap, sy, LW - 28 - w1 - gap, sh, 'held');
    grid(14, LW - 14, sy + sh + 14, LH - 14, [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 'trash'], ['d0', 'd1', 'd2'], ['d3', 'd4', 'd5']]);
  }
  L.trays = trays;
}

