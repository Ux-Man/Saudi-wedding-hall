import * as THREE from 'three';
import { BuildContext } from '../types/venue';
import { VenueMaterials } from './materials';

/**
 * Helper to create a crisp bilingual architectural directional or welcome sign canvas texture.
 */
export function createSignTexture(
  titleAr: string,
  titleEn: string,
  bgHex = '#1B1714',
  goldHex = '#C7A572',
  width = 512,
  height = 192,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = bgHex;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = goldHex;
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, width - 20, height - 20);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(18, 18, width - 36, height - 36);

  ctx.fillStyle = '#F2EBE0';
  ctx.font = `700 ${Math.round(height * 0.27)}px Amiri, Cairo, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(titleAr, width / 2, height * 0.37);

  ctx.fillStyle = goldHex;
  ctx.fillRect(width * 0.28, height * 0.56, width * 0.44, 2);

  ctx.fillStyle = goldHex;
  ctx.font = `600 ${Math.round(height * 0.16)}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(titleEn.toUpperCase(), width / 2, height * 0.75);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Dedicated Backlit 3D Architectural Bride & Groom Name Plaque (100% unobstructed, centered,
 * live-updatable whenever couple names are edited in the LED Screen Studio).
 */
export function createBacklitCouplePlaque(
  ctx: BuildContext,
  mats: VenueMaterials,
  opts: {
    width: number;
    height: number;
    groomAr?: string;
    brideAr?: string;
    groomEn?: string;
    brideEn?: string;
    eventDate?: string;
    subtitleAr?: string;
  },
): THREE.Group {
  const group = new THREE.Group();
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 384;
  const c2d = canvas.getContext('2d')!;

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;

  const draw = (gAr: string, bAr: string, gEn: string, bEn: string, dateStr: string) => {
    const w = canvas.width;
    const h = canvas.height;
    const grad = c2d.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w * 0.58);
    grad.addColorStop(0, '#261D15');
    grad.addColorStop(0.65, '#16110D');
    grad.addColorStop(1, '#0C0907');
    c2d.fillStyle = grad;
    c2d.fillRect(0, 0, w, h);

    // Ornate double champagne-gold border with diamond corner medallions
    c2d.strokeStyle = '#D9B882';
    c2d.lineWidth = 6;
    c2d.strokeRect(16, 16, w - 32, h - 32);
    c2d.strokeStyle = 'rgba(217,184,130,0.55)';
    c2d.lineWidth = 2;
    c2d.strokeRect(28, 28, w - 56, h - 56);

    for (const [cx, cy] of [
      [28, 28],
      [w - 28, 28],
      [28, h - 28],
      [w - 28, h - 28],
    ]) {
      c2d.save();
      c2d.translate(cx, cy);
      c2d.rotate(Math.PI / 4);
      c2d.fillStyle = '#E5C690';
      c2d.fillRect(-9, -9, 18, 18);
      c2d.restore();
    }

    c2d.textAlign = 'center';
    c2d.textBaseline = 'middle';

    // Top Arabic blessing / subtitle
    c2d.fillStyle = '#D9B882';
    c2d.font = '600 30px Amiri, Cairo, serif';
    c2d.fillText(opts.subtitleAr ?? 'أفراح آل سعود وآل راشد · بارك الله لكما', w / 2, 74);

    // Prominent calligraphic Arabic Bride & Groom names with golden glow
    c2d.save();
    c2d.shadowColor = 'rgba(255, 214, 138, 0.55)';
    c2d.shadowBlur = 18;
    c2d.fillStyle = '#FFF8EC';
    c2d.font = '700 104px Amiri, Cairo, serif';
    c2d.fillText(`${gAr}   ✦   ${bAr}`, w / 2, 186);
    c2d.restore();

    // Ornamental divider
    c2d.fillStyle = '#C7A572';
    c2d.fillRect(w * 0.24, 256, w * 0.52, 2.5);

    // Refined English couple names + date
    c2d.fillStyle = '#F0D7AA';
    c2d.font = '600 44px "Cormorant Garamond", Georgia, serif';
    c2d.fillText(`${gEn.toUpperCase()}   &   ${bEn.toUpperCase()}`, w / 2, 304);

    c2d.fillStyle = 'rgba(238, 231, 218, 0.82)';
    c2d.font = '500 22px "Plus Jakarta Sans", sans-serif';
    c2d.fillText(dateStr, w / 2, 348);

    tex.needsUpdate = true;
  };

  draw(
    opts.groomAr ?? 'فيصل',
    opts.brideAr ?? 'نورة',
    opts.groomEn ?? 'Faisal',
    opts.brideEn ?? 'Noura',
    opts.eventDate ?? '21 · 11 · 2026',
  );

  // Warm backlit halo behind plaque
  const halo = new THREE.Mesh(
    new THREE.BoxGeometry(opts.width + 0.34, opts.height + 0.34, 0.08),
    mats.warmEmissive,
  );
  halo.position.z = -0.14;
  group.add(halo);

  // Beveled champagne-gold outer sculptural frame
  const goldFrame = new THREE.Mesh(
    new THREE.BoxGeometry(opts.width + 0.24, opts.height + 0.24, 0.14),
    mats.champagneGold,
  );
  goldFrame.position.z = -0.08;
  group.add(goldFrame);

  // Dark bronze inner reveal bezel
  const bronzeBezel = new THREE.Mesh(
    new THREE.BoxGeometry(opts.width + 0.08, opts.height + 0.08, 0.16),
    mats.darkBronze,
  );
  bronzeBezel.position.z = -0.06;
  group.add(bronzeBezel);

  // Self-lit ultra-crisp calligraphy display face
  const faceMat = new THREE.MeshStandardMaterial({
    map: tex,
    emissive: new THREE.Color(0xfff5e4),
    emissiveMap: tex,
    emissiveIntensity: 0.92,
    roughness: 0.22,
    metalness: 0.1,
  });
  const face = new THREE.Mesh(new THREE.PlaneGeometry(opts.width, opts.height), faceMat);
  face.position.z = 0.03;
  group.add(face);

  ctx.couplePlaques.push({
    updateNames: draw,
    dispose: () => {
      tex.dispose();
      faceMat.dispose();
    },
  });

  return group;
}

/**
 * Ultra-Detailed Multi-Brand Sculpted Luxury Vehicles:
 * Rolls-Royce Phantom, Bentley Flying Spur, Mercedes-Benz S-Class, Range Rover Autobiography.
 * Features sculpted lower chassis, flared fenders, tapered greenhouse with separate angled windshields,
 * panoramic glass roof, chrome window trims, brand-authentic grilles, DRL LED headlamps, mirrors,
 * license plates, dual exhausts, and deep-dish 10-spoke alloy wheels with brake discs & gold calipers.
 */
