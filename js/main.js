'use strict';
// ===================== Vòng lặp =====================
let last = performance.now() / 1000;
function frame() {
  const now = performance.now() / 1000, dt = Math.min(.05, now - last); last = now;
  S.rt = now;
  while (Q.length) handle(Q.shift());
  if (S.mode === 'play') update(dt);
  render();
  requestAnimationFrame(frame);
}
resize();
requestAnimationFrame(frame);
