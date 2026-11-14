import * as THREE from 'three';

/** Small deterministic PRNG (mulberry32). */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function canvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')!] as const;
}

export function toTexture(c: HTMLCanvasElement, rx = 1, ry = 1) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rx, ry);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** Shift a hex colour lighter (amt > 0) or darker (amt < 0). */
export function shade(hex: string, amt: number) {
  const c = new THREE.Color(hex);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  c.setHSL(hsl.h, hsl.s, Math.min(1, Math.max(0, hsl.l + amt)));
  return `#${c.getHexString()}`;
}

function speckle(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  base: string,
  count: number,
  amp: number,
  seed: number,
  maxSize = 3,
) {
  const r = rng(seed);
  for (let i = 0; i < count; i++) {
    ctx.globalAlpha = 0.25 + r() * 0.45;
    ctx.fillStyle = shade(base, (r() - 0.5) * 2 * amp);
    const s = 1 + r() * maxSize;
    ctx.fillRect(r() * w, r() * h, s, s);
  }
  ctx.globalAlpha = 1;
}

export function noiseTexture(base: string, amp: number, seed: number, size = 256, density = 1, grain = 3) {
  const [c, ctx] = canvas(size, size);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);
  speckle(ctx, size, size, base, Math.floor(size * size * 0.12 * density), amp, seed, grain);
  return toTexture(c);
}

export function stoneWallTexture(seed = 7) {
  const W = 512;
  const H = 256;
  const [c, ctx] = canvas(W, H);
  const r = rng(seed);
  ctx.fillStyle = '#8F806E';
  ctx.fillRect(0, 0, W, H);
  let y = 0;
  while (y < H) {
    const rowH = 30 + Math.floor(r() * 18);
    let x = -Math.floor(r() * 40);
    while (x < W) {
      const bw = 44 + Math.floor(r() * 56);
      const tone = shade('#B9A68F', (r() - 0.5) * 0.14);
      ctx.fillStyle = tone;
      const pad = 3;
      ctx.beginPath();
      ctx.roundRect(x + pad, y + pad, bw - pad * 2, rowH - pad * 2, 6);
      ctx.fill();
      // soft top highlight / bottom shade for volume
      ctx.fillStyle = 'rgba(255,248,236,0.18)';
      ctx.fillRect(x + pad + 2, y + pad + 1, bw - pad * 2 - 4, 4);
      ctx.fillStyle = 'rgba(60,45,30,0.16)';
      ctx.fillRect(x + pad + 2, y + rowH - pad - 5, bw - pad * 2 - 4, 4);
      x += bw;
    }
    y += rowH;
  }
  speckle(ctx, W, H, '#B9A68F', 9000, 0.1, seed + 1, 2);
  return toTexture(c);
}

