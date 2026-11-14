import { Ripples } from './life';
import { useMemo } from 'react';
import * as THREE from 'three';
import { FLOWER, GRASS_CLUMP, archBridgeGeometry } from './geometry';
import { onAnyPlatform, PLACEMENTS, relocate } from './layout';
import { WORLD_SCALE } from './scale';
import { M } from './materials';
import { Box, Conifer, Instances, Rock, Shrub, Tree, type InstanceItem } from './parts';
import type { LeafKind } from './materials';
import { clearOfRoad } from './roadPath';
import { rng } from './textures';

const clumpMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.95 });

type TreeSpec = [x: number, z: number, s: number, kind: LeafKind | 'conifer', y?: number];

/** Hand-placed trees that frame destinations and road bends. */
const TREES: TreeSpec[] = [
  // around ABOUT ME
  [-15.4, -10.0, 1.15, 'green', 0.8],
  [-7.4, -9.9, 1.0, 'light', 0.8],
  [-15.0, -7.8, 0.8, 'green', 0.8],
  [-18.4, -6.5, 1.1, 'green'],
  [-19.0, -2.0, 1.0, 'light'],
  // around PROJECTS
  [1.0, -10.1, 1.0, 'green', 1.0],
  [8.6, -9.6, 1.05, 'autumn', 1.0],
  [-1.6, -8.6, 0.9, 'conifer'],
  [10.8, -8.4, 1.0, 'light'],
  [-4.2, -9.4, 1.05, 'autumn'],
  // right side / SKILLS
  [16.8, -6.2, 1.15, 'gold'],
  [19.6, -4.0, 0.85, 'conifer'],
  [15.4, -8.6, 0.95, 'green'],
  // centre gardens inside the loop
  [-3.4, -1.6, 0.95, 'green'],
  [-1.2, 1.2, 0.85, 'autumn'],
  [-4.6, 1.9, 0.75, 'conifer'],
  [10.8, 0.6, 0.9, 'autumn'],
  [11.0, -2.4, 0.75, 'conifer'],
  [-13.6, 3.0, 0.85, 'light'],
  [-12.8, 4.0, 0.8, 'conifer'],
  // EXPERIENCE flanks
  [9.0, 1.0, 0.7, 'autumn', 0.6],
  // small grove where the Achievements stop used to be
  [-9.4, 0.2, 1.1, 'green'],
  [-7.6, 1.5, 0.85, 'autumn'],
  [-10.6, 1.8, 0.8, 'conifer'],
  [-8.0, -0.9, 0.9, 'gold'],
  // bottom edge
  [-19.0, 9.8, 1.15, 'green'],
  [-12.4, 10.4, 0.85, 'light'],
  [-6.2, 10.2, 0.75, 'conifer'],
  [2.0, 10.9, 0.95, 'green'],
  [9.8, 10.2, 1.05, 'autumn'],
  [13.4, 9.6, 0.8, 'conifer'],
  [19.4, 7.0, 1.05, 'green'],
];

/** ACHIEVEMENTS sits on its own rocky platform; CERTIFICATES gets a planted bed. */
const ROCKS: [number, number, number, number?][] = [
  [-12.0, 2.4, 1.3],
  [-5.9, 2.4, 1.0],
  [-11.6, -1.2, 1.1],
  [-6.4, -1.2, 0.9],
  [-18.6, 7.4, 1.0],
  [-17.8, 9.4, 0.8],
  [15.2, 3.6, 0.9],
  [20.0, 0.0, 1.1],
  [8.0, -7.2, 0.8, 1.0],
  [-0.4, -6.9, 0.8],
  [-4.6, 9.4, 0.8],
  [1.2, 11.4, 0.9],
  [10.4, 11.0, 0.9],
];

const CLUMP_COLOURS = ['#8A955C', '#97A066', '#A6AB72', '#B2B07A'];
const FLOWER_COLOURS = ['#D9A441', '#C65D35', '#F3EBDD', '#B97A8A', '#E0B85A'];

/**
 * Soft grass clumps and wildflower patches. Flowers grow in small drifts (one or two
 * colours each) rather than random dots, and clumps gather along walls and in hollows.
 */
