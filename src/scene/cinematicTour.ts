import * as THREE from 'three';
import { CinematicChapter, CinematicTourState, ZoneId } from '../types/venue';

interface TourKeyframe {
  pos: [number, number, number];
  look: [number, number, number];
  /** Travel duration in seconds from the previous keyframe to this keyframe at 1x speed */
  duration: number;
  /** Optional subtle cinema banking multiplier (0 = strictly level inside tight doorways/rooms) */
  bankScale?: number;
  chapter?: {
    id: string;
    zoneId: ZoneId;
    titleEn: string;
    titleAr: string;
    subtitleEn: string;
    subtitleAr: string;
  };
}

/**
 * Verified full-palace cinematic drone flight plan:
 * Sky Approach -> Valet & Luxury Parking -> Men's Entrance & Lobby -> Men's Washbasins ->
 * Men's Royal Majlis Hall -> Groom's Prep Suite -> Men's Dining & Buffet -> Central Prep Kitchen ->
 * Women's Dining & Buffet -> Private Bridal Suite -> Women's Powder Room -> Women's Lobby ->
 * Women's Royal Ballroom & Illuminated Runway -> Grand Exit -> High Sky Finale Stop.
 *
 * Every doorway uses aligned approach/center/exit waypoints to guarantee zero wall or prop clipping.
 */
