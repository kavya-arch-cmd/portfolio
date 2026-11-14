import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { M } from './materials';
import { KERB_HEIGHT, KERB_WIDTH, ROAD_LENGTH, ROAD_WIDTH, ROAD_Y, roadCurve } from './roadPath';

const SEGMENTS = 1400;

/** Precomputed centre points and left-pointing normals along the loop. */
function frames() {
  const pts: THREE.Vector3[] = [];
  const lefts: THREE.Vector3[] = [];
  const t = new THREE.Vector3();
  for (let i = 0; i <= SEGMENTS; i++) {
    const u = (i % SEGMENTS) / SEGMENTS;
    pts.push(roadCurve.getPointAt(u));
    roadCurve.getTangentAt(u, t);
    lefts.push(new THREE.Vector3(t.z, 0, -t.x).normalize());
  }
  return { pts, lefts };
}

/**
 * Sweep a cross-section profile along the road.
 * Profile points are [lateral offset, height]; each consecutive pair becomes a face strip.
 */
function sweep(profile: [number, number][], vScale = 1) {
  const { pts, lefts } = frames();
  const positions: number[] = [];
  const uvs: number[] = [];
  const index: number[] = [];
  let base = 0;
  for (let s = 0; s < profile.length - 1; s++) {
    const [o0, y0] = profile[s];
    const [o1, y1] = profile[s + 1];
    for (let i = 0; i <= SEGMENTS; i++) {
      const p = pts[i];
      const l = lefts[i];
      const v = ((i / SEGMENTS) * ROAD_LENGTH) / vScale;
      positions.push(p.x + l.x * o0, y0, p.z + l.z * o0, p.x + l.x * o1, y1, p.z + l.z * o1);
      uvs.push(0, v, 1, v);
    }
    for (let i = 0; i < SEGMENTS; i++) {
      const a = base + i * 2;
      index.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
    base += (SEGMENTS + 1) * 2;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(index);
  g.computeVertexNormals();
  return g;
}

function Dashes() {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const gap = 1.15;
  const count = Math.floor(ROAD_LENGTH / gap);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const p = new THREE.Vector3();
    const t = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);
    const one = new THREE.Vector3(1, 1, 1);
    for (let i = 0; i < count; i++) {
      const u = i / count;
      roadCurve.getPointAt(u, p);
      roadCurve.getTangentAt(u, t);
      q.setFromAxisAngle(up, Math.atan2(t.x, t.z));
      p.y = ROAD_Y + 0.004;
      m.compose(p, q, one);
      ref.current.setMatrixAt(i, m);
    }
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.computeBoundingSphere();
  }, [count]);
  return (
    <instancedMesh ref={ref} args={[undefined, M.marking, count]} receiveShadow>
      <boxGeometry args={[0.09, 0.008, 0.5]} />
    </instancedMesh>
  );
}

export function Road() {
  const { asphalt, kerbs, shoulders } = useMemo(() => {
    const hw = ROAD_WIDTH / 2;
    const kw = KERB_WIDTH;
    const kh = KERB_HEIGHT;
    const asphalt = sweep([[-hw, ROAD_Y], [hw, ROAD_Y]], 3);
    // Profiles run left-to-right in travel space so every face winds outward.
    const leftKerb: [number, number][] = [
      [hw, ROAD_Y],
      [hw, kh],
      [hw + kw, kh],
      [hw + kw, 0.005],
    ];
    const rightKerb = leftKerb.map(([o, y]) => [-o, y] as [number, number]).reverse();
    const kerbs = [leftKerb, rightKerb].map((p) => sweep(p, 1));
    const shoulders = [
      sweep([[hw + kw, 0.012], [hw + kw + 0.34, 0.012]], 1),
      sweep([[-(hw + kw + 0.34), 0.012], [-(hw + kw), 0.012]], 1),
    ];
    return { asphalt, kerbs, shoulders };
  }, []);

  return (
    <group>
      <mesh geometry={asphalt} material={M.asphalt} receiveShadow />
      {kerbs.map((g, i) => (
        <mesh key={i} geometry={g} material={M.kerb} receiveShadow castShadow />
      ))}
      {shoulders.map((g, i) => (
        <mesh key={i} geometry={g} material={M.shoulder} receiveShadow />
      ))}
      <Dashes />
    </group>
  );
}
