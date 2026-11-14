import { useMemo } from 'react';
import * as THREE from 'three';
import { M } from './materials';
import { distanceToRoad, ROAD_WIDTH } from './roadPath';

/** Smooth value noise in [0, 1] — cheap, deterministic, good enough for soft patches. */
function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function vnoise(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x: number, y: number) {
  return vnoise(x, y) * 0.55 + vnoise(x * 2.1 + 5.2, y * 2.1 + 1.3) * 0.3 + vnoise(x * 4.3 + 9.1, y * 4.3 + 7.7) * 0.15;
}

const BASE = new THREE.Color('#ABB185'); // sun-warmed meadow
const LUSH = new THREE.Color('#97A374'); // greener hollows
const DRY = new THREE.Color('#C2BC92'); // golden dry grass
const WORN = new THREE.Color('#D4C7A8'); // trodden earth along the road

/**
 * The ground: a large meadow whose colour drifts between lush, sunny and dry
 * patches (vertex colours over a fine speckle texture), with a trodden, sandy
 * margin along the road.
 */
export function Meadow() {
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(240, 240, 150, 150);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const n = fbm(x * 0.06, z * 0.06);
      const m = fbm(x * 0.11 + 40, z * 0.11 - 20);
      c.copy(BASE);
      if (n < 0.45) c.lerp(LUSH, Math.min(1, (0.45 - n) * 3.2));
      if (m > 0.55) c.lerp(DRY, Math.min(1, (m - 0.55) * 3.5));
      // worn margin along the road, only computed near the world
      if (Math.abs(x) < 45 && Math.abs(z) < 32) {
        const d = distanceToRoad(x, z) - ROAD_WIDTH / 2;
        if (d < 2.2) c.lerp(WORN, Math.min(1, (2.2 - Math.max(d, 0)) / 1.6) * 0.75);
      }
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return g;
  }, []);
  return <mesh geometry={geometry} material={M.ground} receiveShadow />;
}
