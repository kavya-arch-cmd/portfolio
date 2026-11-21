/**
 * Ambient soundtrack for the miniature world, synthesised live with the Web Audio API
 * (no audio files to download or license):
 * - a low, slowly swelling rumble of distant town traffic;
 * - a light breeze;
 * - now and then a car passing by from one side to the other;
 * - occasional birdsong;
 * - a soft engine hum while the red SUV is driving.
 *
 * Nothing plays until the visitor turns sound on (browsers also require a click first).
 */

type Ctx = AudioContext;

interface Engine {
  ctx: Ctx;
  master: GainNode;
  engine: GainNode;
  engineOsc: OscillatorNode[];
  pink: AudioBuffer;
  timers: number[];
  running: boolean;
}

let eng: Engine | null = null;
let suspendTimer: number | undefined;

const LEVEL = 0.55;

function noise(ctx: Ctx, seconds: number, kind: 'brown' | 'pink') {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    let last = 0;
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      if (kind === 'brown') {
        last = (last + 0.02 * w) / 1.02;
        d[i] = last * 3.5;
      } else {
        // Paul Kellet's pink-noise filter
        b0 = 0.99886 * b0 + w * 0.0555179;
        b1 = 0.99332 * b1 + w * 0.0750759;
        b2 = 0.969 * b2 + w * 0.153852;
        b3 = 0.8665 * b3 + w * 0.3104856;
        b4 = 0.55 * b4 + w * 0.5329522;
        b5 = -0.7616 * b5 - w * 0.016898;
        d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
        b6 = w * 0.115926;
      }
    }
    // Cross-fade the ends so the loop has no click.
    const fade = Math.floor(ctx.sampleRate * 0.25);
    for (let i = 0; i < fade; i++) {
      const k = i / fade;
      d[i] = d[i] * k + d[len - fade + i] * (1 - k);
    }
  }
  return buf;
}

function panner(ctx: Ctx, value: number) {
  const p = ctx.createStereoPanner();
  p.pan.value = value;
  return p;
}

function build(): Engine {
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AC();
  const master = ctx.createGain();
  master.gain.value = 0;
  const limiter = ctx.createDynamicsCompressor();
  master.connect(limiter).connect(ctx.destination);

  // Distant traffic: brown noise, low-passed, swelling slowly.
  const rumbleSrc = ctx.createBufferSource();
  rumbleSrc.buffer = noise(ctx, 6, 'brown');
  rumbleSrc.loop = true;
  const rumbleLp = ctx.createBiquadFilter();
  rumbleLp.type = 'lowpass';
  rumbleLp.frequency.value = 420;
  const rumble = ctx.createGain();
  rumble.gain.value = 0.42;
  rumbleSrc.connect(rumbleLp).connect(rumble).connect(master);
  const swell = ctx.createOscillator();
  swell.frequency.value = 0.06;
  const swellDepth = ctx.createGain();
  swellDepth.gain.value = 0.16;
  swell.connect(swellDepth).connect(rumble.gain);

  // Breeze: pink noise through a wandering band-pass.
  const pink = noise(ctx, 5, 'pink');
  const airSrc = ctx.createBufferSource();
  airSrc.buffer = pink;
  airSrc.loop = true;
  const airBp = ctx.createBiquadFilter();
  airBp.type = 'bandpass';
  airBp.frequency.value = 1100;
  airBp.Q.value = 0.5;
  const air = ctx.createGain();
  air.gain.value = 0.05;
  airSrc.connect(airBp).connect(air).connect(master);
  const gust = ctx.createOscillator();
  gust.frequency.value = 0.09;
  const gustDepth = ctx.createGain();
  gustDepth.gain.value = 450;
  gust.connect(gustDepth).connect(airBp.frequency);

  // Engine hum (silent until the car drives).
  const engine = ctx.createGain();
  engine.gain.value = 0;
  const engineLp = ctx.createBiquadFilter();
  engineLp.type = 'lowpass';
  engineLp.frequency.value = 240;
  engineLp.connect(engine).connect(master);
  const low = ctx.createOscillator();
  low.type = 'sawtooth';
  low.frequency.value = 46;
  const high = ctx.createOscillator();
  high.type = 'triangle';
  high.frequency.value = 92;
  const highGain = ctx.createGain();
  highGain.gain.value = 0.5;
  low.connect(engineLp);
  high.connect(highGain).connect(engineLp);

  for (const n of [rumbleSrc, airSrc, swell, gust, low, high]) n.start();
  return { ctx, master, engine, engineOsc: [low, high], pink, timers: [], running: false };
}