function scatter(seed: number) {
  const r = rng(seed);
  const clumps: InstanceItem[] = [];
  const flowers: InstanceItem[] = [];
  const pick = <T,>(list: T[]) => list[Math.floor(r() * list.length)];
  const clump = (x: number, y: number, z: number, s: number) =>
    clumps.push({ p: [x, y, z], s, r: r() * 6, c: pick(CLUMP_COLOURS) });

  // Platform tops: a planted border just inside the rim.
  for (const { platform: p } of Object.values(PLACEMENTS)) {
    const n = Math.round((p.rx + p.rz) * 4);
    for (let i = 0; i < n; i++) {
      const a = r() * Math.PI * 2;
      const k = 0.8 + r() * 0.1;
      const x = p.x + Math.cos(a) * p.rx * k;
      const z = p.z + Math.sin(a) * p.rz * k;
      if (r() < 0.5) clump(x, p.h, z, 0.7 + r() * 0.4);
      else {
        const col = pick(FLOWER_COLOURS);
        for (let f = 0; f < 4; f++) flowers.push({ p: [x + (r() - 0.5) * 0.4, p.h + 0.1, z + (r() - 0.5) * 0.3], s: 0.8 + r() * 0.4, c: col });
      }
    }
    // clumps hugging the foot of the retaining wall
    const m = Math.round((p.rx + p.rz) * 2.5);
    for (let i = 0; i < m; i++) {
      const a = r() * Math.PI * 2;
      const k = 1.04 + r() * 0.12;
      const x = p.x + Math.cos(a) * p.rx * k;
      const z = p.z + Math.sin(a) * p.rz * k;
      if (clearOfRoad(x, z, 0.2)) clump(x, 0, z, 0.9 + r() * 0.6);
    }
  }

  // Wildflower drifts in the open meadow.
  let drifts = 0;
  for (let tries = 0; tries < 400 && drifts < 26; tries++) {
    const cx = (-19 + r() * 39) * WORLD_SCALE;
    const cz = (-11 + r() * 23) * WORLD_SCALE;
    if (!clearOfRoad(cx, cz, 1.2) || onAnyPlatform(cx, cz, 1.2)) continue;
    drifts++;
    const cols = [pick(FLOWER_COLOURS), pick(FLOWER_COLOURS)];
    const n = 8 + Math.floor(r() * 8);
    for (let i = 0; i < n; i++) {
      const a = r() * Math.PI * 2;
      const d = Math.sqrt(r()) * 0.9;
      flowers.push({ p: [cx + Math.cos(a) * d * 1.3, 0.1, cz + Math.sin(a) * d], s: 0.8 + r() * 0.5, c: cols[i % 2] });
    }
    for (let i = 0; i < 3; i++) clump(cx + (r() - 0.5) * 1.6, 0, cz + (r() - 0.5) * 1.2, 0.8 + r() * 0.5);
  }

  // A few loose clumps across the meadow.
  for (let i = 0; i < 45; i++) {
    const x = (-20 + r() * 41) * WORLD_SCALE;
    const z = (-11.5 + r() * 24) * WORLD_SCALE;
    if (!clearOfRoad(x, z, 0.5) || onAnyPlatform(x, z, 0.4)) continue;
    clump(x, 0, z, 0.8 + r() * 0.7);
  }
  return { clumps, flowers };
}

function Pond() {
  const bridge = useMemo(() => archBridgeGeometry(4.2, 1.15, 0.95, 1.3), []);
  const rim = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2;
      out.push([Math.cos(a) * 3.5, Math.sin(a) * 1.55, 0.35 + (i % 3) * 0.12]);
    }
    return out;
  }, []);
  return (
    <group position={[16.4 * WORLD_SCALE, 0, 9.4 * WORLD_SCALE]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} scale={[3.4, 1.45, 1]} material={M.water} receiveShadow>
        <circleGeometry args={[1, 48]} />
      </mesh>
      <Ripples />
      {rim.map(([x, z, s], i) => (
        <Rock key={i} x={x} z={z} s={s * 1.4} seed={i} />
      ))}
      <mesh geometry={bridge} material={M.stoneWall} position={[-0.3, 0, 0]} rotation={[0, Math.PI / 2 - 0.25, 0]} castShadow receiveShadow />
      <group rotation={[0, Math.PI / 2 - 0.25, 0]} position={[-0.3, 0, 0]}>
        {[0.6, -0.6].map((z) => (
          <Box key={z} size={[2.2, 0.22, 0.12]} position={[0, 1.36, z]} material={M.stone} />
        ))}
      </group>
    </group>
  );
}

export function Landscape() {
  const { clumps, flowers } = useMemo(() => scatter(42), []);
  const trees = useMemo(
    () =>
      TREES.map(([x, z, s, k, y]) => [...relocate(x, z), s, k, y] as TreeSpec).filter(([x, z, s]) =>
        clearOfRoad(x, z, 0.9 * s),
      ),
    [],
  );
  const rocks = useMemo(
    () => ROCKS.map(([x, z, s, y]) => [...relocate(x, z), s, y] as [number, number, number, number?]),
    [],
  );
  return (
    <group>
      {trees.map(([x, z, s, kind, y], i) =>
        kind === 'conifer' ? (
          <Conifer key={i} x={x} z={z} y={y} s={s} />
        ) : (
          <Tree key={i} x={x} z={z} y={y} s={s} kind={kind} seed={i + 1} />
        ),
      )}
      {rocks.filter(([x, z]) => clearOfRoad(x, z, 0.4)).map(([x, z, s, y], i) => (
        <Rock key={i} x={x} z={z} y={y} s={s} seed={i} />
      ))}
      {/* low shrubs at road bends and platform corners */}
      {(
        [
          [-14.2, 6.0, 'green'], [-18.4, 1.2, 'light'], [-12.2, -5.9, 'light'], [2.0, -6.6, 'green'],
          [11.4, -6.8, 'autumn'], [15.4, -1.6, 'green'], [11.2, 2.2, 'light'], [-0.6, 3.5, 'green'],
          [-4.4, 4.0, 'autumn'], [8.6, 7.6, 'green'], [-6.4, 8.4, 'light'], [0.6, 8.6, 'autumn'],
          [-15.0, 0.8, 'green'], [14.6, 6.6, 'light'],
        ] as [number, number, LeafKind][]
      )
        .map(([x, z, k]) => [...relocate(x, z), k] as [number, number, LeafKind])
        .filter(([x, z]) => clearOfRoad(x, z, 0.5))
        .map(([x, z, k], i) => (
          <Shrub key={i} x={x} z={z} s={1.3} kind={k} seed={i} />
        ))}
      <Instances geometry={GRASS_CLUMP} material={clumpMat} items={clumps} shadow />
      <Instances geometry={FLOWER} material={M.white} items={flowers} />
      <Pond />
    </group>
  );
}
