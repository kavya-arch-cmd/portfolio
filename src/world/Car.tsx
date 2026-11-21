import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useMemo, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import type { DestinationId } from '../content/destinations';
import { HOME_U, STOP_U } from './layout';
import { Box } from './parts';
import { ROAD_LENGTH, ROAD_Y, roadFrame } from './roadPath';
import { sceneTime } from './perf';
import { contactShadowTexture } from './textures';

/** Live car pose shared with the camera rig. */
export interface CarState {
  pos: THREE.Vector3;
  heading: number;
}

export interface DriveRequest {
  id: DestinationId;
  nonce: number;
}

const paint = new THREE.MeshPhysicalMaterial({
  color: '#B2402A',
  roughness: 0.32,
  metalness: 0.35,
  clearcoat: 0.8,
  clearcoatRoughness: 0.2,
});
const glass = new THREE.MeshStandardMaterial({ color: '#1D2124', roughness: 0.12, metalness: 0.4 });
const trim = new THREE.MeshStandardMaterial({ color: '#2A2827', roughness: 0.7 });
const tyre = new THREE.MeshStandardMaterial({ color: '#1C1B1A', roughness: 0.85 });
const rim = new THREE.MeshStandardMaterial({ color: '#A5A29C', roughness: 0.3, metalness: 0.8 });
const headlight = new THREE.MeshStandardMaterial({ color: '#F4EEDF', emissive: '#F1DDB0', emissiveIntensity: 0.35, roughness: 0.2 });
const taillight = new THREE.MeshStandardMaterial({ color: '#7E1A14', emissive: '#8E1D12', emissiveIntensity: 0.4, roughness: 0.3 });

const LANE_OFFSET = 0.22; // drive in the left lane
const WHEEL_R = 0.24;

/** Trapezoidal velocity profile: smooth acceleration, cruise, smooth deceleration. */
function travelled(p: number, a = 0.28) {
  const v = 1 / (1 - a);
  if (p < a) return (v * p * p) / (2 * a);
  if (p > 1 - a) return 1 - (v * (1 - p) * (1 - p)) / (2 * a);
  return v * (a / 2 + (p - a));
}

