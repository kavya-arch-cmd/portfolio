import * as THREE from 'three';
import { WORLD_SCALE } from './scale';

/** Asphalt width in world units (kerbs sit outside this). */
export const ROAD_WIDTH = 1.9;
export const ROAD_Y = 0.05;
export const KERB_WIDTH = 0.16;
export const KERB_HEIGHT = 0.1;

/**
 * Control points of the single closed, winding road loop (x, z).
 * Travel direction (increasing u): up the left side, across the top,
 * down the right side, back along the bottom.
 */
const CONTROL: [number, number][] = [
  [-15.6, 6.4],
  [-16.7, 3.0],
  [-16.3, -0.8],
  [-14.2, -3.4],
  [-10.5, -4.1],
  [-6.8, -3.4],
  [-3.2, -4.3],
  [0.4, -5.0],
  [4.2, -4.7],
  [8.0, -4.3],
  [11.2, -4.7],
  [13.1, -3.0],
  [13.4, -0.3],
  [12.6, 2.5],
  [10.4, 4.6],
  [7.0, 5.4],
  [3.5, 5.2],
  [0.0, 6.0],
  [-3.5, 6.6],
  [-7.0, 5.9],
  [-10.6, 6.3],
  [-13.4, 7.3],
];

export const roadCurve = new THREE.CatmullRomCurve3(
  CONTROL.map(([x, z]) => new THREE.Vector3(x * WORLD_SCALE, 0, z * WORLD_SCALE)),
  true,
  'centripetal',
);
roadCurve.arcLengthDivisions = 4000;
roadCurve.updateArcLengths();

export const ROAD_LENGTH = roadCurve.getLength();

const SAMPLE_COUNT = 1600;
const samples: THREE.Vector3[] = Array.from({ length: SAMPLE_COUNT }, (_, i) =>
  roadCurve.getPointAt(i / SAMPLE_COUNT),
);

/** Normalised arc-length position (0..1) of the road point nearest to (x, z). */
export function nearestU(x: number, z: number): number {
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const p = samples[i];
    const d = (p.x - x) ** 2 + (p.z - z) ** 2;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best / SAMPLE_COUNT;
}

/** Distance from (x, z) to the road centre line. */
export function distanceToRoad(x: number, z: number): number {
  let bestD = Infinity;
  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const p = samples[i];
    const d = (p.x - x) ** 2 + (p.z - z) ** 2;
    if (d < bestD) bestD = d;
  }
  return Math.sqrt(bestD);
}

/** True when a round object of radius r at (x, z) stays clear of asphalt and kerbs. */
export function clearOfRoad(x: number, z: number, r = 0): boolean {
  return distanceToRoad(x, z) > ROAD_WIDTH / 2 + KERB_WIDTH + 0.25 + r;
}

const _t = new THREE.Vector3();
/** Position and heading on the road at u, offset sideways (positive = left of travel). */
export function roadFrame(u: number, lateral = 0, out = new THREE.Vector3()) {
  const uu = ((u % 1) + 1) % 1;
  roadCurve.getPointAt(uu, out);
  roadCurve.getTangentAt(uu, _t);
  // left of travel direction = up × tangent
  out.x += _t.z * lateral;
  out.z += -_t.x * lateral;
  return { position: out, heading: Math.atan2(_t.x, _t.z) };
}
