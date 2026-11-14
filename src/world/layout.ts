import type { DestinationId } from '../content/destinations';
import { nearestU, ROAD_WIDTH, KERB_WIDTH, distanceToRoad } from './roadPath';
import { PLATFORM_SCALE, WORLD_SCALE } from './scale';

export interface PlatformSpec {
  x: number;
  z: number;
  rx: number;
  rz: number;
  h: number;
}

export interface Placement {
  platform: PlatformSpec;
  /** Building origin, relative to the platform centre (on top of the platform). */
  building: { x: number; z: number; rot?: number };
  /** Signboard foot position (world), and the height it stands on. */
  sign: { x: number; z: number; y: number };
  /** A point beside the road where the car should stop. */
  stopNear: [number, number];
}

/** Layout as authored (unscaled design coordinates). */
const RAW: Record<DestinationId, Placement> = {
  about: {
    platform: { x: -11.2, z: -8.7, rx: 5.0, rz: 2.6, h: 0.8 },
    building: { x: -1.2, z: -0.2 },
    sign: { x: -8.2, z: -6.75, y: 0.8 },
    stopNear: [-13.3, -3.8],
  },
  projects: {
    platform: { x: 4.8, z: -9.0, rx: 4.7, rz: 2.6, h: 1.0 },
    building: { x: -1.0, z: -0.3, rot: 0.12 },
    sign: { x: 6.7, z: -6.95, y: 1.0 },
    stopNear: [1.3, -5.0],
  },
  skills: {
    platform: { x: 17.9, z: -0.9, rx: 3.0, rz: 3.3, h: 0.7 },
    building: { x: 0.2, z: -0.7, rot: -0.55 },
    sign: { x: 17.8, z: 1.75, y: 0.7 },
    stopNear: [13.4, 0.2],
  },
  experience: {
    platform: { x: 5.2, z: -0.3, rx: 4.4, rz: 2.7, h: 0.6 },
    building: { x: 0.6, z: -0.5 },
    sign: { x: 1.2, z: 2.9, y: 0 },
    stopNear: [5.6, 5.3],
  },
  certificates: {
    platform: { x: -2.6, z: 9.9, rx: 3.6, rz: 1.8, h: 0.45 },
    building: { x: -1.3, z: -0.4, rot: 0.15 },
    sign: { x: -0.9, z: 10.9, y: 0.45 },
    stopNear: [-0.6, 6.2],
  },
};

/**
 * Map an authored (unscaled) ground position into the spread-out world.
 * Points on or right beside a platform move with that platform (so they keep their
 * place on it); everything else is scaled with the world.
 */
export function relocate(x: number, z: number): [number, number] {
  for (const { platform: p } of Object.values(RAW)) {
    const dx = (x - p.x) / (p.rx * 1.25);
    const dz = (z - p.z) / (p.rz * 1.25);
    if (dx * dx + dz * dz < 1) {
      return [x + p.x * (WORLD_SCALE - 1), z + p.z * (WORLD_SCALE - 1)];
    }
  }
  return [x * WORLD_SCALE, z * WORLD_SCALE];
}

/** Offset a destination's details move by when the world is spread out. */
export function platformShift(id: DestinationId): [number, number] {
  const p = RAW[id].platform;
  return [p.x * (WORLD_SCALE - 1), p.z * (WORLD_SCALE - 1)];
}

export const PLACEMENTS = Object.fromEntries(
  Object.entries(RAW).map(([id, r]) => {
    const [sx, sz] = relocate(r.sign.x, r.sign.z);
    return [
      id,
      {
        platform: {
          ...r.platform,
          x: r.platform.x * WORLD_SCALE,
          z: r.platform.z * WORLD_SCALE,
          rx: r.platform.rx * PLATFORM_SCALE,
          rz: r.platform.rz * PLATFORM_SCALE,
        },
        building: { ...r.building, x: r.building.x * PLATFORM_SCALE, z: r.building.z * PLATFORM_SCALE },
        sign: { ...r.sign, x: sx, z: sz },
        stopNear: [r.stopNear[0] * WORLD_SCALE, r.stopNear[1] * WORLD_SCALE],
      } satisfies Placement,
    ];
  }),
) as Record<DestinationId, Placement>;

/** Where the SUV waits when the page first loads (bottom-left of the loop). */
export const HOME_U = nearestU(-15.6 * WORLD_SCALE, 6.4 * WORLD_SCALE);

export const STOP_U = Object.fromEntries(
  Object.entries(PLACEMENTS).map(([id, p]) => [id, nearestU(p.stopNear[0], p.stopNear[1])]),
) as Record<DestinationId, number>;

/** Is (x, z) inside any platform footprint (expanded by r)? */
export function onAnyPlatform(x: number, z: number, r = 0): boolean {
  return Object.values(PLACEMENTS).some(({ platform: p }) => {
    const dx = (x - p.x) / (p.rx + r);
    const dz = (z - p.z) / (p.rz + r);
    return dx * dx + dz * dz < 1;
  });
}

// Development guard: warn if any platform rim touches the road.
if (import.meta.env.DEV) {
  for (const [id, { platform: p }] of Object.entries(PLACEMENTS)) {
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 32) {
      const x = p.x + Math.cos(a) * p.rx * 1.04;
      const z = p.z + Math.sin(a) * p.rz * 1.04;
      if (distanceToRoad(x, z) < ROAD_WIDTH / 2 + KERB_WIDTH + 0.1) {
        console.warn(`[layout] platform "${id}" overlaps the road near (${x.toFixed(1)}, ${z.toFixed(1)})`);
        break;
      }
    }
  }
}
