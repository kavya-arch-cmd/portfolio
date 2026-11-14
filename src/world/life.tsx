import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { WORLD_SCALE } from './scale';

/**
 * Ambient life for the miniature world: swaying trees, chimney smoke, birds,
 * pond ripples and the arrival leaf burst.
 *
 * Everything reads `worldTime`, which only advances while motion is allowed,
 * so `prefers-reduced-motion` freezes the scene in a calm, complete state.
 */
export const worldTime = { t: 0, reduced: false };

/** Advance the shared clock (rendered once inside the Canvas). */
export function WorldClock({ reducedMotion }: { reducedMotion: boolean }) {
  useFrame((_, dt) => {
    worldTime.reduced = reducedMotion;
    if (!reducedMotion) {
      worldTime.t += Math.min(dt, 0.1);
      swayUniform.value = worldTime.t;
    }
  });
  return null;
}

/* ── Tree sway ─────────────────────────────────────────────── */

const swayUniform = { value: 0 };

/**
 * Patch a foliage material so canopies sway gently in the breeze. The offset is
 * applied in world space (after instancing), grows with height above the ground
 * and is phase-shifted by position so neighbouring trees move out of step.
 */
export function addSway(material: THREE.Material, strength = 0.06) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uSwayTime = swayUniform;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uSwayTime;')
      .replace(
        '#include <project_vertex>',
        `vec4 swayWorld = vec4( transformed, 1.0 );
#ifdef USE_INSTANCING
        swayWorld = instanceMatrix * swayWorld;
#endif
        swayWorld = modelMatrix * swayWorld;
        float swayH = max( 0.0, swayWorld.y - 1.1 );
        float swayP = uSwayTime * 1.25 + swayWorld.x * 0.21 + swayWorld.z * 0.17;
        swayWorld.xz += vec2( sin( swayP ) + 0.35 * sin( swayP * 2.3 ), cos( swayP * 0.8 ) * 0.6 ) * swayH * ${strength.toFixed(3)};
        vec4 mvPosition = viewMatrix * swayWorld;
        gl_Position = projectionMatrix * mvPosition;`,
      );
  };
  material.customProgramCacheKey = () => `sway-${strength}`;
  material.needsUpdate = true;
}

/* ── Chimney smoke ─────────────────────────────────────────── */

const smokeGeo = new THREE.IcosahedronGeometry(1, 1);
const PUFFS = 6;
const SMOKE_LIFE = 4.2;

/** Soft puffs drifting up from a chimney top (local coordinates). */
export function Smoke({ position }: { position: [number, number, number] }) {
  const mats = useMemo(
    () =>
      Array.from({ length: PUFFS }, () =>
        new THREE.MeshStandardMaterial({ color: '#EFE8DE', roughness: 1, transparent: true, depthWrite: false }),
      ),
    [],
  );
  const refs = useRef<THREE.Mesh[]>([]);
  useFrame(() => {
    refs.current.forEach((m, i) => {
      if (!m) return;
      const k = ((worldTime.t / SMOKE_LIFE + i / PUFFS) % 1 + 1) % 1;
      m.position.set(Math.sin(k * 3 + i) * 0.12 + k * 0.5, k * 2.4, k * -0.2);
      const s = 0.14 + k * 0.42;
      m.scale.set(s, s * 0.85, s);
      mats[i].opacity = 0.62 * Math.min(1, k * 6) * (1 - k);
    });
  });
  return (
    <group position={position}>
      {mats.map((mat, i) => (
        <mesh key={i} ref={(el) => void (refs.current[i] = el!)} geometry={smokeGeo} material={mat} />
      ))}
    </group>
  );
}

/* ── Birds ─────────────────────────────────────────────────── */

const birdMat = new THREE.MeshStandardMaterial({ color: '#4A423A', roughness: 0.9, side: THREE.DoubleSide });
const wingGeo = (() => {
  const g = new THREE.BufferGeometry();
  // one wing: a slim triangle from the body outwards (x > 0)
  g.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0.18, 0, 0, -0.14, 0.75, 0, -0.05], 3));
  g.computeVertexNormals();
  return g;
})();

