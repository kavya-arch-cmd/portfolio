import { useMemo } from 'react';
import * as THREE from 'three';
import { BLOBS, GRASS_CLUMP, ROCKS } from './geometry';
import { addSway } from './life';
import { M } from './materials';
import { Instances, type InstanceItem } from './parts';
import { rng } from './textures';
import { WORLD_SCALE as S } from './scale';

/** Core world rectangle — the periphery never enters it. */
const CORE = { minX: -20.2 * S, maxX: 21.6 * S, minZ: -12.2 * S, maxZ: 12.9 * S };
const OUTER = { minX: -40 * S, maxX: 42 * S, minZ: -24 * S, maxZ: 20 * S };

const LEAF_COLOURS = ['#5A6842', '#6E7B4C', '#8E975D', '#7C8650', '#B8662F', '#C98140', '#CDA843'];
const trunkGeo = new THREE.CylinderGeometry(0.08, 0.15, 1.9, 7).translate(0, 0.95, 0);
const coneGeo = new THREE.ConeGeometry(0.85, 1.3, 9);
const leafMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.9 });
addSway(leafMat, 0.045);
const clumpMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.95 });

/**
 * A soft belt of trees, rocks and meadow beyond the core world so the scene fills
 * wide screens edge-to-edge. Fully instanced (a handful of draw calls).
 */
export function Periphery() {
  const data = useMemo(() => {
    const r = rng(7331);
    const trunks: InstanceItem[] = [];
    const canopies: InstanceItem[] = [];
    const cones: InstanceItem[] = [];
    const rocks: InstanceItem[] = [];
    const grass: InstanceItem[] = [];
    const step = 3.4;
    for (let x = OUTER.minX; x < OUTER.maxX; x += step) {
      for (let z = OUTER.minZ; z < OUTER.maxZ; z += step) {
        const px = x + (r() - 0.5) * step * 0.9;
        const pz = z + (r() - 0.5) * step * 0.9;
        // distance outside the core rectangle (0 inside)
        const dx = Math.max(CORE.minX - px, 0, px - CORE.maxX);
        const dz = Math.max(CORE.minZ - pz, 0, pz - CORE.maxZ);
        const out = Math.hypot(dx, dz);
        if (out < 3.5) continue; // keep an open meadow ring around the world
        // denser further out, airy near the edge of the world
        // Near the camera (bottom of the screen) keep it lighter so trees don't loom.
        const nearCam = pz > CORE.maxZ ? 0.45 : 1;
        const density = Math.min(0.42, 0.05 + (out - 3.5) * 0.03) * nearCam;
        const roll = r();
        if (roll < density) {
          const s = (0.62 + r() * 0.35) * (pz > CORE.maxZ ? 0.85 : 1);
          if (r() < 0.3) {
            for (let i = 0; i < 4; i++) {
              cones.push({ p: [px, (0.85 + i * 0.6) * s, pz], s: s * (1 - i * 0.2), c: i % 2 ? '#5F6D45' : '#4E5C3B' });
            }
            trunks.push({ p: [px, 0, pz], s: s * 0.45, c: '#6B4C34' });
          } else {
            trunks.push({ p: [px, 0, pz], s, c: '#6B4C34' });
            const base = LEAF_COLOURS[Math.floor(r() * LEAF_COLOURS.length)];
            const n = 4 + Math.floor(r() * 2);
            for (let i = 0; i < n; i++) {
              const a = (i / n) * Math.PI * 2 + r();
              const rad = i === 0 ? 0 : 0.5 * s;
              canopies.push({
                p: [px + Math.cos(a) * rad, (2.1 + (i === 0 ? 0.4 : (r() - 0.3) * 0.6)) * s, pz + Math.sin(a) * rad],
                s: (i === 0 ? 0.85 : 0.55 + r() * 0.25) * s,
                r: r() * 6,
                c: i === 0 ? base : LEAF_COLOURS[Math.floor(r() * 3)],
              });
            }
          }
        } else if (roll < density + 0.08) {
          rocks.push({ p: [px, 0.08, pz], s: 0.22 + r() * 0.22, r: r() * 6 });
        }
        if (r() < 0.6) {
          grass.push({ p: [px + (r() - 0.5) * 2, 0, pz + (r() - 0.5) * 2], s: 0.9 + r() * 0.8, r: r() * 6, c: LEAF_COLOURS[Math.floor(r() * 3)] });
        }
      }
    }
    return { trunks, canopies, cones, rocks, grass };
  }, []);

  return (
    <group>
      <Instances geometry={trunkGeo} material={leafMat} items={data.trunks} shadow />
      <Instances geometry={BLOBS[1]} material={leafMat} items={data.canopies} shadow />
      <Instances geometry={coneGeo} material={leafMat} items={data.cones} shadow />
      <Instances geometry={ROCKS[0]} material={M.rock} items={data.rocks} shadow />
      <Instances geometry={GRASS_CLUMP} material={clumpMat} items={data.grass} />
    </group>
  );
}
