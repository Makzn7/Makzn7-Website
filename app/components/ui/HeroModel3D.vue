<template>
  <div
    ref="containerRef"
    class="hero-model-wrapper"
    :class="{ 'is-dragging': dragging }"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <canvas ref="canvasRef" class="hero-model-canvas"></canvas>

    <!-- Loading indicator -->
    <Transition name="fade">
      <div v-if="loading && !loadError" class="hero-model-loading">
        <span class="loading-dot" />
        <span class="loading-dot" />
        <span class="loading-dot" />
      </div>
    </Transition>

    <!-- Error fallback -->
    <div v-if="loadError" class="hero-model-error">
      <span class="text-brand-text/30 text-xs uppercase tracking-wider"
        >3D</span
      >
    </div>

    <!-- Interaction hint -->
    <Transition name="fade">
      <div
        v-if="showHintBadge && !loading && !loadError"
        class="hero-model-hint"
        :class="{ 'is-hover-mode': interactionMode === 'hover' }"
        aria-hidden="true"
      >
        <svg
          class="hero-model-hint-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 12a9 9 0 0 1 15.5-6.3" />
          <path d="M21 4v5h-5" />
          <path d="M21 12a9 9 0 0 1-15.5 6.3" />
          <path d="M3 20v-5h5" />
        </svg>
        <span class="hero-model-hint-text">{{
          interactionMode === "hover"
            ? $t("hints.hoverToRotate")
            : $t("hints.dragToRotate")
        }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import gsap from "gsap";

const props = defineProps({
  /** Path served from /public */
  modelPath: { type: String, default: null },
  /** Max tilt angle in radians (default ≈ 25°) */
  maxTiltY: { type: Number, default: 0.44 },
  /** Max vertical tilt in radians (default ≈ 12°) */
  maxTiltX: { type: Number, default: 0.21 },
  /** Model scale — كبّر الرقم = عنصر أكبر */
  modelScale: { type: Number, default: 2.2 },
  modelImageType: { type: String, default: "string" },
  modelModeColor: { type: String, default: "#ffffff" },
  /** Interaction mode: 'drag' (click & drag) or 'hover' (mouse-driven rotation) */
  interactionMode: {
    type: String as () => "drag" | "hover",
    default: "drag",
  },
  /** Starting Y rotation in radians — tilt the model so users see it can rotate */
  initialRotationY: { type: Number, default: 0 },
  /** Starting X rotation in radians */
  initialRotationX: { type: Number, default: 0 },
  /** Show the small interaction hint badge */
  showHint: { type: Boolean, default: true },
  /** Play a one-time gentle sway after the model loads to signal interactivity */
  autoHintAnimation: { type: Boolean, default: true },
  /** Hover-mode rotation strength multiplier (radians at edge) */
  hoverRotationStrength: { type: Number, default: 0.9 },
});

/* ── refs ── */
const containerRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const loading = ref(false);
const loadError = ref(false);
const dragging = ref(false);
const hasInteracted = ref(false);

const showHintBadge = computed(() => props.showHint && !hasInteracted.value);

/* ── Three.js state ── */
let renderer: any = null;
let scene: any = null;
let camera: any = null;
let rotationGroup: any = null; // persistent drag rotation
let tiltGroup: any = null; // mouse-driven tilt
let modelRoot: any = null;
let renderRafId: number | null = null;
let mouseRafId: number | null = null;
let resizeRafId: number | null = null;
let pendingMouseEvent: MouseEvent | null = null;
let modelBaseMaxDim = 1;
let modelBaseCenter: any = null;
let modelBaseSize: any = null;
let resizeObserver: ResizeObserver | null = null;
let intersectionObserver: IntersectionObserver | null = null;
let isMounted = false;
let isVisible = false;
let initStarted = false;
let dragPointerId: number | null = null;
let dragStartX = 0;
let dragStartY = 0;
let dragStartRotationX = 0;
let dragStartRotationY = 0;
let autoHintTween: any = null;

const DRAG_ROTATE_SPEED = 0.01;
const DRAG_TILT_SPEED = 0.005;
const DRAG_TILT_LIMIT = Math.PI * 0.28;

function getRendererPixelRatio() {
  return window.devicePixelRatio || 1;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getFinalModelScale() {
  return props.modelScale / modelBaseMaxDim;
}

function fitCameraToModel(scale = getFinalModelScale()) {
  if (!camera || !modelBaseSize || !containerRef.value) return;

  const width = containerRef.value.clientWidth;
  const height = containerRef.value.clientHeight;
  if (!width || !height) return;

  const aspect = width / height;
  const verticalFov = (camera.fov * Math.PI) / 180;
  const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * aspect);
  const fitFov = Math.min(verticalFov, horizontalFov);
  const baseRadius =
    Math.sqrt(
      modelBaseSize.x * modelBaseSize.x +
        modelBaseSize.y * modelBaseSize.y +
        modelBaseSize.z * modelBaseSize.z
    ) * 0.5;

  const radius = baseRadius * scale;
  const distance = (radius * 1.12) / Math.sin(fitFov / 2);

  camera.position.set(0, 0, Math.max(distance, 2.2));
  camera.near = Math.max(camera.position.z / 120, 0.01);
  camera.far = Math.max(200, camera.position.z + radius * 6);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
}

function applyModelScale(scale = getFinalModelScale()) {
  if (!modelRoot || !modelBaseCenter) return;
  modelRoot.scale.setScalar(scale);
  modelRoot.position.copy(modelBaseCenter).multiplyScalar(-scale);
  fitCameraToModel(scale);
  requestRender();
}

/* ══════════════════════════════════════════════
   INIT
══════════════════════════════════════════════ */
async function init() {
  if (initStarted) return;
  initStarted = true;

  const canvas = canvasRef.value;
  const container = containerRef.value;
  if (!canvas || !container || !props.modelPath) {
    loading.value = false;
    return;
  }

  loading.value = true;

  /* Dynamically import Three.js (avoids SSR issues) */
  const THREE = await import("three");
  const { GLTFLoader } = await import(
    "three/examples/jsm/loaders/GLTFLoader.js"
  );

  /* Guard: component may have unmounted during async imports */
  if (!isMounted) return;

  const w = container.clientWidth;
  const h = container.clientHeight;

  /* ── Renderer ── */
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(w, h, false);
  renderer.setPixelRatio(getRendererPixelRatio());
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.toneMappingExposure = 1;

  /* ── Scene ── */
  scene = new THREE.Scene();

  /* ── Camera ── */
  camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 200);
  camera.position.z = 4;

  /* ── Lights ──
     Pure EXTERNAL directional lighting aimed at the model — the model's own
     material/colour is left exactly as authored (no env map, no material edits).
     Strong, BROAD white light: a pair from the RIGHT (high + low) and a pair
     from ABOVE (right + left) so the whole WIDTH of the element is lit evenly,
     plus a soft GREY fill from below. */
  const ambient = new THREE.AmbientLight("#ffffff", 0.9);
  scene.add(ambient);

  /* Angle the whole rig toward the TOP-RIGHT — strong white light coming from
     the right side and from above. */
  const rightUpper = new THREE.DirectionalLight("#ffffff", 6.5);
  rightUpper.position.set(9, 6, 5);
  scene.add(rightUpper);

  const rightLower = new THREE.DirectionalLight("#ffffff", 5.5);
  rightLower.position.set(9, 1, 5);
  scene.add(rightLower);

  /* TOP — biased to the right so the light reads as top-right. */
  const topRight = new THREE.DirectionalLight("#ffffff", 6.0);
  topRight.position.set(5, 10, 5);
  scene.add(topRight);

  const topLeft = new THREE.DirectionalLight("#ffffff", 4.0);
  topLeft.position.set(-1, 9, 5);
  scene.add(topLeft);

  /* BOTTOM fill — soft GREY from below, gentle so it only lifts the underside. */
  const bottomFill = new THREE.DirectionalLight("#9a9a9a", 0.6);
  bottomFill.position.set(0, -8, 3);
  scene.add(bottomFill);

  /* Dev helpers (disabled): visualise the light directions while tuning.
     scene.add(new THREE.DirectionalLightHelper(rightLight, 1));
     scene.add(new THREE.DirectionalLightHelper(topLight, 1)); */

  /* ── Rotation group — drag 360, tilt group — mouse hover ── */
  rotationGroup = new THREE.Group();
  tiltGroup = new THREE.Group();
  rotationGroup.add(tiltGroup);
  scene.add(rotationGroup);

  /* Apply initial rotation so the model starts at a discoverable angle */
  rotationGroup.rotation.y = props.initialRotationY;
  rotationGroup.rotation.x = props.initialRotationX;

  resizeObserver = new ResizeObserver(() => {
    if (resizeRafId !== null) return;
    resizeRafId = requestAnimationFrame(() => {
      resizeRafId = null;
      onResize();
    });
  });
  resizeObserver.observe(container);

  /* ── Load model ── */
  try {
    const loader = new GLTFLoader();
    loader.load(
      props.modelPath,
      (gltf) => {
        if (!isMounted) return;
        const model = gltf.scene;
        modelRoot = model;

        /* Material is left EXACTLY as authored — no transmission/colour/roughness
           changes. Lighting is purely the external directional rig in init(). */

        /* Center + normalise scale */
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        modelBaseMaxDim = maxDim || 1;
        modelBaseCenter = center.clone();
        modelBaseSize = size.clone();

        const finalScale = getFinalModelScale();
        model.scale.setScalar(finalScale);
        model.position.copy(center).multiplyScalar(-finalScale);
        fitCameraToModel(finalScale);

        tiltGroup.add(model);
        loading.value = false;
        requestRender();

        /* Entrance animation */
        model.scale.setScalar(0);
        gsap.to(model.scale, {
          x: finalScale,
          y: finalScale,
          z: finalScale,
          duration: 1.2,
          ease: "elastic.out(1, 0.6)",
          delay: 0.2,
          onUpdate: requestRender,
          onComplete: () => {
            requestRender();
            playAutoHintSway();
          },
        });
      },
      undefined,
      (err) => {
        console.error("[HeroModel3D] Failed to load model:", err);
        loading.value = false;
        loadError.value = true;
      }
    );
  } catch (err) {
    console.error("[HeroModel3D] Unexpected error:", err);
    loading.value = false;
    loadError.value = true;
  }

  requestRender();
}