const TOUR_KEYFRAMES: TourKeyframe[] = [
  // 1. SKY APPROACH
  {
    pos: [0, 42, 98],
    look: [0, 5.5, 22],
    duration: 0,
    bankScale: 0.4,
    chapter: {
      id: 'sky-approach',
      zoneId: 'exterior',
      titleEn: 'Aerial Sky Approach',
      titleAr: 'إطلالة جوية من السماء',
      subtitleEn: 'Descending over Qasr Al-Malakiya Royal Wedding Palace',
      subtitleAr: 'تحليق سينمائي فوق قصر الملكية للاحتفالات',
    },
  },
  {
    pos: [34, 24, 82],
    look: [0, 4.8, 28],
    duration: 5.2,
    bankScale: 0.8,
  },
  {
    pos: [24, 11.2, 68],
    look: [-4, 2.6, 50],
    duration: 4.8,
    bankScale: 0.7,
  },

  // 2. VALET & LUXURY PARKING
  {
    pos: [8, 5.0, 62],
    look: [-16, 1.8, 55],
    duration: 4.4,
    bankScale: 0.6,
    chapter: {
      id: 'parking-valet',
      zoneId: 'parking',
      titleEn: 'Luxury Parking & Valet Boulevard',
      titleAr: 'المواقف الفاخرة وبوليفارد الاستقبال',
      subtitleEn: 'Landscaped gardens, luxury motorcade & reflecting fountain',
      subtitleAr: 'السيارات الفارهة والحدائق المضاءة والنافورة الرئيسية',
    },
  },
  {
    pos: [-16, 4.2, 56],
    look: [0, 3.2, 42],
    duration: 4.5,
    bankScale: 0.6,
  },
  {
    pos: [-24, 3.4, 44],
    look: [-24, 3.0, 26],
    duration: 4.2,
    bankScale: 0.35,
  },

  // 3. MEN'S GRAND ENTRANCE & RECEPTION LOBBY
  {
    pos: [-24, 2.45, 35.5],
    look: [-24, 2.5, 20],
    duration: 3.4,
    bankScale: 0,
    chapter: {
      id: 'mens-entrance',
      zoneId: 'mens-entrance',
      titleEn: "Men's Grand Entrance & Reception",
      titleAr: 'مدخل الرجال وبهو الاستقبال الملكي',
      subtitleEn: 'Covered valet porte-cochère, glass portal & Arabic coffee lounge',
      subtitleAr: 'مظلة خدمة الصف والبوابة الزجاجية وركن القهوة السعودية',
    },
  },
  {
    pos: [-24, 2.35, 26.0],
    look: [-21, 2.4, 19.5],
    duration: 2.9,
    bankScale: 0,
  },
  {
    pos: [-20.5, 2.55, 22.0],
    look: [-13.5, 1.8, 19.5],
    duration: 3.2,
    bankScale: 0.15,
  },
  {
    pos: [-29.0, 2.5, 23.2],
    look: [-18.5, 2.4, 17.5],
    duration: 3.2,
    bankScale: 0.15,
  },
  {
    pos: [-38.2, 2.15, 21.8],
    look: [-39.0, 2.0, 14.0],
    duration: 3.0,
    bankScale: 0,
  },

  // 4. MEN'S LUXURY WASHBASINS
  {
    pos: [-39.0, 2.05, 16.0],
    look: [-41.0, 1.55, 8.5],
    duration: 2.3,
    bankScale: 0,
    chapter: {
      id: 'mens-washbasins',
      zoneId: 'mens-restrooms',
      titleEn: "Men's Marble Washbasins",
      titleAr: 'مغاسل الرجال الرخامية الفاخرة',
      subtitleEn: 'Illuminated Crema Marfil marble vanities & brass mirrors',
      subtitleAr: 'المغاسل الرخامية والمرايا المضاءة بتشطيبات الذهب الشمباني',
    },
  },
  {
    pos: [-39.0, 2.0, 14.0],
    look: [-42.2, 1.5, 8.0],
    duration: 1.8,
    bankScale: 0,
  },
  {
    pos: [-39.8, 1.95, 10.6],
    look: [-43.1, 1.45, 7.2],
    duration: 2.6,
    bankScale: 0,
  },
  {
    pos: [-39.0, 2.05, 14.2],
    look: [-26.0, 2.4, 15.8],
    duration: 2.5,
    bankScale: 0,
  },
  {
    pos: [-28.0, 2.6, 15.6],
    look: [-18.5, 2.6, 10.0],
    duration: 3.1,
    bankScale: 0.15,
  },

  // 5. MEN'S GRAND WEDDING HALL & ROYAL MAJLIS
  {
    pos: [-18.5, 2.5, 16.0],
    look: [-18.5, 3.2, -12.0],
    duration: 2.5,
    bankScale: 0,
    chapter: {
      id: 'mens-hall',
      zoneId: 'mens-hall',
      titleEn: "Men's Royal Majlis Wedding Hall",
      titleAr: 'قاعة احتفالات الرجال · المجلس الملكي',
      subtitleEn: "Ceremonial groom's stage, crystal chandeliers & live LED video wall",
      subtitleAr: 'المجلس السعودي الفاخر ومنصة العريس والثريات الكريستالية والشاشات العملاقة',
    },
  },
  {
    pos: [-18.5, 2.55, 14.0],
    look: [-18.5, 3.5, -15.0],
    duration: 2.1,
    bankScale: 0,
  },
  {
    pos: [-18.5, 3.9, 5.5],
    look: [-18.5, 3.8, -16.2],
    duration: 4.2,
    bankScale: 0.25,
  },
  {
    pos: [-9.2, 4.1, -4.5],
    look: [-19.5, 3.3, -14.8],
    duration: 4.6,
    bankScale: 0.4,
  },
  {
    pos: [-18.5, 3.6, -8.5],
    look: [-18.5, 3.6, -16.8],
    duration: 4.5,
    bankScale: 0.25,
  },
  {
    pos: [-28.8, 2.6, -6.5],
    look: [-36.5, 1.9, -8.5],
    duration: 3.8,
    bankScale: 0.15,
  },

  // 6. GROOM'S PRIVATE PREPARATION SUITE
  {
    pos: [-32.0, 2.05, -8.0],
    look: [-39.5, 1.5, -8.0],
    duration: 2.2,
    bankScale: 0,
    chapter: {
      id: 'groom-suite',
      zoneId: 'mens-restrooms',
      titleEn: "Groom's Private Preparation Suite",
      titleAr: 'جناح تجهيز العريس الخاص',
      subtitleEn: 'Private majlis lounge, walnut wardrobe & dressing mirror',
      subtitleAr: 'مجلس تجهيز العريس الخاص وخزائن الجوز الفاخرة',
    },
  },
  {
    pos: [-34.0, 2.0, -8.0],
    look: [-41.2, 1.5, -8.2],
    duration: 1.8,
    bankScale: 0,
  },
  {
    pos: [-37.6, 2.0, -9.0],
    look: [-41.8, 1.45, -12.8],
    duration: 3.0,
    bankScale: 0,
  },
  {
    pos: [-36.0, 2.05, -15.6],
    look: [-36.0, 2.1, -24.0],
    duration: 2.6,
    bankScale: 0,
  },

  // 7. MEN'S DINING & OPEN BUFFET HALL
  {
    pos: [-36.0, 2.1, -18.0],
    look: [-30.0, 2.0, -32.0],
    duration: 2.0,
    bankScale: 0,
    chapter: {
      id: 'mens-dining',
      zoneId: 'mens-dining',
      titleEn: "Men's Banquet & Open Buffet Hall",
      titleAr: 'صالة طعام الرجال والبوفيه المفتوح',
      subtitleEn: 'Arabian hot entrees, cold mezze, dessert counters & round dining tables',
      subtitleAr: 'بوفيه الضيافة السعودية الساخن والبارد وركن الحلويات الشرقية',
    },
  },
  {
    pos: [-35.5, 2.6, -22.2],
    look: [-25.5, 1.6, -37.5],
    duration: 3.0,
    bankScale: 0.2,
  },
  {
    pos: [-24.5, 3.1, -29.5],
    look: [-24.0, 1.35, -39.5],
    duration: 4.5,
    bankScale: 0.3,
  },
  {
    pos: [-13.5, 2.5, -36.5],
    look: [-12.2, 1.4, -31.0],
    duration: 3.8,
    bankScale: 0.2,
  },
  {
    pos: [-10.0, 2.05, -31.0],
    look: [-3.0, 1.75, -31.0],
    duration: 2.8,
    bankScale: 0,
  },

  // 8. CENTRAL CULINARY PREP KITCHEN
  {
    pos: [-8.0, 2.0, -31.0],
    look: [0.0, 1.5, -30.5],
    duration: 1.9,
    bankScale: 0,
    chapter: {
      id: 'central-kitchen',
      zoneId: 'kitchen',
      titleEn: 'Central Culinary Prep Kitchen',
      titleAr: 'المطبخ المركزي وممرات الخدمة',
      subtitleEn: 'Stainless steel plating islands, hoods & dual-wing hospitality service',
      subtitleAr: 'مطبخ التجهيز الاحترافي وطاولات التقديم وممرات الضيافة',
    },
  },
  {
    pos: [0.0, 2.0, -29.8],
    look: [4.5, 1.45, -33.0],
    duration: 3.6,
    bankScale: 0,
  },
  {
    pos: [6.0, 2.0, -31.0],
    look: [14.0, 1.8, -31.0],
    duration: 2.6,
    bankScale: 0,
  },

  // 9. WOMEN'S DINING & PATISSERIE BUFFET
  {
    pos: [8.0, 2.0, -31.0],
    look: [18.0, 1.8, -34.0],
    duration: 1.9,
    bankScale: 0,
    chapter: {
      id: 'womens-dining',
      zoneId: 'womens-dining',
      titleEn: "Women's Royal Dining & Patisserie Buffet",
      titleAr: 'صالة طعام النساء والبوفيه الملكي',
      subtitleEn: 'Fine dining round tables, patisserie risers & gourmet stations',
      subtitleAr: 'صالة الضيافة الملكية للنساء وركن الحلويات الفاخرة',
    },
  },
  {
    pos: [10.0, 2.15, -31.0],
    look: [22.0, 1.5, -37.0],
    duration: 2.3,
    bankScale: 0,
  },
  {
    pos: [14.0, 2.6, -36.5],
    look: [27.0, 1.4, -39.2],
    duration: 3.4,
    bankScale: 0.2,
  },
  {
    pos: [26.5, 3.1, -30.0],
    look: [30.0, 1.4, -39.2],
    duration: 4.4,
    bankScale: 0.3,
  },
  {
    pos: [35.1, 2.1, -21.5],
    look: [36.8, 1.75, -13.0],
    duration: 3.2,
    bankScale: 0,
  },

  // 10. PRIVATE BRIDAL PREPARATION SUITE
  {
    pos: [35.1, 2.05, -18.0],
    look: [39.5, 1.55, -13.5],
    duration: 2.0,
    bankScale: 0,
    chapter: {
      id: 'bridal-suite',
      zoneId: 'bridal-suite',
      titleEn: 'Private Bridal Preparation Suite',
      titleAr: 'جناح العروس الخاص والتصوير',
      subtitleEn: 'Hollywood makeup vanities, gown showcase & silk photography studio',
      subtitleAr: 'ركن التجميل المضاء وغرفة الملابس واستوديو تصوير العروس',
    },
  },
  {
    pos: [36.8, 2.0, -13.2],
    look: [40.8, 1.45, -15.6],
    duration: 3.2,
    bankScale: 0,
  },
  {
    pos: [38.6, 2.0, -6.2],
    look: [43.0, 1.5, -5.0],
    duration: 3.8,
    bankScale: 0,
  },
  {
    pos: [39.0, 2.0, -0.2],
    look: [39.8, 1.6, 7.8],
    duration: 2.6,
    bankScale: 0,
  },

  // 11. WOMEN'S POWDER ROOM
  {
    pos: [39.0, 2.0, 2.0],
    look: [42.0, 1.5, 8.2],
    duration: 1.8,
    bankScale: 0,
    chapter: {
      id: 'womens-powder',
      zoneId: 'womens-restrooms',
      titleEn: "Women's Luxury Powder Room",
      titleAr: 'مغاسل واستراحة النساء الفاخرة',
      subtitleEn: 'Backlit marble vanity stations & gilded architectural trim',
      subtitleAr: 'المغاسل الرخامية المضاءة والمرايا الفاخرة للنساء',
    },
  },
  {
    pos: [39.8, 2.0, 8.2],
    look: [43.1, 1.5, 8.2],
    duration: 3.0,
    bankScale: 0,
  },
  {
    pos: [39.0, 2.05, 14.0],
    look: [26.0, 2.35, 19.2],
    duration: 2.5,
    bankScale: 0,
  },

  // 12. WOMEN'S RECEPTION LOBBY
  {
    pos: [36.5, 2.35, 20.4],
    look: [20.0, 2.4, 19.5],
    duration: 2.9,
    bankScale: 0.15,
    chapter: {
      id: 'womens-lobby',
      zoneId: 'womens-entrance',
      titleEn: "Women's Marble Reception Lobby",
      titleAr: 'بهو استقبال النساء الملكي',
      subtitleEn: 'Independent grand foyer, gilded mirror bays & hospitality counter',
      subtitleAr: 'المدخل المستقل وبهو الاستقبال الرخامي وضيافة النساء',
    },
  },
  {
    pos: [27.0, 2.5, 20.5],
    look: [12.0, 2.4, 19.8],
    duration: 3.2,
    bankScale: 0.15,
  },
  {
    pos: [18.5, 2.5, 16.4],
    look: [18.5, 3.2, -14.0],
    duration: 2.8,
    bankScale: 0,
  },

  // 13. WOMEN'S ROYAL BALLROOM, RUNWAY & BRIDAL KOSHA
  {
    pos: [18.5, 2.6, 14.0],
    look: [18.5, 3.3, -15.0],
    duration: 2.2,
    bankScale: 0,
    chapter: {
      id: 'womens-ballroom',
      zoneId: 'womens-hall',
      titleEn: "Women's Royal Ballroom & Bridal Kosha",
      titleAr: 'قاعة احتفالات النساء الكبرى والكوشة الملكية',
      subtitleEn: 'Illuminated bridal runway, floral arches, banquet gallery & massive LED wall',
      subtitleAr: 'ممر الزفة الزجاجي المضيء وأقواس الورود والكوشة الملكية والشاشة العملاقة',
    },
  },
  {
    pos: [18.5, 3.2, 3.5],
    look: [18.5, 3.3, -15.5],
    duration: 4.8,
    bankScale: 0.15,
  },
  {
    pos: [18.5, 3.2, -5.8],
    look: [18.5, 3.5, -16.5],
    duration: 4.6,
    bankScale: 0.2,
  },
  {
    pos: [9.2, 4.3, -5.0],
    look: [19.5, 3.1, -13.8],
    duration: 4.8,
    bankScale: 0.4,
  },
  {
    pos: [11.5, 4.2, 6.0],
    look: [21.5, 3.0, -8.5],
    duration: 4.6,
    bankScale: 0.35,
  },
  {
    pos: [18.5, 2.65, 11.4],
    look: [18.5, 2.5, 20.5],
    duration: 3.4,
    bankScale: 0,
  },
  {
    pos: [18.5, 2.45, 14.0],
    look: [26.0, 2.4, 21.0],
    duration: 2.2,
    bankScale: 0,
  },

  // 14. GRAND EXIT & SKY FINALE STOP
  {
    pos: [22.8, 2.4, 17.0],
    look: [28.5, 2.35, 22.8],
    duration: 2.6,
    bankScale: 0.1,
    chapter: {
      id: 'sky-finale',
      zoneId: 'exterior',
      titleEn: 'Grand Exit & Sky Panorama Finale',
      titleAr: 'الخروج الملكي والتوقف في السماء',
      subtitleEn: 'Ascending over the illuminated courtyard into a serene panoramic sky view',
      subtitleAr: 'الصعود من بوابة النساء فوق النافورة والحدائق نحو إطلالة بانورامية من السماء',
    },
  },
  {
    pos: [28.8, 2.35, 22.8],
    look: [24.0, 2.35, 28.0],
    duration: 2.6,
    bankScale: 0,
  },
  {
    pos: [26.8, 2.35, 24.7],
    look: [24.0, 2.4, 34.0],
    duration: 1.9,
    bankScale: 0,
  },
  {
    pos: [24.0, 2.35, 26.0],
    look: [24.0, 2.5, 39.0],
    duration: 1.9,
    bankScale: 0,
  },
  {
    pos: [24.0, 3.0, 36.8],
    look: [8.0, 4.5, 30.0],
    duration: 3.5,
    bankScale: 0.35,
  },
  {
    pos: [30.0, 12.5, 57.0],
    look: [0.0, 5.5, 24.0],
    duration: 5.0,
    bankScale: 0.6,
  },
  {
    pos: [14.0, 28.5, 84.0],
    look: [0.0, 5.0, 18.0],
    duration: 5.8,
    bankScale: 0.45,
  },
  {
    pos: [0.0, 40.0, 96.0],
    look: [0.0, 4.5, 18.0],
    duration: 5.6,
    bankScale: 0,
  },
];

