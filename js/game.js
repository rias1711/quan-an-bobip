'use strict';
// ===================== Luật chơi =====================
const SKINS = ['#f1c27d', '#e0ac69', '#c68642', '#ffdbac', '#d4a373'];
const HAIRS = ['#2b1b10', '#4a2c18', '#151515', '#6b4226', '#9e9e9e'];
const SHIRTS = ['#e57373', '#64b5f6', '#81c784', '#ffb74d', '#ba68c8', '#4db6ac', '#f06292'];
const pick = a => a[Math.floor(Math.random() * a.length)];
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

function startLevel(lv) {
  audio(); sfx.click();
  const C = levelCfg(lv);
  S.cfg = C; S.level = lv; S.seatsN = portrait ? Math.min(3, C.seats) : C.seats; setDish(C.dish);
  Object.assign(S, {
    timeLeft: LEVEL_TIME, target: C.target, money: 0, combo: 0, served: 0, lost: 0, lastTick: 99,
    seats: Array(S.seatsN).fill(null), seatNext: Array(S.seatsN).fill(0),
    bowl: new Map(), drink: null, fx: [], hover: null,
  });
  layout();
  if (C.li === 1) S.mode = 'intro'; else beginPlay();
}
function beginPlay() {
  audio(); S.mode = 'play';
  S.seatNext = S.seatNext.map((_, i) => S.gt + .6 + i * 1.2);
  float('Màn ' + S.level + ' · Mục tiêu ' + fmt(S.target), LW / 2, L.bowl.cy - 30, '#b23a12', portrait ? 30 : 34, 2.4);
}
function spawn(i) {
  const C = S.cfg, d = C.dish, r = Math.random();
  const drinkOnly = r < .12, hasDrink = drinkOnly || Math.random() < C.drinkP;
  let pho = null, drink = null;
  if (!drinkOnly) {
    const nM = d.mainsMin + Math.floor(Math.random() * (C.mainsMax - d.mainsMin + 1));
    const nO = Math.max(0, C.optMax - 2) + Math.floor(Math.random() * (Math.min(C.optMax, 2) + 1));
    pho = [...d.base, ...shuffle([...d.mains]).slice(0, nM), ...shuffle([...d.opt]).slice(0, Math.min(d.opt.length, nO))]
      .sort((a, b) => BYID[a] - BYID[b]);
  }
  if (hasDrink) drink = DRINKS[Math.floor(Math.random() * C.drinks)].id;
  const max = Math.max(10, (18 + (pho ? pho.length * 1.4 : 0) + (drink ? 3 : 0)) * C.patience);
  S.seats[i] = { seat: i, pho, drink, gotPho: false, gotDrink: false, bowlItems: null, landPho: 0, landDrink: 0,
    max, patience: max, enterT: S.gt, leaveT: 0, state: 'enter', happy: false, hurtT: -9,
    look: { skin: pick(SKINS), hair: pick(HAIRS), shirt: pick(SHIRTS), style: Math.random() < .5 ? 0 : 1 } };
}
function float(text, x, y, col, size = 30, dur = 1) { S.fx.push({ type: 'text', text, x, y, col, size, t0: S.gt, dur }); }
function sparks(x, y, n, cols) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, v = 120 + Math.random() * 220;
    S.fx.push({ type: 'spark', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 120, col: pick(cols), t0: S.gt, dur: .6 + Math.random() * .3 });
  }
}
function press(kind, idx) {
  const T = L.trays.find(t => t.kind === kind && (idx === undefined || t.idx === idx));
  if (T) T.pressT = S.rt;
  return T;
}
const active = () => S.seats.filter(c => c && c.state !== 'leaving');
const byUrg = (a, b) => a.patience / a.max - b.patience / b.max;
function phoDiff(c) {
  return { miss: c.pho.filter(id => !S.bowl.has(id)), extra: [...S.bowl.keys()].filter(id => !c.pho.includes(id)) };
}
const exact = c => { const d = phoDiff(c); return !d.miss.length && !d.extra.length; };
const needPho = c => c.pho && !c.gotPho;
const needDrink = c => c.drink && !c.gotDrink;
function heldPos() { const H = L.trays.find(t => t.kind === 'held'); return { x: H.x + H.w / 2, y: H.y + H.h - 24 }; }