export function createLuxuryVehicle(
  mats: VenueMaterials,
  brand: 'rolls' | 'bentley' | 'mercedes' | 'rangerover',
  paintIndex: number,
  lightsOn = false,
): THREE.Group {
  const group = new THREE.Group();
  const paint = mats.carPaints[paintIndex % mats.carPaints.length];
  const isSuv = brand === 'rangerover';
  const isRR = brand === 'rolls';
  const length = isRR ? 5.55 : isSuv ? 5.22 : 5.15;
  const width = isSuv ? 2.04 : 1.96;

  // Soft Ground Contact Shadow
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(width + 0.95, length + 1.05),
    mats.contactShadow,
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.025;
  group.add(shadow);

  // 1. Sculpted Lower Beltline Body Profile (Extruded along X then rotated so +Z is front)
  const lowerShape = new THREE.Shape();
  if (isSuv) {
    lowerShape.moveTo(-2.54, 0.36);
    lowerShape.lineTo(2.54, 0.36);
    lowerShape.quadraticCurveTo(2.64, 0.44, 2.6, 0.98);
    lowerShape.quadraticCurveTo(2.55, 1.15, 2.34, 1.18);
    lowerShape.lineTo(-2.36, 1.2);
    lowerShape.quadraticCurveTo(-2.58, 1.16, -2.58, 0.5);
    lowerShape.closePath();
  } else if (isRR) {
    // Long stately Rolls-Royce hood & high beltline
    lowerShape.moveTo(-2.68, 0.3);
    lowerShape.lineTo(2.68, 0.3);
    lowerShape.quadraticCurveTo(2.78, 0.36, 2.75, 0.94);
    lowerShape.quadraticCurveTo(2.7, 1.04, 2.45, 1.06);
    lowerShape.lineTo(0.85, 1.08);
    lowerShape.lineTo(-2.45, 1.04);
    lowerShape.quadraticCurveTo(-2.74, 0.98, -2.74, 0.44);
    lowerShape.closePath();
  } else {
    // Sleek Bentley / Mercedes executive sedan lower hull
    lowerShape.moveTo(-2.5, 0.28);
    lowerShape.lineTo(2.5, 0.28);
    lowerShape.quadraticCurveTo(2.62, 0.36, 2.57, 0.78);
    lowerShape.quadraticCurveTo(2.48, 0.94, 1.95, 0.98);
    lowerShape.lineTo(0.85, 1.02);
    lowerShape.lineTo(-2.15, 0.99);
    lowerShape.quadraticCurveTo(-2.58, 0.92, -2.55, 0.42);
    lowerShape.closePath();
  }

  const lowerGeo = new THREE.ExtrudeGeometry(lowerShape, {
    depth: width - 0.14,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.07,
    bevelSegments: 4,
  });
  lowerGeo.center();
  lowerGeo.rotateY(-Math.PI / 2);
  const lowerBody = new THREE.Mesh(lowerGeo, paint);
  lowerBody.position.y = isSuv ? 0.78 : isRR ? 0.68 : 0.64;
  lowerBody.castShadow = true;
  lowerBody.receiveShadow = true;
  group.add(lowerBody);

  // 2. Tapered Upper Greenhouse Cabin (narrower than fenders for realistic automotive tumblehome!)
  const cabinShape = new THREE.Shape();
  if (isSuv) {
    cabinShape.moveTo(-2.22, 0);
    cabinShape.lineTo(1.18, 0);
    cabinShape.lineTo(0.68, 0.66);
    cabinShape.lineTo(-1.98, 0.66);
    cabinShape.closePath();
  } else if (isRR) {
    cabinShape.moveTo(-1.82, 0);
    cabinShape.lineTo(0.95, 0);
    cabinShape.lineTo(0.42, 0.52);
    cabinShape.lineTo(-1.32, 0.52);
    cabinShape.closePath();
  } else {
    cabinShape.moveTo(-1.75, 0);
    cabinShape.lineTo(1.02, 0);
    cabinShape.quadraticCurveTo(0.35, 0.52, -0.35, 0.52);
    cabinShape.quadraticCurveTo(-1.05, 0.5, -1.75, 0);
    cabinShape.closePath();
  }

  const cabinWidth = width - 0.36;
  const cabinGeo = new THREE.ExtrudeGeometry(cabinShape, {
    depth: cabinWidth,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.04,
    bevelSegments: 3,
  });
  cabinGeo.center();
  cabinGeo.rotateY(-Math.PI / 2);
  const cabinGlass = new THREE.Mesh(cabinGeo, mats.carGlass);
  cabinGlass.position.set(0, isSuv ? 1.48 : isRR ? 1.28 : 1.18, isSuv ? -0.52 : -0.34);
  group.add(cabinGlass);

  // Painted Roof Crown Cap + Panoramic Tinted Moonroof Inset
  const roofLen = isSuv ? 2.62 : isRR ? 1.75 : 1.65;
  const roofY = isSuv ? 1.83 : isRR ? 1.56 : 1.46;
  const roofZ = isSuv ? -0.64 : -0.44;
  const roofCap = new THREE.Mesh(
    new THREE.BoxGeometry(cabinWidth - 0.02, 0.055, roofLen),
    paint,
  );
  roofCap.position.set(0, roofY, roofZ);
  group.add(roofCap);

  const moonroof = new THREE.Mesh(
    new THREE.BoxGeometry(cabinWidth - 0.28, 0.06, roofLen * 0.65),
    mats.carGlass,
  );
  moonroof.position.set(0, roofY + 0.006, roofZ + 0.06);
  group.add(moonroof);

  // Chrome Side Window Trim & Rocker Sill Molding
  for (const side of [-1, 1]) {
    const sill = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.055, length * 0.54),
      mats.chrome,
    );
    sill.position.set(side * (width / 2 - 0.01), isSuv ? 0.42 : 0.34, 0);
    group.add(sill);

    const beltTrim = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.032, roofLen + 0.5),
      mats.chrome,
    );
    beltTrim.position.set(side * (width / 2 - 0.07), isSuv ? 1.18 : 1.02, roofZ + 0.1);
    group.add(beltTrim);

    // Sculpted Wing Mirrors with Chrome Cap
    const mirrorStem = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.045, 0.07), mats.darkBronze);
    mirrorStem.position.set(side * (width / 2 - 0.02), isSuv ? 1.24 : 1.05, 0.54);
    group.add(mirrorStem);
    const mirrorCap = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.11, 0.15), paint);
    mirrorCap.position.set(side * (width / 2 + 0.08), isSuv ? 1.27 : 1.08, 0.52);
    group.add(mirrorCap);

    // Flush Chrome Door Handles (front + rear)
    for (const hz of [0.22, -0.78]) {
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.035, 0.2), mats.chrome);
      handle.position.set(side * (width / 2 + 0.01), isSuv ? 1.06 : 0.89, hz);
      group.add(handle);
    }

    // Dark recessed wheel well arches
    for (const wz of [length * 0.31, -length * 0.31]) {
      const well = new THREE.Mesh(
        new THREE.CylinderGeometry(isSuv ? 0.46 : 0.41, isSuv ? 0.46 : 0.41, 0.18, 16),
        mats.ledBezel,
      );
      well.rotation.z = Math.PI / 2;
      well.position.set(side * (width / 2 - 0.12), isSuv ? 0.43 : 0.37, wz);
      group.add(well);
    }
  }

  // 3. Brand-Specific Iconic Front Grille, Hood Ornament, Lower Intake & License Plate
  const frontZ = length / 2 + 0.01;
  const grilleY = isSuv ? 0.86 : isRR ? 0.72 : 0.65;
  const grilleW = isRR ? 0.94 : isSuv ? 1.22 : 1.12;
  const grilleH = isRR ? 0.54 : isSuv ? 0.38 : 0.32;

  const grilleBacking = new THREE.Mesh(
    new THREE.BoxGeometry(grilleW, grilleH, 0.08),
    mats.ledBezel,
  );
  grilleBacking.position.set(0, grilleY, frontZ - 0.01);
  group.add(grilleBacking);

  const grilleFrame = new THREE.Mesh(
    new THREE.BoxGeometry(grilleW + 0.08, grilleH + 0.06, 0.05),
    mats.chrome,
  );
  grilleFrame.position.set(0, grilleY, frontZ - 0.025);
  group.add(grilleFrame);

  if (isRR) {
    // Signature Parthenon vertical chrome slats + golden Spirit hood emblem
    for (let s = -4; s <= 4; s++) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.025, grilleH - 0.04, 0.04), mats.chrome);
      slat.position.set(s * 0.095, grilleY, frontZ + 0.02);
      group.add(slat);
    }
    const emblem = new THREE.Mesh(new THREE.OctahedronGeometry(0.055, 0), mats.champagneGold);
    emblem.scale.set(0.7, 1.5, 0.7);
    emblem.position.set(0, grilleY + grilleH / 2 + 0.11, frontZ - 0.04);
    group.add(emblem);
  } else {
    // Horizontal chrome slats (Mercedes / Range Rover / Bentley)
    for (let s = -1; s <= 1; s++) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(grilleW - 0.06, 0.032, 0.04), mats.chrome);
      bar.position.set(0, grilleY + s * 0.085, frontZ + 0.02);
      group.add(bar);
    }
    const badge = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.03, 16), mats.chrome);
    badge.rotation.x = Math.PI / 2;
    badge.position.set(0, grilleY, frontZ + 0.03);
    group.add(badge);
  }

  // Front Saudi Royal White License Plate & Chrome Bumper Lip
  const frontPlate = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.11, 0.02), mats.ivoryMarble);
  frontPlate.position.set(0, isSuv ? 0.52 : 0.41, frontZ + 0.03);
  group.add(frontPlate);

  const rearPlate = frontPlate.clone();
  rearPlate.position.set(0, isSuv ? 0.78 : 0.64, -length / 2 - 0.03);
  group.add(rearPlate);

  const frontSplitter = new THREE.Mesh(new THREE.BoxGeometry(width - 0.16, 0.065, 0.14), mats.chrome);
  frontSplitter.position.set(0, isSuv ? 0.4 : 0.31, frontZ - 0.02);
  group.add(frontSplitter);

  // Rear diffuser & Twin Rectangular Chrome Exhaust Tips
  const diffuser = new THREE.Mesh(new THREE.BoxGeometry(width - 0.2, 0.14, 0.14), mats.ledBezel);
  diffuser.position.set(0, isSuv ? 0.42 : 0.34, -length / 2 + 0.01);
  group.add(diffuser);

  for (const side of [-1, 1]) {
    const exhaust = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.12), mats.chrome);
    exhaust.position.set(side * (width * 0.34), isSuv ? 0.4 : 0.32, -length / 2 - 0.03);
    group.add(exhaust);

    // Multi-element LED Headlight Housing + DRL Bar
    const hlHousing = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.14, 0.1), mats.ledBezel);
    hlHousing.position.set(side * (width * 0.35), isSuv ? 0.96 : isRR ? 0.84 : 0.75, frontZ - 0.04);
    group.add(hlHousing);

    const hlLens = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.09, 0.05),
      lightsOn ? mats.headlight : mats.chrome,
    );
    hlLens.position.set(side * (width * 0.35), isSuv ? 0.96 : isRR ? 0.84 : 0.75, frontZ + 0.01);
    group.add(hlLens);

    // Sculpted Wrap-Around Rear Taillight Clusters
    const tailCluster = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, isSuv ? 0.22 : 0.13, 0.1),
      mats.taillight,
    );
    tailCluster.position.set(side * (width * 0.34), isSuv ? 1.04 : 0.82, -length / 2 - 0.01);
    group.add(tailCluster);
  }

  // Full-width chrome trunk trim strip
  const trunkTrim = new THREE.Mesh(new THREE.BoxGeometry(width - 0.42, 0.035, 0.06), mats.chrome);
  trunkTrim.position.set(0, isSuv ? 0.96 : 0.88, -length / 2 - 0.02);
  group.add(trunkTrim);

  // 4. Deep-Dish Multi-Spoke Alloy Wheels with Brake Rotors & Gold Calipers
  const wheelRadius = isSuv ? 0.41 : 0.36;
  const wheelWidth = 0.27;
  const tireGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 24);
  tireGeo.rotateZ(Math.PI / 2);
  const rimBarrelGeo = new THREE.CylinderGeometry(
    wheelRadius * 0.72,
    wheelRadius * 0.72,
    wheelWidth + 0.015,
    20,
  );
  rimBarrelGeo.rotateZ(Math.PI / 2);
  const discGeo = new THREE.CylinderGeometry(wheelRadius * 0.56, wheelRadius * 0.56, 0.04, 16);
  discGeo.rotateZ(Math.PI / 2);
  const spokeGeo = new THREE.BoxGeometry(0.03, wheelRadius * 1.32, 0.036);
  const hubGeo = new THREE.CylinderGeometry(
    wheelRadius * 0.19,
    wheelRadius * 0.19,
    wheelWidth + 0.05,
    12,
  );
  hubGeo.rotateZ(Math.PI / 2);

  for (const wz of [length * 0.31, -length * 0.31]) {
    for (const side of [-1, 1]) {
      const wg = new THREE.Group();
      wg.position.set(side * (width / 2 - 0.06), wheelRadius, wz);
      wg.add(new THREE.Mesh(tireGeo, mats.carTire));
      wg.add(new THREE.Mesh(rimBarrelGeo, mats.ledBezel));

      // Brake disc + champagne gold caliper
      const disc = new THREE.Mesh(discGeo, mats.stainlessSteel);
      disc.position.x = side * 0.02;
      wg.add(disc);

      // 5 twin-spokes (10-spoke luxury rim look)
      for (let sp = 0; sp < 5; sp++) {
        const spoke = new THREE.Mesh(spokeGeo, mats.chrome);
        spoke.position.x = side * (wheelWidth * 0.48);
        spoke.rotation.x = (sp / 5) * Math.PI;
        wg.add(spoke);
      }

      // Center crest cap
      wg.add(new THREE.Mesh(hubGeo, mats.champagneGold));
      group.add(wg);
    }
  }

  return group;
}

