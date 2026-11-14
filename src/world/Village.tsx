import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { BLOBS, GRASS_CLUMP } from './geometry';
import { relocate } from './layout';
import { worldTime } from './life';
import { M } from './materials';
import { Box, Cyl, Instances, type InstanceItem } from './parts';
import { clearOfRoad } from './roadPath';
import { rng } from './textures';

const std = (p: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial({ roughness: 0.9, ...p });
const V = {
  soil: std({ color: '#8C6C4D' }),
  furrow: std({ color: '#755841' }),
  hay: std({ color: '#D3B163', roughness: 1 }),
  hayDark: std({ color: '#B8964E', roughness: 1 }),
  canvas: std({ color: '#EFE5D2', side: THREE.DoubleSide }),
  crop: std({ color: '#FFFFFF' }),
};

/* ── Windmill ──────────────────────────────────────────────── */

function Sail({ angle }: { angle: number }) {
  return (
    <group rotation={[0, 0, angle]}>
      {/* spar */}
      <Box size={[0.09, 2.7, 0.07]} position={[0, 1.45, 0]} material={M.woodDark} />
      {/* lattice frame with canvas */}
      <mesh position={[0.32, 1.75, 0.02]} material={V.canvas} castShadow>
        <planeGeometry args={[0.55, 2.0]} />
      </mesh>
      {[0.9, 1.75, 2.6].map((y) => (
        <Box key={y} size={[0.62, 0.05, 0.05]} position={[0.32, y, 0.04]} material={M.wood} shadow={false} />
      ))}
      <Box size={[0.05, 2.0, 0.05]} position={[0.6, 1.75, 0.04]} material={M.wood} shadow={false} />
    </group>
  );
}

/** A plaster-and-stone windmill whose canvas sails turn slowly with the breeze. */
function Windmill({ x, z, rot }: { x: number; z: number; rot: number }) {
  const sails = useRef<THREE.Group>(null!);
  useFrame(() => {
    sails.current.rotation.z = -worldTime.t * 0.45;
  });
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      {/* stone footing */}
      <Cyl r={1.35} rTop={1.25} h={0.45} seg={16} position={[0, 0.22, 0]} material={M.stoneWall} />
      {/* tapered tower */}
      <Cyl r={1.1} rTop={0.78} h={3.7} seg={16} position={[0, 2.3, 0]} material={M.plaster} />
      <Cyl r={0.84} h={0.16} seg={16} position={[0, 4.18, 0]} material={M.woodDark} />
      {/* cap */}
      <mesh position={[0, 4.85, 0]} material={M.roof} castShadow>
        <coneGeometry args={[1.0, 1.3, 16]} />
      </mesh>
      <Cyl r={0.06} h={0.4} seg={6} position={[0, 5.65, 0]} material={M.charcoal} />
      {/* door, window */}
      <Box size={[0.55, 0.95, 0.12]} position={[0, 0.92, 1.06]} rotation={[-0.08, 0, 0]} material={M.woodDark} />
      <Box size={[0.36, 0.4, 0.1]} position={[0, 2.75, 0.92]} rotation={[-0.09, 0, 0]} material={M.windowLit} />
      {/* hub + sails */}
      <Cyl r={0.13} h={0.7} seg={10} position={[0, 4.45, 0.95]} rotation={[Math.PI / 2, 0, 0]} material={M.woodDark} />
      <group ref={sails} position={[0, 4.45, 1.32]}>
        <Cyl r={0.2} h={0.16} seg={12} rotation={[Math.PI / 2, 0, 0]} material={M.wood} />
        {[0, 1, 2, 3].map((i) => (
          <Sail key={i} angle={(i * Math.PI) / 2} />
        ))}
      </group>
    </group>
  );
}

/* ── Farm field with fence ─────────────────────────────────── */

