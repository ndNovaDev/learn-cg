import { Canvas } from './canvas.js';

const spheres = [
  {
    center: [0, -1, 3],
    radius: 1,
    color: [255, 0, 0],
  },
  {
    center: [2, 0, 4],
    radius: 1,
    color: [0, 0, 255],
  },
  {
    center: [-2, 0, 4],
    radius: 1,
    color: [0, 255, 0],
  },
];
const backgroundColor = [255, 255, 255];

const canvasEl = document.getElementById('canvas');
const cw = canvasEl.width;
const ch = canvasEl.height;
const vw = 1;
const vh = 1;
const d = 1;

const canvas = new Canvas(canvasEl);

function canvasToViewport(x, y) {
  return [(x * vw) / cw, (y * vh) / ch, d];
}

/**
 * IntersectRaySphere(O, D, sphere) {
    r = sphere.radius
    CO = O - sphere.center

    a = dot(D, D)
    b = 2*dot(CO, D)
    c = dot(CO, CO) - r*r

    discriminant = b*b - 4*a*c
    if discriminant < 0 {
        return inf, inf
    }

    t1 = (-b + sqrt(discriminant)) / (2*a)
    t2 = (-b - sqrt(discriminant)) / (2*a)
    return t1, t2
} 
 */
function intersectRaySphere(O, D, sphere) {
  const r = sphere.radius;
  const CO = [
    O[0] - sphere.center[0],
    O[1] - sphere.center[1],
    O[2] - sphere.center[2],
  ];

  const a = D[0] * D[0] + D[1] * D[1] + D[2] * D[2];
  const b = 2 * (CO[0] * D[0] + CO[1] * D[1] + CO[2] * D[2]);
  const c = CO[0] * CO[0] + CO[1] * CO[1] + CO[2] * CO[2] - r * r;

  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) {
    return [Infinity, Infinity];
  }

  const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
  const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
  return [t1, t2];
}

function traceRay(O, D, tMin, tMax) {
  let closestT = Infinity;
  let closestSphere = null;
  for (const sphere of spheres) {
    const [t1, t2] = intersectRaySphere(O, D, sphere);
    if (t1 >= tMin && t2 <= tMax && t1 < closestT) {
      closestT = t1;
      closestSphere = sphere;
    }
    if (t2 >= tMin && t2 <= tMax && t2 < closestT) {
      closestT = t2;
      closestSphere = sphere;
    }
  }
  if (closestSphere == null) {
    return backgroundColor;
  }
  return closestSphere.color;
}

function go() {
  const O = [0, 0, 0];
  for (let x = -cw / 2; x < cw / 2; x++) {
    for (let y = -ch / 2; y < ch / 2; y++) {
      const D = canvasToViewport(x, y);
      const color = traceRay(O, D, d, Infinity);
      canvas.putPixel(x, y, color);
    }
  }
}
go();
