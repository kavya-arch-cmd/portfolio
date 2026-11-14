import * as THREE from 'three';
import { addSway } from './life';
import {
  noiseTexture,
  paverTexture,
  roofTileTexture,
  stoneWallTexture,
  woodTexture,
} from './textures';

const std = (p: THREE.MeshStandardMaterialParameters) =>
  new THREE.MeshStandardMaterial({ roughness: 0.9, metalness: 0, ...p });

export const TEX = {
  ground: noiseTexture('#F4F1E8', 0.07, 1, 256, 1.2, 2),
  asphalt: noiseTexture('#3A3B3C', 0.08, 2, 256, 1.4, 2),
  grass: noiseTexture('#7E8752', 0.09, 3, 256, 1.6, 3),
  stoneWall: stoneWallTexture(7),
  stone: noiseTexture('#C2B09A', 0.06, 4, 256, 1, 3),
  plaster: noiseTexture('#E9DEC9', 0.035, 6, 256, 0.8, 2),
  wood: woodTexture(3, '#A96D43', 4),
  woodDark: woodTexture(9, '#7A4C2E', 6),
  roof: roofTileTexture(11, '#8C4A2E'),
  slate: roofTileTexture(13, '#55504A'),
  pavers: paverTexture(5),
};
TEX.ground.repeat.set(90, 90);
TEX.grass.repeat.set(3, 3);
TEX.stone.repeat.set(2, 2);
TEX.pavers.repeat.set(2, 2);

export const M = {
  ground: std({ map: TEX.ground, vertexColors: true }),
  shoulder: std({ color: '#E2CFB6' }),
  asphalt: std({ map: TEX.asphalt, roughness: 0.95 }),
  kerb: std({ color: '#C9B8A2', map: TEX.stone }),
  marking: std({ color: '#F4F0E9', roughness: 0.7 }),
  grass: std({ map: TEX.grass }),
  stoneWall: std({ map: TEX.stoneWall }),
  stone: std({ map: TEX.stone }),
  stoneLight: std({ color: '#F1E8DA', map: TEX.plaster }),
  stoneDark: std({ color: '#9E8D78' }),
  plaster: std({ map: TEX.plaster }),
  pavers: std({ map: TEX.pavers }),
  wood: std({ map: TEX.wood, roughness: 0.8 }),
  woodDark: std({ map: TEX.woodDark, roughness: 0.85 }),
  roof: std({ map: TEX.roof, roughness: 0.85 }),
  slate: std({ map: TEX.slate, roughness: 0.8 }),
  charcoal: std({ color: '#3A3631', roughness: 0.6, metalness: 0.2 }),
  metal: std({ color: '#5A5650', roughness: 0.45, metalness: 0.6 }),
  brass: std({ color: '#A88B5C', roughness: 0.4, metalness: 0.7 }),
  gold: new THREE.MeshPhysicalMaterial({
    color: '#E2B54E',
    roughness: 0.3,
    metalness: 0.75,
    envMapIntensity: 2.2,
    clearcoat: 0.3,
  }),
  windowLit: std({ color: '#F0C886', emissive: '#C9822E', emissiveIntensity: 0.55, roughness: 0.4 }),
  interior: std({ color: '#E7BF86', emissive: '#B8752C', emissiveIntensity: 0.35 }),
  glass: new THREE.MeshStandardMaterial({
    color: '#F3E1BE',
    roughness: 0.1,
    metalness: 0,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
  }),
  trunk: std({ color: '#6B4C34' }),
  leafDark: std({ color: '#5A6842' }),
  leaf: std({ color: '#6E7B4C' }),
  leafLight: std({ color: '#8E975D' }),
  autumnA: std({ color: '#B8662F' }),
  autumnB: std({ color: '#C98140' }),
  autumnC: std({ color: '#D79A4C' }),
  goldLeafA: std({ color: '#B8902F' }),
  goldLeafB: std({ color: '#CDA843' }),
  goldLeafC: std({ color: '#DDBD5A' }),
  conifer: std({ color: '#4E5C3B' }),
  coniferLight: std({ color: '#5F6D45' }),
  rock: std({ color: '#B5A58F', map: TEX.stone }),
  water: std({ color: '#93A79C', roughness: 0.15, metalness: 0.05 }),
  paper: std({ color: '#F7F0E7' }),
  white: std({ color: '#FFFFFF' }),
};

export const LEAF_SETS = {
  green: [M.leafDark, M.leaf, M.leafLight],
  light: [M.leaf, M.leafLight, M.leafLight],
  autumn: [M.autumnA, M.autumnB, M.autumnC],
  gold: [M.goldLeafA, M.goldLeafB, M.goldLeafC],
} as const;
export type LeafKind = keyof typeof LEAF_SETS;

// Canopies and conifers sway gently in the breeze (see life.tsx).
for (const m of [M.leafDark, M.leaf, M.leafLight, M.autumnA, M.autumnB, M.autumnC, M.goldLeafA, M.goldLeafB, M.goldLeafC]) addSway(m);
addSway(M.conifer, 0.035);
addSway(M.coniferLight, 0.035);
