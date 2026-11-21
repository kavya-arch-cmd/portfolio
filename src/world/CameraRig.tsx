import { MapControls, OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useMemo, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { DestinationId } from '../content/destinations';
import { CAMERA_FOV, VIEW_DIR, WORLD_BOUNDS, distanceForWidth, fitView } from './camera';
import type { CarState } from './Car';
import { shotFor } from './shots';

import { RESET_VIEW_EVENT } from './events';

/** World units that should span the width on small screens (0 = frame the whole world). */
function closeUpUnits(w: number) {
  if (w < 600) return 20;
  if (w < 1000) return 34;
  return 0;
}

type Mode = 'home' | 'chase' | 'shot' | 'free';

const CHASE_BACK = 11;
const CHASE_UP = 7.5;
const CHASE_AHEAD = 2.5;
/** World units the chase view should show across the screen at the car, at minimum. */
const CHASE_MIN_WIDTH = 9;

/** How much further back the chase camera sits on narrow screens (1 on desktop). */
function chaseScale(aspect: number) {
  const dist = Math.hypot(CHASE_BACK, CHASE_UP);
  const visible = 2 * Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV / 2)) * dist * aspect;
  return THREE.MathUtils.clamp(CHASE_MIN_WIDTH / visible, 1, 2.8);
}

/**
 * Full 3D camera:
 * - free orbit / pan / zoom (mouse) or pan / pinch / twist (touch);
 * - while the car drives, a smooth elevated chase view behind it;
 * - on arrival, a glide to a close-up of the destination;
 * - "Reset view" glides back to the framed overview.
 */
export function CameraRig({
  car,
  drivingRef,
  focusId,
  reducedMotion,
}: {
  car: CarState;
  drivingRef: MutableRefObject<boolean>;
  focusId: { id: DestinationId; nonce: number } | null;
  reducedMotion: boolean;
}) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const controls = useRef<OrbitControlsImpl>(null);
  const closeUp = closeUpUnits(size.width);
  const touch = useMemo(() => window.matchMedia?.('(pointer: coarse)').matches ?? false, []);
  const home = useRef({ position: new THREE.Vector3(), target: new THREE.Vector3(), distance: 50 });
  const mode = useRef<Mode>('home');
  const baseMax = useRef(120);
  const desiredPos = useRef(new THREE.Vector3());
  const desiredTarget = useRef(new THREE.Vector3());
  const aspect = size.width / size.height;
  const chaseK = chaseScale(aspect);
  const shot = useMemo(() => (focusId ? shotFor(focusId.id, aspect, CAMERA_FOV) : null), [focusId, aspect]);

  // Compute the framed overview for the current viewport.
  useLayoutEffect(() => {
    const aspect = size.width / size.height;
    const fit = fitView(aspect);
    const distance = closeUp ? Math.min(fit.distance, distanceForWidth(closeUp, aspect)) : fit.distance;
    const target = closeUp
      ? new THREE.Vector3(THREE.MathUtils.clamp(car.pos.x + 4, -20, 24), 0, fit.target.z)
      : fit.target;
    home.current = {
      target,
      distance,
      position: target.clone().addScaledVector(VIEW_DIR, distance),
    };
    camera.fov = CAMERA_FOV;
    camera.near = 0.5;
    camera.far = 600;
    camera.updateProjectionMatrix();
    const c = controls.current;
    baseMax.current = Math.max(distance * 1.3, 30);
    if (c) c.maxDistance = baseMax.current;
    if (mode.current === 'home') {
      camera.position.copy(home.current.position);
      camera.lookAt(target);
      if (c) {
        c.target.copy(target);
        c.update();
      }
    }
  }, [size.width, size.height, closeUp]); // eslint-disable-line react-hooks/exhaustive-deps

  // Arrival: glide to the destination close-up.
  useEffect(() => {
    if (focusId) mode.current = 'shot';
  }, [focusId]);

  // Reset view button.
  useEffect(() => {
    const on = () => (mode.current = 'home');
    window.addEventListener(RESET_VIEW_EVENT, on);
    return () => window.removeEventListener(RESET_VIEW_EVENT, on);
  }, []);

  // Any user interaction hands the camera back to the visitor.
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const onStart = () => {
      if (!drivingRef.current) mode.current = 'free';
    };
    c.addEventListener('start', onStart);
    return () => c.removeEventListener('start', onStart);
  });

  const fwd = useRef(new THREE.Vector3());
  useFrame((_, dt) => {
    const c = controls.current;
    if (!c) return;
    if (drivingRef.current) mode.current = 'chase';
    else if (mode.current === 'chase') mode.current = focusId ? 'shot' : 'free';

    c.enabled = mode.current !== 'chase';
    let k = 0;
    if (mode.current === 'chase') {
      fwd.current.set(Math.sin(car.heading), 0, Math.cos(car.heading));
      desiredTarget.current.copy(car.pos).addScaledVector(fwd.current, CHASE_AHEAD).setY(0.6);
      desiredPos.current.copy(car.pos).addScaledVector(fwd.current, -CHASE_BACK * chaseK).setY(CHASE_UP * chaseK);
      k = 2.2;
    } else if (mode.current === 'shot' && shot) {
      desiredTarget.current.copy(shot.target);
      desiredPos.current.copy(shot.position);
      k = 1.8;
    } else if (mode.current === 'home') {
      desiredTarget.current.copy(home.current.target);
      desiredPos.current.copy(home.current.position);
      k = 2.4;
    }

    if (k > 0) {
      // Never let the zoom limit pull a wider guided view (phones) back in.
      c.maxDistance = Math.max(baseMax.current, desiredPos.current.distanceTo(desiredTarget.current) * 1.05);
      const a = reducedMotion ? 1 : 1 - Math.exp(-dt * k);
      camera.position.lerp(desiredPos.current, a);
      c.target.lerp(desiredTarget.current, a);
      if (mode.current === 'home' && camera.position.distanceTo(desiredPos.current) < 0.05) mode.current = 'free';
    } else {
      // Free exploring: keep the focus point inside the world.
      const cx = THREE.MathUtils.clamp(c.target.x, WORLD_BOUNDS.minX, WORLD_BOUNDS.maxX);
      const cz = THREE.MathUtils.clamp(c.target.z, WORLD_BOUNDS.minZ, WORLD_BOUNDS.maxZ);
      if (cx !== c.target.x || cz !== c.target.z) {
        camera.position.x += cx - c.target.x;
        camera.position.z += cz - c.target.z;
        c.target.set(cx, c.target.y, cz);
      }
    }
    c.update();
  });

  const common = {
    makeDefault: true,
    enableDamping: true,
    dampingFactor: 0.08,
    minDistance: 7,
    maxDistance: 120,
    minPolarAngle: 0.35, // ~70° elevation max
    maxPolarAngle: 1.3, // ~16° elevation min — never below the ground
    zoomSpeed: 0.7,
    rotateSpeed: 0.55,
    screenSpacePanning: false,
  };
  return touch ? (
    <MapControls ref={controls as never} {...common} />
  ) : (
    <OrbitControls ref={controls as never} {...common} />
  );
}
