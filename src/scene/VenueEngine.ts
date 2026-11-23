import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import { INITIAL_SCREENS, ZONES } from '../data/venueData';
import {
  AABBCollider,
  BuildContext,
  CameraMode,
  CinematicTourState,
  CouplePlaqueHandle,
  InteractiveDoor,
  LightingMode,
  QualityPreset,
  ScreenConfig,
  ZoneId,
} from '../types/venue';
import { FLOOR_Y } from './archHelpers';
import { buildExteriorAndParking } from './buildExterior';
import { buildMensWing } from './buildMensWing';
import { buildWomensWingAndKitchen } from './buildWomensWing';
import { CinematicDroneTour } from './cinematicTour';
import { LEDScreenManager } from './ledScreens';
import { createVenueMaterials, VenueMaterials } from './materials';
import { createProceduralTextures, ProceduralTextureSet } from './textures';

export interface EngineCallbacks {
  onScreenClick: (screenId: string) => void;
  onDoorToggle: (doorNameEn: string, doorNameAr: string, isOpen: boolean) => void;
  onZoneDetected: (zoneId: ZoneId) => void;
  onCameraTelemetry?: (x: number, z: number, yaw: number) => void;
  onCinematicTourChange?: (state: CinematicTourState) => void;
  onReady: () => void;
}

const _fwd = new THREE.Vector3();
const _right = new THREE.Vector3();
const _move = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);
const _lookTarget = new THREE.Vector3();
const _euler = new THREE.Euler(0, 0, 0, 'YXZ');

