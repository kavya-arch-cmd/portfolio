import type { ThreeEvent } from '@react-three/fiber';
import { useState, type ReactNode } from 'react';
import { DESTINATIONS, type DestinationId } from '../content/destinations';
import { Academy } from './buildings/Academy';
import { CertificateStand } from './buildings/CertificateStand';
import { Cottage } from './buildings/Cottage';
import { Studio } from './buildings/Studio';
import { Workshop } from './buildings/Workshop';
import { PLACEMENTS, STOP_U, platformShift } from './layout';
import { KERB_WIDTH, ROAD_WIDTH, roadFrame } from './roadPath';
import { BUILDING_SCALE } from './scale';
import { M } from './materials';
import { Bench, Box, LampPost, Platform } from './parts';
import { Signboard } from './Signboard';

const BUILDINGS: Record<DestinationId, ReactNode> = {
  about: <Cottage />,
  projects: <Studio />,
  skills: <Workshop />,
  experience: <Academy />,
  certificates: <CertificateStand />,
};

/** Per-destination supporting details (paths, lamps, benches). Positions are world-space. */
function Extras({ id }: { id: DestinationId }) {
  switch (id) {
    case 'about':
      return (
        <>
          <LampPost x={-7.0} z={-8.4} y={0.8} />
          <Bench x={-7.8} z={-9.2} y={0.8} rot={-0.3} />
          {/* stone steps down to the road */}
          {[0, 1, 2].map((i) => (
            <Box key={i} size={[1.2, 0.27 * (3 - i), 0.34]} position={[-13.0, (0.27 * (3 - i)) / 2, -6.2 + i * 0.34]} material={M.stone} />
          ))}
        </>
      );
    case 'experience':
      return (
        <>
          <LampPost x={1.7} z={1.0} y={0.6} />
          <LampPost x={8.8} z={1.6} y={0.6} />
          {/* paved forecourt to the road */}
          <Box size={[2.2, 0.04, 1.6]} position={[5.8, 0.02, 3.2]} material={M.pavers} shadow={false} />
          {[0, 1].map((i) => (
            <Box key={i} size={[2.2, 0.3 * (2 - i), 0.34]} position={[5.8, (0.3 * (2 - i)) / 2, 2.25 + i * 0.34]} material={M.stoneLight} />
          ))}
        </>
      );
    case 'projects':
      return (
        <>
          {[0, 1, 2].map((i) => (
            <Box key={i} size={[1.3, 0.33 * (3 - i), 0.3]} position={[1.4, (0.33 * (3 - i)) / 2, -6.85 + i * 0.3]} material={M.stone} />
          ))}
        </>
      );
    default:
      return null;
  }
}

/** Authored start of a footpath (end of the steps); the path runs to the car's stop on the road. */
const PATH_FROM: Partial<Record<DestinationId, [number, number]>> = {
  about: [-13.0, -5.3],
  projects: [1.4, -5.85],
  experience: [5.8, 4.0],
};

function FootPath({ id }: { id: DestinationId }) {
  const from = PATH_FROM[id];
  if (!from) return null;
  const [dx, dz] = platformShift(id);
  const sx = from[0] + dx;
  const sz = from[1] + dz;
  const end = roadFrame(STOP_U[id]).position;
  const vx = end.x - sx;
  const vz = end.z - sz;
  const full = Math.hypot(vx, vz);
  const len = full - (ROAD_WIDTH / 2 + KERB_WIDTH);
  if (len <= 0.2) return null;
  const ux = vx / full;
  const uz = vz / full;
  return (
    <Box
      size={[1.5, 0.03, len]}
      position={[sx + (ux * len) / 2, 0.015, sz + (uz * len) / 2]}
      rotation={[0, Math.atan2(ux, uz), 0]}
      material={M.pavers}
      shadow={false}
    />
  );
}

export function Destinations({
  onSelect,
  disabled,
  arrival,
}: {
  onSelect: (id: DestinationId) => void;
  disabled: boolean;
  /** Set on every arrival; the destination's sign gives a little celebratory bounce. */
  arrival: { id: DestinationId; nonce: number } | null;
}) {
  const [hovered, setHovered] = useState<DestinationId | null>(null);

  const handlers = (id: DestinationId) => ({
    onClick: (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      if (e.delta > 6) return; // was a pan drag, not a click
      onSelect(id);
    },
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHovered(id);
      document.body.style.cursor = disabled ? 'progress' : 'pointer';
    },
    onPointerOut: () => {
      setHovered((h) => (h === id ? null : h));
      document.body.style.cursor = '';
    },
  });

  return (
    <group>
      {DESTINATIONS.map((d) => {
        const p = PLACEMENTS[d.id];
        const { platform: pl, building: b, sign: s } = p;
        return (
          <group key={d.id} {...handlers(d.id)}>
            <Platform {...pl} />
            <group position={[pl.x + b.x, pl.h, pl.z + b.z]} rotation={[0, b.rot ?? 0, 0]} scale={BUILDING_SCALE}>
              {BUILDINGS[d.id]}
            </group>
            <Signboard lines={d.sign} position={[s.x, s.y, s.z]} hovered={hovered === d.id && !disabled} celebrate={arrival?.id === d.id ? arrival.nonce : 0} />
            <FootPath id={d.id} />
            <group position={[platformShift(d.id)[0], 0, platformShift(d.id)[1]]}>
              <Extras id={d.id} />
            </group>
          </group>
        );
      })}
    </group>
  );
}
