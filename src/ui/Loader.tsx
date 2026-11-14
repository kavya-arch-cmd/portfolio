import { Component, type ReactNode } from 'react';

/**
 * Shown over the stage while the 3D world downloads and draws its first frame.
 * A small car drives along a road line (static under reduced motion).
 */
export function Loader({ done }: { done: boolean }) {
  return (
    <div className={`loader${done ? ' loader--done' : ''}`} aria-hidden={done}>
      <div className="loader__inner" role="status">
        <p className="loader__kicker">KAVYA · Portfolio</p>
        <p className="loader__title">Building the little world…</p>
        <div className="loader__road" aria-hidden="true">
          <span className="loader__car" />
        </div>
        <p className="loader__hint">You can already use the Destinations menu above.</p>
      </div>
    </div>
  );
}

/** If WebGL is unavailable or the scene fails, keep the site usable through the menu. */
export class SceneBoundary extends Component<{ children: ReactNode; onFail: () => void }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error('3D world failed to load', error);
    this.props.onFail();
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="scene-fallback">
        <div className="loader__inner">
          <p className="loader__kicker">KAVYA · Portfolio</p>
          <p className="loader__title">The 3D world couldn’t load on this device.</p>
          <p className="loader__hint">Every section is still here — open the Destinations menu above.</p>
        </div>
      </div>
    );
  }
}
