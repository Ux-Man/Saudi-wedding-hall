import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Compass,
  Film,
  Footprints,
  Globe,
  Map as MapIcon,
  Maximize2,
  Minimize2,
  Monitor,
  Navigation,
  Pause,
  Play,
  RotateCcw,
  Sun,
  X,
} from 'lucide-react';
import { FloorPlanOverlay } from './components/FloorPlanOverlay';
import { ScreenManagerModal } from './components/ScreenManagerModal';
import { TouchControls } from './components/TouchControls';
import {
  getZoneById,
  INITIAL_SCREENS,
  LIGHTING_LABELS,
  POINTS_OF_INTEREST,
  QUALITY_LABELS,
  UI_COPY,
  ZONES,
} from './data/venueData';
import { CINEMATIC_CHAPTERS } from './scene/cinematicTour';
import { VenueEngine } from './scene/VenueEngine';
import {
  CameraMode,
  CinematicTourState,
  Language,
  LightingMode,
  QualityPreset,
  ScreenConfig,
  ZoneId,
} from './types/venue';

type DockTab = 'zones' | 'explore' | 'lighting' | 'highlights';

const LIGHTING_MODES: LightingMode[] = ['daylight', 'sunset', 'night', 'wedding', 'preparation'];
const QUALITY_PRESETS: QualityPreset[] = ['performance', 'high', 'ultra'];
const TOUR_SPEEDS = [0.75, 1, 1.5, 2] as const;