/**
 * Classical-Saudi Fluted Marble Architectural Column with Molded Plinth, Ornate Gilded Capital & Uplight Collar.
 */
export function createSculptedColumn(
  mats: VenueMaterials,
  height = 8.4,
  radius = 0.42,
): THREE.Group {
  const group = new THREE.Group();

  // Molded charcoal marble square plinth
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(radius * 2.8, 0.45, radius * 2.8),
    mats.charcoalMarble,
  );
  plinth.position.y = 0.225;
  plinth.castShadow = true;
  group.add(plinth);

  // Double gold torus base molding
  const baseTorus = new THREE.Mesh(
    new THREE.TorusGeometry(radius * 1.08, radius * 0.16, 10, 24),
    mats.champagneGold,
  );
  baseTorus.rotation.x = Math.PI / 2;
  baseTorus.position.y = 0.54;
  group.add(baseTorus);

  // Warm uplight collar
  const uplight = new THREE.Mesh(
    new THREE.TorusGeometry(radius * 1.05, 0.035, 8, 24),
    mats.warmEmissive,
  );
  uplight.rotation.x = Math.PI / 2;
  uplight.position.y = 0.68;
  group.add(uplight);

  // Main fluted shaft (16-segment tapered column with vertical gold fluting ribs)
  const shaftH = height - 1.35;
  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.92, radius, shaftH, 20),
    mats.ivoryMarble,
  );
  shaft.position.y = 0.6 + shaftH / 2;
  shaft.castShadow = true;
  shaft.receiveShadow = true;
  group.add(shaft);

  // 8 subtle vertical champagne-gold fillet ribs along shaft
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const rib = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.025, shaftH - 0.2, 6),
      mats.champagneGold,
    );
    rib.position.set(
      Math.cos(a) * (radius * 0.96),
      0.6 + shaftH / 2,
      Math.sin(a) * (radius * 0.96),
    );
    group.add(rib);
  }

  // Ornate stepped Muqarnas / Classical Gilded Capital
  const neckRing = new THREE.Mesh(
    new THREE.TorusGeometry(radius * 0.98, radius * 0.12, 10, 24),
    mats.champagneGold,
  );
  neckRing.rotation.x = Math.PI / 2;
  neckRing.position.y = height - 0.72;
  group.add(neckRing);

  const bellCap = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 1.32, radius * 0.92, 0.45, 16),
    mats.champagneGold,
  );
  bellCap.position.y = height - 0.46;
  group.add(bellCap);

  const abacus = new THREE.Mesh(
    new THREE.BoxGeometry(radius * 2.9, 0.24, radius * 2.9),
    mats.ivoryMarble,
  );
  abacus.position.y = height - 0.12;
  group.add(abacus);

  return group;
}

/**
 * Luxury Organic Ivory, Pearl-White & Champagne-Gold Wedding Balloon Garland / Arch.
 * Uses instanced glossy clearcoat spheres of varied organic radii for crisp realism and high FPS.
 */
export function createWeddingBalloonArch(
  mats: VenueMaterials,
  spanWidth = 6.2,
  archHeight = 4.6,
  seed = 1,
): THREE.Group {
  const group = new THREE.Group();
  const sphereGeo = new THREE.SphereGeometry(1, 14, 12);

  const ivoryTransforms: THREE.Matrix4[] = [];
  const goldTransforms: THREE.Matrix4[] = [];
  const pearlTransforms: THREE.Matrix4[] = [];

  const dummy = new THREE.Object3D();
  let s = seed * 9137;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };

  const steps = 44;
  const rx = spanWidth / 2;
  const pillarH = Math.max(0.8, archHeight - rx * 0.62);

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    let cx = 0;
    let cy = 0;
    if (t < 0.25) {
      // Left ascending column
      const u = t / 0.25;
      cx = -rx;
      cy = 0.25 + u * pillarH;
    } else if (t <= 0.75) {
      // Top sweeping arch
      const u = (t - 0.25) / 0.5;
      const ang = Math.PI - u * Math.PI;
      cx = Math.cos(ang) * rx;
      cy = pillarH + Math.sin(ang) * (archHeight - pillarH);
    } else {
      // Right descending column
      const u = (t - 0.75) / 0.25;
      cx = rx;
      cy = pillarH * (1 - u) + 0.25;
    }

    // 3 overlapping organic balloons at each spine point
    for (let k = 0; k < 3; k++) {
      const r = 0.15 + rand() * 0.16;
      dummy.position.set(
        cx + (rand() - 0.5) * 0.42,
        cy + (rand() - 0.5) * 0.36,
        (rand() - 0.5) * 0.38,
      );
      dummy.scale.set(r, r * (1.04 + rand() * 0.1), r);
      dummy.rotation.set(rand() * 0.5, rand() * Math.PI, rand() * 0.5);
      dummy.updateMatrix();
      const matCopy = dummy.matrix.clone();
      const pick = (i + k) % 3;
      if (pick === 0) ivoryTransforms.push(matCopy);
      else if (pick === 1) goldTransforms.push(matCopy);
      else pearlTransforms.push(matCopy);
    }
  }

  const buildInst = (list: THREE.Matrix4[], mat: THREE.Material) => {
    if (list.length === 0) return;
    const im = new THREE.InstancedMesh(sphereGeo, mat, list.length);
    list.forEach((m, idx) => im.setMatrixAt(idx, m));
    im.instanceMatrix.needsUpdate = true;
    im.computeBoundingSphere();
    group.add(im);
  };

  buildInst(ivoryTransforms, mats.balloonIvory);
  buildInst(goldTransforms, mats.balloonGold);
  buildInst(pearlTransforms, mats.balloonPearl);

  return group;
}

/**
 * Monumental Illuminated Floral & Fairy-Light Wedding Entrance / Runway Arch.
 * Draped in dense white/blush roses, emerald eucalyptus foliage, silk swags & glowing tungsten bulbs.
 */
export function createFloralEntranceArch(
  mats: VenueMaterials,
  spanWidth = 6.0,
  archHeight = 4.9,
  withSilkDrapes = true,
): THREE.Group {
  const group = new THREE.Group();
  const rx = spanWidth / 2;
  const pillarH = Math.max(1.2, archHeight - rx * 0.58);

  // Double sculptural champagne-gold tubular arch frame
  const curvePts: THREE.Vector3[] = [];
  for (let i = 0; i <= 32; i++) {
    const t = i / 32;
    if (t < 0.25) {
      curvePts.push(new THREE.Vector3(-rx, (t / 0.25) * pillarH, 0));
    } else if (t <= 0.75) {
      const ang = Math.PI - ((t - 0.25) / 0.5) * Math.PI;
      curvePts.push(
        new THREE.Vector3(
          Math.cos(ang) * rx,
          pillarH + Math.sin(ang) * (archHeight - pillarH),
          0,
        ),
      );
    } else {
      curvePts.push(new THREE.Vector3(rx, pillarH * (1 - (t - 0.75) / 0.25), 0));
    }
  }
  const archCurve = new THREE.CatmullRomCurve3(curvePts);
  const frameMesh = new THREE.Mesh(
    new THREE.TubeGeometry(archCurve, 44, 0.085, 10, false),
    mats.champagneGold,
  );
  group.add(frameMesh);

  // Dense Instanced Rose / Peony / Eucalyptus Floral Clusters + Sparkling Fairy Lights along Arch
  const flowerGeo = new THREE.DodecahedronGeometry(0.18, 1);
  const leafGeo = new THREE.DodecahedronGeometry(0.22, 0);
  const bulbGeo = new THREE.SphereGeometry(0.032, 6, 6);

  const whiteMats: THREE.Matrix4[] = [];
  const blushMats: THREE.Matrix4[] = [];
  const leafMats: THREE.Matrix4[] = [];
  const bulbMats: THREE.Matrix4[] = [];
  const dummy = new THREE.Object3D();

  const samples = 42;
  for (let i = 0; i <= samples; i++) {
    const pt = archCurve.getPoint(i / samples);
    // Foliage backing
    dummy.position.set(
      pt.x + Math.sin(i * 3.1) * 0.16,
      pt.y + Math.cos(i * 2.3) * 0.14,
      Math.sin(i * 1.9) * 0.18,
    );
    dummy.scale.set(1.25, 0.85, 1.25);
    dummy.rotation.set(i * 0.5, i * 0.9, 0);
    dummy.updateMatrix();
    leafMats.push(dummy.matrix.clone());

    // Two layered blossoms per point
    for (let k = 0; k < 2; k++) {
      const sc = 0.78 + ((i * 7 + k * 3) % 5) * 0.12;
      dummy.position.set(
        pt.x + Math.cos(i * 2.7 + k * 2.1) * 0.24,
        pt.y + Math.sin(i * 1.9 + k * 1.7) * 0.2,
        0.14 * (k === 0 ? 1 : -1) + Math.sin(i * 4.1) * 0.1,
      );
      dummy.scale.setScalar(sc);
      dummy.rotation.set(i * 0.4, k * 1.3, i * 0.2);
      dummy.updateMatrix();
      if ((i + k) % 3 === 0) blushMats.push(dummy.matrix.clone());
      else whiteMats.push(dummy.matrix.clone());
    }

    // Fairy lights woven through arch
    for (let b = 0; b < 2; b++) {
      dummy.position.set(
        pt.x + Math.sin(i * 5.3 + b * 3) * 0.28,
        pt.y + Math.cos(i * 3.7 + b * 2) * 0.24,
        0.24 * (b === 0 ? 1 : -0.6),
      );
      dummy.scale.setScalar(1);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      bulbMats.push(dummy.matrix.clone());
    }
  }

  const addInst = (geo: THREE.BufferGeometry, mat: THREE.Material, list: THREE.Matrix4[]) => {
    const im = new THREE.InstancedMesh(geo, mat, list.length);
    list.forEach((m, idx) => im.setMatrixAt(idx, m));
    im.instanceMatrix.needsUpdate = true;
    im.computeBoundingSphere();
    group.add(im);
  };

  addInst(leafGeo, mats.floralLeaf, leafMats);
  addInst(flowerGeo, mats.floralWhite, whiteMats);
  addInst(flowerGeo, mats.floralBlush, blushMats);
  addInst(bulbGeo, mats.fairyLightGlow, bulbMats);

  // Flowing Pleated Silk Drapery Panels tied back on left & right pillars
  if (withSilkDrapes) {
    for (const side of [-1, 1]) {
      const drape = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.36, pillarH + 0.6, 12, 1, true),
        mats.silkDrape,
      );
      drape.position.set(side * (rx - 0.18), (pillarH + 0.6) / 2, 0.06);
      group.add(drape);

      const tieback = new THREE.Mesh(
        new THREE.TorusGeometry(0.24, 0.035, 8, 16),
        mats.champagneGold,
      );
      tieback.rotation.x = Math.PI / 2;
      tieback.position.set(side * (rx - 0.16), pillarH * 0.45, 0.06);
      group.add(tieback);
    }
  }

  return group;
}

