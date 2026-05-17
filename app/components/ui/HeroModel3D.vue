<template>
  <div
    ref="containerRef"
    class="hero-model-wrapper"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
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
});

/* ── refs ── */
const containerRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const loading = ref(false);
const loadError = ref(false);

/* ── Three.js state ── */
let renderer: any = null;
let scene: any = null;
let camera: any = null;
let tiltGroup: any = null; // mouse-driven tilt
let modelRoot: any = null;
let renderRafId: number | null = null;
let mouseRafId: number | null = null;
let resizeRafId: number | null = null;
let pendingMouseEvent: MouseEvent | null = null;
let resizeObserver: ResizeObserver | null = null;
let intersectionObserver: IntersectionObserver | null = null;
let isMounted = false;
let isVisible = false;
let initStarted = false;

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
  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isMobile,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(w, h, false);
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 2)
  );
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  /* ── Scene ── */
  scene = new THREE.Scene();

  /* ── Camera ── */
  camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 200);
  camera.position.z = 4;

  /* ── Lights ── */
  const lightColor = props.modelModeColor || "#ffffff";
  const ambient = new THREE.AmbientLight(lightColor, 1.0);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(lightColor, 2.5);
  key.position.set(4, 6, 5);
  scene.add(key);

  /*
    Mobile keeps only ambient + key light. Each additional directional light
    forces another lighting calc per fragment — on mobile GPUs that's a
    measurable drop in frame time, and the visual difference inside a tiny
    canvas is negligible.
  */
  if (!isMobile) {
    const fill = new THREE.DirectionalLight("#54ea62", 1);
    fill.position.set(-5, 2, -3);
    scene.add(fill);

    const rim = new THREE.DirectionalLight("#54ea62", 0.8);
    rim.position.set(0, -4, -6);
    scene.add(rim);
  }

  /* ── Tilt group — mouse-driven only ── */
  tiltGroup = new THREE.Group();
  scene.add(tiltGroup);

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

        /* Center + normalise scale */
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        const finalScale = props.modelScale / maxDim;
        model.scale.setScalar(finalScale);
        model.position.sub(center).multiplyScalar(finalScale);

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
          onComplete: requestRender,
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
  if (!tiltGroup || loading.value || !isVisible) return;

  const container = containerRef.value;
  if (!container) return;

  const rect = container.getBoundingClientRect();
  /* Normalise: -1 (left/top) → +1 (right/bottom) */
  const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
  const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

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
  if (!tiltGroup) return;
  pendingMouseEvent = null;

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

/* ══════════════════════════════════════════════
   RESIZE
══════════════════════════════════════════════ */
function onResize() {
  if (!renderer || !camera || !containerRef.value) return;
  const w = containerRef.value.clientWidth;
  const h = containerRef.value.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  requestRender();
}

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
  if (tiltGroup) gsap.killTweensOf(tiltGroup.rotation);
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
  tiltGroup = null;
  modelRoot = null;
  renderRafId = null;
  mouseRafId = null;
  resizeRafId = null;
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
</style>
