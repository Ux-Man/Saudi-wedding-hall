import * as THREE from 'three';

export interface ProceduralTextureSet {
  ivoryMarble: THREE.CanvasTexture;
  ivoryMarbleBump: THREE.CanvasTexture;
  charcoalMarble: THREE.CanvasTexture;
  marbleFloorTile: THREE.CanvasTexture;
  marbleFloorBump: THREE.CanvasTexture;
  marbleFloorRoughness: THREE.CanvasTexture;
  walnutWood: THREE.CanvasTexture;
  walnutBump: THREE.CanvasTexture;
  travertine: THREE.CanvasTexture;
  travertineBump: THREE.CanvasTexture;
  fabricWeave: THREE.CanvasTexture;
  fabricBump: THREE.CanvasTexture;
  carpetRoyal: THREE.CanvasTexture;
  mashrabiyaAlpha: THREE.CanvasTexture;
  asphalt: THREE.CanvasTexture;
  limestonePaver: THREE.CanvasTexture;
  limestonePaverBump: THREE.CanvasTexture;
  contactShadow: THREE.CanvasTexture;
  silkDrape: THREE.CanvasTexture;
  silkDrapeBump: THREE.CanvasTexture;
  saduAccent: THREE.CanvasTexture;
  sparkleSprite: THREE.CanvasTexture;
  dispose: () => void;
}