/**
 * Sparkling Catenary Warm Fairy-Light / String-Light Canopy (Exterior Plaza, Valet & Ballroom Ceiling).
 */
export function createFairyLightCanopy(
  mats: VenueMaterials,
  strands: [THREE.Vector3, THREE.Vector3, number][], // [start, end, sag]
  bulbsPerStrand = 14,
): THREE.Group {
  const group = new THREE.Group();
  const bulbGeo = new THREE.SphereGeometry(0.042, 6, 6);
  const matrices: THREE.Matrix4[] = [];
  const dummy = new THREE.Object3D();

  for (const [start, end, sag] of strands) {
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    mid.y -= sag;
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);

    const wire = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 16, 0.012, 5, false),
      mats.darkBronze,
    );
    group.add(wire);

    for (let i = 1; i < bulbsPerStrand; i++) {
      const p = curve.getPoint(i / bulbsPerStrand);
      dummy.position.set(p.x, p.y - 0.055, p.z);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      matrices.push(dummy.matrix.clone());
    }
  }

  if (matrices.length > 0) {
    const im = new THREE.InstancedMesh(bulbGeo, mats.fairyLightGlow, matrices.length);
    matrices.forEach((m, idx) => im.setMatrixAt(idx, m));
    im.instanceMatrix.needsUpdate = true;
    im.computeBoundingSphere();
    group.add(im);
  }
  return group;
}

/**
 * Floating Warm Golden Bokeh / Dust Sparkles inside Grand Halls.
 */
export function createSparkleField(
  mats: VenueMaterials,
  bounds: { minX: number; maxX: number; minY: number; maxY: number; minZ: number; maxZ: number },
  count = 140,
): THREE.Points {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
    positions[i * 3 + 1] = bounds.minY + Math.random() * (bounds.maxY - bounds.minY);
    positions[i * 3 + 2] = bounds.minZ + Math.random() * (bounds.maxZ - bounds.minZ);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pts = new THREE.Points(geo, mats.sparklePoints);
  pts.frustumCulled = false;
  return pts;
}

/**
 * Architectural Saudi Date Palm Tree (curved textured trunk + crown dates + 18 arching lush fronds).
 */
export function createDatePalm(mats: VenueMaterials, height = 8.5, seed = 1): THREE.Group {
  const group = new THREE.Group();

  // Molded Stone Planter Ring at Base
  const planter = new THREE.Mesh(
    new THREE.CylinderGeometry(1.15, 1.05, 0.45, 14),
    mats.travertineFacade,
  );
  planter.position.y = 0.22;
  group.add(planter);

  const planterGold = new THREE.Mesh(
    new THREE.TorusGeometry(1.12, 0.045, 8, 24),
    mats.champagneGold,
  );
  planterGold.rotation.x = Math.PI / 2;
  planterGold.position.y = 0.45;
  group.add(planterGold);

  const segments = 10;
  const curveX = Math.sin(seed * 2.1) * 0.52;
  const curveZ = Math.cos(seed * 1.7) * 0.42;
  let topX = 0;
  let topZ = 0;
  const segH = height / segments;

  for (let i = 0; i < segments; i++) {
    const t = i / segments;
    const tNext = (i + 1) / segments;
    const rBot = 0.42 - t * 0.16;
    const rTop = 0.42 - tNext * 0.16;
    const seg = new THREE.Mesh(
      new THREE.CylinderGeometry(rTop, rBot, segH + 0.09, 10),
      mats.palmTrunk,
    );
    const x = curveX * t * t;
    const z = curveZ * t * t;
    seg.position.set(x, 0.35 + i * segH + segH * 0.5, z);
    seg.rotation.z = -curveX * t * 0.14;
    seg.rotation.x = curveZ * t * 0.14;
    seg.castShadow = true;
    group.add(seg);
    topX = x;
    topZ = z;
  }

  const crown = new THREE.Group();
  crown.position.set(topX, height + 0.32, topZ);
  group.add(crown);

  const crownBulb = new THREE.Mesh(new THREE.SphereGeometry(0.46, 10, 8), mats.palmTrunk);
  crown.add(crownBulb);

  const frondShape = new THREE.Shape();
  frondShape.moveTo(0, 0);
  frondShape.quadraticCurveTo(0.48, 1.35, 0.19, 2.9);
  frondShape.lineTo(0, 3.5);
  frondShape.lineTo(-0.19, 2.9);
  frondShape.quadraticCurveTo(-0.48, 1.35, 0, 0);

  const frondGeo = new THREE.ShapeGeometry(frondShape, 7);
  const pos = frondGeo.attributes.position;
  for (let v = 0; v < pos.count; v++) {
    const y = pos.getY(v);
    pos.setZ(v, -0.14 * y * y);
  }
  frondGeo.computeVertexNormals();

  const layers = [
    { count: 10, tilt: 1.08, scale: 1.08, yOff: 0.0 },
    { count: 8, tilt: 0.62, scale: 0.88, yOff: 0.24 },
  ];

  for (const layer of layers) {
    for (let i = 0; i < layer.count; i++) {
      const angle = (i / layer.count) * Math.PI * 2 + seed * 0.5 + layer.yOff * 2;
      const frondHolder = new THREE.Group();
      frondHolder.rotation.y = angle;
      frondHolder.position.y = layer.yOff;
      const mesh = new THREE.Mesh(frondGeo, mats.palmFrond);
      mesh.rotation.x = layer.tilt;
      mesh.scale.setScalar(layer.scale);
      frondHolder.add(mesh);
      crown.add(frondHolder);
    }
  }

  return group;
}

/**
 * Monumental Royal Empire Multi-Tiered Crystal Chandelier with Ceiling Rosette,
 * Gilded Candle Arms, Glowing Bulbs & High-Density Instanced Faceted Crystal Prisms.
 */
export function createCrystalChandelier(
  mats: VenueMaterials,
  radius = 2.2,
  dropHeight = 2.6,
): THREE.Group {
  const group = new THREE.Group();

  // Ornate gilded ceiling medallion rosette
  const rosette = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.42, radius * 0.48, 0.16, 28),
    mats.champagneGold,
  );
  rosette.position.y = -0.08;
  group.add(rosette);

  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.065, 0.055, dropHeight * 0.72, 12),
    mats.champagneGold,
  );
  stem.position.y = -dropHeight * 0.36;
  group.add(stem);

  const tiers = [
    { r: radius, y: -dropHeight * 0.42, crystals: 32, len: 0.62 },
    { r: radius * 0.72, y: -dropHeight * 0.65, crystals: 24, len: 0.54 },
    { r: radius * 0.44, y: -dropHeight * 0.84, crystals: 16, len: 0.45 },
  ];

  const crystalGeo = new THREE.OctahedronGeometry(0.068, 0);
  crystalGeo.scale(0.62, 3.1, 0.62);
  const crystalMatrices: THREE.Matrix4[] = [];
  const candleMatrices: THREE.Matrix4[] = [];
  const dummy = new THREE.Object3D();

  for (const tier of tiers) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(tier.r, 0.055, 12, 40),
      mats.champagneGold,
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = tier.y;
    group.add(ring);

    const glowRing = new THREE.Mesh(
      new THREE.TorusGeometry(tier.r - 0.06, 0.032, 8, 36),
      mats.warmEmissive,
    );
    glowRing.rotation.x = Math.PI / 2;
    glowRing.position.y = tier.y - 0.02;
    group.add(glowRing);

    // Radial spokes supporting each tier
    for (let sp = 0; sp < 6; sp++) {
      const a = (sp / 6) * Math.PI * 2;
      const spoke = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, tier.r, 6),
        mats.champagneGold,
      );
      spoke.rotation.z = Math.PI / 2;
      spoke.rotation.y = -a;
      spoke.position.set(Math.cos(a) * (tier.r / 2), tier.y, Math.sin(a) * (tier.r / 2));
      group.add(spoke);
    }

    for (let i = 0; i < tier.crystals; i++) {
      const a = (i / tier.crystals) * Math.PI * 2;
      const cx = Math.cos(a) * tier.r;
      const cz = Math.sin(a) * tier.r;
      dummy.position.set(cx, tier.y - tier.len * 0.44, cz);
      dummy.scale.set(1, tier.len / 0.55, 1);
      dummy.rotation.set(0, a, 0);
      dummy.updateMatrix();
      crystalMatrices.push(dummy.matrix.clone());

      // Warm candle-bulb finial atop outer ring every 2nd prism
      if (i % 2 === 0 && tier.r >= radius * 0.65) {
        dummy.position.set(cx * 1.04, tier.y + 0.14, cz * 1.04);
        dummy.scale.set(0.75, 1.35, 0.75);
        dummy.updateMatrix();
        candleMatrices.push(dummy.matrix.clone());
      }
    }
  }

  const crystalInst = new THREE.InstancedMesh(crystalGeo, mats.crystal, crystalMatrices.length);
  crystalMatrices.forEach((m, idx) => crystalInst.setMatrixAt(idx, m));
  crystalInst.instanceMatrix.needsUpdate = true;
  crystalInst.computeBoundingSphere();
  group.add(crystalInst);

  if (candleMatrices.length > 0) {
    const bulbGeo = new THREE.SphereGeometry(0.048, 8, 8);
    const bulbInst = new THREE.InstancedMesh(bulbGeo, mats.fairyLightGlow, candleMatrices.length);
    candleMatrices.forEach((m, idx) => bulbInst.setMatrixAt(idx, m));
    bulbInst.instanceMatrix.needsUpdate = true;
    bulbInst.computeBoundingSphere();
    group.add(bulbInst);
  }

  // Faceted central crystal finial tear-drop
  const finial = new THREE.Mesh(new THREE.OctahedronGeometry(0.24, 1), mats.crystal);
  finial.scale.set(0.82, 1.6, 0.82);
  finial.position.y = -dropHeight * 1.04;
  group.add(finial);

  return group;
}

