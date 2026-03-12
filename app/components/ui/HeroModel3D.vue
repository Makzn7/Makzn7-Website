<!-- HeroModel3D — renders GLTF with a hover-tilt effect
     Model is static when not hovered.
     Hover right → right side comes forward, left leans back  (rotateY positive)
     Hover left  → left side comes forward, right leans back  (rotateY negative)
-->
<template>
  <div
    ref="containerRef"
    class="hero-model-wrapper"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <canvas ref="canvasRef" class="hero-model-canvas" />

    <!-- Loading indicator -->
    <Transition name="fade">
      <div v-if="loading" class="hero-model-loading">
        <span class="loading-dot" />
        <span class="loading-dot" />
        <span class="loading-dot" />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";

const props = defineProps({
  /** Path served from /public */
  modelPath: { type: String, default: "/images/3d/Eng" },
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
const containerRef = ref(null);
const canvasRef = ref(null);
const loading = ref(true);

/* ── Three.js state ── */
let renderer = null;
let scene = null;
let camera = null;
let tiltGroup = null; // mouse-driven tilt
let rafId = null;

/* ══════════════════════════════════════════════
   INIT
══════════════════════════════════════════════ */
async function init() {
  const canvas = canvasRef.value;
  const container = containerRef.value;
  if (!canvas || !container) return;

  /* Dynamically import Three.js (avoids SSR issues) */
  const THREE = await import("three");
  const { GLTFLoader } = await import(
    "three/examples/jsm/loaders/GLTFLoader.js"
  );

  const w = container.offsetWidth;
  const h = container.offsetHeight;

  /* ── Renderer ── */
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  /* ── Scene ── */
  scene = new THREE.Scene();

  /* ── Camera ── */
  camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 200);
  camera.position.z = 4;

  /* ── Lights ── */
  const ambient = new THREE.AmbientLight(props.modelModeColor, 1.0);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(props.modelModeColor, 2.5);
  key.position.set(4, 6, 5);
  scene.add(key);

  const fill = new THREE.DirectionalLight("#54ea62", 1);
  fill.position.set(-5, 2, -3);
  scene.add(fill);

  const rim = new THREE.DirectionalLight("#54ea62", 0.8);
  rim.position.set(0, -4, -6);
  scene.add(rim);

  /* ── Tilt group — mouse-driven only ── */
  tiltGroup = new THREE.Group();
  scene.add(tiltGroup);

  /* ── Load model ── */
  try {
    const loader = new GLTFLoader();
    loader.load(
      props.modelPath,
      (gltf) => {
        const model = gltf.scene;

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

        /* Entrance animation */
        model.scale.setScalar(0);
        gsap.to(model.scale, {
          x: finalScale,
          y: finalScale,
          z: finalScale,
          duration: 1.2,
          ease: "elastic.out(1, 0.6)",
          delay: 0.2,
        });
      },
      undefined,
      (err) => {
        console.error("[HeroModel3D] Failed to load model:", err);
        loading.value = false;
      }
    );
  } catch (err) {
    console.error("[HeroModel3D] Unexpected error:", err);
    loading.value = false;
  }

  /* ── Render loop ── */
  function animate() {
    rafId = requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
}

/* ══════════════════════════════════════════════
   MOUSE TILT
══════════════════════════════════════════════ */
function onMouseMove(e) {
  if (!tiltGroup || loading.value) return;

  const rect = containerRef.value.getBoundingClientRect();
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
  });
}

function onMouseLeave() {
  if (!tiltGroup) return;

  /* Spring back to neutral */
  gsap.to(tiltGroup.rotation, {
    y: 0,
    x: 0,
    duration: 1.2,
    ease: "elastic.out(1, 0.5)",
    overwrite: "auto",
  });
}

/* ══════════════════════════════════════════════
   RESIZE
══════════════════════════════════════════════ */
function onResize() {
  if (!renderer || !camera || !containerRef.value) return;
  const w = containerRef.value.offsetWidth;
  const h = containerRef.value.offsetHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

/* ══════════════════════════════════════════════
   LIFECYCLE
══════════════════════════════════════════════ */
onMounted(() => {
  init();
  window.addEventListener("resize", onResize);
});

onUnmounted(() => {
  cancelAnimationFrame(rafId);
  renderer?.dispose();
  window.removeEventListener("resize", onResize);
});
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
