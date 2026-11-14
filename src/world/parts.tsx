import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { BLOBS, ROCKS, gableGeometry } from './geometry';
import { LEAF_SETS, M, TEX, type LeafKind } from './materials';
import { rng } from './textures';

export type V3 = [number, number, number];

interface Common {
  position?: V3;
  rotation?: V3;
  material: THREE.Material | THREE.Material[];
  shadow?: boolean;
}

export function Box({ size, position, rotation, material, shadow = true }: Common & { size: V3 }) {
  return (
    <mesh position={position} rotation={rotation} material={material} castShadow={shadow} receiveShadow>
      <boxGeometry args={size} />
    </mesh>
  );
}

export function Cyl({
  r,
  rTop,
  h,
  seg = 20,
  position,
  rotation,
  material,
  shadow = true,
}: Common & { r: number; rTop?: number; h: number; seg?: number }) {
  return (
    <mesh position={position} rotation={rotation} material={material} castShadow={shadow} receiveShadow>
      <cylinderGeometry args={[rTop ?? r, r, h, seg]} />
    </mesh>
  );
}

/** Gable roof; ridge along local X. */
export function Gable({
  length,
  span,
  h,
  position,
  rotation,
  material,
}: Common & { length: number; span: number; h: number }) {
  const g = useMemo(() => gableGeometry(length, span, h), [length, span, h]);
  return <mesh geometry={g} position={position} rotation={rotation} material={material} castShadow receiveShadow />;
}

/** Raised landscaped plinth: stone retaining wall with a grass top and stone coping. */
export function Platform({ x, z, rx, rz, h }: { x: number; z: number; rx: number; rz: number; h: number }) {
  const sideMat = useMemo(() => {
    const t = TEX.stoneWall.clone();
    t.repeat.set(Math.round((Math.PI * (rx + rz)) / 1.3), Math.max(1, h / 0.75));
    t.needsUpdate = true;
    return new THREE.MeshStandardMaterial({ map: t, roughness: 0.92 });
  }, [rx, rz, h]);
  return (
    <group position={[x, 0, z]}>
      <mesh scale={[rx, 1, rz]} position={[0, h / 2, 0]} castShadow receiveShadow material={[sideMat, M.stone, M.stone]}>
        <cylinderGeometry args={[1, 1.03, h, 56, 1]} />
      </mesh>
      <mesh scale={[rx * 0.955, 1, rz * 0.94]} position={[0, h + 0.02, 0]} receiveShadow material={M.grass}>
        <cylinderGeometry args={[1, 1, 0.06, 56, 1]} />
      </mesh>
    </group>
  );
}

const leafRand = (seed: number) => rng(seed * 7919 + 13);

export function Tree({
  x,
  z,
  y = 0,
  s = 1,
  kind = 'green',
  seed = 1,
}: {
  x: number;
  z: number;
  y?: number;
  s?: number;
  kind?: LeafKind;
  seed?: number;
}) {
  const blobs = useMemo(() => {
    const r = leafRand(seed);
    const list: { p: V3; s: number; g: number; m: number }[] = [];
    const n = 6 + Math.floor(r() * 3);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + r() * 0.6;
      const rad = i === 0 ? 0 : 0.45 + r() * 0.35;
      list.push({
        p: [Math.cos(a) * rad, 2.05 + (i === 0 ? 0.45 : (r() - 0.3) * 0.7), Math.sin(a) * rad],
        s: i === 0 ? 0.85 : 0.5 + r() * 0.3,
        g: Math.floor(r() * BLOBS.length),
        m: i === 0 ? 1 : Math.floor(r() * 3),
      });
    }
    return list;
  }, [seed]);
  const mats = LEAF_SETS[kind];
  return (
    <group position={[x, y, z]} scale={s} rotation={[0, seed, 0]}>
      <Cyl r={0.15} rTop={0.08} h={1.9} seg={8} position={[0, 0.95, 0]} material={M.trunk} />
      <Cyl r={0.06} rTop={0.03} h={0.8} seg={6} position={[0.22, 1.5, 0]} rotation={[0, 0, -0.7]} material={M.trunk} />
      {blobs.map((b, i) => (
        <mesh
          key={i}
          geometry={BLOBS[b.g]}
          material={mats[b.m]}
          position={b.p}
          scale={[b.s, b.s * 0.85, b.s]}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
}

export function Conifer({ x, z, y = 0, s = 1 }: { x: number; z: number; y?: number; s?: number }) {
  return (
    <group position={[x, y, z]} scale={s}>
      <Cyl r={0.12} h={0.7} seg={6} position={[0, 0.35, 0]} material={M.trunk} />
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[0, 0.85 + i * 0.62, 0]}
          material={i % 2 ? M.coniferLight : M.conifer}
          castShadow
          receiveShadow
        >
          <coneGeometry args={[0.95 - i * 0.2, 1.25 - i * 0.12, 10]} />
        </mesh>
      ))}
    </group>
  );
}

