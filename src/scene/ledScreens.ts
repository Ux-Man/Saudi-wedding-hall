import * as THREE from 'three';
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { CameraMode, ScreenConfig, ZoneId } from '../types/venue';

interface ScreenInstanceMeta {
  mesh: THREE.Mesh;
  width: number;
  height: number;
  cssObject?: CSS3DObject;
  iframeEl?: HTMLIFrameElement;
  activeYoutubeId?: string;
}

interface ManagedScreenEntry {
  config: ScreenConfig;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  canvasTexture: THREE.CanvasTexture;
  material: THREE.MeshStandardMaterial;
  instances: ScreenInstanceMeta[];
  videoElement?: HTMLVideoElement;
  videoTexture?: THREE.VideoTexture;
  cameraPos: [number, number, number];
  lookAt: [number, number, number];
}

const _worldPos = new THREE.Vector3();
const _worldQuat = new THREE.Quaternion();
const _screenNormal = new THREE.Vector3();
const _toCam = new THREE.Vector3();

export class LEDScreenManager {
  private entries = new Map<string, ManagedScreenEntry>();
  private cssScene: THREE.Scene;
  private lastAnimTick = 0;

  constructor(initialConfigs: ScreenConfig[], cssScene: THREE.Scene) {
    this.cssScene = cssScene;

    for (const cfg of initialConfigs) {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      const canvasTexture = new THREE.CanvasTexture(canvas);
      canvasTexture.colorSpace = THREE.SRGBColorSpace;
      canvasTexture.anisotropy = 4;

      const material = new THREE.MeshStandardMaterial({
        map: canvasTexture,
        emissive: new THREE.Color(0xffffff),
        emissiveMap: canvasTexture,
        emissiveIntensity: 0.78,
        roughness: 0.25,
        metalness: 0.12,
      });

      const entry: ManagedScreenEntry = {
        config: { ...cfg },
        canvas,
        ctx,
        canvasTexture,
        material,
        instances: [],
        cameraPos: [0, 3, 10],
        lookAt: [0, 3, 0],
      };

      this.entries.set(cfg.id, entry);
      this.renderCanvasGraphics(entry, 0);
    }
  }

  public registerMesh(
    screenId: string,
    mesh: THREE.Mesh,
    cameraPos: [number, number, number],
    lookAt: [number, number, number],
  ): void {
    const entry = this.entries.get(screenId);
    if (!entry) return;
    mesh.material = entry.material;
    mesh.userData.interactiveType = 'screen';
    mesh.userData.screenId = screenId;

    // Derive physical dimensions from PlaneGeometry parameters
    const params = (mesh.geometry as THREE.PlaneGeometry).parameters;
    const width = params?.width ?? 6;
    const height = params?.height ?? 3;

    const inst: ScreenInstanceMeta = { mesh, width, height };
    entry.instances.push(inst);
    entry.cameraPos = cameraPos;
    entry.lookAt = lookAt;

    // If this screen defaults to YouTube, attach its live 3D YouTube player immediately
    if (entry.config.contentType === 'youtube' && entry.config.youtubeId) {
      this.syncInstanceYouTube(entry, inst);
    }
  }