/**
 * Luxury Saudi Majlis Tufted Sofa (walnut plinth, champagne gold base trim, sculpted plush cushions,
 * tufted backrest, rolled bolster armrests, and authentic Sadu & champagne accent throw pillows).
 */
export function createMajlisSofa(
  mats: VenueMaterials,
  width = 3.2,
  useIvory = false,
  isRoyalThrone = false,
): THREE.Group {
  const group = new THREE.Group();
  const fabric = useIvory ? mats.upholsteryIvory : mats.upholsteryBeige;
  const accentFabric = useIvory ? mats.upholsteryBeige : mats.saduPillow;

  const sofaShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(width + 0.6, 1.5),
    mats.contactShadow,
  );
  sofaShadow.rotation.x = -Math.PI / 2;
  sofaShadow.position.y = 0.032;
  group.add(sofaShadow);

  // Carved walnut base + champagne gold trim rail + corner feet
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(width, 0.14, 0.96), mats.walnutWood);
  plinth.position.y = 0.1;
  group.add(plinth);

  const goldTrim = new THREE.Mesh(
    new THREE.BoxGeometry(width + 0.04, 0.045, 0.99),
    mats.champagneGold,
  );
  goldTrim.position.y = 0.18;
  group.add(goldTrim);

  for (const fx of [-width / 2 + 0.12, width / 2 - 0.12]) {
    for (const fz of [-0.38, 0.38]) {
      const foot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.03, 0.08, 10),
        mats.champagneGold,
      );
      foot.position.set(fx, 0.04, fz);
      group.add(foot);
    }
  }

  // Deep plush individual cushions & tufted backrests
  const seatCount = Math.max(2, Math.round(width / 0.95));
  const cushW = (width - 0.4) / seatCount - 0.03;
  const backH = isRoyalThrone ? 0.88 : 0.56;

  for (let i = 0; i < seatCount; i++) {
    const cx = -(width - 0.4) / 2 + (i + 0.5) * ((width - 0.4) / seatCount);
    const seat = new THREE.Mesh(new THREE.BoxGeometry(cushW, 0.25, 0.84), fabric);
    seat.position.set(cx, 0.33, 0.04);
    seat.castShadow = true;
    seat.receiveShadow = true;
    group.add(seat);

    const back = new THREE.Mesh(new THREE.BoxGeometry(cushW, backH, 0.24), fabric);
    back.position.set(cx, 0.46 + backH / 2, -0.34);
    back.rotation.x = -0.09;
    back.castShadow = true;
    group.add(back);
  }

  // Sculpted Walnut & Gold-Framed Backrest (with arched royal crown for Bride/Groom Thrones)
  const backFrame = new THREE.Mesh(
    new THREE.BoxGeometry(width, backH + 0.34, 0.12),
    isRoyalThrone ? mats.champagneGold : mats.walnutWood,
  );
  backFrame.position.set(0, 0.38 + (backH + 0.34) / 2, -0.45);
  group.add(backFrame);

  if (isRoyalThrone) {
    const crownArch = new THREE.Mesh(
      new THREE.TorusGeometry(width * 0.42, 0.07, 12, 32, Math.PI),
      mats.champagneGold,
    );
    crownArch.position.set(0, 1.32, -0.44);
    group.add(crownArch);

    const crownPad = new THREE.Mesh(
      new THREE.CylinderGeometry(width * 0.4, width * 0.4, 0.16, 28, 1, false, 0, Math.PI),
      mats.upholsteryIvory,
    );
    crownPad.rotation.z = Math.PI / 2;
    crownPad.rotation.y = Math.PI / 2;
    crownPad.position.set(0, 1.32, -0.36);
    group.add(crownPad);
  } else {
    const topRail = new THREE.Mesh(new THREE.BoxGeometry(width, 0.045, 0.14), mats.champagneGold);
    topRail.position.set(0, 1.02, -0.45);
    group.add(topRail);
  }

  // Rolled Armrests + Cylindrical Bolsters + Accent Sadu/Gold Throw Pillows
  for (const side of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.56, 0.94), fabric);
    arm.position.set(side * (width / 2 - 0.095), 0.46, 0);
    group.add(arm);

    const armCap = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.94, 14), fabric);
    armCap.rotation.x = Math.PI / 2;
    armCap.position.set(side * (width / 2 - 0.095), 0.74, 0);
    group.add(armCap);

    // Rolled traditional Saudi majlis bolster cushion
    const bolster = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 0.54, 14),
      accentFabric,
    );
    bolster.rotation.x = Math.PI / 2;
    bolster.position.set(side * (width / 2 - 0.28), 0.54, 0.02);
    group.add(bolster);

    // Angled square accent throw pillow
    const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.36, 0.13), accentFabric);
    pillow.position.set(side * (width / 2 - 0.52), 0.62, -0.18);
    pillow.rotation.y = side * -0.45;
    pillow.rotation.z = side * 0.1;
    group.add(pillow);
  }

  return group;
}

export function createLuxuryArmchair(mats: VenueMaterials, ivory = false): THREE.Group {
  return createMajlisSofa(mats, 1.08, ivory, false);
}

/**
 * Authentic Royal Saudi Hospitality Set (Inspired by uploaded Arabic Coffee & Majlis reference):
 * Engraved circular brass tray, tall sculpted Saudi Dallah with curved S-spout & handle,
 * 6 porcelain Finjan cups on gold saucers, ornate brass Oud Mabkhara incense burner with glowing ember,
 * and glossy Medjool/Sukkari dates platter with silver tongs & roasted nuts bowl.
 */
export function createArabicCoffeeSet(mats: VenueMaterials): THREE.Group {
  const group = new THREE.Group();

  // Ornate circular engraved brass tray
  const tray = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.35, 0.025, 28), mats.brassOrnate);
  tray.position.y = 0.013;
  group.add(tray);

  const trayRim = new THREE.Mesh(new THREE.TorusGeometry(0.37, 0.014, 8, 28), mats.champagneGold);
  trayRim.rotation.x = Math.PI / 2;
  trayRim.position.y = 0.028;
  group.add(trayRim);

  // Sculpted Tall Saudi Brass Dallah (LatheGeometry)
  const dallahPts = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.072, 0.0),
    new THREE.Vector2(0.088, 0.065),
    new THREE.Vector2(0.06, 0.16),
    new THREE.Vector2(0.044, 0.26),
    new THREE.Vector2(0.068, 0.31),
    new THREE.Vector2(0.036, 0.37),
    new THREE.Vector2(0.012, 0.42),
    new THREE.Vector2(0.0, 0.46),
  ];
  const dallah = new THREE.Mesh(new THREE.LatheGeometry(dallahPts, 20), mats.brassOrnate);
  dallah.position.set(-0.07, 0.025, -0.04);
  group.add(dallah);

  // Dallah sweeping beak spout & curved scroll handle
  const spoutCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.01, 0.22, -0.04),
    new THREE.Vector3(0.06, 0.27, -0.04),
    new THREE.Vector3(0.12, 0.36, -0.04),
  ]);
  group.add(new THREE.Mesh(new THREE.TubeGeometry(spoutCurve, 12, 0.012, 8, false), mats.brassOrnate));

  const handleCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.12, 0.31, -0.04),
    new THREE.Vector3(-0.19, 0.24, -0.04),
    new THREE.Vector3(-0.15, 0.11, -0.04),
  ]);
  group.add(new THREE.Mesh(new THREE.TubeGeometry(handleCurve, 10, 0.009, 8, false), mats.brassOrnate));

  // 6 Porcelain Finjan cups on gold saucers
  const cupGeo = new THREE.CylinderGeometry(0.027, 0.017, 0.046, 12);
  const saucerGeo = new THREE.CylinderGeometry(0.045, 0.038, 0.008, 14);
  const cupOffsets = [
    [0.14, 0.08],
    [0.22, -0.04],
    [0.08, 0.19],
    [-0.04, 0.22],
    [0.18, -0.16],
    [0.05, -0.21],
  ];
  for (const [cx, cz] of cupOffsets) {
    const saucer = new THREE.Mesh(saucerGeo, mats.champagneGold);
    saucer.position.set(cx, 0.03, cz);
    group.add(saucer);
    const cup = new THREE.Mesh(cupGeo, mats.upholsteryIvory);
    cup.position.set(cx, 0.056, cz);
    group.add(cup);
  }

  // Ornate Brass Oud Mabkhara (Incense Burner) with glowing amber charcoal ember
  const mabkhara = new THREE.Group();
  mabkhara.position.set(-0.24, 0.025, -0.15);
  const mBase = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.05, 8), mats.brassOrnate);
  mBase.position.y = 0.025;
  mabkhara.add(mBase);
  const mStem = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.032, 0.07, 8), mats.brassOrnate);
  mStem.position.y = 0.08;
  mabkhara.add(mStem);
  const mCup = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.035, 0.07, 8), mats.brassOrnate);
  mCup.position.y = 0.145;
  mabkhara.add(mCup);
  const ember = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 6), mats.candleFlame);
  ember.position.y = 0.185;
  mabkhara.add(ember);
  group.add(mabkhara);

  // Abundant Glossy Sukkari & Medjool Dates Platter
  const datePlatter = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.11, 0.032, 18),
    mats.champagneGold,
  );
  datePlatter.position.set(-0.18, 0.04, 0.16);
  group.add(datePlatter);

  const dateGeo = new THREE.SphereGeometry(0.021, 8, 6);
  dateGeo.scale(1.45, 0.85, 0.85);
  for (let i = 0; i < 11; i++) {
    const a = (i / 10) * Math.PI * 2;
    const rad = i < 3 ? 0.025 : 0.075;
    const d = new THREE.Mesh(dateGeo, mats.foodDatesGlossy);
    d.position.set(-0.18 + Math.cos(a) * rad, i < 3 ? 0.088 : 0.068, 0.16 + Math.sin(a) * rad);
    d.rotation.y = a;
    group.add(d);
  }

  return group;
}

