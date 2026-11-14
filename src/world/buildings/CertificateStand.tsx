import { useMemo } from 'react';
import * as THREE from 'three';
import { M } from '../materials';
import { Box } from '../parts';
import { certificateTexture } from '../textures';

/** CERTIFICATES — a framed certificate displayed on a timber easel. */
export function CertificateStand() {
  const paper = useMemo(
    () => new THREE.MeshStandardMaterial({ map: certificateTexture(), roughness: 0.8 }),
    [],
  );
  const W = 2.5;
  const H = 1.8;
  return (
    <group>
      {/* low stone base */}
      <Box size={[W + 0.6, 0.18, 1.0]} position={[0, 0.09, 0]} material={M.stone} />
      <group position={[0, 0.18, 0]} rotation={[-0.16, 0, 0]}>
        {/* legs */}
        {[-W / 2 + 0.15, W / 2 - 0.15].map((x) => (
          <Box key={x} size={[0.14, H + 0.9, 0.14]} position={[x, (H + 0.9) / 2, -0.05]} material={M.woodDark} />
        ))}
        {/* frame */}
        <Box size={[W + 0.24, H + 0.24, 0.12]} position={[0, 0.55 + H / 2, 0.06]} material={M.wood} />
        <Box size={[W - 0.02, H - 0.02, 0.04]} position={[0, 0.55 + H / 2, 0.12]} material={M.woodDark} />
        <mesh position={[0, 0.55 + H / 2, 0.145]} material={paper}>
          <planeGeometry args={[W - 0.2, H - 0.2]} />
        </mesh>
        {/* ledge */}
        <Box size={[W + 0.1, 0.08, 0.3]} position={[0, 0.5, 0.15]} material={M.woodDark} />
      </group>
      {/* rear support leg */}
      <Box size={[0.12, 2.3, 0.12]} position={[0, 1.2, -0.65]} rotation={[0.38, 0, 0]} material={M.woodDark} />
    </group>
  );
}
