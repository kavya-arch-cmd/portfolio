import { useEffect, useRef } from 'react';
import { DESTINATION_BY_ID, type Destination, type DestinationId } from '../content/destinations';
import { profile } from '../content/portfolio';
import { ContactBody, QuickViewBody, ResumeBody, SectionBody } from './Sections';
import { SoundToggle } from './Sound';

export type PanelId = DestinationId | 'resume' | 'contact' | 'overview';

const EXTRA_TITLES = { resume: 'Resume', contact: 'Contact', overview: profile.name } as const;

export function ContentPanel({
  id,
  onClose,
  next,
  onNext,
  onOpen,
  sound,
}: {
  id: PanelId;
  onClose: () => void;
  next: Destination | null;
  onNext: (id: DestinationId) => void;
  /** Open a section page directly (no drive), used by the Quick view. */
  onOpen: (id: PanelId) => void;
  sound: { on: boolean; toggle: () => void };
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const returnFocus = useRef<Element | null>(null);

  useEffect(() => {
    returnFocus.current = document.activeElement;
    heading.current?.focus();
    heading.current?.closest('.page__scroll')?.scrollTo(0, 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      if (returnFocus.current instanceof HTMLElement) returnFocus.current.focus();
    };
  }, [id, onClose]);

  const title = id === 'resume' || id === 'contact' || id === 'overview' ? EXTRA_TITLES[id] : DESTINATION_BY_ID[id].title;
  const kicker = id === 'overview' ? `Quick view · ${profile.title} · ${profile.location}` : 'KAVYA · Portfolio';

  return (
    <section className="page" role="dialog" aria-modal="true" aria-labelledby="panel-title">
      <div className="page__bar">
        <button className="panel__back" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M8.5 2.5 4 7l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          Back to the world
        </button>
        <SoundToggle on={sound.on} onToggle={sound.toggle} className="sound-toggle--bar" />
      </div>
      <div className="page__scroll">
        <div className="page__inner">
          <header className="page__hero">
            <p className="page__kicker">{kicker}</p>
            <h2 id="panel-title" ref={heading} tabIndex={-1}>
              {title}
            </h2>
          </header>
          <div className="page__body">
            {id === 'resume' ? (
              <ResumeBody />
            ) : id === 'contact' ? (
              <ContactBody />
            ) : id === 'overview' ? (
              <QuickViewBody onOpen={onOpen} />
            ) : (
              <SectionBody id={id} />
            )}
          </div>
          {next && (
            <footer className="page__foot">
              <button className="button" onClick={() => onNext(next.id)}>
                Drive on to {next.title}
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M5.5 2.5 10 7l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </button>
            </footer>
          )}
        </div>
      </div>
    </section>
  );
}