export function woodTexture(seed = 3, base = '#A96D43', planks = 4) {
  const W = 256;
  const H = 256;
  const [c, ctx] = canvas(W, H);
  const r = rng(seed);
  const ph = H / planks;
  for (let i = 0; i < planks; i++) {
    ctx.fillStyle = shade(base, (r() - 0.5) * 0.08);
    ctx.fillRect(0, i * ph, W, ph);
    for (let g = 0; g < 14; g++) {
      ctx.strokeStyle = `rgba(70,40,20,${0.08 + r() * 0.12})`;
      ctx.lineWidth = 1 + r() * 1.5;
      ctx.beginPath();
      const gy = i * ph + r() * ph;
      ctx.moveTo(0, gy);
      for (let x = 0; x <= W; x += 32) ctx.lineTo(x, gy + Math.sin(x * 0.03 + g) * 2.5);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(55,32,18,0.45)';
    ctx.fillRect(0, i * ph, W, 2);
  }
  return toTexture(c);
}

export function roofTileTexture(seed = 11, base = '#8C4A2E') {
  const W = 256;
  const H = 256;
  const [c, ctx] = canvas(W, H);
  const r = rng(seed);
  ctx.fillStyle = shade(base, -0.12);
  ctx.fillRect(0, 0, W, H);
  const rowH = 21;
  for (let row = 0; row * rowH < H + rowH; row++) {
    const off = row % 2 ? 16 : 0;
    for (let x = -off; x < W; x += 32) {
      ctx.fillStyle = shade(base, (r() - 0.5) * 0.12);
      ctx.beginPath();
      ctx.roundRect(x + 1, row * rowH, 30, rowH - 3, [0, 0, 8, 8]);
      ctx.fill();
      ctx.fillStyle = 'rgba(40,20,10,0.25)';
      ctx.fillRect(x + 2, row * rowH + rowH - 6, 28, 3);
    }
  }
  return toTexture(c);
}

export function paverTexture(seed = 5) {
  const S = 256;
  const [c, ctx] = canvas(S, S);
  const r = rng(seed);
  ctx.fillStyle = '#A99881';
  ctx.fillRect(0, 0, S, S);
  for (let y = 0; y < S; y += 32) {
    for (let x = (y / 32) % 2 ? -20 : 0; x < S; x += 40) {
      ctx.fillStyle = shade('#CDBCA4', (r() - 0.5) * 0.1);
      ctx.beginPath();
      ctx.roundRect(x + 2, y + 2, 36, 28, 5);
      ctx.fill();
    }
  }
  speckle(ctx, S, S, '#CDBCA4', 4000, 0.08, seed + 3, 2);
  return toTexture(c);
}

/** Text panel for a wooden signboard. */
export function signTexture(lines: string[], aspect: number) {
  const W = 1024;
  const H = Math.round(W / aspect);
  const [c, ctx] = canvas(W, H);
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#F2E2C4';
    ctx.fillRect(0, 0, W, H);
    speckle(ctx, W, H, '#F2E2C4', 14000, 0.05, 21, 2);
    // subtle aged edge
    ctx.strokeStyle = 'rgba(120,80,40,0.22)';
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, W - 10, H - 10);
    ctx.fillStyle = '#292622';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const n = lines.length;
    let size = n > 1 ? H * 0.34 : H * 0.48;
    ctx.font = `800 ${size}px "Manrope Variable", "Manrope", system-ui, sans-serif`;
    const widest = Math.max(...lines.map((l) => ctx.measureText(l).width));
    if (widest > W * 0.86) size *= (W * 0.86) / widest;
    ctx.font = `800 ${size}px "Manrope Variable", "Manrope", system-ui, sans-serif`;
    const lh = size * 1.08;
    lines.forEach((l, i) => {
      ctx.fillText(l, W / 2, H / 2 + (i - (n - 1) / 2) * lh + size * 0.04);
    });
  };
  draw();
  const tex = toTexture(c);
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  // Redraw once the web font is ready so the sign uses Manrope.
  document.fonts?.load('800 64px "Manrope Variable"').then(() => {
    draw();
    tex.needsUpdate = true;
  });
  return tex;
}

export function laptopScreenTexture() {
  const [c, ctx] = canvas(256, 160);
  ctx.fillStyle = '#26231F';
  ctx.fillRect(0, 0, 256, 160);
  ctx.fillStyle = '#E9C38A';
  ctx.font = '700 72px ui-monospace, Menlo, Consolas, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('</>', 128, 84);
  const t = toTexture(c);
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

/** Generic certificate artwork: border, heading, rule lines and a seal. No claims. */
export function certificateTexture() {
  const W = 640;
  const H = 460;
  const [c, ctx] = canvas(W, H);
  ctx.fillStyle = '#F7F0E2';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#B08A55';
  ctx.lineWidth = 8;
  ctx.strokeRect(18, 18, W - 36, H - 36);
  ctx.lineWidth = 2;
  ctx.strokeRect(34, 34, W - 68, H - 68);
  ctx.fillStyle = '#4A3B2B';
  ctx.textAlign = 'center';
  ctx.font = '700 44px Georgia, serif';
  ctx.fillText('CERTIFICATE', W / 2, 110);
  ctx.fillStyle = 'rgba(80,65,50,0.35)';
  [170, 205, 240, 290, 320].forEach((y, i) => {
    const w = i === 2 ? 260 : 380;
    ctx.fillRect(W / 2 - w / 2, y, w, 6);
  });
  // seal + ribbon
  ctx.fillStyle = '#B5432C';
  ctx.beginPath();
  ctx.moveTo(470, 360);
  ctx.lineTo(450, 440);
  ctx.lineTo(478, 420);
  ctx.lineTo(500, 445);
  ctx.lineTo(505, 362);
  ctx.fill();
  ctx.fillStyle = '#C9A043';
  ctx.beginPath();
  ctx.arc(485, 355, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#B5432C';
  ctx.beginPath();
  ctx.arc(485, 355, 28, 0, Math.PI * 2);
  ctx.fill();
  const t = toTexture(c);
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

/** Radial soft shadow used as a contact shadow under the car. */
export function contactShadowTexture() {
  const S = 128;
  const [c, ctx] = canvas(S, S);
  const g = ctx.createRadialGradient(S / 2, S / 2, 4, S / 2, S / 2, S / 2);
  g.addColorStop(0, 'rgba(30,22,14,0.55)');
  g.addColorStop(0.6, 'rgba(30,22,14,0.25)');
  g.addColorStop(1, 'rgba(30,22,14,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
