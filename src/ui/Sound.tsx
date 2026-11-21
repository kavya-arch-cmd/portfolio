import { useCallback, useEffect, useRef, useState } from 'react';
import { ambience } from './ambience';

const KEY = 'kavya:sound';

function saved() {
  try {
    return localStorage.getItem(KEY) === 'on';
  } catch {
    return false;
  }
}

function save(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {
    /* private mode: just don't remember */
  }
}

/**
 * Sound on/off state. Off by default; a returning visitor who left it on hears it again
 * after their first tap or key press (browsers block audio before any interaction).
 */
export function useSound(driving: boolean) {
  const [on, setOn] = useState(false);
  const onRef = useRef(false);

  const set = useCallback((next: boolean) => {
    onRef.current = next;
    if (next) ambience.start();
    else ambience.stop();
    setOn(next);
  }, []);

  const toggle = useCallback(() => {
    const next = !onRef.current;
    set(next);
    save(next);
  }, [set]);

  // Resume a remembered "on" at the first interaction.
  useEffect(() => {
    if (!saved()) return;
    const first = (e: Event) => {
      remove();
      // A click on the toggle itself is handled by toggle(); don't double-flip.
      if ((e.target as Element | null)?.closest?.('.sound-toggle')) return;
      if (!onRef.current) set(true);
    };
    const remove = () => {
      window.removeEventListener('pointerdown', first, true);
      window.removeEventListener('keydown', first, true);
    };
    window.addEventListener('pointerdown', first, true);
    window.addEventListener('keydown', first, true);
    return remove;
  }, [set]);

  useEffect(() => {
    ambience.setDriving(on && driving);
  }, [on, driving]);

  useEffect(() => {
    const onVis = () => ambience.setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  return { on, toggle };
}

export function SoundToggle({ on, onToggle, className = '' }: { on: boolean; onToggle: () => void; className?: string }) {
  return (
    <button
      type="button"
      className={`sound-toggle ${className}`}
      aria-pressed={on}
      onClick={onToggle}
      title={on ? 'Turn ambient sound off' : 'Turn ambient sound on'}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M2 6h2.5L8 3v10L4.5 10H2z" fill="currentColor" />
        {on ? (
          <path d="M10.5 5.5a3.5 3.5 0 0 1 0 5M12.5 3.5a6.3 6.3 0 0 1 0 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        ) : (
          <path d="m10.5 6 4 4m0-4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        )}
      </svg>
      <span>{on ? 'Sound on' : 'Sound off'}</span>
    </button>
  );
}
