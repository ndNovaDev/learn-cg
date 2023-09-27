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

function drawWireFrameTriangle(P0, P1, P2) {
  drawLine(P0, P1, [0, 0, 0]);
  drawLine(P1, P2, [0, 0, 0]);
  drawLine(P2, P0, [0, 0, 0]);
}

function drawFilledTriangle(oriP0, oriP1, oriP2, color) {
  const [[x0, y0], [x1, y1], [x2, y2]] = [oriP0, oriP1, oriP2].sort(
    (a, b) => a[1] - b[1]
  );
  const x01 = interpolate(y0, x0, y1, x1);
  const x12 = interpolate(y1, x1, y2, x2);
  const x02 = interpolate(y0, x0, y2, x2);

  x01.splice(x01.length - 1, 1);
  const x012 = x01.concat(x12);

  const m = Math.floor(x012.length / 2);
  let xLeft, xRight;
  if (x02[m] < x012[m]) {
    xLeft = x02;
    xRight = x012;
  } else {
    xLeft = x012;
    xRight = x02;
  }

  for (let y = y0; y <= y2; y++) {
    for (let x = xLeft[y - y0]; x <= xRight[y - y0]; x++) {
      canvas.putPixel(x, y, color);
    }
  }
}

function go() {
  drawFilledTriangle([-200, -250], [200, 50], [20, 250], [0, 255, 0]);
  drawWireFrameTriangle([-200, -250], [200, 50], [20, 250]);
}
go();
