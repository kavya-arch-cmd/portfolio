/**
 * Checks, before three.js is downloaded, whether this browser can draw the 3D world.
 * - 'none': WebGL is off or unsupported (hardware acceleration disabled, very old browser, locked-down device).
 * - 'slow': WebGL works but only through a software renderer, so motion will stutter.
 * - 'ok':   a real GPU is available.
 */
export type WebGLSupport = 'ok' | 'slow' | 'none';

const SOFTWARE = /swiftshader|llvmpipe|softpipe|software|basic render|microsoft basic/i;

function release(gl: WebGLRenderingContext | WebGL2RenderingContext | null) {
  gl?.getExtension('WEBGL_lose_context')?.loseContext();
}

export function detectWebGL(): WebGLSupport {
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2') ?? canvas.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return 'none';
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
    release(gl);

    // A context that refuses to start when the browser would fall back to software rendering.
    const strictCanvas = document.createElement('canvas');
    const opts = { failIfMajorPerformanceCaveat: true };
    const strict = (strictCanvas.getContext('webgl2', opts) ?? strictCanvas.getContext('webgl', opts)) as WebGLRenderingContext | null;
    release(strict);

    if (!strict || SOFTWARE.test(renderer)) return 'slow';
    return 'ok';
  } catch {
    return 'none';
  }
}