// Pre-computed cumulative timestamps and chapters
const KEYFRAME_TIMES: number[] = [];
const KEYFRAME_POS: THREE.Vector3[] = [];
const KEYFRAME_LOOK: THREE.Vector3[] = [];
export const CINEMATIC_CHAPTERS: CinematicChapter[] = [];

let runningTime = 0;
for (let i = 0; i < TOUR_KEYFRAMES.length; i++) {
  const kf = TOUR_KEYFRAMES[i];
  runningTime += kf.duration;
  KEYFRAME_TIMES.push(runningTime);
  KEYFRAME_POS.push(new THREE.Vector3(...kf.pos));
  KEYFRAME_LOOK.push(new THREE.Vector3(...kf.look));
}
export const TOTAL_TOUR_DURATION = runningTime;

for (let i = 0; i < TOUR_KEYFRAMES.length; i++) {
  const ch = TOUR_KEYFRAMES[i].chapter;
  if (ch) {
    CINEMATIC_CHAPTERS.push({
      id: ch.id,
      tStart: KEYFRAME_TIMES[i] / TOTAL_TOUR_DURATION,
      zoneId: ch.zoneId,
      titleEn: ch.titleEn,
      titleAr: ch.titleAr,
      subtitleEn: ch.subtitleEn,
      subtitleAr: ch.subtitleAr,
    });
  }
}