function detectSoftwareWebGL(): boolean {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export class VenueEngine {
  private container: HTMLElement;
  private callbacks: EngineCallbacks;
  private isSoftwareGl: boolean;

  private renderer: THREE.WebGLRenderer;
  private composer: EffectComposer | null = null;
  private bloomPass: UnrealBloomPass | null = null;
  private cssRenderer: CSS3DRenderer;
  private scene: THREE.Scene;
  private cssScene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private orbitControls: OrbitControls;

  private textures: ProceduralTextureSet;
  private materials: VenueMaterials;
  private screenManager: LEDScreenManager;

  // Lighting rig
  private sunLight: THREE.DirectionalLight;
  private hemiLight: THREE.HemisphereLight;
  private fillLight: THREE.DirectionalLight;
  private skyMesh: THREE.Mesh;
  private skyMat: THREE.ShaderMaterial;

  // World & interaction data
  private colliders: AABBCollider[] = [];
  private doors: InteractiveDoor[] = [];
  private interactables: THREE.Object3D[] = [];
  private roofs: THREE.Object3D[] = [];
  private couplePlaques: CouplePlaqueHandle[] = [];
  private dynamicLights: BuildContext['dynamicLights'] = {
    exteriorLamps: [],
    interiorChandeliers: [],
    stageSpots: [],
    prepLights: [],
    emissiveFixtures: [],
  };
  private animatedObjects: BuildContext['animatedObjects'] = {
    fountainJets: [],
    fountainRings: [],
    crystalGroups: [],
    sparkleSystems: [],
    movingSpots: [],
    candleFlames: [],
  };

  // Navigation, quality & camera state
  private cameraMode: CameraMode = 'walk';
  private lightingMode: LightingMode = 'sunset';
  private qualityPreset: QualityPreset = 'high';
  private modalOpen = false;
  private yaw = 0;
  private pitch = -0.05;
  private keys = new Set<string>();
  private touchMove = { x: 0, y: 0 };
  private isPointerDown = false;
  private pointerDownPos = { x: 0, y: 0 };
  private lastPointerPos = { x: 0, y: 0 };
  private hasDragged = false;

  // Smooth scripted camera transition
  private transition: {
    active: boolean;
    targetPos: THREE.Vector3;
    targetLook: THREE.Vector3;
    targetYaw: number;
    targetPitch: number;
  } = {
    active: false,
    targetPos: new THREE.Vector3(),
    targetLook: new THREE.Vector3(),
    targetYaw: 0,
    targetPitch: 0,
  };

  // Automated Full-Palace Cinematic Drone Tour
  private cinematicTour = new CinematicDroneTour();
  private lastTourEmit = 0;

  // Raycasting
  private raycaster = new THREE.Raycaster();
  private mouseNdc = new THREE.Vector2();

  // Loop & lifecycle
  private clock = new THREE.Clock();
  private frameId = 0;
  private disposed = false;
  private lastZoneCheck = 0;
  private currentZoneId: ZoneId = 'exterior';
  private lastTelemetryTime = 0;

  constructor(container: HTMLElement, callbacks: EngineCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.isSoftwareGl = detectSoftwareWebGL();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. WebGL Renderer with Calibrated ACES Filmic Tone Mapping (zero highlight washout)
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.86;
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.5));
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(width, height);
    container.appendChild(this.renderer.domElement);

    // 1b. CSS3D Overlay Renderer for live in-world 3D YouTube playback on Hall LED Walls
    this.cssScene = new THREE.Scene();
    this.cssRenderer = new CSS3DRenderer();
    this.cssRenderer.setSize(width, height);
    this.cssRenderer.domElement.style.position = 'absolute';
    this.cssRenderer.domElement.style.inset = '0';
    this.cssRenderer.domElement.style.pointerEvents = 'none';
    this.cssRenderer.domElement.style.overflow = 'hidden';
    container.appendChild(this.cssRenderer.domElement);

    // 2. Scene & Calibrated Studio PBR Environment Reflections
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x4b3c34, 0.0014);

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.36;
    pmrem.dispose();

    // 3. Camera & OrbitControls
    const aspect = width / height;
    this.camera = new THREE.PerspectiveCamera(54, aspect, 0.15, 380);
    this.camera.position.set(0, 7.6, 62);

    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbitControls.enableDamping = !this.isSoftwareGl;
    this.orbitControls.dampingFactor = 0.06;
    this.orbitControls.maxPolarAngle = Math.PI * 0.48;
    this.orbitControls.minDistance = 12;
    this.orbitControls.maxDistance = 155;
    this.orbitControls.enabled = false;
    this.orbitControls.addEventListener('start', () => {
      this.transition.active = false;
    });

    // 3b. Tasteful Post-Processing Composer (subtle high-threshold bloom on crystals, candles & fairy lights)
    if (!this.isSoftwareGl) {
      const composer = new EffectComposer(this.renderer);
      composer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      composer.setSize(width, height);
      composer.addPass(new RenderPass(this.scene, this.camera));

      const bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 0.18, 0.42, 0.94);
      composer.addPass(bloom);
      composer.addPass(new OutputPass());

      this.composer = composer;
      this.bloomPass = bloom;
    }

    // 4. Deep High-Contrast Architectural Sky Dome Shader
    this.skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        topColor: { value: new THREE.Color(0x162440) },
        horizonColor: { value: new THREE.Color(0xb87e55) },
        bottomColor: { value: new THREE.Color(0x6e5440) },
      },
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 horizonColor;
        uniform vec3 bottomColor;
        varying vec3 vWorldPos;
        void main() {
          float h = normalize(vWorldPos).y;
          vec3 col = h >= 0.0
            ? mix(horizonColor, topColor, pow(clamp(h, 0.0, 1.0), 0.52))
            : mix(horizonColor, bottomColor, pow(clamp(-h, 0.0, 1.0), 0.45));
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    this.skyMesh = new THREE.Mesh(new THREE.SphereGeometry(260, 28, 18), this.skyMat);
    this.scene.add(this.skyMesh);

    // 5. Balanced Three-Point Architectural Lighting Rig
    this.hemiLight = new THREE.HemisphereLight(0xf5cfa4, 0x453529, 0.36);
    this.hemiLight.position.set(0, 60, 0);
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(0xffcb8c, 1.45);
    this.sunLight.position.set(-62, 26, 56);
    this.sunLight.castShadow = !this.isSoftwareGl;
    this.sunLight.shadow.mapSize.set(2048, 2048);
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 210;
    const d = 72;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0004;
    this.sunLight.shadow.normalBias = 0.025;
    this.scene.add(this.sunLight);

    this.fillLight = new THREE.DirectionalLight(0x88a6cc, 0.28);
    this.fillLight.position.set(52, 24, -44);
    this.scene.add(this.fillLight);

    // 6. High-Resolution Procedural PBR Textures, Calibrated Materials & 3D LED Manager
    const maxAniso = this.renderer.capabilities.getMaxAnisotropy();
    this.textures = createProceduralTextures(maxAniso);
    this.materials = createVenueMaterials(this.textures, this.isSoftwareGl);
    this.screenManager = new LEDScreenManager(INITIAL_SCREENS, this.cssScene);

    // 7. Build All Physically Connected Palace Zones
    const buildCtx: BuildContext = {
      scene: this.scene,
      colliders: this.colliders,
      doors: this.doors,
      interactables: this.interactables,
      roofs: this.roofs,
      couplePlaques: this.couplePlaques,
      dynamicLights: this.dynamicLights,
      animatedObjects: this.animatedObjects,
      registerScreenMesh: (screenId, mesh, camPos, lookAt) => {
        this.screenManager.registerMesh(screenId, mesh, camPos, lookAt);
      },
    };

    buildExteriorAndParking(buildCtx, this.materials);
    buildMensWing(buildCtx, this.materials);
    buildWomensWingAndKitchen(buildCtx, this.materials);

    // Initialize all unobstructed backlit couple name plaques (Men's Stage, Women's Kosha, Exterior Portal)
    const primaryScreen = INITIAL_SCREENS[0];
    this.updateCouplePlaques(
      primaryScreen.groomNameAr,
      primaryScreen.brideNameAr,
      primaryScreen.groomNameEn,
      primaryScreen.brideNameEn,
      primaryScreen.eventDate,
    );

    // Calibrate realistic physical decay on interior point lights so light sculpts depth cleanly
    for (const l of this.dynamicLights.interiorChandeliers) {
      l.decay = 1.75;
      l.distance = 25;
    }
    for (const l of this.dynamicLights.prepLights) {
      l.decay = 1.75;
      l.distance = 20;
    }
    for (const l of this.dynamicLights.exteriorLamps) {
      l.decay = 1.75;
      l.distance = 21;
    }

    // Apply rich golden-hour sunset contrast lighting & high quality by default
    this.setQualityPreset(this.isSoftwareGl ? 'performance' : 'high');
    this.setLightingMode('sunset');
    this.orientCameraToward(new THREE.Vector3(0, 5.4, 25));

    if (!this.isSoftwareGl) {
      this.renderer.compile(this.scene, this.camera);
    }

    this.bindEvents();
    this.callbacks.onReady();
    this.startLoop();
  }

  private orientCameraToward(target: THREE.Vector3): void {
    this.camera.lookAt(target);
    _euler.setFromQuaternion(this.camera.quaternion, 'YXZ');
    this.yaw = _euler.y;
    this.pitch = THREE.MathUtils.clamp(_euler.x, -1.35, 1.35);
  }

  public setModalOpen(open: boolean): void {
    this.modalOpen = open;
  }

  public setQualityPreset(preset: QualityPreset): void {
    this.qualityPreset = preset;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    if (this.isSoftwareGl || preset === 'performance') {
      this.renderer.setPixelRatio(1);
      this.renderer.shadowMap.enabled = false;
      this.sunLight.castShadow = false;
      for (const sp of this.animatedObjects.sparkleSystems) sp.visible = false;
    } else if (preset === 'high') {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      this.renderer.setPixelRatio(dpr);
      this.renderer.shadowMap.enabled = true;
      this.sunLight.castShadow = true;
      this.composer?.setPixelRatio(dpr);
      this.composer?.setSize(width, height);
      if (this.bloomPass) {
        this.bloomPass.strength = this.lightingMode === 'wedding' || this.lightingMode === 'night' ? 0.22 : 0.14;
      }
      for (const sp of this.animatedObjects.sparkleSystems) sp.visible = true;
    } else {
      const dpr = Math.min(window.devicePixelRatio, 2);
      this.renderer.setPixelRatio(dpr);
      this.renderer.shadowMap.enabled = true;
      this.sunLight.castShadow = true;
      this.composer?.setPixelRatio(dpr);
      this.composer?.setSize(width, height);
      if (this.bloomPass) {
        this.bloomPass.strength = this.lightingMode === 'wedding' || this.lightingMode === 'night' ? 0.28 : 0.19;
      }
      for (const sp of this.animatedObjects.sparkleSystems) sp.visible = true;
    }

    this.renderer.setSize(width, height);
    this.renderer.shadowMap.needsUpdate = true;
  }

  public updateCouplePlaques(
    groomAr: string,
    brideAr: string,
    groomEn: string,
    brideEn: string,
    eventDate: string,
  ): void {
    for (const plaque of this.couplePlaques) {
      plaque.updateNames(groomAr, brideAr, groomEn, brideEn, eventDate);
    }
  }

  private emitTourState(): void {
    this.callbacks.onCinematicTourChange?.(this.cinematicTour.getState());
  }

  public startCinematicTour(): void {
    this.transition.active = false;
    this.orbitControls.enabled = false;
    this.cameraMode = 'drone';
    for (const r of this.roofs) {
      r.visible = true;
    }
    this.cinematicTour.start(this.camera);
    _euler.setFromQuaternion(this.camera.quaternion, 'YXZ');
    this.yaw = _euler.y;
    this.pitch = THREE.MathUtils.clamp(_euler.x, -1.35, 1.35);
    this.currentZoneId = 'exterior';
    this.callbacks.onZoneDetected('exterior');
    this.emitTourState();
  }

  public stopCinematicTour(): void {
    if (!this.cinematicTour.active) return;
    this.cinematicTour.stop();
    _euler.setFromQuaternion(this.camera.quaternion, 'YXZ');
    this.yaw = _euler.y;
    this.pitch = THREE.MathUtils.clamp(_euler.x, -1.35, 1.35);
    this.emitTourState();
  }

  public toggleCinematicTourPause(): void {
    if (!this.cinematicTour.active) return;
    this.cinematicTour.togglePause();
    this.emitTourState();
  }

  public restartCinematicTour(): void {
    this.startCinematicTour();
  }

  public seekCinematicTour(progress: number): void {
    this.transition.active = false;
    this.orbitControls.enabled = false;
    this.cameraMode = 'drone';
    for (const r of this.roofs) {
      r.visible = true;
    }
    this.cinematicTour.seek(progress, this.camera);
    _euler.setFromQuaternion(this.camera.quaternion, 'YXZ');
    this.yaw = _euler.y;
    this.pitch = THREE.MathUtils.clamp(_euler.x, -1.35, 1.35);
    const detected = this.detectCurrentZone(this.camera.position.x, this.camera.position.z);
    if (detected !== this.currentZoneId) {
      this.currentZoneId = detected;
      this.callbacks.onZoneDetected(detected);
    }
    this.emitTourState();
  }

  public setCinematicTourSpeed(speed: number): void {
    this.cinematicTour.setSpeed(speed);
    this.emitTourState();
  }

  public setCameraMode(mode: CameraMode): void {
    if (this.cinematicTour.active) {
      this.stopCinematicTour();
    }
    this.cameraMode = mode;
    const showRoofs = mode !== 'floorplan';
    for (const r of this.roofs) {
      r.visible = showRoofs;
    }

    if (mode === 'floorplan') {
      this.orbitControls.enabled = true;
      this.transition.active = true;
      this.transition.targetPos.set(0, 96, 48);
      this.transition.targetLook.set(0, 0, 2);
      this.orbitControls.target.set(0, 0, 2);
    } else {
      this.orbitControls.enabled = false;
      if (mode === 'walk') {
        const groundY = this.getGroundHeightAt(this.camera.position.x, this.camera.position.z);
        this.camera.position.y = groundY + 1.68;
        this.pitch = THREE.MathUtils.clamp(this.pitch, -0.85, 0.85);
      } else if (mode === 'drone') {
        this.transition.active = false;
        if (this.camera.position.y < 3.5) {
          this.camera.position.y = 5.5;
        }
      }
    }
  }

  public navigateToZone(zoneId: ZoneId): void {
    if (this.cinematicTour.active) {
      this.stopCinematicTour();
    }
    const zone = ZONES.find((z) => z.id === zoneId);
    if (!zone) return;

    if (this.cameraMode === 'floorplan') {
      this.setCameraMode('walk');
    }

    const pos =
      this.cameraMode === 'walk'
        ? new THREE.Vector3(
            zone.walkPos[0],
            this.getGroundHeightAt(zone.walkPos[0], zone.walkPos[2]) + 1.68,
            zone.walkPos[2],
          )
        : new THREE.Vector3(...zone.cameraPos);
    const look = new THREE.Vector3(...zone.lookAt);

    this.startSmoothTransition(pos, look);
    this.currentZoneId = zoneId;
    this.callbacks.onZoneDetected(zoneId);
  }

  public focusOnPoint(cameraPos: [number, number, number], lookAt: [number, number, number]): void {
    if (this.cinematicTour.active) {
      this.stopCinematicTour();
    }
    if (this.cameraMode === 'floorplan') {
      this.setCameraMode('walk');
    }
    this.startSmoothTransition(new THREE.Vector3(...cameraPos), new THREE.Vector3(...lookAt));
  }

  public focusOnScreen(screenId: string): void {
    if (this.cinematicTour.active) {
      this.stopCinematicTour();
    }
    const target = this.screenManager.getFocusTarget(screenId);
    if (!target) return;
    if (this.cameraMode === 'floorplan') {
      this.setCameraMode('walk');
    }
    const detected = this.detectCurrentZone(target.cameraPos[0], target.cameraPos[2]);
    this.currentZoneId = detected;
    this.callbacks.onZoneDetected(detected);
    this.startSmoothTransition(new THREE.Vector3(...target.cameraPos), new THREE.Vector3(...target.lookAt));
  }

  public updateScreenConfig(config: ScreenConfig): void {
    this.screenManager.updateScreenConfig(config);
    if (
      config.id === 'ext-welcome-main' ||
      config.id === 'mens-stage-main' ||
      config.id === 'womens-kosha-main'
    ) {
      this.updateCouplePlaques(
        config.groomNameAr,
        config.brideNameAr,
        config.groomNameEn,
        config.brideNameEn,
        config.eventDate,
      );
    }
  }

  public setTouchMove(x: number, y: number): void {
    this.touchMove.x = x;
    this.touchMove.y = y;
    if (Math.abs(x) > 0.05 || Math.abs(y) > 0.05) {
      this.transition.active = false;
      if (this.cinematicTour.active) {
        this.stopCinematicTour();
      }
    }
  }

  /**
   * Calibrated Photorealistic Lighting Presets:
   * Balanced exposure, subtle bloom, warm fairy-light/candle glow, and sculpted shadows
   * ensure rich 5-star architectural clarity across all 5 lighting modes.
   */
  public setLightingMode(mode: LightingMode): void {
    this.lightingMode = mode;

    const presets: Record<
      LightingMode,
      {
        skyTop: number;
        skyHorizon: number;
        skyBottom: number;
        fogColor: number;
        fogDensity: number;
        sunColor: number;
        sunInt: number;
        sunPos: [number, number, number];
        hemiSky: number;
        hemiGround: number;
        hemiInt: number;
        fillInt: number;
        envInt: number;
        extLamps: number;
        chandeliers: number;
        spots: number;
        prep: number;
        emissiveInt: number;
        fairyInt: number;
        bloomStrength: number;
        exposure: number;
      }
    > = {
      daylight: {
        skyTop: 0x245a99,
        skyHorizon: 0xb7cde0,
        skyBottom: 0xa89278,
        fogColor: 0xb9cad8,
        fogDensity: 0.0011,
        sunColor: 0xfff1d6,
        sunInt: 1.55,
        sunPos: [55, 68, 52],
        hemiSky: 0xc2d8ee,
        hemiGround: 0x5c4c3c,
        hemiInt: 0.48,
        fillInt: 0.28,
        envInt: 0.4,
        extLamps: 2,
        chandeliers: 12,
        spots: 16,
        prep: 12,
        emissiveInt: 0.78,
        fairyInt: 0.85,
        bloomStrength: 0.12,
        exposure: 0.84,
      },
      sunset: {
        skyTop: 0x162442,
        skyHorizon: 0xbd8156,
        skyBottom: 0x694d3a,
        fogColor: 0x8f664b,
        fogDensity: 0.0014,
        sunColor: 0xffb366,
        sunInt: 1.48,
        sunPos: [-65, 22, 58],
        hemiSky: 0xe6ad7c,
        hemiGround: 0x3b2c22,
        hemiInt: 0.36,
        fillInt: 0.25,
        envInt: 0.36,
        extLamps: 15,
        chandeliers: 16,
        spots: 26,
        prep: 14,
        emissiveInt: 1.18,
        fairyInt: 1.55,
        bloomStrength: 0.18,
        exposure: 0.87,
      },
      night: {
        skyTop: 0x050914,
        skyHorizon: 0x121b30,
        skyBottom: 0x0b0e16,
        fogColor: 0x0e1422,
        fogDensity: 0.0019,
        sunColor: 0x6f8fc2,
        sunInt: 0.34,
        sunPos: [-35, 55, 40],
        hemiSky: 0x1e2c4a,
        hemiGround: 0x1a1410,
        hemiInt: 0.22,
        fillInt: 0.14,
        envInt: 0.25,
        extLamps: 26,
        chandeliers: 22,
        spots: 38,
        prep: 15,
        emissiveInt: 1.68,
        fairyInt: 2.2,
        bloomStrength: 0.24,
        exposure: 0.94,
      },
      wedding: {
        skyTop: 0x0a0810,
        skyHorizon: 0x22191c,
        skyBottom: 0x120e0c,
        fogColor: 0x171210,
        fogDensity: 0.0018,
        sunColor: 0xc99252,
        sunInt: 0.28,
        sunPos: [-30, 40, 45],
        hemiSky: 0x382a1f,
        hemiGround: 0x1a130d,
        hemiInt: 0.23,
        fillInt: 0.15,
        envInt: 0.28,
        extLamps: 22,
        chandeliers: 24,
        spots: 56,
        prep: 12,
        emissiveInt: 1.9,
        fairyInt: 2.45,
        bloomStrength: 0.27,
        exposure: 0.92,
      },
      preparation: {
        skyTop: 0x3c6da3,
        skyHorizon: 0xc9d7e3,
        skyBottom: 0xab9b88,
        fogColor: 0xc8d2da,
        fogDensity: 0.001,
        sunColor: 0xfffaf2,
        sunInt: 1.32,
        sunPos: [30, 78, 40],
        hemiSky: 0xdbe6f0,
        hemiGround: 0x6b5f52,
        hemiInt: 0.56,
        fillInt: 0.32,
        envInt: 0.42,
        extLamps: 5,
        chandeliers: 19,
        spots: 20,
        prep: 25,
        emissiveInt: 1.12,
        fairyInt: 1.15,
        bloomStrength: 0.13,
        exposure: 0.85,
      },
    };

    const p = presets[mode];
    this.skyMat.uniforms.topColor.value.setHex(p.skyTop);
    this.skyMat.uniforms.horizonColor.value.setHex(p.skyHorizon);
    this.skyMat.uniforms.bottomColor.value.setHex(p.skyBottom);
    if (this.scene.fog instanceof THREE.FogExp2) {
      this.scene.fog.color.setHex(p.fogColor);
      this.scene.fog.density = p.fogDensity;
    }

    this.scene.environmentIntensity = p.envInt;
    this.sunLight.color.setHex(p.sunColor);
    this.sunLight.intensity = p.sunInt;
    this.sunLight.position.set(...p.sunPos);

    this.hemiLight.color.setHex(p.hemiSky);
    this.hemiLight.groundColor.setHex(p.hemiGround);
    this.hemiLight.intensity = p.hemiInt;
    this.fillLight.intensity = p.fillInt;

    for (const l of this.dynamicLights.exteriorLamps) l.intensity = p.extLamps;
    for (const l of this.dynamicLights.interiorChandeliers) {
      l.intensity = p.chandeliers;
      l.color.setHex(mode === 'preparation' ? 0xfff5e4 : mode === 'wedding' ? 0xffcb80 : 0xffdda8);
    }
    for (const s of this.dynamicLights.stageSpots) s.intensity = p.spots;
    for (const pr of this.dynamicLights.prepLights) {
      pr.intensity = p.prep;
      pr.color.setHex(mode === 'preparation' ? 0xf7f9fc : 0xffe8c6);
    }

    this.materials.warmEmissive.emissiveIntensity = p.emissiveInt;
    this.materials.fairyLightGlow.emissiveIntensity = p.fairyInt;
    this.materials.candleFlame.emissiveIntensity = mode === 'wedding' || mode === 'night' ? 2.8 : 2.1;
    this.materials.crystal.emissiveIntensity = mode === 'wedding' || mode === 'night' ? 0.78 : 0.36;
    this.materials.runwayGlass.emissiveIntensity = mode === 'wedding' ? 0.72 : 0.32;
    this.materials.sparklePoints.opacity = mode === 'wedding' ? 0.85 : mode === 'night' ? 0.68 : 0.42;

    if (this.bloomPass) {
      const qualityScale = this.qualityPreset === 'ultra' ? 1.15 : 0.9;
      this.bloomPass.strength = p.bloomStrength * qualityScale;
    }
    this.renderer.toneMappingExposure = p.exposure;
  }

  private startSmoothTransition(pos: THREE.Vector3, lookAt: THREE.Vector3): void {
    this.transition.active = true;
    this.transition.targetPos.copy(pos);
    this.transition.targetLook.copy(lookAt);

    const dummy = new THREE.PerspectiveCamera();
    dummy.position.copy(pos);
    dummy.lookAt(lookAt);
    _euler.setFromQuaternion(dummy.quaternion, 'YXZ');
    this.transition.targetYaw = _euler.y;
    this.transition.targetPitch = THREE.MathUtils.clamp(_euler.x, -1.25, 1.25);
  }

  private getGroundHeightAt(x: number, z: number): number {
    if (x >= -44.5 && x <= 44.5 && z >= -44.5 && z <= 26.8) {
      return FLOOR_Y;
    }
    return 0.06;
  }

  private collidesAt(x: number, z: number, radius = 0.52): boolean {
    if (x < -56.5 || x > 56.5 || z < -43.2 || z > 82.5) return true;

    for (let i = 0; i < this.colliders.length; i++) {
      const c = this.colliders[i];
      if (c.isDoor && c.doorId) {
        const door = this.doors.find((d) => d.id === c.doorId);
        if (door && door.openProgress > 0.65) continue;
      }
      if (
        x + radius > c.minX &&
        x - radius < c.maxX &&
        z + radius > c.minZ &&
        z - radius < c.maxZ
      ) {
        return true;
      }
    }
    return false;
  }

  private detectCurrentZone(x: number, z: number): ZoneId {
    if (z > 52) return 'parking';
    if (z > 26.5) {
      if (x < -14 && z < 38) return 'mens-entrance';
      if (x > 14 && z < 38) return 'womens-entrance';
      return 'exterior';
    }
    if (z >= 14) {
      return x < 0 ? 'mens-entrance' : 'womens-entrance';
    }
    if (z >= -18) {
      if (x < -34) return 'mens-restrooms';
      if (x < 0) return 'mens-hall';
      if (x > 34) return z > 2 ? 'womens-restrooms' : 'bridal-suite';
      return 'womens-hall';
    }
    if (x < -8) return 'mens-dining';
    if (x > 8) return 'womens-dining';
    return 'kitchen';
  }

  private updateDoors(dt: number): void {
    const tourActive = this.cinematicTour.active;
    for (const door of this.doors) {
      const dist = this.camera.position.distanceTo(door.center);
      const shouldAutoOpen =
        (this.cameraMode === 'walk' && dist < 4.8) || (tourActive && dist < 8.5);
      const targetOpen = !tourActive && door.manualOverride ? door.isOpen : shouldAutoOpen;
      if (tourActive || !door.manualOverride) {
        door.isOpen = shouldAutoOpen;
      }

      const targetVal = targetOpen ? 1 : 0;
      const dampRate = tourActive ? 8.0 : 5.5;
      door.openProgress = THREE.MathUtils.damp(door.openProgress, targetVal, dampRate, dt);

      const offset = door.openProgress * door.slideDistance;
      if (door.axis === 'x') {
        door.leftLeaf.position.x = door.leftClosedPos - offset;
        door.rightLeaf.position.x = door.rightClosedPos + offset;
      } else {
        door.leftLeaf.position.z = door.leftClosedPos - offset;
        door.rightLeaf.position.z = door.rightClosedPos + offset;
      }
    }
  }

  private updateMovement(dt: number): void {
    if (this.cinematicTour.active) {
      const statusChanged = this.cinematicTour.update(dt, this.camera);
      _euler.setFromQuaternion(this.camera.quaternion, 'YXZ');
      this.yaw = _euler.y;
      this.pitch = THREE.MathUtils.clamp(_euler.x, -1.35, 1.35);
      if (statusChanged) {
        this.emitTourState();
      }
      return;
    }

    if (this.transition.active) {
      this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, this.transition.targetPos.x, 4.8, dt);
      this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, this.transition.targetPos.y, 4.8, dt);
      this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, this.transition.targetPos.z, 4.8, dt);

      if (this.cameraMode === 'floorplan') {
        this.orbitControls.target.lerp(this.transition.targetLook, 1 - Math.exp(-5 * dt));
        this.orbitControls.update();
      } else {
        let deltaYaw = this.transition.targetYaw - this.yaw;
        while (deltaYaw > Math.PI) deltaYaw -= Math.PI * 2;
        while (deltaYaw < -Math.PI) deltaYaw += Math.PI * 2;
        this.yaw += deltaYaw * (1 - Math.exp(-5.5 * dt));
        this.pitch = THREE.MathUtils.damp(this.pitch, this.transition.targetPitch, 5.5, dt);

        _euler.set(this.pitch, this.yaw, 0, 'YXZ');
        this.camera.quaternion.setFromEuler(_euler);
      }

      if (this.camera.position.distanceTo(this.transition.targetPos) < 0.08) {
        this.transition.active = false;
      }
      return;
    }

    if (this.cameraMode === 'floorplan') {
      this.orbitControls.update();
      return;
    }

    _euler.set(this.pitch, this.yaw, 0, 'YXZ');
    this.camera.quaternion.setFromEuler(_euler);

    const forwardInput =
      (this.keys.has('KeyW') || this.keys.has('ArrowUp') ? 1 : 0) -
      (this.keys.has('KeyS') || this.keys.has('ArrowDown') ? 1 : 0) +
      this.touchMove.y;
    const strafeInput =
      (this.keys.has('KeyD') || this.keys.has('ArrowRight') ? 1 : 0) -
      (this.keys.has('KeyA') || this.keys.has('ArrowLeft') ? 1 : 0) +
      this.touchMove.x;

    const boost = this.keys.has('ShiftLeft') || this.keys.has('ShiftRight') ? 1.85 : 1.0;

    if (this.cameraMode === 'walk') {
      const speed = 5.6 * boost;
      _fwd.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw)).normalize();
      _right.crossVectors(_fwd, _up).normalize();
      _move.set(0, 0, 0);
      _move.addScaledVector(_fwd, forwardInput);
      _move.addScaledVector(_right, strafeInput);
      if (_move.lengthSq() > 1) _move.normalize();

      const dx = _move.x * speed * dt;
      const dz = _move.z * speed * dt;

      const nextX = this.camera.position.x + dx;
      if (!this.collidesAt(nextX, this.camera.position.z)) {
        this.camera.position.x = nextX;
      }
      const nextZ = this.camera.position.z + dz;
      if (!this.collidesAt(this.camera.position.x, nextZ)) {
        this.camera.position.z = nextZ;
      }

      const targetEyeY = this.getGroundHeightAt(this.camera.position.x, this.camera.position.z) + 1.68;
      this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, targetEyeY, 10, dt);
    } else if (this.cameraMode === 'drone') {
      const speed = 13.5 * boost;
      const vertInput =
        (this.keys.has('KeyE') || this.keys.has('Space') ? 1 : 0) - (this.keys.has('KeyQ') ? 1 : 0);

      this.camera.getWorldDirection(_fwd);
      _right.crossVectors(_fwd, _up).normalize();
      _move.set(0, 0, 0);
      _move.addScaledVector(_fwd, forwardInput);
      _move.addScaledVector(_right, strafeInput);
      _move.y += vertInput;
      if (_move.lengthSq() > 1) _move.normalize();

      this.camera.position.addScaledVector(_move, speed * dt);
      this.camera.position.x = THREE.MathUtils.clamp(this.camera.position.x, -85, 85);
      this.camera.position.y = THREE.MathUtils.clamp(this.camera.position.y, 1.4, 72);
      this.camera.position.z = THREE.MathUtils.clamp(this.camera.position.z, -65, 105);
    }
  }

  private updateAnimations(elapsed: number): void {
    // 1. Central Reflecting Fountain jets & expanding shimmering water ripples
    for (let i = 0; i < this.animatedObjects.fountainJets.length; i++) {
      const jet = this.animatedObjects.fountainJets[i];
      const pulse = 0.88 + 0.16 * Math.sin(elapsed * 4.2 + i * 0.7);
      jet.scale.set(1, pulse, 1);
    }
    for (let r = 0; r < this.animatedObjects.fountainRings.length; r++) {
      const ring = this.animatedObjects.fountainRings[r];
      const cycle = ((elapsed * 0.35 + r * 0.33) % 1);
      const s = 0.78 + cycle * 0.45;
      ring.scale.set(s, s, 1);
    }
    if (this.animatedObjects.waterSurface) {
      this.animatedObjects.waterSurface.position.y = 0.56 + Math.sin(elapsed * 2.2) * 0.015;
    }

    // 2. Subtle luxury chandelier shimmer
    for (let i = 0; i < this.animatedObjects.crystalGroups.length; i++) {
      const amp = this.lightingMode === 'wedding' ? 0.045 : 0.014;
      this.animatedObjects.crystalGroups[i].rotation.y = Math.sin(elapsed * 0.25 + i) * amp;
    }

    // 3. Romantic warm floating bokeh sparkles in Men's & Women's Ballrooms
    for (let i = 0; i < this.animatedObjects.sparkleSystems.length; i++) {
      const sp = this.animatedObjects.sparkleSystems[i];
      if (!sp.visible) continue;
      sp.position.y = Math.sin(elapsed * 0.45 + i) * 0.28;
      sp.rotation.y = Math.sin(elapsed * 0.12 + i) * 0.03;
    }

    // 4. Slow sweeping ceremonial stage spotlights
    const spotSpeed = this.lightingMode === 'wedding' ? 0.55 : 0.28;
    for (const ms of this.animatedObjects.movingSpots) {
      ms.light.target.position.x = ms.baseX + Math.sin(elapsed * spotSpeed + ms.phase) * ms.amp;
      ms.light.target.position.z = ms.baseZ + Math.cos(elapsed * spotSpeed * 0.7 + ms.phase) * (ms.amp * 0.45);
      ms.light.target.updateMatrixWorld();
    }

    // 5. Subtle organic warm flicker on banquet & candelabra taper flames
    for (let i = 0; i < this.animatedObjects.candleFlames.length; i++) {
      const fl = this.animatedObjects.candleFlames[i];
      const f = 0.9 + 0.14 * Math.sin(elapsed * 7.5 + i * 1.9) + 0.06 * Math.cos(elapsed * 13.1 + i);
      fl.scale.set(0.95 + (f - 1) * 0.2, f, 0.95 + (f - 1) * 0.2);
    }

    this.screenManager.update(elapsed);
  }

  private afterDraw(cb: () => void): void {
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      if (this.disposed) {
        if (sync) gl.deleteSync(sync);
        return;
      }
      const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
      if (state === gl.UNSIGNALED) {
        this.frameId = window.setTimeout(poll, 5);
      } else {
        if (sync) gl.deleteSync(sync);
        this.frameId = window.setTimeout(cb, 80);
      }
    };
    this.frameId = window.setTimeout(poll, 5);
  }

  private startLoop(): void {
    const tick = () => {
      if (this.disposed) return;
      const dt = Math.min(this.clock.getDelta(), 0.05);
      const elapsed = this.clock.elapsedTime;

      this.updateMovement(dt);
      this.updateDoors(dt);
      this.updateAnimations(elapsed);

      if (
        this.cinematicTour.active &&
        !this.cinematicTour.paused &&
        !this.cinematicTour.completed &&
        elapsed - this.lastTourEmit > 0.12
      ) {
        this.lastTourEmit = elapsed;
        this.emitTourState();
      }

      if (elapsed - this.lastZoneCheck > 0.35) {
        this.lastZoneCheck = elapsed;
        const detected = this.detectCurrentZone(this.camera.position.x, this.camera.position.z);
        if (detected !== this.currentZoneId && !this.transition.active) {
          this.currentZoneId = detected;
          this.callbacks.onZoneDetected(detected);
        }
      }
      if (this.callbacks.onCameraTelemetry && elapsed - this.lastTelemetryTime > 0.16) {
        this.lastTelemetryTime = elapsed;
        this.callbacks.onCameraTelemetry(this.camera.position.x, this.camera.position.z, this.yaw);
      }

      // Sync 3D CSS3D YouTube hall screens with exact camera matrix & physical room occlusion
      this.camera.updateMatrixWorld();
      const physicalZone = this.detectCurrentZone(this.camera.position.x, this.camera.position.z);
      this.screenManager.syncCSS3D(this.camera, physicalZone, this.cameraMode, this.modalOpen);

      if (this.composer && !this.isSoftwareGl && this.qualityPreset !== 'performance') {
        this.composer.render();
      } else {
        this.renderer.render(this.scene, this.camera);
      }
      this.cssRenderer.render(this.cssScene, this.camera);

      if (this.isSoftwareGl) {
        this.afterDraw(tick);
      } else {
        this.frameId = requestAnimationFrame(tick);
      }
    };

    if (this.isSoftwareGl) {
      this.frameId = window.setTimeout(tick, 16);
    } else {
      this.frameId = requestAnimationFrame(tick);
    }
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    if (this.cinematicTour.active) {
      if (e.code === 'Escape') {
        this.stopCinematicTour();
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        this.toggleCinematicTourPause();
        return;
      }
    }

    this.keys.add(e.code);
    if (
      [
        'KeyW',
        'KeyA',
        'KeyS',
        'KeyD',
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'KeyQ',
        'KeyE',
      ].includes(e.code)
    ) {
      this.transition.active = false;
      if (this.cinematicTour.active) {
        this.stopCinematicTour();
      }
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.code);
  };

  private handlePointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    this.isPointerDown = true;
    this.hasDragged = false;
    this.pointerDownPos = { x: e.clientX, y: e.clientY };
    this.lastPointerPos = { x: e.clientX, y: e.clientY };
  };

  private handlePointerMove = (e: PointerEvent) => {
    if (!this.isPointerDown) return;
    const dx = e.clientX - this.lastPointerPos.x;
    const dy = e.clientY - this.lastPointerPos.y;
    this.lastPointerPos = { x: e.clientX, y: e.clientY };

    if (Math.hypot(e.clientX - this.pointerDownPos.x, e.clientY - this.pointerDownPos.y) > 5) {
      this.hasDragged = true;
      this.transition.active = false;
    }

    if (this.cinematicTour.active) {
      return;
    }

    if (this.cameraMode !== 'floorplan') {
      const sensitivity = 0.0032;
      this.yaw -= dx * sensitivity;
      this.pitch = THREE.MathUtils.clamp(this.pitch - dy * sensitivity, -1.2, 1.2);
    }
  };

  private handlePointerUp = (e: PointerEvent) => {
    if (!this.isPointerDown) return;
    this.isPointerDown = false;
    if (!this.hasDragged) {
      this.handleSceneClick(e.clientX, e.clientY);
    }
  };

  private handleSceneClick(clientX: number, clientY: number): void {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouseNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.mouseNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouseNdc, this.camera);
    const hits = this.raycaster.intersectObjects(this.interactables, true);
    if (hits.length === 0) return;

    const hitObj = hits[0].object;
    if (hitObj.userData.interactiveType === 'screen' && hitObj.userData.screenId) {
      this.callbacks.onScreenClick(hitObj.userData.screenId as string);
      return;
    }

    if (hitObj.userData.interactiveType === 'door' && hitObj.userData.doorId) {
      const door = this.doors.find((d) => d.id === hitObj.userData.doorId);
      if (door) {
        door.manualOverride = true;
        door.isOpen = !door.isOpen;
        this.callbacks.onDoorToggle(door.nameEn, door.nameAr, door.isOpen);
      }
    }
  }

  private handleResize = () => {
    if (this.disposed) return;
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.composer?.setSize(w, h);
    this.bloomPass?.resolution.set(w, h);
    this.cssRenderer.setSize(w, h);
  };

  private handleContextLost = (e: Event) => {
    e.preventDefault();
  };

  private bindEvents(): void {
    const dom = this.renderer.domElement;
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('resize', this.handleResize);
    dom.addEventListener('pointerdown', this.handlePointerDown);
    window.addEventListener('pointermove', this.handlePointerMove);
    window.addEventListener('pointerup', this.handlePointerUp);
    dom.addEventListener('webglcontextlost', this.handleContextLost);
  }

  public dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.frameId);
    clearTimeout(this.frameId);

    const dom = this.renderer.domElement;
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('resize', this.handleResize);
    dom.removeEventListener('pointerdown', this.handlePointerDown);
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerup', this.handlePointerUp);
    dom.removeEventListener('webglcontextlost', this.handleContextLost);

    this.orbitControls.dispose();
    this.screenManager.dispose();
    for (const plaque of this.couplePlaques) {
      plaque.dispose();
    }
    this.composer?.dispose();
    this.materials.dispose();
    this.textures.dispose();
    this.skyMat.dispose();

    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
        obj.geometry?.dispose();
      }
    });

    this.renderer.dispose();
    if (dom.parentElement === this.container) {
      this.container.removeChild(dom);
    }
    if (this.cssRenderer.domElement.parentElement === this.container) {
      this.container.removeChild(this.cssRenderer.domElement);
    }
  }
}

export { _lookTarget };
