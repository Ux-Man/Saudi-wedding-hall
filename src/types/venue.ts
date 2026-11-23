import type * as THREE from 'three';

export type Language = 'en' | 'ar';

export type CameraMode = 'walk' | 'drone' | 'floorplan';

export type LightingMode = 'daylight' | 'sunset' | 'night' | 'wedding' | 'preparation';

export type QualityPreset = 'performance' | 'high' | 'ultra';

export type ZoneId =
  | 'exterior'
  | 'parking'
  | 'mens-entrance'
  | 'mens-hall'
  | 'womens-entrance'
  | 'womens-hall'
  | 'bridal-suite'
  | 'mens-dining'
  | 'womens-dining'
  | 'mens-restrooms'
  | 'womens-restrooms'
  | 'kitchen';

export interface ZoneDefinition {
  id: ZoneId;
  category: 'exterior' | 'mens' | 'womens' | 'service';
  nameEn: string;
  nameAr: string;
  subtitleEn: string;
  subtitleAr: string;
  cameraPos: [number, number, number];
  lookAt: [number, number, number];
  walkPos: [number, number, number];
  walkYaw: number;
  floorPlanPin: { x: number; z: number };
}

export type ScreenContentType =
  | 'welcome'
  | 'announcement'
  | 'promo'
  | 'monogram'
  | 'mp4'
  | 'youtube';

export interface ScreenConfig {
  id: string;
  zoneId: ZoneId;
  nameEn: string;
  nameAr: string;
  contentType: ScreenContentType;
  groomNameEn: string;
  groomNameAr: string;
  brideNameEn: string;
  brideNameAr: string;
  headlineEn: string;
  headlineAr: string;
  sublineEn: string;
  sublineAr: string;
  eventDate: string;
  accentColor: string;
  mp4Url?: string;
  mp4FileName?: string;
  youtubeUrl?: string;
  youtubeId?: string;
  isPlaying: boolean;
}

export interface PointOfInterest {
  id: string;
  zoneId: ZoneId;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  position: [number, number, number];
  cameraPos: [number, number, number];
  lookAt: [number, number, number];
  linkedScreenId?: string;
}

export interface AABBCollider {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  isDoor?: boolean;
  doorId?: string;
}

export interface InteractiveDoor {
  id: string;
  nameEn: string;
  nameAr: string;
  type: 'slide' | 'swing';
  center: THREE.Vector3;
  axis: 'x' | 'z';
  isOpen: boolean;
  manualOverride: boolean;
  openProgress: number;
  leftLeaf: THREE.Object3D;
  rightLeaf: THREE.Object3D;
  leftClosedPos: number;
  rightClosedPos: number;
  slideDistance: number;
  colliderIndex?: number;
}

export interface CouplePlaqueHandle {
  updateNames: (groomAr: string, brideAr: string, groomEn: string, brideEn: string, eventDate: string) => void;
  dispose: () => void;
}

export interface BuildContext {
  scene: THREE.Scene;
  colliders: AABBCollider[];
  doors: InteractiveDoor[];
  interactables: THREE.Object3D[];
  roofs: THREE.Object3D[];
  couplePlaques: CouplePlaqueHandle[];
  dynamicLights: {
    exteriorLamps: THREE.PointLight[];
    interiorChandeliers: THREE.PointLight[];
    stageSpots: THREE.SpotLight[];
    prepLights: THREE.PointLight[];
    emissiveFixtures: THREE.MeshStandardMaterial[];
  };
  animatedObjects: {
    fountainJets: THREE.Mesh[];
    fountainRings: THREE.Mesh[];
    waterSurface?: THREE.Mesh;
    crystalGroups: THREE.Object3D[];
    sparkleSystems: THREE.Points[];
    movingSpots: { light: THREE.SpotLight; baseX: number; baseZ: number; phase: number; amp: number }[];
    candleFlames: THREE.Object3D[];
  };
  registerScreenMesh: (
    screenId: string,
    mesh: THREE.Mesh,
    cameraPos: [number, number, number],
    lookAt: [number, number, number],
  ) => void;
}

export interface CinematicChapter {
  id: string;
  tStart: number;
  zoneId: ZoneId;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
}

export interface CinematicTourState {
  active: boolean;
  paused: boolean;
  completed: boolean;
  progress: number;
  speed: number;
  chapterIndex: number;
  chapterTitleEn: string;
  chapterTitleAr: string;
  chapterSubtitleEn: string;
  chapterSubtitleAr: string;
}