const INITIAL_TOUR_STATE: CinematicTourState = {
  active: false,
  paused: false,
  completed: false,
  progress: 0,
  speed: 1,
  chapterIndex: 0,
  chapterTitleEn: CINEMATIC_CHAPTERS[0].titleEn,
  chapterTitleAr: CINEMATIC_CHAPTERS[0].titleAr,
  chapterSubtitleEn: CINEMATIC_CHAPTERS[0].subtitleEn,
  chapterSubtitleAr: CINEMATIC_CHAPTERS[0].subtitleAr,
};

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<VenueEngine | null>(null);

  const [ready, setReady] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  const [activeZone, setActiveZone] = useState<ZoneId>('exterior');
  const [cameraMode, setCameraMode] = useState<CameraMode>('walk');
  const [lightingMode, setLightingMode] = useState<LightingMode>('sunset');
  const [qualityPreset, setQualityPreset] = useState<QualityPreset>('high');
  const [dockTab, setDockTab] = useState<DockTab>('zones');
  const [dockOpen, setDockOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [screens, setScreens] = useState<ScreenConfig[]>(INITIAL_SCREENS);
  const [screenModalOpen, setScreenModalOpen] = useState(false);
  const [selectedScreenId, setSelectedScreenId] = useState<string>(INITIAL_SCREENS[0].id);
  const [floorPlanOpen, setFloorPlanOpen] = useState(false);
  const [cameraCoords, setCameraCoords] = useState({ x: 0, z: 64 });
  const [toast, setToast] = useState<string | null>(null);
  const [tourState, setTourState] = useState<CinematicTourState>(INITIAL_TOUR_STATE);

  const langRef = useRef<Language>(lang);
  langRef.current = lang;

  const showToast = useCallback((msg: string) => {
    setToast(msg);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(id);
  }, [toast]);

  // Mount Three.js WebGL Engine strictly once inside isolated ref container
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const engine = new VenueEngine(container, {
      onScreenClick: (screenId) => {
        setSelectedScreenId(screenId);
        setScreenModalOpen(true);
      },
      onDoorToggle: (nameEn, nameAr, isOpen) => {
        const currentLang = langRef.current;
        const label = currentLang === 'ar' ? nameAr : nameEn;
        const status =
          currentLang === 'ar' ? (isOpen ? 'مفتوح' : 'مغلق') : isOpen ? 'Opened' : 'Closed';
        showToast(`${label} · ${status}`);
      },
      onZoneDetected: (zoneId) => {
        setActiveZone(zoneId);
      },
      onCameraTelemetry: (x, z) => {
        setCameraCoords({ x, z });
      },
      onCinematicTourChange: (state) => {
        setTourState(state);
        if (state.active) {
          setCameraMode('drone');
        }
      },
      onReady: () => {
        setReady(true);
      },
    });

    engineRef.current = engine;
    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, [showToast]);

  // Hide 3D CSS3D YouTube iframes cleanly whenever an overlay modal is open
  useEffect(() => {
    engineRef.current?.setModalOpen(screenModalOpen || floorPlanOpen);
  }, [screenModalOpen, floorPlanOpen]);

  // Keyboard shortcut 'H' for Cinema/Zen HUD hide toggle & Fullscreen sync
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'h' || e.key === 'H') {
        setDockOpen((prev) => !prev);
      }
    };
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement));
    window.addEventListener('keydown', onKey);
    document.addEventListener('fullscreenchange', onFs);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('fullscreenchange', onFs);
    };
  }, []);

  const handleSelectZone = useCallback((zoneId: ZoneId) => {
    setActiveZone(zoneId);
    if (cameraMode === 'floorplan') {
      setCameraMode('walk');
    }
    engineRef.current?.navigateToZone(zoneId);
  }, [cameraMode]);

  const handleCameraMode = useCallback((mode: CameraMode) => {
    setCameraMode(mode);
    engineRef.current?.setCameraMode(mode);
  }, []);

  const handleLightingMode = useCallback((mode: LightingMode) => {
    setLightingMode(mode);
    engineRef.current?.setLightingMode(mode);
  }, []);

  const handleQualityPreset = useCallback(
    (preset: QualityPreset) => {
      setQualityPreset(preset);
      engineRef.current?.setQualityPreset(preset);
      showToast(
        lang === 'ar'
          ? `جودة العرض: ${QUALITY_LABELS[preset].ar}`
          : `Graphics Quality: ${QUALITY_LABELS[preset].en}`,
      );
    },
    [lang, showToast],
  );

  const handleUpdateScreen = useCallback((updated: ScreenConfig) => {
    setScreens((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    engineRef.current?.updateScreenConfig(updated);
  }, []);

  const handleSyncNamesAll = useCallback(
    (groomEn: string, groomAr: string, brideEn: string, brideAr: string, eventDate: string) => {
      setScreens((prev) => {
        const next = prev.map((s) => ({
          ...s,
          groomNameEn: groomEn,
          groomNameAr: groomAr,
          brideNameEn: brideEn,
          brideNameAr: brideAr,
          eventDate,
        }));
        next.forEach((cfg) => engineRef.current?.updateScreenConfig(cfg));
        return next;
      });
      engineRef.current?.updateCouplePlaques(groomAr, brideAr, groomEn, brideEn, eventDate);
      showToast(
        lang === 'ar'
          ? 'تم تحديث أسماء العروسين في جميع الشاشات والمنصات'
          : 'Synced couple names across all 8 LED walls & backlit stage plaques',
      );
    },
    [lang, showToast],
  );

  const handleApplyYouTubeToHalls = useCallback(
    (youtubeUrl: string, youtubeId: string) => {
      const hallIds = new Set(['mens-stage-main', 'mens-stage-sides', 'womens-kosha-main', 'womens-kosha-sides']);
      setScreens((prev) => {
        const next = prev.map((s) =>
          hallIds.has(s.id)
            ? {
                ...s,
                contentType: 'youtube' as const,
                youtubeUrl,
                youtubeId,
                isPlaying: true,
              }
            : s,
        );
        next.forEach((cfg) => {
          if (hallIds.has(cfg.id)) {
            engineRef.current?.updateScreenConfig(cfg);
          }
        });
        return next;
      });
      showToast(
        lang === 'ar'
          ? 'تم تشغيل فيديو اليوتيوب على جميع شاشات القاعات'
          : 'YouTube video applied to all wedding hall LED screens',
      );
    },
    [lang, showToast],
  );

  const handleFocusScreen = useCallback((screenId: string) => {
    setCameraMode('walk');
    engineRef.current?.focusOnScreen(screenId);
  }, []);

  const handleStartCinematicTour = useCallback(() => {
    setFloorPlanOpen(false);
    setScreenModalOpen(false);
    setCameraMode('drone');
    engineRef.current?.startCinematicTour();
  }, []);

  const handleStopCinematicTour = useCallback(() => {
    engineRef.current?.stopCinematicTour();
  }, []);

  const handleToggleTourPause = useCallback(() => {
    engineRef.current?.toggleCinematicTourPause();
  }, []);

  const handleRestartTour = useCallback(() => {
    engineRef.current?.restartCinematicTour();
  }, []);

  const handleSeekTour = useCallback((progress: number) => {
    engineRef.current?.seekCinematicTour(progress);
  }, []);

  const handleTourSpeed = useCallback((speed: number) => {
    engineRef.current?.setCinematicTourSpeed(speed);
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  const t = UI_COPY[lang];
  const zoneMeta = getZoneById(activeZone);
  const hintText =
    cameraMode === 'walk'
      ? t.controlsHintWalk
      : cameraMode === 'drone'
        ? t.controlsHintDrone
        : t.controlsHintPlan;

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="relative h-full w-full overflow-hidden bg-[#161412]">
      {/* Dedicated Isolated WebGL Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing" />

      {/* Initial Architectural Loading Veil */}
      {!ready && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#161412] px-6 text-center">
          <div className="mb-4 h-px w-20 bg-[#C7A572]" />
          <h1 className="font-display text-3xl font-semibold tracking-wide text-[#EEE7DA] sm:text-4xl">
            {t.loadingTitle}
          </h1>
          <p className="mt-2 max-w-md text-xs text-[#C9B9A5]">{t.loadingSub}</p>
        </div>
      )}

      {/* Minimal Top Bar (3-Zone Clean Luxury Layout, Zero Clutter) */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Zone 1: Palace Wordmark */}
        <div className="pointer-events-auto rounded-lg border border-[#C7A572]/30 bg-[#181614]/92 px-3.5 py-2">
          <span className="font-display text-lg font-semibold tracking-wide text-[#EEE7DA] whitespace-nowrap">
            {t.brand}
          </span>
        </div>

        {/* Zone 2: Quiet Active Space Metadata (No Pill Capsules) */}
        <div className="pointer-events-auto hidden items-center gap-2.5 rounded-lg border border-[#C7A572]/25 bg-[#181614]/90 px-4 py-2 text-xs text-[#C9B9A5] md:flex">
          <span className="font-medium text-[#EEE7DA] whitespace-nowrap">
            {lang === 'ar' ? zoneMeta.nameAr : zoneMeta.nameEn}
          </span>
          <span aria-hidden="true" className="text-[#C7A572]">
            ·
          </span>
          <span className="truncate max-w-[240px]">
            {lang === 'ar' ? zoneMeta.subtitleAr : zoneMeta.subtitleEn}
          </span>
          <span aria-hidden="true" className="text-[#C7A572]">
            ·
          </span>
          <span className="text-[#C7A572] whitespace-nowrap">
            {LIGHTING_LABELS[lightingMode][lang]}
          </span>
        </div>

        {/* Zone 3: Essential Global Actions (Cinematic Tour, Blueprint, Screens, Language, Fullscreen) */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={tourState.active ? handleStopCinematicTour : handleStartCinematicTour}
            className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              tourState.active
                ? 'border-[#C7A572] bg-[#C7A572] text-[#181614] hover:bg-[#D4B480]'
                : 'border-[#C7A572]/60 bg-[#2A2118]/95 text-[#EEE7DA] hover:border-[#C7A572] hover:bg-[#3A2D20]'
            }`}
          >
            <Film className={`h-3.5 w-3.5 ${tourState.active ? 'text-[#181614]' : 'text-[#C7A572]'}`} />
            <span className="hidden sm:inline">
              {tourState.active ? t.cinematicTour.exit : t.cinematicTour.launch}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFloorPlanOpen(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#C7A572]/30 bg-[#181614]/92 px-3 text-xs font-medium text-[#EEE7DA] transition-colors hover:border-[#C7A572] hover:bg-[#27211B] whitespace-nowrap shrink-0"
          >
            <MapIcon className="h-3.5 w-3.5 text-[#C7A572]" />
            <span className="hidden sm:inline">{t.openFloorPlan}</span>
          </button>

          <button
            type="button"
            onClick={() => setScreenModalOpen(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#C7A572]/30 bg-[#181614]/92 px-3 text-xs font-medium text-[#EEE7DA] transition-colors hover:border-[#C7A572] hover:bg-[#27211B] whitespace-nowrap shrink-0"
          >
            <Monitor className="h-3.5 w-3.5 text-[#C7A572]" />
            <span className="hidden sm:inline">{t.tabs.screens}</span>
          </button>

          <button
            type="button"
            onClick={() => setLang((prev) => (prev === 'en' ? 'ar' : 'en'))}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#C7A572]/30 bg-[#181614]/92 px-3 text-xs font-medium text-[#EEE7DA] transition-colors hover:border-[#C7A572] hover:bg-[#27211B] whitespace-nowrap shrink-0"
            aria-label="Toggle Arabic / English"
          >
            <Globe className="h-3.5 w-3.5 text-[#C7A572]" />
            <span>{lang === 'en' ? 'العربية' : 'EN'}</span>
          </button>

          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#C7A572]/30 bg-[#181614]/92 text-[#EEE7DA] transition-colors hover:border-[#C7A572] hover:bg-[#27211B]"
            aria-label={isFullscreen ? t.exitFullscreen : t.fullscreen}
            title={isFullscreen ? t.exitFullscreen : t.fullscreen}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </header>

      {/* Subtle Door / Action Feedback Notification */}
      {toast && (
        <div className="pointer-events-none fixed left-1/2 top-16 z-30 -translate-x-1/2 rounded-lg border border-[#C7A572]/45 bg-[#1A1714]/95 px-4 py-2 text-xs font-medium text-[#EEE7DA] shadow-lg">
          {toast}
        </div>
      )}

      {/* Mobile Touch Navigation Joystick */}
      {cameraMode !== 'floorplan' && !tourState.active && (
        <TouchControls onMove={(x, y) => engineRef.current?.setTouchMove(x, y)} />
      )}

      {/* Widescreen Cinematic Drone Tour Playback Bar (replaces heavy dock while flying) */}
      {tourState.active && (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-20 flex justify-center px-3">
          <div className="pointer-events-auto w-full max-w-[780px] rounded-xl border border-[#C7A572]/45 bg-[#161310]/94 px-4 py-3 shadow-2xl">
            {/* Chapter Title Row + Status */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Film className="h-3.5 w-3.5 shrink-0 text-[#C7A572]" />
                  <span className="font-display text-sm font-semibold text-[#EEE7DA] truncate">
                    {lang === 'ar' ? tourState.chapterTitleAr : tourState.chapterTitleEn}
                  </span>
                  {tourState.completed && (
                    <span className="rounded border border-[#C7A572]/50 bg-[#2D2319] px-2 py-0.5 text-[10px] font-medium text-[#DFC498] whitespace-nowrap">
                      {t.cinematicTour.completedBadge}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[11px] text-[#C9B9A5] truncate">
                  {lang === 'ar' ? tourState.chapterSubtitleAr : tourState.chapterSubtitleEn}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={tourState.completed ? handleRestartTour : handleToggleTourPause}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#C7A572] px-3 text-xs font-semibold text-[#181614] transition-colors hover:bg-[#D6B884] whitespace-nowrap"
                >
                  {tourState.completed ? (
                    <>
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>{t.cinematicTour.replay}</span>
                    </>
                  ) : tourState.paused ? (
                    <>
                      <Play className="h-3.5 w-3.5" />
                      <span>{t.cinematicTour.play}</span>
                    </>
                  ) : (
                    <>
                      <Pause className="h-3.5 w-3.5" />
                      <span>{t.cinematicTour.pause}</span>
                    </>
                  )}
                </button>

                {!tourState.completed && (
                  <button
                    type="button"
                    onClick={handleRestartTour}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#C7A572]/30 bg-[#221D18] text-[#EEE7DA] transition-colors hover:border-[#C7A572] hover:bg-[#2F261D]"
                    title={t.cinematicTour.replay}
                    aria-label={t.cinematicTour.replay}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                )}

                <div className="hidden items-center rounded-lg border border-[#C7A572]/25 bg-[#201C18] p-0.5 sm:flex">
                  {TOUR_SPEEDS.map((sp) => (
                    <button
                      key={sp}
                      type="button"
                      onClick={() => handleTourSpeed(sp)}
                      className={`rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${
                        Math.abs(tourState.speed - sp) < 0.05
                          ? 'bg-[#C7A572] text-[#181614]'
                          : 'text-[#C9B9A5] hover:text-[#EEE7DA]'
                      }`}
                    >
                      {sp}×
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleStopCinematicTour}
                  className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#C7A572]/35 bg-[#221D18] px-2.5 text-xs font-medium text-[#EEE7DA] transition-colors hover:border-[#C7A572] hover:bg-[#31271E] whitespace-nowrap"
                >
                  <X className="h-3.5 w-3.5 text-[#C7A572]" />
                  <span className="hidden sm:inline">{t.cinematicTour.exit}</span>
                </button>
              </div>
            </div>

            {/* Interactive Timeline Scrubber with Chapter Ticks */}
            <div className="mt-2.5 flex items-center gap-3" dir="ltr">
              <div className="relative flex-1 py-1.5">
                <div className="relative h-1.5 w-full rounded-full bg-[#2E2720]">
                  <div
                    className="h-full rounded-full bg-[#C7A572] transition-[width] duration-100"
                    style={{ width: `${Math.round(tourState.progress * 1000) / 10}%` }}
                  />
                  {CINEMATIC_CHAPTERS.map((ch) => (
                    <span
                      key={ch.id}
                      aria-hidden="true"
                      style={{ left: `${ch.tStart * 100}%` }}
                      className="pointer-events-none absolute top-1/2 h-2.5 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#EEE7DA]/55"
                    />
                  ))}
                </div>
                <input
                  type="range"
                  min={0}
                  max={1000}
                  value={Math.round(tourState.progress * 1000)}
                  onChange={(e) => handleSeekTour(Number(e.target.value) / 1000)}
                  aria-label="Cinematic Tour Progress"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </div>
              <span className="w-10 text-right text-[11px] font-medium tabular-nums text-[#C9B9A5]">
                {Math.round(tourState.progress * 100)}%
              </span>
            </div>

            <div className="mt-1 hidden text-[10px] text-[#C9B9A5]/75 sm:block">
              {t.cinematicTour.shortcutHint}
            </div>
          </div>
        </div>
      )}

      {/* Collapsible Unified Bottom Control Dock (Zero Center Viewport Occlusion) */}
      {!tourState.active && (
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-20 flex flex-col items-center px-3">
        {/* Collapse / Expand Toggle Handle */}
        <button
          type="button"
          onClick={() => setDockOpen((prev) => !prev)}
          className="pointer-events-auto mb-1.5 inline-flex items-center gap-1.5 rounded-t-lg border border-[#C7A572]/30 bg-[#181614]/94 px-3.5 py-1 text-[11px] font-medium text-[#C9B9A5] transition-colors hover:text-[#EEE7DA]"
        >
          {dockOpen ? <ChevronDown className="h-3.5 w-3.5 text-[#C7A572]" /> : <ChevronUp className="h-3.5 w-3.5 text-[#C7A572]" />}
          <span>{dockOpen ? t.hideControls : t.showControls}</span>
        </button>

        {/* Main Sleek Dock Panel */}
        <div
          className={`pointer-events-auto w-full max-w-[960px] overflow-hidden rounded-xl border border-[#C7A572]/35 bg-[#181614]/94 shadow-2xl transition-transform duration-200 ${
            dockOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-[120%] opacity-0 hidden'
          }`}
        >
          {/* Dock Segmented Tabs + Controls Hint */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#C7A572]/18 px-3 py-2">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setDockTab('zones')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  dockTab === 'zones'
                    ? 'bg-[#C7A572] text-[#181614]'
                    : 'text-[#C9B9A5] hover:bg-[#26211C] hover:text-[#EEE7DA]'
                }`}
              >
                <Compass className="h-3.5 w-3.5" />
                <span>{t.tabs.zones}</span>
              </button>
              <button
                type="button"
                onClick={() => setDockTab('explore')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  dockTab === 'explore'
                    ? 'bg-[#C7A572] text-[#181614]'
                    : 'text-[#C9B9A5] hover:bg-[#26211C] hover:text-[#EEE7DA]'
                }`}
              >
                <Footprints className="h-3.5 w-3.5" />
                <span>{t.tabs.explore}</span>
              </button>
              <button
                type="button"
                onClick={() => setDockTab('lighting')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  dockTab === 'lighting'
                    ? 'bg-[#C7A572] text-[#181614]'
                    : 'text-[#C9B9A5] hover:bg-[#26211C] hover:text-[#EEE7DA]'
                }`}
              >
                <Sun className="h-3.5 w-3.5" />
                <span>{t.tabs.lighting}</span>
              </button>
              <button
                type="button"
                onClick={() => setDockTab('highlights')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  dockTab === 'highlights'
                    ? 'bg-[#C7A572] text-[#181614]'
                    : 'text-[#C9B9A5] hover:bg-[#26211C] hover:text-[#EEE7DA]'
                }`}
              >
                <Navigation className="h-3.5 w-3.5" />
                <span>{lang === 'ar' ? 'معالم القصر' : 'Highlights'}</span>
              </button>
            </div>

            <div className="hidden text-[11px] text-[#C9B9A5]/85 lg:block">{hintText}</div>
          </div>

          {/* Dock Tab Content */}
          <div className="px-3 py-2.5">
            {dockTab === 'zones' && (
              <div className="luxury-scroll flex items-center gap-1.5 overflow-x-auto pb-1">
                {ZONES.map((z) => {
                  const isActive = activeZone === z.id;
                  return (
                    <button
                      key={z.id}
                      type="button"
                      onClick={() => handleSelectZone(z.id)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'border-[#C7A572] bg-[#31271E] text-[#EEE7DA]'
                          : 'border-[#C7A572]/20 bg-[#201D1A] text-[#C9B9A5] hover:border-[#C7A572]/50 hover:text-[#EEE7DA]'
                      }`}
                    >
                      {lang === 'ar' ? z.nameAr : z.nameEn}
                    </button>
                  );
                })}
              </div>
            )}

            {dockTab === 'explore' && (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {(['walk', 'drone', 'floorplan'] as CameraMode[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleCameraMode(m)}
                      className={`rounded-lg border px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        cameraMode === m
                          ? 'border-[#C7A572] bg-[#31271E] text-[#EEE7DA]'
                          : 'border-[#C7A572]/20 bg-[#201D1A] text-[#C9B9A5] hover:border-[#C7A572]/50 hover:text-[#EEE7DA]'
                      }`}
                    >
                      {t.modes[m]}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleStartCinematicTour}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#C7A572] bg-[#C7A572] px-3.5 py-1.5 text-xs font-semibold text-[#181614] hover:bg-[#D6B884] whitespace-nowrap shrink-0"
                  >
                    <Film className="h-3.5 w-3.5" />
                    <span>{t.cinematicTour.launchFull}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFloorPlanOpen(true)}
                    className="rounded-lg border border-[#C7A572]/35 bg-[#24201C] px-3.5 py-1.5 text-xs font-medium text-[#C7A572] hover:bg-[#31271E] whitespace-nowrap shrink-0"
                  >
                    {lang === 'ar' ? 'فتح المخطط التفاعلي' : 'Open Interactive Blueprint'}
                  </button>
                </div>
                <span className="text-[11px] text-[#C9B9A5]">{t.toggleDoorHint}</span>
              </div>
            )}

            {dockTab === 'lighting' && (
              <div className="luxury-scroll flex flex-wrap items-center justify-between gap-2 pb-0.5">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {LIGHTING_MODES.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleLightingMode(m)}
                      className={`rounded-lg border px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        lightingMode === m
                          ? 'border-[#C7A572] bg-[#31271E] text-[#EEE7DA]'
                          : 'border-[#C7A572]/20 bg-[#201D1A] text-[#C9B9A5] hover:border-[#C7A572]/50 hover:text-[#EEE7DA]'
                      }`}
                    >
                      {LIGHTING_LABELS[m][lang]}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 border-s border-[#C7A572]/20 ps-2.5">
                  <span className="text-[11px] font-medium text-[#C9B9A5] whitespace-nowrap">
                    {lang === 'ar' ? 'الجودة:' : 'Quality:'}
                  </span>
                  {QUALITY_PRESETS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleQualityPreset(q)}
                      className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                        qualityPreset === q
                          ? 'border-[#C7A572] bg-[#C7A572] text-[#181614]'
                          : 'border-[#C7A572]/25 bg-[#201D1A] text-[#C9B9A5] hover:border-[#C7A572]/60 hover:text-[#EEE7DA]'
                      }`}
                    >
                      {QUALITY_LABELS[q][lang]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {dockTab === 'highlights' && (
              <div className="luxury-scroll flex items-center gap-2 overflow-x-auto pb-1">
                {POINTS_OF_INTEREST.map((poi) => (
                  <button
                    key={poi.id}
                    type="button"
                    onClick={() => {
                      setActiveZone(poi.zoneId);
                      engineRef.current?.focusOnPoint(poi.cameraPos, poi.lookAt);
                      showToast(lang === 'ar' ? `${poi.titleAr} · ${poi.descAr}` : `${poi.titleEn} · ${poi.descEn}`);
                    }}
                    className="rounded-lg border border-[#C7A572]/25 bg-[#201D1A] px-3 py-1.5 text-start text-xs font-medium text-[#EEE7DA] transition-colors hover:border-[#C7A572] hover:bg-[#2D241C] whitespace-nowrap shrink-0"
                  >
                    {lang === 'ar' ? poi.titleAr : poi.titleEn}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Interactive LED Screen Studio Modal */}
      {screenModalOpen && (
        <ScreenManagerModal
          lang={lang}
          screens={screens}
          selectedScreenId={selectedScreenId}
          onSelectScreen={setSelectedScreenId}
          onUpdateScreen={handleUpdateScreen}
          onSyncNamesAll={handleSyncNamesAll}
          onApplyYouTubeToHalls={handleApplyYouTubeToHalls}
          onFocusScreen={handleFocusScreen}
          onClose={() => setScreenModalOpen(false)}
        />
      )}

      {/* Interactive Architectural Floor Plan Modal */}
      {floorPlanOpen && (
        <FloorPlanOverlay
          lang={lang}
          activeZone={activeZone}
          cameraCoords={cameraCoords}
          onSelectZone={handleSelectZone}
          onClose={() => setFloorPlanOpen(false)}
        />
      )}
    </div>
  );
}
