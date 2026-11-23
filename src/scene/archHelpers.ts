import * as THREE from 'three';
import { BuildContext } from '../types/venue';
import { VenueMaterials } from './materials';

export const FLOOR_Y = 0.2;

/**
 * Adds an architectural wall mesh and registers its 2D AABB collider for first-person walking.
 */
export function addWall(
  parent: THREE.Object3D,
  ctx: BuildContext,
  x: number,
  y: number,
  z: number,
  w: number,
  h: number,
  d: number,
  material: THREE.Material,
  addCollider = true,
  castShadow = true,
): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = true;
  parent.add(mesh);

  if (addCollider) {
    ctx.colliders.push({
      minX: x - w / 2,
      maxX: x + w / 2,
      minZ: z - d / 2,
      maxZ: z + d / 2,
    });
  }
  return mesh;
}

/**
 * Builds a wall segment along X with a centered architectural opening (doorway/arch) and registers
 * colliders only on the solid left and right segments so the user can walk cleanly through.
 */
export function addWallWithDoorwayX(
  parent: THREE.Object3D,
  ctx: BuildContext,
  centerX: number,
  z: number,
  totalWidth: number,
  height: number,
  thickness: number,
  doorWidth: number,
  doorHeight: number,
  material: THREE.Material,
  trimMat: THREE.Material,
): void {
  const sideW = (totalWidth - doorWidth) / 2;
  if (sideW > 0.1) {
    addWall(
      parent,
      ctx,
      centerX - doorWidth / 2 - sideW / 2,
      FLOOR_Y + height / 2,
      z,
      sideW,
      height,
      thickness,
      material,
      true,
    );
    addWall(
      parent,
      ctx,
      centerX + doorWidth / 2 + sideW / 2,
      FLOOR_Y + height / 2,
      z,
      sideW,
      height,
      thickness,
      material,
      true,
    );
  }
  // Transom above doorway
  const topH = height - doorHeight;
  if (topH > 0.1) {
    addWall(
      parent,
      ctx,
      centerX,
      FLOOR_Y + doorHeight + topH / 2,
      z,
      doorWidth + 0.1,
      topH,
      thickness,
      material,
      false,
    );
  }
  // Champagne gold architectural portal frame
  for (const sx of [-1, 1]) {
    const jamb = new THREE.Mesh(new THREE.BoxGeometry(0.18, doorHeight, thickness + 0.14), trimMat);
    jamb.position.set(centerX + sx * (doorWidth / 2), FLOOR_Y + doorHeight / 2, z);
    parent.add(jamb);
  }
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(doorWidth + 0.36, 0.22, thickness + 0.16), trimMat);
  lintel.position.set(centerX, FLOOR_Y + doorHeight + 0.1, z);
  parent.add(lintel);
}

/**
 * Builds a wall segment along Z with a centered architectural opening.
 */
export function addWallWithDoorwayZ(
  parent: THREE.Object3D,
  ctx: BuildContext,
  x: number,
  centerZ: number,
  totalLength: number,
  height: number,
  thickness: number,
  doorWidth: number,
  doorHeight: number,
  material: THREE.Material,
  trimMat: THREE.Material,
): void {
  const sideL = (totalLength - doorWidth) / 2;
  if (sideL > 0.1) {
    addWall(
      parent,
      ctx,
      x,
      FLOOR_Y + height / 2,
      centerZ - doorWidth / 2 - sideL / 2,
      thickness,
      height,
      sideL,
      material,
      true,
    );
    addWall(
      parent,
      ctx,
      x,
      FLOOR_Y + height / 2,
      centerZ + doorWidth / 2 + sideL / 2,
      thickness,
      height,
      sideL,
      material,
      true,
    );
  }
  const topH = height - doorHeight;
  if (topH > 0.1) {
    addWall(
      parent,
      ctx,
      x,
      FLOOR_Y + doorHeight + topH / 2,
      centerZ,
      thickness,
      topH,
      doorWidth + 0.1,
      material,
      false,
    );
  }
  for (const sz of [-1, 1]) {
    const jamb = new THREE.Mesh(new THREE.BoxGeometry(thickness + 0.14, doorHeight, 0.18), trimMat);
    jamb.position.set(x, FLOOR_Y + doorHeight / 2, centerZ + sz * (doorWidth / 2));
    parent.add(jamb);
  }
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(thickness + 0.16, 0.22, doorWidth + 0.36), trimMat);
  lintel.position.set(x, FLOOR_Y + doorHeight + 0.1, centerZ);
  parent.add(lintel);
}

/**
 * Creates an interactive double sliding glass or walnut door that opens automatically on proximity
 * or manually when clicked.
 */