function Field({ x, z, rot, w, d }: { x: number; z: number; rot: number; w: number; d: number }) {
  const crops = useMemo(() => {
    const r = rng(91);
    const items: InstanceItem[] = [];
    const rows = 5;
    for (let i = 0; i < rows; i++) {
      const rz = -d / 2 + 0.35 + (i * (d - 0.7)) / (rows - 1);
      const golden = i >= 3;
      for (let cx = -w / 2 + 0.35; cx < w / 2 - 0.25; cx += golden ? 0.32 : 0.44) {
        items.push({
          p: [cx + (r() - 0.5) * 0.06, golden ? 0.24 : 0.2, rz],
          s: golden ? 0.16 + r() * 0.04 : 0.2 + r() * 0.05,
          r: r() * 6,
          c: golden ? (r() < 0.5 ? '#D2B262' : '#C9A452') : r() < 0.5 ? '#7E8B4E' : '#93A05C',
        });
      }
    }
    return items;
  }, [w, d]);

  // fence posts around the field, leaving a gate gap on the front side
  const fence = useMemo(() => {
    const m = 0.45;
    const W = w + m * 2;
    const D = d + m * 2;
    const posts: [number, number][] = [];
    const rails: { p: [number, number]; len: number; rot: number }[] = [];
    const side = (ax: number, az: number, bx: number, bz: number, gate = false) => {
      const len = Math.hypot(bx - ax, bz - az);
      const n = Math.max(2, Math.round(len / 0.95));
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        if (gate && t > 0.4 && t < 0.6) continue;
        posts.push([ax + (bx - ax) * t, az + (bz - az) * t]);
      }
      const segs: [number, number][] = gate ? [[0, 0.4], [0.6, 1]] : [[0, 1]];
      for (const [t0, t1] of segs) {
        const mx = ax + (bx - ax) * ((t0 + t1) / 2);
        const mz = az + (bz - az) * ((t0 + t1) / 2);
        rails.push({ p: [mx, mz], len: len * (t1 - t0), rot: Math.atan2(bz - az, bx - ax) });
      }
    };
    side(-W / 2, -D / 2, W / 2, -D / 2);
    side(W / 2, -D / 2, W / 2, D / 2);
    side(W / 2, D / 2, -W / 2, D / 2, true);
    side(-W / 2, D / 2, -W / 2, -D / 2);
    return { posts, rails };
  }, [w, d]);

  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      <Box size={[w, 0.08, d]} position={[0, 0.04, 0]} material={V.soil} shadow={false} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Box key={i} size={[w - 0.3, 0.1, 0.22]} position={[0, 0.1, -d / 2 + 0.35 + (i * (d - 0.7)) / 4]} material={V.furrow} shadow={false} />
      ))}
      <Instances geometry={BLOBS[2]} material={V.crop} items={crops} shadow />
      {fence.posts.map(([px, pz], i) => (
        <Box key={i} size={[0.1, 0.62, 0.1]} position={[px, 0.31, pz]} material={M.woodDark} />
      ))}
      {fence.rails.map((r, i) =>
        [0.28, 0.5].map((y) => (
          <Box key={`${i}-${y}`} size={[r.len, 0.06, 0.05]} position={[r.p[0], y, r.p[1]]} rotation={[0, -r.rot, 0]} material={M.wood} />
        )),
      )}
    </group>
  );
}

/* ── Haystacks ─────────────────────────────────────────────── */

function Haystack({ x, z, s = 1 }: { x: number; z: number; s?: number }) {
  return (
    <group position={[x, 0, z]} scale={s}>
      <Cyl r={0.62} rTop={0.58} h={0.55} seg={14} position={[0, 0.27, 0]} material={V.hayDark} />
      <mesh position={[0, 0.55, 0]} scale={[0.6, 0.62, 0.6]} material={V.hay} castShadow receiveShadow>
        <sphereGeometry args={[1, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
    </group>
  );
}

/** Village details in open meadow: a windmill, a fenced crop field and haystacks. */
export function Village() {
  const at = (x: number, z: number) => relocate(x, z);
  const mill = at(-3.0, -11.8);
  const field = at(6.0, 9.4);
  const hay = [at(2.7, 8.3), at(1.9, 9.0), at(9.4, 8.6)].filter(([x, z]) => clearOfRoad(x, z, 0.7));
  if (import.meta.env.DEV) {
    for (const [n, [x, z], r] of [['windmill', mill, 1.4], ['field', field, 2.5]] as const) {
      if (!clearOfRoad(x, z, r)) console.warn(`[village] ${n} is too close to the road`);
    }
  }
  return (
    <group>
      <Windmill x={mill[0]} z={mill[1]} rot={0.3} />
      <Field x={field[0]} z={field[1]} rot={0.06} w={5.2} d={2.8} />
      {hay.map(([x, z], i) => (
        <Haystack key={i} x={x} z={z} s={[1, 0.8, 0.9][i]} />
      ))}
      {/* soft clumps around the windmill footing */}
      <Instances
        geometry={GRASS_CLUMP}
        material={V.crop}
        items={[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const a = (i / 7) * Math.PI * 2 + 0.4;
          return { p: [mill[0] + Math.cos(a) * 1.6, 0, mill[1] + Math.sin(a) * 1.6], s: 1 + (i % 3) * 0.25, r: a, c: ['#8E975D', '#7C8650', '#A3A86C'][i % 3] };
        })}
      />
    </group>
  );
}
