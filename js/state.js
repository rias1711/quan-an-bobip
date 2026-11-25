'use strict';
// ===================== Trạng thái =====================
const LEVEL_TIME = 90;
// Độ khó theo màn: ch = chương (món), li = màn trong chương (1..10)
function levelCfg(lv) {
  const ch = Math.min(CHAPTERS.length - 1, Math.floor((lv - 1) / 10));
  const li = lv - ch * 10, dish = CHAPTERS[ch];
  return {
    ch, li, dish,
    seats: li <= 2 ? 2 : (li >= 8 && ch >= 1 ? 4 : 3),                 // số chỗ ngồi
    target: Math.round((260000 + (li - 1) * 35000 + ch * 50000) / 10000) * 10000,
    optMax: Math.min(dish.opt.length, 1 + Math.floor((li - 1) / 2) + Math.min(ch, 2)), // số topping tối đa
    mainsMax: Math.min(dish.mainsMax, dish.mainsMin + Math.floor((li - 1) / 4) + (ch >= 2 ? 1 : 0)),
    drinks: Math.min(DRINKS.length, 2 + Math.floor((lv - 1) / 2)),     // số loại nước đã mở
    drinkP: Math.min(.75, .3 + li * .03 + ch * .03),                    // tỉ lệ khách gọi nước
    patience: Math.max(.55, 1.05 - (li - 1) * .04 - ch * .05),          // hệ số kiên nhẫn
    gap: Math.max(.3, 2.2 - li * .12 - ch * .15),                       // nghỉ giữa 2 khách
  };
}
const drinkUnlockLevel = k => Math.max(1, 2 * k - 1);
let STARS = [];
try { STARS = JSON.parse(localStorage.getItem('pho_stars') || '[]') || []; } catch (_) {}
try { const old = +localStorage.getItem('pho_unlock') || 1; for (let i = 0; i < old - 1; i++) if (!STARS[i]) STARS[i] = 1; } catch (_) {}
const maxUnlocked = () => { let n = 1; while (STARS[n - 1] > 0) n++; return n; };
function saveStars() { try { localStorage.setItem('pho_stars', JSON.stringify(STARS)); } catch (_) {} }
const S = {
  mode: 'title', gt: 0, rt: 0, resultAt: 0, dish: null, cfg: null,
  level: 1, seatsN: 2, timeLeft: LEVEL_TIME, target: 0, stars: 0, lastTick: 99,
  money: 0, combo: 0, served: 0, lost: 0,
  seats: [null, null], seatNext: [0, 0],
  bowl: new Map(), drink: null, drinkAt: 0, fx: [],
  shake: -9, bowlBump: -9, hover: null, buttons: [],
  inputMode: matchMedia('(pointer: fine)').matches ? 'mouse' : 'touch',
};
S.level = maxUnlocked(); S.cfg = levelCfg(S.level); setDish(S.cfg.dish); S.target = S.cfg.target;

