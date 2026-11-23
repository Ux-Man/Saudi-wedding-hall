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
  createFloralArrangement,
  createFloralEntranceArch,
  createLineArraySpeaker,
  createLuxuryArmchair,
  createMajlisSofa,
  createMarbleVanity,
  createRoundBanquetTable,
  createSculptedColumn,
  createSignTexture,
  createSparkleField,
  createWallBayMolding,
  createWeddingBalloonArch,
} from './props';

export function buildMensWing(ctx: BuildContext, mats: VenueMaterials): THREE.Group {
  const group = new THREE.Group();
  group.name = 'MensWing';

  // Continuous polished geometric ivory marble floor across entire Men's Wing
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(43, 69.5), mats.ivoryFloor);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(-22.2, FLOOR_Y + 0.01, -9);
  floor.receiveShadow = true;
  group.add(floor);

  // =========================================================================
  // 1. MEN'S GRAND RECEPTION LOBBY (X: -43.6 to -0.8, Z: +14 to +25.6)
  // =========================================================================
  addWallWithDoorwayX(
    group,
    ctx,
    -18.5,
    14,
    33,
    10.8,
    0.55,
    5.4,
    4.2,
    mats.ivoryMarble,
    mats.champagneGold,
  );
  addWallWithDoorwayX(
    group,
    ctx,
    -39,
    14,
    10,
    4.6,
    0.45,
    2.6,
    3.2,
    mats.ivoryMarble,
    mats.champagneGold,
  );

  // Interactive Walnut & Gold Double Doors from Men's Lobby -> Men's Wedding Hall
  createInteractiveDoubleDoor(group, ctx, mats, {
    id: 'door-mens-hall',
    nameEn: "Men's Royal Majlis Doors",
    nameAr: 'بوابة قاعة احتفالات الرجال',
    x: -18.5,
    z: 14,
    axis: 'x',
    width: 5.3,
    height: 4.1,
    style: 'walnut',
  });

  // Architectural Lobby Arched Mirror Bays, Wall Sconces, AC Diffusers & EXIT Sign
  for (const bx of [-30, -8.5]) {
    const mirrorBay = createWallBayMolding(mats, { width: 3.4, height: 4.4, style: 'mirror' });
    mirrorBay.position.set(bx, FLOOR_Y + 3.0, 14.35);
    group.add(mirrorBay);
  }
  const lobbyExitSign = createExitSign(mats);
  lobbyExitSign.position.set(-24, FLOOR_Y + 4.95, 25.55);
  group.add(lobbyExitSign);

  // Ceremonial Welcome Floral Arch & Balloon Accents framing Men's Hall Portal
  const mensPortalArch = createFloralEntranceArch(mats, 6.0, 4.7, false);
  mensPortalArch.position.set(-18.5, FLOOR_Y, 14.55);
  group.add(mensPortalArch);

  const mensLobbyBalloon = createWeddingBalloonArch(mats, 5.8, 4.4, 41);
  mensLobbyBalloon.position.set(-24, FLOOR_Y, 24.8);
  group.add(mensLobbyBalloon);

  // Lobby Center Marble Medallion & Lush Floral Plinth
  const lobbyCenterFloral = createFloralArrangement(mats, 1.45, true, 1.1);
  lobbyCenterFloral.position.set(-24, FLOOR_Y, 20);
  group.add(lobbyCenterFloral);

  // Reception Concierge Desk (West side) with Marble Top & Floral Urn
  const concierge = new THREE.Mesh(new THREE.BoxGeometry(3.9, 1.12, 1.0), mats.walnutWood);
  concierge.position.set(-34.5, FLOOR_Y + 0.56, 20.5);
  concierge.rotation.y = Math.PI / 2;
  concierge.castShadow = true;
  group.add(concierge);
  const conciergeTop = new THREE.Mesh(new THREE.BoxGeometry(4.08, 0.08, 1.14), mats.ivoryMarble);
  conciergeTop.position.set(-34.5, FLOOR_Y + 1.15, 20.5);
  conciergeTop.rotation.y = Math.PI / 2;
  group.add(conciergeTop);
  const concFloral = createFloralArrangement(mats, 0.55, false);
  concFloral.position.set(-34.5, FLOOR_Y + 1.24, 19.2);
  group.add(concFloral);

  // VIP Arabic Coffee, Sukkari Dates & Oud Mabkhara Hospitality Station (East side of Lobby)
  const hospCounter = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.92, 1.12), mats.walnutWood);
  hospCounter.position.set(-13.5, FLOOR_Y + 0.46, 19.5);
  hospCounter.castShadow = true;
  group.add(hospCounter);
  const hospTop = new THREE.Mesh(new THREE.BoxGeometry(5.16, 0.08, 1.26), mats.ivoryMarble);
  hospTop.position.set(-13.5, FLOOR_Y + 0.95, 19.5);
  group.add(hospTop);
  for (const hx of [-15.1, -13.5, -11.9]) {
    const coffeeSet = createArabicCoffeeSet(mats);
    coffeeSet.position.set(hx, FLOOR_Y + 1.0, 19.5);
    group.add(coffeeSet);
  }
  ctx.colliders.push({ minX: -16.1, maxX: -10.9, minZ: 18.8, maxZ: 20.2 });

  // Lobby Waiting Lounge Sofas with Sadu Cushions
  const lobbySofaL = createMajlisSofa(mats, 3.4, false);
  lobbySofaL.position.set(-30, FLOOR_Y, 17);
  group.add(lobbySofaL);
  const lobbyTableL = createCoffeeTable(mats, 1.45, 0.85);
  lobbyTableL.position.set(-30, FLOOR_Y, 18.6);
  group.add(lobbyTableL);

  // Men's Lobby LED Welcome Display
  createFramedLEDScreen(group, ctx, mats, {
    screenId: 'mens-lobby',
    x: -1.1,
    y: FLOOR_Y + 3.2,
    z: 20.0,
    rotY: -Math.PI / 2,
    width: 5.4,
    height: 2.7,
    cameraPos: [-8.5, 2.8, 20.0],
    lookAt: [-1.1, 3.2, 20.0],
  });

  // Directional Sign over Men's Hall Entry
  const hallDirTex = createSignTexture(
    'قاعة احتفالات الرجال · المجلس الملكي',
    "MEN'S ROYAL MAJLIS HALL",
    '#1A1511',
    '#D4B074',
    512,
    128,
  );
  const hallDirSign = new THREE.Mesh(
    new THREE.PlaneGeometry(4.6, 1.05),
    new THREE.MeshBasicMaterial({ map: hallDirTex }),
  );
  hallDirSign.position.set(-18.5, FLOOR_Y + 5.2, 14.34);
  group.add(hallDirSign);

  const lobbyChand = createCrystalChandelier(mats, 1.85, 2.2);
  lobbyChand.position.set(-24, FLOOR_Y + 9.4, 20);
  group.add(lobbyChand);
  ctx.animatedObjects.crystalGroups.push(lobbyChand);

  const lobbyLight = new THREE.PointLight(0xffe7c2, 22, 28, 1.5);
  lobbyLight.position.set(-24, FLOOR_Y + 7.2, 20);
  group.add(lobbyLight);
  ctx.dynamicLights.interiorChandeliers.push(lobbyLight);

  // =========================================================================
  // 2. MEN'S LUXURY RESTROOMS (Z: +2 to +14) & GROOM'S PREP SUITE (Z: -18 to +2)
  // =========================================================================
  addWallWithDoorwayZ(
    group,
    ctx,
    -34,
    8,
    12,
    5.2,
    0.45,
    2.2,
    3.0,
    mats.ivoryMarble,
    mats.champagneGold,
  );
  addWallWithDoorwayZ(
    group,
    ctx,
    -34,
    -8,
    20,
    5.2,
    0.45,
    2.2,
    3.0,
    mats.ivoryMarble,
    mats.champagneGold,
  );
  addWall(group, ctx, -39, FLOOR_Y + 2.5, 2, 9.6, 5.0, 0.4, mats.ivoryMarble, true);

  const mensVanity = createMarbleVanity(mats, 5);
  mensVanity.rotation.y = Math.PI / 2;
  mensVanity.position.set(-43.1, FLOOR_Y, 8.0);
  group.add(mensVanity);

  for (let s = 0; s < 3; s++) {
    const sz = 3.2 + s * 2.2;
    const partition = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.5, 0.1), mats.charcoalMarble);
    partition.position.set(-36.2, FLOOR_Y + 1.25, sz);
    group.add(partition);
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.35, 1.6), mats.walnutWood);
    door.position.set(-37.3, FLOOR_Y + 1.2, sz + 1.0);
    group.add(door);
  }

  const groomCarpet = new THREE.Mesh(new THREE.PlaneGeometry(8.6, 17.5), mats.royalCarpet);
  groomCarpet.rotation.x = -Math.PI / 2;
  groomCarpet.position.set(-39, FLOOR_Y + 0.03, -8);
  group.add(groomCarpet);

  const groomSofa = createMajlisSofa(mats, 3.0, true);
  groomSofa.rotation.y = Math.PI / 2;
  groomSofa.position.set(-42.4, FLOOR_Y, -6);
  group.add(groomSofa);

  const groomTable = createCoffeeTable(mats, 1.5, 0.9);
  groomTable.rotation.y = Math.PI / 2;
  groomTable.position.set(-40.5, FLOOR_Y, -6);
  group.add(groomTable);

  const groomWardrobe = new THREE.Mesh(new THREE.BoxGeometry(0.75, 2.9, 4.2), mats.walnutWood);
  groomWardrobe.position.set(-43.1, FLOOR_Y + 1.45, -13);
  group.add(groomWardrobe);
  const groomMirror = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.4, 1.4), mats.mirrorGlass);
  groomMirror.position.set(-39, FLOOR_Y + 1.3, -17.4);
  group.add(groomMirror);

  const prepRoomLight = new THREE.PointLight(0xfff1dc, 16, 18, 1.5);
  prepRoomLight.position.set(-39, FLOOR_Y + 4.2, 8);
  group.add(prepRoomLight);
  ctx.dynamicLights.prepLights.push(prepRoomLight);

  const groomSuiteLight = new THREE.PointLight(0xffe9c8, 16, 20, 1.5);
  groomSuiteLight.position.set(-39, FLOOR_Y + 4.2, -8);
  group.add(groomSuiteLight);
  ctx.dynamicLights.prepLights.push(groomSuiteLight);

  // =========================================================================
  // 3. MEN'S GRAND WEDDING HALL / ROYAL MAJLIS (X: -34 to -1, Z: -18 to +14)
  // =========================================================================
  const majlisCarpet = new THREE.Mesh(new THREE.PlaneGeometry(28.5, 25.5), mats.royalCarpet);
  majlisCarpet.rotation.x = -Math.PI / 2;
  majlisCarpet.position.set(-18.5, FLOOR_Y + 0.025, -1.5);
  majlisCarpet.receiveShadow = true;
  group.add(majlisCarpet);

  // Dark Bronze Skirting, Crown Molding, Sculpted Fluted Columns & Arched Walnut/Gold Wall Bays
  for (const wx of [-33.65, -0.95]) {
    const skirting = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.3, 31.6), mats.darkBronze);
    skirting.position.set(wx, FLOOR_Y + 0.15, -2);
    group.add(skirting);

    const crownTrim = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.28, 31.6), mats.champagneGold);
    crownTrim.position.set(wx, FLOOR_Y + 10.15, -2);
    group.add(crownTrim);
  }

  for (let z = -14; z <= 10; z += 6) {
    for (const wx of [-33.4, -1.3]) {
      const col = createSculptedColumn(mats, 10.1, 0.34);
      col.position.set(wx, FLOOR_Y, z);
      group.add(col);

      if (z < 10) {
        const bay = createWallBayMolding(mats, {
          width: 4.3,
          height: 6.8,
          style: (z / 6) % 2 === 0 ? 'walnut' : 'mirror',
        });
        bay.rotation.y = wx < -18 ? Math.PI / 2 : -Math.PI / 2;
        bay.position.set(wx + (wx < -18 ? -0.16 : 0.16), FLOOR_Y + 4.7, z + 3);
        group.add(bay);
      }
    }
  }

  // Deeply Coffered Gilded Ceiling with Recessed Cove Lighting & Linear AC Diffusers
  const mensCeiling = new THREE.Group();
  const cSlab = new THREE.Mesh(new THREE.BoxGeometry(33.5, 0.4, 32.5), mats.beigeWall);
  cSlab.position.set(-17.5, FLOOR_Y + 10.75, -2);
  mensCeiling.add(cSlab);
  const coveBronze = new THREE.Mesh(new THREE.BoxGeometry(28.8, 0.28, 27.8), mats.walnutWood);
  coveBronze.position.set(-17.5, FLOOR_Y + 10.48, -2);
  mensCeiling.add(coveBronze);
  const coveGold = new THREE.Mesh(new THREE.BoxGeometry(27.2, 0.22, 26.2), mats.champagneGold);
  coveGold.position.set(-17.5, FLOOR_Y + 10.3, -2);
  mensCeiling.add(coveGold);

  // Linear AC slot diffusers integrated neatly into ceiling soffit
  for (const az of [8.5, -2.0, -12.0]) {
    const ac = createACDiffuser(mats, 4.4);
    ac.position.set(-18.5, FLOOR_Y + 10.22, az);
    mensCeiling.add(ac);
  }
  group.add(mensCeiling);
  ctx.roofs.push(mensCeiling);

  // 4 Monumental Empire Crystal Chandeliers (positioned high & flanking centerline so stage & couple names stay 100% unobstructed!)
  const mensChandPos: [number, number][] = [
    [-25.5, 5.2],
    [-11.2, 5.2],
    [-25.5, -3.8],
    [-11.2, -3.8],
  ];
  for (const [cx, cz] of mensChandPos) {
    const ch = createCrystalChandelier(mats, 2.05, 2.25);
    ch.position.set(cx, FLOOR_Y + 10.28, cz);
    group.add(ch);
    ctx.animatedObjects.crystalGroups.push(ch);

    const pt = new THREE.PointLight(0xffe4b8, 26, 26, 1.5);
    pt.position.set(cx, FLOOR_Y + 7.6, cz);
    group.add(pt);
    ctx.dynamicLights.interiorChandeliers.push(pt);
  }

  // Subtle Floating Warm Golden Bokeh Sparkles in Men's Hall
  const mensSparkles = createSparkleField(
    mats,
    { minX: -32, maxX: -3, minY: 1.5, maxY: 9.2, minZ: -15, maxZ: 11 },
    90,
  );
  group.add(mensSparkles);
  ctx.animatedObjects.sparkleSystems.push(mensSparkles);

  // Spacious Saudi Luxury Majlis Seating Arrangements (Perimeter + Central VIP Islands)
  for (let i = 0; i < 4; i++) {
    const sz = -8.5 + i * 5.2;
    const sofaW = createMajlisSofa(mats, 4.1, false);
    sofaW.rotation.y = Math.PI / 2;
    sofaW.position.set(-31.4, FLOOR_Y, sz);
    group.add(sofaW);
    const tblW = createCoffeeTable(mats, 1.6, 0.9);
    tblW.rotation.y = Math.PI / 2;
    tblW.position.set(-29.1, FLOOR_Y, sz);
    group.add(tblW);

    const sofaE = createMajlisSofa(mats, 4.1, false);
    sofaE.rotation.y = -Math.PI / 2;
    sofaE.position.set(-4.3, FLOOR_Y, sz);
    group.add(sofaE);
    const tblE = createCoffeeTable(mats, 1.6, 0.9);
    tblE.rotation.y = -Math.PI / 2;
    tblE.position.set(-6.6, FLOOR_Y, sz);
    group.add(tblE);
  }

  const clusterCenters: [number, number][] = [
    [-24.2, 4.2],
    [-24.2, -3.5],
    [-12.2, 4.2],
    [-12.2, -3.5],
  ];
  for (const [kx, kz] of clusterCenters) {
    const sBack = createMajlisSofa(mats, 3.4, true);
    sBack.position.set(kx, FLOOR_Y, kz + 2.1);
    sBack.rotation.y = Math.PI;
    group.add(sBack);

    const armL = createLuxuryArmchair(mats, false);
    armL.position.set(kx - 2.1, FLOOR_Y, kz);
    armL.rotation.y = Math.PI / 2;
    group.add(armL);

    const armR = createLuxuryArmchair(mats, false);
    armR.position.set(kx + 2.1, FLOOR_Y, kz);
    armR.rotation.y = -Math.PI / 2;
    group.add(armR);

    const centerTbl = createCoffeeTable(mats, 1.8, 1.05);
    centerTbl.position.set(kx, FLOOR_Y, kz);
    group.add(centerTbl);
  }

  // =========================================================================
  // 4. GROOM'S CEREMONIAL STAGE — 100% UNOBSTRUCTED COUPLE NAMES & LED WALL
  // =========================================================================
  const stageGroup = new THREE.Group();
  stageGroup.position.set(-18.5, FLOOR_Y, -14.8);

  // 3-step terraced Crema Marfil & Nero Marquina marble dais with recessed LED risers
  const dais1 = new THREE.Mesh(new THREE.BoxGeometry(16.6, 0.22, 5.5), mats.ivoryMarble);
  dais1.position.y = 0.11;
  dais1.receiveShadow = true;
  stageGroup.add(dais1);
  const dais2 = new THREE.Mesh(new THREE.BoxGeometry(15.4, 0.22, 4.7), mats.ivoryMarble);
  dais2.position.set(0, 0.33, -0.35);
  stageGroup.add(dais2);
  const dais3 = new THREE.Mesh(new THREE.BoxGeometry(14.2, 0.22, 3.9), mats.charcoalMarble);
  dais3.position.set(0, 0.55, -0.65);
  stageGroup.add(dais3);

  const stageStepGlow = new THREE.Mesh(new THREE.BoxGeometry(16.2, 0.045, 0.06), mats.warmEmissive);
  stageStepGlow.position.set(0, 0.21, 2.76);
  stageGroup.add(stageStepGlow);

  // Widened Sculpted Fluted Columns & Silk Drapery Framing OUTSIDE the LED Screen (x = ±6.9)
  for (const ax of [-6.9, 6.9]) {
    const stageCol = createSculptedColumn(mats, 9.1, 0.42);
    stageCol.position.set(ax, 0.66, -2.25);
    stageGroup.add(stageCol);

    const floral = createFloralArrangement(mats, 1.35, true, 0.9);
    floral.position.set(ax * 0.78, 0.66, 0.25);
    stageGroup.add(floral);

    const cand = createCandelabraStand(mats, ctx, 1.55);
    cand.position.set(ax * 0.62, 0.66, 0.75);
    stageGroup.add(cand);
  }

  // Royal Carved Groom Throne Sofa & Brass Hospitality Coffee Table
  const groomThrone = createMajlisSofa(mats, 3.9, true, true);
  groomThrone.position.set(0, 0.66, -0.65);
  stageGroup.add(groomThrone);

  const stageTable = createCoffeeTable(mats, 1.75, 0.85);
  stageTable.position.set(0, 0.66, 0.88);
  stageGroup.add(stageTable);

  group.add(stageGroup);

  // DEDICATED PROMINENT BACKLIT BRIDE & GROOM NAME PLAQUE — Crown of Men's Stage (100% Unobstructed!)
  const mensCouplePlaque = createBacklitCouplePlaque(ctx, mats, {
    width: 7.6,
    height: 1.95,
    subtitleAr: 'بارك الله لكما وبارك عليكما وجمع بينكما في خير',
  });
  mensCouplePlaque.position.set(-18.5, FLOOR_Y + 8.35, -16.95);
  group.add(mensCouplePlaque);

  // Large Main Stage LED Video Wall cleanly positioned beneath the Couple Name Plaque
  createFramedLEDScreen(group, ctx, mats, {
    screenId: 'mens-stage-main',
    x: -18.5,
    y: FLOOR_Y + 4.45,
    z: -17.3,
    width: 10.6,
    height: 4.7,
    cameraPos: [-18.5, 3.4, -4.5],
    lookAt: [-18.5, 4.9, -17.3],
  });

  // Flanking Side LED Screens, Overhead Rigging Truss & Line-Array Speakers
  const truss = new THREE.Mesh(new THREE.BoxGeometry(15.2, 0.26, 0.28), mats.darkBronze);
  truss.position.set(-18.5, FLOOR_Y + 9.6, -12.8);
  group.add(truss);

  for (const side of [-1, 1]) {
    createFramedLEDScreen(group, ctx, mats, {
      screenId: 'mens-stage-sides',
      x: -18.5 + side * 10.2,
      y: FLOOR_Y + 4.4,
      z: -16.8,
      rotY: -side * 0.22,
      width: 4.4,
      height: 3.8,
      cameraPos: [-18.5 + side * 6.5, 3.0, -7.5],
      lookAt: [-18.5 + side * 10.2, 4.4, -16.8],
    });

    const speaker = createLineArraySpeaker(mats);
    speaker.position.set(-18.5 + side * 7.6, FLOOR_Y + 7.5, -16.1);
    group.add(speaker);
  }

  // Groom Stage Key Spotlight + Moving Warm Gala Accent Spotlights
  const groomSpot = new THREE.SpotLight(0xffe1a8, 48, 32, Math.PI / 4, 0.45, 1.3);
  groomSpot.position.set(-18.5, FLOOR_Y + 9.4, -7.0);
  groomSpot.target.position.set(-18.5, FLOOR_Y + 1.4, -14.8);
  group.add(groomSpot);
  group.add(groomSpot.target);
  ctx.dynamicLights.stageSpots.push(groomSpot);

  const sweepSpotM = new THREE.SpotLight(0xffd796, 28, 30, Math.PI / 6, 0.6, 1.3);
  sweepSpotM.position.set(-18.5, FLOOR_Y + 9.4, -12.6);
  sweepSpotM.target.position.set(-18.5, FLOOR_Y + 0.5, -5.0);
  group.add(sweepSpotM);
  group.add(sweepSpotM.target);
  ctx.dynamicLights.stageSpots.push(sweepSpotM);
  ctx.animatedObjects.movingSpots.push({
    light: sweepSpotM,
    baseX: -18.5,
    baseZ: -5.0,
    phase: 0.4,
    amp: 5.5,
  });

  // =========================================================================
  // 5. MEN'S DINING & BUFFET HALL (X: -43.6 to -8, Z: -43.6 to -18)
  // =========================================================================
  addWall(group, ctx, -18.5, FLOOR_Y + 5.2, -18, 17, 10.4, 0.65, mats.ivoryMarble, true);
  addWallWithDoorwayX(
    group,
    ctx,
    -35.5,
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
    -5.5,
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
    id: 'door-mens-dining',
    nameEn: "Men's Dining Hall Doors",
    nameAr: 'بوابة صالة طعام الرجال',
    x: -35.5,
    z: -18,
    axis: 'x',
    width: 4.5,
    height: 3.7,
    style: 'walnut',
  });

  const diningExit = createExitSign(mats);
  diningExit.position.set(-35.5, FLOOR_Y + 4.15, -18.4);
  group.add(diningExit);

  const diningSignTex = createSignTexture(
    'صالة طعام الرجال · البوفيه المفتوح',
    "MEN'S ROYAL BANQUET & BUFFET",
    '#1A1511',
    '#D4B074',
    512,
    128,
  );
  const diningSign = new THREE.Mesh(
    new THREE.PlaneGeometry(4.4, 1.0),
    new THREE.MeshBasicMaterial({ map: diningSignTex }),
  );
  diningSign.position.set(-35.5, FLOOR_Y + 4.65, -17.6);
  group.add(diningSign);

  addWallWithDoorwayZ(
    group,
    ctx,
    -8,
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
    id: 'door-kitchen-west',
    nameEn: "Men's Kitchen Service Door",
    nameAr: 'باب خدمة المطبخ · قسم الرجال',
    x: -8,
    z: -31,
    axis: 'z',
    width: 2.5,
    height: 2.9,
    style: 'walnut',
  });

  // Grand 5-Star Open Buffet Islands in Men's Dining Hall
  const hotBuffet = createBuffetStation(mats, 8.8, 'hot');
  hotBuffet.position.set(-22, FLOOR_Y, -39.5);
  group.add(hotBuffet);
  ctx.colliders.push({ minX: -26.6, maxX: -17.4, minZ: -40.2, maxZ: -38.8 });

  const coldBuffet = createBuffetStation(mats, 7.6, 'cold');
  coldBuffet.position.set(-34, FLOOR_Y, -39.5);
  group.add(coldBuffet);
  ctx.colliders.push({ minX: -38.0, maxX: -30.0, minZ: -40.2, maxZ: -38.8 });

  const dessertBuffet = createBuffetStation(mats, 6.8, 'dessert');
  dessertBuffet.rotation.y = Math.PI / 2;
  dessertBuffet.position.set(-12.2, FLOOR_Y, -31);
  group.add(dessertBuffet);

  // Candlelit Five-Star Round Banquet Dining Tables & Medallion Chairs
  const mensDiningTables: [number, number][] = [
    [-36, -24.5],
    [-28, -24.5],
    [-20, -24.5],
    [-36, -32.2],
    [-28, -32.2],
    [-20, -32.2],
  ];
  for (const [tx, tz] of mensDiningTables) {
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

  for (const dx of [-32, -19]) {
    const ch = createCrystalChandelier(mats, 1.65, 2.1);
    ch.position.set(dx, FLOOR_Y + 9.2, -30.5);
    group.add(ch);
    ctx.animatedObjects.crystalGroups.push(ch);

    const dl = new THREE.PointLight(0xffe9c7, 24, 28, 1.45);
    dl.position.set(dx, FLOOR_Y + 6.8, -30.5);
    group.add(dl);
    ctx.dynamicLights.interiorChandeliers.push(dl);
  }

  ctx.scene.add(group);
  return group;
}
