import { M } from '../materials';
import { Box } from '../parts';

/** PROJECTS — a contemporary timber-and-glass project studio with a lit interior. */
export function Studio() {
  const W = 4.3;
  const D = 3.0;
  const H = 2.5;
  const frontZ = D / 2;
  return (
    <group>
      {/* plinth */}
      <Box size={[W + 0.4, 0.22, D + 0.4]} position={[0, 0.11, 0]} material={M.stoneDark} />
      {/* interior floor */}
      <Box size={[W - 0.2, 0.06, D - 0.2]} position={[0, 0.25, 0]} material={M.wood} />
      {/* back wall (lit) and timber cladding outside */}
      <Box size={[W, H, 0.2]} position={[0, 0.22 + H / 2, -D / 2 + 0.1]} material={M.woodDark} />
      <Box size={[W - 0.3, H - 0.3, 0.04]} position={[0, 0.22 + H / 2, -D / 2 + 0.22]} material={M.interior} shadow={false} />
      {/* solid timber right wall */}
      <Box size={[0.22, H, D]} position={[W / 2 - 0.11, 0.22 + H / 2, 0]} material={M.wood} />
      {/* desks + screens inside */}
      {[-1.2, 0.2].map((x) => (
        <group key={x} position={[x, 0.28, -0.4]}>
          <Box size={[1.1, 0.06, 0.6]} position={[0, 0.72, 0]} material={M.wood} />
          <Box size={[0.06, 0.72, 0.5]} position={[-0.5, 0.36, 0]} material={M.charcoal} />
          <Box size={[0.06, 0.72, 0.5]} position={[0.5, 0.36, 0]} material={M.charcoal} />
          <Box size={[0.55, 0.36, 0.04]} position={[0, 1.0, -0.15]} material={M.charcoal} />
          <Box size={[0.48, 0.3, 0.02]} position={[0, 1.0, -0.12]} material={M.windowLit} shadow={false} />
        </group>
      ))}
      <Box size={[0.9, 1.6, 0.35]} position={[1.3, 1.1, -1.1]} material={M.woodDark} />
      {/* glass front + left side */}
      <Box size={[W - 0.2, H - 0.05, 0.04]} position={[-0.11, 0.22 + H / 2, frontZ]} material={M.glass} shadow={false} />
      <Box size={[0.04, H - 0.05, D - 0.1]} position={[-W / 2 + 0.02, 0.22 + H / 2, 0]} material={M.glass} shadow={false} />
      {/* dark steel frame: mullions and transom */}
      {[-2.1, -1.4, -0.7, 0, 0.7, 1.4].map((x) => (
        <Box key={x} size={[0.07, H, 0.09]} position={[x, 0.22 + H / 2, frontZ + 0.02]} material={M.charcoal} />
      ))}
      {[-0.75, 0.75].map((z) => (
        <Box key={z} size={[0.09, H, 0.07]} position={[-W / 2 + 0.02, 0.22 + H / 2, z]} material={M.charcoal} />
      ))}
      <Box size={[W, 0.07, 0.1]} position={[0, 0.22 + H * 0.68, frontZ + 0.02]} material={M.charcoal} />
      <Box size={[W, 0.12, 0.12]} position={[0, 0.28, frontZ + 0.02]} material={M.charcoal} />
      {/* door */}
      <Box size={[0.66, 1.7, 0.05]} position={[-0.35, 0.22 + 0.85, frontZ + 0.05]} material={M.charcoal} />
      <Box size={[0.56, 1.6, 0.03]} position={[-0.35, 0.22 + 0.85, frontZ + 0.08]} material={M.windowLit} shadow={false} />
      {/* cantilevered mono-pitch roof */}
      <group position={[0, 0.22 + H + 0.1, 0.05]} rotation={[-0.08, 0, 0]}>
        <Box size={[W + 0.4, 0.12, D + 0.5]} position={[0, 0, 0]} material={M.stoneDark} />
        <Box size={[W + 0.44, 0.22, 0.1]} position={[0, -0.02, (D + 0.5) / 2]} material={M.wood} />
        <Box size={[0.1, 0.22, D + 0.5]} position={[-(W + 0.44) / 2, -0.02, 0]} material={M.wood} />
      </group>
      {/* entrance deck */}
      <Box size={[1.6, 0.1, 0.8]} position={[-0.35, 0.2, frontZ + 0.5]} material={M.wood} />
    </group>
  );
}