// Pre-allocated module-scope scratch objects (zero per-frame allocations)
const _rawPos = new THREE.Vector3();
const _rawLook = new THREE.Vector3();
const _aheadPos = new THREE.Vector3();
const _prevPos = new THREE.Vector3();
const _velDir = new THREE.Vector3();
const _aheadDir = new THREE.Vector3();
const _turnCross = new THREE.Vector3();
const _lookMat = new THREE.Matrix4();
const _targetQuat = new THREE.Quaternion();
const _bankQuat = new THREE.Quaternion();
const _upVec = new THREE.Vector3(0, 1, 0);
const _zAxis = new THREE.Vector3(0, 0, 1);

/**
 * Evaluates a centripetal Catmull-Rom cubic segment cleanly between p1 and p2
 * using neighbors p0 and p3, guaranteeing no cusps or overshoot around corners.
 */
function evalCentripetalCatmullRom(
  p0: THREE.Vector3,
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  p3: THREE.Vector3,
  t: number,
  out: THREE.Vector3,
): THREE.Vector3 {
  const eps = 1e-4;
  const d01 = Math.max(Math.sqrt(p0.distanceTo(p1)), eps);
  const d12 = Math.max(Math.sqrt(p1.distanceTo(p2)), eps);
  const d23 = Math.max(Math.sqrt(p2.distanceTo(p3)), eps);

  const t0 = 0;
  const t1 = t0 + d01;
  const t2 = t1 + d12;
  const t3 = t2 + d23;

  const u = t1 + (t2 - t1) * t;

  const a1x = ((t1 - u) / (t1 - t0)) * p0.x + ((u - t0) / (t1 - t0)) * p1.x;
  const a1y = ((t1 - u) / (t1 - t0)) * p0.y + ((u - t0) / (t1 - t0)) * p1.y;
  const a1z = ((t1 - u) / (t1 - t0)) * p0.z + ((u - t0) / (t1 - t0)) * p1.z;

  const a2x = ((t2 - u) / (t2 - t1)) * p1.x + ((u - t1) / (t2 - t1)) * p2.x;
  const a2y = ((t2 - u) / (t2 - t1)) * p1.y + ((u - t1) / (t2 - t1)) * p2.y;
  const a2z = ((t2 - u) / (t2 - t1)) * p1.z + ((u - t1) / (t2 - t1)) * p2.z;

  const a3x = ((t3 - u) / (t3 - t2)) * p2.x + ((u - t2) / (t3 - t2)) * p3.x;
  const a3y = ((t3 - u) / (t3 - t2)) * p2.y + ((u - t2) / (t3 - t2)) * p3.y;
  const a3z = ((t3 - u) / (t3 - t2)) * p2.z + ((u - t2) / (t3 - t2)) * p3.z;

  const b1x = ((t2 - u) / (t2 - t0)) * a1x + ((u - t0) / (t2 - t0)) * a2x;
  const b1y = ((t2 - u) / (t2 - t0)) * a1y + ((u - t0) / (t2 - t0)) * a2y;
  const b1z = ((t2 - u) / (t2 - t0)) * a1z + ((u - t0) / (t2 - t0)) * a2z;

  const b2x = ((t3 - u) / (t3 - t1)) * a2x + ((u - t1) / (t3 - t1)) * a3x;
  const b2y = ((t3 - u) / (t3 - t1)) * a2y + ((u - t1) / (t3 - t1)) * a3y;
  const b2z = ((t3 - u) / (t3 - t1)) * a2z + ((u - t1) / (t3 - t1)) * a3z;

  const cx = ((t2 - u) / (t2 - t1)) * b1x + ((u - t1) / (t2 - t1)) * b2x;
  const cy = ((t2 - u) / (t2 - t1)) * b1y + ((u - t1) / (t2 - t1)) * b2y;
  const cz = ((t2 - u) / (t2 - t1)) * b1z + ((u - t1) / (t2 - t1)) * b2z;

  return out.set(cx, cy, cz);
}

