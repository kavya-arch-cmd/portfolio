import * as THREE from 'three';
import type { DestinationId } from '../content/destinations';
import { CAMERA_AZIMUTH } from './camera';
import { PLACEMENTS } from './layout';

export interface Shot {
  position: THREE.Vector3;
  target: THREE.Vector3;
}

const SHOT_DISTANCE = 19;
const SHOT_ELEVATION = 0.55; // ~31°

/**
 * A close-up "arrival" camera for each destination: looks at the building and its
 * signboard from the front, biased toward the default viewing side.
 */
export const SHOTS = Object.fromEntries(
  Object.entries(PLACEMENTS).map(([id, p]) => {
    const { platform: pl, building: b, sign } = p;
    const bx = pl.x + b.x;
    const bz = pl.z + b.z;
    // Frame the building, its signboard and the parked car together.
    const [cx, cz] = p.stopNear;
    const target = new THREE.Vector3((bx * 2 + sign.x + cx) / 4, pl.h + 1.0, (bz * 2 + sign.z + cz) / 4);
    const rot = b.rot ?? 0;
    const dir = new THREE.Vector3(Math.sin(rot), 0, Math.cos(rot))
      .add(new THREE.Vector3(Math.sin(CAMERA_AZIMUTH), 0, Math.cos(CAMERA_AZIMUTH)).multiplyScalar(0.8))
      .normalize();
    const position = target
      .clone()
      .addScaledVector(dir, SHOT_DISTANCE * Math.cos(SHOT_ELEVATION))
      .add(new THREE.Vector3(0, SHOT_DISTANCE * Math.sin(SHOT_ELEVATION), 0));
    return [id, { position, target }];
  }),
) as Record<DestinationId, Shot>;

const SIGN_HALF_WIDTH = 2.85; // signboard (4.9 + frame) × its 1.08 scale, halved
const SIGN_TOP = 2.9;
const BUILDING_HALF = 2.4;
const BUILDING_TOP = 4.2;

/**
 * The arrival close-up adapted to the screen shape. On wide screens it is the authored
 * shot; on narrow (portrait phone) screens the camera backs away along the same line of
 * sight until the whole signboard and the building front fit, and the view is re-centred
 * on them, so the destination name is never cropped.
 */
export function shotFor(id: DestinationId, aspect: number, fov: number): Shot {
  const base = SHOTS[id];
  const p = PLACEMENTS[id];
  const dir = base.position.clone().sub(base.target).normalize();
  const right = new THREE.Vector3(dir.z, 0, -dir.x).normalize();
  const sign = new THREE.Vector3(p.sign.x, p.sign.y, p.sign.z);
  const bld = new THREE.Vector3(p.platform.x + p.building.x, p.platform.h, p.platform.z + p.building.z);
  const pts: THREE.Vector3[] = [];
  for (const s of [-1, 1]) {
    for (const y of [0.3, SIGN_TOP]) pts.push(sign.clone().addScaledVector(right, s * SIGN_HALF_WIDTH).setY(sign.y + y));
    for (const y of [0, BUILDING_TOP]) pts.push(bld.clone().addScaledVector(right, s * BUILDING_HALF).setY(bld.y + y));
  }

  const cam = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);
  const target = base.target.clone();
  const v = new THREE.Vector3();
  const extents = (d: number) => {
    cam.position.copy(target).addScaledVector(dir, d);
    cam.lookAt(target);
    cam.updateMatrixWorld();
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const q of pts) {
      v.copy(q).project(cam);
      minX = Math.min(minX, v.x); maxX = Math.max(maxX, v.x);
      minY = Math.min(minY, v.y); maxY = Math.max(maxY, v.y);
    }
    return { minX, maxX, minY, maxY };
  };
  const margin = 0.86;
  const authored = base.position.distanceTo(base.target);
  let distance = authored;
  for (let pass = 0; pass < 3; pass++) {
    let lo = 4, hi = 200;
    for (let i = 0; i < 36; i++) {
      const mid = (lo + hi) / 2;
      const e = extents(mid);
      if (e.minX > -margin && e.maxX < margin && e.minY > -margin && e.maxY < margin) hi = mid;
      else lo = mid;
    }
    distance = Math.max(authored, hi);
    if (hi <= authored) break; // the authored shot already shows everything
    // Re-centre on the framed points (sideways and up/down on screen).
    const e = extents(distance);
    const halfH = Math.tan(THREE.MathUtils.degToRad(fov / 2)) * distance;
    const up = new THREE.Vector3().crossVectors(right, dir).normalize().negate();
    target.addScaledVector(right, ((e.maxX + e.minX) / 2) * halfH * aspect);
    target.addScaledVector(up, ((e.maxY + e.minY) / 2) * halfH);
  }
  return { target, position: target.clone().addScaledVector(dir, distance) };
}
