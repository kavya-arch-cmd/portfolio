import { useFrame, useThree } from '@react-three/fiber';
import { useLayoutEffect, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';

/**
 * Frame-budget helpers that keep motion smooth on modest GPUs.
 *
 * `sceneTime` is a monotonic clock that advances with the frame delta (capped, so a
 * hitch never makes the car or a signboard jump). Unlike R3F's own clock it is never
 * reset when the render loop pauses while a content page is open.
 */
export const sceneTime = { t: 0 };

const shadowWake = { until: 0 };

/** Keep the shadow map updating every frame for the next `seconds` (arrival hop, leaf burst). */
export function wakeShadows(seconds: number) {
  shadowWake.until = Math.max(shadowWake.until, sceneTime.t + seconds);
}

/**
 * The shadow map (hundreds of casters, 2–4k texels) was redrawn on every frame, roughly
 * doubling the draw calls. The world is almost entirely static, so the shadow pass now runs:
 * every frame while the car drives or an arrival effect plays, every other frame while the
 * camera moves (signboards turn to face it), and a few times per second otherwise
 * (windmill sails, hover).
 */
export function FrameBudget({ drivingRef }: { drivingRef: MutableRefObject<boolean> }) {
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);
  const lastCam = useRef(new THREE.Matrix4());
  const frame = useRef(0);

  useLayoutEffect(() => {
    gl.shadowMap.autoUpdate = false;
    gl.shadowMap.needsUpdate = true;
    return () => {
      gl.shadowMap.autoUpdate = true;
    };
  }, [gl]);

  useFrame((_, dt) => {
    sceneTime.t += Math.min(dt, 0.1);
    const moved = !lastCam.current.equals(camera.matrixWorld);
    if (moved) lastCam.current.copy(camera.matrixWorld);
    const every = drivingRef.current || sceneTime.t < shadowWake.until ? 1 : moved ? 2 : 6;
    if (++frame.current % every === 0) gl.shadowMap.needsUpdate = true;
  });
  return null;
}
