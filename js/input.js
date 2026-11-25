'use strict';
// ===================== Input: pointerdown + hàng đợi =====================
const Q = [];
const KEYS = {}, DK = {}, SK = {};
for (let i = 0; i < 10; i++) { const k = (i + 1) % 10; KEYS['Digit' + k] = i; KEYS['Numpad' + k] = i; }
DKEYS.forEach((k, i) => DK['Key' + k] = i);
SEATKEYS.forEach((k, i) => SK['Key' + k] = i);
function toLogical(e) { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left - OX) / SC, y: (e.clientY - r.top - OY) / SC }; }
const inRect = (p, R, pad = 0) => p.x >= R.x - pad && p.x <= R.x + R.w + pad && p.y >= R.y - pad && p.y <= R.y + R.h + pad;
function hitTest(p) {
  if (inRect(p, L.pause, 8)) return { kind: 'pause' };
  for (let i = 0; i < L.trays.length; i++) if (inRect(p, L.trays[i], 6)) return { kind: 'tray', i };
  for (let i = 0; i < L.seats.length; i++) if (inRect(p, L.seats[i])) return { kind: 'seat', i };
  return null;
}

cv.addEventListener('pointerdown', e => {
  e.preventDefault(); audio(); cv.focus({ preventScroll: true });
  S.inputMode = e.pointerType === 'mouse' ? 'mouse' : 'touch';
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  Q.push({ type: 'tap', ...toLogical(e) });
}, { passive: false });
cv.addEventListener('pointermove', e => {
  if (e.pointerType !== 'mouse') return;
  S.inputMode = 'mouse';
  const p = toLogical(e);
  let over;
  if (S.mode === 'play') {
    S.hover = hitTest(p);
    over = !!S.hover && (S.hover.kind !== 'seat' || !!S.seats[S.hover.i]);
  } else { S.hover = null; over = S.buttons.some(b => inRect(p, b)); }
  const cur = over ? 'pointer' : 'default';
  if (cv.style.cursor !== cur) cv.style.cursor = cur;
});
cv.addEventListener('pointerleave', () => { S.hover = null; });
window.addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const c = e.code;
  if (c in KEYS || c in DK || c in SK || ['Enter', 'NumpadEnter', 'Space', 'KeyX', 'Backspace', 'Delete', 'Escape', 'KeyP', 'KeyR'].includes(c)) e.preventDefault();
  if (e.repeat) return;
  audio(); S.inputMode = 'key';
  Q.push({ type: 'key', code: c });
});

function primaryButton() {
  if (S.mode === 'result' && S.rt - S.resultAt < .8) return;
  const b = S.buttons.find(b => b.primary);
  if (b) b.action();
}
function handle(ev) {
  if (ev.type === 'key') {
    const code = ev.code;
    if (S.mode !== 'play') {
      if (S.mode === 'levels') { if (code === 'Escape' || code === 'Backspace') S.mode = 'title'; return; }
      if (S.mode === 'pause' && (code === 'Escape' || code === 'KeyP')) return resume();
      if ((S.mode === 'result' || S.mode === 'pause') && code === 'KeyR') return startLevel(S.level);
      if (code === 'Enter' || code === 'NumpadEnter' || code === 'Space' || (S.mode === 'title' && code !== 'Escape')) primaryButton();
      return;
    }
    if (code === 'Escape' || code === 'KeyP') return pause();
    if (code in KEYS) return addIng(KEYS[code]);
    if (code in DK) return pickDrink(DK[code]);
    if (code in SK) { if (SK[code] < S.seatsN) serveTo(SK[code]); return; }
    if (code === 'Enter' || code === 'NumpadEnter' || code === 'Space') return autoServe();
    if (code === 'KeyX' || code === 'Backspace' || code === 'Delete') return trash();
    return;
  }
  if (S.mode !== 'play') {
    if (S.mode === 'result' && S.rt - S.resultAt < .8) return;
    const b = S.buttons.find(b => inRect(ev, b, 6));
    if (b) b.action();
    return;
  }
  const h = hitTest(ev);
  if (!h) return;
  if (h.kind === 'pause') return pause();
  if (h.kind === 'seat') return serveTo(h.i);
  const T = L.trays[h.i];
  if (T.kind === 'ing') return addIng(T.idx);
  if (T.kind === 'drink') return pickDrink(T.idx);
  if (T.kind === 'serve') return autoServe();
  if (T.kind === 'trash') return trash();
  if (T.kind === 'held') return dropDrink();
}

// Chặn hành vi trình duyệt không mong muốn
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('gesturestart', e => e.preventDefault());
window.addEventListener('wheel', e => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });
document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
window.addEventListener('blur', pause);
window.addEventListener('resize', resize);