function addIng(i) {
  const id = ING[i].id, T = press('ing', i);
  if (S.bowl.has(id)) { sfx.dup(); S.bowlBump = S.gt; return; }
  const B = L.bowl, r = ING[i].reg;
  S.bowl.set(id, S.gt + .13);
  if (T) S.fx.push({ type: 'fly', i, x0: T.x + T.w / 2, y0: T.y + T.h / 2, x1: B.cx + r[0] * B.rx * .8, y1: B.cy + r[1] * B.ry * .8, t0: S.gt, dur: .13 });
  sfx.pop(i); buzz(8);
}
function pickDrink(di) {
  const d = DRINKS[di], T = press('drink', di);
  if (di >= S.cfg.drinks) { sfx.dup(); if (T) float('Mở ở màn ' + drinkUnlockLevel(di), T.x + T.w / 2, T.y + 10, '#6d4c41', 20, .9); return; }
  if (S.drink === d.id) { sfx.dup(); return; }
  S.drink = d.id; S.drinkAt = S.gt + .12;
  const p = heldPos();
  if (T) S.fx.push({ type: 'glass', id: d.id, x0: T.x + T.w / 2, y0: T.y + T.h - 30, x1: p.x, y1: p.y, h0: 60, h1: 60, t0: S.gt, dur: .12 });
  sfx.pour(); buzz(8);
}
function dropDrink() { press('held'); if (!S.drink) return; S.drink = null; sfx.trash(); }
function trash() {
  press('trash');
  if (!S.bowl.size) { sfx.dup(); return; }
  S.bowl = new Map(); sfx.trash(); buzz(20);
  sparks(L.bowl.cx, L.bowl.cy, 14, ['#bdbdbd', '#9e9e9e', '#d7ccc8']);
  float('Đổ bỏ', L.bowl.cx, L.bowl.cy - L.bowl.ry - 20, '#6d4c41', 26, .7);
}
function givePho(c) {
  const s = L.seats[c.seat], B = L.bowl;
  c.gotPho = true; c.bowlItems = new Map([...S.bowl.keys()].map(k => [k, -1])); c.landPho = S.gt + .3;
  S.fx.push({ type: 'bowl', items: c.bowlItems, x0: B.cx, y0: B.cy, x1: s.cx - 30, y1: L.edge + 2, sc1: 40 / B.rx, t0: S.gt, dur: .3 });
  S.bowl = new Map();
  afterGive(c);
}
function giveDrink(c) {
  const s = L.seats[c.seat], p = heldPos();
  c.gotDrink = true; c.landDrink = S.gt + .3;
  S.fx.push({ type: 'glass', id: S.drink, x0: p.x, y0: p.y, x1: s.cx + 42, y1: L.edge + 20, h0: 60, h1: 50, t0: S.gt, dur: .3 });
  S.drink = null;
  afterGive(c);
}
function afterGive(c) {
  const s = L.seats[c.seat];
  if (needPho(c) || needDrink(c)) {
    c.patience = Math.min(c.max, c.patience + c.max * .2);
    float('Cảm ơn!', s.cx, L.edge - 205, '#2e7d32', 22, .8); sfx.give(); buzz(12);
    return;
  }
  const ratio = c.patience / c.max;
  S.combo++; S.served++;
  const base = (c.pho ? 30000 + 5000 * c.pho.length : 0) + (c.drink ? DBYID[c.drink].price : 0);
  const tip = Math.round(ratio * 15000 / 1000) * 1000;
  const mult = 1 + .1 * Math.min(S.combo - 1, 10);
  const pay = Math.round((base + tip) * mult / 1000) * 1000;
  S.money += pay;
  c.state = 'leaving'; c.leaveT = S.gt + .45; c.happy = true;
  const hy = L.edge - 215;
  float('+' + fmt(pay), s.cx, hy, '#f9a825', 30, 1.1);
  if (ratio > .7) float('Nhanh quá!', s.cx, hy + 36, '#2e7d32', 20, 1);
  if (S.combo >= 2) float('Combo x' + S.combo, s.cx, hy - 34, '#e65100', 22, 1);
  sparks(s.cx, L.edge - 100, 20, ['#ffd54f', '#ffb300', '#fff59d', '#81c784']);
  sfx.ok(); sfx.coin(); buzz(25);
}
function failServe(msg, x, y, c) {
  float(msg, x, y, '#c62828', 24, 1.4);
  sfx.wrong(); S.combo = 0; buzz(60);
  if (c) { c.hurtT = S.gt; c.patience = Math.max(.01, c.patience - c.max * .1); S.shake = S.gt; }
  else S.bowlBump = S.gt;
}
// PHỤC VỤ / Enter: tự tìm đúng khách (ưu tiên khách sắp hết kiên nhẫn)
function autoServe() {
  press('serve');
  const B = L.bowl;
  if (!S.bowl.size && !S.drink) { sfx.dup(); S.bowlBump = S.gt; return; }
  let did = false, err = null;
  if (S.bowl.size) {
    const cands = active().filter(needPho);
    const ok = cands.filter(exact).sort(byUrg);
    if (ok.length) { givePho(ok[0]); did = true; }
    else if (cands.length) {
      const best = cands.map(c => ({ c, d: phoDiff(c) }))
        .sort((a, b) => (a.d.miss.length + a.d.extra.length) - (b.d.miss.length + b.d.extra.length))[0];
      err = best.d.miss.length ? 'Thiếu: ' + names(best.d.miss) : 'Thừa: ' + names(best.d.extra);
    } else err = 'Không ai đang chờ ' + S.dish.short;
  }
  if (S.drink) {
    const c = active().filter(c => needDrink(c) && c.drink === S.drink).sort(byUrg)[0];
    if (c) { giveDrink(c); did = true; }
    else if (!err) err = 'Không ai gọi ' + DBYID[S.drink].name;
  }
  if (err) { if (did) float(err, B.cx, B.cy - B.ry - 34, '#c62828', 22, 1.2); else failServe(err, B.cx, B.cy - B.ry - 34); }
}
// Chạm vào khách / phím Q W E: giao cho đúng người đó
function serveTo(i) {
  const c = S.seats[i];
  if (!c || c.state === 'leaving') return;
  const s = L.seats[i], fy = L.edge - 205;
  if (!S.bowl.size && !S.drink) { sfx.dup(); return; }
  let did = false, err = null;
  if (S.bowl.size && needPho(c)) {
    if (exact(c)) { givePho(c); did = true; }
    else { const d = phoDiff(c); err = d.miss.length ? 'Thiếu: ' + names(d.miss) : 'Thừa: ' + names(d.extra); }
  }
  if (S.drink && needDrink(c)) {
    if (S.drink === c.drink) { giveDrink(c); did = true; }
    else if (!err) err = 'Tôi gọi ' + DBYID[c.drink].name + '!';
  }
  if (!did && !err) err = 'Tôi không gọi món này';
  if (err) { if (did) float(err, s.cx, fy + 30, '#c62828', 20, 1.2); else failServe(err, s.cx, fy, c); }
}
function endLevel() {
  const m = S.money, tg = S.target;
  S.stars = m >= tg * 2 ? 3 : m >= tg * 1.5 ? 2 : m >= tg ? 1 : 0;
  S.mode = 'result'; S.resultAt = S.rt;
  if (S.stars > (STARS[S.level - 1] || 0)) { STARS[S.level - 1] = S.stars; saveStars(); }
  S.stars ? sfx.win() : sfx.fail();
}
function pause() { if (S.mode === 'play') S.mode = 'pause'; }
function resume() { if (S.mode === 'pause') { S.mode = 'play'; audio(); } }

