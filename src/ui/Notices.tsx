import { useEffect, useState } from 'react';
import { DESTINATIONS, type DestinationId } from '../content/destinations';
import { WEBGL_LOST_EVENT } from '../world/events';

const DISMISSED = 'kavya:notice-dismissed:';

function wasDismissed(id: string) {
  try {
    return sessionStorage.getItem(DISMISSED + id) === '1';
  } catch {
    return false;
  }
}

function Notice({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  const [hidden, setHidden] = useState(() => wasDismissed(id));
  if (hidden) return null;
  return (
    <div className="notice" role="status">
      <div className="notice__text">
        <strong>{title}</strong> {children}
      </div>
      <button
        type="button"
        className="notice__close"
        aria-label="Dismiss this message"
        onClick={() => {
          setHidden(true);
          try {
            sessionStorage.setItem(DISMISSED + id, '1');
          } catch {
            /* ignore */
          }
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path d="m2 2 8 8m0-8-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

/**
 * Small messages over the world when the browser limits it:
 * - 3D graphics only run in software (slow, choppy motion);
 * - the device asks for reduced motion (the car jumps straight to each stop);
 * - the graphics context was lost while browsing.
 */
export function Notices({ slow, reducedMotion }: { slow: boolean; reducedMotion: boolean }) {
  const [lost, setLost] = useState(false);
  useEffect(() => {
    const on = () => setLost(true);
    window.addEventListener(WEBGL_LOST_EVENT, on);
    return () => window.removeEventListener(WEBGL_LOST_EVENT, on);
  }, []);

  return (
    <div className="notices">
      {lost && (
        <div className="notice" role="alert">
          <div className="notice__text">
            <strong>The 3D view stopped.</strong> Your browser reset its graphics.{' '}
            <button type="button" className="notice__link" onClick={() => window.location.reload()}>
              Reload the page
            </button>{' '}
            or keep using the Destinations menu.
          </div>
        </div>
      )}
      {slow && !lost && (
        <Notice id="slow" title="3D may feel slow here.">
          Your browser is drawing the world without graphics acceleration. Turning on “hardware acceleration” in your
          browser settings makes the motion smooth.
        </Notice>
      )}
      {reducedMotion && (
        <Notice id="reduced" title="Motion is reduced.">
          Your device asks for less animation, so the world stays still and the car goes straight to each stop.
        </Notice>
      )}
    </div>
  );
}

/** Shown in place of the world when the browser cannot draw 3D at all. */
export function NoWebGL({ onSelect }: { onSelect: (id: DestinationId) => void }) {
  return (
    <div className="scene-fallback" role="alert">
      <div className="loader__inner fallback">
        <p className="loader__kicker">KAVYA · Portfolio</p>
        <p className="loader__title">Your browser isn’t showing 3D graphics.</p>
        <p className="loader__hint">
          The miniature world needs WebGL, which is turned off or not supported here. To see it, turn on “hardware
          acceleration” in your browser settings, or open this site in an up-to-date Chrome, Edge, Firefox or Safari.
        </p>
        <p className="fallback__lead">Every section is still here:</p>
        <ul className="fallback__list">
          {DESTINATIONS.map((d) => (
            <li key={d.id}>
              <button type="button" className="fallback__item" onClick={() => onSelect(d.id)}>
                {d.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
