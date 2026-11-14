import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { worldTime } from './life';
import { M } from './materials';
import { Box } from './parts';
import { signTexture } from './textures';

const WIDTH = 4.9;

/** Timber signboard with a painted paper face, angled toward the viewer. */
export function Signboard({
  lines,
  position,
  hovered,
  celebrate = 0,
}: {
  lines: string[];
  position: [number, number, number];
  hovered: boolean;
  /** Changes on each arrival here: the board hops and wobbles, then settles. */
  celebrate?: number;
}) {
  const height = lines.length > 1 ? 1.75 : 1.15;
  const face = useMemo(() => {
    const map = signTexture(lines, WIDTH / height);
    return new THREE.MeshStandardMaterial({ map, roughness: 0.85 });
  }, [lines, height]);
  const boardY = 0.42 + height / 2;
  const postX = WIDTH / 2 - 0.55;
  const group = useRef<THREE.Group>(null!);
  const board = useRef<THREE.Group>(null!);
  const hop = useRef({ nonce: celebrate, start: -1 });
  // Turn the board to face the viewer so it stays readable from any orbit angle.
  useFrame(({ camera, clock }) => {
    const g = group.current;
    g.rotation.y = Math.atan2(camera.position.x - g.position.x, camera.position.z - g.position.z);
    const h = hop.current;
    if (celebrate !== h.nonce) {
      h.nonce = celebrate;
      h.start = celebrate && !worldTime.reduced ? clock.elapsedTime : -1;
    }
    const b = board.current;
    const t = h.start < 0 ? 99 : clock.elapsedTime - h.start;
    const decay = Math.exp(-t * 2.2);
    b.position.y = boardY + (hovered ? 0.08 : 0) + (t < 3 ? Math.abs(Math.sin(t * 6)) * 0.35 * decay : 0);
    b.rotation.z = t < 3 ? Math.sin(t * 9) * 0.09 * decay : 0;
  });
  return (
    <group ref={group} position={position} scale={1.08}>
      {[-postX, postX].map((x) => (
        <Box key={x} size={[0.16, boardY + 0.2, 0.16]} position={[x, (boardY + 0.2) / 2, -0.12]} material={M.woodDark} />
      ))}
      <group ref={board} position={[0, boardY + (hovered ? 0.08 : 0), 0]} rotation={[-0.2, 0, 0]}>
        <RoundedBox args={[WIDTH + 0.3, height + 0.3, 0.18]} radius={0.06} smoothness={3} castShadow receiveShadow material={hovered ? M.wood : M.woodDark} />
        <mesh position={[0, 0, 0.092]} material={face} receiveShadow>
          <planeGeometry args={[WIDTH, height]} />
        </mesh>
      </group>
    </group>
  );
}
