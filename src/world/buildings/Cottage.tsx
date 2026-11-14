import { Smoke } from '../life';
import { M } from '../materials';
import { Box, Cyl, Gable } from '../parts';

function Window({ x, y, z, w = 0.5, h = 0.6 }: { x: number; y: number; z: number; w?: number; h?: number }) {
  return (
    <group position={[x, y, z]}>
      <Box size={[w + 0.12, h + 0.12, 0.08]} position={[0, 0, 0]} material={M.woodDark} />
      <Box size={[w, h, 0.06]} position={[0, 0, 0.03]} material={M.windowLit} shadow={false} />
      <Box size={[0.04, h, 0.08]} position={[0, 0, 0.05]} material={M.woodDark} shadow={false} />
      <Box size={[w, 0.04, 0.08]} position={[0, 0, 0.05]} material={M.woodDark} shadow={false} />
      <Box size={[w + 0.2, 0.06, 0.18]} position={[0, -h / 2 - 0.08, 0.06]} material={M.stone} />
    </group>
  );
}

/** ABOUT ME — a welcoming stone cottage with a tiled gable roof, porch and chimney. */
export function Cottage() {
  const W = 3.4;
  const D = 2.4;
  const H = 1.9;
  return (
    <group>
      {/* base course */}
      <Box size={[W + 0.15, 0.2, D + 0.15]} position={[0, 0.1, 0]} material={M.stoneDark} />
      {/* walls */}
      <Box size={[W, H, D]} position={[0, H / 2 + 0.1, 0]} material={M.stoneWall} />
      {/* timber band under eaves */}
      <Box size={[W + 0.04, 0.14, D + 0.04]} position={[0, H + 0.05, 0]} material={M.woodDark} />
      {/* main roof */}
      <Gable length={W + 0.5} span={D + 0.7} h={1.35} position={[0, H + 0.1, 0]} material={M.roof} />
      <Box size={[W + 0.55, 0.1, 0.16]} position={[0, H + 1.43, 0]} material={M.woodDark} />
      {/* gable infill on the sides */}
      {/* chimney */}
      <Box size={[0.5, 1.5, 0.5]} position={[-0.95, H + 1.0, -0.45]} material={M.stoneWall} />
      <Box size={[0.6, 0.1, 0.6]} position={[-0.95, H + 1.78, -0.45]} material={M.stoneDark} />
      <Smoke position={[-0.95, H + 1.9, -0.45]} />

      {/* front porch gable (ridge toward viewer) */}
      <group position={[0.6, 0, D / 2]}>
        <Box size={[1.5, 1.55, 0.7]} position={[0, 0.875, 0.2]} material={M.stoneWall} />
        <Gable length={1.25} span={1.9} h={0.8} position={[0, 1.6, 0.25]} rotation={[0, Math.PI / 2, 0]} material={M.roof} />
        {/* door */}
        <Box size={[0.72, 1.12, 0.06]} position={[0, 0.66, 0.57]} material={M.woodDark} />
        <Box size={[0.58, 1.0, 0.05]} position={[0, 0.66, 0.6]} material={M.wood} />
        <Box size={[0.36, 0.3, 0.04]} position={[0, 0.92, 0.63]} material={M.windowLit} shadow={false} />
        <Cyl r={0.035} h={0.04} seg={8} position={[0.2, 0.62, 0.64]} rotation={[Math.PI / 2, 0, 0]} material={M.brass} />
      </group>

      {/* windows */}
      <Window x={-1.05} y={1.15} z={D / 2 + 0.02} w={0.6} h={0.62} />
      <Window x={1.48} y={1.25} z={D / 2 + 0.02} w={0.32} h={0.5} />
      <group rotation={[0, Math.PI / 2, 0]} position={[W / 2 + 0.02, 0, 0]}>
        <Window x={0.3} y={1.15} z={0} w={0.55} h={0.6} />
      </group>
      {/* window flower box */}
      <Box size={[0.8, 0.16, 0.2]} position={[-1.05, 0.72, D / 2 + 0.14]} material={M.wood} />
      {[-0.3, -0.1, 0.1, 0.3].map((dx, i) => (
        <mesh key={dx} position={[-1.05 + dx, 0.85, D / 2 + 0.15]} material={i % 2 ? M.autumnB : M.leafLight} castShadow>
          <icosahedronGeometry args={[0.09, 0]} />
        </mesh>
      ))}

      {/* garden path from porch */}
      <Box size={[0.9, 0.04, 1.2]} position={[0.6, 0.02, D / 2 + 1.1]} material={M.pavers} shadow={false} />
    </group>
  );
}