export class CinematicDroneTour {
  public active = false;
  public paused = false;
  public completed = false;
  public speed = 1;
  private elapsed = 0;

  private smoothPos = new THREE.Vector3();
  private smoothLook = new THREE.Vector3();
  private smoothRoll = 0;
  private initializedFilter = false;

  public start(camera: THREE.PerspectiveCamera): void {
    this.active = true;
    this.paused = false;
    this.completed = false;
    this.elapsed = 0;
    this.smoothRoll = 0;
    this.initializedFilter = false;
    this.snapCameraToElapsed(camera);
  }

  public stop(): void {
    this.active = false;
    this.paused = false;
    this.completed = false;
    this.initializedFilter = false;
  }

  public togglePause(): void {
    if (!this.active) return;
    if (this.completed) {
      this.elapsed = 0;
      this.completed = false;
      this.paused = false;
      this.initializedFilter = false;
      return;
    }
    this.paused = !this.paused;
  }

  public restart(camera: THREE.PerspectiveCamera): void {
    this.start(camera);
  }

  public setSpeed(speed: number): void {
    this.speed = THREE.MathUtils.clamp(speed, 0.5, 2.5);
  }

  public seek(progress: number, camera: THREE.PerspectiveCamera): void {
    const clamped = THREE.MathUtils.clamp(progress, 0, 1);
    this.elapsed = clamped * TOTAL_TOUR_DURATION;
    this.completed = clamped >= 0.999;
    if (!this.active) {
      this.active = true;
    }
    this.initializedFilter = false;
    this.snapCameraToElapsed(camera);
  }