function seededRand(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function configureTexture(
  canvas: HTMLCanvasElement,
  repeatX: number,
  repeatY: number,
  maxAniso: number,
  isColor = true,
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = Math.min(16, maxAniso);
  tex.colorSpace = isColor ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

/**
 * Rich, high-definition Crema Marfil / Nero Marquina marble with crisp mineral veining
 * and warm tonal contrast so marble slabs never wash out into flat white.
 */
function createMarbleCanvas(
  baseHex: string,
  cloudA: string,
  cloudB: string,
  veinPrimary: string,
  veinGold: string,
  seed: number,
  isBump = false,
  size = 1024,
): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas(size, size);
  const rand = seededRand(seed);

  ctx.fillStyle = isBump ? '#808080' : baseHex;
  ctx.fillRect(0, 0, size, size);

  // Deep organic mineral clouds
  for (let i = 0; i < 65; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = (size * 0.08) + rand() * (size * 0.22);
    const g = ctx.createRadialGradient(x, y, 4, x, y, r);
    if (isBump) {
      g.addColorStop(0, i % 2 === 0 ? 'rgba(165,165,165,0.16)' : 'rgba(95,95,95,0.16)');
      g.addColorStop(1, 'rgba(128,128,128,0)');
    } else {
      g.addColorStop(0, i % 2 === 0 ? cloudA : cloudB);
      g.addColorStop(1, 'rgba(0,0,0,0)');
    }
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Primary branching marble veins
  for (let v = 0; v < 36; v++) {
    ctx.beginPath();
    let x = rand() * size;
    let y = rand() * size;
    ctx.moveTo(x, y);
    const steps = 24;
    const angleBase = (rand() - 0.5) * 1.2 + 0.55;
    for (let s = 0; s < steps; s++) {
      const jitter = Math.sin(s * 0.72 + v * 1.3) * 0.78 + (rand() - 0.5) * 0.28;
      x += Math.cos(angleBase + jitter) * (size / 22);
      y += Math.sin(angleBase + jitter) * (size / 22);
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = isBump
      ? 'rgba(52,52,52,0.52)'
      : v % 3 === 0
        ? veinGold
        : veinPrimary;
    ctx.lineWidth = (size / 512) * (0.8 + rand() * 2.4);
    ctx.stroke();
  }

  // Fine hairline crystalline fissures
  for (let f = 0; f < 45; f++) {
    ctx.beginPath();
    let x = rand() * size;
    let y = rand() * size;
    ctx.moveTo(x, y);
    for (let s = 0; s < 10; s++) {
      x += (rand() - 0.3) * (size * 0.045);
      y += (rand() - 0.3) * (size * 0.045);
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = isBump ? 'rgba(40,40,40,0.4)' : veinPrimary;
    ctx.lineWidth = 0.85;
    ctx.stroke();
  }

  return canvas;
}

/**
 * High-contrast Saudi palace marble floor slab with dark walnut/bronze border framing,
 * champagne-gold geometric octagram inlays, and clearly articulated grout lines.
 */
function createGeometricFloorCanvas(mode: 'albedo' | 'bump' | 'roughness'): HTMLCanvasElement {
  const size = 1024;
  const [canvas, ctx] = makeCanvas(size, size);

  if (mode === 'roughness') {
    // Polished marble (dark = smooth ~0.22), rougher grout lines (bright = 0.75)
    ctx.fillStyle = '#3c3c3c';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = '#c8c8c8';
    ctx.lineWidth = 6;
    ctx.strokeRect(2, 2, size - 4, size - 4);
    ctx.beginPath();
    ctx.moveTo(size / 2, 0);
    ctx.lineTo(size / 2, size);
    ctx.moveTo(0, size / 2);
    ctx.lineTo(size, size / 2);
    ctx.stroke();
    // Smooth gold inlays
    ctx.strokeStyle = '#242424';
    ctx.lineWidth = 10;
    ctx.strokeRect(42, 42, size - 84, size - 84);
    return canvas;
  }

  const isBump = mode === 'bump';
  const marble = createMarbleCanvas(
    '#DCD1BF',
    'rgba(162,140,114,0.22)',
    'rgba(244,237,225,0.20)',
    'rgba(128,106,82,0.44)',
    'rgba(181,142,88,0.48)',
    101,
    isBump,
    size,
  );
  ctx.drawImage(marble, 0, 0);

  // Subtle darker perimeter border band (contrasting beige-walnut stone)
  if (!isBump) {
    ctx.strokeStyle = 'rgba(89, 64, 49, 0.32)';
    ctx.lineWidth = 28;
    ctx.strokeRect(18, 18, size - 36, size - 36);
  }

  // Deep crisp grout joints
  ctx.strokeStyle = isBump ? '#222222' : 'rgba(68,54,42,0.68)';
  ctx.lineWidth = 5;
  ctx.strokeRect(2, 2, size - 4, size - 4);
  ctx.beginPath();
  ctx.moveTo(size / 2, 0);
  ctx.lineTo(size / 2, size);
  ctx.moveTo(0, size / 2);
  ctx.lineTo(size, size / 2);
  ctx.stroke();

  // Champagne-gold double geometric border inlay
  ctx.strokeStyle = isBump ? '#bdbdbd' : '#B8935B';
  ctx.lineWidth = 8;
  ctx.strokeRect(44, 44, size - 88, size - 88);
  ctx.lineWidth = 3;
  ctx.strokeRect(64, 64, size - 128, size - 128);

  // Center & corner Najdi diamond star medallions
  const medPoints = [
    [44, 44, 24],
    [size - 44, 44, 24],
    [44, size - 44, 24],
    [size - 44, size - 44, 24],
    [size / 2, size / 2, 46],
  ];
  for (const [cx, cy, r] of medPoints) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = isBump ? '#444444' : '#4E392B';
    ctx.fillRect(-r, -r, r * 2, r * 2);
    ctx.strokeStyle = isBump ? '#d0d0d0' : '#C7A572';
    ctx.lineWidth = 5;
    ctx.strokeRect(-r, -r, r * 2, r * 2);
    ctx.fillStyle = isBump ? '#bbbbbb' : '#C7A572';
    ctx.fillRect(-r * 0.42, -r * 0.42, r * 0.84, r * 0.84);
    ctx.restore();
  }

  return canvas;
}

/**
 * Rich natural dark walnut with pronounced vertical fluted architectural slats and wood grain.
 */
function createWalnutCanvas(isBump = false): HTMLCanvasElement {
  const size = 512;
  const [canvas, ctx] = makeCanvas(size, size);
  const rand = seededRand(404);
  ctx.fillStyle = isBump ? '#808080' : '#4A3426';
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 320; i++) {
    const x = rand() * size;
    const w = 1 + rand() * 3.5;
    if (isBump) {
      const shade = 95 + Math.floor(rand() * 55);
      ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
    } else {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(26,15,9,0.42)' : 'rgba(118,84,58,0.24)';
    }
    ctx.fillRect(x, 0, w, size);
  }

  // Deep fluted vertical architectural slats
  const slats = 14;
  const slatW = size / slats;
  for (let i = 0; i < slats; i++) {
    const x = i * slatW;
    const grad = ctx.createLinearGradient(x, 0, x + slatW, 0);
    if (isBump) {
      grad.addColorStop(0, 'rgba(15,15,15,0.85)');
      grad.addColorStop(0.22, 'rgba(210,210,210,0.55)');
      grad.addColorStop(0.78, 'rgba(195,195,195,0.55)');
      grad.addColorStop(1, 'rgba(15,15,15,0.85)');
    } else {
      grad.addColorStop(0, 'rgba(12,7,4,0.82)');
      grad.addColorStop(0.2, 'rgba(116,84,58,0.28)');
      grad.addColorStop(0.8, 'rgba(38,24,16,0.16)');
      grad.addColorStop(1, 'rgba(12,7,4,0.82)');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(x, 0, slatW, size);
  }
  return canvas;
}

/**
 * Crisp ashlar Saudi Riyadh-stone / warm travertine masonry with defined mortar grooves & stone variation.
 */
function createTravertineCanvas(isBump = false): HTMLCanvasElement {
  const size = 1024;
  const [canvas, ctx] = makeCanvas(size, size);
  const rand = seededRand(707);

  ctx.fillStyle = isBump ? '#929292' : '#C9B9A2';
  ctx.fillRect(0, 0, size, size);

  const rows = 6;
  const cols = 3;
  const rowH = size / rows;
  const colW = size / cols;

  // Individual stone block subtle tonal variation
  for (let r = 0; r < rows; r++) {
    const offset = r % 2 === 0 ? 0 : colW / 2;
    for (let c = -1; c <= cols; c++) {
      const bx = c * colW + offset;
      const by = r * rowH;
      const delta = Math.floor((rand() - 0.5) * 20);
      if (isBump) {
        const bTone = 138 + delta;
        ctx.fillStyle = `rgb(${bTone},${bTone},${bTone})`;
      } else {
        ctx.fillStyle = `rgb(${205 + delta}, ${190 + delta}, ${167 + delta})`;
      }
      ctx.fillRect(bx + 3, by + 3, colW - 6, rowH - 6);
    }
  }

  // Natural horizontal travertine sedimentary streaks
  for (let y = 0; y < size; y += 3) {
    const alpha = 0.05 + rand() * 0.1;
    ctx.fillStyle = isBump
      ? rand() > 0.5
        ? `rgba(175,175,175,${alpha})`
        : `rgba(85,85,85,${alpha})`
      : rand() > 0.5
        ? `rgba(242,234,220,${alpha})`
        : `rgba(132,113,90,${alpha})`;
    ctx.fillRect(0, y, size, 1 + rand() * 3);
  }

  // Deep crisp stone course joints with top highlight + shadow
  for (let r = 0; r < rows; r++) {
    const y = r * rowH;
    ctx.fillStyle = isBump ? '#1e1e1e' : 'rgba(72, 59, 46, 0.65)';
    ctx.fillRect(0, y - 2, size, 4);
    ctx.fillStyle = isBump ? '#d4d4d4' : 'rgba(245, 238, 224, 0.35)';
    ctx.fillRect(0, y + 2, size, 2);

    const offset = r % 2 === 0 ? 0 : colW / 2;
    for (let c = 0; c <= cols; c++) {
      const x = (c * colW + offset) % size;
      ctx.fillStyle = isBump ? '#1e1e1e' : 'rgba(72, 59, 46, 0.58)';
      ctx.fillRect(x - 2, y, 4, rowH);
    }
  }

  return canvas;
}

/**
 * Plush diamond-tufted luxury upholstery fabric texture with crisp stitching & depth.
 */
function createFabricCanvas(isBump = false): HTMLCanvasElement {
  const size = 512;
  const [canvas, ctx] = makeCanvas(size, size);
  ctx.fillStyle = isBump ? '#9a9a9a' : '#CBBBA4';
  ctx.fillRect(0, 0, size, size);

  // Fine woven linen threads
  for (let y = 0; y < size; y += 4) {
    for (let x = 0; x < size; x += 4) {
      const alt = ((x + y) / 4) % 2 === 0;
      ctx.fillStyle = isBump
        ? alt
          ? '#a8a8a8'
          : '#7e7e7e'
        : alt
          ? 'rgba(248,240,228,0.16)'
          : 'rgba(105,88,68,0.16)';
      ctx.fillRect(x, y, 3, 3);
    }
  }

  // Tailored diamond quilting lines & recessed tuft buttons
  const step = 64;
  ctx.strokeStyle = isBump ? '#454545' : 'rgba(92,74,56,0.34)';
  ctx.lineWidth = 2.5;
  for (let i = -size; i < size * 2; i += step) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + size, size);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(i, size);
    ctx.lineTo(i + size, 0);
    ctx.stroke();
  }

  for (let y = 0; y <= size; y += step) {
    for (let x = 0; x <= size; x += step) {
      const g = ctx.createRadialGradient(x, y, 1, x, y, 10);
      g.addColorStop(0, isBump ? 'rgba(25,25,25,0.8)' : 'rgba(72,56,42,0.45)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  return canvas;
}

/**
 * Rich royal Arabesque woven carpet (warm taupe, deep bronze border, champagne-gold motifs)
 * providing crisp visual grounding underneath light ivory & beige furniture.
 */
function createRoyalCarpetCanvas(): HTMLCanvasElement {
  const size = 1024;
  const [canvas, ctx] = makeCanvas(size, size);
  ctx.fillStyle = '#9E8C76';
  ctx.fillRect(0, 0, size, size);

  // Subtle woven pile noise
  const rand = seededRand(818);
  for (let i = 0; i < 6000; i++) {
    const x = rand() * size;
    const y = rand() * size;
    ctx.fillStyle = i % 2 === 0 ? 'rgba(238,231,218,0.08)' : 'rgba(58,42,30,0.1)';
    ctx.fillRect(x, y, 3, 2);
  }

  // Ornate geometric Arabesque lattice
  const step = 128;
  for (let y = 0; y <= size; y += step) {
    for (let x = 0; x <= size; x += step) {
      ctx.strokeStyle = 'rgba(222, 192, 140, 0.52)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y - 48);
      ctx.lineTo(x + 48, y);
      ctx.lineTo(x, y + 48);
      ctx.lineTo(x - 48, y);
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = 'rgba(89, 64, 49, 0.34)';
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Deep walnut & gold woven framing border
  ctx.strokeStyle = '#594031';
  ctx.lineWidth = 28;
  ctx.strokeRect(18, 18, size - 36, size - 36);
  ctx.strokeStyle = '#C7A572';
  ctx.lineWidth = 6;
  ctx.strokeRect(42, 42, size - 84, size - 84);

  return canvas;
}

function createMashrabiyaAlphaCanvas(): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas(512, 512);
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 12;
  ctx.strokeRect(6, 6, 500, 500);

  const cells = 4;
  const size = 512 / cells;
  for (let cy = 0; cy < cells; cy++) {
    for (let cx = 0; cx < cells; cx++) {
      const x = cx * size + size / 2;
      const y = cy * size + size / 2;
      const r = size * 0.44;
      for (let rot = 0; rot < 2; rot++) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((rot * Math.PI) / 4);
        ctx.strokeRect(-r * 0.68, -r * 0.68, r * 1.36, r * 1.36);
        ctx.restore();
      }
      ctx.beginPath();
      ctx.moveTo(x, y - size / 2);
      ctx.lineTo(x + size / 2, y);
      ctx.lineTo(x, y + size / 2);
      ctx.lineTo(x - size / 2, y);
      ctx.closePath();
      ctx.stroke();
    }
  }
  return canvas;
}

function createAsphaltCanvas(): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas(512, 512);
  const rand = seededRand(909);
  ctx.fillStyle = '#232426';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 8000; i++) {
    const x = rand() * 512;
    const y = rand() * 512;
    const v = 22 + Math.floor(rand() * 34);
    ctx.fillStyle = `rgb(${v},${v},${v + 2})`;
    ctx.fillRect(x, y, 2, 2);
  }
  return canvas;
}

function createLimestonePaverCanvas(isBump = false): HTMLCanvasElement {
  const size = 512;
  const [canvas, ctx] = makeCanvas(size, size);
  const rand = seededRand(303);
  ctx.fillStyle = isBump ? '#262626' : '#6A5D4D';
  ctx.fillRect(0, 0, size, size);

  const tiles = 4;
  const s = size / tiles;
  for (let r = 0; r < tiles; r++) {
    for (let c = 0; c < tiles; c++) {
      const delta = Math.floor(rand() * 24);
      if (isBump) {
        const b = 150 + delta;
        ctx.fillStyle = `rgb(${b},${b},${b})`;
      } else {
        ctx.fillStyle = `rgb(${182 + delta}, ${168 + delta}, ${148 + delta})`;
      }
      ctx.fillRect(c * s + 4, r * s + 4, s - 8, s - 8);
    }
  }
  return canvas;
}

function createSilkDrapeCanvas(isBump = false): HTMLCanvasElement {
  const size = 512;
  const [canvas, ctx] = makeCanvas(size, size);
  const pleats = 12;
  const pW = size / pleats;
  for (let i = 0; i < pleats; i++) {
    const x = i * pW;
    const g = ctx.createLinearGradient(x, 0, x + pW, 0);
    if (isBump) {
      g.addColorStop(0.0, '#2e2e2e');
      g.addColorStop(0.28, '#dcdcdc');
      g.addColorStop(0.55, '#f2f2f2');
      g.addColorStop(0.82, '#8a8a8a');
      g.addColorStop(1.0, '#2e2e2e');
    } else {
      g.addColorStop(0.0, '#bfb29c');
      g.addColorStop(0.28, '#eee6d8');
      g.addColorStop(0.55, '#f8f2e7');
      g.addColorStop(0.82, '#d5c7b2');
      g.addColorStop(1.0, '#bfb29c');
    }
    ctx.fillStyle = g;
    ctx.fillRect(x, 0, pW + 1, size);
  }
  // Fine vertical silk sheen threads
  const rand = seededRand(515);
  for (let i = 0; i < 420; i++) {
    const x = rand() * size;
    ctx.fillStyle = isBump ? 'rgba(200,200,200,0.08)' : 'rgba(255,248,236,0.12)';
    ctx.fillRect(x, 0, 1.5, size);
  }
  return canvas;
}

function createSaduAccentCanvas(): HTMLCanvasElement {
  const size = 512;
  const [canvas, ctx] = makeCanvas(size, size);
  ctx.fillStyle = '#3B2318';
  ctx.fillRect(0, 0, size, size);

  // Traditional Saudi Sadu woven horizontal geometric bands
  const bands = [
    { y: 0, h: 64, color: '#6E2320' },
    { y: 64, h: 32, color: '#C7A572' },
    { y: 96, h: 128, color: '#2A1B14' },
    { y: 224, h: 64, color: '#8A2D24' },
    { y: 288, h: 128, color: '#2A1B14' },
    { y: 416, h: 32, color: '#C7A572' },
    { y: 448, h: 64, color: '#6E2320' },
  ];
  for (const b of bands) {
    ctx.fillStyle = b.color;
    ctx.fillRect(0, b.y, size, b.h);
  }

  // Woven diamond zig-zag motifs in ivory & gold
  for (const rowY of [160, 352]) {
    const step = 64;
    for (let x = 0; x < size + step; x += step) {
      ctx.fillStyle = '#EEE7DA';
      ctx.beginPath();
      ctx.moveTo(x, rowY - 38);
      ctx.lineTo(x + 28, rowY);
      ctx.lineTo(x, rowY + 38);
      ctx.lineTo(x - 28, rowY);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#C7A572';
      ctx.beginPath();
      ctx.moveTo(x, rowY - 20);
      ctx.lineTo(x + 14, rowY);
      ctx.lineTo(x, rowY + 20);
      ctx.lineTo(x - 14, rowY);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#7A221D';
      ctx.beginPath();
      ctx.arc(x, rowY, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  return canvas;
}

function createSparkleSpriteCanvas(): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas(128, 128);
  const g = ctx.createRadialGradient(64, 64, 2, 64, 64, 60);
  g.addColorStop(0, 'rgba(255, 248, 224, 1.0)');
  g.addColorStop(0.22, 'rgba(255, 222, 152, 0.85)');
  g.addColorStop(0.55, 'rgba(218, 174, 96, 0.25)');
  g.addColorStop(1, 'rgba(218, 174, 96, 0.0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return canvas;
}

function createContactShadowCanvas(): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas(256, 256);
  const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 122);
  g.addColorStop(0, 'rgba(12,9,7,0.72)');
  g.addColorStop(0.55, 'rgba(12,9,7,0.32)');
  g.addColorStop(1, 'rgba(12,9,7,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return canvas;
}

export function createProceduralTextures(maxAniso: number): ProceduralTextureSet {
  const ivoryMarble = configureTexture(
    createMarbleCanvas(
      '#DFD5C5',
      'rgba(170,148,122,0.22)',
      'rgba(246,240,228,0.20)',
      'rgba(124,102,78,0.44)',
      'rgba(184,144,86,0.52)',
      11,
      false,
      1024,
    ),
    2,
    2,
    maxAniso,
    true,
  );
  const ivoryMarbleBump = configureTexture(
    createMarbleCanvas('#808080', '', '', '', '', 11, true, 512),
    2,
    2,
    maxAniso,
    false,
  );
  const charcoalMarble = configureTexture(
    createMarbleCanvas(
      '#202022',
      'rgba(48,46,44,0.25)',
      'rgba(12,12,14,0.25)',
      'rgba(222,208,188,0.34)',
      'rgba(199,165,114,0.52)',
      22,
      false,
      1024,
    ),
    2,
    2,
    maxAniso,
    true,
  );
  const marbleFloorTile = configureTexture(createGeometricFloorCanvas('albedo'), 11, 11, maxAniso, true);
  const marbleFloorBump = configureTexture(createGeometricFloorCanvas('bump'), 11, 11, maxAniso, false);
  const marbleFloorRoughness = configureTexture(createGeometricFloorCanvas('roughness'), 11, 11, maxAniso, false);

  const walnutWood = configureTexture(createWalnutCanvas(false), 2, 2, maxAniso, true);
  const walnutBump = configureTexture(createWalnutCanvas(true), 2, 2, maxAniso, false);

  const travertine = configureTexture(createTravertineCanvas(false), 6, 3, maxAniso, true);
  const travertineBump = configureTexture(createTravertineCanvas(true), 6, 3, maxAniso, false);

  const fabricWeave = configureTexture(createFabricCanvas(false), 5, 5, maxAniso, true);
  const fabricBump = configureTexture(createFabricCanvas(true), 5, 5, maxAniso, false);

  const carpetRoyal = configureTexture(createRoyalCarpetCanvas(), 5, 5, maxAniso, true);
  const mashrabiyaAlpha = configureTexture(createMashrabiyaAlphaCanvas(), 3, 2, maxAniso, false);
  const asphalt = configureTexture(createAsphaltCanvas(), 14, 14, maxAniso, true);
  const limestonePaver = configureTexture(createLimestonePaverCanvas(false), 18, 18, maxAniso, true);
  const limestonePaverBump = configureTexture(createLimestonePaverCanvas(true), 18, 18, maxAniso, false);

  const silkDrape = configureTexture(createSilkDrapeCanvas(false), 2, 1, maxAniso, true);
  const silkDrapeBump = configureTexture(createSilkDrapeCanvas(true), 2, 1, maxAniso, false);
  const saduAccent = configureTexture(createSaduAccentCanvas(), 1, 1, maxAniso, true);

  const sparkleSprite = configureTexture(createSparkleSpriteCanvas(), 1, 1, 1, true);
  sparkleSprite.wrapS = THREE.ClampToEdgeWrapping;
  sparkleSprite.wrapT = THREE.ClampToEdgeWrapping;

  const contactShadow = configureTexture(createContactShadowCanvas(), 1, 1, 1, false);
  contactShadow.wrapS = THREE.ClampToEdgeWrapping;
  contactShadow.wrapT = THREE.ClampToEdgeWrapping;

  const all = [
    ivoryMarble,
    ivoryMarbleBump,
    charcoalMarble,
    marbleFloorTile,
    marbleFloorBump,
    marbleFloorRoughness,
    walnutWood,
    walnutBump,
    travertine,
    travertineBump,
    fabricWeave,
    fabricBump,
    carpetRoyal,
    mashrabiyaAlpha,
    asphalt,
    limestonePaver,
    limestonePaverBump,
    silkDrape,
    silkDrapeBump,
    saduAccent,
    sparkleSprite,
    contactShadow,
  ];

  return {
    ivoryMarble,
    ivoryMarbleBump,
    charcoalMarble,
    marbleFloorTile,
    marbleFloorBump,
    marbleFloorRoughness,
    walnutWood,
    walnutBump,
    travertine,
    travertineBump,
    fabricWeave,
    fabricBump,
    carpetRoyal,
    mashrabiyaAlpha,
    asphalt,
    limestonePaver,
    limestonePaverBump,
    silkDrape,
    silkDrapeBump,
    saduAccent,
    sparkleSprite,
    contactShadow,
    dispose: () => {
      all.forEach((t) => t.dispose());
    },
  };
}
