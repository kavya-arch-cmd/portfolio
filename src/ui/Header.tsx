import { useEffect, useRef, useState } from 'react';
import { DESTINATIONS, type DestinationId } from '../content/destinations';
import type { PanelId } from './ContentPanel';

export function Header({
  onSelect,
  onOpen,
  driving,
}: {
  onSelect: (id: DestinationId) => void;
  onOpen: (id: PanelId) => void;
  driving: boolean;
}) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header className="header">
      <a className="brand" href="/" aria-label="KAVYA portfolio — home">
        <span className="brand__name">KAVYA</span>
        <span className="brand__rule" aria-hidden="true" />
        <span className="brand__sub">PORTFOLIO</span>
      </a>
      <nav className="nav" aria-label="Main">
        <div className="menu" ref={wrap}>
          <button
            ref={button}
            className="nav__item nav__item--menu"
            aria-expanded={open}
            aria-controls="destinations-menu"
            onClick={() => setOpen((o) => !o)}
          >
            Destinations
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
              <path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
          {open && (
            <ul className="menu__list" id="destinations-menu">
              {DESTINATIONS.map((d) => (
                <li key={d.id}>
                  <button
                    className="menu__item"
                    disabled={driving}
                    onClick={() => {
                      setOpen(false);
                      onSelect(d.id);
                    }}
                  >
                    {d.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button className="nav__item nav__item--quick" onClick={() => onOpen('overview')} title="Everything on one page">
          Quick view
        </button>
        <button className="nav__item" onClick={() => onOpen('resume')}>
          Resume
        </button>
        <button className="nav__item nav__item--accent" onClick={() => onOpen('contact')}>
          Contact
        </button>
      </nav>
    </header>
  );
}
