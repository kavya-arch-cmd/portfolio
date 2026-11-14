import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { rng } from './textures';

/** Organic lumpy sphere used for foliage, shrubs and rocks. */
export function blobGeometry(seed: number, amp = 0.14, detail = 3) {
  let g: THREE.BufferGeometry = new THREE.IcosahedronGeometry(1, detail);
  g.deleteAttribute('normal');
  g.deleteAttribute('uv');
  g = mergeVertices(g);
  const r = rng(seed);
  const a = r() * 6, b = r() * 6, c = r() * 6;
  const pos = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    const n =
      1 +
      amp * Math.sin(v.x * 3.1 + a) * Math.sin(v.y * 2.7 + b) * Math.sin(v.z * 3.3 + c) +
      amp * 0.5 * Math.sin(v.x * 7 + b) * Math.sin(v.z * 6 + a);
    pos.setXYZ(i, v.x * n, v.y * n, v.z * n);
  }
  g.computeVertexNormals();
  return g;
}

export const BLOBS = [0, 1, 2, 3].map((i) => blobGeometry(100 + i));
export const ROCKS = [0, 1, 2].map((i) => blobGeometry(300 + i, 0.28, 1));

const prismCache = new Map<string, THREE.BufferGeometry>();
/** Triangular prism (gable roof / pediment). Ridge runs along X, span along Z, apex at +h. */
export function gableGeometry(length: number, span: number, h: number) {
  const key = `${length}|${span}|${h}`;
  const hit = prismCache.get(key);
  if (hit) return hit;
  const s = new THREE.Shape();
  s.moveTo(-span / 2, 0);
  s.lineTo(span / 2, 0);
  s.lineTo(0, h);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: length, bevelEnabled: false });
  g.translate(0, 0, -length / 2);
  g.rotateY(Math.PI / 2);
  // planar UVs scaled to world units so tile textures read evenly
  const uv = g.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 0.5, uv.getY(i) * 0.5);
  g.computeVertexNormals();
  prismCache.set(key, g);
  return g;
}

export function gearGeometry(teeth = 10, outer = 0.62, inner = 0.5, hole = 0.2, depth = 0.14) {
  const s = new THREE.Shape();
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const pts: [number, number][] = [
      [inner, a],
      [outer, a + step * 0.15],
      [outer, a + step * 0.45],
      [inner, a + step * 0.6],
    ];
    pts.forEach(([r, ang], j) => {
      const x = Math.cos(ang) * r;
      const y = Math.sin(ang) * r;
      if (i === 0 && j === 0) s.moveTo(x, y);
      else s.lineTo(x, y);
    });
  }
  s.closePath();
  const h = new THREE.Path();
  h.absarc(0, 0, hole, 0, Math.PI * 2, true);
  s.holes.push(h);
  const g = new THREE.ExtrudeGeometry(s, {
    depth,
    bevelEnabled: true,
    bevelSize: 0.02,
    bevelThickness: 0.02,
    bevelSegments: 2,
  });
  g.translate(0, 0, -depth / 2);
  return g;
}

export function trophyCupGeometry() {
  const pts = [
    [0, 0], [0.34, 0], [0.34, 0.08], [0.26, 0.13], [0.12, 0.2], [0.08, 0.45],
    [0.12, 0.52], [0.3, 0.6], [0.42, 0.78], [0.46, 1.02], [0.44, 1.08], [0, 1.08],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(pts, 40);
}

/** A tuft of three thin blades. */
export const FLOWER = new THREE.IcosahedronGeometry(0.075, 0);

/** A soft, rounded grass clump (three squashed puffs) — matches the blob trees. */
export const GRASS_CLUMP = (() => {
  const puffs = (
    [
      [0, 0.1, 0, 0.22],
      [0.2, 0.07, 0.08, 0.16],
      [-0.15, 0.06, 0.12, 0.14],
    ] as const
  ).map(([x, y, z, r]) => {
    const g = new THREE.IcosahedronGeometry(r, 1);
    g.scale(1, 0.7, 1);
    g.translate(x, y, z);
    return g;
  });
  return mergeVertices(mergeGeometries(puffs));
})();

export function archBridgeGeometry(span = 4.4, height = 1.25, archR = 1.25, width = 1.3) {
  const s = new THREE.Shape();
  s.moveTo(-span / 2, 0);
  s.lineTo(-archR, 0);
  s.absarc(0, 0, archR * 0.999, Math.PI, 0, true);
  s.lineTo(span / 2, 0);
  s.quadraticCurveTo(span / 2 - 0.4, height * 0.9, span * 0.25, height + 0.1);
  s.lineTo(-span * 0.25, height + 0.1);
  s.quadraticCurveTo(-span / 2 + 0.4, height * 0.9, -span / 2, 0);
  const g = new THREE.ExtrudeGeometry(s, { depth: width, bevelEnabled: false, curveSegments: 24 });
  g.translate(0, 0, -width / 2);
  const uv = g.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 0.4, uv.getY(i) * 0.6);
  g.computeVertexNormals();
  return g;
}