  public getProgress(): number {
    return THREE.MathUtils.clamp(this.elapsed / TOTAL_TOUR_DURATION, 0, 1);
  }

  public getState(): CinematicTourState {
    const progress = this.getProgress();
    let chapterIndex = 0;
    for (let i = CINEMATIC_CHAPTERS.length - 1; i >= 0; i--) {
      if (progress >= CINEMATIC_CHAPTERS[i].tStart - 0.0005) {
        chapterIndex = i;
        break;
      }
    }
    const ch = CINEMATIC_CHAPTERS[chapterIndex] ?? CINEMATIC_CHAPTERS[0];
    return {
      active: this.active,
      paused: this.paused,
      completed: this.completed,
      progress,
      speed: this.speed,
      chapterIndex,
      chapterTitleEn: ch.titleEn,
      chapterTitleAr: ch.titleAr,
      chapterSubtitleEn: ch.subtitleEn,
      chapterSubtitleAr: ch.subtitleAr,
    };
  }

  private sampleAtTime(timeSec: number, outPos: THREE.Vector3, outLook: THREE.Vector3): number {
    const tClamped = THREE.MathUtils.clamp(timeSec, 0, TOTAL_TOUR_DURATION);
    const lastIdx = KEYFRAME_TIMES.length - 1;

    if (tClamped >= TOTAL_TOUR_DURATION) {
      outPos.copy(KEYFRAME_POS[lastIdx]);
      outLook.copy(KEYFRAME_LOOK[lastIdx]);
      return 0;
    }

    let seg = 0;
    for (let i = 0; i < lastIdx; i++) {
      if (tClamped >= KEYFRAME_TIMES[i] && tClamped <= KEYFRAME_TIMES[i + 1]) {
        seg = i;
        break;
      }
    }

    const segDur = Math.max(KEYFRAME_TIMES[seg + 1] - KEYFRAME_TIMES[seg], 0.001);
    let localT = (tClamped - KEYFRAME_TIMES[seg]) / segDur;

    // Gentle ease-in at takeoff from sky, and majestic ease-out to standstill at sky finale
    if (seg === 0) {
      localT = localT * localT * (3 - 2 * localT);
    } else if (seg === lastIdx - 1) {
      localT = 1 - Math.pow(1 - localT, 2.4);
    }

    const i0 = Math.max(0, seg - 1);
    const i1 = seg;
    const i2 = Math.min(lastIdx, seg + 1);
    const i3 = Math.min(lastIdx, seg + 2);

    evalCentripetalCatmullRom(KEYFRAME_POS[i0], KEYFRAME_POS[i1], KEYFRAME_POS[i2], KEYFRAME_POS[i3], localT, outPos);
    evalCentripetalCatmullRom(KEYFRAME_LOOK[i0], KEYFRAME_LOOK[i1], KEYFRAME_LOOK[i2], KEYFRAME_LOOK[i3], localT, outLook);

    const b1 = TOUR_KEYFRAMES[i1].bankScale ?? 0.2;
    const b2 = TOUR_KEYFRAMES[i2].bankScale ?? 0.2;
    return THREE.MathUtils.lerp(b1, b2, localT);
  }

