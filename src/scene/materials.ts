import * as THREE from 'three';
import { PALETTE } from '../data/venueData';
import { ProceduralTextureSet } from './textures';

export interface VenueMaterials {
  ivoryMarble: THREE.MeshPhysicalMaterial;
  ivoryFloor: THREE.MeshPhysicalMaterial;
  charcoalMarble: THREE.MeshPhysicalMaterial;
  travertineFacade: THREE.MeshStandardMaterial;
  beigeWall: THREE.MeshStandardMaterial;
  walnutWood: THREE.MeshStandardMaterial;
  champagneGold: THREE.MeshPhysicalMaterial;
  brassOrnate: THREE.MeshPhysicalMaterial;
  darkBronze: THREE.MeshStandardMaterial;
  mashrabiyaGold: THREE.MeshPhysicalMaterial;
  upholsteryBeige: THREE.MeshPhysicalMaterial;
  upholsteryIvory: THREE.MeshPhysicalMaterial;
  upholsteryWalnut: THREE.MeshPhysicalMaterial;
  saduPillow: THREE.MeshStandardMaterial;
  silkDrape: THREE.MeshPhysicalMaterial;
  silkChampagne: THREE.MeshPhysicalMaterial;
  royalCarpet: THREE.MeshStandardMaterial;
  redVelvetCarpet: THREE.MeshStandardMaterial;
  archGlass: THREE.MeshPhysicalMaterial;
  mirrorGlass: THREE.MeshPhysicalMaterial;
  crystal: THREE.MeshPhysicalMaterial;
  water: THREE.MeshPhysicalMaterial;
  warmEmissive: THREE.MeshStandardMaterial;
  fairyLightGlow: THREE.MeshStandardMaterial;
  candleWax: THREE.MeshPhysicalMaterial;
  candleFlame: THREE.MeshStandardMaterial;
  runwayGlass: THREE.MeshPhysicalMaterial;
  balloonIvory: THREE.MeshPhysicalMaterial;
  balloonGold: THREE.MeshPhysicalMaterial;
  balloonPearl: THREE.MeshPhysicalMaterial;
  asphalt: THREE.MeshStandardMaterial;
  limestonePlaza: THREE.MeshStandardMaterial;
  desertSand: THREE.MeshStandardMaterial;
  grass: THREE.MeshStandardMaterial;
  palmTrunk: THREE.MeshStandardMaterial;
  palmFrond: THREE.MeshStandardMaterial;
  floralWhite: THREE.MeshStandardMaterial;
  floralBlush: THREE.MeshStandardMaterial;
  floralGoldAccent: THREE.MeshStandardMaterial;
  floralLeaf: THREE.MeshStandardMaterial;
  foodSaffronRice: THREE.MeshStandardMaterial;
  foodRoastedMeat: THREE.MeshStandardMaterial;
  foodPastryBerry: THREE.MeshStandardMaterial;
  foodChocolate: THREE.MeshStandardMaterial;
  foodSaladFresh: THREE.MeshStandardMaterial;
  foodDatesGlossy: THREE.MeshPhysicalMaterial;
  exitSignGreen: THREE.MeshStandardMaterial;
  chrome: THREE.MeshPhysicalMaterial;
  stainlessSteel: THREE.MeshStandardMaterial;
  ledBezel: THREE.MeshStandardMaterial;
  contactShadow: THREE.MeshBasicMaterial;
  sparklePoints: THREE.PointsMaterial;
  carPaints: THREE.MeshPhysicalMaterial[];
  carGlass: THREE.MeshPhysicalMaterial;
  carTire: THREE.MeshStandardMaterial;
  headlight: THREE.MeshStandardMaterial;
  taillight: THREE.MeshStandardMaterial;
  dispose: () => void;
}

