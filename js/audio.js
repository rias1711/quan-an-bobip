'use strict';
// ===================== Âm thanh (Web Audio, không cần file) =====================
let AC = null;
function audio() {
  try {
    if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === 'suspended') AC.resume();
  } catch (_) { AC = null; }
}
function tone(f, d, type = 'sine', v = .15, when = 0, slide = 0) {
  if (!AC) return;
  const t = AC.currentTime + when, o = AC.createOscillator(), gn = AC.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, f + slide), t + d);
  gn.gain.setValueAtTime(.0001, t); gn.gain.exponentialRampToValueAtTime(v, t + .008);
  gn.gain.exponentialRampToValueAtTime(.0001, t + d);
  o.connect(gn).connect(AC.destination); o.start(t); o.stop(t + d + .03);
}
const sfx = {
  pop: i => tone(480 + i * 45, .09, 'triangle', .2, 0, 220),
  pour: () => { tone(320, .14, 'sine', .14, 0, 380); tone(1400, .05, 'triangle', .05, .1); },
  dup: () => tone(200, .07, 'square', .05),
  give: () => { tone(760, .08, 'triangle', .15); tone(990, .1, 'triangle', .12, .06); },
  ok: () => { tone(660, .1, 'triangle', .18); tone(880, .1, 'triangle', .18, .07); tone(1180, .16, 'triangle', .18, .14); },
  coin: () => { tone(1320, .07, 'square', .05, .2); tone(1760, .12, 'square', .05, .26); },
  wrong: () => tone(190, .28, 'sawtooth', .09, 0, -70),
  trash: () => tone(320, .22, 'triangle', .12, 0, -220),
  angry: () => { tone(150, .45, 'sawtooth', .09, 0, -60); tone(110, .45, 'square', .05, .05, -30); },
  click: () => tone(700, .05, 'triangle', .1),
  tick: () => tone(1050, .05, 'square', .06),
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, .22, 'triangle', .16, i * .12)),
  fail: () => [392, 330, 262].forEach((f, i) => tone(f, .3, 'triangle', .14, i * .18)),
};
function buzz(ms) { if (S.inputMode === 'touch' && navigator.vibrate) { try { navigator.vibrate(ms); } catch (_) {} } }