  private snapCameraToElapsed(camera: THREE.PerspectiveCamera): void {
    this.sampleAtTime(this.elapsed, _rawPos, _rawLook);
    this.smoothPos.copy(_rawPos);
    this.smoothLook.copy(_rawLook);
    this.smoothRoll = 0;
    this.initializedFilter = true;

    camera.position.copy(this.smoothPos);
    _lookMat.lookAt(this.smoothPos, this.smoothLook, _upVec);
    camera.quaternion.setFromRotationMatrix(_lookMat);
  }

  /**
   * Advances the drone tour by dt seconds and smoothly updates the camera transform.
   * Returns true if the tour state changed (e.g., completed at sky finale).
   */
  public update(dt: number, camera: THREE.PerspectiveCamera): boolean {
    if (!this.active) return false;

    let statusChanged = false;
    if (!this.paused && !this.completed) {
      this.elapsed += dt * this.speed;
      if (this.elapsed >= TOTAL_TOUR_DURATION) {
        this.elapsed = TOTAL_TOUR_DURATION;
        this.completed = true;
        statusChanged = true;
      }
    }

    const bankScale = this.sampleAtTime(this.elapsed, _rawPos, _rawLook);

    if (!this.initializedFilter) {
      this.smoothPos.copy(_rawPos);
      this.smoothLook.copy(_rawLook);
      this.smoothRoll = 0;
      this.initializedFilter = true;
    } else {
      const posLambda = this.completed ? 4.5 : 7.2;
      const lookLambda = this.completed ? 4.5 : 5.8;
      this.smoothPos.x = THREE.MathUtils.damp(this.smoothPos.x, _rawPos.x, posLambda, dt);
      this.smoothPos.y = THREE.MathUtils.damp(this.smoothPos.y, _rawPos.y, posLambda, dt);
      this.smoothPos.z = THREE.MathUtils.damp(this.smoothPos.z, _rawPos.z, posLambda, dt);

      this.smoothLook.x = THREE.MathUtils.damp(this.smoothLook.x, _rawLook.x, lookLambda, dt);
      this.smoothLook.y = THREE.MathUtils.damp(this.smoothLook.y, _rawLook.y, lookLambda, dt);
      this.smoothLook.z = THREE.MathUtils.damp(this.smoothLook.z, _rawLook.z, lookLambda, dt);
    }

    // Compute subtle realistic cinema drone roll/banking on wide turns (strictly 0 in doorways/hover)
    let targetRoll = 0;
    if (!this.paused && !this.completed && bankScale > 0.01) {
      this.sampleAtTime(Math.max(0, this.elapsed - 0.35), _prevPos, _aheadDir);
      this.sampleAtTime(Math.min(TOTAL_TOUR_DURATION, this.elapsed + 0.35), _aheadPos, _aheadDir);
      _velDir.subVectors(_rawPos, _prevPos).setY(0);
      _aheadDir.subVectors(_aheadPos, _rawPos).setY(0);
      if (_velDir.lengthSq() > 0.01 && _aheadDir.lengthSq() > 0.01) {
        _velDir.normalize();
        _aheadDir.normalize();
        _turnCross.crossVectors(_velDir, _aheadDir);
        targetRoll = THREE.MathUtils.clamp(_turnCross.y * 0.14 * bankScale, -0.055, 0.055);
      }
    }
    this.smoothRoll = THREE.MathUtils.damp(this.smoothRoll, targetRoll, 4.2, dt);

    camera.position.copy(this.smoothPos);
    _lookMat.lookAt(this.smoothPos, this.smoothLook, _upVec);
    _targetQuat.setFromRotationMatrix(_lookMat);

    if (Math.abs(this.smoothRoll) > 0.0002) {
      _bankQuat.setFromAxisAngle(_zAxis, this.smoothRoll);
      _targetQuat.multiply(_bankQuat);
    }
    camera.quaternion.copy(_targetQuat);

    return statusChanged;
  }
}