function SuvModel({ wheelRefs }: { wheelRefs: MutableRefObject<THREE.Group[]> }) {
  const shadowMat = useMemo(
    () => new THREE.MeshBasicMaterial({ map: contactShadowTexture(), transparent: true, depthWrite: false }),
    [],
  );
  const wheels: [number, number][] = [
    [0.47, 0.68],
    [-0.47, 0.68],
    [0.47, -0.66],
    [-0.47, -0.66],
  ];
  return (
    <group>
      {/* soft contact shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} material={shadowMat} renderOrder={1}>
        <planeGeometry args={[1.5, 2.6]} />
      </mesh>
      {/* lower body */}
      <RoundedBox args={[0.96, 0.44, 2.06]} radius={0.12} smoothness={4} position={[0, 0.44, 0]} material={paint} castShadow receiveShadow />
      {/* hood slope */}
      <RoundedBox args={[0.92, 0.12, 0.62]} radius={0.05} smoothness={3} position={[0, 0.66, 0.66]} rotation={[0.1, 0, 0]} material={paint} castShadow />
      {/* cabin glass */}
      <RoundedBox args={[0.84, 0.38, 1.26]} radius={0.1} smoothness={4} position={[0, 0.82, -0.18]} material={glass} castShadow />
      {/* roof */}
      <RoundedBox args={[0.86, 0.08, 1.1]} radius={0.04} smoothness={3} position={[0, 1.02, -0.24]} material={paint} castShadow />
      {/* pillars */}
      {[0.425, -0.425].map((x) => (
        <group key={x}>
          <Box size={[0.03, 0.36, 0.1]} position={[x, 0.82, 0.3]} rotation={[-0.45, 0, 0]} material={paint} />
          <Box size={[0.03, 0.36, 0.1]} position={[x, 0.82, -0.18]} material={paint} />
          <Box size={[0.03, 0.34, 0.14]} position={[x, 0.82, -0.74]} rotation={[0.25, 0, 0]} material={paint} />
        </group>
      ))}
      {/* roof rails */}
      {[0.33, -0.33].map((x) => (
        <Box key={x} size={[0.04, 0.04, 0.95]} position={[x, 1.08, -0.24]} material={trim} />
      ))}
      {/* lower cladding + bumpers */}
      <Box size={[0.99, 0.12, 1.5]} position={[0, 0.27, 0]} material={trim} />
      <RoundedBox args={[0.94, 0.16, 0.12]} radius={0.04} position={[0, 0.3, 1.02]} material={trim} />
      <RoundedBox args={[0.94, 0.16, 0.12]} radius={0.04} position={[0, 0.3, -1.02]} material={trim} />
      {/* grille + lights */}
      <Box size={[0.5, 0.12, 0.03]} position={[0, 0.5, 1.03]} material={trim} shadow={false} />
      {[0.33, -0.33].map((x) => (
        <group key={x}>
          <Box size={[0.22, 0.07, 0.03]} position={[x, 0.55, 1.03]} material={headlight} shadow={false} />
          <Box size={[0.24, 0.07, 0.03]} position={[x, 0.58, -1.03]} material={taillight} shadow={false} />
        </group>
      ))}
      <Box size={[0.5, 0.03, 0.02]} position={[0, 0.58, -1.035]} material={taillight} shadow={false} />
      {/* mirrors */}
      {[0.5, -0.5].map((x) => (
        <Box key={x} size={[0.1, 0.07, 0.12]} position={[x, 0.7, 0.36]} material={paint} />
      ))}
      {/* wheel arches + wheels */}
      {wheels.map(([x, z], i) => (
        <group key={i} position={[x, WHEEL_R, z]}>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[Math.sign(x) * 0.02, 0.02, 0]} material={trim}>
            <cylinderGeometry args={[0.3, 0.3, 0.06, 20, 1, true, Math.PI * 0.5, Math.PI]} />
          </mesh>
          <group ref={(g) => { if (g) wheelRefs.current[i] = g; }}>
            <mesh rotation={[0, 0, Math.PI / 2]} material={tyre} castShadow>
              <cylinderGeometry args={[WHEEL_R, WHEEL_R, 0.2, 24]} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]} position={[Math.sign(x) * 0.075, 0, 0]} material={rim}>
              <cylinderGeometry args={[0.14, 0.14, 0.06, 10]} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

export function Car({
  request,
  reducedMotion,
  onArrive,
  car,
  drivingRef,
}: {
  request: DriveRequest | null;
  reducedMotion: boolean;
  onArrive: (id: DestinationId) => void;
  car: CarState;
  drivingRef: MutableRefObject<boolean>;
}) {
  const group = useRef<THREE.Group>(null!);
  const wheelRefs = useRef<THREE.Group[]>([]);
  const u = useRef(HOME_U);
  const journey = useRef<{ from: number; dist: number; t0: number; dur: number; id: DestinationId; last: number } | null>(null);
  const arriveRef = useRef(onArrive);
  arriveRef.current = onArrive;
  const tmp = useMemo(() => new THREE.Vector3(), []);

  const place = (uu: number) => {
    const { position, heading } = roadFrame(uu, LANE_OFFSET, tmp);
    group.current.position.set(position.x, ROAD_Y, position.z);
    group.current.rotation.y = heading;
    car.pos.copy(group.current.position);
    car.heading = heading;
  };

  useLayoutEffect(() => place(u.current), []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!request || journey.current) return;
    const target = STOP_U[request.id];
    const dist = (((target - u.current) % 1) + 1) % 1 * ROAD_LENGTH;
    if (reducedMotion || dist < 0.3) {
      u.current = target;
      place(target);
      arriveRef.current(request.id);
      return;
    }
    journey.current = {
      from: u.current,
      dist,
      t0: -1,
      dur: Math.min(7.5, Math.max(1.8, 1.2 + dist / 10)),
      id: request.id,
      last: 0,
    };
    drivingRef.current = true;
  }, [request]); // eslint-disable-line react-hooks/exhaustive-deps

  const body = useRef<THREE.Group>(null!);
  const pitch = useRef(0);
  useFrame((_, dt) => {
    const j = journey.current;
    // Body squats a touch when pulling away and dips when braking; brake lights brighten.
    const phase = j && j.t0 >= 0 ? Math.min(1, (sceneTime.t - j.t0) / j.dur) : 1;
    const braking = !!j && phase > 0.72;
    const target = !j || reducedMotion ? 0 : phase < 0.2 ? -0.03 : braking ? 0.035 : 0;
    pitch.current += (target - pitch.current) * (1 - Math.exp(-dt * 6));
    if (body.current) body.current.rotation.x = pitch.current;
    taillight.emissiveIntensity += ((braking ? 1.6 : 0.4) - taillight.emissiveIntensity) * (1 - Math.exp(-dt * 8));
    if (!j) return;
    const now = sceneTime.t;
    if (j.t0 < 0) j.t0 = now;
    const p = Math.min(1, (now - j.t0) / j.dur);
    const s = travelled(p) * j.dist;
    u.current = (j.from + s / ROAD_LENGTH) % 1;
    place(u.current);
    const spin = (s - j.last) / WHEEL_R;
    j.last = s;
    wheelRefs.current.forEach((w) => (w.rotation.x += spin));
    if (p >= 1) {
      journey.current = null;
      drivingRef.current = false;
      arriveRef.current(j.id);
    }
  });

  return (
    <group ref={group}>
      <group ref={body} scale={1.3}>
        <SuvModel wheelRefs={wheelRefs} />
      </group>
    </group>
  );
}