/**
 * Luxury Marble & Walnut Majlis Coffee Table with Arabic Coffee Hospitality Set & Crystal Floral Bowl.
 */
export function createCoffeeTable(mats: VenueMaterials, width = 1.6, depth = 0.95): THREE.Group {
  const group = new THREE.Group();

  const tblShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(width + 0.45, depth + 0.45),
    mats.contactShadow,
  );
  tblShadow.rotation.x = -Math.PI / 2;
  tblShadow.position.y = 0.032;
  group.add(tblShadow);

  const top = new THREE.Mesh(new THREE.BoxGeometry(width, 0.06, depth), mats.ivoryMarble);
  top.position.y = 0.45;
  top.castShadow = true;
  top.receiveShadow = true;
  group.add(top);

  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(width + 0.035, 0.04, depth + 0.035),
    mats.champagneGold,
  );
  frame.position.y = 0.415;
  group.add(frame);

  for (const sx of [-width * 0.3, width * 0.3]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.21, 0.4, 16), mats.walnutWood);
    leg.position.set(sx, 0.2, 0);
    group.add(leg);
    const footRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.205, 0.02, 8, 18),
      mats.champagneGold,
    );
    footRing.rotation.x = Math.PI / 2;
    footRing.position.set(sx, 0.03, 0);
    group.add(footRing);
  }

  const coffee = createArabicCoffeeSet(mats);
  coffee.position.set(width * 0.18, 0.48, 0);
  group.add(coffee);

  // Sculpted floral urn on opposite side
  const bowl = new THREE.Mesh(
    new THREE.CylinderGeometry(0.17, 0.1, 0.12, 16),
    mats.champagneGold,
  );
  bowl.position.set(-width * 0.28, 0.54, 0);
  group.add(bowl);

  const floralMini = createFloralArrangement(mats, 0.55, false);
  floralMini.position.set(-width * 0.28, 0.62, 0);
  group.add(floralMini);

  return group;
}

/**
 * Lush Multi-Layered Floral Arrangement (White Roses, Blush Peonies, Orchids & Emerald Leaves).
 */
export function createFloralArrangement(
  mats: VenueMaterials,
  scale = 1.0,
  withPedestal = true,
  pedestalH = 1.05,
): THREE.Group {
  const group = new THREE.Group();
  let baseY = 0;

  if (withPedestal) {
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.44, pedestalH, 0.44), mats.ivoryMarble);
    plinth.position.y = pedestalH / 2;
    plinth.castShadow = true;
    group.add(plinth);

    const trimBot = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.08, 0.52), mats.charcoalMarble);
    trimBot.position.y = 0.04;
    group.add(trimBot);

    const trimGoldMid = new THREE.Mesh(
      new THREE.BoxGeometry(0.47, 0.035, 0.47),
      mats.champagneGold,
    );
    trimGoldMid.position.y = pedestalH - 0.12;
    group.add(trimGoldMid);

    const trimTop = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.045, 0.48), mats.champagneGold);
    trimTop.position.y = pedestalH + 0.022;
    group.add(trimTop);

    const urnPts = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.14, 0),
      new THREE.Vector2(0.08, 0.09),
      new THREE.Vector2(0.2, 0.26),
      new THREE.Vector2(0.22, 0.3),
    ];
    const urn = new THREE.Mesh(new THREE.LatheGeometry(urnPts, 16), mats.champagneGold);
    urn.position.y = pedestalH + 0.04;
    group.add(urn);
    baseY = pedestalH + 0.36;
  }

  const foliageGeo = new THREE.DodecahedronGeometry(0.24 * scale, 1);
  const flowerGeo = new THREE.IcosahedronGeometry(0.115 * scale, 1);

  const foliage = new THREE.Mesh(foliageGeo, mats.floralLeaf);
  foliage.scale.set(1.42, 0.88, 1.42);
  foliage.position.y = baseY;
  group.add(foliage);

  const offsets = [
    [0, 0.24, 0],
    [0.21, 0.12, 0.12],
    [-0.21, 0.13, 0.11],
    [0.16, 0.08, -0.19],
    [-0.17, 0.09, -0.17],
    [0.05, 0.17, 0.23],
    [-0.06, 0.15, -0.23],
    [0.26, 0.02, -0.04],
    [-0.26, 0.03, -0.02],
    [0.11, 0.22, -0.09],
    [-0.12, 0.2, 0.1],
  ];
  offsets.forEach(([ox, oy, oz], idx) => {
    const mat =
      idx % 4 === 0
        ? mats.floralBlush
        : idx === 10
          ? mats.floralGoldAccent
          : mats.floralWhite;
    const f = new THREE.Mesh(flowerGeo, mat);
    f.position.set(ox * scale, baseY + oy * scale, oz * scale);
    group.add(f);
  });

  return group;
}

/**
 * Tall Crystal & Champagne-Gold Wedding Candelabra Stand with Glowing Taper Candles (for Runway & Kosha).
 */
export function createCandelabraStand(
  mats: VenueMaterials,
  ctx?: BuildContext,
  height = 1.65,
): THREE.Group {
  const group = new THREE.Group();

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.26, 0.12, 18),
    mats.champagneGold,
  );
  base.position.y = 0.06;
  group.add(base);

  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.028, 0.042, height - 0.35, 12),
    mats.champagneGold,
  );
  shaft.position.y = 0.12 + (height - 0.35) / 2;
  group.add(shaft);

  // Crystal mid-globe accent
  const globe = new THREE.Mesh(new THREE.OctahedronGeometry(0.11, 1), mats.crystal);
  globe.position.y = height * 0.58;
  group.add(globe);

  // 5 Candles (center + 4 curving gold arms)
  const positions: [number, number, number][] = [
    [0, height, 0],
    [0.24, height - 0.1, 0],
    [-0.24, height - 0.1, 0],
    [0, height - 0.1, 0.24],
    [0, height - 0.1, -0.24],
  ];

  const candleGeo = new THREE.CylinderGeometry(0.018, 0.02, 0.26, 10);
  const flameGeo = new THREE.ConeGeometry(0.018, 0.055, 8);
  const cupGeo = new THREE.CylinderGeometry(0.042, 0.025, 0.03, 12);

  for (const [cx, cy, cz] of positions) {
    if (cx !== 0 || cz !== 0) {
      const arm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.26, 8),
        mats.champagneGold,
      );
      arm.position.set(cx * 0.5, cy - 0.06, cz * 0.5);
      if (cx !== 0) arm.rotation.z = Math.PI / 2;
      else arm.rotation.x = Math.PI / 2;
      group.add(arm);
    }

    const cup = new THREE.Mesh(cupGeo, mats.champagneGold);
    cup.position.set(cx, cy - 0.02, cz);
    group.add(cup);

    const candle = new THREE.Mesh(candleGeo, mats.candleWax);
    candle.position.set(cx, cy + 0.12, cz);
    group.add(candle);

    const flame = new THREE.Mesh(flameGeo, mats.candleFlame);
    flame.position.set(cx, cy + 0.275, cz);
    group.add(flame);
    if (ctx) ctx.animatedObjects.candleFlames.push(flame);
  }

  return group;
}

/**
 * Five-Star Wedding Round Banquet Table (inspired by uploaded fine-dining candlelight reference):
 * Pleated floor-length linen skirt, mirrored centerpiece inlay, 8 beaded gold chargers, porcelain plates,
 * folded ivory linen napkins with gold rings, silver cutlery, twin cut-crystal goblets, glowing taper candles,
 * and tall elevated rose & orchid candelabra centerpiece!
 */
