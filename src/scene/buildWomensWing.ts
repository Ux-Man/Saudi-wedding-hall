import * as THREE from 'three';
import { BuildContext } from '../types/venue';
import {
  addWall,
  addWallWithDoorwayX,
  addWallWithDoorwayZ,
  createFramedLEDScreen,
  createInteractiveDoubleDoor,
  FLOOR_Y,
} from './archHelpers';
import { VenueMaterials } from './materials';
import {
  createACDiffuser,
  createArabicCoffeeSet,
  createBacklitCouplePlaque,
  createBanquetChair,
  createBuffetStation,
  createCandelabraStand,
  createCoffeeTable,
  createCrystalChandelier,
  createExitSign,
  createFairyLightCanopy,
  createFloralArrangement,
  createFloralEntranceArch,
  createLineArraySpeaker,
  createMajlisSofa,
  createMarbleVanity,
  createRoundBanquetTable,
  createSculptedColumn,
  createSignTexture,
  createSparkleField,
  createWallBayMolding,
  createWeddingBalloonArch,
} from './props';

export function buildWomensWingAndKitchen(ctx: BuildContext, mats: VenueMaterials): THREE.Group {
  const group = new THREE.Group();
  group.name = 'WomensWingAndKitchen';

  // Continuous geometric ivory marble floor across East Women's Wing
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(43, 69.5), mats.ivoryFloor);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(22.2, FLOOR_Y + 0.01, -9);
  floor.receiveShadow = true;
  group.add(floor);

  // =========================================================================
  // 1. WOMEN'S INDEPENDENT RECEPTION LOBBY (X: +0.8 to +43.6, Z: +14 to +25.6)
  // =========================================================================
  addWallWithDoorwayX(
    group,
    ctx,
    18.5,
    14,
    33,
    11.4,
    0.55,
    5.4,
    4.3,
    mats.ivoryMarble,
    mats.champagneGold,
  );
  addWallWithDoorwayX(
    group,
    ctx,
    39,
    14,
    10,
    4.6,
    0.45,
    2.6,
    3.2,
    mats.ivoryMarble,
    mats.champagneGold,
  );

  createInteractiveDoubleDoor(group, ctx, mats, {
    id: 'door-womens-hall',
    nameEn: "Women's Royal Ballroom Doors",
    nameAr: 'بوابة قاعة احتفالات النساء الكبرى',
    x: 18.5,
    z: 14,
    axis: 'x',
    width: 5.3,
    height: 4.2,
    style: 'walnut',
  });

  // Arched Wall Mirror Bays, Sconces, Floral Portal & Balloon Welcome Arch in Women's Lobby
  for (const bx of [8.5, 29.5]) {
    const mirrorBay = createWallBayMolding(mats, { width: 3.4, height: 4.6, style: 'mirror' });
    mirrorBay.position.set(bx, FLOOR_Y + 3.1, 14.35);
    group.add(mirrorBay);
  }
  const wLobbyExit = createExitSign(mats);
  wLobbyExit.position.set(24, FLOOR_Y + 4.95, 25.55);
  group.add(wLobbyExit);

  const wPortalArch = createFloralEntranceArch(mats, 6.0, 4.75, true);
  wPortalArch.position.set(18.5, FLOOR_Y, 14.55);
  group.add(wPortalArch);

  const wBalloonArch = createWeddingBalloonArch(mats, 5.8, 4.45, 77);
  wBalloonArch.position.set(24, FLOOR_Y, 24.8);
  group.add(wBalloonArch);

  // Acoustic & Visual Privacy Mashrabiya Vestibule Screen right inside Women's Glass Entrance
  const privacyFrame = new THREE.Mesh(new THREE.BoxGeometry(6.4, 4.4, 0.25), mats.champagneGold);
  privacyFrame.position.set(24, FLOOR_Y + 2.2, 22.8);
  group.add(privacyFrame);
  const privacyLattice = new THREE.Mesh(new THREE.PlaneGeometry(6.0, 4.0), mats.mashrabiyaGold);
  privacyLattice.position.set(24, FLOOR_Y + 2.2, 22.95);
  group.add(privacyLattice);

  const lobbyFloral = createFloralArrangement(mats, 1.55, true, 1.15);
  lobbyFloral.position.set(18.5, FLOOR_Y, 19.2);
  group.add(lobbyFloral);

  const wLobbySofa = createMajlisSofa(mats, 3.6, true);
  wLobbySofa.position.set(31.5, FLOOR_Y, 17.2);
  group.add(wLobbySofa);
  const wLobbyTable = createCoffeeTable(mats, 1.5, 0.9);
  wLobbyTable.position.set(31.5, FLOOR_Y, 18.9);
  group.add(wLobbyTable);

  const wHospCounter = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.92, 1.08), mats.ivoryMarble);
  wHospCounter.position.set(11.5, FLOOR_Y + 0.46, 19.8);
  group.add(wHospCounter);
  for (const hx of [10.2, 11.5, 12.8]) {
    const cs = createArabicCoffeeSet(mats);
    cs.position.set(hx, FLOOR_Y + 0.94, 19.8);
    group.add(cs);
  }

  createFramedLEDScreen(group, ctx, mats, {
    screenId: 'womens-lobby',
    x: 1.1,
    y: FLOOR_Y + 3.2,
    z: 20.0,
    rotY: Math.PI / 2,
    width: 5.4,
    height: 2.7,
    cameraPos: [8.5, 2.8, 20.0],
    lookAt: [1.1, 3.2, 20.0],
  });

  const wDirTex = createSignTexture(
    'قاعة احتفالات النساء الكبرى',
    "WOMEN'S ROYAL GRAND BALLROOM",
    '#1A1511',
    '#D4B074',
    512,
    128,
  );
  const wDirSign = new THREE.Mesh(
    new THREE.PlaneGeometry(4.6, 1.05),
    new THREE.MeshBasicMaterial({ map: wDirTex }),
  );
  wDirSign.position.set(18.5, FLOOR_Y + 5.25, 14.34);
  group.add(wDirSign);

  const wLobbyChand = createCrystalChandelier(mats, 1.9, 2.25);
  wLobbyChand.position.set(20, FLOOR_Y + 9.4, 19.5);
  group.add(wLobbyChand);
  ctx.animatedObjects.crystalGroups.push(wLobbyChand);

  const wLobbyLight = new THREE.PointLight(0xffe9c8, 22, 28, 1.45);
  wLobbyLight.position.set(20, FLOOR_Y + 7.4, 19.5);
  group.add(wLobbyLight);
  ctx.dynamicLights.interiorChandeliers.push(wLobbyLight);

  // =========================================================================
  // 2. WOMEN'S LUXURY POWDER ROOM & RESTROOMS (X: +34 to +43.6, Z: +2 to +14)
  // =========================================================================
  addWallWithDoorwayZ(
    group,
    ctx,
    34,
    8,
    12,
    5.2,
    0.45,
    2.2,
    3.0,
    mats.ivoryMarble,
    mats.champagneGold,
  );
  addWallWithDoorwayX(
    group,
    ctx,
    39,
    2,
    9.6,
    5.2,
    0.4,
    2.0,
    3.0,
    mats.ivoryMarble,
    mats.champagneGold,
  );

  const womensVanity = createMarbleVanity(mats, 5);
  womensVanity.rotation.y = -Math.PI / 2;
  womensVanity.position.set(43.1, FLOOR_Y, 8.0);
  group.add(womensVanity);

  for (let s = 0; s < 3; s++) {
    const sz = 3.2 + s * 2.2;
    const part = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.5, 0.1), mats.ivoryMarble);
    part.position.set(36.2, FLOOR_Y + 1.25, sz);
    group.add(part);
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.35, 1.6), mats.champagneGold);
    door.position.set(37.3, FLOOR_Y + 1.2, sz + 1.0);
    group.add(door);
  }

  const wPowderLight = new THREE.PointLight(0xfff1dc, 16, 18, 1.5);
  wPowderLight.position.set(39, FLOOR_Y + 4.2, 8);
  group.add(wPowderLight);
  ctx.dynamicLights.prepLights.push(wPowderLight);

  // =========================================================================
  // 3. PRIVATE BRIDAL PREPARATION SUITE (X: +34 to +43.6, Z: -18 to +2)
  // =========================================================================
  addWallWithDoorwayZ(
    group,
    ctx,
    34,
    -8,
    20,
    5.2,
    0.45,
    2.6,
    3.2,
    mats.ivoryMarble,
    mats.champagneGold,
  );
  createInteractiveDoubleDoor(group, ctx, mats, {
    id: 'door-bridal-suite',
    nameEn: 'Bridal Suite Private Entry',
    nameAr: 'مدخل جناح العروس الخاص',
    x: 34,
    z: -8,
    axis: 'z',
    width: 2.5,
    height: 3.1,
    style: 'walnut',
  });

  const bridalCarpet = new THREE.Mesh(new THREE.PlaneGeometry(8.8, 18.8), mats.royalCarpet);
  bridalCarpet.rotation.x = -Math.PI / 2;
  bridalCarpet.position.set(39, FLOOR_Y + 0.03, -8);
  group.add(bridalCarpet);

  // Makeup & Hair Hollywood Bulb-Illuminated Vanity Stations (East Wall, Z = -2 to -8)
  const makeupCounter = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.84, 5.5), mats.ivoryMarble);
  makeupCounter.position.set(43.0, FLOOR_Y + 0.42, -5.0);
  group.add(makeupCounter);

  for (let m = 0; m < 3; m++) {
    const mz = -3.2 - m * 1.8;
    const glowFrame = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.32, 1.18), mats.warmEmissive);
    glowFrame.position.set(43.32, FLOOR_Y + 1.54, mz);
    group.add(glowFrame);
    const mGlass = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.14, 0.98), mats.mirrorGlass);
    mGlass.position.set(43.28, FLOOR_Y + 1.54, mz);
    group.add(mGlass);

    // Cosmetic perfume crystal bottles on vanity counter
    const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.14, 10), mats.crystal);
    bottle.position.set(42.85, FLOOR_Y + 0.91, mz + 0.25);
    group.add(bottle);

    const stoolBase = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.46, 16), mats.champagneGold);
    stoolBase.position.set(42.0, FLOOR_Y + 0.23, mz);
    group.add(stoolBase);
    const stoolSeat = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.12, 18), mats.upholsteryIvory);
    stoolSeat.position.set(42.0, FLOOR_Y + 0.5, mz);
    group.add(stoolSeat);
  }

  // Dressing Room Illuminated Glass-Front Wardrobes + Sculpted Bridal Gown Silhouette Display
  const wardrobe = new THREE.Mesh(new THREE.BoxGeometry(0.82, 3.0, 4.6), mats.walnutWood);
  wardrobe.position.set(43.0, FLOOR_Y + 1.5, -12.5);
  group.add(wardrobe);
  const wardrobeGlass = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.6, 4.2), mats.archGlass);
  wardrobeGlass.position.set(42.56, FLOOR_Y + 1.5, -12.5);
  group.add(wardrobeGlass);

  // Sculpted Silk Bridal Gown on Gold Mannequin Stand
  const gownStand = new THREE.Group();
  gownStand.position.set(41.5, FLOOR_Y, -11.4);
  const gPole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 1.55, 10), mats.champagneGold);
  gPole.position.y = 0.78;
  gownStand.add(gPole);
  const gownPts = [
    new THREE.Vector2(0.55, 0.05),
    new THREE.Vector2(0.36, 0.55),
    new THREE.Vector2(0.16, 1.05),
    new THREE.Vector2(0.2, 1.38),
    new THREE.Vector2(0.12, 1.48),
  ];
  const gown = new THREE.Mesh(new THREE.LatheGeometry(gownPts, 24), mats.silkDrape);
  gownStand.add(gown);
  group.add(gownStand);

  // Full-length beveled champagne-gold standing mirror
  const fullMirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.45, 2.6, 0.1), mats.champagneGold);
  fullMirrorFrame.position.set(36.8, FLOOR_Y + 1.32, -17.3);
  group.add(fullMirrorFrame);
  const fullMirror = new THREE.Mesh(new THREE.BoxGeometry(1.26, 2.42, 0.12), mats.mirrorGlass);
  fullMirror.position.set(36.8, FLOOR_Y + 1.32, -17.28);
  group.add(fullMirror);

  // Bridal Photography Area with Pleated Silk Backdrop, Floral Arch, Chaise & Studio Softboxes
  const photoBackdrop = new THREE.Mesh(new THREE.BoxGeometry(3.6, 3.4, 0.14), mats.silkDrape);
  photoBackdrop.position.set(40.2, FLOOR_Y + 1.7, -17.3);
  group.add(photoBackdrop);

  const photoFloralL = createFloralArrangement(mats, 0.95, true, 0.85);
  photoFloralL.position.set(38.6, FLOOR_Y, -16.8);
  group.add(photoFloralL);
  const photoFloralR = createFloralArrangement(mats, 0.95, true, 0.85);
  photoFloralR.position.set(41.8, FLOOR_Y, -16.8);
  group.add(photoFloralR);

  const bridalLoungeSofa = createMajlisSofa(mats, 2.4, true, true);
  bridalLoungeSofa.position.set(40.2, FLOOR_Y, -15.5);
  group.add(bridalLoungeSofa);

  for (const sx of [38.2, 42.1]) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 2.1, 8), mats.ledBezel);
    pole.position.set(sx, FLOOR_Y + 1.05, -12.8);
    group.add(pole);
    const softbox = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.78, 0.18), mats.warmEmissive);
    softbox.position.set(sx, FLOOR_Y + 2.1, -12.8);
    softbox.rotation.y = sx < 40 ? 0.35 : -0.35;
    group.add(softbox);
  }

  createFramedLEDScreen(group, ctx, mats, {
    screenId: 'bridal-suite-display',
    x: 34.4,
    y: FLOOR_Y + 2.1,
    z: -3.2,
    rotY: Math.PI / 2,
    width: 2.6,
    height: 1.45,
    cameraPos: [38.5, 2.0, -3.2],
    lookAt: [34.4, 2.1, -3.2],
  });

  const bridalSuiteLight = new THREE.PointLight(0xfff1dc, 20, 22, 1.45);
  bridalSuiteLight.position.set(39, FLOOR_Y + 4.4, -9);
  group.add(bridalSuiteLight);
  ctx.dynamicLights.prepLights.push(bridalSuiteLight);

  // =========================================================================
  // 4. WOMEN'S GRAND ROYAL BALLROOM — SHOWCASE CENTERPIECE (X: +1 to +34)
  // =========================================================================
  const ballroomCeiling = new THREE.Group();
  const bSlab = new THREE.Mesh(new THREE.BoxGeometry(33.5, 0.4, 32.5), mats.beigeWall);
  bSlab.position.set(17.5, FLOOR_Y + 11.45, -2);
  ballroomCeiling.add(bSlab);
  const bBronze = new THREE.Mesh(new THREE.BoxGeometry(28.8, 0.28, 27.8), mats.walnutWood);
  bBronze.position.set(17.5, FLOOR_Y + 11.2, -2);
  ballroomCeiling.add(bBronze);
  const bGold = new THREE.Mesh(new THREE.BoxGeometry(27.2, 0.22, 26.2), mats.champagneGold);
  bGold.position.set(17.5, FLOOR_Y + 11.0, -2);
  ballroomCeiling.add(bGold);

  // Central Gilded Sculpted Ballroom Dome Medallion + Linear AC Diffusers
  const domeRing = new THREE.Mesh(
    new THREE.TorusGeometry(6.8, 0.22, 12, 48),
    mats.champagneGold,
  );
  domeRing.rotation.x = Math.PI / 2;
  domeRing.position.set(18.5, FLOOR_Y + 10.88, -1.0);
  ballroomCeiling.add(domeRing);

  const domeGlow = new THREE.Mesh(
    new THREE.TorusGeometry(6.4, 0.08, 8, 48),
    mats.warmEmissive,
  );
  domeGlow.rotation.x = Math.PI / 2;
  domeGlow.position.set(18.5, FLOOR_Y + 10.82, -1.0);
  ballroomCeiling.add(domeGlow);

  for (const az of [9.2, -1.5, -12.0]) {
    const ac = createACDiffuser(mats, 4.6);
    ac.position.set(18.5, FLOOR_Y + 10.92, az);
    ballroomCeiling.add(ac);
  }
  group.add(ballroomCeiling);
  ctx.roofs.push(ballroomCeiling);

  // Dark Bronze Skirting, Gold Crown Molding, Fluted Marble Columns & Silk-Draped Arched Wall Bays
  for (const wx of [0.95, 33.65]) {
    const skirting = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.3, 31.6), mats.darkBronze);
    skirting.position.set(wx, FLOOR_Y + 0.15, -2);
    group.add(skirting);

    const crownTrim = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.28, 31.6), mats.champagneGold);
    crownTrim.position.set(wx, FLOOR_Y + 10.85, -2);
    group.add(crownTrim);
  }

  for (let z = -14; z <= 10; z += 6) {
    for (const wx of [1.3, 33.4]) {
      const col = createSculptedColumn(mats, 10.8, 0.36);
      col.position.set(wx, FLOOR_Y, z);
      group.add(col);

      if (z < 10) {
        // Arched gilded wall bay with pleated champagne silk drapery & crystal sconces
        const bay = createWallBayMolding(mats, {
          width: 4.3,
          height: 7.4,
          style: (z / 6) % 2 === 0 ? 'silk' : 'mirror',
        });
        bay.rotation.y = wx < 18 ? Math.PI / 2 : -Math.PI / 2;
        bay.position.set(wx + (wx < 18 ? -0.14 : 0.14), FLOOR_Y + 5.0, z + 3);
        group.add(bay);
      }
    }
  }

  // Sparkling Ceiling Fairy-Light Canopy draped gracefully across Women's Ballroom Ceiling
  const ballroomStrands: [THREE.Vector3, THREE.Vector3, number][] = [];
  for (let i = 0; i < 6; i++) {
    const z = 9.5 - i * 3.8;
    ballroomStrands.push([
      new THREE.Vector3(3.2, FLOOR_Y + 10.4, z),
      new THREE.Vector3(18.5, FLOOR_Y + 10.7, z - 0.8),
      0.85,
    ]);
    ballroomStrands.push([
      new THREE.Vector3(31.8, FLOOR_Y + 10.4, z),
      new THREE.Vector3(18.5, FLOOR_Y + 10.7, z - 0.8),
      0.85,
    ]);
  }
  group.add(createFairyLightCanopy(mats, ballroomStrands, 12));

  // 4 Grand Empire Crystal Chandeliers (elevated & flanking runway so Kosha & Couple Names are 100% clear!)
  const wChandPos: [number, number][] = [
    [10.2, 5.6],
    [26.8, 5.6],
    [10.2, -3.6],
    [26.8, -3.6],
  ];
  for (const [cx, cz] of wChandPos) {
    const ch = createCrystalChandelier(mats, 2.25, 2.35);
    ch.position.set(cx, FLOOR_Y + 10.95, cz);
    group.add(ch);
    ctx.animatedObjects.crystalGroups.push(ch);

    const pt = new THREE.PointLight(0xffebd0, 28, 28, 1.45);
    pt.position.set(cx, FLOOR_Y + 8.0, cz);
    group.add(pt);
    ctx.dynamicLights.interiorChandeliers.push(pt);
  }

  // Floating Golden Bokeh Sparkles filling the Royal Ballroom atmosphere
  const ballroomSparkles = createSparkleField(
    mats,
    { minX: 3, maxX: 32, minY: 1.4, maxY: 9.8, minZ: -15, maxZ: 11 },
    140,
  );
  group.add(ballroomSparkles);
  ctx.animatedObjects.sparkleSystems.push(ballroomSparkles);

  // ILLUMINATED MIRROR-GLASS BRIDAL RUNWAY (Z: +11 down to -10.5 along X = 18.5)
  const runway = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.24, 21.5), mats.runwayGlass);
  runway.position.set(18.5, FLOOR_Y + 0.12, 0.25);
  runway.receiveShadow = true;
  group.add(runway);

  // Two Elevated Grand Floral & Fairy-Light Runway Arches (5.8m tall so Kosha & Couple Plaque shine cleanly through!)
  for (const az of [7.2, -1.2]) {
    const rArch = createFloralEntranceArch(mats, 5.6, 5.7, true);
    rArch.position.set(18.5, FLOOR_Y, az);
    group.add(rArch);
  }

  // Champagne-Gold Runway Borders, Warm LED Edge Strips, Floral Pedestals & Glowing Crystal Candelabras
  for (const side of [-1, 1]) {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.26, 21.6), mats.champagneGold);
    strip.position.set(18.5 + side * 1.82, FLOOR_Y + 0.13, 0.25);
    group.add(strip);

    const ledStrip = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 21.4), mats.warmEmissive);
    ledStrip.position.set(18.5 + side * 1.7, FLOOR_Y + 0.25, 0.25);
    group.add(ledStrip);

    for (let p = 0; p < 5; p++) {
      const pz = 8.6 - p * 4.4;
      const floralPed = createFloralArrangement(mats, 0.96, true, 0.9);
      floralPed.position.set(18.5 + side * 2.45, FLOOR_Y, pz);
      group.add(floralPed);

      if (p < 4) {
        const cand = createCandelabraStand(mats, ctx, 1.5);
        cand.position.set(18.5 + side * 2.38, FLOOR_Y, pz - 2.2);
        group.add(cand);
      }
    }
  }

  // =========================================================================
  // ROYAL BRIDAL KOSHA STAGE — 100% UNOBSTRUCTED COUPLE NAMES & MASSIVE LED WALL
  // =========================================================================
  const koshaGroup = new THREE.Group();
  koshaGroup.position.set(18.5, FLOOR_Y, -14.5);

  // Sweeping Multi-Tiered Curved Marble & Illuminated Mirror-Glass Bridal Dais
  const kStep1 = new THREE.Mesh(
    new THREE.CylinderGeometry(8.4, 8.8, 0.24, 40, 1, false, -Math.PI * 0.5, Math.PI),
    mats.ivoryMarble,
  );
  kStep1.rotation.y = Math.PI / 2;
  kStep1.position.set(0, 0.12, -2.2);
  koshaGroup.add(kStep1);

  const kStepGlow = new THREE.Mesh(
    new THREE.TorusGeometry(8.42, 0.04, 8, 40, Math.PI),
    mats.warmEmissive,
  );
  kStepGlow.rotation.x = Math.PI / 2;
  kStepGlow.position.set(0, 0.24, -2.2);
  koshaGroup.add(kStepGlow);

  const kDeck = new THREE.Mesh(new THREE.BoxGeometry(16.8, 0.44, 5.8), mats.ivoryMarble);
  kDeck.position.set(0, 0.22, -0.4);
  kDeck.receiveShadow = true;
  koshaGroup.add(kDeck);

  const kTopDeck = new THREE.Mesh(new THREE.BoxGeometry(14.2, 0.24, 4.4), mats.runwayGlass);
  kTopDeck.position.set(0, 0.56, -0.8);
  koshaGroup.add(kTopDeck);

  // Widened Outer Sculpted Gilded Columns, Draped Silk Curtains & Cascading Floral Wing Towers (x = ±7.0)
  // Carefully positioned OUTSIDE the central LED screen & couple plaque so NOTHING obstructs sightlines!
  for (const side of [-1, 1]) {
    const outerCol = createSculptedColumn(mats, 9.6, 0.44);
    outerCol.position.set(side * 7.0, 0.68, -2.35);
    koshaGroup.add(outerCol);

    // Flowing pleated ivory silk drapery framing outer wings of Kosha
    const wingDrape = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 8.8), mats.silkDrape);
    wingDrape.position.set(side * 6.4, 5.1, -2.1);
    wingDrape.rotation.y = -side * 0.22;
    koshaGroup.add(wingDrape);

    // Rich cascading white/blush rose & candelabra wing installations flanking Bridal Throne
    for (const [fx, fz, sc] of [
      [side * 4.8, 0.3, 1.45],
      [side * 3.4, 0.85, 1.25],
      [side * 5.6, -0.85, 1.55],
    ]) {
      const bouquet = createFloralArrangement(mats, sc, true, 0.78);
      bouquet.position.set(fx, 0.68, fz);
      koshaGroup.add(bouquet);
    }

    const koshaCand = createCandelabraStand(mats, ctx, 1.75);
    koshaCand.position.set(side * 2.55, 0.68, 0.55);
    koshaGroup.add(koshaCand);
  }

  // Royal Carved Ivory & Gold Bridal Throne Sofa (low enough to keep entire LED wall & couple plaque clear!)
  const bridalThrone = createMajlisSofa(mats, 3.7, true, true);
  bridalThrone.position.set(0, 0.68, -0.7);
  koshaGroup.add(bridalThrone);

  group.add(koshaGroup);

  // DEDICATED PROMINENT BACKLIT BRIDE & GROOM NAME PLAQUE — Crown of Women's Kosha (100% Unobstructed!)
  const womensCouplePlaque = createBacklitCouplePlaque(ctx, mats, {
    width: 8.2,
    height: 2.1,
    subtitleAr: 'ليلة عمر · أدام الله أفراحكم ومسراتكم',
  });
  womensCouplePlaque.position.set(18.5, FLOOR_Y + 8.65, -16.95);
  group.add(womensCouplePlaque);

  // MASSIVE BRIDAL KOSHA LED VIDEO WALLS & AV LINE-ARRAY SPEAKERS
  createFramedLEDScreen(group, ctx, mats, {
    screenId: 'womens-kosha-main',
    x: 18.5,
    y: FLOOR_Y + 4.55,
    z: -17.3,
    width: 11.0,
    height: 4.8,
    cameraPos: [18.5, 3.5, -3.2],
    lookAt: [18.5, 5.1, -17.3],
  });

  // Overhead Lighting Truss & Flanking Side LED Walls + Speakers
  const wTruss = new THREE.Mesh(new THREE.BoxGeometry(16.0, 0.26, 0.28), mats.darkBronze);
  wTruss.position.set(18.5, FLOOR_Y + 10.1, -12.4);
  group.add(wTruss);

  for (const side of [-1, 1]) {
    createFramedLEDScreen(group, ctx, mats, {
      screenId: 'womens-kosha-sides',
      x: 18.5 + side * 10.4,
      y: FLOOR_Y + 4.5,
      z: -16.8,
      rotY: -side * 0.22,
      width: 4.5,
      height: 3.9,
      cameraPos: [18.5 + side * 6.5, 3.0, -7.0],
      lookAt: [18.5 + side * 10.4, 4.5, -16.8],
    });

    const speaker = createLineArraySpeaker(mats);
    speaker.position.set(18.5 + side * 7.8, FLOOR_Y + 7.9, -16.0);
    group.add(speaker);
  }

  // Dramatic Wedding Kosha Key Spotlight + Twin Sweeping Romantic Stage Spotlights
  const koshaSpot = new THREE.SpotLight(0xffe4b8, 54, 34, Math.PI / 4, 0.5, 1.25);
  koshaSpot.position.set(18.5, FLOOR_Y + 10.0, -5.5);
  koshaSpot.target.position.set(18.5, FLOOR_Y + 1.5, -14.5);
  group.add(koshaSpot);
  group.add(koshaSpot.target);
  ctx.dynamicLights.stageSpots.push(koshaSpot);

  for (const side of [-1, 1]) {
    const sweep = new THREE.SpotLight(0xffdca6, 30, 32, Math.PI / 7, 0.65, 1.3);
    sweep.position.set(18.5 + side * 5.2, FLOOR_Y + 9.9, -12.2);
    sweep.target.position.set(18.5, FLOOR_Y + 0.4, 0);
    group.add(sweep);
    group.add(sweep.target);
    ctx.dynamicLights.stageSpots.push(sweep);
    ctx.animatedObjects.movingSpots.push({
      light: sweep,
      baseX: 18.5 + side * 2.4,
      baseZ: 0,
      phase: side > 0 ? 0 : Math.PI,
      amp: 6.2,
    });
  }

  // 12 FIVE-STAR CANDLELIT ROUND BANQUET TABLES & 72 MEDALLION CHAIRS
  const banquetCoords: [number, number][] = [
    [6.5, 7.5],
    [12.2, 7.5],
    [6.5, 0.5],
    [12.2, 0.5],
    [6.5, -6.5],
    [12.2, -6.5],
    [24.8, 7.5],
    [30.2, 7.5],
    [24.8, 0.5],
    [30.2, 0.5],
    [24.8, -6.5],
    [30.2, -6.5],
  ];
  for (const [bx, bz] of banquetCoords) {
    const table = createRoundBanquetTable(mats, 1.15, ctx);
    table.position.set(bx, FLOOR_Y, bz);
    group.add(table);

    for (let c = 0; c < 6; c++) {
      const a = (c / 6) * Math.PI * 2;
      const chair = createBanquetChair(mats);
      chair.position.set(bx + Math.cos(a) * 1.55, FLOOR_Y, bz + Math.sin(a) * 1.55);
      chair.rotation.y = -a - Math.PI / 2;
      group.add(chair);
    }
  }

  // =========================================================================
  // 5. WOMEN'S DINING & BUFFET HALL (X: +8 to +43.6, Z: -43.6 to -18)
  // =========================================================================
  addWall(group, ctx, 18.5, FLOOR_Y + 5.2, -18, 17, 10.4, 0.65, mats.ivoryMarble, true);
  addWallWithDoorwayX(
    group,
    ctx,
    35.5,
    -18,
    17,
    10.4,
    0.65,
    4.6,
    3.8,
    mats.ivoryMarble,
    mats.champagneGold,
  );
  addWallWithDoorwayX(
    group,
    ctx,
    5.5,
    -18,
    9,
    10.4,
    0.65,
    3.6,
    3.8,
    mats.ivoryMarble,
    mats.champagneGold,
  );

  createInteractiveDoubleDoor(group, ctx, mats, {
    id: 'door-womens-dining',
    nameEn: "Women's Dining Hall Doors",
    nameAr: 'بوابة صالة طعام النساء',
    x: 35.5,
    z: -18,
    axis: 'x',
    width: 4.5,
    height: 3.7,
    style: 'walnut',
  });

  const wDiningExit = createExitSign(mats);
  wDiningExit.position.set(35.5, FLOOR_Y + 4.15, -18.4);
  group.add(wDiningExit);

  const wDiningSignTex = createSignTexture(
    'صالة طعام النساء · البوفيه الملكي',
    "WOMEN'S ROYAL BANQUET & BUFFET",
    '#1A1511',
    '#D4B074',
    512,
    128,
  );
  const wDiningSign = new THREE.Mesh(
    new THREE.PlaneGeometry(4.4, 1.0),
    new THREE.MeshBasicMaterial({ map: wDiningSignTex }),
  );
  wDiningSign.position.set(35.5, FLOOR_Y + 4.65, -17.6);
  group.add(wDiningSign);

  addWallWithDoorwayZ(
    group,
    ctx,
    8,
    -31,
    26,
    6.4,
    0.5,
    2.6,
    3.0,
    mats.beigeWall,
    mats.champagneGold,
  );
  createInteractiveDoubleDoor(group, ctx, mats, {
    id: 'door-kitchen-east',
    nameEn: "Women's Kitchen Service Door",
    nameAr: 'باب خدمة المطبخ · قسم النساء',
    x: 8,
    z: -31,
    axis: 'z',
    width: 2.5,
    height: 2.9,
    style: 'walnut',
  });

  // Grand 5-Star Women's Buffet Stations (Hot Arabic, Luxury Patisserie & Cold Mezze Risers)
  const wHotBuffet = createBuffetStation(mats, 8.8, 'hot');
  wHotBuffet.position.set(22, FLOOR_Y, -39.5);
  group.add(wHotBuffet);
  ctx.colliders.push({ minX: 17.4, maxX: 26.6, minZ: -40.2, maxZ: -38.8 });

  const wDessertBuffet = createBuffetStation(mats, 7.6, 'dessert');
  wDessertBuffet.position.set(34, FLOOR_Y, -39.5);
  group.add(wDessertBuffet);
  ctx.colliders.push({ minX: 30.0, maxX: 38.0, minZ: -40.2, maxZ: -38.8 });

  const wColdBuffet = createBuffetStation(mats, 6.8, 'cold');
  wColdBuffet.rotation.y = -Math.PI / 2;
  wColdBuffet.position.set(12.2, FLOOR_Y, -31);
  group.add(wColdBuffet);

  const womensDiningTables: [number, number][] = [
    [20, -24.5],
    [28, -24.5],
    [36, -24.5],
    [20, -32.2],
    [28, -32.2],
    [36, -32.2],
  ];
  for (const [tx, tz] of womensDiningTables) {
    const tbl = createRoundBanquetTable(mats, 1.12, ctx);
    tbl.position.set(tx, FLOOR_Y, tz);
    group.add(tbl);
    for (let c = 0; c < 6; c++) {
      const a = (c / 6) * Math.PI * 2;
      const ch = createBanquetChair(mats);
      ch.position.set(tx + Math.cos(a) * 1.52, FLOOR_Y, tz + Math.sin(a) * 1.52);
      ch.rotation.y = -a - Math.PI / 2;
      group.add(ch);
    }
  }

  for (const dx of [19, 32]) {
    const ch = createCrystalChandelier(mats, 1.65, 2.1);
    ch.position.set(dx, FLOOR_Y + 9.2, -30.5);
    group.add(ch);
    ctx.animatedObjects.crystalGroups.push(ch);

    const dl = new THREE.PointLight(0xffe9c7, 24, 28, 1.45);
    dl.position.set(dx, FLOOR_Y + 6.8, -30.5);
    group.add(dl);
    ctx.dynamicLights.interiorChandeliers.push(dl);
  }

  // =========================================================================
  // 6. CENTRAL CULINARY PREP KITCHEN, STORAGE & SERVICE CORRIDORS (X: -8..+8)
  // =========================================================================
  const kitchenFloor = new THREE.Mesh(new THREE.PlaneGeometry(16, 25.6), mats.limestonePlaza);
  kitchenFloor.rotation.x = -Math.PI / 2;
  kitchenFloor.position.set(0, FLOOR_Y + 0.02, -31);
  group.add(kitchenFloor);

  for (const kz of [-26, -33, -39]) {
    const island = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.92, 1.35), mats.stainlessSteel);
    island.position.set(0, FLOOR_Y + 0.46, kz);
    group.add(island);

    const hood = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.65, 1.55), mats.stainlessSteel);
    hood.position.set(0, FLOOR_Y + 2.85, kz);
    group.add(hood);

    for (const px of [-1.8, 0, 1.8]) {
      const tray = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.14, 0.55), mats.chrome);
      tray.position.set(px, FLOOR_Y + 0.99, kz);
      group.add(tray);
    }
    ctx.colliders.push({ minX: -2.9, maxX: 2.9, minZ: kz - 0.75, maxZ: kz + 0.75 });
  }

  for (const sx of [-6.4, 6.4]) {
    const fridge = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.5, 4.4), mats.stainlessSteel);
    fridge.position.set(sx, FLOOR_Y + 1.25, -39.5);
    group.add(fridge);

    const rack = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.2, 4.0), mats.darkBronze);
    rack.position.set(sx, FLOOR_Y + 1.1, -22.5);
    group.add(rack);
  }

  const kitchenLight = new THREE.PointLight(0xffffff, 26, 26, 1.45);
  kitchenLight.position.set(0, FLOOR_Y + 4.8, -31);
  group.add(kitchenLight);
  ctx.dynamicLights.prepLights.push(kitchenLight);

  ctx.scene.add(group);
  return group;
}