function playAutoHintSway() {
  if (!props.autoHintAnimation || !rotationGroup || hasInteracted.value) return;

  const baseY = props.initialRotationY;
  const amplitude = 0.32;

  autoHintTween = gsap
    .timeline({
      onUpdate: requestRender,
      onComplete: requestRender,
    })
    .to(rotationGroup.rotation, {
      y: baseY + amplitude,
      duration: 0.9,
      ease: "sine.inOut",
    })
    .to(rotationGroup.rotation, {
      y: baseY - amplitude,
      duration: 1.4,
      ease: "sine.inOut",
    })
    .to(rotationGroup.rotation, {
      y: baseY,
      duration: 0.9,
      ease: "sine.inOut",
    });
}

function stopAutoHint() {
  if (autoHintTween) {
    autoHintTween.kill();
    autoHintTween = null;
  }
}

function markInteracted() {
  if (hasInteracted.value) return;
  hasInteracted.value = true;
  stopAutoHint();
}

function requestRender() {
  if (!isVisible || !renderer || !scene || !camera || renderRafId !== null) {
    return;
  }

  renderRafId = requestAnimationFrame(() => {
    renderRafId = null;
    if (!isVisible || !renderer || !scene || !camera) return;
    renderer.render(scene, camera);
  });
}

/* ══════════════════════════════════════════════
   MOUSE TILT
══════════════════════════════════════════════ */
function onMouseMove(e: MouseEvent) {
  pendingMouseEvent = e;
  if (mouseRafId !== null) return;

  mouseRafId = requestAnimationFrame(() => {
    mouseRafId = null;
    const event = pendingMouseEvent;
    pendingMouseEvent = null;
    if (event) applyMouseMove(event);
  });
}

