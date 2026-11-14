import * as THREE from 'three';
import { WORLD_SCALE as S } from './scale';

/** Camera yaw around the scene (radians). Small, so buildings show a side face. */
export const CAMERA_AZIMUTH = 0.32;
/** Camera elevation above the ground plane (radians) — a lower, more three-dimensional angle. */
export const CAMERA_ELEVATION = 0.58;
/** Vertical field of view (degrees). Narrow, for a miniature-diorama perspective. */
export const CAMERA_FOV = 32;

export const VIEW_DIR = new THREE.Vector3(
  Math.sin(CAMERA_AZIMUTH) * Math.cos(CAMERA_ELEVATION),
  Math.sin(CAMERA_ELEVATION),
  Math.cos(CAMERA_AZIMUTH) * Math.cos(CAMERA_ELEVATION),
).normalize();

/** The essential part of the world (road + all destinations) that must stay in frame. */
export const FOCUS_BOUNDS = { minX: -17.4 * S, maxX: 20.4 * S, minZ: -11.0 * S, maxZ: 11.6 * S, maxY: 3.2 };
/** Panning limits on small screens. */
export const WORLD_BOUNDS = { minX: -21 * S, maxX: 22 * S, minZ: -12.5 * S, maxZ: 13 * S };

export const FOCUS_CENTER = new THREE.Vector3(
  (FOCUS_BOUNDS.minX + FOCUS_BOUNDS.maxX) / 2,
  0,
  (FOCUS_BOUNDS.minZ + FOCUS_BOUNDS.maxZ) / 2,
);

const corners = (() => {
  const b = FOCUS_BOUNDS;
  const out: THREE.Vector3[] = [];
  for (const x of [b.minX, b.maxX])
    for (const z of [b.minZ, b.maxZ])
      for (const y of [0, b.maxY]) out.push(new THREE.Vector3(x, y, z));
  return out;
})();

/**
 * Find the camera target and distance that frame FOCUS_BOUNDS as tightly as possible
 * for the given aspect ratio (perspective projection, solved numerically).
 */
export function fitView(aspect: number, margin = 1.04) {
  const cam = new THREE.PerspectiveCamera(CAMERA_FOV, aspect, 0.1, 1000);
  const target = FOCUS_CENTER.clone();
  const p = new THREE.Vector3();
  const extents = (d: number) => {
    cam.position.copy(target).addScaledVector(VIEW_DIR, d);
    cam.lookAt(target);
    cam.updateMatrixWorld();
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const c of corners) {
      p.copy(c).project(cam);
      minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
    }
    return { minX, maxX, minY, maxY };
  };
  let distance = 60;
  // Two passes: fit, then re-centre the projected box, then fit again.
  for (let pass = 0; pass < 3; pass++) {
    let lo = 5, hi = 400;
    for (let i = 0; i < 40; i++) {
      const mid = (lo + hi) / 2;
      const e = extents(mid);
      const fits = e.minX > -margin && e.maxX < margin && e.minY > -margin && e.maxY < margin;
      if (fits) hi = mid; else lo = mid;
    }
    distance = hi;
    const e = extents(distance);
    // shift target so the projected box is centred (screen y ≈ ground z for this view)
    const yOff = (e.maxY + e.minY) / 2;
    const xOff = (e.maxX + e.minX) / 2;
    const halfH = Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV / 2)) * distance;
    target.z -= (yOff * halfH) / Math.sin(CAMERA_ELEVATION);
    target.x += xOff * halfH * aspect * Math.cos(CAMERA_AZIMUTH);
  }
  return { target, distance };
}

/** Distance at which `units` world units span the viewport width at the target. */
export function distanceForWidth(units: number, aspect: number) {
  return units / 2 / (Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV / 2)) * aspect);
}