export function createRoundBanquetTable(
  mats: VenueMaterials,
  radius = 1.15,
  ctx?: BuildContext,
): THREE.Group {
  const group = new THREE.Group();

  const bqShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(radius * 2.9, radius * 2.9),
    mats.contactShadow,
  );
  bqShadow.rotation.x = -Math.PI / 2;
  bqShadow.position.y = 0.028;
  group.add(bqShadow);

  // Floor-length pleated ivory/champagne tablecloth skirt
  const clothPts = [
    new THREE.Vector2(radius + 0.14, 0),
    new THREE.Vector2(radius + 0.05, 0.36),
    new THREE.Vector2(radius, 0.76),
    new THREE.Vector2(0, 0.76),
  ];
  const cloth = new THREE.Mesh(new THREE.LatheGeometry(clothPts, 32), mats.silkDrape);
  cloth.castShadow = true;
  cloth.receiveShadow = true;
  group.add(cloth);

  // Mirrored glass tabletop inlay + champagne-gold outer trim ring
  const mirrorTop = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.94, radius * 0.94, 0.012, 32),
    mats.mirrorGlass,
  );
  mirrorTop.position.y = 0.766;
  group.add(mirrorTop);

  const runnerRing = new THREE.Mesh(
    new THREE.RingGeometry(radius * 0.91, radius * 0.98, 32),
    mats.champagneGold,
  );
  runnerRing.rotation.x = -Math.PI / 2;
  runnerRing.position.y = 0.774;
  group.add(runnerRing);

  // 8 Five-Star Place Settings (charger + dinner plate + folded napkin w/ gold ring + cutlery + twin crystal glasses)
  const chargerGeo = new THREE.CylinderGeometry(0.165, 0.145, 0.012, 18);
  const plateGeo = new THREE.CylinderGeometry(0.115, 0.095, 0.015, 16);
  const napkinGeo = new THREE.BoxGeometry(0.13, 0.025, 0.065);
  const ringGeo = new THREE.TorusGeometry(0.024, 0.006, 6, 12);
  const cutleryGeo = new THREE.BoxGeometry(0.012, 0.006, 0.16);
  const glassGeo = new THREE.CylinderGeometry(0.032, 0.02, 0.15, 10);

  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const pr = radius - 0.24;
    const px = Math.cos(a) * pr;
    const pz = Math.sin(a) * pr;

    const setting = new THREE.Group();
    setting.position.set(px, 0.774, pz);
    setting.rotation.y = -a + Math.PI / 2;

    const charger = new THREE.Mesh(chargerGeo, mats.champagneGold);
    charger.position.y = 0.006;
    setting.add(charger);

    const plate = new THREE.Mesh(plateGeo, mats.ivoryMarble);
    plate.position.y = 0.018;
    setting.add(plate);

    const napkin = new THREE.Mesh(napkinGeo, mats.upholsteryIvory);
    napkin.position.y = 0.036;
    setting.add(napkin);

    const napRing = new THREE.Mesh(ringGeo, mats.champagneGold);
    napRing.rotation.y = Math.PI / 2;
    napRing.position.y = 0.038;
    setting.add(napRing);

    // Silver fork & knife flanking charger
    const fork = new THREE.Mesh(cutleryGeo, mats.chrome);
    fork.position.set(-0.19, 0.006, 0);
    setting.add(fork);
    const knife = new THREE.Mesh(cutleryGeo, mats.chrome);
    knife.position.set(0.19, 0.006, 0);
    setting.add(knife);

    // Twin cut-crystal goblets
    const g1 = new THREE.Mesh(glassGeo, mats.crystal);
    g1.position.set(0.11, 0.08, -0.14);
    setting.add(g1);
    const g2 = new THREE.Mesh(glassGeo, mats.crystal);
    g2.scale.set(0.82, 1.15, 0.82);
    g2.position.set(0.18, 0.09, -0.1);
    setting.add(g2);

    group.add(setting);
  }

  // 4 Slender Glowing Ivory Taper Candles around Centerpiece
  const candleGeo = new THREE.CylinderGeometry(0.013, 0.014, 0.28, 8);
  const flameGeo = new THREE.ConeGeometry(0.014, 0.044, 6);
  for (let c = 0; c < 4; c++) {
    const ca = (c / 4) * Math.PI * 2 + Math.PI / 4;
    const cx = Math.cos(ca) * 0.34;
    const cz = Math.sin(ca) * 0.34;

    const holder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.045, 0.08, 10),
      mats.champagneGold,
    );
    holder.position.set(cx, 0.81, cz);
    group.add(holder);

    const wax = new THREE.Mesh(candleGeo, mats.candleWax);
    wax.position.set(cx, 0.98, cz);
    group.add(wax);

    const flame = new THREE.Mesh(flameGeo, mats.candleFlame);
    flame.position.set(cx, 1.14, cz);
    group.add(flame);
    if (ctx) ctx.animatedObjects.candleFlames.push(flame);
  }

  // Tall Champagne-Gold Elevated Floral Centerpiece
  const standBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.085, 0.19, 0.09, 18),
    mats.champagneGold,
  );
  standBase.position.y = 0.815;
  group.add(standBase);

  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.026, 0.036, 0.82, 12),
    mats.champagneGold,
  );
  stem.position.y = 1.26;
  group.add(stem);

  const topFloral = createFloralArrangement(mats, 0.92, false);
  topFloral.position.y = 1.72;
  group.add(topFloral);

  return group;
}

/**
 * Luxury Banquet / Dining Chair (champagne gold frame, upholstered seat & oval medallion backrest).
 */
export function createBanquetChair(mats: VenueMaterials): THREE.Group {
  const group = new THREE.Group();

  const legGeo = new THREE.CylinderGeometry(0.018, 0.013, 0.45, 8);
  for (const [lx, ly, lz] of [
    [-0.19, 0.225, -0.19],
    [0.19, 0.225, -0.19],
    [-0.19, 0.225, 0.19],
    [0.19, 0.225, 0.19],
  ]) {
    const leg = new THREE.Mesh(legGeo, mats.champagneGold);
    leg.position.set(lx, ly, lz);
    group.add(leg);
  }

  const frame = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.04, 0.45), mats.champagneGold);
  frame.position.y = 0.45;
  group.add(frame);

  const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.43, 0.07, 0.43), mats.upholsteryBeige);
  cushion.position.y = 0.495;
  group.add(cushion);

  for (const sx of [-0.18, 0.18]) {
    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.016, 0.018, 0.56, 8),
      mats.champagneGold,
    );
    post.position.set(sx, 0.73, -0.2);
    group.add(post);
  }

  const ovalRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.205, 0.019, 8, 22),
    mats.champagneGold,
  );
  ovalRing.scale.set(0.95, 1.24, 1);
  ovalRing.position.set(0, 0.83, -0.2);
  group.add(ovalRing);

  const backPad = new THREE.Mesh(
    new THREE.CylinderGeometry(0.185, 0.185, 0.055, 18),
    mats.upholsteryIvory,
  );
  backPad.rotation.x = Math.PI / 2;
  backPad.scale.set(0.92, 1, 1.2);
  backPad.position.set(0, 0.83, -0.2);
  group.add(backPad);

  return group;
}

/**
 * Five-Star Luxury Hotel Banquet Buffet Station (inspired by uploaded patisserie, chafing & wire-riser photos):
 * Dark walnut/veined-marble counter with illuminated under-lip, realistic colorful food displays
 * (saffron kabsa rice, roasted meats, red-velvet cakes, chocolate eclairs, tiered gold-ring dessert stands,
 * wire-frame gold geometric risers with ceramic platters, brass tong holders, tall glass orchid vases).
 */
export function createBuffetStation(
  mats: VenueMaterials,
  length = 7.4,
  stationType: 'hot' | 'dessert' | 'cold' = 'hot',
): THREE.Group {
  const group = new THREE.Group();

  // Dark walnut fluted base + recessed gold kickplate + illuminated under-slab glow + marble slab
  const base = new THREE.Mesh(new THREE.BoxGeometry(length, 0.86, 1.18), mats.walnutWood);
  base.position.y = 0.43;
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  const goldKick = new THREE.Mesh(
    new THREE.BoxGeometry(length + 0.04, 0.08, 1.22),
    mats.champagneGold,
  );
  goldKick.position.y = 0.04;
  group.add(goldKick);

  const counterGlow = new THREE.Mesh(
    new THREE.BoxGeometry(length - 0.1, 0.04, 1.24),
    mats.warmEmissive,
  );
  counterGlow.position.y = 0.855;
  group.add(counterGlow);

  const slab = new THREE.Mesh(
    new THREE.BoxGeometry(length + 0.16, 0.08, 1.32),
    stationType === 'dessert' ? mats.ivoryMarble : mats.charcoalMarble,
  );
  slab.position.y = 0.91;
  slab.receiveShadow = true;
  group.add(slab);

  // Sneeze guard crystal glass canopy on brass posts
  const guard = new THREE.Mesh(new THREE.BoxGeometry(length - 0.35, 0.035, 0.68), mats.archGlass);
  guard.position.set(0, 1.54, 0);
  group.add(guard);

  for (const px of [-length * 0.43, 0, length * 0.43]) {
    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.6, 10),
      mats.champagneGold,
    );
    post.position.set(px, 1.25, -0.32);
    group.add(post);
  }

  // Tall glass orchid accent vases at buffet center/ends
  for (const vx of [-length * 0.44, length * 0.44]) {
    const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.075, 0.45, 14), mats.crystal);
    vase.position.set(vx, 1.18, -0.36);
    group.add(vase);
    const fl = createFloralArrangement(mats, 0.52, false);
    fl.position.set(vx, 1.42, -0.36);
    group.add(fl);
  }

  if (stationType === 'hot') {
    // 5 Brushed-Gold Roll-Top Chafing Dishes with Saffron Kabsa Rice, Roasted Lamb & Arabic Stews
    const count = 5;
    for (let i = 0; i < count; i++) {
      const x = -length * 0.36 + (i / (count - 1)) * (length * 0.72);
      const chafer = new THREE.Group();
      chafer.position.set(x, 0.95, 0);

      const frame = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.16, 0.48), mats.brassOrnate);
      frame.position.y = 0.08;
      chafer.add(frame);

      const dome = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.22, 0.68, 18, 1, false, 0, Math.PI),
        mats.chrome,
      );
      dome.rotation.z = Math.PI / 2;
      dome.rotation.x = i % 2 === 0 ? -0.55 : -0.15;
      dome.position.y = 0.17;
      chafer.add(dome);

      // Appetizing saffron kabsa rice & glazed roasted lamb display
      const foodMat = i % 2 === 0 ? mats.foodSaffronRice : mats.foodRoastedMeat;
      const foodMound = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 8), foodMat);
      foodMound.scale.set(1.25, 0.28, 0.78);
      foodMound.position.y = 0.16;
      chafer.add(foodMound);

      // Brass serving tong holder in front
      const tongCup = new THREE.Mesh(
        new THREE.CylinderGeometry(0.042, 0.038, 0.14, 12),
        mats.brassOrnate,
      );
      tongCup.position.set(0.32, 0.07, 0.34);
      chafer.add(tongCup);

      group.add(chafer);
    }
  } else if (stationType === 'dessert') {
    // 5-Star Patisserie Display: Gold-Ring Tiered Pastry Stands, Red Velvet Cake, Chocolate Tarts & Crystal Dispensers
    for (let i = 0; i < 4; i++) {
      const x = -length * 0.33 + (i / 3) * (length * 0.5);

      if (i % 2 === 0) {
        // Circular gold-hoop 2-tier patisserie stand (directly inspired by uploaded patisserie photo!)
        const hoop = new THREE.Mesh(
          new THREE.TorusGeometry(0.28, 0.016, 8, 28),
          mats.champagneGold,
        );
        hoop.position.set(x, 1.24, 0.04);
        group.add(hoop);

        const t1 = new THREE.Mesh(
          new THREE.CylinderGeometry(0.24, 0.22, 0.025, 18),
          mats.ivoryMarble,
        );
        t1.position.set(x, 1.06, 0.04);
        group.add(t1);
        const t2 = new THREE.Mesh(
          new THREE.CylinderGeometry(0.19, 0.18, 0.022, 18),
          mats.ivoryMarble,
        );
        t2.position.set(x, 1.28, 0.04);
        group.add(t2);

        // Mini glazed chocolate & berry pastries on tiers
        for (let p = 0; p < 5; p++) {
          const pa = (p / 5) * Math.PI * 2;
          const pastry = new THREE.Mesh(
            new THREE.CylinderGeometry(0.035, 0.038, 0.05, 10),
            p % 2 === 0 ? mats.foodChocolate : mats.foodPastryBerry,
          );
          pastry.position.set(x + Math.cos(pa) * 0.11, 1.1, 0.04 + Math.sin(pa) * 0.11);
          group.add(pastry);
        }
      } else {
        // Elevated Marble Cake Pedestal with Red Velvet Wedding Gateau & Cream Frosting
        const ped = new THREE.Mesh(
          new THREE.CylinderGeometry(0.24, 0.14, 0.14, 18),
          mats.ivoryMarble,
        );
        ped.position.set(x, 1.02, 0.06);
        group.add(ped);

        const cake = new THREE.Mesh(
          new THREE.CylinderGeometry(0.17, 0.17, 0.12, 20),
          i === 1 ? mats.foodPastryBerry : mats.foodChocolate,
        );
        cake.position.set(x, 1.15, 0.06);
        group.add(cake);

        const icing = new THREE.Mesh(
          new THREE.CylinderGeometry(0.165, 0.172, 0.025, 20),
          mats.floralWhite,
        );
        icing.position.set(x, 1.22, 0.06);
        group.add(icing);
      }

      // Brass tong cup next to each patisserie stand
      const tongCup = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.036, 0.14, 12),
        mats.brassOrnate,
      );
      tongCup.position.set(x + 0.26, 1.02, 0.34);
      group.add(tongCup);
    }

    // 2 Crystal Beverage Dispensers with Golden Spigots
    for (let b = 0; b < 2; b++) {
      const bx = length * 0.26 + b * 0.52;
      const stand = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.16, 0.2, 16),
        mats.champagneGold,
      );
      stand.position.set(bx, 1.05, 0);
      group.add(stand);
      const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.38, 16), mats.crystal);
      jar.position.set(bx, 1.34, 0);
      group.add(jar);
    }
  } else {
    // Cold Mezze, Artisan Salads & Gourmet Platters on Geometric Gold Wire Risers (inspired by reference photo!)
    for (let i = 0; i < 6; i++) {
      const x = -length * 0.35 + (i / 5) * (length * 0.64);
      const zOff = i % 2 === 0 ? 0.12 : -0.14;
      const riserH = i % 2 === 0 ? 0.18 : 0.28;

      // Wire-frame gold cylindrical riser stand
      const riserRingTop = new THREE.Mesh(
        new THREE.TorusGeometry(0.18, 0.01, 6, 18),
        mats.champagneGold,
      );
      riserRingTop.rotation.x = Math.PI / 2;
      riserRingTop.position.set(x, 0.95 + riserH, zOff);
      group.add(riserRingTop);

      for (let w = 0; w < 6; w++) {
        const wa = (w / 6) * Math.PI * 2;
        const strut = new THREE.Mesh(
          new THREE.CylinderGeometry(0.006, 0.006, riserH, 5),
          mats.champagneGold,
        );
        strut.position.set(x + Math.cos(wa) * 0.17, 0.95 + riserH / 2, zOff + Math.sin(wa) * 0.17);
        group.add(strut);
      }

      // Crisp rectangular white ceramic platter with colorful mezze/salads
      const platter = new THREE.Mesh(
        new THREE.BoxGeometry(0.46, 0.035, 0.34),
        mats.ivoryMarble,
      );
      platter.position.set(x, 0.97 + riserH, zOff);
      group.add(platter);

      const foodMat =
        i % 3 === 0
          ? mats.foodSaladFresh
          : i % 3 === 1
            ? mats.foodSaffronRice
            : mats.foodRoastedMeat;
      const food = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), foodMat);
      food.scale.set(1.3, 0.38, 0.92);
      food.position.set(x, 1.02 + riserH, zOff);
      group.add(food);
    }
  }

  // Stacked Porcelain Dinner Plates on Right End
  for (let s = 0; s < 2; s++) {
    const stack = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 0.28, 16),
      mats.upholsteryIvory,
    );
    stack.position.set(length * 0.42 - s * 0.34, 1.09, 0.32);
    group.add(stack);
  }

  return group;
}

