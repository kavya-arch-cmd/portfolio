import { M } from '../materials';
import { Box, Cyl, Gable } from '../parts';

/** EXPERIENCE & EDUCATION — a small classical stone building with portico and clock. */
export function Academy() {
  const W = 4.0;
  const D = 2.4;
  const H = 2.0;
  const base = 0.36;
  const front = D / 2;
  return (
    <group>
      {/* stepped podium */}
      {[0, 1, 2].map((i) => (
        <Box key={i} size={[W + 0.9 - i * 0.2, 0.12, D + 1.6 - i * 0.25]} position={[0, 0.06 + i * 0.12, 0.35 - i * 0.05]} material={M.stoneLight} />
      ))}
      {/* body */}
      <Box size={[W, H, D]} position={[0, base + H / 2, 0]} material={M.stoneLight} />
      <Box size={[W + 0.2, 0.26, D + 0.2]} position={[0, base + H + 0.13, 0]} material={M.stoneLight} />
      <Box size={[W + 0.3, 0.08, D + 0.3]} position={[0, base + H + 0.3, 0]} material={M.stone} />
      {/* main roof */}
      <Gable length={W + 0.2} span={D + 0.3} h={0.65} position={[0, base + H + 0.34, 0]} material={M.stone} />
      {/* portico */}
      <group position={[0, 0, front + 0.55]}>
        {[-1.35, -0.45, 0.45, 1.35].map((x) => (
          <group key={x} position={[x, base, 0]}>
            <Box size={[0.36, 0.12, 0.36]} position={[0, 0.06, 0]} material={M.stoneLight} />
            <Cyl r={0.14} rTop={0.12} h={1.62} seg={14} position={[0, 0.93, 0]} material={M.stoneLight} />
            <Box size={[0.36, 0.14, 0.36]} position={[0, 1.81, 0]} material={M.stoneLight} />
          </group>
        ))}
        <Box size={[3.3, 0.3, 0.8]} position={[0, base + 2.03, -0.15]} material={M.stoneLight} />
        <Box size={[3.4, 0.07, 0.86]} position={[0, base + 2.21, -0.15]} material={M.stone} />
        {/* pediment (ridge toward viewer) */}
        <Gable length={1.0} span={3.4} h={0.72} position={[0, base + 2.24, -0.25]} rotation={[0, Math.PI / 2, 0]} material={M.stoneLight} />
        {/* clock */}
        <group position={[0, base + 2.5, 0.27]} rotation={[0.2, 0, 0]}>
          <Cyl r={0.26} h={0.06} seg={28} rotation={[Math.PI / 2, 0, 0]} material={M.charcoal} />
          <Cyl r={0.21} h={0.07} seg={28} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.005]} material={M.paper} shadow={false} />
          <Box size={[0.025, 0.15, 0.02]} position={[0, 0.06, 0.05]} material={M.charcoal} shadow={false} />
          <Box size={[0.11, 0.025, 0.02]} position={[0.045, 0, 0.05]} material={M.charcoal} shadow={false} />
        </group>
      </group>
      {/* arched door */}
      <group position={[0, base, front + 0.02]}>
        <Box size={[0.8, 1.15, 0.06]} position={[0, 0.58, 0]} material={M.woodDark} />
        <Box size={[0.66, 1.05, 0.05]} position={[0, 0.56, 0.02]} material={M.windowLit} shadow={false} />
        <Cyl r={0.4} h={0.06} seg={20} position={[0, 1.15, 0]} rotation={[Math.PI / 2, 0, 0]} material={M.woodDark} />
        <Cyl r={0.33} h={0.07} seg={20} position={[0, 1.15, 0.01]} rotation={[Math.PI / 2, 0, 0]} material={M.windowLit} shadow={false} />
      </group>
      {/* windows */}
      {[-1.45, -0.85, 0.85, 1.45].map((x) => (
        <group key={x} position={[x, base + 0.95, front + 0.02]}>
          <Box size={[0.42, 0.78, 0.05]} material={M.stone} />
          <Box size={[0.32, 0.66, 0.05]} position={[0, 0, 0.02]} material={M.windowLit} shadow={false} />
          <Box size={[0.32, 0.03, 0.06]} position={[0, 0.05, 0.04]} material={M.woodDark} shadow={false} />
        </group>
      ))}
      <group position={[W / 2 + 0.02, base + 0.95, 0]} rotation={[0, Math.PI / 2, 0]}>
        {[-0.5, 0.5].map((x) => (
          <group key={x} position={[x, 0, 0]}>
            <Box size={[0.42, 0.78, 0.05]} material={M.stone} />
            <Box size={[0.32, 0.66, 0.05]} position={[0, 0, 0.02]} material={M.windowLit} shadow={false} />
          </group>
        ))}
      </group>
    </group>
  );
}