export function Shrub({
  x,
  z,
  y = 0,
  s = 1,
  kind = 'green',
  seed = 1,
}: {
  x: number;
  z: number;
  y?: number;
  s?: number;
  kind?: LeafKind;
  seed?: number;
}) {
  const r = leafRand(seed + 50);
  const parts = [0, 1, 2].map((i) => ({
    p: [(r() - 0.5) * 0.6, 0.25 + r() * 0.1, (r() - 0.5) * 0.5] as V3,
    s: 0.3 + r() * 0.18 - i * 0.03,
    m: Math.floor(r() * 3),
  }));
  return (
    <group position={[x, y, z]} scale={s}>
      {parts.map((p, i) => (
        <mesh key={i} geometry={BLOBS[(seed + i) % 4]} material={LEAF_SETS[kind][p.m]} position={p.p} scale={[p.s, p.s * 0.8, p.s]} castShadow receiveShadow />
      ))}
    </group>
  );
}

export function Rock({ x, z, y = 0, s = 1, seed = 0 }: { x: number; z: number; y?: number; s?: number; seed?: number }) {
  return (
    <mesh
      geometry={ROCKS[seed % ROCKS.length]}
      material={M.rock}
      position={[x, y + 0.18 * s, z]}
      scale={[0.55 * s, 0.38 * s, 0.45 * s]}
      rotation={[0, seed * 1.3, 0]}
      castShadow
      receiveShadow
    />
  );
}

export function LampPost({ x, z, y = 0 }: { x: number; z: number; y?: number }) {
  return (
    <group position={[x, y, z]}>
      <Cyl r={0.12} h={0.16} seg={10} position={[0, 0.08, 0]} material={M.charcoal} />
      <Cyl r={0.045} h={2.0} seg={8} position={[0, 1.1, 0]} material={M.charcoal} />
      <Box size={[0.26, 0.32, 0.26]} position={[0, 2.25, 0]} material={M.windowLit} />
      <Box size={[0.32, 0.05, 0.32]} position={[0, 2.08, 0]} material={M.charcoal} />
      <mesh position={[0, 2.5, 0]} material={M.charcoal} castShadow>
        <coneGeometry args={[0.24, 0.2, 4]} />
      </mesh>
    </group>
  );
}

export function Bench({ x, z, y = 0, rot = 0 }: { x: number; z: number; y?: number; rot?: number }) {
  return (
    <group position={[x, y, z]} rotation={[0, rot, 0]}>
      {[-0.5, 0.5].map((dx) => (
        <Box key={dx} size={[0.06, 0.4, 0.4]} position={[dx, 0.2, 0]} material={M.charcoal} />
      ))}
      <Box size={[1.2, 0.06, 0.42]} position={[0, 0.42, 0]} material={M.wood} />
      <Box size={[1.2, 0.3, 0.05]} position={[0, 0.64, -0.2]} rotation={[-0.15, 0, 0]} material={M.wood} />
    </group>
  );
}

export interface InstanceItem {
  p: V3;
  s: number;
  r?: number;
  c?: string;
}

export function Instances({
  geometry,
  material,
  items,
  shadow = false,
}: {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  items: InstanceItem[];
  shadow?: boolean;
}) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const col = new THREE.Color();
    items.forEach((it, i) => {
      e.set(0, it.r ?? 0, 0);
      q.setFromEuler(e);
      m.compose(new THREE.Vector3(...it.p), q, new THREE.Vector3(it.s, it.s, it.s));
      ref.current.setMatrixAt(i, m);
      if (it.c) ref.current.setColorAt(i, col.set(it.c));
    });
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
    ref.current.computeBoundingSphere();
  }, [items]);
  return <instancedMesh ref={ref} args={[geometry, material, items.length]} castShadow={shadow} receiveShadow />;
}
