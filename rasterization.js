import { Canvas } from './canvas.js';

const canvasEl = document.getElementById('canvas');
// const cw = canvasEl.width;
// const ch = canvasEl.height;

const canvas = new Canvas(canvasEl);

function interpolate(i0, d0, i1, d1) {
  if (i0 === i1) {
    return [d0];
  }
  const values = [];
  const a = (d1 - d0) / (i1 - i0);
  let d = d0;
  for (let i = i0; i <= i1; i++) {
    values.push(d);
    d += a;
  }
  return values;
}

function drawLine(P0, P1, color) {
  let [x0, y0] = P0;
  let [x1, y1] = P1;
  if (Math.abs(x1 - x0) > Math.abs(y1 - y0)) {
    if (x0 > x1) {
      [x0, y0] = P1;
      [x1, y1] = P0;
    }
    const ys = interpolate(x0, y0, x1, y1);
    for (let x = x0; x <= x1; x++) {
      canvas.putPixel(x, ys[x - x0], color);
    }
  } else {
    if (y1 < y0) {
      [x0, y0] = P1;
      [x1, y1] = P0;
    }
    const xs = interpolate(y0, x0, y1, x1);
    for (let y = y0; y <= y1; y++) {
      canvas.putPixel(xs[y - y0], y, color);
    }
  }
}

function go() {
  drawLine([-200, -100], [240, 120], [0, 0, 0]);
  drawLine([-50, -200], [60, 240], [0, 0, 0]);
}
go();
