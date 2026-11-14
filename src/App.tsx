import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { DESTINATIONS, DESTINATION_BY_ID, type DestinationId } from './content/destinations';
import { ContentPanel, type PanelId } from './ui/ContentPanel';
import { Header } from './ui/Header';
import { Loader, SceneBoundary } from './ui/Loader';
import { useReducedMotion } from './ui/useReducedMotion';
import type { DriveRequest } from './world/Car';
import { RESET_VIEW_EVENT } from './world/events';

// The 3D world (three.js) is its own download, so the page shell and menu appear at once.
const World = lazy(() => import('./world/World'));

const TOUCH = window.matchMedia?.('(pointer: coarse)').matches ?? false;

export default function App() {
  const reducedMotion = useReducedMotion();
  const [request, setRequest] = useState<DriveRequest | null>(null);
  const [driving, setDriving] = useState<DestinationId | null>(null);
  const [panel, setPanel] = useState<PanelId | null>(null);
  const [focus, setFocus] = useState<{ id: DestinationId; nonce: number } | null>(null);
  const location = useRef<DestinationId | null>(null);
  const drivingRef = useRef(false);
  const openTimer = useRef<number | undefined>(undefined);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const reducedRef = useRef(reducedMotion);
  reducedRef.current = reducedMotion;

  const select = useCallback((id: DestinationId) => {
    if (drivingRef.current) return; // never overlap journeys
    window.clearTimeout(openTimer.current);
    if (location.current === id) {
      setPanel(id);
      return;
    }
    setPanel(null);
    drivingRef.current = true;
    setDriving(id);
    setRequest({ id, nonce: performance.now() });
  }, []);

  const arrive = useCallback((id: DestinationId) => {
    drivingRef.current = false;
    location.current = id;
    setDriving(null);
    // Let the camera glide to the destination before the page opens.
    setFocus({ id, nonce: performance.now() });
    window.clearTimeout(openTimer.current);
    openTimer.current = window.setTimeout(() => setPanel(id), reducedRef.current ? 0 : 1400);
  }, []);

  const closePanel = useCallback(() => setPanel(null), []);

  useEffect(() => {
    document.body.style.cursor = '';
  }, [panel]);

  const status = driving
    ? `Driving to ${DESTINATION_BY_ID[driving].title}…`
    : `Choose a signboard — the car will drive you there. ${TOUCH ? 'Drag to move, pinch to zoom.' : 'Drag to rotate, scroll to zoom.'}`;

  const idx = panel && panel !== 'resume' && panel !== 'contact'
    ? DESTINATIONS.findIndex((d) => d.id === panel)
    : -1;
  const next = idx >= 0 ? DESTINATIONS[(idx + 1) % DESTINATIONS.length] : null;

  return (
    <div className="app">
      <Header onSelect={select} onOpen={setPanel} driving={driving !== null} />
      <main className="stage" aria-label="Miniature road world">
        <div className="stage__canvas" role="img" aria-label="An isometric miniature world: a red SUV on a winding road that links five portfolio destinations. Use the Destinations menu to travel.">
          <SceneBoundary onFail={onReady}>
            <Suspense fallback={null}>
              <World focusId={focus} request={request} reducedMotion={reducedMotion} driving={driving !== null} onSelect={select} onArrive={arrive} onReady={onReady} />
            </Suspense>
          </SceneBoundary>
        </div>
        <Loader done={ready} />
        <p className="status" aria-live="polite">
          {status}
        </p>
        <button
          className="reset-view"
          onClick={() => window.dispatchEvent(new Event(RESET_VIEW_EVENT))}
        >
          Reset view
        </button>
      </main>
      {panel && (
        <ContentPanel
          id={panel}
          onClose={closePanel}
          next={next}
          onNext={select}
        />
      )}
    </div>
  );
}
