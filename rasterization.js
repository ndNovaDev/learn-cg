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
  const [[x0, y0, h0], [x1, y1, h1], [x2, y2, h2]] = [oriP0, oriP1, oriP2].sort(
    (a, b) => a[1] - b[1]
  );
  const x01 = interpolate(y0, x0, y1, x1);
  const h01 = interpolate(y0, h0, y1, h1);
  const x12 = interpolate(y1, x1, y2, x2);
  const h12 = interpolate(y1, h1, y2, h2);
  const x02 = interpolate(y0, x0, y2, x2);
  const h02 = interpolate(y0, h0, y2, h2);

  x01.splice(x01.length - 1, 1);
  const x012 = x01.concat(x12);

  h01.splice(h01.length - 1, 1);
  const h012 = h01.concat(h12);

  const m = Math.floor(x012.length / 2);
  let xLeft, xRight, hLeft, hRight;
  if (x02[m] < x012[m]) {
    xLeft = x02;
    hLeft = h02;
    xRight = x012;
    hRight = h012;
  } else {
    xLeft = x012;
    hLeft = h012;
    xRight = x02;
    hRight = h02;
  }

  for (let y = y0; y <= y2; y++) {
    const xL = xLeft[y - y0];
    const xR = xRight[y - y0];
    const hSegment = interpolate(xL, hLeft[y - y0], xR, hRight[y - y0]);
    for (let x = xL; x <= xR; x++) {
      const shadedColor = [
        color[0] * hSegment[x - xL],
        color[1] * hSegment[x - xL],
        color[2] * hSegment[x - xL],
      ];
      canvas.putPixel(x, y, shadedColor);
    }
  }
}

function go() {
  drawFilledTriangle(
    [-200, -250, 1],
    [200, 50, 0.5],
    [20, 250, 0.1],
    [0, 255, 0]
  );
  drawWireFrameTriangle([-200, -250], [200, 50], [20, 250]);
}
go();
