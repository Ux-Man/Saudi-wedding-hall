import * as THREE from 'three';
import { BuildContext } from '../types/venue';
import {
  addWall,
  addWallWithDoorwayX,
  createFramedLEDScreen,
  createInteractiveDoubleDoor,
  FLOOR_Y,
} from './archHelpers';
import { VenueMaterials } from './materials';
import {
  createBacklitCouplePlaque,
  createBollardLamp,
  createDatePalm,
  createFairyLightCanopy,
  createFloralArrangement,
  createFloralEntranceArch,
  createLuxuryVehicle,
  createSculptedColumn,
  createSignTexture,
  createWeddingBalloonArch,
} from './props';

export function buildExteriorAndParking(ctx: BuildContext, mats: VenueMaterials): THREE.Group {
  const group = new THREE.Group();
  group.name = 'ExteriorZone';

  // 1. Extended Desert Limestone Ground (seamlessly blends into horizon fog)
  const desertGround = new THREE.Mesh(new THREE.PlaneGeometry(460, 460), mats.desertSand);
  desertGround.rotation.x = -Math.PI / 2;
  desertGround.position.y = -0.05;
  desertGround.receiveShadow = true;
  group.add(desertGround);

  // Grand Limestone Entry Plaza & Walkways (Z: 24 to 54)
  const plaza = new THREE.Mesh(new THREE.BoxGeometry(108, 0.12, 34), mats.limestonePlaza);
  plaza.position.set(0, 0.02, 41);
  plaza.receiveShadow = true;
  group.add(plaza);

  // Sweeping Grand Asphalt Driveway & Landscaped Parking Lot (Z: 30 to 84)
  const parkingLot = new THREE.Mesh(new THREE.BoxGeometry(116, 0.08, 34), mats.asphalt);
  parkingLot.position.set(0, 0.0, 68);
  parkingLot.receiveShadow = true;
  group.add(parkingLot);

  const driveStripMain = new THREE.Mesh(new THREE.BoxGeometry(84, 0.09, 8.8), mats.asphalt);
  driveStripMain.position.set(0, 0.01, 34.5);
  driveStripMain.receiveShadow = true;
  group.add(driveStripMain);

  for (const sx of [-38, 38]) {
    const connector = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.09, 26), mats.asphalt);
    connector.position.set(sx, 0.01, 46);
    connector.receiveShadow = true;
    group.add(connector);
  }

  // Crisp Painted Parking Stall Lines & Champagne Curb Stops
  const lineGeo = new THREE.BoxGeometry(0.14, 0.02, 5.4);
  const stopGeo = new THREE.BoxGeometry(2.1, 0.11, 0.18);
  const stallRows = [58.5, 73.5];
  for (const rz of stallRows) {
    for (let x = -46; x <= 46; x += 3.6) {
      if (Math.abs(x) < 4.5) continue;
      const line = new THREE.Mesh(lineGeo, mats.ivoryMarble);
      line.position.set(x, 0.055, rz);
      group.add(line);

      if (x < 44 && Math.abs(x + 1.8) > 4.5) {
        const stop = new THREE.Mesh(stopGeo, mats.travertineFacade);
        stop.position.set(x + 1.8, 0.09, rz + (rz < 65 ? -2.35 : 2.35));
        group.add(stop);
      }
    }
  }

  // Sculpted Limestone Curb Islands, Landscaped Lawn Beds & Trimmed Topiary Shrubs
  const lawnPositions: [number, number, number, number][] = [
    [-48, 36, 12, 22],
    [48, 36, 12, 22],
    [-26, 48, 20, 7],
    [26, 48, 20, 7],
    [0, 66, 8, 24],
  ];
  for (const [lx, lz, lw, ld] of lawnPositions) {
    const curb = new THREE.Mesh(new THREE.BoxGeometry(lw + 0.55, 0.24, ld + 0.55), mats.travertineFacade);
    curb.position.set(lx, 0.12, lz);
    group.add(curb);

    const lawn = new THREE.Mesh(new THREE.BoxGeometry(lw, 0.26, ld), mats.grass);
    lawn.position.set(lx, 0.14, lz);
    lawn.receiveShadow = true;
    group.add(lawn);
  }

  // Low Ornamental Boxwood Hedges & Floral Planters framing Plaza
  for (const sx of [-17, -14, 14, 17]) {
    const planter = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.55, 1.2), mats.ivoryMarble);
    planter.position.set(sx, 0.34, 41.2);
    group.add(planter);
    const goldBand = new THREE.Mesh(new THREE.BoxGeometry(2.26, 0.06, 1.26), mats.champagneGold);
    goldBand.position.set(sx, 0.56, 41.2);
    group.add(goldBand);
    const floral = createFloralArrangement(mats, 0.95, false);
    floral.position.set(sx, 0.72, 41.2);
    group.add(floral);
  }

  // Perimeter Contemporary Saudi Najdi Compound Walls with Brass Finials
  addWall(group, ctx, -58, 1.3, 46, 0.6, 2.6, 74, mats.travertineFacade, true);
  addWall(group, ctx, 58, 1.3, 46, 0.6, 2.6, 74, mats.travertineFacade, true);
  addWall(group, ctx, -34, 1.3, 84, 48, 2.6, 0.6, mats.travertineFacade, true);
  addWall(group, ctx, 34, 1.3, 84, 48, 2.6, 0.6, mats.travertineFacade, true);

  // Monumental Boulevard Entry Gate Pillars (Z = 84) with Lantern Finials
  for (const sx of [-10, 10]) {
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(1.9, 5.4, 1.9), mats.travertineFacade);
    pillar.position.set(sx, 2.7, 84);
    pillar.castShadow = true;
    group.add(pillar);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.32, 2.25), mats.champagneGold);
    cap.position.set(sx, 5.5, 84);
    group.add(cap);
    const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.28, 0.75, 8), mats.warmEmissive);
    lantern.position.set(sx, 6.0, 84);
    group.add(lantern);
  }

  // 2. Central Grand Reflecting Fountain (X = 0, Z = 48) with Animated Shimmering Rings
  const fountainGroup = new THREE.Group();
  fountainGroup.position.set(0, 0.08, 48);

  const outerBasinWall = new THREE.Mesh(new THREE.TorusGeometry(5.6, 0.44, 16, 48), mats.ivoryMarble);
  outerBasinWall.rotation.x = Math.PI / 2;
  outerBasinWall.position.y = 0.48;
  fountainGroup.add(outerBasinWall);

  const basinRimGold = new THREE.Mesh(new THREE.TorusGeometry(5.6, 0.11, 10, 48), mats.champagneGold);
  basinRimGold.rotation.x = Math.PI / 2;
  basinRimGold.position.y = 0.9;
  fountainGroup.add(basinRimGold);

  const waterDisk = new THREE.Mesh(new THREE.CylinderGeometry(5.4, 5.4, 0.14, 44), mats.water);
  waterDisk.position.y = 0.56;
  fountainGroup.add(waterDisk);
  ctx.animatedObjects.waterSurface = waterDisk;

  // Animated shimmering concentric water ripple rings
  for (let r = 0; r < 3; r++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.8 + r * 1.15, 0.028, 8, 36),
      mats.crystal,
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.65;
    fountainGroup.add(ring);
    ctx.animatedObjects.fountainRings.push(ring);
  }

  const tier1 = new THREE.Mesh(new THREE.CylinderGeometry(1.85, 1.45, 1.15, 28), mats.ivoryMarble);
  tier1.position.y = 0.96;
  fountainGroup.add(tier1);
  const tier2 = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 0.72, 1.1, 24), mats.champagneGold);
  tier2.position.y = 1.98;
  fountainGroup.add(tier2);

  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    const jet = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.064, 2.35, 8), mats.crystal);
    jet.position.set(Math.cos(a) * 3.0, 1.5, Math.sin(a) * 3.0);
    jet.rotation.z = Math.cos(a) * 0.25;
    jet.rotation.x = -Math.sin(a) * 0.25;
    fountainGroup.add(jet);
    ctx.animatedObjects.fountainJets.push(jet);
  }
  const centerPlume = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.15, 3.4, 12), mats.crystal);
  centerPlume.position.y = 3.28;
  fountainGroup.add(centerPlume);
  ctx.animatedObjects.fountainJets.push(centerPlume);

  const fountainLight = new THREE.PointLight(0xffd796, 14, 20, 1.6);
  fountainLight.position.set(0, 2.5, 48);
  group.add(fountainLight);
  ctx.dynamicLights.exteriorLamps.push(fountainLight);

  group.add(fountainGroup);
  ctx.colliders.push({ minX: -6.1, maxX: 6.1, minZ: 41.9, maxZ: 54.1 });

  // 3. Exterior Plaza Digital LED Monument Display (Z = 38.5)
  const monumentBase = new THREE.Mesh(new THREE.BoxGeometry(8.2, 1.25, 0.96), mats.charcoalMarble);
  monumentBase.position.set(0, 0.65, 38.5);
  monumentBase.castShadow = true;
  group.add(monumentBase);
  const monGold = new THREE.Mesh(new THREE.BoxGeometry(8.35, 0.09, 1.04), mats.champagneGold);
  monGold.position.set(0, 1.28, 38.5);
  group.add(monGold);
  ctx.colliders.push({ minX: -4.2, maxX: 4.2, minZ: 37.9, maxZ: 39.2 });

  createFramedLEDScreen(group, ctx, mats, {
    screenId: 'ext-welcome-main',
    x: 0,
    y: 3.15,
    z: 38.55,
    width: 7.4,
    height: 3.4,
    cameraPos: [0, 3.3, 47.5],
    lookAt: [0, 3.1, 38.5],
  });

  // 4. MONUMENTAL CONTEMPORARY SAUDI LUXURY PALACE FACADE (Z = +26, X: -44 to +44, Height: 12.8m)
  const podium = new THREE.Mesh(new THREE.BoxGeometry(90, FLOOR_Y, 74), mats.ivoryMarble);
  podium.position.set(0, FLOOR_Y / 2, -10);
  podium.receiveShadow = true;
  group.add(podium);

  addWallWithDoorwayX(
    group,
    ctx,
    -24,
    26,
    40,
    12.4,
    0.7,
    5.6,
    4.6,
    mats.travertineFacade,
    mats.champagneGold,
  );
  addWall(group, ctx, 0, FLOOR_Y + 6.2, 26, 8.2, 12.4, 0.85, mats.ivoryMarble, true);
  addWallWithDoorwayX(
    group,
    ctx,
    24,
    26,
    40,
    12.4,
    0.7,
    5.6,
    4.6,
    mats.travertineFacade,
    mats.champagneGold,
  );

  // Interactive Glass Double Entrance Doors (Men's West & Women's East)
  createInteractiveDoubleDoor(group, ctx, mats, {
    id: 'door-mens-main',
    nameEn: "Men's Grand Glass Entrance",
    nameAr: 'البوابة الزجاجية الرئيسية للرجال',
    x: -24,
    z: 26,
    axis: 'x',
    width: 5.5,
    height: 4.5,
    style: 'glass',
  });

  createInteractiveDoubleDoor(group, ctx, mats, {
    id: 'door-womens-main',
    nameEn: "Women's Grand Glass Entrance",
    nameAr: 'البوابة الزجاجية الرئيسية للنساء',
    x: 24,
    z: 26,
    axis: 'x',
    width: 5.5,
    height: 4.5,
    style: 'glass',
  });

  // Grand Layered Architectural Cornice, Stone Parapet Crown & Warm Facade Wash Strip
  const cornice = new THREE.Mesh(new THREE.BoxGeometry(91.2, 0.82, 2.4), mats.ivoryMarble);
  cornice.position.set(0, 12.9, 26.45);
  cornice.castShadow = true;
  group.add(cornice);

  const parapetCrown = new THREE.Mesh(new THREE.BoxGeometry(90.4, 0.65, 1.4), mats.travertineFacade);
  parapetCrown.position.set(0, 13.6, 26.35);
  group.add(parapetCrown);

  const crownGoldBand = new THREE.Mesh(new THREE.BoxGeometry(91.4, 0.24, 2.5), mats.champagneGold);
  crownGoldBand.position.set(0, 12.38, 26.5);
  group.add(crownGoldBand);

  const corniceGlow = new THREE.Mesh(new THREE.BoxGeometry(88.6, 0.11, 0.15), mats.warmEmissive);
  corniceGlow.position.set(0, 12.2, 27.25);
  group.add(corniceGlow);

  // Central Monumental Architectural Portal, Mashrabiya Bay & Unobstructed Royal Name + Couple Plaque
  const centerArchFrame = new THREE.Mesh(new THREE.BoxGeometry(10.2, 11.8, 0.85), mats.champagneGold);
  centerArchFrame.position.set(0, 6.2, 26.55);
  group.add(centerArchFrame);

  const centerBacking = new THREE.Mesh(new THREE.PlaneGeometry(8.8, 10.2), mats.charcoalMarble);
  centerBacking.position.set(0, 6.3, 27.0);
  group.add(centerBacking);

  const centerMashrabiya = new THREE.Mesh(new THREE.PlaneGeometry(8.6, 10.0), mats.mashrabiyaGold);
  centerMashrabiya.position.set(0, 6.3, 27.06);
  group.add(centerMashrabiya);

  // Palace Royal Name Sign crowning the center facade
  const palaceSignTex = createSignTexture(
    'قصر الملكية للاحتفالات',
    'QASR AL-MALAKIYA PALACE',
    '#1A1511',
    '#D4B074',
    768,
    208,
  );
  const palaceSign = new THREE.Mesh(
    new THREE.PlaneGeometry(8.2, 2.15),
    new THREE.MeshStandardMaterial({
      map: palaceSignTex,
      emissive: new THREE.Color(0xfff1d6),
      emissiveMap: palaceSignTex,
      emissiveIntensity: 0.62,
      roughness: 0.28,
    }),
  );
  palaceSign.position.set(0, 10.85, 27.22);
  group.add(palaceSign);

  // Dedicated Live-Updatable Backlit Couple Welcome Plaque on Central Exterior Portal (100% unobstructed)
  const extCouplePlaque = createBacklitCouplePlaque(ctx, mats, {
    width: 6.4,
    height: 2.2,
    subtitleAr: 'حفل زفاف · أهلاً بضيوفنا الكرام',
  });
  extCouplePlaque.position.set(0, 7.65, 27.32);
  group.add(extCouplePlaque);

  // Dark Charcoal Marble Architectural Water-Table Plinth
  for (const [bx, bw] of [
    [-35.5, 17.5],
    [-12.5, 17.5],
    [12.5, 17.5],
    [35.5, 17.5],
  ] as [number, number][]) {
    const basePlinth = new THREE.Mesh(new THREE.BoxGeometry(bw, 0.64, 0.98), mats.charcoalMarble);
    basePlinth.position.set(bx, FLOOR_Y + 0.32, 26.15);
    group.add(basePlinth);
  }

  // Soaring Sculpted Fluted Marble Colonnade Columns across Entire Palace Facade
  const pierXs = [-42, -35, -30, -18, -13, -6.4, 6.4, 13, 18, 30, 35, 42];
  for (const px of pierXs) {
    const col = createSculptedColumn(mats, 12.0, 0.52);
    col.position.set(px, FLOOR_Y, 27.05);
    group.add(col);
  }

  // Facade Sculpted Classical Arched Mashrabiya Bays between Columns
  const screenPanelsX = [-38.5, -10, 10, 38.5];
  for (const sx of screenPanelsX) {
    const bronzeFrame = new THREE.Mesh(new THREE.BoxGeometry(5.1, 9.2, 0.22), mats.darkBronze);
    bronzeFrame.position.set(sx, 6.6, 26.36);
    group.add(bronzeFrame);

    const deepBacking = new THREE.Mesh(new THREE.PlaneGeometry(4.7, 8.8), mats.charcoalMarble);
    deepBacking.position.set(sx, 6.6, 26.49);
    group.add(deepBacking);

    const lattice = new THREE.Mesh(new THREE.PlaneGeometry(4.65, 8.75), mats.mashrabiyaGold);
    lattice.position.set(sx, 6.6, 26.58);
    group.add(lattice);

    // Sculpted gilded arch crown framing each bay
    const bayArch = new THREE.Mesh(
      new THREE.TorusGeometry(2.35, 0.14, 10, 28, Math.PI),
      mats.champagneGold,
    );
    bayArch.position.set(sx, 8.85, 26.7);
    group.add(bayArch);
  }

  // 5. DUAL GRAND COVERED VALET DROP-OFF CANOPIES, FLORAL ARCHES & WEDDING BALLOON GARLANDS
  const canopies = [
    { x: -24, ar: 'مدخل الرجال · خدمة الصف', en: "MEN'S ENTRANCE · VALET", seed: 11 },
    { x: 24, ar: 'مدخل النساء · خدمة الصف', en: "WOMEN'S ENTRANCE · VALET", seed: 29 },
  ];
  for (const c of canopies) {
    const canopyRoof = new THREE.Mesh(new THREE.BoxGeometry(14.2, 0.72, 9.2), mats.ivoryMarble);
    canopyRoof.position.set(c.x, 5.45, 30.8);
    canopyRoof.castShadow = true;
    group.add(canopyRoof);

    const canopySoffit = new THREE.Mesh(new THREE.BoxGeometry(13.2, 0.14, 8.4), mats.walnutWood);
    canopySoffit.position.set(c.x, 5.05, 30.8);
    group.add(canopySoffit);

    const canopyGoldFascia = new THREE.Mesh(new THREE.BoxGeometry(14.4, 0.22, 9.4), mats.champagneGold);
    canopyGoldFascia.position.set(c.x, 5.28, 30.8);
    group.add(canopyGoldFascia);

    // Fluted sculpted columns supporting valet porte-cochère
    for (const dx of [-6.0, 6.0]) {
      const col = createSculptedColumn(mats, 5.05, 0.4);
      col.position.set(c.x + dx, 0.06, 34.6);
      group.add(col);
      ctx.colliders.push({
        minX: c.x + dx - 0.55,
        maxX: c.x + dx + 0.55,
        minZ: 34.0,
        maxZ: 35.2,
      });
    }

    // Royal Entrance Carpet Runner from Valet Drop-off straight into Glass Doors
    const carpet = new THREE.Mesh(
      new THREE.BoxGeometry(4.6, 0.03, 5.6),
      c.x < 0 ? mats.redVelvetCarpet : mats.royalCarpet,
    );
    carpet.position.set(c.x, FLOOR_Y + 0.015, 29.0);
    group.add(carpet);

    // Illuminated Floral & Fairy-Light Entrance Arch framing the Glass Portal
    const floralArch = createFloralEntranceArch(mats, 6.2, 4.85, true);
    floralArch.position.set(c.x, FLOOR_Y, 27.15);
    group.add(floralArch);

    // Organic Ivory, Pearl & Champagne-Gold Wedding Balloon Garland at Porte-Cochère Entry
    const balloonArch = createWeddingBalloonArch(mats, 6.8, 4.65, c.seed);
    balloonArch.position.set(c.x, 0.08, 30.2);
    group.add(balloonArch);

    // Lush Marble Pedestal Floral Urns flanking the Grand Entrance
    for (const fx of [-3.9, 3.9]) {
      const urn = createFloralArrangement(mats, 1.2, true, 0.95);
      urn.position.set(c.x + fx, FLOOR_Y, 27.8);
      group.add(urn);
    }

    // Directional Illuminated Valet Canopy Sign
    const signTex = createSignTexture(c.ar, c.en, '#1A1511', '#D4B074', 640, 160);
    const signMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(7.2, 1.55),
      new THREE.MeshStandardMaterial({
        map: signTex,
        emissive: new THREE.Color(0xfff1d6),
        emissiveMap: signTex,
        emissiveIntensity: 0.65,
        roughness: 0.28,
      }),
    );
    signMesh.position.set(c.x, 5.45, 35.56);
    group.add(signMesh);

    const valetLight = new THREE.PointLight(0xffdfb0, 16, 20, 1.6);
    valetLight.position.set(c.x, 4.65, 31.2);
    group.add(valetLight);
    ctx.dynamicLights.exteriorLamps.push(valetLight);

    // Valet Concierge Walnut & Marble Podium
    const valetDesk = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.15, 0.72), mats.walnutWood);
    valetDesk.position.set(c.x + (c.x < 0 ? -4.5 : 4.5), 0.65, 31.4);
    group.add(valetDesk);
    const valetTop = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.06, 0.8), mats.ivoryMarble);
    valetTop.position.set(c.x + (c.x < 0 ? -4.5 : 4.5), 1.24, 31.4);
    group.add(valetTop);
  }

  // Sparkling Warm Wedding String-Light / Fairy-Light Canopies linking Facade to Valet & Courtyard
  const exteriorStrands: [THREE.Vector3, THREE.Vector3, number][] = [];
  for (let i = 0; i < 6; i++) {
    const z = 27.4 + i * 1.4;
    exteriorStrands.push([new THREE.Vector3(-18, 5.2, z), new THREE.Vector3(-6.4, 6.4, 27.4), 0.75]);
    exteriorStrands.push([new THREE.Vector3(18, 5.2, z), new THREE.Vector3(6.4, 6.4, 27.4), 0.75]);
  }
  // Sparkling fairy light canopy spanning over Central Courtyard Plaza
  for (const sx of [-12, 12]) {
    exteriorStrands.push([new THREE.Vector3(sx, 5.4, 35), new THREE.Vector3(0, 6.2, 41), 0.8]);
    exteriorStrands.push([new THREE.Vector3(sx, 5.4, 35), new THREE.Vector3(sx * 1.35, 4.8, 48), 0.9]);
  }
  group.add(createFairyLightCanopy(mats, exteriorStrands, 14));

  // 6. ULTRA-DETAILED MULTI-BRAND LUXURY VEHICLES (Rolls-Royce, Bentley, Mercedes S-Class, Range Rover)
  const vehicles: {
    x: number;
    z: number;
    rotY: number;
    brand: 'rolls' | 'bentley' | 'mercedes' | 'rangerover';
    paint: number;
    on: boolean;
  }[] = [
    // Flagship Bridal & VIP Convoy arriving under Men's & Women's Valet Canopies
    { x: -24, z: 33.4, rotY: Math.PI / 2, brand: 'rolls', paint: 0, on: true },
    { x: 24, z: 33.4, rotY: -Math.PI / 2, brand: 'rolls', paint: 1, on: true },
    // VIP Front Row Parking (Z = 58.5)
    { x: -40.5, z: 58.5, rotY: Math.PI, brand: 'rangerover', paint: 0, on: false },
    { x: -33.3, z: 58.5, rotY: Math.PI, brand: 'bentley', paint: 5, on: false },
    { x: -26.1, z: 58.5, rotY: Math.PI, brand: 'rangerover', paint: 1, on: false },
    { x: -15.3, z: 58.5, rotY: Math.PI, brand: 'mercedes', paint: 4, on: false },
    { x: -8.1, z: 58.5, rotY: Math.PI, brand: 'rolls', paint: 2, on: false },
    { x: 8.1, z: 58.5, rotY: Math.PI, brand: 'bentley', paint: 1, on: false },
    { x: 15.3, z: 58.5, rotY: Math.PI, brand: 'rangerover', paint: 0, on: false },
    { x: 26.1, z: 58.5, rotY: Math.PI, brand: 'mercedes', paint: 7, on: false },
    { x: 33.3, z: 58.5, rotY: Math.PI, brand: 'rangerover', paint: 3, on: false },
    { x: 40.5, z: 58.5, rotY: Math.PI, brand: 'rolls', paint: 6, on: false },
    // Second Row Parking (Z = 73.5)
    { x: -36.9, z: 73.5, rotY: 0, brand: 'mercedes', paint: 4, on: false },
    { x: -22.5, z: 73.5, rotY: 0, brand: 'rangerover', paint: 5, on: false },
    { x: -11.7, z: 73.5, rotY: 0, brand: 'bentley', paint: 1, on: false },
    { x: 11.7, z: 73.5, rotY: 0, brand: 'rangerover', paint: 0, on: false },
    { x: 22.5, z: 73.5, rotY: 0, brand: 'mercedes', paint: 3, on: false },
    { x: 36.9, z: 73.5, rotY: 0, brand: 'rolls', paint: 2, on: false },
  ];

  for (const v of vehicles) {
    const car = createLuxuryVehicle(mats, v.brand, v.paint, v.on);
    car.position.set(v.x, 0.05, v.z);
    car.rotation.y = v.rotY;
    group.add(car);
    const isSideways = Math.abs(Math.sin(v.rotY)) > 0.7;
    const rx = isSideways ? 2.75 : 1.12;
    const rz = isSideways ? 1.12 : 2.75;
    ctx.colliders.push({ minX: v.x - rx, maxX: v.x + rx, minZ: v.z - rz, maxZ: v.z + rz });
  }

  // 7. ARCHITECTURAL DATE PALMS & ILLUMINATED PATHWAY BOLLARDS
  const palmLocations: [number, number, number][] = [
    [-48, 30, 9.2],
    [-48, 42, 8.6],
    [48, 30, 9.0],
    [48, 42, 8.8],
    [-32, 48, 8.2],
    [-20, 48, 9.4],
    [20, 48, 9.1],
    [32, 48, 8.4],
    [0, 59, 9.6],
    [0, 68, 8.8],
    [0, 77, 9.2],
    [-51, 62, 8.5],
    [51, 62, 8.7],
    [-51, 75, 9.0],
    [51, 75, 8.4],
  ];
  palmLocations.forEach(([px, pz, ph], idx) => {
    const palm = createDatePalm(mats, ph, idx + 1);
    palm.position.set(px, 0.14, pz);
    group.add(palm);
  });

  const bollardCoords: [number, number][] = [
    [-12, 39],
    [-12, 45],
    [-12, 51],
    [12, 39],
    [12, 45],
    [12, 51],
    [-4.5, 58],
    [-4.5, 66],
    [-4.5, 74],
    [4.5, 58],
    [4.5, 66],
    [4.5, 74],
  ];
  for (const [bx, bz] of bollardCoords) {
    const b = createBollardLamp(mats);
    b.position.set(bx, 0.08, bz);
    group.add(b);
  }

  // Exterior Palace Perimeter Side & Rear Walls
  addWall(group, ctx, -44, FLOOR_Y + 6.2, -9, 0.7, 12.4, 70, mats.travertineFacade, true);
  addWall(group, ctx, 44, FLOOR_Y + 6.2, -9, 0.7, 12.4, 70, mats.travertineFacade, true);
  addWall(group, ctx, 0, FLOOR_Y + 6.2, -44, 88.6, 12.4, 0.7, mats.travertineFacade, true);

  // Exterior Architectural Roof Slab (hidden automatically in Floor Plan mode)
  const mainRoof = new THREE.Mesh(new THREE.BoxGeometry(88.8, 0.6, 70.6), mats.travertineFacade);
  mainRoof.position.set(0, FLOOR_Y + 12.6, -9);
  mainRoof.receiveShadow = true;
  group.add(mainRoof);
  ctx.roofs.push(mainRoof);

  // Central Interior Structural Dividing Wall separating Men's Wing (X < 0) and Women's Wing (X > 0)
  addWall(group, ctx, 0, FLOOR_Y + 5.8, 4, 1.4, 11.6, 44, mats.ivoryMarble, true);

  ctx.scene.add(group);
  return group;
}