function update(dt) {
  S.gt += dt; S.timeLeft -= dt;
  const t = S.gt, sec = Math.ceil(S.timeLeft);
  if (sec !== S.lastTick) { S.lastTick = sec; if (sec <= 5 && sec > 0) sfx.tick(); }
  if (S.timeLeft <= 0) { S.timeLeft = 0; endLevel(); return; }
  for (let i = 0; i < S.seatsN; i++) {
    const c = S.seats[i];
    if (c) {
      if (c.state === 'enter' && t - c.enterT >= .35) c.state = 'wait';
      if (c.state === 'wait') {
        c.patience -= dt;
        if (c.patience <= 0) {
          c.state = 'leaving'; c.leaveT = t; c.happy = false; S.lost++; S.combo = 0; S.shake = t;
          float('Bỏ đi rồi!', L.seats[i].cx, L.edge - 215, '#c62828', 26, 1.1); sfx.angry(); buzz(100);
        }
      }
      if (c.state === 'leaving' && t - c.leaveT >= .6) {
        S.seats[i] = null;
        S.seatNext[i] = t + Math.max(.5, .8 + Math.random() * 1.8 - S.level * .1);
      }
    } else if (t >= S.seatNext[i] && S.timeLeft > 4) spawn(i);
  }
  S.fx = S.fx.filter(f => t - f.t0 < f.dur);
}