  private syncInstanceYouTube(entry: ManagedScreenEntry, inst: ScreenInstanceMeta): void {
    const ytId = entry.config.contentType === 'youtube' ? entry.config.youtubeId : undefined;

    if (!ytId) {
      if (inst.cssObject) {
        this.cssScene.remove(inst.cssObject);
        inst.cssObject = undefined;
        inst.iframeEl = undefined;
        inst.activeYoutubeId = undefined;
      }
      return;
    }

    if (inst.activeYoutubeId === ytId && inst.cssObject) {
      return;
    }

    if (inst.cssObject) {
      this.cssScene.remove(inst.cssObject);
    }

    const pxW = 960;
    const pxH = Math.max(360, Math.round((pxW * inst.height) / inst.width));

    const wrapper = document.createElement('div');
    wrapper.style.width = `${pxW}px`;
    wrapper.style.height = `${pxH}px`;
    wrapper.style.background = '#090807';
    wrapper.style.border = '3px solid rgba(199, 165, 114, 0.75)';
    wrapper.style.boxSizing = 'border-box';
    wrapper.style.overflow = 'hidden';
    wrapper.style.pointerEvents = 'auto';

    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.src = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=1&modestbranding=1&rel=0&playsinline=1`;
    wrapper.appendChild(iframe);

    const cssObj = new CSS3DObject(wrapper);
    const scale = inst.width / pxW;
    cssObj.scale.set(scale, scale, scale);
    cssObj.visible = false;

    this.cssScene.add(cssObj);
    inst.cssObject = cssObj;
    inst.iframeEl = iframe;
    inst.activeYoutubeId = ytId;
  }

  /**
   * Synchronizes 3D CSS3D YouTube panels with their physical WebGL LED wall transforms and
   * enforces strict room-zone & facing-direction occlusion so videos never bleed through walls.
   */
  public syncCSS3D(
    camera: THREE.Camera,
    currentZoneId: ZoneId,
    cameraMode: CameraMode,
    modalOpen: boolean,
  ): void {
    for (const entry of this.entries.values()) {
      const wantsYouTube =
        !modalOpen &&
        cameraMode !== 'floorplan' &&
        entry.config.contentType === 'youtube' &&
        entry.config.isPlaying &&
        Boolean(entry.config.youtubeId);

      for (const inst of entry.instances) {
        if (!inst.cssObject) continue;

        if (!wantsYouTube) {
          inst.cssObject.visible = false;
          continue;
        }

        // Sync world transform from the 3D LED mesh
        inst.mesh.updateWorldMatrix(true, false);
        inst.mesh.getWorldPosition(_worldPos);
        inst.mesh.getWorldQuaternion(_worldQuat);

        // Nudge slightly forward along local +Z normal so it sits cleanly in front of the bezel
        _screenNormal.set(0, 0, 1).applyQuaternion(_worldQuat).normalize();
        inst.cssObject.position.copy(_worldPos).addScaledVector(_screenNormal, 0.03);
        inst.cssObject.quaternion.copy(_worldQuat);

        // Room/zone occlusion + front-facing + distance check
        _toCam.subVectors(camera.position, _worldPos);
        const dist = _toCam.length();
        const isFrontFacing = _toCam.dot(_screenNormal) > 0.2;
        const inMatchingZone =
          currentZoneId === entry.config.zoneId ||
          (entry.config.zoneId === 'exterior' && (currentZoneId === 'exterior' || currentZoneId === 'parking'));

        inst.cssObject.visible = inMatchingZone && isFrontFacing && dist < 34;
      }
    }
  }

  public getFocusTarget(screenId: string): {
    cameraPos: [number, number, number];
    lookAt: [number, number, number];
  } | null {
    const entry = this.entries.get(screenId);
    if (!entry) return null;
    return { cameraPos: entry.cameraPos, lookAt: entry.lookAt };
  }

  public updateScreenConfig(updated: ScreenConfig): void {
    const entry = this.entries.get(updated.id);
    if (!entry) return;

    const prevMp4 = entry.config.mp4Url;
    entry.config = { ...updated };

    // Sync YouTube CSS3D objects for every registered physical LED wall of this screen ID
    for (const inst of entry.instances) {
      this.syncInstanceYouTube(entry, inst);
    }

    if (updated.contentType === 'mp4' && updated.mp4Url) {
      if (prevMp4 !== updated.mp4Url || !entry.videoElement) {
        this.cleanupVideo(entry);
        const video = document.createElement('video');
        video.src = updated.mp4Url;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.crossOrigin = 'anonymous';
        video.play().catch(() => {});

        const vTex = new THREE.VideoTexture(video);
        vTex.colorSpace = THREE.SRGBColorSpace;
        entry.videoElement = video;
        entry.videoTexture = vTex;
      }

      if (entry.videoElement) {
        if (updated.isPlaying) {
          entry.videoElement.play().catch(() => {});
        } else {
          entry.videoElement.pause();
        }
      }

      if (entry.videoTexture) {
        entry.material.map = entry.videoTexture;
        entry.material.emissiveMap = entry.videoTexture;
        entry.material.needsUpdate = true;
      }
    } else {
      if (entry.videoElement) {
        entry.videoElement.pause();
      }
      entry.material.map = entry.canvasTexture;
      entry.material.emissiveMap = entry.canvasTexture;
      entry.material.needsUpdate = true;
      this.renderCanvasGraphics(entry, performance.now() * 0.001);
    }
  }

  public update(elapsedTime: number): void {
    if (elapsedTime - this.lastAnimTick < 0.09) return;
    this.lastAnimTick = elapsedTime;

    for (const entry of this.entries.values()) {
      if (entry.config.contentType !== 'mp4' && entry.config.isPlaying) {
        this.renderCanvasGraphics(entry, elapsedTime);
      }
    }
  }

  private renderCanvasGraphics(entry: ManagedScreenEntry, t: number): void {
    const { ctx, canvas, config } = entry;
    const w = canvas.width;
    const h = canvas.height;

    const bg = ctx.createRadialGradient(w / 2, h / 2, 35, w / 2, h / 2, w * 0.65);
    bg.addColorStop(0, '#2C2119');
    bg.addColorStop(0.55, '#19130E');
    bg.addColorStop(1, '#0C0907');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    const shimmer = 0.5 + 0.5 * Math.sin(t * 1.4);
    ctx.strokeStyle = `rgba(199, 165, 114, ${0.58 + shimmer * 0.25})`;
    ctx.lineWidth = 4;
    ctx.strokeRect(24, 24, w - 48, h - 48);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(36, 36, w - 72, h - 72);

    const corners = [
      [36, 36],
      [w - 36, 36],
      [36, h - 36],
      [w - 36, h - 36],
    ];
    ctx.fillStyle = '#C7A572';
    for (const [cx, cy] of corners) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-7, -7, 14, 14);
      ctx.restore();
    }

    for (let i = 0; i < 22; i++) {
      const px = ((i * 97 + t * (12 + (i % 5) * 4)) % (w - 100)) + 50;
      const py = ((i * 53 + Math.sin(t * 0.8 + i) * 28 + h) % (h - 100)) + 50;
      const r = 2 + (i % 4) * 1.5;
      const alpha = 0.14 + 0.18 * (0.5 + 0.5 * Math.sin(t * 2 + i));
      ctx.fillStyle = `rgba(229, 207, 168, ${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (config.contentType === 'monogram') {
      ctx.strokeStyle = '#C7A572';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2 - 18, 125, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(238, 231, 218, 0.42)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2 - 18, 138, 0, Math.PI * 2);
      ctx.stroke();

      const initials = `${config.groomNameEn.charAt(0) || 'F'} & ${config.brideNameEn.charAt(0) || 'N'}`;
      ctx.fillStyle = '#EEE7DA';
      ctx.font = '700 84px "Cormorant Garamond", Georgia, serif';
      ctx.fillText(initials, w / 2, h / 2 - 22);

      ctx.fillStyle = '#C7A572';
      ctx.font = '600 26px Amiri, Cairo, serif';
      ctx.fillText(`${config.groomNameAr}  ✦  ${config.brideNameAr}`, w / 2, h - 98);

      ctx.fillStyle = 'rgba(238,231,218,0.75)';
      ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(config.eventDate, w / 2, h - 58);
    } else if (config.contentType === 'promo') {
      ctx.fillStyle = '#C7A572';
      ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('QASR AL-MALAKIYA · RIYADH', w / 2, 118);

      ctx.fillStyle = '#EEE7DA';
      ctx.font = '700 66px Amiri, Cairo, serif';
      ctx.fillText(config.headlineAr || 'قصر الملكية للاحتفالات', w / 2, 224);

      ctx.strokeStyle = '#C7A572';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 210; x <= w - 210; x += 12) {
        const y = 300 + Math.sin(x * 0.025 + t * 2.2) * 7;
        if (x === 210) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.fillStyle = '#E5CFA8';
      ctx.font = '600 32px "Cormorant Garamond", Georgia, serif';
      ctx.fillText(config.headlineEn, w / 2, 358);

      ctx.fillStyle = 'rgba(238,231,218,0.78)';
      ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(config.sublineEn, w / 2, 412);
    } else if (config.contentType === 'youtube') {
      ctx.fillStyle = '#C7A572';
      ctx.font = '600 24px Cairo, "Plus Jakarta Sans", sans-serif';
      ctx.fillText('عرض فيديو مباشر على شاشة القاعة · LIVE HALL YOUTUBE DISPLAY', w / 2, 108);

      ctx.fillStyle = 'rgba(199, 165, 114, 0.22)';
      ctx.beginPath();
      ctx.arc(w / 2, 232, 62, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#C7A572';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#EEE7DA';
      ctx.beginPath();
      ctx.moveTo(w / 2 - 18, 206);
      ctx.lineTo(w / 2 + 28, 232);
      ctx.lineTo(w / 2 - 18, 258);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#EEE7DA';
      ctx.font = '700 34px Amiri, "Cormorant Garamond", serif';
      ctx.fillText(
        config.youtubeId ? `YouTube · ${config.youtubeId}` : 'Configure YouTube URL',
        w / 2,
        345,
      );

      ctx.fillStyle = '#C7A572';
      ctx.font = '500 22px Cairo, "Plus Jakarta Sans", sans-serif';
      ctx.fillText('ادخل القاعة للمشاهدة المباشرة أو انقر لإدارة الشاشة', w / 2, 405);
    } else {
      ctx.fillStyle = '#C7A572';
      ctx.font = '600 24px Amiri, Cairo, serif';
      ctx.fillText(config.headlineAr, w / 2, 118);

      ctx.fillStyle = '#EEE7DA';
      ctx.font = '700 68px Amiri, Cairo, serif';
      ctx.fillText(`${config.groomNameAr}  ✦  ${config.brideNameAr}`, w / 2, 215);

      ctx.fillStyle = '#C7A572';
      ctx.fillRect(w * 0.28, 275, w * 0.44, 2);

      ctx.fillStyle = '#E5CFA8';
      ctx.font = '600 44px "Cormorant Garamond", Georgia, serif';
      ctx.fillText(`${config.groomNameEn}  &  ${config.brideNameEn}`, w / 2, 330);

      ctx.fillStyle = 'rgba(238,231,218,0.82)';
      ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`${config.sublineEn}   ·   ${config.eventDate}`, w / 2, 406);
    }

    entry.canvasTexture.needsUpdate = true;
  }

  private cleanupVideo(entry: ManagedScreenEntry): void {
    if (entry.videoElement) {
      entry.videoElement.pause();
      entry.videoElement.removeAttribute('src');
      entry.videoElement.load();
      entry.videoElement = undefined;
    }
    if (entry.videoTexture) {
      entry.videoTexture.dispose();
      entry.videoTexture = undefined;
    }
  }

  public dispose(): void {
    for (const entry of this.entries.values()) {
      this.cleanupVideo(entry);
      for (const inst of entry.instances) {
        if (inst.cssObject) {
          this.cssScene.remove(inst.cssObject);
        }
      }
      entry.canvasTexture.dispose();
      entry.material.dispose();
    }
    this.entries.clear();
  }
}