export function createInteractiveDoubleDoor(
  parent: THREE.Object3D,
  ctx: BuildContext,
  mats: VenueMaterials,
  opts: {
    id: string;
    nameEn: string;
    nameAr: string;
    x: number;
    z: number;
    axis: 'x' | 'z'; // 'x' = leaves slide along X (door faces Z); 'z' = leaves slide along Z (door faces X)
    width: number;
    height: number;
    style: 'glass' | 'walnut';
  },
): void {
  const leafW = opts.width / 2 - 0.04;
  const leafThick = 0.08;
  const leafMat = opts.style === 'glass' ? mats.archGlass : mats.walnutWood;

  const makeLeaf = (side: -1 | 1): THREE.Group => {
    const g = new THREE.Group();
    const panel = new THREE.Mesh(
      opts.axis === 'x'
        ? new THREE.BoxGeometry(leafW, opts.height - 0.08, leafThick)
        : new THREE.BoxGeometry(leafThick, opts.height - 0.08, leafW),
      leafMat,
    );
    panel.position.y = opts.height / 2;
    g.add(panel);

    // Champagne gold vertical stile & long architectural pull handle
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.35, 10), mats.champagneGold);
    if (opts.axis === 'x') {
      handle.position.set(-side * (leafW / 2 - 0.18), 1.35, 0.07);
    } else {
      handle.position.set(0.07, 1.35, -side * (leafW / 2 - 0.18));
    }
    g.add(handle);

    // Gold perimeter frame strip
    const topBar = new THREE.Mesh(
      opts.axis === 'x'
        ? new THREE.BoxGeometry(leafW, 0.08, leafThick + 0.02)
        : new THREE.BoxGeometry(leafThick + 0.02, 0.08, leafW),
      mats.champagneGold,
    );
    topBar.position.y = opts.height - 0.06;
    g.add(topBar);

    const botBar = topBar.clone();
    botBar.position.y = 0.06;
    g.add(botBar);

    // Tag all child meshes for raycasting
    g.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.userData.interactiveType = 'door';
        obj.userData.doorId = opts.id;
      }
    });
    return g;
  };

  const leftLeaf = makeLeaf(-1);
  const rightLeaf = makeLeaf(1);

  const offset = leafW / 2 + 0.02;
  if (opts.axis === 'x') {
    leftLeaf.position.set(opts.x - offset, FLOOR_Y, opts.z);
    rightLeaf.position.set(opts.x + offset, FLOOR_Y, opts.z);
  } else {
    leftLeaf.position.set(opts.x, FLOOR_Y, opts.z - offset);
    rightLeaf.position.set(opts.x, FLOOR_Y, opts.z + offset);
  }

  parent.add(leftLeaf);
  parent.add(rightLeaf);
  ctx.interactables.push(leftLeaf, rightLeaf);

  const colliderIndex = ctx.colliders.length;
  ctx.colliders.push({
    minX: opts.axis === 'x' ? opts.x - opts.width / 2 : opts.x - 0.25,
    maxX: opts.axis === 'x' ? opts.x + opts.width / 2 : opts.x + 0.25,
    minZ: opts.axis === 'x' ? opts.z - 0.25 : opts.z - opts.width / 2,
    maxZ: opts.axis === 'x' ? opts.z + 0.25 : opts.z + opts.width / 2,
    isDoor: true,
    doorId: opts.id,
  });

  ctx.doors.push({
    id: opts.id,
    nameEn: opts.nameEn,
    nameAr: opts.nameAr,
    type: 'slide',
    center: new THREE.Vector3(opts.x, FLOOR_Y + 1.5, opts.z),
    axis: opts.axis,
    isOpen: false,
    manualOverride: false,
    openProgress: 0,
    leftLeaf,
    rightLeaf,
    leftClosedPos: opts.axis === 'x' ? opts.x - offset : opts.z - offset,
    rightClosedPos: opts.axis === 'x' ? opts.x + offset : opts.z + offset,
    slideDistance: leafW * 0.92,
    colliderIndex,
  });
}

/**
 * Installs a framed ultra-HD LED Video Wall and registers it with the LEDScreenManager.
 */
export function createFramedLEDScreen(
  parent: THREE.Object3D,
  ctx: BuildContext,
  mats: VenueMaterials,
  opts: {
    screenId: string;
    x: number;
    y: number;
    z: number;
    rotY?: number;
    width: number;
    height: number;
    cameraPos: [number, number, number];
    lookAt: [number, number, number];
  },
): THREE.Group {
  const group = new THREE.Group();
  group.position.set(opts.x, opts.y, opts.z);
  if (opts.rotY) group.rotation.y = opts.rotY;

  // Sleek dark charcoal structural bezel
  const bezel = new THREE.Mesh(
    new THREE.BoxGeometry(opts.width + 0.26, opts.height + 0.26, 0.16),
    mats.ledBezel,
  );
  bezel.position.z = -0.09;
  group.add(bezel);

  // Outer champagne-gold reveal trim
  const goldTrim = new THREE.Mesh(
    new THREE.BoxGeometry(opts.width + 0.34, opts.height + 0.34, 0.08),
    mats.champagneGold,
  );
  goldTrim.position.z = -0.12;
  group.add(goldTrim);

  // Active LED screen display plane
  const displayMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(opts.width, opts.height),
    mats.ledBezel,
  );
  displayMesh.position.z = 0.01;
  group.add(displayMesh);

  ctx.registerScreenMesh(opts.screenId, displayMesh, opts.cameraPos, opts.lookAt);
  ctx.interactables.push(displayMesh);

  parent.add(group);
  return group;
}