/** A car passing somewhere off-screen, left to right or right to left. */
function passingCar(e: Engine) {
  const { ctx } = e;
  const t = ctx.currentTime + 0.05;
  const dur = 3 + Math.random() * 2.5;
  const peak = 0.05 + Math.random() * 0.06;
  const dir = Math.random() < 0.5 ? -1 : 1;
  const src = ctx.createBufferSource();
  src.buffer = e.pink;
  src.loop = true;
  const f = ctx.createBiquadFilter();
  f.type = 'bandpass';
  f.Q.value = 1.1;
  f.frequency.setValueAtTime(240, t);
  f.frequency.linearRampToValueAtTime(650 + Math.random() * 250, t + dur * 0.5);
  f.frequency.linearRampToValueAtTime(200, t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + dur * 0.5);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  const p = panner(ctx, -0.8 * dir);
  p.pan.linearRampToValueAtTime(0.8 * dir, t + dur);
  src.connect(f).connect(g).connect(p).connect(e.master);
  src.start(t, Math.random() * 3);
  src.stop(t + dur + 0.1);
}

/** A short phrase of two to four chirps from a bird somewhere nearby. */
function birdsong(e: Engine) {
  const { ctx } = e;
  const t = ctx.currentTime + 0.05;
  const notes = 2 + Math.floor(Math.random() * 3);
  const base = 2500 + Math.random() * 1500;
  const p = panner(ctx, Math.random() * 1.4 - 0.7);
  p.connect(e.master);
  for (let i = 0; i < notes; i++) {
    const t0 = t + i * (0.12 + Math.random() * 0.06);
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(base, t0);
    o.frequency.exponentialRampToValueAtTime(base * (1.25 + Math.random() * 0.2), t0 + 0.05);
    o.frequency.exponentialRampToValueAtTime(base * 0.92, t0 + 0.1);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.022, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.11);
    o.connect(g).connect(p);
    o.start(t0);
    o.stop(t0 + 0.13);
  }
}

function loop(e: Engine, fn: (e: Engine) => void, min: number, max: number) {
  const tick = () => {
    if (!e.running) return;
    if (e.ctx.state === 'running') fn(e);
    e.timers.push(window.setTimeout(tick, (min + Math.random() * (max - min)) * 1000));
  };
  e.timers.push(window.setTimeout(tick, (min / 2 + Math.random() * min) * 1000));
}

export const ambience = {
  /** Must be called from a click/tap handler the first time (browser autoplay rules). */
  start() {
    try {
      eng ??= build();
    } catch {
      return; // Web Audio unavailable: stay silent.
    }
    const e = eng;
    window.clearTimeout(suspendTimer);
    void e.ctx.resume();
    const now = e.ctx.currentTime;
    e.master.gain.cancelScheduledValues(now);
    e.master.gain.setValueAtTime(e.master.gain.value, now);
    e.master.gain.linearRampToValueAtTime(LEVEL, now + 1.5);
    if (!e.running) {
      e.running = true;
      loop(e, passingCar, 5, 12);
      loop(e, birdsong, 6, 15);
    }
  },

  stop() {
    const e = eng;
    if (!e) return;
    e.running = false;
    e.timers.forEach((t) => window.clearTimeout(t));
    e.timers = [];
    const now = e.ctx.currentTime;
    e.master.gain.cancelScheduledValues(now);
    e.master.gain.setValueAtTime(e.master.gain.value, now);
    e.master.gain.linearRampToValueAtTime(0, now + 0.5);
    window.clearTimeout(suspendTimer);
    suspendTimer = window.setTimeout(() => void e.ctx.suspend(), 650);
  },

  /** Pause/resume the audio device without changing the visitor's choice (tab hidden/visible). */
  setHidden(hidden: boolean) {
    const e = eng;
    if (!e || !e.running) return;
    void (hidden ? e.ctx.suspend() : e.ctx.resume());
  },

  /** Fade the engine hum in while the car drives. */
  setDriving(on: boolean) {
    const e = eng;
    if (!e) return;
    const now = e.ctx.currentTime;
    e.engine.gain.cancelScheduledValues(now);
    e.engine.gain.setValueAtTime(e.engine.gain.value, now);
    e.engine.gain.linearRampToValueAtTime(on ? 0.16 : 0, now + (on ? 0.8 : 1.2));
    const [low, high] = e.engineOsc;
    low.frequency.setTargetAtTime(on ? 58 : 46, now, 0.6);
    high.frequency.setTargetAtTime(on ? 116 : 92, now, 0.6);
  },
};