const FLOCK = [
  { r: 22, h: 13, speed: 0.09, phase: 0, off: [0, 0, 0] },
  { r: 22, h: 13.4, speed: 0.09, phase: 0, off: [-1.1, 0.3, -1.3] },
  { r: 22, h: 12.7, speed: 0.09, phase: 0, off: [1.2, -0.2, -1.5] },
  { r: 15, h: 10.5, speed: -0.12, phase: 2.4, off: [0, 0, 0] },
  { r: 15, h: 10.9, speed: -0.12, phase: 2.4, off: [0.9, 0.2, 1.1] },
];

/** A few small birds gliding in wide loops high above the world. */
export function Birds() {
  const birds = useRef<THREE.Group[]>([]);
  const wings = useRef<THREE.Mesh[]>([]);
  useFrame(() => {
    const t = worldTime.t;
    FLOCK.forEach((b, i) => {
      const g = birds.current[i];
      if (!g) return;
      const a = b.phase + t * b.speed;
      const cx = 2 * WORLD_SCALE;
      g.position.set(cx + Math.cos(a) * b.r * WORLD_SCALE + b.off[0], b.h + Math.sin(t * 0.7 + i) * 0.3 + b.off[1], Math.sin(a) * b.r * 0.7 * WORLD_SCALE + b.off[2]);
      // face the direction of travel
      g.rotation.y = Math.atan2(-Math.sin(a) * Math.sign(b.speed), Math.cos(a) * 0.7 * Math.sign(b.speed));
      const flap = Math.sin(t * 7 + i * 1.7) * 0.5;
      const glide = Math.sin(t * 0.6 + i) > 0.3 ? 0.15 : flap; // glide now and then
      const l = wings.current[i * 2];
      const r = wings.current[i * 2 + 1];
      if (l && r) {
        l.rotation.z = glide;
        r.rotation.z = -glide;
      }
    });
  });
  return (
    <group>
      {FLOCK.map((_, i) => (
        <group key={i} ref={(el) => void (birds.current[i] = el!)} scale={0.9}>
          <mesh ref={(el) => void (wings.current[i * 2] = el!)} geometry={wingGeo} material={birdMat} />
          <mesh ref={(el) => void (wings.current[i * 2 + 1] = el!)} geometry={wingGeo} material={birdMat} scale={[-1, 1, 1]} />
          <mesh material={birdMat} position={[0, 0, 0.02]} scale={[0.07, 0.06, 0.32]}>
            <sphereGeometry args={[1, 8, 6]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ── Pond ripples ──────────────────────────────────────────── */

const rippleGeo = new THREE.RingGeometry(0.9, 1, 40);
const RIPPLES: { x: number; z: number; delay: number }[] = [
  { x: 1.2, z: 0.3, delay: 0 },
  { x: -1.6, z: -0.4, delay: 1.7 },
  { x: 2.2, z: -0.5, delay: 3.1 },
];
const RIPPLE_LIFE = 4.5;

/** Slow expanding rings on the pond surface (pond-local coordinates, ellipse 3.4 × 1.45). */
export function Ripples() {
  const mats = useMemo(
    () => RIPPLES.map(() => new THREE.MeshBasicMaterial({ color: '#E8EEE6', transparent: true, depthWrite: false })),
    [],
  );
  const refs = useRef<THREE.Mesh[]>([]);
  useFrame(() => {
    RIPPLES.forEach((rp, i) => {
      const m = refs.current[i];
      if (!m) return;
      const k = (((worldTime.t + rp.delay) / RIPPLE_LIFE) % 1 + 1) % 1;
      const s = 0.1 + k * 0.75;
      m.scale.set(s, s * 0.85, 1);
      mats[i].opacity = 0.55 * Math.min(1, k * 5) * (1 - k);
    });
  });
  return (
    <>
      {RIPPLES.map((rp, i) => (
        <mesh
          key={i}
          ref={(el) => void (refs.current[i] = el!)}
          geometry={rippleGeo}
          material={mats[i]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[rp.x, 0.035, rp.z]}
        />
      ))}
    </>
  );
}

/* ── Arrival leaf burst ────────────────────────────────────── */

const LEAVES = 34;
const BURST_LIFE = 2.6;
const leafGeo = new THREE.PlaneGeometry(0.22, 0.14);
const leafMat = new THREE.MeshStandardMaterial({ roughness: 0.8, side: THREE.DoubleSide });
const LEAF_COLOURS = ['#B8662F', '#C98140', '#D79A4C', '#CDA843', '#8E975D', '#6E7B4C'];

/**
 * A short, earthy burst of leaves that pops up from a destination when the car
 * arrives and drifts down. `trigger` changes on every arrival.
 */
export function LeafBurst({ origin, trigger }: { origin: THREE.Vector3 | null; trigger: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const state = useRef<{ start: number; parts: { v: THREE.Vector3; spin: THREE.Vector3 }[] } | null>(null);
  const lastTrigger = useRef(trigger);
  const m4 = useMemo(() => new THREE.Matrix4(), []);
  const q = useMemo(() => new THREE.Quaternion(), []);
  const e = useMemo(() => new THREE.Euler(), []);
  const p = useMemo(() => new THREE.Vector3(), []);
  const sc = useMemo(() => new THREE.Vector3(), []);

  useLayoutEffect(() => {
    // colours are fixed per leaf
    const c = new THREE.Color();
    for (let i = 0; i < LEAVES; i++) mesh.current.setColorAt(i, c.set(LEAF_COLOURS[i % LEAF_COLOURS.length]));
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
  }, []);

  useFrame(({ clock }) => {
    const im = mesh.current;
    if (!im) return;
    if (trigger !== lastTrigger.current) {
      lastTrigger.current = trigger;
      if (origin && !worldTime.reduced) {
        state.current = {
          start: clock.elapsedTime,
          parts: Array.from({ length: LEAVES }, () => {
            const a = Math.random() * Math.PI * 2;
            const out = 1.2 + Math.random() * 1.8;
            return {
              v: new THREE.Vector3(Math.cos(a) * out, 3.2 + Math.random() * 2.4, Math.sin(a) * out),
              spin: new THREE.Vector3(Math.random() * 8 - 4, Math.random() * 8 - 4, Math.random() * 8 - 4),
            };
          }),
        };
      }
    }
    const s = state.current;
    if (!s || !origin) {
      im.visible = false;
      return;
    }
    const t = clock.elapsedTime - s.start;
    if (t > BURST_LIFE) {
      state.current = null;
      im.visible = false;
      return;
    }
    im.visible = true;
    const fade = t > BURST_LIFE - 0.7 ? (BURST_LIFE - t) / 0.7 : 1;
    s.parts.forEach((pt, i) => {
      // rise, then flutter down with air drag
      const drag = 1 - Math.exp(-t * 1.6);
      p.set(
        origin.x + (pt.v.x / 1.6) * drag + Math.sin(t * 3 + i) * 0.15 * t,
        origin.y + (pt.v.y / 1.6) * drag - 0.9 * t * t,
        origin.z + (pt.v.z / 1.6) * drag + Math.cos(t * 2.6 + i) * 0.15 * t,
      );
      p.y = Math.max(0.05, p.y);
      e.set(pt.spin.x * t, pt.spin.y * t, pt.spin.z * t);
      q.setFromEuler(e);
      const k = Math.min(1, t * 6) * fade;
      sc.set(k, k, k);
      m4.compose(p, q, sc);
      im.setMatrixAt(i, m4);
    });
    im.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={mesh} args={[leafGeo, leafMat, LEAVES]} frustumCulled={false} visible={false} castShadow />;
}
