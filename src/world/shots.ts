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