export function createVenueMaterials(
  tex: ProceduralTextureSet,
  isSoftwareGl: boolean,
): VenueMaterials {
  const ivoryMarble = new THREE.MeshPhysicalMaterial({
    color: 0xf4ede0,
    map: tex.ivoryMarble,
    bumpMap: tex.ivoryMarbleBump,
    bumpScale: 0.036,
    roughness: 0.24,
    metalness: 0.03,
    clearcoat: 0.65,
    clearcoatRoughness: 0.14,
    envMapIntensity: 0.56,
  });

  const ivoryFloor = new THREE.MeshPhysicalMaterial({
    color: 0xf0e7d8,
    map: tex.marbleFloorTile,
    bumpMap: tex.marbleFloorBump,
    bumpScale: 0.035,
    roughnessMap: tex.marbleFloorRoughness,
    roughness: 0.52,
    metalness: 0.07,
    clearcoat: 0.72,
    clearcoatRoughness: 0.12,
    envMapIntensity: 0.68,
  });

  const charcoalMarble = new THREE.MeshPhysicalMaterial({
    color: 0xe6e2da,
    map: tex.charcoalMarble,
    roughness: 0.16,
    metalness: 0.1,
    clearcoat: 0.9,
    clearcoatRoughness: 0.08,
    envMapIntensity: 0.95,
  });

  const travertineFacade = new THREE.MeshStandardMaterial({
    color: 0xe4d7c2,
    map: tex.travertine,
    bumpMap: tex.travertineBump,
    bumpScale: 0.06,
    roughness: 0.74,
    metalness: 0.02,
    envMapIntensity: 0.34,
  });

  const beigeWall = new THREE.MeshStandardMaterial({
    color: 0xc2b098,
    map: tex.travertine,
    bumpMap: tex.travertineBump,
    bumpScale: 0.042,
    roughness: 0.7,
    metalness: 0.02,
    envMapIntensity: 0.32,
  });

  const walnutWood = new THREE.MeshStandardMaterial({
    color: 0xe8dfd5,
    map: tex.walnutWood,
    bumpMap: tex.walnutBump,
    bumpScale: 0.07,
    roughness: 0.44,
    metalness: 0.06,
    envMapIntensity: 0.48,
  });

  const champagneGold = new THREE.MeshPhysicalMaterial({
    color: 0xc8a164,
    metalness: 0.92,
    roughness: 0.2,
    anisotropy: 0.7,
    clearcoat: 0.4,
    clearcoatRoughness: 0.18,
    envMapIntensity: 1.4,
  });

  const brassOrnate = new THREE.MeshPhysicalMaterial({
    color: 0xd4a44a,
    metalness: 0.94,
    roughness: 0.18,
    clearcoat: 0.45,
    clearcoatRoughness: 0.16,
    envMapIntensity: 1.5,
  });

  const darkBronze = new THREE.MeshStandardMaterial({
    color: 0x2b2018,
    metalness: 0.84,
    roughness: 0.32,
    envMapIntensity: 0.9,
  });

  const mashrabiyaGold = new THREE.MeshPhysicalMaterial({
    color: 0xc89f60,
    alphaMap: tex.mashrabiyaAlpha,
    alphaTest: 0.45,
    side: THREE.DoubleSide,
    metalness: 0.9,
    roughness: 0.24,
    envMapIntensity: 1.3,
  });

  const upholsteryBeige = new THREE.MeshPhysicalMaterial({
    color: 0xcbb89e,
    map: tex.fabricWeave,
    bumpMap: tex.fabricBump,
    bumpScale: 0.05,
    roughness: 0.86,
    metalness: 0.0,
    sheen: 0.7,
    sheenRoughness: 0.56,
    sheenColor: new THREE.Color(0xf0dec4),
    envMapIntensity: 0.26,
  });

  const upholsteryIvory = new THREE.MeshPhysicalMaterial({
    color: 0xe6dccb,
    map: tex.fabricWeave,
    bumpMap: tex.fabricBump,
    bumpScale: 0.045,
    roughness: 0.84,
    metalness: 0.0,
    sheen: 0.72,
    sheenRoughness: 0.54,
    sheenColor: new THREE.Color(0xf8f0e4),
    envMapIntensity: 0.26,
  });

  const upholsteryWalnut = new THREE.MeshPhysicalMaterial({
    color: 0x5c4030,
    map: tex.fabricWeave,
    bumpMap: tex.fabricBump,
    bumpScale: 0.045,
    roughness: 0.84,
    sheen: 0.62,
    sheenColor: new THREE.Color(0xc7a572),
    envMapIntensity: 0.3,
  });

  const saduPillow = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: tex.saduAccent,
    bumpMap: tex.fabricBump,
    bumpScale: 0.035,
    roughness: 0.88,
    metalness: 0.04,
    envMapIntensity: 0.24,
  });

  const silkDrape = new THREE.MeshPhysicalMaterial({
    color: 0xf4ece0,
    map: tex.silkDrape,
    bumpMap: tex.silkDrapeBump,
    bumpScale: 0.09,
    roughness: 0.62,
    metalness: 0.02,
    sheen: 0.85,
    sheenRoughness: 0.42,
    sheenColor: new THREE.Color(0xfff5e4),
    side: THREE.DoubleSide,
    envMapIntensity: 0.36,
  });

  const silkChampagne = new THREE.MeshPhysicalMaterial({
    color: 0xdcc5a0,
    map: tex.silkDrape,
    bumpMap: tex.silkDrapeBump,
    bumpScale: 0.08,
    roughness: 0.55,
    metalness: 0.08,
    sheen: 0.9,
    sheenRoughness: 0.38,
    sheenColor: new THREE.Color(0xf8e5c2),
    side: THREE.DoubleSide,
    envMapIntensity: 0.48,
  });

  const royalCarpet = new THREE.MeshStandardMaterial({
    color: 0xece4d8,
    map: tex.carpetRoyal,
    roughness: 0.94,
    metalness: 0.02,
    envMapIntensity: 0.2,
  });

  const redVelvetCarpet = new THREE.MeshStandardMaterial({
    color: 0x6b1822,
    map: tex.fabricWeave,
    roughness: 0.92,
    metalness: 0.02,
    envMapIntensity: 0.2,
  });

  const archGlass = new THREE.MeshPhysicalMaterial({
    color: 0xb8cdd6,
    metalness: 0.1,
    roughness: 0.06,
    transmission: isSoftwareGl ? 0 : 0.8,
    transparent: true,
    opacity: isSoftwareGl ? 0.36 : 0.94,
    ior: 1.52,
    thickness: 0.25,
    clearcoat: 1.0,
    depthWrite: false,
    envMapIntensity: 1.25,
  });

  const mirrorGlass = new THREE.MeshPhysicalMaterial({
    color: 0xdde5ec,
    metalness: 0.98,
    roughness: 0.04,
    clearcoat: 1.0,
    envMapIntensity: 1.5,
  });

  const crystal = new THREE.MeshPhysicalMaterial({
    color: 0xfff7e8,
    emissive: new THREE.Color(0xffd388),
    emissiveIntensity: 0.48,
    metalness: 0.16,
    roughness: 0.04,
    transmission: isSoftwareGl ? 0 : 0.78,
    transparent: true,
    opacity: isSoftwareGl ? 0.88 : 0.96,
    ior: 2.2,
    thickness: 0.45,
    clearcoat: 1.0,
    envMapIntensity: 1.8,
  });

  const water = new THREE.MeshPhysicalMaterial({
    color: 0x367d90,
    metalness: 0.14,
    roughness: 0.07,
    transmission: isSoftwareGl ? 0 : 0.75,
    transparent: true,
    opacity: isSoftwareGl ? 0.76 : 0.92,
    ior: 1.33,
    clearcoat: 1.0,
    envMapIntensity: 1.35,
  });

  const warmEmissive = new THREE.MeshStandardMaterial({
    color: 0xfff0d6,
    emissive: new THREE.Color(0xffcc7a),
    emissiveIntensity: 1.25,
    roughness: 0.22,
  });

  const fairyLightGlow = new THREE.MeshStandardMaterial({
    color: 0xfff6e0,
    emissive: new THREE.Color(0xffd27d),
    emissiveIntensity: 1.85,
    roughness: 0.15,
  });

  const candleWax = new THREE.MeshPhysicalMaterial({
    color: 0xf7efe0,
    roughness: 0.42,
    metalness: 0.0,
    clearcoat: 0.25,
    envMapIntensity: 0.3,
  });

  const candleFlame = new THREE.MeshStandardMaterial({
    color: 0xfff2be,
    emissive: new THREE.Color(0xffa73b),
    emissiveIntensity: 2.4,
    roughness: 0.1,
  });

  const runwayGlass = new THREE.MeshPhysicalMaterial({
    color: 0xeee4d2,
    emissive: new THREE.Color(0xe0b068),
    emissiveIntensity: 0.38,
    roughness: 0.12,
    metalness: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    envMapIntensity: 0.85,
  });

  const balloonIvory = new THREE.MeshPhysicalMaterial({
    color: 0xf4ecdf,
    roughness: 0.18,
    metalness: 0.06,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    envMapIntensity: 0.9,
  });

  const balloonGold = new THREE.MeshPhysicalMaterial({
    color: 0xd9b372,
    roughness: 0.14,
    metalness: 0.86,
    clearcoat: 0.9,
    clearcoatRoughness: 0.06,
    envMapIntensity: 1.5,
  });

  const balloonPearl = new THREE.MeshPhysicalMaterial({
    color: 0xfbf8f2,
    roughness: 0.15,
    metalness: 0.14,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    iridescence: 0.35,
    envMapIntensity: 1.1,
  });

  const asphalt = new THREE.MeshStandardMaterial({
    color: 0xd2d2d6,
    map: tex.asphalt,
    roughness: 0.9,
    metalness: 0.04,
    envMapIntensity: 0.24,
  });

  const limestonePlaza = new THREE.MeshStandardMaterial({
    color: 0xded2be,
    map: tex.limestonePaver,
    bumpMap: tex.limestonePaverBump,
    bumpScale: 0.048,
    roughness: 0.76,
    metalness: 0.03,
    envMapIntensity: 0.3,
  });

  const desertSand = new THREE.MeshStandardMaterial({
    color: 0xbda382,
    roughness: 0.96,
    metalness: 0.0,
    envMapIntensity: 0.16,
  });

  const grass = new THREE.MeshStandardMaterial({
    color: 0x37552d,
    roughness: 0.92,
    metalness: 0.0,
    envMapIntensity: 0.18,
  });

  const palmTrunk = new THREE.MeshStandardMaterial({
    color: 0x58402e,
    roughness: 0.94,
    metalness: 0.0,
    envMapIntensity: 0.15,
  });

  const palmFrond = new THREE.MeshStandardMaterial({
    color: 0x2b4e25,
    roughness: 0.66,
    metalness: 0.04,
    side: THREE.DoubleSide,
    envMapIntensity: 0.26,
  });

  const floralWhite = new THREE.MeshStandardMaterial({
    color: 0xf6efe4,
    roughness: 0.64,
    metalness: 0.0,
    envMapIntensity: 0.25,
  });

  const floralBlush = new THREE.MeshStandardMaterial({
    color: 0xe3c2b0,
    roughness: 0.66,
    metalness: 0.0,
    envMapIntensity: 0.25,
  });

  const floralGoldAccent = new THREE.MeshStandardMaterial({
    color: 0xd6b472,
    roughness: 0.38,
    metalness: 0.62,
    envMapIntensity: 0.95,
  });

  const floralLeaf = new THREE.MeshStandardMaterial({
    color: 0x2f4d2b,
    roughness: 0.66,
    metalness: 0.02,
    envMapIntensity: 0.24,
  });

  const foodSaffronRice = new THREE.MeshStandardMaterial({
    color: 0xd89c36,
    roughness: 0.75,
    metalness: 0.02,
  });

  const foodRoastedMeat = new THREE.MeshStandardMaterial({
    color: 0x6e351a,
    roughness: 0.45,
    metalness: 0.05,
  });

  const foodPastryBerry = new THREE.MeshStandardMaterial({
    color: 0xb02432,
    roughness: 0.28,
    metalness: 0.04,
  });

  const foodChocolate = new THREE.MeshStandardMaterial({
    color: 0x3b2012,
    roughness: 0.32,
    metalness: 0.06,
  });

  const foodSaladFresh = new THREE.MeshStandardMaterial({
    color: 0x4b7a2c,
    roughness: 0.65,
    metalness: 0.0,
  });

  const foodDatesGlossy = new THREE.MeshPhysicalMaterial({
    color: 0x4b2410,
    roughness: 0.25,
    metalness: 0.04,
    clearcoat: 0.8,
    clearcoatRoughness: 0.16,
  });

  const exitSignGreen = new THREE.MeshStandardMaterial({
    color: 0x16a34a,
    emissive: new THREE.Color(0x22c55e),
    emissiveIntensity: 1.1,
    roughness: 0.3,
  });

  const chrome = new THREE.MeshPhysicalMaterial({
    color: 0xe2e6ec,
    metalness: 0.98,
    roughness: 0.08,
    clearcoat: 0.6,
    envMapIntensity: 1.5,
  });

  const stainlessSteel = new THREE.MeshStandardMaterial({
    color: 0xb6bcc4,
    metalness: 0.9,
    roughness: 0.26,
    envMapIntensity: 0.95,
  });

  const ledBezel = new THREE.MeshStandardMaterial({
    color: PALETTE.charcoal,
    metalness: 0.65,
    roughness: 0.36,
    envMapIntensity: 0.55,
  });

  const contactShadow = new THREE.MeshBasicMaterial({
    map: tex.contactShadow,
    transparent: true,
    opacity: 0.62,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });

  const sparklePoints = new THREE.PointsMaterial({
    color: 0xffe4ad,
    map: tex.sparkleSprite,
    size: 0.24,
    transparent: true,
    opacity: 0.72,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const carColors = [
    0x0e1014, // Obsidian Black (Rolls-Royce / Mercedes)
    0xeae4da, // English White Pearl (Bentley / Rolls-Royce)
    0x2c3239, // Graphite Metallic (Range Rover)
    0x4a382b, // Espresso Champagne Bronze (Lexus LX)
    0x131f30, // Royal Midnight Sapphire (BMW 7 / S-Class)
    0xa9967a, // Arabian Desert Champagne (Bentley / Range Rover)
    0x14261c, // British Racing Emerald
    0x6e757e, // Selenite Silver Metallic
  ];
  const carPaints = carColors.map(
    (c) =>
      new THREE.MeshPhysicalMaterial({
        color: c,
        metalness: 0.78,
        roughness: 0.18,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        envMapIntensity: 1.45,
      }),
  );

  const carGlass = new THREE.MeshPhysicalMaterial({
    color: 0x0b0f14,
    metalness: 0.22,
    roughness: 0.05,
    clearcoat: 1.0,
    envMapIntensity: 1.6,
  });

  const carTire = new THREE.MeshStandardMaterial({
    color: 0x161618,
    roughness: 0.88,
    metalness: 0.04,
    envMapIntensity: 0.2,
  });

  const headlight = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: new THREE.Color(0xfff1d4),
    emissiveIntensity: 1.4,
    roughness: 0.1,
  });

  const taillight = new THREE.MeshStandardMaterial({
    color: 0x9c1414,
    emissive: new THREE.Color(0xff2222),
    emissiveIntensity: 1.25,
    roughness: 0.14,
  });

  const allMats: THREE.Material[] = [
    ivoryMarble,
    ivoryFloor,
    charcoalMarble,
    travertineFacade,
    beigeWall,
    walnutWood,
    champagneGold,
    brassOrnate,
    darkBronze,
    mashrabiyaGold,
    upholsteryBeige,
    upholsteryIvory,
    upholsteryWalnut,
    saduPillow,
    silkDrape,
    silkChampagne,
    royalCarpet,
    redVelvetCarpet,
    archGlass,
    mirrorGlass,
    crystal,
    water,
    warmEmissive,
    fairyLightGlow,
    candleWax,
    candleFlame,
    runwayGlass,
    balloonIvory,
    balloonGold,
    balloonPearl,
    asphalt,
    limestonePlaza,
    desertSand,
    grass,
    palmTrunk,
    palmFrond,
    floralWhite,
    floralBlush,
    floralGoldAccent,
    floralLeaf,
    foodSaffronRice,
    foodRoastedMeat,
    foodPastryBerry,
    foodChocolate,
    foodSaladFresh,
    foodDatesGlossy,
    exitSignGreen,
    chrome,
    stainlessSteel,
    ledBezel,
    contactShadow,
    sparklePoints,
    carGlass,
    carTire,
    headlight,
    taillight,
    ...carPaints,
  ];

  return {
    ivoryMarble,
    ivoryFloor,
    charcoalMarble,
    travertineFacade,
    beigeWall,
    walnutWood,
    champagneGold,
    brassOrnate,
    darkBronze,
    mashrabiyaGold,
    upholsteryBeige,
    upholsteryIvory,
    upholsteryWalnut,
    saduPillow,
    silkDrape,
    silkChampagne,
    royalCarpet,
    redVelvetCarpet,
    archGlass,
    mirrorGlass,
    crystal,
    water,
    warmEmissive,
    fairyLightGlow,
    candleWax,
    candleFlame,
    runwayGlass,
    balloonIvory,
    balloonGold,
    balloonPearl,
    asphalt,
    limestonePlaza,
    desertSand,
    grass,
    palmTrunk,
    palmFrond,
    floralWhite,
    floralBlush,
    floralGoldAccent,
    floralLeaf,
    foodSaffronRice,
    foodRoastedMeat,
    foodPastryBerry,
    foodChocolate,
    foodSaladFresh,
    foodDatesGlossy,
    exitSignGreen,
    chrome,
    stainlessSteel,
    ledBezel,
    contactShadow,
    sparklePoints,
    carPaints,
    carGlass,
    carTire,
    headlight,
    taillight,
    dispose: () => {
      allMats.forEach((m) => m.dispose());
    },
  };
}