function applyMouseMove(e: MouseEvent) {
  if (dragging.value || loading.value || !isVisible) return;

  const container = containerRef.value;
  if (!container) return;

  const rect = container.getBoundingClientRect();
  /* Normalise: -1 (left/top) → +1 (right/bottom) */
  const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
  const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

  if (props.interactionMode === "hover") {
    if (!rotationGroup) return;
    markInteracted();
    gsap.to(rotationGroup.rotation, {
      y: props.initialRotationY + nx * props.hoverRotationStrength,
      x: clamp(
        props.initialRotationX + ny * props.hoverRotationStrength * 0.45,
        -DRAG_TILT_LIMIT,
        DRAG_TILT_LIMIT
      ),
      duration: 0.7,
      ease: "power2.out",
      overwrite: "auto",
      onUpdate: requestRender,
      onComplete: requestRender,
    });
    return;
  }

  if (!tiltGroup) return;

  /*
    Hover from RIGHT (nx > 0) → rotateY negative  (right side goes back)
    Hover from LEFT  (nx < 0) → rotateY positive  (left side goes back)
  */
  gsap.to(tiltGroup.rotation, {
    y: nx * props.maxTiltY,
    x: ny * props.maxTiltX,
    duration: 0.6,
    ease: "power2.out",
    overwrite: "auto",
    onUpdate: requestRender,
    onComplete: requestRender,
  });
}