/**
 * Architectural Wall Bay with Champagne-Gold Arched Molding Frame, Beveled Mirror or Fluted Walnut Inset,
 * and Twin Crystal Wall Sconces (for Lobbies, Corridors, and Grand Halls).
 */
export function createWallBayMolding(
  mats: VenueMaterials,
  opts: { width: number; height: number; style: 'mirror' | 'walnut' | 'silk' },
): THREE.Group {
  const group = new THREE.Group();

  // Recessed champagne-gold molding border frame
  const outer = new THREE.Mesh(
    new THREE.BoxGeometry(opts.width, opts.height, 0.08),
    mats.champagneGold,
  );
  group.add(outer);

  const innerMat =
    opts.style === 'mirror'
      ? mats.mirrorGlass
      : opts.style === 'silk'
        ? mats.silkChampagne
        : mats.walnutWood;
  const inset = new THREE.Mesh(
    new THREE.BoxGeometry(opts.width - 0.28, opts.height - 0.28, 0.1),
    innerMat,
  );
  inset.position.z = 0.01;
  group.add(inset);

  // Decorative gold crown arch molding at top of bay
  const arch = new THREE.Mesh(
    new THREE.TorusGeometry(opts.width * 0.36, 0.055, 10, 28, Math.PI),
    mats.champagneGold,
  );
  arch.position.set(0, opts.height * 0.26, 0.06);
  group.add(arch);

  // Twin vertical crystal & brass wall sconces flanking bay
  for (const sx of [-opts.width / 2 - 0.28, opts.width / 2 + 0.28]) {
    const backplate = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.65, 0.06),
      mats.champagneGold,
    );
    backplate.position.set(sx, 0.2, 0.04);
    group.add(backplate);

    const crystalTube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.055, 0.52, 10),
      mats.warmEmissive,
    );
    crystalTube.position.set(sx, 0.2, 0.11);
    group.add(crystalTube);
  }

  return group;
}

/**
 * Architectural Ceiling Linear AC Slot Diffuser & Illuminated Emergency EXIT Sign (Subtle Real-World Details).
 */
export function createACDiffuser(mats: VenueMaterials, length = 3.2): THREE.Group {
  const group = new THREE.Group();
  const bezel = new THREE.Mesh(new THREE.BoxGeometry(length, 0.04, 0.26), mats.darkBronze);
  group.add(bezel);
  const slot = new THREE.Mesh(new THREE.BoxGeometry(length - 0.12, 0.05, 0.12), mats.ledBezel);
  slot.position.y = -0.01;
  group.add(slot);
  return group;
}

export function createExitSign(mats: VenueMaterials): THREE.Group {
  const group = new THREE.Group();
  const housing = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.24, 0.08), mats.darkBronze);
  group.add(housing);
  const face = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.16, 0.09), mats.exitSignGreen);
  group.add(face);
  return group;
}

/**
 * Professional Wall-Mounted Line-Array Speaker System.
 */
export function createLineArraySpeaker(mats: VenueMaterials): THREE.Group {
  const group = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const cab = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.25, 0.4), mats.ledBezel);
    cab.position.set(0, -i * 0.27, i * 0.04);
    cab.rotation.x = i * 0.075;
    group.add(cab);

    const trim = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.025, 0.02), mats.champagneGold);
    trim.position.set(0, -i * 0.27, 0.21 + i * 0.04);
    group.add(trim);
  }
  return group;
}

/**
 * Luxury Marble Washbasin Vanity with Gold Faucet & Backlit Oval Mirror.
 */
export function createMarbleVanity(mats: VenueMaterials, bays = 3): THREE.Group {
  const group = new THREE.Group();
  const width = bays * 1.15;

  const counter = new THREE.Mesh(new THREE.BoxGeometry(width, 0.14, 0.64), mats.ivoryMarble);
  counter.position.y = 0.84;
  group.add(counter);

  const apron = new THREE.Mesh(new THREE.BoxGeometry(width - 0.08, 0.36, 0.56), mats.walnutWood);
  apron.position.y = 0.6;
  group.add(apron);

  for (let i = 0; i < bays; i++) {
    const x = -width / 2 + (i + 0.5) * 1.15;

    const basin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.17, 0.14, 20),
      mats.charcoalMarble,
    );
    basin.position.set(x, 0.96, 0.04);
    group.add(basin);

    const faucet = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.22, 10),
      mats.champagneGold,
    );
    faucet.rotation.x = Math.PI / 2;
    faucet.position.set(x, 1.12, -0.18);
    group.add(faucet);

    const halo = new THREE.Mesh(
      new THREE.CylinderGeometry(0.37, 0.37, 0.02, 24),
      mats.warmEmissive,
    );
    halo.rotation.x = Math.PI / 2;
    halo.scale.set(0.88, 1, 1.25);
    halo.position.set(x, 1.65, -0.29);
    group.add(halo);

    const mirror = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.32, 0.03, 24),
      mats.mirrorGlass,
    );
    mirror.rotation.x = Math.PI / 2;
    mirror.scale.set(0.86, 1, 1.22);
    mirror.position.set(x, 1.65, -0.27);
    group.add(mirror);
  }

  return group;
}

/**
 * Exterior Illuminated Pathway Bollard Lamp.
 */
export function createBollardLamp(mats: VenueMaterials): THREE.Group {
  const group = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 0.72, 12), mats.darkBronze);
  base.position.y = 0.36;
  group.add(base);

  const lens = new THREE.Mesh(
    new THREE.CylinderGeometry(0.095, 0.095, 0.18, 12),
    mats.warmEmissive,
  );
  lens.position.y = 0.8;
  group.add(lens);

  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.125, 0.05, 12), mats.champagneGold);
  cap.position.y = 0.91;
  group.add(cap);
  return group;
}
