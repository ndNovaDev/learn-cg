import { Canvas } from './canvas.js';

const lights = [
  {
    type: 'ambient',
    intensity: 0.2,
  },
  {
    type: 'point',
    intensity: 0.6,
    position: [2, 1, 0],
  },
  {
    type: 'directional',
    intensity: 0.2,
    direction: [1, 4, 4],
  },
];

const spheres = [
  {
    center: [0, -1, 3],
    radius: 1,
    color: [255, 0, 0],
    specular: 500,
  },
  {
    center: [2, 0, 4],
    radius: 1,
    color: [0, 0, 255],
    specular: 500,
  },
  {
    center: [-2, 0, 4],
    radius: 1,
    color: [0, 255, 0],
    specular: 10,
  },
  {
    center: [0, -5001, 0],
    radius: 5000,
    color: [255, 255, 0],
    specular: 1000,
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

function length(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}
function normalize(v) {
  const l = length(v);
  return [v[0] / l, v[1] / l, v[2] / l];
}

function computeLighting(P, N, V, s) {
  let i = 0;
  for (const light of lights) {
    if (light.type === 'ambient') {
      i += light.intensity;
    } else {
      let L;
      let tMax;
      if (light.type === 'point') {
        L = [
          light.position[0] - P[0],
          light.position[1] - P[1],
          light.position[2] - P[2],
        ];
        tMax = 1;
      } else {
        L = light.direction;
        tMax = Infinity;
      }
      const [shadowSphere] = closestIntersection(P, L, 0.001, tMax);
      if (shadowSphere) {
        continue;
      }
      const nDotL = N[0] * L[0] + N[1] * L[1] + N[2] * L[2];
      if (nDotL > 0) {
        i += (light.intensity * nDotL) / (length(N) * length(L));
      }

      if (s !== -1) {
        const nDotL = N[0] * L[0] + N[1] * L[1] + N[2] * L[2];
        const NDotL2 = 2 * nDotL;
        const R = [
          NDotL2 * N[0] - L[0],
          NDotL2 * N[1] - L[1],
          NDotL2 * N[2] - L[2],
        ];
        const rDotV = R[0] * V[0] + R[1] * V[1] + R[2] * V[2];
        if (rDotV > 0) {
          i += light.intensity * Math.pow(rDotV / (length(R) * length(V)), s);
        }
      }
    }
  }
  return i;
}

function closestIntersection(O, D, tMin, tMax) {
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
  return [closestSphere, closestT];
}

function traceRay(O, D, tMin, tMax) {
  const [closestSphere, closestT] = closestIntersection(O, D, tMin, tMax);
  if (closestSphere == null) {
    return backgroundColor;
  }
  /** 焦点 */
  const P = [
    O[0] + closestT * D[0],
    O[1] + closestT * D[1],
    O[2] + closestT * D[2],
  ];
  const N = normalize([
    P[0] - closestSphere.center[0],
    P[1] - closestSphere.center[1],
    P[2] - closestSphere.center[2],
  ]);

  const light = computeLighting(
    P,
    N,
    [D[0] * -1, D[1] * -1, D[2] * -1],
    closestSphere.specular
  );
  const color = closestSphere.color;
  return [color[0] * light, color[1] * light, color[2] * light];
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