function onMouseLeave() {
  if (dragging.value) return;
  pendingMouseEvent = null;

  if (props.interactionMode === "hover") {
    if (!rotationGroup) return;
    /* Spring back to initial angle */
    gsap.to(rotationGroup.rotation, {
      y: props.initialRotationY,
      x: props.initialRotationX,
      duration: 1.2,
      ease: "elastic.out(1, 0.5)",
      overwrite: "auto",
      onUpdate: requestRender,
      onComplete: requestRender,
    });
    return;
  }

  if (!tiltGroup) return;
  /* Spring back to neutral */
  gsap.to(tiltGroup.rotation, {
    y: 0,
    x: 0,
    duration: 1.2,
    ease: "elastic.out(1, 0.5)",
    overwrite: "auto",
    onUpdate: requestRender,
    onComplete: requestRender,
  });
}

function onPointerDown(e: PointerEvent) {
  if (!rotationGroup || loading.value) return;

  const container = containerRef.value;
  if (!container) return;

  markInteracted();
  dragging.value = true;
  dragPointerId = e.pointerId;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  dragStartRotationX = rotationGroup.rotation.x;
  dragStartRotationY = rotationGroup.rotation.y;

  gsap.killTweensOf(rotationGroup.rotation);
  if (tiltGroup) {
    gsap.to(tiltGroup.rotation, {
      x: 0,
      y: 0,
      duration: 0.2,
      ease: "power2.out",
      onUpdate: requestRender,
      onComplete: requestRender,
    });
  }

  container.setPointerCapture?.(e.pointerId);
  if (e.pointerType === "mouse") e.preventDefault();
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value || dragPointerId !== e.pointerId || !rotationGroup) {
    return;
  }

  const dx = e.clientX - dragStartX;
  const dy = e.clientY - dragStartY;

  rotationGroup.rotation.y = dragStartRotationY + dx * DRAG_ROTATE_SPEED;
  rotationGroup.rotation.x = clamp(
    dragStartRotationX + dy * DRAG_TILT_SPEED,
    -DRAG_TILT_LIMIT,
    DRAG_TILT_LIMIT
  );

  requestRender();
  if (e.pointerType === "mouse") e.preventDefault();
}

function onPointerUp(e: PointerEvent) {
  if (dragPointerId !== null && dragPointerId !== e.pointerId) return;

  containerRef.value?.releasePointerCapture?.(e.pointerId);
  dragging.value = false;
  dragPointerId = null;
  requestRender();
}

/* ══════════════════════════════════════════════
   RESIZE
══════════════════════════════════════════════ */
function onResize() {
  if (!renderer || !camera || !containerRef.value) return;
  const w = containerRef.value.clientWidth;
  const h = containerRef.value.clientHeight;
  if (!w || !h) return;
  renderer.setPixelRatio(getRendererPixelRatio());
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  fitCameraToModel();
  requestRender();
}

