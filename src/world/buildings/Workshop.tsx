import { useMemo } from 'react';
import * as THREE from 'three';
import { gearGeometry } from '../geometry';
import { M } from '../materials';
import { Box, Gable } from '../parts';
import { laptopScreenTexture } from '../textures';

/** SKILLS & TECHNOLOGIES — an open timber workshop with workbench, laptop and gear. */
export function Workshop() {
  const W = 3.4;
  const D = 2.6;
  const H = 2.1;
  const gear = useMemo(() => gearGeometry(11, 0.62, 0.5, 0.18, 0.14), []);
  const screen = useMemo(() => new THREE.MeshStandardMaterial({
    map: laptopScreenTexture(),
    emissive: '#ffffff',
    emissiveMap: laptopScreenTexture(),
    emissiveIntensity: 0.6,
    roughness: 0.4,
  }), []);
  return (
    <group>
      {/* timber deck */}
      <Box size={[W + 0.3, 0.16, D + 0.3]} position={[0, 0.08, 0]} material={M.woodDark} />
      {/* back + side walls */}
      <Box size={[W, H, 0.14]} position={[0, 0.16 + H / 2, -D / 2 + 0.07]} material={M.wood} />
      <Box size={[0.14, H, D]} position={[-W / 2 + 0.07, 0.16 + H / 2, 0]} material={M.wood} />
      <Box size={[0.14, H, D]} position={[W / 2 - 0.07, 0.16 + H / 2, 0]} material={M.wood} />
      {/* warm interior lining */}
      <Box size={[W - 0.3, H - 0.3, 0.03]} position={[0, 0.16 + H / 2, -D / 2 + 0.16]} material={M.interior} shadow={false} />
      {/* front posts */}
      {[-W / 2 + 0.07, W / 2 - 0.07].map((x) => (
        <Box key={x} size={[0.18, H, 0.18]} position={[x, 0.16 + H / 2, D / 2 - 0.09]} material={M.woodDark} />
      ))}
      <Box size={[W, 0.2, 0.2]} position={[0, 0.16 + H - 0.1, D / 2 - 0.09]} material={M.woodDark} />
      {/* gable roof (ridge left-right) */}
      <Gable length={W + 0.5} span={D + 0.8} h={1.0} position={[0, 0.16 + H, 0]} material={M.slate} />
      <Box size={[W + 0.55, 0.1, 0.14]} position={[0, 0.16 + H + 1.02, 0]} material={M.charcoal} />
      {/* workbench */}
      <group position={[-0.35, 0.16, -0.45]}>
        <Box size={[2.0, 0.1, 0.8]} position={[0, 0.8, 0]} material={M.wood} />
        {[-0.9, 0.9].map((x) => (
          <Box key={x} size={[0.1, 0.8, 0.7]} position={[x, 0.4, 0]} material={M.woodDark} />
        ))}
        {/* laptop */}
        <Box size={[0.8, 0.04, 0.55]} position={[0.1, 0.87, 0.08]} material={M.charcoal} />
        <group position={[0.1, 0.89, -0.18]} rotation={[-0.25, 0, 0]}>
          <Box size={[0.8, 0.52, 0.04]} position={[0, 0.26, 0]} material={M.charcoal} />
          <mesh position={[0, 0.26, 0.022]} material={screen}>
            <planeGeometry args={[0.72, 0.45]} />
          </mesh>
        </group>
        <Box size={[0.25, 0.18, 0.2]} position={[-0.65, 0.94, 0]} material={M.metal} />
      </group>
      {/* gear standing at the open side */}
      <mesh geometry={gear} material={M.metal} position={[1.05, 0.16 + 0.95, 0.35]} rotation={[0, -0.5, 0.2]} castShadow receiveShadow />
      <mesh geometry={gear} material={M.brass} position={[1.25, 0.16 + 0.45, 0.65]} scale={0.6} rotation={[0, -0.5, 0.5]} castShadow receiveShadow />
      {/* tool rail on back wall */}
      <Box size={[1.6, 0.06, 0.06]} position={[-0.3, 1.85, -D / 2 + 0.2]} material={M.charcoal} />
      {[-0.9, -0.55, -0.2, 0.15, 0.4].map((x, i) => (
        <Box key={x} size={[0.06, 0.38 + (i % 2) * 0.12, 0.05]} position={[x, 1.62, -D / 2 + 0.24]} material={i % 2 ? M.metal : M.woodDark} />
      ))}
      {/* small wall lamp */}
      <Box size={[0.16, 0.22, 0.12]} position={[-W / 2 + 0.25, 1.75, -D / 2 + 0.25]} material={M.windowLit} />
    </group>
  );
}
