import React, { useRef } from 'react';
import { Eye, Film, Monitor, Pause, Play, Sparkles, Upload, X, Youtube } from 'lucide-react';
import { extractYouTubeId, UI_COPY } from '../data/venueData';
import { Language, ScreenConfig, ScreenContentType } from '../types/venue';

interface ScreenManagerModalProps {
  lang: Language;
  screens: ScreenConfig[];
  selectedScreenId: string;
  onSelectScreen: (id: string) => void;
  onUpdateScreen: (updated: ScreenConfig) => void;
  onSyncNamesAll: (groomEn: string, groomAr: string, brideEn: string, brideAr: string, eventDate: string) => void;
  onApplyYouTubeToHalls?: (youtubeUrl: string, youtubeId: string) => void;
  onFocusScreen: (screenId: string) => void;
  onClose: () => void;
}

const CONTENT_TYPES: ScreenContentType[] = [
  'welcome',
  'announcement',
  'promo',
  'monogram',
  'mp4',
  'youtube',
];

export const ScreenManagerModal: React.FC<ScreenManagerModalProps> = ({
  lang,
  screens,
  selectedScreenId,
  onSelectScreen,
  onUpdateScreen,
  onSyncNamesAll,
  onApplyYouTubeToHalls,
  onFocusScreen,
  onClose,
}) => {
  const t = UI_COPY[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const current = screens.find((s) => s.id === selectedScreenId) ?? screens[0];

  const handleField = <K extends keyof ScreenConfig>(key: K, value: ScreenConfig[K]) => {
    onUpdateScreen({ ...current, [key]: value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onUpdateScreen({
      ...current,
      contentType: 'mp4',
      mp4Url: url,
      mp4FileName: file.name,
      isPlaying: true,
    });
  };

  const handleYouTubeChange = (raw: string) => {
    const ytId = extractYouTubeId(raw) ?? undefined;
    onUpdateScreen({
      ...current,
      youtubeUrl: raw,
      youtubeId: ytId,
    });
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t.screenManagerTitle}
    >
      <div className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-[#C7A572]/35 bg-[#191715] text-[#EEE7DA] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#C7A572]/20 px-6 py-4">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-wide text-[#EEE7DA]">
              {t.screenManagerTitle}
            </h2>
            <p className="text-xs text-[#C9B9A5]">{t.screenManagerSub}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#C7A572]/30 text-[#EEE7DA] transition-colors hover:bg-[#C7A572]/20"
            aria-label={t.close}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-12">
          {/* Left Screen Directory */}
          <div className="luxury-scroll overflow-y-auto border-b border-[#C7A572]/15 bg-[#151311] p-3 md:col-span-4 md:border-b-0 md:border-e">
            <div className="space-y-1.5">
              {screens.map((scr) => {
                const active = scr.id === current.id;
                return (
                  <button
                    key={scr.id}
                    type="button"
                    onClick={() => onSelectScreen(scr.id)}
                    className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-start text-xs transition-colors ${
                      active
                        ? 'border border-[#C7A572]/60 bg-[#2A231C] text-[#EEE7DA]'
                        : 'border border-transparent text-[#C9B9A5] hover:bg-[#221E1A] hover:text-[#EEE7DA]'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">
                        {lang === 'ar' ? scr.nameAr : scr.nameEn}
                      </div>
                      <div className="mt-0.5 truncate text-[11px] text-[#C7A572]">
                        {t.contentTypes[scr.contentType]}
                      </div>
                    </div>
                    <Monitor className="h-3.5 w-3.5 shrink-0 text-[#C7A572]/80" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Configuration Editor */}
          <div className="luxury-scroll overflow-y-auto p-5 md:col-span-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-semibold text-[#EEE7DA]">
                {lang === 'ar' ? current.nameAr : current.nameEn}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleField('isPlaying', !current.isPlaying)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#C7A572]/35 bg-[#24201C] px-3 py-1.5 text-xs font-medium text-[#EEE7DA] hover:bg-[#312922]"
                >
                  {current.isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  <span>{current.isPlaying ? t.playing : t.paused}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onFocusScreen(current.id);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#C7A572] px-3 py-1.5 text-xs font-semibold text-[#191715] hover:bg-[#D6B884]"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>{t.focusScreen}</span>
                </button>
              </div>
            </div>

            {/* Content Type Selector */}
            <div className="mb-5">
              <label className="mb-2 block text-xs font-medium text-[#C9B9A5]">{t.contentType}</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {CONTENT_TYPES.map((ct) => {
                  const selected = current.contentType === ct;
                  return (
                    <button
                      key={ct}
                      type="button"
                      onClick={() => handleField('contentType', ct)}
                      className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                        selected
                          ? 'border-[#C7A572] bg-[#C7A572]/20 text-[#EEE7DA]'
                          : 'border-[#C7A572]/20 bg-[#201D1A] text-[#C9B9A5] hover:border-[#C7A572]/50 hover:text-[#EEE7DA]'
                      }`}
                    >
                      {t.contentTypes[ct]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mode-Specific Controls */}
            {current.contentType === 'mp4' ? (
              <div className="space-y-4 rounded-lg border border-[#C7A572]/25 bg-[#201C18] p-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/ogg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-xs text-[#C9B9A5]">
                    <Film className="h-4 w-4 text-[#C7A572]" />
                    <span>{current.mp4FileName || t.noVideoSelected}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#C7A572] px-4 py-2 text-xs font-semibold text-[#191715] hover:bg-[#D6B884]"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>{t.uploadMp4}</span>
                  </button>
                </div>
              </div>
            ) : current.contentType === 'youtube' ? (
              <div className="space-y-4 rounded-lg border border-[#C7A572]/25 bg-[#201C18] p-4">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[#C9B9A5]">
                    <Youtube className="h-3.5 w-3.5 text-[#C7A572]" />
                    <span>{t.youtubeUrl}</span>
                  </label>
                  <input
                    type="text"
                    value={current.youtubeUrl ?? ''}
                    onChange={(e) => handleYouTubeChange(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... or 11-char ID"
                    className="w-full rounded-lg border border-[#C7A572]/30 bg-[#151311] px-3 py-2 text-xs text-[#EEE7DA] outline-none focus:border-[#C7A572]"
                    dir="ltr"
                  />
                  <p className="mt-1.5 text-[11px] text-[#C9B9A5]/80">{t.youtubeNote}</p>
                </div>

                {current.youtubeId && (
                  <>
                    <div className="overflow-hidden rounded-lg border border-[#C7A572]/35 bg-black">
                      <div className="aspect-video w-full">
                        <iframe
                          className="h-full w-full"
                          src={`https://www.youtube-nocookie.com/embed/${current.youtubeId}?autoplay=0&rel=0`}
                          title="YouTube Wedding Display"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                    {onApplyYouTubeToHalls && current.youtubeUrl && (
                      <button
                        type="button"
                        onClick={() => onApplyYouTubeToHalls(current.youtubeUrl!, current.youtubeId!)}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#C7A572]/45 bg-[#2A221B] px-4 py-2 text-xs font-medium text-[#EEE7DA] hover:bg-[#3A2E23]"
                      >
                        <Youtube className="h-3.5 w-3.5 text-[#C7A572]" />
                        <span>
                          {lang === 'ar'
                            ? 'تطبيق هذا الفيديو على جميع شاشات القاعات'
                            : 'Play This Video on All Hall LED Screens'}
                        </span>
                      </button>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-[#C9B9A5]">{t.groomName} (EN)</label>
                    <input
                      type="text"
                      value={current.groomNameEn}
                      onChange={(e) => handleField('groomNameEn', e.target.value)}
                      className="w-full rounded-lg border border-[#C7A572]/25 bg-[#141210] px-3 py-2 text-xs text-[#EEE7DA] outline-none focus:border-[#C7A572]"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-[#C9B9A5]">{t.groomName} (AR)</label>
                    <input
                      type="text"
                      value={current.groomNameAr}
                      onChange={(e) => handleField('groomNameAr', e.target.value)}
                      className="w-full rounded-lg border border-[#C7A572]/25 bg-[#141210] px-3 py-2 text-xs text-[#EEE7DA] outline-none focus:border-[#C7A572]"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-[#C9B9A5]">{t.brideName} (EN)</label>
                    <input
                      type="text"
                      value={current.brideNameEn}
                      onChange={(e) => handleField('brideNameEn', e.target.value)}
                      className="w-full rounded-lg border border-[#C7A572]/25 bg-[#141210] px-3 py-2 text-xs text-[#EEE7DA] outline-none focus:border-[#C7A572]"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-[#C9B9A5]">{t.brideName} (AR)</label>
                    <input
                      type="text"
                      value={current.brideNameAr}
                      onChange={(e) => handleField('brideNameAr', e.target.value)}
                      className="w-full rounded-lg border border-[#C7A572]/25 bg-[#141210] px-3 py-2 text-xs text-[#EEE7DA] outline-none focus:border-[#C7A572]"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-[#C9B9A5]">{t.headline} (EN)</label>
                    <input
                      type="text"
                      value={current.headlineEn}
                      onChange={(e) => handleField('headlineEn', e.target.value)}
                      className="w-full rounded-lg border border-[#C7A572]/25 bg-[#141210] px-3 py-2 text-xs text-[#EEE7DA] outline-none focus:border-[#C7A572]"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-[#C9B9A5]">{t.headline} (AR)</label>
                    <input
                      type="text"
                      value={current.headlineAr}
                      onChange={(e) => handleField('headlineAr', e.target.value)}
                      className="w-full rounded-lg border border-[#C7A572]/25 bg-[#141210] px-3 py-2 text-xs text-[#EEE7DA] outline-none focus:border-[#C7A572]"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-[#C9B9A5]">{t.subline}</label>
                    <input
                      type="text"
                      value={current.sublineEn}
                      onChange={(e) => handleField('sublineEn', e.target.value)}
                      className="w-full rounded-lg border border-[#C7A572]/25 bg-[#141210] px-3 py-2 text-xs text-[#EEE7DA] outline-none focus:border-[#C7A572]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-[#C9B9A5]">{t.eventDate}</label>
                    <input
                      type="text"
                      value={current.eventDate}
                      onChange={(e) => handleField('eventDate', e.target.value)}
                      className="w-full rounded-lg border border-[#C7A572]/25 bg-[#141210] px-3 py-2 text-xs text-[#EEE7DA] outline-none focus:border-[#C7A572]"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      onSyncNamesAll(
                        current.groomNameEn,
                        current.groomNameAr,
                        current.brideNameEn,
                        current.brideNameAr,
                        current.eventDate,
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-[#C7A572]/45 bg-[#2A221B] px-4 py-2 text-xs font-medium text-[#EEE7DA] hover:bg-[#3A2E23]"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#C7A572]" />
                    <span>{t.applyAll}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