watch(
  () => props.modelScale,
  () => {
    if (!modelRoot || !modelBaseCenter) return;
    gsap.killTweensOf(modelRoot.scale);
    applyModelScale();
  }
);

/* ══════════════════════════════════════════════
   LIFECYCLE
══════════════════════════════════════════════ */
onMounted(() => {
  isMounted = true;

  const container = containerRef.value;
  if (!container) {
    loading.value = false;
    return;
  }

  if ("IntersectionObserver" in window) {
    intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry?.isIntersecting ?? false;
        if (isVisible) {
          init();
          requestRender();
        }
      },
      { rootMargin: "160px 0px", threshold: 0 }
    );
    intersectionObserver.observe(container);
  } else {
    isVisible = true;
    init();
  }
});

onUnmounted(() => {
  isMounted = false;
  if (renderRafId) cancelAnimationFrame(renderRafId);
  if (mouseRafId) cancelAnimationFrame(mouseRafId);
  if (resizeRafId) cancelAnimationFrame(resizeRafId);
  resizeObserver?.disconnect();
  intersectionObserver?.disconnect();
  stopAutoHint();
  if (tiltGroup) gsap.killTweensOf(tiltGroup.rotation);
  if (rotationGroup) gsap.killTweensOf(rotationGroup.rotation);
  if (modelRoot) {
    gsap.killTweensOf(modelRoot.scale);
    disposeObject(modelRoot);
  }
  if (renderer) {
    renderer.forceContextLoss();
    renderer.dispose();
    renderer = null;
  }
  scene = null;
  camera = null;
  rotationGroup = null;
  tiltGroup = null;
  modelRoot = null;
  modelBaseMaxDim = 1;
  modelBaseCenter = null;
  modelBaseSize = null;
  renderRafId = null;
  mouseRafId = null;
  resizeRafId = null;
  dragging.value = false;
  dragPointerId = null;
});

function disposeObject(object: any) {
  object.traverse?.((child: any) => {
    if (child.geometry) child.geometry.dispose?.();

    const materials = Array.isArray(child.material)
      ? child.material
      : child.material
      ? [child.material]
      : [];

    materials.forEach((material: any) => {
      Object.values(material).forEach((value: any) => {
        if (value?.isTexture) value.dispose?.();
      });
      material.dispose?.();
    });
  });
}
</script>

<style scoped>
.hero-model-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  touch-action: pan-y;
  user-select: none;
}

.hero-model-canvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: none; /* custom cursor already active */
}

/* Loading dots */
.hero-model-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  pointer-events: none;
}

.loading-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--color-primary);
  animation: dot-pulse 1.2s ease-in-out infinite;
}
.loading-dot:nth-child(2) {
  animation-delay: 0.2s;
}
.loading-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dot-pulse {
  0%,
  80%,
  100% {
    opacity: 0.2;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* Error fallback */
.hero-model-error {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

/* Fade transition for loading overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Interaction hint badge */
.hero-model-hint {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  /* border-radius: 999px; */
  background-color: color-mix(in srgb, var(--color-bg) 70%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-text) 22%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: var(--color-text);
  font-size: 14px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  pointer-events: none;
  opacity: 0.9;
  animation: hint-pulse 2.4s ease-in-out infinite;
  white-space: nowrap;
}

.hero-model-hint.is-hover-mode {
  animation-name: hint-pulse-soft;
}

.hero-model-hint-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  animation: hint-spin 3.6s linear infinite;
}

.is-hover-mode .hero-model-hint-icon {
  animation: hint-rock 2.2s ease-in-out infinite;
}

.hero-model-hint-text {
  white-space: nowrap;
  line-height: 1;
}

@keyframes hint-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes hint-rock {
  0%,
  100% {
    transform: rotate(-22deg);
  }
  50% {
    transform: rotate(22deg);
  }
}

@keyframes hint-pulse {
  0%,
  100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}

@keyframes hint-pulse-soft {
  0%,
  100% {
    opacity: 0.75;
  }
  50% {
    opacity: 0.95;
  }
}
</style>
