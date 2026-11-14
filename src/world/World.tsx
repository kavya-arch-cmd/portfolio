import { Canvas, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { DestinationId } from '../content/destinations';
import { CameraRig } from './CameraRig';
import { Car, type CarState, type DriveRequest } from './Car';
import { Destinations } from './Destinations';
import { Landscape } from './Landscape';
import { Meadow } from './Meadow';
import { Village } from './Village';
import { PLACEMENTS } from './layout';
import { Birds, LeafBurst, WorldClock } from './life';
import { Periphery } from './Periphery';
import { Road } from './Road';

/** Phones and tablets get a lighter shadow map and pixel ratio so the first frame and every frame after stay quick. */
const LIGHT = window.matchMedia?.('(pointer: coarse)').matches ?? false;

/**
 * Compiles every material once the scene is mounted, then reports ready after the first
 * frames have been drawn, so the loading screen hides only when the world is on screen.
 */
function Ready({ onReady }: { onReady: () => void }) {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    gl.compile(scene, camera);
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(onReady);
    });
    return () => cancelAnimationFrame(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

function Lights() {
  return (
    <>
      <hemisphereLight args={['#FFF6E6', '#D2BC9C', 1.45]} />
      <directionalLight
        position={[-20, 32, 18]}
        intensity={2.2}
        color="#FFE6C4"
        castShadow
        shadow-mapSize={LIGHT ? [2048, 2048] : [4096, 4096]}
        shadow-camera-left={-52}
        shadow-camera-right={52}
        shadow-camera-top={42}
        shadow-camera-bottom={-42}
        shadow-camera-near={1}
        shadow-camera-far={130}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-radius={4}
      />
    </>
  );
}

export function World({
  request,
  reducedMotion,
  driving,
  onSelect,
  onArrive,
  onReady,
  focusId,
}: {
  focusId: { id: DestinationId; nonce: number } | null;
  request: DriveRequest | null;
  reducedMotion: boolean;
  driving: boolean;
  onSelect: (id: DestinationId) => void;
  onArrive: (id: DestinationId) => void;
  onReady: () => void;
}) {
  const car = useRef<CarState>({ pos: new THREE.Vector3(), heading: 0 }).current;
  const drivingRef = useRef(false);
  // Arrival burst rises from the destination's signboard.
  const burstOrigin = useMemo(() => {
    if (!focusId) return null;
    const s = PLACEMENTS[focusId.id].sign;
    return new THREE.Vector3(s.x, s.y + 2.6, s.z);
  }, [focusId]);
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, LIGHT ? 1.5 : 2]}
      camera={{ position: [0, 40, 50], fov: 28, near: 0.5, far: 500 }}
      onCreated={(state) => {
        state.gl.toneMapping = THREE.NeutralToneMapping;
        state.gl.toneMappingExposure = 1.12;
        // Soft studio reflections (no network fetch) so paint and gold read as real materials.
        const pmrem = new THREE.PMREMGenerator(state.gl);
        state.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        state.scene.environmentIntensity = 0.35;
        if (import.meta.env.DEV) (window as unknown as { __r3f: unknown }).__r3f = state;
      }}
      onPointerMissed={() => (document.body.style.cursor = '')}
    >
      <color attach="background" args={['#F3E6D5']} />
      <Lights />
      <Meadow />
      <Village />
      <Road />
      <Landscape />
      <Periphery />
      <WorldClock reducedMotion={reducedMotion} />
      <Birds />
      <Destinations onSelect={onSelect} disabled={driving} arrival={focusId} />
      <LeafBurst origin={burstOrigin} trigger={focusId?.nonce ?? 0} />
      <Car request={request} reducedMotion={reducedMotion} onArrive={onArrive} car={car} drivingRef={drivingRef} />
      <CameraRig car={car} drivingRef={drivingRef} focusId={focusId} reducedMotion={reducedMotion} />
      <Ready onReady={onReady} />
    </Canvas>
  );
}

export default World;
