import React from 'react';
import { X } from 'lucide-react';
import { UI_COPY, ZONES } from '../data/venueData';
import { Language, ZoneId } from '../types/venue';

interface FloorPlanOverlayProps {
  lang: Language;
  activeZone: ZoneId;
  cameraCoords: { x: number; z: number };
  onSelectZone: (zoneId: ZoneId) => void;
  onClose: () => void;
}

/**
 * Interactive Architectural Blueprint Overlay mapping the exact metric coordinates
 * (X: -54..+54, Z: -46..+80) to a crisp SVG floor plan with clickable rooms and live position.
 */
export const FloorPlanOverlay: React.FC<FloorPlanOverlayProps> = ({
  lang,
  activeZone,
  cameraCoords,
  onSelectZone,
  onClose,
}) => {
  const t = UI_COPY[lang];

  // Map world coordinates (X: -56..56, Z: -48..84) to SVG viewBox (0..560, 0..660)
  const toSvgX = (wx: number) => ((wx + 56) / 112) * 560;
  const toSvgY = (wz: number) => ((wz + 48) / 132) * 660;

  const rooms: {
    id: ZoneId;
    x: number;
    z: number;
    w: number;
    d: number;
    fill: string;
    labelEn: string;
    labelAr: string;
  }[] = [
    { id: 'mens-dining', x: -44, z: -44, w: 36, d: 26, fill: '#2B241D', labelEn: "Men's Dining & Buffet", labelAr: 'صالة طعام الرجال' },
    { id: 'kitchen', x: -8, z: -44, w: 16, d: 26, fill: '#232325', labelEn: 'Kitchen & Service', labelAr: 'المطبخ والخدمات' },
    { id: 'womens-dining', x: 8, z: -44, w: 36, d: 26, fill: '#2B241D', labelEn: "Women's Dining & Buffet", labelAr: 'صالة طعام النساء' },
    { id: 'mens-restrooms', x: -44, z: -18, w: 10, d: 32, fill: '#25211D', labelEn: 'Groom Suite & Washbasins', labelAr: 'مغاسل وجناح العريس' },
    { id: 'mens-hall', x: -34, z: -18, w: 33.4, d: 32, fill: '#352B21', labelEn: "Men's Royal Majlis Hall", labelAr: 'قاعة احتفالات الرجال' },
    { id: 'womens-hall', x: 0.6, z: -18, w: 33.4, d: 32, fill: '#3B2F23', labelEn: "Women's Grand Ballroom & Kosha", labelAr: 'قاعة النساء والكوشة' },
    { id: 'womens-restrooms', x: 34, z: 2, w: 10, d: 12, fill: '#25211D', labelEn: 'Powder Room', labelAr: 'مغاسل النساء' },
    { id: 'bridal-suite', x: 34, z: -18, w: 10, d: 20, fill: '#3B2E26', labelEn: 'Bridal Suite', labelAr: 'جناح العروس' },
    { id: 'mens-entrance', x: -44, z: 14, w: 43.4, d: 12, fill: '#2C251E', labelEn: "Men's Reception Lobby", labelAr: 'بهو استقبال الرجال' },
    { id: 'womens-entrance', x: 0.6, z: 14, w: 43.4, d: 12, fill: '#2C251E', labelEn: "Women's Reception Lobby", labelAr: 'بهو استقبال النساء' },
    { id: 'exterior', x: -48, z: 26, w: 96, d: 26, fill: '#1F1D1A', labelEn: 'Valet Plaza & Central Fountain', labelAr: 'الساحة والنافورة ومظلات الصف' },
    { id: 'parking', x: -52, z: 52, w: 104, d: 28, fill: '#1A1A1B', labelEn: 'Landscaped VIP Parking', labelAr: 'مواقف السيارات الفاخرة' },
  ];

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t.modes.floorplan}
    >
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-[#C7A572]/35 bg-[#181614] text-[#EEE7DA] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#C7A572]/20 px-5 py-3.5">
          <div>
            <h2 className="font-display text-xl font-semibold text-[#EEE7DA]">
              {lang === 'ar' ? 'المخطط المعماري المتكامل لقصر الملكية' : 'Qasr Al-Malakiya · Architectural Floor Plan'}
            </h2>
            <p className="text-xs text-[#C9B9A5]">
              {lang === 'ar'
                ? 'انقر على أي قاعة أو مرفق للانتقال المباشر إليه'
                : 'Select any connected wing, ballroom, suite, or plaza to enter immediately'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#C7A572]/30 text-[#EEE7DA] hover:bg-[#C7A572]/20"
            aria-label={t.close}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="luxury-scroll overflow-auto p-4">
          <svg
            viewBox="0 0 560 660"
            className="mx-auto max-h-[68vh] w-full max-w-[540px] rounded-lg border border-[#C7A572]/25 bg-[#13110F]"
          >
            {/* Subtle Architectural Grid */}
            <defs>
              <pattern id="archGrid" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(199,165,114,0.08)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="560" height="660" fill="url(#archGrid)" />

            {/* Rooms */}
            {rooms.map((r) => {
              const rx = toSvgX(r.x);
              const ry = toSvgY(r.z);
              const rw = (r.w / 112) * 560;
              const rh = (r.d / 132) * 660;
              const isSelected = activeZone === r.id;
              return (
                <g
                  key={r.id}
                  onClick={() => {
                    onSelectZone(r.id);
                    onClose();
                  }}
                  className="cursor-pointer transition-opacity hover:opacity-95"
                >
                  <rect
                    x={rx}
                    y={ry}
                    width={rw}
                    height={rh}
                    fill={isSelected ? '#4B3B2A' : r.fill}
                    stroke={isSelected ? '#E5CFA8' : '#C7A572'}
                    strokeWidth={isSelected ? 2.4 : 1.1}
                    strokeOpacity={isSelected ? 1 : 0.55}
                  />
                  <text
                    x={rx + rw / 2}
                    y={ry + rh / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isSelected ? '#FFF9EE' : '#EEE7DA'}
                    fontSize={r.w < 14 ? '9' : '11.5'}
                    fontWeight="600"
                  >
                    {lang === 'ar' ? r.labelAr : r.labelEn}
                  </text>
                </g>
              );
            })}

            {/* Bridal Runway Highlight inside Women's Hall */}
            <rect
              x={toSvgX(16.8)}
              y={toSvgY(-10.5)}
              width={(3.4 / 112) * 560}
              height={(21.5 / 132) * 660}
              fill="rgba(229,207,168,0.28)"
              stroke="#E5CFA8"
              strokeWidth="1"
              pointerEvents="none"
            />

            {/* Central Fountain Circle */}
            <circle
              cx={toSvgX(0)}
              cy={toSvgY(48)}
              r={(5.8 / 112) * 560}
              fill="rgba(126,184,196,0.28)"
              stroke="#C7A572"
              strokeWidth="1.5"
              pointerEvents="none"
            />

            {/* Live Camera Marker */}
            <g transform={`translate(${toSvgX(cameraCoords.x)}, ${toSvgY(cameraCoords.z)})`} pointerEvents="none">
              <circle r="7" fill="#C7A572" fillOpacity="0.28" />
              <circle r="3.8" fill="#EEE7DA" stroke="#181614" strokeWidth="1.2" />
            </g>
          </svg>

          {/* Compact Zone Shortcut Legend */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-[#C9B9A5]">
            <span>{lang === 'ar' ? 'الغرب (يسار): قسم الرجال المستقل' : "West (Left): Independent Men's Wing"}</span>
            <span aria-hidden="true">·</span>
            <span>{lang === 'ar' ? 'الشرق (يمين): قسم النساء وجناح العروس' : "East (Right): Independent Women's Wing & Bridal Suite"}</span>
            <span aria-hidden="true">·</span>
            <span>{ZONES.length} {lang === 'ar' ? 'مرفقاً متصلاً' : 'Connected Spaces'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
